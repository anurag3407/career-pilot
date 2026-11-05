import { supabaseAdmin } from '../config/supabase.js';

/**
 * Saves or updates a user profile in Supabase.
 * @param {object} userData
 * @returns {Promise<object>}
 */
export const saveUserToSupabase = async (userData) => {
  if (!supabaseAdmin) return null;
  try {
    const userId = userData.id || userData.uid;
    if (!userId) return null;

    const payload = {
      id: userId,
      email: userData.email,
      username: userData.name || userData.username || userData.email?.split('@')[0],
      full_name: userData.name || userData.fullName,
      avatar_url: userData.picture || userData.avatar || userData.photoURL || null,
      updated_at: new Date().toISOString(),
    };

    if (userData.isAdmin !== undefined) {
      payload.is_admin = Boolean(userData.isAdmin);
    }
    if (userData.preferences) {
      payload.preferences = userData.preferences;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.error('❌ Supabase: Error saving user profile:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('❌ Supabase: Error in saveUserToSupabase:', error.message);
    return null;
  }
};

/**
 * Retrieves a user profile from Supabase by user ID or email.
 * @param {string} userIdOrEmail
 * @returns {Promise<object|null>}
 */
export const getUserFromSupabase = async (userIdOrEmail) => {
  if (!supabaseAdmin) return null;
  try {
    let query = supabaseAdmin.from('profiles').select('*');
    if (userIdOrEmail.includes('@')) {
      query = query.eq('email', userIdOrEmail.toLowerCase());
    } else {
      query = query.eq('id', userIdOrEmail);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error('❌ Supabase: Error fetching user:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('❌ Supabase: Error in getUserFromSupabase:', error.message);
    return null;
  }
};

/**
 * Saves or updates a job alert in Supabase.
 * @param {object} alertData
 * @returns {Promise<object|null>}
 */
export const saveJobAlertToSupabase = async (alertData) => {
  if (!supabaseAdmin) return null;
  try {
    const alertId = (alertData._id || alertData.id || `alert_${Date.now()}`).toString();
    const payload = {
      id: alertId,
      user_id: (alertData.userId || alertData.user_id || '').toString(),
      email: alertData.email || '',
      keywords: Array.isArray(alertData.keywords) ? alertData.keywords : [],
      location: alertData.location || '',
      experience_level: alertData.experienceLevel || alertData.experience_level || '',
      min_salary: alertData.minSalary || alertData.min_salary || 0,
      frequency: alertData.frequency || 'daily',
      is_active: alertData.isActive !== undefined ? Boolean(alertData.isActive) : true,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('job_alerts')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.error('❌ Supabase: Error saving job alert:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('❌ Supabase: Error in saveJobAlertToSupabase:', error.message);
    return null;
  }
};

/**
 * Deletes a job alert from Supabase.
 * @param {string} alertId
 * @returns {Promise<boolean>}
 */
export const deleteJobAlertFromSupabase = async (alertId) => {
  if (!supabaseAdmin) return false;
  try {
    const { error } = await supabaseAdmin
      .from('job_alerts')
      .delete()
      .eq('id', alertId.toString());

    if (error) {
      console.error('❌ Supabase: Error deleting job alert:', error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Supabase: Error in deleteJobAlertFromSupabase:', error.message);
    return false;
  }
};

/**
 * Fetches all job alerts for a specific user from Supabase.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export const getUserAlertsFromSupabase = async (userId) => {
  if (!supabaseAdmin) return [];
  try {
    const { data, error } = await supabaseAdmin
      .from('job_alerts')
      .select('*')
      .eq('user_id', userId.toString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase: Error getting user alerts:', error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('❌ Supabase: Error in getUserAlertsFromSupabase:', error.message);
    return [];
  }
};

/**
 * Saves a job listing to Supabase.
 * @param {object} jobData
 * @returns {Promise<object|null>}
 */
export const saveJobListingToSupabase = async (jobData) => {
  if (!supabaseAdmin) return null;
  try {
    const id = (jobData.id || jobData._id || `job_${Date.now()}`).toString();
    const payload = {
      id,
      title: jobData.title || 'Untitled Role',
      company: jobData.company || 'Unknown',
      location: jobData.location || 'Remote',
      job_type: jobData.jobType || jobData.type || 'Full-time',
      experience_level: jobData.experienceLevel || 'Mid',
      salary_min: jobData.salaryMin || jobData.salary_min || null,
      salary_max: jobData.salaryMax || jobData.salary_max || null,
      currency: jobData.currency || 'USD',
      description: jobData.description || '',
      requirements: Array.isArray(jobData.requirements) ? jobData.requirements : [],
      skills: Array.isArray(jobData.skills) ? jobData.skills : [],
      source: jobData.source || 'manual',
      apply_url: jobData.applyUrl || jobData.url || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('job_listings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.error('❌ Supabase: Error saving job listing:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('❌ Supabase: Error in saveJobListingToSupabase:', error.message);
    return null;
  }
};

/**
 * Saves tracked job to Supabase.
 * @param {object} jobData
 * @returns {Promise<object|null>}
 */
export const saveTrackedJobToSupabase = async (jobData) => {
  if (!supabaseAdmin) return null;
  try {
    const payload = {
      user_id: jobData.userId || jobData.user_id,
      job_id: jobData.jobId || jobData.job_id || null,
      title: jobData.title,
      company: jobData.company,
      status: jobData.status || 'saved',
      notes: jobData.notes || '',
      applied_date: jobData.appliedDate || null,
      updated_at: new Date().toISOString(),
    };

    if (jobData.id) {
      payload.id = jobData.id;
    }

    const { data, error } = await supabaseAdmin
      .from('tracked_jobs')
      .upsert(payload)
      .select()
      .maybeSingle();

    if (error) {
      console.error('❌ Supabase: Error saving tracked job:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('❌ Supabase: Error in saveTrackedJobToSupabase:', error.message);
    return null;
  }
};

/**
 * Saves user input profile data in Supabase.
 * @param {object} inputData
 * @returns {Promise<object|null>}
 */
export const saveUserInputsToSupabase = async (inputData) => {
  if (!supabaseAdmin) return null;
  try {
    const payload = {
      user_id: (inputData.userId || inputData.user_id || inputData.user || '').toString(),
      name: inputData.name || '',
      job_role: inputData.jobRole || '',
      experience_level: inputData.experienceLevel || 'Entry',
      tech_skills: inputData.techSkills || [],
      soft_skills: inputData.softSkills || [],
      resume_url: inputData.resume || inputData.resumeUrl || '',
      resume_text: inputData.resumeText || '',
    };

    const { data, error } = await supabaseAdmin
      .from('user_inputs')
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      console.error('❌ Supabase: Error saving user input:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('❌ Supabase: Error in saveUserInputsToSupabase:', error.message);
    return null;
  }
};

/**
 * Saves recruiter analysis to Supabase.
 * @param {object} analysisData
 * @returns {Promise<object|null>}
 */
export const saveRecruiterAnalysisToSupabase = async (analysisData) => {
  if (!supabaseAdmin) return null;
  try {
    const payload = {
      user_id: (analysisData.userId || analysisData.user_id).toString(),
      username: analysisData.username,
      email: analysisData.email,
      resume_url: analysisData.resumeUrl || '',
      match_percentage: Math.round(analysisData.matchPercentage || 0),
      job_title: analysisData.jobTitle || 'Software Developer',
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('recruiter_analysis')
      .upsert(payload, { onConflict: 'user_id,job_title' })
      .select()
      .maybeSingle();

    if (error) {
      console.error('❌ Supabase: Error saving recruiter analysis:', error.message);
      return null;
    }
    return data;
  } catch (error) {
    console.error('❌ Supabase: Error in saveRecruiterAnalysisToSupabase:', error.message);
    return null;
  }
};

/**
 * Fetches recruiter leaderboard from Supabase.
 * @param {number} [limit=50]
 * @returns {Promise<Array>}
 */
export const getRecruiterLeaderboardFromSupabase = async (limit = 50) => {
  if (!supabaseAdmin) return [];
  try {
    const { data, error } = await supabaseAdmin
      .from('recruiter_analysis')
      .select('*')
      .order('match_percentage', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Supabase: Error fetching recruiter leaderboard:', error.message);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('❌ Supabase: Error in getRecruiterLeaderboardFromSupabase:', error.message);
    return [];
  }
};

export default {
  saveUserToSupabase,
  getUserFromSupabase,
  saveJobAlertToSupabase,
  deleteJobAlertFromSupabase,
  getUserAlertsFromSupabase,
  saveJobListingToSupabase,
  saveTrackedJobToSupabase,
  saveUserInputsToSupabase,
  saveRecruiterAnalysisToSupabase,
  getRecruiterLeaderboardFromSupabase,
};
