import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_MIGRATIONS_DIR = path.join(__dirname, 'steps');
export const MIGRATION_COLLECTION = 'schema_migrations';
export const MIGRATION_LOCK_COLLECTION = 'schema_migration_locks';
export const MIGRATION_LOCK_ID = 'career-pilot-migration-runner';

const now = () => new Date();

export class MigrationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'MigrationError';
    this.details = details;
  }
}

export function createMigrationRunner({
  db,
  migrationsDir = DEFAULT_MIGRATIONS_DIR,
  logger = console,
  lockTtlMs = 5 * 60 * 1000,
  owner = `${process.pid}-${Date.now()}`,
} = {}) {
  if (!db) {
    throw new MigrationError('MongoDB database handle is required');
  }

  const migrations = db.collection(MIGRATION_COLLECTION);
  const locks = db.collection(MIGRATION_LOCK_COLLECTION);

  async function ensureIndexes() {
    await migrations.createIndex({ id: 1 }, { unique: true });
    await migrations.createIndex({ appliedAt: -1 });
    await locks.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    logger.debug?.('Migration indexes ensured');
  }

  async function acquireLock() {
  const expiresAt = new Date(Date.now() + lockTtlMs);
  const lockDocument = {
    _id: MIGRATION_LOCK_ID,
    owner,
    expiresAt,
    createdAt: now(),
    updatedAt: now(),
  };

  try {
    await locks.insertOne(lockDocument);
    return lockDocument;
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }
  }

  const result = await locks.findOneAndUpdate(
    {
      _id: MIGRATION_LOCK_ID,
      expiresAt: { $lte: now() },
    },
    {
      $set: {
        owner,
        expiresAt,
        updatedAt: now(),
      },
    },
    {
      returnDocument: 'after',
    }
  );

  const lock = result?.value ?? result;

  if (!lock || lock.owner !== owner) {
    const existingLock = await locks.findOne({ _id: MIGRATION_LOCK_ID });

    throw new MigrationError('Another migration run is already in progress', {
      lockOwner: existingLock?.owner,
      expiresAt: existingLock?.expiresAt,
    });
  }

  return lock;
}

  async function releaseLock() {
    await locks.deleteOne({ _id: MIGRATION_LOCK_ID, owner });
  }

  async function loadMigrationFiles() {
    let entries;

    try {
      entries = await fs.readdir(migrationsDir, { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }

      throw new MigrationError('Unable to read migrations directory', {
        migrationsDir,
        cause: error.message,
      });
    }

    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => /^\d{3,}-.+\.js$/.test(name))
      .sort();

    return Promise.all(
      files.map(async (fileName) => {
        const filePath = path.join(migrationsDir, fileName);
        const imported = await import(pathToFileURL(filePath).href);
        const migration = imported.default || imported;

        validateMigration(migration, fileName);

        return {
          id: migration.id || fileName.replace(/\.js$/, ''),
          description: migration.description || '',
          fileName,
          up: migration.up,
          down: migration.down,
        };
      })
    );
  }

  function validateMigration(migration, fileName) {
    if (!migration || typeof migration !== 'object') {
      throw new MigrationError(`Migration ${fileName} must export an object`);
    }

    if (typeof migration.up !== 'function') {
      throw new MigrationError(`Migration ${fileName} must export an up(db) function`);
    }

    if (migration.down && typeof migration.down !== 'function') {
      throw new MigrationError(`Migration ${fileName} down export must be a function`);
    }
  }

  async function getAppliedMigrationIds() {
    const applied = await migrations
      .find({}, { projection: { id: 1 } })
      .sort({ id: 1 })
      .toArray();

    return new Set(applied.map((migration) => migration.id));
  }

  async function status() {
    await ensureIndexes();

    const files = await loadMigrationFiles();
    const appliedIds = await getAppliedMigrationIds();

    return files.map((migration) => ({
      id: migration.id,
      description: migration.description,
      applied: appliedIds.has(migration.id),
    }));
  }

  async function up({ dryRun = false } = {}) {
    await ensureIndexes();
    await acquireLock();

    const applied = [];
    const skipped = [];

    try {
      const files = await loadMigrationFiles();
      const appliedIds = await getAppliedMigrationIds();

      for (const migration of files) {
        if (appliedIds.has(migration.id)) {
          skipped.push(migration.id);
          continue;
        }

        if (dryRun) {
          applied.push(migration.id);
          continue;
        }

        const startedAt = now();

        try {
          await migration.up(db);

          await migrations.insertOne({
            id: migration.id,
            description: migration.description,
            fileName: migration.fileName,
            appliedAt: now(),
            durationMs: now() - startedAt,
          });

          applied.push(migration.id);
        } catch (error) {
          throw new MigrationError(`Migration ${migration.id} failed`, {
            migrationId: migration.id,
            cause: error.message,
          });
        }
      }

      return { applied, skipped, dryRun };
    } finally {
      await releaseLock();
    }
  }

  async function down({ steps = 1, dryRun = false } = {}) {
    await ensureIndexes();
    await acquireLock();

    const reverted = [];

    try {
      const files = await loadMigrationFiles();
      const byId = new Map(files.map((migration) => [migration.id, migration]));

      const applied = await migrations
        .find({})
        .sort({ appliedAt: -1 })
        .limit(steps)
        .toArray();

      for (const record of applied) {
        const migration = byId.get(record.id);

        if (!migration?.down) {
          throw new MigrationError(`Migration ${record.id} cannot be rolled back`);
        }

        if (dryRun) {
          reverted.push(record.id);
          continue;
        }

        await migration.down(db);
        await migrations.deleteOne({ id: record.id });
        reverted.push(record.id);
      }

      return { reverted, dryRun };
    } finally {
      await releaseLock();
    }
  }

  return {
    up,
    down,
    status,
    loadMigrationFiles,
    ensureIndexes,
  };
}

function parseArgs(argv) {
  const command = argv[2] || 'status';

  return {
    command,
    dryRun: argv.includes('--dry-run'),
    steps: Number(
      argv.find((arg) => arg.startsWith('--steps='))?.split('=')[1] || 1
    ),
  };
}

async function runCli() {
  const { command, dryRun, steps } = parseArgs(process.argv);

  await connectDB();

  const runner = createMigrationRunner({
    db: mongoose.connection.db,
  });

  if (command === 'up') {
    const result = await runner.up({ dryRun });
    console.log(JSON.stringify(result, null, 2));
  } else if (command === 'down') {
    const result = await runner.down({ steps, dryRun });
    console.log(JSON.stringify(result, null, 2));
  } else if (command === 'status') {
    const result = await runner.status();
    console.table(result);
  } else {
    throw new MigrationError(`Unknown migration command: ${command}`);
  }

  await mongoose.disconnect();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
}