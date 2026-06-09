import { BaseScraper } from './BaseScraper.js';

/**
 * A highly configurable mock scraper extending BaseScraper.
 * Designed specifically to verify the modular scraper factory architecture:
 * - Tests normal data retrieval and parsing.
 * - Tests schema mapping and field validation (valid vs invalid formats).
 * - Tests temporary network failures and automatic retry recovery.
 * - Tests complete failures for registry isolation.
 */
export class MockScraper extends BaseScraper {
    /**
     * @param {string} [name='mock'] - Unique identifier for the mock scraper instance
     * @param {Object} [options={}] - Custom configuration options
     * @param {boolean} [options.shouldThrow=false] - If true, always throws during fetch
     * @param {number} [options.shouldFailFirstN=0] - Number of times to fail before succeeding
     * @param {Array<Object>} [options.customJobs=[]] - Custom mock jobs to return
     */
    constructor(name = 'mock', options = {}) {
        super(name, options);
        
        this.shouldThrow = options.shouldThrow || false;
        this.shouldFailFirstN = options.shouldFailFirstN || 0;
        this.customJobs = options.customJobs || [];
        this.callCount = 0;
    }

    /**
     * Simulates fetching raw data. Can be configured to simulate network errors or successes.
     */
    async fetchRawData(searchParams) {
        this.callCount++;
        this.log(`fetchRawData invoked. Call count: ${this.callCount}`);

        // 1. Simulate absolute failure
        if (this.shouldThrow) {
            throw new Error('Simulated critical scraper connection failure.');
        }

        // 2. Simulate temporary network rate-limiting or server errors for testing retries
        if (this.shouldFailFirstN > 0 && this.callCount <= this.shouldFailFirstN) {
            this.log(`Simulating temporary network error (Attempt ${this.callCount}/${this.shouldFailFirstN})`, 'warn');
            throw new Error('Temporary network connection timed out.');
        }

        // 3. Normal success path
        this.log('Raw mock data retrieved successfully.');
        return {
            status: 'ok',
            searchContext: searchParams,
            payload: this.customJobs.length > 0 ? this.customJobs : this.getDefaultMockJobs()
        };
    }

    /**
     * Simulates parsing raw data into standard shape listings.
     */
    async parse(rawData, searchParams) {
        this.log(`Parsing raw payload of size: ${rawData?.payload?.length || 0}`);
        
        if (!rawData || rawData.status !== 'ok') {
            throw new Error('Invalid raw data format returned from fetchRawData.');
        }

        // Return parsed array
        return rawData.payload;
    }

    /**
     * Provides a set of default mock jobs containing valid, invalid,
     * and non-standard structures to fully test the validation mapping.
     */
    getDefaultMockJobs() {
        return [
            // 1. Perfectly valid standard job
            {
                externalId: 'mock-job-001',
                title: 'Senior Software Engineer',
                company: 'InnovateCorp',
                location: 'San Francisco, CA',
                description: 'We are seeking a senior engineer proficient in Node.js and systems design.',
                descriptionSnippet: 'Node.js Senior role',
                employmentType: 'full-time',
                isRemote: false,
                salary: {
                    min: 120000,
                    max: 160000,
                    currency: 'USD',
                    period: 'yearly'
                },
                applyLink: 'https://example.com/apply/innovatecorp-001',
                companyLogo: 'https://example.com/logos/innovatecorp.png',
                postedAt: new Date('2026-05-18T10:00:00.000Z'),
                skills: ['Node.js', 'Express', 'MongoDB']
            },
            // 2. Non-standard values that require cleaning/normalization (e.g. employment type casing, date string)
            {
                externalId: 'mock-job-002',
                title: 'Frontend Developer Intern',
                company: 'WebCraft Studios',
                location: 'Remote',
                description: 'Join our team as a Frontend Developer Intern specializing in React.',
                employmentType: 'INTERNSHIP_ROLE', // needs mapping
                isRemote: true,
                salary: {
                    min: 40,
                    max: 50,
                    currency: 'USD',
                    period: 'hourly'
                },
                applyLink: ' https://example.com/apply/webcraft-002 ', // needs trimming
                postedAt: '2026-05-19T14:30:00Z', // string date needs parsing
                skills: ['React', 'CSS', 'JavaScript']
            },
            // 3. Invalid Job: Missing required field "company" (should be discarded by validator)
            {
                externalId: 'mock-job-003',
                title: 'Data Analyst',
                // Missing company name!
                location: 'Austin, TX',
                applyLink: 'https://example.com/apply/data-003'
            },
            // 4. Invalid Job: Missing required field "applyLink" (should be discarded)
            {
                externalId: 'mock-job-004',
                title: 'Backend Intern',
                company: 'TechHive',
                // Missing applyLink!
                location: 'Chicago, IL'
            }
        ];
    }
}
