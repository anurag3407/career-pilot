import { BaseScraper } from './BaseScraper.js';
import { ScraperRegistry, scraperRegistry } from './ScraperRegistry.js';
import { NaukriScraper } from './naukriScraper.js';

// Auto-register concrete scrapers into the singleton registry
scraperRegistry.register(new NaukriScraper());

export {
    BaseScraper,
    ScraperRegistry,
    scraperRegistry,
    NaukriScraper
};

export default scraperRegistry;
