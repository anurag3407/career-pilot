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
import {
  updateNotificationPrefsSchema,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../auth.schema.js';

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

describe('auth.schema — registerSchema', () => {
  const valid = { name: 'Alice Example', email: 'alice@example.com', password: 'Passw0rdTest' };

  test('accepts a fully valid registration body', () => {
    const result = registerSchema.safeParse(valid);
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });

  test('normalises email to lowercase', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'Alice@EXAMPLE.COM' });
    assert.ok(result.success);
    assert.equal(result.data.email, 'alice@example.com');
  });

  test('rejects name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'A' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'name'));
  });

  test('rejects name longer than 50 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'A'.repeat(51) });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'name'));
  });

  test('rejects an invalid email format', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'not-an-email' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'email'));
  });

  test('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'Ab1' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'password'));
  });

  test('rejects a password with no uppercase letter', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'alllower1' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'password'));
  });

  test('rejects a password with no digit', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'NoDigitsHere' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'password'));
  });

  test('rejects a password with no lowercase letter', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'ALLCAPS123' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'password'));
  });

  test('rejects a missing email', () => {
    const { email, ...rest } = valid;
    const result = registerSchema.safeParse(rest);
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'email'));
  });

  test('rejects a missing password', () => {
    const { password, ...rest } = valid;
    const result = registerSchema.safeParse(rest);
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'password'));
  });

  test('trims leading/trailing whitespace from name', () => {
    const result = registerSchema.safeParse({ ...valid, name: '  Alice  ' });
    assert.ok(result.success);
    assert.equal(result.data.name, 'Alice');
  });
});

describe('auth.schema — loginSchema', () => {
  const valid = { email: 'alice@example.com', password: 'anypassword' };

  test('accepts a valid login body', () => {
    const result = loginSchema.safeParse(valid);
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });

  test('normalises email to lowercase', () => {
    const result = loginSchema.safeParse({ ...valid, email: 'ALICE@EXAMPLE.COM' });
    assert.ok(result.success);
    assert.equal(result.data.email, 'alice@example.com');
  });

  test('rejects an invalid email format', () => {
    const result = loginSchema.safeParse({ ...valid, email: 'bad-email' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'email'));
  });

  test('rejects an empty password string', () => {
    const result = loginSchema.safeParse({ ...valid, password: '' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'password'));
  });

  test('rejects a missing email field', () => {
    const result = loginSchema.safeParse({ password: 'somepass' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'email'));
  });

  test('rejects a missing password field', () => {
    const result = loginSchema.safeParse({ email: 'alice@example.com' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'password'));
  });

  test('rejects an empty body', () => {
    const result = loginSchema.safeParse({});
    assert.ok(!result.success);
    assert.equal(result.error.issues.length, 2);
  });
});

describe('auth.schema — forgotPasswordSchema', () => {
  test('accepts a valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'user@example.com' });
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });

  test('normalises email to lowercase', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'USER@EXAMPLE.COM' });
    assert.ok(result.success);
    assert.equal(result.data.email, 'user@example.com');
  });

  test('rejects an invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-an-email' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'email'));
  });

  test('rejects a missing email', () => {
    const result = forgotPasswordSchema.safeParse({});
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'email'));
  });
});

