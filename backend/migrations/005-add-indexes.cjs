module.exports = {
  async up(db) {
    // Compound index for resume lookups by user + date
    await db.collection('resumes').createIndex({ userId: 1, createdAt: -1 });
    // TTL index to auto-expire unverified users after 7 days
    await db.collection('users').createIndex(
      { verifiedAt: 1 },
      { expireAfterSeconds: 604800, partialFilterExpression: { isVerified: false } }
    );
  },
  async down(db) {
    await db.collection('resumes').dropIndex('userId_1_createdAt_-1');
    await db.collection('users').dropIndex('verifiedAt_1');
  }
};