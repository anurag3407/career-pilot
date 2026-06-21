import crypto from 'crypto';
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
      // 429 is Too Many Requests (rate limit)
      if (error?.status === 429 && attempt < maxRetries - 1) {
        attempt++;
        // Exponential backoff with jitter
        const delay = baseDelayMs * Math.pow(2, attempt) + (crypto.randomBytes(4).readUInt32LE() / 0xFFFFFFFF) * 500;
        console.warn(`Requesty rate limit hit. Retrying in ${Math.round(delay)}ms... (Attempt ${attempt}/${maxRetries - 1})`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
};

/**
 * Adapter for Requesty (OpenAI-compatible endpoint via openai SDK).
 */
export class RequestyAdapter {
  constructor(apiKey, modelName) {
    if (!apiKey) {
      throw new Error(
        'Requesty API key is required. ' +
        'Set REQUESTY_API_KEY in your .env file or provide it via the X-AI-Key header.'
      );
    }
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://router.requesty.ai/v1',
      defaultHeaders: {
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
        'X-Title': 'CareerPilot',
      },
    });
    this.modelName = modelName || 'openai/gpt-4o-mini';
    this.providerName = 'requesty';
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
      console.error('Requesty generateContent Error:', error);

      // Handle known errors gracefully
      if (error?.status === 401) {
        throw new Error('Requesty API Key is invalid or unauthorized.');
      }
      if (error?.status === 402) {
        throw new Error('Requesty account has insufficient credits.');
      }
      if (error?.status === 429) {
        throw new Error('Requesty rate limit exceeded. Please try again later.');
      }

      throw new Error(`Requesty API Error: ${error.message}`);
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
      console.error('Requesty generateContentStream Error:', error);
      if (error?.status === 401) throw new Error('Requesty API Key is invalid.');
      if (error?.status === 402) throw new Error('Requesty account has insufficient credits.');
      if (error?.status === 429) throw new Error('Requesty rate limit exceeded.');
      throw new Error(`Requesty API Error: ${error.message}`);
    }
  }
}
