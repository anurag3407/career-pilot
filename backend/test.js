import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { enhanceResume } from './src/config/langchain.js';
import axios from 'axios';
import { getQueueStats } from './src/services/jobAlertQueue.js';

// ─── Result Store ─────────────────────────────────────────────────────────────

const results = [];

async function runTest(name, fn) {
  console.log(`\n🔄 ${name}`);
  const start = performance.now();
  try {
    const detail = await fn();
    const ms = Math.round(performance.now() - start);
    console.log(`✅ Passed (${ms}ms)${detail ? ' — ' + detail : ''}`);
    results.push({ name, status: 'PASS', detail: detail ?? '', durationMs: ms });
  } catch (err) {
    const ms = Math.round(performance.now() - start);
    const message = String(err.response?.data?.message ?? err.message ?? 'Unknown error');
    console.error(`❌ Failed (${ms}ms) — ${message}`);
    results.push({ name, status: 'FAIL', detail: message, durationMs: ms });
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function runTests() {
  console.log('─'.repeat(68));
  console.log(' INTEGRATION TESTS — ' + new Date().toLocaleString());
  console.log('─'.repeat(68));

  // 1. MONGODB
  await runTest('MongoDB', async () => {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await mongoose.disconnect();
    return 'Connection closed cleanly';
  });

  // 2. REDIS
  await runTest('Redis (BullMQ)', async () => {
  const stats = await getQueueStats();
  if (!stats.available) {
    throw new Error(`Redis unavailable — ${stats.reason ?? 'no reason provided'}`);
  }
  return `waiting=${stats.waiting} active=${stats.active} completed=${stats.completed}`;
});

  // 3. AI / LANGCHAIN
  await runTest('AI Service (Gemini)', async () => {
    const mockResume = "Software Engineer with 2 years of experience. Developed React apps.";
    const result = await enhanceResume(mockResume, {
      jobRole: 'Frontend Developer',
      yearsOfExperience: '2',
      skills: ['React', 'JavaScript'],
    });
    return `provider=${result.provider} tokens=${JSON.stringify(result.tokensUsed)}`;
  });

  // 4. RAPIDAPI
  await runTest('RapidAPI (JSearch)', async () => {
    const response = await axios.request({
      method: 'GET',
      url: `https://${process.env.RAPIDAPI_HOST}/search`,
      params: { query: 'developer', page: '1', num_pages: '1' },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
      timeout: 8000,
    });
    return `Found ${response.data?.data?.length ?? 0} jobs`;
  });

  // ─── Summary Table ───────────────────────────────────────────────────────────

  const col = (str, w) => str.toString().padEnd(w);
  const LINE = '─'.repeat(68);

  console.log(`\n${LINE}`);
  console.log(` ${col('Service', 22)} ${col('Status', 8)} ${col('Time', 8)} Detail`);
  console.log(LINE);

  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : '❌';
    const detail = String(r.detail ?? '');
    const trimmed = detail.length > 28 ? detail.slice(0, 25) + '...' : detail;
    console.log(` ${col(r.name, 22)} ${icon} ${col(r.status, 5)} ${col(r.durationMs + 'ms', 8)} ${trimmed }`);
  }

  const passed = results.filter(r => r.status === 'PASS').length;
  const totalMs = results.reduce((sum, r) => sum + r.durationMs, 0);
  const failed = results.filter(r => r.status === 'FAIL').length;

  console.log(`${LINE}`);
  console.log(` Result: ${passed}/${results.length} passed  |  Total: ${totalMs}ms`);
  console.log(`${LINE}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});