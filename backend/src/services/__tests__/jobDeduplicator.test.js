import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { deduplicateJobs } from '../jobDeduplicator.js';

const createJob = (overrides = {}) => ({
  externalId: 'job-1',
  source: 'rapidapi',
  title: 'Software Engineer',
  company: 'Acme Technologies',
  location: 'Jaipur',
  employmentType: 'full-time',
  applyLink: 'https://jobs.example.com/apply/job-1',
  postedAt: '2026-06-15T00:00:00.000Z',
  ...overrides,
});

describe('jobDeduplicator', () => {
  describe('input validation and empty input', () => {
    test('throws a clear TypeError for non-array input', () => {
      assert.throws(
        () => deduplicateJobs(null),
        {
          name: 'TypeError',
          message:
            'deduplicateJobs expects an array of job records',
        },
      );

      assert.throws(
        () => deduplicateJobs({}),
        TypeError,
      );
    });

    test('returns an empty result with zeroed statistics', () => {
      const result = deduplicateJobs([]);

      assert.deepEqual(result, {
        jobs: [],
        stats: {
          inputCount: 0,
          outputCount: 0,
          duplicatesRemoved: 0,
          exactMatches: 0,
          fuzzyMatches: 0,
          unmatchableCount: 0,
          candidateComparisons: 0,
        },
      });
    });
  });

  describe('exact identity matching', () => {
    test('deduplicates records with the same source-scoped external ID', () => {
      const firstJob = createJob({
        descriptionSnippet: 'Build backend services.',
      });

      const secondJob = createJob({
        title: 'Completely Different Display Title',
        description:
          'Build reliable backend services and APIs.',
      });

      const result = deduplicateJobs([
        firstJob,
        secondJob,
      ]);

      assert.equal(result.jobs.length, 1);
      assert.equal(result.stats.duplicatesRemoved, 1);
      assert.equal(result.stats.exactMatches, 1);
      assert.equal(result.stats.fuzzyMatches, 0);
      assert.equal(
        result.jobs[0].description,
        secondJob.description,
      );
    });

    test('does not globally match identical IDs from different sources', () => {
      const result = deduplicateJobs([
        createJob({
          source: 'rapidapi',
          externalId: 'shared-id',
          title: 'Frontend Engineer',
          company: 'Acme Technologies',
          location: 'Jaipur',
        }),
        createJob({
          source: 'linkedin',
          externalId: 'shared-id',
          title: 'Data Scientist',
          company: 'Different Company',
          location: 'Bengaluru',
          applyLink:
            'https://linkedin.example.com/jobs/shared-id',
        }),
      ]);

      assert.equal(result.jobs.length, 2);
      assert.equal(result.stats.duplicatesRemoved, 0);
    });

    test('deduplicates canonical URLs that differ only by tracking data', () => {
      const result = deduplicateJobs([
        createJob({
          source: 'rapidapi',
          externalId: 'rapid-101',
          applyLink:
            'https://www.jobs.example.com/openings/101/?jobId=101&utm_source=newsletter#apply',
        }),
        createJob({
          source: 'linkedin',
          externalId: 'linkedin-202',
          applyLink:
            'https://jobs.example.com/openings/101?jobId=101&utm_campaign=social',
        }),
      ]);

      assert.equal(result.jobs.length, 1);
      assert.equal(result.stats.exactMatches, 1);
      assert.equal(result.stats.duplicatesRemoved, 1);
    });

    test('preserves meaningful URL parameters when identifying jobs', () => {
      const result = deduplicateJobs([
        createJob({
          externalId: 'job-101',
          applyLink:
            'https://jobs.example.com/apply?jobId=101&utm_source=email',
        }),
        createJob({
          externalId: 'job-102',
          applyLink:
            'https://jobs.example.com/apply?jobId=102&utm_source=email',
          title: 'Data Engineer',
        }),
      ]);

      assert.equal(result.jobs.length, 2);
      assert.equal(result.stats.duplicatesRemoved, 0);
    });
  });

  describe('cross-source matching', () => {
    test('deduplicates normalized cross-source listings', () => {
      const result = deduplicateJobs([
        createJob({
          source: 'rapidapi',
          externalId: 'rapid-1',
          title: 'Sr. Backend Engineer',
          company: 'Example Systems Pvt Ltd',
          applyLink:
            'https://rapid.example.com/jobs/rapid-1',
        }),
        createJob({
          source: 'linkedin',
          externalId: 'linkedin-1',
          title: 'Senior Backend Engineer',
          company: 'Example Systems Private Limited',
          applyLink:
            'https://linkedin.example.com/jobs/linkedin-1',
        }),
      ]);

      assert.equal(result.jobs.length, 1);
      assert.equal(result.stats.duplicatesRemoved, 1);
      assert.equal(result.stats.exactMatches, 1);
    });

    test('recognizes conservative fuzzy title matches', () => {
      const result = deduplicateJobs(
        [
          createJob({
            source: 'rapidapi',
            externalId: 'rapid-platform',
            title: 'Platform Engineer',
            company: 'Example Systems',
            applyLink:
              'https://rapid.example.com/platform-engineer',
          }),
          createJob({
            source: 'linkedin',
            externalId: 'linkedin-platform',
            title: 'Platform Engineer II',
            company: 'Example Systems',
            applyLink:
              'https://linkedin.example.com/platform-engineer-ii',
          }),
        ],
        {
          titleSimilarityThreshold: 0.6,
        },
      );

      assert.equal(result.jobs.length, 1);
      assert.equal(result.stats.fuzzyMatches, 1);
      assert.equal(result.stats.candidateComparisons, 1);
    });

    test('groups common remote-work location labels', () => {
      const result = deduplicateJobs([
        createJob({
          source: 'rapidapi',
          externalId: 'remote-rapid',
          location: 'Work From Home',
          isRemote: true,
          applyLink:
            'https://rapid.example.com/remote-role',
        }),
        createJob({
          source: 'linkedin',
          externalId: 'remote-linkedin',
          location: 'Remote',
          isRemote: true,
          applyLink:
            'https://linkedin.example.com/remote-role',
        }),
      ]);

      assert.equal(result.jobs.length, 1);
      assert.equal(result.stats.duplicatesRemoved, 1);
    });
  });

  describe('false-positive protection', () => {
    test('keeps junior and senior vacancies separate', () => {
      const result = deduplicateJobs([
        createJob({
          externalId: 'junior-role',
          title: 'Junior Software Engineer',
          applyLink:
            'https://jobs.example.com/junior-role',
        }),
        createJob({
          source: 'linkedin',
          externalId: 'senior-role',
          title: 'Senior Software Engineer',
          applyLink:
            'https://linkedin.example.com/senior-role',
        }),
      ]);

      assert.equal(result.jobs.length, 2);
      assert.equal(result.stats.duplicatesRemoved, 0);
    });

    test('keeps internship and full-time vacancies separate', () => {
      const result = deduplicateJobs([
        createJob({
          externalId: 'intern-role',
          title: 'Software Engineer Intern',
          employmentType: 'internship',
          applyLink:
            'https://jobs.example.com/intern-role',
        }),
        createJob({
          source: 'linkedin',
          externalId: 'full-time-role',
          title: 'Software Engineer',
          employmentType: 'full-time',
          applyLink:
            'https://linkedin.example.com/full-time-role',
        }),
      ]);

      assert.equal(result.jobs.length, 2);
      assert.equal(result.stats.duplicatesRemoved, 0);
    });

    test('keeps vacancies in different known locations separate', () => {
      const result = deduplicateJobs([
        createJob({
          externalId: 'jaipur-role',
          location: 'Jaipur',
          applyLink:
            'https://jobs.example.com/jaipur-role',
        }),
        createJob({
          source: 'linkedin',
          externalId: 'bengaluru-role',
          location: 'Bengaluru',
          applyLink:
            'https://linkedin.example.com/bengaluru-role',
        }),
      ]);

      assert.equal(result.jobs.length, 2);
      assert.equal(result.stats.duplicatesRemoved, 0);
    });

    test('keeps conflicting employment types separate', () => {
      const result = deduplicateJobs([
        createJob({
          externalId: 'contract-role',
          employmentType: 'contract',
          applyLink:
            'https://jobs.example.com/contract-role',
        }),
        createJob({
          source: 'linkedin',
          externalId: 'permanent-role',
          employmentType: 'full-time',
          applyLink:
            'https://linkedin.example.com/permanent-role',
        }),
      ]);

      assert.equal(result.jobs.length, 2);
      assert.equal(result.stats.duplicatesRemoved, 0);
    });

    test('does not merge repostings outside the date tolerance', () => {
      const result = deduplicateJobs([
        createJob({
          source: 'rapidapi',
          externalId: 'old-posting',
          postedAt: '2026-01-01T00:00:00.000Z',
          applyLink:
            'https://rapid.example.com/old-posting',
        }),
        createJob({
          source: 'linkedin',
          externalId: 'new-posting',
          postedAt: '2026-06-15T00:00:00.000Z',
          applyLink:
            'https://linkedin.example.com/new-posting',
        }),
      ]);

      assert.equal(result.jobs.length, 2);
      assert.equal(result.stats.duplicatesRemoved, 0);
    });
  });

  describe('record merging and defensive behavior', () => {
    test('selects and enriches the most complete duplicate record', () => {
      const firstJob = createJob({
        skills: ['Node.js', 'MongoDB'],
        descriptionSnippet: 'Backend development role.',
      });

      const secondJob = createJob({
        source: 'rapidapi',
        externalId: 'job-1',
        skills: ['MongoDB', 'Redis'],
        description:
          'Build scalable backend APIs and distributed services.',
        salary: {
          min: 800000,
          max: 1200000,
          currency: 'INR',
        },
      });

      const result = deduplicateJobs([
        firstJob,
        secondJob,
      ]);

      assert.equal(result.jobs.length, 1);
      assert.deepEqual(
        result.jobs[0].skills,
        ['MongoDB', 'Redis', 'Node.js'],
      );
      assert.equal(
        result.jobs[0].description,
        secondJob.description,
      );
      assert.deepEqual(
        result.jobs[0].salary,
        secondJob.salary,
      );
      assert.equal(
        result.jobs[0].descriptionSnippet,
        firstJob.descriptionSnippet,
      );
    });

    test('does not mutate original job records or their arrays', () => {
      const firstJob = createJob({
        skills: ['Node.js'],
      });

      const secondJob = createJob({
        skills: ['Redis'],
      });

      const originalFirstJob =
        structuredClone(firstJob);
      const originalSecondJob =
        structuredClone(secondJob);

      deduplicateJobs([firstJob, secondJob]);

      assert.deepEqual(firstJob, originalFirstJob);
      assert.deepEqual(secondJob, originalSecondJob);
      assert.deepEqual(firstJob.skills, ['Node.js']);
      assert.deepEqual(secondJob.skills, ['Redis']);
    });

    test('handles malformed records, URLs, and dates without crashing', () => {
      const malformedJob = {
        title: '',
        company: '',
        applyLink: 'not a valid URL',
        postedAt: 'not a date',
      };

      const result = deduplicateJobs([
        null,
        'invalid-record',
        malformedJob,
      ]);

      assert.equal(result.jobs.length, 1);
      assert.deepEqual(result.jobs[0], malformedJob);
      assert.notStrictEqual(result.jobs[0], malformedJob);
      assert.equal(result.stats.inputCount, 3);
      assert.equal(result.stats.outputCount, 1);
      assert.equal(result.stats.unmatchableCount, 3);
      assert.equal(result.stats.duplicatesRemoved, 0);
    });

    test('preserves the position of the first occurrence', () => {
      const firstUniqueJob = createJob({
        externalId: 'first-unique',
        title: 'Data Analyst',
        company: 'First Company',
        applyLink:
          'https://jobs.example.com/first-unique',
      });

      const firstDuplicate = createJob({
        externalId: 'duplicate-id',
        title: 'Backend Engineer',
        company: 'Second Company',
        applyLink:
          'https://jobs.example.com/duplicate',
      });

      const finalUniqueJob = createJob({
        externalId: 'final-unique',
        title: 'Product Designer',
        company: 'Third Company',
        applyLink:
          'https://jobs.example.com/final-unique',
      });

      const richerDuplicate = createJob({
        externalId: 'duplicate-id',
        title: 'Backend Engineer',
        company: 'Second Company',
        applyLink:
          'https://jobs.example.com/duplicate',
        description:
          'A complete description for the backend role.',
      });

      const result = deduplicateJobs([
        firstUniqueJob,
        firstDuplicate,
        finalUniqueJob,
        richerDuplicate,
      ]);

      assert.equal(result.jobs.length, 3);
      assert.equal(
        result.jobs[0].externalId,
        'first-unique',
      );
      assert.equal(
        result.jobs[1].externalId,
        'duplicate-id',
      );
      assert.equal(
        result.jobs[1].description,
        richerDuplicate.description,
      );
      assert.equal(
        result.jobs[2].externalId,
        'final-unique',
      );
    });
  });

  describe('performance characteristics', () => {
    test('uses indexed candidate selection for a large dataset', () => {
      const jobs = [];

      for (let index = 0; index < 1000; index += 1) {
        const company = `Company ${index}`;

        jobs.push(
          createJob({
            source: 'rapidapi',
            externalId: `rapid-${index}`,
            title: 'Platform Engineer',
            company,
            applyLink:
              `https://rapid.example.com/jobs/${index}`,
          }),
          createJob({
            source: 'linkedin',
            externalId: `linkedin-${index}`,
            title: 'Platform Engineer II',
            company,
            applyLink:
              `https://linkedin.example.com/jobs/${index}`,
          }),
        );
      }

      const result = deduplicateJobs(jobs, {
        titleSimilarityThreshold: 0.6,
      });

      assert.equal(result.stats.inputCount, 2000);
      assert.equal(result.stats.outputCount, 1000);
      assert.equal(result.stats.duplicatesRemoved, 1000);
      assert.equal(result.stats.fuzzyMatches, 1000);

      assert.ok(
        result.stats.candidateComparisons <= 1000,
        `expected at most 1000 candidate comparisons, received ${result.stats.candidateComparisons}`,
      );
    });
  });
});