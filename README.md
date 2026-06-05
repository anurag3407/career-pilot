<div align="center">
  <h1>🚀 Career Pilot</h1>
  <p>An advanced AI-powered Resume Builder application, aimed to help users build their resumes with ease, backed by Modern Web Technologies and Artificial Intelligence.</p>
</div>

## 👨‍💻 Maintainers

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/anurag3407">
          <img src="https://github.com/anurag3407.png" width="100" style="border-radius: 50%;" alt="anurag3407"/><br />
          <sub><b>anurag3407</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Mohnish27-dev">
          <img src="https://github.com/Mohnish27-dev.png" width="100" style="border-radius: 50%;" alt="Mohnish27-dev"/><br />
          <sub><b>Mohnish27-dev</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>

## 💻 Tech Stack

- **Frontend:** React 19, Vite
- **Styling & Animations:** TailwindCSS 4, Framer Motion
- **Authentication & Backend:** Firebase
- **Core Libraries:** jsPDF, html2canvas, socket.io-client, react-hook-form, @hello-pangea/dnd

## ✨ Features

- **Modern Tech Stack:** Built with React 19 and Vite for blazing fast development and optimized production builds.
- **Stunning UI/UX:** Styled using TailwindCSS 4, offering responsive and aesthetically pleasing design.
- **Accessibility:** Built-in support for Light, Dark, and High Contrast theme modes.
- **Authentication:** Secure Firebase Authentication integration.
- **Smooth Animations:** Powered by Framer Motion to provide delightful micro-interactions.
- **PDF Generation:** Export resumes reliably to PDF with `jsPDF` and `html2canvas`.
- **Drag & Drop:** Intuitive drag and drop interfaces using `@hello-pangea/dnd` and `react-dropzone`.
- **Real-time Collaboration:** Powered by `socket.io-client` for seamless live updates.
- **Markdown Support:** Enhanced text editing and formatting via `react-markdown`.
- **Form Management:** Robust form handling with `react-hook-form` and validation capabilities.

## 🛠️ Quick Start

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/anurag3407/career-pilot.git

# Navigate to the project directory
cd career-pilot

# Install frontend dependencies
npm install
```

### Environment Setup

Copy the example environment file and add your configuration details.

```bash
cp .env.example .env
```

Ensure you configure the `.env` file with your **Backend API** and **Firebase** credentials as per `.env.example`.

### Environment Variables Reference

Below is a complete reference for all environment variables used by the backend. Copy `backend/.env.example` to `backend/.env` and fill in your values.

> **Note:** Variables marked **Required** must be set for the app to function. Optional variables enable specific features.

#### Server

| Variable | Description | Type | Default | Required |
|---|---|---|---|---|
| `PORT` | Port the backend server listens on | `number` | `5000` | No |
| `NODE_ENV` | Runtime environment (`development` \| `staging` \| `production`) | `string` | `development` | Yes |
| `FRONTEND_URL` | Frontend app URL — used for CORS allow-list | `string` (URL) | `http://localhost:5173` | Yes |

#### Database (MongoDB)

| Variable | Description | Type | Example | Required |
|---|---|---|---|---|
| `MONGODB_URI` | MongoDB connection string (local or Atlas) | `string` (URI) | `mongodb://localhost:27017/career-pilot` | Yes |
| `ENABLE_DB_PROFILING` | Enable slow-query logging (dev/staging only) | `boolean` | `false` | No |

#### Firebase Admin SDK

