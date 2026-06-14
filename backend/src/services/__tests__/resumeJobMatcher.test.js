import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  matchResumeToJob,
  deterministicResumeJobMatch
} from '../resumeJobMatcher.js';

describe('resumeJobMatcher', () => {

  test('returns AI match analysis successfully', async () => {
    const mockProvider = {
      generateContent: async () => ({
        text: JSON.stringify({
          matchScore: 88,
          matchedSkills: ['python', 'sql'],
          missingSkills: ['aws'],
          strengths: [
            'Strong backend experience'
          ],
          recommendations: [
            'Add cloud experience'
          ]
        })
      })
    };

    const result = await matchResumeToJob(
      'Python SQL developer',
      'Looking for Python SQL AWS developer',
      mockProvider
    );

    assert.equal(result.matchScore, 88);
    assert.ok(
      result.matchedSkills.includes('python')
    );
    assert.ok(
      result.missingSkills.includes('aws')
    );
    assert.ok(
      result.strengths.length > 0
    );
  });

  test('parses AI responses wrapped in markdown', async () => {
    const mockProvider = {
      generateContent: async () => ({
        text: `\`\`\`json
{
  "matchScore": 75,
  "matchedSkills": ["python"],
  "missingSkills": ["aws"],
  "strengths": ["Good Python background"],
  "recommendations": ["Add AWS projects"]
}
\`\`\``
      })
    };

    const result = await matchResumeToJob(
      'Python developer',
      'Python AWS engineer',
      mockProvider
    );

    assert.equal(result.matchScore, 75);
    assert.ok(
      result.matchedSkills.includes('python')
    );
  });

  test('falls back to deterministic matcher when AI fails', async () => {
    const brokenProvider = {
      generateContent: async () => {
        throw new Error(
          'Provider unavailable'
        );
      }
    };

    const result = await matchResumeToJob(
      'Python SQL developer',
      'Python SQL AWS engineer',
      brokenProvider
    );

    assert.ok(result.matchScore >= 0);
    assert.ok(
      Array.isArray(result.matchedSkills)
    );
    assert.ok(
      Array.isArray(result.missingSkills)
    );
  });

  test('throws when resume text is empty', async () => {
    await assert.rejects(
      async () => {
        await matchResumeToJob(
          '',
          'Python developer role'
        );
      },
      /Resume text is required/
    );
  });

  test('throws when job description is empty', async () => {
    await assert.rejects(
      async () => {
        await matchResumeToJob(
          'Python developer',
          ''
        );
      },
      /Job description is required/
    );
  });

});

describe('deterministicResumeJobMatch', () => {

  test('detects matched skills', () => {
    const result =
      deterministicResumeJobMatch(
        'Python SQL Pandas developer',
        'Python SQL AWS engineer'
      );

    assert.ok(
      result.matchedSkills.includes('python')
    );

    assert.ok(
      result.matchedSkills.includes('sql')
    );
  });

  test('detects missing skills', () => {
    const result =
      deterministicResumeJobMatch(
        'Python SQL developer',
        'Python SQL AWS engineer'
      );

    assert.ok(
      result.missingSkills.includes('aws')
    );
  });

  test('calculates match score', () => {
    const result =
      deterministicResumeJobMatch(
        'Python SQL developer',
        'Python SQL AWS engineer'
      );

    assert.ok(result.matchScore >= 0);
    assert.ok(result.matchScore <= 100);
  });

  test('returns empty analysis for invalid input', () => {
    const result =
      deterministicResumeJobMatch(
        null,
        null
      );

    assert.equal(result.matchScore, 0);
    assert.equal(
      result.matchedSkills.length,
      0
    );
  });

  test('generates recommendations', () => {
    const result =
      deterministicResumeJobMatch(
        'Python',
        'Python AWS Docker Kubernetes'
      );

    assert.ok(
      result.recommendations.length > 0
    );
  });

});