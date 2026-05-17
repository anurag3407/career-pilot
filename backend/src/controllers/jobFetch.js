import { fetchJobs } from "../utils/jobSearch.js";
import Job from "../models/Job.model.js";
import mongoose from "mongoose";

export const getJobs = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const { query, jobType, experienceLevel, location } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter is required",
      });
    }

    const querystring = {
      query: query.trim(),
      ...(jobType && { job_type: jobType }),
      ...(experienceLevel && { experience_level: experienceLevel }),
      ...(location && { location: location.trim() || undefined }),
    };

    const jobsData = await fetchJobs(querystring);

    if (jobsData.error) {
      const statusCode = jobsData.statusCode || 500;
      return res.status(statusCode).json({
        success: false,
        error: jobsData.error,
        data: [],
        count: 0,
      });
    }

    const jobs = Array.isArray(jobsData.data) ? jobsData.data : [];

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
      count: jobs.length,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch jobs. Please try again later.",
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid jobId format",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch job details",
    });
  }
};
