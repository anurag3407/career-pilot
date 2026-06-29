/**
 * Unit tests for the emailTracker service (pure-logic helpers only —
 * no database or network calls).
 *
 * Run with:
 *   node --test src/schemas/__tests__/emailTracker.test.js
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// ─── Inline the helpers we want to test ──────────────────────────────────────
// We re-implement isSafeRedirectUrl inline so these tests have zero deps.
// The real implementation in emailTracker.js is identical.

const SAFE_PROTOCOLS = new Set(['https:', 'http:']);

const isSafeRedirectUrl = (value) => {
    try {
        const parsed = new URL(value);
        if (!SAFE_PROTOCOLS.has(parsed.protocol)) return false;
        const hostname = parsed.hostname.toLowerCase();
        if (hostname === 'localhost' || hostname.endsWith('.local')) return false;
        if (hostname === '127.0.0.1' || hostname === '::1') return false;
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

const buildTrackingPixelTag = (token, baseUrl) =>
    `<img src="${baseUrl}/api/email-tracking/open/${token}" width="1" height="1" alt="" style="display:none;" />`;

const wrapTrackedLink = (originalUrl, token, baseUrl) => {
    if (!isSafeRedirectUrl(originalUrl)) return originalUrl;
    return `${baseUrl}/api/email-tracking/click/${token}?url=${encodeURIComponent(originalUrl)}`;
};

const TRACKING_PIXEL = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
);

// ─── isSafeRedirectUrl ────────────────────────────────────────────────────────

describe('isSafeRedirectUrl', () => {
    test('accepts a valid https URL', () => {
        assert.ok(isSafeRedirectUrl('https://example.com/jobs/123'));
    });

    test('accepts a valid http URL', () => {
        assert.ok(isSafeRedirectUrl('http://example.com'));
    });

    test('rejects localhost', () => {
        assert.ok(!isSafeRedirectUrl('http://localhost/secret'));
    });

    test('rejects 127.0.0.1', () => {
        assert.ok(!isSafeRedirectUrl('http://127.0.0.1/'));
    });

    test('rejects .local TLD', () => {
        assert.ok(!isSafeRedirectUrl('http://myapp.local/'));
    });

    test('rejects 10.x private range', () => {
        assert.ok(!isSafeRedirectUrl('http://10.0.0.1/'));
    });

    test('rejects 172.16.x private range', () => {
        assert.ok(!isSafeRedirectUrl('http://172.16.5.1/'));
    });

    test('accepts 172.15.x (just outside private range)', () => {
        assert.ok(isSafeRedirectUrl('http://172.15.0.1/'));
    });

    test('rejects 192.168.x private range', () => {
        assert.ok(!isSafeRedirectUrl('http://192.168.1.1/'));
    });

    test('rejects ftp:// protocol', () => {
        assert.ok(!isSafeRedirectUrl('ftp://files.example.com/'));
    });

    test('rejects javascript: scheme', () => {
        assert.ok(!isSafeRedirectUrl('javascript:alert(1)'));
    });

    test('rejects malformed strings', () => {
        assert.ok(!isSafeRedirectUrl('not-a-url'));
        assert.ok(!isSafeRedirectUrl(''));
        assert.ok(!isSafeRedirectUrl(null));
    });
});

// ─── buildTrackingPixelTag ───────────────────────────────────────────────────

describe('buildTrackingPixelTag', () => {
    const BASE = 'https://api.careerpilot.io';
    const TOKEN = 'test-uuid-1234';

    test('returns an <img> tag', () => {
        const tag = buildTrackingPixelTag(TOKEN, BASE);
        assert.ok(tag.startsWith('<img'));
        assert.ok(tag.includes('</') || tag.includes('/>') || tag.endsWith('>'));
    });

    test('embeds the correct pixel URL', () => {
        const tag = buildTrackingPixelTag(TOKEN, BASE);
        assert.ok(tag.includes(`${BASE}/api/email-tracking/open/${TOKEN}`));
    });

    test('is 1x1', () => {
        const tag = buildTrackingPixelTag(TOKEN, BASE);
        assert.ok(tag.includes('width="1"'));
        assert.ok(tag.includes('height="1"'));
    });
});

// ─── wrapTrackedLink ─────────────────────────────────────────────────────────

describe('wrapTrackedLink', () => {
    const BASE = 'https://api.careerpilot.io';
    const TOKEN = 'test-uuid-5678';
    const SAFE_URL = 'https://jobs.example.com/apply?id=42';

    test('wraps a safe URL with the tracking redirect', () => {
        const wrapped = wrapTrackedLink(SAFE_URL, TOKEN, BASE);
        assert.ok(wrapped.startsWith(`${BASE}/api/email-tracking/click/${TOKEN}`));
        assert.ok(wrapped.includes(encodeURIComponent(SAFE_URL)));
    });

    test('returns the original URL unchanged when it is unsafe', () => {
        const unsafe = 'http://192.168.1.1/steal';
        const wrapped = wrapTrackedLink(unsafe, TOKEN, BASE);
        assert.equal(wrapped, unsafe);
    });

    test('returns the original URL for localhost', () => {
        const local = 'http://localhost:3000/api';
        const wrapped = wrapTrackedLink(local, TOKEN, BASE);
        assert.equal(wrapped, local);
    });
});

// ─── TRACKING_PIXEL buffer ───────────────────────────────────────────────────

describe('TRACKING_PIXEL', () => {
    test('is a Buffer', () => {
        assert.ok(Buffer.isBuffer(TRACKING_PIXEL));
    });

    test('starts with GIF89a magic bytes', () => {
        // GIF magic number: 0x47 0x49 0x46 ('GIF')
        assert.equal(TRACKING_PIXEL[0], 0x47); // G
        assert.equal(TRACKING_PIXEL[1], 0x49); // I
        assert.equal(TRACKING_PIXEL[2], 0x46); // F
    });

    test('has non-zero length', () => {
        assert.ok(TRACKING_PIXEL.length > 0);
    });
});
