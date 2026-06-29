# Database Schema Documentation

This document provides a comprehensive, production-quality guide to the database schema of Career Pilot. The application utilizes a hybrid database architecture:
1. **MongoDB (via Mongoose ODM)**: Stores core user credentials, progressive profiles, resume details, ATS history, job tracking boards, micro-internship challenges and proposals, mock interview sessions, portfolio structures, token usage audits, and notification logs.
2. **Firebase Firestore**: Stores real-time community channels, posts, comments, direct messages, and chat history.

---

## Part 1: MongoDB / Mongoose Collections

All MongoDB model schemas are defined in `backend/src/models/`. Mongoose automatically lowercase-pluralizes model registrations (e.g., model `User` maps to collection `users`).

### Category A: User & Authentication

---

#### 1. User Collection (`users`)
* **Purpose**: Stores core credentials, basic progressive profile info, and user notification preferences.
* **Collection Name**: `users`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `username` | String | Yes | *None* | Trimmed, maximum 50 characters. |
| `email` | String | Yes | *None* | Unique, lowercase, trimmed, validated via regex format. |
| `password` | String | No | `null` | Hashed password. Excluded from default queries (`select: false`). |
| `requiresPasswordReset` | Boolean | No | `false` | Signals if the user must reset their password on next login. |
| `linkedinId` | String | No | `null` | Sparse unique index mapping for LinkedIn OAuth. |
| `jobRole` | String | No | `""` | Progressive profile field representing target job title. |
| `gender` | String | No | `""` | Progressive profile field. |
| `yearsOfExperience` | Number | No | `0` | Progressive profile field. Min value `0`. |
| `collegeStudent` | Boolean | No | `false` | Flag indicating if user is currently a student. |
| `skills` | Array [String] | No | `[]` | List of skills matching progressive profile configuration. |
| `notificationPreferences` | Object | No | *See below* | User notification preferences config block. |
| `notificationPreferences.jobAlerts` | Boolean | No | `true` | Receive email updates for matched job alerts. |
| `notificationPreferences.directMessages` | Boolean | No | `true` | Receive alerts for direct messages. |
| `notificationPreferences.proposalUpdates` | Boolean | No | `true` | Receive alerts when proposal status changes. |
| `createdAt` | Date | Yes | *Auto* | Timestamp created automatically by Mongoose. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp modified automatically by Mongoose. |

##### Validation Rules
* `email` must match: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
* Password is automatically hashed using `bcrypt` (12 rounds) inside a pre-save hook, with guards to prevent double-hashing (checks prefix `/^\$2[ab]\$/`).
* Password comparator is a constant-time check (`comparePassword`) to protect against timing-based user enumeration attacks.

##### Relationships
* Referenced by: `UserProfile` (via matching `uid` string corresponding to Firebase UID).
* Referenced by: `Resume` (`userId` string field).
* Referenced by: `TrackedJob` (`userId` string field).
* Referenced by: `JobAlert` (`userId` string field).

