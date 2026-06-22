/**
 * @fileoverview Burnout Detector Service
 * @module burnoutDetector
 * @description Analyzes a user's job application activity to detect burnout risk,
 * compute key metrics, generate human-readable indicators, and provide
 * actionable recommendations to support job-seekers.
 *
 * @author GSSoC Contributor
 * @version 1.0.0
 */
 
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
 
/** Weights used when accumulating the raw burnout score (total = 100). */
const SCORE_WEIGHTS = {
  REJECTION_RATE: 25,
  INTERVIEW_CONVERSION: 20,
  RESPONSE_RATE: 20,
  UNANSWERED_RATE: 15,
  SEARCH_DURATION: 10,
  APPLICATION_VOLUME: 10,
};
 
/** Thresholds that map a raw burnout score to a named risk level. */
const RISK_THRESHOLDS = {
  LOW: 25,
  MEDIUM: 50,
  HIGH: 75,
};
 
/** Risk level labels. */
const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  SEVERE: 'SEVERE',
};
 
/**
 * Applications-per-day rate considered "high volume".
 * More than this triggers the volume-based score contribution.
 */
const HIGH_VOLUME_THRESHOLD = 5;
 
/**
 * Number of days after which the search is considered "prolonged".
 * Used to calculate the duration component of the burnout score.
 */
const PROLONGED_SEARCH_DAYS = 90;
 
// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------
 
/**
 * Validates the input object for burnout analysis.
 *
 * @param {Object} input - Raw input to validate.
 * @returns {{ valid: boolean, error: string|null }} Validation result.
 */
const validateInput = (input) => {
  const requiredFields = [
    'applicationsSent',
    'rejections',
    'interviews',
    'responses',
    'unansweredApplications',
    'daysSearching',
  ];
 
  // Check all required fields are present
  for (const field of requiredFields) {
    if (input[field] === undefined || input[field] === null) {
      return { valid: false, error: `Missing required field: "${field}"` };
    }
  }
 
  // Check all values are numbers
  for (const field of requiredFields) {
    if (typeof input[field] !== 'number' || isNaN(input[field])) {
      return {
        valid: false,
        error: `Field "${field}" must be a valid number, received: ${typeof input[field]}`,
      };
    }
  }
 
  // Check all values are non-negative
  for (const field of requiredFields) {
    if (input[field] < 0) {
      return {
        valid: false,
        error: `Field "${field}" must be a non-negative number, received: ${input[field]}`,
      };
    }
  }
 
  // Relational checks: sub-counts cannot exceed total applications sent.
  // These run after the numeric/non-negative guards so we can safely compare.
  const { applicationsSent, rejections, interviews, responses, unansweredApplications } = input;
 
  if (rejections > applicationsSent) {
    return {
      valid: false,
      error: `"rejections" (${rejections}) cannot exceed "applicationsSent" (${applicationsSent})`,
    };
  }
 
  if (interviews > applicationsSent) {
    return {
      valid: false,
      error: `"interviews" (${interviews}) cannot exceed "applicationsSent" (${applicationsSent})`,
    };
  }
 
  if (responses > applicationsSent) {
    return {
      valid: false,
      error: `"responses" (${responses}) cannot exceed "applicationsSent" (${applicationsSent})`,
    };
  }
 
  if (unansweredApplications > applicationsSent) {
    return {
      valid: false,
      error: `"unansweredApplications" (${unansweredApplications}) cannot exceed "applicationsSent" (${applicationsSent})`,
    };
  }
 
  return { valid: true, error: null };
};
 
// ---------------------------------------------------------------------------
// Metric helpers
// ---------------------------------------------------------------------------
 
/**
 * Safely divides two numbers, returning 0 when the denominator is 0.
 *
 * @param {number} numerator
 * @param {number} denominator
 * @returns {number} Result rounded to four decimal places.
 */
const safeDivide = (numerator, denominator) =>
  denominator === 0 ? 0 : Math.round((numerator / denominator) * 10000) / 10000;
 
/**
 * Computes derived metrics from raw application data.
 *
 * @param {Object} data - Validated application data.
 * @param {number} data.applicationsSent
 * @param {number} data.rejections
 * @param {number} data.interviews
 * @param {number} data.responses
 * @param {number} data.unansweredApplications
 * @param {number} data.daysSearching
 * @returns {Object} Computed metrics object.
 */
