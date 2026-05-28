import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
    CaptchaHandler,
    normalizeProxyList,
    parseProxyUrl
} from '../captchaHandler.js';

describe('CaptchaHandler detection', () => {
    test('detects reCAPTCHA and extracts site key from HTML', () => {
        const handler = new CaptchaHandler();
        const detection = handler.detectFromHtml(`
            <html>
                <div class="g-recaptcha" data-sitekey="site-key-123"></div>
                <p>Please verify you are human.</p>
            </html>
        `, { source: 'test', url: 'https://example.com/jobs' });

        assert.equal(detection.detected, true);
        assert.equal(detection.type, 'recaptcha');
        assert.equal(detection.siteKey, 'site-key-123');
        assert.equal(detection.source, 'test');
    });

    test('detects Cloudflare challenge text on blocked responses', () => {
        const handler = new CaptchaHandler();
        const detection = handler.detectFromResponse({
            status: 403,
            headers: { 'content-type': 'text/html' },
            data: '<title>Just a moment...</title><h1>Checking your browser before accessing</h1>'
        });

        assert.equal(detection.detected, true);
        assert.equal(detection.type, 'cloudflare');
        assert.ok(detection.indicators.includes('http-403'));
    });

    test('does not flag regular job listing HTML', () => {
        const handler = new CaptchaHandler();
        const detection = handler.detectFromHtml('<article><h2>Backend Engineer</h2><a href="/apply">Apply</a></article>');

        assert.equal(detection.detected, false);
        assert.equal(detection.confidence, 0);
    });

    test('does not scan JSON API payloads for generic CAPTCHA words', () => {
        const handler = new CaptchaHandler();
        const detection = handler.detectFromResponse({
            status: 200,
            headers: { 'content-type': 'application/json' },
            data: { message: 'captcha settings updated successfully' }
        });

        assert.equal(detection.detected, false);
        assert.equal(detection.confidence, 0);
    });

    test('still scans text responses where CAPTCHA pages are normally served', () => {
        const handler = new CaptchaHandler();
        const detection = handler.detectFromResponse({
            status: 403,
            headers: { 'content-type': 'text/plain' },
            data: 'Attention Required. Please complete the captcha.'
        });

        assert.equal(detection.detected, true);
        assert.equal(detection.type, 'cloudflare');
    });
});

describe('CaptchaHandler proxy helpers', () => {
    test('normalizes comma separated proxy lists', () => {
        assert.deepEqual(
            normalizeProxyList('http://one:8080, https://two:8443 ,,'),
            ['http://one:8080', 'https://two:8443']
        );
    });

    test('parses authenticated proxy URLs', () => {
        assert.deepEqual(parseProxyUrl('http://user:pass@proxy.local:8080'), {
            protocol: 'http',
            host: 'proxy.local',
            port: 8080,
            username: 'user',
            password: 'pass'
        });
    });

    test('rotates proxies by attempt', () => {
        const handler = new CaptchaHandler();
        const proxies = ['http://one:8080', 'http://two:8080'];

        assert.equal(handler.getProxyForAttempt(proxies, 0), 'http://one:8080');
        assert.equal(handler.getProxyForAttempt(proxies, 1), 'http://two:8080');
        assert.equal(handler.getProxyForAttempt(proxies, 2), 'http://one:8080');
    });
});

describe('CaptchaHandler circuit breaker', () => {
    test('opens when CAPTCHA rate exceeds configured threshold', () => {
        const handler = new CaptchaHandler({
            minSamples: 3,
            maxCaptchaRate: 0.5,
            cooldownMs: 60000
        });

        handler.recordCaptcha('naukri', { type: 'generic' });
        handler.recordSuccess('naukri');
        handler.recordCaptcha('naukri', { type: 'generic' });

        const stats = handler.getStats('naukri');
        assert.equal(stats.circuitOpen, true);
        assert.equal(stats.samples, 0);
        assert.throws(() => handler.assertCanAttempt('naukri'), /circuit breaker is open/i);
    });
});

describe('CaptchaHandler browser flow accounting', () => {
    test('does not count a solved CAPTCHA as a second success sample', async () => {
        const handler = new CaptchaHandler({
            solverProvider: '2captcha',
            twoCaptchaApiKey: 'test-key'
        });
        handler.solvePageCaptcha = async () => true;

        const page = {
            url: () => 'https://example.com/jobs',
            evaluate: async (_fn, args) => {
                if (args) return null;
                return {
                    title: 'Verify',
                    url: 'https://example.com/jobs',
                    bodyText: 'Please verify you are human',
                    html: '<div class="g-recaptcha" data-sitekey="abc"></div>',
                    selectorHits: ['.g-recaptcha']
                };
            }
        };

        const result = await handler.handlePageCaptcha(page, { source: 'browser-test' });
        const stats = handler.getStats('browser-test');

        assert.equal(result.detected, true);
        assert.equal(result.solved, true);
        assert.equal(stats.samples, 1);
        assert.equal(stats.captchaCount, 1);
    });
});

describe('CaptchaHandler solver HTTP hardening', () => {
    test('fails fast on non-2xx solver responses', async () => {
        const handler = new CaptchaHandler({
            fetchImpl: async () => ({
                ok: false,
                status: 502,
                json: async () => ({})
            })
        });

        await assert.rejects(
            () => handler.fetchSolverJson('https://solver.example.test', {}, 'solver test'),
            /HTTP 502/
        );
    });
});
