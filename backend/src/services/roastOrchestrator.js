import crypto from 'crypto';
import { computeATSScore } from './atsScorer.js';
import { generateRoast } from '../config/langchain.js';

/**
 * Resume Roast orchestrator.
 *
 * Combines the deterministic ATS scorer (zero-cost) with the LLM roast
 * (user's BYOK key) and persists a privacy-preserving record.
 */

const MAX_RESUME_LENGTH = 50_000;

export async function buildRoast({ resumeText, jobRole, aiProvider }) {
  if (!resumeText || !resumeText.trim()) {
    throw new Error('resumeText is required');
  }
  if (resumeText.length > MAX_RESUME_LENGTH) {
    throw new Error(`Resume text exceeds ${MAX_RESUME_LENGTH} characters`);
  }

  const trimmed = resumeText.trim();

  // 1. Deterministic baseline (free, no AI cost)
  const deterministic = computeATSScore(trimmed, jobRole);

  // 2. AI roast narrative (uses user's BYOK)
  const roast = await generateRoast(trimmed, jobRole, aiProvider, deterministic);

  // 3. Privacy-preserving hash for dedupe — never persist the raw text
  const resumeHash = crypto
    .createHash('sha256')
    .update(trimmed.toLowerCase())
    .digest('hex');

  return {
    deterministic: {
      overallScore: deterministic.overallScore,
      breakdown: deterministic.breakdown,
      sectionsFound: deterministic.sectionsFound,
    },
    roast,
    resumeHash,
    resumeLength: trimmed.length,
  };
}