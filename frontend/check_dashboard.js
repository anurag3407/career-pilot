import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
    } else {
      console.log('PAGE LOG:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE ERROR EXCEPTION:', error.message);
  });

  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0', timeout: 30000 });
  
  const title = await page.title();
  console.log('Page Title:', title);
  
  const bodyHandle = await page.$('body');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  console.log('Body HTML length:', html.length);
  if (html.length < 500) {
    console.log('Body HTML:\n', html);
  }
  
  await browser.close();
})();
