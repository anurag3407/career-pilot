import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import searchRoutes from './routes/search.js';

dotenv.config();
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
import paymentRoutes from './routes/payments.js';
import userProfileRoutes from './routes/userProfile.js';
import twoFactorRoutes from './routes/twoFactor.js';
import aiRoutes from './routes/ai.js';

import { errorHandler } from './middleware/errorHandler.js';

import { initializeSocket } from './config/socket.js';

import { initializeDefaultChannels } from './controllers/communityFirebaseController.js';
import { initializePostScheduler } from './services/postScheduler.js';

import { connectDB } from './config/database.js';
import { initJobFetcher } from './services/jobFetcher.js';
import JobAlert from './models/JobAlert.model.js';

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Log FRONTEND_URL for debugging
console.log('🔧 FRONTEND_URL env var:', process.env.FRONTEND_URL);

// CORS configuration - MUST come before helmet
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://careerpilotyy.netlify.app',  // Hardcoded as fallback
  process.env.FRONTEND_URL,
].filter(Boolean).map(url => url.replace(/\/$/, '')); // Remove trailing slashes

console.log('🔧 Allowed origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Normalize origin by removing trailing slash
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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-AI-Provider', 'X-AI-Key', 'X-AI-Model']
}));

// Helmet security headers - configured to not interfere with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // increased for development
  message: {
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
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

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/enhance', enhanceRoutes);
app.use('/api/fetchjobs', jobsRoutes);
app.use('/api/job-tracker', jobTrackerRoutes);
app.use('/api/job-alerts', jobAlertRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/fellowship', fellowshipRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/user-profiles', userProfileRoutes);
app.use('/api/auth/2fa', twoFactorRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.use(errorHandler);
const startServer = async () => {
  try {
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

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
