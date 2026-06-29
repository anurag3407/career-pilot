import { Queue } from 'bullmq';
import dotenv from 'dotenv';
import redisManager from '../config/redis.js';

dotenv.config();

const QUEUE_NAME = 'job-alerts';

let jobAlertQueue = null;

// Rate limiter configuration
export const RATE_LIMIT_CONFIG = {
    maxConcurrent: 1,        // Process one job at a time
    delayBetweenJobs: 2000,  // 2 seconds between API calls
    maxRequestsPerMinute: 30,
    maxRequestsPerDay: 500   // Conservative daily limit
};

/**
 * Create a new Redis connection for the worker
 * BullMQ requires separate connections for Queue and Worker
 * because the Worker uses blocking commands
 */
export const createWorkerConnection = () => {
    return redisManager.getWorkerConnection(QUEUE_NAME);
};

/**
 * Initialize Redis connection and queue
 * Returns true if successful, false otherwise
 */
export const initializeQueue = async () => {
    if (!process.env.REDIS_URL) {
        console.log('ℹ️  REDIS_URL not configured - job queue disabled');
        return false;
    }

    try {
        const client = redisManager.get(QUEUE_NAME);
        if (!client) {
            console.log('⚠️  REDIS_URL not configured - job queue disabled');
            return false;
        }

        await redisManager.waitForReady(QUEUE_NAME);

        // Create queue
        jobAlertQueue = new Queue(QUEUE_NAME, {
            connection: client,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                },
                removeOnComplete: {
                    age: 24 * 3600,
                    count: 1000
                },
                removeOnFail: {
                    age: 7 * 24 * 3600
                }
            }
        });

        // Queue events for monitoring
        jobAlertQueue.on('error', (error) => {
            console.error('❌ Job Alert Queue Error:', error.message);
        });

        console.log('✅ Redis connected - job queue enabled');
        return true;

    } catch (error) {
        console.log('⚠️  Redis not available:', error.message);
        console.log('ℹ️  Job queue disabled - manual alert triggers still work');
        return false;
    }
};

// Check if queue is available
export const isQueueAvailable = () => jobAlertQueue !== null;

// Get queue instance (may be null)
export const getQueue = () => jobAlertQueue;

// Utility to add a job to the queue
export const addAlertToQueue = async (alertData, options = {}) => {
    if (!isQueueAvailable()) {
        console.log('⚠️  Queue not available, skipping queue add');
        return null;
    }

    // Use a stable jobId for the current minute to prevent duplicate checks
    // within the same 10-second testing window, but allow different runs over time.
    const currentMinute = Math.floor(Date.now() / 60000);
    const jobId = `alert-${alertData.alertId}-${currentMinute}`;

    const job = await jobAlertQueue.add('fetch-jobs', alertData, {
        jobId,
        delay: options.delay || 0,
        priority: options.priority || 1,
        ...options
    });

    console.log(`✅ Job added to queue: ${jobId}`);
    console.log(`   Alert: ${alertData.title}`);
    console.log(`   Email: ${alertData.userEmail}`);
    console.log(`   Delay: ${options.delay || 0}ms`);

    return job;
};

// Utility to add multiple alerts with staggered delays
export const addBatchAlertsToQueue = async (alerts) => {
    if (!isQueueAvailable()) {
        console.log('⚠️  Queue not available, skipping batch add');
        return [];
    }

    console.log(`\n📦 Adding ${alerts.length} jobs to queue...`);

    const currentMinute = Math.floor(Date.now() / 60000);
    const jobs = alerts.map((alert, index) => {
        const jobId = `alert-${alert.alertId}-${currentMinute}-${index}`;
        const delay = index * RATE_LIMIT_CONFIG.delayBetweenJobs;

        console.log(`   ${index + 1}. ${alert.title} → ${alert.userEmail} (delay: ${delay}ms)`);

        return {
            name: 'fetch-jobs',
            data: alert,
            opts: {
                jobId,
                delay,
                priority: 1
            }
        };
    });

    const result = await jobAlertQueue.addBulk(jobs);
    console.log(`✅ Successfully added ${result.length} jobs to queue\n`);

    return result;
};

// Get queue statistics
export const getQueueStats = async () => {
    if (!isQueueAvailable()) {
        return { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, available: false };
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
        jobAlertQueue.getWaitingCount(),
        jobAlertQueue.getActiveCount(),
        jobAlertQueue.getCompletedCount(),
        jobAlertQueue.getFailedCount(),
        jobAlertQueue.getDelayedCount()
    ]);

    return { waiting, active, completed, failed, delayed, available: true };
};

// Pause/Resume queue
export const pauseQueue = async () => {
    if (!isQueueAvailable()) return;
    await jobAlertQueue.pause();
    console.log('⏸️  Job Alert Queue paused');
};

export const resumeQueue = async () => {
    if (!isQueueAvailable()) return;
    await jobAlertQueue.resume();
    console.log('▶️  Job Alert Queue resumed');
};

// Clean old jobs
export const cleanQueue = async () => {
    if (!isQueueAvailable()) return;
    await jobAlertQueue.clean(24 * 3600 * 1000, 1000, 'completed');
    await jobAlertQueue.clean(7 * 24 * 3600 * 1000, 100, 'failed');
    console.log('🧹 Queue cleaned');
};

// Empty/drain the entire queue
export const emptyQueue = async () => {
    if (!isQueueAvailable()) {
        console.log('⚠️  Queue not available');
        return { success: false, message: 'Queue not available' };
    }

    try {
        // Remove all jobs in different states
        await jobAlertQueue.drain(); // Remove all waiting jobs
        await jobAlertQueue.clean(0, 0, 'completed'); // Remove all completed
        await jobAlertQueue.clean(0, 0, 'failed'); // Remove all failed
        await jobAlertQueue.clean(0, 0, 'delayed'); // Remove all delayed

        console.log('ℹ️  Active jobs were not cleaned to avoid interrupting in-progress work');

        console.log('🗑️  Queue emptied successfully');
        return { success: true, message: 'Queue emptied' };
    } catch (error) {
        console.error('❌ Error emptying queue:', error.message);
        return { success: false, error: error.message };
    }
};

// Get Redis connection for low-level operations (e.g., queue pause state)
export const getRedisConnection = () => {
    const client = redisManager.get(QUEUE_NAME);
    return client && client.status === 'ready' ? client : null;
};
