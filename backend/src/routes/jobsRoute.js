import express from "express";
const router = express.Router();

import { getJobs, summarizeJob } from "../controllers/jobFetch.js";
import { verifyToken } from '../middleware/auth.js';

router.get("/",verifyToken , getJobs);
router.post("/summarize", verifyToken, summarizeJob);

export default router;