# 📚 API Documentation

<div align="center">

**Complete API Reference for AI Resume Builder & Career Platform**

Version: 1.0.0 | Base URL: `http://localhost:5001/api`

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [Auth](#auth-endpoints)
  - [Upload](#upload-endpoints)
  - [Resume](#resume-endpoints)
  - [AI Enhancement](#ai-enhancement-endpoints)
  - [Job Search](#job-search-endpoints)
  - [Job Alerts](#job-alerts-endpoints)
  - [Job Tracker](#job-tracker-endpoints)
  - [Community](#community-endpoints)
  - [Admin](#admin-endpoints)
- [WebSocket Events](#websocket-events)
- [Models](#data-models)

---

## Overview

The AI Resume Builder API is a RESTful API that provides endpoints for resume management, AI enhancement, job searching, and community features. All endpoints (except health check) require authentication via Firebase JWT tokens.

### Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:5001/api` |
| Production | `https://api.yourdomain.com/api` |

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-08T10:30:00.000Z",
  "environment": "development"
}
```

---

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header.

### Request Header

```http
Authorization: Bearer <firebase_id_token>
```

### Getting a Token

```javascript
// Frontend: Get token from Firebase Auth
import { auth } from './config/firebase';

const token = await auth.currentUser.getIdToken();
```

### Token Verification

The backend verifies tokens using Firebase Admin SDK:

```javascript
// Decoded user object available in req.user
{
  uid: "firebase_user_id",
  email: "user@example.com",
  name: "John Doe",
  picture: "https://..."
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Missing/invalid token |
| `403` | Forbidden - Access denied |
| `404` | Not Found - Resource doesn't exist |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |

### Common Errors

```json
// 401 Unauthorized
{
  "success": false,
  "error": "No authorization token provided"
}

// 404 Not Found
{
  "success": false,
  "error": "Resume not found"
}

// 429 Rate Limited
{
  "error": "Too many requests, please try again later."
}
```

---

## Rate Limiting

| Window | Max Requests | Scope |
|--------|-------------|-------|
| 15 minutes | 100 | Per IP address |

When rate limited, the API returns a `429` status with:
```json
{
  "error": "Too many requests, please try again later."
}
```

---

## Endpoints

---

## Auth Endpoints

### Verify Token

Verifies the Firebase ID token and returns user information.

```http
POST /api/auth/verify
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "firebase_uid",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

---

### Get Profile

Retrieves the authenticated user's profile.

```http
GET /api/auth/profile
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "firebase_uid",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
  }
}
```

---

## Upload Endpoints

### Upload PDF Resume

Uploads a PDF file and extracts text content.

```http
POST /api/upload
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
file: <PDF file> (max 10MB)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resumeId": "uuid-v4-string",
    "originalFilename": "resume.pdf",
    "size": 125432,
    "extractedText": "John Doe\nSoftware Engineer\n...",
    "pageCount": 2,
    "metadata": {
      "info": { ... },
      "uploadedAt": "2026-01-08T10:30:00.000Z"
    }
  }
}
```

**Errors:**
- `400` - No file uploaded
- `400` - Failed to parse PDF

---

### Extract Text Only

Extracts text from a PDF without creating a resume record.

```http
POST /api/upload/extract-text
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
file: <PDF file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "pageCount": 2
  }
}
```

---

## Resume Endpoints

### List All Resumes

Retrieves all resumes for the authenticated user.

```http
GET /api/resumes
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resumes": [
      {
        "id": "resume_id",
        "userId": "firebase_uid",
        "originalText": "...",
        "enhancedText": "...",
        "jobRole": "Software Engineer",
        "preferences": {
          "yearsOfExperience": 5,
          "skills": ["React", "Node.js"],
          "industry": "Technology"
        },
        "title": "Tech Resume",
        "pdfUrl": null,
        "createdAt": "2026-01-08T10:30:00.000Z",
        "lastModified": "2026-01-08T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### Get Single Resume

Retrieves a specific resume by ID.

```http
GET /api/resumes/:resumeId
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `resumeId` | string | MongoDB ObjectId |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "resume_id",
    "userId": "firebase_uid",
    "originalText": "...",
    "enhancedText": "...",
    "jobRole": "Software Engineer",
    "preferences": { ... },
    "title": "Tech Resume",
    "createdAt": "2026-01-08T10:30:00.000Z",
    "lastModified": "2026-01-08T10:30:00.000Z"
  }
}
```

**Errors:**
- `404` - Resume not found
- `403` - Access denied

---

### Create Resume

Creates a new resume record.

```http
POST /api/resumes
```

**Headers:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "originalText": "John Doe\nSoftware Engineer...",
  "enhancedText": "# John Doe\n## Summary...",
  "jobRole": "Software Engineer",
  "preferences": {
    "yearsOfExperience": 5,
    "skills": ["React", "Node.js"],
    "industry": "Technology",
    "customInstructions": "Focus on leadership"
  },
  "title": "Tech Resume 2026"
}
```

**Required Fields:**
- `originalText`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "new_resume_id",
    "userId": "firebase_uid",
    "originalText": "...",
    "enhancedText": "...",
    "jobRole": "Software Engineer",
    "preferences": { ... },
    "title": "Tech Resume 2026",
    "createdAt": "2026-01-08T10:30:00.000Z"
  }
}
```

---

### Update Resume

Updates an existing resume.

```http
PUT /api/resumes/:resumeId
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `resumeId` | string | MongoDB ObjectId |

**Body:**
```json
{
  "enhancedText": "Updated enhanced content...",
  "title": "Updated Title",
  "jobRole": "Senior Software Engineer"
}
```

**Allowed Fields:**
- `originalText`
- `enhancedText`
- `jobRole`
- `preferences`
- `title`
- `pdfUrl`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "resume_id",
    "userId": "firebase_uid",
    "originalText": "...",
    "enhancedText": "Updated enhanced content...",
    "title": "Updated Title",
    "lastModified": "2026-01-08T11:00:00.000Z"
  }
}
```

---

### Delete Resume

Deletes a resume.

```http
DELETE /api/resumes/:resumeId
```

**Response:**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

### Download Resume as PDF

Downloads the resume as a formatted PDF file.

```http
GET /api/resumes/:resumeId/download?version=enhanced
```

**Query Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `version` | string | `enhanced` | `enhanced` or `original` |

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="resume.pdf"`

---

## AI Enhancement Endpoints

### Enhance Resume

Enhances a resume using Google Gemini AI.

```http
POST /api/enhance
```

**Body:**
```json
{
  "resumeText": "John Doe\nSoftware Engineer at Google...",
  "preferences": {
    "jobRole": "Senior Software Engineer",
    "yearsOfExperience": 5,
    "skills": ["React", "Node.js", "Python"],
    "industry": "Technology",
    "customInstructions": "Emphasize leadership experience"
  }
}
```

**Required Fields:**
- `resumeText`
- `preferences.jobRole`

**Response:**
```json
{
  "success": true,
  "data": {
    "enhancedResume": "# John Doe\n\n[email@domain.com](mailto:email@domain.com) | ...",
    "tokensUsed": {
      "prompt": 0,
      "completion": 0,
      "total": 0
    },
    "processedAt": "2026-01-08T10:30:00.000Z"
  }
}
```

---

### Generate Summary

Generates a professional summary for a resume.

```http
POST /api/enhance/summary
```

**Body:**
```json
{
  "resumeText": "John Doe\nSoftware Engineer...",
  "jobRole": "Senior Software Engineer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Results-driven Senior Software Engineer with 5+ years of experience..."
  }
}
```

---

### Get Improvement Suggestions

Gets AI-generated suggestions for improving the resume.

```http
POST /api/enhance/suggestions
```

**Body:**
```json
{
  "resumeText": "John Doe\nSoftware Engineer...",
  "jobRole": "Senior Software Engineer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": "1. Add quantifiable achievements...\n2. Include relevant certifications..."
  }
}
```

---

### ATS Analysis

Analyzes resume compatibility with Applicant Tracking Systems.

```http
POST /api/enhance/ats-analysis
```

**Body:**
```json
{
  "resumeText": "John Doe\nSoftware Engineer...",
  "jobRole": "Senior Software Engineer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 85,
    "strengths": ["Good keyword usage", "Clear formatting"],
    "improvements": ["Add more metrics", "Include certifications"],
    "keywords": {
      "found": ["JavaScript", "React", "Node.js"],
      "missing": ["TypeScript", "AWS"]
    }
  }
}
```

---

## Job Search Endpoints

### Search Jobs

Searches for jobs using RapidAPI JSearch.

```http
GET /api/fetchjobs?query=software+engineer&location=New+York&page=1
```

**Query Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `query` | string | required | Search keywords |
| `location` | string | optional | Job location |
| `page` | number | `1` | Page number |
| `employment_types` | string | optional | FULLTIME,PARTTIME,CONTRACTOR,INTERN |
| `remote_jobs_only` | boolean | `false` | Remote jobs filter |

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "job_id": "unique_job_id",
        "job_title": "Software Engineer",
        "employer_name": "Google",
        "employer_logo": "https://...",
        "job_city": "New York",
        "job_state": "NY",
        "job_country": "US",
        "job_employment_type": "FULLTIME",
        "job_salary_min": 100000,
        "job_salary_max": 150000,
        "job_description": "...",
        "job_apply_link": "https://...",
        "job_posted_at_datetime_utc": "2026-01-08T10:30:00.000Z"
      }
    ],
    "count": 10,
    "page": 1
  }
}
```

---

## Job Alerts Endpoints

### List All Alerts

Gets all job alerts for the user.

```http
GET /api/job-alerts
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "alerts": [
    {
      "_id": "alert_id",
      "userId": "firebase_uid",
      "userEmail": "user@example.com",
      "title": "React Developer Jobs",
      "keywords": ["React", "Frontend"],
      "location": "New York",
      "remoteOnly": false,
      "salaryMin": 80000,
      "salaryMax": 150000,
      "employmentType": ["full-time"],
      "isActive": true,
      "lastCheckedAt": "2026-01-08T10:30:00.000Z",
      "totalJobsFound": 45,
      "totalEmailsSent": 12,
      "position": 1
    }
  ]
}
```

---

### Get Alert Statistics

Gets summary statistics for user's alerts.

```http
GET /api/job-alerts/stats/summary
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalAlerts": 3,
    "activeAlerts": 2,
    "totalJobsFound": 150,
    "totalEmailsSent": 45,
    "queueStatus": {
      "available": true,
      "waiting": 5,
      "active": 1,
      "completed": 100
    }
  }
}
```

---

### Get Single Alert

Gets a specific alert with notification history.

```http
GET /api/job-alerts/:id
```

**Response:**
```json
{
  "success": true,
  "alert": {
    "_id": "alert_id",
    "title": "React Developer Jobs",
    "keywords": ["React"],
    "location": "New York",
    "isActive": true,
    ...
  },
  "notificationHistory": [
    {
      "_id": "notification_id",
      "type": "email",
      "status": "sent",
      "sentAt": "2026-01-08T10:30:00.000Z",
      "jobListingId": {
        "title": "React Developer",
        "company": "StartupXYZ",
        "location": "New York"
      },
      "position": 1
    }
  ]
}
```

---

### Create Alert

Creates a new job alert.

```http
POST /api/job-alerts
```

**Body:**
```json
{
  "title": "Python Backend Jobs",
  "keywords": ["Python", "Django", "FastAPI"],
  "location": "San Francisco",
  "remoteOnly": true,
  "salaryMin": 100000,
  "salaryMax": 200000,
  "employmentType": ["full-time", "contract"]
}
```

**Required Fields:**
- `title`

**Response:**
```json
{
  "success": true,
  "message": "Job alert created successfully",
  "alert": {
    "_id": "new_alert_id",
    "title": "Python Backend Jobs",
    "isActive": true,
    ...
  }
}
```

---

### Update Alert

Updates an existing alert.

```http
PUT /api/job-alerts/:id
```

**Body:**
```json
{
  "title": "Updated Title",
  "keywords": ["Updated", "Keywords"],
  "isActive": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job alert updated successfully",
  "alert": { ... }
}
```

---

### Delete Alert

Deletes a job alert.

```http
DELETE /api/job-alerts/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Job alert deleted successfully"
}
```

---

## Job Tracker Endpoints

### List Tracked Jobs

Gets all tracked jobs for the user.

```http
GET /api/job-tracker
```

**Response:**
```json
{
  "success": true,
  "trackedJobs": [
    {
      "id": "tracked_job_id",
      "userId": "firebase_uid",
      "jobId": "external_job_id",
      "title": "Software Engineer",
      "company": "Google",
      "location": "Mountain View, CA",
      "jobType": "Full-time",
      "salary": "$150,000 - $200,000",
      "applyLink": "https://careers.google.com/...",
      "status": "applied",
      "notes": [
        {
          "text": "Applied via website",
          "createdAt": "2026-01-08T10:30:00.000Z"
        }
      ],
      "createdAt": "2026-01-08T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Get Tracker Statistics

Gets application statistics.

```http
GET /api/job-tracker/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 25,
    "saved": 10,
    "applied": 8,
    "interviewing": 4,
    "offered": 2,
    "rejected": 1
  }
}
```

---

### Track New Job

Adds a job to the tracker.

```http
POST /api/job-tracker
```

**Body:**
```json
{
  "jobId": "external_job_id",
  "title": "Software Engineer",
  "company": "Google",
  "location": "Mountain View, CA",
  "jobType": "Full-time",
  "salary": "$150,000 - $200,000",
  "applyLink": "https://careers.google.com/...",
  "description": "Job description...",
  "status": "saved"
}
```

**Required Fields:**
- `title`
- `company`

**Response:**
```json
{
  "success": true,
  "message": "Job tracked successfully",
  "data": {
    "id": "new_tracked_job_id",
    ...
  }
}
```

---

### Update Tracked Job

Updates status or adds notes to a tracked job.

```http
PUT /api/job-tracker/:trackerId
```

**Body:**
```json
{
  "status": "interviewing",
  "notes": "Phone screen scheduled for Monday"
}
```

**Valid Status Values:**
- `saved`
- `applied`
- `interviewing`
- `offered`
- `rejected`

**Response:**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": { ... }
}
```

