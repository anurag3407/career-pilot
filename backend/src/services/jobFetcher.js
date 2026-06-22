import cron from 'node-cron';
import { Worker } from 'bullmq';
import JobAlert from '../models/JobAlert.model.js';
import JobListing from '../models/JobListing.model.js';
import NotificationLog from '../models/NotificationLog.model.js';
import { searchJobs } from './rapidApiService.js';
import { sendJobAlertEmail } from './mailService.js';
import scraperRegistry from './scrapers/index.js';
import {
    emitNewJobsFound,
    emitEmailSent,
    emitEmailFailed,
    emitAlertProcessing
} from './jobAlertSocket.js';
import {
    saveNotificationToFirebase,
    saveJobListingToFirebase
} from './firebaseDataService.js';
import {
    initializeQueue,
    isQueueAvailable,
    getRedisConnection,
    createWorkerConnection,
    addBatchAlertsToQueue,
    RATE_LIMIT_CONFIG,
    pauseQueue,
    resumeQueue
} from './jobAlertQueue.js';

// Track consecutive failures for circuit breaker
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 5;
const QUEUE_PAUSED_KEY = 'job-alerts:paused_at';
const PAUSE_DURATION_MS = 60 * 60 * 1000;
const DEFAULT_CHECK_FREQUENCY = 'every-2-days';
const CHECK_FREQUENCY_INTERVAL_MS = {
    daily: 24 * 60 * 60 * 1000,
    'every-2-days': 2 * 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000
};
<<<<<<< Updated upstream

const getDueAlertQuery = (now = new Date(), extraFilters = {}) => {
    const thresholdFor = (frequency) =>
        new Date(now.getTime() - CHECK_FREQUENCY_INTERVAL_MS[frequency]);

    return {
        ...extraFilters,
        $or: [
            { lastCheckedAt: null },
            ...Object.keys(CHECK_FREQUENCY_INTERVAL_MS).map(checkFrequency => ({
                checkFrequency,
                lastCheckedAt: { $lte: thresholdFor(checkFrequency) }
            })),
            {
                checkFrequency: { $exists: false },
                lastCheckedAt: { $lte: thresholdFor(DEFAULT_CHECK_FREQUENCY) }
            }
        ]
    };
};
=======
>>>>>>> Stashed changes

const getDueAlertQuery = (now = new Date(), extraFilters = {}) => {
    const thresholdFor = (frequency) =>
        new Date(now.getTime() - CHECK_FREQUENCY_INTERVAL_MS[frequency]);

    const knownFrequencies = Object.keys(CHECK_FREQUENCY_INTERVAL_MS);

    return {
        ...extraFilters,
        $or: [
            { lastCheckedAt: null },

            ...knownFrequencies.map(checkFrequency => ({
                checkFrequency,
                lastCheckedAt: { $lte: thresholdFor(checkFrequency) }
            })),

            {
                checkFrequency: { $exists: false },
                lastCheckedAt: {
                    $lte: thresholdFor(DEFAULT_CHECK_FREQUENCY)
                }
            },

            // Unknown/invalid frequency -> fallback to default
            {
                checkFrequency: {
                    $nin: [...knownFrequencies, null]
                },
                lastCheckedAt: {
                    $lte: thresholdFor(DEFAULT_CHECK_FREQUENCY)
                }
            }
        ]
    };
};
    
const persistQueuePause = async () => {
    const redis = getRedisConnection();
    if (!redis) {
        console.warn('⚠️  Redis not available - cannot persist queue pause timestamp');
        return;
    }
    await redis.set(QUEUE_PAUSED_KEY, Date.now().toString());
};

const checkQueuePauseState = async () => {
    const redis = getRedisConnection();
    if (!redis) return;

    const pausedAtRaw = await redis.get(QUEUE_PAUSED_KEY);
    if (!pausedAtRaw) return;

    const pausedAt = parseInt(pausedAtRaw, 10);
    if (!Number.isFinite(pausedAt)) {
        await redis.del(QUEUE_PAUSED_KEY);
        return;
    }

    const elapsed = Date.now() - pausedAt;
    if (elapsed >= PAUSE_DURATION_MS) {
        await resumeQueue();
        consecutiveFailures = 0;
        await redis.del(QUEUE_PAUSED_KEY);
        console.log('▶️  Queue pause expired - resuming job alerts');
    }
};

