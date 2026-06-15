import { describe, it, expect } from 'vitest';
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
    expect(res.headers['content-encoding']).toBe('gzip');
  });

  it('should skip compression when x-no-compression header is set', async () => {
    const res = await request(app)
      .get('/test')
      .set('x-no-compression', 'true');
    expect(res.headers['content-encoding']).toBeUndefined();
  });

  it('should return valid JSON after decompression', async () => {
    const res = await request(app)
      .get('/test')
      .set('Accept-Encoding', 'gzip');
    expect(res.body).toHaveProperty('data');
  });
});