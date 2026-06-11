// backend/services/aiEngine/index.js
// Entry point for the AI ATS & Career Intelligence Engine pipeline

const { parseResume } = require('./parseResume');
const { extractSkills } = require('./extractSkills');
const { computeATSScore } = require('./atsScore');
const { generateRoadmap } = require('./roadmapGenerator');

/**
 * Orchestrates the full analysis workflow.
 * @param {string} pdfUrl - Firebase Storage URL of the uploaded resume PDF.
 * @param {string} userId - Firebase UID of the user.
 * @returns {Promise<Object>} analysis result containing ATS score, skills, missing skills and roadmap.
 */
async function runAnalysis(pdfUrl, userId) {
  // 1. Extract raw text from PDF
  const rawText = await parseResume(pdfUrl);

  // 2. Extract skills and inferred role via Gemini
  const { skills, role, experienceYears } = await extractSkills(rawText);

  // 3. Compute ATS score against a curated keyword set
  const atsScore = computeATSScore(skills);

  // 4. Determine missing high‑impact skills
  const missingSkills = await extractSkills.missingSkills(skills);

  // 5. Generate personalized career roadmap
  const roadmap = await generateRoadmap({ role, missingSkills, experienceYears });

  return {
    atsScore,
    extractedSkills: skills,
    missingSkills,
    roadmap,
    role,
    experienceYears,
  };
}

module.exports = { runAnalysis };
