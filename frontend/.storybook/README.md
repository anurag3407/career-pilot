# Visual Regression Testing Setup

## Overview
This setup integrates Storybook with Chromatic for visual regression testing.

## Configuration

### Environment Variables
Set your Chromatic token:
```bash
export CHROMATIC_PROJECT_TOKEN=your-token-here
```

### Utilities

#### `validateChromaticToken()`
Checks if Chromatic token is properly configured.

#### `retryTest(testFn, retries = 3)`
Retries a test function up to 3 times before failing.

#### `getBaselineConfig()`
Returns baseline configuration:
- `threshold`: 0.2
- `delay`: 300ms
- `diffThreshold`: 0.063

## Running Tests
```bash
npm test -- main.test.js
```

## All Tests
- 7 unit tests covering token validation, retry logic, and baseline config
- All tests passing ✅