#!/usr/bin/env node
/**
 * Post-deploy smoke test for the Cloudflare Pages + Worker deployment.
 *
 * Checks:
 *   1. The Pages deployment serves the exact hashed JS bundle from
 *      frontend/dist/index.html (retries while the deployment propagates).
 *   2. The gateway Worker /v1/health returns ok:true with D1 ready.
 *
 * Env:
 *   PAGES_URL   Pages deployment URL  (default https://careerpilot-20i.pages.dev)
 *   WORKER_URL  Worker origin         (default https://careerpilot-gateway.anuragmishra3407.workers.dev)
 *   DIST_DIR    built frontend dir    (default <repo>/frontend/dist)
 *   ATTEMPTS    Pages propagation attempts (default 12)
 *   DELAY_MS    delay between attempts in ms (default 10000)
 *
 * Run locally after a deploy: `node scripts/verify-deploy.mjs`
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const distDir = process.env.DIST_DIR || path.resolve(here, '../frontend/dist');
const pagesUrl = (process.env.PAGES_URL || 'https://careerpilot-20i.pages.dev').replace(/\/$/, '');
const workerUrl = (process.env.WORKER_URL || 'https://careerpilot-gateway.anuragmishra3407.workers.dev').replace(/\/$/, '');
const attempts = Number(process.env.ATTEMPTS || 12);
const delayMs = Number(process.env.DELAY_MS || 10000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function error(message) {
  console.error(`::error::${message}`);
  process.exitCode = 1;
}

async function waitForPagesAsset(assetPath) {
  let lastError = 'no response yet';

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(pagesUrl, { headers: { 'cache-control': 'no-cache' } });
      const body = await response.text();
      if (response.ok && body.includes(assetPath)) {
        console.log(`Pages is serving ${assetPath} (attempt ${attempt}/${attempts})`);
        return true;
      }
      lastError = `HTTP ${response.status}; asset reference not found`;
    } catch (err) {
      lastError = err.message;
    }

    console.log(`Waiting for Pages deployment (${attempt}/${attempts}): ${lastError}`);
    if (attempt < attempts) await sleep(delayMs);
  }

  error(`Pages at ${pagesUrl} did not serve ${assetPath} after ${attempts} attempts (${lastError})`);
  return false;
}

async function checkWorkerHealth() {
  let lastError = 'no response yet';

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      const response = await fetch(`${workerUrl}/v1/health`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const health = await response.json();
      if (health.ok !== true) throw new Error(`ok=${JSON.stringify(health.ok)}`);
      if (health.d1 !== true) throw new Error('D1 binding is not ready');
      console.log(
        `Worker healthy: d1=${health.d1} tables=${health.tables} imagekit=${health.imagekit}`
      );
      return;
    } catch (err) {
      lastError = err.message;
      if (attempt < 5) await sleep(5000);
    }
  }

  error(`Worker health check failed at ${workerUrl}/v1/health: ${lastError}`);
}

const indexPath = path.join(distDir, 'index.html');
let index;
try {
  index = await readFile(indexPath, 'utf8');
} catch (err) {
  error(`Cannot read built index at ${indexPath}: ${err.message}`);
  process.exit(1);
}

const assetMatch = index.match(/\/assets\/index-[A-Za-z0-9_-]+\.js/);
if (!assetMatch) {
  error(`No hashed /assets/index-*.js reference found in ${indexPath}`);
  process.exit(1);
}

const pagesOk = await waitForPagesAsset(assetMatch[0]);
await checkWorkerHealth();

if (pagesOk && !process.exitCode) {
  console.log('Deployment verified.');
}
if (process.exitCode) process.exit(process.exitCode);
