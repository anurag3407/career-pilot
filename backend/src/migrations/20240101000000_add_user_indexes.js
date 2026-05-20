/**
 * Migration: 20240101000000_add_user_indexes
 * Adds indexes to the users collection for better query performance
 */

export const up = async (db) => {
  const collection = db.collection('users');

  await collection.createIndex({ email: 1 }, { unique: true, background: true });
  await collection.createIndex({ createdAt: -1 }, { background: true });

  console.log('    → Added email and createdAt indexes to users collection');
};

export const down = async (db) => {
  const collection = db.collection('users');

  await collection.dropIndex('email_1');
  await collection.dropIndex('createdAt_-1');

  console.log('    → Removed email and createdAt indexes from users collection');
};