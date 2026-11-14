/**
 * Cloudflare D1 Database Client for CareerPilot
 * Provides direct, serverless SQL access via the CareerPilot Gateway.
 */

const GATEWAY_URL = import.meta.env.VITE_AI_GATEWAY_URL || '/gateway/v1';

/**
 * Fetch all tracked jobs for a user from Cloudflare D1.
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getD1TrackedJobs(userId) {
  if (!userId) return [];
  const res = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/db/jobs?user_id=${encodeURIComponent(userId)}`, {
    headers: { 'X-User-Id': userId },
  });
  const data = await res.json().catch(() => ({}));
  return data.jobs || [];
}

/**
 * Save or update a tracked job in Cloudflare D1.
 *
 * @param {Object} job
 * @param {string} job.userId
 * @param {string} job.company
 * @param {string} job.title
 * @param {string} [job.location]
 * @param {string} [job.status]
 * @param {string} [job.salary]
 * @param {string} [job.notes]
 * @param {string} [job.jobUrl]
 * @returns {Promise<Object>}
 */
export async function saveD1TrackedJob(job) {
  const res = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/db/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': job.userId || '',
    },
    body: JSON.stringify(job),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to save job to D1');
  return data.job;
}

/**
 * Delete a tracked job from Cloudflare D1.
 *
 * @param {string} jobId
 * @returns {Promise<boolean>}
 */
export async function deleteD1TrackedJob(jobId) {
  const res = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/db/jobs?id=${encodeURIComponent(jobId)}`, {
    method: 'DELETE',
  });
  const data = await res.json().catch(() => ({}));
  return Boolean(data.success);
}

/**
 * Fetch all resumes for a user from Cloudflare D1.
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getD1Resumes(userId) {
  if (!userId) return [];
  const res = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/db/resumes?user_id=${encodeURIComponent(userId)}`, {
    headers: { 'X-User-Id': userId },
  });
  const data = await res.json().catch(() => ({}));
  return data.resumes || [];
}

/**
 * Save a resume (with optional ImageKit PDF URL) in Cloudflare D1.
 *
 * @param {Object} resume
 * @returns {Promise<Object>}
 */
export async function saveD1Resume(resume) {
  const res = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/db/resumes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': resume.userId || '',
    },
    body: JSON.stringify(resume),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to save resume to D1');
  return data.resume;
}

/**
 * Fetch all portfolios for a user from Cloudflare D1.
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getD1Portfolios(userId) {
  if (!userId) return [];
  const res = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/db/portfolios?user_id=${encodeURIComponent(userId)}`, {
    headers: { 'X-User-Id': userId },
  });
  const data = await res.json().catch(() => ({}));
  return data.portfolios || [];
}

/**
 * Fetch a portfolio by slug from Cloudflare D1.
 *
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getD1PortfolioBySlug(slug) {
  if (!slug) return null;
  const res = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/db/portfolios?slug=${encodeURIComponent(slug)}`);
  const data = await res.json().catch(() => ({}));
  return data.portfolio || null;
}

/**
 * Save or update a portfolio in Cloudflare D1.
 *
 * @param {Object} portfolio
 * @returns {Promise<Object>}
 */
export async function saveD1Portfolio(portfolio) {
  const res = await fetch(`${GATEWAY_URL.replace(/\/$/, '')}/db/portfolios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': portfolio.userId || '',
    },
    body: JSON.stringify(portfolio),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to save portfolio to D1');
  return data.portfolio;
}
