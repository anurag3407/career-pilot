-- CareerPilot Supabase Database Schema
-- Provides PostgreSQL schema for authentication profiles, resumes, job tracking, job listings, and community.

-- 1. Helper function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Profiles table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    job_role TEXT DEFAULT '',
    years_of_experience INTEGER DEFAULT 0,
    skills JSONB DEFAULT '[]'::JSONB,
    bio TEXT DEFAULT '',
    is_admin BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{"jobAlerts": true, "directMessages": true, "proposalUpdates": true}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Resume',
    target_role TEXT DEFAULT '',
    personal_info JSONB DEFAULT '{}'::JSONB,
    summary TEXT DEFAULT '',
    experience JSONB DEFAULT '[]'::JSONB,
    education JSONB DEFAULT '[]'::JSONB,
    skills JSONB DEFAULT '[]'::JSONB,
    projects JSONB DEFAULT '[]'::JSONB,
    certifications JSONB DEFAULT '[]'::JSONB,
    template TEXT DEFAULT 'classic',
    is_public BOOLEAN DEFAULT FALSE,
    share_token TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_resumes_updated_at
BEFORE UPDATE ON public.resumes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Job Listings table
CREATE TABLE IF NOT EXISTS public.job_listings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT DEFAULT 'Remote',
    job_type TEXT DEFAULT 'Full-time',
    experience_level TEXT DEFAULT 'Mid',
    salary_min NUMERIC,
    salary_max NUMERIC,
    currency TEXT DEFAULT 'USD',
    description TEXT DEFAULT '',
    requirements JSONB DEFAULT '[]'::JSONB,
    skills JSONB DEFAULT '[]'::JSONB,
    source TEXT DEFAULT 'manual',
    apply_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tracked Jobs table (Job Tracker Kanban)
CREATE TABLE IF NOT EXISTS public.tracked_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id TEXT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    status TEXT DEFAULT 'saved',
    notes TEXT DEFAULT '',
    applied_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Job Alerts table
CREATE TABLE IF NOT EXISTS public.job_alerts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    email TEXT NOT NULL,
    keywords JSONB DEFAULT '[]'::JSONB,
    location TEXT DEFAULT '',
    experience_level TEXT DEFAULT '',
    min_salary NUMERIC DEFAULT 0,
    frequency TEXT DEFAULT 'daily',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Community Posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
    id TEXT PRIMARY KEY,
    author_id TEXT NOT NULL,
    author_name TEXT DEFAULT 'Anonymous',
    author_avatar TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    channel_id TEXT DEFAULT 'general',
    tags JSONB DEFAULT '[]'::JSONB,
    likes JSONB DEFAULT '[]'::JSONB,
    views JSONB DEFAULT '[]'::JSONB,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Community Comments table
CREATE TABLE IF NOT EXISTS public.community_comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL,
    author_name TEXT DEFAULT 'Anonymous',
    author_avatar TEXT,
    content TEXT NOT NULL,
    likes JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. User Input (Profile Upload) table
CREATE TABLE IF NOT EXISTS public.user_inputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    name TEXT,
    job_role TEXT,
    experience_level TEXT DEFAULT 'Entry',
    tech_skills JSONB DEFAULT '[]'::JSONB,
    soft_skills JSONB DEFAULT '[]'::JSONB,
    resume_url TEXT,
    resume_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Recruiter Analysis table
CREATE TABLE IF NOT EXISTS public.recruiter_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    resume_url TEXT,
    match_percentage INTEGER NOT NULL DEFAULT 0,
    job_title TEXT DEFAULT 'Software Developer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_recruiter_user_job ON public.recruiter_analysis(user_id, job_title);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_analysis ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read profiles, users can update own profile
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Resumes: Users can read and mutate own resumes, public can read public resumes
CREATE POLICY "Users can read own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- Tracked Jobs: Users have full access to own tracked jobs
CREATE POLICY "Users can view own tracked jobs" ON public.tracked_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tracked jobs" ON public.tracked_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tracked jobs" ON public.tracked_jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tracked jobs" ON public.tracked_jobs FOR DELETE USING (auth.uid() = user_id);

-- Community: Authenticated users can read/write posts
CREATE POLICY "Anyone can read community posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authors can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid()::text = author_id);
CREATE POLICY "Authors can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid()::text = author_id);
