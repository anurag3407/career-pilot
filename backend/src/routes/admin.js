import express from 'express';
import { verifyToken, adminOnly } from '../middleware/auth.js';
import User from '../models/User.model.js';
import Resume from '../models/Resume.model.js';
import Portfolio from '../models/Portfolio.model.js';
import Job from '../models/Job.model.js';
import LoginLog from '../models/LoginLog.model.js';

const router = express.Router();

// Apply auth and admin middleware to all routes in this file
router.use(verifyToken, adminOnly);

/**
 * @route GET /api/admin/stats
 * @desc Get high level metrics for the admin dashboard
 */
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalResumes, totalPortfolios, totalJobs] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Portfolio.countDocuments(),
      Job.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalResumes,
      totalPortfolios,
      totalJobs
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Error fetching admin stats', error: error.message });
  }
});

/**
 * @route GET /api/admin/users
 * @desc Get paginated list of all users
 */
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select('-password') // Ensure password hash is excluded
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

/**
 * @route GET /api/admin/logins
 * @desc Get paginated list of successful logins
 */
router.get('/logins', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const logins = await LoginLog.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LoginLog.countDocuments();

    res.json({
      logins,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalLogins: total
    });
  } catch (error) {
    console.error('Admin logins error:', error);
    res.status(500).json({ message: 'Error fetching logins', error: error.message });
  }
});

export default router;
