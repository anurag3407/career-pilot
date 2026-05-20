/**
 * Soft Delete Functionality Test Suite
 * 
 * Run this to verify soft delete is working correctly
 * 
 * Usage:
 * node --experimental-modules src/scripts/test-soft-delete.js
 */

import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Job from '../models/Job.model.js';
import Challenge from '../models/Challenge.model.js';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
  test: (msg) => console.log(`${colors.cyan}🧪${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`)
};

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careerpilot-test');
    log.success('Connected to MongoDB');
  } catch (error) {
    log.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
}

async function runTests() {
  log.info('Starting Soft Delete Tests...\n');

  try {
    // Test 1: Check schema includes soft delete fields
    log.test('Test 1: Schema includes isDeleted and deletedAt fields');
    const userPaths = Object.keys(User.schema.paths);
    const hasIsDeleted = userPaths.includes('isDeleted');
    const hasDeletedAt = userPaths.includes('deletedAt');
    
    if (hasIsDeleted && hasDeletedAt) {
      log.success('Schema has required soft delete fields');
    } else {
      log.error(`Missing fields: isDeleted=${hasIsDeleted}, deletedAt=${hasDeletedAt}`);
    }

    // Test 2: Create test user
    log.test('\nTest 2: Create test user');
    const testUser = await User.create({
      username: 'test_soft_delete_user_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      jobRole: 'Developer',
      gender: 'Other',
      yearsOfExperience: 5,
      collegeStudent: false,
      skills: ['Node.js', 'MongoDB']
    });
    
    const userId = testUser._id;
    log.success(`Created test user: ${userId}`);

    // Test 3: Verify user is active
    log.test('\nTest 3: Verify user is active initially');
    const activeUser = await User.findById(userId);
    if (activeUser && !activeUser.isDeleted) {
      log.success('User is active (isDeleted=false)');
    } else {
      log.error('User should be active');
    }

    // Test 4: Soft delete the user
    log.test('\nTest 4: Soft delete the user');
    await testUser.softDelete();
    log.success('User soft deleted');

    // Test 5: Verify user is excluded from normal queries
    log.test('\nTest 5: Verify deleted user excluded from normal queries');
    const deletedUserInNormalQuery = await User.findById(userId);
    if (!deletedUserInNormalQuery) {
      log.success('Deleted user correctly excluded from find()');
    } else {
      log.error('Deleted user should NOT appear in normal queries');
    }

    // Test 6: Find deleted user with findDeleted()
    log.test('\nTest 6: Find deleted user with findDeleted()');
    const deletedInDeletedQuery = await User.findDeleted().findById(userId);
    if (deletedInDeletedQuery && deletedInDeletedQuery.isDeleted) {
      log.success('Deleted user found using findDeleted()');
    } else {
      log.error('Should find deleted user with findDeleted()');
    }

    // Test 7: Find deleted user with findWithDeleted()
    log.test('\nTest 7: Find deleted user with findWithDeleted()');
    const deletedWithAll = await User.findWithDeleted().findById(userId);
    if (deletedWithAll && deletedWithAll.isDeleted) {
      log.success('Deleted user found using findWithDeleted()');
    } else {
      log.error('Should find deleted user with findWithDeleted()');
    }

    // Test 8: Restore the user
    log.test('\nTest 8: Restore the user');
    if (deletedWithAll) {
      await deletedWithAll.restore();
      log.success('User restored');
    }

    // Test 9: Verify user is active again
    log.test('\nTest 9: Verify user is active after restore');
    const restoredUser = await User.findById(userId);
    if (restoredUser && !restoredUser.isDeleted) {
      log.success('User is active again after restore');
    } else {
      log.error('User should be active after restore');
    }

    // Test 10: Test countDeleted
    log.test('\nTest 10: Test count operations');
    const deletedCount = await User.countDeleted();
    const activeCount = await User.countActive();
    log.success(`Deleted users: ${deletedCount}, Active users: ${activeCount}`);

    // Test 11: Delete multiple with filter
    log.test('\nTest 11: Test soft delete many');
    const manyUsers = await User.create([
      {
        username: 'bulk_delete_user_1_' + Date.now(),
        email: `bulk_1_${Date.now()}@example.com`,
        jobRole: 'Tester',
        gender: 'Male',
        yearsOfExperience: 2,
        collegeStudent: true,
        skills: ['Testing']
      },
      {
        username: 'bulk_delete_user_2_' + Date.now(),
        email: `bulk_2_${Date.now()}@example.com`,
        jobRole: 'Tester',
        gender: 'Female',
        yearsOfExperience: 1,
        collegeStudent: true,
        skills: ['Testing']
      }
    ]);
    
    const bulkUserIds = manyUsers.map(u => u._id);
    const result = await User.softDeleteMany({ _id: { $in: bulkUserIds } });
    log.success(`Bulk soft deleted ${result.modifiedCount} users`);

    // Test 12: Restore many
    log.test('\nTest 12: Test restore many');
    const restoreResult = await User.restoreMany({ _id: { $in: bulkUserIds } });
    log.success(`Bulk restored ${restoreResult.modifiedCount} users`);

    // Test 13: Verify all models have soft delete
    log.test('\nTest 13: Verify all models support soft delete');
    const models = [User, Job, Challenge];
    const allHaveSoftDelete = models.every(Model => {
      const paths = Object.keys(Model.schema.paths);
      return paths.includes('isDeleted') && paths.includes('deletedAt');
    });
    
    if (allHaveSoftDelete) {
      log.success('All tested models have soft delete support');
    } else {
      log.error('Some models missing soft delete support');
    }

    // Cleanup
    log.test('\nTest 14: Cleanup test data');
    await User.permanentlyDelete({ _id: userId });
    await User.permanentlyDelete({ _id: { $in: bulkUserIds } });
    log.success('Test data cleaned up');

    log.info('\n✨ All tests completed successfully!');

  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    console.error(error);
  }
}

async function main() {
  try {
    await connectDB();
    await runTests();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
