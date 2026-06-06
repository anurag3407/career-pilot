# 🏗️ System Architecture

<div align="center">

**AI Resume Builder & Career Platform - Technical Architecture Documentation**

</div>

---

## 📋 Table of Contents

- [High-Level Architecture](#-high-level-architecture)
- [System Components](#-system-components)
- [Data Flow Diagrams](#-data-flow-diagrams)
- [AI/ML Pipeline](#-aiml-pipeline)
- [Database Schema](#-database-schema)
- [API Architecture](#-api-architecture)
- [Security Architecture](#-security-architecture)
- [Deployment Architecture](#-deployment-architecture)
- [Scalability Design](#-scalability-design)
- [Monitoring & Observability](#-monitoring--observability)
- [Additional Resources](#-additional-resources)

---

## 🎯 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         React 19 Frontend (Vite)                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │   │
│  │  │  Auth    │ │ Dashboard│ │  Resume  │ │   Jobs   │ │Community │      │   │
│  │  │  Context │ │   Page   │ │ Enhance  │ │  Tracker │ │  Module  │      │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │   │
│  │                    │              │              │                       │   │
│  │              ┌─────┴──────────────┴──────────────┴─────┐                │   │
│  │              │         Socket.IO Client               │                │   │
│  │              └────────────────────────────────────────┘                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS / WSS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY LAYER                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      Express.js + Socket.IO Server                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │   │
│  │  │  CORS    │ │  Helmet  │ │   Rate   │ │   JWT    │ │  Error   │      │   │
│  │  │Middleware│ │ Security │ │ Limiter  │ │  Auth    │ │ Handler  │      │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            SERVICE LAYER                                         │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│  │  Resume   │ │    Job    │ │    Job    │ │ Community │ │   Mail    │        │
│  │  Service  │ │  Fetcher  │ │   Alert   │ │  Service  │ │  Service  │        │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
│        │             │             │             │             │               │
│        └─────────────┼─────────────┼─────────────┼─────────────┘               │
│                      │             │             │                              │
│                      ▼             ▼             ▼                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        BullMQ Job Queue (Redis)                          │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │   │
│  │  │  Alert Processing│  │   Email Queue    │  │   Cron Scheduler │      │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                            │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │     MongoDB         │  │    Firebase         │  │      Redis          │     │
│  │  ┌───────────────┐  │  │  ┌───────────────┐  │  │  ┌───────────────┐  │     │
│  │  │   Resumes     │  │  │  │   Firestore   │  │  │  │  Job Queues   │  │     │
│  │  │   Job Alerts  │  │  │  │   (Real-time) │  │  │  │  Rate Limits  │  │     │
│  │  │   Tracked Jobs│  │  │  │   Storage     │  │  │  │  Sessions     │  │     │
│  │  │   Notifications│ │  │  │   Auth        │  │  │  └───────────────┘  │     │
│  │  └───────────────┘  │  │  └───────────────┘  │  └─────────────────────┘     │
│  └─────────────────────┘  └─────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │   Google Gemini     │  │     RapidAPI        │  │       SMTP          │     │
│  │   (AI Enhancement)  │  │   (Job Search)      │  │   (Email Service)   │     │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 System Components

### 1. Frontend Application

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| **UI Framework** | React 19 | Component-based user interface |
| **Build Tool** | Vite 7 | Fast HMR, optimized builds |
| **Styling** | TailwindCSS 4 | Utility-first responsive design |
| **State Management** | Zustand + Context | Global and component state |
| **Routing** | React Router 7 | Client-side navigation |
| **Forms** | React Hook Form | Form validation and handling |
| **Real-time** | Socket.IO Client | WebSocket communication |
| **Animations** | Framer Motion | Smooth UI transitions |

### 2. Backend Application

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| **Runtime** | Node.js 18+ | JavaScript execution environment |
| **Framework** | Express.js | HTTP request handling |
| **WebSocket** | Socket.IO | Real-time bidirectional communication |
| **Authentication** | Firebase Admin | Token verification |
| **File Processing** | pdf-parse, PDFKit | PDF reading and generation |
| **Job Queue** | BullMQ | Background task processing |
| **Scheduler** | node-cron | Periodic task execution |
| **Email** | Nodemailer | SMTP email delivery |

### 3. Data Storage

| Store | Purpose | Data Types |
|-------|---------|------------|
| **MongoDB** | Primary database | Resumes, Alerts, Tracked Jobs, Notifications |
| **Firebase Firestore** | Real-time sync | Community messages, User presence |
| **Firebase Storage** | File storage | PDF resumes, Profile images |
| **Redis** | Caching & Queues | Job queues, Rate limiting, Sessions |

### 4. External Integrations

| Service | Provider | Usage |
|---------|----------|-------|
| **AI Enhancement** | Google Gemini 2.5 | Resume optimization, summaries |
| **Job Search** | RapidAPI JSearch | Job listing aggregation |
| **Email Delivery** | SMTP (Gmail/SendGrid) | Alert notifications |
| **Authentication** | Firebase Auth | User identity management |

---

## 🔄 Data Flow Diagrams

### Resume Enhancement Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │ Frontend │     │ Backend  │     │  Gemini  │     │ MongoDB  │
│          │     │          │     │   API    │     │    AI    │     │          │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ Upload PDF     │                │                │                │
     │───────────────>│                │                │                │
     │                │ POST /upload   │                │                │
     │                │───────────────>│                │                │
     │                │                │ Parse PDF      │                │
     │                │                │──────┐         │                │
     │                │                │      │         │                │
     │                │                │<─────┘         │                │
     │                │ Extracted Text │                │                │
     │                │<───────────────│                │                │
     │                │                │                │                │
     │ Set Preferences│                │                │                │
     │───────────────>│                │                │                │
     │                │ POST /enhance  │                │                │
     │                │───────────────>│                │                │
     │                │                │ Generate       │                │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │ Enhanced Resume│                │
     │                │                │<───────────────│                │
     │                │                │                │                │
     │                │                │ Save Resume    │                │
     │                │                │───────────────────────────────>│
     │                │                │                │                │
     │                │ Enhanced Result│                │                │
     │                │<───────────────│                │                │
     │ Display Result │                │                │                │
     │<───────────────│                │                │                │
     │                │                │                │                │
```

### Job Alert Processing Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           JOB ALERT PIPELINE                                  │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │  node-cron  │ ──── Every 30 minutes ────┐
    └─────────────┘                           │
                                              ▼
                                    ┌─────────────────┐
                                    │  Fetch Active   │
                                    │    Alerts       │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  Add to BullMQ  │
                                    │     Queue       │
                                    └────────┬────────┘
                                             │
                          ┌──────────────────┼──────────────────┐
                          │                  │                  │
                          ▼                  ▼                  ▼
                    ┌───────────┐      ┌───────────┐      ┌───────────┐
                    │  Worker 1 │      │  Worker 2 │      │  Worker N │
                    │ Process   │      │ Process   │      │ Process   │
                    │  Alert    │      │  Alert    │      │  Alert    │
                    └─────┬─────┘      └─────┬─────┘      └─────┬─────┘
                          │                  │                  │
                          ▼                  ▼                  ▼
                    ┌─────────────────────────────────────────────────┐
                    │              RapidAPI JSearch                    │
                    │         (Rate Limited: 5 req/sec)               │
                    └──────────────────────┬──────────────────────────┘
                                           │
                                           ▼
                    ┌─────────────────────────────────────────────────┐
                    │            Deduplication Check                  │
                    │     (Compare with NotificationLog)              │
                    └──────────────────────┬──────────────────────────┘
                                           │
                          ┌────────────────┴────────────────┐
                          │                                 │
                          ▼                                 ▼
                    ┌───────────┐                    ┌───────────┐
                    │   Email   │                    │  Socket   │
                    │  Service  │                    │   Emit    │
                    │(Nodemailer)│                   │ (Real-time)│
                    └─────┬─────┘                    └─────┬─────┘
                          │                                 │
                          ▼                                 ▼
                    ┌───────────┐                    ┌───────────┐
                    │   User    │                    │   User    │
                    │   Inbox   │                    │    App    │
                    └───────────┘                    └───────────┘
```

### Real-time Community Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         REAL-TIME MESSAGING FLOW                              │
└──────────────────────────────────────────────────────────────────────────────┘

  User A                    Server                    User B
    │                         │                         │
    │ socket.connect()        │                         │
    │────────────────────────>│                         │
    │                         │ Verify JWT              │
    │                         │──────┐                  │
    │                         │      │                  │
    │                         │<─────┘                  │
    │                         │                         │
    │ join('channel:general') │                         │
    │────────────────────────>│                         │
    │                         │                         │
    │                         │ socket.connect()        │
    │                         │<────────────────────────│
    │                         │                         │
    │                         │ join('channel:general') │
    │                         │<────────────────────────│
    │                         │                         │
    │ send_message            │                         │
    │ {content: "Hello!"}     │                         │
    │────────────────────────>│                         │
    │                         │                         │
    │                         │ Save to Firestore       │
    │                         │──────┐                  │
    │                         │      │                  │
    │                         │<─────┘                  │
    │                         │                         │
    │                         │ broadcast to room       │
    │                         │────────────────────────>│
    │                         │                         │
    │ message_received        │                         │
    │<────────────────────────│                         │
    │                         │                         │
```

---

## 🤖 AI/ML Pipeline

### Resume Enhancement Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI/ML ENHANCEMENT PIPELINE                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   Input Stage   │
│                 │
│ ┌─────────────┐ │      ┌─────────────────────────────────────────────────┐
│ │ PDF Resume  │─┼─────>│                TEXT EXTRACTION                  │
│ └─────────────┘ │      │                                                 │
│                 │      │  pdf-parse library extracts:                    │
│ ┌─────────────┐ │      │  • Raw text content                             │
│ │ Job Role    │─┼──┐   │  • Page count                                   │
│ │ Preferences │ │  │   │  • Document metadata                            │
│ └─────────────┘ │  │   └────────────────────┬────────────────────────────┘
│                 │  │                        │
│ ┌─────────────┐ │  │                        ▼
│ │ Skills &    │─┼──┤   ┌─────────────────────────────────────────────────┐
│ │ Experience  │ │  │   │              PROMPT ENGINEERING                 │
│ └─────────────┘ │  │   │                                                 │
│                 │  │   │  Build structured prompt with:                  │
│ ┌─────────────┐ │  │   │  • Target job role                              │
│ │ Custom      │─┼──┘   │  • Years of experience                          │
│ │Instructions │ │      │  • Key skills to highlight                      │
│ └─────────────┘ │      │  • Industry context                             │
└─────────────────┘      │  • Harvard template format rules                │
                         │  • ATS optimization guidelines                  │
                         └────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                         ┌─────────────────────────────────────────────────┐
                         │              GOOGLE GEMINI 2.5                  │
                         │                                                 │
                         │  Model: gemini-2.5-flash                        │
                         │                                                 │
                         │  Capabilities:                                  │
                         │  • Content restructuring                        │
                         │  • Action verb enhancement                      │
                         │  • Quantification suggestions                   │
                         │  • ATS keyword optimization                     │
                         │  • Professional summary generation              │
                         └────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                         ┌─────────────────────────────────────────────────┐
                         │              OUTPUT PROCESSING                  │
                         │                                                 │
                         │  ┌──────────────┐  ┌──────────────┐            │
                         │  │   Enhanced   │  │     ATS      │            │
                         │  │   Resume     │  │    Score     │            │
                         │  │  (Markdown)  │  │   Analysis   │            │
                         │  └──────────────┘  └──────────────┘            │
                         │                                                 │
                         │  ┌──────────────┐  ┌──────────────┐            │
                         │  │ Improvement  │  │ Professional │            │
                         │  │ Suggestions  │  │   Summary    │            │
                         │  └──────────────┘  └──────────────┘            │
                         └─────────────────────────────────────────────────┘
```

### AI Endpoints

| Endpoint | Function | Model Used |
|----------|----------|------------|
| `POST /api/enhance` | Full resume enhancement | gemini-2.5-flash |
| `POST /api/enhance/summary` | Professional summary only | gemini-2.5-flash |
| `POST /api/enhance/suggestions` | Improvement recommendations | gemini-2.5-flash |
| `POST /api/enhance/ats-analysis` | ATS compatibility score | gemini-2.5-flash |

---

## 🗃️ Database Schema

### MongoDB Collections

#### Resume Collection
```javascript
{
  _id: ObjectId,
  userId: String,              // Firebase UID
  originalText: String,        // Raw extracted text
  enhancedText: String,        // AI-enhanced version
  jobRole: String,             // Target job role
  preferences: {
    yearsOfExperience: Number,
    skills: [String],
    industry: String,
    customInstructions: String
  },
  title: String,               // User-defined title
  pdfUrl: String,              // Firebase Storage URL
  createdAt: Date,
  lastModified: Date
}

// Indexes
{ userId: 1, createdAt: -1 }
```

#### JobAlert Collection
```javascript
{
  _id: ObjectId,
  userId: String,              // Firebase UID
  userEmail: String,           // For notifications
  userName: String,            // Display name
  title: String,               // Alert name
  keywords: [String],          // Search keywords
  location: String,            // Job location filter
  remoteOnly: Boolean,         // Remote jobs only
  salaryMin: Number,           // Minimum salary
  salaryMax: Number,           // Maximum salary
  employmentType: [String],    // ['full-time', 'part-time', 'contract', 'internship']
  isActive: Boolean,           // Alert enabled/disabled
  lastCheckedAt: Date,         // Last processing time
  totalJobsFound: Number,      // Cumulative jobs found
  totalEmailsSent: Number,     // Cumulative emails sent
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ userId: 1, isActive: 1 }
{ isActive: 1, lastCheckedAt: 1 }
```

#### TrackedJob Collection
```javascript
{
  _id: ObjectId,
  userId: String,              // Firebase UID
  jobId: String,               // External job ID
  title: String,               // Job title
  company: String,             // Company name
  location: String,            // Job location
  jobType: String,             // Employment type
  salary: String,              // Salary range
  applyLink: String,           // Application URL
  description: String,         // Job description
  status: String,              // 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected'
  notes: [{
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}

// Indexes
{ userId: 1, jobId: 1 } // Unique compound
{ userId: 1, status: 1 }
```

#### NotificationLog Collection
```javascript
{
  _id: ObjectId,
  alertId: ObjectId,           // Reference to JobAlert
  userId: String,              // Firebase UID
  jobListingId: ObjectId,      // Reference to JobListing
  type: String,                // 'email' | 'push' | 'socket'
  status: String,              // 'sent' | 'failed' | 'pending'
  sentAt: Date,
  error: String                // Error message if failed
}

// Indexes
{ alertId: 1, jobListingId: 1 } // Prevent duplicates
{ userId: 1, sentAt: -1 }
```

### Firebase Firestore Collections

#### Users Collection
```javascript
/users/{uid}
{
  uid: String,
  email: String,
  displayName: String,
  photoURL: String,
  lastLogin: Timestamp,
  createdAt: Timestamp
}
```

#### Channels Collection
```javascript
/channels/{channelId}
{
  name: String,
  description: String,
  createdBy: String,           // User UID
  memberCount: Number,
  isDefault: Boolean,
  createdAt: Timestamp,
  lastMessage: {
    content: String,
    senderName: String,
    timestamp: Timestamp
  }
}

/channels/{channelId}/messages/{messageId}
{
  content: String,
  sender: {
    uid: String,
    name: String,
    photoURL: String
  },
  reactions: [{
    emoji: String,
    users: [{ uid: String, name: String }]
  }],
  edited: Boolean,
  createdAt: Timestamp
}
```

#### Posts Collection
```javascript
/posts/{postId}
{
  title: String,
  content: String,
  author: {
    uid: String,
    name: String,
    photoURL: String
  },
  likes: [String],             // User UIDs
  likeCount: Number,
  commentCount: Number,
  tags: [String],
  createdAt: Timestamp,
  updatedAt: Timestamp
}

/posts/{postId}/comments/{commentId}
{
  content: String,
  author: {
    uid: String,
    name: String,
    photoURL: String
  },
  likes: [String],
  createdAt: Timestamp
}
```

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │     Resume      │       │   TrackedJob    │
│    (Firebase)   │       │   (MongoDB)     │       │   (MongoDB)     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ uid (PK)        │──┐    │ _id (PK)        │       │ _id (PK)        │
│ email           │  │    │ userId (FK)     │◄──────│ userId (FK)     │
│ displayName     │  │    │ originalText    │       │ jobId           │
│ photoURL        │  │    │ enhancedText    │       │ title           │
└─────────────────┘  │    │ jobRole         │       │ company         │
                     │    │ preferences     │       │ status          │
                     │    │ title           │       │ notes[]         │
                     │    └─────────────────┘       └─────────────────┘
                     │
                     │    ┌─────────────────┐       ┌─────────────────┐
                     │    │    JobAlert     │       │ NotificationLog │
                     │    │   (MongoDB)     │       │   (MongoDB)     │
                     │    ├─────────────────┤       ├─────────────────┤
                     └───>│ _id (PK)        │◄──────│ alertId (FK)    │
                          │ userId (FK)     │       │ _id (PK)        │
                          │ userEmail       │       │ userId (FK)     │
                          │ keywords[]      │       │ jobListingId    │
                          │ location        │       │ type            │
                          │ employmentType[]│       │ status          │
                          │ isActive        │       │ sentAt          │
                          └─────────────────┘       └─────────────────┘
```

---

## 🔌 API Architecture

### RESTful Design Principles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API DESIGN PATTERNS                                │
└─────────────────────────────────────────────────────────────────────────────┘

HTTP Methods:
┌──────────┬────────────────────────────────────────────────────────────────┐
│  Method  │  Purpose                                                        │
├──────────┼────────────────────────────────────────────────────────────────┤
│  GET     │  Retrieve resource(s) - Safe, Idempotent                       │
│  POST    │  Create new resource - Not Idempotent                          │
│  PUT     │  Update entire resource - Idempotent                           │
│  PATCH   │  Partial update - Idempotent                                   │
│  DELETE  │  Remove resource - Idempotent                                  │
└──────────┴────────────────────────────────────────────────────────────────┘

URL Structure:
┌────────────────────────────────────────────────────────────────────────────┐
│  /api/{resource}              - Collection (GET all, POST new)             │
│  /api/{resource}/{id}         - Single item (GET, PUT, DELETE)             │
│  /api/{resource}/{id}/{sub}   - Sub-resource                               │
│  /api/{resource}?key=value    - Filtered collection                        │
└────────────────────────────────────────────────────────────────────────────┘

Response Format:
┌────────────────────────────────────────────────────────────────────────────┐
│  {                                                                          │
│    "success": true,                                                         │
│    "data": { ... },           // Resource data                              │
│    "message": "...",          // Human-readable message                     │
│    "count": 10,               // For collections                            │
│    "pagination": { ... }      // If paginated                               │
│  }                                                                          │
│                                                                             │
│  Error Response:                                                            │
│  {                                                                          │
│    "success": false,                                                        │
│    "error": "Error message",                                                │
│    "code": "ERROR_CODE",                                                    │
│    "details": { ... }                                                       │
│  }                                                                          │
└────────────────────────────────────────────────────────────────────────────┘
```

### API Routes Organization

```
/api
├── /auth
│   ├── POST   /verify          # Verify Firebase token
│   └── GET    /profile         # Get user profile
│
├── /upload
│   ├── POST   /                # Upload PDF resume
│   └── POST   /extract-text    # Extract text only
│
├── /resumes
│   ├── GET    /                # List user resumes
│   ├── POST   /                # Create resume
│   ├── GET    /:id             # Get single resume
│   ├── PUT    /:id             # Update resume
│   ├── DELETE /:id             # Delete resume
│   └── GET    /:id/download    # Download as PDF
│
├── /enhance
│   ├── POST   /                # Full enhancement
│   ├── POST   /summary         # Generate summary
│   ├── POST   /suggestions     # Get suggestions
│   └── POST   /ats-analysis    # ATS score
│
├── /fetchjobs
│   └── GET    /                # Search jobs
│
├── /job-alerts
│   ├── GET    /                # List alerts
│   ├── POST   /                # Create alert
│   ├── GET    /stats/summary   # Alert statistics
│   ├── GET    /:id             # Get single alert
│   ├── PUT    /:id             # Update alert
│   └── DELETE /:id             # Delete alert
│
├── /job-tracker
│   ├── GET    /                # List tracked jobs
│   ├── POST   /                # Track new job
│   ├── GET    /stats           # Tracking statistics
│   ├── PUT    /:id             # Update status
│   └── DELETE /:id             # Remove tracking
│
├── /community
│   ├── /channels
│   │   ├── GET    /            # List channels
│   │   ├── POST   /            # Create channel
│   │   ├── GET    /:id         # Get channel
│   │   ├── POST   /:id/join    # Join channel
│   │   ├── POST   /:id/leave   # Leave channel
│   │   └── GET    /:id/messages # Channel messages
│   │
│   ├── /posts
│   │   ├── GET    /            # List posts
│   │   ├── POST   /            # Create post
│   │   ├── GET    /:id         # Get post
│   │   ├── PUT    /:id         # Update post
│   │   ├── DELETE /:id         # Delete post
│   │   ├── POST   /:id/like    # Toggle like
│   │   ├── GET    /:id/comments # Get comments
│   │   └── POST   /:id/comments # Add comment
│   │
│   ├── /conversations
│   │   ├── GET    /            # List DMs
│   │   └── GET    /:id/messages # DM messages
│   │
│   └── GET /online-users       # Online users
│
└── /admin
    ├── POST   /sync-to-firebase  # Sync data
    ├── POST   /save-my-profile   # Save profile
    └── GET    /stats             # System stats
```

> 📚 **Complete API Reference: [API_DOCS/README.md](./API_DOCS/README.md)**

---

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   Firebase      │
                              │   Auth Server   │
                              └────────┬────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐
  │   Email/    │             │   Google    │             │   Social    │
  │  Password   │             │   OAuth     │             │   Login     │
  └──────┬──────┘             └──────┬──────┘             └──────┬──────┘
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     │
                                     ▼
                           ┌─────────────────┐
                           │   ID Token      │
                           │   (JWT)         │
                           └────────┬────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │   REST API      │             │   Socket.IO     │
          │   Requests      │             │   Connection    │
          └────────┬────────┘             └────────┬────────┘
                   │                               │
                   │  Authorization: Bearer <token>│  auth: { token }
                   │                               │
                   ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │   verifyToken   │             │  socketAuth     │
          │   Middleware    │             │  Middleware     │
          └────────┬────────┘             └────────┬────────┘
                   │                               │
                   │  Firebase Admin SDK           │
                   │  admin.auth().verifyIdToken() │
                   │                               │
                   ▼                               ▼
          ┌─────────────────┐             ┌─────────────────┐
          │   Decoded User  │             │   Decoded User  │
          │   req.user      │             │   socket.user   │
          └─────────────────┘             └─────────────────┘
```

### Security Layers

| Layer | Implementation | Purpose |
|-------|----------------|---------|
| **Transport** | HTTPS/WSS | Encrypted communication |
| **Authentication** | Firebase JWT | Identity verification |
| **Authorization** | Middleware checks | Resource access control |
| **Rate Limiting** | express-rate-limit | Prevent abuse |
| **Input Validation** | Schema validation | Prevent injection |
| **Headers** | Helmet.js | Security headers |
| **CORS** | cors middleware | Cross-origin protection |
| **Firestore Rules** | Security rules | Database access control |

### Security Middleware Stack

```javascript
// Applied in order:
app.use(helmet());           // Security headers
app.use(cors({...}));        // CORS policy
app.use(rateLimit({...}));   // Rate limiting
app.use(express.json());     // Body parsing with limits
router.use(verifyToken);     // Auth verification
```

### Firebase Security Rules

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Channels accessible to authenticated users
    match /channels/{channelId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.createdBy == request.auth.uid;
      
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null && 
          resource.data.sender.uid == request.auth.uid;
      }
    }
    
    // Posts accessible to all authenticated users
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.author.uid == request.auth.uid;
    }
  }
}
```

---

## 🚀 Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │    CloudFlare   │
                              │       CDN       │
                              └────────┬────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LOAD BALANCER                                   │
│                           (Nginx / Cloud LB)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                    │                                    │
                    ▼                                    ▼
    ┌───────────────────────────┐        ┌───────────────────────────┐
    │     FRONTEND (Vercel)     │        │    BACKEND (Railway)      │
    │                           │        │                           │
    │  ┌─────────────────────┐  │        │  ┌─────────────────────┐  │
    │  │   Static Assets    │  │        │  │   Express Server    │  │
    │  │   (React Build)    │  │        │  │   (Node.js 18+)     │  │
    │  └─────────────────────┘  │        │  └─────────────────────┘  │
    │                           │        │                           │
    │  ┌─────────────────────┐  │        │  ┌─────────────────────┐  │
    │  │   Edge Functions   │  │        │  │   Socket.IO         │  │
    │  │   (Middleware)     │  │        │  │   (WebSocket)       │  │
    │  └─────────────────────┘  │        │  └─────────────────────┘  │
    └───────────────────────────┘        └─────────────┬─────────────┘
                                                       │
                    ┌──────────────────────────────────┼───────────────┐
                    │                                  │               │
                    ▼                                  ▼               ▼
    ┌───────────────────────┐      ┌───────────────────────┐    ┌───────────┐
    │   MongoDB Atlas       │      │   Firebase            │    │   Redis   │
    │                       │      │                       │    │ (Upstash) │
    │  • Resumes           │      │  • Authentication     │    │           │
    │  • Job Alerts        │      │  • Firestore          │    │  • Queue  │
    │  • Tracked Jobs      │      │  • Storage            │    │  • Cache  │
    │  • Notifications     │      │  • Real-time          │    │           │
    └───────────────────────┘      └───────────────────────┘    └───────────┘
```

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CI/CD PIPELINE                                    │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
  │   Code   │     │  GitHub  │     │  GitHub  │     │ Deploy   │
  │   Push   │────>│  Actions │────>│  Actions │────>│  Target  │
  └──────────┘     │  (Test)  │     │  (Build) │     └──────────┘
                   └──────────┘     └──────────┘
                        │                │
                        ▼                ▼
                   ┌──────────┐     ┌──────────┐
                   │  Lint    │     │  Build   │
                   │  Test    │     │  Bundle  │
                   │  Audit   │     │  Optimize│
                   └──────────┘     └──────────┘


Pipeline Stages:
┌────────┬───────────────────────────────────────────────────────────────────┐
│ Stage  │ Actions                                                           │
├────────┼───────────────────────────────────────────────────────────────────┤
│ Test   │ npm run lint, npm run test, npm audit                            │
│ Build  │ npm run build, Docker image build                                │
│ Deploy │ Push to Vercel (frontend), Railway (backend)                     │
│ Post   │ Smoke tests, Health checks, Notifications                        │
└────────┴───────────────────────────────────────────────────────────────────┘
```

### Environment Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ENVIRONMENT MATRIX                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬────────────────┬────────────────┬────────────────┐
│  Variable    │  Development   │   Staging      │   Production   │
├──────────────┼────────────────┼────────────────┼────────────────┤
│ NODE_ENV     │ development    │ staging        │ production     │
│ API_URL      │ localhost:5000 │ staging.api.x  │ api.example.com│
│ DB_NAME      │ dev_db         │ staging_db     │ prod_db        │
│ LOG_LEVEL    │ debug          │ info           │ error          │
│ RATE_LIMIT   │ 1000/15min     │ 500/15min      │ 100/15min      │
└──────────────┴────────────────┴────────────────┴────────────────┘
```

---

## 📈 Scalability Design

### Horizontal Scaling Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HORIZONTAL SCALING ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │  Load Balancer  │
                              │  (Round Robin)  │
                              └────────┬────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   API Server    │         │   API Server    │         │   API Server    │
│   Instance 1    │         │   Instance 2    │         │   Instance N    │
│                 │         │                 │         │                 │
│ ┌─────────────┐ │         │ ┌─────────────┐ │         │ ┌─────────────┐ │
│ │   Express   │ │         │ │   Express   │ │         │ │   Express   │ │
│ │   Server    │ │         │ │   Server    │ │         │ │   Server    │ │
│ └─────────────┘ │         │ └─────────────┘ │         │ └─────────────┘ │
│ ┌─────────────┐ │         │ ┌─────────────┐ │         │ ┌─────────────┐ │
│ │  Socket.IO  │ │         │ │  Socket.IO  │ │         │ │  Socket.IO  │ │
│ │   Adapter   │ │         │ │   Adapter   │ │         │ │   Adapter   │ │
│ └──────┬──────┘ │         │ └──────┬──────┘ │         │ └──────┬──────┘ │
└────────┼────────┘         └────────┼────────┘         └────────┼────────┘
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     │
                              ┌──────┴──────┐
                              │   Redis     │
                              │   Pub/Sub   │
                              │   Adapter   │
                              └─────────────┘
```

### Scaling Components

| Component | Strategy | Implementation |
|-----------|----------|----------------|
| **API Servers** | Horizontal | Multiple stateless containers |
| **WebSockets** | Redis Adapter | Socket.IO with Redis pub/sub |
| **Database** | Replica Set | MongoDB Atlas auto-scaling |
| **Job Queue** | Distributed | BullMQ with multiple workers |
| **Cache** | Redis Cluster | Distributed caching layer |
| **CDN** | Edge Caching | CloudFlare/Vercel Edge |

### Performance Optimizations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PERFORMANCE OPTIMIZATION LAYERS                         │
└─────────────────────────────────────────────────────────────────────────────┘

1. CACHING STRATEGY
   ┌──────────────────────────────────────────────────────────────────────┐
   │  Client Cache   │  CDN Cache     │  Redis Cache   │  DB Query Cache │
   │  (Browser)      │  (Edge)        │  (Application) │  (MongoDB)      │
   │                 │                │                │                 │
   │  Static assets  │  API responses │  Session data  │  Frequent       │
   │  Service worker │  Images/PDF    │  User prefs    │  aggregations   │
   └──────────────────────────────────────────────────────────────────────┘

2. DATABASE OPTIMIZATION
   ┌──────────────────────────────────────────────────────────────────────┐
   │  • Compound indexes on frequently queried fields                     │
   │  • Projection to return only needed fields                          │
   │  • Aggregation pipelines for statistics                             │
   │  • Connection pooling                                               │
   │  • Read replicas for read-heavy operations                          │
   └──────────────────────────────────────────────────────────────────────┘

3. QUEUE OPTIMIZATION
   ┌──────────────────────────────────────────────────────────────────────┐
   │  • Rate limiting for external APIs (5 requests/second)              │
   │  • Batch processing for job alerts                                  │
   │  • Priority queues for urgent notifications                         │
   │  • Dead letter queue for failed jobs                                │
   │  • Exponential backoff on failures                                  │
   └──────────────────────────────────────────────────────────────────────┘

4. FRONTEND OPTIMIZATION
   ┌──────────────────────────────────────────────────────────────────────┐
   │  • Code splitting with React.lazy                                   │
   │  • Tree shaking with Vite                                           │
   │  • Image optimization                                               │
   │  • Virtual scrolling for large lists                                │
   │  • Optimistic UI updates                                            │
   └──────────────────────────────────────────────────────────────────────┘
```

### Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MONITORING STACK                                     │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────┐
                    │         METRICS & LOGS          │
                    └─────────────────────────────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       │                           │                           │
       ▼                           ▼                           ▼
┌─────────────┐           ┌─────────────┐           ┌─────────────┐
│  Application│           │   System    │           │   Custom    │
│   Logs      │           │   Metrics   │           │   Metrics   │
│             │           │             │           │             │
│ • Errors    │           │ • CPU       │           │ • API       │
│ • Requests  │           │ • Memory    │           │   latency   │
│ • Auth      │           │ • Disk      │           │ • Queue     │
│ • Jobs      │           │ • Network   │           │   depth     │
└──────┬──────┘           └──────┬──────┘           └──────┬──────┘
       │                         │                         │
       └─────────────────────────┴─────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────────────┐
                    │         ALERTING RULES          │
                    │                                 │
                    │  • Error rate > 1%             │
                    │  • Response time > 2s          │
                    │  • Queue depth > 1000          │
                    │  • Memory usage > 80%          │
                    └─────────────────────────────────┘
```

---

## 📚 Additional Resources

- **[Complete API Reference](./API_DOCS/README.md)** - Detailed endpoint documentation
- **[Real-World Use Cases](./Real_life_usecase.md)** - Success stories and applications
- **[Contributing Guide](./CONTRIBUTION.md)** - How to contribute to the project
- **[Main README](./README.md)** - Project overview and getting started

---

<div align="center">

**Built with scalability, security, and performance in mind.**

</div>
