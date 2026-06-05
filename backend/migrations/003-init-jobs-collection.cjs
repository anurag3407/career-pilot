module.exports = {
  async up(db) {
    await db.collection('jobs').createIndex({ title: 'text', company: 'text' });
    await db.collection('jobs').createIndex({ postedAt: -1 });
  },
  async down(db) {
    await db.collection('jobs').dropIndex('title_text_company_text');
    await db.collection('jobs').dropIndex('postedAt_-1');
  }
};