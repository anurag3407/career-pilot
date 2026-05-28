import  express from 'express';
const router = express.Router();

import upload from "../middleware/upload.middleware.js";


import { inputupload, getinput } from "../controllers/input.controller.js";

router.post("/uploadResume",  upload.single("resume"), inputupload);
router.get("/getinput",  getinput)

export default router;
