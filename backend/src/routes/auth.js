import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import { saveUserToFirebase } from '../services/firebaseDataService.js';

const router = express.Router();

// Verify token endpoint
router.post('/verify', verifyToken, asyncHandler(async (req, res) => {
  // Save/update user in Firebase on each verification
  try {
    await saveUserToFirebase(req.user);
  } catch (error) {
    console.warn('⚠️  Could not save user to Firebase:', error.message);
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
router.put('/notification-preferences', verifyToken, asyncHandler(async (req, res) => {
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

export default router;
