import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import express from 'express';
import { cspHeaders } from '../../src/middleware/cspHeaders.js';

describe('CSP Headers Middleware', () => {
  let server;
  let port;

  before(async () => {
    const app = express();
    app.use(cspHeaders);
    app.get('/test', (req, res) => {
      res.json({ success: true });
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

  it('should apply security headers', async () => {
    const res = await new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: '/test',
          method: 'GET',
        },
        resolve
      );
      req.on('error', reject);
      req.end();
    });

    assert.ok(res.headers['content-security-policy']);
    assert.strictEqual(
      res.headers['cross-origin-resource-policy'],
      'cross-origin'
    );
    assert.strictEqual(
      res.headers['cross-origin-opener-policy'],
      'same-origin-allow-popups'
    );
  });
});
