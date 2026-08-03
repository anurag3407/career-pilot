/**
 * Unit tests for the extended interview schemas (v2 additions).
 *
 * Run with:
 *   node --test src/schemas/__tests__/interview-extended.test.js
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  startInterviewSchema,
  submitAnswerSchema,
  transcribeAudioSchema,
  parseJdSchema,
  annotateSchema,
  runCodeSchema
} from '../interview.schema.js';

describe('startInterviewSchema — v2 fields', () => {
  test('accepts minimal valid input (backward-compat)', () => {
    const r = startInterviewSchema.safeParse({
      jobRole: 'SWE',
      industry: 'software_engineering',
      experienceLevel: 'entry'
    });
    assert.equal(r.success, true);
    assert.equal(r.data.mode, 'behavioral');
    assert.equal(r.data.language, 'en');
    assert.equal(r.data.skipWarmup, false);
  });

  test('accepts full v2 input', () => {
    const r = startInterviewSchema.safeParse({
      jobRole: 'Backend Engineer',
      industry: 'software_engineering',
      experienceLevel: 'mid',
      questionCount: 8,
      resumeText: 'Jane Doe ...',
      mode: 'coding',
      language: 'es',
      companyName: 'Stripe',
      companyRole: 'Backend Engineer',
      codingLanguage: 'python',
      jobDescriptionText: 'Looking for a backend engineer...',
      skipWarmup: true
    });
    assert.equal(r.success, true);
    assert.equal(r.data.mode, 'coding');
    assert.equal(r.data.language, 'es');
    assert.equal(r.data.codingLanguage, 'python');
  });

  test('rejects invalid mode enum', () => {
    const r = startInterviewSchema.safeParse({
      jobRole: 'X',
      industry: 'software_engineering',
      experienceLevel: 'entry',
      mode: 'mystery'
    });
    assert.equal(r.success, false);
  });

  test('rejects invalid coding language', () => {
    const r = startInterviewSchema.safeParse({
      jobRole: 'X',
      industry: 'software_engineering',
      experienceLevel: 'entry',
      codingLanguage: 'cobol'
    });
    assert.equal(r.success, false);
  });

  test('rejects too-many questions', () => {
    const r = startInterviewSchema.safeParse({
      jobRole: 'X',
      industry: 'software_engineering',
      experienceLevel: 'entry',
      questionCount: 50
    });
    assert.equal(r.success, false);
  });
});

describe('submitAnswerSchema — v2 fields', () => {
  test('accepts transcript-only (backward-compat)', () => {
    const r = submitAnswerSchema.safeParse({
      questionId: 'q_1',
      transcript: 'Hello world',
      duration: 12
    });
    assert.equal(r.success, true);
    assert.equal(r.data.isWarmup, false);
  });

  test('accepts coding answer with code', () => {
    const r = submitAnswerSchema.safeParse({
      questionId: 'q_2',
      transcript: 'Used a hashmap',
      duration: 600,
      code: 'function twoSum(nums, target) { ... }',
      codingLanguage: 'javascript',
      isWarmup: false
    });
    assert.equal(r.success, true);
    assert.equal(r.data.codingLanguage, 'javascript');
  });

  test('accepts warmup answer', () => {
    const r = submitAnswerSchema.safeParse({
      questionId: 'q_warm',
      transcript: 'I am a software engineer with 5 years...',
      duration: 20,
      isWarmup: true
    });
    assert.equal(r.success, true);
    assert.equal(r.data.isWarmup, true);
  });

  test('rejects empty transcript', () => {
    const r = submitAnswerSchema.safeParse({
      questionId: 'q_1',
      transcript: '',
      duration: 5
    });
    assert.equal(r.success, false);
  });
});

describe('transcribeAudioSchema', () => {
  test('defaults to en when language missing', () => {
    const r = transcribeAudioSchema.safeParse({});
    assert.equal(r.success, true);
    assert.equal(r.data.language, 'en');
  });

  test('accepts explicit language', () => {
    const r = transcribeAudioSchema.safeParse({ language: 'fr' });
    assert.equal(r.success, true);
    assert.equal(r.data.language, 'fr');
  });

  test('rejects language codes that are too long', () => {
    const r = transcribeAudioSchema.safeParse({ language: 'a-very-long-tag' });
    assert.equal(r.success, false);
  });
});

describe('parseJdSchema', () => {
  test('accepts URL only', () => {
    const r = parseJdSchema.safeParse({ url: 'https://jobs.example.com/role' });
    assert.equal(r.success, true);
  });

  test('accepts text only', () => {
    const r = parseJdSchema.safeParse({ text: 'We are looking for a software engineer...' });
    assert.equal(r.success, true);
  });

  test('rejects empty body', () => {
    const r = parseJdSchema.safeParse({});
    assert.equal(r.success, false);
  });

  test('rejects malformed URL', () => {
    const r = parseJdSchema.safeParse({ url: 'not-a-url' });
    assert.equal(r.success, false);
  });
});

describe('annotateSchema', () => {
  test('accepts non-empty annotation', () => {
    const r = annotateSchema.safeParse({ annotation: 'Mention metrics next time' });
    assert.equal(r.success, true);
  });

  test('rejects empty annotation', () => {
    const r = annotateSchema.safeParse({ annotation: '' });
    assert.equal(r.success, false);
  });
});

describe('runCodeSchema', () => {
  test('accepts minimal run-code body', () => {
    const r = runCodeSchema.safeParse({
      code: 'console.log(1)',
      language: 'javascript'
    });
    assert.equal(r.success, true);
  });

  test('accepts problem id override', () => {
    const r = runCodeSchema.safeParse({
      code: 'print(1)',
      language: 'python',
      problemId: 'q_xyz'
    });
    assert.equal(r.success, true);
  });

  test('rejects unsupported language', () => {
    const r = runCodeSchema.safeParse({
      code: 'pascal code',
      language: 'pascal'
    });
    assert.equal(r.success, false);
  });
});
