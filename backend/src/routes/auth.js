import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import { loginProtection } from '../middleware/loginProtection.js';
import { saveUserToFirebase } from '../services/firebaseDataService.js';

const router = express.Router();

// Verify token endpoint — loginProtection tracks failed attempts per IP
// and locks out after 5 consecutive failures for 15 minutes.
router.post('/verify', loginProtection, verifyToken, asyncHandler(async (req, res) => {
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

export default router;
