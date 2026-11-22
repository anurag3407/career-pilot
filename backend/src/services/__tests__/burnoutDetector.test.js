/**
 * @fileoverview Jest test suite — burnoutDetector service
 * @module __tests__/burnoutDetector.test
 *
 * @description Covers all public functions and exported helpers:
 *   - detectApplicationBurnout()  — all four risk levels, edge cases, validation
 *   - generateBurnoutReport()     — report shape, keyMetrics, urgency, error propagation
 *   - validateInput()             — unit-tested directly via named export
 *   - computeMetrics()            — rate arithmetic correctness
 *   - calculateBurnoutScore()     — weighted formula + clamping
 *   - determineRiskLevel()        — threshold boundary conditions
 *   - generateIndicators()        — threshold-gated strings
 *   - generateRecommendations()   — risk-level-gated advice
 *
 * Test naming convention: "<function> — <scenario>"
 * Each describe block maps 1-to-1 with a public or helper function.
 */
 
import burnoutDetectorDefault, {
  detectApplicationBurnout,
  generateBurnoutReport,
  validateInput,
  computeMetrics,
  calculateBurnoutScore,
  determineRiskLevel,
  generateIndicators,
  generateRecommendations,
} from '../burnoutDetector.js';
 
// ─────────────────────────────────────────────────────────────────────────────
// Shared fixtures & helpers
// ─────────────────────────────────────────────────────────────────────────────
 
/**
 * Returns a valid input object with sane defaults, allowing targeted overrides.
 *
 * @param {Object} [overrides={}]
 * @returns {Object}
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
 
/** Asserts every field present on a valid success response. */
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
  // Every response must include a valid ISO timestamp
  expect(typeof result.timestamp).toBe('string');
  expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
};
 
/** Asserts a structured error response — never throws, always has timestamp. */
const expectErrorShape = (result) => {
  expect(result.success).toBe(false);
  expect(typeof result.error).toBe('string');
  expect(result.error.length).toBeGreaterThan(0);
  expect(typeof result.timestamp).toBe('string');
  expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
};
 
// ─────────────────────────────────────────────────────────────────────────────
// 1. detectApplicationBurnout — risk level scenarios
// ─────────────────────────────────────────────────────────────────────────────
 
