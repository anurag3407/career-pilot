import express from 'express';
import { 
  cloneRepo, 
  walkSourceFiles, 
  buildReactFlowGraph, 
  buildCodebaseSkeleton,
  sessions
} from '../services/repoIngestionService.js';
import { streamChat } from '../services/anthropicChatService.js';
import fs from 'fs/promises';
import path from 'path';
import { verifyToken } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import rateLimit from 'express-rate-limit';
import RepoAnalysisHistory from '../models/RepoAnalysisHistory.model.js';

const ingestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 repositories per hour per IP
  message: { error: 'Too many repositories ingested from this IP, please try again after an hour' }
});

const fileReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 file reads per 15 minutes per IP
  message: { error: 'Too many file read requests from this IP, please try again later' }
});

const router = express.Router();

router.post('/ingest', verifyToken, ingestLimiter, async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });

    const { sessionId, tempDir } = await cloneRepo(repoUrl);
    const files = await walkSourceFiles(tempDir);
    
    const { nodes, edges } = await buildReactFlowGraph(files, tempDir);
    const skeleton = await buildCodebaseSkeleton(files, tempDir);
    
    sessions.set(sessionId, { repoPath: tempDir, skeleton });

    await RepoAnalysisHistory.findOneAndUpdate(
      { userId: req.user.uid, repoUrl },
      { lastAnalyzed: new Date() },
      { upsert: true, new: true }
    );
    
    setTimeout(async () => {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
        sessions.delete(sessionId);
      } catch (e) {
        console.error(`Failed to cleanup session ${sessionId}`, e);
      }
    }, 60 * 60 * 1000);

    res.json({ sessionId, nodes, edges });
  } catch (error) {
    console.error('Ingestion Error:', error);
    res.status(500).json({ error: 'Failed to ingest repository' });
  }
});

router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await RepoAnalysisHistory.find({ userId: req.user.uid })
      .sort({ lastAnalyzed: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    console.error('History Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.get('/file-content', verifyToken, fileReadLimiter, async (req, res) => {
  try {
    const { sessionId, filePath } = req.query;
    if (!sessionId || !filePath) return res.status(400).json({ error: 'sessionId and filePath are required' });
    
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found or expired' });
    
    const normalizedPath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(session.repoPath, normalizedPath);
    
    if (!absolutePath.startsWith(session.repoPath)) {
      return res.status(403).json({ error: 'Invalid file path' });
    }
    
    const content = await fs.readFile(absolutePath, 'utf-8');
    res.setHeader('Content-Type', 'text/plain');
    res.send(content);
  } catch (error) {
    console.error('File Read Error:', error);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

router.post('/chat', verifyToken, aiRateLimiter, async (req, res) => {
  try {
    const { sessionId, messages, isInterviewMode } = req.body;
    
    if (!sessionId || !messages) return res.status(400).json({ error: 'sessionId and messages are required' });
    
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found or expired' });
    
    await streamChat(session.skeleton, messages, isInterviewMode, res);
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

export default router;
