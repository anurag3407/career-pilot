import { test, describe, beforeEach, afterEach, it } from 'node:test';
import assert from 'node:assert/strict';
import { checkDevAuthBypassGuard } from '../securityGuard.js';

describe('Security Guard: checkDevAuthBypassGuard', () => {
  let originalEnv;
  let originalArgv;

  beforeEach(() => {
    // Save original process environment and args
    originalEnv = { ...process.env };
    originalArgv = [...process.argv];
  });

  afterEach(() => {
    // Restore original process environment and args
    process.env = originalEnv;
    process.argv = originalArgv;
  });

  it('should throw an error in production if legacy DEV_BYPASS_AUTH env var is true', () => {
    process.env.NODE_ENV = 'production';
    process.env.DEV_BYPASS_AUTH = 'true';

    assert.throws(() => {
      checkDevAuthBypassGuard();
    }, /FATAL: Dev auth bypass is enabled in production environment!/);
  });

  it('should throw an error in production if --dev-bypass-auth CLI flag is present', () => {
    process.env.NODE_ENV = 'production';
    process.argv.push('--dev-bypass-auth');

    assert.throws(() => {
      checkDevAuthBypassGuard();
    }, /FATAL: Dev auth bypass is enabled in production environment!/);
  });

  it('should throw an error in production if both legacy env var and CLI flag are present', () => {
    process.env.NODE_ENV = 'production';
    process.env.DEV_BYPASS_AUTH = 'true';
    process.argv.push('--dev-bypass-auth');

    assert.throws(() => {
      checkDevAuthBypassGuard();
    }, /FATAL: Dev auth bypass is enabled in production environment!/);
  });

  it('should NOT throw an error in production if no bypass flags are present', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.DEV_BYPASS_AUTH;
    // ensure argv doesn't contain the flag
    process.argv = process.argv.filter(arg => arg !== '--dev-bypass-auth');

    assert.doesNotThrow(() => {
      checkDevAuthBypassGuard();
    });
  });

  it('should NOT throw an error in development even if bypass CLI flag is present', () => {
    process.env.NODE_ENV = 'development';
    process.argv.push('--dev-bypass-auth');

    assert.doesNotThrow(() => {
      checkDevAuthBypassGuard();
    });
  });

  it('should NOT throw an error in development even if legacy bypass env flag is present', () => {
    process.env.NODE_ENV = 'development';
    process.env.DEV_BYPASS_AUTH = 'true';

    assert.doesNotThrow(() => {
      checkDevAuthBypassGuard();
    });
  });
});