const computeMetrics = ({
  applicationsSent,
  rejections,
  interviews,
  responses,
  unansweredApplications,
  daysSearching,
}) => ({
  rejectionRate: safeDivide(rejections, applicationsSent),
  interviewConversionRate: safeDivide(interviews, applicationsSent),
  responseRate: safeDivide(responses, applicationsSent),
  unansweredRate: safeDivide(unansweredApplications, applicationsSent),
  applicationIntensity: safeDivide(applicationsSent, Math.max(daysSearching, 1)),
});
 
// ---------------------------------------------------------------------------
// Score calculation
// ---------------------------------------------------------------------------
 
/**
 * Calculates a burnout score (0–100) from the derived metrics and raw inputs.
 *
 * Scoring breakdown (weights sum to 100):
 * - Rejection rate        → 25 pts  (penalises high rejection)
 * - Interview conversion  → 20 pts  (rewards high conversion; inverted)
 * - Response rate         → 20 pts  (rewards high response; inverted)
 * - Unanswered rate       → 15 pts  (penalises being ignored)
 * - Search duration       → 10 pts  (penalises prolonged searches)
 * - Application volume    → 10 pts  (penalises scatter-gun approaches)
 *
 * @param {Object} metrics - Output from {@link computeMetrics}.
 * @param {number} daysSearching - Raw days searching value.
 * @returns {number} Burnout score clamped to [0, 100], rounded to one decimal.
 */
const calculateBurnoutScore = (metrics, daysSearching) => {
  const {
    rejectionRate,
    interviewConversionRate,
    responseRate,
    unansweredRate,
    applicationIntensity,
  } = metrics;
 
  // Each component contributes 0–(its weight) points.
  const rejectionComponent = rejectionRate * SCORE_WEIGHTS.REJECTION_RATE;
 
  // Low conversion → high score component (invert the rate).
  const conversionComponent =
    (1 - interviewConversionRate) * SCORE_WEIGHTS.INTERVIEW_CONVERSION;
 
  // Low response rate → high score component (invert the rate).
  const responseComponent =
    (1 - Math.min(responseRate, 1)) * SCORE_WEIGHTS.RESPONSE_RATE;
 
  const unansweredComponent = unansweredRate * SCORE_WEIGHTS.UNANSWERED_RATE;
 
  // Duration: linearly scales up to full weight at PROLONGED_SEARCH_DAYS.
  const durationComponent =
    Math.min(daysSearching / PROLONGED_SEARCH_DAYS, 1) *
    SCORE_WEIGHTS.SEARCH_DURATION;
 
  // Volume: linearly scales up to full weight at HIGH_VOLUME_THRESHOLD apps/day.
  const volumeComponent =
    Math.min(applicationIntensity / HIGH_VOLUME_THRESHOLD, 1) *
    SCORE_WEIGHTS.APPLICATION_VOLUME;
 
  const rawScore =
    rejectionComponent +
    conversionComponent +
    responseComponent +
    unansweredComponent +
    durationComponent +
    volumeComponent;
 
  return Math.round(Math.min(Math.max(rawScore, 0), 100) * 10) / 10;
};
 
// ---------------------------------------------------------------------------
// Risk level
// ---------------------------------------------------------------------------
 
/**
 * Converts a numeric burnout score into a named risk level.
 *
 * | Score range | Risk level |
 * |-------------|------------|
 * | 0 – 25      | LOW        |
 * | 26 – 50     | MEDIUM     |
 * | 51 – 75     | HIGH       |
 * | 76 – 100    | SEVERE     |
 *
 * @param {number} score - Burnout score (0–100).
 * @returns {string} One of LOW | MEDIUM | HIGH | SEVERE.
 */
const determineRiskLevel = (score) => {
  if (score <= RISK_THRESHOLDS.LOW) return RISK_LEVELS.LOW;
  if (score <= RISK_THRESHOLDS.MEDIUM) return RISK_LEVELS.MEDIUM;
  if (score <= RISK_THRESHOLDS.HIGH) return RISK_LEVELS.HIGH;
  return RISK_LEVELS.SEVERE;
};
 
// ---------------------------------------------------------------------------
// Indicators
// ---------------------------------------------------------------------------
 
