import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createSSEStream } from '../stream.js';

describe('createSSEStream', () => {
  function makeRes() {
    const headers = {};
    const chunks = [];
    return {
      setHeader(name, value) { headers[name] = value; },
      write(chunk) { chunks.push(chunk); return true; },
      end() {},
      get headers() { return headers; },
      get chunks() { return chunks; },
    };
  }

  test('sets correct SSE headers and returns all helper methods', () => {
    const res = makeRes();
    const stream = createSSEStream(res);

    assert.equal(res.headers['Content-Type'], 'text/event-stream');
    assert.equal(res.headers['Cache-Control'], 'no-cache');
    assert.equal(res.headers['Connection'], 'keep-alive');
    assert.equal(res.headers['X-Accel-Buffering'], 'no');

    assert.equal(typeof stream.sendEvent, 'function');
    assert.equal(typeof stream.sendProgress, 'function');
    assert.equal(typeof stream.sendChunk, 'function');
    assert.equal(typeof stream.sendError, 'function');
    assert.equal(typeof stream.sendDone, 'function');
    assert.equal(typeof stream.endStream, 'function');
  });

  test('sendProgress writes progress event', () => {
    const res = makeRes();
    const stream = createSSEStream(res);
    stream.sendProgress(50, 'Halfway there');
    const lastChunk = res.chunks[res.chunks.length - 1];
    const parsed = JSON.parse(lastChunk.replace('data: ', '').replace('\n\n', ''));
    assert.equal(parsed.type, 'progress');
    assert.equal(parsed.value, 50);
    assert.equal(parsed.message, 'Halfway there');
  });

  test('sendChunk writes chunk event', () => {
    const res = makeRes();
    const stream = createSSEStream(res);
    stream.sendChunk('partial content', false);
    const lastChunk = res.chunks[res.chunks.length - 1];
    const parsed = JSON.parse(lastChunk.replace('data: ', '').replace('\n\n', ''));
    assert.equal(parsed.type, 'chunk');
    assert.equal(parsed.content, 'partial content');
  });

  test('sendError writes error event', () => {
    const res = makeRes();
    const stream = createSSEStream(res);
    stream.sendError('Something went wrong');
    const lastChunk = res.chunks[res.chunks.length - 1];
    const parsed = JSON.parse(lastChunk.replace('data: ', '').replace('\n\n', ''));
    assert.equal(parsed.type, 'error');
    assert.equal(parsed.message, 'Something went wrong');
  });

  test('sendDone writes done event with metadata', () => {
    const res = makeRes();
    const stream = createSSEStream(res);
    stream.sendDone({ requestId: 'abc-123' });
    const lastChunk = res.chunks[res.chunks.length - 1];
    const parsed = JSON.parse(lastChunk.replace('data: ', '').replace('\n\n', ''));
    assert.equal(parsed.type, 'done');
    assert.equal(parsed.requestId, 'abc-123');
  });

  test('sendDone works without metadata', () => {
    const res = makeRes();
    const stream = createSSEStream(res);
    stream.sendDone();
    const lastChunk = res.chunks[res.chunks.length - 1];
    const parsed = JSON.parse(lastChunk.replace('data: ', '').replace('\n\n', ''));
    assert.equal(parsed.type, 'done');
  });

  test('endStream ends the response', () => {
    let ended = false;
    const res = {
      setHeader() {},
      write() { return true; },
      end() { ended = true; },
    };
    const stream = createSSEStream(res);
    stream.endStream();
    assert.equal(ended, true);
  });
});
