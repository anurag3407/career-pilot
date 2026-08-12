import { computeATSScore } from './atsScorer.js';
import { ApiError } from '../middleware/errorHandler.js';

export const scoreResumeText = async (resumeText, targetRole = 'Software Engineer', provider) => {
  // 1. Get deterministic scores
  const deterministicScoring = computeATSScore(resumeText, targetRole);

  // 2. Get qualitative feedback via AI
  const prompt = `Analyze this resume for a ${targetRole} position and return a JSON object with EXACTLY these fields:
- sections: object with keys "summary", "skills", "experience", "education", "projects" — each containing:
    - score (number, 0-100)
    - feedback (string, one concise sentence of constructive feedback)
- topSuggestions: array of exactly 3 strings, each a specific actionable improvement tip

Resume:
${resumeText}

Return ONLY valid JSON. No markdown fences, no extra text.`;

  const result = await provider.generateContent(prompt);
  let text = result.text.trim();

  // Strip markdown fences
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }
  
  // Attempt extra extraction
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) text = jsonMatch[0];

  let qualitativeData;
  try {
    qualitativeData = JSON.parse(text);
  } catch (parseErr) {
    console.error('Resume score JSON parse error:', parseErr.message);
    throw new ApiError(
      502,
      'AI service returned an invalid response. Please try again in a moment.'
    );
  }

  // Validate the parsed structure
  if (!qualitativeData || typeof qualitativeData !== 'object') {
    throw new ApiError(502, 'AI service returned an invalid response format.');
  }

  const requiredSections = ['summary', 'skills', 'experience', 'education', 'projects'];
  if (!qualitativeData.sections || typeof qualitativeData.sections !== 'object') {
    throw new ApiError(502, 'AI service returned missing or invalid sections data.');
  }

  for (const key of requiredSections) {
    const sec = qualitativeData.sections[key];
    if (!sec || typeof sec.score !== 'number' || typeof sec.feedback !== 'string') {
      throw new ApiError(502, `AI service returned invalid data for section: ${key}`);
    }
  }

  if (!Array.isArray(qualitativeData.topSuggestions) || qualitativeData.topSuggestions.length !== 3 || qualitativeData.topSuggestions.some(s => typeof s !== 'string')) {
    throw new ApiError(502, 'AI service returned invalid top suggestions format.');
  }

  // 3. Map into the format expected by the frontend
  const scoreData = {
    overallScore: deterministicScoring.overallScore,
    sections: {
      summary: { 
        score: qualitativeData.sections.summary.score, 
        feedback: qualitativeData.sections.summary.feedback
      },
      skills: { 
        score: qualitativeData.sections.skills.score, 
        feedback: qualitativeData.sections.skills.feedback
      },
      experience: { 
        score: qualitativeData.sections.experience.score, 
        feedback: qualitativeData.sections.experience.feedback
      },
      education: { 
        score: qualitativeData.sections.education.score,
        feedback: qualitativeData.sections.education.feedback
      },
      projects: { 
        score: qualitativeData.sections.projects.score, 
        feedback: qualitativeData.sections.projects.feedback
      }
    },
    topSuggestions: qualitativeData.topSuggestions
  };

  return scoreData;
};
