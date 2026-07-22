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
    if (provider?.toLowerCase() === 'requesty') {
        try {
            const response = await fetch('https://router.requesty.ai/v1/models');
            if (!response.ok) {
                throw new Error(`Requesty models API returned ${response.status}`);
            }
            const data = await response.json();

            // Transform Requesty model data (OpenAI-compatible shape)
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
            console.error('Fetch Requesty Models Error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch Requesty models'
            });
        }
    }

    res.status(200).json({
        success: true,
        models: []
    });
});

// ---------------------------------------------------------------------------
// POST /ai/validate-key — test if a user-supplied API key is valid
// Makes a lightweight "list models" call to the provider's API (no tokens used)
// ---------------------------------------------------------------------------
router.post('/validate-key', verifyToken, async (req, res) => {
    const { provider, apiKey, baseUrl } = req.body;

    if (!provider || (!apiKey && provider !== 'custom')) {
        return res.status(400).json({
            success: false,
            valid: false,
            error: 'Provider and API key are required'
        });
    }

    const normalised = provider.toLowerCase().trim();

    try {
        let valid = false;
        let meta = {};

        switch (normalised) {
            case 'gemini': {
                // Google AI Studio — list models endpoint (free, no token usage)
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(apiKey)}`
                );
                if (response.ok) {
                    const data = await response.json();
                    valid = true;
                    meta.models = (data.models || []).length;
                } else if (response.status === 400 || response.status === 403) {
                    return res.json({ success: true, valid: false, error: 'Invalid API key — check your Gemini key at aistudio.google.com' });
                } else {
                    return res.json({ success: true, valid: false, error: `Gemini returned status ${response.status}` });
                }
                break;
            }

            case 'openai': {
                const response = await fetch('https://api.openai.com/v1/models', {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    valid = true;
                    meta.models = (data.data || []).length;
                } else if (response.status === 401) {
                    return res.json({ success: true, valid: false, error: 'Invalid API key — check your OpenAI key at platform.openai.com' });
                } else {
                    return res.json({ success: true, valid: false, error: `OpenAI returned status ${response.status}` });
                }
                break;
            }

            case 'openrouter': {
                const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    valid = true;
                    meta.label = data.data?.label || 'API Key';
                    meta.usage = data.data?.usage;
                } else if (response.status === 401 || response.status === 403) {
                    return res.json({ success: true, valid: false, error: 'Invalid API key — check your OpenRouter key at openrouter.ai/keys' });
                } else {
                    return res.json({ success: true, valid: false, error: `OpenRouter returned status ${response.status}` });
                }
                break;
            }

            case 'groq': {
                const response = await fetch('https://api.groq.com/openai/v1/models', {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    valid = true;
                    meta.models = (data.data || []).length;
                } else if (response.status === 401) {
                    return res.json({ success: true, valid: false, error: 'Invalid API key — check your Groq key at console.groq.com' });
                } else {
                    return res.json({ success: true, valid: false, error: `Groq returned status ${response.status}` });
                }
                break;
            }

            case 'requesty': {
                const response = await fetch('https://router.requesty.ai/v1/models', {
                    headers: { 'Authorization': `Bearer ${apiKey}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    valid = true;
                    meta.models = (data.data || []).length;
                } else if (response.status === 401 || response.status === 403) {
                    return res.json({ success: true, valid: false, error: 'Invalid API key — check your Requesty key at app.requesty.ai/api-keys' });
                } else {
                    return res.json({ success: true, valid: false, error: `Requesty returned status ${response.status}` });
                }
                break;
            }

            case 'custom': {
                if (!baseUrl) {
                    return res.json({ success: true, valid: false, error: 'Base URL is required for custom endpoints' });
                }
                try {
                    const url = baseUrl.endsWith('/') ? `${baseUrl}models` : `${baseUrl}/models`;
                    const headers = {};
                    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
                    
                    const response = await fetch(url, { headers });
                    if (response.ok) {
                        valid = true;
                    } else if (response.status === 401) {
                        return res.json({ success: true, valid: false, error: 'Invalid API key for custom endpoint' });
                    } else {
                        // If it's reachable but returns something else (e.g. 404 for missing /models route), 
                        // we still consider it valid as a reachable endpoint.
                        valid = true;
                    }
                } catch (e) {
                    return res.json({ success: true, valid: false, error: `Could not connect to custom endpoint: ${e.message}` });
                }
                break;
            }

            default:
                return res.status(400).json({
                    success: false,
                    valid: false,
                    error: `Unsupported provider "${provider}". Supported: gemini, openai, openrouter, requesty, groq, custom`
                });
        }

        return res.json({ success: true, valid, meta });
    } catch (error) {
        console.error(`Validate key error (${normalised}):`, error.message);
        return res.status(500).json({
            success: false,
            valid: false,
            error: `Failed to validate key: ${error.message}`
        });
    }
});

export default router;
