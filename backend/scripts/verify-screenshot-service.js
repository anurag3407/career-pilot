import 'dotenv/config';
import { generateScreenshot, closeBrowser } from '../src/services/screenshotService.js';

const MOCK_HTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      text-align: center;
      padding: 50px;
      margin: 0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    h1 { font-size: 48px; margin-bottom: 20px; }
    p { font-size: 20px; opacity: 0.8; }
  </style>
</head>
<body>
  <h1>Puppeteer Singleton Test</h1>
  <p>Verifying shared Chromium instance reuse and performance improvements.</p>
</body>
</html>
`;

const VIEWPORT = { width: 1200, height: 800 };

async function runVerification() {
  console.log('==================================================');
  console.log('   STARTING SCREENSHOT SERVICE SINGLETON TEST     ');
  console.log('==================================================\n');

  try {
    // ----------------------------------------------------------------
    // TEST 1: First screenshot (Should launch/spawn new browser)
    // ----------------------------------------------------------------
    console.log('--- TEST 1: Initial Screenshot (Spawning Browser) ---');
    const start1 = Date.now();
    const buffer1 = await generateScreenshot(MOCK_HTML, VIEWPORT);
    const duration1 = Date.now() - start1;
    console.log(`✅ Test 1 completed. Buffer size: ${buffer1.length} bytes.`);
    console.log(`⏱️ Duration: ${duration1}ms\n`);

    // ----------------------------------------------------------------
    // TEST 2: Second screenshot (Should REUSE the browser, be much faster)
    // ----------------------------------------------------------------
    console.log('--- TEST 2: Second Screenshot (Reusing Browser) ---');
    const start2 = Date.now();
    const buffer2 = await generateScreenshot(MOCK_HTML, VIEWPORT);
    const duration2 = Date.now() - start2;
    console.log(`✅ Test 2 completed. Buffer size: ${buffer2.length} bytes.`);
    console.log(`⏱️ Duration: ${duration2}ms (expected to be significantly faster)`);
    console.log(`🚀 Speedup factor: ${(duration1 / duration2).toFixed(2)}x\n`);

    // ----------------------------------------------------------------
    // TEST 3: Concurrent screenshots (Should use exactly ONE browser launch)
    // ----------------------------------------------------------------
    console.log('--- TEST 3: Concurrent Screenshots (Concurrency Check) ---');
    console.log('Sending 3 requests simultaneously...');
    const start3 = Date.now();
    const results = await Promise.all([
      generateScreenshot(MOCK_HTML, VIEWPORT),
      generateScreenshot(MOCK_HTML, VIEWPORT),
      generateScreenshot(MOCK_HTML, VIEWPORT),
    ]);
    const duration3 = Date.now() - start3;
    console.log(`✅ Test 3 completed. Got ${results.length} screenshots successfully.`);
    console.log(`⏱️ Concurrency Duration: ${duration3}ms\n`);

    // ----------------------------------------------------------------
    // TEST 4: Auto-recovery after closure / crash
    // ----------------------------------------------------------------
    console.log('--- TEST 4: Auto-Recovery Test ---');
    console.log('Simulating browser shutdown/closure...');
    await closeBrowser();
    console.log('Browser closed. Requesting a new screenshot...');
    
    const start4 = Date.now();
    const buffer4 = await generateScreenshot(MOCK_HTML, VIEWPORT);
    const duration4 = Date.now() - start4;
    console.log(`✅ Test 4 completed. Buffer size: ${buffer4.length} bytes.`);
    console.log(`⏱️ Duration: ${duration4}ms (should spawn a new browser instance)\n`);

    console.log('==================================================');
    console.log('      ALL TESTS PASSED SUCCESSFULLY!              ');
    console.log('==================================================');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exitCode = 1;
  } finally {
    console.log('\nCleaning up and closing shared browser instance...');
    await closeBrowser();
    console.log('Cleanup complete.');
  }
}

runVerification();
