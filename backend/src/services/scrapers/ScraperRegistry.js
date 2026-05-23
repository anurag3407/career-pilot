import { BaseScraper } from './BaseScraper.js';

/**
 * Registry and factory manager for all job scrapers.
 * Allows modular registration of new scraper engines (e.g. LinkedIn, Indeed, Naukri)
 * and orchestrates multi-source scraping runs concurrently with granular error-isolation.
 */
export class ScraperRegistry {
    constructor() {
        this.scrapers = new Map();
    }

    /**
     * Registers a new scraper instance in the system.
     * @param {BaseScraper} scraperInstance - An instance of a class extending BaseScraper
     * @throws {Error} If the scraper is invalid or has a duplicate name
     */
    register(scraperInstance) {
        if (!scraperInstance) {
            throw new Error('Cannot register an empty or null scraper.');
        }

        // Verify interface conformity
        if (!(scraperInstance instanceof BaseScraper) && (typeof scraperInstance.scrape !== 'function' || !scraperInstance.name)) {
            throw new Error('Registered scraper must extend BaseScraper or conform to its interface.');
        }

        const name = scraperInstance.name.toLowerCase().trim();
        
        if (this.scrapers.has(name)) {
            console.warn(`[SCRAPER_REGISTRY] ⚠️ Overwriting already registered scraper: ${name.toUpperCase()}`);
        }

        this.scrapers.set(name, scraperInstance);
        console.log(`[SCRAPER_REGISTRY] 🔌 Registered modular scraper: ${name.toUpperCase()}`);
    }

    /**
     * Retrieves a registered scraper by its unique source name.
     * @param {string} name - Scraper source name
     * @returns {BaseScraper|undefined} The registered scraper instance
     */
    getScraper(name) {
        if (!name) return undefined;
        return this.scrapers.get(name.toLowerCase().trim());
    }

    /**
     * Checks if a scraper is registered for the specified source.
     * @param {string} name - Scraper source name
     * @returns {boolean} True if registered
     */
    hasScraper(name) {
        if (!name) return false;
        return this.scrapers.has(name.toLowerCase().trim());
    }

    /**
     * Unregisters a scraper instance by name.
     * @param {string} name - Scraper source name
     * @returns {boolean} True if successfully removed
     */
    unregister(name) {
        if (!name) return false;
        const normalized = name.toLowerCase().trim();
        const existed = this.scrapers.has(normalized);
        this.scrapers.delete(normalized);
        if (existed) {
            console.log(`[SCRAPER_REGISTRY] 🔌 Unregistered scraper: ${normalized.toUpperCase()}`);
        }
        return existed;
    }

    /**
     * Lists all registered scraper source names.
     * @returns {Array<string>} List of scraper names
     */
    listScrapers() {
        return Array.from(this.scrapers.keys());
    }

    /**
     * Clears all registered scrapers from registry.
     */
    clear() {
        this.scrapers.clear();
        console.log('[SCRAPER_REGISTRY] 🔌 Cleared all scrapers.');
    }

    /**
     * Runs multiple scrapers concurrently to fetch jobs, aggregates their listings,
     * isolates individual scraper failures so they don't break the entire call,
     * and reports detailed execution statistics.
     * 
     * @param {Object} searchParams - General search terms (query, location, etc.)
     * @param {Array<string>} [selectedSources=[]] - Optional list of specific source names to run.
     *                                               If empty, runs ALL registered scrapers.
     * @returns {Promise<Object>} Object containing compiled jobs and telemetry results
     */
    async scrapeAll(searchParams = {}, selectedSources = []) {
        const startTime = Date.now();
        console.log(`[SCRAPER_REGISTRY] 🚀 Initiating multi-source job fetching. Params: ${JSON.stringify(searchParams)}`);

        // Determine which scrapers to run
        let targets = [];
        if (Array.isArray(selectedSources) && selectedSources.length > 0) {
            targets = selectedSources
                .map(src => src.toLowerCase().trim())
                .map(srcName => {
                    const scraper = this.scrapers.get(srcName);
                    if (!scraper) {
                        console.warn(`[SCRAPER_REGISTRY] ⚠️ Requested scraper "${srcName}" is not registered. Skipping.`);
                    }
                    return scraper;
                })
                .filter(Boolean);
        } else {
            targets = Array.from(this.scrapers.values());
        }

        if (targets.length === 0) {
            console.log('[SCRAPER_REGISTRY] 📭 No active scrapers matched for this request.');
            return {
                jobs: [],
                stats: {
                    totalFound: 0,
                    durationMs: Date.now() - startTime,
                    sources: {}
                }
            };
        }

        console.log(`[SCRAPER_REGISTRY] ⚡ Executing ${targets.length} scrapers concurrently: ${targets.map(t => t.name.toUpperCase()).join(', ')}`);

        // Execute all matched scrapers concurrently (with error-isolation)
        const scrapePromises = targets.map(scraper => scraper.scrape(searchParams));
        const results = await Promise.allSettled(scrapePromises);

        const aggregatedJobs = [];
        const sourceStats = {};

        results.forEach((promiseResult, index) => {
            const scraper = targets[index];
            const sourceName = scraper.name;

            if (promiseResult.status === 'fulfilled') {
                const runSummary = promiseResult.value;
                sourceStats[sourceName] = {
                    success: runSummary.success,
                    count: runSummary.count,
                    durationMs: runSummary.durationMs,
                    ...(runSummary.error ? { error: runSummary.error } : {})
                };

                if (runSummary.success && Array.isArray(runSummary.jobs)) {
                    aggregatedJobs.push(...runSummary.jobs);
                }
            } else {
                // This covers extreme unhandled promise rejections inside the scrape method
                const errorReason = promiseResult.reason?.message || String(promiseResult.reason);
                console.error(`[SCRAPER_REGISTRY] 🚨 Severe unhandled error executing ${sourceName.toUpperCase()}:`, promiseResult.reason);
                
                sourceStats[sourceName] = {
                    success: false,
                    count: 0,
                    durationMs: Date.now() - startTime,
                    error: `Unhandled exception: ${errorReason}`
                };
            }
        });

        const totalDuration = Date.now() - startTime;
        console.log(`[SCRAPER_REGISTRY] 🎉 Finished multi-source scrape in ${totalDuration}ms. Aggregated ${aggregatedJobs.length} unique jobs.`);

        return {
            jobs: aggregatedJobs,
            stats: {
                totalFound: aggregatedJobs.length,
                durationMs: totalDuration,
                sources: sourceStats
            }
        };
    }
}

// Export singleton instance as default
const defaultRegistry = new ScraperRegistry();
export default defaultRegistry;
export { defaultRegistry as scraperRegistry };