---

### Delete Tracked Job

Removes a job from the tracker.

```http
DELETE /api/job-tracker/:trackerId
```

**Response:**
```json
{
  "success": true,
  "message": "Tracked job deleted successfully"
}
```

---

## Community Endpoints

### Channels

#### List Channels

```http
GET /api/community/channels
```

**Response:**
```json
{
  "success": true,
  "channels": [
    {
      "id": "channel_id",
      "name": "general",
      "description": "General discussions",
      "memberCount": 150,
      "isDefault": true,
      "lastMessage": {
        "content": "Hello everyone!",
        "senderName": "John",
        "timestamp": "2026-01-08T10:30:00.000Z"
      }
    }
  ]
}
```

#### Create Channel

```http
POST /api/community/channels
```

**Body:**
```json
{
  "name": "react-developers",
  "description": "Discussions about React.js"
}
```

#### Get Channel Messages

```http
GET /api/community/channels/:channelId/messages?limit=50
```

**Query Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | number | `50` | Messages to retrieve |
| `before` | string | optional | Cursor for pagination |

#### Join Channel

```http
POST /api/community/channels/:channelId/join
```

#### Leave Channel

```http
POST /api/community/channels/:channelId/leave
```

---

### Posts

#### List Posts

```http
GET /api/community/posts?page=1&limit=20
```

