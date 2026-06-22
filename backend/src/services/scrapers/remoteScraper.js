import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

// Rate limiting configuration matching project conventions
const RATE_LIMIT = {
    delayBetweenRequests: 2000,
    maxRetries: 3,
    retryBaseDelay: 5000,
    requestTimeout: 30000
};

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Generate a stable external ID from job attributes using SHA-256 hash.
 * Follows the same hashing pattern as rapidApiService.js.
 * @param {string} source - Source platform identifier
 * @param {string[]} parts - Array of strings to hash together
 * @returns {string} 32-character hex hash prefixed with source
 */
const generateExternalId = (source, parts) => {
    const stableIdSource = parts.filter(Boolean).join('|');
    const hash = crypto
        .createHash('sha256')
        .update(stableIdSource)
        .digest('hex')
        .slice(0, 32);
    return `${source}-${hash}`;
};

/**
 * Sleep utility for rate limiting between requests.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Make an HTTP request with retry logic and exponential backoff.
 * Mirrors the error handling patterns from rapidApiService.js.
 * @param {string} url - URL to fetch
 * @param {Object} [options={}] - Axios request options
 * @returns {Promise<import('axios').AxiosResponse>} Axios response
 */
const fetchWithRetry = async (url, options = {}) => {
    let lastError;

    for (let attempt = 1; attempt <= RATE_LIMIT.maxRetries; attempt++) {
        try {
            const response = await axios.get(url, {
                timeout: RATE_LIMIT.requestTimeout,
                headers: { 'User-Agent': USER_AGENT },
                ...options
            });
            return response;
        } catch (error) {
            lastError = error;

            if (error.response) {
                const status = error.response.status;
                if (status === 429) {
                    console.warn(`⚠️  Rate limited on ${url} (attempt ${attempt}/${RATE_LIMIT.maxRetries})`);
                    await sleep(RATE_LIMIT.retryBaseDelay * attempt);
                    continue;
                }
                if (status === 403 || status === 401) {
                    console.error(`\u{1f511} Access denied for ${url}`);
                    throw new Error('ACCESS_DENIED');
                }
                if (status >= 500) {
                    console.warn(`⚠️  Server error ${status} on ${url} (attempt ${attempt}/${RATE_LIMIT.maxRetries})`);
                    await sleep(RATE_LIMIT.retryBaseDelay * attempt);
                    continue;
                }
            }

            if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                console.warn(`⚠️  Timeout on ${url} (attempt ${attempt}/${RATE_LIMIT.maxRetries})`);
                await sleep(RATE_LIMIT.retryBaseDelay * attempt);
                continue;
            }

            throw error;
        }
    }

    console.error(`❌ Failed to fetch ${url} after ${RATE_LIMIT.maxRetries} attempts`);
    throw lastError;
};

/**
 * Map employment type string to the internal enum values used by JobListing model.
 * @param {string} type - Raw employment type string from source
 * @returns {string} Normalized employment type enum value
 */
const normalizeEmploymentType = (type) => {
    if (!type) return 'unknown';
    const lower = type.toLowerCase();
    if (lower.includes('full')) return 'full-time';
    if (lower.includes('part')) return 'part-time';
    if (lower.includes('contract') || lower.includes('freelance')) return 'contract';
    if (lower.includes('intern')) return 'internship';
    return 'unknown';
};

/**
 * Truncate description to create a snippet, matching rapidApiService.js behavior.
 * @param {string} description - Full job description text
 * @param {number} [maxLength=300] - Maximum snippet length
 * @returns {string} Truncated description snippet
 */
const createDescriptionSnippet = (description, maxLength = 300) => {
    if (!description) return '';
    const cleaned = description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    return `${cleaned.substring(0, maxLength)}...`;
};

// ---------------------------------------------------------------------------
// Remote.co Scraper
// ---------------------------------------------------------------------------

/**
 * Scrape remote job listings from Remote.co.
 * Parses the job listing pages using cheerio and normalizes results
 * into the internal JobListing schema.
 * @param {Object} params - Search parameters
 * @param {string} [params.query=''] - Search query / keywords
 * @param {string} [params.category=''] - Job category filter
 * @returns {Promise<Array<Object>>} Array of normalized job objects
 */
