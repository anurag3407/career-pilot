import express from 'express';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import UserProfile from '../models/UserProfile.model.js';
import Resume from '../models/Resume.model.js';
import Interview from '../models/Interview.model.js';
import { db } from '../config/firebase.js';
import { devDb } from '../utils/devDbFallback.js';
import { fetchJobs } from '../utils/jobSearch.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../schemas/userProfile.schema.js';

const router = express.Router();

router.use(verifyToken);

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
router.get('/me', asyncHandler(async (req, res) => {
  const uid = req.user.uid;

  if (global.useDevDbFallback) {
    const profile = devDb.getProfile(uid, req.user.email, req.user.name);
    return res.json({ success: true, profile });
  }

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

  if (global.useDevDbFallback) {
    const profile = devDb.updateProfile(uid, { displayName, bio, jobRole, skills, location, website, github, linkedin });
    return res.json({ success: true, profile });
  }

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

  if (global.useDevDbFallback) {
    const resumes = devDb.getResumes(uid);
    return res.json({ success: true, stats: { resumesCreated: resumes.length, interviewsDone: 0 } });
  }

  const [resumesCreated, interviewsDone] = await Promise.all([
    Resume.countDocuments({ userId: uid }),
    Interview.countDocuments({ odId: uid, status: 'completed' }),
  ]);
  res.json({ success: true, stats: { resumesCreated, interviewsDone } });
}));

// Get own activity feed (community posts)
router.get('/me/activity', asyncHandler(async (req, res) => {
  if (global.useDevDbFallback) {
    return res.json({ success: true, activity: [] });
  }
  const activity = await getPostsForUser(req.user.uid);
  res.json({ success: true, activity });
}));

const getMockRecommendations = (jobRole, skills) => {
  const role = jobRole || 'Software Engineer';
  const skillList = skills && skills.length > 0 ? skills : ['React', 'Node.js', 'JavaScript'];
  
  return [
    {
      employer_name: 'TechCorp Solutions',
      employer_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop',
      job_title: `Senior ${role}`,
      job_employment_type: 'FULLTIME',
      job_city: 'San Francisco',
      job_state: 'CA',
      job_country: 'US',
      job_description: `We are looking for a talented Senior ${role} skilled in ${skillList.join(', ')} to join our high-growth platform team.`,
      job_apply_link: 'https://careers.google.com',
      job_min_salary: 120000,
      job_max_salary: 165000,
      job_salary_currency: 'USD'
    },
    {
      employer_name: 'InnoTech Lab',
      employer_logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop',
      job_title: `${role} (Remote)`,
      job_employment_type: 'FULLTIME',
      job_city: 'Austin',
      job_state: 'TX',
      job_country: 'US',
      job_description: `Exciting opportunity for a remote ${role}. Must have hands-on experience working with ${skillList.slice(0, 3).join(', ')}.`,
      job_apply_link: 'https://careers.google.com',
      job_min_salary: 95000,
      job_max_salary: 130000,
      job_salary_currency: 'USD'
    },
    {
      employer_name: 'Apex Systems',
      employer_logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&h=100&fit=crop',
      job_title: `Lead ${role}`,
      job_employment_type: 'CONTRACT',
      job_city: 'New York',
      job_state: 'NY',
      job_country: 'US',
      job_description: `Join Apex Systems as a Lead ${role} to spearhead our next-generation architecture. Experience with ${skillList[0] || 'modern tech stacks'} is required.`,
      job_apply_link: 'https://careers.google.com',
      job_min_salary: 140000,
      job_max_salary: 180000,
      job_salary_currency: 'USD'
    }
  ];
};

// Get personalized recommendations based on profile skills and jobRole
router.get('/me/recommendations', asyncHandler(async (req, res) => {
  const uid = req.user.uid;
  let profile;
  
  if (global.useDevDbFallback) {
    profile = devDb.getProfile(uid, req.user.email, req.user.name);
  } else {
    profile = await UserProfile.findOne({ uid });
    if (!profile) {
      profile = await UserProfile.create({
        uid,
        displayName: req.user.name || req.user.email?.split('@')[0] || '',
      });
    }
  }

  const queryTerm = [profile.jobRole, ...(profile.skills || [])].filter(Boolean).join(' ');

  if (!queryTerm) {
    return res.json({ success: true, recommendations: getMockRecommendations(profile.jobRole, profile.skills) });
  }

  try {
    const jobsData = await fetchJobs({ query: queryTerm });
    if (jobsData.error) {
      const mockJobs = getMockRecommendations(profile.jobRole, profile.skills);
      return res.json({ success: true, recommendations: mockJobs, isFallback: true });
    }
    
    res.json({ success: true, recommendations: jobsData.data || [] });
  } catch (error) {
    console.error("Recommendations fetch error:", error);
    const mockJobs = getMockRecommendations(profile.jobRole, profile.skills);
    res.json({ success: true, recommendations: mockJobs, isFallback: true });
  }
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
