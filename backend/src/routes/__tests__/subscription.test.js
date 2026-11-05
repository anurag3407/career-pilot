import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { PLANS, getPlan } from '../../config/plans.js';
import { attachUserPlan, checkResumeLimit } from '../../middleware/planLimits.js';

describe('Subscription Plans & Limits', () => {
  test('PLANS contains free, pro, and enterprise configurations', () => {
    assert.ok(PLANS.free);
    assert.ok(PLANS.pro);
    assert.ok(PLANS.enterprise);

    assert.equal(PLANS.free.limits.resumes, 3);
    assert.equal(PLANS.pro.limits.resumes, Infinity);
    assert.equal(PLANS.pro.price, 15);
    assert.equal(PLANS.enterprise.price, 49);
  });

  test('getPlan falls back to free for unknown plans', () => {
    assert.equal(getPlan('unknown').id, 'free');
    assert.equal(getPlan(null).id, 'free');
    assert.equal(getPlan('pro').id, 'pro');
  });

  test('attachUserPlan sets free plan when no user is attached', async () => {
    const req = { user: null };
    const res = {};
    let nextCalled = false;

    await attachUserPlan(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.ok(req.userPlan);
    assert.equal(req.userPlan.id, 'free');
  });

  test('checkResumeLimit passes through for unlimited pro plans', async () => {
    const req = {
      user: { id: 'u1' },
      userPlan: getPlan('pro'),
    };
    const res = {};
    let nextCalled = false;

    await checkResumeLimit(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });
});
