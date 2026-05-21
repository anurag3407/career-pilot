import express from 'express';
import User from '../models/User.model.js';
import { verifyToken } from '../middleware/auth.js'; // FIX : added auth import

const router = express.Router();

// Whitelisted onboarding step IDs — only these are allowed in the DB
// FIX: added whitelist for input validation
const SUPPORTED_ONBOARDING_IDS = [
  'resume_uploaded',
  'resume_enhanced',
  'github_connected',
  'portfolio_created',
  'portfolio_deployed',
  'job_alerts_setup',
];

// FIX : sanitize completedItems — only whitelisted keys, boolean values only
function sanitizeCompletedItems(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const sanitized = {};
  for (const key of SUPPORTED_ONBOARDING_IDS) {
    if (key in raw) {
      sanitized[key] = Boolean(raw[key]);
    }
  }
  return sanitized;
}

// Get user's onboarding progress (using Firebase UID)
router.get('/api/users/onboarding/:firebaseUid', verifyToken, async (req, res) => { // FIX : added verifyToken
  try {
    const { firebaseUid } = req.params;

    // FIX: ownership check — user can only access their own data
    if (req.user.uid !== firebaseUid) {
      return res.status(403).json({ error: 'Forbidden: access denied' });
    }

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
router.post('/api/users/onboarding/:firebaseUid', verifyToken, async (req, res) => { // FIX : added verifyToken
  try {
    const { firebaseUid } = req.params;

    // FIX : ownership check
    if (req.user.uid !== firebaseUid) {
      return res.status(403).json({ error: 'Forbidden: access denied' });
    }

    // FIX : validate and sanitize input before saving to DB
    const sanitized = sanitizeCompletedItems(req.body.completedItems);
    if (!sanitized) {
      return res.status(400).json({ error: 'Invalid completedItems payload' });
    }
    
    // FIX : removed upsert: true to prevent creating partial user documents
    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { onboardingProgress: sanitized },
      { new: true }
    );

    // FIX: handle user not found instead of silently creating broken document
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, data: user.onboardingProgress });
  } catch (error) {
    console.error('Error saving onboarding progress:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dismiss checklist (don't show again)
router.post('/api/users/onboarding/:firebaseUid/dismiss', verifyToken, async (req, res) => { // FIX : added verifyToken
  try {
    const { firebaseUid } = req.params;

    // FIX : ownership check
    if (req.user.uid !== firebaseUid) {
      return res.status(403).json({ error: 'Forbidden: access denied' });
    }
    
    // FIX : removed upsert: true
    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { checklistDismissed: true },
      { new: true }
    );

    // FIX : handle user not found
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, message: 'Checklist dismissed' });
  } catch (error) {
    console.error('Error dismissing checklist:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if user is new (account less than 7 days old)
router.get('/api/users/onboarding/:firebaseUid/status', verifyToken, async (req, res) => { // FIX : added verifyToken
  try {
    const { firebaseUid } = req.params;

    // FIX : ownership check
    if (req.user.uid !== firebaseUid) {
      return res.status(403).json({ error: 'Forbidden: access denied' });
    }

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