| Variable | Description | Type | Required |
|---|---|---|---|
| `FIREBASE_PROJECT_ID` | Firebase project ID | `string` | Yes |
| `FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket name | `string` | Yes |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to service account JSON key file | `string` (file path) | No* |
| `FIREBASE_SERVICE_ACCOUNT` | Inline JSON service account (alternative to path) | JSON string | No* |

> *Either `FIREBASE_SERVICE_ACCOUNT_PATH` or `FIREBASE_SERVICE_ACCOUNT` must be provided.

#### AI Services

| Variable | Description | Type | Required |
|---|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key | `string` | No* |
| `GROQ_API_KEY` | Groq API key | `string` | No* |
| `OPENAI_API_KEY` | OpenAI API key | `string` | No* |
| `AI_PROVIDER` | Preferred AI provider (`gemini` \| `groq` \| `openai`) | `string` | No |

> *At least one AI provider key is required to enable AI features.

#### Job Search

| Variable | Description | Type | Required |
|---|---|---|---|
| `RAPIDAPI_KEY` | RapidAPI key for JSearch job listings | `string` | No |
| `RAPIDAPI_HOST` | RapidAPI host for job search | `string` | No |
| `PROXYCURL_API_KEY` | Proxycurl API key for LinkedIn data enrichment | `string` | No |

#### Email (Nodemailer)

| Variable | Description | Type | Example | Required |
|---|---|---|---|---|
| `EMAIL_USER` | Sender email address | `string` | `no-reply@example.com` | No |
| `EMAIL_PASS` | SMTP password / app password | `string` | — | No |
| `EMAIL_HOST` | SMTP server hostname | `string` | `smtp.gmail.com` | No |
| `EMAIL_PORT` | SMTP port | `number` | `587` | No |
| `EMAIL_SERVICE_URL` | External email microservice URL | `string` (URL) | — | No |
| `EMAIL_API_KEY` | Auth key for the email microservice | `string` | — | No |

#### Redis & Job Queues

| Variable | Description | Type | Example | Required |
|---|---|---|---|---|
| `REDIS_URL` | Redis connection URI | `string` (URI) | `redis://localhost:6379` | No |
| `BULL_BOARD_ENABLED` | Enable Bull monitoring dashboard | `boolean` | `true` | No |
| `BULL_BOARD_USERNAME` | Dashboard basic-auth username | `string` | `admin` | No |
| `BULL_BOARD_PASSWORD` | Dashboard basic-auth password | `string` | — | No |

#### Payments & OAuth

| Variable | Description | Required |
|---|---|---|
| `RAZORPAY_KEY_ID` | Razorpay key ID | No |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | No |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth App Client ID | No |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth App Client Secret | No |
| `LINKEDIN_REDIRECT_URI` | LinkedIn OAuth callback URL | No |

#### Security & Encryption

| Variable | Description | Type | Required |
|---|---|---|---|
| `ENCRYPTION_KEY` | 64-char hex key for encrypting sensitive tokens | `string` | Yes |
| `TOTP_ENCRYPTION_KEY` | 64-char hex key for TOTP secrets | `string` | Yes |

#### Portfolio Deployment

| Variable | Description | Required |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | No |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | No |
| `CLOUDFLARE_WEBHOOK_SECRET` | HMAC-SHA256 secret for Cloudflare webhooks | No |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | No |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | No |
| `GITHUB_TOKEN` | GitHub personal access token | No |
| `NETLIFY_ACCESS_TOKEN` | Netlify personal access token | No |
| `VERCEL_TOKEN` | Vercel deployment token | No |

#### Feature Flags & Local Development

| Variable | Description | Type | Default | Required |
|---|---|---|---|---|
| `ENABLE_PREMIUM_THEMES` | Toggle premium UI themes | `boolean` | `false` | No |
| `ADMIN_UIDS` | Comma-separated Firebase UIDs with admin access | `string` | — | No |
| `DEV_BYPASS_AUTH` | Bypass Firebase auth (local development only — **never in production**) | `boolean` | `false` | No |
| `DEV_USER_UID` | Fake user UID used when `DEV_BYPASS_AUTH=true` | `string` | — | No |
| `DEV_USER_EMAIL` | Fake user email used when `DEV_BYPASS_AUTH=true` | `string` | — | No |

### Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🌟 Contributing

We welcome and appreciate contributions from the community! Whether it's reporting bugs, improving documentation, or proposing new features, your help is valuable.

To make a contribution:
1. **Fork** the repository.
2. **Create a new branch** (`git checkout -b feature/your-feature-name`).
3. **Commit your changes** (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature/your-feature-name`).
5. **Open a Pull Request** against the `main` branch.

Please make sure to read our [Contribution Guidelines](CONTRIBUTION.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

## 🤝 Contributors

Thank you to everyone who has contributed to making **Career Pilot** better! 

<a href="https://github.com/anurag3407/career-pilot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=anurag3407/career-pilot" alt="Contributors" />
</a>

## 📄 License

This project is open-source. Please check the `LICENSE` file for more details.
