import express from 'express';
import bcrypt from 'bcryptjs';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import { loginProtection } from '../middleware/loginProtection.js';
import { saveUserToFirebase } from '../services/firebaseDataService.js';
import { validate } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateNotificationPrefsSchema,
} from '../schemas/auth.schema.js';
import { sendPasswordResetEmail } from '../services/mailService.js';
import { exchangeCodeForToken, getLinkedInAuthUrl, getLinkedInProfile } from '../services/linkedinService.js';
import User from '../models/User.model.js';
import admin from '../config/firebase.js';
import crypto from 'crypto';

const router = express.Router();

// Holds CSRF-protection state params for the LinkedIn OAuth initiation flow (10-min TTL)
const stateStore = new Map();
const tokenStore = new Map();       // one-time LinkedIn token exchange store
const passwordResetStore = new Map(); // one-time password reset token store (1h TTL)

router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }

  // Explicitly hash here even though the pre-save hook also guards this path,
  // so password is never accidentally persisted as plaintext if the hook is bypassed
  // (e.g. via Model.updateOne or direct driver access in future code paths).
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({ email, username: name, password: passwordHash });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: { id: user._id, email: user.email, name: user.username },
  });
}));

// Uniform error message on both "wrong email" and "wrong password" paths
// prevents user enumeration via differing error strings or timing.
router.post('/login', loginProtection, validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  const rejectWithUniform = () => {
    throw new ApiError(401, 'Invalid email or password');
  };

  if (!user || !user.password) rejectWithUniform();

  // Check the reset flag BEFORE calling bcrypt.compare. Accounts flagged by the
  // migration script may still have a plaintext value stored; passing that to
  // bcrypt.compare throws "Invalid salt" (a 500) instead of the expected 403.
  if (user.requiresPasswordReset) {
    return res.status(403).json({
      success: false,
      error: 'A password reset is required before you can log in. Use the forgot-password flow to set a new password.',
      requiresPasswordReset: true,
    });
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) rejectWithUniform();

  // Only catch the specific "user not found" code — any other Firebase error
  // (network, permissions, quota) should surface as a 500 so it is visible.
  let firebaseUid;
  try {
    const firebaseUser = await admin.auth().getUserByEmail(email);
    firebaseUid = firebaseUser.uid;
  } catch (firebaseErr) {
    if (firebaseErr?.code !== 'auth/user-not-found') {
      throw new ApiError(500, 'Authentication service error. Please try again.');
    }
    const newFirebaseUser = await admin.auth().createUser({ email, displayName: user.username });
    firebaseUid = newFirebaseUser.uid;
  }

  const customToken = await admin.auth().createCustomToken(firebaseUid);

  res.json({
    success: true,
    message: 'Login successful',
    token: customToken,
    user: { id: user._id, email: user.email, name: user.username },
  });
}));

// Always returns 200 regardless of whether the email exists, to prevent enumeration.
router.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    passwordResetStore.set(resetToken, {
      userId: user._id.toString(),
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    sendPasswordResetEmail({ email, resetLink }).catch((err) =>
      console.error('Failed to send password reset email:', err.message)
    );
  }

  res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  });
}));

router.post('/reset-password', validate(resetPasswordSchema), asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const entry = passwordResetStore.get(token);
  if (!entry || Date.now() > entry.expiresAt) {
    passwordResetStore.delete(token);
    throw new ApiError(400, 'Reset token is invalid or has expired. Please request a new one.');
  }

  passwordResetStore.delete(token);

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await User.updateOne(
    { _id: entry.userId },
    { $set: { password: passwordHash, requiresPasswordReset: false } }
  );

  res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
}));

// Periodic sweep of expired store entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [state, expiry] of stateStore.entries()) {
    if (now > expiry) stateStore.delete(state);
  }
  for (const [code, entry] of tokenStore.entries()) {
    if (now > entry.expiresAt) tokenStore.delete(code);
  }
  for (const [token, entry] of passwordResetStore.entries()) {
    if (now > entry.expiresAt) passwordResetStore.delete(token);
  }
}, 10 * 60 * 1000).unref();

// Sweep expired linkedInTokenStore entries every 60 seconds
setInterval(() => {
  const now = Date.now();
  for (const [code, { expiresAt }] of linkedInTokenStore.entries()) {
    if (now > expiresAt) {
      linkedInTokenStore.delete(code);
    }
  }
}, 60 * 1000).unref();


// Verify token endpoint — loginProtection tracks failed attempts per IP
// and locks out after 5 consecutive failures for 15 minutes.
router.post('/verify', loginProtection, verifyToken, asyncHandler(async (req, res) => {
  // Save/update user in Firebase on each verification
  try {
    await saveUserToFirebase(req.user);
  } catch (error) {
    console.warn('Could not save user to Firebase:', error.message);
  }

  res.json({
    success: true,
    user: req.user
  });
}));

// Get user profile
router.get('/profile', verifyToken, asyncHandler(async (req, res) => {
  // Update last login in Firebase
  try {
    await saveUserToFirebase(req.user);
  } catch (error) {
    console.warn('⚠️  Could not update user in Firebase:', error.message);
  }

  res.json({
    success: true,
    user: req.user
  });
}));

// Get notification preferences
router.get('/notification-preferences', verifyToken, asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  const preferences = user?.notificationPreferences || {
    jobAlerts: true,
    directMessages: true,
    proposalUpdates: true,
  };

  res.json({ success: true, preferences });
}));

