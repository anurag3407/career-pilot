module.exports = {
  async up(db) {
    await db.collection('jobalerts').createIndex({ userId: 1 });
    await db.collection('jobalerts').createIndex({ createdAt: 1 });
  },
  async down(db) {
    await db.collection('jobalerts').dropIndex('userId_1');
    await db.collection('jobalerts').dropIndex('createdAt_1');
  }
};