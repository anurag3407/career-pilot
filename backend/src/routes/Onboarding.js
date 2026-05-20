import express from 'express';
import User from '../models/User.model.js';

const router = express.Router();

// Get user's onboarding progress (using Firebase UID)
router.get('/api/users/onboarding/:firebaseUid', async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Convert Map to plain object for JSON response
    const completedItems = {};
    if (user.onboardingProgress) {
      for (const [key, value] of user.onboardingProgress) {
        completedItems[key] = value;
      }
    }
    
    res.json({
      completedItems,
      checklistDismissed: user.checklistDismissed || false
    });
  } catch (error) {
    console.error('Error fetching onboarding progress:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user's onboarding progress
router.post('/api/users/onboarding/:firebaseUid', async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { completedItems } = req.body;
    
    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { onboardingProgress: completedItems },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, data: user.onboardingProgress });
  } catch (error) {
    console.error('Error saving onboarding progress:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dismiss checklist (don't show again)
router.post('/api/users/onboarding/:firebaseUid/dismiss', async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    
    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { checklistDismissed: true },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, message: 'Checklist dismissed' });
  } catch (error) {
    console.error('Error dismissing checklist:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if user is new (account less than 7 days old)
router.get('/api/users/onboarding/:firebaseUid/status', async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const accountAge = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    
    // Count completed items
    const progressMap = user.onboardingProgress || new Map();
    let completedCount = 0;
    for (const value of progressMap.values()) {
      if (value === true) completedCount++;
    }
    
    res.json({
      isNewUser: accountAge < 7,
      accountAge: Math.floor(accountAge),
      completedCount,
      totalItems: 6
    });
  } catch (error) {
    console.error('Error checking user status:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;