**Query Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Posts per page |
| `tag` | string | optional | Filter by tag |

#### Create Post

```http
POST /api/community/posts
```

**Body:**
```json
{
  "title": "Tips for Technical Interviews",
  "content": "Here are my top tips for acing technical interviews...",
  "tags": ["interviews", "tips", "career"]
}
```

#### Get Post

```http
GET /api/community/posts/:postId
```

#### Update Post

```http
PUT /api/community/posts/:postId
```

#### Delete Post

```http
DELETE /api/community/posts/:postId
```

#### Toggle Like

```http
POST /api/community/posts/:postId/like
```

---

### Comments

#### Get Comments

```http
GET /api/community/posts/:postId/comments
```

#### Add Comment

```http
POST /api/community/posts/:postId/comments
```

**Body:**
```json
{
  "content": "Great post! Very helpful."
}
```

#### Toggle Comment Like

```http
POST /api/community/comments/:commentId/like
```

---

### Direct Messages

#### Get Conversations

```http
GET /api/community/conversations
```

#### Get Conversation Messages

```http
GET /api/community/conversations/:conversationId/messages
```

---

### Presence

#### Get Online Users

```http
GET /api/community/online-users
```

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "uid": "user_id",
      "name": "John Doe",
      "photoURL": "https://...",
      "lastSeen": "2026-01-08T10:30:00.000Z"
    }
  ]
}
```

---

## Admin Endpoints

### Sync to Firebase

Syncs MongoDB data to Firebase Firestore.

```http
POST /api/admin/sync-to-firebase
```

**Response:**
```json
{
  "success": true,
  "message": "Data synced to Firebase successfully",
  "timestamp": "2026-01-08T10:30:00.000Z"
}
```

---

### Save Profile

Saves user profile to Firebase.

```http
POST /api/admin/save-my-profile
```

**Body:**
```json
{
  "bio": "Software Engineer",
  "location": "San Francisco",
  "website": "https://johndoe.com"
}
```

---

### Get System Stats

Gets system-wide statistics.

```http
GET /api/admin/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalAlerts": 500,
    "activeAlerts": 350,
    "totalNotifications": 10000,
    "totalJobs": 25000,
    "timestamp": "2026-01-08T10:30:00.000Z"
  }
}
```

---

## WebSocket Events

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001', {
  auth: { token: 'firebase_id_token' }
});
```

