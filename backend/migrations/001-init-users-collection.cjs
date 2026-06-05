module.exports = {
  async up(db) {
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ createdAt: 1 });
  },
  async down(db) {
    await db.collection('users').dropIndex('email_1');
    await db.collection('users').dropIndex('createdAt_1');
  }
};