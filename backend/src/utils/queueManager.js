/**
 * Queue Management Utility
 * Helper functions to manage Redis queue operations
 */

import { getQueue, isQueueAvailable, emptyQueue, getQueueStats } from '../services/jobAlertQueue.js';

/**
 * Display queue status in a readable format
 */
export const displayQueueStatus = async () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 REDIS QUEUE STATUS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!isQueueAvailable()) {
        console.log('❌ Queue is NOT available');
        console.log('   Redis connection may not be configured or failed');
        console.log('   Check REDIS_URL in your .env file');
        return { available: false };
    }

    console.log('✅ Queue is available');

    const stats = await getQueueStats();
    console.log('\nQueue Statistics:');
    console.log(`   Waiting:   ${stats.waiting} jobs`);
    console.log(`   Active:    ${stats.active} jobs`);
    console.log(`   Delayed:   ${stats.delayed} jobs`);
    console.log(`   Completed: ${stats.completed} jobs`);
    console.log(`   Failed:    ${stats.failed} jobs`);
    
    const total = stats.waiting + stats.active + stats.delayed;
    console.log(`\n   Total Pending: ${total} jobs`);

    // Get recent jobs for debugging
    const queue = getQueue();
    if (queue) {
        try {
            const waiting = await queue.getWaiting(0, 3);
            const active = await queue.getActive(0, 3);

            if (waiting.length > 0) {
                console.log('\n📋 Recent Waiting Jobs:');
                waiting.forEach((job, i) => {
                    console.log(`   ${i + 1}. ${job.data.title} → ${job.data.userEmail}`);
                });
            }

            if (active.length > 0) {
                console.log('\n▶️  Active Jobs:');
                active.forEach((job, i) => {
                    console.log(`   ${i + 1}. ${job.data.title} → ${job.data.userEmail}`);
                });
            }
        } catch (err) {
            console.warn('⚠️  Could not fetch job details:', err.message);
        }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return stats;
};

/**
 * Empty all jobs from the Redis queue
 */
export const clearQueue = async () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🗑️  CLEARING REDIS QUEUE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (!isQueueAvailable()) {
        console.log('❌ Queue is NOT available - nothing to clear');
        return { success: false, error: 'Queue not available' };
    }

    // Show stats before clearing
    const beforeStats = await getQueueStats();
    console.log('\nBefore clearing:');
    console.log(`   Waiting:   ${beforeStats.waiting} jobs`);
    console.log(`   Active:    ${beforeStats.active} jobs`);
    console.log(`   Delayed:   ${beforeStats.delayed} jobs`);
    console.log(`   Completed: ${beforeStats.completed} jobs`);
    console.log(`   Failed:    ${beforeStats.failed} jobs`);

    // Empty the queue
    console.log('\n🗑️  Removing all jobs...');
    const result = await emptyQueue();

    if (result.success) {
        console.log('✅ Queue emptied successfully!');
        
        // Show stats after clearing
        const afterStats = await getQueueStats();
        console.log('\nAfter clearing:');
        console.log(`   Waiting:   ${afterStats.waiting} jobs`);
        console.log(`   Active:    ${afterStats.active} jobs`);
        console.log(`   Delayed:   ${afterStats.delayed} jobs`);
        console.log(`   Completed: ${afterStats.completed} jobs`);
        console.log(`   Failed:    ${afterStats.failed} jobs`);
    } else {
        console.log('❌ Failed to empty queue:', result.error || result.message);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return result;
};

/**
 * Get detailed information about failed jobs
 */
export const getFailedJobsInfo = async () => {
    if (!isQueueAvailable()) {
        console.log('❌ Queue is NOT available');
        return [];
    }

    const queue = getQueue();
    if (!queue) return [];

    try {
        const failedJobs = await queue.getFailed(0, 10);
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('💥 FAILED JOBS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        if (failedJobs.length === 0) {
            console.log('✅ No failed jobs');
        } else {
            failedJobs.forEach((job, i) => {
                console.log(`\n${i + 1}. Job ID: ${job.id}`);
                console.log(`   Alert: ${job.data.title}`);
                console.log(`   User: ${job.data.userEmail}`);
                console.log(`   Failed Reason: ${job.failedReason}`);
                console.log(`   Attempts: ${job.attemptsMade}/${job.opts.attempts}`);
            });
        }
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        return failedJobs;
    } catch (err) {
        console.error('Error fetching failed jobs:', err.message);
        return [];
    }
};

export default {
    displayQueueStatus,
    clearQueue,
    getFailedJobsInfo
};
