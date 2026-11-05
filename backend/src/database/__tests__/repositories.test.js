import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { UserRepository } from '../repositories/userRepository.js';
import { TrackedJobRepository } from '../repositories/trackedJobRepository.js';

describe('Database Repository Layer', () => {
  test('UserRepository handles null inputs gracefully', async () => {
    assert.equal(await UserRepository.findById(null), null);
    assert.equal(await UserRepository.findByEmail(null), null);
    assert.equal(await UserRepository.findById(''), null);
  });

  test('TrackedJobRepository handles empty user queries gracefully', async () => {
    const jobs = await TrackedJobRepository.findForUser(null);
    assert.deepEqual(jobs, []);
  });

  test('TrackedJobRepository create returns object payload', async () => {
    const job = await TrackedJobRepository.create({
      userId: 'mock-user-1',
      title: 'DevOps Engineer',
      company: 'Cloud Corp',
    });
    assert.ok(job);
    assert.equal(job.title, 'DevOps Engineer');
  });
});
