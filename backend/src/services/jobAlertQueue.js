import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Track if Redis is available
let redisAvailable = false;
let redisConnection = null;
let jobAlertQueue = null;
let redisUrl = null; // Store the URL for creating worker connections

/**
 * Worker-side pacing for external job-search API calls. BullMQ may run multiple
 * workers in other deployments; these values keep RapidAPI usage under quota.
 */
export const RATE_LIMIT_CONFIG = {
    /** BullMQ worker concurrency — one alert fetch at a time per process. */
    maxConcurrent: 1,
    /** Stagger between enqueue operations (see addBatchAlertsToQueue). */
    delayBetweenJobs: 2000,
    maxRequestsPerMinute: 30,
    maxRequestsPerDay: 500,
};

/**
 * Create a new Redis connection for the worker
 * BullMQ requires separate connections for Queue and Worker
 * because the Worker uses blocking commands
 */
export const createWorkerConnection = () => {
    if (!redisUrl) {
        console.log('⚠️  Redis URL not available for worker connection');
        return null;
    }

    const workerConnection = new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy: (times) => {
            if (times > 3) {
                return null;
            }
            return Math.min(times * 200, 1000);
        }
    });

    workerConnection.on('error', (err) => {
        console.error('❌ Worker Redis connection error:', err.message);
    });

    return workerConnection;
};

/**
 * Initialize Redis connection and queue
 * Returns true if successful, false otherwise
 */
export const initializeQueue = async () => {
    redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        console.log('ℹ️  REDIS_URL not configured - job queue disabled');
        return false;
    }

    try {
        redisConnection = new IORedis(redisUrl, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            retryStrategy: (times) => {
                if (times > 3) {
                    console.log('⚠️  Redis connection failed after 3 attempts');
                    return null; // Stop retrying
                }
                return Math.min(times * 200, 1000);
            }
        });

        // Test connection
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Redis connection timeout'));
            }, 5000);

            redisConnection.once('ready', () => {
                clearTimeout(timeout);
                resolve();
            });

            redisConnection.once('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });
        });

        // Create queue
        jobAlertQueue = new Queue('job-alerts', {
            connection: redisConnection,
            defaultJobOptions: {
                /** Retry transient Redis/API failures without losing the alert payload. */
                attempts: 3,
                /** Exponential backoff: 5s, then 10s, then 20s between retries. */
                backoff: {
                    type: 'exponential',
                    delay: 5000,
                },
                /** Trim completed jobs after 24h (max 1000 retained) to bound Redis memory. */
                removeOnComplete: {
                    age: 24 * 3600,
                    count: 1000,
                },
                /** Keep failed jobs for 7 days for post-mortem / manual replay. */
                removeOnFail: {
                    age: 7 * 24 * 3600,
                },
            },
        });

        // Queue events for monitoring
        jobAlertQueue.on('error', (error) => {
            console.error('❌ Job Alert Queue Error:', error.message);
        });

        redisAvailable = true;
        console.log('✅ Redis connected - job queue enabled');
        return true;

    } catch (error) {
        console.log('⚠️  Redis not available:', error.message);
        console.log('ℹ️  Job queue disabled - manual alert triggers still work');
        redisAvailable = false;
        return false;
    }
};

// Check if queue is available
export const isQueueAvailable = () => redisAvailable && jobAlertQueue !== null;

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

// Get Redis connection for worker
export const getRedisConnection = () => redisConnection;
