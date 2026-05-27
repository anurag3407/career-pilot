import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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

import {
  exchangeCodeForToken,
  getLinkedInAuthUrl,
  getLinkedInProfile
} from '../services/linkedinService.js';

import User from '../models/User.model.js';
import admin from '../config/firebase.js';

const router = express.Router();

// Stores
const stateStore = new Map();
const tokenStore = new Map();
const linkedInTokenStore = new Map();
const passwordResetStore = new Map();

/**
 * REGISTER
 */
router.post(
  '/register',
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      username: name,
      password: passwordHash
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.username
      }
    });
  })
);

/**
 * LOGIN
 */
router.post(
  '/login',
  loginProtection,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    const rejectWithUniform = () => {
      throw new ApiError(401, 'Invalid email or password');
    };

    if (!user || !user.password) {
      rejectWithUniform();
    }

    if (user.requiresPasswordReset) {
      return res.status(403).json({
        success: false,
        error: 'Password reset required',
        requiresPasswordReset: true,
      });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      rejectWithUniform();
    }

    let firebaseUid;

    try {
      const firebaseUser = await admin.auth().getUserByEmail(email);
      firebaseUid = firebaseUser.uid;
    } catch (firebaseErr) {
      if (firebaseErr?.code !== 'auth/user-not-found') {
        throw new ApiError(500, 'Authentication service error');
      }

      const newFirebaseUser = await admin.auth().createUser({
        email,
        displayName: user.username
      });

      firebaseUid = newFirebaseUser.uid;
    }

    const customToken = await admin.auth().createCustomToken(firebaseUid);

    res.json({
      success: true,
      message: 'Login successful',
      token: customToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.username
      }
    });
  })
);

/**
 * FORGOT PASSWORD
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');

      passwordResetStore.set(resetToken, {
        userId: user._id.toString(),
        expiresAt: Date.now() + 60 * 60 * 1000,
      });

      const frontendUrl =
        process.env.FRONTEND_URL || 'http://localhost:5173';

      const resetLink =
        `${frontendUrl}/reset-password?token=${resetToken}`;

      sendPasswordResetEmail({
        email,
        resetLink
      }).catch((err) =>
        console.error(
          'Failed to send password reset email:',
          err.message
        )
      );
    }

    res.json({
      success: true,
      message:
        'If an account exists, a reset link has been sent.',
    });
  })
);

/**
 * RESET PASSWORD
 */
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    const entry = passwordResetStore.get(token);

    if (!entry || Date.now() > entry.expiresAt) {
      passwordResetStore.delete(token);

      throw new ApiError(
        400,
        'Reset token invalid or expired'
      );
    }

    passwordResetStore.delete(token);

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await User.updateOne(
      { _id: entry.userId },
      {
        $set: {
          password: passwordHash,
          requiresPasswordReset: false
        }
      }
    );

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  })
);

/**
 * VERIFY TOKEN
 */
router.post(
  '/verify',
  loginProtection,
  verifyToken,
  asyncHandler(async (req, res) => {
    try {
      await saveUserToFirebase(req.user);
    } catch (error) {
      console.warn(
        'Could not save user to Firebase:',
        error.message
      );
    }

    res.json({
      success: true,
      user: req.user
    });
  })
);

/**
 * PROFILE
 */
router.get(
  '/profile',
  verifyToken,
  asyncHandler(async (req, res) => {
    try {
      await saveUserToFirebase(req.user);
    } catch (error) {
      console.warn(
        'Could not update user in Firebase:',
        error.message
      );
    }

    res.json({
      success: true,
      user: req.user
    });
  })
);

/**
 * NOTIFICATION PREFERENCES
 */
router.get(
  '/notification-preferences',
  verifyToken,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({
      email: req.user.email
    });

    const preferences =
      user?.notificationPreferences || {
        jobAlerts: true,
        directMessages: true,
        proposalUpdates: true,
      };

    res.json({
      success: true,
      preferences
    });
  })
);

