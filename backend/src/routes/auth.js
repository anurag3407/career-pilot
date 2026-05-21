import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import { loginProtection } from '../middleware/loginProtection.js';
import { saveUserToFirebase } from '../services/firebaseDataService.js';
import { validate } from '../middleware/validate.js';
import { updateNotificationPrefsSchema } from '../schemas/auth.schema.js';

import { registerSchema } from '../validators/authValidator.js';
import { exchangeCodeForToken, getLinkedInAuthUrl, getLinkedInProfile } from '../services/linkedinService.js';
import User from '../models/User.model.js';
import admin from '../config/firebase.js';
import crypto from 'crypto';

import { updateNotificationPrefsSchema } from '../schemas/auth.schema.js';

const router = express.Router();
const stateStore = new Map();

// Periodic sweep of expired stateStore entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [state, expiry] of stateStore.entries()) {
    if (now > expiry) {
      stateStore.delete(state);
    }
  }
}, 10 * 60 * 1000).unref();


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

  res.redirect(`${frontendUrl}/auth/linkedin/callback?token=${customToken}&isNew=${!mongoUser}`);
}));

export default router;
