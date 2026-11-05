import { supabaseAdmin, isSupabaseConfigured } from '../../config/supabase.js';
import TrackedJob from '../../models/TrackedJob.model.js';

export class TrackedJobRepository {
  /**
   * Finds all tracked jobs for a user
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  static async findForUser(userId) {
    if (!userId) return [];

    // 1. Try Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('tracked_jobs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) return data;
      } catch {
        // Fallback
      }
    }

    // 2. Fallback to MongoDB
    return await TrackedJob.find({ user: userId }).sort({ createdAt: -1 }).lean();
  }

  /**
   * Saves a tracked job
   * @param {object} jobData
   * @returns {Promise<object>}
   */
  static async create(jobData) {
    const userId = jobData.userId || jobData.user;

    // 1. Save to Supabase
    let supaRecord = null;
    if (isSupabaseConfigured && userId) {
      try {
        const { data } = await supabaseAdmin
          .from('tracked_jobs')
          .insert({
            user_id: userId,
            job_id: jobData.jobId || null,
            title: jobData.title,
            company: jobData.company,
            status: jobData.status || 'saved',
            notes: jobData.notes || '',
            applied_date: jobData.appliedDate || null,
          })
          .select()
          .maybeSingle();

        supaRecord = data;
      } catch (err) {
        console.warn('Supabase tracked_jobs insert warning:', err.message);
      }
    }

    // 2. Save to MongoDB
    let mongoRecord = null;
    try {
      mongoRecord = await TrackedJob.create({
        user: userId,
        title: jobData.title,
        company: jobData.company,
        status: jobData.status || 'saved',
        notes: jobData.notes || '',
      });
    } catch {
      // Ignore Mongo fallback error
    }

    return supaRecord || mongoRecord || jobData;
  }

  /**
   * Updates job status
   * @param {string} id
   * @param {string} userId
   * @param {string} status
   * @returns {Promise<boolean>}
   */
  static async updateStatus(id, userId, status) {
    let success = false;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabaseAdmin
          .from('tracked_jobs')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('user_id', userId);

        if (!error) success = true;
      } catch {
        // Fallback
      }
    }

    try {
      await TrackedJob.findOneAndUpdate({ _id: id, user: userId }, { status });
      success = true;
    } catch {
      // Fallback
    }

    return success;
  }
}

export default TrackedJobRepository;
