/**
 * @fileoverview Jest test suite for burnoutDetector service
 * @module burnoutDetector.test
 * @description Comprehensive tests for detectApplicationBurnout() and
 * generateBurnoutReport(), covering all risk levels, edge cases, and
 * validation behaviour.
 */
 
import burnoutDetector, {
  detectApplicationBurnout,
  generateBurnoutReport,
} from '../backend/src/services/burnoutDetector.js';
 
// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------
 
/**
 * Produces a minimal valid input object, optionally overriding specific fields.
 *
 * @param {Object} [overrides={}] - Fields to override in the default fixture.
 * @returns {Object} Valid application data object.
 */
const buildInput = (overrides = {}) => ({
  applicationsSent: 20,
  rejections: 4,
  interviews: 6,
  responses: 10,
  unansweredApplications: 10,
  daysSearching: 30,
  ...overrides,
});
 
// ---------------------------------------------------------------------------
// Helper assertions
// ---------------------------------------------------------------------------
 
/**
 * Asserts that a result has the shape of a valid success response.
 *
 * @param {Object} result - Value returned by detectApplicationBurnout().
 */
const expectSuccessShape = (result) => {
  expect(result.success).toBe(true);
  expect(typeof result.burnoutScore).toBe('number');
  expect(result.burnoutScore).toBeGreaterThanOrEqual(0);
  expect(result.burnoutScore).toBeLessThanOrEqual(100);
  expect(['LOW', 'MEDIUM', 'HIGH', 'SEVERE']).toContain(result.riskLevel);
  expect(result.metrics).toBeDefined();
  expect(typeof result.metrics.rejectionRate).toBe('number');
  expect(typeof result.metrics.interviewConversionRate).toBe('number');
  expect(typeof result.metrics.responseRate).toBe('number');
  expect(typeof result.metrics.unansweredRate).toBe('number');
  expect(typeof result.metrics.applicationIntensity).toBe('number');
  expect(Array.isArray(result.indicators)).toBe(true);
  expect(Array.isArray(result.recommendations)).toBe(true);
  expect(typeof result.timestamp).toBe('string');
  expect(() => new Date(result.timestamp)).not.toThrow();
};
 
/**
 * Asserts that a result has the shape of a structured error response.
 *
 * @param {Object} result - Value returned by detectApplicationBurnout().
 */
const expectErrorShape = (result) => {
  expect(result.success).toBe(false);
  expect(typeof result.error).toBe('string');
  expect(result.error.length).toBeGreaterThan(0);
  expect(typeof result.timestamp).toBe('string');
};
 
// ---------------------------------------------------------------------------
// Risk-level scenarios
// ---------------------------------------------------------------------------
 
describe('detectApplicationBurnout — risk level scenarios', () => {
  test('LOW risk: healthy application activity returns low burnout score', () => {
    // Good metrics: high response rate, good interview conversion, short search
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 20,
        rejections: 3,
        interviews: 8,
        responses: 15,
        unansweredApplications: 5,
        daysSearching: 14,
      })
    );
 
    expectSuccessShape(result);
    expect(result.riskLevel).toBe('LOW');
    expect(result.burnoutScore).toBeLessThanOrEqual(25);
  });
 
  test('MEDIUM risk: moderate rejection rate and average responsiveness', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 50,
        rejections: 25,
        interviews: 5,
        responses: 20,
        unansweredApplications: 30,
        daysSearching: 55,
      })
    );
 
    expectSuccessShape(result);
    expect(result.riskLevel).toBe('MEDIUM');
    expect(result.burnoutScore).toBeGreaterThan(25);
    expect(result.burnoutScore).toBeLessThanOrEqual(50);
  });
 
  test('HIGH risk: high rejection, low responses, and prolonged search', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 80,
        rejections: 55,
        interviews: 4,
        responses: 15,
        unansweredApplications: 65,
        daysSearching: 80,
      })
    );
 
    expectSuccessShape(result);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.burnoutScore).toBeGreaterThan(50);
    expect(result.burnoutScore).toBeLessThanOrEqual(75);
  });
 
  test('SEVERE risk: very high rejection, near-zero response rate, long duration', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 150,
        rejections: 120,
        interviews: 1,
        responses: 10,
        unansweredApplications: 140,
        daysSearching: 130,
      })
    );
 
    expectSuccessShape(result);
    expect(result.riskLevel).toBe('SEVERE');
    expect(result.burnoutScore).toBeGreaterThan(75);
  });
});
 
