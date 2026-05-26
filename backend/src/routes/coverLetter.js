import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/generate', verifyToken, extractAIProvider, aiRateLimiter, asyncHandler(async (req, res) => {
  const { resumeText, jobDescription, companyName, tone } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!jobDescription || !jobDescription.trim()) {
    throw new ApiError(400, 'Job description is required');
  }

  const normalizedTone = ['professional', 'casual', 'enthusiastic'].includes(tone?.toLowerCase())
    ? tone.toLowerCase()
    : 'professional';

  const company = companyName?.trim().slice(0, 100) || 'the company';

  const prompt = `You are an expert career coach and professional writer. Based on the candidate's resume and the target job description, generate three pieces of content.

TONE: ${normalizedTone}
COMPANY: ${company}

RESUME:
${resumeText.trim().slice(0, 4000)}

JOB DESCRIPTION:
${jobDescription.trim().slice(0, 3000)}

Return a JSON object with EXACTLY this structure:
{
  "coverLetter": "A professional cover letter (3-4 paragraphs). Include a compelling opening, highlight 2-3 key qualifications that match the JD, and close with enthusiasm. Address it to the hiring manager at ${company}.",
  "linkedinMessage": "A concise, personalized LinkedIn connection/outreach message (100-150 words) that references specific aspects of the role and shows genuine interest.",
  "elevatorPitch": "A 30-second elevator pitch (60-80 words) that summarizes who the candidate is, their key strengths, and what they're looking for."
}

Make sure each output is tailored to the specific job description and highlights the candidate's most relevant experience.
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

    let content;
    try {
      content = JSON.parse(text);
    } catch (parseErr) {
      console.error('Cover letter JSON parse error:', parseErr, 'Raw text:', text.slice(0, 500));
      throw new ApiError(502, 'AI returned an unexpected response format. Please try again.');
    }

    if (!content.coverLetter || !content.linkedinMessage || !content.elevatorPitch) {
      throw new ApiError(502, 'AI returned incomplete content. Please try again.');
    }

    res.json({
      success: true,
      data: {
        coverLetter: content.coverLetter,
        linkedinMessage: content.linkedinMessage,
        elevatorPitch: content.elevatorPitch,
        tone: normalizedTone,
        company,
      },
      provider: req.aiProvider.providerName,
      providerSource: req.aiProviderSource,
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Cover letter generation error:', error);
    throw new ApiError(500, 'Failed to generate cover letter. Please try again.');
  }
}));

export default router;
