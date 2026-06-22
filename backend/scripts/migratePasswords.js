/**
 * One-time migration: flag users whose stored password is plaintext.
 *
 * Background: before bcrypt hashing was introduced, the /api/auth/register
 * endpoint persisted raw passwords directly to MongoDB. This script finds
 * every user document whose password field does not start with a bcrypt prefix
 * ($2b$ or $2a$) and marks requiresPasswordReset = true so that the next login
 * attempt redirects them through the password-reset flow instead of attempting
 * a bcrypt.compare against a plaintext string.
 *
 * The plaintext password is NOT read, logged, or transmitted — the script only
 * checks whether the stored value looks like a bcrypt hash.
 *
 * Usage:
 *   MONGODB_URI=<uri> node backend/scripts/migratePasswords.js
 *
 * Run once after deploying the bcrypt fix. Safe to re-run (idempotent).
 */

import mongoose from 'mongoose';
import 'dotenv/config';

const BCRYPT_PREFIX_PATTERN = /^\$2[ab]\$/;
const BATCH_SIZE = 200;

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: { type: String, select: false },
    requiresPasswordReset: { type: Boolean, default: false },
  },
  { strict: false }
);

const User = mongoose.model('User', userSchema);

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  let flagged = 0;
  let alreadyHashed = 0;
  let skipped = 0;
  let toFlag = [];

  const flushBatch = async () => {
    if (toFlag.length === 0) return;
    await User.bulkWrite(
      toFlag.map((id) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { requiresPasswordReset: true } },
        },
      }))
    );
    toFlag = [];
  };

  // Stream with a cursor so memory stays bounded regardless of collection size.
  const cursor = User.find({
    password: { $exists: true, $type: 'string' },
    requiresPasswordReset: { $ne: true },
  })
    .select('+password email requiresPasswordReset')
    .cursor();

  for await (const user of cursor) {
    // Treat null/undefined as missing password — skip without flagging.
    if (user.password == null) {
      skipped++;
      continue;
    }

    // Empty string is not a valid hash and should be treated as insecure plaintext.
    if (BCRYPT_PREFIX_PATTERN.test(user.password)) {
      alreadyHashed++;
      continue;
    }

    // Password does not look like a bcrypt hash — treat it as plaintext.
    // Redact the email in logs to avoid exposing PII in CI/CD output.
    const [local, domain] = (user.email || '').split('@');
    const redacted = local ? `${local.slice(0, 2)}***@${domain}` : '(no email)';
    console.log(`  Queued for reset: ${redacted}`);

    toFlag.push(user._id);
    flagged++;

    if (toFlag.length >= BATCH_SIZE) {
      await flushBatch();
    }
  }

  await flushBatch();

  console.log('\n── Migration summary ──────────────────────────────────');
  console.log(`  Already hashed   : ${alreadyHashed}`);
  console.log(`  Flagged for reset: ${flagged}`);
  console.log(`  Skipped (no pw)  : ${skipped}`);
  console.log('───────────────────────────────────────────────────────');

  if (flagged > 0) {
    console.log(
      `\n${flagged} account(s) have been flagged. Those users will be redirected to the\n` +
        'password-reset flow on their next login attempt. No passwords were read or transmitted.'
    );
  } else {
    console.log('\nNo plaintext passwords found. Nothing to migrate.');
  }

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
};

run().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
