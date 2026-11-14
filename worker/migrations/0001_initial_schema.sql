-- =============================================================================
-- CareerPilot Cloudflare D1 Initial Schema
-- =============================================================================

-- 1. Users table (synced or independent)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 2. Resumes table (structured resume data with ImageKit PDF link)
CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  original_text TEXT NOT NULL,
  enhanced_text TEXT,
  job_role TEXT,
  ats_score REAL,
  pdf_url TEXT,
  preferences_json TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_resumes_user ON resumes(user_id);

-- 3. Tracked Jobs table (Job application tracker)
CREATE TABLE IF NOT EXISTS tracked_jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'saved',
  salary TEXT,
  job_url TEXT,
  notes TEXT,
  raw_data TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_tracked_jobs_user ON tracked_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_jobs_status ON tracked_jobs(status);

-- 4. Files Registry (ImageKit uploads tracking)
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  file_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT DEFAULT 'file',
  size INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_files_user ON files(user_id);

-- 5. AI Usage telemetry
CREATE TABLE IF NOT EXISTS ai_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  provider TEXT,
  model TEXT,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
