-- =============================================================================
-- CareerPilot — Application Packets & Career Profile (v3)
-- =============================================================================
-- One job application owns the resume, the letter, the interview, and the
-- follow-up. This migration is IDEMPOTENT and follows the v2 design contract:
-- indexed columns for filtering, a `data JSONB` verbatim document, and RLS.
--
--  1. tracked_jobs — packet ownership + follow-up calendar columns
--  2. career_profiles — one master resume, target roles, weekly apply target
--  3. star_stories — the STAR story bank fed by wins and rejection debriefs
--  4. interviews — link a mock interview back to the tracked job it served
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Tracked jobs — the application packet + follow-up calendar
--    resume_version_id / cover_letter_id reference Supabase UUID rows created
--    by the packet builder; interview_id holds the mock-interview session id
--    (TEXT — interview sessions are created by the backend and use opaque ids).
-- ---------------------------------------------------------------------------
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS resume_id UUID;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS resume_version_id UUID;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS cover_letter_id UUID;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS interview_id TEXT;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS applied_at TIMESTAMPTZ;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS next_action_at TIMESTAMPTZ;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS next_action_type TEXT;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS interview_at TIMESTAMPTZ;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS packet JSONB NOT NULL DEFAULT '{}'::JSONB;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS offer JSONB NOT NULL DEFAULT '{}'::JSONB;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS rejection JSONB NOT NULL DEFAULT '{}'::JSONB;

-- Backfill activity/applied timestamps from v1 columns where present.
UPDATE public.tracked_jobs
SET applied_at = COALESCE(applied_at, applied_date),
    last_activity_at = COALESCE(last_activity_at, updated_at, created_at)
WHERE applied_at IS NULL OR last_activity_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_tracked_jobs_due ON public.tracked_jobs(user_id, next_action_at);
CREATE INDEX IF NOT EXISTS idx_tracked_jobs_applied ON public.tracked_jobs(user_id, status, applied_at);
CREATE INDEX IF NOT EXISTS idx_tracked_jobs_activity ON public.tracked_jobs(user_id, last_activity_at);

-- ---------------------------------------------------------------------------
-- 2. Career profile — one master resume + target roles feeding every tool
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    master_resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    master_resume_text TEXT NOT NULL DEFAULT '',
    target_roles JSONB NOT NULL DEFAULT '[]'::JSONB,
    weekly_apply_target INTEGER NOT NULL DEFAULT 5,
    data JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CALL ensure_updated_at_trigger('career_profiles');
CREATE UNIQUE INDEX IF NOT EXISTS idx_career_profiles_user ON public.career_profiles(user_id);

-- ---------------------------------------------------------------------------
-- 3. STAR story bank — feeds interviews, tailoring, outreach, and the
--    skill-gap view. `source` records where a story came from
--    ('manual' | 'rejection_debrief' | 'interview_debrief').
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.star_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT '',
    situation TEXT NOT NULL DEFAULT '',
    task TEXT NOT NULL DEFAULT '',
    action TEXT NOT NULL DEFAULT '',
    result TEXT NOT NULL DEFAULT '',
    skills JSONB NOT NULL DEFAULT '[]'::JSONB,
    role_tags JSONB NOT NULL DEFAULT '[]'::JSONB,
    source TEXT NOT NULL DEFAULT 'manual',
    tracked_job_id UUID,
    data JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CALL ensure_updated_at_trigger('star_stories');
CREATE INDEX IF NOT EXISTS idx_star_stories_user ON public.star_stories(user_id, updated_at DESC);

-- ---------------------------------------------------------------------------
-- 4. Interviews — belong to a job; debrief can suggest the next status
-- ---------------------------------------------------------------------------
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS tracked_job_id UUID;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS next_status_suggestion TEXT;
ALTER TABLE public.interviews ADD COLUMN IF NOT EXISTS company_name TEXT DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_interviews_job ON public.interviews(tracked_job_id);

-- ---------------------------------------------------------------------------
-- 5. Row Level Security (owner-only) on the new tables
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['career_profiles', 'star_stories']
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "Owner can select" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Owner can select" ON public.%I FOR SELECT USING (auth.uid() = user_id)', t);
        EXECUTE format('DROP POLICY IF EXISTS "Owner can insert" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Owner can insert" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t);
        EXECUTE format('DROP POLICY IF EXISTS "Owner can update" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Owner can update" ON public.%I FOR UPDATE USING (auth.uid() = user_id)', t);
        EXECUTE format('DROP POLICY IF EXISTS "Owner can delete" ON public.%I', t);
        EXECUTE format('CREATE POLICY "Owner can delete" ON public.%I FOR DELETE USING (auth.uid() = user_id)', t);
    END LOOP;
END $$;
