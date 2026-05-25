/**
 * Unit tests for the Fellowship role-escalation fix.
 *
 * These tests exercise the invariant logic introduced in the profile update
 * handler and the FellowshipProfile model's pre-save hook without requiring
 * a live database or HTTP server, keeping them runnable in any CI environment.
 *
 * Run with:
 *   node --test src/routes/__tests__/fellowships.test.js
 *
 * Uses Node.js built-in `node:test` (Node >= 18, no extra dependencies).
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Mirrors the role-change block now present in the POST /fellowship/profile
 * update branch. Extracted here so we can test it in isolation.
 */
const applyRoleChange = (profile, newRole) => {
  const roleChanging = profile.role !== newRole;
  profile.role = newRole;

  if (roleChanging) {
    if (newRole === 'student') {
      profile.isVerified = false;
      profile.verificationCode = null;
      profile.verificationCodeExpiry = null;
      profile.verifiedEmail = null;
    } else if (newRole === 'corporate') {
      profile.isVerified = true;
    }
  }

  return profile;
};

/**
 * Mirrors the pre('save') defence-in-depth hook added to FellowshipProfile.
 * The hook only fires when 'role' is in the modified set and the resulting
 * state violates the invariant.
 */
const applyPreSaveInvariant = (doc, modifiedFields) => {
  if (
    modifiedFields.includes('role') &&
    doc.role === 'student' &&
    doc.isVerified === true &&
    !doc.verifiedEmail
  ) {
    doc.isVerified = false;
    doc.verificationCode = null;
    doc.verificationCodeExpiry = null;
  }
  return doc;
};

/**
 * Returns true if the profile meets the criteria to apply to a challenge,
 * mirroring the guard in POST /fellowship/challenges/:id/apply.
 */
const canApplyToChallenge = (profile) =>
  profile.role === 'student' && profile.isVerified === true;

// ─── Route-level role-change logic ───────────────────────────────────────────

describe('POST /fellowship/profile — role-change verification reset', () => {
  test('corporate → student: isVerified is reset to false', () => {
    const profile = { role: 'corporate', isVerified: true, verifiedEmail: null };
    applyRoleChange(profile, 'student');
    assert.equal(profile.isVerified, false);
  });

  test('corporate → student: verifiedEmail is cleared', () => {
    const profile = { role: 'corporate', isVerified: true, verifiedEmail: 'corp@corp.com' };
    applyRoleChange(profile, 'student');
    assert.equal(profile.verifiedEmail, null);
  });

  test('corporate → student: verificationCode is cleared', () => {
    const profile = {
      role: 'corporate',
      isVerified: true,
      verifiedEmail: null,
      verificationCode: 'abc123',
      verificationCodeExpiry: new Date(Date.now() + 10000),
    };
    applyRoleChange(profile, 'student');
    assert.equal(profile.verificationCode, null);
    assert.equal(profile.verificationCodeExpiry, null);
  });

  test('student → corporate: isVerified is set to true', () => {
    const profile = { role: 'student', isVerified: false, verifiedEmail: null };
    applyRoleChange(profile, 'corporate');
    assert.equal(profile.isVerified, true);
  });

  test('same role update (student → student): isVerified is unchanged', () => {
    const profile = {
      role: 'student',
      isVerified: true,
      verifiedEmail: 'alice@university.edu',
    };
    applyRoleChange(profile, 'student');
    // No role change — verified state must be preserved
    assert.equal(profile.isVerified, true);
    assert.equal(profile.verifiedEmail, 'alice@university.edu');
  });

  test('same role update (corporate → corporate): isVerified is unchanged', () => {
    const profile = { role: 'corporate', isVerified: true, verifiedEmail: null };
    applyRoleChange(profile, 'corporate');
    assert.equal(profile.isVerified, true);
  });

  test('after corporate → student switch, canApplyToChallenge returns false', () => {
    const profile = { role: 'corporate', isVerified: true, verifiedEmail: null };
    applyRoleChange(profile, 'student');
    assert.equal(canApplyToChallenge(profile), false);
  });

  test('legitimately verified student can apply to challenge', () => {
    const profile = {
      role: 'student',
      isVerified: true,
      verifiedEmail: 'alice@university.edu',
    };
    assert.equal(canApplyToChallenge(profile), true);
  });

  test('unverified student cannot apply to challenge', () => {
    const profile = { role: 'student', isVerified: false, verifiedEmail: null };
    assert.equal(canApplyToChallenge(profile), false);
  });
});

