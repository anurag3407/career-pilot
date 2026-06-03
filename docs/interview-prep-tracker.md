# Interview Preparation Tracker

## Overview

The **Interview Preparation Tracker** helps candidates structure daily interview prep across DSA, aptitude, CS subjects, and mock interviews. Data is stored in the browser via `localStorage` (no backend required).

## Access

- **Route:** `/interview-prep-tracker`
- **Hub:** Career Growth → **Interview Prep Tracker**

Related tools (separate features):

| Tool | Route | Purpose |
|------|-------|---------|
| AI Interview Prep | `/interview-prep` | Live mock interviews with AI scoring |
| Interview Analytics | `/dashboard/analytics` | Historical mock interview charts (API) |

## Features

- Daily preparation checklist (5 default tasks, reset per calendar day)
- Category session counters: DSA, Aptitude, CS Subjects, Mock Interviews
- Overall daily progress percentage
- Learning streak (current + best)
- Weekly summary (last 7 days)
- Completed vs pending task lists for today

## Storage

- **Key:** `careerpilot_interview_prep_tracker_v1`
- **Retention:** Day records older than 90 days are pruned on load
- **Schema version:** `1` (see `frontend/src/lib/interviewPrepTracker.js`)

## Development

```bash
cd frontend
npm run dev
```

Open `/interview-prep-tracker` while signed in.

## Testing

Run manual checks from the PR test plan. Optional lint:

```bash
cd frontend && npm run lint
```
