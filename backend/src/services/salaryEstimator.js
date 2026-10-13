/**
 * Salary Estimator Service
 *
 * Produces a salary range for a role/location pair without requiring the user
 * to supply an API key or spend AI quota.
 *
 * Strategy, in order:
 *  1. Aggregate real postings returned by the configured job-search provider.
 *  2. If there is no provider key, or too few postings carry salary data, fall
 *     back to a curated baseline table so the feature still returns something
 *     useful instead of an error.
 *
 * All figures are normalised to annual USD.
 */

/** Postings needed before we trust the live aggregate over the baseline. */
export const MIN_SAMPLE_SIZE = 3;

/**
 * Baseline annual USD ranges by role family and location tier.
 * Midpoints are deliberately conservative and intended as a floor, not a quote.
 */
const BASELINE_RANGES = {
  frontend: [95_000, 165_000],
  backend: [100_000, 175_000],
  fullstack: [95_000, 170_000],
  mobile: [95_000, 160_000],
  devops: [105_000, 175_000],
  data: [100_000, 175_000],
  ml: [120_000, 205_000],
  security: [110_000, 180_000],
  qa: [70_000, 125_000],
  product: [110_000, 175_000],
  design: [85_000, 145_000],
  marketing: [60_000, 120_000],
  sales: [60_000, 140_000],
  general: [70_000, 140_000],
};

/** Location tiers applied as a multiplier on the baseline midpoint. */
const LOCATION_TIERS = [
  { match: /san francisco|new york|seattle|austin|boston|los angeles|chicago|brooklyn|manhattan/i, factor: 1.15, label: 'Major US tech hub' },
  { match: /denver|atlanta|austin|portland|san diego|raleigh|washington|charlotte/i, factor: 1.0, label: 'US growth market' },
  { match: /remote|anywhere|distributed/i, factor: 0.95, label: 'Remote' },
  { match: /india|pakistan|bangladesh|philippines|ukraine|romania|poland|latam|brazil|mexico/i, factor: 0.45, label: 'Lower-cost region' },
];

/** Experience multipliers applied to both live and baseline figures. */
const EXPERIENCE_FACTORS = {
  intern: 0.35,
  entry: 0.7,
  mid: 1.0,
  senior: 1.3,
  lead: 1.5,
  principal: 1.7,
};

/**
 * Maps a free-text job title onto one of the baseline role families.
 * @param {string} title
 * @returns {string} family key
 */
export function classifyRole(title = '') {
  const t = String(title).toLowerCase();

  if (/machine learning|ml engineer|ai engineer|deep learning|data scientist/.test(t)) return 'ml';
  if (/data engineer|data analyst|analytics|analytics engineer/.test(t)) return 'data';
  if (/devops|sre|site reliability|platform engineer|infrastructure|cloud engineer/.test(t)) return 'devops';
  if (/security|appsec|infosec|penetration/.test(t)) return 'security';
  if (/qa|quality assurance|test engineer|sdet/.test(t)) return 'qa';
  if (/product manager|product owner|product design/.test(t)) return 'product';
  if (/designer|ux|ui design|figma/.test(t)) return 'design';
  if (/frontend|front-end|react|vue|angular|ui engineer/.test(t)) return 'frontend';
  if (/backend|back-end|node|python|django|rails|java|golang|api engineer/.test(t)) return 'backend';
  if (/fullstack|full-stack|full stack/.test(t)) return 'fullstack';
  if (/ios|android|mobile|react native|flutter/.test(t)) return 'mobile';
  if (/marketing|growth|seo|content/.test(t)) return 'marketing';
  if (/sales|account executive|business development|bdr|sdr/.test(t)) return 'sales';

  return 'general';
}

/**
 * Resolves a location multiplier.
 * @param {string} location
 * @returns {{factor: number, label: string}}
 */
export function resolveLocationTier(location = '') {
  const l = String(location).toLowerCase();
  if (!l.trim()) return { factor: 1.0, label: 'Location not specified' };

  for (const tier of LOCATION_TIERS) {
    if (tier.match.test(l)) return { factor: tier.factor, label: tier.label };
  }
  return { factor: 1.0, label: 'General market' };
}

/**
 * Resolves an experience multiplier, defaulting to mid-level.
 * @param {string} level
 * @returns {number}
 */
export function resolveExperienceFactor(level = '') {
  const l = String(level).toLowerCase().trim();
  if (!l) return 1.0;
  if (l.includes('intern')) return EXPERIENCE_FACTORS.intern;
  if (l.includes('entry') || l.includes('junior')) return EXPERIENCE_FACTORS.entry;
  if (l.includes('lead') || l.includes('staff')) return EXPERIENCE_FACTORS.lead;
  if (l.includes('principal')) return EXPERIENCE_FACTORS.principal;
  if (l.includes('senior') || l.includes('sr')) return EXPERIENCE_FACTORS.senior;
  return EXPERIENCE_FACTORS.mid;
}

