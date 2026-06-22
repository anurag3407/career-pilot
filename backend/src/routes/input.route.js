import express from 'express';
const router = express.Router();

import upload from "../middleware/upload.middleware.js";
import { verifyToken } from "../middleware/auth.js";

import { inputupload, getinput } from "../controllers/input.controller.js";

router.post("/uploadResume", verifyToken, upload.single("resume"), inputupload);
router.get("/getinput", verifyToken, getinput);

export default router;
