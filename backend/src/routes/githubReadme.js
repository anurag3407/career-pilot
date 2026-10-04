import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { generateReadme } from '../services/readmeGenerator.js';

const router = express.Router();

router.post('/generate', verifyToken, aiRateLimiter, extractAIProvider, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const markdown = await generateReadme(prompt, req.aiProvider);
    res.json({ success: true, markdown });
  } catch (error) {
    console.error('Readme generator error:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate README' });
  }
});

export default router;
