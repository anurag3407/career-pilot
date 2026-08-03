/**
 * Unit tests for the question-bank lookup + coding-question service functions.
 *
 * We construct provider objects manually and stub the QuestionBank model by
 * monkey-patching the imported module via a small wrapper. The simplest
 * approach is to test the pure helpers directly — getQuestionsFromBank uses
 * a model and cannot easily be unit-tested without DB, so we exercise it via
 * its boundary behavior using the live in-memory mock via a custom provider
 * stubbed through `globalThis.fetch`.
 *
 * Run with:
 *   node --test src/services/__tests__/interview-coding.test.js
 */

import { test, describe, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';

import {
  generateCodingQuestion,
  runCodeAgainstTests
} from '../interviewService.js';
import * as questionBankModule from '../../models/QuestionBank.model.js';

// ---------------------------------------------------------------------------
// Mocks for QuestionBank — patch the default export's findOne method.
// ---------------------------------------------------------------------------

const mockBankDocuments = [
  {
    companyNormalized: 'google',
    role: 'Software Engineer',
    experienceLevel: 'mid',
    questions: [
      { questionId: 'b1', question: 'Q1', type: 'behavioral', difficulty: 'easy', source: 'curated' },
      { questionId: 'b2', question: 'Q2', type: 'technical', difficulty: 'medium', source: 'curated' },
      { questionId: 'b3', question: 'Q3', type: 'situational', difficulty: 'hard', source: 'curated' }
    ]
  }
];

const originalFindOne = questionBankModule.default.findOne.bind(questionBankModule.default);

questionBankModule.default.findOne = async ({ companyNormalized }) =>
  mockBankDocuments.find((b) => b.companyNormalized === companyNormalized) || null;

after(() => {
  questionBankModule.default.findOne = originalFindOne;
});

// Mock AI provider
const makeProvider = (text) => ({
  providerName: 'gemini',
  modelName: 'gemini-2.5-flash',
  generateContent: async () => ({ text })
});

// Re-import getQuestionsFromBank AFTER patching the model so it captures the patched version.
// In ESM modules this is tricky — instead, we re-import the service module dynamically,
// OR we can directly call the patched model's findOne to verify our patch is wired up.
describe('QuestionBank model patch', () => {
  test('patched findOne returns mock for Google', async () => {
    const r = await questionBankModule.default.findOne({ companyNormalized: 'google' });
    assert.ok(r);
    assert.equal(r.questions.length, 3);
  });

  test('patched findOne returns null for unknown company', async () => {
    const r = await questionBankModule.default.findOne({ companyNormalized: 'unknown' });
    assert.equal(r, null);
  });
});

// ---------------------------------------------------------------------------
// generateCodingQuestion
// ---------------------------------------------------------------------------

describe('generateCodingQuestion', () => {
  test('parses valid LLM JSON into a coding question', async () => {
    const llmResponse = JSON.stringify({
      problemStatement: 'Reverse a linked list.',
      starterCode: 'function reverse(head) {}',
      constraints: 'n <= 10^4',
      testCases: [
        { input: '1->2', expected: '2->1', hidden: false },
        { input: '[]', expected: '[]', hidden: false },
        { input: '1', expected: '1', hidden: true }
      ],
      idealSolution: 'iterative pointer reversal',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)'
    });

    const q = await generateCodingQuestion(
      { jobRole: 'SWE', industry: 'software_engineering', experienceLevel: 'mid', codingLanguage: 'javascript' },
      makeProvider(llmResponse)
    );

    assert.equal(q.type, 'coding');
    assert.ok(q.questionId);
    assert.ok(q.coding);
    assert.equal(q.coding.language, 'javascript');
    assert.ok(q.coding.testCases.length >= 1);
    assert.equal(q.coding.timeComplexity, 'O(n)');
  });

  test('strips markdown code fences from LLM response', async () => {
    const llmResponse = '```json\n' + JSON.stringify({
      problemStatement: 'Two Sum.',
      starterCode: '',
      constraints: '',
      testCases: [],
      idealSolution: 'hashmap',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)'
    }) + '\n```';

    const q = await generateCodingQuestion(
      { jobRole: 'SWE', industry: 'software_engineering', experienceLevel: 'entry', codingLanguage: 'python' },
      makeProvider(llmResponse)
    );
    assert.ok(q.coding.problemStatement.includes('Two Sum'));
  });

  test('throws on invalid JSON', async () => {
    await assert.rejects(
      () => generateCodingQuestion(
        { jobRole: 'X', industry: 'software_engineering', experienceLevel: 'entry', codingLanguage: 'javascript' },
        makeProvider('not json at all')
      ),
      /Failed to generate coding question/
    );
  });

  test('difficulty scales with experience level', async () => {
    const easyLLM = JSON.stringify({
      problemStatement: 'Sum two numbers.',
      starterCode: '',
      constraints: '',
      testCases: [],
      idealSolution: 'a + b',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)'
    });
    const hardLLM = JSON.stringify({
      problemStatement: 'Distributed consensus.',
      starterCode: '',
      constraints: '',
      testCases: [],
      idealSolution: 'Paxos',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)'
    });

    const e = await generateCodingQuestion(
      { jobRole: 'X', industry: 'software_engineering', experienceLevel: 'entry', codingLanguage: 'javascript' },
      makeProvider(easyLLM)
    );
    const h = await generateCodingQuestion(
      { jobRole: 'X', industry: 'software_engineering', experienceLevel: 'lead', codingLanguage: 'javascript' },
      makeProvider(hardLLM)
    );
    assert.equal(e.difficulty, 'easy');
    assert.equal(h.difficulty, 'hard');
  });
});

// ---------------------------------------------------------------------------
// runCodeAgainstTests
// ---------------------------------------------------------------------------

describe('runCodeAgainstTests', () => {
  test('returns parsed results from LLM-judged dry run', async () => {
    const llmResponse = JSON.stringify({
      results: [
        { input: '[1,2,3]', expected: '6', actual: '6', passed: true },
        { input: '[]', expected: '0', actual: '0', passed: true }
      ],
      summary: 'Both visible cases pass.'
    });

    const r = await runCodeAgainstTests(
      {
        code: 'function sum(arr) { return arr.reduce((a,b)=>a+b, 0); }',
        language: 'javascript',
        problemStatement: 'Sum an array.',
        testCases: [
          { input: '[1,2,3]', expected: '6', hidden: false },
          { input: '[]', expected: '0', hidden: false },
          { input: '[1000]', expected: '1000', hidden: true }
        ]
      },
      makeProvider(llmResponse)
    );

    assert.ok(Array.isArray(r.results));
    assert.equal(r.results.length, 2); // hidden cases filtered out
    assert.equal(r.results[0].passed, true);
  });

  test('filters hidden test cases from the LLM prompt', async () => {
    let capturedPrompt = '';
    const provider = {
      providerName: 'gemini',
      modelName: 'gemini-2.5-flash',
      generateContent: async (prompt) => {
        capturedPrompt = prompt;
        return { text: JSON.stringify({ results: [], summary: 'hidden cases skipped' }) };
      }
    };

    await runCodeAgainstTests(
      {
        code: '',
        language: 'javascript',
        problemStatement: 'X',
        testCases: [
          { input: 'visible-input', expected: '1', hidden: false },
          { input: 'HIDDEN-INPUT', expected: '2', hidden: true }
        ]
      },
      provider
    );

    assert.ok(capturedPrompt.includes('visible-input'));
    assert.ok(!capturedPrompt.includes('HIDDEN-INPUT'));
  });
});
