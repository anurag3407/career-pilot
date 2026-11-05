import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import express from 'express';
import compressionMiddleware from './compression.js';

describe('Compression Middleware', () => {
  let server;
  let port;

  before(async () => {
    const app = express();
    app.use(compressionMiddleware);
    app.get('/test', (req, res) => {
      res.json({ data: 'x'.repeat(2000) });
    });
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        port = server.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('should compress response when Accept-Encoding is gzip', async () => {
    const res = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: '/test',
          method: 'GET',
          headers: { 'Accept-Encoding': 'gzip' },
        },
        resolve
      );
      req.on('error', reject);
      req.end();
    });
    assert.strictEqual(res.headers['content-encoding'], 'gzip');
  });

  it('should skip compression when x-no-compression header is set', async () => {
    const res = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: '/test',
          method: 'GET',
          headers: {
            'Accept-Encoding': 'gzip',
            'x-no-compression': 'true',
          },
        },
        resolve
      );
      req.on('error', reject);
      req.end();
    });
    assert.strictEqual(res.headers['content-encoding'], undefined);
  });

  it('should return valid data', async () => {
    const res = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: '/test',
          method: 'GET',
          headers: { 'Accept-Encoding': 'identity' },
        },
        resolve
      );
      req.on('error', reject);
      req.end();
    });
    const chunks = [];
    for await (const chunk of res) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
    assert.strictEqual(body.data, 'x'.repeat(2000));
  });
});
