const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://devpatel-freelancer.netlify.app', { waitUntil: 'networkidle2' });
    
    // Extract design tokens, classes, and structure
    const designInfo = await page.evaluate(() => {
      const getStyles = (element) => {
        if (!element) return null;
        const style = window.getComputedStyle(element);
        return {
          bg: style.backgroundColor,
          color: style.color,
          font: style.fontFamily,
          padding: style.padding,
          margin: style.margin,
          border: style.borderRadius
        };
      };

      const body = document.body;
      const h1 = document.querySelector('h1');
      const sections = Array.from(document.querySelectorAll('section')).map(s => ({
        id: s.id || s.className,
        bg: window.getComputedStyle(s).backgroundColor
      }));
      
      const links = Array.from(document.querySelectorAll('a')).map(a => window.getComputedStyle(a).color);
      const uniqueLinkColors = [...new Set(links)];

      return {
        body: getStyles(body),
        h1: getStyles(h1),
        sections,
        linkColors: uniqueLinkColors,
        html: document.body.innerHTML.substring(0, 2000) // snippet of HTML for structure
      };
    });

    console.log(JSON.stringify(designInfo, null, 2));
  } catch (error) {
    console.error('Error fetching page:', error);
  } finally {
    await browser.close();
  }
})();
