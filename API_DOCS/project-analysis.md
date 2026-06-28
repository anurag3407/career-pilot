# 🔍 Project Analysis API

> Base URL: `http://localhost:5000/api/repo-analyzer`
> All endpoints require `Authorization: Bearer <firebase_id_token>`

---

## Table of Contents

* [Analyze Repository](#analyze-repository)
* [Get Analysis](#get-analysis)
* [Read File Content](#read-file-content)
* [Contributors](#contributors)
* [Commits](#commits)
* [Chat](#chat)
* [Ask Module](#ask-module)
* [History](#history)

---

## Analyze Repository

Analyze a GitHub repository and generate project insights.

```http
POST /api/repo-analyzer/analyze
```

**Body:**

```json
{
  "repoUrl": "https://github.com/facebook/react"
}
```

**Response:**

```json
{
  "repoUrl": "https://github.com/facebook/react",
  "repoName": "react",
  "repoOwner": "facebook",
  "sessionId": "session_id",
  "status": "complete",
  "stats": {},
  "modules": [],
  "risks": [],
  "suggestions": [],
  "contributors": [],
  "commits": []
}
```

**Errors:**

* `400` - Valid GitHub repoUrl is required
* `400` - Invalid GitHub URL format
* `500` - Failed to analyze repository

---

## Get Analysis

Returns a previously generated analysis.

```http
GET /api/repo-analyzer/analysis/:sessionId
```

**Response:**

```json
{
  "sessionId": "session_id",
  "repoUrl": "https://github.com/facebook/react",
  "repoName": "react",
  "status": "complete",
  "stats": {},
  "modules": [],
  "risks": []
}
```

**Errors:**

* `403` - Access denied
* `404` - Analysis not found

---

## Read File Content

Returns the content of a file from the analyzed repository.

```http
GET /api/repo-analyzer/analysis/:sessionId/file?path=src/App.js
```

**Response:**

Plain text file content.

**Errors:**

* `400` - path is required
* `403` - Invalid file path
* `404` - Session not found or expired

---

## Contributors

Returns repository contributors.

```http
GET /api/repo-analyzer/analysis/:sessionId/contributors
```

**Response:**

```json
[
  {
    "login": "octocat",
    "contributions": 120
  }
]
```

**Errors:**

* `404` - Analysis not found

---

## Commits

Returns recent repository commits.

```http
GET /api/repo-analyzer/analysis/:sessionId/commits
```

**Response:**

```json
[
  {
    "sha": "abc123",
    "message": "Initial commit"
  }
]
```

**Errors:**

* `404` - Analysis not found

---

## Chat

Chat with the analyzed repository using AI.

```http
POST /api/repo-analyzer/analysis/:sessionId/chat
```

**Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Explain the authentication flow"
    }
  ],
  "chatMode": "analysis"
}
```

**Errors:**

* `400` - messages are required
* `404` - Session not found or expired

---

## Ask Module

Ask questions about a specific module in the repository.

```http
POST /api/repo-analyzer/analysis/:sessionId/ask-module
```

**Body:**

```json
{
  "modulePath": "src/auth",
  "question": "What is this module responsible for?"
}
```

**Errors:**

* `400` - modulePath and question are required
* `404` - Session not found or expired
* `404` - Module not found in session

---

## History

### Get Analysis History

Returns recent repository analyses for the authenticated user.

```http
GET /api/repo-analyzer/history
```

**Response:**

```json
[
  {
    "_id": "history_id",
    "repoUrl": "https://github.com/facebook/react",
    "lastAnalyzed": "2026-06-05T10:00:00.000Z"
  }
]
```

---

### Delete History Entry

```http
DELETE /api/repo-analyzer/history/:id
```

**Response:**

```json
{
  "success": true
}
```

**Errors:**

* `500` - Failed to delete history

---

## Notes

* Repository analysis only supports GitHub repositories.
* Analysis sessions are temporary and expire automatically.
* File access is restricted to files within the analyzed repository.
* Some endpoints are rate limited to prevent abuse.
