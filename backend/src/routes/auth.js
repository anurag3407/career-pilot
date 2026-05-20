import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import { loginProtection } from '../middleware/loginProtection.js';
import { saveUserToFirebase } from '../services/firebaseDataService.js';

import { registerSchema } from '../validators/authValidator.js';
import { exchangeCodeForToken, getLinkedInAuthUrl, getLinkedInProfile } from '../services/linkedinService.js';
import User from '../models/User.model.js';
import admin from '../config/firebase.js';
import crypto from 'crypto';

import { updateNotificationPrefsSchema } from '../schemas/auth.schema.js';

const router = express.Router();

// Holds CSRF-protection state params for the LinkedIn OAuth initiation flow (10-min TTL)
const stateStore = new Map();

// Holds single-use Firebase custom tokens keyed by a short-lived exchange code (60-sec TTL).
// Tokens are never placed in redirect URLs — the frontend fetches them via GET /linkedin/token.
const linkedInTokenStore = new Map();

// Sweep expired stateStore entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [state, expiry] of stateStore.entries()) {
    if (now > expiry) {
      stateStore.delete(state);
    }
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
  const User = (await import('../models/User.model.js')).default;
  let user = await User.findOne({ email: req.user.email });

  const preferences = user?.notificationPreferences || {
    jobAlerts: true,
    directMessages: true,
    proposalUpdates: true,
  };

  res.json({ success: true, preferences });
}));

// Update notification preferences
router.put('/notification-preferences', verifyToken, validate(updateNotificationPrefsSchema), asyncHandler(async (req, res) => {
  const User = (await import('../models/User.model.js')).default;
  const { jobAlerts, directMessages, proposalUpdates } = req.body;

  if (typeof jobAlerts !== 'boolean' || typeof directMessages !== 'boolean' || typeof proposalUpdates !== 'boolean') {
    return res.status(400).json({ success: false, error: 'Invalid preference values' });
  }

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

  const storedEnpiry = stateStore.get(state);
  if (!storedEnpiry || Date.now() > storedEnpiry) {
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
      firebaseUid = firebaseUser.uid
    } catch {
      const newFirebaseUser = await admin.auth().createUser({
        email,
        displayName: name,
        photoURL: picture
      })

      firebaseUid = newFirebaseUser.uid;
    }
  } else {
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUserByEmail(email);
    } catch {
      firebaseUser = await admin.auth().createUser({ email, displayName: name, photoURL: picture })
    }
    firebaseUid = firebaseUser.uid;

    await admin.auth().setCustomUserClaims(firebaseUid, {
      linkedinId,
      pendingOnboarding: true,
    })
  }

  const customToken = await admin.auth().createCustomToken(firebaseUid, {
    linkedinId
  });

  const exchangeCode = crypto.randomBytes(24).toString('hex');
  linkedInTokenStore.set(exchangeCode, {
    token: customToken,
    isNew: !mongoUser,
    expiresAt: Date.now() + 60 * 1000,
  });

  res.redirect(`${frontendUrl}/auth/linkedin/callback?code=${exchangeCode}`);
}));

// One-time token exchange endpoint — the frontend calls this immediately after the OAuth
// redirect to retrieve the Firebase custom token without it appearing in a URL,
// server access log, browser history, or Referer header.
// No verifyToken here — the user is mid-authentication and has no Firebase token yet.
// The exchange code (192-bit entropy, 60-sec TTL, single-use) is the security boundary.
router.get('/linkedin/token', asyncHandler(async (req, res) => {
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

  res.json({ success: true, token: entry.token, isNew: entry.isNew });
}));

export default router;
