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
        const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
        console.warn(`Cheaper Inference rate limit hit. Retrying in ${Math.round(delay)}ms... (Attempt ${attempt}/${maxRetries - 1})`);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
};

/**
 * Adapter for Cheaper Inference (OpenAI-compatible endpoint via openai SDK).
 */
export class CheaperInferenceAdapter {
  constructor(apiKey, modelName) {
    if (!apiKey) {
      throw new Error(
        'Cheaper Inference API key is required. ' +
        'Set CHEAPER_INFERENCE_API_KEY in your .env file or provide it via the X-AI-Key header.'
      );
    }
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.cheaperinference.com/v1',
    });
    this.modelName = modelName || 'gpt-5.4-mini';
    this.providerName = 'cheaperinference';
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
      console.error('Cheaper Inference generateContent Error:', error);

      // Handle known errors gracefully
      if (error?.status === 401) {
        throw new Error('Cheaper Inference API Key is invalid or unauthorized.');
      }
      if (error?.status === 402) {
        throw new Error('Cheaper Inference account has insufficient balance.');
      }
      if (error?.status === 429) {
        throw new Error('Cheaper Inference rate limit exceeded. Please try again later.');
      }

      throw new Error(`Cheaper Inference API Error: ${error.message}`);
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
      console.error('Cheaper Inference generateContentStream Error:', error);
      if (error?.status === 401) throw new Error('Cheaper Inference API Key is invalid.');
      if (error?.status === 402) throw new Error('Cheaper Inference account has insufficient balance.');
      if (error?.status === 429) throw new Error('Cheaper Inference rate limit exceeded.');
      throw new Error(`Cheaper Inference API Error: ${error.message}`);
    }
  }
}
