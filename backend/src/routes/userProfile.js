import express from 'express';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import UserProfile from '../models/UserProfile.model.js';
import Resume from '../models/Resume.model.js';
import Interview from '../models/Interview.model.js';
import { db } from '../config/firebase.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../schemas/userProfile.schema.js';

const router = express.Router();

router.use(verifyToken);

const getPostsForUser = async (uid) => {
  const snapshot = await db.collection('posts')
    .where('author.uid', '==', uid)
    .limit(50)
    .get();

  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(p => !p.isDeleted && (!p.status || p.status === 'published'))
    .sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
      return bTime - aTime;
    })
    .slice(0, 10)
    .map(p => ({
      id: p.id,
      type: 'post',
      title: p.title || '',
      content: p.content || '',
      category: p.category || '',
      likeCount: (p.likes || []).length,
      commentCount: p.commentCount || 0,
      createdAt: p.createdAt?.toDate?.() || p.createdAt || null,
    }));
};

// Get or create own profile
router.get('/me', asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  let profile = await UserProfile.findOne({ uid });
  if (!profile) {
    profile = await UserProfile.create({
      uid,
      displayName: req.user.name || req.user.email?.split('@')[0] || '',
    });
    profile = profile.toObject();
  }
  res.json({ success: true, profile });
}));

// Update own profile
router.put('/me', validate(updateProfileSchema), asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { displayName, bio, jobRole, skills, location, website, github, linkedin } = req.body;

  const update = {};
  if (displayName !== undefined) update.displayName = String(displayName).slice(0, 100);
  if (bio !== undefined) update.bio = String(bio).slice(0, 500);
  if (jobRole !== undefined) update.jobRole = String(jobRole).slice(0, 100);
  if (skills !== undefined) {
    update.skills = Array.isArray(skills)
      ? skills.slice(0, 20).map(s => String(s).trim()).filter(Boolean)
      : [];
  }
  if (location !== undefined) update.location = String(location).slice(0, 100);
  if (website !== undefined) update.website = String(website).slice(0, 200);
  if (github !== undefined) update.github = String(github).slice(0, 100);
  if (linkedin !== undefined) update.linkedin = String(linkedin).slice(0, 200);

  const profile = await UserProfile.findOneAndUpdate(
    { uid },
    { $set: update },
    { new: true, upsert: true }
  );
  res.json({ success: true, profile });
}));

// Get own stats
router.get('/me/stats', asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const [resumesCreated, interviewsDone] = await Promise.all([
    Resume.countDocuments({ userId: uid }),
    Interview.countDocuments({ odId: uid, status: 'completed' }),
  ]);
  res.json({ success: true, stats: { resumesCreated, interviewsDone } });
}));

// Get own activity feed (community posts)
router.get('/me/activity', asyncHandler(async (req, res) => {
  const activity = await getPostsForUser(req.user.uid);
  res.json({ success: true, activity });
}));

// Get public profile by uid
router.get('/:uid', asyncHandler(async (req, res) => {
  const profile = await UserProfile.findOne({ uid: req.params.uid });
  if (!profile) throw new ApiError(404, 'Profile not found');
  res.json({ success: true, profile });
}));

// Get public stats by uid
router.get('/:uid/stats', asyncHandler(async (req, res) => {
  const uid = req.params.uid;
  if (uid !== req.user.uid) {
    throw new ApiError(403, 'Access denied. You can only view your own stats.');
  }
  const [resumesCreated, interviewsDone] = await Promise.all([
    Resume.countDocuments({ userId: uid }),
    Interview.countDocuments({ odId: uid, status: 'completed' }),
  ]);
  res.json({ success: true, stats: { resumesCreated, interviewsDone } });
}));

// Get public activity feed by uid
router.get('/:uid/activity', asyncHandler(async (req, res) => {
  const activity = await getPostsForUser(req.params.uid);
  res.json({ success: true, activity });
}));

export default router;
