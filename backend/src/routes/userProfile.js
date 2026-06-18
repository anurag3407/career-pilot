import express from 'express';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import {
  cacheResponse,
  invalidateCacheNamespace,
} from '../middleware/cacheLayer.js';
import UserProfile from '../models/UserProfile.model.js';
import Resume from '../models/Resume.model.js';
import Interview from '../models/Interview.model.js';
import { db } from '../config/firebase.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, setAvatarSchema } from '../schemas/userProfile.schema.js';

const router = express.Router();

router.use(verifyToken);

const PROFILE_CACHE_NAMESPACE = 'user-profile';
const PROFILE_CACHE_TTL_SECONDS = 120;

const profileCache = cacheResponse({
  namespace: PROFILE_CACHE_NAMESPACE,
  ttlSeconds: PROFILE_CACHE_TTL_SECONDS,
  scopeBuilder: (req) => req.params.uid ?? req.user.uid,
});

const invalidateProfileCache = (uid) =>
  invalidateCacheNamespace({
    namespace: PROFILE_CACHE_NAMESPACE,
    scope: uid,
  });

const getPostsForUser = async (uid) => {
  let snapshot;
  try {
    snapshot = await db.collection('posts')
      .where('author.uid', '==', uid)
      .limit(50)
      .get();
  } catch (error) {
    console.warn('Unable to load profile activity feed:', error.message);
    return [];
  }

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
      likeCount: Array.isArray(p.likes) ? p.likes.length : (p.likeCount || 0),
      commentCount: p.commentCount || 0,
      createdAt: p.createdAt?.toDate?.() || p.createdAt || null,
    }));
};

// Get or create own profile
router.get('/me', profileCache, asyncHandler(async (req, res) => {
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
  const {
    displayName, bio, jobRole, skills, location, website, github, linkedin,
    avatarUrl, phone, headline, dateOfBirth, gender, company, yearsOfExperience,
    collegeStudent, openToWork, education, languages, resumeHeadline,
  } = req.body;

  const update = {};
  // --- Existing fields ---
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

  // --- New personal-info fields ---
  if (avatarUrl !== undefined) update.avatarUrl = String(avatarUrl).slice(0, 500);
  if (phone !== undefined) update.phone = String(phone).slice(0, 30);
  if (headline !== undefined) update.headline = String(headline).slice(0, 120);
  if (dateOfBirth !== undefined) update.dateOfBirth = dateOfBirth;
  if (gender !== undefined) update.gender = gender;
  if (company !== undefined) update.company = String(company).slice(0, 100);
  if (yearsOfExperience !== undefined) update.yearsOfExperience = yearsOfExperience;
  if (collegeStudent !== undefined) update.collegeStudent = Boolean(collegeStudent);
  if (openToWork !== undefined) update.openToWork = Boolean(openToWork);
  if (resumeHeadline !== undefined) update.resumeHeadline = String(resumeHeadline).slice(0, 300);

  if (education !== undefined) {
    update.education = Array.isArray(education)
      ? education.slice(0, 20).map(e => ({
        institution: String(e.institution || '').slice(0, 150),
        degree: String(e.degree || '').slice(0, 100),
        field: String(e.field || '').slice(0, 100),
        startYear: typeof e.startYear === 'number' ? e.startYear : undefined,
        endYear: typeof e.endYear === 'number' ? e.endYear : undefined,
      })).filter(e => e.institution || e.degree)
      : [];
    // Strip undefined keys so Mongoose doesn't store them
    update.education = update.education.map(e =>
      Object.fromEntries(Object.entries(e).filter(([, v]) => v !== undefined))
    );
  }

  if (languages !== undefined) {
    update.languages = Array.isArray(languages)
      ? languages.slice(0, 20).map(l => String(l).trim()).filter(Boolean)
      : [];
  }

  const profile = await UserProfile.findOneAndUpdate(
    { uid },
    { $set: update },
    { new: true, upsert: true }
  );
  await invalidateProfileCache(uid);
  res.json({ success: true, profile });
}));

// Set avatar URL (client uploads to Firebase Storage, then persists the URL here)
router.post('/me/avatar', validate(setAvatarSchema), asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const { avatarUrl } = req.body;

  const profile = await UserProfile.findOneAndUpdate(
    { uid },
    { $set: { avatarUrl } },
    { new: true, upsert: true }
  );
  await invalidateProfileCache(uid);
  res.json({ success: true, profile });
}));

// Remove avatar
router.delete('/me/avatar', asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  const profile = await UserProfile.findOneAndUpdate(
    { uid },
    { $set: { avatarUrl: '' } },
    { new: true, upsert: true }
  );
  await invalidateProfileCache(uid);
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
router.get('/:uid', profileCache, asyncHandler(async (req, res) => {
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
