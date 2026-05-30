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
export const extractAIProvider = async (req, res, next) => {
  try {
    const providerHeader = req.headers['x-ai-provider'];
    const apiKeyHeader   = req.headers['x-ai-key'];
    const modelHeader    = req.headers['x-ai-model'];
    const openRouterKeyHeader = req.headers['x-openrouter-key'];

    // --- Case 1a: User supplies OpenRouter key via BYOK PKCE flow ---
    if (openRouterKeyHeader) {
      req.aiProvider = AIProviderFactory.create('openrouter', openRouterKeyHeader);
      req.aiProviderSource = 'user_openrouter_pkce';
      return next();
    }

    // --- Case 1: User supplies both provider + key via headers (Legacy/API fallback) ---
    if (providerHeader && apiKeyHeader) {
      const provider = providerHeader.toLowerCase().trim();

      if (!SUPPORTED_PROVIDERS.includes(provider)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported AI provider "${providerHeader}". Supported: ${SUPPORTED_PROVIDERS.join(', ')}`,
        });
      }

      req.aiProvider = AIProviderFactory.create(provider, apiKeyHeader, modelHeader);
      req.aiProviderSource = 'user_header';
      return next();
    }

    // --- Case 2: No custom headers – fall back to server-side .env key ---
    try {
      req.aiProvider = getDefaultProvider();
      req.aiProviderSource = 'server_default';
      return next();
    } catch (fallbackError) {
      // No server-side key configured either — reject gracefully
      return res.status(403).json({
        success: false,
        error: 'API key is required. Please add your API key in Settings to use this feature.',
        requireApiKey: true
      });
    }
  } catch (error) {
    console.error('AI provider middleware error:', error.message);
    return res.status(500).json({
      success: false,
      error: `Failed to initialize AI provider: ${error.message}`,
    });
  }
};
