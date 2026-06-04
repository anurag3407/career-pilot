import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize the Pact Provider Mock Server
const provider = new PactV3({
  consumer: 'CareerPilotFrontend',
  provider: 'CareerPilotBackend',
  dir: path.resolve(__dirname, '../../../../pacts'),
});

describe('API Contract Tests', () => {
  test('Forgot Password Endpoint Contract', async () => {
    // 1. Arrange: Define the expected contract (request & response shape)
    provider
      .uponReceiving('A request to initiate forgot password flow')
      .withRequest({
        method: 'POST',
        path: '/api/auth/forgot-password',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          email: MatchersV3.string('user@example.com'),
        },
      })
      .willRespondWith({
        status: 200,
        headers: {
          'Content-Type': MatchersV3.string('application/json; charset=utf-8'),
        },
        body: {
          success: MatchersV3.boolean(true),
          message: MatchersV3.like('If an account with that email exists, a password reset link has been sent.'),
        },
      });

    // 2. Act & Assert: Execute the test using the mock server
    await provider.executeTest(async (mockServer) => {
      // Simulate the frontend application making the API call
      const response = await fetch(`${mockServer.url}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com' }),
      });

      const data = await response.json();

      // Verify the response matches our expectations
      assert.equal(response.status, 200);
      assert.equal(data.success, true);
      assert.ok(typeof data.message === 'string');
    });
  });
});