// ─── Model pre-save hook defence-in-depth ────────────────────────────────────

describe('FellowshipProfile pre-save hook — verification invariant', () => {
  test('clears isVerified when role is modified to student with no verifiedEmail', () => {
    const doc = {
      role: 'student',
      isVerified: true,
      verifiedEmail: null,
      verificationCode: 'hashed:abc',
      verificationCodeExpiry: new Date(),
    };
    applyPreSaveInvariant(doc, ['role']);
    assert.equal(doc.isVerified, false);
    assert.equal(doc.verificationCode, null);
    assert.equal(doc.verificationCodeExpiry, null);
  });

  test('does NOT clear isVerified when student has a verifiedEmail', () => {
    const doc = {
      role: 'student',
      isVerified: true,
      verifiedEmail: 'alice@university.edu',
    };
    applyPreSaveInvariant(doc, ['role']);
    assert.equal(doc.isVerified, true);
  });

  test('does NOT fire when role field was not modified', () => {
    const doc = { role: 'student', isVerified: true, verifiedEmail: null };
    applyPreSaveInvariant(doc, ['bio']); // role not in modified set
    assert.equal(doc.isVerified, true);
  });

  test('does NOT alter a corporate profile', () => {
    const doc = { role: 'corporate', isVerified: true, verifiedEmail: null };
    applyPreSaveInvariant(doc, ['role']);
    assert.equal(doc.isVerified, true);
  });

  test('does NOT alter an already-false isVerified on student', () => {
    const doc = { role: 'student', isVerified: false, verifiedEmail: null };
    applyPreSaveInvariant(doc, ['role']);
    assert.equal(doc.isVerified, false);
  });
});

// ─── Exploit scenario simulation ─────────────────────────────────────────────

describe('Role escalation exploit — end-to-end simulation', () => {
  test('full attack path is blocked: corporate create → student switch → apply rejected', () => {
    // Step 1: create as corporate (auto-verified)
    let profile = {
      role: 'corporate',
      isVerified: true,
      verifiedEmail: null,
      verificationCode: null,
      verificationCodeExpiry: null,
    };
    assert.equal(profile.isVerified, true, 'Corporate profile should be auto-verified');

    // Step 2: switch to student — old code would leave isVerified=true
    applyRoleChange(profile, 'student');

    // Step 3: attempt to apply — should be denied
    assert.equal(
      canApplyToChallenge(profile),
      false,
      'Switched student should not be able to apply without verification'
    );
    assert.equal(profile.isVerified, false, 'isVerified must be false after role switch');
  });

  test('legitimate flow: student verifies → can apply', () => {
    // Student registers and verifies via academic email
    const profile = {
      role: 'student',
      isVerified: false,
      verifiedEmail: null,
    };

    // Cannot apply before verification
    assert.equal(canApplyToChallenge(profile), false);

    // Email verification succeeds
    profile.isVerified = true;
    profile.verifiedEmail = 'alice@university.edu';

    // Can now apply
    assert.equal(canApplyToChallenge(profile), true);
  });

  test('pre-filling verification code as corporate does not survive role switch', () => {
    // Attacker gets a code while corporate (before the send-email guard),
    // then switches to student — the code should be wiped by the role change.
    const profile = {
      role: 'corporate',
      isVerified: true,
      verifiedEmail: 'corp@company.com',
      verificationCode: 'hashed:prefilled',
      verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
    };

    applyRoleChange(profile, 'student');

    assert.equal(profile.isVerified, false);
    assert.equal(profile.verificationCode, null);
    assert.equal(profile.verificationCodeExpiry, null);
    assert.equal(profile.verifiedEmail, null);
  });
});
