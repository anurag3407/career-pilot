import { describe, test, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

describe('validateUpload middleware', () => {
  let validateUpload;
  const tempDir = os.tmpdir();
  let validPdfPath;

  before(async () => {
    const mod = await import('../uploadValidator.js');
    validateUpload = mod.validateUpload;
  });

  // Recreate the valid temp PDF file before each test so cleanup in
  // rejection tests doesn't destroy shared state for subsequent tests.
  beforeEach(async () => {
    validPdfPath = path.join(tempDir, `test-${Date.now()}-valid.pdf`);
    await fs.writeFile(validPdfPath, Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34]));
  });

  afterEach(async () => {
    try { await fs.unlink(validPdfPath); } catch {}
  });

  function mockReqRes(fileOverrides = {}, userOverrides = {}) {
    const req = {
      file: {
        path: validPdfPath,
        size: 1024,
        mimetype: 'application/pdf',
        originalname: 'resume.pdf',
        ...fileOverrides,
      },
      user: { uid: 'test-user-123', ...userOverrides },
    };
    const res = {
      status() { return this; },
      json() { return this; },
    };
    return { req, res };
  }

  test('rejects request with no file', async () => {
    const { req, res } = mockReqRes();
    req.file = null;
    let passedError = null;
    await validateUpload(req, res, (err) => { passedError = err; });
    assert.ok(passedError);
    assert.equal(passedError.statusCode, 400);
    assert.match(passedError.message, /no file uploaded/i);
  });

  test('rejects file exceeding 5MB', async () => {
    const { req, res } = mockReqRes({ size: 6 * 1024 * 1024 });
    let passedError = null;
    await validateUpload(req, res, (err) => { passedError = err; });
    assert.ok(passedError);
    assert.equal(passedError.statusCode, 400);
    assert.match(passedError.message, /too large/i);
  });

  test('rejects invalid file extension', async () => {
    const { req, res } = mockReqRes({ originalname: 'resume.exe' });
    let passedError = null;
    await validateUpload(req, res, (err) => { passedError = err; });
    assert.ok(passedError);
    assert.equal(passedError.statusCode, 400);
    assert.match(passedError.message, /invalid file type/i);
  });

  test('rejects invalid MIME type', async () => {
    const { req, res } = mockReqRes({ mimetype: 'application/exe' });
    let passedError = null;
    await validateUpload(req, res, (err) => { passedError = err; });
    assert.ok(passedError);
    assert.equal(passedError.statusCode, 400);
    assert.match(passedError.message, /invalid mime type/i);
  });

  test('rejects file with missing path', async () => {
    const { req, res } = mockReqRes({ path: null });
    let passedError = null;
    await validateUpload(req, res, (err) => { passedError = err; });
    assert.ok(passedError);
    assert.equal(passedError.statusCode, 400);
    assert.match(passedError.message, /file upload path is missing/i);
  });

  test('accepts a valid PDF file', async () => {
    const { req, res } = mockReqRes({ path: validPdfPath });
    let nextCalled = false;
    await validateUpload(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
  });
});
