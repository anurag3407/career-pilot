// =============================================================================
// CareerPilot D1 Data Layer — Complete CRUD across all platform tables
// =============================================================================

import {
  authenticateRequest,
  ensureUserProfile,
  formatProfile,
  safeJsonParse,
} from './auth.js';

function stripMeta(payload = {}) {
  const {
    id,
    _id,
    userId,
    user_id,
    createdAt,
    updatedAt,
    created_at,
    updated_at,
    ...rest
  } = payload || {};
  return rest;
}

const JSON_COLUMNS = new Set([
  'data',
  'skills',
  'preferences',
  'personal_info',
  'experience',
  'education',
  'projects',
  'certifications',
  'preferences_json',
  'packet',
  'offer',
  'rejection',
  'raw_data',
  'keywords',
  'requirements',
  'theme',
  'logs',
  'sections_json',
  'target_roles',
  'role_tags',
  'questions',
  'overall_feedback',
  'feedback',
  'repos',
  'drafts',
  'ai',
  'github',
  'notifications',
  'tech_skills',
  'soft_skills',
  'tags',
  'likes',
  'views',
  'roast',
]);

function mapRow(row) {
  if (!row) return null;
  const parsed = {};
  for (const [k, v] of Object.entries(row)) {
    if (JSON_COLUMNS.has(k) && typeof v === 'string') {
      parsed[k] = safeJsonParse(v, k === 'data' ? {} : []);
    } else {
      parsed[k] = v;
    }
  }

  const { data: doc = {}, created_at, updated_at, user_id, ...rest } = parsed;
  const id = rest.id ?? doc?.id;
  const out = {
    ...rest,
    ...(doc && typeof doc === 'object' ? doc : {}),
    id,
    _id: id,
    userId: user_id ?? doc?.userId,
    createdAt: created_at ?? doc?.createdAt,
    updatedAt: updated_at ?? doc?.updatedAt,
  };

  if (rest.is_public !== undefined && out.isPublic === undefined) {
    out.isPublic = Boolean(rest.is_public);
  }
  if (rest.is_active !== undefined && out.isActive === undefined) {
    out.isActive = Boolean(rest.is_active);
  }
  if (rest.read !== undefined) {
    out.read = Boolean(rest.read);
  }
  if (rest.sections_json !== undefined && out.sections === undefined) {
    out.sections = parsed.sections_json;
  }
  if (rest.deployed_url !== undefined && out.deployedUrl === undefined) {
    out.deployedUrl = rest.deployed_url;
  }
  if (rest.project_name !== undefined && out.projectName === undefined) {
    out.projectName = rest.project_name;
  }
  if (rest.template_id !== undefined && out.templateId === undefined) {
    out.templateId = rest.template_id;
  }
  if (rest.job_url !== undefined && out.jobUrl === undefined) {
    out.jobUrl = rest.job_url;
  }
  if (rest.role_tags !== undefined) {
    out.roleTags = Array.isArray(parsed.role_tags) ? parsed.role_tags : (Array.isArray(out.roleTags) ? out.roleTags : []);
  }
  if (Array.isArray(parsed.skills)) {
    out.skills = parsed.skills;
  }
  if (Array.isArray(parsed.keywords)) {
    out.keywords = parsed.keywords;
  }
  if (rest.master_resume_id !== undefined && out.masterResumeId === undefined) {
    out.masterResumeId = rest.master_resume_id;
  }
  if (rest.master_resume_text !== undefined && out.masterResumeText === undefined) {
    out.masterResumeText = rest.master_resume_text;
  }
  if (rest.target_roles !== undefined && out.targetRoles === undefined) {
    out.targetRoles = parsed.target_roles;
  }
  if (rest.weekly_apply_target !== undefined && out.weeklyApplyTarget === undefined) {
    out.weeklyApplyTarget = rest.weekly_apply_target;
  }
  return out;
}

