// backend/services/jobs/resumeProcessing.js
// BullMQ processor for resume analysis jobs.

const { Worker } = require('bullmq');
const { resumeQueue } = require('./queue');
const { runAnalysis } = require('../../services/aiEngine');
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

/**
 * Process a resume analysis job.
 * jobData: { pdfUrl: string, userId: string }
 */
async function processJob(job) {
  const { pdfUrl, userId } = job.data;
  try {
    const result = await runAnalysis(pdfUrl, userId);

    // Persist to Firestore under user doc
    const db = admin.firestore();
    const analysisRef = db.collection('users').doc(userId).collection('resumeAnalyses').doc();
    await analysisRef.set({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed',
      ...result,
      pdfUrl,
    });
    return { success: true, analysisId: analysisRef.id };
  } catch (err) {
    console.error('Resume analysis failed:', err);
    // Optionally store failure record
    const db = admin.firestore();
    const analysisRef = db.collection('users').doc(userId).collection('resumeAnalyses').doc();
    await analysisRef.set({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
      error: err.message,
      pdfUrl,
    });
    throw err;
  }
}

// Create a worker that listens on the queue
const worker = new Worker('resume-analysis', processJob, {
  connection: require('../../config/redis'),
});

worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed, analysisId=${result.analysisId}`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

module.exports = { worker };
