// backend/routes/ai.js
// API endpoints for the AI ATS & Career Intelligence Engine

const express = require('express');
const router = express.Router();
const { resumeQueue } = require('../services/jobs/queue');
const admin = require('firebase-admin');

// Ensure Firebase Admin is initialized (same as worker)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

/**
 * POST /api/ai/analyze
 * Body: { pdfUrl: string }
 * Enqueues a resume analysis job and returns the BullMQ job id.
 */
router.post('/analyze', async (req, res) => {
  try {
    const { pdfUrl } = req.body;
    const userId = req.user?.uid; // Assuming auth middleware populates req.user
    if (!pdfUrl || !userId) {
      return res.status(400).json({ success: false, message: 'Missing pdfUrl or unauthenticated.' });
    }
    const job = await resumeQueue.add('processResume', { pdfUrl, userId });
    return res.json({ success: true, jobId: job.id, status: job.state });
  } catch (err) {
    console.error('AI analyze error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/ai/analysis/:jobId
 * Retrieves the analysis result from Firestore (polling endpoint).
 */
router.get('/analysis/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }
    const analysisRef = admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('resumeAnalyses')
      .doc(jobId);
    const doc = await analysisRef.get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    return res.json({ success: true, data: doc.data() });
  } catch (err) {
    console.error('AI analysis fetch error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/ai/dashboard
 * Returns the latest completed analysis for the authenticated user.
 */
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }
    const analyses = await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('resumeAnalyses')
      .where('status', '==', 'completed')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    if (analyses.empty) {
      return res.json({ success: true, data: null, message: 'No completed analyses yet.' });
    }
    const latest = analyses.docs[0].data();
    return res.json({ success: true, data: latest });
  } catch (err) {
    console.error('AI dashboard error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
