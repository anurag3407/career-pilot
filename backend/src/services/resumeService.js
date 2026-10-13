import { getDefaultProvider } from '../config/aiProviders.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Analyzes a resume using AI and returns a structured score with feedback
 * @param {string} resumeText - The resume text to analyze
 * @returns {Promise<Object>} - The analysis result with scores and feedback
 */
export async function analyzeResume(resumeText) {
  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  try {
    const provider = getDefaultProvider();
    
    const prompt = `You are an expert resume analyst. Analyze the following resume and provide a detailed evaluation.

Return ONLY a valid JSON object with this exact structure:
{
  "overallScore": number (0-100),
  "sections": {
    "summary": {
      "score": number (0-100),
      "feedback": "string (brief feedback)"
    },
    "skills": {
      "score": number (0-100),
      "feedback": "string (brief feedback)"
    },
    "experience": {
      "score": number (0-100),
      "feedback": "string (brief feedback)"
    },
    "education": {
      "score": number (0-100),
      "feedback": "string (brief feedback)"
    },
    "projects": {
      "score": number (0-100),
      "feedback": "string (brief feedback)"
    }
  },
  "topSuggestions": [
    "string (actionable suggestion)",
    "string (actionable suggestion)",
    "string (actionable suggestion)"
  ]
}

Scoring criteria:
- Overall score should reflect the resume's overall quality
- Each section should be scored independently (0-100)
- Feedback should be specific and actionable
- Top suggestions should be the most important improvements needed
- Be honest but constructive in your assessment

Resume text:
${resumeText}`;

    const result = await provider.generateContent(prompt);
    
    // Strip markdown code blocks if present
    let jsonText = result.text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    // Parse the JSON response
    const analysisData = JSON.parse(jsonText);

    // Validate the structure
    if (!analysisData.overallScore || typeof analysisData.overallScore !== 'number') {
      throw new Error('Invalid response: missing or invalid overallScore');
    }

    if (!analysisData.sections || typeof analysisData.sections !== 'object') {
      throw new Error('Invalid response: missing or invalid sections');
    }

    const requiredSections = ['summary', 'skills', 'experience', 'education', 'projects'];
    for (const section of requiredSections) {
      if (!analysisData.sections[section] || typeof analysisData.sections[section].score !== 'number') {
        throw new Error(`Invalid response: missing or invalid ${section} section`);
      }
    }

    if (!analysisData.topSuggestions || !Array.isArray(analysisData.topSuggestions)) {
      throw new Error('Invalid response: missing or invalid topSuggestions');
    }

    return analysisData;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    
    // If JSON parsing failed, it's likely the AI didn't return valid JSON
    if (error instanceof SyntaxError) {
      throw new ApiError(500, 'Failed to analyze resume: AI returned invalid JSON format');
    }
    
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Generic error
    throw new ApiError(500, 'Failed to analyze resume');
  }
}
