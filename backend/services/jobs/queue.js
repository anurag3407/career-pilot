// backend/services/jobs/queue.js
// BullMQ queue setup for background AI analysis jobs.

const { Queue } = require('bullmq');
const redis = require('../../config/redis');

// Queue name is "resume-analysis"
const resumeQueue = new Queue('resume-analysis', {
  connection: redis,
  // Optional settings like default job options can be added here.
});

module.exports = { resumeQueue };