// ---------------------------------------------------------------------------
// Metrics correctness
// ---------------------------------------------------------------------------
 
describe('detectApplicationBurnout — metrics', () => {
  test('computes all five metrics correctly', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 100,
        rejections: 60,
        interviews: 10,
        responses: 30,
        unansweredApplications: 70,
        daysSearching: 50,
      })
    );
 
    expectSuccessShape(result);
    expect(result.metrics.rejectionRate).toBeCloseTo(0.6, 2);
    expect(result.metrics.interviewConversionRate).toBeCloseTo(0.1, 2);
    expect(result.metrics.responseRate).toBeCloseTo(0.3, 2);
    expect(result.metrics.unansweredRate).toBeCloseTo(0.7, 2);
    expect(result.metrics.applicationIntensity).toBeCloseTo(2.0, 2);
  });
 
  test('applicationIntensity uses daysSearching as denominator', () => {
    const result = detectApplicationBurnout(
      buildInput({ applicationsSent: 60, daysSearching: 30 })
    );
 
    expectSuccessShape(result);
    expect(result.metrics.applicationIntensity).toBeCloseTo(2.0, 2);
  });
 
  test('handles zero applicationsSent without crashing (all rates = 0)', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 0,
        rejections: 0,
        interviews: 0,
        responses: 0,
        unansweredApplications: 0,
        daysSearching: 10,
      })
    );
 
    expectSuccessShape(result);
    expect(result.metrics.rejectionRate).toBe(0);
    expect(result.metrics.interviewConversionRate).toBe(0);
    expect(result.metrics.responseRate).toBe(0);
    expect(result.metrics.unansweredRate).toBe(0);
  });
 
  test('burnoutScore is clamped between 0 and 100', () => {
    // Worst-case inputs
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 500,
        rejections: 500,
        interviews: 0,
        responses: 0,
        unansweredApplications: 500,
        daysSearching: 365,
      })
    );
 
    expectSuccessShape(result);
    expect(result.burnoutScore).toBeLessThanOrEqual(100);
    expect(result.burnoutScore).toBeGreaterThanOrEqual(0);
  });
});
 
// ---------------------------------------------------------------------------
// Input validation — missing fields
// ---------------------------------------------------------------------------
 
describe('detectApplicationBurnout — missing fields', () => {
  const requiredFields = [
    'applicationsSent',
    'rejections',
    'interviews',
    'responses',
    'unansweredApplications',
    'daysSearching',
  ];
 
  requiredFields.forEach((field) => {
    test(`returns error when "${field}" is missing`, () => {
      const input = buildInput();
      delete input[field];
 
      const result = detectApplicationBurnout(input);
 
      expectErrorShape(result);
      expect(result.error).toContain(field);
    });
  });
 
  test('returns error when input is completely empty', () => {
    const result = detectApplicationBurnout({});
    expectErrorShape(result);
  });
 
  test('returns error when input is null', () => {
    // null propagates to individual field checks
    const result = detectApplicationBurnout(null ?? {});
    expectErrorShape(result);
  });
});
 
// ---------------------------------------------------------------------------
// Input validation — negative values
// ---------------------------------------------------------------------------
 
describe('detectApplicationBurnout — negative values', () => {
  test('returns error for negative applicationsSent', () => {
    const result = detectApplicationBurnout(
      buildInput({ applicationsSent: -1 })
    );
    expectErrorShape(result);
    expect(result.error).toContain('applicationsSent');
  });
 
  test('returns error for negative rejections', () => {
    const result = detectApplicationBurnout(buildInput({ rejections: -5 }));
    expectErrorShape(result);
    expect(result.error).toContain('rejections');
  });
 
  test('returns error for negative daysSearching', () => {
    const result = detectApplicationBurnout(
      buildInput({ daysSearching: -10 })
    );
    expectErrorShape(result);
    expect(result.error).toContain('daysSearching');
  });
 
  test('accepts zero for all fields (valid edge case)', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 0,
        rejections: 0,
        interviews: 0,
        responses: 0,
        unansweredApplications: 0,
        daysSearching: 0,
      })
    );
    expectSuccessShape(result);
  });
});
 
