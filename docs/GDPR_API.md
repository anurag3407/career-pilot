# GDPR API

> **Scope:** the optional Express backend (`backend/src/routes/gdpr.js`).
> Authentication uses the same **D1 bearer JWT** as the rest of the platform.
> A D1-native export/delete endpoint does not exist yet; the Worker data must be
> handled separately until one is added.

## Export User Data

```http
GET /api/gdpr/export
Authorization: Bearer <d1_jwt>
```

Returns `{ success: true, data: { exportedAt, ...collections } }` for the
authenticated user (`req.user.uid`).

Covered MongoDB models:

- `UserProfile`
- `Resume`
- `ResumeVersion`
- `ResumeAtsHistory`
- `Portfolio`
- `TrackedJob`
- `Interview`
- `JobAlert`
- `NotificationLog`
- `ProjectAnalysis`
- `RepoAnalysisHistory`
- `TokenUsage`
- `TwoFactor`

## Delete User Data

```http
DELETE /api/gdpr/delete
Authorization: Bearer <d1_jwt>
```

Deletes the same records for the authenticated user and returns a per-collection
summary. Authentication is required.

## D1 data (not covered by these endpoints yet)

Core data lives in D1 (`users`, `profiles`, `resumes`, `tracked_jobs`,
`portfolios`, `interviews`, `career_profiles`, `star_stories`, `ai_usage`, …).
An export/erase flow for D1 must be added to the gateway Worker
(`worker/src/db.js`) before the GDPR story is complete for Cloudflare-only
deployments. Until then, run both the Express endpoints and a D1 export/delete
for full coverage.

SQL reference for a manual erasure (run with `wrangler d1 execute`, user id
substituted):

```sql
DELETE FROM auth_sessions WHERE user_id = ?;
DELETE FROM resumes WHERE user_id = ?;
DELETE FROM resume_versions WHERE user_id = ?;
DELETE FROM resume_ats_history WHERE user_id = ?;
DELETE FROM resume_roasts WHERE user_id = ?;
DELETE FROM cover_letters WHERE user_id = ?;
DELETE FROM tracked_jobs WHERE user_id = ?;
DELETE FROM job_alerts WHERE user_id = ?;
DELETE FROM portfolios WHERE user_id = ?;
DELETE FROM portfolio_deployments WHERE user_id = ?;
DELETE FROM career_profiles WHERE user_id = ?;
DELETE FROM star_stories WHERE user_id = ?;
DELETE FROM interviews WHERE user_id = ?;
DELETE FROM interview_answers WHERE user_id = ?;
DELETE FROM github_portfolio_builds WHERE user_id = ?;
DELETE FROM outreach_records WHERE user_id = ?;
DELETE FROM notifications WHERE user_id = ?;
DELETE FROM user_settings WHERE user_id = ?;
DELETE FROM ai_usage WHERE user_id = ?;
DELETE FROM files WHERE user_id = ?;
DELETE FROM user_inputs WHERE user_id = ?;
DELETE FROM recruiter_analysis WHERE user_id = ?;
DELETE FROM community_posts WHERE author_id = ?;
DELETE FROM community_comments WHERE author_id = ?;
DELETE FROM profiles WHERE id = ?;
DELETE FROM users WHERE id = ?;
```
