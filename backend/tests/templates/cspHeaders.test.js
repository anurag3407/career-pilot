/* eslint-env jest */
import express from 'express';
import request from 'supertest';
import { cspHeaders } from '../src/middleware/cspHeaders.js';

describe('CSP Headers Middleware', () => {
  const app = express();

  app.use(cspHeaders);

  app.get('/test', (req, res) => {
    res.json({ success: true });
  });

  it('should apply security headers', async () => {
    const response = await request(app).get('/test');

    expect(response.headers['content-security-policy']).toBeDefined();
    expect(response.headers['cross-origin-resource-policy']).toBe(
      'cross-origin'
    );
    expect(response.headers['cross-origin-opener-policy']).toBe(
      'same-origin-allow-popups'
    );
  });
});