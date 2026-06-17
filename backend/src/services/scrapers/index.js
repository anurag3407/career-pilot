import { BaseScraper } from './BaseScraper.js';
import { ScraperRegistry, scraperRegistry } from './ScraperRegistry.js';
import { NaukriScraper } from './naukriScraper.js';
import { LinkedInScraper } from './linkedinScraper.js';

// Auto-register concrete scrapers into the singleton registry
scraperRegistry.register(new NaukriScraper());
scraperRegistry.register(new LinkedInScraper());

export {
    BaseScraper,
    ScraperRegistry,
    scraperRegistry,
    NaukriScraper,
    LinkedInScraper,
};

export default scraperRegistry;
