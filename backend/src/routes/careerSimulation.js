import express from 'express';
import mongoose from 'mongoose';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import Resume from '../models/Resume.model.js';
import CareerSimulation from '../models/CareerSimulation.model.js';
import { startCareerSimulationSchema } from '../schemas/careerSimulation.schema.js';

const router = express.Router();

// GET /api/career-simulations/stats
// Get historical readiness score trends
router.get('/stats', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const history = await CareerSimulation.find({ userId })
    .sort({ createdAt: 1 })
    .select('createdAt readinessScore jobRole')
    .lean();

  res.status(200).json({
    success: true,
    data: history.map(item => ({
      id: item._id,
      createdAt: item.createdAt,
      readinessScore: item.readinessScore,
      jobRole: item.jobRole
    }))
  });
}));

// GET /api/career-simulations
// Fetch all simulations for the user
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const simulations = await CareerSimulation.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    data: simulations
  });
}));

// GET /api/career-simulations/:id
// Get a single simulation details
router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid simulation ID format');
  }

  const simulation = await CareerSimulation.findOne({ _id: id, userId }).lean();
  if (!simulation) {
    throw new ApiError(404, 'Career simulation not found');
  }

  res.status(200).json({
    success: true,
    data: simulation
  });
}));

// DELETE /api/career-simulations/:id
// Delete a simulation record
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid simulation ID format');
  }

  const deleted = await CareerSimulation.findOneAndDelete({ _id: id, userId });
  if (!deleted) {
    throw new ApiError(404, 'Career simulation not found');
  }

  res.status(200).json({
    success: true,
    message: 'Career simulation record deleted successfully'
  });
}));

