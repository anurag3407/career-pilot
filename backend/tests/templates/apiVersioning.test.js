import test from 'node:test';
import assert from 'node:assert';
import { apiVersioning } from '../../src/middleware/apiVersioning.js';

const mockResponse = () => {
  const res = {};

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (data) => {
    res.body = data;
    return res;
  };

  return res;
};

test('detects API version from URL path', () => {
  const req = {
    path: '/api/v1/users',
    headers: {},
  };

  const res = mockResponse();

  apiVersioning(req, res, () => {});

  assert.strictEqual(req.apiVersion, 'v1');
});

test('detects API version from request header', () => {
  const req = {
    path: '/users',
    headers: {
      'accept-version': 'v1',
    },
  };

  const res = mockResponse();

  apiVersioning(req, res, () => {});

  assert.strictEqual(req.apiVersion, 'v1');
});

test('rejects unsupported API versions', () => {
  const req = {
    path: '/users',
    headers: {
      'accept-version': 'v2',
    },
  };

  const res = mockResponse();

  apiVersioning(req, res, () => {});

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
});

test('rejects malformed API version path', () => {
  const req = {
    path: '/api/v1beta/users',
    headers: {},
  };

  const res = mockResponse();

  apiVersioning(req, res, () => {});

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.body.success, false);
});