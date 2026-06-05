
import express from "express";
import recruiterController from "../controllers/recruiter.model.js";


const router = express.Router();

router.post("/sendData",recruiterController.saveAnalysis );
router.get("/showData",recruiterController.getLeaderboard);
export default router;