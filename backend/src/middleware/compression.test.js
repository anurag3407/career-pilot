import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import express from 'express';
import compressionMiddleware from './compression.js';

const app = express();
app.use(compressionMiddleware);
app.get('/test', (req, res) => {
  res.json({ data: 'x'.repeat(2000) });
});

describe('Compression Middleware', () => {
  it('should compress response when Accept-Encoding is gzip', async () => {
    const res = await request(app)
      .get('/test')
      .set('Accept-Encoding', 'gzip');
    assert.strictEqual(res.headers['content-encoding'], 'gzip');
  });

  it('should skip compression when x-no-compression header is set', async () => {
    const res = await request(app)
      .get('/test')
      .set('x-no-compression', 'true');
    assert.strictEqual(res.headers['content-encoding'], undefined);
  });

  it('should return valid JSON after decompression', async () => {
    const res = await request(app)
      .get('/test')
      .set('Accept-Encoding', 'gzip');
    assert.ok('data' in res.body);
  });
});