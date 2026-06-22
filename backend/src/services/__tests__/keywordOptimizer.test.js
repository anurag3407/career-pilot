import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  optimizeKeywords,
  deterministicKeywordAnalysis
} from '../keywordOptimizer.js';

describe('keywordOptimizer', () => {

  test('returns AI keyword analysis successfully', async () => {
    const mockProvider = {
      generateContent: async () => ({
        text: JSON.stringify({
          keywordCoverageScore: 85,
          foundKeywords: ['python', 'sql'],
          missingKeywords: ['tensorflow'],
          recommendedKeywords: ['pytorch'],
          optimizationSuggestions: [
            'Add TensorFlow experience'
          ]
        })
      })
    };

    const result = await optimizeKeywords(
      'Python SQL developer',
      'Data Scientist',
      mockProvider
    );

    assert.equal(result.keywordCoverageScore, 85);
    assert.ok(result.foundKeywords.includes('python'));
    assert.ok(result.missingKeywords.includes('tensorflow'));
    assert.ok(result.recommendedKeywords.includes('pytorch'));
  });

  test('parses AI responses wrapped in markdown', async () => {
    const mockProvider = {
      generateContent: async () => ({
        text: `\`\`\`json
{
  "keywordCoverageScore": 75,
  "foundKeywords": ["python"],
  "missingKeywords": ["tensorflow"],
  "recommendedKeywords": ["machine learning"],
  "optimizationSuggestions": ["Add ML projects"]
}
\`\`\``
      })
    };

    const result = await optimizeKeywords(
      'Python developer',
      'Data Scientist',
      mockProvider
    );

    assert.equal(result.keywordCoverageScore, 75);
    assert.ok(result.foundKeywords.includes('python'));
  });

  test('falls back to deterministic analysis when AI fails', async () => {
    const brokenProvider = {
      generateContent: async () => {
        throw new Error('Provider unavailable');
      }
    };

    const result = await optimizeKeywords(
      'Python SQL Pandas developer',
      'Data Scientist',
      brokenProvider
    );

    assert.ok(result.keywordCoverageScore >= 0);
    assert.ok(Array.isArray(result.foundKeywords));
    assert.ok(Array.isArray(result.missingKeywords));
  });

  test('throws when resume text is empty', async () => {
    await assert.rejects(
      async () => {
        await optimizeKeywords(
          '',
          'Data Scientist'
        );
      },
      /Resume text is required/
    );
  });

});

describe('deterministicKeywordAnalysis', () => {

  test('detects found keywords', () => {
    const result = deterministicKeywordAnalysis(
      'Python SQL Pandas developer',
      'Data Scientist'
    );

    assert.ok(result.foundKeywords.includes('python'));
    assert.ok(result.foundKeywords.includes('sql'));
  });

  test('returns missing keywords', () => {
    const result = deterministicKeywordAnalysis(
      'Python SQL',
      'Data Scientist'
    );

    assert.ok(result.missingKeywords.length > 0);
  });

  test('returns empty analysis for unknown role', () => {
    const result = deterministicKeywordAnalysis(
      'Python SQL Developer',
      'Unknown Role'
    );

    assert.equal(result.keywordCoverageScore, 0);
    assert.equal(result.foundKeywords.length, 0);
    assert.equal(result.missingKeywords.length, 0);
  });

  test('generates recommendations', () => {
    const result = deterministicKeywordAnalysis(
      'Python',
      'Data Scientist'
    );

    assert.ok(result.optimizationSuggestions.length > 0);
  });

});