import express from 'express';
import { generateHeadline } from '../services/ai/linkedinHelper.js';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
const router = express.Router();

router.post('/linkedin-headline', verifyToken, extractAIProvider, async (req, res) => {
    try {
        const portfolioData = req.body;

        // Basic validation
        if (!portfolioData || Object.keys(portfolioData).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Portfolio data is required'
            });
        }

        const headlines = await generateHeadline(portfolioData, req.aiProvider);

        res.status(200).json({
            success: true,
            headlines
        });
    } catch (error) {
        console.error('LinkedIn Headline Generation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate headlines'
        });
    }
});

router.get('/models', verifyToken, async (req, res) => {
    const { provider } = req.query;

    if (provider?.toLowerCase() === 'openrouter') {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/models');
            if (!response.ok) {
                throw new Error(`OpenRouter models API returned ${response.status}`);
            }
            const data = await response.json();

            // Transform OpenRouter model data
            const models = (data.data || []).map(model => ({
                id: model.id,
                name: model.name || model.id,
                description: model.description || '',
                pricing: model.pricing || null,
                context_length: model.context_length || 0
            }));

            return res.status(200).json({
                success: true,
                models
            });
        } catch (error) {
            console.error('Fetch OpenRouter Models Error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch OpenRouter models'
            });
        }
    }

    // Fallback/other providers can be added here
    res.status(200).json({
        success: true,
        models: []
    });
});

export default router;
