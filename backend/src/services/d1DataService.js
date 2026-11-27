import { isD1RestConfigured, queryD1 } from '../config/d1.js';

export const getUserFromD1 = async (userIdOrEmail) => {
  if (!isD1RestConfigured || !userIdOrEmail) return null;
  try {
    const isEmail = userIdOrEmail.includes('@');
    const rows = await queryD1(
      isEmail
        ? `SELECT * FROM profiles WHERE email = ? LIMIT 1`
        : `SELECT * FROM profiles WHERE id = ? LIMIT 1`,
      [isEmail ? userIdOrEmail.toLowerCase() : userIdOrEmail]
    );
    return rows[0] || null;
  } catch (err) {
    console.warn('D1 getUserFromD1 warning:', err.message);
    return null;
  }
};

export const saveUserToD1 = async (userData) => {
  if (!isD1RestConfigured) return null;
  const userId = userData.id || userData.uid;
  if (!userId || !userData.email) return null;
  try {
    await queryD1(
      `INSERT INTO profiles (id, email, username, full_name, avatar_url, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         full_name = COALESCE(excluded.full_name, profiles.full_name),
         avatar_url = COALESCE(excluded.avatar_url, profiles.avatar_url),
         updated_at = datetime('now')`,
      [
        userId,
        userData.email.toLowerCase(),
        userData.name || userData.username || userData.email.split('@')[0],
        userData.name || userData.fullName || null,
        userData.picture || userData.avatar || userData.photoURL || null,
      ]
    );
    return getUserFromD1(userId);
  } catch (err) {
    console.warn('D1 saveUserToD1 warning:', err.message);
    return null;
  }
};

export const saveTrackedJobToD1 = async (jobData) => {
  if (!isD1RestConfigured) return null;
  const id = jobData.id || crypto.randomUUID();
  try {
    await queryD1(
      `INSERT INTO tracked_jobs (id, user_id, job_id, title, company, location, status, salary, job_url, notes, applied_date, data, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         status = excluded.status,
         notes = excluded.notes,
         updated_at = datetime('now')`,
      [
        id,
        jobData.userId || jobData.user_id,
        jobData.jobId || jobData.job_id || null,
        jobData.title,
        jobData.company,
        jobData.location || 'Remote',
        jobData.status || 'saved',
        jobData.salary || '',
        jobData.jobUrl || jobData.url || jobData.applyLink || '',
        typeof jobData.notes === 'string' ? jobData.notes : '',
        jobData.appliedDate || null,
        JSON.stringify(jobData.data || {}),
      ]
    );
    const rows = await queryD1(`SELECT * FROM tracked_jobs WHERE id = ? LIMIT 1`, [id]);
    return rows[0] || null;
  } catch (err) {
    console.warn('D1 saveTrackedJobToD1 warning:', err.message);
    return null;
  }
};

export default {
  getUserFromD1,
  saveUserToD1,
  saveTrackedJobToD1,
};
