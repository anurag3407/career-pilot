const DEFAULT_OPTIONS = Object.freeze({
  titleSimilarityThreshold: 0.8,
  postedAtToleranceDays: 14,
});

const MAX_FUZZY_BUCKET_SIZE = 250;
const MAX_FUZZY_CANDIDATES = 250;

const REMOTE_PREFIX_PATTERN =
  /^(?:remote|work from home|wfh|home based)(?:\s+|$)/;

const TRACKING_QUERY_PARAMETERS = new Set([
  'campaign',
  'fbclid',
  'from',
  'gclid',
  'gh_src',
  'ref',
  'referrer',
  'source',
  'trackingid',
  'trk',
]);

const SENIORITY_ALIASES = new Map([
  ['jr', 'junior'],
  ['sr', 'senior'],
]);

const SENIORITY_TOKENS = new Set([
  'intern',
  'trainee',
  'junior',
  'associate',
  'senior',
  'lead',
  'staff',
  'principal',
  'architect',
  'manager',
  'director',
  'head',
]);

const CANDIDATE_STOP_WORDS = new Set([
  ...SENIORITY_TOKENS,
  'job',
  'opening',
  'position',
  'role',
]);

const COMPANY_SUFFIX_PATTERN =
  /\b(?:private limited|pvt ltd|pvt limited|limited|ltd|llc|incorporated|inc|corporation|corp|company|co|plc)\s*$/;

const ARRAY_FIELDS_TO_MERGE = [
  'skills',
  'benefits',
  'tags',
  'requirements',
];

const DESCRIPTION_FIELDS = [
  'description',
  'descriptionSnippet',
];

/**
 * Normalize a value for case-insensitive comparisons.
 *
 * @param {*} value Value to normalize.
 * @returns {string} Normalized text.
 */
const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
};

/**
 * Normalize a job title and expand common seniority aliases.
 *
 * @param {*} title Job title.
 * @returns {string} Normalized title.
 */
const normalizeTitle = (title) =>
  normalizeText(title)
    .split(' ')
    .filter(Boolean)
    .map((token) => SENIORITY_ALIASES.get(token) ?? token)
    .join(' ');

/**
 * Normalize a company name and remove common legal suffixes.
 *
 * @param {*} company Company name.
 * @returns {string} Normalized company.
 */
const normalizeCompany = (company) => {
  let normalized = normalizeText(company);
  let previousValue;

  do {
    previousValue = normalized;
    normalized = normalized
      .replace(COMPANY_SUFFIX_PATTERN, '')
      .trim();
  } while (normalized && normalized !== previousValue);

  return normalized;
};

/**
 * Normalize a location while grouping common remote-work labels.
 *
 * @param {*} location Job location.
 * @param {boolean} isRemote Explicit remote flag.
 * @returns {string} Normalized location.
 */
const normalizeLocation = (location, isRemote = false) => {
  const normalized = normalizeText(location);

  if (!normalized) {
    return isRemote ? 'remote' : '';
  }

  if (REMOTE_PREFIX_PATTERN.test(normalized)) {
    const qualifier = normalized
      .replace(REMOTE_PREFIX_PATTERN, '')
      .trim();

    return qualifier
      ? `remote ${qualifier}`
      : 'remote';
  }

  if (isRemote) {
    return `remote ${normalized}`;
  }

  return normalized;
};

/**
 * Normalize employment-type variants used by different providers.
 *
 * @param {*} employmentType Employment type.
 * @returns {string} Normalized employment type.
 */
const normalizeEmploymentType = (employmentType) => {
  const rawValue = Array.isArray(employmentType)
    ? employmentType[0]
    : employmentType;

  const normalized = normalizeText(rawValue)
    .replace(/\s+/g, '-');

  const aliases = {
    contractor: 'contract',
    fulltime: 'full-time',
    intern: 'internship',
    parttime: 'part-time',
  };

  return aliases[normalized] ?? normalized;
};

/**
 * Return a canonical HTTP(S) URL while removing known tracking data.
 *
 * Meaningful query parameters are retained because some job providers place
 * the actual vacancy identifier in the query string.
 *
 * @param {*} value URL to canonicalize.
 * @returns {string|null} Canonical URL, or null for invalid input.
 */
