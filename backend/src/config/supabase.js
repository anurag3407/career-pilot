import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && (serviceRoleKey || anonKey));

let supabaseAdminClient = null;
let supabaseClient = null;

if (isSupabaseConfigured) {
  const adminKey = serviceRoleKey || anonKey;
  supabaseAdminClient = createClient(supabaseUrl, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  supabaseClient = createClient(supabaseUrl, anonKey || adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  // Safe mock client so tests and local preview don't crash when env is not set
  const createMockQueryBuilder = () => ({
    select: () => createMockQueryBuilder(),
    insert: () => createMockQueryBuilder(),
    update: () => createMockQueryBuilder(),
    upsert: () => createMockQueryBuilder(),
    delete: () => createMockQueryBuilder(),
    eq: () => createMockQueryBuilder(),
    neq: () => createMockQueryBuilder(),
    gt: () => createMockQueryBuilder(),
    gte: () => createMockQueryBuilder(),
    lt: () => createMockQueryBuilder(),
    lte: () => createMockQueryBuilder(),
    order: () => createMockQueryBuilder(),
    limit: () => createMockQueryBuilder(),
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve) => Promise.resolve({ data: [], error: null }).then(resolve),
  });

  const dummy = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
      admin: {
        getUserById: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
        listUsers: async () => ({ data: { users: [] }, error: null }),
      },
    },
    from: () => createMockQueryBuilder(),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error('Supabase not configured') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };

  supabaseAdminClient = dummy;
  supabaseClient = dummy;
}

export const supabaseAdmin = supabaseAdminClient;
export const supabase = supabaseClient;

/**
 * Verifies Supabase connection health.
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase credentials not configured' };
  }
  try {
    const { error } = await supabaseAdmin.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export default supabaseAdmin;
