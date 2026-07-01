import inputModel from "../models/input.model.js";
import userModel from "../models/User.model.js";
import { extractSkills } from "../utils/resumeparser.js";
import axios from "axios";
import pdfParse from "pdf-parse";

function parseInputDataPayload(data) {
  if (data === undefined || data === null) {
    return {};
  }

  if (
    typeof data === "object" &&
    !Array.isArray(data)
  ) {
    return data;
  }

  try {
    if (typeof data !== "string" || data.trim() === "") {
      return null;
    }

    const parsedData = JSON.parse(data);

    if (
      parsedData === null ||
      Array.isArray(parsedData) ||
      typeof parsedData !== "object"
    ) {
      return null;
    }

    return parsedData;
  } catch {
    return null;
  }
}

async function inputupload(req, res) {
  try {
    const parsedData = parseInputDataPayload(req.body.data);

    if (parsedData === null) {
      return res.status(400).json({
        message: "Invalid JSON format in request body",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });   
    }

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
      user: req.user.id,
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
      .findOne({ user: req.user.id })
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
  parseInputDataPayload,
  inputupload,
  getinput,
};