##### Indexes
* `{ email: 1 }` (Unique, Background)
* `{ jobRole: 1 }` (Background)
* `{ collegeStudent: 1 }` (Background)
* `{ jobRole: 1, yearsOfExperience: 1 }` (Background)
* `{ skills: 1 }` (Background)
* `{ linkedinId: 1 }` (Sparse, Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31ab",
  "username": "johndoe",
  "email": "johndoe@example.com",
  "requiresPasswordReset": false,
  "linkedinId": null,
  "jobRole": "Software Engineer",
  "gender": "Male",
  "yearsOfExperience": 3,
  "collegeStudent": false,
  "skills": ["JavaScript", "Node.js", "React"],
  "notificationPreferences": {
    "jobAlerts": true,
    "directMessages": true,
    "proposalUpdates": true
  },
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:30:00.000Z"
}
```

##### Usage Notes
* Authenticating via Firebase writes custom credentials into MongoDB. The default query select behavior for passwords protects sensitive data leaks at the API routing layer.

---

#### 2. UserProfile Collection (`userprofiles`)
* **Purpose**: Maintains secondary social information, synced portfolio projects, and manual configurations.
* **Collection Name**: `userprofiles`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `uid` | String | Yes | *None* | Unique key corresponding to Firebase UID / User ID. |
| `displayName` | String | No | `""` | Maximum 100 characters, trimmed. |
| `bio` | String | No | `""` | Maximum 500 characters, trimmed. |
| `jobRole` | String | No | `""` | Maximum 100 characters, trimmed. |
| `skills` | Array [String] | No | `[]` | Individual skills, max 50 characters each, trimmed. |
| `location` | String | No | `""` | Maximum 100 characters, trimmed. |
| `website` | String | No | `""` | Maximum 200 characters, trimmed. |
| `github` | String | No | `""` | Github profile path, max 100 characters, trimmed. |
| `linkedin` | String | No | `""` | LinkedIn profile path, max 200 characters, trimmed. |
| `projects` | Array [Object] | No | `[]` | List of imported projects. |
| `projects[i].githubRepoUrl` | String | No | *None* | Repository link. |
| `projects[i].isManuallyEdited`| Boolean | No | `false` | Indicates if user modified AI-generated fields. |
| `projects[i].lastSyncedAt` | Date | No | *None* | Datetime of last GitHub sync. |
| `projects[i].autoData` | Object | No | *None* | Extracted repository metadata. |
| `projects[i].autoData.description`| String| No | `""` | Extracted or AI-generated description. |
| `projects[i].autoData.readme` | String | No | `""` | Extracted repository README string. |
| `createdAt` | Date | Yes | *Auto* | Timestamp created automatically by Mongoose. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp modified automatically by Mongoose. |

##### Relationships
* Maps to `User` collection via custom `uid` string matching User's Firebase identifier.

##### Indexes
* `{ uid: 1 }` (Unique, Background)
* `{ uid: 1, updatedAt: -1 }` (Background)
* `{ jobRole: 1 }` (Background)
* `{ location: 1 }` (Background)
* `{ skills: 1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31ac",
  "uid": "user_fb_uid_12345",
  "displayName": "John Doe",
  "bio": "Full stack engineer specializing in developer tooling.",
  "jobRole": "Software Developer",
  "skills": ["React", "Express", "MongoDB"],
  "location": "San Francisco, CA",
  "website": "https://johndoe.dev",
  "github": "johndoe",
  "linkedin": "https://linkedin.com/in/johndoe",
  "projects": [
    {
      "githubRepoUrl": "https://github.com/johndoe/my-express-app",
      "isManuallyEdited": false,
      "lastSyncedAt": "2026-05-28T12:00:00.000Z",
      "autoData": {
        "description": "An express app starter template.",
        "readme": "# Express Starter\nTemplate for quickly spinning up backends."
      }
    }
  ],
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:30:00.000Z"
}
```

---

#### 3. TwoFactor Collection (`twofactors`)
* **Purpose**: Persists 2FA secrets and recovery keys.
* **Collection Name**: `twofactors`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `uid` | String | Yes | *None* | Unique string identifying the User (Firebase UID). |
| `secret` | String | No | `null` | Encrypted TOTP secret. Excluded from default queries (`select: false`). |
| `enabled` | Boolean | No | `false` | True if two-factor authorization is active for the account. |
| `backupCodes` | Array [String] | No | `[]` | Array of hashed fallback code values (`select: false`). |
| `createdAt` | Date | Yes | *Auto* | Timestamp created automatically by Mongoose. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp modified automatically by Mongoose. |

##### Indexes
* `{ uid: 1 }` (Unique, Background)
* `{ uid: 1, enabled: 1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31c0",
  "uid": "user_fb_uid_12345",
  "enabled": true,
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:05:00.000Z"
}
```

---

### Category B: Resumes & ATS Analytics

---

#### 4. Resume Collection (`resumes`)
* **Purpose**: Holds parsed, enhanced, and customizable metadata of a user's resume.
* **Collection Name**: `resumes`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | String | Yes | *None* | Firebase UID of the resume owner. |
| `originalText` | String | Yes | *None* | Raw resume content parsed from source. |
| `enhancedText` | String | No | `null` | AI-optimized resume content. |
| `jobRole` | String | No | `null` | Intended job title mapping. |
| `atsScore` | Number | No | `null` | Most recently calculated ATS score. |
| `preferences` | Object | No | *See below* | Target optimization settings. |
| `preferences.yearsOfExperience`| Number| No| `0` | Desired experience level. |
| `preferences.skills` | Array [String]|No| `[]` | Selected target keywords. |
| `preferences.industry` | String | No | `""` | Target domain. |
| `preferences.customInstructions`| String | No | `""` | Explicit directions for the LLM. |
| `title` | String | No | *Dynamic* | Default title generator: `"Resume - YYYY-MM-DD"`. |
| `pdfUrl` | String | No | `null` | Storage URL for compiled PDF export. |
| `createdAt` | Date | Yes | *Auto* | Datetime of document creation. |
| `lastModified` | Date | Yes | *Auto* | Custom timestamp matching `updatedAt` changes. |

##### Custom Timestamp Mapping
* Schema overrides default Mongoose updatedAt field name: `timestamps: { createdAt: 'createdAt', updatedAt: 'lastModified' }`

##### Relationships
* Belongs to: `User` (via matching `userId`).
* Referenced by: `ResumeVersion` (`resumeId` ref 'Resume').
* Referenced by: `ResumeAtsHistory` (`resumeId` ref 'Resume').

##### Indexes
* `{ userId: 1, createdAt: -1 }` (Background)
* `{ originalText: "text", enhancedText: "text" }` (Background Text Search Index)
* `{ userId: 1, jobRole: 1 }` (Background)
* `{ userId: 1, lastModified: -1 }` (Background)
* `{ userId: 1, atsScore: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31ad",
  "userId": "user_fb_uid_12345",
  "originalText": "John Doe Resume...\nExperience:\n- Software Engineer at Google",
  "enhancedText": "# John Doe\n\n## Experience\n- **Software Engineer** | Google...",
  "jobRole": "Software Engineer",
  "atsScore": 85,
  "preferences": {
    "yearsOfExperience": 3,
    "skills": ["Node.js", "MongoDB", "Systems Architecture"],
    "industry": "Tech",
    "customInstructions": "Make experience section more quantitative."
  },
  "title": "Resume - 2026-05-28",
  "pdfUrl": "https://storage.googleapis.com/resumes/fb_12345_pdf.pdf",
  "createdAt": "2026-05-28T12:00:00.000Z",
  "lastModified": "2026-05-28T12:10:00.000Z"
}
```

---

#### 5. ResumeVersion Collection (`resumeversions`)
* **Purpose**: Records immutable drafts representing a chronological audit trail of changes.
* **Collection Name**: `resumeversions`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `resumeId` | ObjectId | Yes | *None* | Mongoose ObjectId reference to parent `Resume`. |
| `userId` | String | Yes | *None* | Firebase UID of the owner. |
| `versionNumber` | Number | Yes | *None* | Incremental sequence identifier. |
| `title` | String | No | `""` | Version metadata title label (e.g. `"v1 - LinkedIn Import"`). |
| `originalText` | String | Yes | *None* | Historical original snapshot. |
| `enhancedText` | String | No | `null` | Historical enhanced snapshot. |
| `jobRole` | String | No | `null` | Target job title at the time of creation. |
| `atsScore` | Number | No | `null` | ATS Score snapshot. |
| `tags` | Array [String] | No | `[]` | Descriptive labels (e.g. `['linkedin-import']`, `['initial-draft']`). |
| `metadata` | Mixed | No | `{}` | Custom payload (e.g. `{ source: 'editor' }`). |
| `createdAt` | Date | Yes | *Auto* | Timestamp created automatically by Mongoose. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp modified automatically by Mongoose. |

##### Indexes
* `{ resumeId: 1, versionNumber: 1 }` (Unique, Background)
* `{ userId: 1, createdAt: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31ae",
  "resumeId": "603d21c9b3a5b3a4f89d31ad",
  "userId": "user_fb_uid_12345",
  "versionNumber": 1,
  "title": "v1 - Initial Draft",
  "originalText": "John Doe Resume...\nExperience:\n- Software Engineer at Google",
  "enhancedText": null,
  "jobRole": "Software Engineer",
  "atsScore": null,
  "tags": ["initial-draft"],
  "metadata": {
    "source": "editor"
  },
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 6. ResumeAtsHistory Collection (`resumeatshistories`)
* **Purpose**: Records the historical metrics breakdown of ATS checks, supporting trajectory chart features.
* **Collection Name**: `resumeatshistories`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `resumeId` | ObjectId | Yes | *None* | Mongoose ObjectId reference to parent `Resume`. |
| `userId` | String | Yes | *None* | Firebase UID. |
| `jobRole` | String | Yes | *None* | Job role target title. |
| `atsScore` | Number | Yes | *None* | Aggregated final score calculated. |
| `scoreBreakdown` | Object | No | *See below* | Numeric values representing criteria weights. |
| `scoreBreakdown.keywordMatch` | Number | No | `0` | Target keywords density match score. |
| `scoreBreakdown.formatting` | Number | No | `0` | Compliance layout analysis score. |
| `scoreBreakdown.experienceRelevance` | Number | No | `0` | Relevance score of job descriptions. |
| `scoreBreakdown.skillsAlignment` | Number | No | `0` | Core competencies matching index. |
| `scoreBreakdown.educationMatch` | Number | No | `0` | Relevance score of education background. |
| `scoreBreakdown.summary` | Number | No | `0` | Score for summary quality. |
| `scoreBreakdown.skills` | Number | No | `0` | Additional skills metric. |
| `scoreBreakdown.experience` | Number | No | `0` | Additional experience duration score. |
| `scoreBreakdown.education` | Number | No | `0` | Secondary education metric. |
| `scoreBreakdown.projects` | Number | No | `0` | Portfolio projects score. |
| `missingKeywords` | Array [String] | No | `[]` | Target job keywords not found in resume content. |
| `improvementsCount` | Number | No | `0` | Count of suggestions returned by LLM analyzer. |
| `createdAt` | Date | Yes | *Auto* | Generation timestamp. |

##### Custom Timestamp Mapping
* Schema disables Mongoose `updatedAt` updates: `timestamps: { createdAt: 'createdAt', updatedAt: false }`

##### Indexes
* `{ resumeId: 1, createdAt: 1 }` (Background)
* `{ userId: 1, createdAt: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31af",
  "resumeId": "603d21c9b3a5b3a4f89d31ad",
  "userId": "user_fb_uid_12345",
  "jobRole": "Software Engineer",
  "atsScore": 82,
  "scoreBreakdown": {
    "keywordMatch": 85,
    "formatting": 90,
    "experienceRelevance": 78,
    "skillsAlignment": 85,
    "educationMatch": 88,
    "summary": 80,
    "skills": 85,
    "experience": 78,
    "education": 88,
    "projects": 79
  },
  "missingKeywords": ["Kubernetes", "gRPC", "CI/CD"],
  "improvementsCount": 3,
  "createdAt": "2026-05-28T12:00:00.000Z"
}
```

---

### Category C: Job Search, Tracking & Alerting

---

#### 7. TrackedJob Collection (`trackedjobs`)
* **Purpose**: Manages the candidates' self-reported CRM pipeline (Kanban status representation).
* **Collection Name**: `trackedjobs`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | String | Yes | *None* | Firebase UID of the job seeker. |
| `jobId` | String | Yes | *None* | Unique target ID from the scraped/listing system. |
| `title` | String | Yes | *None* | Job title, trimmed. |
| `company` | String | Yes | *None* | Company name, trimmed. |
| `location` | String | No | `"Remote"` | Job location. |
| `jobType` | String | No | `"Full-time"` | E.g. `"Full-time"`, `"Part-time"`, `"Contract"`. |
| `salary` | String | No | `null` | Compensation text details. |
| `applyLink` | String | No | `null` | Application url. |
| `description` | String | No | `null` | Job description detail text. |
| `status` | String | No | `"saved"` | Current pipeline state. Must match Enum. |
| `notes` | Array [Object] | No | `[]` | User-submitted updates. |
| `notes[i].content` | String | Yes | *None* | Note body. |
| `notes[i].createdAt` | Date | Yes | `Date.now` | Creation timestamp. |
| `createdAt` | Date | Yes | *Auto* | Timestamp created automatically by Mongoose. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp modified automatically by Mongoose. |

##### Validation Rules
* `status` must be one of: `['saved', 'applied', 'interviewing', 'offered', 'rejected']`.

##### Indexes
* `{ userId: 1, jobId: 1 }` (Unique, Background)
* `{ userId: 1, createdAt: -1 }` (Background)
* `{ userId: 1, title: 1 }` (Background)
* `{ userId: 1, status: 1 }` (Background)
* `{ userId: 1, company: 1 }` (Background)
* `{ userId: 1, updatedAt: -1 }` (Background)
* `{ userId: 1, status: 1, updatedAt: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b0",
  "userId": "user_fb_uid_12345",
  "jobId": "rapidapi-12345",
  "title": "Full Stack Engineer",
  "company": "Tech Corp",
  "location": "Remote",
  "jobType": "Full-time",
  "salary": "$120,000 - $140,000",
  "applyLink": "https://techcorp.com/careers/apply",
  "description": "Looking for a React + Node developer...",
  "status": "applied",
  "notes": [
    {
      "content": "Submitted resume through apply portal.",
      "createdAt": "2026-05-28T12:00:00.000Z"
    }
  ],
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 8. JobAlert Collection (`jobalerts`)
* **Purpose**: Persists configuration parameters used by the background scheduler to match users to new job opportunities.
* **Collection Name**: `jobalerts`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | String | Yes | *None* | Firebase UID of the alert creator. |
| `userEmail` | String | Yes | *None* | Destination email address. |
| `userName` | String | No | `"Job Seeker"` | Recipient display name. |
| `title` | String | Yes | *None* | Alert search title (e.g. `"React Developer"`), trimmed. |
| `keywords` | Array [String] | No | `[]` | Search query tag keywords, trimmed. |
| `location` | String | No | `""` | Search geography limit, trimmed. |
| `remoteOnly` | Boolean | No | `false` | Filters for remote listings. |
| `salaryMin` | Number | No | `null` | Lower wage limit. |
| `salaryMax` | Number | No | `null` | Upper wage limit. |
| `employmentType` | Array [String] | No | `['full-time']` | Enum filter configurations list. |
| `isActive` | Boolean | No | `true` | Enables or disables scheduler processing. |
| `lastCheckedAt` | Date | No | `null` | Timestamp of the last run. |
| `totalJobsFound` | Number | No | `0` | Cumulative matching results counter. |
| `totalEmailsSent` | Number | No | `0` | Count of alert digests dispatched. |
| `createdAt` | Date | Yes | *Auto* | Timestamp created automatically by Mongoose. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp modified automatically by Mongoose. |

##### Validation Rules
* `employmentType` arrays must only contain strings from: `['full-time', 'part-time', 'contract', 'internship']`

##### Indexes
* `{ userId: 1, isActive: 1 }` (Background)
* `{ isActive: 1, lastCheckedAt: 1 }` (Background)
* `{ userId: 1, createdAt: -1 }` (Background)
* `{ isActive: 1, userEmail: 1 }` (Background)
* `{ userId: 1, title: 1, isActive: 1 }` (Background)
* `{ isActive: 1, remoteOnly: 1 }` (Background)
* `{ isActive: 1, location: 1, lastCheckedAt: 1 }` (Background)
* `{ employmentType: 1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b1",
  "userId": "user_fb_uid_12345",
  "userEmail": "johndoe@example.com",
  "userName": "John Doe",
  "title": "Backend Developer",
  "keywords": ["Node.js", "Express", "Kubernetes"],
  "location": "New York, NY",
  "remoteOnly": false,
  "salaryMin": 90000,
  "salaryMax": 150000,
  "employmentType": ["full-time", "contract"],
  "isActive": true,
  "lastCheckedAt": "2026-05-28T00:00:00.000Z",
  "totalJobsFound": 12,
  "totalEmailsSent": 1,
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

##### Usage Notes
* Used by `weeklyDigestService.js` and `jobFetcher.js` as the query source to run API crawls.

---

#### 9. Job Collection (`jobs`)
* **Purpose**: System-wide index of cached job opportunities.
* **Collection Name**: `jobs`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | String | Yes | *None* | Job title, indexed for text search. |
| `company` | String | Yes | *None* | Company name, indexed for text search. |
| `description` | String | Yes | *None* | Full text of job duties. |
| `location` | Object | Yes | *None* | Location breakdown block. |
| `location.city` | String | No | *None* | Target city. |
| `location.state` | String | No | *None* | Target state. |
| `location.country` | String | No | *None* | Target country. |
| `location.isRemote` | Boolean | No | `false` | Remote status. |
| `jobType` | String | No | `"on-site"` | Enum classification. |
| `employmentType` | String | No | `"full-time"` | Enum classification. |
| `salary` | Object | No | *None* | Compensation bounds block. |
| `salary.min` | Number | No | *None* | Minimum salary. |
| `salary.max` | Number | No | *None* | Maximum salary. |
| `salary.currency` | String | No | `"USD"` | Salary currency format. |
| `salary.period` | String | No | `"yearly"` | Pay cycle period enum. |
| `applyLink` | String | No | *None* | Redirect application link. |
| `recruiterEmail` | String | No | *None* | Contact details. |
| `requiredSkills` | Array [String]| No | *None* | Core requirements list. |
| `preferredSkills` | Array [String]| No | *None* | Niceties requirements list. |
| `experienceLevel` | String | No | `"mid"` | Target level enum. |
| `source` | Object | No | *None* | Listing origin details block. |
| `source.platform` | String | No | *None* | Platform label (e.g. `"Linkedin"`). |
| `source.url` | String | No | *None* | External details link. |
| `source.scrapedAt` | Date | No | *None* | Sync timestamp. |
| `isActive` | Boolean | No | `true` | Signals if job is open. |
| `expiresAt` | Date | No | *None* | Job listing expiration date. |
| `createdAt` | Date | Yes | *Auto* | Timestamp created automatically by Mongoose. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp modified automatically by Mongoose. |

##### Validation Rules
* `jobType` must be one of: `['remote', 'on-site', 'hybrid']`
* `employmentType` must be one of: `['full-time', 'part-time', 'contract', 'internship']`
* `salary.period` must be one of: `['hourly', 'monthly', 'yearly']`
* `experienceLevel` must be one of: `['intern', 'junior', 'mid', 'senior', 'lead']`

##### Indexes
* `{ title: "text", company: "text", description: "text" }` (Text Index)
* `{ isActive: 1, createdAt: -1 }` (Background)
* `{ 'location.city': 1, jobType: 1 }` (Background)
* `{ 'location.country': 1, jobType: 1 }` (Background)
* `{ requiredSkills: 1 }` (Background)
* `{ isActive: 1, experienceLevel: 1, createdAt: -1 }` (Background)
* `{ isActive: 1, employmentType: 1, createdAt: -1 }` (Background)
* `{ jobType: 1, experienceLevel: 1, isActive: 1 }` (Background)
* `{ expiresAt: 1 }` (Background)
* `{ 'salary.min': 1, 'salary.max': 1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b2",
  "title": "Software Developer",
  "company": "Startup Inc",
  "description": "We are seeking a developer with familiarity in Node...",
  "location": {
    "city": "Boston",
    "state": "MA",
    "country": "USA",
    "isRemote": false
  },
  "jobType": "on-site",
  "employmentType": "full-time",
  "salary": {
    "min": 80000,
    "max": 110000,
    "currency": "USD",
    "period": "yearly"
  },
  "applyLink": "https://startup.com/jobs/1",
  "recruiterEmail": "jobs@startup.com",
  "requiredSkills": ["JavaScript", "Express"],
  "preferredSkills": ["TypeScript"],
  "experienceLevel": "junior",
  "source": {
    "platform": "scraped-naukri",
    "url": "https://naukri.com/example",
    "scrapedAt": "2026-05-28T12:00:00.000Z"
  },
  "isActive": true,
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 10. JobListing Collection (`joblistings`)
* **Purpose**: Temporarily stores raw external opportunities pulled from RapidAPI search routes to prevent double-processing.
* **Collection Name**: `joblistings`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `externalId` | String | Yes | *None* | Unique ID from search provider (e.g., JSearch API ID). |
| `title` | String | Yes | *None* | Job title. |
| `company` | String | Yes | *None* | Company name. |
| `location` | String | No | `"Remote"` | Location description. |
| `description` | String | No | `""` | Raw full description. |
| `descriptionSnippet` | String | No | `""` | Short summarized snippet text. |
| `employmentType` | String | No | `"unknown"` | Type of job. |
| `isRemote` | Boolean | No | `false` | True if remote work. |
| `salary` | Object | No | *None* | Estimated bounds structure. |
| `salary.min` | Number | No | `null` | Minimum pay estimate. |
| `salary.max` | Number | No | `null` | Maximum pay estimate. |
| `salary.currency` | String | No | `"USD"` | Currency type. |
| `salary.period` | String | No | `"yearly"` | Pay cycle interval. |
| `applyLink` | String | Yes | *None* | External redirect URL. |
| `companyLogo` | String | No | `null` | CDN link for company logo. |
| `postedAt` | Date | No | `null` | Original publish date. |
| `expiresAt` | Date | No | `null` | Listing termination timestamp. |
| `source` | String | No | `"rapidapi-jsearch"`| Source API tracking tag. |
| `sourceUrl` | String | No | `null` | Listing origin URL. |
| `skills` | Array [String] | No | `[]` | Extracted matching keyword skills. |
| `fetchedAt` | Date | No | `Date.now` | Internal cache entry timestamp. |
| `createdAt` | Date | Yes | *Auto* | Timestamp created automatically by Mongoose. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp modified automatically by Mongoose. |

##### Validation Rules
* `employmentType` must be one of: `['full-time', 'part-time', 'contract', 'internship', 'unknown']`

##### Indexes
* `{ externalId: 1 }` (Unique, Background)
* `{ title: "text", company: "text", description: "text" }` (Text Index)
* `{ source: 1, fetchedAt: -1 }` (Background)
* `{ location: 1, isRemote: 1 }` (Background)
* `{ createdAt: -1 }` (Background)
* `{ employmentType: 1, isRemote: 1, postedAt: -1 }` (Background)
* `{ 'salary.min': 1, 'salary.max': 1 }` (Background)
* `{ skills: 1 }` (Background)
* `{ expiresAt: 1 }` (Background)
* `{ source: 1, employmentType: 1, postedAt: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b3",
  "externalId": "jsearch-xyz987",
  "title": "React Developer",
  "company": "Globex Corp",
  "location": "Austin, TX",
  "description": "Globex is seeking a senior react developer...",
  "descriptionSnippet": "Globex is seeking a senior react...",
  "employmentType": "full-time",
  "isRemote": true,
  "salary": {
    "min": 110000,
    "max": 130000,
    "currency": "USD",
    "period": "yearly"
  },
  "applyLink": "https://globex.com/jobs/102",
  "companyLogo": "https://logo.provider.com/globex.png",
  "postedAt": "2026-05-28T08:00:00.000Z",
  "expiresAt": "2026-06-28T08:00:00.000Z",
  "source": "rapidapi-jsearch",
  "sourceUrl": "https://linkedin.com/jobs/globex-102",
  "skills": ["React", "Redux", "Webpack"],
  "fetchedAt": "2026-05-28T12:00:00.000Z",
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

### Category D: Fellowship Program & Micro-Internships

---

#### 11. FellowshipProfile Collection (`fellowshipprofiles`)
* **Purpose**: Stores membership profiles, verification states, and challenge statistics for students and corporates in the micro-internship workspace.
* **Collection Name**: `fellowshipprofiles`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | String | Yes | *None* | Unique owner UID (Firebase UID). |
| `role` | String | Yes | *None* | User role selector. |
| `isVerified` | Boolean | No | `false` | Verification badge flag. |
| `verifiedEmail` | String | No | `null` | Verified academic or business email. |
| `verificationCode` | String | No | `null` | Encrypted verification code string. |
| `verificationCodeExpiry`| Date| No | `null` | Datetime when the code expires. |
| `companyName` | String | No | `null` | Associated corporate workspace. |
| `collegeName` | String | No | `null` | Associated student institution. |
| `bio` | String | No | `null` | Member short description. |
| `skills` | Array [String] | No | `[]` | Tagged list of competencies. |
| `proposalCount` | Number | No | `0` | Cumulative submitted proposal metrics. |
| `challengeCount` | Number | No | `0` | Cumulative challenges posted metrics. |
| `createdAt` | Date | Yes | *Auto* | Generation timestamp. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp representing last modifications. |

##### Validation Rules
* `role` must be one of: `['student', 'corporate']`
* Hashing handles TOTP values during pre-save: `verificationCode` values are hashed using Node's `crypto` scrypt (16-byte salt, 64-byte key) output format `salt:hash`.
* Comparison logic `compareVerificationCode` utilizes `crypto.timingSafeEqual` to prevent timing attacks.

##### Relationships
* Maps to `User` via parent `userId` (Firebase UID).
* Referenced by: `Challenge` (corporate posters match via `corporateId`).
* Referenced by: `Proposal` (student submitters match via `studentId`).

##### Indexes
* `{ userId: 1 }` (Unique, Background)
* `{ role: 1 }` (Background)
* `{ role: 1, isVerified: 1 }` (Background)
* `{ verifiedEmail: 1 }` (Sparse, Background)
* `{ skills: 1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b4",
  "userId": "user_fb_uid_12345",
  "role": "student",
  "isVerified": true,
  "verifiedEmail": "john.doe@university.edu",
  "verificationCode": "d2a3f890e...:c1a2b3...",
  "verificationCodeExpiry": "2026-05-28T12:30:00.000Z",
  "collegeName": "Stanford University",
  "bio": "CS Major interested in open source.",
  "skills": ["JavaScript", "Python"],
  "proposalCount": 3,
  "challengeCount": 0,
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:10:00.000Z"
}
```

---

#### 12. Challenge Collection (`challenges`)
* **Purpose**: Stores micro-internship listings created by corporates, including reward pricing, expectations, and active status.
* **Collection Name**: `challenges`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | String | Yes | *None* | Micro-internship title (length bounds: 10 - 200). |
| `description` | String | Yes | *None* | Project requirements summary (minimum length: 50). |
| `category` | String | Yes | *None* | Target domain filter. |
| `price` | Number | Yes | *None* | Escrow payout reward (minimum: 1000). |
| `deadline` | Date | Yes | *None* | Project completion deadline. |
| `requirements` | Array [String] | No | `[]` | Explicit task qualifications criteria. |
| `corporateId` | String | Yes | *None* | Owner creator ID (Firebase UID). |
| `corporateName` | String | Yes | *None* | Owner name reference. |
| `companyName` | String | Yes | *None* | Company entity identifier. |
| `status` | String | No | `"open"` | Active project lifecycle stage. |
| `proposalCount` | Number | No | `0` | Statistics counter tracker. |
| `selectedProposalId`| ObjectId | No | `null` | Reference to winning bid document (`ref: 'Proposal'`). |
| `createdAt` | Date | Yes | *Auto* | Generation timestamp. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp representing last modifications. |

##### Validation Rules
* `category` must be one of: `['design', 'content', 'development', 'research', 'marketing']`
* `status` must be one of: `['open', 'in_progress', 'completed', 'cancelled']`
* Custom pre-save hook handles updating `updatedAt` value automatically.

##### Relationships
* Belongs to: `FellowshipProfile` of corporate member (via `corporateId`).
* Has many: `Proposal` (related via matching `challengeId`).
* References: `Proposal` (via winning bid pointer `selectedProposalId`).
* Referenced by: `FellowshipChatRoom` (`challengeId` pointer).

##### Indexes
* `{ status: 1, createdAt: -1 }` (Background)
* `{ category: 1, status: 1 }` (Background)
* `{ corporateId: 1, createdAt: -1 }` (Background)
* `{ status: 1, deadline: 1 }` (Background)
* `{ price: 1 }` (Background)
* `{ title: "text", description: "text" }` (Text Index)
* `{ status: 1, category: 1, deadline: 1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b5",
  "title": "Build a CLI Tool in Node",
  "description": "We need a developer to construct a tool to parsing log data structures...",
  "category": "development",
  "price": 1500,
  "deadline": "2026-06-28T12:00:00.000Z",
  "requirements": ["Experienced with Node.js stream API", "Unit testing coverage"],
  "corporateId": "corp_fb_uid_54321",
  "corporateName": "Jane Smith",
  "companyName": "DevTools LLC",
  "status": "open",
  "proposalCount": 2,
  "selectedProposalId": null,
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 13. Proposal Collection (`proposals`)
* **Purpose**: Records student bids, cover letters, and cost estimates pitched to corporate projects.
* **Collection Name**: `proposals`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `challengeId` | ObjectId | Yes | *None* | Reference to parent project (`ref: 'Challenge'`). |
| `studentId` | String | Yes | *None* | Submitting student's ID (Firebase UID). |
| `studentName` | String | Yes | *None* | Student profile name. |
| `studentEmail` | String | Yes | *None* | Contact email. |
| `coverLetter` | String | Yes | *None* | pitch statement (minimum length: 100). |
| `proposedPrice` | Number | Yes | *None* | Bid compensation estimate. |
| `estimatedDays` | Number | Yes | *None* | Completion timeline duration (minimum value: 1). |
| `portfolioLinks` | Array [String] | No | `[]` | Links to student's work sample proofs. |
| `status` | String | No | `"pending"` | Bid status. |
| `corporateFeedback` | String | No | `null` | Feedback left by the project owner. |
| `createdAt` | Date | Yes | *Auto* | Generation timestamp. |
| `updatedAt` | Date | Yes | *Auto* | Last modification timestamp. |

##### Validation Rules
* `status` must be one of: `['pending', 'accepted', 'rejected', 'withdrawn']`
* Pre-save hook enforces updating `updatedAt` dynamically.

##### Relationships
* Belongs to: `Challenge` (via `challengeId`).
* Belongs to: `FellowshipProfile` of student (via `studentId`).
* Referenced by: `FellowshipChatRoom` (`proposalId` pointer).

##### Indexes
* `{ challengeId: 1, studentId: 1 }` (Unique, Background)
* `{ studentId: 1, status: 1 }` (Background)
* `{ studentId: 1, createdAt: -1 }` (Background)
* `{ challengeId: 1, createdAt: -1 }` (Background)
* `{ challengeId: 1, status: 1 }` (Background)
* `{ challengeId: 1, status: 1, createdAt: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b6",
  "challengeId": "603d21c9b3a5b3a4f89d31b5",
  "studentId": "student_fb_uid_12345",
  "studentName": "John Doe",
  "studentEmail": "johndoe@student.edu",
  "coverLetter": "I have constructed over three different developer tools on GitHub. I would be happy to work on this CLI parsing project...",
  "proposedPrice": 1500,
  "estimatedDays": 10,
  "portfolioLinks": ["https://github.com/johndoe/cli-tool"],
  "status": "pending",
  "corporateFeedback": null,
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 14. FellowshipChatRoom Collection (`fellowshipchatrooms`)
* **Purpose**: Dedicated workspace rooms generated when a proposal is accepted. Integrates escrow payments tracking.
* **Collection Name**: `fellowshipchatrooms`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `proposalId` | ObjectId | Yes | *None* | Reference to accepted bid (`ref: 'Proposal'`). |
| `challengeId` | ObjectId | Yes | *None* | Reference to parent project (`ref: 'Challenge'`). |
| `studentId` | String | Yes | *None* | Winning student's UID. |
| `corporateId` | String | Yes | *None* | Project owner's UID. |
| `studentName` | String | No | *None* | Cached student name. |
| `corporateName` | String | No | *None* | Cached corporate name. |
| `challengeTitle` | String | No | *None* | Cached challenge title. |
| `status` | String | No | `"active"` | Workspace activity state. |
| `paymentStatus` | String | No | `"pending"`| Payment lifecycle indicator. |
| `razorpayOrderId` | String | No | `null` | Razorpay order transaction tracker. |
| `razorpayPaymentId`| String | No | `null` | Razorpay payment transaction identifier. |
| `amount` | Number | No | `0` | Cost of escrow project. |
| `paidAt` | Date | No | `null` | Datetime transaction completed. |
| `releasedAt` | Date | No | `null` | Datetime corporate funds were released to student. |
| `lastMessageAt` | Date | No | `Date.now` | Tracking tag for active chat room sorting. |
| `createdAt` | Date | No | `Date.now` | Generation timestamp. |

##### Validation Rules
* `status` must be one of: `['active', 'closed']`
* `paymentStatus` must be one of: `['pending', 'escrow', 'released', 'refunded']`

##### Relationships
* References: `Proposal` (via `proposalId`).
* References: `Challenge` (via `challengeId`).
* Has many: `FellowshipMessage` (linked via `roomId`).

##### Indexes
* `{ proposalId: 1 }` (Unique, Background)
* `{ studentId: 1, status: 1, lastMessageAt: -1 }` (Background)
* `{ corporateId: 1, status: 1, lastMessageAt: -1 }` (Background)
* `{ challengeId: 1, status: 1 }` (Background)
* `{ paymentStatus: 1, corporateId: 1 }` (Background)
* `{ challengeId: 1, studentId: 1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b7",
  "proposalId": "603d21c9b3a5b3a4f89d31b6",
  "challengeId": "603d21c9b3a5b3a4f89d31b5",
  "studentId": "student_fb_uid_12345",
  "corporateId": "corp_fb_uid_54321",
  "studentName": "John Doe",
  "corporateName": "Jane Smith",
  "challengeTitle": "Build a CLI Tool in Node",
  "status": "active",
  "paymentStatus": "escrow",
  "razorpayOrderId": "order_RzPay12345",
  "razorpayPaymentId": "pay_RzPay67890",
  "amount": 1500,
  "paidAt": "2026-05-28T12:05:00.000Z",
  "releasedAt": null,
  "lastMessageAt": "2026-05-28T12:15:00.000Z",
  "createdAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 15. FellowshipMessage Collection (`fellowshipmessages`)
* **Purpose**: Chat history message logs exchanged within micro-internship active workspaces.
* **Collection Name**: `fellowshipmessages`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `roomId` | ObjectId | Yes | *None* | Reference to parent workspace (`ref: 'FellowshipChatRoom'`). |
| `senderId` | String | Yes | *None* | UID of the sender (Firebase UID). |
| `senderName` | String | Yes | *None* | Display name of the sender. |
| `senderRole` | String | Yes | *None* | Role selector of the sender. |
| `content` | String | Yes | *None* | Text message body (maximum: 2000). |
| `createdAt` | Date | Yes | `Date.now` | Message timestamp. |

##### Validation Rules
* `senderRole` must be one of: `['student', 'corporate']`

##### Relationships
* Belongs to: `FellowshipChatRoom` (via `roomId`).

##### Indexes
* `{ roomId: 1, createdAt: -1 }` (Background)
* `{ senderId: 1, createdAt: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b8",
  "roomId": "603d21c9b3a5b3a4f89d31b7",
  "senderId": "student_fb_uid_12345",
  "senderName": "John Doe",
  "senderRole": "student",
  "content": "Hi, I have set up the initial github repository.",
  "createdAt": "2026-05-28T12:15:00.000Z"
}
```

---

### Category E: AI Trajectory, Portfolios & Mock Interviews

---

#### 16. input Collection (`inputs`)
* **Purpose**: Stores structured parameters extracted from users' resumes to support AI trajectory mapping.
* **Collection Name**: `inputs`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `user` | ObjectId | Yes | *None* | Reference to User parent (`ref: "User"`). |
| `name` | String | No | *None* | Candidate name metadata. |
| `jobRole` | String | No | *None* | Target career role. |
| `experienceLevel` | String | No | `"Entry"` | Profile level. |
| `techSkills` | Array [Object] | No | `[]` | Tech skills parameters array. |
| `techSkills[i].name` | String | No | *None* | Skill name. |
| `techSkills[i].level` | String | No | `"beginner"` | Skill depth level enum. |
| `softSkills` | Array [String] | No | `[]` | Personal skills. |
| `resume` | String | No | *None* | Resume storage path URL identifier. |
| `resumeText` | String | No | *None* | parsed text output representation. |
| `education` | Object | No | *None* | School details block. |
| `education.degree` | String | No | *None* | Degree. |
| `education.college` | String | No | *None* | College. |
| `education.year` | String | No | *None* | Graduation year. |
| `projects` | Array [Object] | No | `[]` | Highlighted portfolio projects. |
| `projects[i].title` | String | No | *None* | Project name. |
| `projects[i].description`| String | No | *None* | Project summaries. |
| `projects[i].techStack` | Array [String]| No | *None* | Libraries used. |
| `projects[i].githubLink` | String | No | *None* | Repository link. |
| `experience` | Array [Object] | No | `[]` | Past jobs tracking block. |
| `experience[i].company` | String | No | *None* | Employer name. |
| `experience[i].role` | String | No | *None* | Job title. |
| `experience[i].duration` | String | No | *None* | Employment period duration. |
| `experience[i].techUsed` | Array [String]| No | *None* | Technologies used. |
| `preferences` | Object | No | *None* | Target job location details block. |
| `preferences.location` | String | No | *None* | Target city/state. |
| `preferences.jobType` | String | No | *None* | E.g. `"Remote"`, `"Hybrid"`. |
| `createdAt` | Date | Yes | *Auto* | Timestamp created automatically by Mongoose. |
| `updatedAt` | Date | Yes | *Auto* | Timestamp modified automatically by Mongoose. |

##### Validation Rules
* `experienceLevel` must be one of: `['Entry', 'Junior', 'Mid', 'Senior']`
* `techSkills.level` must be one of: `['beginner', 'intermediate', 'advanced']`

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31b9",
  "user": "603d21c9b3a5b3a4f89d31ab",
  "name": "John Doe",
  "jobRole": "Software Engineer",
  "experienceLevel": "Junior",
  "techSkills": [
    { "name": "Node.js", "level": "intermediate" }
  ],
  "softSkills": ["Communication", "Leadership"],
  "education": {
    "degree": "B.S. Computer Science",
    "college": "State University",
    "year": "2025"
  },
  "projects": [
    {
      "title": "Cli Tool",
      "description": "Logs parser.",
      "techStack": ["JavaScript"],
      "githubLink": "https://github.com/johndoe/cli"
    }
  ],
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 17. recruiter Collection (`recruiters`)
* **Purpose**: Logs profile match stats to show recruiters which candidates fit their roles.
* **Collection Name**: `recruiters`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | ObjectId | Yes | *None* | Reference to candidate User account (`ref: "user"`). |
| `username` | String | Yes | *None* | Candidate username copy. |
| `email` | String | Yes | *None* | Candidate contact email. |
| `resumeUrl` | String | No | `""` | Storage location of the evaluated resume. |
| `matchPercentage` | Number | Yes | *None* | Fit percentage score index. Min: 0, Max: 100. |
| `jobTitle` | String | No | `"General"` | Specific evaluation role context. |
| `createdAt` | Date | Yes | *Auto* | Entry creation timestamp. |
| `updatedAt` | Date | Yes | *Auto* | Entry last modified timestamp. |

##### Indexes
* `{ userId: 1, jobTitle: 1 }` (Unique)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31ba",
  "userId": "603d21c9b3a5b3a4f89d31ab",
  "username": "johndoe",
  "email": "johndoe@example.com",
  "resumeUrl": "https://storage.googleapis.com/resumes/johndoe.pdf",
  "matchPercentage": 92,
  "jobTitle": "React Developer",
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 18. Portfolio Collection (`portfolios`)
* **Purpose**: Stores configurations for a user's web portfolio layout sections.
* **Collection Name**: `portfolios`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | String | Yes | *None* | Firebase UID of the owner. |
| `slug` | String | Yes | *None* | URL sub-path identifier (e.g. `"john-doe"`). |
| `sections` | Mixed | No | `{}` | Key-value store tracking templates content configuration parameters. |
| `createdAt` | Date | Yes | *Auto* | Generation timestamp. |
| `updatedAt` | Date | Yes | *Auto* | Last modified timestamp. |

##### Relationships
* Belongs to: `User` (via matching `userId`).
* Referenced by: `PortfolioVersion` (`portfolioId` pointer).

##### Indexes
* `{ userId: 1, slug: 1 }` (Unique)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31bb",
  "userId": "user_fb_uid_12345",
  "slug": "john-doe",
  "sections": {
    "theme": "dark-glass",
    "hero": {
      "headline": "Hi, I am John Doe",
      "subheadline": "Crafting backends at scale"
    }
  },
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 19. PortfolioVersion Collection (`portfolioversions`)
* **Purpose**: Retains snapshots or differences tracking layout changes to portfolios.
* **Collection Name**: `portfolioversions`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `portfolioId` | String | Yes | *None* | Reference code pointing to matching `Portfolio` parent _id. |
| `version` | Number | Yes | *None* | Sequential version integer. |
| `changes` | Mixed | No | `null` | JSON diff representing changes from prior states. |
| `snapshot` | Mixed | No | `null` | Full fallback layout JSON structure state. |
| `createdBy` | String | Yes | *None* | UID of the user who triggered the save (Firebase UID). |
| `createdAt` | Date | Yes | *Auto* | Snapshot save date. |

##### Custom Timestamp Mapping
* Schema disables `updatedAt` updates: `timestamps: { createdAt: true, updatedAt: false }`

##### Indexes
* `{ portfolioId: 1, version: -1 }` (Unique)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31bc",
  "portfolioId": "603d21c9b3a5b3a4f89d31bb",
  "version": 2,
  "changes": {
    "sections.hero.subheadline": "Building resilient systems at scale"
  },
  "snapshot": null,
  "createdBy": "user_fb_uid_12345",
  "createdAt": "2026-05-28T12:05:00.000Z"
}
```

---

#### 20. Interview Collection (`interviews`)
* **Purpose**: Records mock AI interview settings, question sets, candidate transcript answers, and AI performance reports.
* **Collection Name**: `interviews`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `odId` | String | Yes | *None* | Target user owner ID matching Firebase UID. |
| `jobRole` | String | Yes | *None* | Interview target job role (e.g. `"Software Engineer"`). |
| `industry` | String | Yes | *None* | Sector category (e.g. `"Technology"`). |
| `experienceLevel` | String | Yes | *None* | Target tier (e.g. `"Junior"`). |
| `questions` | Array [Object] | No | `[]` | List of AI-generated prompts. |
| `questions[i].questionId`| String | No | *None* | Unique question ID string. |
| `questions[i].question` | String | No | *None* | Prompt statement text. |
| `questions[i].type` | String | No | *None* | Type enum. |
| `questions[i].difficulty`| String | No | *None* | Difficulty level enum. |
| `answers` | Array [Object] | No | `[]` | Array of submitted transcripts and metrics logs. |
| `answers[i].questionId` | String | Yes | *None* | Matching question link ID. |
| `answers[i].question` | String | Yes | *None* | Question prompt copy. |
| `answers[i].transcript` | String | No | `""` | Spoken audio transcript text. |
| `answers[i].duration` | Number | No | `0` | Speaking duration in seconds. |
| `answers[i].analysis` | Object | No | *None* | Detailed analysis feedback block. |
| `answers[i].analysis.relevance` | Number| No | `0` | Relevance score. |
| `answers[i].analysis.clarity` | Number| No | `0` | Clarity score. |
| `answers[i].analysis.confidence`| Number| No | `0` | Confidence score. |
| `answers[i].analysis.feedback` | String| No | `""` | Detailed text review comments. |
| `answers[i].analysis.suggestions`| Array [String]| No | `[]` | Actionable improvements lists. |
| `answers[i].analysis.fillerWords`| Object | No | *None* | Verbal fillers stats. |
| `answers[i].analysis.fillerWords.count`| Number| No| `0` | Count of filler words. |
| `answers[i].analysis.fillerWords.words`| Array [String]| No| `[]` | Explicit filler words logged. |
| `answers[i].expressionMetrics`| Object| No | *None* | Video body-language metrics block. |
| `answers[i].expressionMetrics.averageConfidence`| Number| No| `0` | Computed confidence metric. |
| `answers[i].expressionMetrics.eyeContactPercentage`| Number| No| `0` | Camera engagement score. |
| `answers[i].expressionMetrics.headMovementStability`| Number| No| `0` | Body positioning stability. |
| `answers[i].expressionMetrics.overallExpressionScore`| Number| No| `0`| Body-language overall rating. |
| `answers[i].submittedAt`| Date | No | `Date.now` | Answer submission timestamp. |
| `status` | String | No | `"in_progress"`| Lifecycle indicator enum. |
| `overallScore` | Number | No | `0` | Aggregated overall interview score. |
| `overallFeedback` | Object | No | *None* | Final summarized evaluations block. |
| `overallFeedback.summary`| String | No | *None* | Textual summary. |
| `overallFeedback.topStrengths`| Array [String]| No| `[]` | Highlight strengths notes. |
| `overallFeedback.areasToImprove`| Array [String]| No| `[]` | Highlight weaknesses notes. |
| `overallFeedback.recommendations`| Array [String]| No| `[]` | Action items suggestions. |
| `overallFeedback.expressionAnalysis`| Object| No| *None* | Expression analysis block. |
| `overallFeedback.expressionAnalysis.overallConfidence`| Number| No| `0`| Overall expression confidence. |
| `overallFeedback.expressionAnalysis.feedback`| String | No| *None* | Overall expression feedback summary. |
| `startedAt` | Date | No | `Date.now` | Session start time. |
| `completedAt` | Date | No | *None* | Session end time. |
| `duration` | Number | No | `0` | Cumulative duration in seconds. |
| `createdAt` | Date | Yes | *Auto* | Mongoose-generated timestamp. |
| `updatedAt` | Date | Yes | *Auto* | Mongoose-generated timestamp. |

##### Validation Rules
* `questions[i].type` must be one of: `['behavioral', 'technical', 'situational', 'general']`
* `questions[i].difficulty` must be one of: `['easy', 'medium', 'hard']`
* `status` must be one of: `['in_progress', 'completed', 'abandoned']`

##### Indexes
* `{ odId: 1, createdAt: -1 }` (Background)
* `{ odId: 1, status: 1 }` (Background)
* `{ odId: 1, jobRole: 1, industry: 1 }` (Background)
* `{ odId: 1, overallScore: -1 }` (Background)
* `{ odId: 1, status: 1, completedAt: -1 }` (Background)
* `{ odId: 1, experienceLevel: 1, createdAt: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31bd",
  "odId": "user_fb_uid_12345",
  "jobRole": "Node.js Developer",
  "industry": "Technology",
  "experienceLevel": "mid",
  "questions": [
    {
      "questionId": "q_01",
      "question": "Explain how the event loop operates in Node.js.",
      "type": "technical",
      "difficulty": "medium"
    }
  ],
  "answers": [
    {
      "questionId": "q_01",
      "question": "Explain how the event loop operates in Node.js.",
      "transcript": "The event loop is what allows Node.js to perform non-blocking I/O operations...",
      "duration": 45,
      "analysis": {
        "relevance": 90,
        "clarity": 85,
        "confidence": 80,
        "feedback": "Clear explanation of microtask queue priorities.",
        "suggestions": ["Mention worker pools for cryptography tasks."],
        "fillerWords": {
          "count": 2,
          "words": ["uh", "like"]
        }
      },
      "expressionMetrics": {
        "averageConfidence": 82,
        "eyeContactPercentage": 88,
        "headMovementStability": 95,
        "overallExpressionScore": 88
      },
      "submittedAt": "2026-05-28T12:05:00.000Z"
    }
  ],
  "status": "completed",
  "overallScore": 85,
  "overallFeedback": {
    "summary": "Strong core technical understanding shown in answers.",
    "topStrengths": ["Technical accuracy", "Eye contact"],
    "areasToImprove": ["Quantifying system impacts"],
    "recommendations": ["Elaborate on database connection optimizations."],
    "expressionAnalysis": {
      "overallConfidence": 85,
      "feedback": "Maintained good posture and camera focus."
    }
  },
  "startedAt": "2026-05-28T12:00:00.000Z",
  "completedAt": "2026-05-28T12:10:00.000Z",
  "duration": 600,
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:10:00.000Z"
}
```

---

### Category F: Audit Logs, Traffic & System Tracking

---

#### 21. NotificationLog Collection (`notificationlogs`)
* **Purpose**: System-wide log used to prevent sending duplicate notifications for active job alerts.
* **Collection Name**: `notificationlogs`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | String | Yes | *None* | Firebase UID of target notification recipient. |
| `alertId` | ObjectId | Yes | *None* | Parent search config ID (`ref: 'JobAlert'`). |
| `jobListingId` | ObjectId | Yes | *None* | Parent matched opportunity ID (`ref: 'JobListing'`). |
| `externalJobId` | String | Yes | *None* | External provider API identifier tracking key. |
| `sentAt` | Date | No | `Date.now` | Dispatch datetime. |
| `emailStatus` | String | No | `"pending"`| SMTP delivery status. |
| `emailMessageId` | String | No | `null` | SMTP provider message identifier string. |
| `errorMessage` | String | No | `null` | Error detail text in case of delivery failure. |
| `createdAt` | Date | Yes | *Auto* | Generation timestamp. |
| `updatedAt` | Date | Yes | *Auto* | Last modification timestamp. |

##### Validation Rules
* `emailStatus` must be one of: `['pending', 'sent', 'failed', 'bounced']`

##### Indexes
* `{ userId: 1, jobListingId: 1 }` (Unique, Background - critical deduplication constraint)
* `{ alertId: 1, jobListingId: 1 }` (Background)
* `{ userId: 1, sentAt: -1 }` (Background)
* `{ emailStatus: 1, sentAt: -1 }` (Background)
* `{ alertId: 1, sentAt: -1 }` (Background)
* `{ userId: 1, externalJobId: 1 }` (Background)
* `{ userId: 1, alertId: 1, sentAt: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31be",
  "userId": "user_fb_uid_12345",
  "alertId": "603d21c9b3a5b3a4f89d31b1",
  "jobListingId": "603d21c9b3a5b3a4f89d31b3",
  "externalJobId": "jsearch-xyz987",
  "sentAt": "2026-05-28T12:00:00.000Z",
  "emailStatus": "sent",
  "emailMessageId": "<1234567.890@mail.server.com>",
  "errorMessage": null,
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 22. EmailLog Collection (`emaillogs`)
* **Purpose**: Holds tracking metrics and click events data used to monitor transactional emails engagement.
* **Collection Name**: `emaillogs`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `trackingToken` | String | Yes | *None* | Unique token embedded in pixel URL and wrapped links. |
| `recipientEmail` | String | Yes | *None* | Recipient email address. |
| `campaignId` | String | No | `null` | Campaign identifier (e.g. `'job-alert'`). |
| `deliveryStatus` | String | No | `"sent"` | Delivery status flag. |
| `openCount` | Number | No | `0` | Number of times email was opened. |
| `firstOpenedAt` | Date | No | `null` | Timestamp of first open. |
| `lastOpenedAt` | Date | No | `null` | Timestamp of most recent open. |
| `clickCount` | Number | No | `0` | Number of link clicks logged. |
| `clickEvents` | Array [Object] | No | `[]` | Click event tracking objects. No nested `_id` (`_id: false`). |
| `clickEvents[i].url` | String | Yes | *None* | Target link URL. |
| `clickEvents[i].clickedAt`| Date | Yes | `Date.now` | Click timestamp. |
| `sentAt` | Date | No | `Date.now` | Email dispatch timestamp. |
| `createdAt` | Date | Yes | *Auto* | Generation timestamp. |
| `updatedAt` | Date | Yes | *Auto* | Last modification timestamp. |

##### Validation Rules
* `deliveryStatus` must be one of: `['sent', 'failed', 'bounced']`

##### Indexes
* `{ trackingToken: 1 }` (Unique, Background)
* `{ recipientEmail: 1, sentAt: -1 }` (Background)
* `{ campaignId: 1, sentAt: -1 }` (Background)
* `{ openCount: 1, sentAt: -1 }` (Background)
* `{ deliveryStatus: 1, sentAt: -1 }` (Background)
* `{ firstOpenedAt: 1 }` (Sparse, Background)
* `{ campaignId: 1, openCount: -1 }` (Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31bf",
  "trackingToken": "tr_tok_abc123xyz",
  "recipientEmail": "johndoe@example.com",
  "campaignId": "job-alert",
  "deliveryStatus": "sent",
  "openCount": 1,
  "firstOpenedAt": "2026-05-28T12:05:00.000Z",
  "lastOpenedAt": "2026-05-28T12:05:00.000Z",
  "clickCount": 1,
  "clickEvents": [
    {
      "url": "https://globex.com/jobs/102",
      "clickedAt": "2026-05-28T12:10:00.000Z"
    }
  ],
  "sentAt": "2026-05-28T12:00:00.000Z",
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:10:00.000Z"
}
```

---

#### 23. LoginAttempt Collection (`loginattempts`)
* **Purpose**: Tracks brute-force attempt limits across combinations of client IP address and email.
* **Collection Name**: `loginattempts`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `ip` | String | Yes | *None* | Client IP address string. |
| `email` | String | No | `null` | Associated account target. |
| `attempts` | Number | No | `0` | Count of failures recorded. |
| `lockoutUntil` | Date | No | `null` | Timestamp when user is locked out until. |
| `createdAt` | Date | Yes | *Auto* | Generation timestamp. |
| `updatedAt` | Date | Yes | *Auto* | Last modification timestamp. |

##### Indexes
* `{ ip: 1 }` (Unique, Background)
* `{ ip: 1, email: 1 }` (Background)
* `{ lockoutUntil: 1 }` (Sparse, Background)

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31c1",
  "ip": "192.168.1.1",
  "email": "hacker@example.com",
  "attempts": 3,
  "lockoutUntil": "2026-05-28T12:15:00.000Z",
  "createdAt": "2026-05-28T12:00:00.000Z",
  "updatedAt": "2026-05-28T12:00:00.000Z"
}
```

---

#### 24. TokenUsage Collection (`tokenusages`)
* **Purpose**: Logs AI credits usage to track LLM costs.
* **Collection Name**: `tokenusages`

##### Fields
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | String | Yes | *None* | User UID who requested AI feature (Firebase UID). |
| `provider` | String | Yes | *None* | LLM provider (e.g. `"OpenRouter"`, `"Gemini"`). |
| `promptTokens` | Number | No | `0` | Count of tokens sent. |
| `completionTokens` | Number | No | `0` | Count of tokens generated. |
| `totalTokens` | Number | No | `0` | Total tokens consumed. |
| `service` | String | Yes | *None* | Sub-service label (e.g. `"ats-score"`, `"resume-enhance"`). |
| `createdAt` | Date | No | `Date.now` | Generation timestamp. |

##### Example Document
```json
{
  "_id": "603d21c9b3a5b3a4f89d31c2",
  "userId": "user_fb_uid_12345",
  "provider": "Gemini",
  "promptTokens": 1024,
  "completionTokens": 512,
  "totalTokens": 1536,
  "service": "resume-enhance",
  "createdAt": "2026-05-28T12:00:00.000Z"
}
```

---

## Part 2: Firebase Firestore Collections

Community, feeds, direct messaging, and online presence features are built on Firebase Firestore. The database structure is represented below.

---

### 1. Channels Collection (`channels`)
* **Purpose**: Groups members into public/private discussion channels.
* **Firestore Reference**: `/channels/{channelId}`

##### Document Schema
* **`id`**: String (Unique Firestore Auto-ID).
* **`name`**: String (Lowercase slugified representation of name, e.g. `"general-chat"`).
* **`description`**: String.
* **`type`**: String (`"public"` or `"private"`).
* **`category`**: String (e.g. `"general"`, `"announcements"`).
* **`icon`**: String (Emoji character, default `"💬"`).
* **`createdBy`**: String (Firebase UID of creator).
* **`createdByName`**: String.
* **`members`**: Array of member objects:
  ```typescript
  {
    uid: string;
    name: string;
    email: string;
    role: "admin" | "member";
    joinedAt: string; // ISO String
  }
  ```
* **`memberCount`**: Number (Current member count).
* **`isDefault`**: Boolean (If true, users join automatically on creation).
* **`lastMessage`**: Object | `null` (Metadata copy of the last sent message).
* **`createdAt`**: ServerTimestamp.
* **`updatedAt`**: ServerTimestamp.

---

### 2. Posts Collection (`posts`)
* **Purpose**: Stores community forum posts, supporting categories, attachments, scheduled publishing, and likes.
* **Firestore Reference**: `/posts/{postId}`

##### Document Schema
* **`id`**: String (Unique Auto-ID).
* **`title`**: String.
* **`content`**: String.
* **`tags`**: Array [String] (Lowercase trimmed keywords).
* **`category`**: String (e.g. `"discussion"`, `"help"`, `"career-advice"`).
* **`attachments`**: Array of attachment objects.
* **`author`**: Object:
  ```typescript
  {
    uid: string;
    name: string;
    email: string;
    avatar: string | null;
  }
  ```
* **`likes`**: Array of like records (used as source of truth):
  ```typescript
  {
    uid: string;
    name: string;
    likedAt: string; // ISO String
  }
  ```
* **`likeCount`**: Number (Denormalized cache representation matching `likes.length`).
* **`commentCount`**: Number.
* **`views`**: Number.
* **`viewedBy`**: Array [String] (List of Firebase UIDs who opened the post).
* **`isPinned`**: Boolean.
* **`isAnnouncement`**: Boolean.
* **`isEdited`**: Boolean.
* **`isDeleted`**: Boolean (Soft delete flag).
* **`deletedAt`**: ServerTimestamp | `null`.
* **`status`**: String (`"published"` | `"scheduled"` | `"draft"`).
* **`scheduledAt`**: String | `null` (ISO string representing when scheduled posts are scheduled for).
* **`createdAt`**: ServerTimestamp.
* **`updatedAt`**: ServerTimestamp.

---

### 3. Comments Collection (`comments`)
* **Purpose**: Threaded comments under community forum posts.
* **Firestore Reference**: `/comments/{commentId}`

##### Document Schema
* **`postId`**: String (Target post ID link).
* **`parentCommentId`**: String | `null` (Replies reference parent IDs, top-level comments are `null`).
* **`content`**: String.
* **`author`**: Object:
  ```typescript
  {
    uid: string;
    name: string;
    email: string;
    avatar: string | null;
  }
  ```
* **`likes`**: Array of like records:
  ```typescript
  {
    uid: string;
    name: string;
    likedAt: string;
  }
  ```
* **`likeCount`**: Number.
* **`isDeleted`**: Boolean (Soft delete flag).
* **`createdAt`**: ServerTimestamp.
* **`updatedAt`**: ServerTimestamp.

---

### 4. Conversations Collection (`conversations`)
* **Purpose**: Tracks participant pairs for private direct messages.
* **Firestore Reference**: `/conversations/{conversationId}`

##### Document Schema
* **`participants`**: Array [String] (Sorted Firebase UIDs representing the two chat members).
* **`lastMessage`**: Object:
  ```typescript
  {
    content: string;
    senderId: string;
    sentAt: ServerTimestamp;
  }
  ```
* **`unreadCounts`**: Object mapping user UID keys to numeric unread counts (e.g. `{ "uid_1": 0, "uid_2": 3 }`).
* **`createdAt`**: ServerTimestamp.
* **`updatedAt`**: ServerTimestamp.

---

### 5. Direct Messages Collection (`directMessages`)
* **Purpose**: Stores individual messages exchanged within private conversations.
* **Firestore Reference**: `/directMessages/{messageId}`

##### Document Schema
* **`conversationId`**: String (Parent conversation ID link).
* **`senderId`**: String (Firebase UID of sender).
* **`recipientId`**: String (Firebase UID of recipient).
* **`content`**: String.
* **`isRead`**: Boolean.
* **`createdAt`**: ServerTimestamp.

---

## Part 3: System-Wide Patterns & Design Decisions

### 1. Soft Delete Patterns
* **MongoDB**: Standard deletions are hard deletes (`findOneAndDelete`), ensuring strict data hygiene.
* **Firebase Firestore**: Soft delete is implemented on community `posts` and `comments` using `isDeleted: true` and `deletedAt: ServerTimestamp`. Query routing layers explicitly filter out soft-deleted items (`where('isDeleted', '==', false)`).

### 2. Audit & Sync Fields
* MongoDB records leverage Mongoose automatic `timestamps` options.
* Overrides exist for specific collections:
  * `Resume` maps the update key to `lastModified`.
  * `ResumeAtsHistory` maps `createdAt: 'createdAt'` and disables `updatedAt` tracking.
  * `PortfolioVersion` disables `updatedAt` tracking.
* Dynamic synchronization keys like `lastSyncedAt` (UserProfile) manage API states during GitHub importing.

### 3. Status Fields & Enums
State transitions are controlled via Mongoose schemas using `enum` validations:
* **TrackedJob**: `saved` ➔ `applied` ➔ `interviewing` ➔ `offered` ➔ `rejected`
* **Proposal**: `pending` ➔ `accepted` | `rejected` | `withdrawn`
* **Challenge**: `open` ➔ `in_progress` ➔ `completed` | `cancelled`
* **FellowshipChatRoom**: `active` ➔ `closed`
* **Payment Escrow (within ChatRoom)**: `pending` ➔ `escrow` ➔ `released` | `refunded`
* **NotificationLog / EmailLog**: `pending` ➔ `sent` | `failed` | `bounced`
* **Mock Interviews**: `in_progress` ➔ `completed` | `abandoned`

### 4. Background Queue Integration (BullMQ + Redis)
* Background operations utilize BullMQ. BullMQ jobs run via independent Redis connections.
* Three primary queues are active:
  1. `job-alerts`: Enqueues user search alert checks. Logs status to `NotificationLog`. Falls back to synchronous execution if Redis is offline.
  2. `post-scheduler`: Publishes scheduled community posts in Firestore.
  3. `weekly-digests`: Compiles and sends email summaries.

### 5. AI Fields & Persistent Structures
* Structured parser input parameters are saved in the `input` collection.
* ATS history tracks exact criteria weights (`keywordMatch`, `formatting`, `skillsAlignment`, etc.) in `ResumeAtsHistory`.
* Mock interview audio transcription, fillers word lists, eye contact metrics, and head stability rankings are stored in `Interview`.

### 6. Socket.IO Connections & Active Presence
* **Dynamic tracking**: Active connections are stored in-memory via ES6 `Map` and `Set` collections in `presenceService.js` (designed to be backed by a Redis adapter for scale).
* Active user states (`online` | `away` | `offline`) and channel/message subscription lists are synchronized in real-time.

## Part 4: Firebase Authentication Structure

### 1. Firebase Admin Runtime Configuration
* `backend/src/config/firebase.js` initializes the Firebase Admin SDK using either:
  * a service-account JSON from `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT`,
  * application default credentials via `GOOGLE_APPLICATION_CREDENTIALS`,
  * or a limited fallback initialization if no credentials are present.
* The module exports Firestore (`db`), Cloud Storage (`storage`), and Auth (`auth`) instances for backend use.
* The admin runtime is the source of truth for verifying bearer tokens, minting custom tokens, and managing user lookups.

### 2. Protected Auth Middleware
* `backend/src/middleware/auth.js` implements `verifyToken`, `adminOnly`, and `optionalAuth`.
* `verifyToken` expects `Authorization: Bearer <token>`, verifies it with `admin.auth().verifyIdToken()`, and attaches `req.user` with:
  * `uid`
  * `email`
  * `name`
  * `picture`
  * `emailVerified`
* `adminOnly` enforces `ADMIN_EMAILS` allow-list membership after `verifyToken` has already populated `req.user`.
* `optionalAuth` attempts the same token verification but falls back to `req.user = null` instead of rejecting the request.

### 3. Socket Authentication
* `backend/src/middleware/socketAuth.js` authenticates Socket.IO connections through `socket.handshake.auth.token`.
* A valid Firebase ID token populates `socket.user` with the same identity fields used in HTTP auth.
* Development-only bypass logic is supported through environment flags such as `ALLOW_DEV_SOCKET_AUTH=true` or `DEV_BYPASS_AUTH=true`, where the token payload is decoded locally and used to populate `socket.user`.

### 4. LinkedIn OAuth and Custom Token Exchange
* `backend/src/routes/auth.js` contains the LinkedIn OAuth flow:
  * `GET /api/auth/linkedin` redirects to LinkedIn with a generated `state` value.
  * `GET /api/auth/linkedin/callback` exchanges the LinkedIn code for profile data, resolves Firebase user identity, creates or updates the Firebase user, and minting a custom token with `admin.auth().createCustomToken(firebaseUid, { linkedinId })`.
  * The callback stores a one-time exchange code in memory for 60 seconds and redirects the browser back into the frontend callback route.
  * `GET /api/auth/linkedin/token` exchanges the one-time code for `{ success: true, token, isNew }` or returns `{ success: false, error }` when the code is invalid or expired.
* The backend uses the same Firebase Admin instance to create users, assign custom claims, and verify tokens.

### 5. Frontend Firebase Client and Auth Lifecycle
* `frontend/src/config/firebase.js` initializes the Firebase client SDK only when `VITE_FIREBASE_API_KEY` is valid. It exports `auth`, `db`, and `storage` for client-side use.
* `frontend/src/context/AuthProvider.jsx` manages:
  * `signup(email, password, displayName)`
  * `login(email, password)`
  * `loginWithGoogle()` using Firebase popup auth
  * `loginWithLinkedIn()` redirecting the browser to `${VITE_API_URL}/api/auth/linkedin`
  * `logout()`
  * `getToken()` retrieving fresh Firebase ID tokens
* The provider also tracks Firebase auth state through `onAuthStateChanged`.

### 6. LinkedIn Callback and Two-Factor Enforcement
* `frontend/src/pages/LinkedInCallback.jsx` signs in with the custom token returned through the one-time exchange, then checks 2FA status through `twoFactorApi.getStatus()`.
* If two-factor is enabled, the page enters the TOTP verification step and requires an authenticator or backup code before continuing.
* The two-factor endpoints implemented in `backend/src/routes/twoFactor.js` include:
  * `GET /api/auth/2fa/status`
  * `POST /api/auth/2fa/setup`
  * `POST /api/auth/2fa/enable`
  * `POST /api/auth/2fa/disable`
  * `POST /api/auth/2fa/verify`
  * `POST /api/auth/2fa/verify-backup`
  * `POST /api/auth/2fa/backup-codes/regenerate`
  * `POST /api/auth/2fa/disable-with-backup`

## Part 5: API Request & Response Reference

### 1. Shared Response Envelope and Error Handling
* Backend route handlers consistently use structured success envelopes such as:
  * `success: true` with `data`, `message`, or `meta`
  * `success: false` with `error` and optional `details`
* `backend/src/middleware/errorHandler.js` centralizes error formatting and emits these shapes for validation failures, auth failures, upload failures, and unexpected exceptions.
* `backend/src/middleware/validate.js` returns structured validation errors with `error: "Validation failed"` and a `details` array containing `{ field, message }` entries.

### 2. Auth and Token Handling in the Frontend
* `frontend/src/services/api.js` centralizes authenticated API access through `getAuthHeaders()`.
* The helper reads the current Firebase user, obtains a fresh ID token with `user.getIdToken()`, and sends:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
  * optional AI/provider headers stored in browser local storage
* `handleResponse()` checks `response.ok`, parses JSON when available, falls back to text parsing for non-JSON bodies, and throws an `Error` annotated with HTTP `status`.
* On `429` responses, the helper also preserves `retryAfter`, `x-ratelimit-limit`, `x-ratelimit-remaining`, and `x-ratelimit-reset` metadata when present.

### 3. File Upload and Resume Extraction
* `backend/src/middleware/upload.js` enforces a 5MB limit and only allows `.pdf` uploads with `application/pdf` MIME type.
* `backend/src/middleware/uploadValidator.js` validates PDF magic bytes (`%PDF`) and enforces a 20MB per-user daily upload budget using in-memory tracking keyed by UID.
* `POST /api/upload` (implemented in `backend/src/routes/upload.js`) requires the Firebase bearer token and returns a success envelope shaped like:
  ```json
  {
    "success": true,
    "data": {
      "resumeId": "uuid",
      "originalFilename": "resume.pdf",
      "size": 123456,
      "extractedText": "...",
      "pageCount": 3,
      "metadata": {
        "info": { },
        "uploadedAt": "2026-05-28T12:00:00.000Z"
      }
    }
  }
  ```
* `POST /api/upload/extract-text` returns `{ success: true, data: { text, pageCount } }` after re-processing the uploaded PDF.
* The frontend `uploadApi` uses `FormData` and sends the file under the `resume` field.

### 4. Resume CRUD, Versioning, and ATS History
* Protected resume routes live in `backend/src/routes/resume.js` and rely on `verifyToken` for access control.
* The route layer uses `paginate()` and `paginatedResponse()` for list endpoints, so paginated responses are returned as `{ success: true, data, meta }` rather than raw arrays.
* Representative success shapes:
  * `GET /api/resumes` returns paginated resume data with `meta.total`, `meta.page`, `meta.limit`, `meta.totalPages`, `hasNextPage`, and `hasPrevPage`.
  * `POST /api/resumes` returns `201` with `{ success: true, data: { id, userId, originalText, enhancedText, jobRole, preferences, title, pdfUrl, createdAt, lastModified } }`.
  * `PUT /api/resumes/:resumeId` returns updated resume data under `data`.
  * `DELETE /api/resumes/:resumeId` returns `{ success: true, message: "Resume deleted successfully" }`.
* Versioning endpoints are also authenticated and return `success: true` envelopes:
  * `GET /api/resumes/:resumeId/versions`
  * `POST /api/resumes/:resumeId/versions`
  * `PUT /api/resumes/:resumeId/versions/:versionId`
  * `DELETE /api/resumes/:resumeId/versions/:versionId`
  * `POST /api/resumes/:resumeId/versions/:versionId/restore`
* ATS history follows the same contract under `GET /api/resumes/:resumeId/ats-history` and `POST /api/resumes/:resumeId/ats-history`.

### 5. Community, Messaging, and Presence Payloads
* `backend/src/routes/community.js` mounts all community endpoints behind `verifyToken`, so every community request carries authenticated context.
* The Firestore-backed controller in `backend/src/controllers/communityFirebaseController.js` uses success envelopes like:
  * `{ success: true, channels, pagination }`
  * `{ success: true, posts, pagination }`
  * `{ success: true, comments, pagination }`
  * `{ success: true, conversations }`
  * `{ success: true, messages, conversation }`
  * `{ success: true, results }`
* Representative payload conventions:
  * `getPosts()` returns `posts` with derived `likeCount` and `pagination.nextCursor` values.
  * `getComments()` returns top-level comments plus nested `replies` and pagination metadata.
  * `getConversations()` includes `otherParticipant`, `isOnline`, and `unreadCount` fields.
  * `searchCommunity()` returns a `results` object with `posts`, `channels`, and `messages` arrays.
* The frontend `communityApi` wrappers call `/community/channels`, `/community/posts`, `/community/posts/:postId/comments`, `/community/conversations`, `/community/online-users`, and `/community/search` using bearer tokens.

### 6. Real-Time Socket Contract
* `frontend/src/services/socket.js` initializes Socket.IO with the current Firebase token by calling `user.getIdToken()` and connecting with:
  ```js
  io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling']
  })
  ```
* The client exposes helpers for channel events, direct messages, post subscriptions, likes, reactions, typing indicators, and presence updates.
* The server-side auth middleware validates the same token on connection and populates `socket.user` for event handling.

### 7. Domain API Wrappers Reusing the Same Contract
* The frontend uses domain-specific wrappers in `frontend/src/services/api.js` that all share the same authenticated request pattern:
  * `authApi` for token/profile helpers
  * `uploadApi` for PDF upload and extraction
  * `resumeApi` for resume and version lifecycle
  * `communityApi` for Firestore-based discussion features
  * `fellowshipApi` for fellowship profile, challenges, proposals, and chat rooms
  * `interviewApi` for mock interview lifecycle
  * `userProfileApi` for profile and activity reads
  * `twoFactorApi` for 2FA status, setup, verification, backup codes, and disable flows
* Every wrapper reads the current Firebase token, forwards it as `Authorization: Bearer ...`, and relies on `handleResponse()` to surface either parsed payloads or checked HTTP failures.


