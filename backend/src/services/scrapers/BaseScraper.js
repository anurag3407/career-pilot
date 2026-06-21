import axios from 'axios';

// List of modern, standard User-Agents to bypass browser fingerprint blocks
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Edge/122.0.0.0'
];

/**
 * Base class for all modular scrapers in Career Pilot.
 * Provides shared utilities for logging, user agent rotation, rate-limited sleeping,
 * retrying requests with exponential backoff, and validating job listings.
 */
export class BaseScraper {
    /**
     * @param {string} name - Unique identifier for the scraper (e.g. 'linkedin', 'indeed')
     * @param {Object} [options={}] - Custom configuration options
     * @param {number} [options.timeout=30000] - Request timeout in milliseconds
     * @param {number} [options.maxRetries=3] - Maximum retries for temporary failures
     * @param {number} [options.delayBetweenRequests=1000] - Delay base for retries in ms
     * @param {Object} [options.headers={}] - Custom headers to override default ones
     */
    constructor(name, options = {}) {
        if (!name || typeof name !== 'string') {
            throw new Error('Scraper name must be specified as a non-empty string.');
        }
        
        this.name = name.toLowerCase().trim();
        this.options = {
            timeout: 30000,
            maxRetries: 3,
            delayBetweenRequests: 1000,
            ...options
        };
        this.httpClient = options.httpClient || axios;

        this.defaultHeaders = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            ...options.headers
        };
        this.uaIndex = 0;
    }

    /**
     * Rotates and retrieves a deterministic round-robin modern browser User-Agent.
     * @returns {string} User-Agent string
     */
    generateUserAgent() {
        const index = this.uaIndex % USER_AGENTS.length;
        this.uaIndex++;
        return USER_AGENTS[index];
    }

    /**
     * Simple utility to delay execution for rate limiting.
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Centralized logger prefixed with the scraper's identifier.
     * @param {string} message - Logging message content
     * @param {'info'|'warn'|'error'} [level='info'] - Logging level
     */
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [SCRAPER:${this.name.toUpperCase()}]`;
        
        if (level === 'error') {
            console.error(`${prefix} ❌ ${message}`);
        } else if (level === 'warn') {
            console.warn(`${prefix} ⚠️ ${message}`);
        } else {
            console.log(`${prefix} ℹ️ ${message}`);
        }
    }

    /**
     * Executes HTTP requests with built-in retries, exponential backoff,
     * timeout handling, and automatic User-Agent rotation.
     * @param {string} url - Target URL
     * @param {Object} [config={}] - Axios request configuration overrides
     * @returns {Promise<Object>} Axios Response object
     */
    async request(url, config = {}) {
        const maxRetries = config.maxRetries ?? this.options.maxRetries;
        const baseDelay = config.delay ?? this.options.delayBetweenRequests;
        
        const requestConfig = {
            timeout: this.options.timeout,
            ...config,
            headers: {
                ...this.defaultHeaders,
                'User-Agent': this.generateUserAgent(),
                ...config.headers
            }
        };

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                this.log(`Requesting URL: ${url} (Attempt ${attempt}/${maxRetries})`);
                const response = await this.httpClient({ url, ...requestConfig });
                return response;
            } catch (error) {
                const isRateLimit = error.response?.status === 429;
                const isNetworkError = !error.response;
                const isServerError = error.response?.status >= 500;
                
                const shouldRetry = (isRateLimit || isNetworkError || isServerError) && attempt < maxRetries;
                
                if (shouldRetry) {
                    const backoff = baseDelay * Math.pow(2, attempt - 1);
                    this.log(`Request failed: ${error.message}. Retrying in ${backoff}ms...`, 'warn');
                    await this.sleep(backoff);
                    continue;
                }
                
                this.log(`Request failed permanently: ${error.message}`, 'error');
                throw error;
            }
        }
    }

    /**
     * Abstract method to fetch raw data (HTML page, API response, etc.).
     * Must be overridden by subclasses.
     * @param {Object} searchParams - Parameters like query, location, etc.
     * @returns {Promise<any>} Raw scraped data
     */
    async fetchRawData(searchParams) {
        throw new Error(`fetchRawData() is not implemented in scraper: ${this.name}`);
    }

    /**
     * Abstract method to parse raw fetched data into standard JobListing objects.
     * Must be overridden by subclasses.
     * @param {any} rawData - Data returned by fetchRawData()
     * @param {Object} searchParams - Contextual search parameters
     * @returns {Promise<Array<Object>>} Parsed array of jobs
     */
    async parse(rawData, searchParams) {
        throw new Error(`parse() is not implemented in scraper: ${this.name}`);
    }

    /**
     * Validates and normalizes raw parsed job objects into standard format aligning with JobListing model.
     * Prevents invalid or corrupted elements from entering database.
     * @param {Object} job - Unvalidated job object
     * @returns {Object|null} Validated/normalized job object, or null if invalid
     */
    validateJob(job) {
        if (!job || typeof job !== 'object') {
            this.log('Invalid job structure passed for validation', 'warn');
            return null;
        }

        // Check required fields based on database constraints
        const requiredFields = ['externalId', 'title', 'company', 'applyLink'];
        for (const field of requiredFields) {
            if (!job[field] || typeof job[field] !== 'string' || !job[field].trim()) {
                this.log(`Validation failed: Missing required field "${field}"`, 'warn');
                return null;
            }
        }

        // Standardize output formats and safely handle optional fields
        const validated = {
            externalId: job.externalId.trim(),
            title: job.title.trim(),
            company: job.company.trim(),
            applyLink: job.applyLink.trim(),
            location: (job.location && typeof job.location === 'string') ? job.location.trim() : 'Remote',
            description: (job.description && typeof job.description === 'string') ? job.description : '',
            descriptionSnippet: (job.descriptionSnippet && typeof job.descriptionSnippet === 'string') ? job.descriptionSnippet : '',
            employmentType: 'unknown',
            isRemote: typeof job.isRemote === 'boolean' ? job.isRemote : false,
            salary: {
                min: (job.salary?.min !== undefined && typeof job.salary?.min === 'number') ? job.salary.min : null,
                max: (job.salary?.max !== undefined && typeof job.salary?.max === 'number') ? job.salary.max : null,
                currency: (job.salary?.currency && typeof job.salary?.currency === 'string') ? job.salary.currency : 'USD',
                period: (job.salary?.period && typeof job.salary?.period === 'string') ? job.salary.period : 'yearly'
            },
            companyLogo: (job.companyLogo && typeof job.companyLogo === 'string') ? job.companyLogo : null,
            postedAt: job.postedAt instanceof Date ? job.postedAt : (job.postedAt ? new Date(job.postedAt) : null),
            expiresAt: job.expiresAt instanceof Date ? job.expiresAt : (job.expiresAt ? new Date(job.expiresAt) : null),
            source: (job.source && typeof job.source === 'string') ? job.source : this.name,
            sourceUrl: (job.sourceUrl && typeof job.sourceUrl === 'string') ? job.sourceUrl : null,
            skills: Array.isArray(job.skills) ? job.skills.map(s => String(s).trim()).filter(Boolean) : []
        };

        // Normalize employment type enums
        const validTypes = ['full-time', 'part-time', 'contract', 'internship', 'unknown'];
        if (job.employmentType && typeof job.employmentType === 'string') {
            const typeLower = job.employmentType.toLowerCase().trim();
            if (validTypes.includes(typeLower)) {
                validated.employmentType = typeLower;
            } else if (typeLower.includes('full')) {
                validated.employmentType = 'full-time';
            } else if (typeLower.includes('part')) {
                validated.employmentType = 'part-time';
            } else if (typeLower.includes('contract')) {
                validated.employmentType = 'contract';
            } else if (typeLower.includes('intern')) {
                validated.employmentType = 'internship';
            }
        }

        // Clean invalid dates to null
        if (validated.postedAt && isNaN(validated.postedAt.getTime())) {
            validated.postedAt = null;
        }
        if (validated.expiresAt && isNaN(validated.expiresAt.getTime())) {
            validated.expiresAt = null;
        }

        return validated;
    }

    /**
     * Primary orchestration method to execute the scraping flow.
     * Handles workflow execution, safety validations, retries, and timing telemetry.
     * @param {Object} [searchParams={}] - Scraping context (query, location, etc.)
     * @returns {Promise<Object>} Scraping run summary
     */
    async scrape(searchParams = {}) {
        this.log(`Initiating scrape operation with params: ${JSON.stringify(searchParams)}`);
        const startTime = Date.now();

        try {
            const rawData = await this.fetchRawData(searchParams);
            const parsedJobs = await this.parse(rawData, searchParams);

            if (!Array.isArray(parsedJobs)) {
                throw new Error('Parser must return an array of parsed job objects.');
            }

            const validatedJobs = parsedJobs
                .map(job => this.validateJob(job))
                .filter(Boolean);

            const duration = Date.now() - startTime;
            this.log(`Successfully completed scraping. Parsed: ${parsedJobs.length}, Validated: ${validatedJobs.length} (Duration: ${duration}ms)`);

            return {
                success: true,
                source: this.name,
                jobs: validatedJobs,
                count: validatedJobs.length,
                durationMs: duration
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            this.log(`Scraping process failed: ${error.message} (Duration: ${duration}ms)`, 'error');

            return {
                success: false,
                source: this.name,
                error: error.message,
                jobs: [],
                count: 0,
                durationMs: duration
            };
        }
    }
}
