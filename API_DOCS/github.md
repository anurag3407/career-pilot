# 👤 GitHub Intelligence / User Profile API

> Base URL: `http://localhost:5000/api`
> All endpoints require `Authorization: Bearer <firebase_id_token>`

---

## Table of Contents

- [Own Profile](#own-profile)
- [Public Profiles](#public-profiles)

---

## Own Profile

### Get My Profile

Returns the authenticated user's profile. Creates one automatically if it doesn't exist yet.

```http
GET /api/user-profile/me
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "uid": "firebase_uid",
    "displayName": "Jane Doe",
    "bio": "Full-stack developer passionate about open source",
    "jobRole": "Software Engineer",
    "skills": ["React", "Node.js", "Python"],
    "location": "San Francisco, CA",
    "website": "https://janedoe.dev",
    "github": "janedoe",
    "linkedin": "https://linkedin.com/in/janedoe"
  }
}
```

---

### Update My Profile

```http
PUT /api/user-profile/me
```

**Body:**
```json
{
  "displayName": "Jane Doe",
  "bio": "Full-stack developer passionate about open source",
  "jobRole": "Senior Software Engineer",
  "skills": ["React", "Node.js", "Python"],
  "location": "San Francisco, CA",
  "website": "https://janedoe.dev",
  "github": "janedoe",
  "linkedin": "https://linkedin.com/in/janedoe"
}
```

| Field | Type | Max Length | Notes |
|-------|------|------------|-------|
| `displayName` | string | 100 | Public display name |
| `bio` | string | 500 | Short bio |
| `jobRole` | string | 100 | Current or target job role |
| `skills` | string[] | 20 items | List of skills |
| `location` | string | 100 | City, country |
| `website` | string | 200 | Personal website URL |
| `github` | string | 100 | GitHub username |
| `linkedin` | string | 200 | LinkedIn profile URL |

**Response:**
```json
{
  "success": true,
  "profile": { ...updatedProfile }
}
```

---

### Get My Stats

Returns resume and interview counts for the authenticated user.

```http
GET /api/user-profile/me/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "resumesCreated": 5,
    "interviewsDone": 3
  }
}
```

---

### Get My Activity Feed

Returns the last 10 published community posts by the authenticated user.

```http
GET /api/user-profile/me/activity
```

**Response:**
```json
{
  "success": true,
  "activity": [
    {
      "id": "post_id",
      "type": "post",
      "title": "Tips for Technical Interviews",
      "content": "Here are my top tips...",
      "category": "career",
      "likeCount": 12,
      "commentCount": 4,
      "createdAt": "2026-05-20T10:00:00.000Z"
    }
  ]
}
```

---

## Public Profiles

### Get Public Profile by UID

```http
GET /api/user-profile/:uid
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "uid": "firebase_uid",
    "displayName": "Jane Doe",
    "bio": "Full-stack developer",
    "jobRole": "Software Engineer",
    "skills": ["React", "Node.js"],
    "location": "San Francisco, CA",
    "github": "janedoe"
  }
}
```

**Errors:**
- `404` - Profile not found

---

### Get Public Stats by UID

```http
GET /api/user-profile/:uid/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "resumesCreated": 5,
    "interviewsDone": 3
  }
}
```

---

### Get Public Activity by UID

Returns the last 10 published community posts by the specified user.

```http
GET /api/user-profile/:uid/activity
```

**Response:**
```json
{
  "success": true,
  "activity": [
    {
      "id": "post_id",
      "type": "post",
      "title": "How I landed my first dev job",
      "content": "...",
      "category": "career",
      "likeCount": 24,
      "commentCount": 8,
      "createdAt": "2026-05-15T09:00:00.000Z"
    }
  ]
}
```