/**
 * Map our employment types to RapidAPI format
 * Our model uses: 'full-time', 'part-time', 'contract', 'internship'
 * RapidAPI expects: 'FULLTIME', 'CONTRACTOR', 'PARTTIME', 'INTERN'
 */
const mapEmploymentType = (types) => {
    if (!types || !Array.isArray(types) || types.length === 0) {
        return ''; // Don't send employment_types if empty
    }

    const typeMap = {
        'full-time': 'FULLTIME',
        'fulltime': 'FULLTIME',
        'part-time': 'PARTTIME',
        'parttime': 'PARTTIME',
        'contract': 'CONTRACTOR',
        'contractor': 'CONTRACTOR',
        'internship': 'INTERN',
        'intern': 'INTERN'
    };

    const mappedTypes = types
        .map(t => typeMap[t?.toLowerCase()] || null)
        .filter(Boolean);

    return mappedTypes.join(',');
};

/**
 * Bulk-upsert a batch of fetched jobs into the JobListing collection.
 *
 * Replaces the N+1 findOne-per-job pattern with a single $in lookup followed
 * by a single insertMany for any genuinely new entries. Handles duplicate-key
 * errors (code 11000) from concurrent workers gracefully with a fallback
 * re-query so no _id is ever lost.
 *
 * @param {object[]} fetchedJobs   Raw job objects from the API / scrapers.
 * @param {object}   JobModel      Mongoose model for JobListing (injectable for tests).
 * @param {Function} [onNewJobs]   Async callback receiving newly inserted docs.
 * @returns {Promise<object[]>}    Jobs enriched with their MongoDB _id.
 */
export const bulkUpsertJobs = async (fetchedJobs, JobModel, onNewJobs) => {
    const MAX_BATCH_SIZE = 25;
    const batch = fetchedJobs.slice(0, MAX_BATCH_SIZE);

    if (batch.length === 0) return [];

    const externalIds = batch.map(j => j.externalId).filter(Boolean);

    // Single $in query instead of one findOne per job
    const existingDocs = await JobModel.find({ externalId: { $in: externalIds } })
        .select('_id externalId')
        .lean();

    const existingMap = new Map(existingDocs.map(d => [d.externalId, d]));

    const toInsert = batch.filter(j => j.externalId && !existingMap.has(j.externalId));

    if (toInsert.length > 0) {
        let insertedDocs = [];
        try {
            insertedDocs = await JobModel.insertMany(toInsert, { ordered: false });
        } catch (err) {
            // 11000 = duplicate key: a concurrent worker inserted first — not an error.
            if (err.name === 'MongoBulkWriteError' || err.code === 11000) {
                insertedDocs = err.insertedDocs ?? [];
                console.warn(`⚠️  Bulk insert: ${err.writeErrors?.length ?? 0} duplicate(s) skipped (concurrent workers)`);
            } else {
                throw err;
            }
        }

        for (const doc of insertedDocs) {
            existingMap.set(doc.externalId, doc);
        }

        // Recover IDs for any docs a concurrent worker inserted between our find and insertMany
        const stillMissing = toInsert
            .map(j => j.externalId)
            .filter(id => id && !existingMap.has(id));
        if (stillMissing.length > 0) {
            const recovered = await JobModel.find({ externalId: { $in: stillMissing } })
                .select('_id externalId')
                .lean();
            for (const doc of recovered) existingMap.set(doc.externalId, doc);
        }

        if (onNewJobs && insertedDocs.length > 0) {
            await onNewJobs(insertedDocs);
        }
    }

    return batch
        .map(job => ({ ...job, _id: existingMap.get(job.externalId)?._id }))
        .filter(j => j._id != null);
};

/**
 * Process a single job alert - fetch jobs and send notifications
 */
