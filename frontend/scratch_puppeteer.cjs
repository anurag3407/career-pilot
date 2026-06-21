const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', err => {
    console.log('BROWSER PAGE ERROR:', err.toString());
  });

  try {
    await page.goto('http://localhost:5173/templates', { waitUntil: 'domcontentloaded', timeout: 30000 });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }
  
  try {
    // Scroll to the bottom to ensure the new template is visible
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait for a moment to let animations settle
    await new Promise(r => setTimeout(r, 2000));
    
    // Take the screenshot
    await page.screenshot({ path: 'public/templates/Broken_Glass_Shards_Parallax.png', fullPage: true });
    console.log('Screenshot saved successfully!');
  } catch (e) {
    console.log('Screenshot error:', e.message);
  }
  
  await browser.close();
})();