// POST /api/career-simulations
// Start a new AI career simulation assessment
router.post('/', verifyToken, extractAIProvider, aiRateLimiter, validate(startCareerSimulationSchema), asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { resumeId, jobRole, experienceLevel } = req.body;

  const resume = await Resume.findOne({ _id: resumeId, userId });
  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  const prompt = `Perform a comprehensive career hiring simulation and readiness assessment for a candidate seeking an "${experienceLevel}" level "${jobRole}" position based on their resume.

Resume Text:
${resume.originalText}
${resume.enhancedText ? `\nEnhanced version:\n${resume.enhancedText}` : ''}

Provide a detailed evaluation in valid JSON format. Return ONLY the JSON object. Do not wrap in markdown code blocks or write extra text.
The JSON object must have exactly the following keys and structure:
{
  "readinessScore": <number between 0 and 100 representing overall readiness for this role>,
  "pipelineStages": [
    {
      "stageName": "Resume Screening",
      "successProbability": <number between 0 and 100>,
      "weakPoints": [<array of string weak points specific to resume screening for this role>],
      "requiredSkills": [<array of string skills checked in this stage>],
      "suggestions": [<array of actionable tips to improve screening success>]
    },
    {
      "stageName": "Online Assessment",
      "successProbability": <number between 0 and 100>,
      "weakPoints": [<array of string weak points for coding test/OA>],
      "requiredSkills": [<array of key algorithms/DSA or domain-specific OA skills needed>],
      "suggestions": [<array of actionable preparation tips for OA>]
    },
    {
      "stageName": "Technical Interview",
      "successProbability": <number between 0 and 100>,
      "weakPoints": [<array of technical understanding or coding round gaps>],
      "requiredSkills": [<array of technical skills/tools assessed in technical interview>],
      "suggestions": [<array of prep tips for live tech interviews>]
    },
    {
      "stageName": "System Design Round",
      "successProbability": <number between 0 and 100>,
      "weakPoints": [<array of system design or architectural depth gaps>],
      "requiredSkills": [<array of design principles/concepts needed>],
      "suggestions": [<array of tips to learn system design>]
    },
    {
      "stageName": "HR Round",
      "successProbability": <number between 0 and 100>,
      "weakPoints": [<array of behavioural or cultural gaps>],
      "requiredSkills": [<array of soft skills / core values assessed>],
      "suggestions": [<array of tips for behavioural STAR questions>]
    },
    {
      "stageName": "Final Selection",
      "successProbability": <number between 0 and 100>,
      "weakPoints": [<array of competition or compounding risk factors>],
      "requiredSkills": [<array of overall fit indicators>],
      "suggestions": [<array of tips to secure the final offer>]
    }
  ],
  "skillGap": {
    "strongSkills": [<array of candidate's strong skills found in resume>],
    "missingTechnologies": [<array of missing key technologies/tools required for this role>],
    "communicationGaps": [<array of possible communication or explanation gaps deduced>],
    "projectDepth": <number between 0 and 100 representing depth of projects listed in the resume>,
    "indicators": [<array of readiness indicators or highlights>]
  },
  "roadmap": [
    {
      "phase": "Weeks 1-2: Core Technical Consolidation",
      "skillsToLearn": [<array of core topics to cover first>],
      "recommendedProjects": [
        {
          "title": "Project Title",
          "description": "Specific project description to cover missing gaps",
          "techStack": [<array of tags>]
        }
      ],
      "certifications": [<array of suggested certifications or learning paths>],
      "prepStrategy": "Specific daily preparation routine suggestion"
    },
    {
      "phase": "Weeks 3-4: Advanced Systems & Projects",
      "skillsToLearn": [<array of advanced topics>],
      "recommendedProjects": [
        {
          "title": "Advanced Project Title",
          "description": "System design or full deployment project",
          "techStack": [<array of tags>]
        }
      ],
      "certifications": [<array of certifications>],
      "prepStrategy": "Focus area for this phase"
    },
    {
      "phase": "Weeks 5+: Mock Interviews & Strategy",
      "skillsToLearn": [<array of behavioral or polish topics>],
      "recommendedProjects": [],
      "certifications": [],
      "prepStrategy": "Mock interview and final revision setup"
    }
  ],
  "riskAnalysis": [
    {
      "riskName": "DSA Readiness",
      "severity": "Low" | "Medium" | "High",
      "reason": "Why this is a risk",
      "mitigation": "How to solve it"
    },
    {
      "riskName": "Project Complexity",
      "severity": "Low" | "Medium" | "High",
      "reason": "Why the project complexity is a risk",
      "mitigation": "How to enhance it"
    },
    {
      "riskName": "Deployment/Cloud Experience",
      "severity": "Low" | "Medium" | "High",
      "reason": "Missing cloud deployment",
      "mitigation": "Suggestions for deployment platforms"
    },
    {
      "riskName": "Resume Keyword Coverage",
      "severity": "Low" | "Medium" | "High",
      "reason": "ATS keywords alignment gaps",
      "mitigation": "ATS keyword suggestions"
    }
  ]
}`;

  try {
    const provider = req.aiProvider;
    const result = await provider.generateContent(prompt);
    
    if (!result || typeof result.text !== 'string') {
      throw new Error('Invalid response structure from AI provider');
    }
    
    let text = result.text.trim();

    // Strip markdown JSON fences
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      text = text.substring(startIndex, endIndex + 1);
    }

    let simulationData;
    try {
      simulationData = JSON.parse(text);
    } catch (parseErr) {
      console.error('Career Simulation JSON parse error:', parseErr.message);
      throw new ApiError(500, 'Failed to parse AI evaluation data. Please try again.');
    }

    const clamp = (val, min, max) => Math.max(min, Math.min(max, Number(val) || 0));

    // Save simulation record to DB
    const simulation = await CareerSimulation.create({
      userId,
      resumeId,
      jobRole,
      experienceLevel,
      readinessScore: clamp(simulationData.readinessScore ?? 70, 0, 100),
      pipelineStages: (simulationData.pipelineStages || []).map(stage => ({
        ...stage,
        successProbability: clamp(stage.successProbability ?? 0, 0, 100)
      })),
      skillGap: simulationData.skillGap || {},
      roadmap: simulationData.roadmap || [],
      riskAnalysis: simulationData.riskAnalysis || []
    });

    res.status(201).json({
      success: true,
      data: simulation
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Simulation generation failed: ${error.message}`);
  }
}));

export default router;