const canonicalizeUrl = (value) => {
  if (typeof value !== 'string' || !value.trim() || value === '#') {
    return null;
  }

  try {
    const url = new URL(value.trim());

    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }

    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname
      .toLowerCase()
      .replace(/^www\./, '');
    url.hash = '';

    const parameterNames = [...url.searchParams.keys()];

    for (const parameterName of parameterNames) {
      const normalizedName = parameterName.toLowerCase();

      if (
        normalizedName.startsWith('utm_') ||
        TRACKING_QUERY_PARAMETERS.has(normalizedName)
      ) {
        url.searchParams.delete(parameterName);
      }
    }

    const sortedParameters = [...url.searchParams.entries()]
      .sort(([firstKey, firstValue], [secondKey, secondValue]) => {
        const keyComparison = firstKey.localeCompare(secondKey);

        if (keyComparison !== 0) {
          return keyComparison;
        }

        return firstValue.localeCompare(secondValue);
      });

    url.search = '';

    for (const [key, parameterValue] of sortedParameters) {
      url.searchParams.append(key, parameterValue);
    }

    let normalizedPath = url.pathname.replace(/\/{2,}/g, '/');

    if (normalizedPath.length > 1) {
      normalizedPath = normalizedPath.replace(/\/+$/, '');
    }

    return (
      `${url.protocol}//${url.host}${normalizedPath}` +
      `${url.searchParams.size ? `?${url.searchParams.toString()}` : ''}`
    );
  } catch {
    return null;
  }
};

/**
 * Convert normalized text into a token set.
 *
 * @param {string} value Normalized text.
 * @returns {Set<string>} Unique tokens.
 */
const tokenize = (value) =>
  new Set(
    value
      .split(' ')
      .map((token) => token.trim())
      .filter(Boolean),
  );

/**
 * Calculate token similarity using both Jaccard and containment scores.
 *
 * @param {string} firstValue First normalized title.
 * @param {string} secondValue Second normalized title.
 * @returns {number} Similarity between zero and one.
 */
const calculateTitleSimilarity = (firstValue, secondValue) => {
  if (!firstValue || !secondValue) {
    return 0;
  }

  if (firstValue === secondValue) {
    return 1;
  }

  const firstTokens = tokenize(firstValue);
  const secondTokens = tokenize(secondValue);

  if (!firstTokens.size || !secondTokens.size) {
    return 0;
  }

  let intersectionSize = 0;

  for (const token of firstTokens) {
    if (secondTokens.has(token)) {
      intersectionSize += 1;
    }
  }

  const unionSize =
    firstTokens.size + secondTokens.size - intersectionSize;

  const jaccardScore = unionSize
    ? intersectionSize / unionSize
    : 0;

  const containmentScore =
    intersectionSize / Math.max(firstTokens.size, secondTokens.size);

  return Math.max(jaccardScore, containmentScore);
};

/**
 * Extract seniority indicators from a normalized job title.
 *
 * @param {string} normalizedTitle Normalized title.
 * @returns {Set<string>} Seniority indicators.
 */
const extractSeniorityTokens = (normalizedTitle) => {
  const tokens = tokenize(normalizedTitle);

  return new Set(
    [...tokens].filter((token) => SENIORITY_TOKENS.has(token)),
  );
};

/**
 * Ensure titles do not contain conflicting seniority indicators.
 *
 * A conservative comparison is intentional: accidentally merging distinct
 * roles is more harmful than retaining an uncertain duplicate.
 *
 * @param {string} firstTitle First normalized title.
 * @param {string} secondTitle Second normalized title.
 * @returns {boolean} Whether seniority information is compatible.
 */
const areSenioritiesCompatible = (firstTitle, secondTitle) => {
  const firstSeniorities = extractSeniorityTokens(firstTitle);
  const secondSeniorities = extractSeniorityTokens(secondTitle);

  if (!firstSeniorities.size && !secondSeniorities.size) {
    return true;
  }

  if (firstSeniorities.size !== secondSeniorities.size) {
    return false;
  }

  return [...firstSeniorities]
    .every((token) => secondSeniorities.has(token));
};

/**
 * Determine whether two normalized locations can describe the same vacancy.
 *
 * @param {string} firstLocation First normalized location.
 * @param {string} secondLocation Second normalized location.
 * @returns {boolean} Whether locations are compatible.
 */