export const scrapeRemoteCo = async ({ query = '', category = '' } = {}) => {
    try {
        let url = 'https://remote.co/remote-jobs/';
        if (category) {
            url += `${encodeURIComponent(category)}/`;
        }
        if (query) {
            url += `?search=${encodeURIComponent(query)}`;
        }

        console.log(`\u{1f50d} Scraping Remote.co: ${url}`);
        const response = await fetchWithRetry(url);
        const $ = cheerio.load(response.data);

        const jobs = [];

        $('.card.m-0.border-left-0.border-right-0.border-top-0.border-bottom').each((_, element) => {
            try {
                const card = $(element);
                const titleElement = card.find('.card-title a, a.card-title-link, h2 a');
                const title = titleElement.text().trim();
                const jobUrl = titleElement.attr('href');

                if (!title || !jobUrl) return;

                const company = card.find('.company-name, .badge-light, .text-secondary').first().text().trim() || 'Unknown Company';
                const dateText = card.find('.text-muted, .date, time').first().text().trim();
                const description = card.find('.card-text, .description, p').first().text().trim();
                const fullUrl = jobUrl.startsWith('http') ? jobUrl : `https://remote.co${jobUrl}`;

                const externalId = generateExternalId('remoteco', [title, company, fullUrl]);

                jobs.push({
                    externalId,
                    title: title || 'Untitled Position',
                    company,
                    location: 'Remote',
                    description: description || '',
                    descriptionSnippet: createDescriptionSnippet(description),
                    employmentType: 'unknown',
                    isRemote: true,
                    salary: { min: null, max: null, currency: 'USD', period: 'yearly' },
                    applyLink: fullUrl,
                    companyLogo: null,
                    postedAt: dateText ? parseRelativeDate(dateText) : null,
                    expiresAt: null,
                    source: 'remote.co',
                    sourceUrl: fullUrl,
                    skills: [],
                    fetchedAt: new Date()
                });
            } catch (parseError) {
                console.warn(`⚠️  Failed to parse Remote.co job card: ${parseError.message}`);
            }
        });

        // Fallback selectors if primary selectors found nothing
        if (jobs.length === 0) {
            $('a[href*="/remote-jobs/"]').each((_, element) => {
                try {
                    const link = $(element);
                    const title = link.text().trim();
                    const jobUrl = link.attr('href');

                    if (!title || !jobUrl || title.length < 5) return;
                    if (jobUrl === '/remote-jobs/' || jobUrl.endsWith('/remote-jobs/')) return;

                    const fullUrl = jobUrl.startsWith('http') ? jobUrl : `https://remote.co${jobUrl}`;
                    const externalId = generateExternalId('remoteco', [title, fullUrl]);

                    const parentEl = link.closest('li, div, article, tr');
                    const company = parentEl.find('.company, .employer').first().text().trim() || 'Unknown Company';

                    jobs.push({
                        externalId,
                        title,
                        company,
                        location: 'Remote',
                        description: '',
                        descriptionSnippet: '',
                        employmentType: 'unknown',
                        isRemote: true,
                        salary: { min: null, max: null, currency: 'USD', period: 'yearly' },
                        applyLink: fullUrl,
                        companyLogo: null,
                        postedAt: null,
                        expiresAt: null,
                        source: 'remote.co',
                        sourceUrl: fullUrl,
                        skills: [],
                        fetchedAt: new Date()
                    });
                } catch (parseError) {
                    console.warn(`⚠️  Failed to parse Remote.co link: ${parseError.message}`);
                }
            });
        }

        console.log(`✅ Remote.co: Found ${jobs.length} jobs`);
        return jobs;
    } catch (error) {
        console.error(`❌ Remote.co scraping error: ${error.message}`);
        throw error;
    }
};

// ---------------------------------------------------------------------------
// WeWorkRemotely Scraper
// ---------------------------------------------------------------------------

/**
 * Scrape remote job listings from WeWorkRemotely.
 * Parses the category listing pages using cheerio and normalizes results
 * into the internal JobListing schema.
 * @param {Object} params - Search parameters
 * @param {string} [params.query=''] - Search query / keywords
 * @param {string} [params.category='remote-jobs'] - WWR category slug
 * @returns {Promise<Array<Object>>} Array of normalized job objects
 */
