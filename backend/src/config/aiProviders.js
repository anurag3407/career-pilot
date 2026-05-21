import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { OpenRouterAdapter } from './providers/openrouter.js';
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
/**
 * Mock provider used in dev mode when no API key is configured.
 * Returns clearly labelled placeholder responses so the UI remains functional.
 */
class MockDevProvider {
  constructor() {
    this.providerName = 'mock-dev';
  }

  async generateContent(prompt) {
    const isJson = prompt.includes('Return ONLY valid JSON') || prompt.includes('return ONLY valid JSON') || prompt.includes('ONLY a valid JSON');

    if (isJson) {
      // Return minimal valid JSON stubs for analysis endpoints
      if (prompt.includes('atsScore') || prompt.includes('ATS')) {
        return {
          text: JSON.stringify({
            atsScore: 72,
            scoreBreakdown: { keywordMatch: 70, formatting: 80, experienceRelevance: 75, skillsAlignment: 65, educationMatch: 70 },
            strengths: ['[DEV MODE] Good structure detected', '[DEV MODE] Clear section headers'],
            improvements: [{ category: 'Keywords', issue: '[DEV MODE] Add role-specific keywords', suggestion: 'Include job description terms', priority: 'high' }],
            missingKeywords: ['[dev-mode]'],
            summary: '[DEV MODE] Configure GEMINI_API_KEY for real ATS analysis.'
          })
        };
      }
      if (prompt.includes('overallGrade') || prompt.includes('comprehensive')) {
        return {
          text: JSON.stringify({
            overallGrade: 'B', overallScore: 72,
            executiveSummary: '[DEV MODE] Configure GEMINI_API_KEY for real analysis.',
            sectionGrades: {
              summary: { grade: 'B', score: 70, feedback: '[dev]' },
              experience: { grade: 'B', score: 72, feedback: '[dev]' },
              education: { grade: 'A', score: 85, feedback: '[dev]' },
              skills: { grade: 'C', score: 65, feedback: '[dev]' },
              projects: { grade: 'B', score: 75, feedback: '[dev]' }
            },
            bulletAnalysis: [], actionVerbAnalysis: { powerVerbsUsed: [], weakVerbsFound: [], verbScore: 60 },
            quantificationAnalysis: { bulletsWithMetrics: 0, bulletsWithoutMetrics: 0, percentageQuantified: 0, missedOpportunities: [] },
            industryKeywords: { present: [], missing: [], recommendations: ['[dev]'] },
            seniorTips: [{ category: 'General', tip: '[DEV MODE] Set GEMINI_API_KEY', priority: 'high', example: '' }],
            competitiveEdge: { score: 60, standoutFactors: ['[dev]'], differentiators: ['[dev]'] }
          })
        };
      }
      if (prompt.includes('bullets') || prompt.includes('bullet')) {
        return { text: JSON.stringify({ bullets: [], summary: { totalBullets: 0, averageScore: 0, bulletsNeedingWork: 0, topIssue: '[DEV MODE]' } }) };
      }
      if (prompt.includes('comparisons') || prompt.includes('before')) {
        return { text: JSON.stringify({ comparisons: [], impactSummary: '[DEV MODE] Set GEMINI_API_KEY', estimatedScoreIncrease: 0 }) };
      }
      return { text: '{"result": "[DEV MODE] Set GEMINI_API_KEY for real AI responses"}' };
    }

    // Plain text responses (enhance, summary, suggestions)
    if (prompt.includes('enhance the following resume') || prompt.includes('enhance') || prompt.includes('Harvard')) {
      return { text: `[DEV MODE — set GEMINI_API_KEY for real AI enhancement]\n\n${prompt.split('resume:\n\n')[1] || 'Resume content here'}` };
    }
    if (prompt.includes('professional summary')) {
      return { text: '[DEV MODE] Configure GEMINI_API_KEY to generate a real professional summary.' };
    }
    return { text: '[DEV MODE] Configure GEMINI_API_KEY in your .env file to enable AI features.' };
  }

  async *generateContentStream(prompt) {
    const text = '[DEV MODE] Configure GEMINI_API_KEY to enable AI streaming.';
    yield { text, fullText: text };
    yield { done: true };
  }
}

export function getDefaultProvider() {
  if (_defaultProvider) return _defaultProvider;

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    if (process.env.NODE_ENV === 'production') {
      const err = new Error('Server AI key is not configured. Please set GEMINI_API_KEY or supply your own key via X-AI-Key.');
      err.statusCode = 503;
      throw err;
    }
    console.warn('⚠️  GEMINI_API_KEY is not set — using mock provider (development only). AI responses will be stubs.');
    _defaultProvider = new MockDevProvider();
    return _defaultProvider;
  }

  _defaultProvider = createAIProvider('gemini', geminiApiKey);
  return _defaultProvider;
}