const areLocationsCompatible = (firstLocation, secondLocation) => {
  if (!firstLocation || !secondLocation) {
    return true;
  }

  if (firstLocation === 'remote' || secondLocation === 'remote') {
    return (
      firstLocation === 'remote' &&
      secondLocation === 'remote'
    );
  }

  return firstLocation === secondLocation;
};

/**
 * Determine whether two employment types can describe the same vacancy.
 *
 * @param {string} firstType First normalized type.
 * @param {string} secondType Second normalized type.
 * @returns {boolean} Whether employment types are compatible.
 */
const areEmploymentTypesCompatible = (firstType, secondType) => {
  const unknownTypes = new Set(['', 'unknown', 'other']);

  if (unknownTypes.has(firstType) || unknownTypes.has(secondType)) {
    return true;
  }

  return firstType === secondType;
};

/**
 * Parse a possible date into milliseconds.
 *
 * @param {*} value Date-like input.
 * @returns {number|null} Timestamp or null.
 */
const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : null;
};

/**
 * Determine whether posting dates are sufficiently close.
 *
 * @param {*} firstDate First posting date.
 * @param {*} secondDate Second posting date.
 * @param {number} toleranceDays Maximum difference in days.
 * @returns {boolean} Whether dates are compatible.
 */
const areDatesCompatible = (
  firstDate,
  secondDate,
  toleranceDays,
) => {
  const firstTimestamp = parseDate(firstDate);
  const secondTimestamp = parseDate(secondDate);

  if (firstTimestamp === null || secondTimestamp === null) {
    return true;
  }

  const differenceMilliseconds =
    Math.abs(firstTimestamp - secondTimestamp);

  return differenceMilliseconds <=
    toleranceDays * 24 * 60 * 60 * 1000;
};

/**
 * Build a source-scoped external identifier.
 *
 * @param {object} job Job record.
 * @returns {string|null} Source-scoped identifier.
 */
const buildSourceIdKey = (job) => {
  const source = normalizeText(job.source);

  const externalId =
    job.externalId === null ||
    job.externalId === undefined
      ? ''
      : String(job.externalId).trim();

  if (!source || !externalId) {
    return null;
  }

  return `${source}:${externalId}`;
};

/**
 * Obtain the best available job-application URL.
 *
 * @param {object} job Job record.
 * @returns {string|null} Canonical URL.
 */
const buildUrlKey = (job) => {
  for (const value of [
    job.applyLink,
    job.applicationUrl,
    job.jobUrl,
    job.sourceUrl,
  ]) {
    const canonicalUrl = canonicalizeUrl(value);

    if (canonicalUrl) {
      return canonicalUrl;
    }
  }

  return null;
};

/**
 * Build an exact normalized content key.
 *
 * Date compatibility is checked separately to avoid merging old repostings.
 *
 * @param {object} job Job record.
 * @returns {string|null} Exact content key.
 */
const buildCompositeKey = (job) => {
  const title = normalizeTitle(job.title);
  const company = normalizeCompany(job.company);

  if (!title || !company) {
    return null;
  }

  const location = normalizeLocation(
    job.location,
    Boolean(job.isRemote),
  );

  const employmentType = normalizeEmploymentType(
    job.employmentType,
  );

  return [
    title,
    company,
    location,
    employmentType,
  ].join('|');
};

/**
 * Build role tokens used by the inverted candidate index.
 *
 * @param {object} job Job record.
 * @returns {string[]} Candidate-index tokens.
 */
const buildCandidateTokens = (job) => {
  const normalizedTitle = normalizeTitle(job.title);

  return [...tokenize(normalizedTitle)]
    .filter(
      (token) =>
        token.length > 1 &&
        !CANDIDATE_STOP_WORDS.has(token),
    );
};

/**
 * Determine whether a value contains useful information.
 *
 * @param {*} value Value to inspect.
 * @returns {boolean} Whether the value is useful.
 */
const hasUsableValue = (value) => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return Boolean(value.trim());
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return true;
};

/**
 * Score record completeness so the richest duplicate becomes representative.
 *
 * @param {object} job Job record.
 * @returns {number} Completeness score.
 */
const calculateCompletenessScore = (job) => {
  const weightedFields = {
    applyLink: 4,
    companyLogo: 1,
    description: 4,
    descriptionSnippet: 2,
    employmentType: 1,
    expiresAt: 1,
    location: 2,
    postedAt: 2,
    salary: 2,
    skills: 2,
    sourceUrl: 1,
  };

  let score = 0;

  for (const [field, weight] of Object.entries(weightedFields)) {
    if (hasUsableValue(job[field])) {
      score += weight;
    }
  }

  return score;
};

