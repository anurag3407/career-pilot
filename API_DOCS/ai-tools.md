# 🤖 AI Career Tools API

> Base URL: `http://localhost:5000/api`
> All endpoints require `Authorization: Bearer <firebase_id_token>`

---

## Table of Contents

- [AI Interview](#ai-interview)
- [Search](#search)

---

## AI Interview

> Base path: `/api/interview`
> AI endpoints are rate-limited. Exceeding limits returns `429`.

### Start Interview Session

Generates AI interview questions and creates a new session.

```http
POST /api/interview/start
```

**Body:**
```json
{
  "jobRole": "Frontend Developer",
  "industry": "Technology",
  "experienceLevel": "mid",
  "questionCount": 10,
  "resumeText": "Optional resume text for tailored questions..."
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `jobRole` | string | ✅ | Target job role |
| `industry` | string | ✅ | Industry sector |
| `experienceLevel` | string | ✅ | e.g. `fresher`, `mid`, `senior` |
| `questionCount` | number | ❌ | Between 2–20, default 10 |
| `resumeText` | string | ❌ | Resume content for tailored questions |

**Response:**
```json
{
  "success": true,
  "data": {
    "interviewId": "interview_id",
    "questions": [
      {
        "questionId": "q1",
        "question": "Explain the virtual DOM in React."
      }
    ]
  }
}
```

**Errors:**
- `400` - Missing required fields
- `429` - AI rate limit exceeded

---

### Submit Answer

Submits a recorded answer for AI analysis.

```http
POST /api/interview/:id/answer
```

**Body:**
```json
{
  "questionId": "q1",
  "transcript": "The virtual DOM is a lightweight copy of the real DOM...",
  "duration": 45,
  "expressionMetrics": {
    "averageConfidence": 0.82,
    "eyeContactPercentage": 75,
    "headMovementStability": 0.9,
    "overallExpressionScore": 0.85
  }
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `questionId` | string | ✅ | From the questions list |
| `transcript` | string | ✅ | Spoken answer text |
| `duration` | number | ✅ | Answer duration in seconds |
| `expressionMetrics` | object | ❌ | Camera-based metrics |

**Response:**
```json
{
  "success": true,
  "data": {
    "questionId": "q1",
    "analysis": {
      "score": 78,
      "feedback": "Good explanation of virtual DOM concepts...",
      "strengths": ["Clear explanation", "Good examples"],
      "improvements": ["Could mention reconciliation algorithm"]
    },
    "answeredCount": 3,
    "totalQuestions": 10
  }
}
```

**Errors:**
- `400` - Question already answered
- `400` - Interview already completed
- `404` - Interview or question not found

---

### Complete Interview

Finalises the session and generates overall AI feedback and score.

```http
POST /api/interview/:id/complete
```

**Response:**
```json
{
  "success": true,
  "data": {
    "interviewId": "interview_id",
    "overallScore": 82,
    "overallFeedback": "Strong performance overall. Technical knowledge is solid...",
    "answeredQuestions": 10,
    "totalQuestions": 10,
    "duration": 1240,
    "answers": [ ...allAnswers ]
  }
}
```

**Errors:**
- `400` - Interview already completed
- `404` - Interview not found

---

### Get Interview History

Returns the last 20 interview sessions for the user.

```http
GET /api/interview/history
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "interview_id",
      "jobRole": "Frontend Developer",
      "industry": "Technology",
      "experienceLevel": "mid",
      "status": "completed",
      "overallScore": 82,
      "createdAt": "2026-05-20T10:00:00.000Z",
      "completedAt": "2026-05-20T10:21:00.000Z",
      "duration": 1240
    }
  ]
}
```

---

### Get Single Interview

```http
GET /api/interview/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "interview_id",
    "jobRole": "Frontend Developer",
    "questions": [ ... ],
    "answers": [ ... ],
    "overallScore": 82,
    "overallFeedback": "...",
    "status": "completed"
  }
}
```

**Errors:**
- `404` - Interview not found

---

## Search

### Search Resumes and Jobs

Searches across resumes and/or job listings.

```http
GET /api/search?q=react+developer&type=all
```

**Query Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `q` | string | required | Search query (min 2 characters) |
| `type` | string | `all` | `resume`, `job`, or `all` |

**Response:**
```json
{
  "success": true,
  "query": "react developer",
  "type": "all",
  "count": 5,
  "results": [
    {
      "type": "resume",
      "id": "resume_id",
      "title": "Tech Resume 2026",
      "snippet": "...experienced React developer with 3 years..."
    },
    {
      "type": "job",
      "job_id": "job_id",
      "job_title": "React Developer",
      "employer_name": "StartupXYZ"
    }
  ]
}
```

**Errors:**
- `400` - Query must be at least 2 characters
- `500` - Search failed
