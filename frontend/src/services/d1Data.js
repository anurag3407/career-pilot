// =============================================================================
// d1Data.js — the unified Cloudflare D1 data layer
// =============================================================================
// Drop-in replacement for supabaseData.js. Every core tool reads and writes
// directly to Cloudflare D1 via the CareerPilot Worker gateway (/gateway/v1).
// =============================================================================

import { d1Auth, d1Fetch } from '../config/d1';

// ---------------------------------------------------------------------------
// Auth / Profile
// ---------------------------------------------------------------------------
export const authData = {
  async getProfile() {
    const res = await d1Fetch('/auth/me', { method: 'GET', requireAuth: true });
    return {
      success: true,
      user: res.user || null,
      profile: res.profile || null,
    };
  },

  async verifyToken() {
    await d1Fetch('/auth/verify', { method: 'POST', requireAuth: true });
    return { success: true };
  },
};

export const profileData = {
  async getMyProfile() {
    return d1Fetch('/db/profiles/me', { method: 'GET', requireAuth: true });
  },

  async getProfile(uid) {
    return d1Fetch(`/db/profiles/${encodeURIComponent(uid)}`, { method: 'GET', requireAuth: true });
  },

  async updateMyProfile(payload) {
    return d1Fetch('/db/profiles/me', { method: 'PUT', body: payload, requireAuth: true });
  },

  async setMyAvatar(avatarUrl) {
    return d1Fetch('/db/profiles/me/avatar', {
      method: 'POST',
      body: { avatarUrl },
      requireAuth: true,
    });
  },

  async deleteMyAvatar() {
    return d1Fetch('/db/profiles/me/avatar', { method: 'DELETE', requireAuth: true });
  },

  async getMyStats() {
    return d1Fetch('/db/profiles/me/stats', { method: 'GET', requireAuth: true });
  },

  async getStats(uid) {
    return d1Fetch(`/db/profiles/${encodeURIComponent(uid)}/stats`, {
      method: 'GET',
      requireAuth: true,
    });
  },

  async getMyActivity() {
    return d1Fetch('/db/profiles/me/activity', { method: 'GET', requireAuth: true });
  },

  async getActivity(uid) {
    return d1Fetch(`/db/profiles/${encodeURIComponent(uid)}/activity`, {
      method: 'GET',
      requireAuth: true,
    });
  },
};