export const processAlert = async (alertData) => {
    const { alertId, userId, userEmail, userName, title, keywords, location, remoteOnly, employmentType } = alertData;

    console.log(`\n📧 [${new Date().toLocaleTimeString()}] Processing alert: ${title} for user ${userId}`);
    console.log(`   📬 Target Email: ${userEmail || 'NO EMAIL PROVIDED!'}`);
    console.log(`   👤 User: ${userName || 'Unknown'}`);

    // Emit socket event that processing started
    emitAlertProcessing(userId, {
        alertId,
        alertTitle: title
    });

    // Skip if no email address is available
    if (!userEmail || !userEmail.trim()) {
        console.error(`❌ Skipping alert ${alertId}: No email address found for user ${userId}`);
        return { success: false, error: 'No email address', skipped: true };
    }

    // Verify the alert still exists before processing
    const alertExists = await JobAlert.findById(alertId);
    if (!alertExists) {
        console.log(`⚠️ Alert ${alertId} has been deleted - skipping`);
        return { success: false, error: 'Alert deleted', skipped: true };
    }

    // Verify the alert is still active
    if (!alertExists.isActive) {
        console.log(`⚠️ Alert ${alertId} is no longer active - skipping`);
        return { success: false, error: 'Alert inactive', skipped: true };
    }

    // Ensure email matches the current alert's email (in case of updates)
    const currentEmail = alertExists.userEmail;
    if (!currentEmail || currentEmail.trim() === '') {
        console.error(`❌ Alert ${alertId} has no email address in database - skipping`);
        return { success: false, error: 'No email in database', skipped: true };
    }

    try {
        // Build search query from alert preferences
        const searchQuery = [title, ...(keywords || [])].filter(Boolean).join(' ');

        // Map employment types to RapidAPI format
        const mappedEmploymentType = mapEmploymentType(employmentType);
        console.log(`📋 Employment type: ${employmentType} -> ${mappedEmploymentType || '(none)'}`);

        // Fetch jobs from RapidAPI
        const fetchedJobs = await searchJobs({
            query: searchQuery,
            location: location || '',
            remoteOnly: remoteOnly || false,
            employmentType: mappedEmploymentType,
            page: 1,
            numPages: 1
        });

        // Run registered local scrapers (e.g., Naukri) to enrich results
        try {
            console.log(`[JOB_FETCHER] 🔌 Fetching from modular local scrapers for query: "${searchQuery}"...`);
            const localRun = await scraperRegistry.scrapeAll({
                query: searchQuery,
                location: location || '',
                remoteOnly: remoteOnly || false,
                employmentType: employmentType || []
            });
            if (localRun.jobs && localRun.jobs.length > 0) {
                console.log(`[JOB_FETCHER] 🔌 Local scrapers aggregated ${localRun.jobs.length} additional jobs.`);
                fetchedJobs.push(...localRun.jobs);
            }
        } catch (scraperErr) {
            console.error('[JOB_FETCHER] ❌ Failed to run local scrapers registry:', scraperErr.message);
        }

        if (!fetchedJobs.length) {
            console.log('📭 No jobs found for this alert');
            await JobAlert.findByIdAndUpdate(alertId, { lastCheckedAt: new Date() });
            return { success: true, newJobs: 0 };
        }

        // Bulk upsert: one $in lookup + one insertMany instead of N findOne calls
        const jobsToSend = await bulkUpsertJobs(fetchedJobs, JobListing, async (newDocs) => {
            // Batch Firebase sync for newly cached jobs
            await Promise.allSettled(
                newDocs.map(doc => {
                    const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
                    return saveJobListingToFirebase(obj);
                })
            );
            console.log(`💾 Cached and synced ${newDocs.length} new job(s) to Firebase`);
        });

        console.log(`📧 Sending ${jobsToSend.length} jobs to user (deduplication DISABLED)`);

        // Always send email if there are jobs
        if (jobsToSend.length > 0) {
            try {
                // Use the current email from the database to ensure accuracy
                const recipientEmail = currentEmail;
                const recipientName = alertExists.userName || userName || 'Job Seeker';

                console.log(`\n${'='.repeat(60)}`);
                console.log(`📧 SENDING EMAIL NOW`);
                console.log(`${'='.repeat(60)}`);
                console.log(`📬 To: ${recipientEmail}`);
                console.log(`👤 Name: ${recipientName}`);
                console.log(`🎯 Alert: "${title}"`);
                console.log(`📊 Jobs Count: ${jobsToSend.length}`);
                console.log(`${'='.repeat(60)}\n`);

                // Emit socket event to user about new jobs found
                emitNewJobsFound(userId, {
                    alertId,
                    alertTitle: title,
                    jobCount: jobsToSend.length,
                    jobs: jobsToSend.map(job => ({
                        title: job.title,
                        company: job.company,
                        location: job.location,
                        applyLink: job.applyLink
                    }))
                });

                console.log(`⏳ Calling email service...`);
                const emailResult = await sendJobAlertEmail({
                    userEmail: recipientEmail,
                    userName: recipientName,
                    alertTitle: title,
                    jobs: jobsToSend
                });
                console.log(`✅ Email service call completed!`);

                console.log(`\n${'🎉'.repeat(30)}`);
                console.log(`✅✅✅ EMAIL SENT SUCCESSFULLY! ✅✅✅`);
                console.log(`📧 Message ID: ${emailResult.messageId}`);
                console.log(`📬 Recipient: ${recipientEmail}`);
                console.log(`📊 Jobs Sent: ${jobsToSend.length}`);
                console.log(`${'🎉'.repeat(30)}\n`);

                // Emit socket event confirming email was sent
                emitEmailSent(userId, {
                    alertId,
                    alertTitle: title,
                    jobCount: jobsToSend.length,
                    recipientEmail,
                    messageId: emailResult.messageId
                });

                // Log all notifications
                const notificationPromises = jobsToSend.map(async job => {
                    try {
                        const notification = await NotificationLog.create({
                            userId,
                            alertId,
                            jobListingId: job._id,
                            externalJobId: job.externalId,
                            emailStatus: 'sent',
                            emailMessageId: emailResult.messageId
                        });

                        // Save to Firebase (convert ObjectIds to strings)
                        try {
                            await saveNotificationToFirebase({
                                ...notification.toObject(),
                                _id: notification._id.toString(),
                                alertId: alertId.toString(),
                                jobListingId: job._id.toString()
                            });
                        } catch (fbError) {
                            console.warn('⚠️  Could not save notification to Firebase:', fbError.message);
                        }
                    } catch (err) {
                        // Handle duplicate key error gracefully
                        if (err.code !== 11000) throw err;
                    }
                });

                await Promise.all(notificationPromises);

                // Update alert stats
                await JobAlert.findByIdAndUpdate(alertId, {
                    lastCheckedAt: new Date(),
                    $inc: {
                        totalJobsFound: jobsToSend.length,
                        totalEmailsSent: 1
                    }
                });

                console.log(`✉️ Email sent with ${jobsToSend.length} jobs`);
                consecutiveFailures = 0; // Reset on success

            } catch (emailError) {
                console.error('❌ Failed to send email:', emailError.message);

                // Emit socket event about email failure
                emitEmailFailed(userId, {
                    alertId,
                    alertTitle: title,
                    error: emailError.message
                });

                // Log failed notifications
                await Promise.all(jobsToSend.map(job =>
                    NotificationLog.create({
                        userId,
                        alertId,
                        jobListingId: job._id,
                        externalJobId: job.externalId,
                        emailStatus: 'failed',
                        errorMessage: emailError.message
                    }).catch(() => { })
                ));
            }
        }

        return { success: true, newJobs: jobsToSend.length };

    } catch (error) {
        console.error(`❌ Error processing alert ${alertId}:`, error.message);

        // Handle rate limiting
        if (error.message === 'RATE_LIMIT_EXCEEDED') {
            consecutiveFailures++;
            if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
                console.log('🛑 Circuit breaker triggered - pausing queue');
                await pauseQueue();
                await persistQueuePause();
            }
            throw error; // Let BullMQ retry
        }

        throw error;
    }
};

