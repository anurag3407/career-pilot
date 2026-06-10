import 'dotenv/config';
import express from 'express';
import dotenv from "dotenv";
dotenv.config();

import { createServer } from 'http';
import cors from 'cors';
import { cspHeaders } from './middleware/cspHeaders.js';
import helmet from 'helmet';
import compressionMiddleware from './middleware/compression.js';
import rateLimit from 'express-rate-limit';
import searchRoutes from './routes/search.js';
import portfolioRoutes from './routes/portfolio.js';
import uploadRoutes from './routes/upload.js';
import resumeRoutes from './routes/resume.js';
import enhanceRoutes from './routes/enhance.js';
import authRoutes from './routes/auth.js';
import jobsRoutes from './routes/jobsRoute.js';
import jobTrackerRoutes from './routes/jobTracker.js';
import jobAlertRoutes from './routes/jobAlerts.js';
import communityRoutes from './routes/community.js';
import fellowshipRoutes from './routes/fellowships.js';
import interviewRoutes from './routes/interview.js';

import userProfileRoutes from './routes/userProfile.js';
import twoFactorRoutes from './routes/twoFactor.js';
import aiRoutes from './routes/ai.js';
import emailTrackingRoutes from './routes/emailTracking.js';
import repoAnalyzerRoutes from './routes/repoAnalyzer.js';
import projectVisualizerRoutes from './routes/projectVisualizer.route.js';
import adminRoutes from './routes/admin.js';
import bullBoardRoutes from './routes/bullBoard.js';

import inputRoutes from'./routes/input.route.js';
import recruiterRoutes from '../src/routes/recruiter.routes.js';

import { globalErrorHandler } from './middleware/globalErrorHandler.js';
import {
  metricsMiddleware,
  metricsHandler,
} from "./middleware/metrics.js";
import redisManager from './config/redis.js';

import { initializeSocket } from './config/socket.js';

import { initializeDefaultChannels } from './controllers/communityFirebaseController.js';
import { initializePostScheduler } from './services/postScheduler.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

import { connectDB as baseConnectDB } from './config/database.js';
import { initJobFetcher } from './services/jobFetcher.js';
import JobAlert from './models/JobAlert.model.js';
import { initGitHubSyncCron } from './services/portfolioGitHubSync.js';
import coverLetterRoutes from "./routes/coverLetter.js";

const shouldInitGitHubSyncCron =
  process.env.ENABLE_GITHUB_SYNC_CRON !== 'false' &&
  process.env.NODE_ENV !== 'test';

const connectDB = async (...args) => {
  await baseConnectDB(...args);

  if (shouldInitGitHubSyncCron) {
    initGitHubSyncCron();
  }
};

import {
  scheduleWeeklyDigest,
  initializeDigestQueue,
  startDigestWorker
} from './services/weeklyDigestService.js';
import { getSafeConfig } from './utils/safeConfig.js';
import { validateEmailConfig } from './utils/emailConfig.js';

// ==========================================================================
// Configuration validation - Check for required API keys (dev only)
// ==========================================================================
if (process.env.NODE_ENV === 'development') {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY is not configured - AI features will be unavailable.');
    console.warn('   Set GEMINI_API_KEY in your .env file to enable Google Gemini features.');
  }

  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  GROQ_API_KEY is not configured - Groq AI provider will not be available.');
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY is not configured - OpenAI provider will not be available.');
  }
}
const app = express();
app.use(metricsMiddleware);
app.use(compressionMiddleware);
const httpServer = createServer(app);
const PORT = process.env.PORT || 5001;

// Log a presence-only configuration summary in development only.
// Secrets cannot leak into startup logs or aggregated log output.
if (process.env.NODE_ENV === 'development') {
  console.log('✓ Config summary:', getSafeConfig(process.env, [
    'NODE_ENV',
    'FRONTEND_URL',
    'EMAIL_SERVICE_URL',
    'GEMINI_API_KEY',
    'GROQ_API_KEY',
    'OPENAI_API_KEY',
  ]));
}
// CORS configuration - MUST come before helmet
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://careerpilotyy.netlify.app',
  process.env.FRONTEND_URL,
].filter(Boolean).map(url => url.replace(/\/$/, ''));

console.log('🔧 Allowed origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin, '| Allowed:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-AI-Provider', 'X-AI-Key', 'X-AI-Model', 'X-OpenRouter-Key']
}));

