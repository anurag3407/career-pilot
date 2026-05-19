import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com';

// Check if API key is configured
if (!RAPIDAPI_KEY) {
    console.warn('⚠️  RAPIDAPI_KEY not configured - job search will not work');
}

// RapidAPI JSearch configuration
const rapidApiClient = axios.create({
    baseURL: `https://${RAPIDAPI_HOST}`,
    headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
    },
    timeout: 30000 // 30 second timeout
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            const isRateLimit = error.response?.status === 429 || error.message?.includes('429');
            const isLastAttempt = i === retries - 1;

            if (isRateLimit && !isLastAttempt) {
                const backoffDelay = delay * Math.pow(2, i);
                console.warn(`⏱️ RapidAPI JSearch Rate limit reached (429). Retrying in ${backoffDelay}ms... (Attempt ${i + 1}/${retries})`);
                await wait(backoffDelay);
                continue;
            }
            throw error;
        }
    }
};

/**
 * Search for jobs using RapidAPI JSearch
 * @param {Object} params - Search parameters
 * @param {string} params.query - Job title or keywords (e.g., "React Developer")
 * @param {string} params.location - Location (e.g., "San Francisco, CA")
 * @param {boolean} params.remoteOnly - Filter for remote jobs only
 * @param {string} params.employmentType - Employment type filter
 * @param {number} params.page - Page number (1-indexed)
 * @param {number} params.numPages - Number of pages to fetch
 * @returns {Promise<Array>} Array of job objects
 */
export const searchJobs = async ({
    query,
    location = '',
    remoteOnly = false,
    employmentType = '',
    page = 1,
    numPages = 1
}) => {
    // Check if API key exists
    if (!RAPIDAPI_KEY) {
        console.error('❌ RAPIDAPI_KEY is not configured');
        throw new Error('Job search API is not configured. Please add RAPIDAPI_KEY to your environment variables.');
    }

    try {
        // Build search query
        let searchQuery = query;
        if (location && !remoteOnly) {
            searchQuery += ` in ${location}`;
        }
        if (remoteOnly) {
            searchQuery += ' remote';
        }

        const params = {
            query: searchQuery,
            page: page.toString(),
            num_pages: numPages.toString(),
            date_posted: 'week' // Only get jobs from the past week
        };

        // Add employment type filter if specified
        if (employmentType) {
            params.employment_types = employmentType.toUpperCase();
        }

        // Add remote filter
        if (remoteOnly) {
            params.remote_jobs_only = 'true';
        }

        console.log(`🔍 Searching RapidAPI: "${searchQuery}"`);

        const fetchWithRetry = () => rapidApiClient.get('/search', { params });
        const response = await withRetry(fetchWithRetry);

        if (!response.data || !response.data.data) {
            console.log('📭 No jobs found');
            return [];
        }

        const jobs = response.data.data;
        console.log(`✅ Found ${jobs.length} jobs`);

        // Map API response to our internal format
        return jobs.map(job => mapJobToInternal(job));

    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 400) {
                console.error('❌ RapidAPI Bad Request (400) - Invalid API key or parameters');
                console.error('   Response:', error.response.data);
                throw new Error('Invalid API request. Please check your RAPIDAPI_KEY is valid and you have an active subscription.');
            }
            if (status === 429) {
                console.error('⚠️ RapidAPI Rate limit exceeded');
                throw new Error('RATE_LIMIT_EXCEEDED');
            }
            if (status === 401 || status === 403) {
                console.error('🔑 RapidAPI authentication error');
                throw new Error('AUTH_ERROR');
            }
        }
        console.error('❌ RapidAPI search error:', error.message);
        throw error;
    }
};

/**
 * Map RapidAPI job response to internal JobListing format
 */
const mapJobToInternal = (job) => {
    // Generate a stable external ID from the job
    const stableIdSource = [
        job.employer_name,
        job.job_title,
        job.job_apply_link || job.job_google_link || job.job_id_source || '',
        job.job_city,
        job.job_state,
        job.job_country
    ].filter(Boolean).join('|');

    const fallbackExternalId = crypto
        .createHash('sha256')
        .update(stableIdSource)
        .digest('hex')
        .slice(0, 32);

    const externalId = job.job_id || fallbackExternalId;

    // Parse salary information
    let salary = {
        min: null,
        max: null,
        currency: 'USD',
        period: 'yearly'
    };

    if (job.job_min_salary || job.job_max_salary) {
        salary.min = job.job_min_salary || null;
        salary.max = job.job_max_salary || null;
        salary.currency = job.job_salary_currency || 'USD';
        salary.period = job.job_salary_period?.toLowerCase() || 'yearly';
    }

    // Map employment type
    let employmentType = 'unknown';
    if (job.job_employment_type) {
        const type = job.job_employment_type.toLowerCase();
        if (type.includes('full')) employmentType = 'full-time';
        else if (type.includes('part')) employmentType = 'part-time';
        else if (type.includes('contract')) employmentType = 'contract';
        else if (type.includes('intern')) employmentType = 'internship';
    }

    // Build location string
    let location = 'Remote';
    if (job.job_city || job.job_state || job.job_country) {
        const parts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
        location = parts.join(', ') || 'Remote';
    }

    const descriptionSnippet = job.job_highlights?.Qualifications?.[0] ||
        (job.job_description
            ? `${job.job_description.substring(0, 300)}${job.job_description.length > 300 ? '...' : ''}`
            : '');

    return {
        externalId,
        title: job.job_title || 'Untitled Position',
        company: job.employer_name || 'Unknown Company',
        location,
        description: job.job_description || '',
        descriptionSnippet,
        employmentType,
        isRemote: job.job_is_remote || false,
        salary,
        applyLink: job.job_apply_link || job.job_google_link || '#',
        companyLogo: job.employer_logo || null,
        postedAt: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : null,
        expiresAt: job.job_offer_expiration_datetime_utc ? new Date(job.job_offer_expiration_datetime_utc) : null,
        source: 'rapidapi-jsearch',
        sourceUrl: job.job_google_link || null,
        skills: job.job_required_skills || []
    };
};

/**
 * Check if API is configured and accessible
 */
export const checkApiHealth = async () => {
    if (!RAPIDAPI_KEY) {
        return { healthy: false, error: 'RAPIDAPI_KEY not configured' };
    }

    try {
        // Make a minimal test request
        await rapidApiClient.get('/search', {
            params: { query: 'test', page: '1', num_pages: '1' }
        });
        return { healthy: true };
    } catch (error) {
        return {
            healthy: false,
            error: error.response?.status === 429 ? 'Rate limited' : error.message
        };
    }
};

export default {
    searchJobs,
    checkApiHealth
};
