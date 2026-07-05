import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import ResumeRoast from '../models/ResumeRoast.model.js';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createRoastSchema } from '../schemas/roast.schema.js';
import { buildRoast } from '../services/roastOrchestrator.js';

const router = express.Router();

// POST /api/roast — generate a new roast
router.post(
  '/',
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(createRoastSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobRole, isPublic } = req.body;
    const { uid: userId } = req.user;

    const { deterministic, roast, resumeHash, resumeLength } = await buildRoast({
      resumeText,
      jobRole,
      aiProvider: req.aiProvider,
    });

    const shareToken = uuidv4().slice(0, 12);

    const saved = await ResumeRoast.create({
      userId,
      overallScore: deterministic.overallScore,
      breakdown: deterministic.breakdown,
      sectionsFound: deterministic.sectionsFound,
      tagline: roast.tagline,
      ratings: roast.ratings,
      roast: roast.roast,
      silverLinings: roast.silverLinings,
      quickWins: roast.quickWins,
      emoji: roast.emoji,
      jobRole,
      resumeLength,
      provider: roast.provider,
      shareToken,
      resumeHash,
      isPublic: Boolean(isPublic),
    });

    res.json({
      success: true,
      data: {
        id: saved._id,
        shareToken,
        overallScore: saved.overallScore,
        breakdown: saved.breakdown,
        sectionsFound: saved.sectionsFound,
        tagline: saved.tagline,
        ratings: saved.ratings,
        roast: saved.roast,
        silverLinings: saved.silverLinings,
        quickWins: saved.quickWins,
        emoji: saved.emoji,
        jobRole: saved.jobRole,
        provider: saved.provider,
        createdAt: saved.createdAt,
      },
    });
  })
);

// GET /api/roast/history — list user's roasts (most recent first)
router.get(
  '/history',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { uid: userId } = req.user;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const roasts = await ResumeRoast.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v')
      .lean();

    res.json({ success: true, data: roasts });
  })
);

// GET /api/roast/:id — fetch a single roast by id (owner only)
router.get(
  '/:id',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { uid: userId } = req.user;
    const roast = await ResumeRoast.findOne({ _id: req.params.id, userId }).lean();
    if (!roast) throw new ApiError(404, 'Roast not found');
    res.json({ success: true, data: roast });
  })
);

// GET /api/roast/share/:shareToken — public, returns teaser if isPublic
router.get(
  '/share/:shareToken',
  asyncHandler(async (req, res) => {
    const roast = await ResumeRoast.findOne({
      shareToken: req.params.shareToken,
      isPublic: true,
    }).lean();

    if (!roast) {
      throw new ApiError(404, 'Roast not found or not shared publicly');
    }

    res.json({
      success: true,
      data: {
        shareToken: roast.shareToken,
        tagline: roast.tagline,
        ratings: roast.ratings,
        emoji: roast.emoji,
        overallScore: roast.overallScore,
        roast: roast.roast,
        silverLinings: roast.silverLinings,
        quickWins: roast.quickWins,
        createdAt: roast.createdAt,
      },
    });
  })
);

// DELETE /api/roast/:id — delete a roast
router.delete(
  '/:id',
  verifyToken,
  asyncHandler(async (req, res) => {
    const { uid: userId } = req.user;
    const result = await ResumeRoast.deleteOne({ _id: req.params.id, userId });
    if (result.deletedCount === 0) {
      throw new ApiError(404, 'Roast not found');
    }
    res.json({ success: true });
  })
);

export default router;