export const scrapeWeWorkRemotely = async ({ query = '', category = 'remote-jobs' } = {}) => {
    try {
        let url = `https://weworkremotely.com/${encodeURIComponent(category)}`;
        if (query) {
            url = `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(query)}`;
        }

        console.log(`\u{1f50d} Scraping WeWorkRemotely: ${url}`);
        const response = await fetchWithRetry(url);
        const $ = cheerio.load(response.data);

        const jobs = [];

        $('li.feature, li.new-listing, section.jobs li').each((_, element) => {
            try {
                const listing = $(element);

                // Skip view-all or ad elements
                if (listing.hasClass('view-all') || listing.hasClass('ad')) return;

                const linkElement = listing.find('a').not('.view-all').first();
                const jobUrl = linkElement.attr('href');
                if (!jobUrl || jobUrl === '#') return;

                const title = listing.find('.title, h3, span.title').first().text().trim();
                const company = listing.find('.company, span.company').first().text().trim();
                const region = listing.find('.region, .location, span.region').first().text().trim();
                const dateText = listing.find('time, .date, .listing-date').first().text().trim();

                if (!title) return;

                const fullUrl = jobUrl.startsWith('http') ? jobUrl : `https://weworkremotely.com${jobUrl}`;
                const externalId = generateExternalId('wwr', [title, company, fullUrl]);

                const logoImg = listing.find('img, .flag-logo img').first();
                const companyLogo = logoImg.attr('src') || null;
                const resolvedLogo = companyLogo && !companyLogo.startsWith('http')
                    ? `https://weworkremotely.com${companyLogo}`
                    : companyLogo;

                jobs.push({
                    externalId,
                    title: title || 'Untitled Position',
                    company: company || 'Unknown Company',
                    location: region || 'Remote',
                    description: '',
                    descriptionSnippet: '',
                    employmentType: 'full-time',
                    isRemote: true,
                    salary: { min: null, max: null, currency: 'USD', period: 'yearly' },
                    applyLink: fullUrl,
                    companyLogo: resolvedLogo,
                    postedAt: dateText ? parseRelativeDate(dateText) : null,
                    expiresAt: null,
                    source: 'weworkremotely',
                    sourceUrl: fullUrl,
                    skills: [],
                    fetchedAt: new Date()
                });
            } catch (parseError) {
                console.warn(`⚠️  Failed to parse WWR listing: ${parseError.message}`);
            }
        });

        console.log(`✅ WeWorkRemotely: Found ${jobs.length} jobs`);
        return jobs;
    } catch (error) {
        console.error(`❌ WeWorkRemotely scraping error: ${error.message}`);
        throw error;
    }
};

// ---------------------------------------------------------------------------
// RemoteOK API Integration
// ---------------------------------------------------------------------------

/**
 * Fetch remote job listings from the RemoteOK public JSON API.
 * RemoteOK provides a JSON endpoint that does not require authentication.
 * @param {Object} params - Search parameters
 * @param {string} [params.query=''] - Search query / keywords (used for tag filtering)
 * @returns {Promise<Array<Object>>} Array of normalized job objects
 */
export const fetchRemoteOK = async ({ query = '' } = {}) => {
    try {
        let url = 'https://remoteok.com/api';
        if (query) {
            const tags = query.toLowerCase().replace(/\s+/g, '-');
            url += `?tags=${encodeURIComponent(tags)}`;
        }

        console.log(`\u{1f50d} Fetching RemoteOK API: ${url}`);
        const response = await fetchWithRetry(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/json'
            }
        });

        let data = response.data;

        // RemoteOK returns an array where the first element is metadata
        if (Array.isArray(data) && data.length > 0) {
            if (data[0].legal || data[0].warning || !data[0].id) {
                data = data.slice(1);
            }
        }

        if (!Array.isArray(data) || data.length === 0) {
            console.log('\u{1f4ed} RemoteOK: No jobs found');
            return [];
        }

        const jobs = data.map(job => {
            try {
                const externalId = generateExternalId('remoteok', [
                    String(job.id || ''),
                    job.company || '',
                    job.position || ''
                ]);

                const salary = parseSalary(job.salary || '');
                const description = job.description
                    ? job.description.replace(/<[^>]*>/g, '').trim()
                    : '';

                const tags = Array.isArray(job.tags) ? job.tags : [];

                return {
                    externalId,
                    title: job.position || 'Untitled Position',
                    company: job.company || 'Unknown Company',
                    location: job.location || 'Remote',
                    description,
                    descriptionSnippet: createDescriptionSnippet(description),
                    employmentType: normalizeEmploymentType(job.employment_type),
                    isRemote: true,
                    salary,
                    applyLink: job.url || `https://remoteok.com/remote-jobs/${job.id}`,
                    companyLogo: job.company_logo || job.logo || null,
                    postedAt: job.date ? new Date(job.date) : null,
                    expiresAt: null,
                    source: 'remoteok',
                    sourceUrl: job.url || `https://remoteok.com/remote-jobs/${job.id}`,
                    skills: tags,
                    fetchedAt: new Date()
                };
            } catch (parseError) {
                console.warn(`⚠️  Failed to parse RemoteOK job: ${parseError.message}`);
                return null;
            }
        }).filter(Boolean);

        console.log(`✅ RemoteOK: Found ${jobs.length} jobs`);
        return jobs;
    } catch (error) {
        console.error(`❌ RemoteOK API error: ${error.message}`);
        throw error;
    }
};

