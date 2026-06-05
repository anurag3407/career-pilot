/**
 * Analysis Worker – processes background jobs (repo analysis, resume scoring, etc.)
 * Uses BullMQ (Redis) for job queues.
 */

const { Worker, QueueEvents } = require('bullmq');
const redisClient = require('../config/redis');
const analysisService = require('../services/analysisService');
const { logger } = require('../utils/logger');
const { sendWebhook } = require('../utils/webhook');

const QUEUE_NAME = 'analysis-queue';

// Graceful shutdown handling
let worker = null;
let queueEvents = null;

/**
 * Creates and configures the BullMQ worker
 */
async function startWorker() {
    worker = new Worker(QUEUE_NAME, async job => {
        const { type, payload, webhookUrl } = job.data;
        logger.info(`Processing job ${job.id} of type ${type}`);

        try {
            let result;
            switch (type) {
                case 'repo-analysis':
                    result = await analysisService.analyzeRepository(payload);
                    break;
                case 'resume-scoring':
                    result = await analysisService.scoreResume(payload);
                    break;
                case 'ats-optimization':
                    result = await analysisService.optimizeForATS(payload);
                    break;
                default:
                    throw new Error(`Unknown job type: ${type}`);
            }

            // Optional webhook callback
            if (webhookUrl) {
                await sendWebhook(webhookUrl, { jobId: job.id, status: 'completed', result });
            }

            return result;
        } catch (error) {
            logger.error(`Job ${job.id} failed: ${error.message}`, { stack: error.stack });
            throw error; // BullMQ will retry based on config
        }
    }, {
        connection: redisClient,
        concurrency: parseInt(process.env.WORKER_CONCURRENCY, 10) || 5,
        settings: {
            backoffStrategy: (attempts) => Math.min(1000 * 2 ** attempts, 30000), // exponential backoff
            stalledInterval: 30000,
            maxStalledCount: 3,
        },
        autorun: true,
    });

    // Event listeners for monitoring
    worker.on('completed', (job, result) => {
        logger.info(`Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, err) => {
        logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts: ${err.message}`);
    });

    worker.on('error', (err) => {
        logger.error(`Worker encountered an error: ${err.message}`);
    });

    // Optional: set up queue events for progress tracking
    queueEvents = new QueueEvents(QUEUE_NAME, { connection: redisClient });
    queueEvents.on('progress', ({ jobId, data }) => {
        logger.debug(`Job ${jobId} progress: ${data}%`);
    });

    logger.info(`Analysis worker started, listening on queue "${QUEUE_NAME}"`);
}

// Graceful shutdown
async function shutdown() {
    logger.info('Shutting down analysis worker...');
    if (worker) await worker.close();
    if (queueEvents) await queueEvents.close();
    if (redisClient) await redisClient.quit();
    process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the worker
startWorker().catch(err => {
    logger.error(`Failed to start worker: ${err.message}`);
    process.exit(1);
});