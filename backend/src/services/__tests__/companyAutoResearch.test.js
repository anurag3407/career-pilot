import test from 'node:test';
import assert from 'node:assert';
import { autoFetchCompanyResearch } from '../companyAutoResearch.js';

test('autoFetchCompanyResearch', async (t) => {
  await t.test('throws error if company name is empty', async () => {
    await assert.rejects(
      autoFetchCompanyResearch(''),
      { message: 'Company name is required' }
    );
  });

  await t.test('returns basic structure even if APIs fail/timeout', async () => {
    // We pass a dummy name. If APIs fail, it returns defaults instead of throwing.
    const result = await autoFetchCompanyResearch('SomeRandomCompanyThatMightFail_123');
    assert.strictEqual(result.companyName, 'SomeRandomCompanyThatMightFail_123');
    assert.ok('domain' in result);
    assert.ok('logo' in result);
    assert.ok('overview' in result);
  });
});