/**
 * Generates an array of human-readable burnout indicators based on the
 * metrics and raw input values.
 *
 * @param {Object} metrics - Output from {@link computeMetrics}.
 * @param {Object} rawData - Original validated input data.
 * @returns {string[]} Array of indicator strings (may be empty for low-risk profiles).
 */
const generateIndicators = (metrics, rawData) => {
  const indicators = [];
  const {
    rejectionRate,
    interviewConversionRate,
    responseRate,
    unansweredRate,
    applicationIntensity,
  } = metrics;
  const { daysSearching } = rawData;
 
  if (rejectionRate >= 0.7) {
    indicators.push(
      `Very high rejection rate of ${(rejectionRate * 100).toFixed(1)}% — most applications are not progressing.`
    );
  } else if (rejectionRate >= 0.5) {
    indicators.push(
      `Elevated rejection rate of ${(rejectionRate * 100).toFixed(1)}% — more than half of applications result in rejection.`
    );
  }
 
  if (interviewConversionRate < 0.05) {
    indicators.push(
      `Very low interview conversion rate of ${(interviewConversionRate * 100).toFixed(1)}% — applications rarely lead to interviews.`
    );
  } else if (interviewConversionRate < 0.15) {
    indicators.push(
      `Below-average interview conversion rate of ${(interviewConversionRate * 100).toFixed(1)}%.`
    );
  }
 
  if (responseRate < 0.1) {
    indicators.push(
      `Critically low response rate of ${(responseRate * 100).toFixed(1)}% — the vast majority of applications receive no reply.`
    );
  } else if (responseRate < 0.25) {
    indicators.push(
      `Low response rate of ${(responseRate * 100).toFixed(1)}% — fewer than one in four applications receives a response.`
    );
  }
 
  if (unansweredRate >= 0.8) {
    indicators.push(
      `${(unansweredRate * 100).toFixed(1)}% of applications are unanswered — prolonged silence can be a significant source of stress.`
    );
  } else if (unansweredRate >= 0.6) {
    indicators.push(
      `${(unansweredRate * 100).toFixed(1)}% of applications remain unanswered.`
    );
  }
 
  if (daysSearching >= PROLONGED_SEARCH_DAYS) {
    indicators.push(
      `Job search has lasted ${daysSearching} days — extended searches significantly increase burnout risk.`
    );
  } else if (daysSearching >= 60) {
    indicators.push(
      `Job search is approaching ${daysSearching} days — monitoring for fatigue is advisable.`
    );
  }
 
  if (applicationIntensity >= HIGH_VOLUME_THRESHOLD) {
    indicators.push(
      `Sending ${applicationIntensity.toFixed(1)} applications per day — a high-volume scatter-gun approach often reduces quality and increases exhaustion.`
    );
  } else if (applicationIntensity >= 3) {
    indicators.push(
      `Sending ${applicationIntensity.toFixed(1)} applications per day — consider whether quality can be maintained at this pace.`
    );
  }
 
  return indicators;
};
 
// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------
 
/**
 * Generates tailored recommendations based on the risk level and metrics.
 *
 * @param {string} riskLevel - One of LOW | MEDIUM | HIGH | SEVERE.
 * @param {Object} metrics - Output from {@link computeMetrics}.
 * @param {Object} rawData - Original validated input data.
 * @returns {string[]} Prioritised list of actionable recommendation strings.
 */
