import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {
  createMigrationRunner,
  MIGRATION_COLLECTION,
} from '../migrationRunner.js';

async function createTempMigrationDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'career-pilot-migrations-'));
}

async function writeMigration(dir, name, body) {
  await fs.writeFile(path.join(dir, name), body);
}

async function withDatabase(fn) {
  const mongo = await MongoMemoryServer.create();
  const connection = await mongoose.createConnection(mongo.getUri()).asPromise();

  try {
    await fn(connection.db);
  } finally {
    await connection.close();
    await mongo.stop();
  }
}

test('runs pending migrations in filename order and records them once', async () => {
  await withDatabase(async (db) => {
    const dir = await createTempMigrationDir();

    await writeMigration(
      dir,
      '002-add-index.js',
      `
      export const description = 'second migration';
      export async function up(db) {
        await db.collection('events').insertOne({ order: 2 });
      }
      export async function down(db) {
        await db.collection('events').deleteOne({ order: 2 });
      }
      `
    );

    await writeMigration(
      dir,
      '001-create-users.js',
      `
      export const description = 'first migration';
      export async function up(db) {
        await db.collection('events').insertOne({ order: 1 });
      }
      export async function down(db) {
        await db.collection('events').deleteOne({ order: 1 });
      }
      `
    );

    const runner = createMigrationRunner({ db, migrationsDir: dir, logger: { log() {}, warn() {}, error() {} } });

    const firstRun = await runner.up();
    const secondRun = await runner.up();

    assert.deepEqual(firstRun.applied, ['001-create-users', '002-add-index']);
    assert.deepEqual(secondRun.applied, []);
    assert.deepEqual(secondRun.skipped, ['001-create-users', '002-add-index']);

    const events = await db.collection('events').find().sort({ order: 1 }).toArray();
    assert.deepEqual(events.map((event) => event.order), [1, 2]);

    const records = await db.collection(MIGRATION_COLLECTION).find().toArray();
    assert.equal(records.length, 2);
  });
});

test('status reports applied and pending migrations', async () => {
  await withDatabase(async (db) => {
    const dir = await createTempMigrationDir();

    await writeMigration(
      dir,
      '001-applied.js',
      `export async function up() {}`
    );

    await writeMigration(
      dir,
      '002-pending.js',
      `export async function up() {}`
    );

    await db.collection(MIGRATION_COLLECTION).insertOne({
      id: '001-applied',
      appliedAt: new Date(),
    });

    const runner = createMigrationRunner({ db, migrationsDir: dir });
    const status = await runner.status();

    assert.deepEqual(
      status.map((item) => ({ id: item.id, applied: item.applied })),
      [
        { id: '001-applied', applied: true },
        { id: '002-pending', applied: false },
      ]
    );
  });
});

test('rolls back the latest applied migration only', async () => {
  await withDatabase(async (db) => {
    const dir = await createTempMigrationDir();

    await writeMigration(
      dir,
      '001-create-doc.js',
      `
      export async function up(db) {
        await db.collection('items').insertOne({ name: 'one' });
      }
      export async function down(db) {
        await db.collection('items').deleteOne({ name: 'one' });
      }
      `
    );

    await writeMigration(
      dir,
      '002-create-doc.js',
      `
      export async function up(db) {
        await db.collection('items').insertOne({ name: 'two' });
      }
      export async function down(db) {
        await db.collection('items').deleteOne({ name: 'two' });
      }
      `
    );

    const runner = createMigrationRunner({ db, migrationsDir: dir });

    await runner.up();
    const rollback = await runner.down({ steps: 1 });

    assert.deepEqual(rollback.reverted, ['002-create-doc']);

    const items = await db.collection('items').find().sort({ name: 1 }).toArray();
    assert.deepEqual(items.map((item) => item.name), ['one']);
  });
});

test('does not record a failed migration as applied', async () => {
  await withDatabase(async (db) => {
    const dir = await createTempMigrationDir();

    await writeMigration(
      dir,
      '001-fails.js',
      `
      export async function up() {
        throw new Error('boom');
      }
      `
    );

    const runner = createMigrationRunner({ db, migrationsDir: dir });

    await assert.rejects(() => runner.up(), /Migration 001-fails failed/);

    const records = await db.collection(MIGRATION_COLLECTION).find().toArray();
    assert.equal(records.length, 0);
  });
});

test('dry run reports migrations without mutating the database', async () => {
  await withDatabase(async (db) => {
    const dir = await createTempMigrationDir();

    await writeMigration(
      dir,
      '001-dry-run.js',
      `
      export async function up(db) {
        await db.collection('items').insertOne({ name: 'created' });
      }
      `
    );

    const runner = createMigrationRunner({ db, migrationsDir: dir });
    const result = await runner.up({ dryRun: true });

    assert.deepEqual(result.applied, ['001-dry-run']);

    const items = await db.collection('items').find().toArray();
    const records = await db.collection(MIGRATION_COLLECTION).find().toArray();

    assert.equal(items.length, 0);
    assert.equal(records.length, 0);
  });
});

test('prevents a second runner from executing while a migration lock is active', async () => {
  await withDatabase(async (db) => {
    const dir = await createTempMigrationDir();

    await writeMigration(
      dir,
      '001-lock-test.js',
      `
      export async function up(db) {
        await db.collection('items').insertOne({ name: 'locked' });
      }
      `
    );

    const firstRunner = createMigrationRunner({
      db,
      migrationsDir: dir,
      owner: 'first-runner',
      lockTtlMs: 60_000,
    });

    const secondRunner = createMigrationRunner({
      db,
      migrationsDir: dir,
      owner: 'second-runner',
      lockTtlMs: 60_000,
    });

    await firstRunner.ensureIndexes();

    await db.collection('schema_migration_locks').insertOne({
      _id: 'career-pilot-migration-runner',
      owner: 'first-runner',
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await assert.rejects(
      () => secondRunner.up(),
      /Another migration run is already in progress/
    );

    const records = await db.collection(MIGRATION_COLLECTION).find().toArray();
    assert.equal(records.length, 0);
  });
});