/**
 * Clone a job record without sharing array references that are later merged.
 *
 * @param {object} job Job record.
 * @returns {object} Shallowly cloned record.
 */
const cloneJob = (job) => {
  const clone = { ...job };

  for (const field of ARRAY_FIELDS_TO_MERGE) {
    if (Array.isArray(job[field])) {
      clone[field] = [...job[field]];
    }
  }

  return clone;
};

/**
 * Merge array values while preserving their first-seen order.
 *
 * @param {*} firstValue First possible array.
 * @param {*} secondValue Second possible array.
 * @returns {Array} Combined unique values.
 */
const mergeArrays = (firstValue, secondValue) => {
  const combined = [
    ...(Array.isArray(firstValue) ? firstValue : []),
    ...(Array.isArray(secondValue) ? secondValue : []),
  ];

  const seen = new Set();
  const fallbackObjectIds = new WeakMap();

  let nextFallbackObjectId = 0;

  const result = [];

  for (const item of combined) {
    let identity;

    if (typeof item === 'string') {
      identity = `string:${normalizeText(item)}`;
    } else {
      try {
        const serialized = JSON.stringify(item);

        identity =
          serialized === undefined
            ? `${typeof item}:${String(item)}`
            : `value:${serialized}`;
      } catch {
        if (item && typeof item === 'object') {
          if (!fallbackObjectIds.has(item)) {
            fallbackObjectIds.set(
              item,
              nextFallbackObjectId,
            );

            nextFallbackObjectId += 1;
          }

          identity =
            `reference:${fallbackObjectIds.get(item)}`;
        } else {
          identity = `${typeof item}:${String(item)}`;
        }
      }
    }

    if (!seen.has(identity)) {
      seen.add(identity);
      result.push(item);
    }
  }

  return result;
};

/**
 * Merge duplicate records without mutating either source object.
 *
 * @param {object} existingJob Existing representative.
 * @param {object} incomingJob Newly detected duplicate.
 * @returns {object} Richest merged representation.
 */
const mergeJobRecords = (existingJob, incomingJob) => {
  const existingScore =
    calculateCompletenessScore(existingJob);
  const incomingScore =
    calculateCompletenessScore(incomingJob);

  const preferred =
    incomingScore > existingScore
      ? incomingJob
      : existingJob;

  const secondary =
    preferred === existingJob
      ? incomingJob
      : existingJob;

  const merged = cloneJob(preferred);

  for (const [field, value] of Object.entries(secondary)) {
    if (
      !hasUsableValue(merged[field]) &&
      hasUsableValue(value)
    ) {
      merged[field] = Array.isArray(value)
        ? [...value]
        : value;
    }
  }

  for (const field of ARRAY_FIELDS_TO_MERGE) {
    const combinedValues = mergeArrays(
      preferred[field],
      secondary[field],
    );

    if (combinedValues.length) {
      merged[field] = combinedValues;
    }
  }

  for (const field of DESCRIPTION_FIELDS) {
    const preferredText =
      typeof preferred[field] === 'string'
        ? preferred[field].trim()
        : '';

    const secondaryText =
      typeof secondary[field] === 'string'
        ? secondary[field].trim()
        : '';

    if (secondaryText.length > preferredText.length) {
      merged[field] = secondary[field];
    }
  }

  return merged;
};

/**
 * Determine whether two jobs are likely cross-source duplicates.
 *
 * @param {object} firstJob Existing job.
 * @param {object} secondJob Incoming job.
 * @param {object} options Matching configuration.
 * @returns {boolean} Whether the records are likely duplicates.
 */
