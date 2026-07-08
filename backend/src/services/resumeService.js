import { computeATSScore } from './atsScorer.js';
import { ApiError } from '../middleware/errorHandler.js';

export const scoreResumeText = async (resumeText, targetRole = 'Software Engineer', provider) => {
  // 1. Get deterministic scores
  const deterministicScoring = computeATSScore(resumeText, targetRole);

  // 2. Get qualitative feedback via AI
  const prompt = `Analyze this resume for a ${targetRole} position and return a JSON object with EXACTLY these fields:
- sections: object with keys "summary", "skills", "experience", "education", "projects" — each containing:
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
    console.error('Resume score JSON parse error:', parseErr, 'Raw text:', text);
    throw new ApiError(
      502,
      'AI service returned an invalid response. Please try again in a moment.'
    );
  }

  // 3. Map into the format expected by the frontend
  const scoreData = {
    overallScore: deterministicScoring.overallScore,
    sections: {
      summary: { 
        score: deterministicScoring.breakdown.formatting, 
        feedback: qualitativeData.sections?.summary?.feedback || 'Good formatting.' 
      },
      skills: { 
        score: deterministicScoring.breakdown.skills, 
        feedback: qualitativeData.sections?.skills?.feedback || 'Include more role-specific skills.' 
      },
      experience: { 
        score: deterministicScoring.breakdown.experience, 
        feedback: qualitativeData.sections?.experience?.feedback || 'Add metrics.' 
      },
      education: { 
        score: 80, // Default good score for education
        feedback: qualitativeData.sections?.education?.feedback || 'Good.' 
      },
      projects: { 
        score: deterministicScoring.breakdown.keywordMatch, 
        feedback: qualitativeData.sections?.projects?.feedback || 'Good.' 
      }
    },
    topSuggestions: qualitativeData.topSuggestions || [
      'Add more quantifiable metrics to your experience.',
      'Tailor keywords to the specific job role.',
      'Ensure formatting is clean and easy to read.'
    ]
  };

  return scoreData;
};