async function requireAuth(request, env) {
  if (!env.DB) {
    return { error: { data: { error: 'Cloudflare D1 database is not bound' }, status: 503 } };
  }
  const auth = await authenticateRequest(request, env);
  if (!auth) {
    return { error: { data: { error: 'Not authenticated' }, status: 401 } };
  }
  return { auth };
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------
async function handleProfiles(request, env, path) {
  const method = request.method;

  // Own profile: GET/PUT /v1/db/profiles/me
  if (path === '/v1/db/profiles/me') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const uid = auth.user.id;

    if (method === 'GET') {
      const row = await env.DB.prepare(`SELECT * FROM profiles WHERE id = ?`).bind(uid).first();
      const profile = formatProfile(row, null, env);
      return { data: { success: true, profile, user: auth.user }, status: 200 };
    }

    if (method === 'PUT' || method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const existing = await env.DB.prepare(`SELECT * FROM profiles WHERE id = ?`).bind(uid).first();
      const existingDoc = safeJsonParse(existing?.data, {});
      const mergedDoc = { ...existingDoc, ...stripMeta(body) };

      const fullName = body.displayName ?? body.name ?? body.full_name ?? existing?.full_name ?? auth.user.displayName;
      const username = body.username ?? existing?.username ?? auth.user.username;
      const jobRole = body.jobRole ?? body.job_role ?? existing?.job_role ?? '';
      const headline = body.headline ?? existing?.headline ?? '';
      const location = body.location ?? existing?.location ?? '';
      const website = body.website ?? existing?.website ?? '';
      const bio = body.bio ?? existing?.bio ?? '';
      const years = body.yearsOfExperience !== undefined ? Number(body.yearsOfExperience) || 0 : (existing?.years_of_experience ?? 0);
      const skillsVal = body.skills !== undefined
        ? (Array.isArray(body.skills) ? body.skills : String(body.skills).split(',').map((s) => s.trim()).filter(Boolean))
        : safeJsonParse(existing?.skills, []);
      const avatarUrl = body.avatarUrl ?? body.photoURL ?? existing?.avatar_url ?? null;
      const githubUsername = body.github ?? body.github_username ?? existing?.github_username ?? '';
      const linkedinUrl = body.linkedin ?? body.linkedin_url ?? existing?.linkedin_url ?? '';
      const prefs = body.preferences !== undefined
        ? body.preferences
        : safeJsonParse(existing?.preferences, { jobAlerts: true, directMessages: true, proposalUpdates: true });
      const plan = body.plan ?? existing?.plan ?? 'free';
      const isPro = body.isPro !== undefined ? (body.isPro ? 1 : 0) : (existing?.is_pro ?? 0);

      await env.DB.prepare(
        `UPDATE profiles
         SET full_name = ?, username = ?, job_role = ?, headline = ?, location = ?,
             website = ?, bio = ?, years_of_experience = ?, skills = ?, avatar_url = ?,
             github_username = ?, linkedin_url = ?, preferences = ?, plan = ?, is_pro = ?,
             data = ?, updated_at = datetime('now')
         WHERE id = ?`
      )
        .bind(
          fullName,
          username,
          jobRole,
          headline,
          location,
          website,
          bio,
          years,
          JSON.stringify(skillsVal),
          avatarUrl,
          githubUsername,
          linkedinUrl,
          JSON.stringify(prefs),
          plan,
          isPro,
          JSON.stringify(mergedDoc),
          uid
        )
        .run();

      await env.DB.prepare(`UPDATE users SET name = ?, avatar_url = ?, updated_at = datetime('now') WHERE id = ?`)
        .bind(fullName, avatarUrl, uid)
        .run()
        .catch(() => {});

      const updated = await env.DB.prepare(`SELECT * FROM profiles WHERE id = ?`).bind(uid).first();
      return { data: { success: true, profile: formatProfile(updated, null, env) }, status: 200 };
    }
  }

  // Avatar: POST / DELETE /v1/db/profiles/me/avatar
  if (path === '/v1/db/profiles/me/avatar') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const uid = auth.user.id;

    let avatarUrl = '';
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.avatarUrl) return { data: { error: 'avatarUrl is required' }, status: 400 };
      avatarUrl = String(body.avatarUrl).slice(0, 1000);
    } else if (method !== 'DELETE') {
      return { data: { error: 'Method not allowed' }, status: 405 };
    }

    const existing = await env.DB.prepare(`SELECT data FROM profiles WHERE id = ?`).bind(uid).first();
    const doc = { ...safeJsonParse(existing?.data, {}), photoURL: avatarUrl || null, avatarUrl: avatarUrl || null };

    await env.DB.prepare(
      `UPDATE profiles SET avatar_url = ?, data = ?, updated_at = datetime('now') WHERE id = ?`
    )
      .bind(avatarUrl || null, JSON.stringify(doc), uid)
      .run();

    await env.DB.prepare(`UPDATE users SET avatar_url = ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(avatarUrl || null, uid)
      .run()
      .catch(() => {});

    const updated = await env.DB.prepare(`SELECT * FROM profiles WHERE id = ?`).bind(uid).first();
    return { data: { success: true, profile: formatProfile(updated, null, env) }, status: 200 };
  }

  // Stats: GET /v1/db/profiles/me/stats or /v1/db/profiles/:uid/stats
  const statsMatch = path.match(/^\/v1\/db\/profiles\/([^/]+)\/stats$/);
  if (method === 'GET' && statsMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const targetUid = statsMatch[1] === 'me' ? auth.user.id : statsMatch[1];

    const [resumes, jobs, portfolios, interviews] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) AS cnt FROM resumes WHERE user_id = ?`).bind(targetUid).first(),
      env.DB.prepare(`SELECT COUNT(*) AS cnt FROM tracked_jobs WHERE user_id = ?`).bind(targetUid).first(),
      env.DB.prepare(`SELECT COUNT(*) AS cnt FROM portfolios WHERE user_id = ?`).bind(targetUid).first(),
      env.DB.prepare(`SELECT COUNT(*) AS cnt FROM interviews WHERE user_id = ?`).bind(targetUid).first(),
    ]);

    return {
      data: {
        success: true,
        stats: {
          resumesCreated: resumes?.cnt ?? 0,
          applicationsTracked: jobs?.cnt ?? 0,
          portfoliosCreated: portfolios?.cnt ?? 0,
          interviewsDone: interviews?.cnt ?? 0,
        },
      },
      status: 200,
    };
  }

  // Activity: GET /v1/db/profiles/me/activity or /v1/db/profiles/:uid/activity
  const activityMatch = path.match(/^\/v1\/db\/profiles\/([^/]+)\/activity$/);
  if (method === 'GET' && activityMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const targetUid = activityMatch[1] === 'me' ? auth.user.id : activityMatch[1];

    const [jobsRes, resumesRes] = await Promise.all([
      env.DB.prepare(`SELECT title, company, updated_at, created_at FROM tracked_jobs WHERE user_id = ? ORDER BY updated_at DESC LIMIT 10`)
        .bind(targetUid)
        .all(),
      env.DB.prepare(`SELECT id, title, updated_at, created_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC LIMIT 10`)
        .bind(targetUid)
        .all(),
    ]);

    const activity = [
      ...(jobsRes.results || []).map((j) => ({
        type: 'application',
        title: j.title,
        subtitle: j.company,
        at: j.updated_at || j.created_at,
      })),
      ...(resumesRes.results || []).map((r) => ({
        type: 'resume',
        title: r.title,
        subtitle: 'Resume',
        at: r.updated_at || r.created_at,
      })),
    ]
      .filter((a) => a.at)
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 15);

    return { data: { success: true, activity }, status: 200 };
  }

  // GET /v1/db/profiles/:uid
  const uidMatch = path.match(/^\/v1\/db\/profiles\/([^/]+)$/);
  if (method === 'GET' && uidMatch) {
    const row = await env.DB.prepare(`SELECT * FROM profiles WHERE id = ?`).bind(uidMatch[1]).first();
    if (!row) return { data: { error: 'Profile not found' }, status: 404 };
    return { data: { success: true, profile: formatProfile(row, null, env) }, status: 200 };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Resumes, Versions, ATS History
// ---------------------------------------------------------------------------
async function handleResumes(request, env, url, path) {
  const method = request.method;

  // Public share: GET /v1/db/resumes/share/:token
  const shareMatch = path.match(/^\/v1\/db\/resumes\/share\/([^/]+)$/);
  if (method === 'GET' && shareMatch) {
    const row = await env.DB.prepare(`SELECT * FROM resumes WHERE share_token = ? AND is_public = 1`)
      .bind(shareMatch[1])
      .first();
    if (!row) return { data: { error: 'Shared resume not found' }, status: 404 };
    const mapped = mapRow(row);
    return { data: { success: true, data: mapped, resume: mapped }, status: 200 };
  }

  // Versions: /v1/db/resumes/:resumeId/versions...
  const versionRestoreMatch = path.match(/^\/v1\/db\/resumes\/([^/]+)\/versions\/([^/]+)\/restore$/);
  if (method === 'POST' && versionRestoreMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const [, resumeId, versionId] = versionRestoreMatch;
    const version = await env.DB.prepare(
      `SELECT * FROM resume_versions WHERE id = ? AND resume_id = ? AND user_id = ?`
    )
      .bind(versionId, resumeId, auth.user.id)
      .first();
    if (!version) return { data: { error: 'Version not found' }, status: 404 };
    const versionDoc = safeJsonParse(version.data, {});
    return updateResumeById(env, resumeId, auth.user.id, versionDoc);
  }

  const versionItemMatch = path.match(/^\/v1\/db\/resumes\/([^/]+)\/versions\/([^/]+)$/);
  if (versionItemMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const [, resumeId, versionId] = versionItemMatch;

    if (method === 'PUT' || method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const existing = await env.DB.prepare(
        `SELECT * FROM resume_versions WHERE id = ? AND resume_id = ? AND user_id = ?`
      )
        .bind(versionId, resumeId, auth.user.id)
        .first();
      if (!existing) return { data: { error: 'Version not found' }, status: 404 };
      const merged = { ...safeJsonParse(existing.data, {}), ...stripMeta(body) };
      const label = body.versionLabel || body.label || existing.version_label;
      await env.DB.prepare(`UPDATE resume_versions SET version_label = ?, data = ? WHERE id = ?`)
        .bind(label, JSON.stringify(merged), versionId)
        .run();
      const updated = await env.DB.prepare(`SELECT * FROM resume_versions WHERE id = ?`).bind(versionId).first();
      const mapped = mapRow(updated);
      return { data: { success: true, data: mapped, version: mapped }, status: 200 };
    }

    if (method === 'DELETE') {
      await env.DB.prepare(`DELETE FROM resume_versions WHERE id = ? AND resume_id = ? AND user_id = ?`)
        .bind(versionId, resumeId, auth.user.id)
        .run();
      return { data: { success: true }, status: 200 };
    }
  }

  const versionsListMatch = path.match(/^\/v1\/db\/resumes\/([^/]+)\/versions$/);
  if (versionsListMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const resumeId = versionsListMatch[1];

    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM resume_versions WHERE resume_id = ? AND user_id = ? ORDER BY created_at DESC`
      )
        .bind(resumeId, auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, versions: list }, status: 200 };
    }

    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = crypto.randomUUID();
      const label = body.versionLabel || body.label || 'Snapshot';
      const payloadData = stripMeta(body.data || body);
      await env.DB.prepare(
        `INSERT INTO resume_versions (id, resume_id, user_id, version_label, data) VALUES (?, ?, ?, ?, ?)`
      )
        .bind(id, resumeId, auth.user.id, label, JSON.stringify(payloadData))
        .run();
      const row = await env.DB.prepare(`SELECT * FROM resume_versions WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, version: mapped }, status: 201 };
    }
  }

  // ATS History: /v1/db/resumes/:resumeId/ats-history
  const atsMatch = path.match(/^\/v1\/db\/resumes\/([^/]+)\/ats-history$/);
  if (atsMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const resumeId = atsMatch[1];

    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM resume_ats_history WHERE resume_id = ? AND user_id = ? ORDER BY created_at ASC`
      )
        .bind(resumeId, auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, history: list }, status: 200 };
    }

    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = crypto.randomUUID();
      const score = Number(body.score ?? body.overallScore ?? 0);
      await env.DB.prepare(
        `INSERT INTO resume_ats_history (id, resume_id, user_id, score, data) VALUES (?, ?, ?, ?, ?)`
      )
        .bind(id, resumeId, auth.user.id, score, JSON.stringify(stripMeta(body)))
        .run();
      const row = await env.DB.prepare(`SELECT * FROM resume_ats_history WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped }, status: 201 };
    }
  }

  // Single resume: /v1/db/resumes/:id
  const itemMatch = path.match(/^\/v1\/db\/resumes\/([^/]+)$/);
  if (itemMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const resumeId = itemMatch[1];

    if (method === 'GET') {
      const row = await env.DB.prepare(
        `SELECT * FROM resumes WHERE id = ? AND (user_id = ? OR is_public = 1)`
      )
        .bind(resumeId, auth.user.id)
        .first();
      if (!row) return { data: { error: 'Resume not found' }, status: 404 };
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, resume: mapped }, status: 200 };
    }

    if (method === 'PUT' || method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      return updateResumeById(env, resumeId, auth.user.id, body);
    }

    if (method === 'DELETE') {
      await env.DB.prepare(`DELETE FROM resumes WHERE id = ? AND user_id = ?`).bind(resumeId, auth.user.id).run();
      return { data: { success: true }, status: 200 };
    }
  }

  // Collection: /v1/db/resumes
  if (path === '/v1/db/resumes') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const uid = auth.user.id;

    if (method === 'GET') {
      const resumeId = url.searchParams.get('id');
      if (resumeId) {
        const row = await env.DB.prepare(`SELECT * FROM resumes WHERE id = ? AND (user_id = ? OR is_public = 1)`)
          .bind(resumeId, uid)
          .first();
        if (!row) return { data: { error: 'Resume not found' }, status: 404 };
        const mapped = mapRow(row);
        return { data: { success: true, data: mapped, resume: mapped }, status: 200 };
      }
      const { results } = await env.DB.prepare(
        `SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC`
      )
        .bind(uid)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, resumes: list }, status: 200 };
    }

    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      const existing = body.id
        ? await env.DB.prepare(`SELECT * FROM resumes WHERE id = ? AND user_id = ?`).bind(id, uid).first()
        : null;

      if (existing) {
        return updateResumeById(env, id, uid, body);
      }

      const title = body.title || 'Untitled Resume';
      const originalText = body.originalText ?? body.original_text ?? body.summary ?? '';
      const enhancedText = body.enhancedText ?? body.enhanced_text ?? null;
      const jobRole = body.jobRole ?? body.job_role ?? body.targetRole ?? body.target_role ?? '';
      const targetRole = body.targetRole ?? body.target_role ?? jobRole;
      const atsScore = body.atsScore ?? body.ats_score ?? null;
      const pdfUrl = body.pdfUrl ?? body.pdf_url ?? null;
      const prefs = body.preferences ? JSON.stringify(body.preferences) : null;
      const template = body.template || 'classic';
      const isPublic = body.isPublic ? 1 : 0;
      const shareToken = body.shareToken || null;
      const source = body.source || 'manual';
      const doc = stripMeta(body);

      await env.DB.prepare(
        `INSERT INTO resumes (
           id, user_id, title, original_text, enhanced_text, job_role, target_role,
           ats_score, pdf_url, preferences_json, template, is_public, share_token,
           source, data, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
      )
        .bind(
          id,
          uid,
          title,
          originalText,
          enhancedText,
          jobRole,
          targetRole,
          atsScore,
          pdfUrl,
          prefs,
          template,
          isPublic,
          shareToken,
          source,
          JSON.stringify(doc)
        )
        .run();

      const row = await env.DB.prepare(`SELECT * FROM resumes WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, resume: mapped }, status: 200 };
    }

    if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return { data: { error: 'id is required' }, status: 400 };
      await env.DB.prepare(`DELETE FROM resumes WHERE id = ? AND user_id = ?`).bind(id, uid).run();
      return { data: { success: true }, status: 200 };
    }
  }

  return null;
}

