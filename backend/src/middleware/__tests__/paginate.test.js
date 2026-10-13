import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { paginate, paginatedResponse } from '../paginate.js';

function mockReqRes(query = {}) {
  const state = { statusCode: 200, body: null };
  const req = { query };
  const res = {
    status(code) {
      state.statusCode = code;
      return this;
    },
    json(body) {
      state.body = body;
      return this;
    },
  };
  return { req, res, state };
}

describe('paginate middleware', () => {
  test('defaults to page 1, limit 10, sort by -createdAt', async () => {
    const { req } = mockReqRes({});
    const middleware = paginate();

    await new Promise((resolve) => middleware(req, {}, resolve));

    assert.equal(req.paginate.page, 1);
    assert.equal(req.paginate.limit, 10);
    assert.equal(req.paginate.skip, 0);
    assert.deepEqual(req.paginate.sort, { createdAt: -1 });
  });

  test('parses custom page and limit from query', async () => {
    const { req } = mockReqRes({ page: '3', limit: '25' });
    const middleware = paginate();

    await new Promise((resolve) => middleware(req, {}, resolve));

    assert.equal(req.paginate.page, 3);
    assert.equal(req.paginate.limit, 25);
    assert.equal(req.paginate.skip, 50);
  });

  test('enforces minimum page of 1', async () => {
    const { req } = mockReqRes({ page: '0', limit: '5' });
    const middleware = paginate();

    await new Promise((resolve) => middleware(req, {}, resolve));

    assert.equal(req.paginate.page, 1);
  });

  test('enforces maximum limit of 100', async () => {
    const { req } = mockReqRes({ limit: '500' });
    const middleware = paginate();

    await new Promise((resolve) => middleware(req, {}, resolve));

    assert.equal(req.paginate.limit, 100);
    assert.equal(req.paginate.skip, 0);
  });

  test('handles negative page number gracefully', async () => {
    const { req } = mockReqRes({ page: '-5' });
    const middleware = paginate();

    await new Promise((resolve) => middleware(req, {}, resolve));

    assert.equal(req.paginate.page, 1);
  });

  test('parses sort field and direction', async () => {
    const { req } = mockReqRes({ sort: 'title' });
    const middleware = paginate();

    await new Promise((resolve) => middleware(req, {}, resolve));

    assert.deepEqual(req.paginate.sort, { title: 1 });
  });

  test('parses descending sort (prefix with -)', async () => {
    const { req } = mockReqRes({ sort: '-updatedAt' });
    const middleware = paginate();

    await new Promise((resolve) => middleware(req, {}, resolve));

    assert.deepEqual(req.paginate.sort, { updatedAt: -1 });
  });

  test('handles non-numeric page gracefully', async () => {
    const { req } = mockReqRes({ page: 'abc' });
    const middleware = paginate();

    await new Promise((resolve) => middleware(req, {}, resolve));

    assert.equal(req.paginate.page, 1);
  });
});

describe('paginatedResponse helper', () => {
  const res = {
    json(body) {
      this.body = body;
      return this;
    },
    body: null,
  };

  test('builds correct paginated response', () => {
    const data = [{ id: 1 }, { id: 2 }];
    paginatedResponse(res, { data, total: 50, page: 1, limit: 10 });

    assert.equal(res.body.success, true);
    assert.deepEqual(res.body.data, data);
    assert.equal(res.body.meta.total, 50);
    assert.equal(res.body.meta.page, 1);
    assert.equal(res.body.meta.limit, 10);
    assert.equal(res.body.meta.totalPages, 5);
  });

  test('hasNextPage is true when more pages exist', () => {
    paginatedResponse(res, { data: [], total: 25, page: 1, limit: 10 });
    assert.equal(res.body.meta.hasNextPage, true);
    assert.equal(res.body.meta.hasPrevPage, false);
  });

  test('hasPrevPage is true when not on first page', () => {
    paginatedResponse(res, { data: [], total: 25, page: 2, limit: 10 });
    assert.equal(res.body.meta.hasNextPage, true);
    assert.equal(res.body.meta.hasPrevPage, true);
  });

  test('hasNextPage is false on last page', () => {
    paginatedResponse(res, { data: [], total: 20, page: 2, limit: 10 });
    assert.equal(res.body.meta.hasNextPage, false);
  });
});
