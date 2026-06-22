import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  createMockUser,
  createMockJob,
  createMockResume,
  createMockInterview,
  makeMockJobs,
  createMockRequestResponse,
} from './factories/index.js';

describe('test factories', () => {
  test('createMockUser returns default user data and supports overrides', () => {
    const user = createMockUser({ email: 'custom@example.com', yearsOfExperience: 4 });

    assert.equal(user.email, 'custom@example.com');
    assert.equal(user.yearsOfExperience, 4);
    assert.equal(user.role, 'user');
    assert.ok(Array.isArray(user.skills));
  });

  test('createMockJob returns default job data and supports overrides', () => {
    const job = createMockJob({ title: 'Frontend Developer', jobType: 'remote' });

    assert.equal(job.title, 'Frontend Developer');
    assert.equal(job.jobType, 'remote');
    assert.equal(job.company, 'Acme Corp');
    assert.ok(Array.isArray(job.requiredSkills));
  });

  test('createMockResume returns default resume data and supports overrides', () => {
    const resume = createMockResume({ atsScore: 92, jobRole: 'Backend Developer' });

    assert.equal(resume.atsScore, 92);
    assert.equal(resume.jobRole, 'Backend Developer');
    assert.equal(resume.userId, 'user-1');
    assert.ok(resume.originalText.length > 0);
  });

  test('createMockInterview returns default interview data and supports overrides', () => {
    const interview = createMockInterview({ questionCount: 5 });

    assert.equal(interview.questionCount, 5);
    assert.equal(interview.jobRole, 'Software Engineer');
    assert.ok(Array.isArray(interview.questions));
  });

  test('makeMockJobs creates the requested number of jobs', () => {
    const jobs = makeMockJobs(3, 'fixture-job');

    assert.equal(jobs.length, 3);
    assert.equal(jobs[0]._id, 'fixture-job-1');
    assert.equal(jobs[1].title, 'Software Engineer 2');
    assert.equal(jobs[2].applyLink, 'https://example.com/jobs/fixture-job-3');
  });

  test('createMockRequestResponse builds reusable req and res objects', () => {
    const { req, res } = createMockRequestResponse(
      { name: 'Alice' },
      { page: '1' },
      { id: '123' }
    );

    res.status(201).json({ success: true });

    assert.deepEqual(req.body, { name: 'Alice' });
    assert.deepEqual(req.query, { page: '1' });
    assert.deepEqual(req.params, { id: '123' });
    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.payload, { success: true });
  });
});