const generateRecommendations = (riskLevel, metrics, rawData) => {
  const recommendations = [];
  const {
    rejectionRate,
    interviewConversionRate,
    responseRate,
    applicationIntensity,
  } = metrics;
  const { daysSearching } = rawData;
 
  // Universal baseline recommendations
  recommendations.push(
    'Track all applications in a spreadsheet or ATS tool to maintain clarity and control.'
  );
 
  // Resume / application quality
  if (responseRate < 0.2 || rejectionRate > 0.6) {
    recommendations.push(
      'Revise your resume and tailor it to each role — highlight measurable achievements and use keywords from the job description.'
    );
  }
 
  // Quantity vs. quality
  if (applicationIntensity >= 3) {
    recommendations.push(
      'Focus on quality over quantity — send fewer, more targeted applications to roles where you meet at least 70% of the requirements.'
    );
  }
 
  // Interview skills
  if (interviewConversionRate < 0.1) {
    recommendations.push(
      'Work on your cover letter strategy — a compelling narrative that connects your background directly to each company\'s mission can significantly improve callback rates.'
    );
  }
  if (rawData.interviews > 0 && interviewConversionRate >= 0.05) {
    recommendations.push(
      'Practice mock interviews — use structured formats (STAR method) and record yourself to identify areas of improvement.'
    );
  }
 
  // Networking
  if (responseRate < 0.25) {
    recommendations.push(
      'Invest more time in networking — reaching out to employees at target companies on LinkedIn or attending industry events can bypass the ATS entirely.'
    );
  }
 
  // Wellbeing — scaled by risk level
  if (riskLevel === RISK_LEVELS.MEDIUM) {
    recommendations.push(
      'Schedule regular short breaks from job-searching — even 1–2 days off per week can prevent emotional exhaustion.'
    );
  }
 
  if (riskLevel === RISK_LEVELS.HIGH) {
    recommendations.push(
      'Take a deliberate 3–5 day break from active applications to recharge. Return with a refreshed strategy rather than more volume.'
    );
    recommendations.push(
      'Consider speaking with a career counsellor or mentor who can provide an objective perspective on your search strategy.'
    );
  }
 
  if (riskLevel === RISK_LEVELS.SEVERE) {
    recommendations.push(
      'Strongly consider pausing your job search for 1–2 weeks to recover. Burnout impairs judgment and interview performance — rest is a productive investment.'
    );
    recommendations.push(
      'Seek support from a trusted friend, mentor, or mental-health professional. Job-search burnout is real and deserves care.'
    );
    recommendations.push(
      'When you return, drastically reduce application volume and dedicate the saved time to building skills, portfolio projects, or your professional network.'
    );
  }
 
  // Duration-specific advice
  if (daysSearching >= PROLONGED_SEARCH_DAYS) {
    recommendations.push(
      'After a long search, revisit your target role, industry, or location criteria — a small pivot can open significantly more opportunities.'
    );
  }
 
  return recommendations;
};
 
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
 
/**
 * Analyzes a user's job application activity and detects burnout risk.
 *
 * @param {Object} applicationData - The applicant's activity data.
 * @param {number} applicationData.applicationsSent - Total applications submitted.
 * @param {number} applicationData.rejections - Number of explicit rejections received.
 * @param {number} applicationData.interviews - Number of interview invitations received.
 * @param {number} applicationData.responses - Total responses received (includes rejections and interviews).
 * @param {number} applicationData.unansweredApplications - Applications with no reply.
 * @param {number} applicationData.daysSearching - Days the job search has been active.
 *
 * @returns {Object} Structured success or error response.
 * @returns {boolean} return.success - Whether the analysis completed successfully.
 * @returns {number} [return.burnoutScore] - Numeric burnout score (0–100).
 * @returns {string} [return.riskLevel] - LOW | MEDIUM | HIGH | SEVERE.
 * @returns {Object} [return.metrics] - Computed rate metrics.
 * @returns {string[]} [return.indicators] - Human-readable burnout indicators.
 * @returns {string[]} [return.recommendations] - Actionable recommendations.
 * @returns {string} [return.timestamp] - ISO 8601 timestamp of analysis.
 * @returns {string} [return.error] - Error message (only present on failure).
 *
 * @example
 * const result = detectApplicationBurnout({
 *   applicationsSent: 100,
 *   rejections: 80,
 *   interviews: 2,
 *   responses: 20,
 *   unansweredApplications: 80,
 *   daysSearching: 120,
 * });
 * // result.riskLevel → 'SEVERE'
 */
