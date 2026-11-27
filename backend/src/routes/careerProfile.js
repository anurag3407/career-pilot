import express from 'express';
import { z } from 'zod';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { validate } from '../middleware/validate.js';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// Career profile — one master resume, target roles, and weekly apply target
// that feed tailoring, mock interviews, LinkedIn rewrites, and outreach.
// Stored in Supabase `career_profiles` (one row per user, service-role writes
// from this route; the web app also reads/writes it client-side via RLS).
// ---------------------------------------------------------------------------

const careerProfileSchema = z.object({
  masterResumeId: z.string().uuid().nullish(),
  masterResumeText: z.string().max(100000).optional(),
  targetRoles: z.array(z.string().max(160)).max(5).optional(),
  weeklyApplyTarget: z.number().int().min(0).max(200).optional(),
  data: z.record(z.any()).optional(),
});

function mapProfile(row) {
  if (!row) return null;
  const doc = row.data || {};
  return {
    id: row.id,
    masterResumeId: row.master_resume_id || doc.masterResumeId || null,
    masterResumeText: row.master_resume_text ?? doc.masterResumeText ?? '',
    targetRoles: row.target_roles || doc.targetRoles || [],
    weeklyApplyTarget: row.weekly_apply_target ?? doc.weeklyApplyTarget ?? 5,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get('/', verifyToken, asyncHandler(async (req, res) => {
  if (!isSupabaseConfigured) throw new ApiError(503, 'Career profile storage is not configured');

  const { data, error } = await supabaseAdmin
    .from('career_profiles')
    .select('*')
    .eq('user_id', req.user.uid)
    .maybeSingle();
  if (error) throw new ApiError(500, error.message);

  res.json({ success: true, data: mapProfile(data), profile: mapProfile(data) });
}));

router.put('/', verifyToken, validate(careerProfileSchema), asyncHandler(async (req, res) => {
  if (!isSupabaseConfigured) throw new ApiError(503, 'Career profile storage is not configured');

  const body = req.body;
  const { data: existing } = await supabaseAdmin
    .from('career_profiles')
    .select('*')
    .eq('user_id', req.user.uid)
    .maybeSingle();

  const payload = {
    user_id: req.user.uid,
    data: { ...(existing?.data || {}), ...(body.data || {}) },
  };
  if (body.masterResumeId !== undefined) payload.master_resume_id = body.masterResumeId || null;
  if (body.masterResumeText !== undefined) payload.master_resume_text = body.masterResumeText;
  if (body.targetRoles !== undefined) payload.target_roles = body.targetRoles;
  if (body.weeklyApplyTarget !== undefined) payload.weekly_apply_target = body.weeklyApplyTarget;

  const { data, error } = await supabaseAdmin
    .from('career_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();
  if (error) throw new ApiError(500, error.message);

  res.json({ success: true, data: mapProfile(data), profile: mapProfile(data) });
}));

export default router;
