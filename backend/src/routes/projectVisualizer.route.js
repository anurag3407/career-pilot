import express from 'express';
import rateLimit from 'express-rate-limit';
import { verifyToken } from '../middleware/auth.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { analyzeRepo } from '../services/analysisService.js';
import { runActivityAnalyzer } from '../services/activityService.js';
import { enrichWithGitHubData } from '../services/githubEnricherService.js';
import { generateArchitectureSummary, generateSuggestions, streamChat, streamFileChat, explainFile, generateInterviewQuestions, generateContributionGuide } from '../services/anthropicChatService.js';
import ProjectAnalysis from '../models/ProjectAnalysis.model.js';
import { sessions } from '../services/repoIngestionService.js';
import fs from 'fs/promises';
import path from 'path';

const ingestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many repositories ingested from this IP, please try again after an hour' }
});

const fileReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many file read requests from this IP, please try again later' }
});

const router = express.Router();

router.post('/analyze', verifyToken, ingestLimiter, async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl || !repoUrl.includes('github.com')) {
      return res.status(400).json({ error: 'Valid GitHub repoUrl is required' });
    }

    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return res.status(400).json({ error: 'Invalid GitHub URL format' });
    
    const owner = match[1];
    const name = match[2].replace('.git', '');
    
    // Run analysis and github fetch in parallel
    const [analysisResult, githubData] = await Promise.all([
      analyzeRepo(repoUrl, req.user.uid),
      enrichWithGitHubData(owner, name)
    ]);
    
    let architectureSummary = '';
    let suggestions = [];
    
    // Generate AI summaries (non-blocking if they fail)
    try {
       const aiTasks = [
         generateArchitectureSummary(analysisResult.skeleton, analysisResult.modules),
         generateSuggestions(analysisResult.skeleton, analysisResult.risks, analysisResult.modules)
       ];
       const [summaryResult, suggestionsResult] = await Promise.allSettled(aiTasks);
       if (summaryResult.status === 'fulfilled') architectureSummary = summaryResult.value;
       if (suggestionsResult.status === 'fulfilled') suggestions = suggestionsResult.value;
    } catch (e) {
       console.warn('AI Generation failed during analyze:', e);
    }
    
    const analysisDoc = {
      userId: req.user.uid,
      repoUrl,
      repoName: name,
      repoOwner: owner,
      sessionId: analysisResult.sessionId,
      status: 'complete',
      stats: analysisResult.stats,
      modules: analysisResult.modules,
      fileGraph: analysisResult.fileGraph,
      moduleGraph: analysisResult.moduleGraph,
      risks: analysisResult.risks,
      suggestions: suggestions,
      architectureSummary: architectureSummary,
      github: githubData.metadata,
      dependencies: analysisResult.dependencies,
      lastAnalyzed: new Date(),
    };
    
    // Save to DB
    await ProjectAnalysis.findOneAndUpdate(
      { userId: req.user.uid, repoUrl },
      analysisDoc,
      { upsert: true, new: true }
    );
    
    // Store github dynamic data in session for fast retrieval during this session
    const session = sessions.get(analysisResult.sessionId);
    if (session) {
       session.githubData = githubData;
    }
    
    // Setup cleanup
    setTimeout(async () => {
      try {
        const sessionToClean = sessions.get(analysisResult.sessionId);
        if (sessionToClean && sessionToClean.repoPath) {
           await fs.rm(sessionToClean.repoPath, { recursive: true, force: true });
        }
        sessions.delete(analysisResult.sessionId);
      } catch (e) {
        console.error(`Failed to cleanup session ${analysisResult.sessionId}`, e);
      }
    }, 2 * 60 * 60 * 1000); // 2 hours
    
    res.json({
       ...analysisDoc,
       contributors: githubData.contributors,
       commits: githubData.recentCommits
    });
    
  } catch (error) {
    console.error('Analyze Error:', error);
    res.status(500).json({ error: 'Failed to analyze repository: ' + error.message });
  }
});

router.get('/analysis/:sessionId', verifyToken, async (req, res) => {
  try {
    const analysis = await ProjectAnalysis.findOne({ sessionId: req.params.sessionId });
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    
    // Check if user owns it
    if (analysis.userId !== req.user.uid) return res.status(403).json({ error: 'Access denied' });
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
});

router.get('/analysis/:sessionId/file', verifyToken, fileReadLimiter, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { path: filePath } = req.query;
    
    if (!filePath) return res.status(400).json({ error: 'path is required' });
    
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
    res.status(500).json({ error: 'Failed to read file' });
  }
});