async function updateResumeById(env, resumeId, uid, payload) {
  const existing = await env.DB.prepare(`SELECT * FROM resumes WHERE id = ? AND user_id = ?`)
    .bind(resumeId, uid)
    .first();
  if (!existing) return { data: { error: 'Resume not found' }, status: 404 };

  const existingDoc = safeJsonParse(existing.data, {});
  const merged = { ...existingDoc, ...stripMeta(payload) };

  const title = payload.title ?? existing.title;
  const originalText = payload.originalText ?? payload.original_text ?? existing.original_text ?? '';
  const enhancedText = payload.enhancedText ?? payload.enhanced_text ?? existing.enhanced_text;
  const jobRole = payload.jobRole ?? payload.job_role ?? existing.job_role;
  const targetRole = payload.targetRole ?? payload.target_role ?? existing.target_role;
  const atsScore = payload.atsScore ?? payload.ats_score ?? existing.ats_score;
  const pdfUrl = payload.pdfUrl ?? payload.pdf_url ?? existing.pdf_url;
  const template = payload.template ?? existing.template;
  const isPublic = payload.isPublic !== undefined ? (payload.isPublic ? 1 : 0) : existing.is_public;
  const shareToken = payload.shareToken !== undefined ? payload.shareToken : existing.share_token;
  const source = payload.source ?? existing.source;

  await env.DB.prepare(
    `UPDATE resumes
     SET title = ?, original_text = ?, enhanced_text = ?, job_role = ?, target_role = ?,
         ats_score = ?, pdf_url = ?, template = ?, is_public = ?, share_token = ?,
         source = ?, data = ?, updated_at = datetime('now')
     WHERE id = ? AND user_id = ?`
  )
    .bind(
      title,
      originalText,
      enhancedText,
      jobRole,
      targetRole,
      atsScore,
      pdfUrl,
      template,
      isPublic,
      shareToken,
      source,
      JSON.stringify(merged),
      resumeId,
      uid
    )
    .run();

  const updated = await env.DB.prepare(`SELECT * FROM resumes WHERE id = ?`).bind(resumeId).first();
  const mapped = mapRow(updated);
  return { data: { success: true, data: mapped, resume: mapped }, status: 200 };
}

