/**
 * Unit tests for all Zod validation schemas.
 *
 * Run with:
 *   node --experimental-vm-modules src/schemas/__tests__/schemas.test.js
 * or simply:
 *   node src/schemas/__tests__/schemas.test.js
 *
 * Uses Node.js built-in `node:test` (requires Node >= 18).
 * No additional test dependencies are needed.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';

// ─── Auth ────────────────────────────────────────────────────────────────────
import { updateNotificationPrefsSchema } from '../auth.schema.js';

describe('auth.schema — updateNotificationPrefsSchema', () => {
  test('accepts valid boolean prefs', () => {
    const result = updateNotificationPrefsSchema.safeParse({
      jobAlerts: true,
      directMessages: false,
      proposalUpdates: true,
    });
    assert.ok(result.success, 'should succeed');
  });

  test('rejects missing fields', () => {
    const result = updateNotificationPrefsSchema.safeParse({});
    assert.ok(!result.success);
    assert.equal(result.error.issues.length, 3);
  });

  test('rejects non-boolean values', () => {
    const result = updateNotificationPrefsSchema.safeParse({
      jobAlerts: 'yes',
      directMessages: 1,
      proposalUpdates: null,
    });
    assert.ok(!result.success);
  });
});

// ─── Resume ──────────────────────────────────────────────────────────────────
import {
  createResumeSchema,
  updateResumeSchema,
  downloadResumeQuerySchema,
} from '../resume.schema.js';

describe('resume.schema — createResumeSchema', () => {
  test('accepts minimal valid body', () => {
    const result = createResumeSchema.safeParse({ originalText: 'hello' });
    assert.ok(result.success);
    // preferences has a .default({}) so it will be {} when omitted, not undefined
    assert.deepEqual(result.data.preferences, {});
  });

  test('rejects empty originalText', () => {
    const result = createResumeSchema.safeParse({ originalText: '' });
    assert.ok(!result.success);
  });

  test('rejects missing originalText', () => {
    const result = createResumeSchema.safeParse({});
    assert.ok(!result.success);
    assert.ok(result.error.issues.some(e => e.path[0] === 'originalText'));
  });
});

describe('resume.schema — updateResumeSchema', () => {
  test('accepts partial updates', () => {
    const result = updateResumeSchema.safeParse({ title: 'New Title' });
    assert.ok(result.success);
  });

  test('rejects empty object', () => {
    const result = updateResumeSchema.safeParse({});
    assert.ok(!result.success);
  });
});

describe('resume.schema — downloadResumeQuerySchema', () => {
  test('defaults version to enhanced', () => {
    const result = downloadResumeQuerySchema.safeParse({});
    assert.ok(result.success);
    assert.equal(result.data.version, 'enhanced');
  });

  test('accepts original', () => {
    const result = downloadResumeQuerySchema.safeParse({ version: 'original' });
    assert.ok(result.success);
  });

  test('rejects invalid version', () => {
    const result = downloadResumeQuerySchema.safeParse({ version: 'draft' });
    assert.ok(!result.success);
  });
});

// ─── Enhance ─────────────────────────────────────────────────────────────────
import {
  enhanceResumeSchema,
  resumeTextJobRoleSchema,
  beforeAfterSchema,
  generateEmailSchema,
  optimizeLinkedInSchema,
} from '../enhance.schema.js';

describe('enhance.schema — enhanceResumeSchema', () => {
  test('accepts valid body with defaults', () => {
    const result = enhanceResumeSchema.safeParse({
      resumeText: 'My resume',
      preferences: { jobRole: 'Engineer' },
    });
    assert.ok(result.success);
    assert.equal(result.data.preferences.yearsOfExperience, 0);
    assert.deepEqual(result.data.preferences.skills, []);
  });

  test('rejects missing resumeText', () => {
    const result = enhanceResumeSchema.safeParse({
      preferences: { jobRole: 'Engineer' },
    });
    assert.ok(!result.success);
  });

  test('rejects missing preferences.jobRole', () => {
    const result = enhanceResumeSchema.safeParse({
      resumeText: 'text',
      preferences: {},
    });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some(e => e.path.includes('jobRole')));
  });

  test('rejects extra keys in preferences (strict)', () => {
    const result = enhanceResumeSchema.safeParse({
      resumeText: 'text',
      preferences: { jobRole: 'Dev', unknownKey: 'x' },
    });
    assert.ok(!result.success);
  });
});

describe('enhance.schema — resumeTextJobRoleSchema', () => {
  test('accepts valid body', () => {
    const result = resumeTextJobRoleSchema.safeParse({
      resumeText: 'text',
      jobRole: 'SWE',
    });
    assert.ok(result.success);
  });

  test('rejects empty strings', () => {
    const r1 = resumeTextJobRoleSchema.safeParse({ resumeText: '', jobRole: 'SWE' });
    const r2 = resumeTextJobRoleSchema.safeParse({ resumeText: 'text', jobRole: '' });
    assert.ok(!r1.success);
    assert.ok(!r2.success);
  });
});

describe('enhance.schema — generateEmailSchema', () => {
  test('defaults tone to Professional', () => {
    const result = generateEmailSchema.safeParse({
      resume: 'r',
      jobDesc: 'jd',
    });
    assert.ok(result.success);
    assert.equal(result.data.tone, 'Professional');
  });

  test('rejects invalid tone', () => {
    const result = generateEmailSchema.safeParse({
      resume: 'r',
      jobDesc: 'jd',
      tone: 'Aggressive',
    });
    assert.ok(!result.success);
  });
});

describe('enhance.schema — optimizeLinkedInSchema', () => {
  test('rejects profileText > 5000 chars', () => {
    const result = optimizeLinkedInSchema.safeParse({
      profileText: 'x'.repeat(5001),
    });
    assert.ok(!result.success);
  });

  test('accepts valid body', () => {
    const result = optimizeLinkedInSchema.safeParse({
      profileText: 'My profile',
      targetRole: 'PM',
    });
    assert.ok(result.success);
  });
});

// ─── Interview ────────────────────────────────────────────────────────────────
import { startInterviewSchema, submitAnswerSchema } from '../interview.schema.js';

describe('interview.schema — startInterviewSchema', () => {
  test('accepts valid body with defaults', () => {
    const result = startInterviewSchema.safeParse({
      jobRole: 'SWE',
      industry: 'Tech',
      experienceLevel: 'mid',
    });
    assert.ok(result.success);
    assert.equal(result.data.questionCount, 10);
  });

  test('rejects missing required fields', () => {
    const result = startInterviewSchema.safeParse({ jobRole: 'SWE' });
    assert.ok(!result.success);
  });

  test('rejects questionCount > 20', () => {
    const result = startInterviewSchema.safeParse({
      jobRole: 'SWE',
      industry: 'Tech',
      experienceLevel: 'mid',
      questionCount: 25,
    });
    assert.ok(!result.success);
  });
});

describe('interview.schema — submitAnswerSchema', () => {
  test('accepts valid body', () => {
    const result = submitAnswerSchema.safeParse({
      questionId: 'q1',
      transcript: 'My answer',
      duration: 45,
    });
    assert.ok(result.success);
  });

  test('rejects negative duration', () => {
    const result = submitAnswerSchema.safeParse({
      questionId: 'q1',
      transcript: 'ans',
      duration: -1,
    });
    assert.ok(!result.success);
  });
});

// ─── Job Tracker ─────────────────────────────────────────────────────────────
import {
  companyResearchSchema,
  trackJobSchema,
  updateTrackedJobSchema,
} from '../jobTracker.schema.js';

describe('jobTracker.schema — companyResearchSchema', () => {
  test('accepts valid body', () => {
    const result = companyResearchSchema.safeParse({ companyName: 'Google' });
    assert.ok(result.success);
  });

  test('rejects missing companyName', () => {
    const result = companyResearchSchema.safeParse({});
    assert.ok(!result.success);
  });
});

describe('jobTracker.schema — trackJobSchema', () => {
  test('accepts minimal body', () => {
    const result = trackJobSchema.safeParse({ title: 'SWE', company: 'Acme' });
    assert.ok(result.success);
    assert.equal(result.data.status, 'saved');
    assert.equal(result.data.location, 'Remote');
  });

  test('rejects invalid applyLink', () => {
    const result = trackJobSchema.safeParse({
      title: 'SWE',
      company: 'Acme',
      applyLink: 'not-a-url',
    });
    assert.ok(!result.success);
  });

  test('rejects invalid status', () => {
    const result = trackJobSchema.safeParse({
      title: 'SWE',
      company: 'Acme',
      status: 'ghosted',
    });
    assert.ok(!result.success);
  });
});

describe('jobTracker.schema — updateTrackedJobSchema', () => {
  test('accepts status only', () => {
    const result = updateTrackedJobSchema.safeParse({ status: 'applied' });
    assert.ok(result.success);
  });

  test('accepts notes only', () => {
    const result = updateTrackedJobSchema.safeParse({ notes: 'Followed up' });
    assert.ok(result.success);
  });

  test('rejects empty body', () => {
    const result = updateTrackedJobSchema.safeParse({});
    assert.ok(!result.success);
  });
});

// ─── Job Alerts ───────────────────────────────────────────────────────────────
import { createJobAlertSchema, updateJobAlertSchema } from '../jobAlerts.schema.js';

describe('jobAlerts.schema — createJobAlertSchema', () => {
  test('accepts minimal body with defaults', () => {
    const result = createJobAlertSchema.safeParse({ title: 'React Jobs' });
    assert.ok(result.success);
    assert.deepEqual(result.data.keywords, []);
    assert.deepEqual(result.data.employmentType, ['full-time']);
    assert.equal(result.data.remoteOnly, false);
  });

  test('rejects empty title', () => {
    const result = createJobAlertSchema.safeParse({ title: '' });
    assert.ok(!result.success);
  });

  test('rejects invalid employmentType', () => {
    const result = createJobAlertSchema.safeParse({
      title: 'Jobs',
      employmentType: ['full-time', 'ninja'],
    });
    assert.ok(!result.success);
  });
});

// ─── Payments ────────────────────────────────────────────────────────────────
import { createOrderSchema, verifyPaymentSchema } from '../payments.schema.js';

describe('payments.schema — createOrderSchema', () => {
  test('accepts valid proposalId', () => {
    const result = createOrderSchema.safeParse({ proposalId: 'abc123' });
    assert.ok(result.success);
  });

  test('rejects missing proposalId', () => {
    const result = createOrderSchema.safeParse({});
    assert.ok(!result.success);
  });
});

describe('payments.schema — verifyPaymentSchema', () => {
  test('accepts valid body', () => {
    const result = verifyPaymentSchema.safeParse({
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_456',
      razorpay_signature: 'sig_789',
      proposalId: 'prop_001',
    });
    assert.ok(result.success);
  });

  test('rejects missing razorpay fields', () => {
    const result = verifyPaymentSchema.safeParse({ proposalId: 'p1' });
    assert.ok(!result.success);
    assert.equal(result.error.issues.length, 3); // 3 missing razorpay fields
  });
});

// ─── Two-Factor Auth ──────────────────────────────────────────────────────────
import { enable2FASchema, tokenOnlySchema, backupCodeSchema } from '../twoFactor.schema.js';

describe('twoFactor.schema — enable2FASchema', () => {
  test('accepts valid body', () => {
    const result = enable2FASchema.safeParse({ secret: 'ABCD', token: '123456' });
    assert.ok(result.success);
  });

  test('rejects missing token', () => {
    const result = enable2FASchema.safeParse({ secret: 'ABCD' });
    assert.ok(!result.success);
  });
});

describe('twoFactor.schema — tokenOnlySchema', () => {
  test('accepts token', () => {
    const result = tokenOnlySchema.safeParse({ token: '123456' });
    assert.ok(result.success);
  });

  test('rejects missing token', () => {
    const result = tokenOnlySchema.safeParse({});
    assert.ok(!result.success);
  });
});

describe('twoFactor.schema — backupCodeSchema', () => {
  test('accepts code', () => {
    const result = backupCodeSchema.safeParse({ code: 'XXXX-YYYY' });
    assert.ok(result.success);
  });
});

// ─── User Profile ─────────────────────────────────────────────────────────────
import { updateProfileSchema } from '../userProfile.schema.js';

describe('userProfile.schema — updateProfileSchema', () => {
  test('accepts partial update', () => {
    const result = updateProfileSchema.safeParse({ displayName: 'Alice' });
    assert.ok(result.success);
  });

  test('accepts empty object (all fields optional)', () => {
    const result = updateProfileSchema.safeParse({});
    assert.ok(result.success);
  });

  test('rejects displayName > 100 chars', () => {
    const result = updateProfileSchema.safeParse({
      displayName: 'x'.repeat(101),
    });
    assert.ok(!result.success);
  });

  test('rejects skills array > 20 items', () => {
    const result = updateProfileSchema.safeParse({
      skills: Array.from({ length: 21 }, (_, i) => `skill${i}`),
    });
    assert.ok(!result.success);
  });
});

// ─── Community ────────────────────────────────────────────────────────────────
import {
  createChannelSchema,
  upsertPostSchema,
  createCommentSchema,
} from '../community.schema.js';

describe('community.schema — createChannelSchema', () => {
  test('accepts valid body with defaults', () => {
    const result = createChannelSchema.safeParse({ name: 'General' });
    assert.ok(result.success);
    assert.equal(result.data.isPrivate, false);
  });

  test('rejects empty name', () => {
    const result = createChannelSchema.safeParse({ name: '' });
    assert.ok(!result.success);
  });
});

describe('community.schema — upsertPostSchema', () => {
  test('accepts valid body', () => {
    const result = upsertPostSchema.safeParse({
      title: 'Hello',
      content: 'World',
    });
    assert.ok(result.success);
    assert.equal(result.data.category, 'general');
  });

  test('rejects missing content', () => {
    const result = upsertPostSchema.safeParse({ title: 'Hello' });
    assert.ok(!result.success);
  });
});

describe('community.schema — createCommentSchema', () => {
  test('accepts valid body', () => {
    const result = createCommentSchema.safeParse({ content: 'Nice post!' });
    assert.ok(result.success);
  });

  test('rejects content > 2000 chars', () => {
    const result = createCommentSchema.safeParse({ content: 'x'.repeat(2001) });
    assert.ok(!result.success);
  });
});

// ─── validate middleware ──────────────────────────────────────────────────────
import { validate } from '../../middleware/validate.js';

describe('validate middleware', () => {
  const mockSchema = z.object({
    name: z.string().min(1),
  });

  const makeReqRes = (body) => {
    const req = { body };
    const res = {
      _status: null, _json: null,
      status(code) { this._status = code; return this; },
      json(data) { this._json = data; return this; },
    };
    return { req, res };
  };

  test('calls next() on valid input and mutates req.body', (t, done) => {
    const { req, res } = makeReqRes({ name: 'Alice' });
    const mw = validate(mockSchema);
    mw(req, res, () => {
      assert.equal(req.body.name, 'Alice');
      done();
    });
  });

  test('returns 400 with structured details on invalid input', () => {
    const { req, res } = makeReqRes({});
    const mw = validate(mockSchema);
    mw(req, res, () => { assert.fail('next() should not be called'); });
    assert.equal(res._status, 400);
    assert.equal(res._json.success, false);
    assert.equal(res._json.error, 'Validation failed');
    assert.ok(Array.isArray(res._json.details));
    assert.equal(res._json.details[0].field, 'name');
  });

  test('validates query when target=query', (t, done) => {
    const req = { query: { name: 'Bob' } };
    const res = {};
    const mw = validate(mockSchema, 'query');
    mw(req, res, () => {
      assert.equal(req.query.name, 'Bob');
      done();
    });
  });
});