### Client Events (Emit)

| Event | Payload | Description |
|-------|---------|-------------|
| `join_channel` | `{ channelId }` | Join a channel room |
| `leave_channel` | `{ channelId }` | Leave a channel room |
| `send_message` | `{ channelId, content }` | Send channel message |
| `send_dm` | `{ recipientId, content }` | Send direct message |
| `typing_start` | `{ channelId }` | User started typing |
| `typing_stop` | `{ channelId }` | User stopped typing |
| `add_reaction` | `{ messageId, emoji }` | Add reaction to message |
| `remove_reaction` | `{ messageId, emoji }` | Remove reaction |

### Server Events (Listen)

| Event | Payload | Description |
|-------|---------|-------------|
| `new_message` | `{ message, channelId }` | New channel message |
| `new_dm` | `{ message, senderId }` | New direct message |
| `user_online` | `{ uid, name }` | User came online |
| `user_offline` | `{ uid, name }` | User went offline |
| `typing` | `{ userId, channelId }` | Someone is typing |
| `reaction_added` | `{ messageId, emoji, user }` | Reaction added |
| `reaction_removed` | `{ messageId, emoji, userId }` | Reaction removed |
| `job_alert_processing` | `{ alertId, alertTitle }` | Alert being processed |
| `new_jobs_found` | `{ alertId, jobs }` | New jobs matched alert |
| `email_sent` | `{ alertId, jobCount }` | Alert email sent |

