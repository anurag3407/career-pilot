import scraperRegistry from './index.js';

// CLI entry point
// Usage: node runScraperCli.js [scraper] [query] [location]
//   scraper  — registered scraper name: 'linkedin' | 'naukri' | 'angellist' (default: linkedin)
//   query    — job title / keyword              (default: 'Node.js Developer')
//   location — city, country, or 'Worldwide'   (default: 'India')
const run = async () => {
    const scraperName = (process.argv[2] || 'linkedin').toLowerCase();
    const query = process.argv[3] || 'Node.js Developer';
    const location = process.argv[4] || 'India';

    // Resolve the scraper instance from the shared registry
    const scraper = scraperRegistry.getScraper(scraperName);
    if (!scraper) {
        console.error(`\n❌ No scraper registered under the name "${scraperName}".`);
        console.error(`   Available scrapers: ${scraperRegistry.listScrapers().join(', ') || 'none'}`);
        process.exit(1);
    }

    console.log(`\n${'='.repeat(52)}`);
    console.log(`🚀  SCRAPER CLI — ${scraperName.toUpperCase()}`);
    console.log(`${'='.repeat(52)}`);
    console.log(`🎯  Search Query : "${query}"`);
    console.log(`📍  Location     : "${location}"`);
    console.log(`🔌  Scraper      : ${scraperName}`);
    console.log(`${'='.repeat(52)}\n`);

    try {
        console.log('⏳  Launching headless browser & running scraper...\n');

        const runSummary = await scraperRegistry.scrapeAll(
            { query, location, remoteOnly: false },
            [scraperName]
        );

        // ── Stats block ──────────────────────────────────────────────────────
        console.log(`\n${'='.repeat(52)}`);
        console.log(`📈  EXECUTION STATISTICS`);
        console.log(`${'='.repeat(52)}`);
        console.log(`⏱️   Duration       : ${runSummary.stats.durationMs}ms`);
        console.log(`💼  Total Jobs Found: ${runSummary.stats.totalFound}`);

        const sourceStats = runSummary.stats.sources[scraperName];
        if (sourceStats) {
            console.log(`📁  Source "${scraperName}":`);
            console.log(`    - Success : ${sourceStats.success ? '✅ YES' : '❌ NO'}`);
            console.log(`    - Count   : ${sourceStats.count}`);
            if (sourceStats.error) {
                console.log(`    - Error   : ${sourceStats.error}`);
            }
        }
        console.log(`${'='.repeat(52)}\n`);

        // ── Job listing block ────────────────────────────────────────────────
        if (runSummary.jobs && runSummary.jobs.length > 0) {
            console.log(`✨  EXTRACTED JOBS:`);
            console.log(`${'-'.repeat(52)}`);
            runSummary.jobs.forEach((job, index) => {
                const salaryText = job.salary?.min
                    ? `${job.salary.currency} ${job.salary.min.toLocaleString()}` +
                    (job.salary.max ? ` – ${job.salary.max.toLocaleString()}` : '') +
                    ` / ${job.salary.period}`
                    : 'Not Disclosed';

                console.log(`\n[${index + 1}] 💼  ${job.title.toUpperCase()}`);
                console.log(`    🏢  Company    : ${job.company}`);
                console.log(`    📍  Location   : ${job.location}`);
                console.log(`    🏷️   Type       : ${job.employmentType}`);
                console.log(`    🌐  Remote     : ${job.isRemote ? 'Yes' : 'No'}`);
                console.log(`    💰  Salary     : ${salaryText}`);
                console.log(`    📅  Posted At  : ${job.postedAt ? job.postedAt.toDateString() : 'Unknown'}`);
                console.log(`    🔑  Skills     : ${job.skills.length ? job.skills.join(', ') : '—'}`);
                console.log(`    🔗  Apply Link : ${job.applyLink}`);
            });
            console.log(`\n${'-'.repeat(52)}`);
        } else {
            console.log('📭  No jobs extracted. Possible causes: anti-bot block, auth wall, or zero results for this query.');
        }

    } catch (err) {
        console.error('🚨  Fatal runner error:', err);
    }
};

run().catch(console.error);

