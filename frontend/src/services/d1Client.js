/**
 * Cloudflare D1 Database Client for CareerPilot
 * Provides authenticated serverless SQL access via the CareerPilot Gateway.
 */

import { d1Fetch } from '../config/d1';

export async function getD1TrackedJobs() {
  const data = await d1Fetch('/db/jobs', { method: 'GET', requireAuth: true });
  return data.jobs || data.trackedJobs || [];
}

export async function saveD1TrackedJob(job) {
  const data = await d1Fetch('/db/jobs', { method: 'POST', body: job, requireAuth: true });
  return data.job || data.trackedJob;
}

export async function deleteD1TrackedJob(jobId) {
  const data = await d1Fetch(`/db/jobs/${encodeURIComponent(jobId)}`, {
    method: 'DELETE',
    requireAuth: true,
  });
  return Boolean(data.success);
}

export async function getD1Resumes() {
  const data = await d1Fetch('/db/resumes', { method: 'GET', requireAuth: true });
  return data.resumes || [];
}

export async function saveD1Resume(resume) {
  const data = await d1Fetch('/db/resumes', { method: 'POST', body: resume, requireAuth: true });
  return data.resume;
}

export async function getD1Portfolios() {
  const data = await d1Fetch('/db/portfolios', { method: 'GET', requireAuth: true });
  return data.portfolios || [];
}

export async function getD1PortfolioBySlug(slug) {
  if (!slug) return null;
  const data = await d1Fetch(`/db/portfolios?slug=${encodeURIComponent(slug)}`, { method: 'GET' });
  return data.portfolio || null;
}

export async function saveD1Portfolio(portfolio) {
  const data = await d1Fetch('/db/portfolios', {
    method: 'POST',
    body: portfolio,
    requireAuth: true,
  });
  return data.portfolio;
}
