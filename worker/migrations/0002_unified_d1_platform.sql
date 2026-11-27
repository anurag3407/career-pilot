-- =============================================================================
-- CareerPilot — Unified Cloudflare D1 Schema (v2)
-- =============================================================================
-- Replaces Supabase Postgres completely. Designed for SQLite / Cloudflare D1:
--   * Preserves all existing rows in users, resumes, tracked_jobs, files,
--     ai_usage, and portfolios.
--   * Adds auth tables (auth_sessions, oauth_states), user profiles, and all
--     platform feature tables (versions, ATS history, roasts, cover letters,
--     job alerts, job listings, portfolio deployments, career profiles,
--     STAR stories, interviews, interview answers, github builds, outreach,
--     notifications, user settings, user inputs, recruiter analysis, community).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Extend users table for native D1 authentication
-- ---------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN username TEXT;
ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 1;
ALTER TABLE users ADD COLUMN auth_provider TEXT DEFAULT 'email';
ALTER TABLE users ADD COLUMN provider_id TEXT;
ALTER TABLE users ADD COLUMN last_login_at TEXT;
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Auth sessions (tracks active JWTs for logout / revocation)
CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_jti TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  revoked INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_jti ON auth_sessions(token_jti);

-- OAuth CSRF state store
CREATE TABLE IF NOT EXISTS oauth_states (
  state TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  redirect_to TEXT DEFAULT '/dashboard',
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- 2. Profiles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  username TEXT,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  job_role TEXT DEFAULT '',
  years_of_experience INTEGER DEFAULT 0,
  skills TEXT DEFAULT '[]',
  bio TEXT DEFAULT '',
  is_admin INTEGER DEFAULT 0,
  preferences TEXT DEFAULT '{"jobAlerts":true,"directMessages":true,"proposalUpdates":true}',
  github_username TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  headline TEXT DEFAULT '',
  location TEXT DEFAULT '',
  website TEXT DEFAULT '',
  plan TEXT DEFAULT 'free',
  is_pro INTEGER DEFAULT 0,
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ---------------------------------------------------------------------------
-- 3. Extend resumes + versions + ATS history + roasts + cover letters
-- ---------------------------------------------------------------------------
ALTER TABLE resumes ADD COLUMN target_role TEXT DEFAULT '';
ALTER TABLE resumes ADD COLUMN personal_info TEXT DEFAULT '{}';
ALTER TABLE resumes ADD COLUMN summary TEXT DEFAULT '';
ALTER TABLE resumes ADD COLUMN experience TEXT DEFAULT '[]';
ALTER TABLE resumes ADD COLUMN education TEXT DEFAULT '[]';
ALTER TABLE resumes ADD COLUMN skills TEXT DEFAULT '[]';
ALTER TABLE resumes ADD COLUMN projects TEXT DEFAULT '[]';
ALTER TABLE resumes ADD COLUMN certifications TEXT DEFAULT '[]';
ALTER TABLE resumes ADD COLUMN template TEXT DEFAULT 'classic';
ALTER TABLE resumes ADD COLUMN is_public INTEGER DEFAULT 0;
ALTER TABLE resumes ADD COLUMN share_token TEXT;
ALTER TABLE resumes ADD COLUMN source TEXT DEFAULT 'manual';
ALTER TABLE resumes ADD COLUMN data TEXT DEFAULT '{}';
CREATE UNIQUE INDEX IF NOT EXISTS idx_resumes_share_token ON resumes(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_resumes_updated ON resumes(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS resume_versions (
  id TEXT PRIMARY KEY,
  resume_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  version_label TEXT NOT NULL DEFAULT 'Snapshot',
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume ON resume_versions(resume_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_versions_user ON resume_versions(user_id);

CREATE TABLE IF NOT EXISTS resume_ats_history (
  id TEXT PRIMARY KEY,
  resume_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_resume_ats_resume ON resume_ats_history(resume_id, created_at DESC);

CREATE TABLE IF NOT EXISTS resume_roasts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  resume_text TEXT NOT NULL DEFAULT '',
  job_role TEXT DEFAULT '',
  roast TEXT NOT NULL DEFAULT '{}',
  is_public INTEGER DEFAULT 0,
  share_token TEXT UNIQUE,
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_resume_roasts_user ON resume_roasts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resume_roasts_share ON resume_roasts(share_token);

CREATE TABLE IF NOT EXISTS cover_letters (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  resume_id TEXT,
  job_title TEXT DEFAULT '',
  company TEXT DEFAULT '',
  tone TEXT DEFAULT 'professional',
  content TEXT NOT NULL DEFAULT '',
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cover_letters_user ON cover_letters(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 4. Extend tracked_jobs + job_listings + job_alerts
-- ---------------------------------------------------------------------------
ALTER TABLE tracked_jobs ADD COLUMN job_id TEXT;
ALTER TABLE tracked_jobs ADD COLUMN applied_date TEXT;
ALTER TABLE tracked_jobs ADD COLUMN position INTEGER;
ALTER TABLE tracked_jobs ADD COLUMN resume_id TEXT;
ALTER TABLE tracked_jobs ADD COLUMN resume_version_id TEXT;
ALTER TABLE tracked_jobs ADD COLUMN cover_letter_id TEXT;
ALTER TABLE tracked_jobs ADD COLUMN interview_id TEXT;
ALTER TABLE tracked_jobs ADD COLUMN applied_at TEXT;
ALTER TABLE tracked_jobs ADD COLUMN next_action_at TEXT;
ALTER TABLE tracked_jobs ADD COLUMN next_action_type TEXT;
ALTER TABLE tracked_jobs ADD COLUMN interview_at TEXT;
ALTER TABLE tracked_jobs ADD COLUMN last_activity_at TEXT;
ALTER TABLE tracked_jobs ADD COLUMN packet TEXT DEFAULT '{}';
ALTER TABLE tracked_jobs ADD COLUMN offer TEXT DEFAULT '{}';
ALTER TABLE tracked_jobs ADD COLUMN rejection TEXT DEFAULT '{}';
ALTER TABLE tracked_jobs ADD COLUMN data TEXT DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_tracked_jobs_user_updated ON tracked_jobs(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracked_jobs_user_job ON tracked_jobs(user_id, job_id);
CREATE INDEX IF NOT EXISTS idx_tracked_jobs_due ON tracked_jobs(user_id, next_action_at);

CREATE TABLE IF NOT EXISTS job_listings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT 'Remote',
  job_type TEXT DEFAULT 'Full-time',
  experience_level TEXT DEFAULT 'Mid',
  salary_min REAL,
  salary_max REAL,
  currency TEXT DEFAULT 'USD',
  description TEXT DEFAULT '',
  requirements TEXT DEFAULT '[]',
  skills TEXT DEFAULT '[]',
  source TEXT DEFAULT 'manual',
  apply_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS job_alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  keywords TEXT DEFAULT '[]',
  location TEXT DEFAULT '',
  experience_level TEXT DEFAULT '',
  min_salary REAL DEFAULT 0,
  frequency TEXT DEFAULT 'daily',
  is_active INTEGER DEFAULT 1,
  last_run_at TEXT,
  matched_count INTEGER DEFAULT 0,
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_job_alerts_user ON job_alerts(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 5. Portfolios & deployments
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  template_id TEXT DEFAULT 'default',
  title TEXT,
  sections_json TEXT,
  deployed_url TEXT,
  project_name TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
ALTER TABLE portfolios ADD COLUMN data TEXT DEFAULT '{}';
ALTER TABLE portfolios ADD COLUMN theme TEXT DEFAULT '{}';
ALTER TABLE portfolios ADD COLUMN is_public INTEGER DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN deploy_provider TEXT;
ALTER TABLE portfolios ADD COLUMN deployed_at TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_portfolios_user_slug ON portfolios(user_id, slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_user ON portfolios(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);

CREATE TABLE IF NOT EXISTS portfolio_deployments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  portfolio_id TEXT,
  provider TEXT NOT NULL DEFAULT 'cloudflare',
  url TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  logs TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_portfolio_deployments_user ON portfolio_deployments(user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 6. Career profiles + STAR stories
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS career_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  master_resume_id TEXT,
  master_resume_text TEXT NOT NULL DEFAULT '',
  target_roles TEXT NOT NULL DEFAULT '[]',
  weekly_apply_target INTEGER NOT NULL DEFAULT 5,
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_career_profiles_user ON career_profiles(user_id);

CREATE TABLE IF NOT EXISTS star_stories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  situation TEXT NOT NULL DEFAULT '',
  task TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT '',
  skills TEXT NOT NULL DEFAULT '[]',
  role_tags TEXT NOT NULL DEFAULT '[]',
  source TEXT NOT NULL DEFAULT 'manual',
  tracked_job_id TEXT,
  data TEXT NOT NULL DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_star_stories_user ON star_stories(user_id, updated_at DESC);

-- ---------------------------------------------------------------------------
-- 7. Interviews & answers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  job_role TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'mid',
  interview_type TEXT DEFAULT 'behavioral',
  language TEXT DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'in_progress',
  questions TEXT DEFAULT '[]',
  overall_feedback TEXT,
  tracked_job_id TEXT,
  next_status_suggestion TEXT,
  company_name TEXT DEFAULT '',
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_interviews_user ON interviews(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interviews_job ON interviews(tracked_job_id);

CREATE TABLE IF NOT EXISTS interview_answers (
  id TEXT PRIMARY KEY,
  interview_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  question_id TEXT,
  transcript TEXT DEFAULT '',
  code TEXT DEFAULT '',
  feedback TEXT,
  duration INTEGER DEFAULT 0,
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_interview_answers_session ON interview_answers(interview_id, created_at);

-- ---------------------------------------------------------------------------
-- 8. GitHub builds, outreach, notifications, settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS github_portfolio_builds (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL DEFAULT '',
  template_slug TEXT DEFAULT '',
  repos TEXT DEFAULT '[]',
  data TEXT DEFAULT '{}',
  is_public INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_gh_builds_user ON github_portfolio_builds(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS outreach_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company_url TEXT DEFAULT '',
  company_name TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'drafted',
  drafts TEXT DEFAULT '{}',
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_outreach_user ON outreach_records(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  title TEXT NOT NULL DEFAULT '',
  body TEXT DEFAULT '',
  link TEXT DEFAULT '',
  read INTEGER DEFAULT 0,
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  ai TEXT DEFAULT '{}',
  github TEXT DEFAULT '{}',
  notifications TEXT DEFAULT '{}',
  theme TEXT DEFAULT 'dark',
  data TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ---------------------------------------------------------------------------
-- 9. User inputs, recruiter analysis, community
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_inputs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT,
  job_role TEXT,
  experience_level TEXT DEFAULT 'Entry',
  tech_skills TEXT DEFAULT '[]',
  soft_skills TEXT DEFAULT '[]',
  resume_url TEXT,
  resume_text TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_user_inputs_user ON user_inputs(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS recruiter_analysis (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  resume_url TEXT,
  match_percentage INTEGER NOT NULL DEFAULT 0,
  job_title TEXT DEFAULT 'Software Developer',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_recruiter_user_job ON recruiter_analysis(user_id, job_title);

CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  author_name TEXT DEFAULT 'Anonymous',
  author_avatar TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  channel_id TEXT DEFAULT 'general',
  tags TEXT DEFAULT '[]',
  likes TEXT DEFAULT '[]',
  views TEXT DEFAULT '[]',
  comments_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT DEFAULT 'Anonymous',
  author_avatar TEXT,
  content TEXT NOT NULL,
  likes TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id, created_at);

-- ---------------------------------------------------------------------------
-- 10. Extend ai_usage telemetry
-- ---------------------------------------------------------------------------
ALTER TABLE ai_usage ADD COLUMN feature TEXT DEFAULT 'unknown';
ALTER TABLE ai_usage ADD COLUMN input_tokens INTEGER DEFAULT 0;
ALTER TABLE ai_usage ADD COLUMN output_tokens INTEGER DEFAULT 0;
ALTER TABLE ai_usage ADD COLUMN latency_ms INTEGER DEFAULT 0;
ALTER TABLE ai_usage ADD COLUMN byok INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON ai_usage(user_id, created_at DESC);
