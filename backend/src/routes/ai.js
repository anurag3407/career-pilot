import express from 'express';
import { generateHeadline } from '../services/ai/linkedinHelper.js';

const router = express.Router();

router.post('/linkedin-headline', async (req, res) => {
    try {
        const portfolioData = req.body;
        
        // Basic validation
        if (!portfolioData || Object.keys(portfolioData).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Portfolio data is required'
            });
        }
        
        const headlines = await generateHeadline(portfolioData);
        
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

export default router;
