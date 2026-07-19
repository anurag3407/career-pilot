import inputModel from "../models/input.model.js";
import userModel from "../models/User.model.js";
import { extractSkills } from "../utils/resumeparser.js";
import axios from "axios";
import pdfParse from "pdf-parse";

async function inputupload(req, res) {
  try {
    const user = await userModel.findById(req.user.uid);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });   
    }

    const parsedData = req.body.data ? JSON.parse(req.body.data) : {};

    let experienceLevel = "Entry";

    if (parsedData.experience?.includes("Junior")) {
      experienceLevel = "Junior";
    } else if (parsedData.experience?.includes("Mid")) {
      experienceLevel = "Mid";
    } else if (parsedData.experience?.includes("Senior")) {
      experienceLevel = "Senior";
    }

    let supportingDocumentURL = null;
    let resumeText = "";
    let extractedSkills = [];

    
    if (req.file) {
      supportingDocumentURL = req.file?.path || null;

      const response = await axios.get(supportingDocumentURL, {
        responseType: "arraybuffer",
      });

      const pdfData = await pdfParse(response.data);

      resumeText = pdfData.text.replace(/\s+/g, " ").trim();

      extractedSkills = extractSkills(resumeText);

      console.log("EXTRACTED SKILLS:", extractedSkills);
    }

    
    const manualSkills = parsedData.techSkills || [];

    
    const combinedSkills = [...manualSkills, ...extractedSkills];

    
    const uniqueSkills = [...new Set(combinedSkills)];

    
    const techSkills = uniqueSkills.map((skill) => ({
      name: skill,
    }));

    
    const newInput = await inputModel.create({
      user: req.user.uid,
      name: parsedData.name,
      jobRole: parsedData.jobRole,
      experienceLevel,
      techSkills,
      softSkills: parsedData.softSkills || [],
      resume: supportingDocumentURL,
      resumeText,
    });

    return res.status(201).json({
      message: "Profile + Resume uploaded successfully",
      data: newInput,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: err.message,
    });
  }
}

async function getinput(req, res) {
  try {
    const data = await inputModel    
      .findOne({ user: req.user.uid })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "data fetched successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

export {
  inputupload,
  getinput,
};