// ---------------------------------------------------------------------------
// Unified Search
// ---------------------------------------------------------------------------

/**
 * Search all remote job sources in parallel and return combined, deduplicated results.
 * Each source is fetched independently so a single source failure does not block others.
 * Results are normalized to the internal JobListing schema.
 * @param {Object} params - Search parameters
 * @param {string} [params.query=''] - Search query / keywords
 * @param {string[]} [params.sources] - Sources to search (defaults to all)
 * @returns {Promise<Object>} Combined results with per-source metadata
 */
export const searchRemoteJobs = async ({ query = '', sources = ['remote.co', 'weworkremotely', 'remoteok'] } = {}) => {
    console.log(`\n\u{1f30d} Searching remote jobs: "${query || 'all'}"`);
    console.log(`   Sources: ${sources.join(', ')}`);

    const results = {
        jobs: [],
        metadata: {
            totalJobs: 0,
            sources: {},
            query,
            fetchedAt: new Date()
        }
    };

    const scraperMap = {
        'remote.co': () => scrapeRemoteCo({ query }),
        'weworkremotely': () => scrapeWeWorkRemotely({ query }),
        'remoteok': () => fetchRemoteOK({ query })
    };

    // Run scrapers in parallel with individual error isolation
    const scraperPromises = sources
        .filter(source => scraperMap[source])
        .map(async (source) => {
            try {
                const jobs = await scraperMap[source]();
                results.metadata.sources[source] = {
                    count: jobs.length,
                    status: 'success'
                };
                return jobs;
            } catch (error) {
                console.error(`❌ ${source} failed: ${error.message}`);
                results.metadata.sources[source] = {
                    count: 0,
                    status: 'error',
                    error: error.message
                };
                return [];
            }
        });

    const allJobArrays = await Promise.all(scraperPromises);

    // Flatten and deduplicate by externalId
    const seen = new Set();
    for (const jobArray of allJobArrays) {
        for (const job of jobArray) {
            if (!seen.has(job.externalId)) {
                seen.add(job.externalId);
                results.jobs.push(job);
            }
        }
    }

    // Add delay between batch runs for rate limiting
    await sleep(RATE_LIMIT.delayBetweenRequests);

    results.metadata.totalJobs = results.jobs.length;

    console.log(`✅ Total remote jobs found: ${results.metadata.totalJobs}`);
    Object.entries(results.metadata.sources).forEach(([source, meta]) => {
        console.log(`   ${meta.status === 'success' ? '✅' : '❌'} ${source}: ${meta.count} jobs`);
    });

    return results;
};

// ---------------------------------------------------------------------------
// Health Check
// ---------------------------------------------------------------------------

/**
 * Check if remote job sources are accessible.
 * Tests connectivity to each source without performing a full scrape.
 * @returns {Promise<Object>} Health status for each source
 */
