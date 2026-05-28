import TokenUsage from '../models/TokenUsage.model.js';

/**
 * Saves token usage data to MongoDB after a successful AI call.
 *
 * @param {string} userId - The ID of the user making the AI call
 * @param {string} provider - The AI provider used (gemini, openai, etc.)
 * @param {string} service - The service/feature that triggered the AI call
 * @param {{ prompt: number, completion: number, total: number }} usage - Token counts
 */
export const trackTokenUsage = async (userId, provider, service, usage) => {
  try {
    if (!usage || !userId || !provider || !service) return;

    await TokenUsage.create({
      userId,
      provider,
      service,
      promptTokens: usage.prompt ?? 0,
      completionTokens: usage.completion ?? 0,
      totalTokens: usage.total ?? 0,
    });
  } catch (error) {
    console.error('Failed to track token usage:', error);
  }
};