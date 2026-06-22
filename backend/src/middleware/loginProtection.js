import LoginAttempt from '../models/LoginAttempt.model.js';
import { sendLockoutAlertEmail } from '../services/mailService.js';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

// Decode the JWT payload without verifying the signature — used only to
// extract the email claim for the lockout alert, not for authentication.
const getEmailFromToken = (authHeader) => {
  try {
    const token = authHeader?.split('Bearer ')[1];
    if (!token) return null;
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
    );
    return typeof payload.email === 'string' ? payload.email : null;
  } catch {
    return null;
  }
};

const handleFailure = async (ip, email, currentAttempts) => {
  const attempts = currentAttempts + 1;
  const isLockout = attempts >= MAX_ATTEMPTS;
  const lockoutUntil = isLockout ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null;

  await LoginAttempt.findOneAndUpdate(
    { ip },
    { ip, email, attempts, lockoutUntil },
    { upsert: true, new: true }
  );

  if (isLockout && email) {
    sendLockoutAlertEmail({ email, ip, lockoutUntil }).catch(
      (err) => console.error('Failed to send lockout alert:', err.message)
    );
  }
};

import LoginLog from '../models/LoginLog.model.js';

const handleSuccess = async (ip, email, userAgent) => {
  // Reset lockout
  await LoginAttempt.findOneAndUpdate(
    { ip },
    { attempts: 0, lockoutUntil: null, email },
    { upsert: true }
  );

  // Track persistent login history
  if (email) {
    try {
      await LoginLog.create({
        email,
        ip,
        userAgent: userAgent || 'Unknown'
      });
    } catch (err) {
      console.error('Failed to log successful login:', err.message);
    }
  }
};

export const loginProtection = async (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress;
  const isLoginRoute = (req.originalUrl || req.path || '').endsWith('/login') && req.method === 'POST';

  try {
    const record = await LoginAttempt.findOne({ ip });

    if (record?.lockoutUntil && new Date() < record.lockoutUntil) {
      return res.status(423).json({
        success: false,
        error: 'Too many failed login attempts. Please try again later.',
        unlockAt: record.lockoutUntil
      });
    }

    const email = req.body?.email || getEmailFromToken(req.headers.authorization) || record?.email;
    const currentAttempts = record?.attempts ?? 0;

    // Intercept res.json to observe the outcome without modifying verifyToken.
    // The error handler calls res.status(401).json(...) on auth failure, so
    // res.statusCode is already set when our override runs.
    const originalJson = res.json.bind(res);
    res.json = function (body) {
      const statusCode = res.statusCode;
      const userAgent = req.headers['user-agent'];
      const resolvedEmail = body?.user?.email || req.body?.email || email;

      if (isLoginRoute) {
        if (statusCode === 401) {
          handleFailure(ip, resolvedEmail, currentAttempts).catch(
            (err) => console.error('loginProtection failure tracking error:', err.message)
          );
        } else if (statusCode >= 200 && statusCode < 300) {
          // We call handleSuccess on successful logins to reset attempts and log history
          handleSuccess(ip, resolvedEmail, userAgent).catch(
            (err) => console.error('loginProtection success tracking error:', err.message)
          );
        }
      }

      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error('loginProtection error:', err.message);
    next();
  }
};
