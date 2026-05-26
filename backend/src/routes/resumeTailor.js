import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/analyze', verifyToken, extractAIProvider, aiRateLimiter, asyncHandler(async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!jobDescription || !jobDescription.trim()) {
    throw new ApiError(400, 'Job description is required');
  }

  const prompt = `You are an expert ATS optimization specialist and resume coach. Analyze the candidate's resume against the target job description.

RESUME:
${resumeText.trim().slice(0, 4000)}

JOB DESCRIPTION:
${jobDescription.trim().slice(0, 3000)}

Return a JSON object with EXACTLY this structure:
{
  "matchScore": 72,
  "summary": "Brief 1-2 sentence summary of the match quality",
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "tailoredBullets": [
    {
      "original": "Original bullet point from resume",
      "tailored": "Rewritten bullet point optimized for this JD",
      "reasoning": "Brief explanation of what was changed and why"
    }
  ],
  "suggestions": [
    "Actionable suggestion 1",
    "Actionable suggestion 2",
    "Actionable suggestion 3"
  ]
}

Rules:
- matchScore should be 0-100 based on how well the resume matches the JD
- matchedKeywords: important JD keywords/skills found in the resume (5-10 items)
- missingKeywords: important JD keywords/skills NOT found in the resume (5-10 items)
- tailoredBullets: rewrite 3-5 of the weakest bullet points to better match the JD
- suggestions: provide 3-5 specific, actionable improvements

Return ONLY valid JSON. No markdown fences, no extra text.`;

  try {
    const provider = req.aiProvider;
    const result = await provider.generateContent(prompt);
    let text = result.text.trim();

    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) text = jsonMatch[0];

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseErr) {
      console.error('Resume tailor JSON parse error:', parseErr, 'Raw text:', text.slice(0, 500));
      throw new ApiError(502, 'AI returned an unexpected response format. Please try again.');
    }

    const sanitized = {
      matchScore: typeof analysis.matchScore === 'number' ? Math.min(100, Math.max(0, Math.round(analysis.matchScore))) : 50,
      summary: analysis.summary || 'Analysis complete.',
      matchedKeywords: Array.isArray(analysis.matchedKeywords) ? analysis.matchedKeywords.filter(k => typeof k === 'string').slice(0, 15) : [],
      missingKeywords: Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords.filter(k => typeof k === 'string').slice(0, 15) : [],
      tailoredBullets: Array.isArray(analysis.tailoredBullets) ? analysis.tailoredBullets.filter(b => b.original && b.tailored).slice(0, 8) : [],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions.filter(s => typeof s === 'string').slice(0, 8) : [],
    };

    res.json({
      success: true,
      data: sanitized,
      provider: req.aiProvider.providerName,
      providerSource: req.aiProviderSource,
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Resume tailor analysis error:', error);
    throw new ApiError(500, 'Failed to analyze resume. Please try again.');
  }
}));

export default router;
