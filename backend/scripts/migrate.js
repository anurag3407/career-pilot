#!/usr/bin/env node
/**
 * Migration CLI
 * Usage:
 *   node scripts/migrate.js up       — run all pending migrations
 *   node scripts/migrate.js down     — rollback last migration
 *   node scripts/migrate.js status   — show migration status
 *   node scripts/migrate.js create <name> — create new migration file
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { runMigrations, rollbackMigration, migrationStatus } from '../src/migrations/migrationRunner.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerpilot';

/**
 * Generate timestamp for migration filename
 */
const generateTimestamp = () => {
  return new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
};

/**
 * Create a new migration file
 */
const createMigration = async (name) => {
  if (!name) {
    console.error('❌ Please provide a migration name: node migrate.js create <name>');
    process.exit(1);
  }

  const safeName = name.replace(/[^a-z0-9_]/gi, '_').toLowerCase();
  const timestamp = generateTimestamp();
  const filename = `${timestamp}_${safeName}.js`;
  const filePath = path.join(__dirname, '../src/migrations', filename);

  const template = `/**
 * Migration: ${timestamp}_${safeName}
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
`;

  await fs.writeFile(filePath, template, 'utf8');
  console.log(`✅ Created migration: ${filename}`);
  console.log(`📁 Location: backend/src/migrations/${filename}`);
};

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  console.log('📦 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('📦 Connected to MongoDB\n');
};

/**
 * Main CLI handler
 */
const main = async () => {
  const command = process.argv[2];
  const arg = process.argv[3];

  if (command === 'create') {
    await createMigration(arg);
    process.exit(0);
  }

  // All other commands need DB connection
  try {
    await connectDB();

    switch (command) {
      case 'up':
        await runMigrations();
        break;

      case 'down':
        await rollbackMigration();
        break;

      case 'status':
        await migrationStatus();
        break;

      default:
        console.log(`
🔧 CareerPilot Migration CLI

Usage:
  node scripts/migrate.js up              Run all pending migrations
  node scripts/migrate.js down            Rollback last migration
  node scripts/migrate.js status          Show migration status
  node scripts/migrate.js create <name>   Create new migration file

Examples:
  node scripts/migrate.js up
  node scripts/migrate.js create add_resume_indexes
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📦 Disconnected from MongoDB');
  }
};

main();