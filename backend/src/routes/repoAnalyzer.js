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

const router = express.Router();

router.post('/ingest', verifyToken, async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });

    const { sessionId, tempDir } = await cloneRepo(repoUrl);
    const files = await walkSourceFiles(tempDir);
    
    const { nodes, edges } = await buildReactFlowGraph(files, tempDir);
    const skeleton = await buildCodebaseSkeleton(files, tempDir);
    
    sessions.set(sessionId, { repoPath: tempDir, skeleton });
    
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

router.get('/file-content', verifyToken, async (req, res) => {
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

router.post('/chat', verifyToken, async (req, res) => {
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