/**
 * Create and start the queue worker (only if Redis available)
 * IMPORTANT: Worker needs its own Redis connection (BullMQ requirement)
 */
export const startWorker = () => {
    if (!isQueueAvailable()) {
        console.log('⚠️  Queue not available - Worker not started');
        return null;
    }

    // Create a SEPARATE Redis connection for the worker
    // BullMQ requires this because workers use blocking commands
    const workerConnection = createWorkerConnection();

    if (!workerConnection) {
        console.log('⚠️  Could not create worker connection - Worker not started');
        return null;
    }

    console.log('🔌 Created dedicated Redis connection for worker');
    console.log('🔧 Worker connection state:', workerConnection.status);

    const worker = new Worker(
        'job-alerts',
        async (job) => {
            console.log(`\n${'🔥'.repeat(30)}`);
            console.log(`🔄 WORKER PROCESSING JOB: ${job.id}`);
            console.log(`📧 Alert: ${job.data.title}`);
            console.log(`📬 Email: ${job.data.userEmail}`);
            console.log(`👤 User: ${job.data.userName || 'N/A'}`);
            console.log(`${'🔥'.repeat(30)}\n`);

            try {
                console.log('⏳ Starting alert processing...');
                const result = await processAlert(job.data);
                console.log(`\n${'✅'.repeat(30)}`);
                console.log(`✅ WORKER COMPLETED: ${job.id}`);
                console.log(`   Jobs sent: ${result?.newJobs || 0}`);
                console.log(`   Success: ${result?.success}`);
                console.log(`${'✅'.repeat(30)}\n`);
                return result;
            } catch (error) {
                console.error(`\n${'❌'.repeat(30)}`);
                console.error(`❌ WORKER ERROR: ${job.id}`);
                console.error(`   Error:`, error.message);
                console.error(`   Stack:`, error.stack);
                console.error(`${'❌'.repeat(30)}\n`);
                throw error;
            }
        },
        {
            connection: workerConnection,
            concurrency: RATE_LIMIT_CONFIG.maxConcurrent,
            limiter: {
                max: RATE_LIMIT_CONFIG.maxRequestsPerMinute,
                duration: 60000 // 1 minute
            },
            autorun: true // Explicitly enable autorun
        }
    );

    worker.on('completed', (job, result) => {
        console.log(`\n🎉 Job ${job.id} completed successfully!`);
        console.log(`   New jobs found: ${result?.newJobs || 0}`);
        console.log(`   Skipped: ${result?.skipped ? 'Yes' : 'No'}`);
    });

    worker.on('failed', (job, error) => {
        console.error(`\n💥 Job ${job.id} FAILED:`);
        console.error(`   Error: ${error.message}`);
        console.error(`   Stack:`, error.stack);
    });

    worker.on('error', (error) => {
        console.error('\n❌ WORKER ERROR:', error.message);
    });

    worker.on('active', (job) => {
        console.log(`\n${'▶️'.repeat(20)}`);
        console.log(`▶️  WORKER PICKED UP JOB: ${job.id}`);
        console.log(`   Alert: ${job.data.title}`);
        console.log(`   Email: ${job.data.userEmail}`);
        console.log(`${'▶️'.repeat(20)}\n`);
    });

    worker.on('stalled', (jobId) => {
        console.warn(`\n⚠️  Job ${jobId} stalled`);
    });

    worker.on('ready', () => {
        console.log('🟢 Worker is READY and waiting for jobs');
    });

    worker.on('closing', () => {
        console.log('🔴 Worker is closing');
    });

    console.log('👷 Job Alert Worker started and listening for jobs...');
    console.log('   Concurrency:', RATE_LIMIT_CONFIG.maxConcurrent);
    console.log('   Rate limit:', RATE_LIMIT_CONFIG.maxRequestsPerMinute, 'requests/minute');
    
    // Worker is already autorunning.
    
    return worker;
};

