// =============================================================================
// supabaseData.js — the unified Supabase data layer
// =============================================================================
// Every core tool reads and writes its data directly from Supabase (Postgres +
// RLS) instead of going through the Express backend. The per-tool documents are
// stored in a `data JSONB` column verbatim, so the exact field names the app
// has always used (camelCase, Mongo-era `_id`, …) keep round-tripping.
//
// Security model: RLS policies (see supabase/migrations) restrict every table
// to its owner via auth.uid(); the anon key in the browser is enough.
// =============================================================================

import { supabase, isSupabaseConfigured } from '../config/supabase';

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

/** DB row → app document. `data` jsonb fields win; metadata overlaid. */
function mapRow(row) {
  if (!row) return null;
  const { data: doc = {}, created_at, updated_at, user_id, ...rest } = row;
  const id = rest.id ?? doc.id;
  return {
    ...rest,
    ...doc,
    id,
    _id: id, // Mongo-era alias used by some pages
    userId: user_id,
    createdAt: created_at ?? doc.createdAt,
    updatedAt: updated_at ?? doc.updatedAt,
  };
}

/** Strip client-only keys before persisting a payload. */
function stripMeta(payload = {}) {
  const {
    id, _id, userId, user_id,
    createdAt, updatedAt, created_at, updated_at,
    ...rest
  } = payload;
  return rest;
}

function throwIf(error, context) {
  if (error) {
    const err = new Error(error.message || `Supabase error in ${context}`);
    err.status = 400;
    err.details = error.details;
    throw err;
  }
}

async function requireUserId() {
  const { data, error } = await supabase.auth.getSession();
  throwIf(error, 'auth/session');
  const uid = data?.session?.user?.id;
  if (!uid) {
    const err = new Error('Not authenticated');
    err.status = 401;
    throw err;
  }
  return uid;
}

