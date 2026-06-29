import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

import User from '../models/User.model.js';
import TrackedJob from '../models/TrackedJob.model.js';

import { GoogleGenerativeAI } from '@google/generative-ai';

import cron from 'node-cron';

import { sendWeeklyDigestEmail } from './mailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini AI with validation
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI = null;
let model = null;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY is not configured. Weekly digest generation will use fallback behavior.');
  console.warn('   Set GEMINI_API_KEY in your .env file to enable AI-powered digest summaries.');
} else {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash'
  });
}

// ---------------------------------------------------------------------------
// Queue state — mirrors the pattern in jobAlertQueue.js
// ---------------------------------------------------------------------------

let redisAvailable = false;
let redisConnection = null;
let weeklyDigestQueue = null;
let redisUrl = null;

const QUEUE_NAME = 'weekly-digests';

// Worker processes up to 3 users concurrently; keeps Gemini pressure low.
// Tune via WEEKLY_DIGEST_CONCURRENCY env var.
const WORKER_CONCURRENCY = parseInt(process.env.WEEKLY_DIGEST_CONCURRENCY || '3', 10);

// ---------------------------------------------------------------------------
// Helpers (unchanged from original)
// ---------------------------------------------------------------------------

const escapeHtml = (unsafe = '') => {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const generateWeeklyInsights = async (user, trackedJobs) => {
  try {
    if (!model) {
      console.warn('⚠️ Gemini AI is not configured. Using fallback digest generation.');
      throw new Error('Gemini API is not configured');
    }

    const recentJobs = trackedJobs.slice(0, 5);

    const prompt = `
You are a career coach AI.

Generate a concise weekly career digest for this user.

User Role: ${user.jobRole}
Skills: ${user.skills?.join(', ') || 'Not specified'}
Experience: ${user.yearsOfExperience} years

Recent tracked jobs:
${recentJobs.map((job, index) => `
${index + 1}.
Title: ${job.title}
Company: ${job.company}
Status: ${job.status}
Location: ${job.location}
`).join('\n')}

Return STRICTLY in this format:

MARKET_TRENDS:
- point 1
- point 2

PERSONALIZED_TIPS:
- point 1
- point 2

SKILL_RECOMMENDATIONS:
- skill 1
- skill 2
- skill 3

Keep response concise.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating weekly insights:', error);

    // Graceful fallback so a Gemini outage doesn't swallow the entire batch
    return `
MARKET_TRENDS:
- Hiring demand remains steady for ${user.jobRole} roles.
- Companies continue prioritizing practical skills and project experience.

PERSONALIZED_TIPS:
- Continue applying consistently to relevant positions.
- Strengthen portfolio projects and resume impact metrics.

SKILL_RECOMMENDATIONS:
- System Design
- Communication
- Problem Solving
`;
  }
};

const buildDigestHtml = async ({ user, insights, trackedJobs }) => {
  const templatePath = path.join(
    __dirname,
    '../templates/emails/weekly-digest.html'
  );

  let template = await fs.readFile(templatePath, 'utf-8');

  const trackedJobsHtml = trackedJobs
    .slice(0, 5)
    .map((job) => `
      <li>
        <strong>${escapeHtml(job.title)}</strong>
        at ${escapeHtml(job.company)}
        (${escapeHtml(job.status)})
      </li>
    `)
    .join('');

  template = template
    .replace('{{USER_NAME}}', escapeHtml(user.username))
    .replace(
      '{{INSIGHTS}}',
      escapeHtml(insights).replace(/\n/g, '<br>')
    )
    .replace('{{TRACKED_JOBS}}', trackedJobsHtml);

  return template;
};

// ---------------------------------------------------------------------------
// Core per-user digest logic (exported for direct use and worker reuse)
// ---------------------------------------------------------------------------

export const generateWeeklyDigestForUser = async (user) => {
  const trackedJobs = await TrackedJob.find({ userId: user.uid })
    .sort({ updatedAt: -1 })
    .limit(10);

  const insights = await generateWeeklyInsights(user, trackedJobs);

  const html = await buildDigestHtml({ user, insights, trackedJobs });

  return { insights, html };
};

export const getWeeklyDigestUsers = async () => {
  return User.find({ 'notificationPreferences.jobAlerts': true });
};

// ---------------------------------------------------------------------------
// Redis / Queue initialization
// ---------------------------------------------------------------------------

/**
 * Create a dedicated Redis connection for the BullMQ worker.
 * BullMQ requires a separate connection because workers use blocking commands.
 */
const createWorkerConnection = () => {
  if (!redisUrl) {
    console.log('⚠️  [WeeklyDigest] Redis URL not available for worker connection');
    return null;
  }

  const conn = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 1000);
    }
  });

  conn.on('error', (err) => {
    console.error('❌ [WeeklyDigest] Worker Redis connection error:', err.message);
  });

  return conn;
};

/**
 * Initialize the weekly-digests BullMQ queue.
 * Returns true when Redis is reachable and the queue is ready.
 */
export const initializeDigestQueue = async () => {
  redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log('ℹ️  [WeeklyDigest] REDIS_URL not configured - digest queue disabled');
    return false;
  }

  try {
    redisConnection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        if (times > 3) {
          console.log('⚠️  [WeeklyDigest] Redis connection failed after 3 attempts');
          return null;
        }
        return Math.min(times * 200, 1000);
      }
    });

    // Test connection before declaring success
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

    weeklyDigestQueue = new Queue(QUEUE_NAME, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 10000 // Start at 10 s; grows to 40 s on 3rd attempt
        },
        removeOnComplete: {
          age: 24 * 3600,  // Keep completed jobs 24 h for monitoring
          count: 500
        },
        removeOnFail: {
          age: 7 * 24 * 3600 // Keep failed jobs 7 days for debugging
        }
      }
    });

    weeklyDigestQueue.on('error', (error) => {
      console.error('❌ [WeeklyDigest] Queue error:', error.message);
    });

    redisAvailable = true;
    console.log('✅ [WeeklyDigest] Redis connected - digest queue enabled');
    return true;

  } catch (error) {
    console.log('⚠️  [WeeklyDigest] Redis not available:', error.message);
    console.log('ℹ️  [WeeklyDigest] Digest queue disabled - falling back to sequential processing');
    redisAvailable = false;
    return false;
  }
};

const isDigestQueueAvailable = () => redisAvailable && weeklyDigestQueue !== null;

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

/**
 * Start the BullMQ worker that processes individual digest jobs.
 * Each job carries only { userId } to keep the payload lightweight.
 * The worker fetches the full user document itself so restarts are safe.
 */
export const startDigestWorker = () => {
  if (!isDigestQueueAvailable()) {
    console.log('⚠️  [WeeklyDigest] Queue not available - worker not started');
    return null;
  }

  const workerConnection = createWorkerConnection();

  if (!workerConnection) {
    console.log('⚠️  [WeeklyDigest] Could not create worker Redis connection');
    return null;
  }

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const { userId } = job.data;

      console.log(`[WeeklyDigest] ▶️  Processing digest for user: ${userId}`);

      // Re-fetch the user so we always have fresh data even after retries
      const user = await User.findById(userId).lean();

      if (!user) {
        // User deleted between enqueue and processing — skip gracefully
        console.warn(`[WeeklyDigest] ⚠️  User ${userId} not found, skipping`);
        return { skipped: true, reason: 'user_not_found' };
      }

      if (!user.email) {
        console.warn(`[WeeklyDigest] ⚠️  User ${userId} has no email, skipping`);
        return { skipped: true, reason: 'no_email' };
      }

      const { html } = await generateWeeklyDigestForUser(user);

      await sendWeeklyDigestEmail({
        userEmail: user.email,
        userName: user.username,
        html
      });

      console.log(`[WeeklyDigest] ✅ Digest sent to ${user.email}`);
      return { success: true, email: user.email };
    },
    {
      connection: workerConnection,
      concurrency: WORKER_CONCURRENCY,
      autorun: true
    }
  );

  worker.on('completed', (job, result) => {
    if (result?.skipped) {
      console.log(`[WeeklyDigest] ⏭️  Job ${job.id} skipped: ${result.reason}`);
    } else {
      console.log(`[WeeklyDigest] ✅ Job ${job.id} completed for ${result?.email}`);
    }
  });

  worker.on('failed', (job, error) => {
    console.error(
      `[WeeklyDigest] ❌ Job ${job?.id} failed (attempt ${job?.attemptsMade}/${job?.opts?.attempts}):`,
      error.message
    );
  });

  worker.on('error', (error) => {
    console.error('[WeeklyDigest] ❌ Worker error:', error.message);
  });

  worker.on('stalled', (jobId) => {
    console.warn(`[WeeklyDigest] ⚠️  Job ${jobId} stalled`);
  });

  console.log(
    `👷 [WeeklyDigest] Worker started (concurrency: ${WORKER_CONCURRENCY})`
  );

  return worker;
};

// ---------------------------------------------------------------------------
// Public API — sendWeeklyDigests
// ---------------------------------------------------------------------------

/**
 * Enqueue one lightweight digest job per eligible user.
 * Falls back to the original sequential loop when Redis is unavailable.
 */
export const sendWeeklyDigests = async () => {
  try {
    console.log('[WeeklyDigest] Starting weekly digest run...');

    const users = await getWeeklyDigestUsers();

    if (!users.length) {
      console.log('[WeeklyDigest] No eligible users found, nothing to do');
      return;
    }

    console.log(`[WeeklyDigest] Found ${users.length} users to process`);

    if (isDigestQueueAvailable()) {
      // ── Queue path: enqueue one job per user ──────────────────────────────
      // Use a week-scoped jobId so duplicate cron triggers within the same
      // week don't create duplicate digest sends.
      const weekKey = `${new Date().getUTCFullYear()}-W${getISOWeek(new Date())}`;

      const jobs = users.map((user, index) => ({
        name: 'send-digest',
        data: { userId: user._id.toString() },
        opts: {
          jobId: `digest-${user._id.toString()}-${weekKey}`,
          // Stagger jobs by 500 ms each to spread Gemini API pressure
          delay: index * 500
        }
      }));

      await weeklyDigestQueue.addBulk(jobs);

      console.log(
        `[WeeklyDigest] ✅ Enqueued ${jobs.length} digest jobs (week: ${weekKey})`
      );
    } else {
      // ── Fallback path: sequential processing (no Redis) ───────────────────
      console.log('[WeeklyDigest] ⚠️  Queue unavailable, processing sequentially...');

      for (const user of users) {
        try {
          const { html } = await generateWeeklyDigestForUser(user);

          await sendWeeklyDigestEmail({
            userEmail: user.email,
            userName: user.username,
            html
          });

          console.log(`[WeeklyDigest] ✅ Sent to ${user.email}`);
        } catch (error) {
          console.error(
            `[WeeklyDigest] ❌ Failed for ${user.email}:`,
            error.message
          );
        }
      }
    }

    console.log('[WeeklyDigest] Digest run complete');
  } catch (error) {
    console.error('[WeeklyDigest] ❌ Weekly digest run failed:', error);
  }
};

// ---------------------------------------------------------------------------
// Cron scheduler
// ---------------------------------------------------------------------------

export const scheduleWeeklyDigest = () => {
  const schedule = '0 9 * * 1'; // Every Monday at 09:00

  console.log(`[WeeklyDigest] Cron scheduled: ${schedule}`);

  cron.schedule(
    schedule,
    async () => {
      console.log('[WeeklyDigest] Cron triggered');
      await sendWeeklyDigests();
    },
    {
      timezone: process.env.WEEKLY_DIGEST_TIMEZONE || 'UTC'
    }
  );
};

// ---------------------------------------------------------------------------
// ISO week helper (no external dependency)
// ---------------------------------------------------------------------------

/**
 * Returns the ISO week number for a given date.
 * @param {Date} date
 * @returns {number}
 */
function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}