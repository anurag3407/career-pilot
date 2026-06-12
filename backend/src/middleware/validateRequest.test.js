const { describe, it, mock } = require('node:test');
const assert = require('node:assert');
const { z } = require('zod');
const validateRequest = require('./validateRequest');

describe('validateRequest Middleware', () => {
  // A dummy schema for testing
  const testSchema = z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      age: z.number().min(18, 'Must be at least 18'),
    }).optional(),
  });

  const middleware = validateRequest(testSchema);

  it('should call next() without errors if the payload is completely valid', async () => {
    const req = { body: { email: 'test@example.com', age: 25 }, query: {}, params: {} };
    const res = {};
    const next = mock.fn(); // Node's native mock function

    await middleware(req, res, next);

    assert.strictEqual(next.mock.calls.length, 1, 'next() should be called once');
    assert.strictEqual(next.mock.calls[0].arguments.length, 0, 'next() should be called with no arguments');
  });

  it('should return a 400 status and formatted errors if validation fails', async () => {
    const req = { body: { email: 'not-an-email', age: 15 }, query: {}, params: {} };
    
    // Mock the Express response object using Node's mock API
    const res = {
      status: mock.fn(() => res),
      json: mock.fn(),
    };
    const next = mock.fn();

    await middleware(req, res, next);

    assert.strictEqual(res.status.mock.calls[0].arguments[0], 400);
    
    const jsonResponse = res.json.mock.calls[0].arguments[0];
    assert.strictEqual(jsonResponse.status, 'error');
    assert.strictEqual(jsonResponse.message, 'Validation failed');
    
    // Assert specific formatting 
    const hasEmailError = jsonResponse.errors.some(e => e.field === 'email' && e.location === 'body');
    const hasAgeError = jsonResponse.errors.some(e => e.field === 'age' && e.location === 'body');
    
    assert.ok(hasEmailError, 'Response should contain email error');
    assert.ok(hasAgeError, 'Response should contain age error');
    
    // next() should not proceed
    assert.strictEqual(next.mock.calls.length, 0, 'next() should not be called');
  });
});