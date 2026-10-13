import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { validatePortfolioSlug, validatePortfolioContent } from '../portfolioValidator.js';

function mockReqRes(overrides = {}) {
  const state = { statusCode: 200, body: null };
  const req = { params: {}, body: {}, ...overrides };
  const res = {
    status(code) { state.statusCode = code; return this; },
    json(body) { state.body = body; return this; },
  };
  return { req, res, state };
}

describe('validatePortfolioSlug', () => {
  test('accepts valid lowercase alphanumeric slug', () => {
    const { req, res, state } = mockReqRes({ params: { slug: 'my-portfolio' } });
    let nextCalled = false;
    validatePortfolioSlug(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.body.slug, 'my-portfolio');
  });

  test('rejects empty slug', () => {
    const { req, res, state } = mockReqRes({ params: { slug: '' } });
    validatePortfolioSlug(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('rejects missing slug', () => {
    const { req, res, state } = mockReqRes({ params: {} });
    validatePortfolioSlug(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('rejects slug with uppercase letters', () => {
    const { req, res, state } = mockReqRes({ params: { slug: 'My-Portfolio' } });
    validatePortfolioSlug(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('rejects slug with special characters', () => {
    const { req, res, state } = mockReqRes({ params: { slug: 'my portfolio!' } });
    validatePortfolioSlug(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('reads slug from req.body.slug when params.slug is missing', () => {
    const { req, res, state } = mockReqRes({ body: { slug: 'from-body' }, params: {} });
    let nextCalled = false;
    validatePortfolioSlug(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.body.slug, 'from-body');
  });
});

describe('validatePortfolioContent', () => {
  test('rejects missing sections', () => {
    const { req, res, state } = mockReqRes({ body: {} });
    validatePortfolioContent(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('rejects sections that is not an object', () => {
    const { req, res, state } = mockReqRes({ body: { sections: 'invalid' } });
    validatePortfolioContent(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('rejects sections that is an array', () => {
    const { req, res, state } = mockReqRes({ body: { sections: [] } });
    validatePortfolioContent(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('rejects unknown section names', () => {
    const { req, res, state } = mockReqRes({
      body: { sections: { 'unknown-section': { title: 'test' } } },
    });
    validatePortfolioContent(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('accepts valid sections', () => {
    const { req, res, state } = mockReqRes({
      body: {
        sections: {
          hero: { title: 'My Portfolio', subtitle: 'Welcome' },
          about: { bio: 'A developer.' },
          skills: ['JavaScript', 'Node.js'],
        },
      },
    });
    let nextCalled = false;
    validatePortfolioContent(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.ok(req.body.sections.hero);
  });

  test('strips HTML tags from text content', () => {
    const { req, res, state } = mockReqRes({
      body: {
        sections: {
          hero: { title: '<script>alert("xss")</script>My Title', subtitle: 'Clean text' },
        },
      },
    });
    let nextCalled = false;
    validatePortfolioContent(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    // HTML tags should be stripped from non-URL fields
    assert.ok(req.body.sections.hero.title);
    assert.ok(typeof req.body.sections.hero.title === 'string');
    // The HTML stripping may remove tags or replace them
    // Verify it doesn't contain script tags anymore
    assert.ok(!req.body.sections.hero.title.includes('<script>'));
    // The text 'My Title' should still be present
    assert.ok(req.body.sections.hero.title.includes('My Title'));
  });

  test('preserves URL values', () => {
    const { req, res, state } = mockReqRes({
      body: {
        sections: {
          hero: {
            title: 'My Site',
            website: 'https://example.com',
            imageUrl: 'https://example.com/photo.jpg',
          },
        },
      },
    });
    let nextCalled = false;
    validatePortfolioContent(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(req.body.sections.hero.website, 'https://example.com');
    assert.equal(req.body.sections.hero.imageUrl, 'https://example.com/photo.jpg');
  });

  test('rejects non-HTTPS image URLs', () => {
    const { req, res, state } = mockReqRes({
      body: { sections: { hero: { imageUrl: 'http://example.com/photo.jpg' } } },
    });
    validatePortfolioContent(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('rejects non-HTTP(S) URLs in URL fields', () => {
    const { req, res, state } = mockReqRes({
      body: { sections: { hero: { website: 'javascript:alert(1)' } } },
    });
    validatePortfolioContent(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });

  test('rejects oversized sections', () => {
    const bigContent = { title: 'x'.repeat(60 * 1024) };
    const { req, res, state } = mockReqRes({
      body: { sections: { hero: bigContent } },
    });
    validatePortfolioContent(req, res, () => {});
    assert.equal(state.statusCode, 400);
  });
});
