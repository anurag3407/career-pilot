import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Migration version tracking schema
const migrationSchema = new mongoose.Schema({
  version: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['applied', 'rolled_back'], default: 'applied' },
});

const Migration = mongoose.models.Migration || mongoose.model('Migration', migrationSchema);

/**
 * Get all applied migration versions from DB
 */
const getAppliedMigrations = async () => {
  const applied = await Migration.find({ status: 'applied' }).sort({ version: 1 });
  return applied.map((m) => m.version);
};

/**
 * Get all migration files from migrations directory
 */
const getMigrationFiles = async () => {
  const migrationsDir = __dirname;
  const files = await fs.readdir(migrationsDir);

  return files
    .filter((f) => f.match(/^\d{14}_[\w]+\.js$/) && f !== 'migrationRunner.js')
    .sort();
};

/**
 * Load a migration module dynamically
 */
const loadMigration = async (filename) => {
  const filePath = path.join(__dirname, filename);
  const migration = await import(filePath);
  return migration;
};

/**
 * Run all pending UP migrations
 */
export const runMigrations = async () => {
  console.log('🔄 Checking for pending migrations...');

  const appliedVersions = await getAppliedMigrations();
  const migrationFiles = await getMigrationFiles();

  const pending = migrationFiles.filter((file) => {
    const version = file.split('_')[0];
    return !appliedVersions.includes(version);
  });

  if (pending.length === 0) {
    console.log('✅ No pending migrations. Database is up to date.');
    return;
  }

  console.log(`📦 Found ${pending.length} pending migration(s):`);

  for (const file of pending) {
    const version = file.split('_')[0];
    const name = file.replace('.js', '');

    console.log(`  ⬆️  Running migration: ${name}`);

    try {
      const migration = await loadMigration(file);

      if (typeof migration.up !== 'function') {
        throw new Error(`Migration ${file} must export an "up" function`);
      }

      await migration.up(mongoose.connection);

      await Migration.create({ version, name, status: 'applied' });

      console.log(`  ✅ Migration applied: ${name}`);
    } catch (error) {
      console.error(`  ❌ Migration failed: ${name}`);
      console.error(`     Error: ${error.message}`);
      throw error;
    }
  }

  console.log('🎉 All migrations applied successfully.');
};

/**
 * Rollback the last applied migration (DOWN)
 */
export const rollbackMigration = async () => {
  console.log('🔄 Rolling back last migration...');

  const lastMigration = await Migration.findOne({ status: 'applied' }).sort({ appliedAt: -1 });

  if (!lastMigration) {
    console.log('✅ No migrations to roll back.');
    return;
  }

  const file = `${lastMigration.name}.js`;
  console.log(`  ⬇️  Rolling back: ${lastMigration.name}`);

  try {
    const migration = await loadMigration(file);

    if (typeof migration.down !== 'function') {
      throw new Error(`Migration ${file} must export a "down" function for rollback`);
    }

    await migration.down(mongoose.connection);

    await Migration.updateOne(
      { version: lastMigration.version },
      { status: 'rolled_back' }
    );

    console.log(`  ✅ Rolled back: ${lastMigration.name}`);
  } catch (error) {
    console.error(`  ❌ Rollback failed: ${lastMigration.name}`);
    console.error(`     Error: ${error.message}`);
    throw error;
  }
};

/**
 * Show migration status
 */
export const migrationStatus = async () => {
  const appliedVersions = await getAppliedMigrations();
  const migrationFiles = await getMigrationFiles();

  console.log('\n📊 Migration Status:');
  console.log('─'.repeat(60));

  if (migrationFiles.length === 0) {
    console.log('  No migration files found.');
    return;
  }

  for (const file of migrationFiles) {
    const version = file.split('_')[0];
    const name = file.replace('.js', '');
    const isApplied = appliedVersions.includes(version);
    const status = isApplied ? '✅ applied' : '⏳ pending';
    console.log(`  ${status}  ${name}`);
  }

  console.log('─'.repeat(60));
  console.log(`  Total: ${migrationFiles.length} | Applied: ${appliedVersions.length} | Pending: ${migrationFiles.length - appliedVersions.length}\n`);
};