/** Multipliers from the provider's `period` field to annual. */
const PERIOD_FACTORS = {
  hour: 2080,
  hourly: 2080,
  day: 260,
  daily: 260,
  week: 52,
  weekly: 52,
  month: 12,
  monthly: 12,
  year: 1,
  yearly: 1,
  annual: 1,
};

/**
 * Converts a single posting's salary into annual USD, or null if unusable.
 * Only USD postings are aggregated; we do not guess at FX conversion.
 *
 * @param {{job_min_salary?: number, job_max_salary?: number,
 *          job_salary_currency?: string, job_salary_period?: string}} job
 * @returns {{min: number, max: number}|null}
 */
export function normalizePostingSalary(job = {}) {
  const min = Number(job.job_min_salary);
  const max = Number(job.job_max_salary);

  const hasMin = Number.isFinite(min) && min > 0;
  const hasMax = Number.isFinite(max) && max > 0;
  if (!hasMin && !hasMax) return null;

  const currency = (job.job_salary_currency || 'USD').toUpperCase();
  if (currency !== 'USD') return null;

  const period = String(job.job_salary_period || 'YEAR').toLowerCase();
  const factor = PERIOD_FACTORS[period] ?? PERIOD_FACTORS.yearly;

  const low = (hasMin ? min : max) * factor;
  const high = (hasMax ? max : min) * factor;

  // Guard against obviously bogus postings (e.g. an hourly rate typed as annual).
  if (low > 5_000_000) return null;

  return { min: Math.round(low), max: Math.round(high) };
}

/**
 * Linear-interpolated percentile over an ascending array.
 * @param {number[]} sorted
 * @param {number} p between 0 and 1
 * @returns {number}
 */
export function percentile(sorted, p) {
  if (!sorted.length) return 0;
  if (sorted.length === 1) return sorted[0];

  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);

  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/**
 * Aggregates normalised postings into a salary band.
 *
 * @param {Array<{min: number, max: number}>} postings
 * @returns {object|null} null when there is not enough data
 */
export function aggregatePostings(postings) {
  const usable = (postings || []).filter((p) => p && Number.isFinite(p.min) && Number.isFinite(p.max));
  if (usable.length < MIN_SAMPLE_SIZE) return null;

  const midpoints = usable.map((p) => (p.min + p.max) / 2).sort((a, b) => a - b);

  const round = (n) => Math.round(n / 1000) * 1000;

  return {
    source: 'postings',
    sampleSize: usable.length,
    currency: 'USD',
    period: 'yearly',
    p10: round(percentile(midpoints, 0.1)),
    p25: round(percentile(midpoints, 0.25)),
    median: round(percentile(midpoints, 0.5)),
    p75: round(percentile(midpoints, 0.75)),
    p90: round(percentile(midpoints, 0.9)),
  };
}

/**
 * Baseline estimate for a role/location/level when live data is unavailable.
 *
 * @param {{title?: string, location?: string, experienceLevel?: string}} input
 * @returns {object}
 */
export function baselineEstimate({ title = '', location = '', experienceLevel = '' } = {}) {
  const family = classifyRole(title);
  const [low, high] = BASELINE_RANGES[family];
  const locationTier = resolveLocationTier(location);
  const experienceFactor = resolveExperienceFactor(experienceLevel);

  const scale = locationTier.factor * experienceFactor;
  const round = (n) => Math.round(n / 1000) * 1000;

  return {
    source: 'baseline',
    sampleSize: 0,
    roleFamily: family,
    locationTier: locationTier.label,
    currency: 'USD',
    period: 'yearly',
    p10: round(low * scale * 0.85),
    p25: round(low * scale),
    median: round(((low + high) / 2) * scale),
    p75: round(high * scale),
    p90: round(high * scale * 1.15),
  };
}

/**
 * Primary entry point. Prefers real postings, falls back to the baseline.
 *
 * @param {{title: string, location?: string, experienceLevel?: string,
 *          postings?: Array<object>}} input
 * @returns {object} estimate with a `source` of 'postings' or 'baseline'
 */
export function estimateSalary({ title, location, experienceLevel, postings } = {}) {
  const normalized = (postings || [])
    .map(normalizePostingSalary)
    .filter(Boolean);

  const fromPostings = aggregatePostings(normalized);

  if (fromPostings) {
    return {
      ...fromPostings,
      roleFamily: classifyRole(title),
      locationTier: resolveLocationTier(location).label,
    };
  }

  return baselineEstimate({ title, location, experienceLevel });
}