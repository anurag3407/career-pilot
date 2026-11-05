
import express from "express";
import recruiterController from "../controllers/recruiter.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/sendData", verifyToken, recruiterController.saveAnalysis);
router.get("/showData", verifyToken, recruiterController.getLeaderboard);
export default router;