const isLikelyDuplicate = (firstJob, secondJob, options) => {
  const firstTitle = normalizeTitle(firstJob.title);
  const secondTitle = normalizeTitle(secondJob.title);
  const firstCompany = normalizeCompany(firstJob.company);
  const secondCompany = normalizeCompany(secondJob.company);

  if (
    !firstTitle ||
    !secondTitle ||
    !firstCompany ||
    !secondCompany
  ) {
    return false;
  }

  if (firstCompany !== secondCompany) {
    return false;
  }

  if (!areSenioritiesCompatible(firstTitle, secondTitle)) {
    return false;
  }

  const firstLocation = normalizeLocation(
    firstJob.location,
    Boolean(firstJob.isRemote),
  );

  const secondLocation = normalizeLocation(
    secondJob.location,
    Boolean(secondJob.isRemote),
  );

  if (
    !areLocationsCompatible(
      firstLocation,
      secondLocation,
    )
  ) {
    return false;
  }

  const firstEmploymentType = normalizeEmploymentType(
    firstJob.employmentType,
  );

  const secondEmploymentType = normalizeEmploymentType(
    secondJob.employmentType,
  );

  if (
    !areEmploymentTypesCompatible(
      firstEmploymentType,
      secondEmploymentType,
    )
  ) {
    return false;
  }

  if (
    !areDatesCompatible(
      firstJob.postedAt,
      secondJob.postedAt,
      options.postedAtToleranceDays,
    )
  ) {
    return false;
  }

  return (
    calculateTitleSimilarity(firstTitle, secondTitle) >=
    options.titleSimilarityThreshold
  );
};

/**
 * Add an output index to a map of sets.
 *
 * @param {Map<string, Set<number>>} index Target index.
 * @param {string|null} key Lookup key.
 * @param {number} outputIndex Output-array index.
 */
const addToSetIndex = (
  index,
  key,
  outputIndex,
  maxSize = Infinity,
) => {
  if (!key) {
    return;
  }

  if (!index.has(key)) {
    index.set(key, new Set());
  }

  const bucket = index.get(key);

  bucket.delete(outputIndex);
  bucket.add(outputIndex);

  while (bucket.size > maxSize) {
    const oldestOutputIndex =
      bucket.values().next().value;

    bucket.delete(oldestOutputIndex);
  }
};

/**
 * Deduplicate jobs using exact identity keys and guarded fuzzy matching.
 *
 * Processing uses hash indexes and a token-based inverted candidate index,
 * avoiding an unconditional comparison of every job with every other job.
 *
 * @param {object[]} jobs Jobs from APIs and local scrapers.
 * @param {object} [options] Optional matching configuration.
 * @param {number} [options.titleSimilarityThreshold=0.8]
 * @param {number} [options.postedAtToleranceDays=14]
 * @returns {{
 *   jobs: object[],
 *   stats: {
 *     inputCount: number,
 *     outputCount: number,
 *     duplicatesRemoved: number,
 *     exactMatches: number,
 *     fuzzyMatches: number,
 *     unmatchableCount: number,
 *     candidateComparisons: number
 *   }
 * }} Deduplicated jobs and execution statistics.
 */