// Helmet security headers - configured to not interfere with CORS
app.use(cspHeaders);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://apis.google.com",
        "https://accounts.google.com",
        "https://www.gstatic.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",
      ],
      connectSrc: [
        "'self'",
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://firebaseapp.com",
        "https://*.googleapis.com",
        "https://*.firebaseio.com",
        "https://identitytoolkit.googleapis.com",
        "wss:",
        "ws:",
      ],
      frameSrc: [
        "'self'",
        "https://accounts.google.com",
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    const resetTime = req.rateLimit?.resetTime;
    const retryAfterSeconds = resetTime
      ? Math.max(1, Math.ceil((resetTime - Date.now()) / 1000))
      : Math.ceil((options.windowMs || 0) / 1000);

    const headers = {
      'Retry-After': String(retryAfterSeconds),
      'X-RateLimit-Limit': String(options.max),
      'X-RateLimit-Remaining': String(req.rateLimit?.remaining ?? 0),
      'X-RateLimit-Quota': String(options.max)
    };

    if (resetTime) {
      headers['X-RateLimit-Reset'] = String(Math.ceil(resetTime / 1000));
    }

    res.set(headers);
    res.status(options.statusCode).json({
      success: false,
      error: options.message?.error || 'Rate limit exceeded',
      message: options.message
    });
  },
  message: {
    error: 'Too many requests, please try again later.'
  }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.get('/metrics', metricsHandler);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/enhance', enhanceRoutes);
app.use("/api/cover-letter", coverLetterRoutes);
app.use('/api/fetchjobs', jobsRoutes);
app.use('/api/job-tracker', jobTrackerRoutes);
app.use('/api/job-alerts', jobAlertRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/fellowship', fellowshipRoutes);
app.use('/api/interview', interviewRoutes);
app.use("/api/upload", inputRoutes);
app.use("/api/recruiter", recruiterRoutes);
try {
    const paymentRoutes = (await import('./routes/payments.js')).default;
    app.use('/api/payments', paymentRoutes);
    console.log('✅ Payment routes loaded');
} catch (error) {
    console.warn('⚠️ Payment routes disabled:', error.message);
}
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/user-profiles', userProfileRoutes);
app.use('/api/auth/2fa', twoFactorRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/email-tracking', emailTrackingRoutes);
app.use('/api/analyzer', repoAnalyzerRoutes);
app.use('/api/project-visualizer', projectVisualizerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/queues', bullBoardRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    // Fail fast in production when email is not configured; warn otherwise.
    // Without this check, missing credentials surface only later as silent
    // send failures.
    const emailStatus = validateEmailConfig(process.env);
    if (emailStatus.enabled) {
      console.log(`📧 ${emailStatus.message}`);
    } else {
      console.warn(`⚠️ ${emailStatus.message}`);
    }

    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });

    try {
      await initializeDefaultChannels();
      console.log('💬 Community channels initialized');
    } catch (channelError) {
      console.warn('⚠️ Could not initialize default channels:', channelError.message);
    }

    try {
      await initializePostScheduler();
    } catch (schedulerError) {
      console.warn('⚠️ Post scheduler initialization skipped:', schedulerError.message);
    }

    const allowDevDbMutations = process.env.ALLOW_DEV_DB_MUTATIONS === 'true';
    if (process.env.NODE_ENV === 'development' && allowDevDbMutations) {
      try {
        const testEmail = process.env.DEV_USER_EMAIL || process.env.EMAIL_USER;
        if (testEmail) {
          const result = await JobAlert.updateMany(
            { userEmail: 'dev@example.com' },
            { $set: { userEmail: testEmail } }
          );
          if (result.modifiedCount > 0) {
            console.log(`📧 Updated ${result.modifiedCount} alerts to use email: ${testEmail}`);
          }
        }
      } catch (err) {
        console.warn('⚠️ Could not update dev alert emails:', err.message);
      }
    } else if (process.env.NODE_ENV === 'development' && !allowDevDbMutations) {
      console.info('ℹ️ Skipping dev alert email update (ALLOW_DEV_DB_MUTATIONS is not true)');
    }

    initializeSocket(httpServer);

    try {
      await initJobFetcher();
    } catch (fetcherError) {
      console.warn('⚠️ Job fetcher initialization skipped:', fetcherError.message);
    }

    try {
      const digestQueueReady = await initializeDigestQueue();
      if (digestQueueReady) {
        startDigestWorker();
      }
      scheduleWeeklyDigest();
    } catch (digestError) {
      console.warn(
        '⚠️ Weekly digest scheduler initialization skipped:',
        digestError.message
      );
    }

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal) => {
    console.log(`\n📥 Received ${signal}, shutting down gracefully...`);
    await redisManager.shutdown();
    console.log('👋 Server shutdown complete');
    process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on("unhandledRejection", (reason) => {
  console.error("❌ UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION:", err);
  httpServer.close();
  redisManager.shutdown().finally(() => process.exit(1));
  setTimeout(() => process.exit(1), 10000).unref();
});

export default app;
