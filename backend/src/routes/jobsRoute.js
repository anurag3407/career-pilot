import express from "express";
const router = express.Router();

import { getJobs, getJobById, summarizeJob } from "../controllers/jobFetch.js";
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

router.get("/", verifyToken, getJobs);
router.get("/:jobId", verifyToken, getJobById);
router.post("/summarize", verifyToken, extractAIProvider, aiRateLimiter, summarizeJob);

export default router;