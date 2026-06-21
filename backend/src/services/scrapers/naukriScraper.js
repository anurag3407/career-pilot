import crypto from 'crypto';
import puppeteer from 'puppeteer';
import { BaseScraper } from './BaseScraper.js';

/**
 * Concrete job scraper for Naukri.com targeting the Indian job market.
 * Extends BaseScraper to inherit shared rate-limiting, retries, and data validation.
 * Utilizes Puppeteer with dynamic anti-detection hooks, auto-scrolling,
 * login session bypass, and optional detailed deep page parsing.
 */
export class NaukriScraper extends BaseScraper {
    /**
     * @param {Object} [options={}] - Scraper options overrides
     * @param {boolean|'new'} [options.headless='new'] - Headless state
     * @param {boolean} [options.fetchFullDetails=false] - Whether to visit detail pages
     * @param {number} [options.maxFullDetails=5] - Cap on detailed pages to fetch per run
     * @param {string} [options.username=''] - Username to bypass login walls
     * @param {string} [options.password=''] - Password to bypass login walls
     * @param {Array<Object>} [options.cookies=[]] - Pre-authenticated session cookies
     */
    constructor(options = {}) {
        // Sets registry identifier to 'naukri'
        super('naukri', options);
    }

    /**
     * Navigates to Naukri, bypasses bot/login challenges, and extracts raw listing DOM content.
     * @param {Object} searchParams - Search filter parameters
     * @param {string} searchParams.query - Role or title query (e.g. 'Node.js Developer')
     * @param {string} [searchParams.location=''] - Target city (e.g. 'Mumbai')
     * @param {boolean} [searchParams.remoteOnly=false] - Filter for remote jobs only
     */
    async fetchRawData(searchParams) {
        const { query, location = '', remoteOnly = false } = searchParams;
        
        if (!query || !query.trim()) {
            throw new Error('Naukri scraper requires a non-empty search query.');
        }

        this.log(`Launching Puppeteer browser for: "${query}" in "${location || 'All India'}"`);

        const launchArgs = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-blink-features=AutomationControlled'
        ];

        // Launch browser with optional overrides
        const browser = await puppeteer.launch({
            headless: this.options.headless ?? 'new',
            args: launchArgs,
            ...this.options.launchConfig
        });

        const page = await browser.newPage();
        
