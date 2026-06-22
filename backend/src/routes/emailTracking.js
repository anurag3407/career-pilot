import express from 'express';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';
import {
    recordOpen,
    recordClick,
    getEmailAnalytics,
    getCampaignStats,
    TRACKING_PIXEL
} from '../services/emailTracker.js';

const router = express.Router();

/**
 * GET /api/email-tracking/open/:token
 *
 * Tracking pixel endpoint. Returns a 1x1 transparent GIF and records the open.
 * Must always respond with the pixel — errors are silently swallowed.
 */
router.get('/open/:token', asyncHandler(async (req, res) => {
    const { token } = req.params;

    // Fire-and-forget: do not await so the pixel is served immediately
    recordOpen(token).catch(err => 
        console.error('Failed to record open:', err)
    );

    res.set({
        'Content-Type': 'image/gif',
        'Content-Length': TRACKING_PIXEL.length,
        // Prevent browsers and proxies from caching the pixel
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });

    res.status(200).end(TRACKING_PIXEL);
}));

/**
 * GET /api/email-tracking/click/:token?url=<encoded-url>
 *
 * Click redirect endpoint. Logs the click then immediately redirects
 * the user to the original URL. Rejects unsafe or missing URLs.
 */
router.get('/click/:token', asyncHandler(async (req, res) => {
    const { token } = req.params;
    const rawUrl = req.query.url ? decodeURIComponent(req.query.url) : null;

    if (!rawUrl) {
        throw new ApiError(400, 'Missing url parameter');
    }

    // recordClick validates the URL and returns it (or null if unsafe)
    const safeUrl = await recordClick(token, rawUrl);

    if (!safeUrl) {
        throw new ApiError(400, 'Invalid or unsafe redirect URL');
    }

    res.redirect(302, safeUrl);
}));

/**
 * GET /api/email-tracking/analytics/:token
 *
 * Retrieve per-email analytics. Protected — internal/admin use only.
 */
router.get('/analytics/:token', verifyToken, adminOnly, asyncHandler(async (req, res) => {
    const { token } = req.params;
    const log = await getEmailAnalytics(token);

    if (!log) {
        throw new ApiError(404, 'Email log not found');
    }

    res.json({ success: true, analytics: log });
}));

/**
 * GET /api/email-tracking/campaign/:campaignId/stats
 *
 * Aggregate stats for a campaign. Protected — internal/admin use only.
 */
router.get('/campaign/:campaignId/stats', verifyToken, adminOnly, asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const stats = await getCampaignStats(campaignId);

    res.json({ success: true, stats });
}));

export default router;