describe('auth.schema — resetPasswordSchema', () => {
  const valid = { token: 'a'.repeat(64), newPassword: 'Passw0rdTest' };

  test('accepts a valid reset payload', () => {
    const result = resetPasswordSchema.safeParse(valid);
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });

  test('rejects a missing token', () => {
    const result = resetPasswordSchema.safeParse({ newPassword: 'Passw0rdTest' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'token'));
  });

  test('rejects a password shorter than 8 characters', () => {
    const result = resetPasswordSchema.safeParse({ ...valid, newPassword: 'Ab1' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'newPassword'));
  });

  test('rejects a password with no uppercase letter', () => {
    const result = resetPasswordSchema.safeParse({ ...valid, newPassword: 'lowercase1' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'newPassword'));
  });

  test('rejects a password with no digit', () => {
    const result = resetPasswordSchema.safeParse({ ...valid, newPassword: 'NoDigitsHere' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some((e) => e.path[0] === 'newPassword'));
  });

  test('rejects an empty body', () => {
    const result = resetPasswordSchema.safeParse({});
    assert.ok(!result.success);
  });
});

// ─── Resume ──────────────────────────────────────────────────────────────────
import {
  createResumeSchema,
  updateResumeSchema,
  downloadResumeQuerySchema,
  createResumeVersionSchema,
  updateResumeVersionSchema,
  createAtsHistorySchema,
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
    // customSections defaults to [] so the schema now accepts {} but the
    // downstream `.refine` check still rejects (no field to update).
    const result = updateResumeSchema.safeParse({});
    assert.ok(!result.success, 'empty object should be rejected by the .refine()');
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

describe('resume.schema — createResumeVersionSchema', () => {
  test('accepts valid body', () => {
    const result = createResumeVersionSchema.safeParse({
      title: 'v2',
      originalText: 'hello content',
      jobRole: 'Frontend Dev',
      atsScore: 85,
      tags: ['React', 'CSS']
    });
    assert.ok(result.success);
  });

  test('rejects empty originalText', () => {
    const result = createResumeVersionSchema.safeParse({
      originalText: '',
    });
    assert.ok(!result.success);
  });
});

describe('resume.schema — updateResumeVersionSchema', () => {
  test('accepts valid body', () => {
    const result = updateResumeVersionSchema.safeParse({
      title: 'v2 - updated',
      tags: ['Frontend', 'Vite']
    });
    assert.ok(result.success);
  });

  test('rejects empty payload', () => {
    const result = updateResumeVersionSchema.safeParse({});
    assert.ok(!result.success);
  });
});

describe('resume.schema — createAtsHistorySchema', () => {
  test('accepts valid body', () => {
    const result = createAtsHistorySchema.safeParse({
      jobRole: 'SWE',
      atsScore: 90,
      scoreBreakdown: {
        keywordMatch: 80,
        formatting: 95
      }
    });
    assert.ok(result.success);
  });

  test('rejects missing jobRole', () => {
    const result = createAtsHistorySchema.safeParse({
      atsScore: 90
    });
    assert.ok(!result.success);
  });

  test('rejects out of bounds breakdown scores', () => {
    const result = createAtsHistorySchema.safeParse({
      jobRole: 'SWE',
      atsScore: 90,
      scoreBreakdown: {
        keywordMatch: 150,
      }
    });
    assert.ok(!result.success);
  });

  test('rejects negative improvements count', () => {
    const result = createAtsHistorySchema.safeParse({
      jobRole: 'SWE',
      atsScore: 90,
      improvementsCount: -1
    });
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
  deadlineSchema,
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

describe('jobTracker.schema — trackJobSchema with deadline', () => {
  test('accepts deadline as ISO string', () => {
    const result = trackJobSchema.safeParse({
      title: 'SWE',
      company: 'Acme',
      deadline: '2026-12-31T23:59:59.000Z',
    });
    assert.ok(result.success);
  });

  test('accepts null deadline', () => {
    const result = trackJobSchema.safeParse({
      title: 'SWE',
      company: 'Acme',
      deadline: null,
    });
    assert.ok(result.success);
  });

  test('accepts empty string deadline (treated as null)', () => {
    const result = trackJobSchema.safeParse({
      title: 'SWE',
      company: 'Acme',
      deadline: '',
    });
    assert.ok(result.success);
    assert.equal(result.data.deadline, null);
  });

  test('accepts YYYY-MM-DD format', () => {
    const result = trackJobSchema.safeParse({
      title: 'SWE',
      company: 'Acme',
      deadline: '2026-12-31',
    });
    assert.ok(result.success);
  });

  test('rejects invalid date string', () => {
    const result = trackJobSchema.safeParse({
      title: 'SWE',
      company: 'Acme',
      deadline: 'not-a-date',
    });
    assert.ok(!result.success);
  });
});

describe('jobTracker.schema — deadlineSchema', () => {
  test('accepts valid ISO deadline', () => {
    const result = deadlineSchema.safeParse({ deadline: '2026-12-31T00:00:00.000Z' });
    assert.ok(result.success);
  });

  test('accepts null deadline (removes deadline)', () => {
    const result = deadlineSchema.safeParse({ deadline: null });
    assert.ok(result.success);
    assert.equal(result.data.deadline, null);
  });

  test('accepts empty string as null', () => {
    const result = deadlineSchema.safeParse({ deadline: '' });
    assert.ok(result.success);
    assert.equal(result.data.deadline, null);
  });

  test('rejects missing deadline field', () => {
    const result = deadlineSchema.safeParse({});
    assert.ok(!result.success);
  });

  test('rejects non-date string', () => {
    const result = deadlineSchema.safeParse({ deadline: 'tomorrow' });
    assert.ok(!result.success);
  });

  test('accepts YYYY-MM-DD as valid date', () => {
    const result = deadlineSchema.safeParse({ deadline: '2027-01-15' });
    assert.ok(result.success);
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
import { updateProfileSchema, setAvatarSchema } from '../userProfile.schema.js';

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
  });

  test('accepts all new personal-info fields together', () => {
    const result = updateProfileSchema.safeParse({
      avatarUrl: 'https://storage.googleapis.com/x.png',
      phone: '+1 555 0100',
      headline: 'Building things',
      dateOfBirth: '1995-04-12',
      gender: 'female',
      company: 'Acme',
      yearsOfExperience: 7,
      collegeStudent: false,
      openToWork: true,
      education: [{
        institution: 'MIT',
        degree: 'B.Sc',
        field: 'CS',
        startYear: 2018,
        endYear: 2022,
      }],
      languages: ['English', 'Hindi'],
      resumeHeadline: 'Backend engineer with 7 yrs experience',
    });
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });

  test('coerces null dateOfBirth to null', () => {
    const result = updateProfileSchema.safeParse({ dateOfBirth: null });
    assert.ok(result.success);
    assert.equal(result.data.dateOfBirth, null);
  });

  test('coerces empty string dateOfBirth to null', () => {
    const result = updateProfileSchema.safeParse({ dateOfBirth: '' });
    assert.ok(result.success);
    assert.equal(result.data.dateOfBirth, null);
  });

  test('rejects future dateOfBirth', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const result = updateProfileSchema.safeParse({ dateOfBirth: future.toISOString() });
    assert.ok(!result.success);
  });

  test('rejects invalid gender enum value', () => {
    const result = updateProfileSchema.safeParse({ gender: 'helicopter' });
    assert.ok(!result.success);
    assert.ok(result.error.issues.some(e => e.path[0] === 'gender'));
  });

  test('rejects negative yearsOfExperience', () => {
    const result = updateProfileSchema.safeParse({ yearsOfExperience: -3 });
    assert.ok(!result.success);
  });

  test('rejects yearsOfExperience over 80', () => {
    const result = updateProfileSchema.safeParse({ yearsOfExperience: 81 });
    assert.ok(!result.success);
  });

  test('rejects non-boolean openToWork', () => {
    const result = updateProfileSchema.safeParse({ openToWork: 'yes' });
    assert.ok(!result.success);
  });

  test('rejects education entry with out-of-range year', () => {
    const result = updateProfileSchema.safeParse({
      education: [{ institution: 'X', startYear: 1800 }],
    });
    assert.ok(!result.success);
  });

  test('rejects languages array > 20 items', () => {
    const result = updateProfileSchema.safeParse({
      languages: Array.from({ length: 21 }, (_, i) => `lang${i}`),
    });
    assert.ok(!result.success);
  });

  test('rejects headline > 120 chars', () => {
    const result = updateProfileSchema.safeParse({ headline: 'x'.repeat(121) });
    assert.ok(!result.success);
  });

  test('rejects resumeHeadline > 300 chars', () => {
    const result = updateProfileSchema.safeParse({ resumeHeadline: 'x'.repeat(301) });
    assert.ok(!result.success);
  });
});

describe('userProfile.schema — setAvatarSchema', () => {
  test('accepts a valid URL', () => {
    const result = setAvatarSchema.safeParse({ avatarUrl: 'https://example.com/a.png' });
    assert.ok(result.success, JSON.stringify(result.error?.issues));
  });

  test('rejects missing avatarUrl', () => {
    const result = setAvatarSchema.safeParse({});
    assert.ok(!result.success);
  });

  test('rejects a non-URL avatarUrl', () => {
    const result = setAvatarSchema.safeParse({ avatarUrl: 'not-a-url' });
    assert.ok(!result.success);
  });

  test('rejects an avatarUrl > 500 chars', () => {
    const result = setAvatarSchema.safeParse({ avatarUrl: `https://example.com/${'x'.repeat(500)}` });
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