describe('detectApplicationBurnout — risk level scenarios', () => {
  test('LOW risk: healthy activity yields score ≤ 25', () => {
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
    expect(result.riskLevel).toBe('LOW');
    expect(result.burnoutScore).toBeLessThanOrEqual(25);
  });
 
  test('MEDIUM risk: moderate rejection & partial responsiveness yields score 26–50', () => {
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
 
  test('HIGH risk: high rejection & prolonged search yields score 51–75', () => {
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
 
  test('SEVERE risk: near-zero response rate & 130-day search yields score > 75', () => {
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
 
// ─────────────────────────────────────────────────────────────────────────────
// 2. detectApplicationBurnout — timestamp always present
// ─────────────────────────────────────────────────────────────────────────────
 
describe('detectApplicationBurnout — timestamp field', () => {
  test('success response always contains a valid ISO 8601 timestamp', () => {
    const before = Date.now();
    const result = detectApplicationBurnout(buildInput());
    const after = Date.now();
 
    expectSuccessShape(result);
    const ts = new Date(result.timestamp).getTime();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });
 
  test('error response always contains a valid ISO 8601 timestamp', () => {
    const result = detectApplicationBurnout(null);
    expectErrorShape(result);
    const ts = new Date(result.timestamp).getTime();
    expect(ts).toBeGreaterThan(0);
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 3. detectApplicationBurnout — structured error responses
// ─────────────────────────────────────────────────────────────────────────────
 
describe('detectApplicationBurnout — structured error responses', () => {
  test('null input returns structured error (not thrown exception)', () => {
    const result = detectApplicationBurnout(null);
    expectErrorShape(result);
    expect(result.error).toBe('Application data must be an object');
  });
 
  test('undefined input returns structured error', () => {
    const result = detectApplicationBurnout(undefined);
    expectErrorShape(result);
    expect(result.error).toBe('Application data must be an object');
  });
 
  test('array input returns structured error (arrays are typeof object)', () => {
    // Arrays pass the typeof check but fail field validation — still a
    // structured error, not an exception.
    const result = detectApplicationBurnout([1, 2, 3]);
    expectErrorShape(result);
  });
 
  test('string input returns structured error', () => {
    const result = detectApplicationBurnout('bad input');
    expectErrorShape(result);
    expect(result.error).toBe('Application data must be an object');
  });
 
  test('number input returns structured error', () => {
    const result = detectApplicationBurnout(42);
    expectErrorShape(result);
  });
 
  test('missing required field returns structured error naming the field', () => {
    const input = buildInput();
    delete input.applicationsSent;
    const result = detectApplicationBurnout(input);
    expectErrorShape(result);
    expect(result.error).toContain('applicationsSent');
  });
 
  test('negative value returns structured error naming the field', () => {
    const result = detectApplicationBurnout(buildInput({ rejections: -3 }));
    expectErrorShape(result);
    expect(result.error).toContain('rejections');
  });
 
  test('NaN value returns structured error naming the field', () => {
    const result = detectApplicationBurnout(buildInput({ daysSearching: NaN }));
    expectErrorShape(result);
    expect(result.error).toContain('daysSearching');
  });
 
  test('string field value returns structured error naming the field', () => {
    const result = detectApplicationBurnout(buildInput({ interviews: '5' }));
    expectErrorShape(result);
    expect(result.error).toContain('interviews');
  });
 
  test('does NOT throw under any input — always returns an object', () => {
    const weirdInputs = [null, undefined, '', 0, false, [], {}, [null], { applicationsSent: Infinity }];
    weirdInputs.forEach((input) => {
      expect(() => detectApplicationBurnout(input)).not.toThrow();
      const result = detectApplicationBurnout(input);
      expect(typeof result).toBe('object');
      expect(result).not.toBeNull();
    });
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 4. detectApplicationBurnout — missing fields (one per required field)
// ─────────────────────────────────────────────────────────────────────────────
 
describe('detectApplicationBurnout — missing required fields', () => {
  const requiredFields = [
    'applicationsSent',
    'rejections',
    'interviews',
    'responses',
    'unansweredApplications',
    'daysSearching',
  ];
 
  requiredFields.forEach((field) => {
    test(`missing "${field}" → structured error referencing the field`, () => {
      const input = buildInput();
      delete input[field];
      const result = detectApplicationBurnout(input);
      expectErrorShape(result);
      expect(result.error).toContain(field);
    });
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 5. detectApplicationBurnout — negative values
// ─────────────────────────────────────────────────────────────────────────────
 
describe('detectApplicationBurnout — negative number validation', () => {
  test('negative applicationsSent → structured error', () => {
    const result = detectApplicationBurnout(buildInput({ applicationsSent: -1 }));
    expectErrorShape(result);
    expect(result.error).toContain('applicationsSent');
  });
 
  test('negative daysSearching → structured error', () => {
    const result = detectApplicationBurnout(buildInput({ daysSearching: -10 }));
    expectErrorShape(result);
    expect(result.error).toContain('daysSearching');
  });
 
  test('negative unansweredApplications → structured error', () => {
    const result = detectApplicationBurnout(
      buildInput({ unansweredApplications: -5 })
    );
    expectErrorShape(result);
    expect(result.error).toContain('unansweredApplications');
  });
 
  test('all zeros is valid (zero-day search, no applications sent)', () => {
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
 
// ─────────────────────────────────────────────────────────────────────────────
// 6. detectApplicationBurnout — relational validation
// ─────────────────────────────────────────────────────────────────────────────
 
describe('detectApplicationBurnout — relational validation', () => {
  test('rejections > applicationsSent → structured error naming both fields', () => {
    const result = detectApplicationBurnout(
      buildInput({ applicationsSent: 10, rejections: 15 })
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('rejections');
    expect(result.error).toContain('applicationsSent');
  });
 
  test('interviews > applicationsSent → structured error naming both fields', () => {
    const result = detectApplicationBurnout(
      buildInput({ applicationsSent: 10, interviews: 11 })
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('interviews');
    expect(result.error).toContain('applicationsSent');
  });
 
  test('responses > applicationsSent → structured error naming both fields', () => {
    const result = detectApplicationBurnout(
      buildInput({ applicationsSent: 10, responses: 20 })
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('responses');
    expect(result.error).toContain('applicationsSent');
  });
 
  test('unansweredApplications > applicationsSent → structured error naming both fields', () => {
    const result = detectApplicationBurnout(
      buildInput({ applicationsSent: 10, unansweredApplications: 25 })
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('unansweredApplications');
    expect(result.error).toContain('applicationsSent');
  });
 
  test('sub-counts equal to applicationsSent are valid (boundary)', () => {
    const result = detectApplicationBurnout(
      buildInput({
        applicationsSent: 10,
        rejections: 10,
        interviews: 0,
        responses: 10,
        unansweredApplications: 0,
        daysSearching: 30,
      })
    );
    expectSuccessShape(result);
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 7. detectApplicationBurnout — invalid data types
// ─────────────────────────────────────────────────────────────────────────────
 
describe('detectApplicationBurnout — invalid data types', () => {
  test('boolean field → structured error', () => {
    const result = detectApplicationBurnout(buildInput({ daysSearching: true }));
    expectErrorShape(result);
    expect(result.error).toContain('daysSearching');
  });
 
  test('null field → structured error', () => {
    const result = detectApplicationBurnout(buildInput({ responses: null }));
    expectErrorShape(result);
    expect(result.error).toContain('responses');
  });
 
  test('object field → structured error', () => {
    const result = detectApplicationBurnout(
      buildInput({ unansweredApplications: { count: 5 } })
    );
    expectErrorShape(result);
    expect(result.error).toContain('unansweredApplications');
  });
 
  test('array field → structured error', () => {
    const result = detectApplicationBurnout(buildInput({ rejections: [3] }));
    expectErrorShape(result);
    expect(result.error).toContain('rejections');
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 8. generateBurnoutReport — report structure
// ─────────────────────────────────────────────────────────────────────────────
 
describe('generateBurnoutReport — report generation', () => {
  test('returns all analysis fields plus a report object on success', () => {
    const result = generateBurnoutReport(buildInput());
 
    expectSuccessShape(result);
    expect(result.report).toBeDefined();
    expect(typeof result.report.summary).toBe('string');
    expect(result.report.summary.length).toBeGreaterThan(0);
    expect(typeof result.report.urgency).toBe('string');
    expect(result.report.urgency.length).toBeGreaterThan(0);
  });
 
  test('report.keyMetrics contains the four required rate fields', () => {
    const result = generateBurnoutReport(buildInput());
 
    expectSuccessShape(result);
    const { keyMetrics } = result.report;
    expect(typeof keyMetrics.rejectionRate).toBe('number');
    expect(typeof keyMetrics.interviewConversionRate).toBe('number');
    expect(typeof keyMetrics.responseRate).toBe('number');
    expect(typeof keyMetrics.applicationIntensity).toBe('number');
  });
 
  test('report.keyMetrics values match metrics returned by detectApplicationBurnout', () => {
    const input = buildInput();
    const analysisResult = detectApplicationBurnout(input);
    const reportResult = generateBurnoutReport(input);
 
    expect(reportResult.report.keyMetrics.rejectionRate).toBe(
      analysisResult.metrics.rejectionRate
    );
    expect(reportResult.report.keyMetrics.responseRate).toBe(
      analysisResult.metrics.responseRate
    );
  });
 
  test('report.summary mentions the risk level', () => {
    const result = generateBurnoutReport(buildInput());
    expect(result.report.summary).toContain(result.riskLevel);
  });
 
  test('report.summary mentions the burnout score', () => {
    const result = generateBurnoutReport(buildInput());
    expect(result.report.summary).toContain(String(result.burnoutScore));
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
    expect(result.riskLevel).toBe('LOW');
    expect(result.report.urgency).toBe('No immediate action required');
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
    expect(result.riskLevel).toBe('SEVERE');
    expect(result.report.urgency).toBe('Immediate intervention recommended');
  });
 
  test('propagates validation error without a report field', () => {
    const result = generateBurnoutReport(buildInput({ applicationsSent: -1 }));
    expectErrorShape(result);
    expect(result.report).toBeUndefined();
  });
 
  test('propagates null-input error without a report field', () => {
    const result = generateBurnoutReport(null);
    expectErrorShape(result);
    expect(result.report).toBeUndefined();
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 9. generateBurnoutReport — recommendation generation
// ─────────────────────────────────────────────────────────────────────────────
 
describe('generateBurnoutReport — recommendation generation', () => {
  test('always includes at least one recommendation', () => {
    const result = generateBurnoutReport(buildInput());
    expectSuccessShape(result);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(1);
  });
 
  test('recommends quality over quantity when applicationIntensity ≥ 3', () => {
    const result = generateBurnoutReport(
      buildInput({ applicationsSent: 120, daysSearching: 30 })
    );
    const hasQuality = result.recommendations.some((r) =>
      r.toLowerCase().includes('quality')
    );
    expect(hasQuality).toBe(true);
  });
 
  test('recommends resume revision when response rate < 20%', () => {
    const result = generateBurnoutReport(
      buildInput({
        applicationsSent: 100,
        rejections: 70,
        interviews: 1,
        responses: 5,
        unansweredApplications: 95,
        daysSearching: 40,
      })
    );
    const hasResume = result.recommendations.some((r) =>
      r.toLowerCase().includes('resume')
    );
    expect(hasResume).toBe(true);
  });
 
  test('recommends networking when response rate < 25%', () => {
    const result = generateBurnoutReport(
      buildInput({
        applicationsSent: 100,
        rejections: 10,
        interviews: 2,
        responses: 15,
        unansweredApplications: 85,
        daysSearching: 40,
      })
    );
    const hasNetworking = result.recommendations.some((r) =>
      r.toLowerCase().includes('network')
    );
    expect(hasNetworking).toBe(true);
  });
 
  test('SEVERE risk includes "pausing" recommendation', () => {
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
    const hasPause = result.recommendations.some((r) =>
      r.toLowerCase().includes('pausing')
    );
    expect(hasPause).toBe(true);
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 10. validateInput — unit tests via named export
// ─────────────────────────────────────────────────────────────────────────────
 
describe('validateInput (helper unit tests)', () => {
  test('valid complete input returns { valid: true, error: null }', () => {
    const result = validateInput(buildInput());
    expect(result.valid).toBe(true);
    expect(result.error).toBeNull();
  });
 
  test('missing field returns { valid: false, error: <field name> }', () => {
    const input = buildInput();
    delete input.interviews;
    const result = validateInput(input);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('interviews');
  });
 
  test('non-number field returns { valid: false }', () => {
    const result = validateInput(buildInput({ applicationsSent: 'fifty' }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('applicationsSent');
  });
 
  test('negative field returns { valid: false }', () => {
    const result = validateInput(buildInput({ rejections: -1 }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('rejections');
  });
 
  test('NaN field is caught as non-number', () => {
    const result = validateInput(buildInput({ daysSearching: NaN }));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('daysSearching');
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 11. computeMetrics — unit tests via named export
// ─────────────────────────────────────────────────────────────────────────────
 
describe('computeMetrics (helper unit tests)', () => {
  test('correctly computes all five rates', () => {
    const metrics = computeMetrics({
      applicationsSent: 100,
      rejections: 60,
      interviews: 10,
      responses: 30,
      unansweredApplications: 70,
      daysSearching: 50,
    });
 
    expect(metrics.rejectionRate).toBeCloseTo(0.6, 4);
    expect(metrics.interviewConversionRate).toBeCloseTo(0.1, 4);
    expect(metrics.responseRate).toBeCloseTo(0.3, 4);
    expect(metrics.unansweredRate).toBeCloseTo(0.7, 4);
    expect(metrics.applicationIntensity).toBeCloseTo(2.0, 4);
  });
 
  test('returns all zeros when applicationsSent is 0 (no division by zero)', () => {
    const metrics = computeMetrics({
      applicationsSent: 0,
      rejections: 0,
      interviews: 0,
      responses: 0,
      unansweredApplications: 0,
      daysSearching: 10,
    });
 
    expect(metrics.rejectionRate).toBe(0);
    expect(metrics.interviewConversionRate).toBe(0);
    expect(metrics.responseRate).toBe(0);
    expect(metrics.unansweredRate).toBe(0);
    expect(metrics.applicationIntensity).toBe(0);
  });
 
  test('applicationIntensity uses Math.max(daysSearching, 1) so daysSearching=0 does not cause division by zero', () => {
    const metrics = computeMetrics({
      applicationsSent: 5,
      rejections: 0,
      interviews: 0,
      responses: 0,
      unansweredApplications: 0,
      daysSearching: 0,
    });
    expect(isFinite(metrics.applicationIntensity)).toBe(true);
    expect(metrics.applicationIntensity).toBe(5);
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 12. calculateBurnoutScore — unit tests via named export
// ─────────────────────────────────────────────────────────────────────────────
 
describe('calculateBurnoutScore (helper unit tests)', () => {
  test('score is always within [0, 100]', () => {
    // Worst-case inputs
    const worstMetrics = computeMetrics({
      applicationsSent: 1,
      rejections: 1,
      interviews: 0,
      responses: 0,
      unansweredApplications: 1,
      daysSearching: 365,
    });
    const score = calculateBurnoutScore(worstMetrics, 365);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
 
  test('best-case inputs produce a low score', () => {
    const bestMetrics = computeMetrics({
      applicationsSent: 10,
      rejections: 0,
      interviews: 9,
      responses: 10,
      unansweredApplications: 0,
      daysSearching: 7,
    });
    const score = calculateBurnoutScore(bestMetrics, 7);
    expect(score).toBeLessThanOrEqual(25);
  });
 
  test('score is a finite number (not NaN or Infinity)', () => {
    const metrics = computeMetrics({
      applicationsSent: 50,
      rejections: 25,
      interviews: 5,
      responses: 15,
      unansweredApplications: 35,
      daysSearching: 45,
    });
    const score = calculateBurnoutScore(metrics, 45);
    expect(isFinite(score)).toBe(true);
    expect(isNaN(score)).toBe(false);
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 13. determineRiskLevel — boundary conditions
// ─────────────────────────────────────────────────────────────────────────────
 
describe('determineRiskLevel (helper unit tests)', () => {
  test('score 0 → LOW', () => expect(determineRiskLevel(0)).toBe('LOW'));
  test('score 25 → LOW (inclusive upper boundary)', () => expect(determineRiskLevel(25)).toBe('LOW'));
  test('score 25.1 → MEDIUM', () => expect(determineRiskLevel(25.1)).toBe('MEDIUM'));
  test('score 50 → MEDIUM (inclusive upper boundary)', () => expect(determineRiskLevel(50)).toBe('MEDIUM'));
  test('score 50.1 → HIGH', () => expect(determineRiskLevel(50.1)).toBe('HIGH'));
  test('score 75 → HIGH (inclusive upper boundary)', () => expect(determineRiskLevel(75)).toBe('HIGH'));
  test('score 75.1 → SEVERE', () => expect(determineRiskLevel(75.1)).toBe('SEVERE'));
  test('score 100 → SEVERE', () => expect(determineRiskLevel(100)).toBe('SEVERE'));
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 14. generateIndicators — threshold-gated strings
// ─────────────────────────────────────────────────────────────────────────────
 
describe('generateIndicators (helper unit tests)', () => {
  const makeMetrics = (overrides) =>
    computeMetrics({ applicationsSent: 100, rejections: 0, interviews: 0, responses: 0, unansweredApplications: 0, daysSearching: 30, ...overrides });
 
  test('returns empty array when all metrics are healthy', () => {
    const metrics = computeMetrics({
      applicationsSent: 20,
      rejections: 1,
      interviews: 10,
      responses: 19,
      unansweredApplications: 1,
      daysSearching: 7,
    });
    const indicators = generateIndicators(metrics, { daysSearching: 7 });
    expect(indicators).toHaveLength(0);
  });
 
  test('generates rejection-rate indicator when rejection rate ≥ 70%', () => {
    const metrics = makeMetrics({ rejections: 75 });
    const indicators = generateIndicators(metrics, { daysSearching: 30 });
    expect(indicators.some((i) => i.toLowerCase().includes('rejection rate'))).toBe(true);
  });
 
  test('generates unanswered indicator when unanswered rate ≥ 80%', () => {
    const metrics = makeMetrics({ unansweredApplications: 85 });
    const indicators = generateIndicators(metrics, { daysSearching: 30 });
    expect(indicators.some((i) => i.toLowerCase().includes('unanswered'))).toBe(true);
  });
 
  test('generates duration indicator when daysSearching ≥ 90', () => {
    const metrics = makeMetrics({});
    const indicators = generateIndicators(metrics, { daysSearching: 95 });
    expect(indicators.some((i) => i.toLowerCase().includes('days'))).toBe(true);
  });
 
  test('generates volume indicator when applicationIntensity ≥ 5', () => {
    const metrics = computeMetrics({
      applicationsSent: 200,
      rejections: 0,
      interviews: 0,
      responses: 0,
      unansweredApplications: 0,
      daysSearching: 30,
    });
    const indicators = generateIndicators(metrics, { daysSearching: 30 });
    expect(indicators.some((i) => i.toLowerCase().includes('applications per day'))).toBe(true);
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 15. generateRecommendations — risk-level-gated advice
// ─────────────────────────────────────────────────────────────────────────────
 
describe('generateRecommendations (helper unit tests)', () => {
  const defaultMetrics = computeMetrics({
    applicationsSent: 50,
    rejections: 20,
    interviews: 5,
    responses: 15,
    unansweredApplications: 35,
    daysSearching: 40,
  });
 
  test('always includes at least one recommendation for any risk level', () => {
    ['LOW', 'MEDIUM', 'HIGH', 'SEVERE'].forEach((level) => {
      const recs = generateRecommendations(level, defaultMetrics, { daysSearching: 40, interviews: 5 });
      expect(recs.length).toBeGreaterThanOrEqual(1);
    });
  });
 
  test('SEVERE risk includes support/pause recommendation', () => {
    const recs = generateRecommendations('SEVERE', defaultMetrics, { daysSearching: 40, interviews: 5 });
    const hasPause = recs.some((r) => r.toLowerCase().includes('pausing'));
    expect(hasPause).toBe(true);
  });
 
  test('HIGH risk includes break recommendation', () => {
    const recs = generateRecommendations('HIGH', defaultMetrics, { daysSearching: 40, interviews: 5 });
    const hasBreak = recs.some((r) => r.toLowerCase().includes('break'));
    expect(hasBreak).toBe(true);
  });
 
  test('MEDIUM risk includes short-break recommendation', () => {
    const recs = generateRecommendations('MEDIUM', defaultMetrics, { daysSearching: 40, interviews: 5 });
    const hasBreak = recs.some((r) => r.toLowerCase().includes('break'));
    expect(hasBreak).toBe(true);
  });
 
  test('all recommendations are non-empty strings', () => {
    const recs = generateRecommendations('HIGH', defaultMetrics, { daysSearching: 40, interviews: 5 });
    recs.forEach((r) => {
      expect(typeof r).toBe('string');
      expect(r.trim().length).toBeGreaterThan(0);
    });
  });
});
 
// ─────────────────────────────────────────────────────────────────────────────
// 16. Default export
// ─────────────────────────────────────────────────────────────────────────────
 
describe('default export', () => {
  test('exposes detectApplicationBurnout', () => {
    expect(typeof burnoutDetectorDefault.detectApplicationBurnout).toBe('function');
  });
 
  test('exposes generateBurnoutReport', () => {
    expect(typeof burnoutDetectorDefault.generateBurnoutReport).toBe('function');
  });
 
  test('exposes all six helper functions', () => {
    const helpers = [
      'validateInput',
      'computeMetrics',
      'calculateBurnoutScore',
      'determineRiskLevel',
      'generateIndicators',
      'generateRecommendations',
    ];
    helpers.forEach((fn) => {
      expect(typeof burnoutDetectorDefault[fn]).toBe('function');
    });
  });
 
  test('default-export functions are referentially identical to named exports', () => {
    expect(burnoutDetectorDefault.detectApplicationBurnout).toBe(detectApplicationBurnout);
    expect(burnoutDetectorDefault.generateBurnoutReport).toBe(generateBurnoutReport);
    expect(burnoutDetectorDefault.validateInput).toBe(validateInput);
  });
 
  test('default-export detectApplicationBurnout produces same result as named export', () => {
    const input = buildInput();
    const via = burnoutDetectorDefault.detectApplicationBurnout(input);
    const named = detectApplicationBurnout(input);
 
    // Exclude timestamp — may differ by a millisecond
    const { timestamp: _t1, ...restVia } = via;
    const { timestamp: _t2, ...restNamed } = named;
    expect(restVia).toEqual(restNamed);
  });
});
 
