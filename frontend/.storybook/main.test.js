// frontend/.storybook/main.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { visualRegressionUtils } from './test-utils.js';

describe('Visual Regression Testing - Core Logic', () => {
  let originalToken;

  beforeEach(() => {
    originalToken = process.env.CHROMATIC_PROJECT_TOKEN;
  });

  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.CHROMATIC_PROJECT_TOKEN;
    } else {
      process.env.CHROMATIC_PROJECT_TOKEN = originalToken;
    }
  });

  // Test 1: Token validation
  describe('validateChromaticToken', () => {
    it('should return false when token is not set', () => {
      delete process.env.CHROMATIC_PROJECT_TOKEN;
      const result = visualRegressionUtils.validateChromaticToken();
      expect(result).toBe(false);
    });

    it('should return true when token is set', () => {
      process.env.CHROMATIC_PROJECT_TOKEN = 'test-token-123';
      const result = visualRegressionUtils.validateChromaticToken();
      expect(result).toBe(true);
    });
  });

  // Test 2: Retry logic
  describe('retryTest', () => {
    it('should return result on first success', async () => {
      const mockTest = vi.fn().mockResolvedValue('success');
      const result = await visualRegressionUtils.retryTest(mockTest);
      expect(result).toBe('success');
      expect(mockTest).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockTest = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');
      const result = await visualRegressionUtils.retryTest(mockTest);
      expect(result).toBe('success');
      expect(mockTest).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max retries', async () => {
      const mockTest = vi.fn().mockRejectedValue(new Error('always fails'));
      await expect(visualRegressionUtils.retryTest(mockTest, 3))
        .rejects.toThrow('Test failed after 3 retries');
    });

    it('should throw RangeError when retries is 0', async () => {
      const mockTest = vi.fn().mockResolvedValue('success');
      await expect(visualRegressionUtils.retryTest(mockTest, 0))
        .rejects.toBeInstanceOf(RangeError);
      await expect(visualRegressionUtils.retryTest(mockTest, 0))
        .rejects.toThrow('retries must be at least 1');
    });

    it('should throw RangeError when retries is negative', async () => {
      const mockTest = vi.fn().mockResolvedValue('success');
      await expect(visualRegressionUtils.retryTest(mockTest, -1))
        .rejects.toBeInstanceOf(RangeError);
      await expect(visualRegressionUtils.retryTest(mockTest, -1))
        .rejects.toThrow('retries must be at least 1');
    });
  });

  // Test 3: Baseline config
  describe('getBaselineConfig', () => {
    it('should return valid baseline config', () => {
      const config = visualRegressionUtils.getBaselineConfig();
      expect(config).toHaveProperty('threshold');
      expect(config).toHaveProperty('delay');
      expect(config).toHaveProperty('diffThreshold');
    });

    it('should have correct default values', () => {
      const config = visualRegressionUtils.getBaselineConfig();
      expect(config.threshold).toBe(0.2);
      expect(config.delay).toBe(300);
      expect(config.diffThreshold).toBe(0.063);
    });
  });

});