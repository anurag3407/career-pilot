import { Queue, Worker } from 'bullmq';
import dotenv from 'dotenv';

import { getIO } from '../config/socket.js';
import redisManager from '../config/redis.js';

dotenv.config();

const QUEUE_NAME = 'post-scheduler';
let postSchedulerQueue = null;
let worker = null;
const postsRef = null;

/**
 * Initialize the post scheduler queue and worker.
 * Gracefully no-ops if REDIS_URL is not configured.
 */
export const initializePostScheduler = async () => {
    if (!process.env.REDIS_URL) {
        console.log('ℹ️  REDIS_URL not configured - post scheduler disabled');
        return false;
    }

    try {
        const client = redisManager.get(QUEUE_NAME);
        if (!client) {
            return false;
        }

        await redisManager.waitForReady(QUEUE_NAME);

        postSchedulerQueue = new Queue(QUEUE_NAME, {
            connection: client,
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

        const workerConnection = redisManager.getWorkerConnection(QUEUE_NAME);
        if (workerConnection) {
            worker = new Worker(
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

            redisManager.registerWorker(QUEUE_NAME, worker);

            worker.on('completed', (job) => {
                console.log(`✅ Post scheduler job ${job.id} completed`);
            });
            worker.on('failed', (job, err) => {
                console.error(`❌ Post scheduler job ${job?.id} failed: ${err.message}`);
            });
        }

        console.log('✅ Post scheduler initialized');
        return true;
    } catch (err) {
        console.warn('⚠️ Post scheduler could not connect to Redis:', err.message);
        return false;
    }
};

/**
 * Enqueue a delayed publish job for a post.
 * Uses the postId as a stable jobId so it can be retrieved and removed later.
 */
export const schedulePostJob = async (postId, scheduledAt) => {
    if (!postSchedulerQueue) {
        return null;
    }

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
    if (!postSchedulerQueue) return false;

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

export const isSchedulerAvailable = () => postSchedulerQueue !== null;
