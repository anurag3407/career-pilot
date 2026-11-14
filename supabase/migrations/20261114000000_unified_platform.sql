-- =============================================================================
-- CareerPilot — Unified Platform Schema (v2)
-- =============================================================================
-- One database for every tool in the platform. This migration is IDEMPOTENT:
-- it can be applied to a fresh Supabase project or on top of
-- 20261105000000_init_supabase.sql without conflicts.
--
-- Design contract for tool tables:
--   * indexed columns for filtering/sorting (user_id, status, timestamps…)
--   * a `data JSONB` column that stores the tool's full document verbatim,
--     so the frontend keeps working with the exact field names it uses today.
--   * Row Level Security on every user-owned table (auth.uid()).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach updated_at trigger to a table if it does not exist yet.
CREATE OR REPLACE FUNCTION ensure_updated_at_trigger(target_table TEXT)
RETURNS VOID AS $$
DECLARE
    trigger_name TEXT := 'update_' || target_table || '_updated_at';
BEGIN
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', trigger_name, target_table);
    EXECUTE format(
        'CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
        trigger_name, target_table
    );
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Profiles (extends v1 — safe additions only)
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_username TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS headline TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::JSONB;

-- ---------------------------------------------------------------------------
-- 2. Resumes — harden v1 table with extra columns the app writes
-- ---------------------------------------------------------------------------
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::JSONB;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS job_role TEXT DEFAULT '';
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS enhanced_text TEXT DEFAULT '';
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS ats_score INTEGER;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
CALL ensure_updated_at_trigger('resumes');