export const deduplicateJobs = (jobs, options = {}) => {
  if (!Array.isArray(jobs)) {
    throw new TypeError(
      'deduplicateJobs expects an array of job records',
    );
  }

  const configuredOptions =
    options && typeof options === 'object'
      ? options
      : {};

  const titleSimilarityThreshold =
    Number.isFinite(
      configuredOptions.titleSimilarityThreshold,
    ) &&
    configuredOptions.titleSimilarityThreshold >= 0 &&
    configuredOptions.titleSimilarityThreshold <= 1
      ? configuredOptions.titleSimilarityThreshold
      : DEFAULT_OPTIONS.titleSimilarityThreshold;

  const postedAtToleranceDays =
    Number.isFinite(
      configuredOptions.postedAtToleranceDays,
    ) &&
    configuredOptions.postedAtToleranceDays >= 0
      ? configuredOptions.postedAtToleranceDays
      : DEFAULT_OPTIONS.postedAtToleranceDays;

  const resolvedOptions = {
    titleSimilarityThreshold,
    postedAtToleranceDays,
  };

  const output = [];

  const sourceIdIndex = new Map();
  const canonicalUrlIndex = new Map();
  const exactCompositeIndex = new Map();
  const candidateIndex = new Map();

  const stats = {
    inputCount: jobs.length,
    outputCount: 0,
    duplicatesRemoved: 0,
    exactMatches: 0,
    fuzzyMatches: 0,
    unmatchableCount: 0,
    candidateComparisons: 0,
  };

  /**
   * Register all usable matching aliases for an input record.
   *
   * Aliases from both records are retained after merging so subsequent
   * duplicates can match either provider's identity.
   *
   * @param {object} job Job record.
   * @param {number} outputIndex Output-array index.
   */
  const registerJob = (job, outputIndex) => {
    const sourceIdKey = buildSourceIdKey(job);
    const urlKey = buildUrlKey(job);
    const compositeKey = buildCompositeKey(job);

    if (sourceIdKey) {
      sourceIdIndex.set(sourceIdKey, outputIndex);
    }

    if (urlKey) {
      canonicalUrlIndex.set(urlKey, outputIndex);
    }

    addToSetIndex(
      exactCompositeIndex,
      compositeKey,
      outputIndex,
    );

    const company = normalizeCompany(job.company);

    if (!company) {
      return;
    }

    for (const token of buildCandidateTokens(job)) {
      addToSetIndex(
        candidateIndex,
        `${company}|${token}`,
        outputIndex,
        MAX_FUZZY_BUCKET_SIZE,
      );
    }
  };

  for (const inputJob of jobs) {
    if (
      !inputJob ||
      typeof inputJob !== 'object' ||
      Array.isArray(inputJob)
    ) {
      stats.unmatchableCount += 1;
      continue;
    }

    const job = cloneJob(inputJob);
    const sourceIdKey = buildSourceIdKey(job);
    const urlKey = buildUrlKey(job);
    const compositeKey = buildCompositeKey(job);

    let duplicateIndex;
    let matchType;

    if (
      sourceIdKey &&
      sourceIdIndex.has(sourceIdKey)
    ) {
      duplicateIndex = sourceIdIndex.get(sourceIdKey);
      matchType = 'exact';
    } else if (
      urlKey &&
      canonicalUrlIndex.has(urlKey)
    ) {
      duplicateIndex = canonicalUrlIndex.get(urlKey);
      matchType = 'exact';
    }

    if (
      duplicateIndex === undefined &&
      compositeKey
    ) {
      const exactCandidates =
        exactCompositeIndex.get(compositeKey) ?? [];

      for (const candidateOutputIndex of exactCandidates) {
        const candidateJob = output[candidateOutputIndex];

        if (
          areDatesCompatible(
            candidateJob.postedAt,
            job.postedAt,
            resolvedOptions.postedAtToleranceDays,
          )
        ) {
          duplicateIndex = candidateOutputIndex;
          matchType = 'exact';
          break;
        }
      }
    }

    if (duplicateIndex === undefined) {
      const company = normalizeCompany(job.company);
      const candidateOutputIndices = new Set();

      if (company) {
        for (const token of buildCandidateTokens(job)) {
          const indexedCandidates =
            candidateIndex.get(`${company}|${token}`);

          if (!indexedCandidates) {
            continue;
          }

          for (const candidateOutputIndex of indexedCandidates) {
            candidateOutputIndices.add(candidateOutputIndex);
          }
        }
      }

      const orderedCandidates =
        [...candidateOutputIndices]
          .sort((first, second) => first - second)
          .slice(0, MAX_FUZZY_CANDIDATES);

      for (const candidateOutputIndex of orderedCandidates) {
        stats.candidateComparisons += 1;

        if (
          isLikelyDuplicate(
            output[candidateOutputIndex],
            job,
            resolvedOptions,
          )
        ) {
          duplicateIndex = candidateOutputIndex;
          matchType = 'fuzzy';
          break;
        }
      }
    }

    if (duplicateIndex !== undefined) {
      const mergedJob = mergeJobRecords(
        output[duplicateIndex],
        job,
      );

      output[duplicateIndex] = mergedJob;
      stats.duplicatesRemoved += 1;

      if (matchType === 'exact') {
        stats.exactMatches += 1;
      } else {
        stats.fuzzyMatches += 1;
      }

      registerJob(job, duplicateIndex);
      registerJob(mergedJob, duplicateIndex);
      continue;
    }

    const canUseExactIdentity = Boolean(
      sourceIdKey || urlKey,
    );

    const canUseContentMatching = Boolean(
      normalizeTitle(job.title) &&
      normalizeCompany(job.company),
    );

    if (!canUseExactIdentity && !canUseContentMatching) {
      stats.unmatchableCount += 1;
    }

    const outputIndex = output.length;
    output.push(job);
    registerJob(job, outputIndex);
  }

  stats.outputCount = output.length;

  return {
    jobs: output,
    stats,
  };
};