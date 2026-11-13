import express from "express";
import { handleResumeUpload } from "../middleware/upload.middleware.js";
import { verifyToken } from "../middleware/auth.js";
import { inputupload, getinput } from "../controllers/input.controller.js";

const router = express.Router();

// POST /api/input/uploadResume — uploads a resume file to Cloudinary storage
router.post("/uploadResume", verifyToken, handleResumeUpload, inputupload);

// GET /api/input/getinput — retrieves the previously uploaded resume input for the user
router.get("/getinput", verifyToken, getinput);

export default router;

