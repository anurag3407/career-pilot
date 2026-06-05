import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { OpenRouterAdapter } from './providers/openrouter.js';
import { ApiError } from '../middleware/errorHandler.js';
import { aiCallsCounter } from '../middleware/metrics.js';

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
    if (!apiKey) {
      throw new Error(
        'Gemini API key is required. ' +
        'Set GEMINI_API_KEY in your .env file or provide it via the X-AI-Key header.'
      );
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: modelName || DEFAULT_MODELS.gemini });
    this.providerName = 'gemini';
  }

  async generateContent(prompt) {
    aiCallsCounter.inc({ provider: this.providerName });
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

  async *generateContentStream(prompt) {
    const result = await this.model.generateContentStream(prompt);
    let fullText = '';
    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullText += text;
      yield { text, fullText };
    }
    const response = await result.response;
    const um = response.usageMetadata;
    yield { done: true, usage: um ? { prompt: um.promptTokenCount ?? 0, completion: um.candidatesTokenCount ?? 0, total: um.totalTokenCount ?? 0 } : undefined };
  }
}

/**
 * Adapter for OpenAI (via official openai SDK).
 */
class OpenAIAdapter {
  constructor(apiKey, modelName) {
    if (!apiKey) {
      throw new Error(
        'OpenAI API key is required. ' +
        'Set OPENAI_API_KEY in your .env file or provide it via the X-AI-Key header.'
      );
    }
    this.client = new OpenAI({ apiKey });
    this.modelName = modelName || DEFAULT_MODELS.openai;
    this.providerName = 'openai';
  }

  async generateContent(prompt) {
    aiCallsCounter.inc({ provider: this.providerName });
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

  async *generateContentStream(prompt) {
    const completion = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      stream: true,
    });
    let fullText = '';
    for await (const chunk of completion) {
      const text = chunk.choices[0]?.delta?.content || '';
      fullText += text;
      yield { text, fullText };
    }
    const u = completion.usage;
    yield { done: true, usage: u ? { prompt: u.prompt_tokens ?? 0, completion: u.completion_tokens ?? 0, total: u.total_tokens ?? 0 } : undefined };
  }
}


/**
 * Adapter for Groq (via groq-sdk).
 */
class GroqAdapter {
  constructor(apiKey, modelName) {
    if (!apiKey) {
      throw new Error(
        'Groq API key is required. ' +
        'Set GROQ_API_KEY in your .env file or provide it via the X-AI-Key header.'
      );
    }
    this.client = new Groq({ apiKey });
    this.modelName = modelName || DEFAULT_MODELS.groq;
    this.providerName = 'groq';
  }

  async generateContent(prompt) {
    aiCallsCounter.inc({ provider: this.providerName });
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

  async *generateContentStream(prompt) {
    const completion = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true,
    });
    let fullText = '';
    for await (const chunk of completion) {
      const text = chunk.choices[0]?.delta?.content || '';
      fullText += text;
      yield { text, fullText };
    }
    const u = completion.usage;
    yield { done: true, usage: u ? { prompt: u.prompt_tokens ?? 0, completion: u.completion_tokens ?? 0, total: u.total_tokens ?? 0 } : undefined };
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
    throw new ApiError(
      503,
      'AI features are unavailable — GEMINI_API_KEY is not configured. ' +
      'Set it in your .env file or supply your own key via the X-AI-Key header.'
    );
  }

  _defaultProvider = createAIProvider('gemini', geminiApiKey);
  return _defaultProvider;
}
