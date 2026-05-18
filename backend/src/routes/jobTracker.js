import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import TrackedJob from '../models/TrackedJob.model.js';

function isValidWebUrl(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const router = express.Router();

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

// Track a new job
router.post('/', verifyToken, asyncHandler(async (req, res) => {
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
router.put('/:trackerId', verifyToken, asyncHandler(async (req, res) => {
  const { trackerId } = req.params;
  const userId = req.user.uid;
  const { status, notes } = req.body;

  const job = await TrackedJob.findById(trackerId);

  if (!job) {
    throw new ApiError(404, 'Tracked job not found');
  }

  if (job.userId !== userId) {
    throw new ApiError(403, 'Access denied');
  }

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

  const updatedJob = await TrackedJob.findByIdAndUpdate(
    trackerId,
    updateData,
    { new: true, runValidators: true }
  ).lean();

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

  const job = await TrackedJob.findById(trackerId);

  if (!job) {
    throw new ApiError(404, 'Tracked job not found');
  }

  if (job.userId !== userId) {
    throw new ApiError(403, 'Access denied');
  }

  await TrackedJob.findByIdAndDelete(trackerId);

  res.json({
    success: true,
    message: 'Job removed from tracker'
  });
}));

export default router;
