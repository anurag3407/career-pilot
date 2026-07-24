import cron from 'node-cron';
import TrackedJob from '../models/TrackedJob.model.js';
import { sendDeadlineReminderEmail } from './mailService.js';

/**
 * Process deadline reminders for all users.
 * Sends emails for:
 *   - Jobs with deadlines today (not yet reminded)
 *   - Jobs with deadlines within 48 hours (not yet reminded)
 * Marks jobs as reminded to prevent duplicates.
 * Skips rejected applications and jobs without userEmail.
 */
export const processDeadlineReminders = async () => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setUTCHours(23, 59, 59, 999);

  const fortyEightHoursFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const EXCLUDED_STATUSES = ['rejected'];

  const [jobsDueToday, jobsDueSoon] = await Promise.all([
    TrackedJob.find({
      deadline: { $gte: startOfToday, $lte: endOfToday },
      'deadlineReminderSent.today': { $ne: true },
      userEmail: { $ne: null },
      status: { $nin: EXCLUDED_STATUSES }
    }).lean(),

    TrackedJob.find({
      deadline: { $gt: endOfToday, $lte: fortyEightHoursFromNow },
      'deadlineReminderSent.fortyEightHour': { $ne: true },
      userEmail: { $ne: null },
      status: { $nin: EXCLUDED_STATUSES }
    }).lean()
  ]);

  console.log(`[DeadlineReminder] Found ${jobsDueToday.length} jobs due today, ${jobsDueSoon.length} due within 48h`);

  if (!jobsDueToday.length && !jobsDueSoon.length) return;

  // Group by userEmail
  const userMap = new Map();

  for (const job of jobsDueToday) {
    if (!userMap.has(job.userEmail)) userMap.set(job.userEmail, { today: [], soon: [] });
    userMap.get(job.userEmail).today.push(job);
  }

  for (const job of jobsDueSoon) {
    if (!userMap.has(job.userEmail)) userMap.set(job.userEmail, { today: [], soon: [] });
    userMap.get(job.userEmail).soon.push(job);
  }

  for (const [userEmail, { today, soon }] of userMap) {
    try {
      await sendDeadlineReminderEmail({
        userEmail,
        jobsDueToday: today,
        jobsDueSoon: soon
      });

      const updates = [];

      if (today.length) {
        updates.push(
          TrackedJob.updateMany(
            { _id: { $in: today.map((j) => j._id) } },
            { $set: { 'deadlineReminderSent.today': true } }
          )
        );
      }

      if (soon.length) {
        updates.push(
          TrackedJob.updateMany(
            { _id: { $in: soon.map((j) => j._id) } },
            { $set: { 'deadlineReminderSent.fortyEightHour': true } }
          )
        );
      }

      await Promise.all(updates);
      console.log(`[DeadlineReminder] Sent reminder to ${userEmail} (${today.length} today, ${soon.length} within 48h)`);
    } catch (err) {
      console.error(`[DeadlineReminder] Failed for ${userEmail}:`, err.message);
    }
  }
};

/**
 * Schedule daily deadline reminder cron.
 * Runs at 08:00 UTC every day.
 * Safe to call multiple times — only registers one cron.
 */
let scheduled = false;

export const scheduleDeadlineReminders = () => {
  if (scheduled) return;
  scheduled = true;

  cron.schedule('0 8 * * *', async () => {
    console.log('[DeadlineReminder] Running scheduled check...');
    try {
      await processDeadlineReminders();
    } catch (err) {
      console.error('[DeadlineReminder] Cron error:', err.message);
    }
  });

  console.log('✅ Deadline reminder cron scheduled (daily at 08:00 UTC)');
};
