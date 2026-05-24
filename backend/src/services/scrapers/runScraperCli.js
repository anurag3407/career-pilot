import scraperRegistry from './index.js';

// CLI entry point
const run = async () => {
    // Parse arguments or fall back to defaults
    const query = process.argv[2] || 'Node.js Developer';
    const location = process.argv[3] || 'Mumbai';

    console.log(`\n==================================================`);
    console.log(`🚀 RUNNING SCRAper REGISTRY CLI DEMONSTRATION`);
    console.log(`==================================================`);
    console.log(`🎯 Search Query : "${query}"`);
    console.log(`📍 Location     : "${location}"`);
    console.log(`🔌 Scrapers     : naukri`);
    console.log(`==================================================\n`);

    try {
        console.log('⏳ Running scrapers concurrently... (Launching headless browser)\n');
        
        // Run Naukri scraper dynamically via the Registry
        const runSummary = await scraperRegistry.scrapeAll(
            { query, location, remoteOnly: false }, 
            ['naukri']
        );

        console.log(`\n==================================================`);
        console.log(`📈 EXECUTION STATISTICS`);
        console.log(`==================================================`);
        console.log(`📊 Duration: ${runSummary.stats.durationMs}ms`);
        console.log(`💼 Total Jobs Found: ${runSummary.stats.totalFound}`);
        
        const naukriStats = runSummary.stats.sources.naukri;
        if (naukriStats) {
            console.log(`📁 Source 'naukri':`);
            console.log(`   - Success: ${naukriStats.success ? '✅ YES' : '❌ NO'}`);
            console.log(`   - Count  : ${naukriStats.count}`);
            if (naukriStats.error) {
                console.log(`   - Error  : ${naukriStats.error}`);
            }
        }
        console.log(`==================================================\n`);

        if (runSummary.jobs && runSummary.jobs.length > 0) {
            console.log(`✨ EXTRACTED JOBS LISTING:`);
            console.log(`--------------------------------------------------`);
            runSummary.jobs.forEach((job, index) => {
                console.log(`\n[${index + 1}] 💼 ${job.title.toUpperCase()}`);
                console.log(`    🏢 Company   : ${job.company}`);
                console.log(`    📍 Location  : ${job.location}`);
                console.log(`    💰 Salary    : ${job.salary.min ? `₹${job.salary.min.toLocaleString()} - ₹${job.salary.max.toLocaleString()} ${job.salary.period}` : 'Not Disclosed'}`);
                console.log(`    📅 Posted At : ${job.postedAt ? job.postedAt.toDateString() : 'Unknown'}`);
                console.log(`    🔑 Skills    : ${job.skills.join(', ')}`);
                console.log(`    🔗 Apply     : ${job.applyLink}`);
            });
            console.log(`\n--------------------------------------------------`);
        } else {
            console.log('📭 No jobs extracted. This could be due to search filters, network blocks, or anti-bot verification.');
        }

    } catch (err) {
        console.error('🚨 Severe runner failure:', err);
    }
};

run().catch(console.error);
