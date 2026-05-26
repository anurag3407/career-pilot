import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import TrackedJob from '../models/TrackedJob.model.js';
import { researchCompany } from '../services/companyResearchService.js';
import { validate } from '../middleware/validate.js';
import {
  companyResearchSchema,
  trackJobSchema,
  updateTrackedJobSchema,
} from '../schemas/jobTracker.schema.js';

function isValidWebUrl(str) {
  try {
    const url = new URL(str);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

const router = express.Router();

// Research a company using AI
router.post('/research', verifyToken, extractAIProvider, aiRateLimiter, validate(companyResearchSchema), asyncHandler(async (req, res) => {
  const { companyName, industry } = req.body;

  if (!companyName || !companyName.trim()) {
    throw new ApiError(400, 'Company name is required for research');
  }

  const research = await researchCompany(companyName, industry, req.aiProvider);
  res.json({
    success: true,
    data: research,
    provider: req.aiProvider.providerName,
    providerSource: req.aiProviderSource,
  });
}));

// Get all tracked jobs for a user
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;

  const userJobs = await TrackedJob.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  // Transform _id to id for frontend compatibility
  const trackedJobs = userJobs.map(job => ({
    id: job._id.toString(),
    ...job,
    _id: undefined
  }));

  res.json({
    success: true,
    trackedJobs,
    count: trackedJobs.length
  });
}));

// Get tracker stats for a user
router.get('/stats', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;

  // Use MongoDB aggregation for efficient stats calculation
  const statsPipeline = [
    { $match: { userId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ];

  const results = await TrackedJob.aggregate(statsPipeline);

  // Build stats object
  const stats = {
    total: 0,
    saved: 0,
    applied: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0
  };

  results.forEach(item => {
    stats[item._id] = item.count;
    stats.total += item.count;
  });

  res.json({
    success: true,
    stats
  });
}));

// Get detailed analytics for job tracker dashboard
router.get('/analytics', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;

  const statusDistribution = await TrackedJob.aggregate([
    { $match: { userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await TrackedJob.aggregate([
    { $match: { userId, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const topCompanies = await TrackedJob.aggregate([
    { $match: { userId } },
    { $group: { _id: '$company', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 }
  ]);

  const funnelStages = ['saved', 'applied', 'interviewing', 'offered'];
  const funnel = {};
  for (const stage of funnelStages) {
    const result = await TrackedJob.countDocuments({ userId, status: stage });
    funnel[stage] = result;
  }
  funnel.rejected = await TrackedJob.countDocuments({ userId, status: 'rejected' });

  const avgTimeData = await TrackedJob.aggregate([
    { $match: { userId, status: { $in: ['applied', 'interviewing', 'offered'] } } },
    {
      $project: {
        status: 1,
        daysInPipeline: {
          $divide: [
            { $subtract: ['$updatedAt', '$createdAt'] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    },
    {
      $group: {
        _id: '$status',
        avgDays: { $avg: '$daysInPipeline' }
      }
    }
  ]);

  const totalApplications = await TrackedJob.countDocuments({ userId });

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedTrend = monthlyTrend.map(item => ({
    label: `${monthNames[item._id.month]} ${item._id.year}`,
    count: item.count
  }));

  const responsiveStatuses = ['interviewing', 'offered'];
  const responseCount = statusDistribution
    .filter(s => responsiveStatuses.includes(s._id))
    .reduce((sum, s) => sum + s.count, 0);
  const appliedCount = statusDistribution
    .filter(s => s._id !== 'saved')
    .reduce((sum, s) => sum + s.count, 0);
  const responseRate = appliedCount > 0 ? Math.round((responseCount / appliedCount) * 100) : 0;

  res.json({
    success: true,
    data: {
      totalApplications,
      responseRate,
      statusDistribution: statusDistribution.map(s => ({ status: s._id, count: s.count })),
      monthlyTrend: formattedTrend,
      topCompanies: topCompanies.map(c => ({ company: c._id, count: c.count })),
      funnel,
      avgTimeInStage: avgTimeData.map(a => ({ status: a._id, avgDays: Math.round(a.avgDays * 10) / 10 })),
    }
  });
}));


// Track a new job
router.post('/', verifyToken, validate(trackJobSchema), asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const {
    jobId,
    title,
    company,
    location,
    jobType,
    salary,
    applyLink,
    description,
    status = 'saved'
  } = req.body;

  if (!title || !company) {
    throw new ApiError(400, 'Job title and company are required');
  }

  if (applyLink && !isValidWebUrl(applyLink)) {
    throw new ApiError(400, 'applyLink must be a valid URL starting with http:// or https://');
  }

  // Check if job already tracked (handled by unique index, but check explicitly for better error message)
  const existingJob = jobId
    ? await TrackedJob.findOne({ userId, jobId })
    : await TrackedJob.findOne({ userId, title });
  if (existingJob) {
    throw new ApiError(400, 'Job already tracked');
  }

  const trackedJob = await TrackedJob.create({
    userId,
    jobId: jobId || `manual-${Date.now()}`,
    title,
    company,
    location: location || 'Remote',
    jobType: jobType || 'Full-time',
    salary: salary || null,
    applyLink: applyLink || null,
    description: description || null,
    status,
    notes: []
  });

  res.status(201).json({
    success: true,
    message: 'Job tracked successfully',
    data: {
      id: trackedJob._id.toString(),
      userId: trackedJob.userId,
      jobId: trackedJob.jobId,
      title: trackedJob.title,
      company: trackedJob.company,
      location: trackedJob.location,
      jobType: trackedJob.jobType,
      salary: trackedJob.salary,
      applyLink: trackedJob.applyLink,
      description: trackedJob.description,
      status: trackedJob.status,
      notes: trackedJob.notes,
      createdAt: trackedJob.createdAt,
      updatedAt: trackedJob.updatedAt
    }
  });
}));

// Update tracked job status
router.put('/:trackerId', verifyToken, validate(updateTrackedJobSchema), asyncHandler(async (req, res) => {
  const { trackerId } = req.params;
  const userId = req.user.uid;
  const { status, notes } = req.body;

  const validStatuses = ['saved', 'applied', 'interviewing', 'offered', 'rejected'];
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const updateData = {};

  if (status) {
    updateData.status = status;
  }

  if (notes) {
    updateData.$push = {
      notes: {
        content: notes,
        createdAt: new Date()
      }
    };
  }

  if (!status && !notes) {
    throw new ApiError(400, 'Provide status or notes to update');
  }

  const updatedJob = await TrackedJob.findOneAndUpdate(
    { _id: trackerId, userId },
    updateData,
    { new: true, runValidators: true }
  ).lean();

  if (!updatedJob) {
    throw new ApiError(404, 'Tracked job not found');
  }

  res.json({
    success: true,
    message: 'Job updated successfully',
    data: {
      id: updatedJob._id.toString(),
      ...updatedJob,
      _id: undefined
    }
  });
}));

// Delete tracked job
router.delete('/:trackerId', verifyToken, asyncHandler(async (req, res) => {
  const { trackerId } = req.params;
  const userId = req.user.uid;

  const job = await TrackedJob.findOneAndDelete({ _id: trackerId, userId });

  if (!job) {
    throw new ApiError(404, 'Tracked job not found');
  }

  res.json({
    success: true,
    message: 'Job removed from tracker'
  });
}));

export default router;
