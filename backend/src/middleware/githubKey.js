import GithubToken from '../models/GithubToken.model.js';

/**
 * GitHub token resolution middleware.
 *
 * Token resolution order (highest priority first):
 *   1. X-GitHub-Token header (BYOK PAT from the client)
 *   2. OAuth token stored on the authenticated user (GithubToken model)
 *   3. process.env.GITHUB_TOKEN (server fallback)
 *   4. null (unauthenticated — 60 req/hr per IP)
 *
 * On success: req.githubToken = "<plaintext token>" and req.githubAuthMode
 * is one of 'pat' | 'oauth' | 'env' | 'public'.
 *
 * Note: This middleware does NOT enforce a token. Endpoints that allow
 * public access should still call this so they can use env/null fallback.
 */
export const extractGithubToken = async (req, res, next) => {
  try {
    const headerToken = req.headers['x-github-token'];
    if (headerToken) {
      req.githubToken = String(headerToken).trim();
      req.githubAuthMode = 'pat';
      return next();
    }

    // OAuth: only if user is authenticated
    if (req.user?.uid) {
      const record = await GithubToken.findOne({
        userId: req.user.uid,
        provider: 'github-oauth-app',
      }).lean();
      if (record) {
        try {
          const plaintext = GithubToken.decryptToken(record);
          req.githubToken = plaintext;
          req.githubAuthMode = 'oauth';
          // Best-effort lastUsedAt bump
          GithubToken.updateOne(
            { _id: record._id },
            { $set: { lastUsedAt: new Date() } }
          ).catch(() => {});
          return next();
        } catch (decryptErr) {
          console.error('[githubKey] Failed to decrypt stored OAuth token:', decryptErr.message);
          // fall through to env
        }
      }
    }

    if (process.env.GITHUB_TOKEN) {
      req.githubToken = process.env.GITHUB_TOKEN;
      req.githubAuthMode = 'env';
      return next();
    }

    req.githubToken = null;
    req.githubAuthMode = 'public';
    return next();
  } catch (error) {
    console.error('[githubKey] middleware error:', error.message);
    return res.status(500).json({
      success: false,
      error: `Failed to resolve GitHub credentials: ${error.message}`,
    });
  }
};

/**
 * Strict variant — rejects the request with 403 if no token is available.
 * Use this on routes that hit GitHub APIs requiring authentication (e.g.
 * listing private repos).
 */
export const requireGithubToken = (req, res, next) => {
  extractGithubToken(req, res, () => {
    if (!req.githubToken) {
      return res.status(403).json({
        success: false,
        error: 'A GitHub token is required for this endpoint. Add one in Settings.',
        requireGithubToken: true,
      });
    }
    next();
  });
};