# GDPR API

## Export User Data

GET /api/gdpr/export

Exports all personal data associated with the authenticated Firebase user.

Covered collections:

- UserProfile
- Resume
- ResumeVersion
- ResumeAtsHistory
- Portfolio
- TrackedJob
- Interview
- JobAlert
- NotificationLog
- ProjectAnalysis
- RepoAnalysisHistory
- TokenUsage
- TwoFactor

---

## Delete User Data

DELETE /api/gdpr/delete

Deletes all personal data associated with the authenticated Firebase user.

Authentication required.