router.get('/analysis/:sessionId/contributors', verifyToken, async (req, res) => {
  try {
    const session = sessions.get(req.params.sessionId);
    if (session && session.githubData && session.githubData.contributors) {
      return res.json(session.githubData.contributors);
    }
    
    const analysis = await ProjectAnalysis.findOne({ sessionId: req.params.sessionId });
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    
    // Fetch fresh
    const githubData = await enrichWithGitHubData(analysis.repoOwner, analysis.repoName);
    res.json(githubData.contributors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contributors' });
  }
});

router.get('/analysis/:sessionId/commits', verifyToken, async (req, res) => {
  try {
    const session = sessions.get(req.params.sessionId);
    if (session && session.githubData && session.githubData.recentCommits) {
      return res.json(session.githubData.recentCommits);
    }
    
    const analysis = await ProjectAnalysis.findOne({ sessionId: req.params.sessionId });
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    
    const githubData = await enrichWithGitHubData(analysis.repoOwner, analysis.repoName);
    res.json(githubData.recentCommits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
});

router.post('/analysis/:sessionId/chat', verifyToken, aiRateLimiter, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { messages, chatMode } = req.body;
    
    if (!messages) return res.status(400).json({ error: 'messages are required' });
    
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found or expired' });
    
    await streamChat(session.skeleton, messages, chatMode, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

router.post('/analysis/:sessionId/ask-module', verifyToken, aiRateLimiter, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { modulePath, question } = req.body;
    
    if (!modulePath || !question) return res.status(400).json({ error: 'modulePath and question are required' });
    
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found or expired' });
    
    const mod = session.modules.find(m => m.path === modulePath);
    if (!mod) return res.status(404).json({ error: 'Module not found in session' });
    
    // Create focused context
    const context = `I am asking about the module '${mod.name}' at path '${mod.path}'. It contains ${mod.fileCount} files. Please answer: ${question}`;
    
    const messages = [{ role: 'user', content: context }];
    
    await streamChat(session.skeleton, messages, 'onboarding', res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process module question' });
  }
});

router.post('/analysis/:sessionId/explain-file', verifyToken, aiRateLimiter, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { filePath } = req.body;
    if (!filePath) return res.status(400).json({ error: 'filePath is required' });
    
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found or expired' });
    
    const absolutePath = path.join(session.repoPath, filePath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    
    const explanation = await explainFile(content, filePath);
    res.json(explanation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to explain file' });
  }
});

router.post('/analysis/:sessionId/file-chat', verifyToken, aiRateLimiter, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { filePath, messages } = req.body;
    if (!filePath || !messages) return res.status(400).json({ error: 'filePath and messages are required' });
    
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found or expired' });
    
    const absolutePath = path.join(session.repoPath, filePath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    
    await streamFileChat(content, filePath, session.skeleton, messages, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process file chat' });
  }
});

router.post('/analysis/:sessionId/interview-prep', verifyToken, aiRateLimiter, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found or expired' });
    
    const analysis = await ProjectAnalysis.findOne({ sessionId });
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    
    const questions = await generateInterviewQuestions(session.skeleton, session.modules, analysis.risks);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

router.post('/analysis/:sessionId/contribution-guide', verifyToken, aiRateLimiter, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found or expired' });
    
    const analysis = await ProjectAnalysis.findOne({ sessionId });
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    
    let readmeContent = 'No README found.';
    try {
      readmeContent = await fs.readFile(path.join(session.repoPath, 'README.md'), 'utf-8');
    } catch(e) {}
    
    const guide = await generateContributionGuide(session.skeleton, readmeContent, session.modules, analysis.github);
    res.json({ guide });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate contribution guide' });
  }
});

router.get('/analysis/:sessionId/activity', verifyToken, aiRateLimiter, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const detail = req.query.detail === '1' || req.query.detail === 'true';

    // Confirm the session belongs to the requesting user.
    const analysis = await ProjectAnalysis.findOne({ sessionId });
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    if (analysis.userId !== req.user.uid) return res.status(403).json({ error: 'Access denied' });

    // The cloned repo lives in a temp dir for ~2 hours; read from there.
    const session = sessions.get(sessionId);
    if (!session || !session.repoPath) {
      return res.status(410).json({
        error: 'Repository files are no longer available. Please re-run the analysis.',
      });
    }

    // Allow per-request override of the AI provider (mirrors the
    // X-AI-Provider / X-AI-Key / X-AI-Model headers used elsewhere).
    const provider = req.headers['x-ai-provider'] || req.query.provider || undefined;
    const apiKey = req.headers['x-ai-key'] || req.query.apiKey || undefined;
    const model = req.headers['x-ai-model'] || req.query.model || undefined;

    const payload = await runActivityAnalyzer(session.repoPath, {
      provider,
      apiKey,
      model,
      weeks: 52,
      detail,
    });

    res.json(payload);
  } catch (error) {
    console.error('Activity Error:', error);
    res.status(500).json({ error: 'Failed to compute activity: ' + error.message });
  }
});

router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await ProjectAnalysis.find({ userId: req.user.uid })
      .select('-fileGraph -moduleGraph -architectureSummary') // exclude large fields
      .sort({ lastAnalyzed: -1 })
      .limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.delete('/history/:id', verifyToken, async (req, res) => {
  try {
    await ProjectAnalysis.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete history' });
  }
});

export default router;
