# Application Packets & the Weekly Loop

> Nov 2026. One job application owns the resume, the letter, the interview,
> and the follow-up. Migration: `supabase/migrations/20261115000000_application_packets.sql`.

## The problem this solves

Tracked jobs used to store title/company/status/notes. The resume, cover
letter, interview practice, and follow-ups lived on four different pages and
the user carried the context between them. The dashboard's "next move" was a
setup checklist; the extension saved a listing and stopped; nothing told the
user *when* to act.

## Data model (Supabase is the board's source of truth)

### `tracked_jobs` — new columns

| column | type | purpose |
|---|---|---|
| `resume_id` | UUID | source resume used by the packet |
| `resume_version_id` | UUID | tailored snapshot saved into `resume_versions` |
| `cover_letter_id` | UUID | row in `cover_letters` |
| `interview_id` | TEXT | mock-interview session id (backend Mongo id) |
| `applied_at` | TIMESTAMPTZ | when the user marked it applied |
| `next_action_at` / `next_action_type` | TIMESTAMPTZ / TEXT | the follow-up calendar entry (`follow_up`) |
| `interview_at` | TIMESTAMPTZ | scheduled real interview time (drives "interviews soon") |
| `last_activity_at` | TIMESTAMPTZ | quiet detection |
| `packet` | JSONB | `{ tailoredResumeText, coverLetter, questions[], followUpEmail, lastDebrief }` |
| `offer` | JSONB | `{ base, equity, location, deadline, notes, counterEmail }` |
| `rejection` | JSONB | `{ stage, reason, missingSkills[], gapAnalysis }` |

### New tables

- **`career_profiles`** — one row per user: `master_resume_id`,
  `master_resume_text`, `target_roles[]` (2–3), `weekly_apply_target`.
  Feeds the packet builder, interview prep, the composer, and the offer desk.
- **`star_stories`** — the STAR bank (`situation/task/action/result`, `skills`,
  `role_tags`, `source`: manual | rejection_debrief | interview_debrief).
- **`interviews`** — gained `tracked_job_id`, `next_status_suggestion`,
  `company_name`.

Mongo `TrackedJob` mirrors the packet fields for REST parity (the board reads
Supabase; the backend API stays usable).

## Flows

### 1. Application packet (one action on the card)
`ApplicationPacketPanel` (`frontend/src/components/packet/`) chains four
existing endpoints and writes the results back to the card:
`enhance/tailor` → `cover-letter/generate-text` → `interview/preview-questions`
→ `enhance/generate-email` (`emailType: follow_up`). Also snapshots the
tailored resume into `resume_versions` and the letter into `cover_letters`.
"Mark applied" stamps `applied_at` and schedules the day-7 follow-up.

### 2. Follow-up calendar ("due today")
`frontend/src/utils/applicationFlow.js` defines due on plain card fields:
- **due follow-ups**: `next_action_at <= end of today`
- **interviews soon**: `interview_at` within 48h
- **gone quiet**: no `next_action_at` and no activity for 14 days
- **weekly target**: `applied_at` in the current ISO week vs
  `career_profiles.weekly_apply_target`

Rendered by `Dashboard` → `components/dashboard/DueToday.jsx` and repeated as
badges on tracker cards.

### 3. Career profile
`/career-profile` (`frontend/src/pages/CareerProfile.jsx`): master resume,
target roles, weekly target, STAR bank CRUD. REST mirror:
`GET/PUT /api/career-profile` (used by the extension).

### 4. Interviews belong to a job
`/mock-interview/practice?job=<id>` preloads the card's description and
tailored resume. On completion, `completeInterview` writes the debrief to the
card: a note ("Mock interview debrief — score X/100. Suggested next step:
mark as applied."), `interview_id`, and `packet.lastDebrief`.

### 5. Extension = the apply moment
`POST /api/jobs/track` (new — the extension previously hit a missing endpoint
and 404'd) writes the Supabase row first, Mongo for parity, and is idempotent
per `(userId, jobId)`. The popup now scores the listing against the master
profile (`GET /api/career-profile` + keyword overlap) and offers
"Save & build the packet →" which deep-links to `/job-tracker?job=<id>&packet=1`.

### 6. Outcomes
- **Offered** → offer desk (`OfferDeskPanel` drawer on the card + `/offer-desk`
  page bound via `?job=`): base/equity/location/deadline + counter-email
  drafted from the salary estimator (`emailType: negotiate`).
- **Rejected** → debrief modal (stage, reason, missing skills, optional
  skill-gap run) → `tracked_jobs.rejection`, a `star_stories` entry, and the
  "Rejection learnings" panel on `/skill-gap`.
- **Analytics** (`/dashboard/analytics`): per-resume-version funnel
  (applied/interviews/offers/rejected), gone-quiet companies, weekly target.

## Folded tools

- **Message Composer** — `/email-generator` and `/outreach` are now one page
  (`MessageComposerPage` → `components/MessageComposer.jsx`) with four
  templates: first note, follow-up, thank-you, negotiate. The backend
  `generate-email` endpoint gained `emailType` + `context` instead of
  prompting per page. The job card's old Draft Email / Outreach buttons are a
  single "Message" button that opens the composer pre-bound to the job.
- **Company research** — the card's Research button passes the stored
  description (`jobDescription`) so research is role-aware; the Jobs hub card
  now points at the board instead of re-opening search.
- **Navigation** — email generator + cold outreach became one item; GitHub
  dashboard/portfolio/README/visualizer collapsed into one "GitHub Suite"
  entry (routes unchanged).

## What was intentionally paused

New portfolio themes, mobile app, recruiter portal, pair-programming rooms,
scraper marketplace, realtime co-editing — none of them appear in the weekly
loop (packets Monday, send Tuesday, practice Wednesday, debrief Thursday,
review Friday).
