import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/generate', verifyToken, extractAIProvider, aiRateLimiter, asyncHandler(async (req, res) => {
  const { targetRole, currentSkills, yearsOfExperience } = req.body;

  if (!targetRole || !targetRole.trim()) {
    throw new ApiError(400, 'Target role is required');
  }

  const skills = Array.isArray(currentSkills) ? currentSkills.filter(s => typeof s === 'string' && s.trim()).slice(0, 15) : [];
  const experience = typeof yearsOfExperience === 'number' && Number.isFinite(yearsOfExperience) && yearsOfExperience >= 0
    ? Math.min(Math.floor(yearsOfExperience), 50)
    : 0;

  const prompt = `You are an expert career advisor. Generate a detailed, actionable career roadmap for someone who wants to become a "${targetRole.trim().slice(0, 100)}".

Current skills: ${skills.length > 0 ? skills.join(', ') : 'None specified'}
Years of experience: ${experience}

Return a JSON object with EXACTLY this structure:
{
  "title": "Roadmap to [Target Role]",
  "estimatedDuration": "X-Y months",
  "phases": [
    {
      "id": 1,
      "title": "Phase title",
      "duration": "X weeks/months",
      "description": "Brief description of this phase",
      "skills": ["skill1", "skill2", "skill3"],
      "milestones": [
        "Milestone 1 description",
        "Milestone 2 description"
      ],
      "resources": [
        { "title": "Resource name", "type": "course/book/tutorial/project", "url": "" }
      ],
      "difficulty": "beginner/intermediate/advanced"
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Generate 4-6 phases. Each phase should have 3-5 skills, 2-3 milestones, and 2-3 resources.
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

    let roadmap;
    try {
      roadmap = JSON.parse(text);
    } catch (parseErr) {
      console.error('Career roadmap JSON parse error:', parseErr, 'Raw text:', text.slice(0, 500));
      throw new ApiError(502, 'AI returned an unexpected response format. Please try again.');
    }

    if (!roadmap.phases || !Array.isArray(roadmap.phases) || roadmap.phases.length === 0) {
      throw new ApiError(502, 'AI returned an incomplete roadmap. Please try again.');
    }

    res.json({
      success: true,
      data: roadmap,
      provider: req.aiProvider.providerName,
      providerSource: req.aiProviderSource,
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Career roadmap generation error:', error);
    throw new ApiError(500, 'Failed to generate career roadmap. Please try again.');
  }
}));

export default router;
