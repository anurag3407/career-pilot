import express from 'express';
import TrackedJob from '../models/TrackedJob.model.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Add timeline event to a tracked job
router.post('/:trackerId/timeline', verifyToken, async (req, res) => {
  try {
    const { status, note } = req.body;
    const job = await TrackedJob.findOneAndUpdate(
      { _id: req.params.trackerId, userId: req.user.uid },
      { $push: { timeline: { status, note, date: new Date() } } },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Set follow-up reminder
router.post('/:trackerId/reminder', verifyToken, async (req, res) => {
  try {
    const { reminderDate, reminderNote } = req.body;
    const job = await TrackedJob.findOneAndUpdate(
      { _id: req.params.trackerId, userId: req.user.uid },
      { reminderDate, reminderNote },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Set priority
router.patch('/:trackerId/priority', verifyToken, async (req, res) => {
  try {
    const { priority } = req.body; // low | medium | high
    const job = await TrackedJob.findOneAndUpdate(
      { _id: req.params.trackerId, userId: req.user.uid },
      { priority },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Set interview stage
router.patch('/:trackerId/interview-stage', verifyToken, async (req, res) => {
  try {
    const { interviewStage } = req.body; // phone | technical | hr | final | offer
    const job = await TrackedJob.findOneAndUpdate(
      { _id: req.params.trackerId, userId: req.user.uid },
      { interviewStage },
      { new: true }
    );
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Analytics summary
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const jobs = await TrackedJob.find({ userId: req.user.uid });
    const statusCounts = jobs.reduce((acc, j) => {
      acc[j.status] = (acc[j.status] || 0) + 1;
      return acc;
    }, {});
    const priorityCounts = jobs.reduce((acc, j) => {
      const p = j.priority || 'none';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});
    const upcomingReminders = jobs
      .filter(j => j.reminderDate && new Date(j.reminderDate) >= new Date())
      .sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate))
      .slice(0, 5)
      .map(j => ({ id: j._id, company: j.company, role: j.role, reminderDate: j.reminderDate, reminderNote: j.reminderNote }));
    res.json({ total: jobs.length, statusCounts, priorityCounts, upcomingReminders });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
