import { test, describe, mock } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import { uploadSecurityScanner } from '../uploadSecurityScanner.js';
import { ApiError } from '../errorHandler.js';

describe('uploadSecurityScanner middleware', () => {
  test('should pass if no file is uploaded', async () => {
    const req = { file: undefined };
    const res = {};
    const next = mock.fn();

    await uploadSecurityScanner(req, res, next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(next.mock.calls[0].arguments.length, 0);
  });

  test('should pass if file is not a PDF', async () => {
    const req = {
      file: {
        path: 'test.txt',
        mimetype: 'text/plain'
      }
    };
    const res = {};
    const next = mock.fn();

    await uploadSecurityScanner(req, res, next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(next.mock.calls[0].arguments.length, 0);
  });

  test('should pass if PDF is clean', async (t) => {
    const req = {
      file: {
        path: 'clean.pdf',
        mimetype: 'application/pdf'
      }
    };
    const res = {};
    const next = mock.fn();

    // Mock fs.stat to return small size
    const statMock = mock.method(fs, 'stat', async () => ({ size: 1024 }));
    // Mock fs.readFile to return clean content
    const readFileMock = mock.method(fs, 'readFile', async () => Buffer.from('%PDF-1.4\n%clean content'));

    await uploadSecurityScanner(req, res, next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(next.mock.calls[0].arguments.length, 0);
    
    mock.restoreAll();
  });

  test('should block if PDF contains JavaScript', async (t) => {
    const req = {
      file: {
        path: 'malicious.pdf',
        mimetype: 'application/pdf'
      }
    };
    const res = {};
    const next = mock.fn();

    // Mock fs.stat to return small size
    const statMock = mock.method(fs, 'stat', async () => ({ size: 1024 }));
    // Mock fs.readFile to return malicious content
    const readFileMock = mock.method(fs, 'readFile', async () => Buffer.from('%PDF-1.4\n/JS (alert("hello"))'));
    // Mock fs.unlink
    const unlinkMock = mock.method(fs, 'unlink', async () => {});

    await uploadSecurityScanner(req, res, next);

    assert.equal(next.mock.calls.length, 1);
    const error = next.mock.calls[0].arguments[0];
    assert.ok(error instanceof ApiError);
    assert.equal(error.statusCode, 400);
    assert.ok(error.message.includes('Embedded JavaScript'));
    
    assert.equal(unlinkMock.mock.calls.length, 1);
    assert.equal(unlinkMock.mock.calls[0].arguments[0], 'malicious.pdf');

    mock.restoreAll();
  });

  test('should block if PDF contains OpenAction', async (t) => {
    const req = {
      file: {
        path: 'malicious_oa.pdf',
        mimetype: 'application/pdf'
      }
    };
    const res = {};
    const next = mock.fn();

    // Mock fs.stat to return small size
    const statMock = mock.method(fs, 'stat', async () => ({ size: 1024 }));
    // Mock fs.readFile to return malicious content
    const readFileMock = mock.method(fs, 'readFile', async () => Buffer.from('%PDF-1.4\n/OpenAction [1 0 R]'));
    // Mock fs.unlink
    const unlinkMock = mock.method(fs, 'unlink', async () => {});

    await uploadSecurityScanner(req, res, next);

    assert.equal(next.mock.calls.length, 1);
    const error = next.mock.calls[0].arguments[0];
    assert.ok(error instanceof ApiError);
    assert.equal(error.statusCode, 400);
    assert.ok(error.message.includes('Automatic Action'));

    mock.restoreAll();
  });

  test('should block if file size exceeds scan limit', async (t) => {
    const req = {
      file: {
        path: 'huge.pdf',
        mimetype: 'application/pdf'
      }
    };
    const res = {};
    const next = mock.fn();

    // Mock fs.stat to return large size
    const statMock = mock.method(fs, 'stat', async () => ({ size: 15 * 1024 * 1024 }));
    // Mock fs.unlink
    const unlinkMock = mock.method(fs, 'unlink', async () => {});

    await uploadSecurityScanner(req, res, next);

    assert.equal(next.mock.calls.length, 1);
    const error = next.mock.calls[0].arguments[0];
    assert.ok(error instanceof ApiError);
    assert.equal(error.statusCode, 400);
    assert.ok(error.message.includes('exceeds security scan limit'));

    mock.restoreAll();
  });

  test('should handle scan failure gracefully and block', async (t) => {
    const req = {
      file: {
        path: 'error.pdf',
        mimetype: 'application/pdf'
      }
    };
    const res = {};
    const next = mock.fn();

    // Mock fs.readFile to throw error
    const readFileMock = mock.method(fs, 'readFile', async () => { throw new Error('Read error'); });
    // Mock fs.unlink
    const unlinkMock = mock.method(fs, 'unlink', async () => {});

    await uploadSecurityScanner(req, res, next);

    assert.equal(next.mock.calls.length, 1);
    const error = next.mock.calls[0].arguments[0];
    assert.ok(error instanceof ApiError);
    assert.equal(error.statusCode, 500);

    mock.restoreAll();
  });
});
