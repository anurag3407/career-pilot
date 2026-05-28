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
        assert.throws(() => handler.assertCanAttempt('naukri'), /circuit breaker is open/i);
    });
});
