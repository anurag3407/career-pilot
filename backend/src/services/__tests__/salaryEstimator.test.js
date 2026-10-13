import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  MIN_SAMPLE_SIZE,
  classifyRole,
  resolveLocationTier,
  resolveExperienceFactor,
  normalizePostingSalary,
  percentile,
  aggregatePostings,
  baselineEstimate,
  estimateSalary,
} from '../salaryEstimator.js';

describe('classifyRole', () => {
  test('maps common titles to their family', () => {
    assert.equal(classifyRole('Senior Frontend Engineer'), 'frontend');
    assert.equal(classifyRole('Backend Developer (Node)'), 'backend');
    assert.equal(classifyRole('Machine Learning Engineer'), 'ml');
    assert.equal(classifyRole('DevOps / SRE'), 'devops');
    assert.equal(classifyRole('Security Engineer'), 'security');
    assert.equal(classifyRole('Product Manager'), 'product');
  });

  test('falls back to general for unrecognised titles', () => {
    assert.equal(classifyRole('Astronaut'), 'general');
    assert.equal(classifyRole(''), 'general');
    assert.equal(classifyRole(undefined), 'general');
  });
});

describe('resolveLocationTier', () => {
  test('applies a premium for major tech hubs', () => {
    const tier = resolveLocationTier('San Francisco, CA');
    assert.ok(tier.factor > 1);
  });

  test('discounts lower-cost regions', () => {
    const tier = resolveLocationTier('Remote, India');
    assert.ok(tier.factor < 1);
  });

  test('defaults to a neutral factor', () => {
    assert.equal(resolveLocationTier('Somewhere').factor, 1);
    assert.equal(resolveLocationTier('').factor, 1);
  });
});

describe('resolveExperienceFactor', () => {
  test('orders seniority monotonically', () => {
    const intern = resolveExperienceFactor('Intern');
    const entry = resolveExperienceFactor('Entry level');
    const mid = resolveExperienceFactor('Mid level');
    const senior = resolveExperienceFactor('Senior');

    assert.ok(intern < entry);
    assert.ok(entry < mid);
    assert.ok(mid < senior);
  });

  test('defaults to mid-level when unspecified', () => {
    assert.equal(resolveExperienceFactor(''), 1);
    assert.equal(resolveExperienceFactor(undefined), 1);
  });
});

describe('normalizePostingSalary', () => {
  test('converts hourly to annual', () => {
    const result = normalizePostingSalary({
      job_min_salary: 50,
      job_max_salary: 60,
      job_salary_currency: 'USD',
      job_salary_period: 'HOUR',
    });

    assert.equal(result.min, 104000);
    assert.equal(result.max, 124800);
  });

  test('treats YEAR as-is', () => {
    const result = normalizePostingSalary({
      job_min_salary: 100000,
      job_max_salary: 150000,
      job_salary_period: 'YEAR',
    });

    assert.equal(result.min, 100000);
    assert.equal(result.max, 150000);
  });

  test('excludes non-USD postings rather than guessing at FX', () => {
    const result = normalizePostingSalary({
      job_min_salary: 50000,
      job_max_salary: 60000,
      job_salary_currency: 'EUR',
      job_salary_period: 'YEAR',
    });

    assert.equal(result, null);
  });

  test('rejects postings with no usable salary', () => {
    assert.equal(normalizePostingSalary({}), null);
    assert.equal(normalizePostingSalary({ job_min_salary: 0, job_max_salary: 0 }), null);
    assert.equal(normalizePostingSalary(), null);
  });

  test('rejects obviously bogus figures', () => {
    const result = normalizePostingSalary({
      job_min_salary: 90_000_000,
      job_max_salary: 95_000_000,
      job_salary_period: 'YEAR',
    });

    assert.equal(result, null);
  });

  test('falls back to whichever bound is present', () => {
    const result = normalizePostingSalary({ job_max_salary: 120000, job_salary_period: 'YEAR' });
    assert.equal(result.min, 120000);
    assert.equal(result.max, 120000);
  });
});

describe('percentile', () => {
  test('interpolates between neighbours', () => {
    assert.equal(percentile([0, 100], 0.5), 50);
    assert.equal(percentile([0, 100], 0.25), 25);
  });

  test('handles edge cases', () => {
    assert.equal(percentile([], 0.5), 0);
    assert.equal(percentile([42], 0.9), 42);
    assert.equal(percentile([10, 20, 30], 0), 10);
  });
});

describe('aggregatePostings', () => {
  test('returns null below the minimum sample size', () => {
    const tooFew = [{ min: 100000, max: 120000 }, { min: 110000, max: 130000 }];
    assert.equal(tooFew.length < MIN_SAMPLE_SIZE, true);
    assert.equal(aggregatePostings(tooFew), null);
  });

  test('produces an ordered band from real postings', () => {
    const postings = [100000, 120000, 140000, 160000, 180000].map((v) => ({ min: v, max: v }));

    const result = aggregatePostings(postings);

    assert.equal(result.source, 'postings');
    assert.equal(result.sampleSize, 5);
    assert.ok(result.p10 <= result.p25);
    assert.ok(result.p25 <= result.median);
    assert.ok(result.median <= result.p75);
    assert.ok(result.p75 <= result.p90);
  });

  test('ignores malformed entries', () => {
    const postings = [
      { min: 100000, max: 120000 },
      null,
      { min: NaN, max: 120000 },
      { min: 110000, max: 130000 },
      { min: 115000, max: 135000 },
    ];

    const result = aggregatePostings(postings);
    assert.equal(result.sampleSize, 3);
  });
});

describe('baselineEstimate', () => {
  test('always returns a coherent band', () => {
    const result = baselineEstimate({
      title: 'Senior Backend Engineer',
      location: 'San Francisco',
      experienceLevel: 'Senior',
    });

    assert.equal(result.source, 'baseline');
    assert.equal(result.roleFamily, 'backend');
    assert.ok(result.p25 <= result.median);
    assert.ok(result.median <= result.p75);
  });

  test('senior out-earns the same role at entry level', () => {
    const base = { title: 'Frontend Engineer', location: 'Denver' };
    const entry = baselineEstimate({ ...base, experienceLevel: 'Entry' });
    const senior = baselineEstimate({ ...base, experienceLevel: 'Senior' });

    assert.ok(senior.median > entry.median);
  });

  test('is safe with no input at all', () => {
    const result = baselineEstimate();
    assert.equal(result.roleFamily, 'general');
    assert.ok(result.median > 0);
  });
});

describe('estimateSalary', () => {
  test('prefers real postings when the sample is large enough', () => {
    const postings = [90000, 110000, 130000, 150000].map((v) => ({
      job_min_salary: v,
      job_max_salary: v,
      job_salary_currency: 'USD',
      job_salary_period: 'YEAR',
    }));

    const result = estimateSalary({ title: 'Backend Engineer', postings });

    assert.equal(result.source, 'postings');
    assert.equal(result.sampleSize, 4);
  });

  test('falls back to the baseline when postings are too sparse', () => {
    const result = estimateSalary({
      title: 'Backend Engineer',
      postings: [{ job_min_salary: 100000, job_max_salary: 120000, job_salary_currency: 'USD', job_salary_period: 'YEAR' }],
    });

    assert.equal(result.source, 'baseline');
    assert.equal(result.sampleSize, 0);
  });

  test('falls back cleanly when no provider key is configured', () => {
    const result = estimateSalary({ title: 'ML Engineer', location: 'Remote' });

    assert.equal(result.source, 'baseline');
    assert.equal(result.roleFamily, 'ml');
  });
});