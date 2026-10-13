import { fetchJobs } from "../utils/jobSearch.js";
import Job from "../models/Job.model.js";
import Resume from "../models/Resume.model.js";
import mongoose from "mongoose";
import { summarizeJobDescription } from "../services/jobSummarizer.js";
import { deterministicResumeJobMatch } from "../services/resumeJobMatcher.js";
import { catchAsync } from "../middleware/globalErrorHandler.js";
import { trackTokenUsage } from '../utils/tokenTracker.js';

/**
 * Loads the most recently updated resume text for a user so job results can be
 * scored against it. Returns null when the user has no usable resume, which
 * simply means results come back unscored rather than failing the request.
 */
const getResumeTextForUser = async (userId) => {
  try {
    const resume = await Resume.findOne({ userId })
      .sort({ lastModified: -1 })
      .select('originalText enhancedText')
      .lean();

    if (!resume) return null;

    const text = [resume.enhancedText, resume.originalText]
      .filter((part) => typeof part === 'string' && part.trim())
      .join('\n')
      .trim();

    return text || null;
  } catch (error) {
    console.warn('⚠️  Could not load resume for match scoring:', error.message);
    return null;
  }
};

/**
 * Attaches a resume-based match score to each job using the deterministic
 * keyword matcher. This intentionally avoids an AI call so scoring stays free
 * and fast, and never throws into the search response.
 */
const attachMatchScores = (jobs, resumeText) => {
  if (!resumeText) return jobs;

  return jobs.map((job) => {
    const description = [job.job_title, job.job_description]
      .filter((part) => typeof part === 'string' && part.trim())
      .join('\n');

    if (!description.trim()) return job;

    const match = deterministicResumeJobMatch(resumeText, description);

    return {
      ...job,
      matchScore: match.matchScore,
      matchedSkills: match.matchedSkills.slice(0, 8),
      missingSkills: match.missingSkills.slice(0, 8),
    };
  });
};

export const getJobs = catchAsync(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { query, jobType, experienceLevel, location } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  const querystring = {
    query: query.trim(),
    ...(jobType && { job_type: jobType }),
    ...(experienceLevel && { experience_level: experienceLevel }),
    ...(location && { location: location.trim() || undefined }),
  };
  
  const jobsData = await fetchJobs(querystring);
  
  // Check if there was an API error
  if (jobsData.error) {
    const statusCode = jobsData.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: jobsData.error,
      data: [],
      count: 0
    });
  }
  
  const jobs = Array.isArray(jobsData.data) ? jobsData.data : [];

  const resumeText = await getResumeTextForUser(user.uid);
  const scoredJobs = attachMatchScores(jobs, resumeText);

  return res.status(200).json({
    success: true,
    message: "Jobs fetched successfully",
    data: scoredJobs,
    count: scoredJobs.length,
    matchScored: Boolean(resumeText)
  });
});

export const getJobById = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid jobId format"
    });
  }
  
  const job = await Job.findById(jobId);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found"
    });
  }
  
  return res.status(200).json({
    success: true,
    data: job
  });
});

export const summarizeJob = catchAsync(async (req, res, next) => {
  const { jobDescription } = req.body ?? {};
  
  if (typeof jobDescription !== "string" || !jobDescription.trim()) {
    return res.status(400).json({
      success: false,
      message: "Job description is required and must be a valid string"
    });
  }

  if (jobDescription.length > 20000) {
    return res.status(413).json({
      success: false,
      message: "Job description is too long"
    });
  }

  const result = await summarizeJobDescription(jobDescription, req.aiProvider);

if (result.usage) {
  await trackTokenUsage(
    req.user.uid,
    req.aiProvider.providerName,
    'job-summarizer',
    result.usage
  );
}

return res.status(200).json({
  ...result,
  provider: req.aiProvider.providerName,
  providerSource: req.aiProviderSource,
});
});
