# 📁 Portfolio / Fellowship API

> Base URL: `http://localhost:5000/api/fellowships`
> All endpoints require `Authorization: Bearer <firebase_id_token>`

---

## Table of Contents

- [Profile](#profile)
- [Verification](#verification)
- [Challenges](#challenges)
- [Proposals](#proposals)
- [Chat](#chat)
- [Stats](#stats)

---

## Profile

### Get Fellowship Profile

```http
GET /api/fellowships/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "firebase_uid",
    "role": "student",
    "collegeName": "MIT",
    "bio": "CS student passionate about AI",
    "skills": ["React", "Python"],
    "isVerified": true
  }
}
```

---

### Create or Update Fellowship Profile

```http
POST /api/fellowships/profile
```

**Body:**
```json
{
  "role": "student",
  "collegeName": "MIT",
  "bio": "CS student passionate about AI",
  "skills": ["React", "Python"]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `role` | string | ✅ | `student` or `corporate` |
| `companyName` | string | Corporate only | Required if role is `corporate` |
| `collegeName` | string | ❌ | For students |
| `bio` | string | ❌ | Profile bio |
| `skills` | string[] | ❌ | List of skills |

**Response:**
```json
{
  "success": true,
  "data": { ...profile }
}
```

**Errors:**
- `400` - Invalid or missing role
- `400` - Company name required for corporate accounts

---

## Verification

### Send Verification Email

Sends a 6-digit OTP to verify academic/corporate email.

```http
POST /api/fellowships/verify/send-email
```

**Body:**
```json
{
  "email": "student@mit.edu"
}
```

> Students must use an academic email (`.edu`, `.ac.in`, `.edu.au`, etc.)

**Response:**
```json
{
  "success": true,
  "message": "Verification code sent to your email"
}
```

**Errors:**
- `400` - Email required
- `400` - Non-academic email for students
- `400` - Already verified

---

### Confirm Verification Code

```http
POST /api/fellowships/verify/confirm
```

**Body:**
```json
{
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Errors:**
- `400` - Invalid or expired code
- `400` - No verification pending

---

## Challenges

### List Challenges

```http
GET /api/fellowships/challenges
```

**Query Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `status` | string | `open` | `open`, `in_progress`, `completed` |
| `category` | string | all | `design`, `content`, `development`, `research`, `marketing` |
| `limit` | number | `50` | Results per page |
| `offset` | number | `0` | Pagination offset |

**Response:**
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "_id": "challenge_id",
        "title": "Build a Portfolio Website",
        "description": "Create a modern portfolio...",
        "category": "development",
        "price": 5000,
        "deadline": "2026-06-01T00:00:00.000Z",
        "corporateName": "TechCorp",
        "companyName": "TechCorp Pvt Ltd",
        "status": "open",
        "proposalCount": 3
      }
    ],
    "total": 25,
    "hasMore": true
  }
}
```

---

### Get Single Challenge

```http
GET /api/fellowships/challenges/:id
```

**Response:**
```json
{
  "success": true,
  "data": { ...challenge }
}
```

**Errors:**
- `404` - Challenge not found

---

### Create Challenge

> Corporate accounts only

```http
POST /api/fellowships/challenges
```

**Body:**
```json
{
  "title": "Design a Mobile App UI",
  "description": "We need a modern UI for our fintech app with at least 5 screens...",
  "category": "design",
  "price": 8000,
  "deadline": "2026-07-01",
  "requirements": ["Figma experience", "Mobile design knowledge"]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✅ | Min 10 characters |
| `description` | string | ✅ | Min 50 characters |
| `category` | string | ✅ | `design`, `content`, `development`, `research`, `marketing` |
| `price` | number | ✅ | Minimum ₹1000 |
| `deadline` | string | ✅ | ISO date, must be in future |
| `requirements` | string[] | ❌ | List of requirements |

**Response:** `201 Created`
```json
{
  "success": true,
  "data": { ...challenge }
}
```

**Errors:**
- `403` - Only corporate accounts can create challenges
- `400` - Validation errors (title too short, price too low, etc.)

---

### Get My Challenges

> Corporate accounts only

```http
GET /api/fellowships/my-challenges
```

**Response:**
```json
{
  "success": true,
  "data": [ ...challenges ]
}
```

---

### Delete Challenge

> Corporate accounts only. Also deletes all related proposals and chat rooms.

```http
DELETE /api/fellowships/challenges/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Challenge deleted successfully"
}
```

**Errors:**
- `403` - Not the challenge owner
- `404` - Challenge not found

---

## Proposals

### Apply to Challenge

> Verified student accounts only

```http
POST /api/fellowships/challenges/:id/apply
```

**Body:**
```json
{
  "coverLetter": "I am a passionate developer with 2 years of React experience...",
  "proposedPrice": 4500,
  "estimatedDays": 14,
  "portfolioLinks": ["https://github.com/student", "https://portfolio.dev"]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `coverLetter` | string | ✅ | Min 100 characters |
| `proposedPrice` | number | ✅ | Minimum ₹500 |
| `estimatedDays` | number | ✅ | Minimum 1 day |
| `portfolioLinks` | string[] | ❌ | Portfolio/work links |

**Response:** `201 Created`
```json
{
  "success": true,
  "data": { ...proposal }
}
```

**Errors:**
- `403` - Only verified students can apply
- `400` - Already applied to this challenge
- `400` - Challenge not accepting applications

---

### Get My Proposals

> Student accounts only

```http
GET /api/fellowships/my-proposals
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "proposal_id",
      "coverLetter": "...",
      "proposedPrice": 4500,
      "estimatedDays": 14,
      "status": "pending",
      "challenge": { ...challengeDetails }
    }
  ]
}
```

---

### Get Proposals for a Challenge

> Corporate only — challenge owner only

```http
GET /api/fellowships/challenges/:id/proposals
```

**Response:**
```json
{
  "success": true,
  "data": [ ...proposals ]
}
```

---

### Update Proposal Status

> Corporate only — accepts or rejects a student proposal

```http
PUT /api/fellowships/proposals/:id/status
```

**Body:**
```json
{
  "status": "accepted",
  "feedback": "Great proposal! Looking forward to working with you."
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `status` | string | ✅ | `accepted` or `rejected` |
| `feedback` | string | ❌ | Optional feedback message |

**Response:**
```json
{
  "success": true,
  "data": { ...proposal },
  "chatRoom": { ...chatRoom }
}
```

> When accepted, a chat room is automatically created and an approval email is sent to the student.

**Errors:**
- `403` - Not the challenge owner
- `400` - Invalid status

---

## Chat

### Get Chat Rooms

Returns all active chat rooms for the authenticated user.

```http
GET /api/fellowships/chat/rooms
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "room_id",
      "challengeTitle": "Build a Portfolio Website",
      "studentName": "Jane Doe",
      "corporateName": "TechCorp",
      "status": "active",
      "lastMessageAt": "2026-05-20T10:30:00.000Z"
    }
  ]
}
```

---

### Get Single Chat Room

```http
GET /api/fellowships/chat/rooms/:roomId
```

**Errors:**
- `403` - Access denied (not a participant)
- `404` - Room not found

---

### Get Room Messages

```http
GET /api/fellowships/chat/rooms/:roomId/messages
```

**Query Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | number | `50` | Number of messages |
| `before` | string | optional | ISO timestamp for pagination cursor |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "message_id",
      "senderId": "firebase_uid",
      "senderName": "Jane Doe",
      "senderRole": "student",
      "content": "Hello! I've started on the designs.",
      "createdAt": "2026-05-20T10:30:00.000Z"
    }
  ]
}
```

---

### Send Message

```http
POST /api/fellowships/chat/rooms/:roomId/messages
```

**Body:**
```json
{
  "content": "Here is my first draft!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": { ...message }
}
```

**Errors:**
- `400` - Empty message content
- `403` - Not a participant in this room

---

## Stats

### Get Fellowship Stats

```http
GET /api/fellowships/stats
```

**Response (Student):**
```json
{
  "success": true,
  "data": {
    "openChallenges": 12,
    "role": "student",
    "isVerified": true,
    "proposalCount": 5,
    "acceptedProposals": 2
  }
}
```

**Response (Corporate):**
```json
{
  "success": true,
  "data": {
    "openChallenges": 12,
    "role": "corporate",
    "isVerified": true,
    "challengeCount": 4,
    "totalProposalsReceived": 18
  }
}
```