router.put(
  '/notification-preferences',
  verifyToken,
  validate(updateNotificationPrefsSchema),
  asyncHandler(async (req, res) => {
    const {
      jobAlerts,
      directMessages,
      proposalUpdates
    } = req.body;

    await User.findOneAndUpdate(
      { email: req.user.email },
      {
        notificationPreferences: {
          jobAlerts,
          directMessages,
          proposalUpdates
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated!'
    });
  })
);

/**
 * LINKEDIN LOGIN
 */
router.get('/linkedin', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');

  stateStore.set(
    state,
    Date.now() + 10 * 60 * 1000
  );

  const authUrl = getLinkedInAuthUrl(state);

  res.redirect(authUrl);
});

/**
 * LINKEDIN CALLBACK
 */
router.get(
  '/linkedin/callback',
  asyncHandler(async (req, res) => {
    const { code, state, error } = req.query;

    const frontendUrl =
      process.env.FRONTEND_URL ||
      'http://localhost:5173';

    if (error) {
      return res.redirect(
        `${frontendUrl}/login?error=linkedin_denied`
      );
    }

    const storedExpiry = stateStore.get(state);

    if (!storedExpiry || Date.now() > storedExpiry) {
      stateStore.delete(state);

      return res.redirect(
        `${frontendUrl}/login?error=linkedin_invalid_state`
      );
    }

    stateStore.delete(state);

    let accessToken;
    let idToken;

    try {
      ({ accessToken, idToken } =
        await exchangeCodeForToken(code));
    } catch (err) {
      return res.redirect(
        `${frontendUrl}/login?error=linkedin_token_failed`
      );
    }

    let profile;

    try {
      profile = await getLinkedInProfile(
        accessToken,
        idToken
      );
    } catch (err) {
      return res.redirect(
        `${frontendUrl}/login?error=linkedin_profile_failed`
      );
    }

    const {
      linkedinId,
      email,
      name,
      picture
    } = profile;

    let mongoUser =
      await User.findOne({ email });

    let firebaseUid;

    try {
      const firebaseUser =
        await admin.auth().getUserByEmail(email);

      firebaseUid = firebaseUser.uid;
    } catch (firebaseErr) {
      if (
        firebaseErr?.code !==
        'auth/user-not-found'
      ) {
        return res.redirect(
          `${frontendUrl}/login?error=linkedin_auth_failed`
        );
      }

      const firebaseUser =
        await admin.auth().createUser({
          email,
          displayName: name,
          photoURL: picture
        });

      firebaseUid = firebaseUser.uid;
    }

    if (!mongoUser) {
      await admin.auth().setCustomUserClaims(
        firebaseUid,
        {
          linkedinId,
          pendingOnboarding: true
        }
      );
    }

    const customToken =
      await admin.auth().createCustomToken(
        firebaseUid,
        { linkedinId }
      );

    const exchangeCode =
      crypto.randomBytes(24).toString('hex');

    linkedInTokenStore.set(exchangeCode, {
      token: customToken,
      isNew: !mongoUser,
      expiresAt: Date.now() + 60 * 1000,
    });

    res.redirect(
      `${frontendUrl}/auth/linkedin/callback?code=${exchangeCode}`
    );
  })
);

/**
 * LINKEDIN TOKEN EXCHANGE
 */
router.get(
  '/linkedin/token',
  asyncHandler(async (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');

    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Exchange code required'
      });
    }

    const entry =
      linkedInTokenStore.get(code);

    if (
      !entry ||
      Date.now() > entry.expiresAt
    ) {
      linkedInTokenStore.delete(code);

      return res.status(400).json({
        success: false,
        error: 'Invalid or expired code'
      });
    }

    linkedInTokenStore.delete(code);

    res.json({
      success: true,
      token: entry.token,
      isNew: entry.isNew
    });
  })
);

/**
 * CLEANUP
 */
setInterval(() => {
  const now = Date.now();

  for (const [state, expiry] of stateStore.entries()) {
    if (now > expiry) {
      stateStore.delete(state);
    }
  }

  for (const [code, entry] of tokenStore.entries()) {
    if (now > entry.expiresAt) {
      tokenStore.delete(code);
    }
  }

  for (const [code, entry] of linkedInTokenStore.entries()) {
    if (now > entry.expiresAt) {
      linkedInTokenStore.delete(code);
    }
  }

  for (const [token, entry] of passwordResetStore.entries()) {
    if (now > entry.expiresAt) {
      passwordResetStore.delete(token);
    }
  }
}, 10 * 60 * 1000).unref();

export default router;