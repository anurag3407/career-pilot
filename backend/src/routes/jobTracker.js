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
  deadlineSchema,
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
  const { sort } = req.query;

  let sortQuery = { createdAt: -1 };
  if (sort === 'deadline') {
    // Nulls last: jobs with deadline asc, then jobs without deadline
    sortQuery = { deadline: 1, createdAt: -1 };
  }

  const userJobs = await TrackedJob.find({ userId })
    .sort(sortQuery)
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
    status = 'saved',
    deadline
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
    userEmail: req.user.email || null,
    jobId: jobId || `manual-${Date.now()}`,
    title,
    company,
    location: location || 'Remote',
    jobType: jobType || 'Full-time',
    salary: salary || null,
    applyLink: applyLink || null,
    description: description || null,
    status,
    deadline: deadline ? new Date(deadline) : null,
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
      deadline: trackedJob.deadline,
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

// Update job deadline
router.patch('/:trackerId/deadline', verifyToken, validate(deadlineSchema), asyncHandler(async (req, res) => {
  const { trackerId } = req.params;
  const userId = req.user.uid;
  const { deadline } = req.body;

  const updatedJob = await TrackedJob.findOneAndUpdate(
    { _id: trackerId, userId },
    {
      $set: {
        deadline: deadline ? new Date(deadline) : null,
        'deadlineReminderSent.today': false,
        'deadlineReminderSent.fortyEightHour': false
      }
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedJob) {
    throw new ApiError(404, 'Tracked job not found');
  }

  res.json({
    success: true,
    message: deadline ? 'Deadline set successfully' : 'Deadline removed',
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
