import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { enhanceSection } from '../services/ai/portfolioContentEnhancer.js';

const router = express.Router();

const VALID_SECTIONS = ['hero', 'projects', 'about', 'skills'];

/**
 * POST /api/ai/enhance-portfolio-content
 * Enhance a portfolio section using AI
 * Returns before/after comparison — does NOT save automatically
 */
router.post('/enhance-portfolio-content', verifyToken, asyncHandler(async (req, res) => {
  const { sectionType, content } = req.body;

  // Validate inputs
  if (!sectionType || !content) {
    throw new ApiError(400, 'sectionType and content are required.');
  }

  if (!VALID_SECTIONS.includes(sectionType)) {
    throw new ApiError(400, `Invalid sectionType. Allowed: ${VALID_SECTIONS.join(', ')}`);
  }

  if (content === null || Array.isArray(content) || typeof content !== 'object') {
  throw new ApiError(400, 'content must be a non-null object.');
}

  const result = await enhanceSection(sectionType, content);

  res.status(200).json({
    success: true,
    message: 'Enhancement suggestion generated. Review before applying.',
    data: {
      sectionType: result.sectionType,
      before: result.original,
      after: result.enhanced,
      improvements: result.improvements,
    },
  });
}));

export default router;