// ---------------------------------------------------------------------------
// Auth / profile
// ---------------------------------------------------------------------------
const mapProfile = (row) => {
  if (!row) return null;
  const doc = row.data || {};
  return {
    ...doc,
    uid: row.id,
    id: row.id,
    email: row.email,
    displayName: row.full_name || doc.displayName || row.username || row.email?.split('@')[0],
    username: row.username,
    photoURL: row.avatar_url || doc.photoURL || null,
    jobRole: row.job_role || doc.jobRole || '',
    yearsOfExperience: row.years_of_experience ?? doc.yearsOfExperience ?? 0,
    skills: row.skills || doc.skills || [],
    bio: row.bio ?? doc.bio ?? '',
    headline: row.headline || doc.headline || '',
    location: row.location || doc.location || '',
    website: row.website || doc.website || '',
    github: doc.github || row.github_username || '',
    linkedin: doc.linkedin || row.linkedin_url || '',
    isAdmin: !!row.is_admin,
    plan: row.plan || 'free',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const profileColumnsFrom = (payload = {}) => {
  const cols = {};
  if (payload.displayName !== undefined) cols.full_name = payload.displayName;
  if (payload.name !== undefined) cols.full_name = payload.name;
  if (payload.jobRole !== undefined) cols.job_role = payload.jobRole;
  if (payload.headline !== undefined) cols.headline = payload.headline;
  if (payload.location !== undefined) cols.location = payload.location;
  if (payload.website !== undefined) cols.website = payload.website;
  if (payload.bio !== undefined) cols.bio = payload.bio;
  if (payload.yearsOfExperience !== undefined) cols.years_of_experience = Number(payload.yearsOfExperience) || 0;
  if (payload.skills !== undefined) {
    cols.skills = Array.isArray(payload.skills)
      ? payload.skills
      : String(payload.skills).split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (payload.avatarUrl !== undefined || payload.photoURL !== undefined) {
    cols.avatar_url = payload.avatarUrl ?? payload.photoURL;
  }
  if (payload.github !== undefined) cols.github_username = payload.github;
  if (payload.linkedin !== undefined) cols.linkedin_url = payload.linkedin;
  return cols;
};

export const authData = {
  /** Used by route guards + admin checks. Shape-compatible with /api/auth/profile. */
  async getProfile() {
    const uid = await requireUserId();
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    throwIf(error, 'auth/profile');
    const profile = mapProfile(data);
    return {
      success: true,
      user: profile
        ? {
            uid: profile.uid,
            id: profile.uid,
            email: profile.email,
            displayName: profile.displayName,
            photoURL: profile.photoURL,
            isAdmin: profile.isAdmin,
            ...profile,
          }
        : null,
      profile,
    };
  },

  async verifyToken() {
    await requireUserId();
    return { success: true };
  },
};

export const profileData = {
  async getMyProfile() {
    const uid = await requireUserId();
    return profileData.getProfile(uid);
  },

  async getProfile(uid) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    throwIf(error, 'profiles/get');
    return { success: true, profile: mapProfile(data) };
  },

  async updateMyProfile(payload) {
    const uid = await requireUserId();
    const { data: existing } = await supabase.from('profiles').select('data').eq('id', uid).maybeSingle();
    const mergedDoc = { ...(existing?.data || {}), ...stripMeta(payload) };
    const update = {
      ...profileColumnsFrom(payload),
      data: mergedDoc,
    };
    const { data, error } = await supabase.from('profiles').update(update).eq('id', uid).select().single();
    throwIf(error, 'profiles/update');
    return { success: true, profile: mapProfile(data) };
  },

  /** Lightweight stats for the profile page, computed from real row counts. */
  async getMyStats() {
    const uid = await requireUserId();
    return profileData.getStats(uid);
  },

  async getStats(uid) {
    const [resumes, jobs, portfolios, interviews] = await Promise.all([
      supabase.from('resumes').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('tracked_jobs').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('portfolios').select('id', { count: 'exact', head: true }).eq('user_id', uid),
      supabase.from('interviews').select('id', { count: 'exact', head: true }).eq('user_id', uid),
    ]);
    return {
      success: true,
      stats: {
        resumesCreated: resumes.count ?? 0,
        applicationsTracked: jobs.count ?? 0,
        portfoliosCreated: portfolios.count ?? 0,
        interviewsDone: interviews.count ?? 0,
      },
    };
  },

  async getMyActivity() {
    const uid = await requireUserId();
    const [jobs, resumes] = await Promise.all([
      supabase.from('tracked_jobs').select('*').eq('user_id', uid).order('updated_at', { ascending: false }).limit(10),
      supabase.from('resumes').select('id, title, updated_at').eq('user_id', uid).order('updated_at', { ascending: false }).limit(10),
    ]);
    const activity = [
      ...(jobs.data || []).map((j) => ({
        type: 'application',
        title: j.title,
        subtitle: j.company,
        at: j.updated_at || j.created_at,
      })),
      ...(resumes.data || []).map((r) => ({
        type: 'resume',
        title: r.title,
        subtitle: 'Resume',
        at: r.updated_at,
      })),
    ]
      .filter((a) => a.at)
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 15);
    return { success: true, activity };
  },
};

// ---------------------------------------------------------------------------
// Resumes
// ---------------------------------------------------------------------------
const resumeColumnsFrom = (payload = {}) => {
  const cols = {};
  if (payload.title !== undefined) cols.title = payload.title;
  if (payload.targetRole !== undefined) cols.target_role = payload.targetRole;
  if (payload.target_role !== undefined) cols.target_role = payload.target_role;
  if (payload.jobRole !== undefined) cols.job_role = payload.jobRole;
  if (payload.template !== undefined) cols.template = payload.template;
  if (payload.isPublic !== undefined) cols.is_public = !!payload.isPublic;
  if (payload.shareToken !== undefined) cols.share_token = payload.shareToken;
  if (payload.enhancedText !== undefined) cols.enhanced_text = payload.enhancedText;
  if (payload.atsScore !== undefined) cols.ats_score = payload.atsScore;
  if (payload.source !== undefined) cols.source = payload.source;
  return cols;
};

export const resumeData = {
  async getAll() {
    await requireUserId();
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('updated_at', { ascending: false });
    throwIf(error, 'resumes/list');
    const list = (data || []).map(mapRow);
    return { success: true, data: list, resumes: list };
  },

  async getById(resumeId) {
    const { data, error } = await supabase.from('resumes').select('*').eq('id', resumeId).maybeSingle();
    throwIf(error, 'resumes/get');
    if (!data) {
      const err = new Error('Resume not found');
      err.status = 404;
      throw err;
    }
    return { success: true, data: mapRow(data) };
  },

  async create(payload) {
    const uid = await requireUserId();
    const body = {
      user_id: uid,
      data: stripMeta(payload),
      ...resumeColumnsFrom(payload),
    };
    const { data, error } = await supabase.from('resumes').insert(body).select().single();
    throwIf(error, 'resumes/create');
    return { success: true, data: mapRow(data), resume: mapRow(data) };
  },

  async update(resumeId, payload) {
    // Read-merge-write so partial updates (e.g. { sectionOrder }) never clobber
    // the rest of the stored document.
    const { data: existing } = await supabase.from('resumes').select('data').eq('id', resumeId).maybeSingle();
    const merged = { ...(existing?.data || {}), ...stripMeta(payload) };
    const { data, error } = await supabase
      .from('resumes')
      .update({ data: merged, ...resumeColumnsFrom({ ...(existing?.data || {}), ...payload }) })
      .eq('id', resumeId)
      .select()
      .single();
    throwIf(error, 'resumes/update');
    return { success: true, data: mapRow(data) };
  },

  async delete(resumeId) {
    const { error } = await supabase.from('resumes').delete().eq('id', resumeId);
    throwIf(error, 'resumes/delete');
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// Resume versions + ATS history
// ---------------------------------------------------------------------------
export const resumeVersionData = {
  async getAll(resumeId) {
    const { data, error } = await supabase
      .from('resume_versions')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false });
    throwIf(error, 'versions/list');
    const list = (data || []).map(mapRow);
    return { success: true, data: list, versions: list };
  },

  async create(resumeId, payload) {
    const uid = await requireUserId();
    const body = {
      resume_id: resumeId,
      user_id: uid,
      version_label: payload?.versionLabel || payload?.label || 'Snapshot',
      data: stripMeta(payload?.data || payload),
    };
    const { data, error } = await supabase.from('resume_versions').insert(body).select().single();
    throwIf(error, 'versions/create');
    return { success: true, data: mapRow(data), version: mapRow(data) };
  },

  async remove(resumeId, versionId) {
    const { error } = await supabase.from('resume_versions').delete().eq('id', versionId);
    throwIf(error, 'versions/delete');
    return { success: true };
  },

  async restore(resumeId, versionId) {
    const { data: version, error } = await supabase
      .from('resume_versions')
      .select('*')
      .eq('id', versionId)
      .maybeSingle();
    throwIf(error, 'versions/get');
    if (!version) {
      const err = new Error('Version not found');
      err.status = 404;
      throw err;
    }
    return resumeData.update(resumeId, version.data || {});
  },
};

export const resumeAtsData = {
  async get(resumeId) {
    const { data, error } = await supabase
      .from('resume_ats_history')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: true });
    throwIf(error, 'ats-history/get');
    const list = (data || []).map(mapRow);
    return { success: true, data: list, history: list };
  },

  async log(resumeId, payload = {}) {
    const uid = await requireUserId();
    const body = {
      resume_id: resumeId,
      user_id: uid,
      score: Number(payload.score ?? payload.overallScore ?? 0),
      data: stripMeta(payload),
    };
    const { data, error } = await supabase.from('resume_ats_history').insert(body).select().single();
    throwIf(error, 'ats-history/log');
    return { success: true, data: mapRow(data) };
  },
};

