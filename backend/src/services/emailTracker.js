import { v4 as uuidv4 } from 'uuid';
import EmailLog from '../models/EmailLog.model.js';

// 1x1 transparent GIF in binary — no external dependency needed
const TRACKING_PIXEL = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
);

// Allowlist of protocols that are safe to redirect to
const SAFE_PROTOCOLS = new Set(['https:', 'http:']);

/**
 * Validate that a URL is safe to redirect to.
 * Blocks private IPs, localhost, and non-http(s) schemes.
 */
const isSafeRedirectUrl = (value) => {
    try {
        const parsed = new URL(value);

        if (!SAFE_PROTOCOLS.has(parsed.protocol)) return false;

        const hostname = parsed.hostname.toLowerCase();
        if (hostname === 'localhost' || hostname.endsWith('.local')) return false;
        if (hostname === '127.0.0.1' || hostname === '::1') return false;

        // Block RFC-1918 private ranges
        if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
            const [a, b] = hostname.split('.').map(Number);
            if (a === 10) return false;
            if (a === 127) return false;
            if (a === 169 && b === 254) return false;
            if (a === 172 && b >= 16 && b <= 31) return false;
            if (a === 192 && b === 168) return false;
        }

        return true;
    } catch {
        return false;
    }
};

/**
 * Generate a unique tracking token and persist a new EmailLog document.
 *
 * @param {object} options
 * @param {string} options.recipientEmail
 * @param {string} [options.campaignId]   - e.g. 'job-alert', 'weekly-digest'
 * @returns {Promise<string>} trackingToken
 */
export const createEmailLog = async ({ recipientEmail, campaignId = null }) => {
    const trackingToken = uuidv4();

    await EmailLog.create({
        trackingToken,
        recipientEmail,
        campaignId,
        deliveryStatus: 'sent'
    });

    return trackingToken;
};

/**
 * Build the tracking pixel <img> tag to embed in an HTML email.
 *
 * @param {string} trackingToken
 * @param {string} baseUrl - The public base URL of this backend (e.g. process.env.BACKEND_URL)
 * @returns {string} HTML img tag
 */
export const buildTrackingPixelTag = (trackingToken, baseUrl) => {
    const pixelUrl = `${baseUrl}/api/email-tracking/open/${trackingToken}`;
    // height/width and alt kept intentionally minimal so mail clients render it
    return `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:none;" />`;
};

/**
 * Wrap an outbound URL with a click-tracking redirect.
 *
 * @param {string} originalUrl
 * @param {string} trackingToken
 * @param {string} baseUrl
 * @returns {string} wrapped URL, or original URL if it is unsafe
 */
export const wrapTrackedLink = (originalUrl, trackingToken, baseUrl) => {
    if (!isSafeRedirectUrl(originalUrl)) return originalUrl;

    const encoded = encodeURIComponent(originalUrl);
    return `${baseUrl}/api/email-tracking/click/${trackingToken}?url=${encoded}`;
};

/**
 * Record an email open event.
 * Called by the tracking pixel endpoint — must never throw so the pixel always responds.
 *
 * @param {string} trackingToken
 */
export const recordOpen = async (trackingToken) => {
    try {
        const now = new Date();

        await EmailLog.findOneAndUpdate(
            { trackingToken },
            {
                $inc: { openCount: 1 },
                $set: { lastOpenedAt: now },
                // Only set firstOpenedAt on the very first open
                $setOnInsert: {},
            },
            { new: false }
        );

        // Set firstOpenedAt only once
        await EmailLog.updateOne(
            { trackingToken, firstOpenedAt: null },
            { $set: { firstOpenedAt: now } }
        );
    } catch (err) {
        console.error(`[emailTracker] recordOpen error for token ${trackingToken}:`, err.message);
    }
};

/**
 * Record a link click event and return the original URL to redirect to.
 *
 * @param {string} trackingToken
 * @param {string} rawUrl - URL from query param (not yet validated)
 * @returns {Promise<string|null>} safe original URL, or null if invalid
 */
export const recordClick = async (trackingToken, rawUrl) => {
    if (!rawUrl || !isSafeRedirectUrl(rawUrl)) return null;

    try {
        const now = new Date();

        await EmailLog.findOneAndUpdate(
            { trackingToken },
            {
                $inc: { clickCount: 1 },
                $push: { clickEvents: { url: rawUrl, clickedAt: now } }
            }
        );
    } catch (err) {
        console.error(`[emailTracker] recordClick error for token ${trackingToken}:`, err.message);
    }

    return rawUrl;
};

/**
 * Retrieve analytics data for a given tracking token.
 *
 * @param {string} trackingToken
 * @returns {Promise<object|null>}
 */
export const getEmailAnalytics = async (trackingToken) => {
    return EmailLog.findOne({ trackingToken }).lean();
};

/**
 * Aggregate summary stats for a campaign.
 *
 * @param {string} campaignId
 * @returns {Promise<object>}
 */
export const getCampaignStats = async (campaignId) => {
    const [result] = await EmailLog.aggregate([
        { $match: { campaignId } },
        {
            $group: {
                _id: '$campaignId',
                totalSent: { $sum: 1 },
                totalOpens: { $sum: '$openCount' },
                totalClicks: { $sum: '$clickCount' },
                uniqueOpens: { $sum: { $cond: [{ $gt: ['$openCount', 0] }, 1, 0] } },
                uniqueClicks: { $sum: { $cond: [{ $gt: ['$clickCount', 0] }, 1, 0] } }
            }
        }
    ]);

    return result ?? {
        _id: campaignId,
        totalSent: 0,
        totalOpens: 0,
        totalClicks: 0,
        uniqueOpens: 0,
        uniqueClicks: 0
    };
};

export { TRACKING_PIXEL, isSafeRedirectUrl };
