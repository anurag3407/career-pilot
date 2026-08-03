import express from 'express';
import crypto from 'crypto';
import ResumeShare from '../models/ResumeShare.model.js';
import ResumeComment from '../models/ResumeComment.model.js';
import Resume from '../models/Resume.model.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/resumes/:resumeId/share', verifyToken, async (req, res) => {
  try {
    const { expiresInDays } = req.body;
    const shareToken = crypto.randomBytes(24).toString('hex');
    const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 86400000) : null;
    const share = await ResumeShare.findOneAndUpdate(
      { resumeId: req.params.resumeId, ownerId: req.user.uid },
      { shareToken, isActive: true, expiresAt },
      { upsert: true, new: true }
    );
    res.json({ shareToken: share.shareToken, expiresAt: share.expiresAt });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/shared/:shareToken', async (req, res) => {
  try {
    const share = await ResumeShare.findOne({ shareToken: req.params.shareToken, isActive: true });
    if (!share) return res.status(404).json({ error: 'Share link not found or revoked' });
    if (share.expiresAt && share.expiresAt < new Date()) return res.status(410).json({ error: 'Share link expired' });
    const resume = await Resume.findById(share.resumeId);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ resume, role: 'commenter' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/shared/:shareToken/comments', async (req, res) => {
  try {
    const { section, text, authorEmail, authorName } = req.body;
    const share = await ResumeShare.findOne({ shareToken: req.params.shareToken, isActive: true });
    if (!share) return res.status(403).json({ error: 'Invalid share token' });
    const comment = await ResumeComment.create({
      resumeId: share.resumeId, shareToken: req.params.shareToken,
      section, text, authorEmail, authorName
    });
    res.status(201).json(comment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/shared/:shareToken/comments', async (req, res) => {
  try {
    const share = await ResumeShare.findOne({ shareToken: req.params.shareToken, isActive: true });
    if (!share) return res.status(403).json({ error: 'Invalid share token' });
    const comments = await ResumeComment.find({ shareToken: req.params.shareToken }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/resumes/:resumeId/comments', verifyToken, async (req, res) => {
  try {
    const comments = await ResumeComment.find({ resumeId: req.params.resumeId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/comments/:commentId/resolve', verifyToken, async (req, res) => {
  try {
    const { resolved } = req.body;
    const comment = await ResumeComment.findByIdAndUpdate(
      req.params.commentId,
      { resolved, resolvedBy: resolved ? req.user.email : null, resolvedAt: resolved ? new Date() : null },
      { new: true }
    );
    res.json(comment);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/resumes/:resumeId/share', verifyToken, async (req, res) => {
  try {
    await ResumeShare.findOneAndUpdate(
      { resumeId: req.params.resumeId, ownerId: req.user.uid },
      { isActive: false }
    );
    res.json({ message: 'Share link revoked' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