// ---------------------------------------------------------------------------
// Job tracker
// ---------------------------------------------------------------------------
const trackerColumnsFrom = (payload = {}) => {
  const cols = {};
  const jobId = payload.jobId ?? payload.job_id;
  if (jobId !== undefined) cols.job_id = jobId;
  if (payload.title !== undefined) cols.title = payload.title;
  if (payload.company !== undefined) cols.company = payload.company;
  if (payload.status !== undefined) cols.status = payload.status;
  if (payload.notes !== undefined) cols.notes = payload.notes;
  if (payload.location !== undefined) cols.location = payload.location;
  if (payload.salary !== undefined) cols.salary = payload.salary;
  if (payload.jobUrl !== undefined) cols.job_url = payload.jobUrl;
  if (payload.url !== undefined && payload.jobUrl === undefined) cols.job_url = payload.url;
  if (payload.appliedDate !== undefined) cols.applied_date = payload.appliedDate;
  return cols;
};

export const trackerData = {
  async getAll() {
    const uid = await requireUserId();
    const { data, error } = await supabase
      .from('tracked_jobs')
      .select('*')
      .eq('user_id', uid)
      .order('updated_at', { ascending: false });
    throwIf(error, 'tracker/list');
    const list = (data || []).map(mapRow);
    return { success: true, trackedJobs: list, data: list };
  },

  async track(jobData) {
    const uid = await requireUserId();
    const body = {
      user_id: uid,
      data: stripMeta(jobData),
      ...trackerColumnsFrom(jobData),
    };
    const { data, error } = await supabase.from('tracked_jobs').insert(body).select().single();
    throwIf(error, 'tracker/insert');
    const trackedJob = mapRow(data);
    return { success: true, trackedJob, data: trackedJob };
  },

  async updateStatus(jobId, status, notes = '') {
    const update = { status };
    if (notes) update.notes = notes;
    if (status === 'applied') update.applied_date = new Date().toISOString();
    const { data, error } = await supabase.from('tracked_jobs').update(update).eq('id', jobId).select().single();
    throwIf(error, 'tracker/update');
    return { success: true, trackedJob: mapRow(data), data: mapRow(data) };
  },

  async update(jobId, payload) {
    const { data: existing } = await supabase.from('tracked_jobs').select('data').eq('id', jobId).maybeSingle();
    const mergedDoc = { ...(existing?.data || {}), ...stripMeta(payload) };
    const { data, error } = await supabase
      .from('tracked_jobs')
      .update({ data: mergedDoc, ...trackerColumnsFrom(payload) })
      .eq('id', jobId)
      .select()
      .single();
    throwIf(error, 'tracker/update');
    return { success: true, trackedJob: mapRow(data) };
  },

  async delete(jobId) {
    const { error } = await supabase.from('tracked_jobs').delete().eq('id', jobId);
    throwIf(error, 'tracker/delete');
    return { success: true };
  },

  async getStats() {
    const { trackedJobs } = await trackerData.getAll();
    const by = (s) => trackedJobs.filter((j) => (j.status || 'saved') === s).length;
    return {
      success: true,
      stats: {
        total: trackedJobs.length,
        saved: by('saved'),
        applied: by('applied'),
        interviewing: by('interviewing'),
        offered: by('offered'),
        rejected: by('rejected'),
      },
    };
  },
};