const detectApplicationBurnout = (applicationData) => {
  // --- Defensive type guard (O(1), no I/O) ---
  // Catches null, undefined, arrays, primitives before any field access.
  if (!applicationData || typeof applicationData !== 'object') {
    return {
      success: false,
      error: 'Application data must be an object',
      timestamp: new Date().toISOString(),
    };
  }
 
  try {
    // --- Field-level validation (O(n) where n = 6 fixed fields → effectively O(1)) ---
    const { valid, error } = validateInput(applicationData);
    if (!valid) {
      return {
        success: false,
        error,
        timestamp: new Date().toISOString(),
      };
    }
 
    const {
      applicationsSent,
      rejections,
      interviews,
      responses,
      unansweredApplications,
      daysSearching,
    } = applicationData;
 
    // --- Metrics (O(1): fixed arithmetic ops, no loops, no I/O) ---
    const metrics = computeMetrics({
      applicationsSent,
      rejections,
      interviews,
      responses,
      unansweredApplications,
      daysSearching,
    });
 
    // --- Score & risk level (O(1): weighted sum + threshold lookup) ---
    const burnoutScore = calculateBurnoutScore(metrics, daysSearching);
    const riskLevel = determineRiskLevel(burnoutScore);
 
    // --- Qualitative outputs (O(1): fixed indicator/recommendation checks) ---
    // No database access. No external API calls. Pure in-memory computation.
    const indicators = generateIndicators(metrics, applicationData);
    const recommendations = generateRecommendations(riskLevel, metrics, applicationData);
 
    return {
      success: true,
      burnoutScore,
      riskLevel,
      metrics,
      indicators,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    // Catch unexpected runtime errors (e.g. V8 edge cases) and surface them
    // as a structured response so callers never receive an unhandled exception.
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};
 
/**
 * Generates a comprehensive burnout report combining the analysis result with
 * a plain-English summary suitable for display in a UI or email.
 *
 * @param {Object} applicationData - Same input as {@link detectApplicationBurnout}.
 * @returns {Object} Extended response object that includes a `report` field, or
 *   a structured error response if validation fails.
 *
 * @property {string} return.report.summary - One-paragraph plain-English summary.
 * @property {string} return.report.urgency - Urgency label matching the risk level.
 *
 * @example
 * const report = generateBurnoutReport({ ... });
 * console.log(report.report.summary);
 */
const generateBurnoutReport = (applicationData) => {
  // Delegate to detectApplicationBurnout which already handles type-guard +
  // validation + try/catch — no need to duplicate that logic here.
  const analysisResult = detectApplicationBurnout(applicationData);
 
  if (!analysisResult.success) {
    return analysisResult; // Propagate structured error unchanged
  }
 
  try {
    const { burnoutScore, riskLevel, metrics, indicators, recommendations } =
      analysisResult;
 
    const urgencyMap = {
      [RISK_LEVELS.LOW]: 'No immediate action required',
      [RISK_LEVELS.MEDIUM]: 'Attention recommended',
      [RISK_LEVELS.HIGH]: 'Action required',
      [RISK_LEVELS.SEVERE]: 'Immediate intervention recommended',
    };
 
    // O(1): string interpolation, no I/O, no external calls
    const summary =
      `Based on your job-search activity, your burnout risk level is ${riskLevel} ` +
      `(score: ${burnoutScore}/100). ` +
      (indicators.length > 0
        ? `Key concerns include: ${indicators[0].toLowerCase()} `
        : 'No major red flags were detected. ') +
      `You have sent ${applicationData.applicationsSent} applications over ` +
      `${applicationData.daysSearching} day(s), with an interview conversion rate of ` +
      `${(metrics.interviewConversionRate * 100).toFixed(1)}% and a response rate of ` +
      `${(metrics.responseRate * 100).toFixed(1)}%. ` +
      (recommendations.length > 0
        ? `Top recommendation: ${recommendations[0]}`
        : '');
 
    const { rejectionRate, interviewConversionRate, responseRate, applicationIntensity } =
      metrics;
 
    return {
      ...analysisResult,
      report: {
        summary,
        urgency: urgencyMap[riskLevel],
        keyMetrics: {
          rejectionRate,
          interviewConversionRate,
          responseRate,
          applicationIntensity,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};
 
// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
 
// Named exports — public API + helpers exposed for unit testing
export {
  // Public API
  detectApplicationBurnout,
  generateBurnoutReport,
  // Helpers (exported for direct unit testing; not part of the public contract)
  validateInput,
  computeMetrics,
  calculateBurnoutScore,
  determineRiskLevel,
  generateIndicators,
  generateRecommendations,
};
 
export default {
  detectApplicationBurnout,
  generateBurnoutReport,
  validateInput,
  computeMetrics,
  calculateBurnoutScore,
  determineRiskLevel,
  generateIndicators,
  generateRecommendations,
};