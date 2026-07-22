/* eslint-env browser */
/**
 * AngelList / Wellfound Startup Job Scraper
 * -----------------------------------------
 * Scrapes startup job listings from Wellfound (formerly AngelList Talent).
 * Extracts job listings, company funding stage info, and equity data.
 *
 * Uses Puppeteer for headless browser scraping since Wellfound is a
 * JavaScript-rendered (SPA) site that cannot be scraped with plain HTTP requests.
 *
 * Tasks covered:
 *  ✅ Job listing extraction
 *  ✅ Company funding stage info
 *  ✅ Equity data parsing
 */

const puppeteer = require("puppeteer");

// Base URL for Wellfound job search
const WELLFOUND_BASE_URL = "https://wellfound.com/jobs";

/**
 * Launches a headless Puppeteer browser instance.
 * @returns {Promise<Browser>} Puppeteer browser instance
 */
async function launchBrowser() {
    return puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
        ],
    });
}

/**
 * Parses equity string like "0.01% – 0.1%" into min/max numbers.
 * Returns null values if equity info is not available.
 *
 * @param {string} equityStr - Raw equity string from the page
 * @returns {{ min: number|null, max: number|null, raw: string }}
 */
function parseEquity(equityStr) {
    if (!equityStr || equityStr.trim() === "" || equityStr === "No equity") {
        return { min: null, max: null, raw: equityStr || "Not specified" };
    }

    // Match patterns like "0.01% – 0.5%" or "0.1%"
    const matches = equityStr.match(/[\d.]+/g);
    if (!matches) return { min: null, max: null, raw: equityStr };

    return {
        min: parseFloat(matches[0]) || null,
        max: parseFloat(matches[1]) || null,
        raw: equityStr.trim(),
    };
}

/**
 * Normalizes funding stage strings into a standard set of values.
 *
 * @param {string} stage - Raw funding stage string from the page
 * @returns {string} Normalized funding stage
 */
function normalizeFundingStage(stage) {
    if (!stage) return "Unknown";

    const normalized = stage.toLowerCase().trim();

    if (normalized.includes("pre-seed") || normalized.includes("pre seed"))
        return "Pre-Seed";
    if (normalized.includes("seed")) return "Seed";
    if (normalized.includes("series a")) return "Series A";
    if (normalized.includes("series b")) return "Series B";
    if (normalized.includes("series c")) return "Series C";
    if (normalized.includes("series d") || normalized.includes("series e+"))
        return "Series D+";

    if (normalized.includes("ipo") || normalized.includes("public")) return "IPO";
    if (normalized.includes("acquired")) return "Acquired";
    if (normalized.includes("bootstrapped")) return "Bootstrapped";

    return stage.trim();
}

/**
 * Scrapes job listings from Wellfound based on a search role and optional location.
 *
 * @param {Object} options - Search options
 * @param {string} options.role - Job role to search for (e.g. "software engineer")
 * @param {string} [options.location] - Optional location filter (e.g. "remote", "san francisco")
 * @param {number} [options.maxJobs=20] - Maximum number of jobs to return
 * @returns {Promise<Array<Object>>} Array of scraped job objects
 *
 * @example
 * const jobs = await scrapeWellfoundJobs({ role: "backend engineer", location: "remote", maxJobs: 10 });
 */
