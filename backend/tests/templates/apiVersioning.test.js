import test from 'node:test';
import assert from 'node:assert';
import express from 'express';
import request from 'supertest';
import { apiVersioning } from '../../src/middleware/apiVersioning.js';

const createApp = () => {
  const app = express();

  app.use(apiVersioning);

  app.get('/api/v1/test', (req, res) => {
    res.json({
      success: true,
      version: req.apiVersion,
    });
  });

  app.get('/test', (req, res) => {
    res.json({
      success: true,
      version: req.apiVersion,
    });
  });

  return app;
};

test('detects API version from URL path', async () => {
  const response = await request(createApp()).get('/api/v1/test');

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.version, 'v1');
});

test('detects API version from request header', async () => {
  const response = await request(createApp())
    .get('/test')
    .set('Accept-Version', 'v1');

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.version, 'v1');
});

test('rejects unsupported API versions', async () => {
  const response = await request(createApp())
    .get('/test')
    .set('Accept-Version', 'v2');

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
});