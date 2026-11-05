import { supabaseAdmin, isSupabaseConfigured } from '../../config/supabase.js';
import User from '../../models/User.model.js';
import mongoose from 'mongoose';

export class UserRepository {
  /**
   * Finds user by primary ID (UUID or ObjectId)
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  static async findById(id) {
    if (!id) return null;

    // 1. Try Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) return data;
      } catch {
        // Fallback to Mongo
      }
    }

    // 2. Fallback to MongoDB
    if (mongoose.isValidObjectId(id)) {
      return await User.findById(id).lean();
    }
    return null;
  }

  /**
   * Finds user by email
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  static async findByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    // 1. Try Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (!error && data) return data;
      } catch {
        // Fallback
      }
    }

    // 2. Fallback to MongoDB
    return await User.findOne({ email: cleanEmail }).lean();
  }

  /**
   * Upserts / syncs user profile
   * @param {object} userData
   * @returns {Promise<object>}
   */
  static async upsert(userData) {
    const userId = userData.id || userData.uid;
    const email = userData.email?.toLowerCase().trim();

    // 1. Sync to Supabase
    let supaData = null;
    if (isSupabaseConfigured && userId) {
      try {
        const { data } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: userId,
            email,
            username: userData.username || userData.name || email?.split('@')[0],
            full_name: userData.name || userData.fullName,
            avatar_url: userData.picture || userData.avatar,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' })
          .select()
          .maybeSingle();

        supaData = data;
      } catch (err) {
        console.warn('Supabase profile upsert warning:', err.message);
      }
    }

    // 2. Sync to MongoDB if not existing
    try {
      let mongoUser = await User.findOne({ email });
      if (!mongoUser) {
        mongoUser = await User.create({
          email,
          username: userData.name || userData.username || email?.split('@')[0],
          password: 'external_auth_managed',
        });
      }
    } catch {
      // Ignore Mongo duplicate key or connection fallback
    }

    return supaData || userData;
  }
}

export default UserRepository;