// Update notification preferences
router.put('/notification-preferences', verifyToken, validate(updateNotificationPrefsSchema), asyncHandler(async (req, res) => {
  const { jobAlerts, directMessages, proposalUpdates } = req.body;

  await User.findOneAndUpdate(
    { email: req.user.email },
    { notificationPreferences: { jobAlerts, directMessages, proposalUpdates } },
    { new: true }
  );

  res.json({ success: true, message: 'Preferences updated!' });
}));

// Linkedin OAuth routes
router.get('/linkedin', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  stateStore.set(state, Date.now() + 10 * 60 * 1000);

  const authUrl = getLinkedInAuthUrl(state);
  res.redirect(authUrl);
});

router.get('/linkedin/callback', asyncHandler(async (req, res) => {
  const { code, state, error } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (error) {
    console.error('LinkedIn Oauth error: ', error);
    return res.redirect(`${frontendUrl}/login?error=linkedin_denied`);
  }

  const storedExpiry = stateStore.get(state);
  if (!storedExpiry || Date.now() > storedExpiry) {
    stateStore.delete(state);
    return res.redirect(`${frontendUrl}/login?error=linkedin_invalid_state`);
  }

  stateStore.delete(state);

  let accessToken, idToken;

  try {
    ({ accessToken, idToken } = await exchangeCodeForToken(code));
  } catch (err) {
    console.error('LinkedIn token exchange failed:', err.response?.data || err.message);
    return res.redirect(`${frontendUrl}/login?error=linkedin_token_failed`);
  }

  let profile;
  try {
    profile = await getLinkedInProfile(accessToken, idToken);
  } catch (err) {
    console.error('LinkedIn profile fetch failed:', err.response?.data || err.message);
    return res.redirect(`${frontendUrl}/login?error=linkedin_profile_failed`);
  }

  const { linkedinId, email, name, picture } = profile;

  let mongoUser = await User.findOne({ email });

  let firebaseUid;

  if (mongoUser) {
    if (!mongoUser.linkedinId) {
      mongoUser.linkedinId = linkedinId;
      await mongoUser.save();
    }

    try {
      const firebaseUser = await admin.auth().getUserByEmail(email);
      firebaseUid = firebaseUser.uid;
    } catch (firebaseErr) {
      if (firebaseErr?.code !== 'auth/user-not-found') {
        return res.redirect(`${frontendUrl}/login?error=linkedin_auth_failed`);
      }
      const newFirebaseUser = await admin.auth().createUser({ email, displayName: name, photoURL: picture });
      firebaseUid = newFirebaseUser.uid;
    }
  } else {
    try {
      const firebaseUser = await admin.auth().getUserByEmail(email);
      firebaseUid = firebaseUser.uid;
    } catch (firebaseErr) {
      if (firebaseErr?.code !== 'auth/user-not-found') {
        return res.redirect(`${frontendUrl}/login?error=linkedin_auth_failed`);
      }
      const firebaseUser = await admin.auth().createUser({ email, displayName: name, photoURL: picture });
      firebaseUid = firebaseUser.uid;
    }

    await admin.auth().setCustomUserClaims(firebaseUid, { linkedinId, pendingOnboarding: true });
  }

  const customToken = await admin.auth().createCustomToken(firebaseUid, { linkedinId });

  const exchangeCode = crypto.randomBytes(24).toString('hex');
  linkedInTokenStore.set(exchangeCode, {
    token: customToken,
    isNew: !mongoUser,
    expiresAt: Date.now() + 60 * 1000,
  });
  // Store token in one-time exchange store (60s TTL) instead of passing in URL
  const exchangeCode = crypto.randomBytes(16).toString('hex');
  tokenStore.set(exchangeCode, { token: customToken, isNew: !mongoUser, expiresAt: Date.now() + 60000 });

  res.redirect(`${frontendUrl}/auth/linkedin/callback?code=${exchangeCode}`);
}));

// One-time token exchange endpoint — the frontend calls this immediately after the OAuth
// redirect to retrieve the Firebase custom token without it appearing in a URL,
// server access log, browser history, or Referer header.
// No verifyToken here — the user is mid-authentication and has no Firebase token yet.
// The exchange code (192-bit entropy, 60-sec TTL, single-use) is the security boundary.
router.get('/linkedin/token', asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Pragma', 'no-cache');

  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, error: 'Exchange code is required' });
  }

  const entry = linkedInTokenStore.get(code);

  if (!entry || Date.now() > entry.expiresAt) {
    linkedInTokenStore.delete(code);
    return res.status(400).json({ success: false, error: 'Invalid or expired exchange code' });
  }

  linkedInTokenStore.delete(code);

// One-time token exchange endpoint — frontend calls this after LinkedIn OAuth redirect
// instead of receiving the Firebase custom token in the URL.
router.get('/linkedin/token/:code', asyncHandler(async (req, res) => {
  const { code } = req.params;
  const entry = tokenStore.get(code);
  if (!entry || Date.now() > entry.expiresAt) {
    tokenStore.delete(code);
    return res.status(404).json({ success: false, error: 'Code not found or expired' });
  }
  tokenStore.delete(code);
  res.json({ success: true, token: entry.token, isNew: entry.isNew });
}));

export default router;
