# 🚀 careerpilot - AI Career Platform

<div align="center">

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue?logo=opensourceinitiative&logoColor=white">
  &nbsp;
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js&logoColor=white">
  &nbsp;
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <br/>
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black">
  &nbsp;
  <img src="https://img.shields.io/badge/AI-Gemini_2.5-8E75B2?logo=google&logoColor=white">
  &nbsp;
  <img src="https://img.shields.io/badge/Payments-Razorpay-02042B?logo=razorpay&logoColor=white">
</p>

**An intelligent, AI-powered career platform that revolutionizes the job hunting experience through automated resume enhancement, intelligent job matching, AI mock interviews, corporate fellowships, and community-driven networking.**

[Live Demo](https://careerpilotyyy.netlify.app/) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Reference](./API_DOCS/README.md) • [Architecture](./ARCHITECTURE.md) • [Contributing](./CONTRIBUTION.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Features](#-features)
- [Portfolio Builder](#-portfolio-builder)
- [GitHub Intelligence](#-github-intelligence)
- [AI Career Tools](#-ai-career-tools)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Routes](#-api-routes)
- [Feature Details](#-feature-details)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Real-World Use Cases](#-real-world-use-cases)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **AI Resume Builder & Career Platform** is a comprehensive full-stack application designed to streamline and enhance the job search process. By leveraging cutting-edge AI technology (Google Gemini 2.5), real-time communication via Socket.IO, and intelligent automation through BullMQ job queues, this platform provides job seekers with powerful tools to:

- Create ATS-optimized resumes tailored to specific job roles
- Receive personalized job alerts based on custom preferences
- Track job applications through an intuitive pipeline interface
- Connect with fellow job seekers through a real-time community platform
- Get AI-powered insights and improvement suggestions

---

## ❓ Problem Statement

### The Modern Job Seeker's Challenges

1. **Resume Optimization Struggles**: Job seekers spend countless hours formatting resumes without knowing if they'll pass Applicant Tracking Systems (ATS)

2. **Information Overload**: With thousands of job postings across multiple platforms, finding relevant opportunities is overwhelming

3. **Application Tracking Chaos**: Managing applications across different companies leads to missed follow-ups and forgotten deadlines

4. **Isolation in Job Search**: The job hunting process is often lonely, with limited access to peer support and shared experiences

5. **Skill Gap Identification**: Difficulty understanding what skills to highlight or develop for target roles

6. **Time-Consuming Process**: Manual job searching, resume customization, and application tracking consumes significant time

---

## 💡 Our Solution

### Comprehensive Career Platform

| Challenge                | Solution                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| **Resume Optimization**  | AI-powered resume enhancement using Google Gemini 2.5 with ATS scoring and Harvard-format templates |
| **Information Overload** | Smart job alerts with customizable filters (keywords, location, salary, employment type)            |
| **Application Tracking** | Visual Kanban-style job tracker with status management (Saved → Applied → Interviewing → Offered)   |
| **Isolation**            | Real-time community platform with channels, posts, direct messaging, and presence indicators        |
| **Skill Gaps**           | AI-generated improvement suggestions and professional summary generation                            |
| **Time Consumption**     | Automated job fetching, bulk processing via queues, and one-click resume downloads                  |

---

## ✨ Features

### 🤖 AI-Powered Resume Enhancement

- **Smart Resume Enhancement**: Transform ordinary resumes into ATS-optimized documents
- **Professional Summary Generation**: AI-crafted summaries tailored to target roles
- **Improvement Suggestions**: Actionable recommendations to strengthen your resume
- **ATS Score Analysis**: Get compatibility scores with detailed feedback
- **Harvard Template Formatting**: Industry-standard resume formatting

### 📄 Resume Management

- **PDF Upload & Parsing**: Extract text from uploaded PDF resumes
- **Multiple Resume Support**: Manage different versions for various roles
- **PDF Download**: Export enhanced resumes as professional PDFs
- **Version History**: Track original and enhanced versions

### 🔔 Intelligent Job Alerts

- **Custom Alert Creation**: Set preferences for keywords, location, salary range
- **Remote Work Filters**: Find remote-only opportunities
- **Employment Type Selection**: Full-time, Part-time, Contract, Internship
- **Email Notifications**: Receive new job matches directly in your inbox
- **Real-time Socket Updates**: Instant in-app notifications when new jobs match
> **Note:** By default, job alerts use the cron schedule `0 0 */2 * *` to reduce API costs. This means they run at midnight on every other day of the month (a day-of-month step), not on a strict 48-hour interval, so behavior can differ around month boundaries. You can override this schedule with the `ALERT_CRON_SCHEDULE` environment variable.

### 📊 Job Application Tracker

- **Visual Pipeline**: Kanban-style board for application status
- **Status Management**: Track from Saved → Applied → Interviewing → Offered → Rejected
- **Notes & Comments**: Add personal notes to each application
- **Statistics Dashboard**: Overview of application metrics
- **Quick Actions**: Easy status updates and job removal

### 🌐 Community Platform

- **Real-time Channels**: Topic-based discussion channels
- **Posts & Feed**: Share experiences, tips, and opportunities
- **Comments & Reactions**: Engage with community content
- **Direct Messaging**: Private conversations with other members
- **Presence Indicators**: See who's online in real-time
- **Member Discovery**: Find and connect with fellow job seekers

### 🎓 careerpilot Fellowships

- **Corporate Challenges**: Companies post real-world challenges for students
- **Student Proposals**: Students submit proposals with cover letters and pricing
- **Proposal Review**: Companies review, accept, or reject proposals
- **Escrow Payments**: Razorpay integration for secure payments
- **Real-time Chat**: Direct messaging between corporate and students
- **Challenge Completion**: Fund release upon satisfactory completion
- **Student Verification**: Academic email verification system

### 🎤 AI Interview Prep

- **Mock Interviews**: AI-powered interview simulations
- **Role-Specific Questions**: Tailored questions based on target role
- **Real-time Feedback**: Instant AI evaluation of responses
- **Performance Scoring**: Detailed scoring with improvement suggestions
- **Interview History**: Track progress across multiple sessions
- **Multi-Round Support**: Technical, behavioral, and HR round simulations

### 🖼️ Portfolio Builder

- **AI Section Enhancement**: Enhance your portfolio's hero, projects, about, and skills sections using Gemini AI
- **Before/After Comparison**: Preview AI suggestions before applying them — nothing saves automatically
- **Project Impact Statements**: AI generates measurable impact statements and technical highlights for each project
- **Smart Skills Categorization**: Groups your skills into logical categories (Languages, Frameworks, Tools) and suggests complementary skills
- **Theme Selector**: Choose from multiple portfolio themes to match your personal brand
- **Custom Sections**: Add fully customizable sections to your portfolio beyond the defaults

### 🐙 GitHub Intelligence

- **LinkedIn Profile Optimizer**: Paste your LinkedIn profile text and receive AI-generated headline rewrites, an About section overhaul, and a skills gap analysis vs. industry peers
- **Profile Score Breakdown**: Scores your LinkedIn profile across Headline, About, and Skills dimensions with an overall rating
- **Headline Suggestions**: Get 3–5 optimized, one-click-copyable LinkedIn headlines tailored to your target role
- **Quick Wins**: Actionable improvements ranked by impact (High / Medium / Low) so you know exactly what to fix first
- **Skills Gap vs Peers**: See which skills are missing compared to professionals in your target role
- **LinkedIn OAuth**: Sign in with LinkedIn and auto-import profile data for seamless optimization

### 🤖 AI Career Tools

- **AI Email Generator**: Generate high-converting job application emails from your resume and a job description; choose from Professional, Enthusiastic, Direct, or Creative tones
- **Company Research**: AI-powered deep-dive into any company — overview, size, funding stage, culture, Glassdoor-style ratings, and recent news
- **Intelligent Search**: Cross-search across your resumes and the job database in a single query (`/api/search?q=...&type=all|resume|job`)
- **Post Scheduler**: Schedule community posts in advance via the community platform
- **Two-Factor Authentication (2FA)**: TOTP-based 2FA with QR code setup, backup codes, and brute-force rate limiting
- **User Profiles**: Public and private profile pages with activity feeds, stats, and social links (GitHub, LinkedIn, website)

### 💳 Payments (Razorpay)

- **Secure Payments**: PCI-DSS compliant payment processing
- **Multiple Payment Methods**: UPI, Cards, NetBanking, Wallets, QR Code
- **Escrow System**: Funds held securely until work completion
- **Fund Release**: One-click release when satisfied with deliverables
- **Payment History**: Complete transaction tracking

### 🔐 Authentication & Security

- **Firebase Authentication**: Secure email/password and Google OAuth
- **JWT Token Verification**: Protected API endpoints
- **Rate Limiting**: Protection against abuse
- **Helmet Security Headers**: Enhanced HTTP security

---

## 🛠 Tech Stack

### Frontend

| Technology              | Purpose                          |
| ----------------------- | -------------------------------- |
| **React 19**            | UI library with latest features  |
| **Vite 7**              | Fast build tool and dev server   |
| **TailwindCSS 4**       | Utility-first CSS framework      |
| **Framer Motion**       | Animation library                |
| **React Router 7**      | Client-side routing              |
| **Socket.IO Client**    | Real-time communication          |
| **Firebase SDK**        | Authentication & client services |
| **Zustand**             | State management                 |
| **React Hook Form**     | Form handling                    |
| **Lucide React**        | Icon library                     |
| **React Markdown**      | Markdown rendering               |
| **React Dropzone**      | Drag-and-drop file uploads       |
| **React Hot Toast**     | Toast notifications              |
| **jsPDF + html2canvas** | Client-side PDF generation       |
| **Radix UI**            | Accessible UI primitives         |

### Backend

| Technology             | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| **Node.js 18+**        | JavaScript runtime                               |
| **Express.js**         | Web framework                                    |
| **Socket.IO**          | WebSocket server                                 |
| **Firebase Admin SDK** | Server-side Firebase services                    |
| **MongoDB + Mongoose** | Database & ODM                                   |
| **BullMQ + IORedis**   | Job queue for background tasks                   |
| **Google Gemini AI**   | AI/ML for resume enhancement, interviews & portfolio |
| **Groq SDK**           | Alternative AI provider integration             |
| **OpenAI SDK**         | Multi-provider AI support                        |
| **Razorpay**           | Payment processing & escrow                      |
| **Nodemailer**         | Email notifications                              |
| **PDFKit**             | PDF generation                                   |
| **Node-Cron**          | Scheduled tasks                                  |
| **Speakeasy + QRCode** | TOTP-based two-factor authentication             |
| **bcryptjs**           | Password & secret hashing                        |
| **Axios**              | HTTP client for external API calls               |

### Infrastructure

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| **Firebase**      | Auth, Firestore, Storage       |
| **MongoDB Atlas** | Cloud database                 |
| **Redis**         | Queue backend & caching        |
| **RapidAPI**      | Job search integration         |
| **LinkedIn API**  | OAuth login & profile import   |
| **Netlify**       | Frontend hosting (live demo)   |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- MongoDB instance (local or Atlas)
- Redis instance (for job queue)
- Firebase project with Firestore enabled
- Google Gemini API key
- RapidAPI key (for job fetching)

### Environment Variables

#### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/career-pilot

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# AI
GEMINI_API_KEY=your-gemini-api-key

# Redis (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional-password

# RapidAPI (Job Search)
RAPID_API_KEY=your-rapidapi-key
RAPID_API_HOST=jsearch.p.rapidapi.com

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/auth/linkedin/callback

# Two-Factor Authentication
TOTP_ENCRYPTION_KEY=your-32-char-encryption-key

# Job Alert Schedule (optional override)
ALERT_CRON_SCHEDULE=0 0 */2 * *

# AI Provider (optional: gemini | groq | openai)
AI_PROVIDER=gemini
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# LinkedIn OAuth (frontend callback)
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ishwari418/career-pilot.git
cd career-pilot
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

```bash
# Create .env files in both backend and frontend directories
# Use the templates above
```

5. **Start the development servers**

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

6. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

## 📁 Project Structure

```
career-pilot/
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.js                 # Server entry point
│       ├── config/
│       │   ├── firebase.js          # Firebase Admin initialization
│       │   ├── langchain.js         # AI/Gemini configuration
│       │   └── socket.js            # Socket.IO setup
│       ├── controllers/
│       │   ├── communityFirebaseController.js  # Community features
│       │   └── jobFetch.js          # Job fetching logic
│       ├── middleware/
│       │   ├── auth.js              # JWT verification
│       │   ├── errorHandler.js      # Global error handling
│       │   ├── socketAuth.js        # Socket authentication
│       │   └── upload.js            # File upload handling
│       ├── models/
│       │   ├── Job.model.js         # Job schema
│       │   ├── JobAlert.model.js    # Alert preferences
│       │   ├── JobListing.model.js  # Fetched jobs
│       │   ├── NotificationLog.model.js  # Email logs
│       │   ├── Resume.model.js      # User resumes
│       │   ├── TrackedJob.model.js  # Application tracking
│       │   └── User.model.js        # User profiles
│       ├── routes/
│       │   ├── auth.js              # Authentication
│       │   ├── community.js         # Community features
│       │   ├── enhance.js           # AI enhancement
│       │   ├── fellowships.js       # Fellowship challenges & proposals
│       │   ├── interview.js         # AI mock interviews
│       │   ├── jobAlerts.js         # Job alerts CRUD
│       │   ├── jobsRoute.js         # Job search
│       │   ├── jobTracker.js        # Application tracking
│       │   ├── payments.js          # Razorpay payments & escrow
│       │   ├── resume.js            # Resume management
│       │   └── upload.js            # File uploads
│       ├── services/
│       │   ├── firebaseDataService.js    # Firebase operations
│       │   ├── interviewService.js       # AI interview logic
│       │   ├── jobAlertQueue.js          # BullMQ queue
│       │   ├── jobAlertSocket.js         # Real-time notifications
│       │   ├── jobFetcher.js             # Automated job fetching
│       │   ├── mailService.js            # Email sending
│       │   ├── notificationServices.js   # Push notifications
│       │   ├── paymentService.js         # Razorpay integration
│       │   ├── presenceService.js        # User presence
│       │   ├── rapidApiService.js        # Job API integration
│       │   └── socketServiceFirebase.js  # Socket handlers
│       └── utils/
│           ├── jobSearch.js         # Search utilities
│           └── queueManager.js      # Queue management
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx                  # Root component
│       ├── main.jsx                 # Entry point
│       ├── index.css                # Global styles
│       ├── components/
│       │   ├── Button.jsx           # Reusable button
│       │   ├── Card.jsx             # Card component
│       │   ├── FileUpload.jsx       # Drag & drop upload
│       │   ├── Input.jsx            # Form input
│       │   ├── JobAlertModal.jsx    # Alert creation modal
│       │   ├── JobAlertsList.jsx    # Alerts display
│       │   ├── Layout.jsx           # Page layout
│       │   ├── Navbar.jsx           # Navigation bar
│       │   ├── community/           # Community components
│       │   │   ├── ChannelList.jsx
│       │   │   ├── ChatWindow.jsx
│       │   │   ├── DirectMessages.jsx
│       │   │   ├── MembersList.jsx
│       │   │   ├── MessageBubble.jsx
│       │   │   ├── MessageInput.jsx
│       │   │   ├── PostCard.jsx
│       │   │   ├── PostEditor.jsx
│       │   │   └── PostsFeed.jsx
│       │   └── ui/                  # UI components
│       │       ├── AnimatedText.jsx
│       │       ├── CTASection.jsx
│       │       ├── FeaturesSection.jsx
│       │       ├── Footer.jsx
│       │       ├── Globe.jsx
│       │       ├── HeroSection.jsx
│       │       └── WorldMap.jsx
│       ├── config/
│       │   └── firebase.js          # Firebase client config
│       ├── context/
│       │   ├── AuthContext.jsx      # Auth state management
│       │   └── SocketContext.jsx    # Socket.IO context
│       ├── hooks/
│       │   ├── usePresence.js       # User presence hook
│       │   └── useSocket.js         # Socket hook
│       ├── lib/
│       │   └── utils.js             # Utility functions
│       ├── pages/
│       │   ├── Community.jsx        # Community page
│       │   ├── Dashboard.jsx        # Main dashboard
│       │   ├── Enhance.jsx          # Resume enhancement
│       │   ├── Home.jsx             # Landing page
│       │   ├── InterviewPrep.jsx    # AI mock interviews
│       │   ├── JobAlerts.jsx        # Alerts management
│       │   ├── JobSearch.jsx        # Job search page
│       │   ├── JobTracker.jsx       # Application tracker
│       │   ├── Login.jsx            # Login page
│       │   ├── Register.jsx         # Registration page
│       │   ├── ResumeView.jsx       # Resume display
│       │   ├── Upload.jsx           # Resume upload
│       │   └── fellowship/          # Fellowship feature
│       │       ├── ChallengeDetail.jsx
│       │       ├── ChallengeProposals.jsx
│       │       ├── Challenges.jsx
│       │       ├── CreateChallenge.jsx
│       │       ├── FellowshipChat.jsx
│       │       ├── FellowshipLayout.jsx
│       │       ├── FellowshipMessages.jsx
│       │       ├── MyChallenges.jsx
│       │       ├── MyProposals.jsx
│       │       ├── Onboarding.jsx
│       │       └── Verify.jsx
│       └── services/
│           ├── api.js               # API service layer
│           └── socket.js            # Socket client
└── firebase/
    ├── firestore.indexes.json       # Firestore indexes
    ├── firestore.rules              # Security rules
    └── storage.rules                # Storage security
```

---

## 🔌 API Routes

### Authentication

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| `POST` | `/api/auth/verify`  | Verify Firebase token |
| `GET`  | `/api/auth/profile` | Get user profile      |

### Upload

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| `POST` | `/api/upload`              | Upload and parse PDF resume |
| `POST` | `/api/upload/extract-text` | Extract text from PDF       |

### Resume Management

| Method   | Endpoint                          | Description          |
| -------- | --------------------------------- | -------------------- |
| `GET`    | `/api/resumes`                    | Get all user resumes |
| `GET`    | `/api/resumes/:resumeId`          | Get specific resume  |
| `POST`   | `/api/resumes`                    | Create new resume    |
| `PUT`    | `/api/resumes/:resumeId`          | Update resume        |
| `DELETE` | `/api/resumes/:resumeId`          | Delete resume        |
| `GET`    | `/api/resumes/:resumeId/download` | Download as PDF      |

### AI Enhancement

| Method | Endpoint                    | Description                   |
| ------ | --------------------------- | ----------------------------- |
| `POST` | `/api/enhance`              | Enhance resume with AI        |
| `POST` | `/api/enhance/summary`      | Generate professional summary |
| `POST` | `/api/enhance/suggestions`  | Get improvement suggestions   |
| `POST` | `/api/enhance/ats-analysis` | Analyze ATS compatibility     |

### Job Search

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| `GET`  | `/api/fetchjobs` | Search for jobs |

### Job Alerts

| Method   | Endpoint                        | Description          |
| -------- | ------------------------------- | -------------------- |
| `GET`    | `/api/job-alerts`               | Get all alerts       |
| `GET`    | `/api/job-alerts/stats/summary` | Get alert statistics |
| `GET`    | `/api/job-alerts/:id`           | Get specific alert   |
| `POST`   | `/api/job-alerts`               | Create new alert     |
| `PUT`    | `/api/job-alerts/:id`           | Update alert         |
| `DELETE` | `/api/job-alerts/:id`           | Delete alert         |

### Job Tracker

| Method   | Endpoint                      | Description             |
| -------- | ----------------------------- | ----------------------- |
| `GET`    | `/api/job-tracker`            | Get all tracked jobs    |
| `GET`    | `/api/job-tracker/stats`      | Get tracking statistics |
| `POST`   | `/api/job-tracker`            | Track new job           |
| `PUT`    | `/api/job-tracker/:trackerId` | Update job status       |
| `DELETE` | `/api/job-tracker/:trackerId` | Remove tracked job      |

### Community

| Method | Endpoint                                      | Description          |
| ------ | --------------------------------------------- | -------------------- |
| `GET`  | `/api/community/channels`                     | Get all channels     |
| `POST` | `/api/community/channels`                     | Create channel       |
| `GET`  | `/api/community/channels/:channelId/messages` | Get channel messages |
| `GET`  | `/api/community/posts`                        | Get all posts        |
| `POST` | `/api/community/posts`                        | Create post          |
| `POST` | `/api/community/posts/:postId/like`           | Toggle like          |
| `GET`  | `/api/community/posts/:postId/comments`       | Get comments         |
| `POST` | `/api/community/posts/:postId/comments`       | Add comment          |
| `GET`  | `/api/community/conversations`                | Get DM conversations |
| `GET`  | `/api/community/online-users`                 | Get online users     |

### Fellowships

| Method   | Endpoint                                      | Description                   |
| -------- | --------------------------------------------- | ----------------------------- |
| `GET`    | `/api/fellowship/profile`                     | Get fellowship profile        |
| `POST`   | `/api/fellowship/profile`                     | Create/update profile         |
| `POST`   | `/api/fellowship/verify/send-email`           | Send verification email       |
| `POST`   | `/api/fellowship/verify/confirm`              | Confirm verification code     |
| `GET`    | `/api/fellowship/challenges`                  | Get all challenges            |
| `POST`   | `/api/fellowship/challenges`                  | Create challenge (Corporate)  |
| `GET`    | `/api/fellowship/challenges/:id`              | Get challenge details         |
| `DELETE` | `/api/fellowship/challenges/:id`              | Delete challenge              |
| `POST`   | `/api/fellowship/challenges/:id/apply`        | Apply to challenge (Student)  |
| `GET`    | `/api/fellowship/challenges/:id/proposals`    | Get proposals for challenge   |
| `PUT`    | `/api/fellowship/proposals/:id/status`        | Accept/reject proposal        |
| `GET`    | `/api/fellowship/my-challenges`               | Get my challenges (Corporate) |
| `GET`    | `/api/fellowship/my-proposals`                | Get my proposals (Student)    |
| `GET`    | `/api/fellowship/chat/rooms`                  | Get chat rooms                |
| `GET`    | `/api/fellowship/chat/rooms/:roomId`          | Get chat room details         |
| `GET`    | `/api/fellowship/chat/rooms/:roomId/messages` | Get messages                  |
| `POST`   | `/api/fellowship/chat/rooms/:roomId/messages` | Send message                  |

### Interview Prep

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| `POST` | `/api/interview/start`        | Start mock interview  |
| `POST` | `/api/interview/:id/answer`   | Submit answer         |
| `POST` | `/api/interview/:id/complete` | Complete interview    |
| `GET`  | `/api/interview/:id`          | Get interview details |
| `GET`  | `/api/interview/history`      | Get interview history |

### Payments

| Method | Endpoint                              | Description                      |
| ------ | ------------------------------------- | -------------------------------- |
| `POST` | `/api/payments/create-order`          | Create Razorpay order            |
| `POST` | `/api/payments/verify-payment`        | Verify payment & accept proposal |
| `POST` | `/api/payments/release-funds/:roomId` | Release escrow funds             |
| `GET`  | `/api/payments/status/:roomId`        | Get payment status               |

> 📚 **For complete API documentation, see [API_DOCS/README.md](./API_DOCS/README.md)**

---

## 🎯 Feature Details

### Resume Enhancement Pipeline

1. **Upload**: User uploads PDF resume
2. **Extraction**: pdf-parse extracts text content
3. **Analysis**: Text sent to Gemini AI with job role preferences
4. **Enhancement**: AI generates optimized Harvard-format resume
5. **Storage**: Enhanced resume saved to MongoDB
6. **Download**: User can download as formatted PDF

### Job Alert System

1. **Alert Creation**: User sets keywords, location, salary filters
2. **Queue Processing**: BullMQ handles alerts in background
3. **Job Fetching**: RapidAPI JSearch finds matching jobs
4. **Deduplication**: New jobs compared against notification history
5. **Notification**: Email sent + real-time socket notification
6. **Logging**: All notifications tracked for analytics

### Real-time Community

1. **Socket Connection**: User connects with authenticated token
2. **Channel Join**: User subscribes to channel rooms
3. **Message Flow**: Messages broadcast to channel members
4. **Presence**: Online/offline status tracked
5. **DMs**: Private conversations via personal rooms

### Fellowship Payment Flow

1. **Challenge Creation**: Corporate creates challenge with requirements and price
2. **Student Application**: Students submit proposals with cover letter and pricing
3. **Proposal Review**: Corporate reviews and selects proposal
4. **Payment**: On acceptance, Razorpay checkout opens for escrow payment
5. **Chat Room**: After payment, chat room created with "In Escrow" status
6. **Collaboration**: Student and corporate discuss and work on challenge
7. **Completion**: Corporate releases funds when satisfied
8. **Challenge Closed**: Challenge marked complete, chat archived

### AI Interview Pipeline

1. **Configuration**: User selects role, difficulty, and interview type
2. **Question Generation**: Gemini AI generates role-specific questions
3. **Response Capture**: User answers questions in real-time
4. **AI Evaluation**: Each answer scored with detailed feedback
5. **Final Report**: Comprehensive performance analysis and suggestions

---

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build for production
cd frontend
npm run build

# Preview build locally
npm run preview
```

**Environment Variables to Set:**

- All `VITE_*` variables from frontend .env

### Backend Deployment (Railway/Render/Heroku)

```bash
# Production start
cd backend
npm start
```

**Environment Variables to Set:**

- All variables from backend .env
- Ensure `NODE_ENV=production`

### Firebase Setup

1. Create Firebase project
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Set up Storage bucket
5. Download service account JSON
6. Configure security rules

### Database Setup

**MongoDB Atlas:**

1. Create cluster
2. Add database user
3. Whitelist IP addresses
4. Get connection string

**Redis (Upstash/Redis Cloud):**

1. Create Redis instance
2. Get connection credentials
3. Configure BullMQ

### LinkedIn OAuth Setup

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a new app and request `openid`, `profile`, and `email` scopes
3. Add your redirect URI: `<BACKEND_URL>/api/auth/linkedin/callback`
4. Copy the Client ID and Secret into your backend `.env`

### Multi-Provider AI Setup (Optional)

CareerPilot supports Gemini (default), Groq, and OpenAI as AI backends. Set `AI_PROVIDER` in your backend `.env` to switch providers without changing any application code:

```env
# Use Gemini (default)
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key

# Or use Groq
AI_PROVIDER=groq
GROQ_API_KEY=your-groq-key

# Or use OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-key
```

---

## 📖 Documentation

| Document                                       | Description                                       |
| ---------------------------------------------- | ------------------------------------------------- |
| [Architecture](./ARCHITECTURE.md)              | System architecture, data flows, database schemas |
| [API Reference](./API_DOCS/README.md)          | Complete API documentation                        |
| [Real-World Use Cases](./Real_life_usecase.md) | Success stories and applications                  |
| [Contributing Guide](./CONTRIBUTION.md)        | How to contribute to the project                  |

---

## 🌍 Real-World Use Cases

See [Real_life_usecase.md](./Real_life_usecase.md) for detailed success stories including:

- **Fresh Graduates**: First job seekers optimizing resumes for entry-level positions
- **Career Changers**: Professionals transitioning to new industries
- **Job Seeker Networks**: Building communities for mutual support
- **Recruitment Agencies**: Bulk resume processing and matching
- **University Career Centers**: Student resume workshops and tracking

---

## 🖼️ Screenshots

> 📸 **Screenshots and GIFs of new features will be added here once available. PRs with screenshots are very welcome!**

| Feature | Preview |
| ------- | ------- |
| Portfolio Builder — AI Section Enhancement | _Coming soon_ |
| LinkedIn Profile Optimizer — Score Breakdown | _Coming soon_ |
| AI Email Generator — Tone Selection | _Coming soon_ |
| Company Research — Glassdoor-style Report | _Coming soon_ |
| Two-Factor Authentication Setup | _Coming soon_ |

---

## 📊 Feature Comparison

| Feature | Free | Pro |
| ------- | ---- | --- |
| AI Resume Enhancement | ✅ | ✅ |
| ATS Score Analysis | ✅ | ✅ |
| Job Application Tracker | ✅ | ✅ |
| Job Alerts (bi-daily) | ✅ | ✅ |
| Community Platform | ✅ | ✅ |
| AI Mock Interviews | ✅ | ✅ |
| Portfolio Builder + AI Enhancement | ✅ | ✅ |
| LinkedIn Profile Optimizer | ✅ | ✅ |
| AI Email Generator | ✅ | ✅ |
| Company Research AI | ✅ | ✅ |
| careerpilot Fellowships (Escrow Payments) | ✅ | ✅ |
| Two-Factor Authentication | ✅ | ✅ |
| LinkedIn OAuth Login | ✅ | ✅ |

---

## 🛠️ Troubleshooting Guide

If you encounter issues while setting up or running the project locally, try the following common fixes before creating a new issue.

### MongoDB Connection Error:

#### Problem

```bash
MongoServerSelectionError
```

#### Solution

- Verify your `MONGODB_URI` in backend `.env`
- Ensure MongoDB service is running
- Check internet connection if using MongoDB Atlas
- Restart backend server after updating environment variables

### Redis Connection Error:

#### Problem

```bash
ECONNREFUSED 127.0.0.1:6379
```

#### Solution

- Ensure Redis server is installed and running
- Verify `REDIS_HOST` and `REDIS_PORT`
- Restart Redis service
- Check firewall restrictions

### Firebase Admin Initialization Error:

#### Problem

```bash
FirebaseAppError
```

#### Solution

- Verify Firebase credentials in `.env`
- Ensure service account JSON is valid
- Check `FIREBASE_PROJECT_ID`
- Restart backend server after changes

### Port Already in Use:

#### Problem

```bash
EADDRINUSE
```

#### Solution

- Change the `PORT` value in `.env`
- Stop other applications using the same port
- Restart your terminal and development server

### npm Install Errors:

#### Problem

Dependencies fail during installation.

#### Solution

Run:

```bash
npm install
```

If the issue persists:

```bash
npm cache clean --force
```

Then reinstall dependencies:

```bash
npm install
```

### Frontend Not Starting:

#### Problem

Frontend server does not run properly.

#### Solution

- Ensure frontend `.env` exists
- Verify all `VITE_*` variables are correct
- Run:

```bash
npm run dev
```

inside the `frontend` directory.

### Backend Not Starting:

#### Problem

Backend crashes during startup.

#### Solution

- Ensure backend `.env` is configured
- Verify MongoDB and Redis are running
- Run:

```bash
npm run dev
```

inside the `backend` directory.

### Environment Variables Tips:

- Never commit `.env` files
- Double-check all API keys
- Restart servers after changing environment variables
- Ensure no extra spaces are added in `.env`



## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTION.md](./CONTRIBUTION.md) for:

- Code of Conduct
- Development Setup
- Pull Request Process
- Coding Standards
- Issue Guidelines

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

---

## 👥 Contributors

This project exists thanks to all the people who contribute. [Become a contributor!](./CONTRIBUTION.md)

<a href="https://github.com/your-username/career-pilot/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=your-username/career-pilot" width="300" />
</a>

---

## 🙏 Acknowledgments

- Google Gemini AI for resume enhancement capabilities
- Firebase for authentication and real-time database
- JSearch API for job listings
- The open-source community for amazing tools

---

<div align="center">



</div>