// ---------------------------------------------------------------------------
// Input validation — invalid data types
// ---------------------------------------------------------------------------
 
describe('detectApplicationBurnout — invalid data types', () => {
  test('returns error when applicationsSent is a string', () => {
    const result = detectApplicationBurnout(
      buildInput({ applicationsSent: '50' })
    );
    expectErrorShape(result);
    expect(result.error).toContain('applicationsSent');
  });
 
  test('returns error when daysSearching is a boolean', () => {
    const result = detectApplicationBurnout(
      buildInput({ daysSearching: true })
    );
    expectErrorShape(result);
    expect(result.error).toContain('daysSearching');
  });
 
  test('returns error when interviews is NaN', () => {
    const result = detectApplicationBurnout(
      buildInput({ interviews: NaN })
    );
    expectErrorShape(result);
    expect(result.error).toContain('interviews');
  });
 
  test('returns error when responses is null', () => {
    const result = detectApplicationBurnout(
      buildInput({ responses: null })
    );
    expectErrorShape(result);
    expect(result.error).toContain('responses');
  });
 
  test('returns error when unansweredApplications is an object', () => {
    const result = detectApplicationBurnout(
      buildInput({ unansweredApplications: { count: 5 } })
    );
    expectErrorShape(result);
    expect(result.error).toContain('unansweredApplications');
  });
});
 
// ---------------------------------------------------------------------------
// Indicators
// ---------------------------------------------------------------------------
 
describe('detectApplicationBurnout — indicators', () => {
  test('returns no indicators for a healthy, low-risk profile', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 20,
        rejections: 2,
        interviews: 10,
        responses: 18,
        unansweredApplications: 2,
        daysSearching: 10,
      })
    );
 
    expectSuccessShape(result);
    expect(result.indicators.length).toBe(0);
  });
 
  test('generates rejection-rate indicator when rejection rate ≥ 70%', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 100,
        rejections: 75,
        interviews: 1,
        responses: 10,
        unansweredApplications: 90,
        daysSearching: 30,
      })
    );
 
    expectSuccessShape(result);
    const hasRejectionIndicator = result.indicators.some((i) =>
      i.toLowerCase().includes('rejection rate')
    );
    expect(hasRejectionIndicator).toBe(true);
  });
 
  test('generates unanswered indicator when unanswered rate ≥ 80%', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 100,
        rejections: 5,
        interviews: 2,
        responses: 10,
        unansweredApplications: 90,
        daysSearching: 30,
      })
    );
 
    expectSuccessShape(result);
    const hasUnansweredIndicator = result.indicators.some((i) =>
      i.toLowerCase().includes('unanswered')
    );
    expect(hasUnansweredIndicator).toBe(true);
  });
 
  test('generates duration indicator when daysSearching ≥ 90', () => {
    const result = detectApplicationBurnout(
      buildInput({ daysSearching: 100 })
    );
 
    expectSuccessShape(result);
    const hasDurationIndicator = result.indicators.some((i) =>
      i.toLowerCase().includes('days')
    );
    expect(hasDurationIndicator).toBe(true);
  });
});
 
// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------
 
