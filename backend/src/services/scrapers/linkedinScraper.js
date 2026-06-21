import crypto from 'crypto';
import path from 'path';
import os from 'os';
import puppeteer from 'puppeteer';
import { BaseScraper } from './BaseScraper.js';

/**
 * LinkedIn Public Job Scraper
 * ----------------------------
 * Scrapes publicly accessible LinkedIn job listings without requiring authentication.
 * Targets LinkedIn's public job search pages which are accessible without login.
 *
 * Features:
 *  Anti-detection stealth hooks (webdriver flag bypass, realistic UA rotation)
 *  Auto-scrolling to trigger lazy-loaded job cards
 *  Salary range parsing from LinkedIn's structured data
 *  Employment type detection (Full-time, Part-time, Contract, Internship)
 *  Remote/On-site/Hybrid work type detection
 *  Optional deep detail page parsing for full job descriptions
 *  Relative and absolute posted date parsing
 *  Skills extraction from job detail pages
 *
 * Note: LinkedIn frequently updates its DOM structure. Selectors are written
 * with multiple fallbacks to remain resilient across changes.
 */
export class LinkedInScraper extends BaseScraper {
    /**
     * @param {Object} [options={}] - Scraper configuration options
     * @param {boolean|'new'} [options.headless='new'] - Puppeteer headless mode
     * @param {boolean} [options.fetchFullDetails=false] - Visit individual job pages for full description & skills
     * @param {number} [options.maxFullDetails=5] - Max detail pages to fetch per run (to avoid rate limits)
     * @param {number} [options.maxJobs=25] - Maximum job cards to extract per search run
     * @param {number} [options.scrollAttempts=5] - How many scroll steps to perform for lazy loading
     */
    constructor(options = {}) {
        // Registry identifier: 'linkedin'
        super('linkedin', options);

        this.baseUrl = 'https://www.linkedin.com/jobs/search';
    }

    /**
     * Builds the LinkedIn public job search URL from search parameters.
     * LinkedIn public search accepts: keywords, location, f_WT (work type), f_JT (job type).
     *
     * @param {Object} searchParams
     * @param {string} searchParams.query - Job title or keyword
     * @param {string} [searchParams.location=''] - City, country, or 'Worldwide'
     * @param {boolean} [searchParams.remoteOnly=false] - Filter for remote jobs
     * @param {string} [searchParams.employmentType=''] - 'F' (Full-time), 'P' (Part-time), 'C' (Contract), 'I' (Internship)
     * @returns {string} Complete search URL
     */
    buildSearchUrl(searchParams) {
        const { query, location = '', remoteOnly = false, employmentType = '' } = searchParams;

        const params = new URLSearchParams({
            keywords: query,
            location: location || 'Worldwide',
            // start=0 for the first page of results
            start: '0',
            // sortBy: R = Relevance, DD = Date Posted
            sortBy: 'DD',
        });

        // f_WT: Work type filter — 2 = Remote, 1 = On-site, 3 = Hybrid
        if (remoteOnly) {
            params.set('f_WT', '2');
        }

        // f_JT: Employment type filter
        if (employmentType) {
            params.set('f_JT', employmentType);
        }

        return `${this.baseUrl}?${params.toString()}`;
    }

    /**
     * Launches Puppeteer, applies stealth measures, navigates to the LinkedIn
     * public job search page, auto-scrolls, and extracts raw job card data.
     *
     * @param {Object} searchParams - Search parameters (query, location, etc.)
     * @returns {Promise<Array<Object>>} Raw extracted job objects from the page
     */
    async fetchRawData(searchParams) {
        const { query } = searchParams;

        if (!query || !query.trim()) {
            throw new Error('LinkedIn scraper requires a non-empty search query.');
        }

        const searchUrl = this.buildSearchUrl(searchParams);
        this.log(`Launching Puppeteer for LinkedIn public search: "${query}"`);

        const launchArgs = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1366,768',
        ];

        const browser = await puppeteer.launch({
            headless: this.options.headless ?? 'new',
            args: launchArgs,
            ...this.options.launchConfig,
        });

        const page = await browser.newPage();

