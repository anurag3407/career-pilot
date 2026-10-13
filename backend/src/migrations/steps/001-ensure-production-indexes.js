/**
 * Migration Step: 001-ensure-production-indexes.js
 * Ensures all production-critical database indexes, compound indexes,
 * TTL expiration indexes, and sparse unique indexes are created safely.
 */

export default {
  id: '001-ensure-production-indexes',
  description: 'Ensure production-grade database indexes across all collections',

  async up(db) {
    // 1. Users & Profiles
    await db.collection('users').createIndex({ role: 1 }, { background: true });
    await db.collection('userprofiles').createIndex({ openToWork: 1 }, { background: true });

    // 2. Login Attempts & Logs (with TTL)
    // Drop old single-field unique index on ip if present
    try {
      await db.collection('loginattempts').dropIndex('ip_1');
    } catch (e) {
      // Ignore if index didn't exist
    }
    await db.collection('loginattempts').createIndex({ ip: 1, email: 1 }, { background: true });
    await db.collection('loginattempts').createIndex({ updatedAt: 1 }, { expireAfterSeconds: 86400, background: true });
    await db.collection('loginlogs').createIndex({ createdAt: 1 }, { expireAfterSeconds: 7776000, background: true });

    // 3. Interviews
    await db.collection('interviews').createIndex({ userId: 1, createdAt: -1 }, { background: true });
    await db.collection('interviews').createIndex({ userId: 1, status: 1 }, { background: true });

    // 4. Project Analysis (sparse sessionId index)
    try {
      await db.collection('projectanalyses').dropIndex('sessionId_1');
    } catch (e) {
      // Ignore if index didn't exist
    }
    await db.collection('projectanalyses').createIndex({ sessionId: 1 }, { unique: true, sparse: true, background: true });

    // 5. Resume Comments, Shares & Token Usage
    await db.collection('resumecomments').createIndex({ resumeId: 1, createdAt: -1 }, { background: true });
    await db.collection('resumecomments').createIndex({ shareToken: 1, createdAt: -1 }, { background: true });
    await db.collection('resumeshares').createIndex({ resumeId: 1 }, { background: true });
    await db.collection('resumeshares').createIndex({ ownerId: 1, createdAt: -1 }, { background: true });
    await db.collection('resumeshares').createIndex({ expiresAt: 1 }, { background: true, sparse: true });
    await db.collection('tokenusages').createIndex({ userId: 1, createdAt: -1 }, { background: true });
    await db.collection('inputs').createIndex({ user: 1, createdAt: -1 }, { background: true });

    // 6. Portfolios & Fellowships & Jobs & Bugs
    await db.collection('portfolios').createIndex({ slug: 1 }, { background: true });
    await db.collection('fellowshipchatrooms').createIndex({ razorpayOrderId: 1 }, { background: true, sparse: true });
    await db.collection('fellowshipchatrooms').createIndex({ razorpayPaymentId: 1 }, { background: true, sparse: true });
    await db.collection('bugs').createIndex({ userEmail: 1, createdAt: -1 }, { background: true });
    await db.collection('jobs').createIndex({ recruiterEmail: 1 }, { background: true, sparse: true });
    await db.collection('challenges').createIndex({ selectedProposalId: 1 }, { background: true, sparse: true });
    await db.collection('recruiters').createIndex({ userId: 1, email: 1 }, { background: true });
  },

  async down(db) {
    try {
      await db.collection('users').dropIndex('role_1');
      await db.collection('userprofiles').dropIndex('openToWork_1');
      await db.collection('loginattempts').dropIndex('updatedAt_1');
      await db.collection('loginlogs').dropIndex('createdAt_1');
      await db.collection('interviews').dropIndex('userId_1_createdAt_-1');
      await db.collection('resumecomments').dropIndex('resumeId_1_createdAt_-1');
      await db.collection('resumeshares').dropIndex('resumeId_1');
      await db.collection('tokenusages').dropIndex('userId_1_createdAt_-1');
      await db.collection('inputs').dropIndex('user_1_createdAt_-1');
      await db.collection('portfolios').dropIndex('slug_1');
      await db.collection('bugs').dropIndex('userEmail_1_createdAt_-1');
    } catch (err) {
      // Soft ignore during teardown
    }
  }
};
