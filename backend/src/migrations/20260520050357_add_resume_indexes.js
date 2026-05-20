/**
 * Migration: 20260520050357_add_resume_indexes
 * Description: Add your migration description here
 */

export const up = async (db) => {
  // Write your UP migration here
  // db is the mongoose connection object
  // Example: await db.collection('users').createIndex({ email: 1 });
};

export const down = async (db) => {
  // Write your DOWN (rollback) migration here
  // Example: await db.collection('users').dropIndex('email_1');
};
