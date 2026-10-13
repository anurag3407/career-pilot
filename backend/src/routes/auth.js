import express from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import { saveUserToAppwrite } from '../services/appwriteDataService.js';
import { validate } from '../middleware/validate.js';
import { updateNotificationPrefsSchema } from '../schemas/auth.schema.js';
import User from '../models/User.model.js';
import GithubToken from '../models/GithubToken.model.js';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// GitHub OAuth App (portfolio + private repos)
// ---------------------------------------------------------------------------
const githubExchangeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const GITHUB_OAUTH_SCOPES = 'read:user repo';
const getGithubAuthUrl = (state) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    throw new Error('GITHUB_CLIENT_ID is not configured');
  }
  const redirectUri =
    process.env.GITHUB_OAUTH_REDIRECT_URI ||
    `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/auth/github/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: GITHUB_OAUTH_SCOPES,
    state,
    allow_signup: 'true',
  });
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
};

const exchangeGithubCode = async (code) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth client credentials are not configured');
  }
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });
  if (!response.ok) {
    throw new Error(`GitHub token exchange failed: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
  }
  return data;
};

const fetchGithubUser = async (accessToken) => {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Career-Pilot-Backend',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user: ${response.statusText}`);
  }
  return response.json();
};

const router = express.Router();
const githubStateStore = new Map();

// Periodic sweep of expired store entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [state, entry] of githubStateStore.entries()) {
    if (now > entry.expiresAt) githubStateStore.delete(state);
  }
}, 10 * 60 * 1000).unref();

// Verify token endpoint
router.post('/verify', verifyToken, asyncHandler(async (req, res) => {
  // Sync user to MongoDB if not exists
  try {
    let mongoUser = await User.findOne({ email: req.user.email });
    if (!mongoUser) {
      mongoUser = await User.create({
        email: req.user.email,
        username: req.user.name,
        password: crypto.randomBytes(32).toString('hex') // dummy password
      });
    }
  } catch (error) {
    console.warn('Could not sync user to MongoDB:', error.message);
  }

  // Save/update user in Appwrite on each verification
  try {
    await saveUserToAppwrite(req.user);
  } catch (error) {
    console.warn('Could not save user to Appwrite:', error.message);
  }

  res.json({
    success: true,
    user: req.user
  });
}));

// Get user profile
router.get('/profile', verifyToken, asyncHandler(async (req, res) => {
  // Update last login in Appwrite
  try {
    await saveUserToAppwrite(req.user);
  } catch (error) {
    console.warn('⚠️  Could not update user in Appwrite:', error.message);
  }

  res.json({
    success: true,
    user: req.user
  });
}));

// Get notification preferences
router.get('/notification-preferences', verifyToken, asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  const preferences = user?.notificationPreferences || {
    jobAlerts: true,
    directMessages: true,
    proposalUpdates: true,
  };

  res.json({ success: true, preferences });
}));

// Update notification preferences
router.put('/notification-preferences', verifyToken, validate(updateNotificationPrefsSchema), asyncHandler(async (req, res) => {
  const { jobAlerts, directMessages, proposalUpdates } = req.body;

  await User.findOneAndUpdate(
    { email: req.user.email },
    { notificationPreferences: { jobAlerts, directMessages, proposalUpdates } },
    { new: true, upsert: true }
  );

  res.json({ success: true, message: 'Preferences updated!' });
}));


// =============================================================================
// GitHub OAuth
// =============================================================================

router.post('/github/start', verifyToken, asyncHandler(async (req, res) => {
  const state = crypto.randomBytes(24).toString('hex');
  githubStateStore.set(state, {
    userId: req.user.uid,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  try {
    const authUrl = getGithubAuthUrl(state);
    res.json({ success: true, authUrl, state });
  } catch (err) {
    throw new ApiError(500, err.message);
  }
}));

router.get('/github/callback', githubExchangeLimiter, asyncHandler(async (req, res) => {
  const { code, state, error } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  if (error) {
    console.error('GitHub OAuth error from provider:', error);
    return res.redirect(`${frontendUrl}/auth/github/callback?error=${encodeURIComponent(String(error))}`);
  }

  const stored = githubStateStore.get(String(state));
  if (!stored || Date.now() > stored.expiresAt) {
    githubStateStore.delete(state);
    return res.redirect(`${frontendUrl}/auth/github/callback?error=invalid_state`);
  }
  githubStateStore.delete(state);
  const { userId } = stored;

  let tokenData;
  try {
    tokenData = await exchangeGithubCode(String(code));
  } catch (err) {
    console.error('GitHub token exchange failed:', err.message);
    return res.redirect(`${frontendUrl}/auth/github/callback?error=token_failed`);
  }

  const accessToken = tokenData.access_token;
  if (!accessToken) {
    return res.redirect(`${frontendUrl}/auth/github/callback?error=no_access_token`);
  }

  let profile;
  try {
    profile = await fetchGithubUser(accessToken);
  } catch (err) {
    console.error('Failed to fetch GitHub user:', err.message);
    return res.redirect(`${frontendUrl}/auth/github/callback?error=profile_failed`);
  }

  // Encrypt and store at rest
  const encrypted = GithubToken.encryptToken(accessToken);
  await GithubToken.findOneAndUpdate(
    { userId, provider: 'github-oauth-app' },
    {
      ...encrypted,
      scopes: tokenData.scope || GITHUB_OAUTH_SCOPES,
      githubLogin: profile.login,
      lastUsedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.redirect(
    `${frontendUrl}/auth/github/callback?success=1&login=${encodeURIComponent(profile.login)}`
  );
}));

// Disconnect
router.delete('/github/disconnect', verifyToken, asyncHandler(async (req, res) => {
  const result = await GithubToken.deleteOne({
    userId: req.user.uid,
    provider: 'github-oauth-app',
  });
  res.json({ success: true, deleted: result.deletedCount > 0 });
}));

// Inspect connection status
router.get('/github/status', verifyToken, asyncHandler(async (req, res) => {
  const record = await GithubToken.findOne({
    userId: req.user.uid,
    provider: 'github-oauth-app',
  })
    .select('githubLogin scopes lastUsedAt createdAt updatedAt')
    .lean();

  if (!record) {
    return res.json({ success: true, connected: false });
  }
  res.json({
    success: true,
    connected: true,
    githubLogin: record.githubLogin,
    scopes: record.scopes,
    lastUsedAt: record.lastUsedAt,
    connectedAt: record.createdAt,
  });
}));

export default router;