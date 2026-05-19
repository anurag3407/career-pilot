import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { paginate, paginatedResponse } from '../middleware/paginate.js';
import Resume from '../models/Resume.model.js';
import { scrapeLinkedInProfile, profileToResumeText } from '../services/linkedinImporter.js';

const router = express.Router();

/**
 * @swagger
 * /api/resumes:
 *   get:
 *     summary: Get all resumes
 *     responses:
 *       200:
 *         description: Success
 */

// Get all resumes for a user (paginated)
router.get('/', verifyToken, paginate(), asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { page, limit, skip, sort } = req.paginate;

  const total = await Resume.countDocuments({ userId });

  const userResumes = await Resume.find({ userId })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const resumes = userResumes.map(resume => ({
    id: resume._id.toString(),
    ...resume,
    _id: undefined
  }));

  paginatedResponse(res, { data: resumes, total, page, limit });
}));

/**
 * @swagger
 * /api/resumes/{resumeId}:
 *   get:
 *     summary: Get resume by ID
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 */
// Get a specific resume
router.get('/:resumeId', verifyToken, asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.uid;

  const resume = await Resume.findOne({ _id: resumeId, userId }).lean();

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  res.json({
    success: true,
    data: {
      id: resume._id.toString(),
      ...resume,
      _id: undefined
    }
  });
}));

/**
 * @swagger
 * /api/resumes:
 *   post:
 *     summary: Create new resume
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */ 
// Create a new resume
router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { 
    originalText, 
    enhancedText, 
    jobRole, 
    preferences,
    title 
  } = req.body;

  if (!originalText) {
    throw new ApiError(400, 'Original text is required');
  }

  const newResume = await Resume.create({
    userId,
    originalText,
    enhancedText: enhancedText || null,
    jobRole: jobRole || null,
    preferences: preferences || {},
    title: title || `Resume - ${new Date().toLocaleDateString()}`
  });

  res.status(201).json({
    success: true,
    data: {
      id: newResume._id.toString(),
      userId: newResume.userId,
      originalText: newResume.originalText,
      enhancedText: newResume.enhancedText,
      jobRole: newResume.jobRole,
      preferences: newResume.preferences,
      title: newResume.title,
      pdfUrl: newResume.pdfUrl,
      createdAt: newResume.createdAt,
      lastModified: newResume.lastModified
    }
  });
}));

/**
 * @swagger
 * /api/resumes/{resumeId}:
 *   put:
 *     summary: Update resume
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Success
 */
// Update a resume
router.put('/:resumeId', verifyToken, asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.uid;
  const updates = req.body;

  const allowedUpdates = ['originalText', 'enhancedText', 'jobRole', 'preferences', 'title', 'pdfUrl'];
  const updateData = {};
  for (const key of allowedUpdates) {
    if (updates[key] !== undefined) updateData[key] = updates[key];
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, 'No valid fields to update');
  }

  const updatedResume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedResume) {
    throw new ApiError(404, 'Resume not found');
  }

  res.json({
    success: true,
    data: {
      id: updatedResume._id.toString(),
      ...updatedResume,
      _id: undefined
    }
  });
}));

/**
 * @swagger
 * /api/resumes/{resumeId}:
 *   delete:
 *     summary: Delete resume
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 */
// Delete a resume
router.delete('/:resumeId', verifyToken, asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.uid;

  const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  res.json({
    success: true,
    message: 'Resume deleted successfully'
  });
}));

// Preview LinkedIn profile before importing
router.post('/import/linkedin/preview', verifyToken, asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    throw new ApiError(400, 'LinkedIn URL is required');
  }

  const isLinkedIn = /^https?:\/\/(www\.)?linkedin\.com\/in\//.test(url.trim());
  if (!isLinkedIn) {
    throw new ApiError(400, 'Please provide a valid LinkedIn profile URL (linkedin.com/in/...)');
  }

  const profile = await scrapeLinkedInProfile(url.trim());

  res.json({
    success: true,
    preview: {
      name: profile.name,
      headline: profile.headline,
      location: profile.location,
      about: profile.about,
      experienceCount: profile.experience?.length || 0,
      educationCount: profile.education?.length || 0,
      skills: profile.skills || [],
    },
    profile,
  });
}));

// Import LinkedIn profile as a resume
router.post('/import/linkedin', verifyToken, asyncHandler(async (req, res) => {
  const { url, profile: cachedProfile } = req.body;
  const userId = req.user.uid;

  if (!url && !cachedProfile) {
    throw new ApiError(400, 'LinkedIn URL or profile data is required');
  }

  const profile = cachedProfile || await scrapeLinkedInProfile(url.trim());
  const resumeText = profileToResumeText(profile);
  const title = `${profile.name || 'LinkedIn'} — Imported ${new Date().toLocaleDateString()}`;

  const resume = await Resume.create({
    userId,
    originalText: resumeText,
    jobRole: profile.headline || null,
    preferences: { skills: profile.skills || [] },
    title,
  });

  res.status(201).json({
    success: true,
    data: {
      id: resume._id.toString(),
      userId: resume.userId,
      originalText: resume.originalText,
      enhancedText: resume.enhancedText,
      jobRole: resume.jobRole,
      preferences: resume.preferences,
      title: resume.title,
      pdfUrl: resume.pdfUrl,
      createdAt: resume.createdAt,
      lastModified: resume.lastModified,
    },
  });
}));

// Download resume as PDF
router.get('/:resumeId/download', verifyToken, asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.uid;
  const { version = 'enhanced', paperSize = 'A4' } = req.query;

  const resume = await Resume.findById(resumeId).lean();

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  if (resume.userId !== userId) {
    throw new ApiError(403, 'Access denied');
  }

  const textContent = version === 'enhanced' && resume.enhancedText 
    ? resume.enhancedText 
    : resume.originalText;

  if (!textContent) {
    throw new ApiError(400, 'No content available for download');
  }

  const { generatePDF } = await import('../services/pdfGenerator.js');

  try {
    const pdfBuffer = await generatePDF(textContent, {
      format: paperSize === 'Letter' ? 'Letter' : 'A4',
      title: resume.title || 'Resume'
    });

    const filename = `${resume.title || 'resume'}_${version}.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new ApiError(500, 'Failed to generate PDF');
  }
}));

export default router;
