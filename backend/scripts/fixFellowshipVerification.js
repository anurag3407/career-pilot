/**
 * One-time migration: revoke fraudulent verified-student status.
 *
 * Background: the POST /fellowship/profile update handler did not reset
 * isVerified when a user changed their role from corporate to student.
 * Corporate profiles are auto-verified on creation (isVerified=true), so any
 * user who created a corporate profile and then switched to student retained
 * isVerified=true without completing academic email verification.
 *
 * This script finds all FellowshipProfile documents where:
 *   - role === 'student'
 *   - isVerified === true
 *   - verifiedEmail is null or missing (no email ever went through verification)
 *
 * and resets isVerified to false on those records, forcing the users back
 * through the academic email verification flow before they can apply to
 * fellowship challenges.
 *
 * Usage:
 *   MONGODB_URI=<uri> node backend/scripts/fixFellowshipVerification.js
 *
 * Safe to re-run (idempotent — the query filter excludes already-corrected docs).
 */

import mongoose from 'mongoose';
import 'dotenv/config';

const BATCH_SIZE = 200;

const profileSchema = new mongoose.Schema(
  {
    userId: String,
    role: String,
    isVerified: Boolean,
    verifiedEmail: { type: String, default: null },
    verificationCode: { type: String, default: null },
    verificationCodeExpiry: { type: Date, default: null },
  },
  { strict: false }
);

const FellowshipProfile = mongoose.model('FellowshipProfile', profileSchema);

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  // Count affected records before making any changes for transparency.
  const affectedCount = await FellowshipProfile.countDocuments({
    role: 'student',
    isVerified: true,
    $or: [{ verifiedEmail: null }, { verifiedEmail: { $exists: false } }],
  });

  console.log(`Found ${affectedCount} student profile(s) with invalid isVerified=true.`);

  if (affectedCount === 0) {
    console.log('Nothing to fix.');
    await mongoose.disconnect();
    return;
  }

  let fixed = 0;

  // Stream with a cursor to keep memory bounded on large collections.
  const cursor = FellowshipProfile.find({
    role: 'student',
    isVerified: true,
    $or: [{ verifiedEmail: null }, { verifiedEmail: { $exists: false } }],
  })
    .select('userId role isVerified verifiedEmail')
    .cursor();

  let batch = [];

  const flushBatch = async () => {
    if (batch.length === 0) return;
    await FellowshipProfile.bulkWrite(
      batch.map((id) => ({
        updateOne: {
          filter: { _id: id },
          update: {
            $set: {
              isVerified: false,
              verificationCode: null,
              verificationCodeExpiry: null,
            },
          },
        },
      }))
    );
    fixed += batch.length;
    batch = [];
  };

  for await (const profile of cursor) {
    // Redact userId in logs — do not expose internal IDs in CI/CD output.
    const redactedId = profile.userId
      ? `${profile.userId.slice(0, 4)}***`
      : '(unknown)';
    console.log(`  Fixing profile: userId=${redactedId}`);

    batch.push(profile._id);

    if (batch.length >= BATCH_SIZE) {
      await flushBatch();
    }
  }

  await flushBatch();

  console.log('\n── Migration summary ──────────────────────────────────────');
  console.log(`  Profiles detected : ${affectedCount}`);
  console.log(`  Profiles fixed    : ${fixed}`);
  console.log('──────────────────────────────────────────────────────────');
  console.log(
    `\n${fixed} profile(s) have been reset. Affected users will be required to\n` +
      'complete academic email verification before applying to fellowship challenges.'
  );

  await mongoose.disconnect();
  console.log('Disconnected. Done.');
};

run().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
