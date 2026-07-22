import assert from 'assert';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { optimizeBuffer } from '../imageOptimizer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SAMPLE = path.resolve(__dirname, '../../../tests/fixtures/sample.jpg');

async function testOptimizeVariants() {
  let buffer;
  try {
    buffer = await fs.readFile(SAMPLE);
  } catch (e) {
    if (e && typeof e === 'object' && e.code === 'ENOENT') {
      throw new Error(`Test fixture not found: ${SAMPLE}. Please add a sample.jpg to tests/fixtures/`);
    }
    throw e;
  }

  const res = await optimizeBuffer(buffer, { widths: [null, 100], formats: ['webp', 'jpeg'], quality: 70 });
  assert.ok(res.webp, 'expected webp key');
  assert.ok(res['webp_100'], 'expected webp_100 key');
  assert.ok(res.jpeg, 'expected jpeg key');
  assert.ok(res['jpeg_100'], 'expected jpeg_100 key');
  assert.ok(res.webp.length > 0);
  assert.ok(res['webp_100'].length > 0);
}

async function testInvalidInput() {
  let threw = false;
  try {
    // @ts-ignore
    await optimizeBuffer('not-a-buffer');
  } catch (e) {
    threw = true;
    assert.ok(e instanceof TypeError);
  }
  if (!threw) throw new Error('expected optimizeBuffer to throw on invalid input');
}

(async () => {
  try {
    console.log('Running imageOptimizer tests...');
    await testOptimizeVariants();
    console.log('  testOptimizeVariants passed');
    await testInvalidInput();
    console.log('  testInvalidInput passed');
    console.log('All tests passed');
    process.exit(0);
  } catch (err) {
    console.error('Tests failed:', err);
    process.exit(1);
  }
})();