// ---------------------------------------------------------------------------
// Job alerts
// ---------------------------------------------------------------------------
const alertColumnsFrom = (payload = {}, userEmail = '') => {
  const cols = {};
  if (payload.email !== undefined) cols.email = payload.email;
  else if (userEmail) cols.email = userEmail;
  if (payload.keywords !== undefined) {
    cols.keywords = Array.isArray(payload.keywords)
      ? payload.keywords
      : String(payload.keywords).split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (payload.location !== undefined) cols.location = payload.location;
  if (payload.experienceLevel !== undefined) cols.experience_level = payload.experienceLevel;
  if (payload.minSalary !== undefined) cols.min_salary = Number(payload.minSalary) || 0;
  if (payload.frequency !== undefined) cols.frequency = payload.frequency;
  if (payload.isActive !== undefined) cols.is_active = !!payload.isActive;
  return cols;
};

export const alertData = {
  async getAll() {
    const uid = await requireUserId();
    const { data, error } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    throwIf(error, 'alerts/list');
    const list = (data || []).map(mapRow);
    return { success: true, alerts: list, data: list };
  },

  async create(alertData_) {
    const uid = await requireUserId();
    const { data: session } = await supabase.auth.getSession();
    const email = session?.user?.email || '';
    const body = {
      id: crypto.randomUUID(),
      user_id: uid,
      data: stripMeta(alertData_),
      ...alertColumnsFrom(alertData_, email),
    };
    const { data, error } = await supabase.from('job_alerts').insert(body).select().single();
    throwIf(error, 'alerts/create');
    const alert = mapRow(data);
    return { success: true, alert, data: alert };
  },

  async update(alertId, payload) {
    const { data: existing } = await supabase.from('job_alerts').select('data').eq('id', alertId).maybeSingle();
    const mergedDoc = { ...(existing?.data || {}), ...stripMeta(payload) };
    const { data, error } = await supabase
      .from('job_alerts')
      .update({ data: mergedDoc, ...alertColumnsFrom(payload) })
      .eq('id', alertId)
      .select()
      .single();
    throwIf(error, 'alerts/update');
    return { success: true, alert: mapRow(data) };
  },

  async delete(alertId) {
    const { error } = await supabase.from('job_alerts').delete().eq('id', alertId);
    throwIf(error, 'alerts/delete');
    return { success: true };
  },

  async toggle(alertId) {
    const { data: existing, error: getErr } = await supabase
      .from('job_alerts')
      .select('is_active')
      .eq('id', alertId)
      .maybeSingle();
    throwIf(getErr, 'alerts/toggle-get');
    const { data, error } = await supabase
      .from('job_alerts')
      .update({ is_active: !existing?.is_active })
      .eq('id', alertId)
      .select()
      .single();
    throwIf(error, 'alerts/toggle');
    return { success: true, alert: mapRow(data) };
  },

  async getStats() {
    const { alerts } = await alertData.getAll();
    return {
      success: true,
      stats: {
        total: alerts.length,
        active: alerts.filter((a) => a.isActive ?? a.is_active ?? true).length,
        paused: alerts.filter((a) => !(a.isActive ?? a.is_active ?? true)).length,
      },
    };
  },
};

// ---------------------------------------------------------------------------
// Portfolios
// ---------------------------------------------------------------------------
const portfolioColumnsFrom = (payload = {}) => {
  const cols = {};
  if (payload.title !== undefined) cols.title = payload.title;
  if (payload.slug !== undefined) cols.slug = payload.slug;
  if (payload.templateId !== undefined) cols.template_id = payload.templateId;
  if (payload.template !== undefined && payload.templateId === undefined) cols.template_id = payload.template;
  if (payload.isPublic !== undefined) cols.is_public = !!payload.isPublic;
  if (payload.theme !== undefined) cols.theme = payload.theme;
  if (payload.deployProvider !== undefined) cols.deploy_provider = payload.deployProvider;
  if (payload.deployUrl !== undefined) cols.deploy_url = payload.deployUrl;
  if (payload.deployedAt !== undefined) cols.deployed_at = payload.deployedAt;
  return cols;
};

export const portfolioData = {
  async getAll() {
    const uid = await requireUserId();
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', uid)
      .order('updated_at', { ascending: false });
    throwIf(error, 'portfolios/list');
    const list = (data || []).map(mapRow);
    return { success: true, portfolios: list, data: list };
  },

  async getById(portfolioId) {
    const { data, error } = await supabase.from('portfolios').select('*').eq('id', portfolioId).maybeSingle();
    throwIf(error, 'portfolios/get');
    return { success: true, data: mapRow(data), portfolio: mapRow(data) };
  },

  async create(payload) {
    const uid = await requireUserId();
    const body = {
      user_id: uid,
      slug: payload.slug || crypto.randomUUID(),
      data: stripMeta(payload),
      ...portfolioColumnsFrom(payload),
    };
    const { data, error } = await supabase.from('portfolios').insert(body).select().single();
    throwIf(error, 'portfolios/create');
    const portfolio = mapRow(data);
    return { success: true, data: portfolio, portfolio };
  },

  async update(portfolioId, payload) {
    const { data: existing } = await supabase.from('portfolios').select('data').eq('id', portfolioId).maybeSingle();
    const mergedDoc = { ...(existing?.data || {}), ...stripMeta(payload) };
    const { data, error } = await supabase
      .from('portfolios')
      .update({ data: mergedDoc, ...portfolioColumnsFrom(payload) })
      .eq('id', portfolioId)
      .select()
      .single();
    throwIf(error, 'portfolios/update');
    return { success: true, data: mapRow(data), portfolio: mapRow(data) };
  },

  async delete(portfolioId) {
    const { error } = await supabase.from('portfolios').delete().eq('id', portfolioId);
    throwIf(error, 'portfolios/delete');
    return { success: true };
  },

  async recordDeployment(portfolioId, { provider, url, status = 'success', logs = [] }) {
    const uid = await requireUserId();
    const { data, error } = await supabase
      .from('portfolio_deployments')
      .insert({ user_id: uid, portfolio_id: portfolioId, provider, url, status, logs })
      .select()
      .single();
    throwIf(error, 'deployments/record');
    return { success: true, data: mapRow(data) };
  },

  async listDeployments() {
    const uid = await requireUserId();
    const { data, error } = await supabase
      .from('portfolio_deployments')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    throwIf(error, 'deployments/list');
    const list = (data || []).map(mapRow);
    return { success: true, data: list, deployments: list };
  },
};

// ---------------------------------------------------------------------------
// Roasts (CRUD; AI generation still happens in the backend service — see
// docs/UNIFIED_PLATFORM.md for the phase-2 gateway port)
// ---------------------------------------------------------------------------
export const roastData = {
  async getHistory(limit = 20) {
    const uid = await requireUserId();
    const { data, error } = await supabase
      .from('resume_roasts')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(limit);
    throwIf(error, 'roasts/history');
    const list = (data || []).map(mapRow);
    return { success: true, data: list, roasts: list, history: list };
  },

  async getById(id) {
    const { data, error } = await supabase.from('resume_roasts').select('*').eq('id', id).maybeSingle();
    throwIf(error, 'roasts/get');
    return { success: true, data: mapRow(data), roast: mapRow(data) };
  },

  async getByShareToken(token) {
    const { data, error } = await supabase.from('resume_roasts').select('*').eq('share_token', token).maybeSingle();
    throwIf(error, 'roasts/share');
    return { success: true, data: mapRow(data), roast: mapRow(data) };
  },

  async save(payload) {
    const uid = await requireUserId();
    const body = {
      user_id: uid,
      resume_text: payload.resumeText || payload.resume_text || '',
      job_role: payload.jobRole || '',
      roast: payload.roast || payload.data || {},
      is_public: !!payload.isPublic,
      share_token: payload.shareToken || crypto.randomUUID().slice(0, 12),
      data: stripMeta(payload),
    };
    const { data, error } = await supabase.from('resume_roasts').insert(body).select().single();
    throwIf(error, 'roasts/save');
    return { success: true, data: mapRow(data), roast: mapRow(data) };
  },

  async remove(id) {
    const { error } = await supabase.from('resume_roasts').delete().eq('id', id);
    throwIf(error, 'roasts/delete');
    return { success: true };
  },
};

// ---------------------------------------------------------------------------
// User settings (non-secret prefs synced across devices)
// ---------------------------------------------------------------------------
export const settingsData = {
  async get() {
    const uid = await requireUserId();
    const { data, error } = await supabase.from('user_settings').select('*').eq('user_id', uid).maybeSingle();
    throwIf(error, 'settings/get');
    return { success: true, data: mapRow(data) || {}, settings: mapRow(data) || {} };
  },

  async update(payload) {
    const uid = await requireUserId();
    const { data: existing } = await supabase.from('user_settings').select('data').eq('user_id', uid).maybeSingle();
    const body = {
      user_id: uid,
      data: { ...(existing?.data || {}), ...stripMeta(payload) },
      ...(payload.ai !== undefined ? { ai: payload.ai } : {}),
      ...(payload.github !== undefined ? { github: payload.github } : {}),
      ...(payload.theme !== undefined ? { theme: payload.theme } : {}),
    };
    const { data, error } = await supabase.from('user_settings').upsert(body).select().single();
    throwIf(error, 'settings/update');
    return { success: true, data: mapRow(data), settings: mapRow(data) };
  },
};

export default {
  authData,
  profileData,
  resumeData,
  resumeVersionData,
  resumeAtsData,
  trackerData,
  alertData,
  portfolioData,
  roastData,
  settingsData,
};