-- ---------------------------------------------------------------------------
-- 3. Tracked jobs — extra columns used by the tracker UI
-- ---------------------------------------------------------------------------
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::JSONB;
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS salary TEXT DEFAULT '';
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS job_url TEXT DEFAULT '';
ALTER TABLE public.tracked_jobs ADD COLUMN IF NOT EXISTS position INTEGER;
CALL ensure_updated_at_trigger('tracked_jobs');
CREATE INDEX IF NOT EXISTS idx_tracked_jobs_user ON public.tracked_jobs(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracked_jobs_status ON public.tracked_jobs(user_id, status);

-- ---------------------------------------------------------------------------
-- 4. Job alerts — v1 used TEXT ids; add UUID-compatible columns + history
--    (v1 shape kept for compatibility; new rows use generated UUID text ids)
-- ---------------------------------------------------------------------------
ALTER TABLE public.job_alerts ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::JSONB;
ALTER TABLE public.job_alerts ADD COLUMN IF NOT EXISTS last_run_at TIMESTAMPTZ;
ALTER TABLE public.job_alerts ADD COLUMN IF NOT EXISTS matched_count INTEGER DEFAULT 0;
CALL ensure_updated_at_trigger('job_alerts');
CREATE INDEX IF NOT EXISTS idx_job_alerts_user ON public.job_alerts(user_id);

-- ---------------------------------------------------------------------------
-- 5. Portfolios (Portfolio Studio)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'My Portfolio',
    slug TEXT NOT NULL,
    template_id TEXT DEFAULT 'vercel_deploy',
    data JSONB NOT NULL DEFAULT '{}'::JSONB,
    theme JSONB DEFAULT '{}'::JSONB,
    is_public BOOLEAN DEFAULT FALSE,
    deploy_provider TEXT,
    deploy_url TEXT,
    deployed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, slug)
);
CALL ensure_updated_at_trigger('portfolios');
CREATE INDEX IF NOT EXISTS idx_portfolios_user ON public.portfolios(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios(slug);

CREATE TABLE IF NOT EXISTS public.portfolio_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'cloudflare',
    url TEXT,
    status TEXT NOT NULL DEFAULT 'success',
    logs JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_portfolio_deployments_user ON public.portfolio_deployments(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 6. Resume versions + ATS history
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resume_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    version_label TEXT NOT NULL DEFAULT 'Snapshot',
    data JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume ON public.resume_versions(resume_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.resume_ats_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_resume_ats_resume ON public.resume_ats_history(resume_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 7. Resume roasts (shareable AI critiques)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resume_roasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_text TEXT NOT NULL DEFAULT '',
    job_role TEXT DEFAULT '',
    roast JSONB NOT NULL DEFAULT '{}'::JSONB,
    is_public BOOLEAN DEFAULT FALSE,
    share_token TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CALL ensure_updated_at_trigger('resume_roasts');
CREATE INDEX IF NOT EXISTS idx_resume_roasts_user ON public.resume_roasts(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 8. Cover letters
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    job_title TEXT DEFAULT '',
    company TEXT DEFAULT '',
    tone TEXT DEFAULT 'professional',
    content TEXT NOT NULL DEFAULT '',
    data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user ON public.cover_letters(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 9. Interviews (mock interview sessions + answers)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_role TEXT DEFAULT '',
    industry TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'mid',
    interview_type TEXT DEFAULT 'behavioral',
    language TEXT DEFAULT 'en',
    status TEXT NOT NULL DEFAULT 'in_progress',
    questions JSONB DEFAULT '[]'::JSONB,
    overall_feedback JSONB,
    data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CALL ensure_updated_at_trigger('interviews');
CREATE INDEX IF NOT EXISTS idx_interviews_user ON public.interviews(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT,
    transcript TEXT DEFAULT '',
    code TEXT DEFAULT '',
    feedback JSONB,
    duration INTEGER DEFAULT 0,
    data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_interview_answers_session ON public.interview_answers(interview_id, created_at);

-- ---------------------------------------------------------------------------
-- 10. GitHub portfolio builds
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.github_portfolio_builds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL DEFAULT '',
    template_slug TEXT DEFAULT '',
    repos JSONB DEFAULT '[]'::JSONB,
    data JSONB DEFAULT '{}'::JSONB,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gh_builds_user ON public.github_portfolio_builds(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 11. Outreach records
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.outreach_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_url TEXT DEFAULT '',
    company_name TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'drafted',
    drafts JSONB DEFAULT '{}'::JSONB,
    data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CALL ensure_updated_at_trigger('outreach_records');
CREATE INDEX IF NOT EXISTS idx_outreach_user ON public.outreach_records(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 12. AI usage ledger (written by the AI-gateway Worker via service role)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    feature TEXT NOT NULL DEFAULT 'unknown',
    provider TEXT NOT NULL DEFAULT '',
    model TEXT NOT NULL DEFAULT '',
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    latency_ms INTEGER DEFAULT 0,
    byok BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 13. Notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'info',
    title TEXT NOT NULL DEFAULT '',
    body TEXT DEFAULT '',
    link TEXT DEFAULT '',
    read BOOLEAN DEFAULT FALSE,
    data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 14. User settings (non-secret preferences; AI keys stay client-side only)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    ai JSONB DEFAULT '{}'::JSONB,
    github JSONB DEFAULT '{}'::JSONB,
    notifications JSONB DEFAULT '{}'::JSONB,
    theme TEXT DEFAULT 'dark',
    data JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CALL ensure_updated_at_trigger('user_settings');

-- ---------------------------------------------------------------------------
-- 15. Fix v1 tables that had RLS enabled but zero policies
-- ---------------------------------------------------------------------------
DO $$ BEGIN
    CREATE POLICY "Users can view own job alerts" ON public.job_alerts
        FOR SELECT USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN invalid_text_representation THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own job alerts" ON public.job_alerts
        FOR INSERT WITH CHECK (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN invalid_text_representation THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update own job alerts" ON public.job_alerts
        FOR UPDATE USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN invalid_text_representation THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete own job alerts" ON public.job_alerts
        FOR DELETE USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN invalid_text_representation THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view own user inputs" ON public.user_inputs
        FOR SELECT USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN invalid_text_representation THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert own user inputs" ON public.user_inputs
        FOR INSERT WITH CHECK (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN invalid_text_representation THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can delete own user inputs" ON public.user_inputs
        FOR DELETE USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN invalid_text_representation THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view own recruiter analysis" ON public.recruiter_analysis
        FOR SELECT USING (auth.uid()::text = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; WHEN invalid_text_representation THEN NULL; END $$;

-- Community comments: read all, write own
DO $$ BEGIN
    CREATE POLICY "Anyone can read community comments" ON public.community_comments
        FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Authenticated users can create comments" ON public.community_comments
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Authors can update own comments" ON public.community_comments
        FOR UPDATE USING (auth.uid()::text = author_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Authors can delete own comments" ON public.community_comments
        FOR DELETE USING (auth.uid()::text = author_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Job listings: world-readable, service-role writable (fetched by worker)
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
    CREATE POLICY "Anyone can read job listings" ON public.job_listings
        FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 16. RLS enablement + policies for every v2 table
-- ---------------------------------------------------------------------------
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_ats_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_roasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_portfolio_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Generic owner-only CRUD policy helper
CREATE OR REPLACE FUNCTION ensure_owner_policies(target_table TEXT, owner_col TEXT DEFAULT 'user_id')
RETURNS VOID AS $$
BEGIN
    EXECUTE format($f$
        DO $$ BEGIN
            CREATE POLICY "Owner can select" ON public.%I FOR SELECT USING (auth.uid() = %I);
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    $f$, target_table, owner_col);
    EXECUTE format($f$
        DO $$ BEGIN
            CREATE POLICY "Owner can insert" ON public.%I FOR INSERT WITH CHECK (auth.uid() = %I);
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    $f$, target_table, owner_col);
    EXECUTE format($f$
        DO $$ BEGIN
            CREATE POLICY "Owner can update" ON public.%I FOR UPDATE USING (auth.uid() = %I);
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    $f$, target_table, owner_col);
    EXECUTE format($f$
        DO $$ BEGIN
            CREATE POLICY "Owner can delete" ON public.%I FOR DELETE USING (auth.uid() = %I);
        EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    $f$, target_table, owner_col);
END;
$$ LANGUAGE plpgsql;

CALL ensure_owner_policies('portfolios');
CALL ensure_owner_policies('portfolio_deployments');
CALL ensure_owner_policies('resume_versions');
CALL ensure_owner_policies('resume_ats_history');
CALL ensure_owner_policies('resume_roasts');
CALL ensure_owner_policies('cover_letters');
CALL ensure_owner_policies('interviews');
CALL ensure_owner_policies('interview_answers');
CALL ensure_owner_policies('github_portfolio_builds');
CALL ensure_owner_policies('outreach_records');
CALL ensure_owner_policies('notifications');
CALL ensure_owner_policies('user_settings', 'user_id');

-- Roasts: public roasts are readable by anyone (share links)
DO $$ BEGIN
    CREATE POLICY "Public roasts are viewable by everyone" ON public.resume_roasts
        FOR SELECT USING (is_public = true OR auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Portfolios: public portfolios readable by anyone
DO $$ BEGIN
    CREATE POLICY "Public portfolios are viewable by everyone" ON public.portfolios
        FOR SELECT USING (is_public = true OR auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ai_usage: users can read their own usage; inserts happen via service role only
DO $$ BEGIN
    CREATE POLICY "Users can view own AI usage" ON public.ai_usage
        FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 17. Realtime (community + notifications)
-- ---------------------------------------------------------------------------
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.community_comments REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL; END $$;

-- ---------------------------------------------------------------------------
-- 18. Storage buckets + policies
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Avatars: public read, owner write under their own uid folder
DO $$ BEGIN
    CREATE POLICY "Public avatars are readable" ON storage.objects
        FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Users upload own avatar" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Users update own avatar" ON storage.objects
        FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE POLICY "Users delete own avatar" ON storage.objects
        FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Resumes: owner-only under their own uid folder
DO $$ BEGIN
    CREATE POLICY "Users manage own resume files" ON storage.objects
        FOR ALL USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1])
        WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- End of unified platform schema.