/**
 * Scheduled task to enqueue all active alerts
 */
export const scheduleAlertChecks = () => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const testInterval = process.env.ALERT_TEST_INTERVAL;

    // In development mode with ALERT_TEST_INTERVAL set
    if (isDevelopment && testInterval) {
        // Parse interval (e.g., '10s' -> 10000ms, '5m' -> 300000ms)
        let intervalMs = 10000; // default 10 seconds
        
        if (testInterval.endsWith('s')) {
            intervalMs = parseInt(testInterval) * 1000;
        } else if (testInterval.endsWith('m')) {
            intervalMs = parseInt(testInterval) * 60 * 1000;
        } else if (testInterval.endsWith('h')) {
            intervalMs = parseInt(testInterval) * 60 * 60 * 1000;
        }

        console.log(`🧪 DEVELOPMENT MODE: Running job alerts every ${testInterval} (${intervalMs}ms)`);

        const runTest = async () => {
            console.log('\n⏰ [DEV] Scheduled job alert check starting...');
            try {
                await runAlertCheck();
            } catch (err) {
                console.error('❌ Error in runAlertCheck:', err.message);
            } finally {
                // Schedule next run only AFTER current one finishes
                setTimeout(runTest, intervalMs);
            }
        };

        // Start initial test run after 2 seconds
        setTimeout(runTest, 2000);
        return;
    }

    // PRODUCTION MODE: Run daily and let each alert's frequency decide whether it is due.
    // Custom schedule can be set via ALERT_CRON_SCHEDULE env var
    const schedule = process.env.ALERT_CRON_SCHEDULE || '0 0 * * *';
