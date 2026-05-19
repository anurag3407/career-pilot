import { fetchJobs } from "../utils/jobSearch.js";
import Job from "../models/Job.model.js";
import mongoose from "mongoose";
import { summarizeJobDescription } from "../services/jobSummarizer.js";

export const getJobs = async (req, res) => {
  try {
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
    
    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
      count: jobs.length
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs. Please try again later."
    });
  }
};

export const getJobById = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({
      success: false, 
      message: "Failed to fetch job details"
    });
  }
};

export const summarizeJob = async (req, res) => {
  try {
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
    
    return res.status(200).json({
      ...result,
      provider: req.aiProvider.providerName,
      providerSource: req.aiProviderSource,
    });
  } catch (error) {
    console.error("Error summarizing job:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to summarize job description"
    });
  }
};