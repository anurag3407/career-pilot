/**
 * Unit tests for the Node wrapper around the Python activity analyzer.
 *
 * Approach: refactor `activityService.js` to take an optional injected
 * `runner` so tests can swap it out. The default still uses
 * `promisify(execFile)` from child_process. This keeps the production
 * code untouched and makes the dependency on `child_process` testable.
 *
 * Run with:
 *   node --test src/services/__tests__/activityService.test.js
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { runActivityAnalyzer, _setRunner } from '../activityService.js';

describe('runActivityAnalyzer', () => {
  let calls;
  let nextImpl;

  beforeEach(() => {
    calls = [];
    nextImpl = () =>
      Promise.resolve({
        stdout: JSON.stringify({ weekly: [], totals: {}, insight: null, meta: {} }),
        stderr: '',
      });
    _setRunner((cmd, args, opts) => {
      calls.push({ cmd, args, opts });
      return nextImpl(cmd, args, opts);
    });
  });

  test('spawns python3 with the analyzer path and repoPath from the backend root', async () => {
    await runActivityAnalyzer('/tmp/some-repo');

    assert.equal(calls.length, 1);
    const { cmd, args, opts } = calls[0];
    assert.equal(cmd, 'python3');
    assert.equal(args[0], 'activity/analyzer.py');
    assert.equal(args[1], '/tmp/some-repo');
    assert.ok(args.includes('--weeks'), 'should pass --weeks flag');
    assert.ok(args.includes('52'), 'default weeks should be 52');
    assert.ok(typeof opts.cwd === 'string' && opts.cwd.endsWith('backend'),
      `cwd should end with /backend, got: ${opts.cwd}`);
  });

  test('forwards provider, apiKey, model, and detail flags when supplied', async () => {
    await runActivityAnalyzer('/tmp/repo', {
      provider: 'gemini',
      apiKey: 'sk-test',
      model: 'gemini-2.5-flash',
      detail: true,
    });

    const { args } = calls[0];
    assert.ok(args.includes('--provider'));
    assert.ok(args.includes('gemini'));
    assert.ok(args.includes('--api-key'));
    assert.ok(args.includes('sk-test'));
    assert.ok(args.includes('--model'));
    assert.ok(args.includes('gemini-2.5-flash'));
    assert.ok(args.includes('--detailed'),
      'detail=true should be forwarded as --detailed');
  });

  test('parses the JSON payload from stdout', async () => {
    const payload = {
      weekly: [{ weekStart: '2025-01-06', total: 4, byAuthor: { Alice: 4 } }],
      totals: { commits: 4, weeksActive: 1, avgPerActiveWeek: 4 },
      insight: { summary: 'busy week' },
      meta: { provider: 'gemini', model: 'gemini-2.5-flash' },
    };
    nextImpl = () => Promise.resolve({ stdout: JSON.stringify(payload), stderr: '' });

    const result = await runActivityAnalyzer('/tmp/repo');
    assert.deepEqual(result, payload);
  });

  test('throws ANALYZER_ERROR when the script returns a payload with an error', async () => {
    nextImpl = () =>
      Promise.resolve({
        stdout: JSON.stringify({ error: 'git log failed: bad repo' }),
        stderr: '',
      });

    await assert.rejects(
      () => runActivityAnalyzer('/tmp/bad'),
      (err) => err.code === 'ANALYZER_ERROR' && /git log failed/.test(err.message)
    );
  });

  test('wraps non-zero exit with stderr details', async () => {
    const err = new Error('spawn failed');
    err.stderr = 'Traceback (most recent call last):\n  ...';
    err.code = 1;
    nextImpl = () => Promise.reject(err);

    await assert.rejects(
      () => runActivityAnalyzer('/tmp/x'),
      (e) => /Traceback/.test(e.message)
    );
  });
});
