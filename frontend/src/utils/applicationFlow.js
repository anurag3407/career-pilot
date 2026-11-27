// =============================================================================
// applicationFlow.js — date/status helpers for the application flow
// =============================================================================
// The follow-up calendar ("what is due today") and the weekly loop live on
// plain tracked_jobs rows: appliedAt, nextActionAt, interviewAt,
// lastActivityAt. These helpers are pure so Dashboard, JobTracker, Analytics,
// and SkillGap can all share the same definitions of "due".
// =============================================================================

export const DAY_MS = 24 * 60 * 60 * 1000;
export const FOLLOW_UP_DAYS = 7;
export const QUIET_DAYS = 14;

export function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysSince(date) {
  if (!date) return null;
  return Math.floor((Date.now() - new Date(date).getTime()) / DAY_MS);
}

export function addDays(date, n) {
  return new Date(new Date(date).getTime() + n * DAY_MS);
}

/** ISO week key like 2026-W46 (Monday-based), used for apply-target progress. */
export function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / DAY_MS + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

const isActivePipeline = (job) => ['applied', 'interviewing'].includes(job.status || 'applied');

/** Follow-ups whose next_action_at has arrived (due today or overdue). */
export function dueFollowUps(jobs = []) {
  const today = endOfDay();
  return jobs.filter(
    (j) => isActivePipeline(j) && j.nextActionAt && j.nextActionType !== 'none'
      && new Date(j.nextActionAt) <= today,
  );
}

/**
 * Applications that have gone quiet: applied/interviewing, no follow-up
 * scheduled, and no activity for QUIET_DAYS.
 */
export function quietApplications(jobs = []) {
  return jobs.filter((j) => {
    if (!isActivePipeline(j)) return false;
    if (j.nextActionAt && j.nextActionType !== 'none') return false;
    const last = j.lastActivityAt || j.appliedAt || j.appliedDate || j.updatedAt || j.createdAt;
    const age = daysSince(last);
    return age !== null && age >= QUIET_DAYS;
  });
}

/** Card has an interview scheduled within the next 48 hours (tomorrow-ish). */
export function interviewsSoon(jobs = []) {
  const now = Date.now();
  const horizon = now + 2 * DAY_MS;
  return jobs.filter(
    (j) => j.interviewAt && new Date(j.interviewAt).getTime() > now - DAY_MS
      && new Date(j.interviewAt).getTime() <= horizon,
  );
}

/** Applications marked applied inside the current ISO week. */
export function weeklyAppliedCount(jobs = []) {
  const week = isoWeekKey();
  return jobs.filter((j) => j.appliedAt && isoWeekKey(new Date(j.appliedAt)) === week).length;
}

/**
 * Suggested next status after a mock-interview debrief on a card.
 * Practicing before applying means the next move is to apply; practicing
 * while applied means the next move is to push into interviews.
 */
export function nextStatusSuggestion(status) {
  if (status === 'saved') return 'applied';
  if (status === 'applied') return 'interviewing';
  return null;
}

/**
 * Per-resume-version outcome funnel: which version earned interviews/offers.
 * Groups by resumeVersionId, falling back to resumeId.
 */
export function funnelByResumeVersion(jobs = []) {
  const groups = new Map();
  for (const job of jobs) {
    const key = job.resumeVersionId || job.resumeId;
    if (!key) continue;
    if (!groups.has(key)) {
      groups.set(key, { key, resumeVersionId: job.resumeVersionId, resumeId: job.resumeId, label: null, applied: 0, interviews: 0, offered: 0, rejected: 0 });
    }
    const g = groups.get(key);
    if (job.appliedAt || job.status !== 'saved') g.applied += 1;
    if (['interviewing', 'offered'].includes(job.status)) g.interviews += 1;
    if (job.status === 'offered') g.offered += 1;
    if (job.status === 'rejected') g.rejected += 1;
    if (!g.label && (job.packet?.resumeLabel || job.packet?.jobRole)) g.label = job.packet.resumeLabel || job.packet.jobRole;
  }
  return [...groups.values()];
}

/** Companies that went quiet, most-quiet first. */
export function quietCompanies(jobs = []) {
  return quietApplications(jobs)
    .map((j) => ({
      company: j.company,
      title: j.title,
      days: daysSince(j.lastActivityAt || j.appliedAt || j.appliedDate || j.updatedAt) ?? 0,
    }))
    .sort((a, b) => b.days - a.days);
}