<<<<<<< Updated upstream
    
    console.log(`🏭 PRODUCTION MODE: Job alerts scheduled with cron: ${schedule}`);
=======

    console.log(`🏭 PRODUCTION MODE: Job alerts scheduled with cron: ${schedule}`);

>>>>>>> Stashed changes
    cron.schedule(schedule, async () => {
         console.log('\n⏰ [PROD] Scheduled job alert check starting...');

        try {
<<<<<<< Updated upstream
            const activeAlerts = await JobAlert.find(getDueAlertQuery(new Date(), { isActive: true }))
                .select('_id userId userEmail userName title keywords location remoteOnly employmentType checkFrequency lastCheckedAt')
                .lean();
=======
        // Get all active alerts that are due and have valid email addresses
            const activeAlerts = await JobAlert.find(
            getDueAlertQuery(new Date(), {
                isActive: true,
                userEmail: { $exists: true, $nin: ['', null] }
            })
        )
            .select('_id userId userEmail userName title keywords location remoteOnly employmentType checkFrequency lastCheckedAt')
            .lean();
>>>>>>> Stashed changes

            if (!activeAlerts.length) {
                console.log('📭 No active alerts to process');
                return;
            }

            console.log(`📋 Found ${activeAlerts.length} active alerts`);

            // Prepare alert data for queue
            const alertsToQueue = activeAlerts.map(alert => ({
                alertId: alert._id.toString(),
                userId: alert.userId,
                userEmail: alert.userEmail,
                userName: alert.userName,
                title: alert.title,
                keywords: alert.keywords || [],
                location: alert.location,
                remoteOnly: alert.remoteOnly,
                employmentType: alert.employmentType,
                checkFrequency: alert.checkFrequency || DEFAULT_CHECK_FREQUENCY
            }));

            // If queue available, add to queue, otherwise process directly
            if (isQueueAvailable()) {
                await addBatchAlertsToQueue(alertsToQueue);
                console.log(`📥 Added ${alertsToQueue.length} alerts to queue`);
            } else {
                console.log('⚠️  Queue not available, processing alerts directly...');
                for (const alertData of alertsToQueue) {
                    try {
                        await processAlert(alertData);
                        // Add delay between requests to respect rate limits
                        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_CONFIG.delayBetweenJobs));
                    } catch (err) {
                        console.error(`Failed to process alert ${alertData.alertId}:`, err.message);
                    }
                }
            }

        } catch (error) {
            console.error('❌ Error scheduling alerts:', error);
        }
    });

    console.log(`📅 Alert check scheduled: ${schedule}`);
};

/**
 * Core alert check logic - extracted for reuse
 * PROCESSES DIRECTLY - No queue/worker dependency
 */