### Example Usage

```javascript
// Join channel
socket.emit('join_channel', { channelId: 'general' });

// Send message
socket.emit('send_message', {
  channelId: 'general',
  content: 'Hello everyone!'
});

// Listen for messages
socket.on('new_message', (data) => {
  console.log('New message:', data.message);
});

// Listen for job alerts
socket.on('new_jobs_found', (data) => {
  console.log(`${data.jobs.length} new jobs found for alert ${data.alertId}`);
});
```

---

## Data Models

### Resume

```typescript
interface Resume {
  id: string;
  userId: string;
  originalText: string;
  enhancedText: string | null;
  jobRole: string | null;
  preferences: {
    yearsOfExperience: number;
    skills: string[];
    industry: string;
    customInstructions: string;
  };
  title: string;
  pdfUrl: string | null;
  createdAt: Date;
  lastModified: Date;
}
```

### JobAlert

```typescript
interface JobAlert {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  title: string;
  keywords: string[];
  location: string;
  remoteOnly: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType: ('full-time' | 'part-time' | 'contract' | 'internship')[];
  isActive: boolean;
  lastCheckedAt: Date | null;
  totalJobsFound: number;
  totalEmailsSent: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### TrackedJob

```typescript
interface TrackedJob {
  id: string;
  userId: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string | null;
  applyLink: string | null;
  description: string | null;
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  notes: Array<{
    text: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## SDK Examples

### JavaScript/TypeScript

```javascript
// api.js
const API_BASE = 'http://localhost:5001/api';

export const api = {
  async request(endpoint, options = {}) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  },

  resumes: {
    getAll: () => api.request('/resumes'),
    get: (id) => api.request(`/resumes/${id}`),
    create: (data) => api.request('/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => api.request(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => api.request(`/resumes/${id}`, { method: 'DELETE' }),
  },

  enhance: {
    full: (resumeText, preferences) => api.request('/enhance', {
      method: 'POST',
      body: JSON.stringify({ resumeText, preferences }),
    }),
    summary: (resumeText, jobRole) => api.request('/enhance/summary', {
      method: 'POST',
      body: JSON.stringify({ resumeText, jobRole }),
    }),
  },
};
```

---

<div align="center">

**[Back to Main README](../README.md)** | **[Architecture](../ARCHITECTURE.md)**

</div>
