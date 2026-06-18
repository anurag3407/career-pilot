#!/usr/bin/env node
/**
 * generate-previews.mjs
 * 
 * Launches Puppeteer, navigates to each template's /preview/:id route,
 * waits for the hero section to render, and saves a 1280×800 screenshot
 * to public/template-previews/<id>.png.
 *
 * Usage:
 *   1. Start the dev server:  npm run dev
 *   2. Run this script:       node scripts/generate-previews.mjs
 *
 * Options:
 *   --only=Template_Name    Generate for a single template
 *   --force                 Overwrite existing screenshots
 *   --port=5173             Dev server port (default 5173)
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREVIEW_DIR = path.resolve(__dirname, '..', 'public', 'template-previews');
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'src', 'components', 'portfolio', 'templates');

// Parse CLI args
const args = process.argv.slice(2);
const only = args.find(a => a.startsWith('--only='))?.split('=')[1];
const force = args.includes('--force');
const port = args.find(a => a.startsWith('--port='))?.split('=')[1] || '5173';
const BASE_URL = `http://localhost:${port}`;

// Get all template folder names
function getTemplateFolders() {
  return fs.readdirSync(TEMPLATES_DIR).filter(name => {
    const fullPath = path.join(TEMPLATES_DIR, name);
    if (!fs.statSync(fullPath).isDirectory()) return false;
    // Must have an index.jsx
    return fs.existsSync(path.join(fullPath, 'index.jsx'));
  });
}

async function generateScreenshot(browser, templateId) {
  const outputPath = path.join(PREVIEW_DIR, `${templateId}.png`);

  if (!force && fs.existsSync(outputPath)) {
    console.log(`  ⏭  ${templateId} — already exists, skipping`);
    return 'skipped';
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  try {
    const url = `${BASE_URL}/preview/${templateId}`;
    console.log(`  📸 ${templateId} — navigating...`);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for React Suspense to resolve (the loading fallback disappears)
    await page.waitForFunction(
      () => !document.querySelector('[class*="animate-spin"]'),
      { timeout: 10000 }
    ).catch(() => {});

    // Give animations a moment to settle
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1280, height: 800 },
    });

    console.log(`  ✅ ${templateId} — saved`);
    await page.close();
    return 'success';
  } catch (err) {
    console.error(`  ❌ ${templateId} — failed: ${err.message}`);
    await page.close();
    return 'failed';
  }
}

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });

  const allTemplates = getTemplateFolders();
  const templates = only ? allTemplates.filter(t => t === only) : allTemplates;

  if (templates.length === 0) {
    console.error('No templates found' + (only ? ` matching "${only}"` : ''));
    process.exit(1);
  }

  console.log(`\n🏎️  Generating preview screenshots for ${templates.length} templates\n`);
  console.log(`   Output: ${PREVIEW_DIR}`);
  console.log(`   Server: ${BASE_URL}`);
  console.log(`   Force:  ${force}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const results = { success: 0, skipped: 0, failed: 0 };

  // Process in batches of 4 to avoid overwhelming the browser
  const BATCH_SIZE = 4;
  for (let i = 0; i < templates.length; i += BATCH_SIZE) {
    const batch = templates.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(id => generateScreenshot(browser, id))
    );
    batchResults.forEach(r => results[r]++);
  }

  await browser.close();

  console.log(`\n🏁  Done!`);
  console.log(`   ✅ ${results.success} generated`);
  console.log(`   ⏭  ${results.skipped} skipped (use --force to regenerate)`);
  console.log(`   ❌ ${results.failed} failed\n`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
