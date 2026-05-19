import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// ---------------------------------------------------------------------------
// Supported provider identifiers
// ---------------------------------------------------------------------------
export const SUPPORTED_PROVIDERS = ['gemini', 'openai', 'openrouter', 'groq'];

// Default model names per provider (used when caller doesn't specify one)
const DEFAULT_MODELS = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o-mini',
  openrouter: 'openai/gpt-4o-mini',   // OpenRouter uses "org/model" format
  groq: 'llama-3.3-70b-versatile',
};

// ---------------------------------------------------------------------------
// Individual provider adapters
// Each adapter exposes:
//   async generateContent(prompt) => Promise<{ text: string, usage?: { prompt, completion, total } }>
// ---------------------------------------------------------------------------

/**
 * Adapter for Google Gemini (via @google/generative-ai SDK).
 */
class GeminiAdapter {
  constructor(apiKey, modelName) {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: modelName || DEFAULT_MODELS.gemini });
    this.providerName = 'gemini';
  }

  async generateContent(prompt) {
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const um = response.usageMetadata;
    const usage = um
      ? {
          prompt: um.promptTokenCount ?? 0,
          completion: um.candidatesTokenCount ?? 0,
          total: um.totalTokenCount ?? 0,
        }
      : undefined;
    return { text, usage };
  }
}

/**
 * Adapter for OpenAI (via official openai SDK).
 */
class OpenAIAdapter {
  constructor(apiKey, modelName) {
    this.client = new OpenAI({ apiKey });
    this.modelName = modelName || DEFAULT_MODELS.openai;
    this.providerName = 'openai';
  }

  async generateContent(prompt) {
    const completion = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    const u = completion.usage;
    const usage = u
      ? {
          prompt: u.prompt_tokens ?? 0,
          completion: u.completion_tokens ?? 0,
          total: u.total_tokens ?? 0,
        }
      : undefined;
    return { text: completion.choices[0]?.message?.content || '', usage };
  }
}

/**
 * Adapter for OpenRouter (OpenAI-compatible endpoint via openai SDK).
 */
class OpenRouterAdapter {
  constructor(apiKey, modelName) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'CareerPilot',
      },
    });
    this.modelName = modelName || DEFAULT_MODELS.openrouter;
    this.providerName = 'openrouter';
  }

  async generateContent(prompt) {
    const completion = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });
    const u = completion.usage;
    const usage = u
      ? {
          prompt: u.prompt_tokens ?? 0,
          completion: u.completion_tokens ?? 0,
          total: u.total_tokens ?? 0,
        }
      : undefined;
    return { text: completion.choices[0]?.message?.content || '', usage };
  }
}

/**
 * Adapter for Groq (via groq-sdk).
 */
class GroqAdapter {
  constructor(apiKey, modelName) {
    this.client = new Groq({ apiKey });
    this.modelName = modelName || DEFAULT_MODELS.groq;
    this.providerName = 'groq';
  }

  async generateContent(prompt) {
    const completion = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    });
    const u = completion.usage;
    const usage = u
      ? {
          prompt: u.prompt_tokens ?? 0,
          completion: u.completion_tokens ?? 0,
          total: u.total_tokens ?? 0,
        }
      : undefined;
    return { text: completion.choices[0]?.message?.content || '', usage };
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates an AI provider adapter based on the given provider name and API key.
 *
 * @param {string} provider  - One of 'gemini' | 'openai' | 'openrouter' | 'groq'
 * @param {string} apiKey    - The API key for the chosen provider
 * @param {string} [modelName] - Optional override for the model name
 * @returns {{ generateContent(prompt: string): Promise<{ text: string, usage?: { prompt: number, completion: number, total: number } }>, providerName: string }}
 */
export function createAIProvider(provider, apiKey, modelName) {
  const normalised = (provider || '').toLowerCase().trim();

  switch (normalised) {
    case 'gemini':
      return new GeminiAdapter(apiKey, modelName);
    case 'openai':
      return new OpenAIAdapter(apiKey, modelName);
    case 'openrouter':
      return new OpenRouterAdapter(apiKey, modelName);
    case 'groq':
      return new GroqAdapter(apiKey, modelName);
    default:
      throw new Error(
        `Unsupported AI provider "${provider}". Supported providers: ${SUPPORTED_PROVIDERS.join(', ')}`
      );
  }
}

/**
 * Named factory for multi-provider SDK selection (same as createAIProvider).
 */
export const AIProviderFactory = {
  create: createAIProvider,
  supportedProviders: SUPPORTED_PROVIDERS,
};

// ---------------------------------------------------------------------------
// Default (server-side) Gemini instance – used as the fallback
// ---------------------------------------------------------------------------

let _defaultProvider = null;

/**
 * Returns the default server-side Gemini provider (lazy-initialised).
 * Throws if GEMINI_API_KEY is not set.
 */
export function getDefaultProvider() {
  if (_defaultProvider) return _defaultProvider;

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error('❌ GEMINI_API_KEY is missing. Aborting AI initialization.');
    throw new Error('GEMINI_API_KEY is required to start the AI services.');
  }

  _defaultProvider = createAIProvider('gemini', geminiApiKey);
  return _defaultProvider;
}
