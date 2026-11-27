import express from 'express';
import { z } from 'zod';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { validate } from '../middleware/validate.js';
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import TrackedJob from '../models/TrackedJob.model.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// POST /api/jobs/track — the browser extension's save endpoint.
//
// The board reads Supabase `tracked_jobs` directly, so this route writes the
// Supabase row first (source of truth) and mirrors to Mongo for REST parity.
// It accepts the extension's payload shape ({url, notes}) as well as the
// canonical one ({applyLink, notes[]}), and is idempotent per (userId, jobId).
// ---------------------------------------------------------------------------
const extensionTrackSchema = z.object({
  jobId: z.string().optional(),
  title: z.string({ required_error: 'title is required' }).min(1),
  company: z.string({ required_error: 'company is required' }).min(1),
  location: z.string().optional(),
  jobType: z.string().optional(),
  salary: z.string().nullish(),
  applyLink: z.string().url().nullish(),
  url: z.string().nullish(),
  description: z.string().nullish(),
  status: z.enum(['saved', 'applied', 'interviewing', 'offered', 'rejected']).optional(),
  notes: z.union([z.string(), z.array(z.any())]).optional(),
});

export function normalizeNotes(notes) {
  if (!notes) return [];
  if (Array.isArray(notes)) {
    return notes
      .map((n) => (typeof n === 'string' ? { content: n } : n))
      .filter((n) => n && typeof n.content === 'string' && n.content.trim())
      .map((n) => ({ content: n.content.trim(), createdAt: n.createdAt || new Date().toISOString() }));
  }
  const trimmed = notes.trim();
  return trimmed ? [{ content: trimmed, createdAt: new Date().toISOString() }] : [];
}

export function toSupabasePayload(userId, body, jobId) {
  const applyLink = body.applyLink || body.url || null;
  return {
    user_id: userId,
    job_id: jobId,
    title: body.title,
    company: body.company,
    location: body.location || 'Remote',
    salary: body.salary || '',
    job_url: applyLink,
    status: body.status || 'saved',
    notes: normalizeNotes(body.notes)[0]?.content || '',
    applied_date: body.status === 'applied' ? new Date().toISOString() : null,
    data: {
      description: body.description || '',
      jobType: body.jobType || 'Full-time',
      applyLink,
      notes: normalizeNotes(body.notes),
      source: 'extension',
    },
  };
}

router.post('/track', verifyToken, validate(extensionTrackSchema), asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const body = req.body;
  const jobId = body.jobId || `${body.company}::${body.title}`.toLowerCase().slice(0, 180);

  // Idempotent save — re-tracking the same listing returns the existing card
  // so the extension can always deep-link to its packet.
  let existing = null;
  if (isSupabaseConfigured) {
    const { data } = await supabaseAdmin
      .from('tracked_jobs')
      .select('*')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .maybeSingle();
    existing = data;
  }
  if (!existing) {
    existing = await TrackedJob.findOne({ userId, jobId }).lean().catch(() => null);
    if (existing && isSupabaseConfigured) {
      // Mongo-only row (pre-unification): surface it as its Mongo id.
      existing = { ...existing, id: existing._id?.toString?.() ?? existing._id };
    }
  }
  if (existing) {
    return res.json({
      success: true,
      alreadyTracked: true,
      data: { id: existing.id ?? existing._id?.toString?.(), ...existing, _id: undefined },
    });
  }

  // 1. Supabase — the board's source of truth.
  let saved = null;
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin
        .from('tracked_jobs')
        .insert(toSupabasePayload(userId, body, jobId))
        .select()
        .single();
      if (!error) saved = data;
      else console.warn('Supabase jobs/track insert warning:', error.message);
    } catch (err) {
      console.warn('Supabase jobs/track error:', err.message);
    }
  }

  // 2. Mongo parity (never fails the request — Supabase owns the board).
  const applyLink = body.applyLink || body.url || null;
  let mongoDoc = null;
  try {
    mongoDoc = await TrackedJob.create({
      userId,
      jobId,
      title: body.title,
      company: body.company,
      location: body.location || 'Remote',
      jobType: body.jobType || 'Full-time',
      salary: body.salary || null,
      applyLink,
      description: body.description || null,
      status: body.status || 'saved',
      notes: normalizeNotes(body.notes),
      lastActivityAt: new Date(),
    });
  } catch (err) {
    console.warn('Mongo jobs/track parity warning:', err.message);
  }

  if (!saved && !mongoDoc) {
    throw new ApiError(500, 'Could not save the job — no database accepted the write');
  }

  const id = saved?.id ?? mongoDoc?._id?.toString?.();
  const doc = saved
    ? { id: saved.id, ...saved }
    : {
      id,
      userId,
      jobId,
      title: body.title,
      company: body.company,
      location: body.location || 'Remote',
      salary: body.salary || null,
      applyLink,
      description: body.description || null,
      status: body.status || 'saved',
      notes: normalizeNotes(body.notes),
    };

  res.status(201).json({ success: true, alreadyTracked: false, data: doc });
}));

export default router;