async function scrapeWellfoundJobs({ role = "", location = "", maxJobs = 20 } = {}) {
    let browser;

    try {
        browser = await launchBrowser();
        const page = await browser.newPage();

        // Set a realistic user agent to avoid bot detection
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        // Build search URL with query params
        const params = new URLSearchParams();
        if (role) params.set("q", role);
        if (location) params.set("l", location);

        const searchUrl = `${WELLFOUND_BASE_URL}?${params.toString()}`;
        console.log(`[AngelListScraper] Navigating to: ${searchUrl}`);

        await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 30000 });

        // Wait for job cards to load
        await page.waitForSelector('[data-test="StartupResult"]', { timeout: 15000 }).catch(() => {
            console.warn("[AngelListScraper] Job cards selector timed out — page structure may have changed.");
        });

        // Scroll to load more jobs (Wellfound uses infinite scroll)
        await autoScroll(page, maxJobs);

        // Extract job data from the page
        const jobs = await page.evaluate((maxJobs) => {
            const results = [];

            // Each startup card contains multiple job listings
            const startupCards = document.querySelectorAll('[data-test="StartupResult"]');

            for (const card of startupCards) {
                if (results.length >= maxJobs) break;

                // --- Company Info ---
                const companyName =
                    card.querySelector('[data-test="startup-name"]')?.innerText?.trim() ||
                    card.querySelector(".styles_companyName__AYpn3")?.innerText?.trim() ||
                    "Unknown Company";

                const companyLogo =
                    card.querySelector("img[alt]")?.src || null;

                const companyDescription =
                    card.querySelector('[data-test="startup-pitch"]')?.innerText?.trim() ||
                    card.querySelector(".startupDescription")?.innerText?.trim() ||
                    "";

                // --- Funding Stage ---
                const fundingRaw =
                    card.querySelector('[data-test="company-stage"]')?.innerText?.trim() ||
                    card.querySelector(".styles_fundingStage__UbhCl")?.innerText?.trim() ||
                    "";

                // --- Job Listings within this card ---
                const jobRows = card.querySelectorAll('[data-test="job-listing"]');

                if (jobRows.length === 0) {
                    // Some cards don't have explicit job-listing elements; skip them
                    continue;
                }

                for (const jobRow of jobRows) {
                    if (results.length >= maxJobs) break;

                    const jobTitle =
                        jobRow.querySelector('[data-test="job-title"]')?.innerText?.trim() ||
                        jobRow.querySelector("a")?.innerText?.trim() ||
                        "Unknown Role";

                    const jobUrl =
                        jobRow.querySelector("a")?.href || "";

                    const locationText =
                        jobRow.querySelector('[data-test="job-location"]')?.innerText?.trim() ||
                        jobRow.querySelector(".styles_location__JRZpY")?.innerText?.trim() ||
                        "";

                    const salaryText =
                        jobRow.querySelector('[data-test="job-compensation"]')?.innerText?.trim() ||
                        jobRow.querySelector(".styles_compensation__yYiyF")?.innerText?.trim() ||
                        "";

                    const equityText =
                        jobRow.querySelector('[data-test="job-equity"]')?.innerText?.trim() ||
                        jobRow.querySelector(".styles_equity__j1sGQ")?.innerText?.trim() ||
                        "";

                    results.push({
                        jobTitle,
                        jobUrl,
                        location: locationText,
                        salary: salaryText || "Not specified",
                        equityRaw: equityText,
                        fundingStageRaw: fundingRaw,
                        companyName,
                        companyLogo,
                        companyDescription,
                    });
                }
            }

            return results;
        }, maxJobs);

        // Post-process: normalize funding stage and parse equity
        const processed = jobs.map((job) => ({
            jobTitle: job.jobTitle,
            jobUrl: job.jobUrl,
            location: job.location,
            salary: job.salary,
            equity: parseEquity(job.equityRaw),
            fundingStage: normalizeFundingStage(job.fundingStageRaw),
            company: {
                name: job.companyName,
                logo: job.companyLogo,
                description: job.companyDescription,
                fundingStage: normalizeFundingStage(job.fundingStageRaw),
            },
            source: "Wellfound",
            scrapedAt: new Date().toISOString(),
        }));

        console.log(`[AngelListScraper] Scraped ${processed.length} jobs successfully.`);
        return processed;

    } catch (error) {
        console.error("[AngelListScraper] Error during scraping:", error.message);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
}

/**
 * Auto-scrolls the page to trigger lazy-loaded content.
 * Stops early if enough jobs are visible.
 *
 * @param {Page} page - Puppeteer page instance
 * @param {number} targetCount - Stop scrolling when this many job cards are visible
 */
async function autoScroll(page, targetCount = 20) {
    await page.evaluate(async (targetCount) => {
        await new Promise((resolve) => {
            const distance = 400;
            let stagnantTicks = 0;
            let lastJobCount = 0;
            let ticks = 0;
            const maxTicks = 120;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                const jobCount = document.querySelectorAll('[data-test="StartupResult"]').length;
                ticks += 1;
                if (jobCount > lastJobCount) {
                    lastJobCount = jobCount;
                    stagnantTicks = 0;
                } else {
                    stagnantTicks += 1;
                }
                if (jobCount >= targetCount || stagnantTicks >= 8 || ticks >= maxTicks) {
                    clearInterval(timer);
                    resolve();
                }
            }, 300);
        });
    }, targetCount);
}

module.exports = {
    scrapeWellfoundJobs,
    parseEquity,
    normalizeFundingStage,
};
