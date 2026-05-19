import { AIProviderFactory, getDefaultProvider, SUPPORTED_PROVIDERS } from '../config/aiProviders.js';

/**
 * Middleware: extractAIProvider
 *
 * Reads optional AI provider configuration from request headers and attaches
 * an AI adapter instance to `req.aiProvider`.
 *
 * Headers consumed:
 *   X-AI-Provider  – provider name (gemini | openai | openrouter | groq)
 *   X-AI-Key       – the user's API key for the chosen provider
 *   X-AI-Model     – (optional) model name override
 *
 * Fallback behaviour:
 *   If no headers are supplied the server-side Gemini key (GEMINI_API_KEY)
 *   is used automatically, so existing behaviour is fully preserved.
 */
export const extractAIProvider = (req, res, next) => {
  try {
    const providerHeader = req.headers['x-ai-provider'];
    const apiKeyHeader   = req.headers['x-ai-key'];
    const modelHeader    = req.headers['x-ai-model'];

    // --- Case 1: User supplies both provider + key ---
    if (providerHeader && apiKeyHeader) {
      const provider = providerHeader.toLowerCase().trim();

      if (!SUPPORTED_PROVIDERS.includes(provider)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported AI provider "${providerHeader}". Supported: ${SUPPORTED_PROVIDERS.join(', ')}`,
        });
      }

      req.aiProvider = AIProviderFactory.create(provider, apiKeyHeader, modelHeader);
      req.aiProviderSource = 'user';
      return next();
    }

    // --- Case 2: Only one header supplied (incomplete) ---
    if ((providerHeader && !apiKeyHeader) || (!providerHeader && apiKeyHeader)) {
      return res.status(400).json({
        success: false,
        error: 'Both X-AI-Provider and X-AI-Key headers must be provided together.',
      });
    }

    // --- Case 3: No custom headers – fall back to server Gemini key ---
    req.aiProvider = getDefaultProvider();
    req.aiProviderSource = 'server';
    return next();
  } catch (error) {
    console.error('AI provider middleware error:', error.message);
    return res.status(500).json({
      success: false,
      error: `Failed to initialize AI provider: ${error.message}`,
    });
  }
};
