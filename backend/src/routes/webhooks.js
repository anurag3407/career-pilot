import express from 'express';
import crypto from 'crypto';
import ProjectAnalysis from '../models/ProjectAnalysis.model.js';
import RepoAnalysisHistory from '../models/RepoAnalysisHistory.model.js';
import socketConfig from '../config/socket.js';
import { analyzeRepo as originalAnalyzeRepo } from '../services/analysisService.js';
import { enrichWithGitHubData as originalEnrichWithGitHubData } from '../services/githubEnricherService.js';
import { generateArchitectureSummary as originalGenerateArchitectureSummary, generateSuggestions as originalGenerateSuggestions } from '../services/anthropicChatService.js';

export const services = {
  analyzeRepo: originalAnalyzeRepo,
  enrichWithGitHubData: originalEnrichWithGitHubData,
  generateArchitectureSummary: originalGenerateArchitectureSummary,
  generateSuggestions: originalGenerateSuggestions
};

const router = express.Router();

/**
 * Escapes regex metacharacters in a user-controlled string to prevent regex injection.
 */
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Validates the GitHub x-hub-signature-256 header using HMAC-SHA256.
 * Checks against the local GITHUB_WEBHOOK_SECRET environment variable.
 */
const verifySignature = (req) => {
  const signature = req.headers['x-hub-signature-256'];
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  // Fail closed in production if secret is not set, allow bypass only in dev/test
  if (!secret) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.warn('⚠️ GITHUB_WEBHOOK_SECRET is not configured. Skipping signature verification (dev/test only).');
      return true;
    }
    console.error('❌ GITHUB_WEBHOOK_SECRET is not configured. Rejecting webhook request.');
    return false;
  }

  if (!signature) {
    return false;
  }

  const elements = signature.split('=');
  if (elements.length !== 2 || elements[0] !== 'sha256') {
    return false;
  }

  const signatureHash = elements[1];
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(req.rawBody || '')
    .digest('hex');

  try {
    const signatureBuffer = Buffer.from(signatureHash, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    // timingSafeEqual requires buffers to be of equal length to prevent timing attacks
    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (e) {
    return false;
  }
};

router.post('/github', async (req, res) => {
  try {
    if (!verifySignature(req)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.headers['x-github-event'];
    if (!event) {
      return res.status(400).json({ error: 'Missing x-github-event header' });
    }

    if (event === 'ping') {
      return res.json({ success: true, message: 'pong' });
    }

    if (event !== 'push') {
      return res.json({ success: true, message: `Event ${event} ignored` });
    }

    const payload = req.body;
    if (!payload || !payload.repository) {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    // Extract repository URL (normalize to lowercase, without trailing slash)
    const repoUrl = payload.repository.html_url || payload.repository.clone_url;
    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL not found in payload' });
    }

    const normalizedRepoUrl = repoUrl.trim().replace(/\/$/, '').toLowerCase();
    const escapedRepoUrl = escapeRegExp(normalizedRepoUrl);

    // Query for all active analysis files matching this repo url (exact, with .git suffix, or stripped)
    const analyses = await ProjectAnalysis.find({
      $or: [
        { repoUrl: repoUrl },
        { repoUrl: repoUrl + '.git' },
        { repoUrl: repoUrl.replace(/\/$/, '') },
        { repoUrl: { $regex: new RegExp(`^${escapedRepoUrl}(\\.git)?$`, 'i') } }
      ]
    });

    if (analyses.length === 0) {
      return res.json({ success: true, message: 'No active analysis found for this repository' });
    }

    // Immediately respond to GitHub to prevent timeouts
    res.status(202).json({
      success: true,
      message: `Sync triggered for ${analyses.length} user analysis records`
    });

    // Run scans asynchronously in the background for each matching analysis record
    for (const analysis of analyses) {
      const userId = analysis.userId;

      // Background process wrapped in immediate execution
      (async () => {
        try {
          // Perform the initial database status update inside the async block for per-record isolation
          analysis.status = 'analyzing';
          try {
            await analysis.save();
          } catch (saveErr) {
            console.error(`❌ Failed to save initial status 'analyzing' for user ${userId}:`, saveErr);
          }

          // Broadcast start of scan
          try {
            const io = socketConfig.getIO();
            io.to(`user:${userId}`).emit('repo_updated', {
              repoUrl: analysis.repoUrl,
              status: 'analyzing',
              message: 'GitHub push detected, auto-scanning repository...'
            });
          } catch (err) {
            console.warn(`Failed to emit socket status for user ${userId}:`, err.message);
          }

          console.log(`🚀 Auto-scan started in background for user ${userId} on ${analysis.repoUrl}`);
          
          const match = analysis.repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
          if (!match) throw new Error('Invalid GitHub URL format');
          
          const owner = match[1];
          const name = match[2].replace('.git', '');

          // Run scan & retrieve github metadata
          const [analysisResult, githubData] = await Promise.all([
            services.analyzeRepo(analysis.repoUrl, userId),
            services.enrichWithGitHubData(owner, name)
          ]);

          let architectureSummary = '';
          let suggestions = [];

          // Generate AI Architecture Summary & Code Suggestions (Optional/non-blocking)
          try {
            const aiTasks = [
              services.generateArchitectureSummary(analysisResult.skeleton, analysisResult.modules),
              services.generateSuggestions(analysisResult.skeleton, analysisResult.risks, analysisResult.modules)
            ];
            const [summaryResult, suggestionsResult] = await Promise.allSettled(aiTasks);
            if (summaryResult.status === 'fulfilled') architectureSummary = summaryResult.value;
            if (suggestionsResult.status === 'fulfilled') suggestions = suggestionsResult.value;
          } catch (aiErr) {
            console.warn('⚠️ AI Ingest helpers failed during background webhook auto-scan:', aiErr);
          }

          // Update ProjectAnalysis details
          analysis.status = 'complete';
          analysis.stats = analysisResult.stats;
          analysis.modules = analysisResult.modules;
          analysis.fileGraph = analysisResult.fileGraph;
          analysis.moduleGraph = analysisResult.moduleGraph;
          analysis.risks = analysisResult.risks;
          analysis.suggestions = suggestions;
          analysis.architectureSummary = architectureSummary;
          analysis.github = githubData.metadata;
          analysis.dependencies = analysisResult.dependencies;
          analysis.lastAnalyzed = new Date();
          analysis.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Refresh analysis document expiration TTL
          
          try {
            await analysis.save();
          } catch (saveErr) {
            console.error(`❌ Failed to save final status 'complete' for user ${userId}:`, saveErr);
          }

          // Upsert entry in user's RepoAnalysisHistory
          try {
            await RepoAnalysisHistory.findOneAndUpdate(
              { userId, repoUrl: analysis.repoUrl },
              { lastAnalyzed: new Date() },
              { upsert: true }
            );
          } catch (historyErr) {
            console.error(`❌ Failed to update RepoAnalysisHistory for user ${userId}:`, historyErr);
          }

          // Broadcast success status
          try {
            const io = socketConfig.getIO();
            io.to(`user:${userId}`).emit('repo_updated', {
              repoUrl: analysis.repoUrl,
              status: 'complete',
              message: 'Auto-scan complete, visualization updated.',
              analysisId: analysis._id
            });
          } catch (err) {
            console.warn(`Failed to emit socket completion for user ${userId}:`, err.message);
          }
          
          console.log(`✅ Auto-scan finished successfully for user ${userId} on ${analysis.repoUrl}`);
        } catch (error) {
          console.error(`❌ Auto-scan failed for user ${userId} on ${analysis.repoUrl}:`, error);

          try {
            analysis.status = 'failed';
            await analysis.save();
          } catch (saveErr) {
            console.error(`❌ Failed to save final status 'failed' for user ${userId}:`, saveErr);
          }

          // Broadcast failure status
          try {
            const io = socketConfig.getIO();
            io.to(`user:${userId}`).emit('repo_updated', {
              repoUrl: analysis.repoUrl,
              status: 'failed',
              message: `Auto-scan failed: ${error.message}`
            });
          } catch (err) {
            console.warn(`Failed to emit socket error for user ${userId}:`, err.message);
          }
        }
      })();
    }
  } catch (error) {
    console.error('Webhook Endpoint Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