// ---------------------------------------------------------------------------
// Tracked Jobs
// ---------------------------------------------------------------------------
async function handleTrackedJobs(request, env, url, path) {
  const method = request.method;

  // PATCH /v1/db/jobs/:id/status
  const statusMatch = path.match(/^\/v1\/db\/jobs\/([^/]+)\/status$/);
  if ((method === 'PATCH' || method === 'POST') && statusMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const jobId = statusMatch[1];
    const body = await request.json().catch(() => ({}));
    const status = body.status;
    const notes = body.notes || '';
    if (!status) return { data: { error: 'status is required' }, status: 400 };

    const existing = await env.DB.prepare(`SELECT * FROM tracked_jobs WHERE id = ? AND user_id = ?`)
      .bind(jobId, auth.user.id)
      .first();
    if (!existing) return { data: { error: 'Tracked job not found' }, status: 404 };

    const now = new Date().toISOString();
    const doc = safeJsonParse(existing.data, {});
    const notesArray = Array.isArray(doc.notes) ? [...doc.notes] : [];
    if (notes && String(notes).trim()) {
      notesArray.push({ content: String(notes).trim(), createdAt: now });
    }
    if (notesArray.length || Array.isArray(doc.notes)) doc.notes = notesArray;
    if (status === 'applied') doc.appliedAt = doc.appliedAt || now;
    doc.status = status;

    const appliedAt = status === 'applied' ? (existing.applied_at || now) : existing.applied_at;
    const appliedDate = status === 'applied' ? (existing.applied_date || now) : existing.applied_date;
    const legacyNotes = notes && String(notes).trim() ? String(notes).trim() : existing.notes;

    await env.DB.prepare(
      `UPDATE tracked_jobs
       SET status = ?, notes = ?, applied_at = ?, applied_date = ?, last_activity_at = ?,
           data = ?, updated_at = datetime('now')
       WHERE id = ? AND user_id = ?`
    )
      .bind(status, legacyNotes, appliedAt, appliedDate, now, JSON.stringify(doc), jobId, auth.user.id)
      .run();

    const updated = await env.DB.prepare(`SELECT * FROM tracked_jobs WHERE id = ?`).bind(jobId).first();
    const mapped = mapRow(updated);
    return { data: { success: true, trackedJob: mapped, data: mapped, job: mapped }, status: 200 };
  }

  // PUT/PATCH/DELETE /v1/db/jobs/:id
  const itemMatch = path.match(/^\/v1\/db\/jobs\/([^/]+)$/);
  if (itemMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const id = itemMatch[1];

    if (method === 'GET') {
      const row = await env.DB.prepare(`SELECT * FROM tracked_jobs WHERE id = ? AND user_id = ?`)
        .bind(id, auth.user.id)
        .first();
      if (!row) return { data: { error: 'Tracked job not found' }, status: 404 };
      const mapped = mapRow(row);
      return { data: { success: true, trackedJob: mapped, data: mapped, job: mapped }, status: 200 };
    }

    if (method === 'PUT' || method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const existing = await env.DB.prepare(`SELECT * FROM tracked_jobs WHERE id = ? AND user_id = ?`)
        .bind(id, auth.user.id)
        .first();
      if (!existing) return { data: { error: 'Tracked job not found' }, status: 404 };

      const existingDoc = safeJsonParse(existing.data, {});
      const mergedDoc = { ...existingDoc, ...stripMeta(body) };
      const now = new Date().toISOString();

      await env.DB.prepare(
        `UPDATE tracked_jobs
         SET job_id = ?, title = ?, company = ?, location = ?, status = ?, salary = ?,
             job_url = ?, notes = ?, resume_id = ?, resume_version_id = ?, cover_letter_id = ?,
             interview_id = ?, applied_at = ?, next_action_at = ?, next_action_type = ?,
             interview_at = ?, last_activity_at = ?, packet = ?, offer = ?, rejection = ?,
             data = ?, updated_at = datetime('now')
         WHERE id = ? AND user_id = ?`
      )
        .bind(
          body.jobId ?? body.job_id ?? existing.job_id,
          body.title ?? existing.title,
          body.company ?? existing.company,
          body.location ?? existing.location,
          body.status ?? existing.status,
          body.salary ?? existing.salary,
          body.jobUrl ?? body.url ?? existing.job_url,
          typeof body.notes === 'string' ? body.notes : existing.notes,
          body.resumeId !== undefined ? (body.resumeId || null) : existing.resume_id,
          body.resumeVersionId !== undefined ? (body.resumeVersionId || null) : existing.resume_version_id,
          body.coverLetterId !== undefined ? (body.coverLetterId || null) : existing.cover_letter_id,
          body.interviewId !== undefined ? (body.interviewId || null) : existing.interview_id,
          body.appliedAt !== undefined ? (body.appliedAt || null) : existing.applied_at,
          body.nextActionAt !== undefined ? (body.nextActionAt || null) : existing.next_action_at,
          body.nextActionType !== undefined ? (body.nextActionType || null) : existing.next_action_type,
          body.interviewAt !== undefined ? (body.interviewAt || null) : existing.interview_at,
          body.lastActivityAt || now,
          JSON.stringify(body.packet !== undefined ? (body.packet || {}) : safeJsonParse(existing.packet, {})),
          JSON.stringify(body.offer !== undefined ? (body.offer || {}) : safeJsonParse(existing.offer, {})),
          JSON.stringify(body.rejection !== undefined ? (body.rejection || {}) : safeJsonParse(existing.rejection, {})),
          JSON.stringify(mergedDoc),
          id,
          auth.user.id
        )
        .run();

      const updated = await env.DB.prepare(`SELECT * FROM tracked_jobs WHERE id = ?`).bind(id).first();
      const mapped = mapRow(updated);
      return { data: { success: true, trackedJob: mapped, data: mapped, job: mapped }, status: 200 };
    }

    if (method === 'DELETE') {
      await env.DB.prepare(`DELETE FROM tracked_jobs WHERE id = ? AND user_id = ?`).bind(id, auth.user.id).run();
      return { data: { success: true }, status: 200 };
    }
  }

  // Collection: /v1/db/jobs
  if (path === '/v1/db/jobs') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const uid = auth.user.id;

    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM tracked_jobs WHERE user_id = ? ORDER BY updated_at DESC, created_at DESC`
      )
        .bind(uid)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, jobs: list, trackedJobs: list, data: list }, status: 200 };
    }

    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      if (!body.company || !body.title) {
        return { data: { error: 'company and title are required' }, status: 400 };
      }
      const id = body.id || crypto.randomUUID();
      const now = new Date().toISOString();
      const doc = stripMeta(body);
      const notesText = typeof body.notes === 'string'
        ? body.notes
        : (Array.isArray(body.notes) ? (body.notes[0]?.content || '') : '');

      await env.DB.prepare(
        `INSERT INTO tracked_jobs (
           id, user_id, job_id, company, title, location, status, salary, job_url,
           notes, applied_date, applied_at, resume_id, resume_version_id, cover_letter_id,
           interview_id, next_action_at, next_action_type, interview_at, last_activity_at,
           packet, offer, rejection, raw_data, data, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(id) DO UPDATE SET
           company = excluded.company,
           title = excluded.title,
           location = excluded.location,
           status = excluded.status,
           salary = excluded.salary,
           job_url = excluded.job_url,
           notes = excluded.notes,
           last_activity_at = excluded.last_activity_at,
           data = excluded.data,
           updated_at = datetime('now')
         WHERE tracked_jobs.user_id = excluded.user_id`
      )
        .bind(
          id,
          uid,
          body.jobId || body.job_id || null,
          body.company,
          body.title,
          body.location || '',
          body.status || 'saved',
          body.salary || '',
          body.jobUrl || body.url || body.applyLink || '',
          notesText,
          body.appliedDate || (body.status === 'applied' ? now : null),
          body.appliedAt || (body.status === 'applied' ? now : null),
          body.resumeId || null,
          body.resumeVersionId || null,
          body.coverLetterId || null,
          body.interviewId || null,
          body.nextActionAt || null,
          body.nextActionType || null,
          body.interviewAt || null,
          body.lastActivityAt || now,
          JSON.stringify(body.packet || {}),
          JSON.stringify(body.offer || {}),
          JSON.stringify(body.rejection || {}),
          JSON.stringify(body),
          JSON.stringify(doc)
        )
        .run();

      const row = await env.DB.prepare(`SELECT * FROM tracked_jobs WHERE id = ? AND user_id = ?`)
        .bind(id, uid)
        .first();
      const mapped = mapRow(row);
      return { data: { success: true, job: mapped, trackedJob: mapped, data: mapped }, status: 200 };
    }

    if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return { data: { error: 'id is required' }, status: 400 };
      await env.DB.prepare(`DELETE FROM tracked_jobs WHERE id = ? AND user_id = ?`).bind(id, uid).run();
      return { data: { success: true }, status: 200 };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Job Alerts & Job Listings
// ---------------------------------------------------------------------------
async function handleAlertsAndListings(request, env, path) {
  const method = request.method;

  const toggleMatch = path.match(/^\/v1\/db\/alerts\/([^/]+)\/toggle$/);
  if (method === 'POST' && toggleMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const id = toggleMatch[1];
    const existing = await env.DB.prepare(`SELECT * FROM job_alerts WHERE id = ? AND user_id = ?`)
      .bind(id, auth.user.id)
      .first();
    if (!existing) return { data: { error: 'Alert not found' }, status: 404 };

    const nextActive = existing.is_active ? 0 : 1;
    const doc = { ...safeJsonParse(existing.data, {}), isActive: Boolean(nextActive) };
    await env.DB.prepare(`UPDATE job_alerts SET is_active = ?, data = ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(nextActive, JSON.stringify(doc), id)
      .run();
    const updated = await env.DB.prepare(`SELECT * FROM job_alerts WHERE id = ?`).bind(id).first();
    const mapped = mapRow(updated);
    return { data: { success: true, alert: mapped, data: mapped }, status: 200 };
  }

  const itemMatch = path.match(/^\/v1\/db\/alerts\/([^/]+)$/);
  if (itemMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const id = itemMatch[1];

    if (method === 'GET') {
      const row = await env.DB.prepare(`SELECT * FROM job_alerts WHERE id = ? AND user_id = ?`)
        .bind(id, auth.user.id)
        .first();
      if (!row) return { data: { error: 'Alert not found' }, status: 404 };
      const mapped = mapRow(row);
      return { data: { success: true, alert: mapped, data: mapped }, status: 200 };
    }

    if (method === 'PUT' || method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const existing = await env.DB.prepare(`SELECT * FROM job_alerts WHERE id = ? AND user_id = ?`)
        .bind(id, auth.user.id)
        .first();
      if (!existing) return { data: { error: 'Alert not found' }, status: 404 };
      const mergedDoc = { ...safeJsonParse(existing.data, {}), ...stripMeta(body) };
      const keywords = body.keywords !== undefined
        ? (Array.isArray(body.keywords) ? body.keywords : String(body.keywords).split(',').map((s) => s.trim()).filter(Boolean))
        : safeJsonParse(existing.keywords, []);

      await env.DB.prepare(
        `UPDATE job_alerts
         SET email = ?, keywords = ?, location = ?, experience_level = ?, min_salary = ?,
             frequency = ?, is_active = ?, data = ?, updated_at = datetime('now')
         WHERE id = ? AND user_id = ?`
      )
        .bind(
          body.email ?? existing.email,
          JSON.stringify(keywords),
          body.location ?? existing.location,
          body.experienceLevel ?? existing.experience_level,
          body.minSalary !== undefined ? (Number(body.minSalary) || 0) : existing.min_salary,
          body.frequency ?? existing.frequency,
          body.isActive !== undefined ? (body.isActive ? 1 : 0) : existing.is_active,
          JSON.stringify(mergedDoc),
          id,
          auth.user.id
        )
        .run();
      const updated = await env.DB.prepare(`SELECT * FROM job_alerts WHERE id = ?`).bind(id).first();
      const mapped = mapRow(updated);
      return { data: { success: true, alert: mapped, data: mapped }, status: 200 };
    }

    if (method === 'DELETE') {
      await env.DB.prepare(`DELETE FROM job_alerts WHERE id = ? AND user_id = ?`).bind(id, auth.user.id).run();
      return { data: { success: true }, status: 200 };
    }
  }

  if (path === '/v1/db/alerts') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;

    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM job_alerts WHERE user_id = ? ORDER BY created_at DESC`
      )
        .bind(auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, alerts: list, data: list }, status: 200 };
    }

    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      const keywords = Array.isArray(body.keywords)
        ? body.keywords
        : String(body.keywords || '').split(',').map((s) => s.trim()).filter(Boolean);
      const email = body.email || auth.user.email || '';

      await env.DB.prepare(
        `INSERT INTO job_alerts (
           id, user_id, email, keywords, location, experience_level, min_salary,
           frequency, is_active, data
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          email,
          JSON.stringify(keywords),
          body.location || '',
          body.experienceLevel || '',
          Number(body.minSalary) || 0,
          body.frequency || 'daily',
          body.isActive === false ? 0 : 1,
          JSON.stringify(stripMeta(body))
        )
        .run();

      const row = await env.DB.prepare(`SELECT * FROM job_alerts WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, alert: mapped, data: mapped }, status: 201 };
    }
  }

  if (path === '/v1/db/job-listings') {
    if (method === 'GET') {
      const { results } = await env.DB.prepare(`SELECT * FROM job_listings ORDER BY created_at DESC LIMIT 100`).all();
      return { data: { success: true, listings: (results || []).map(mapRow) }, status: 200 };
    }
    if (method === 'POST') {
      const { error } = await requireAuth(request, env);
      if (error) return error;
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO job_listings (
           id, title, company, location, job_type, experience_level, salary_min,
           salary_max, currency, description, requirements, skills, source, apply_url, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title, company = excluded.company, location = excluded.location,
           description = excluded.description, updated_at = datetime('now')`
      )
        .bind(
          id,
          body.title || 'Untitled Role',
          body.company || 'Unknown',
          body.location || 'Remote',
          body.jobType || 'Full-time',
          body.experienceLevel || 'Mid',
          body.salaryMin ?? null,
          body.salaryMax ?? null,
          body.currency || 'USD',
          body.description || '',
          JSON.stringify(body.requirements || []),
          JSON.stringify(body.skills || []),
          body.source || 'manual',
          body.applyUrl || body.url || null
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM job_listings WHERE id = ?`).bind(id).first();
      return { data: { success: true, listing: mapRow(row) }, status: 200 };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Portfolios & Deployments
// ---------------------------------------------------------------------------
async function handlePortfolios(request, env, url, path) {
  const method = request.method;

  if (path === '/v1/db/portfolio-deployments') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM portfolio_deployments WHERE user_id = ? ORDER BY created_at DESC`
      )
        .bind(auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, deployments: list }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO portfolio_deployments (id, user_id, portfolio_id, provider, url, status, logs)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          body.portfolioId || body.portfolio_id || null,
          body.provider || 'cloudflare',
          body.url || null,
          body.status || 'success',
          JSON.stringify(body.logs || [])
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM portfolio_deployments WHERE id = ?`).bind(id).first();
      return { data: { success: true, data: mapRow(row) }, status: 201 };
    }
  }

  const itemMatch = path.match(/^\/v1\/db\/portfolios\/([^/]+)$/);
  if (itemMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const portfolioId = itemMatch[1];

    if (method === 'GET') {
      const row = await env.DB.prepare(
        `SELECT * FROM portfolios WHERE id = ? AND (user_id = ? OR is_public = 1)`
      )
        .bind(portfolioId, auth.user.id)
        .first();
      if (!row) return { data: { error: 'Portfolio not found' }, status: 404 };
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, portfolio: mapped }, status: 200 };
    }

    if (method === 'PUT' || method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const existing = await env.DB.prepare(`SELECT * FROM portfolios WHERE id = ? AND user_id = ?`)
        .bind(portfolioId, auth.user.id)
        .first();
      if (!existing) return { data: { error: 'Portfolio not found' }, status: 404 };

      const mergedDoc = { ...safeJsonParse(existing.data, {}), ...stripMeta(body) };
      const sectionsJson = body.sections ? JSON.stringify(body.sections) : (body.sections_json || existing.sections_json);
      await env.DB.prepare(
        `UPDATE portfolios
         SET title = ?, slug = ?, template_id = ?, sections_json = ?, deployed_url = ?,
             project_name = ?, theme = ?, is_public = ?, deploy_provider = ?, deployed_at = ?,
             data = ?, updated_at = datetime('now')
         WHERE id = ? AND user_id = ?`
      )
        .bind(
          body.title ?? existing.title,
          body.slug ?? existing.slug,
          body.templateId ?? body.template ?? existing.template_id,
          sectionsJson,
          body.deployUrl ?? body.deployedUrl ?? existing.deployed_url,
          body.projectName ?? existing.project_name,
          JSON.stringify(body.theme ?? safeJsonParse(existing.theme, {})),
          body.isPublic !== undefined ? (body.isPublic ? 1 : 0) : existing.is_public,
          body.deployProvider ?? existing.deploy_provider,
          body.deployedAt ?? existing.deployed_at,
          JSON.stringify(mergedDoc),
          portfolioId,
          auth.user.id
        )
        .run();

      const updated = await env.DB.prepare(`SELECT * FROM portfolios WHERE id = ?`).bind(portfolioId).first();
      const mapped = mapRow(updated);
      return { data: { success: true, data: mapped, portfolio: mapped }, status: 200 };
    }

    if (method === 'DELETE') {
      await env.DB.prepare(`DELETE FROM portfolios WHERE id = ? AND user_id = ?`).bind(portfolioId, auth.user.id).run();
      return { data: { success: true }, status: 200 };
    }
  }

  if (path === '/v1/db/portfolios') {
    const slug = url.searchParams.get('slug');
    // Public slug lookup
    if (method === 'GET' && slug && !request.headers.get('Authorization')) {
      const row = await env.DB.prepare(`SELECT * FROM portfolios WHERE slug = ? AND is_public = 1`).bind(slug).first()
        || await env.DB.prepare(`SELECT * FROM portfolios WHERE slug = ?`).bind(slug).first();
      if (!row) return { data: { error: 'Portfolio not found' }, status: 404 };
      const mapped = mapRow(row);
      return { data: { success: true, portfolio: mapped, data: mapped }, status: 200 };
    }

    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const uid = auth.user.id;

    if (method === 'GET') {
      if (slug) {
        const row = await env.DB.prepare(`SELECT * FROM portfolios WHERE slug = ? AND (user_id = ? OR is_public = 1)`)
          .bind(slug, uid)
          .first();
        if (!row) return { data: { error: 'Portfolio not found' }, status: 404 };
        const mapped = mapRow(row);
        return { data: { success: true, portfolio: mapped, data: mapped }, status: 200 };
      }
      const id = url.searchParams.get('id');
      if (id) {
        const row = await env.DB.prepare(`SELECT * FROM portfolios WHERE id = ? AND (user_id = ? OR is_public = 1)`)
          .bind(id, uid)
          .first();
        if (!row) return { data: { error: 'Portfolio not found' }, status: 404 };
        const mapped = mapRow(row);
        return { data: { success: true, portfolio: mapped, data: mapped }, status: 200 };
      }

      const { results } = await env.DB.prepare(
        `SELECT * FROM portfolios WHERE user_id = ? ORDER BY updated_at DESC`
      )
        .bind(uid)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, portfolios: list, data: list }, status: 200 };
    }

    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const slugVal = body.slug || crypto.randomUUID();
      const id = body.id || crypto.randomUUID();
      const sectionsJson = body.sections ? JSON.stringify(body.sections) : (body.sections_json || '{}');
      const doc = stripMeta(body);

      await env.DB.prepare(
        `INSERT INTO portfolios (
           id, user_id, slug, template_id, title, sections_json, deployed_url,
           project_name, theme, is_public, deploy_provider, deployed_at, data, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id, slug) DO UPDATE SET
           template_id = excluded.template_id,
           title = excluded.title,
           sections_json = excluded.sections_json,
           deployed_url = coalesce(excluded.deployed_url, portfolios.deployed_url),
           project_name = coalesce(excluded.project_name, portfolios.project_name),
           theme = excluded.theme,
           is_public = excluded.is_public,
           data = excluded.data,
           updated_at = datetime('now')`
      )
        .bind(
          id,
          uid,
          slugVal,
          body.templateId || body.template || 'default',
          body.title || 'My Portfolio',
          sectionsJson,
          body.deployUrl || body.deployedUrl || null,
          body.projectName || null,
          JSON.stringify(body.theme || {}),
          body.isPublic ? 1 : 0,
          body.deployProvider || null,
          body.deployedAt || null,
          JSON.stringify(doc)
        )
        .run();

      const row = await env.DB.prepare(`SELECT * FROM portfolios WHERE user_id = ? AND slug = ?`)
        .bind(uid, slugVal)
        .first();
      const mapped = mapRow(row);
      return { data: { success: true, portfolio: mapped, data: mapped }, status: 200 };
    }

    if (method === 'DELETE') {
      const id = url.searchParams.get('id');
      const delSlug = url.searchParams.get('slug');
      if (id) {
        await env.DB.prepare(`DELETE FROM portfolios WHERE id = ? AND user_id = ?`).bind(id, uid).run();
        return { data: { success: true }, status: 200 };
      }
      if (delSlug) {
        await env.DB.prepare(`DELETE FROM portfolios WHERE user_id = ? AND slug = ?`).bind(uid, delSlug).run();
        return { data: { success: true }, status: 200 };
      }
      return { data: { error: 'id or slug is required' }, status: 400 };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Roasts, Cover Letters, Career Profile, STAR Stories, Settings
// ---------------------------------------------------------------------------
async function handleCareerTools(request, env, url, path) {
  const method = request.method;

  // Roasts share: GET /v1/db/roasts/share/:token (public)
  const roastShare = path.match(/^\/v1\/db\/roasts\/share\/([^/]+)$/);
  if (method === 'GET' && roastShare) {
    const row = await env.DB.prepare(`SELECT * FROM resume_roasts WHERE share_token = ? AND is_public = 1`)
      .bind(roastShare[1])
      .first();
    if (!row) return { data: { error: 'Roast not found or not public' }, status: 404 };
    const mapped = mapRow(row);
    return { data: { success: true, data: mapped, roast: mapped }, status: 200 };
  }

  const roastItem = path.match(/^\/v1\/db\/roasts\/([^/]+)$/);
  if (roastItem) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const id = roastItem[1];
    if (method === 'GET') {
      const row = await env.DB.prepare(`SELECT * FROM resume_roasts WHERE id = ? AND (user_id = ? OR is_public = 1)`)
        .bind(id, auth.user.id)
        .first();
      if (!row) return { data: { error: 'Roast not found' }, status: 404 };
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, roast: mapped }, status: 200 };
    }
    if (method === 'DELETE') {
      await env.DB.prepare(`DELETE FROM resume_roasts WHERE id = ? AND user_id = ?`).bind(id, auth.user.id).run();
      return { data: { success: true }, status: 200 };
    }
  }

  if (path === '/v1/db/roasts') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10) || 20, 100);
      const { results } = await env.DB.prepare(
        `SELECT * FROM resume_roasts WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`
      )
        .bind(auth.user.id, limit)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, roasts: list, history: list }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      const shareToken = body.shareToken || crypto.randomUUID().slice(0, 12);
      await env.DB.prepare(
        `INSERT INTO resume_roasts (id, user_id, resume_text, job_role, roast, is_public, share_token, data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          body.resumeText || body.resume_text || '',
          body.jobRole || '',
          JSON.stringify(body.roast || body.data || {}),
          body.isPublic ? 1 : 0,
          shareToken,
          JSON.stringify(stripMeta(body))
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM resume_roasts WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, roast: mapped }, status: 201 };
    }
  }

  // Cover letters
  const clItem = path.match(/^\/v1\/db\/cover-letters\/([^/]+)$/);
  if (clItem && method === 'DELETE') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    await env.DB.prepare(`DELETE FROM cover_letters WHERE id = ? AND user_id = ?`).bind(clItem[1], auth.user.id).run();
    return { data: { success: true }, status: 200 };
  }

  if (path === '/v1/db/cover-letters') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM cover_letters WHERE user_id = ? ORDER BY created_at DESC`
      )
        .bind(auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, coverLetters: list }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO cover_letters (id, user_id, resume_id, job_title, company, tone, content, data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          body.resumeId || null,
          body.jobTitle || '',
          body.company || '',
          body.tone || 'professional',
          body.content || '',
          JSON.stringify(stripMeta(body))
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM cover_letters WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, coverLetter: mapped }, status: 201 };
    }
  }

  // Career profile
  if (path === '/v1/db/career-profile') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const row = await env.DB.prepare(`SELECT * FROM career_profiles WHERE user_id = ?`)
        .bind(auth.user.id)
        .first();
      const profile = mapRow(row);
      return { data: { success: true, data: profile, profile }, status: 200 };
    }
    if (method === 'PUT' || method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const existing = await env.DB.prepare(`SELECT * FROM career_profiles WHERE user_id = ?`)
        .bind(auth.user.id)
        .first();
      const id = existing?.id || crypto.randomUUID();
      const mergedDoc = { ...safeJsonParse(existing?.data, {}), ...stripMeta(body) };

      const masterResumeId = body.masterResumeId !== undefined ? (body.masterResumeId || null) : (existing?.master_resume_id ?? null);
      const masterResumeText = body.masterResumeText !== undefined ? (body.masterResumeText || '') : (existing?.master_resume_text ?? '');
      const targetRoles = body.targetRoles !== undefined
        ? (Array.isArray(body.targetRoles) ? body.targetRoles : [])
        : safeJsonParse(existing?.target_roles, []);
      const weeklyApplyTarget = body.weeklyApplyTarget !== undefined
        ? (Number(body.weeklyApplyTarget) || 0)
        : (existing?.weekly_apply_target ?? 5);

      await env.DB.prepare(
        `INSERT INTO career_profiles (id, user_id, master_resume_id, master_resume_text, target_roles, weekly_apply_target, data, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           master_resume_id = excluded.master_resume_id,
           master_resume_text = excluded.master_resume_text,
           target_roles = excluded.target_roles,
           weekly_apply_target = excluded.weekly_apply_target,
           data = excluded.data,
           updated_at = datetime('now')`
      )
        .bind(
          id,
          auth.user.id,
          masterResumeId,
          masterResumeText,
          JSON.stringify(targetRoles),
          weeklyApplyTarget,
          JSON.stringify(mergedDoc)
        )
        .run();

      const row = await env.DB.prepare(`SELECT * FROM career_profiles WHERE user_id = ?`).bind(auth.user.id).first();
      const profile = mapRow(row);
      return { data: { success: true, data: profile, profile }, status: 200 };
    }
  }

  // STAR stories
  const storyItem = path.match(/^\/v1\/db\/star-stories\/([^/]+)$/);
  if (storyItem) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const id = storyItem[1];

    if (method === 'PUT' || method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const existing = await env.DB.prepare(`SELECT * FROM star_stories WHERE id = ? AND user_id = ?`)
        .bind(id, auth.user.id)
        .first();
      if (!existing) return { data: { error: 'Story not found' }, status: 404 };
      const mergedDoc = { ...safeJsonParse(existing.data, {}), ...stripMeta(body) };
      const skills = body.skills !== undefined
        ? (Array.isArray(body.skills) ? body.skills : String(body.skills).split(',').map((s) => s.trim()).filter(Boolean))
        : safeJsonParse(existing.skills, []);
      const roleTags = body.roleTags !== undefined
        ? (Array.isArray(body.roleTags) ? body.roleTags : String(body.roleTags).split(',').map((s) => s.trim()).filter(Boolean))
        : safeJsonParse(existing.role_tags, []);

      await env.DB.prepare(
        `UPDATE star_stories
         SET title = ?, situation = ?, task = ?, action = ?, result = ?,
             skills = ?, role_tags = ?, source = ?, tracked_job_id = ?, data = ?,
             updated_at = datetime('now')
         WHERE id = ? AND user_id = ?`
      )
        .bind(
          body.title ?? existing.title,
          body.situation ?? existing.situation,
          body.task ?? existing.task,
          body.action ?? existing.action,
          body.result ?? existing.result,
          JSON.stringify(skills),
          JSON.stringify(roleTags),
          body.source ?? existing.source,
          body.trackedJobId !== undefined ? (body.trackedJobId || null) : existing.tracked_job_id,
          JSON.stringify(mergedDoc),
          id,
          auth.user.id
        )
        .run();

      const row = await env.DB.prepare(`SELECT * FROM star_stories WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, story: mapped }, status: 200 };
    }

    if (method === 'DELETE') {
      await env.DB.prepare(`DELETE FROM star_stories WHERE id = ? AND user_id = ?`).bind(id, auth.user.id).run();
      return { data: { success: true }, status: 200 };
    }
  }

  if (path === '/v1/db/star-stories') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM star_stories WHERE user_id = ? ORDER BY updated_at DESC`
      )
        .bind(auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, stories: list }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      const skills = Array.isArray(body.skills)
        ? body.skills
        : String(body.skills || '').split(',').map((s) => s.trim()).filter(Boolean);
      const roleTags = Array.isArray(body.roleTags)
        ? body.roleTags
        : String(body.roleTags || '').split(',').map((s) => s.trim()).filter(Boolean);

      await env.DB.prepare(
        `INSERT INTO star_stories (id, user_id, title, situation, task, action, result, skills, role_tags, source, tracked_job_id, data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          body.title || '',
          body.situation || '',
          body.task || '',
          body.action || '',
          body.result || '',
          JSON.stringify(skills),
          JSON.stringify(roleTags),
          body.source || 'manual',
          body.trackedJobId || null,
          JSON.stringify(stripMeta(body))
        )
        .run();

      const row = await env.DB.prepare(`SELECT * FROM star_stories WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, story: mapped }, status: 201 };
    }
  }

  // User settings
  if (path === '/v1/db/settings') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const row = await env.DB.prepare(`SELECT * FROM user_settings WHERE user_id = ?`).bind(auth.user.id).first();
      const mapped = mapRow(row) || {};
      return { data: { success: true, data: mapped, settings: mapped }, status: 200 };
    }
    if (method === 'PUT' || method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const existing = await env.DB.prepare(`SELECT * FROM user_settings WHERE user_id = ?`).bind(auth.user.id).first();
      const mergedDoc = { ...safeJsonParse(existing?.data, {}), ...stripMeta(body) };
      await env.DB.prepare(
        `INSERT INTO user_settings (user_id, ai, github, notifications, theme, data, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
         ON CONFLICT(user_id) DO UPDATE SET
           ai = excluded.ai,
           github = excluded.github,
           notifications = excluded.notifications,
           theme = excluded.theme,
           data = excluded.data,
           updated_at = datetime('now')`
      )
        .bind(
          auth.user.id,
          JSON.stringify(body.ai ?? safeJsonParse(existing?.ai, {})),
          JSON.stringify(body.github ?? safeJsonParse(existing?.github, {})),
          JSON.stringify(body.notifications ?? safeJsonParse(existing?.notifications, {})),
          body.theme ?? existing?.theme ?? 'dark',
          JSON.stringify(mergedDoc)
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM user_settings WHERE user_id = ?`).bind(auth.user.id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, settings: mapped }, status: 200 };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Interviews, GitHub Builds, Outreach, Notifications, User Inputs, Recruiter
// ---------------------------------------------------------------------------
async function handleExtendedTables(request, env, url, path) {
  const method = request.method;

  // Interviews
  const interviewAnswerMatch = path.match(/^\/v1\/db\/interviews\/([^/]+)\/answers$/);
  if (interviewAnswerMatch) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const interviewId = interviewAnswerMatch[1];

    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM interview_answers WHERE interview_id = ? AND user_id = ? ORDER BY created_at ASC`
      )
        .bind(interviewId, auth.user.id)
        .all();
      return { data: { success: true, answers: (results || []).map(mapRow) }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO interview_answers (id, interview_id, user_id, question_id, transcript, code, feedback, duration, data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          interviewId,
          auth.user.id,
          body.questionId || null,
          body.transcript || '',
          body.code || '',
          JSON.stringify(body.feedback || null),
          Number(body.duration) || 0,
          JSON.stringify(stripMeta(body))
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM interview_answers WHERE id = ?`).bind(id).first();
      return { data: { success: true, answer: mapRow(row) }, status: 201 };
    }
  }

  const interviewItem = path.match(/^\/v1\/db\/interviews\/([^/]+)$/);
  if (interviewItem) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const id = interviewItem[1];
    if (method === 'GET') {
      const row = await env.DB.prepare(`SELECT * FROM interviews WHERE id = ? AND user_id = ?`)
        .bind(id, auth.user.id)
        .first();
      if (!row) return { data: { error: 'Interview not found' }, status: 404 };
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, interview: mapped }, status: 200 };
    }
    if (method === 'PUT' || method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const existing = await env.DB.prepare(`SELECT * FROM interviews WHERE id = ? AND user_id = ?`)
        .bind(id, auth.user.id)
        .first();
      if (!existing) return { data: { error: 'Interview not found' }, status: 404 };
      const mergedDoc = { ...safeJsonParse(existing.data, {}), ...stripMeta(body) };
      await env.DB.prepare(
        `UPDATE interviews
         SET status = ?, overall_feedback = ?, completed_at = ?, next_status_suggestion = ?,
             data = ?, updated_at = datetime('now')
         WHERE id = ? AND user_id = ?`
      )
        .bind(
          body.status ?? existing.status,
          body.overallFeedback !== undefined ? JSON.stringify(body.overallFeedback) : existing.overall_feedback,
          body.completedAt ?? existing.completed_at,
          body.nextStatusSuggestion ?? existing.next_status_suggestion,
          JSON.stringify(mergedDoc),
          id,
          auth.user.id
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM interviews WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, interview: mapped }, status: 200 };
    }
  }

  if (path === '/v1/db/interviews') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM interviews WHERE user_id = ? ORDER BY created_at DESC`
      )
        .bind(auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, interviews: list }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO interviews (
           id, user_id, job_role, industry, difficulty, interview_type, language,
           status, questions, tracked_job_id, company_name, data
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          body.jobRole || '',
          body.industry || '',
          body.difficulty || 'mid',
          body.interviewType || 'behavioral',
          body.language || 'en',
          body.status || 'in_progress',
          JSON.stringify(body.questions || []),
          body.trackedJobId || null,
          body.companyName || '',
          JSON.stringify(stripMeta(body))
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM interviews WHERE id = ?`).bind(id).first();
      const mapped = mapRow(row);
      return { data: { success: true, data: mapped, interview: mapped }, status: 201 };
    }
  }

  // Notifications
  const notifRead = path.match(/^\/v1\/db\/notifications\/([^/]+)\/read$/);
  if (method === 'PATCH' && notifRead) {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    await env.DB.prepare(`UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?`)
      .bind(notifRead[1], auth.user.id)
      .run();
    return { data: { success: true }, status: 200 };
  }

  if (path === '/v1/db/notifications') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`
      )
        .bind(auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, notifications: list }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO notifications (id, user_id, type, title, body, link, read, data)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          body.type || 'info',
          body.title || '',
          body.body || '',
          body.link || '',
          body.read ? 1 : 0,
          JSON.stringify(stripMeta(body))
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM notifications WHERE id = ?`).bind(id).first();
      return { data: { success: true, notification: mapRow(row) }, status: 201 };
    }
  }

  // GitHub builds
  if (path === '/v1/db/github-builds') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM github_portfolio_builds WHERE user_id = ? ORDER BY created_at DESC`
      )
        .bind(auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, builds: list }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO github_portfolio_builds (id, user_id, username, template_slug, repos, data, is_public)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          body.username || '',
          body.templateSlug || '',
          JSON.stringify(body.repos || []),
          JSON.stringify(stripMeta(body)),
          body.isPublic ? 1 : 0
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM github_portfolio_builds WHERE id = ?`).bind(id).first();
      return { data: { success: true, build: mapRow(row) }, status: 201 };
    }
  }

  // Outreach records
  if (path === '/v1/db/outreach') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const { results } = await env.DB.prepare(
        `SELECT * FROM outreach_records WHERE user_id = ? ORDER BY created_at DESC`
      )
        .bind(auth.user.id)
        .all();
      const list = (results || []).map(mapRow);
      return { data: { success: true, data: list, outreach: list }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = body.id || crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO outreach_records (id, user_id, company_url, company_name, status, drafts, data)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          body.companyUrl || '',
          body.companyName || '',
          body.status || 'drafted',
          JSON.stringify(body.drafts || {}),
          JSON.stringify(stripMeta(body))
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM outreach_records WHERE id = ?`).bind(id).first();
      return { data: { success: true, outreach: mapRow(row) }, status: 201 };
    }
  }

  // User inputs
  if (path === '/v1/db/user-inputs') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    if (method === 'GET') {
      const row = await env.DB.prepare(
        `SELECT * FROM user_inputs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`
      )
        .bind(auth.user.id)
        .first();
      return { data: { success: true, data: mapRow(row) }, status: 200 };
    }
    if (method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const id = crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO user_inputs (id, user_id, name, job_role, experience_level, tech_skills, soft_skills, resume_url, resume_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          id,
          auth.user.id,
          body.name || '',
          body.jobRole || '',
          body.experienceLevel || 'Entry',
          JSON.stringify(body.techSkills || []),
          JSON.stringify(body.softSkills || []),
          body.resume || body.resumeUrl || '',
          body.resumeText || ''
        )
        .run();
      const row = await env.DB.prepare(`SELECT * FROM user_inputs WHERE id = ?`).bind(id).first();
      return { data: { success: true, data: mapRow(row) }, status: 201 };
    }
  }

  // Recruiter analysis
  if (path === '/v1/db/recruiter-analysis/leaderboard' && method === 'GET') {
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10) || 50, 100);
    const { results } = await env.DB.prepare(
      `SELECT * FROM recruiter_analysis ORDER BY match_percentage DESC LIMIT ?`
    )
      .bind(limit)
      .all();
    return { data: { success: true, data: (results || []).map(mapRow) }, status: 200 };
  }

  if (path === '/v1/db/recruiter-analysis' && method === 'POST') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const body = await request.json().catch(() => ({}));
    const id = crypto.randomUUID();
    const jobTitle = body.jobTitle || 'Software Developer';
    await env.DB.prepare(
      `INSERT INTO recruiter_analysis (id, user_id, username, email, resume_url, match_percentage, job_title, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(user_id, job_title) DO UPDATE SET
         username = excluded.username,
         email = excluded.email,
         resume_url = excluded.resume_url,
         match_percentage = excluded.match_percentage,
         updated_at = datetime('now')`
    )
      .bind(
        id,
        auth.user.id,
        body.username || auth.user.username || 'user',
        body.email || auth.user.email || '',
        body.resumeUrl || '',
        Math.round(Number(body.matchPercentage) || 0),
        jobTitle
      )
      .run();
    const row = await env.DB.prepare(`SELECT * FROM recruiter_analysis WHERE user_id = ? AND job_title = ?`)
      .bind(auth.user.id, jobTitle)
      .first();
    return { data: { success: true, data: mapRow(row) }, status: 200 };
  }

  // AI usage
  if (path === '/v1/db/ai-usage' && method === 'GET') {
    const { auth, error } = await requireAuth(request, env);
    if (error) return error;
    const { results } = await env.DB.prepare(
      `SELECT * FROM ai_usage WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`
    )
      .bind(auth.user.id)
      .all();
    return { data: { success: true, usage: results || [] }, status: 200 };
  }

  return null;
}

export async function handleD1Routes(request, env, url, path) {
  if (!path.startsWith('/v1/db/')) return null;

  return (
    (await handleProfiles(request, env, path)) ||
    (await handleResumes(request, env, url, path)) ||
    (await handleTrackedJobs(request, env, url, path)) ||
    (await handleAlertsAndListings(request, env, path)) ||
    (await handlePortfolios(request, env, url, path)) ||
    (await handleCareerTools(request, env, url, path)) ||
    (await handleExtendedTables(request, env, url, path))
  );
}
