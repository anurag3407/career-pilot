// frontend/.storybook/test-utils.js
// Visual regression testing utilities

export const visualRegressionUtils = {
  validateChromaticToken() {
    const token = process.env.CHROMATIC_PROJECT_TOKEN;
    if (!token) {
      console.warn('Warning: CHROMATIC_PROJECT_TOKEN is not set.');
      return false;
    }
    return true;
  },

  async retryTest(testFn, retries = 3) {
    if (retries < 1) {
      throw new RangeError('retries must be at least 1');
    }
    for (let i = 0; i < retries; i++) {
      try {
        return await testFn();
      } catch (error) {
        if (i === retries - 1) {
          throw new Error(
            `Test failed after ${retries} retries: ${error.message}`,
            { cause: error }
          );
        }
        console.warn(`Retry attempt ${i + 1} of ${retries}`);
      }
    }
  },

  getBaselineConfig() {
    return {
      threshold: 0.2,
      delay: 300,
      diffThreshold: 0.063,
    };
  },
};