export const checkRemoteScraperHealth = async () => {
    const sources = {
        'remote.co': 'https://remote.co/remote-jobs/',
        'weworkremotely': 'https://weworkremotely.com/remote-jobs',
        'remoteok': 'https://remoteok.com/api'
    };

    const health = {};

    for (const [name, url] of Object.entries(sources)) {
        try {
            await axios.head(url, {
                timeout: 10000,
                headers: { 'User-Agent': USER_AGENT }
            });
            health[name] = { healthy: true };
        } catch (error) {
            health[name] = {
                healthy: false,
                error: error.response?.status === 429 ? 'Rate limited' : error.message
            };
        }
    }

    return health;
};

// ---------------------------------------------------------------------------
// Utility: Date & Salary Parsers
// ---------------------------------------------------------------------------

/**
 * Parse relative date strings (e.g. "2 days ago", "1 week ago") into Date objects.
 * @param {string} dateStr - Relative or absolute date string
 * @returns {Date|null} Parsed date or null if unparseable
 */
const parseRelativeDate = (dateStr) => {
    if (!dateStr) return null;

    const now = new Date();
    const lower = dateStr.toLowerCase().trim();

    // Try parsing as an absolute date first
    const directParse = new Date(dateStr);
    if (!isNaN(directParse.getTime()) && dateStr.includes('-')) {
        return directParse;
    }

    // Relative date patterns
    const patterns = [
        { regex: /(\d+)\s*min/i, unit: 'minutes' },
        { regex: /(\d+)\s*hour/i, unit: 'hours' },
        { regex: /(\d+)\s*day/i, unit: 'days' },
        { regex: /(\d+)\s*week/i, unit: 'weeks' },
        { regex: /(\d+)\s*month/i, unit: 'months' }
    ];

    for (const { regex, unit } of patterns) {
        const match = lower.match(regex);
        if (match) {
            const value = parseInt(match[1], 10);
            const date = new Date(now);
            switch (unit) {
                case 'minutes': date.setMinutes(date.getMinutes() - value); break;
                case 'hours': date.setHours(date.getHours() - value); break;
                case 'days': date.setDate(date.getDate() - value); break;
                case 'weeks': date.setDate(date.getDate() - (value * 7)); break;
                case 'months': date.setMonth(date.getMonth() - value); break;
            }
            return date;
        }
    }

    if (lower.includes('today') || lower.includes('just now')) return now;
    if (lower.includes('yesterday')) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
    }

    return null;
};

/**
 * Parse salary strings into the structured salary format used by JobListing model.
 * Handles formats like "$80k - $120k", "$100,000/yr", "80000-120000".
 * @param {string} salaryStr - Raw salary string
 * @returns {Object} Structured salary object { min, max, currency, period }
 */
const parseSalary = (salaryStr) => {
    const defaultSalary = { min: null, max: null, currency: 'USD', period: 'yearly' };
    if (!salaryStr || typeof salaryStr !== 'string') return defaultSalary;

    const cleaned = salaryStr.replace(/,/g, '').trim();

    // Detect currency
    let currency = 'USD';
    if (cleaned.includes('€') || cleaned.toLowerCase().includes('eur')) currency = 'EUR';
    else if (cleaned.includes('£') || cleaned.toLowerCase().includes('gbp')) currency = 'GBP';

    // Detect period
    let period = 'yearly';
    if (/\/\s*(hr|hour)/i.test(cleaned) || /per\s*hour/i.test(cleaned)) period = 'hourly';
    else if (/\/\s*(mo|month)/i.test(cleaned) || /per\s*month/i.test(cleaned)) period = 'monthly';

    // Extract numeric values, handling "k" suffix
    const numbers = [];
    const numRegex = /(\d+(?:\.\d+)?)\s*k?/gi;
    let match;
    while ((match = numRegex.exec(cleaned)) !== null) {
        let value = parseFloat(match[1]);
        if (match[0].toLowerCase().endsWith('k')) {
            value *= 1000;
        }
        // Heuristic: small numbers without 'k' in a yearly context are likely in thousands
        if (value < 1000 && period === 'yearly' && !match[0].toLowerCase().endsWith('k')) {
            value *= 1000;
        }
        numbers.push(value);
    }

    if (numbers.length === 0) return defaultSalary;

    return {
        min: numbers[0] || null,
        max: numbers.length > 1 ? numbers[1] : numbers[0],
        currency,
        period
    };
};

export default {
    scrapeRemoteCo,
    scrapeWeWorkRemotely,
    fetchRemoteOK,
    searchRemoteJobs,
    checkRemoteScraperHealth
};
