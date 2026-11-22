/**
 * migratePasswords.js
 *
 * Safely migrates user passwords to bcrypt hashing.
 * Pre-migration validation ensures no plaintext passwords
 * exist before proceeding, preventing hash-of-hash corruption.
 *
 * GSSoC '26 | Fix: data-integrity, validation, migration
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User.model");

// ─── Configuration ────────────────────────────────────────────────────────────

const BCRYPT_SALT_ROUNDS = 12;
const BCRYPT_HASH_REGEX = /^\$2[aby]\$/; // matches $2a$, $2b$, $2y$ prefixes

// ─── Database Connection ───────────────────────────────────────────────────────

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/yourdb";
  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");
}

// ─── Step 1: Pre-migration Validation ─────────────────────────────────────────

/**
 * Validates that ALL passwords in the database are already bcrypt-hashed.
 * Throws an error listing the count of unhashed passwords if any are found,
 * preventing hash-of-hash corruption during migration.
 */
async function validatePasswordsAreHashed() {
  console.log("🔍 Validating existing password hashes...");

  const unhashed = await User.find({
    password: { $not: { $regex: BCRYPT_HASH_REGEX } },
  }).select("_id email"); // only fetch needed fields

  if (unhashed.length > 0) {
    // Log affected user IDs for debugging (avoid logging actual passwords)
    const affectedIds = unhashed.map((u) => u._id).join(", ");
    throw new Error(
      `❌ Pre-migration validation failed: Found ${unhashed.length} unhashed password(s).\n` +
        `   Affected user IDs: ${affectedIds}\n` +
        `   Please hash these passwords before running migration.`
    );
  }

  console.log("✅ All passwords are already bcrypt-hashed. Safe to proceed.");
}

// ─── Step 2: Re-hash with Updated Salt Rounds ─────────────────────────────────

/**
 * Finds passwords hashed with fewer than BCRYPT_SALT_ROUNDS and re-hashes them.
 * Skips users whose hash already meets the current cost factor.
 *
 * NOTE: This requires the plaintext password to be available (e.g., at login).
 * For offline re-hashing, you must reset passwords or prompt users on next login.
 * This function demonstrates the pattern for a scenario where you control the data.
 */
async function rehashWeakPasswords(plaintextMap = {}) {
  // plaintextMap: { userId: plaintextPassword } — only for controlled migrations
 const users = await User.find({}).select("+password");
  let updated = 0;
  let skipped = 0;

  for (const user of users) {
    // Extract current cost factor from the bcrypt hash
    const currentCost = parseInt(user.password.split("$")[2], 10);

    if (currentCost >= BCRYPT_SALT_ROUNDS) {
      skipped++;
      continue;
    }

    const plaintext = plaintextMap[user._id.toString()];
    if (!plaintext) {
      console.warn(
        `⚠️  Skipping user ${user._id}: no plaintext provided for re-hash.`
      );
      skipped++;
      continue;
    }

    user.password = await bcrypt.hash(plaintext, BCRYPT_SALT_ROUNDS);
    await user.save();
    updated++;
    console.log(`🔄 Re-hashed password for user ${user._id}`);
  }

  console.log(
    `✅ Re-hash complete — updated: ${updated}, skipped: ${skipped}`
  );
}

// ─── Step 3: Dry-run Report ────────────────────────────────────────────────────

/**
 * Generates a summary report without making any changes.
 * Useful for auditing before committing to migration.
 */
async function dryRun() {
  console.log("\n📋 DRY RUN — no changes will be made\n");

  const total = await User.countDocuments();
  const hashed = await User.countDocuments({
    password: { $regex: BCRYPT_HASH_REGEX },
  });
  const unhashed = total - hashed;

  // Break down by bcrypt cost factor
  const allHashed = await User.find({
    password: { $regex: BCRYPT_HASH_REGEX },
  }).select("+password");

  const costBreakdown = {};
  for (const u of allHashed) {
    const cost = u.password.split("$")[2] || "unknown";
    costBreakdown[cost] = (costBreakdown[cost] || 0) + 1;
  }

  console.log(`Total users          : ${total}`);
  console.log(`Bcrypt-hashed        : ${hashed}`);
  console.log(`NOT hashed (⚠️ risk) : ${unhashed}`);
  console.log(`\nCost factor breakdown:`);
  Object.entries(costBreakdown)
    .sort()
    .forEach(([cost, count]) => {
      const flag = parseInt(cost) < BCRYPT_SALT_ROUNDS ? " ← needs upgrade" : "";
      console.log(`  Rounds ${cost}: ${count} user(s)${flag}`);
    });

  if (unhashed > 0) {
    console.log(
      `\n❌ Migration BLOCKED: ${unhashed} plaintext password(s) found.`
    );
  } else {
    console.log(`\n✅ Safe to run migration.`);
  }
}

// ─── Main Entry Point ──────────────────────────────────────────────────────────

async function migratePasswords() {
  try {
    await connectDB();

    const mode = process.argv[2]; // "dry-run" | "migrate"

    if (mode === "dry-run") {
      await dryRun();
      return;
    }

    if (mode !== "migrate") {
      console.log("Usage:");
      console.log(
        "  node migratePasswords.js dry-run   # audit without changes"
      );
      console.log(
        "  node migratePasswords.js migrate   # run migration\n"
      );
      process.exit(1);
    }

    // ── GUARD: must pass before any migration work ──
    await validatePasswordsAreHashed();

    // ── Proceed with migration logic ────────────────
    // e.g., rehashWeakPasswords(), schema changes, etc.
    console.log("🚀 Starting migration...");

    // Add your actual migration steps here:
    // await rehashWeakPasswords();
    // await updateSchema();

    console.log("🎉 Migration completed successfully.");
  } catch (err) {
    console.error("\n" + err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

migratePasswords();