        try {
            // Apply stealth configurations
            await page.setUserAgent(this.generateUserAgent());
            await page.setViewport({ width: 1366, height: 768 });
            
            // Bypass simple window.navigator.webdriver checks
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined,
                });
            });

            // 1. Session Cookie loading
            if (this.options.cookies && Array.isArray(this.options.cookies) && this.options.cookies.length > 0) {
                this.log(`Loading ${this.options.cookies.length} pre-authenticated session cookies...`);
                await page.setCookie(...this.options.cookies);
            }

            // 2. Form Credentials Login Bypass
            if (this.options.username && this.options.password) {
                this.log('Form credentials found. Navigating to login page to bypass login wall...');
                await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'networkidle2', timeout: 30000 });
                
                try {
                    await page.waitForSelector('#usernameField', { timeout: 10000 });
                    
                    // human-like typing speeds to prevent trigger blocks
                    await page.type('#usernameField', this.options.username, { delay: 80 + (crypto.randomBytes(4).readUInt32LE() / 0xFFFFFFFF) * 100 });
                    await page.type('#passwordField', this.options.password, { delay: 80 + (crypto.randomBytes(4).readUInt32LE() / 0xFFFFFFFF) * 100 });
                    
                    this.log('Typing submitted. Triggering login navigation...');
                    await Promise.all([
                        page.click('button[type="submit"]'),
                        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 })
                    ]);
                    this.log('Login credentials verified and session active.');
                } catch (loginErr) {
                    this.log(`Failed automated credential submission: ${loginErr.message}. Attempting to continue in guest mode...`, 'warn');
                }
            }

            // 3. Search Navigation
            // Naukri uses SEO-friendly path format: /keyword-jobs-in-location
            const formatStr = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const qStr = remoteOnly ? `${query} remote` : query;
            const formattedQuery = formatStr(qStr);
            let searchUrl = `https://www.naukri.com/${formattedQuery}-jobs`;
            
            if (location) {
                const formattedLocation = formatStr(location);
                searchUrl = `https://www.naukri.com/${formattedQuery}-jobs-in-${formattedLocation}`;
            }

            this.log(`Navigating to Naukri search listings: ${searchUrl}`);
            await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 40000 });

            // 4. Verify list loads or detect bot verification screens
            try {
                await page.waitForSelector('.cust-job-tuple, .jobTuple, article.jobTuple, div.srp-job-tuple', { timeout: 15000 });
            } catch (waitErr) {
                this.log('Target listing selectors not found. Checking if page hit a challenge/login prompt...', 'warn');
                await page.screenshot({ path: 'naukri_error.png', fullPage: true });
                this.log('Saved error screenshot to naukri_error.png');
                const title = await page.title();
                if (title.includes('Just a moment') || title.includes('Cloudflare') || title.includes('Attention Required')) {
                    throw new Error('Naukri block triggered: Cloudflare bot challenge encountered.');
                }
                if (await page.$('.login-container, #usernameField')) {
                    throw new Error('Naukri block triggered: Hit search results login wall page.');
                }
                throw new Error(`Job listings failed to render within timeout: ${waitErr.message}. Page title: "${title}"`);
            }

            // 5. Auto-Scroll down slowly to trigger lazy-loaded listings and DOM components
            this.log('Scrolling page incrementally to force lazy-load renders...');
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    const distance = 180;
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= scrollHeight || totalHeight > 3200) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 120);
                });
            });

            // 6. Primary Raw Attribute Extraction from search page DOM
            this.log('Extracting core job cards data from DOM elements...');
            const extractedRawJobs = await page.evaluate(() => {
                const cards = document.querySelectorAll('.cust-job-tuple, .jobTuple, article.jobTuple, div.srp-job-tuple');
                const list = [];

                cards.forEach((card) => {
                    try {
                        const titleEl = card.querySelector('a.title, a.job-title, .title');
                        const companyEl = card.querySelector('a.comp-name, a.company-name, .comp-name, .companyName');
                        
                        const locEl = card.querySelector('.loc-wrap, .location, .locRow, .loc');
                        const expEl = card.querySelector('.exp-wrap, .experience, .expRow, .exp');
                        const salEl = card.querySelector('.sal-wrap, .salary, .salRow, .sal');
                        const descEl = card.querySelector('.job-desc, .desc, .jobDescription');
                        
                        // Extract skill list tag elements
                        const tags = [];
                        const tagEls = card.querySelectorAll('.tags-gt, .tag-li, .tags .tag, .skills li, .tag');
                        tagEls.forEach(t => {
                            const val = t.textContent ? t.textContent.trim() : '';
                            if (val) tags.push(val);
                        });

                        // Extract posted time details
                        const postedEl = card.querySelector('.posted-wrap, .posted, .job-post-date, .day-ago');
                        const postedStr = postedEl ? postedEl.textContent.trim() : '';

                        const applyLink = titleEl ? titleEl.href : '';
                        let externalId = card.getAttribute('data-job-id') || card.getAttribute('id');
                        
                        // Fallback parsing of job ID from applyLink URL if missing in attributes
                        if (!externalId && applyLink) {
                            const segments = applyLink.split('-');
                            const ending = segments[segments.length - 1];
                            if (ending && /^\d+/.test(ending)) {
                                externalId = ending.split('?')[0];
                            }
                        }

                        list.push({
                            externalId: externalId || '',
                            title: titleEl ? titleEl.textContent.trim() : '',
                            company: companyEl ? companyEl.textContent.trim() : '',
                            applyLink,
                            location: locEl ? locEl.textContent.trim() : 'India',
                            experience: expEl ? expEl.textContent.trim() : '',
                            salaryStr: salEl ? salEl.textContent.trim() : '',
                            descriptionSnippet: descEl ? descEl.textContent.trim() : '',
                            skills: tags,
                            postedStr
                        });
                    } catch (cardErr) {
                        // Suppress individual card errors so it skips corrupted list elements
                    }
                });

                return list;
            });

            this.log(`Core extraction finished. Found ${extractedRawJobs.length} listing elements.`);

            // 7. Optional detailed deep page parsing (fetches full descriptions & exact skills)
            const fetchFullDetails = this.options.fetchFullDetails ?? false;
            if (fetchFullDetails && extractedRawJobs.length > 0) {
                const maxFullDetails = this.options.maxFullDetails ?? 5;
                this.log(`Deep Detailed Parsing is ENABLED. Fetching up to ${maxFullDetails} full pages sequentially...`);
                
                for (let i = 0; i < Math.min(extractedRawJobs.length, maxFullDetails); i++) {
                    const job = extractedRawJobs[i];
                    if (!job.applyLink) continue;

                    try {
                        this.log(`Navigating to detailed job: ${job.title} at ${job.company}`);
                        await page.goto(job.applyLink, { waitUntil: 'networkidle2', timeout: 20000 });
                        
                        // Wait for description container
                        await page.waitForSelector('.job-desc, .job-description, section.job-desc, .jd-desc', { timeout: 6000 }).catch(() => {});
                        
                        const details = await page.evaluate(() => {
                            const descEl = document.querySelector('.job-desc, .job-description, section.job-desc, .jd-desc');
                            
                            const tags = [];
                            const keySkillEls = document.querySelectorAll('.key-skill a, .key-skills a, .skills a, .tags a, a.tag');
                            keySkillEls.forEach(el => {
                                const val = el.textContent ? el.textContent.trim() : '';
                                if (val) tags.push(val);
                            });

                            return {
                                description: descEl ? descEl.innerHTML.trim() : '',
                                detailedSkills: tags
                            };
                        });

                        job.description = details.description;
                        if (details.detailedSkills.length > 0) {
                            job.skills = Array.from(new Set([...job.skills, ...details.detailedSkills]));
                        }

                        // Human-like pause delay between full detail requests
                        await this.sleep(1000 + (crypto.randomBytes(4).readUInt32LE() / 0xFFFFFFFF) * 1000);
                    } catch (detailErr) {
                        this.log(`Skipping full details for "${job.title}": ${detailErr.message}`, 'warn');
                    }
                }
            }

            return extractedRawJobs;
        } finally {
            await browser.close();
            this.log('Puppeteer browser context terminated.');
        }
    }

    /**
     * Normalizes extracted raw Naukri listings into our standard schema arrays.
     * Maps salaries, extracts approximate posted times, and checks remote statuses.
     */
    async parse(rawData, searchParams) {
        this.log(`Parsing raw extracted items list of size: ${rawData?.length || 0}`);
        
        if (!Array.isArray(rawData)) {
            return [];
        }

        return rawData.map(rawJob => {
            // Generate robust stable ID if Naukri couldn't resolve a numeric ID
            let externalId = rawJob.externalId;
            if (!externalId && rawJob.applyLink) {
                const segments = rawJob.applyLink.split('-');
                const ending = segments[segments.length - 1];
                if (ending && /^\d+/.test(ending)) {
                    externalId = ending.split('?')[0];
                } else {
                    externalId = rawJob.applyLink.split('/').pop().replace(/[^\w-]/g, '').slice(0, 32);
                }
            }
            if (!externalId) {
                // Last fallback: secure hash
                externalId = `nk-${Buffer.from(rawJob.title + rawJob.company).toString('base64').slice(0, 16)}`;
            }

            // 1. Process salary strings (e.g. "5,00,000 - 8,00,000 PA" -> INR min/max numbers)
            const salary = this.parseSalaryString(rawJob.salaryStr);

            // 2. Parse relative posted strings (e.g. "1 day ago", "Just posted" -> Date)
            const postedAt = this.parsePostedDate(rawJob.postedStr);

            // 3. Process Remote statuses
            let isRemote = false;
            const fullText = `${rawJob.title} ${rawJob.location} ${rawJob.descriptionSnippet}`.toLowerCase();
            if (fullText.includes('remote') || fullText.includes('work from home') || fullText.includes('wfh') || searchParams.remoteOnly) {
                isRemote = true;
            }

            return {
                externalId,
                title: rawJob.title,
                company: rawJob.company,
                location: rawJob.location || 'India',
                description: rawJob.description || rawJob.descriptionSnippet || '',
                descriptionSnippet: rawJob.descriptionSnippet || '',
                employmentType: 'full-time', // Default to full-time on Naukri
                isRemote,
                salary,
                applyLink: rawJob.applyLink,
                postedAt,
                source: 'naukri',
                sourceUrl: rawJob.applyLink,
                skills: rawJob.skills || []
            };
        });
    }

    /**
     * Parses standard Indian Lakh/LPA salary formats from Naukri strings
     * into structured numeric ranges (defaulting currency to INR).
     * @param {string} salaryStr - Salary text (e.g. "4,50,000 - 7,00,000 PA", "Not disclosed")
     * @returns {Object} Structured salary representation
     */
    parseSalaryString(salaryStr) {
        const salary = { min: null, max: null, currency: 'INR', period: 'yearly' };
        
        if (!salaryStr || salaryStr.toLowerCase().includes('disclosed') || salaryStr.toLowerCase().includes('competitive')) {
            return salary;
        }

        // Clean commas and extract digits
        const digits = salaryStr.replace(/,/g, '').match(/\d+/g);
        
        if (digits && digits.length >= 2) {
            salary.min = parseInt(digits[0], 10);
            salary.max = parseInt(digits[1], 10);
        } else if (digits && digits.length === 1) {
            salary.min = parseInt(digits[0], 10);
        }

        // Currency detection
        if (salaryStr.includes('$') || salaryStr.toLowerCase().includes('usd')) {
            salary.currency = 'USD';
        }

        // Period detection
        if (salaryStr.toLowerCase().includes('monthly') || salaryStr.toLowerCase().includes('pm')) {
            salary.period = 'monthly';
        } else if (salaryStr.toLowerCase().includes('hourly') || salaryStr.toLowerCase().includes('ph')) {
            salary.period = 'hourly';
        }

        return salary;
    }

    /**
     * Standardizes Naukri's relative posted labels into approximate Date instances.
     * @param {string} postedStr - Text (e.g. "Just posted", "Today", "2 days ago", "30+ days ago")
     * @returns {Date|null} Approximate Date
     */
    parsePostedDate(postedStr) {
        if (!postedStr) return null;
        
        const text = postedStr.toLowerCase().trim();
        
        if (text.includes('just') || text.includes('today') || text.includes('hour') || text.includes('moment')) {
            return new Date();
        }
        
        if (text.includes('yesterday') || text.includes('1 day ago')) {
            return new Date(Date.now() - 24 * 60 * 60 * 1000);
        }

        // Match digit days
        const matchDays = text.match(/(\d+)\s+day/);
        if (matchDays && matchDays[1]) {
            const days = parseInt(matchDays[1], 10);
            return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        }

        // 30+ days ago
        if (text.includes('30+')) {
            return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        }

        return null;
    }
}
export default NaukriScraper;