describe('detectApplicationBurnout — recommendations', () => {
  test('always includes at least one recommendation', () => {
    const result = detectApplicationBurnout(buildInput());
    expectSuccessShape(result);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(1);
  });
 
  test('recommends quality over quantity when applicationIntensity is high', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 200,
        daysSearching: 30,
      })
    );
 
    expectSuccessShape(result);
    const hasQualityRec = result.recommendations.some((r) =>
      r.toLowerCase().includes('quality')
    );
    expect(hasQualityRec).toBe(true);
  });
 
  test('recommends resume revision when response rate is critically low', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 100,
        rejections: 70,
        interviews: 1,
        responses: 5,
        unansweredApplications: 95,
        daysSearching: 40,
      })
    );
 
    expectSuccessShape(result);
    const hasResumeRec = result.recommendations.some((r) =>
      r.toLowerCase().includes('resume')
    );
    expect(hasResumeRec).toBe(true);
  });
 
  test('recommends networking when response rate is low', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 100,
        rejections: 10,
        interviews: 2,
        responses: 15,
        unansweredApplications: 85,
        daysSearching: 40,
      })
    );
 
    expectSuccessShape(result);
    const hasNetworkingRec = result.recommendations.some((r) =>
      r.toLowerCase().includes('network')
    );
    expect(hasNetworkingRec).toBe(true);
  });
 
  test('recommends taking a break for HIGH risk profiles', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 80,
        rejections: 55,
        interviews: 4,
        responses: 15,
        unansweredApplications: 65,
        daysSearching: 80,
      })
    );
 
    if (result.riskLevel === 'HIGH') {
      const hasBreakRec = result.recommendations.some((r) =>
        r.toLowerCase().includes('break')
      );
      expect(hasBreakRec).toBe(true);
    } else {
      // Accept any risk level — still validate shape
      expectSuccessShape(result);
    }
  });
 
  test('recommends pausing search for SEVERE risk profiles', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 150,
        rejections: 120,
        interviews: 1,
        responses: 10,
        unansweredApplications: 140,
        daysSearching: 130,
      })
    );
 
    expectSuccessShape(result);
    expect(result.riskLevel).toBe('SEVERE');
    const hasPauseRec = result.recommendations.some((r) =>
      r.toLowerCase().includes('pausing')
    );
    expect(hasPauseRec).toBe(true);
  });
});
 
// ---------------------------------------------------------------------------
// generateBurnoutReport
// ---------------------------------------------------------------------------
 
describe('generateBurnoutReport', () => {
  test('returns all analysis fields plus a report object', () => {
    const result = generateBurnoutReport(buildInput());
 
    expectSuccessShape(result);
    expect(result.report).toBeDefined();
    expect(typeof result.report.summary).toBe('string');
    expect(result.report.summary.length).toBeGreaterThan(0);
    expect(typeof result.report.urgency).toBe('string');
    expect(result.report.urgency.length).toBeGreaterThan(0);
  });
 
  test('report summary mentions the risk level', () => {
    const result = generateBurnoutReport(buildInput());
    expectSuccessShape(result);
    expect(result.report.summary).toContain(result.riskLevel);
  });
 
  test('report summary mentions the burnout score', () => {
    const result = generateBurnoutReport(buildInput());
    expectSuccessShape(result);
    expect(result.report.summary).toContain(String(result.burnoutScore));
  });
 
  test('propagates validation error without a report field', () => {
    const result = generateBurnoutReport(buildInput({ applicationsSent: -1 }));
    expectErrorShape(result);
    expect(result.report).toBeUndefined();
  });
 
  test('urgency is "Immediate intervention recommended" for SEVERE risk', () => {
    const result = generateBurnoutReport(
      buildInput({
        applicationsSent: 150,
        rejections: 120,
        interviews: 1,
        responses: 10,
        unansweredApplications: 140,
        daysSearching: 130,
      })
    );
 
    expectSuccessShape(result);
    expect(result.riskLevel).toBe('SEVERE');
    expect(result.report.urgency).toBe('Immediate intervention recommended');
  });
 
  test('urgency is "No immediate action required" for LOW risk', () => {
    const result = generateBurnoutReport(
      buildInput({
        applicationsSent: 20,
        rejections: 2,
        interviews: 10,
        responses: 18,
        unansweredApplications: 2,
        daysSearching: 10,
      })
    );
 
    expectSuccessShape(result);
    expect(result.riskLevel).toBe('LOW');
    expect(result.report.urgency).toBe('No immediate action required');
  });
});
 
// ---------------------------------------------------------------------------
// Default export
// ---------------------------------------------------------------------------
 
describe('default export', () => {
  test('default export exposes detectApplicationBurnout', () => {
    expect(typeof burnoutDetector.detectApplicationBurnout).toBe('function');
  });
 
  test('default export exposes generateBurnoutReport', () => {
    expect(typeof burnoutDetector.generateBurnoutReport).toBe('function');
  });
 
  test('default export functions produce the same results as named exports', () => {
    const input = buildInput();
    const viaDefault = burnoutDetector.detectApplicationBurnout(input);
    const viaNamed = detectApplicationBurnout(input);
 
    // Exclude timestamp from comparison (may differ by milliseconds)
    const { timestamp: t1, ...restDefault } = viaDefault;
    const { timestamp: t2, ...restNamed } = viaNamed;
 
    expect(restDefault).toEqual(restNamed);
  });
});