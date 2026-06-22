import express from 'express';
import rateLimit from 'express-rate-limit';
import { verifyToken, adminOnly } from '../middleware/auth.js';
import Bug from '../models/Bug.model.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Rate limit: Max 10 bug reports per user per 30 minutes
const bugReportLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?.uid || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({
      success: false,
      error: 'Too many bug reports. Please wait 30 minutes before reporting again.',
    }),
});

/**
 * @route POST /api/bugs
 * @desc Submit a new bug report
 * @access Private
 */
router.post(
  '/',
  verifyToken,
  bugReportLimiter,
  asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }

    const bug = await Bug.create({
      userEmail: req.user.email || req.user.uid,
      title,
      description,
    });

    res.status(201).json({ success: true, bug });
  })
);

/**
 * @route GET /api/bugs
 * @desc Get all bug reports (Admin only)
 * @access Private/Admin
 */
router.get(
  '/',
  verifyToken,
  adminOnly,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const bugs = await Bug.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bug.countDocuments();

    res.json({
      success: true,
      bugs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalBugs: total,
    });
  })
);

export default router;
