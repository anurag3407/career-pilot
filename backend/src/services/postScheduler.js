import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import { db } from '../config/firebase.js';
import { FieldValue } from 'firebase-admin/firestore';
import { getIO } from '../config/socket.js';

dotenv.config();

let redisAvailable = false;
let redisConnection = null;
let postSchedulerQueue = null;
let redisUrl = null;

const QUEUE_NAME = 'post-scheduler';
const postsRef = db.collection('posts');

const createWorkerConnection = () => {
    if (!redisUrl) return null;
    return new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy: (times) => {
            if (times > 3) return null;
            return Math.min(times * 200, 1000);
        }
    });
};

/**
 * Initialize the post scheduler queue and worker.
 * Gracefully no-ops if REDIS_URL is not configured.
 */
export const initializePostScheduler = async () => {
    redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        console.log('ℹ️  REDIS_URL not configured - post scheduler disabled');
        return false;
    }

    try {
        redisConnection = new IORedis(redisUrl, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            retryStrategy: (times) => {
                if (times > 3) return null;
                return Math.min(times * 200, 1000);
            }
        });

        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Redis connection timeout')), 5000);
            redisConnection.once('ready', () => { clearTimeout(timeout); resolve(); });
            redisConnection.once('error', (err) => { clearTimeout(timeout); reject(err); });
        });

        postSchedulerQueue = new Queue(QUEUE_NAME, {
            connection: redisConnection,
            defaultJobOptions: {
                attempts: 3,
                backoff: { type: 'exponential', delay: 5000 },
                removeOnComplete: { age: 7 * 24 * 3600, count: 500 },
                removeOnFail: { age: 30 * 24 * 3600 }
            }
        });

        postSchedulerQueue.on('error', (err) => {
            console.error('❌ Post scheduler queue error:', err.message);
        });

        const workerConnection = createWorkerConnection();
        if (workerConnection) {
            const worker = new Worker(
                QUEUE_NAME,
                async (job) => {
                    const { postId } = job.data;
                    const postRef = postsRef.doc(postId);
                    const doc = await postRef.get();

                    if (!doc.exists) {
                        console.warn(`⚠️  Scheduled post ${postId} not found, skipping`);
                        return;
                    }

                    const post = doc.data();

                    // Guard: only publish if still in scheduled state
                    if (post.status !== 'scheduled') {
                        console.log(`ℹ️  Post ${postId} status is "${post.status}", skipping publish`);
                        return;
                    }

                    await postRef.update({
                        status: 'published',
                        publishedAt: FieldValue.serverTimestamp(),
                        updatedAt: FieldValue.serverTimestamp()
                    });

                    try {
                        const io = getIO();
                        io.to('posts:feed').emit('new_post', {
                            post: {
                                id: postId,
                                ...post,
                                status: 'published',
                                publishedAt: new Date()
                            }
                        });
                    } catch {
                        // socket may not be initialized
                    }

                    console.log(`✅ Scheduled post ${postId} published`);
                },
                { connection: workerConnection }
            );

            worker.on('completed', (job) => {
                console.log(`✅ Post scheduler job ${job.id} completed`);
            });
            worker.on('failed', (job, err) => {
                console.error(`❌ Post scheduler job ${job?.id} failed: ${err.message}`);
            });
        }

        redisAvailable = true;
        console.log('✅ Post scheduler initialized');
        return true;
    } catch (err) {
        console.warn('⚠️ Post scheduler could not connect to Redis:', err.message);
        redisAvailable = false;
        return false;
    }
};

/**
 * Enqueue a delayed publish job for a post.
 * Uses the postId as a stable jobId so it can be retrieved and removed later.
 */
export const schedulePostJob = async (postId, scheduledAt) => {
    if (!redisAvailable || !postSchedulerQueue) {
        return null;
    }

    const delay = new Date(scheduledAt).getTime() - Date.now();
    const ts = new Date(scheduledAt).getTime();
    if (isNaN(ts)) {
        throw new Error('scheduledAt is not a valid date');
    }
    const delay = ts - Date.now();
    if (delay <= 0) {
        throw new Error('Scheduled time must be in the future');
    }

    const job = await postSchedulerQueue.add(
        'publish-post',
        { postId },
        { delay, jobId: `post:${postId}` }
    );
    return job.id;
};

/**
 * Remove a scheduled post job from the queue.
 * Returns true if the job was found and removed, false otherwise.
 */
export const cancelPostJob = async (postId) => {
    if (!redisAvailable || !postSchedulerQueue) return false;

    try {
        const job = await postSchedulerQueue.getJob(`post:${postId}`);
        if (job) {
            await job.remove();
            return true;
        }
        return false;
    } catch (err) {
        console.warn(`⚠️ Could not cancel post job for ${postId}: ${err.message}`);
        return false;
    }
};

export const isSchedulerAvailable = () => redisAvailable;
