import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { resumeScoreSchema } from '../enhance.schema.js';

describe('resumeScoreSchema', () => {
  test('accepts jobRole when provided', () => {
    const result = resumeScoreSchema.safeParse({
      resumeText: 'A'.repeat(80),
      jobRole: 'Data Scientist',
    });

    assert.ok(result.success);
    assert.equal(result.data.jobRole, 'Data Scientist');
  });

  test('accepts requests without jobRole', () => {
    const result = resumeScoreSchema.safeParse({
      resumeText: 'A'.repeat(80),
    });

    assert.ok(result.success);
    assert.equal(result.data.jobRole, undefined);
  });
});
