import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { estimateSalary, classifyRole } from '../services/salaryEstimator.js';
import { fetchJobs } from '../utils/jobSearch.js';

const router = express.Router();

const MAX_POSTINGS = 50;

/**
 * POST /api/salary/estimate
 *
 * Returns an annual USD salary band for a role/location/level.
 *
 * Prefers aggregating real postings from the configured job-search provider.
 * Falls back to a curated baseline when no provider key is configured or too
 * few postings disclose salary, so this never hard-fails for a free user.
 */
router.post(
  '/estimate',
  verifyToken,
  aiRateLimiter,
  asyncHandler(async (req, res) => {
    const { title, location, experienceLevel } = req.body ?? {};

    if (typeof title !== 'string' || !title.trim()) {
      throw new ApiError(400, 'title (job role) is required');
    }

    if (title.length > 200) {
      throw new ApiError(400, 'title is too long');
    }

    const cleanLocation = typeof location === 'string' ? location.trim().slice(0, 120) : '';
    const cleanLevel = typeof experienceLevel === 'string' ? experienceLevel.trim().slice(0, 60) : '';

    let postings = [];

    // Opportunistically enrich with live postings. Any failure here is
    // non-fatal — the baseline still produces a usable estimate.
    if (process.env.RAPIDAPI_KEY) {
      try {
        const result = await fetchJobs({
          query: cleanLocation ? `${title.trim()} in ${cleanLocation}` : title.trim(),
          num_pages: '1',
        });

        if (!result?.error && Array.isArray(result?.data)) {
          postings = result.data.slice(0, MAX_POSTINGS);
        }
      } catch (error) {
        console.warn('Salary estimate: live postings unavailable:', error.message);
      }
    }

    const estimate = estimateSalary({
      title: title.trim(),
      location: cleanLocation,
      experienceLevel: cleanLevel,
      postings,
    });

    res.status(200).json({
      success: true,
      data: {
        ...estimate,
        role: title.trim(),
        location: cleanLocation || null,
        experienceLevel: cleanLevel || null,
        roleFamily: classifyRole(title.trim()),
      },
    });
  })
);

export default router;