// ---------------------------------------------------------------------------
// Resumes
// ---------------------------------------------------------------------------
export const resumeData = {
  async getAll() {
    return d1Fetch('/db/resumes', { method: 'GET', requireAuth: true });
  },

  async getById(resumeId) {
    return d1Fetch(`/db/resumes/${encodeURIComponent(resumeId)}`, {
      method: 'GET',
      requireAuth: true,
    });
  },

  async getByShareToken(shareToken) {
    return d1Fetch(`/db/resumes/share/${encodeURIComponent(shareToken)}`, { method: 'GET' });
  },

  async create(payload, options = {}) {
    return d1Fetch('/db/resumes', {
      method: 'POST',
      body: payload,
      requireAuth: true,
      signal: options?.signal,
    });
  },

  async update(resumeId, payload) {
    return d1Fetch(`/db/resumes/${encodeURIComponent(resumeId)}`, {
      method: 'PUT',
      body: payload,
      requireAuth: true,
    });
  },

  async delete(resumeId) {
    return d1Fetch(`/db/resumes/${encodeURIComponent(resumeId)}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};

// ---------------------------------------------------------------------------
// Resume versions + ATS history
// ---------------------------------------------------------------------------
export const resumeVersionData = {
  async getAll(resumeId) {
    return d1Fetch(`/db/resumes/${encodeURIComponent(resumeId)}/versions`, {
      method: 'GET',
      requireAuth: true,
    });
  },

  async create(resumeId, payload) {
    return d1Fetch(`/db/resumes/${encodeURIComponent(resumeId)}/versions`, {
      method: 'POST',
      body: payload,
      requireAuth: true,
    });
  },

  async update(resumeId, versionId, payload) {
    return d1Fetch(
      `/db/resumes/${encodeURIComponent(resumeId)}/versions/${encodeURIComponent(versionId)}`,
      { method: 'PUT', body: payload, requireAuth: true }
    );
  },

  async remove(resumeId, versionId) {
    return d1Fetch(
      `/db/resumes/${encodeURIComponent(resumeId)}/versions/${encodeURIComponent(versionId)}`,
      { method: 'DELETE', requireAuth: true }
    );
  },

  async restore(resumeId, versionId) {
    return d1Fetch(
      `/db/resumes/${encodeURIComponent(resumeId)}/versions/${encodeURIComponent(versionId)}/restore`,
      { method: 'POST', requireAuth: true }
    );
  },
};

export const resumeAtsData = {
  async get(resumeId) {
    return d1Fetch(`/db/resumes/${encodeURIComponent(resumeId)}/ats-history`, {
      method: 'GET',
      requireAuth: true,
    });
  },

  async log(resumeId, payload = {}) {
    return d1Fetch(`/db/resumes/${encodeURIComponent(resumeId)}/ats-history`, {
      method: 'POST',
      body: payload,
      requireAuth: true,
    });
  },
};

// ---------------------------------------------------------------------------
// Job tracker
// ---------------------------------------------------------------------------
export const trackerData = {
  async getAll() {
    return d1Fetch('/db/jobs', { method: 'GET', requireAuth: true });
  },

  async track(jobData) {
    return d1Fetch('/db/jobs', { method: 'POST', body: jobData, requireAuth: true });
  },

  async updateStatus(jobId, status, notes = '') {
    return d1Fetch(`/db/jobs/${encodeURIComponent(jobId)}/status`, {
      method: 'PATCH',
      body: { status, notes },
      requireAuth: true,
    });
  },

  async update(jobId, payload) {
    return d1Fetch(`/db/jobs/${encodeURIComponent(jobId)}`, {
      method: 'PUT',
      body: payload,
      requireAuth: true,
    });
  },

  async delete(jobId) {
    return d1Fetch(`/db/jobs/${encodeURIComponent(jobId)}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  async getStats() {
    const { trackedJobs = [] } = await trackerData.getAll();
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
export const alertData = {
  async getAll() {
    return d1Fetch('/db/alerts', { method: 'GET', requireAuth: true });
  },

  async getById(alertId) {
    return d1Fetch(`/db/alerts/${encodeURIComponent(alertId)}`, {
      method: 'GET',
      requireAuth: true,
    });
  },

  async create(alertPayload) {
    const { data: sessionData } = await d1Auth.getSession();
    const email = alertPayload.email || sessionData?.session?.user?.email || '';
    return d1Fetch('/db/alerts', {
      method: 'POST',
      body: { ...alertPayload, email },
      requireAuth: true,
    });
  },

  async update(alertId, payload) {
    return d1Fetch(`/db/alerts/${encodeURIComponent(alertId)}`, {
      method: 'PUT',
      body: payload,
      requireAuth: true,
    });
  },

  async delete(alertId) {
    return d1Fetch(`/db/alerts/${encodeURIComponent(alertId)}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  async toggle(alertId) {
    return d1Fetch(`/db/alerts/${encodeURIComponent(alertId)}/toggle`, {
      method: 'POST',
      requireAuth: true,
    });
  },

  async getStats() {
    const { alerts = [] } = await alertData.getAll();
    const active = alerts.filter((a) => a.isActive ?? a.is_active ?? true).length;
    return {
      success: true,
      stats: {
        total: alerts.length,
        totalAlerts: alerts.length,
        active,
        activeAlerts: active,
        paused: alerts.length - active,
        totalJobsFound: alerts.reduce((sum, a) => sum + (Number(a.matched_count || a.totalJobsFound) || 0), 0),
        totalEmailsSent: 0,
      },
    };
  },
};

// ---------------------------------------------------------------------------
// Portfolios
// ---------------------------------------------------------------------------
export const portfolioData = {
  async getAll() {
    return d1Fetch('/db/portfolios', { method: 'GET', requireAuth: true });
  },

  async getById(portfolioId) {
    return d1Fetch(`/db/portfolios/${encodeURIComponent(portfolioId)}`, {
      method: 'GET',
      requireAuth: true,
    });
  },

  async getBySlug(slug) {
    return d1Fetch(`/db/portfolios?slug=${encodeURIComponent(slug)}`, { method: 'GET' });
  },

  async create(payload) {
    return d1Fetch('/db/portfolios', { method: 'POST', body: payload, requireAuth: true });
  },

  async update(portfolioId, payload) {
    return d1Fetch(`/db/portfolios/${encodeURIComponent(portfolioId)}`, {
      method: 'PUT',
      body: payload,
      requireAuth: true,
    });
  },

  async delete(portfolioId) {
    return d1Fetch(`/db/portfolios/${encodeURIComponent(portfolioId)}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  async recordDeployment(portfolioId, { provider, url, status = 'success', logs = [] }) {
    return d1Fetch('/db/portfolio-deployments', {
      method: 'POST',
      body: { portfolioId, provider, url, status, logs },
      requireAuth: true,
    });
  },

  async listDeployments() {
    return d1Fetch('/db/portfolio-deployments', { method: 'GET', requireAuth: true });
  },
};

// ---------------------------------------------------------------------------
// Resume Roasts
// ---------------------------------------------------------------------------
export const roastData = {
  async getHistory(limit = 20) {
    return d1Fetch(`/db/roasts?limit=${encodeURIComponent(limit)}`, {
      method: 'GET',
      requireAuth: true,
    });
  },

  async getById(id) {
    return d1Fetch(`/db/roasts/${encodeURIComponent(id)}`, { method: 'GET', requireAuth: true });
  },

  async getByShareToken(token) {
    return d1Fetch(`/db/roasts/share/${encodeURIComponent(token)}`, { method: 'GET' });
  },

  async save(payload) {
    return d1Fetch('/db/roasts', { method: 'POST', body: payload, requireAuth: true });
  },

  async remove(id) {
    return d1Fetch(`/db/roasts/${encodeURIComponent(id)}`, { method: 'DELETE', requireAuth: true });
  },
};

// ---------------------------------------------------------------------------
// User Settings & Notification Preferences
// ---------------------------------------------------------------------------
export const settingsData = {
  async get() {
    return d1Fetch('/db/settings', { method: 'GET', requireAuth: true });
  },

  async update(payload) {
    return d1Fetch('/db/settings', { method: 'PUT', body: payload, requireAuth: true });
  },

  async getNotificationPreferences() {
    const res = await d1Fetch('/db/settings', { method: 'GET', requireAuth: true });
    const prefs = res?.settings?.notifications || {
      jobAlerts: true,
      directMessages: true,
      proposalUpdates: true,
    };
    return {
      success: true,
      preferences: {
        jobAlerts: prefs.jobAlerts ?? true,
        directMessages: prefs.directMessages ?? true,
        proposalUpdates: prefs.proposalUpdates ?? true,
      },
    };
  },

  async updateNotificationPreferences(preferences) {
    await d1Fetch('/db/settings', {
      method: 'PUT',
      body: { notifications: preferences },
      requireAuth: true,
    });
    return { success: true, preferences, message: 'Preferences updated!' };
  },
};

// ---------------------------------------------------------------------------
// Career profile
// ---------------------------------------------------------------------------
export const careerProfileData = {
  async get() {
    return d1Fetch('/db/career-profile', { method: 'GET', requireAuth: true });
  },

  async update(payload) {
    return d1Fetch('/db/career-profile', { method: 'PUT', body: payload, requireAuth: true });
  },
};

// ---------------------------------------------------------------------------
// STAR story bank
// ---------------------------------------------------------------------------
export const starStoriesData = {
  async getAll() {
    return d1Fetch('/db/star-stories', { method: 'GET', requireAuth: true });
  },

  async create(payload) {
    return d1Fetch('/db/star-stories', { method: 'POST', body: payload, requireAuth: true });
  },

  async update(storyId, payload) {
    return d1Fetch(`/db/star-stories/${encodeURIComponent(storyId)}`, {
      method: 'PUT',
      body: payload,
      requireAuth: true,
    });
  },

  async delete(storyId) {
    return d1Fetch(`/db/star-stories/${encodeURIComponent(storyId)}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};

// ---------------------------------------------------------------------------
// Cover letters
// ---------------------------------------------------------------------------
export const coverLetterData = {
  async getAll() {
    return d1Fetch('/db/cover-letters', { method: 'GET', requireAuth: true });
  },

  async create(payload) {
    return d1Fetch('/db/cover-letters', { method: 'POST', body: payload, requireAuth: true });
  },
};

// ---------------------------------------------------------------------------
// Interviews & Notifications
// ---------------------------------------------------------------------------
export const interviewData = {
  async getAll() {
    return d1Fetch('/db/interviews', { method: 'GET', requireAuth: true });
  },

  async getById(id) {
    return d1Fetch(`/db/interviews/${encodeURIComponent(id)}`, { method: 'GET', requireAuth: true });
  },

  async create(payload) {
    return d1Fetch('/db/interviews', { method: 'POST', body: payload, requireAuth: true });
  },

  async update(id, payload) {
    return d1Fetch(`/db/interviews/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: payload,
      requireAuth: true,
    });
  },

  async addAnswer(id, payload) {
    return d1Fetch(`/db/interviews/${encodeURIComponent(id)}/answers`, {
      method: 'POST',
      body: payload,
      requireAuth: true,
    });
  },
};

export const notificationData = {
  async getAll() {
    return d1Fetch('/db/notifications', { method: 'GET', requireAuth: true });
  },

  async create(payload) {
    return d1Fetch('/db/notifications', { method: 'POST', body: payload, requireAuth: true });
  },

  async markRead(id) {
    return d1Fetch(`/db/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
      requireAuth: true,
    });
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
  careerProfileData,
  starStoriesData,
  coverLetterData,
  interviewData,
  notificationData,
};
