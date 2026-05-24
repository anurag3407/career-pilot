import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { searchResumes, searchJobs, searchAll } from '../services/searchService.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    const userId = req.user.uid; // from verifyToken middleware

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters.',
      });
    }

    const query = q.trim();
    let results = [];

    switch (type) {
      case 'resume':
        results = await searchResumes(query, userId);
        break;
      case 'job':
        results = await searchJobs(query);
        break;
      case 'all':
      default:
        results = await searchAll(query, userId);
        break;
    }

    return res.status(200).json({
      success: true,
      query,
      type,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('[Search] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Search failed. Please try again.',
    });
  }
});

export default router;