import OpenAI from 'openai';
import { aiCallsCounter } from '../../middleware/metrics.js';

// Exponential backoff helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async (fn, maxRetries = 3, baseDelayMs = 1000) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      const isSocketError = 
        error?.code === 'ECONNRESET' ||
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'ENOTFOUND' ||
        error?.code === 'ECONNREFUSED' ||
        error?.message?.toLowerCase().includes('socket') ||
        error?.message?.toLowerCase().includes('fetch failed');

      // 429 rate limit or transient socket errors
      if ((error?.status === 429 || isSocketError) && attempt < maxRetries - 1) {
        attempt++;
        const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
        console.warn(`OpenRouter network/rate error (${error?.message || error?.status}). Retrying in ${Math.round(delay)}ms... (Attempt ${attempt}/${maxRetries - 1})`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
};

/**
 * Adapter for OpenRouter (OpenAI-compatible endpoint via openai SDK).
 */
export class OpenRouterAdapter {
  constructor(apiKey, modelName) {
    if (!apiKey) {
      throw new Error(
        'OpenRouter API key is required. ' +
        'Set OPENROUTER_API_KEY in your .env file or provide it via the X-OpenRouter-Key header.'
      );
    }
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'CareerPilot',
      },
    });
    this.modelName = modelName || 'openai/gpt-4o-mini';
    this.providerName = 'openrouter';
  }

  async generateContent(prompt) {
    try {
      aiCallsCounter.inc({ provider: this.providerName });
      const completion = await withRetry(() => 
        this.client.chat.completions.create({
          model: this.modelName,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        })
      );
      
      const u = completion.usage;
      const usage = u
        ? {
            prompt: u.prompt_tokens ?? 0,
            completion: u.completion_tokens ?? 0,
            total: u.total_tokens ?? 0,
          }
        : undefined;
        
      return { text: completion.choices[0]?.message?.content || '', usage };
    } catch (error) {
      console.error('OpenRouter generateContent Error:', error);
      
      // Handle known errors gracefully
      if (error?.status === 401) {
        throw new Error('OpenRouter API Key is invalid or unauthorized.');
      }
      if (error?.status === 402) {
        throw new Error('OpenRouter account has insufficient credits.');
      }
      if (error?.status === 429) {
        throw new Error('OpenRouter rate limit exceeded. Please try again later.');
      }
      
      throw new Error(`OpenRouter API Error: ${error.message}`);
    }
  }

  async *generateContentStream(prompt) {
    try {
      const completion = await withRetry(() =>
        this.client.chat.completions.create({
          model: this.modelName,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          stream: true,
        })
      );
      let fullText = '';
      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content || '';
        fullText += text;
        yield { text, fullText };
      }
      const u = completion.usage;
      yield { done: true, usage: u ? { prompt: u.prompt_tokens ?? 0, completion: u.completion_tokens ?? 0, total: u.total_tokens ?? 0 } : undefined };
    } catch (error) {
      console.error('OpenRouter generateContentStream Error:', error);
      if (error?.status === 401) throw new Error('OpenRouter API Key is invalid.');
      if (error?.status === 402) throw new Error('OpenRouter account has insufficient credits.');
      if (error?.status === 429) throw new Error('OpenRouter rate limit exceeded.');
      throw new Error(`OpenRouter API Error: ${error.message}`);
    }
  }
}