        try {
            // --- Stealth configuration ---
            await page.setUserAgent(this.generateUserAgent());
            await page.setViewport({ width: 1366, height: 768 });

            // Bypass `navigator.webdriver` flag used by bot-detection scripts
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                // Also spoof plugins length to look like a real browser
                Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
                Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
            });

            // Set extra HTTP headers to mimic a real browser session
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            });

            // Navigate to LinkedIn public job search
            this.log(`Navigating to: ${searchUrl}`);
            await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 40000 });

            // Wait for job cards to appear — LinkedIn public pages use these selectors
            try {
                await page.waitForSelector(
                    '.jobs-search__results-list li, .base-card, ul.jobs-search__results-list > li',
                    { timeout: 15000 }
                );
            } catch (waitErr) {
                // Capture error state for debugging
                const screenshotPath = path.join(os.tmpdir(), 'linkedin_error.png');
                await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => { });
                this.log(`Debug screenshot saved to: ${screenshotPath}`, 'warn');
                const title = await page.title();

                this.log(`Job cards not found. Page title: "${title}"`, 'warn');

                if (title.toLowerCase().includes('authwall') || title.toLowerCase().includes('sign in')) {
                    throw new Error('LinkedIn auth wall encountered — public job search redirected to login.');
                }
                if (title.toLowerCase().includes('just a moment') || title.toLowerCase().includes('cloudflare')) {
                    throw new Error('LinkedIn bot challenge triggered (Cloudflare/CAPTCHA).');
                }
                throw new Error(`LinkedIn job cards failed to render: ${waitErr.message}. Page: "${title}"`);
            }

            // --- Auto-scroll to trigger lazy-loaded cards ---
            const scrollAttempts = this.options.scrollAttempts ?? 5;
            const maxJobs = this.options.maxJobs ?? 25;
            this.log(`Scrolling page (${scrollAttempts} steps) to lazy-load all job cards...`);

            await page.evaluate(async ({ scrollAttempts, maxJobs }) => {
                await new Promise((resolve) => {
                    let attempts = 0;
                    let lastCount = 0;
                    let stagnant = 0;

                    const timer = setInterval(() => {
                        window.scrollBy(0, 600);
                        attempts++;

                        const count = document.querySelectorAll(
                            '.jobs-search__results-list li, .base-card'
                        ).length;

                        if (count > lastCount) {
                            lastCount = count;
                            stagnant = 0;
                        } else {
                            stagnant++;
                        }

                        // Stop if we have enough jobs, page is no longer loading new cards, or max scrolls hit
                        if (count >= maxJobs || stagnant >= 4 || attempts >= scrollAttempts * 3) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 400);
                });
            }, { scrollAttempts, maxJobs });

            // Brief pause to allow any final DOM renders
            await this.sleep(800);

            // --- Primary raw data extraction from job cards ---
            this.log('Extracting job card data from DOM...');
            const extractedRawJobs = await page.evaluate((maxJobs) => {
                /**
                 * Helper: safely reads text content from a selector within a root element.
                 * Returns empty string if not found.
                 */
                const getText = (root, ...selectors) => {
                    for (const sel of selectors) {
                        const el = root.querySelector(sel);
                        if (el && el.textContent) return el.textContent.trim();
                    }
                    return '';
                };

                /**
                 * Helper: safely reads an attribute from the first matching selector.
                 */
                const getAttr = (root, attr, ...selectors) => {
                    for (const sel of selectors) {
                        const el = root.querySelector(sel);
                        if (el && el.getAttribute(attr)) return el.getAttribute(attr).trim();
                    }
                    return '';
                };

                const cards = document.querySelectorAll(
                    '.jobs-search__results-list li, ul.jobs-search__results-list > li'
                );

                const list = [];

                cards.forEach((card) => {
                    if (list.length >= maxJobs) return;

                    try {
                        // --- Title & Apply Link ---
                        const titleEl = card.querySelector(
                            'h3.base-search-card__title, .job-search-card__title, h3 a, a.base-card__full-link'
                        );
                        const title = titleEl ? titleEl.textContent.trim() : '';

                        // Prefer the full-link anchor for the apply URL
                        const linkEl = card.querySelector(
                            'a.base-card__full-link, a.job-search-card__link-wrapper, h3 a'
                        );
                        const applyLink = linkEl ? linkEl.href : '';

                        // Extract job ID from URL (LinkedIn format: /jobs/view/JOBID/)
                        let externalId = '';
                        if (applyLink) {
                            const match = applyLink.match(/\/jobs\/view\/(\d+)/);
                            if (match) externalId = `li-${match[1]}`;
                        }
                        // Fallback to data-entity-urn attribute
                        if (!externalId) {
                            const urn = card.getAttribute('data-entity-urn') || '';
                            const urnMatch = urn.match(/:(\d+)$/);
                            if (urnMatch) externalId = `li-${urnMatch[1]}`;
                        }

                        // --- Company ---
                        const company = getText(
                            card,
                            'h4.base-search-card__subtitle a',
                            'h4.base-search-card__subtitle',
                            '.job-search-card__company-name',
                            'a.hidden-nested-link'
                        );

                        // --- Company Logo ---
                        const companyLogo = getAttr(
                            card,
                            'src',
                            'img.artdeco-entity-image',
                            'img.search-entity-media'
                        );

                        // --- Location ---
                        const location = getText(
                            card,
                            '.job-search-card__location',
                            'span.job-search-card__location',
                            '.base-search-card__metadata span'
                        );

                        // --- Posted Date string ---
                        const postedStr = getAttr(card, 'datetime', 'time') ||
                            getText(card, 'time', '.job-search-card__listdate', '.listed-time-ago');

                        // --- Salary (sometimes shown on the card itself) ---
                        const salaryStr = getText(
                            card,
                            '.job-search-card__salary-info',
                            '.base-search-card__metadata .salary'
                        );

                        // --- Employment type badge (e.g. "Full-time", "Internship") ---
                        const employmentTypeStr = getText(
                            card,
                            '.job-search-card__benefits',
                            '.base-search-card__metadata li'
                        );

                        if (!title || !applyLink) return; // Skip malformed cards

                        list.push({
                            externalId,
                            title,
                            company,
                            companyLogo: companyLogo || null,
                            location,
                            applyLink,
                            postedStr,
                            salaryStr,
                            employmentTypeStr,
                            // These will be populated during optional deep-fetch
                            description: '',
                            descriptionSnippet: '',
                            skills: [],
                        });
                    } catch (_) {
                        // Suppress individual card errors — malformed cards are skipped silently
                    }
                });

                return list;
            }, maxJobs);

            this.log(`Card extraction complete. Found ${extractedRawJobs.length} job cards.`);

            // --- Optional: Deep detail page fetching ---
            const fetchFullDetails = this.options.fetchFullDetails ?? false;
            if (fetchFullDetails && extractedRawJobs.length > 0) {
                const maxFullDetails = this.options.maxFullDetails ?? 5;
                this.log(`Deep detail mode ENABLED. Fetching up to ${maxFullDetails} job detail pages...`);

                for (let i = 0; i < Math.min(extractedRawJobs.length, maxFullDetails); i++) {
                    const job = extractedRawJobs[i];
                    if (!job.applyLink) continue;

                    try {
                        this.log(`Fetching detail page for: "${job.title}" @ ${job.company}`);
                        await page.goto(job.applyLink, { waitUntil: 'networkidle2', timeout: 25000 });

                        // Wait for the description container
                        await page.waitForSelector(
                            '.show-more-less-html__markup, .description__text, .jobs-description-content__text',
                            { timeout: 8000 }
                        ).catch(() => { });

                        const details = await page.evaluate(() => {
                            // Full description HTML
                            const descEl = document.querySelector(
                                '.show-more-less-html__markup, .description__text, .jobs-description-content__text'
                            );
                            const description = descEl ? descEl.innerHTML.trim() : '';

                            // Plain text snippet (first ~300 chars of text content)
                            const descriptionSnippet = descEl
                                ? (descEl.textContent || '').trim().slice(0, 300)
                                : '';

                            // Skills — LinkedIn sometimes shows a "Skills" section on detail pages
                            const skillEls = document.querySelectorAll(
                                '.job-details-skill-match-status-list li, .skills-section li, [data-test-id="skill"] span'
                            );
                            const skills = [];
                            skillEls.forEach((el) => {
                                const txt = el.textContent ? el.textContent.trim() : '';
                                if (txt) skills.push(txt);
                            });

                            // Salary from detail page (more reliable than listing card)
                            const salaryDetailEl = document.querySelector(
                                '.compensation__salary, .salary-main-rail__formatted-salary, .job-details-jobs-unified-top-card__job-insight--highlight'
                            );
                            const salaryStr = salaryDetailEl ? salaryDetailEl.textContent.trim() : '';

                            // Employment type from criteria list
                            const criteriaEls = document.querySelectorAll(
                                '.description__job-criteria-item, .job-details-jobs-unified-top-card__job-insight'
                            );
                            let employmentType = '';
                            criteriaEls.forEach((el) => {
                                const header = el.querySelector('h3, .description__job-criteria-subheader');
                                const value = el.querySelector('span, .description__job-criteria-text');
                                if (header && value) {
                                    const headerText = header.textContent.toLowerCase();
                                    if (headerText.includes('employment type') || headerText.includes('job type')) {
                                        employmentType = value.textContent.trim();
                                    }
                                }
                            });

                            return { description, descriptionSnippet, skills, salaryStr, employmentType };
                        });

                        job.description = details.description;
                        job.descriptionSnippet = details.descriptionSnippet;
                        job.skills = details.skills;

                        if (details.salaryStr && !job.salaryStr) {
                            job.salaryStr = details.salaryStr;
                        }
                        if (details.employmentType && !job.employmentTypeStr) {
                            job.employmentTypeStr = details.employmentType;
                        }

                        // Human-like pause between detail page navigations
                        await this.sleep(1200 + (crypto.randomBytes(4).readUInt32LE() / 0xFFFFFFFF) * 800);
                    } catch (detailErr) {
                        this.log(`Skipping detail fetch for "${job.title}": ${detailErr.message}`, 'warn');
                    }
                }
            }

            return extractedRawJobs;
        } finally {
            await browser.close();
            this.log('Puppeteer browser closed.');
        }
    }

    /**
     * Parses raw extracted LinkedIn card data into the standard job schema
     * expected by BaseScraper.validateJob().
     *
     * @param {Array<Object>} rawData - Array of raw job objects from fetchRawData
     * @param {Object} searchParams - Original search parameters for context
     * @returns {Promise<Array<Object>>} Array of normalized job objects
     */
    async parse(rawData, searchParams) {
        this.log(`Parsing ${rawData?.length || 0} raw LinkedIn job records...`);

        if (!Array.isArray(rawData)) {
            return [];
        }

        return rawData.map((rawJob) => {
            // --- Stable External ID ---
            let externalId = rawJob.externalId;
            if (!externalId) {
                // Derive ID from URL as fallback
                if (rawJob.applyLink) {
                    const match = rawJob.applyLink.match(/\/jobs\/view\/(\d+)/);
                    if (match) {
                        externalId = `li-${match[1]}`;
                    } else {
                        externalId = `li-${Buffer.from(rawJob.title + rawJob.company).toString('base64').slice(0, 16)}`;
                    }
                } else {
                    externalId = `li-${Buffer.from((rawJob.title || '') + (rawJob.company || '')).toString('base64').slice(0, 16)}`;
                }
            }

            // --- Salary ---
            const salary = this.parseSalaryString(rawJob.salaryStr);

            // --- Posted Date ---
            const postedAt = this.parsePostedDate(rawJob.postedStr);

            // --- Employment Type ---
            const employmentType = this.normalizeEmploymentType(rawJob.employmentTypeStr);

            // --- Remote detection ---
            const fullText = `${rawJob.title} ${rawJob.location} ${rawJob.descriptionSnippet}`.toLowerCase();
            const isRemote =
                searchParams.remoteOnly === true ||
                fullText.includes('remote') ||
                fullText.includes('work from home') ||
                (rawJob.location || '').toLowerCase().includes('remote');

            return {
                externalId,
                title: rawJob.title,
                company: rawJob.company,
                companyLogo: rawJob.companyLogo || null,
                location: rawJob.location || 'Worldwide',
                description: rawJob.description || '',
                descriptionSnippet: rawJob.descriptionSnippet || '',
                employmentType,
                isRemote,
                salary,
                applyLink: rawJob.applyLink,
                postedAt,
                source: 'linkedin',
                sourceUrl: rawJob.applyLink,
                skills: rawJob.skills || [],
            };
        });
    }

    // Helper: Salary Parsing

    /**
     * Parses LinkedIn salary strings into structured min/max/currency objects.
     * LinkedIn typically shows salaries in formats like:
     *   "$80,000/yr – $120,000/yr", "£40K–£60K a year", "$25/hr"
     *
     * @param {string} salaryStr - Raw salary text from LinkedIn
     * @returns {{ min: number|null, max: number|null, currency: string, period: string }}
     */
    parseSalaryString(salaryStr) {
        const result = { min: null, max: null, currency: 'USD', period: 'yearly' };

        if (!salaryStr || typeof salaryStr !== 'string') return result;

        const raw = salaryStr.trim();
        if (!raw || raw.toLowerCase().includes('competitive') || raw.toLowerCase().includes('not specified')) {
            return result;
        }

        // Currency detection
        if (raw.includes('£') || raw.toLowerCase().includes('gbp')) result.currency = 'GBP';
        else if (raw.includes('€') || raw.toLowerCase().includes('eur')) result.currency = 'EUR';
        else if (raw.includes('₹') || raw.toLowerCase().includes('inr')) result.currency = 'INR';
        else if (raw.includes('$') || raw.toLowerCase().includes('usd')) result.currency = 'USD';

        // Period detection
        if (/\bhr\b|\bhour(ly)?\b/i.test(raw)) result.period = 'hourly';
        else if (/\bmo(nth)?\b|\bpm\b/i.test(raw)) result.period = 'monthly';
        else result.period = 'yearly';

        // Clean the string: remove currency symbols, commas, K/M multipliers
        const cleaned = raw
            .replace(/[£€$₹]/g, '')
            .replace(/,/g, '')
            .replace(/\s/g, '');

        // Match numbers possibly followed by K or M
        const numbers = cleaned.match(/[\d.]+[KkMm]?/g);
        if (!numbers) return result;

        const toNumber = (str) => {
            const s = str.toUpperCase();
            if (s.endsWith('K')) return parseFloat(s) * 1000;
            if (s.endsWith('M')) return parseFloat(s) * 1_000_000;
            return parseFloat(s);
        };

        if (numbers.length >= 2) {
            result.min = toNumber(numbers[0]) || null;
            result.max = toNumber(numbers[1]) || null;
        } else if (numbers.length === 1) {
            result.min = toNumber(numbers[0]) || null;
        }

        return result;
    }

    // Helper: Posted Date Parsing

    /**
     * Converts LinkedIn's posted date strings or ISO datetime attributes into Date objects.
     * LinkedIn uses:
     *  - ISO datetime in <time datetime="2024-03-10"> attributes
     *  - Relative strings: "Just now", "2 hours ago", "3 days ago", "1 month ago"
     *
     * @param {string} postedStr - Raw posted date string or ISO datetime
     * @returns {Date|null} Parsed date or null if unparseable
     */
    parsePostedDate(postedStr) {
        if (!postedStr) return null;

        const raw = postedStr.trim();

        // Try direct ISO date parse first (from <time datetime="...">)
        if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
            const d = new Date(raw);
            return isNaN(d.getTime()) ? null : d;
        }

        const lower = raw.toLowerCase();

        // "Just now", "moments ago", "1 hour ago", "2 hours ago"
        if (lower.includes('just') || lower.includes('moment') || lower.includes('second')) {
            return new Date();
        }

        const hourMatch = lower.match(/(\d+)\s+hour/);
        if (hourMatch) {
            return new Date(Date.now() - parseInt(hourMatch[1], 10) * 60 * 60 * 1000);
        }

        if (lower.includes('today') || lower.includes('yesterday') && !lower.match(/\d+/)) {
            if (lower.includes('yesterday')) {
                return new Date(Date.now() - 24 * 60 * 60 * 1000);
            }
            return new Date();
        }

        const dayMatch = lower.match(/(\d+)\s+day/);
        if (dayMatch) {
            return new Date(Date.now() - parseInt(dayMatch[1], 10) * 24 * 60 * 60 * 1000);
        }

        const weekMatch = lower.match(/(\d+)\s+week/);
        if (weekMatch) {
            return new Date(Date.now() - parseInt(weekMatch[1], 10) * 7 * 24 * 60 * 60 * 1000);
        }

        const monthMatch = lower.match(/(\d+)\s+month/);
        if (monthMatch) {
            return new Date(Date.now() - parseInt(monthMatch[1], 10) * 30 * 24 * 60 * 60 * 1000);
        }

        // "30+ days ago" or similar
        if (lower.includes('30+') || lower.includes('month')) {
            return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        }

        return null;
    }

    // Helper: Employment Type Normalization

    /**
     * Maps LinkedIn's raw employment type strings to BaseScraper's validated enum values.
     *
     * @param {string} rawType - Raw string from LinkedIn (e.g. "Full-time", "Internship")
     * @returns {'full-time'|'part-time'|'contract'|'internship'|'unknown'}
     */
    normalizeEmploymentType(rawType) {
        if (!rawType || typeof rawType !== 'string') return 'unknown';

        const lower = rawType.toLowerCase().trim();

        if (lower.includes('full')) return 'full-time';
        if (lower.includes('part')) return 'part-time';
        if (lower.includes('contract') || lower.includes('freelance') || lower.includes('temporary')) return 'contract';
        if (lower.includes('intern')) return 'internship';

        return 'unknown';
    }
}

export default LinkedInScraper;
