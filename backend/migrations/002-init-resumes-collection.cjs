module.exports = {
  async up(db) {
    await db.collection('resumes').createIndex({ userId: 1 });
    await db.collection('resumes').createIndex({ createdAt: -1 });
  },
  async down(db) {
    await db.collection('resumes').dropIndex('userId_1');
    await db.collection('resumes').dropIndex('createdAt_-1');
  }
};