const runAlertCheck = async () => {
    try {
        const activeAlerts = await JobAlert.find(getDueAlertQuery(new Date(), {
            isActive: true,
            userEmail: { $exists: true, $nin: ['', null] }
        }))
            .select('_id userId userEmail userName title keywords location remoteOnly employmentType checkFrequency lastCheckedAt')
            .lean();

        if (!activeAlerts.length) {
            console.log('📭 No active alerts with valid email addresses to process');
            return;
        }

        console.log(`📋 Found ${activeAlerts.length} active alerts with valid emails`);

        // Debug: Log each alert's details
        activeAlerts.forEach((alert, i) => {
            console.log(`   Alert ${i + 1}: "${alert.title}" - Email: ${alert.userEmail}`);
        });

        // PROCESS DIRECTLY - Don't use queue/worker (they're broken)
        console.log('\n🚀 PROCESSING ALERTS DIRECTLY (BYPASSING QUEUE)...\n');
        
        for (const alert of activeAlerts) {
            try {
                console.log(`\n${'='.repeat(60)}`);
                console.log(`📧 Processing: "${alert.title}" → ${alert.userEmail}`);
                console.log(`${'='.repeat(60)}\n`);
                
                const result = await processAlert({
                    alertId: alert._id.toString(),
                    userId: alert.userId,
                    userEmail: alert.userEmail,
                    userName: alert.userName,
                    title: alert.title,
                    keywords: alert.keywords || [],
                    location: alert.location,
                    remoteOnly: alert.remoteOnly,
                    employmentType: alert.employmentType,
                    checkFrequency: alert.checkFrequency || DEFAULT_CHECK_FREQUENCY
                });
                
                console.log(`\n✅ Alert processed: ${result.newJobs || 0} jobs sent\n`);
                
                // Add delay between requests to respect rate limits
                await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_CONFIG.delayBetweenJobs));
                
            } catch (err) {
                console.error(`❌ Failed to process alert ${alert.title}:`, err.message);
            }
        }
        
        console.log('\n✅ All alerts processed!\n');

    } catch (error) {
        console.error('❌ Error in alert check:', error);
    }
};

/**
 * Manually trigger alert check for a specific alert (for testing)
 */
export const triggerAlertCheck = async (alertId) => {
    const alert = await JobAlert.findById(alertId).lean();

    if (!alert) {
        throw new Error('Alert not found');
    }

    if (!alert.isActive) {
        throw new Error('Alert is not active');
    }

    const result = await processAlert({
        alertId: alert._id.toString(),
        userId: alert.userId,
        userEmail: alert.userEmail,
        userName: alert.userName,
        title: alert.title,
        keywords: alert.keywords || [],
        location: alert.location,
        remoteOnly: alert.remoteOnly,
        employmentType: alert.employmentType
    });

    return result;
};

/**
 * Initialize the fetcher system
 */
export const initJobFetcher = async () => {
    console.log('\n🚀 Initializing Job Fetcher System...');

    // Try to initialize Redis queue
    const queueInitialized = await initializeQueue();

    if (queueInitialized) {
        try {
            await checkQueuePauseState();
            setInterval(() => {
                checkQueuePauseState().catch(err => {
                    console.warn('⚠️  Failed to check queue pause state:', err.message);
                });
            }, 5 * 60 * 1000);
        } catch (error) {
            console.warn('⚠️  Queue pause state check failed:', error.message);
        }
    }

    let worker = null;
    if (queueInitialized) {
        // Start the worker
        worker = startWorker();

        if (worker) {
            console.log('✅ Worker is ACTIVE and ready to process jobs');
            console.log('   Worker will automatically process jobs added to the queue');
        } else {
            console.log('❌ Worker failed to start!');
        }
    } else {
        console.log('⚠️  Queue not initialized - worker will not start');
        console.log('   Jobs will be processed directly (without queue)');
    }

    // Schedule periodic checks (works with or without Redis)
    scheduleAlertChecks();

    console.log('✅ Job Fetcher System initialized\n');

    return { worker, queueAvailable: queueInitialized };
};

export default {
    initJobFetcher,
    startWorker,
    scheduleAlertChecks,
    triggerAlertCheck,
    processAlert
};
