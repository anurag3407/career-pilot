import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';

describe('upload middleware', () => {
  let upload, singleUpload, handleUpload;

  before(async () => {
    const mod = await import('../upload.js');
    upload = mod.upload;
    singleUpload = mod.singleUpload;
    handleUpload = mod.handleUpload;
  });

  test('exports multer upload instance', () => {
    assert.ok(upload);
  });

  test('singleUpload is a middleware function', () => {
    assert.equal(typeof singleUpload, 'function');
    assert.equal(singleUpload.length, 3);
  });

  test('handleUpload is an error-handling wrapper', () => {
    assert.equal(typeof handleUpload, 'function');
    assert.equal(handleUpload.length, 3);
  });

  test('file size limit is 5MB', () => {
    assert.ok(upload.limits);
    assert.equal(upload.limits.fileSize, 5 * 1024 * 1024);
  });

  test('file count limit is 1 file at a time', () => {
    assert.equal(upload.limits.files, 1);
  });
});
