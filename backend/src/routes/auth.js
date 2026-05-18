import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import { saveUserToFirebase } from '../services/firebaseDataService.js';
import { validate } from '../middleware/validate.js';
import { registerSchema } from '../validators/authValidator.js';

const router = express.Router();

// Example register endpoint with validation
router.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  res.status(201).json({
    success: true,
    message: 'User registered successfully'
  });
}));

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

export default router;
