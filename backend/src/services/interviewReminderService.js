import cron from 'node-cron';
import TrackedJob from '../models/TrackedJob.model.js';
import { sendInterviewReminderEmail } from './mailService.js';
import { db } from '../config/firebase.js';

export const initInterviewReminderCron = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('⏰ Checking interview reminders...');
    try {
      const now = new Date();

      const jobs = await TrackedJob.find({
        status: 'interviewing',
        interviewDate: { $ne: null },
      }).lean();

      for (const job of jobs) {
        const interviewDate = new Date(job.interviewDate);
        const diffMs = interviewDate - now;
        const diffHours = diffMs / (1000 * 60 * 60);

        // 24h reminder
        if (diffHours <= 25 && diffHours > 23 && !job.reminderSent24h) {
          try {
            const userRecord = await db.collection('users').doc(job.userId).get();
            const userEmail = userRecord.data()?.email;
            if (userEmail) {
              await sendInterviewReminderEmail({
                email: userEmail,
                jobTitle: job.title,
                company: job.company,
                interviewDate: interviewDate.toLocaleString(),
                hoursLeft: 24,
              });
              await TrackedJob.findByIdAndUpdate(job._id, { reminderSent24h: true });
              console.log(`✅ 24h reminder sent for job: ${job.title}`);
            }
          } catch (err) {
            console.error(`Failed to send 24h reminder for ${job._id}:`, err.message);
          }
        }

        // 1h reminder
        if (diffHours <= 1.5 && diffHours > 0.5 && !job.reminderSent1h) {
          try {
            const userRecord = await db.collection('users').doc(job.userId).get();
            const userEmail = userRecord.data()?.email;
            if (userEmail) {
              await sendInterviewReminderEmail({
                email: userEmail,
                jobTitle: job.title,
                company: job.company,
                interviewDate: interviewDate.toLocaleString(),
                hoursLeft: 1,
              });
              await TrackedJob.findByIdAndUpdate(job._id, { reminderSent1h: true });
              console.log(`✅ 1h reminder sent for job: ${job.title}`);
            }
          } catch (err) {
            console.error(`Failed to send 1h reminder for ${job._id}:`, err.message);
          }
        }
      }
    } catch (error) {
      console.error('Interview reminder cron error:', error.message);
    }
  });

  console.log('✅ Interview reminder cron initialized');
};