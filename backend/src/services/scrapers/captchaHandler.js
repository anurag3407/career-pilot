const DEFAULT_CAPTCHA_WINDOW_MS = 10 * 60 * 1000;
const DEFAULT_CAPTCHA_MAX_RATE = 0.4;
const DEFAULT_CAPTCHA_MIN_SAMPLES = 5;
const DEFAULT_CAPTCHA_COOLDOWN_MS = 5 * 60 * 1000;
const DEFAULT_SOLVER_POLL_MS = 5000;
const DEFAULT_SOLVER_TIMEOUT_MS = 120000;
const DEFAULT_SOLVER_REQUEST_TIMEOUT_MS = 15000;

const CAPTCHA_PATTERNS = [
    { type: 'recaptcha', pattern: /g-recaptcha|google\.com\/recaptcha|grecaptcha|recaptcha/i, weight: 0.95 },
    { type: 'hcaptcha', pattern: /h-captcha|hcaptcha\.com|data-hcaptcha|hcaptcha/i, weight: 0.95 },
    { type: 'turnstile', pattern: /cf-turnstile|challenges\.cloudflare\.com\/turnstile|turnstile/i, weight: 0.95 },
    { type: 'cloudflare', pattern: /just a moment|attention required|checking your browser|cloudflare|cf-browser-verification/i, weight: 0.9 },
    { type: 'generic', pattern: /captcha|verify you are human|human verification|i'?m not a robot|robot check|security check/i, weight: 0.85 },
    { type: 'generic', pattern: /unusual traffic|automated queries|access to this page has been denied|bot detection/i, weight: 0.8 }
];

export class CaptchaDetectedError extends Error {
    constructor(message = 'CAPTCHA challenge detected during scraping.', detection = {}) {
        super(message);
        this.name = 'CaptchaDetectedError';
        this.code = 'CAPTCHA_DETECTED';
        this.retryable = true;
        this.captchaDetection = detection;
    }
}

export class CaptchaCircuitOpenError extends Error {
    constructor(message = 'CAPTCHA circuit breaker is open for this scraper.', stats = {}) {
        super(message);
        this.name = 'CaptchaCircuitOpenError';
        this.code = 'CAPTCHA_CIRCUIT_OPEN';
        this.retryable = false;
        this.stats = stats;
    }
}

const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
    if (value === undefined || value === null || value === '') return fallback;
    return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const normalizeWhitespace = (value = '') => String(value).replace(/\s+/g, ' ').trim();

export const normalizeProxyList = (proxies) => {
    const source = Array.isArray(proxies) ? proxies : String(proxies || '').split(',');
    return source.map(proxy => String(proxy).trim()).filter(Boolean);
};

export const parseProxyUrl = (proxyUrl) => {
    if (!proxyUrl) return null;

    try {
        const url = new URL(proxyUrl);
        return {
            protocol: url.protocol.replace(':', '') || 'http',
            host: url.hostname,
            port: Number(url.port) || (url.protocol === 'https:' ? 443 : 80),
            username: decodeURIComponent(url.username || ''),
            password: decodeURIComponent(url.password || '')
        };
    } catch (_error) {
        return null;
    }
};

export class CaptchaHandler {
    constructor(options = {}) {
        this.options = {
            windowMs: toNumber(options.windowMs ?? process.env.CAPTCHA_CIRCUIT_WINDOW_MS, DEFAULT_CAPTCHA_WINDOW_MS),
            maxCaptchaRate: toNumber(options.maxCaptchaRate ?? process.env.CAPTCHA_CIRCUIT_MAX_RATE, DEFAULT_CAPTCHA_MAX_RATE),
            minSamples: toNumber(options.minSamples ?? process.env.CAPTCHA_CIRCUIT_MIN_SAMPLES, DEFAULT_CAPTCHA_MIN_SAMPLES),
            cooldownMs: toNumber(options.cooldownMs ?? process.env.CAPTCHA_CIRCUIT_COOLDOWN_MS, DEFAULT_CAPTCHA_COOLDOWN_MS),
            solverProvider: options.solverProvider ?? process.env.CAPTCHA_SOLVER_PROVIDER ?? '',
            twoCaptchaApiKey: options.twoCaptchaApiKey ?? process.env.TWO_CAPTCHA_API_KEY ?? '',
            antiCaptchaApiKey: options.antiCaptchaApiKey ?? process.env.ANTI_CAPTCHA_API_KEY ?? '',
            solverPollMs: toNumber(options.solverPollMs ?? process.env.CAPTCHA_SOLVER_POLL_MS, DEFAULT_SOLVER_POLL_MS),
            solverTimeoutMs: toNumber(options.solverTimeoutMs ?? process.env.CAPTCHA_SOLVER_TIMEOUT_MS, DEFAULT_SOLVER_TIMEOUT_MS),
            solverRequestTimeoutMs: toNumber(
                options.solverRequestTimeoutMs ?? process.env.CAPTCHA_SOLVER_REQUEST_TIMEOUT_MS,
                DEFAULT_SOLVER_REQUEST_TIMEOUT_MS
            ),
            submitAfterSolve: toBoolean(options.submitAfterSolve ?? process.env.CAPTCHA_SUBMIT_AFTER_SOLVE, false),
            enabled: options.enabled ?? true,
            fetchImpl: options.fetchImpl ?? globalThis.fetch
        };

        this.eventsBySource = new Map();
        this.openCircuits = new Map();
    }

    getProxyCandidates(proxies) {
        return normalizeProxyList(proxies ?? process.env.SCRAPER_PROXIES);
    }

    getProxyForAttempt(proxies, attempt = 0, excludeProxy = '') {
        const candidates = this.getProxyCandidates(proxies).filter(proxy => proxy !== excludeProxy);
        if (candidates.length === 0) return null;
        return candidates[attempt % candidates.length];
    }

    toAxiosProxy(proxyUrl) {
        const parsed = parseProxyUrl(proxyUrl);
        if (!parsed) return undefined;

        const proxy = {
            protocol: parsed.protocol,
            host: parsed.host,
            port: parsed.port
        };

        if (parsed.username || parsed.password) {
            proxy.auth = {
                username: parsed.username,
                password: parsed.password
            };
        }

        return proxy;
    }

    toPuppeteerProxy(proxyUrl) {
        const parsed = parseProxyUrl(proxyUrl);
        if (!parsed) return null;

        return {
            server: `${parsed.protocol}://${parsed.host}:${parsed.port}`,
            username: parsed.username,
            password: parsed.password
        };
    }

    isCircuitOpen(source = 'default') {
        const now = Date.now();
        const openUntil = this.openCircuits.get(source);

        if (!openUntil) return false;
        if (openUntil <= now) {
            this.openCircuits.delete(source);
            return false;
        }

        return true;
    }

    assertCanAttempt(source = 'default') {
        if (!this.options.enabled) return;

        if (this.isCircuitOpen(source)) {
            throw new CaptchaCircuitOpenError(
                `CAPTCHA circuit breaker is open for "${source}". Scraping is cooling down before another attempt.`,
                this.getStats(source)
            );
        }
    }

    recordSuccess(source = 'default') {
        this.recordResult(source, false);
    }

    recordCaptcha(source = 'default', detection = {}) {
        this.recordResult(source, true, detection);
    }

    recordResult(source = 'default', captchaDetected = false, detection = {}) {
        if (!this.options.enabled) return;

        const now = Date.now();
        const events = this.eventsBySource.get(source) || [];
        events.push({ timestamp: now, captchaDetected: Boolean(captchaDetected), detection });

        const cutoff = now - this.options.windowMs;
        const recentEvents = events.filter(event => event.timestamp >= cutoff);
        this.eventsBySource.set(source, recentEvents);

        const stats = this.getStats(source);
        if (
            stats.samples >= this.options.minSamples &&
            stats.captchaRate >= this.options.maxCaptchaRate
        ) {
            this.openCircuits.set(source, now + this.options.cooldownMs);
            this.eventsBySource.set(source, []);
        }
    }

    getStats(source = 'default') {
        const now = Date.now();
        const cutoff = now - this.options.windowMs;
        const events = (this.eventsBySource.get(source) || []).filter(event => event.timestamp >= cutoff);
        this.eventsBySource.set(source, events);

        const captchaCount = events.filter(event => event.captchaDetected).length;
        return {
            source,
            samples: events.length,
            captchaCount,
            captchaRate: events.length ? captchaCount / events.length : 0,
            circuitOpen: this.isCircuitOpen(source),
            openUntil: this.openCircuits.get(source) || null
        };
    }

    detectFromResponse(response, context = {}) {
        const status = response?.status ?? response?.statusCode;
        const headers = response?.headers || {};
        const contentType = String(headers['content-type'] || headers['Content-Type'] || '').toLowerCase();
        const url = context.url || response?.config?.url || response?.url || '';

        if (!this.shouldScanResponseBody(contentType, response?.data)) {
            return this.emptyDetection({ ...context, status, contentType, url });
        }

        const body = typeof response?.data === 'string' ? response.data : '';

        return this.detectFromHtml(body, {
            ...context,
            status,
            contentType,
            url
        });
    }

    detectFromError(error, context = {}) {
        if (error instanceof CaptchaDetectedError) {
            return error.captchaDetection || { detected: true, type: 'generic', confidence: 1, indicators: ['captcha-error'] };
        }

        if (error?.response) {
            return this.detectFromResponse(error.response, context);
        }

        return this.detectFromHtml(error?.message || '', context);
    }

    detectFromHtml(html = '', context = {}) {
        const content = normalizeWhitespace(html).slice(0, 250000);
        const indicators = [];
        const matchedTypes = new Map();

        for (const { type, pattern, weight } of CAPTCHA_PATTERNS) {
            if (pattern.test(content)) {
                indicators.push(pattern.source);
                matchedTypes.set(type, Math.max(matchedTypes.get(type) || 0, weight));
            }
        }

        const siteKey = this.extractSiteKey(content);
        if (siteKey) {
            indicators.push('site-key');
            const likelyType = this.inferCaptchaType(content);
            matchedTypes.set(likelyType, Math.max(matchedTypes.get(likelyType) || 0, 0.95));
        }

        const status = Number(context.status);
        if ((status === 403 || status === 429) && matchedTypes.size > 0) {
            indicators.push(`http-${status}`);
        }

        if (matchedTypes.size === 0) {
            return this.emptyDetection(context);
        }

        const [type, confidence] = Array.from(matchedTypes.entries()).sort((a, b) => b[1] - a[1])[0];
        return {
            detected: true,
            type,
            confidence,
            indicators: Array.from(new Set(indicators)),
            siteKey,
            url: context.url || '',
            source: context.source || '',
            status: Number.isFinite(status) ? status : undefined
        };
    }

    shouldScanResponseBody(contentType = '', data = '') {
        const normalizedContentType = String(contentType).toLowerCase();

        if (normalizedContentType.includes('json')) return false;
        if (typeof data !== 'string' || !data.trim()) return false;

        return (
            !normalizedContentType ||
            normalizedContentType.includes('text/html') ||
            normalizedContentType.includes('application/xhtml+xml') ||
            normalizedContentType.includes('text/plain') ||
            normalizedContentType.startsWith('text/')
        );
    }

    emptyDetection(context = {}) {
        const status = Number(context.status);
        return {
            detected: false,
            type: null,
            confidence: 0,
            indicators: [],
            siteKey: null,
            url: context.url || '',
            source: context.source || '',
            ...(Number.isFinite(status) ? { status } : {}),
            ...(context.contentType ? { contentType: context.contentType } : {})
        };
    }

    async detectFromPage(page, context = {}) {
        const pageSignals = await page.evaluate(() => {
            const selectors = [
                '.g-recaptcha',
                '[data-sitekey]',
                'iframe[src*="recaptcha"]',
                'iframe[src*="hcaptcha"]',
                '.h-captcha',
                '.cf-turnstile',
                'input[name="cf-turnstile-response"]',
                'textarea[name="g-recaptcha-response"]',
                'textarea[name="h-captcha-response"]'
            ];

            const selectorHits = selectors.filter(selector => document.querySelector(selector));
            return {
                title: document.title || '',
                url: window.location.href,
                bodyText: document.body?.innerText?.slice(0, 50000) || '',
                html: document.documentElement?.innerHTML?.slice(0, 100000) || '',
                selectorHits
            };
        });

        const detection = this.detectFromHtml(
            `${pageSignals.title} ${pageSignals.bodyText} ${pageSignals.html}`,
            { ...context, url: context.url || pageSignals.url }
        );

        if (pageSignals.selectorHits.length > 0) {
            detection.detected = true;
            detection.confidence = Math.max(detection.confidence, 0.95);
            detection.indicators = Array.from(new Set([...detection.indicators, ...pageSignals.selectorHits]));
            detection.type = detection.type || this.inferCaptchaType(pageSignals.selectorHits.join(' '));
        }

        return detection;
    }

    async handlePageCaptcha(page, context = {}) {
        const detection = await this.detectFromPage(page, context);
        if (!detection.detected) {
            this.recordSuccess(context.source || 'default');
            return { detected: false, solved: false, detection };
        }

        this.recordCaptcha(context.source || 'default', detection);

        if (!this.isSolverConfigured()) {
            throw new CaptchaDetectedError('CAPTCHA challenge detected and no solver is configured.', detection);
        }

        const solved = await this.solvePageCaptcha(page, detection, context);
        if (!solved) {
            throw new CaptchaDetectedError('CAPTCHA challenge detected but could not be solved.', detection);
        }

        return { detected: true, solved: true, detection };
    }

    isSolverConfigured() {
        const provider = this.options.solverProvider.toLowerCase();
        return (
            (provider === '2captcha' && Boolean(this.options.twoCaptchaApiKey)) ||
            (provider === 'anti-captcha' && Boolean(this.options.antiCaptchaApiKey))
        );
    }

    async solvePageCaptcha(page, detection, context = {}) {
        if (!['recaptcha', 'hcaptcha', 'turnstile'].includes(detection.type) || !detection.siteKey) {
            return false;
        }

        const pageUrl = detection.url || context.url || page.url();
        const token = await this.requestSolverToken({
            type: detection.type,
            siteKey: detection.siteKey,
            pageUrl
        });

        if (!token) return false;

        await page.evaluate(({ type, tokenValue }) => {
            const fieldNames = {
                recaptcha: 'g-recaptcha-response',
                hcaptcha: 'h-captcha-response',
                turnstile: 'cf-turnstile-response'
            };
            const fieldName = fieldNames[type];
            const selectors = [
                `textarea[name="${fieldName}"]`,
                `input[name="${fieldName}"]`
            ];

            let target = selectors.map(selector => document.querySelector(selector)).find(Boolean);
            if (!target) {
                target = document.createElement(type === 'turnstile' ? 'input' : 'textarea');
                target.name = fieldName;
                target.style.display = 'none';
                document.body.appendChild(target);
            }

            target.value = tokenValue;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            target.dispatchEvent(new Event('change', { bubbles: true }));
        }, { type: detection.type, tokenValue: token });

        if (this.options.submitAfterSolve) {
            await page.evaluate(() => {
                const form = document.querySelector('form');
                if (form?.requestSubmit) form.requestSubmit();
                else if (form) form.submit();
            });
        }

        return true;
    }

    async requestSolverToken({ type, siteKey, pageUrl }) {
        const provider = this.options.solverProvider.toLowerCase();
        if (provider === '2captcha') {
            return this.requestTwoCaptchaToken({ type, siteKey, pageUrl });
        }
        if (provider === 'anti-captcha') {
            return this.requestAntiCaptchaToken({ type, siteKey, pageUrl });
        }
        return null;
    }

    async requestTwoCaptchaToken({ type, siteKey, pageUrl }) {
        const fetchImpl = this.options.fetchImpl;
        if (!fetchImpl || !this.options.twoCaptchaApiKey) return null;

        const methodByType = {
            recaptcha: 'userrecaptcha',
            hcaptcha: 'hcaptcha',
            turnstile: 'turnstile'
        };

        const params = new URLSearchParams({
            key: this.options.twoCaptchaApiKey,
            method: methodByType[type],
            googlekey: siteKey,
            sitekey: siteKey,
            pageurl: pageUrl,
            json: '1'
        });

        const createPayload = await this.fetchSolverJson(`https://2captcha.com/in.php?${params.toString()}`, {}, '2captcha create task');
        if (createPayload.status !== 1 || !createPayload.request) {
            throw new Error(`2captcha rejected CAPTCHA task: ${createPayload.request || 'unknown error'}`);
        }

        return this.pollTwoCaptcha(createPayload.request);
    }

    async pollTwoCaptcha(taskId) {
        const startedAt = Date.now();

        while (Date.now() - startedAt < this.options.solverTimeoutMs) {
            await this.sleep(this.options.solverPollMs);
            const params = new URLSearchParams({
                key: this.options.twoCaptchaApiKey,
                action: 'get',
                id: taskId,
                json: '1'
            });
            const payload = await this.fetchSolverJson(`https://2captcha.com/res.php?${params.toString()}`, {}, '2captcha poll task');

            if (payload.status === 1) return payload.request;
            if (payload.request !== 'CAPCHA_NOT_READY') {
                throw new Error(`2captcha failed CAPTCHA task: ${payload.request || 'unknown error'}`);
            }
        }

        throw new Error('2captcha CAPTCHA task timed out.');
    }

    async requestAntiCaptchaToken({ type, siteKey, pageUrl }) {
        const fetchImpl = this.options.fetchImpl;
        if (!fetchImpl || !this.options.antiCaptchaApiKey) return null;

        const taskTypeByCaptcha = {
            recaptcha: 'NoCaptchaTaskProxyless',
            hcaptcha: 'HCaptchaTaskProxyless',
            turnstile: 'TurnstileTaskProxyless'
        };

        const createPayload = await this.fetchSolverJson('https://api.anti-captcha.com/createTask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientKey: this.options.antiCaptchaApiKey,
                task: {
                    type: taskTypeByCaptcha[type],
                    websiteURL: pageUrl,
                    websiteKey: siteKey
                }
            })
        }, 'anti-captcha create task');
        if (createPayload.errorId !== 0 || !createPayload.taskId) {
            throw new Error(`anti-captcha rejected CAPTCHA task: ${createPayload.errorDescription || 'unknown error'}`);
        }

        return this.pollAntiCaptcha(createPayload.taskId);
    }

    async pollAntiCaptcha(taskId) {
        const startedAt = Date.now();

        while (Date.now() - startedAt < this.options.solverTimeoutMs) {
            await this.sleep(this.options.solverPollMs);
            const payload = await this.fetchSolverJson('https://api.anti-captcha.com/getTaskResult', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientKey: this.options.antiCaptchaApiKey,
                    taskId
                })
            }, 'anti-captcha poll task');

            if (payload.errorId && payload.errorId !== 0) {
                throw new Error(`anti-captcha failed CAPTCHA task: ${payload.errorDescription || 'unknown error'}`);
            }
            if (payload.status === 'ready') {
                return payload.solution?.gRecaptchaResponse || payload.solution?.token || null;
            }
        }

        throw new Error('anti-captcha CAPTCHA task timed out.');
    }

    async fetchSolverJson(url, options = {}, label = 'CAPTCHA solver request') {
        const fetchImpl = this.options.fetchImpl;
        if (!fetchImpl) {
            throw new Error('No fetch implementation is available for CAPTCHA solver requests.');
        }

        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeout = controller
            ? setTimeout(() => controller.abort(), this.options.solverRequestTimeoutMs)
            : null;

        try {
            const response = await fetchImpl(url, {
                ...options,
                ...(controller ? { signal: controller.signal } : {})
            });

            if (response && 'ok' in response && !response.ok) {
                throw new Error(`${label} failed with HTTP ${response.status || 'error'}.`);
            }

            return response.json();
        } catch (error) {
            if (error?.name === 'AbortError') {
                throw new Error(`${label} timed out after ${this.options.solverRequestTimeoutMs}ms.`);
            }
            throw error;
        } finally {
            if (timeout) clearTimeout(timeout);
        }
    }

    extractSiteKey(content = '') {
        const patterns = [
            /data-sitekey=["']([^"']+)["']/i,
            /sitekey["']?\s*[:=]\s*["']([^"']+)["']/i,
            /render=([A-Za-z0-9_-]{20,})/i
        ];

        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match?.[1]) return match[1];
        }

        return null;
    }

    inferCaptchaType(content = '') {
        if (/hcaptcha|h-captcha/i.test(content)) return 'hcaptcha';
        if (/turnstile|cf-turnstile/i.test(content)) return 'turnstile';
        if (/recaptcha|g-recaptcha|google\.com\/recaptcha/i.test(content)) return 'recaptcha';
        if (/cloudflare|just a moment|attention required/i.test(content)) return 'cloudflare';
        return 'generic';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const captchaHandler = new CaptchaHandler();
export default captchaHandler;
