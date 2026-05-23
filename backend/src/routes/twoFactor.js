import express from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { verifyToken } from '../middleware/auth.js';
import * as twoFactor from '../services/twoFactorService.js';
import { validate } from '../middleware/validate.js';
import {
  enable2FASchema,
  tokenOnlySchema,
  backupCodeSchema,
} from '../schemas/twoFactor.schema.js';

const router = express.Router();

// Strict rate limit for code-verification endpoints to prevent brute force
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Too many verification attempts, please try again in 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.uid || req.ip
});

// GET /api/auth/2fa/status
router.get('/status', verifyToken, asyncHandler(async (req, res) => {
  const status = await twoFactor.getStatus(req.user.uid);
  res.json({ success: true, ...status });
}));

// POST /api/auth/2fa/setup
// Generates a fresh TOTP secret + QR code. Secret is not stored until /enable confirms it.
router.post('/setup', verifyToken, asyncHandler(async (req, res) => {
  const { secret, qrDataUrl } = await twoFactor.generateSecret(req.user.email);
  res.json({ success: true, secret, qrDataUrl });
}));

// POST /api/auth/2fa/enable
// Verifies the first TOTP scan, stores the encrypted secret, and returns one-time backup codes.
router.post('/enable', verifyToken, validate(enable2FASchema), asyncHandler(async (req, res) => {
  const { secret, token } = req.body;
  if (!secret || !token) throw new ApiError(400, 'secret and token are required');

  const backupCodes = await twoFactor.enableTwoFactor(req.user.uid, secret, token);
  if (!backupCodes) throw new ApiError(400, 'Invalid verification code — please try again');

  console.log('2FA enabled for a user');
  res.json({ success: true, backupCodes });
}));

// POST /api/auth/2fa/disable
// Requires a valid TOTP code to confirm intent before wiping 2FA state.
router.post('/disable', verifyToken, validate(tokenOnlySchema), asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, 'token is required');

  const ok = await twoFactor.disableTwoFactor(req.user.uid, token);
  if (!ok) throw new ApiError(400, 'Invalid verification code');

  console.log('2FA disabled for a user');
  res.json({ success: true });
}));

// POST /api/auth/2fa/verify  (rate-limited)
// Used during the login flow to confirm the TOTP code after Firebase auth succeeds.
router.post('/verify', verifyToken, verifyLimiter, validate(tokenOnlySchema), asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, 'token is required');

  const ok = await twoFactor.verifyTotp(req.user.uid, token);
  if (!ok) throw new ApiError(401, 'Invalid or expired code');

  res.json({ success: true });
}));

// POST /api/auth/2fa/verify-backup  (rate-limited)
// Allows login using a one-time backup code when the authenticator is unavailable.
router.post('/verify-backup', verifyToken, verifyLimiter, validate(backupCodeSchema), asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new ApiError(400, 'code is required');

  const ok = await twoFactor.verifyBackupCode(req.user.uid, code);
  if (!ok) throw new ApiError(401, 'Invalid backup code');

  res.json({ success: true });
}));

// POST /api/auth/2fa/backup-codes/regenerate
// Generates a fresh set of backup codes after verifying the current TOTP.
router.post('/backup-codes/regenerate', verifyToken, validate(tokenOnlySchema), asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, 'token is required');

  const codes = await twoFactor.regenerateBackupCodes(req.user.uid, token);
  if (!codes) throw new ApiError(400, 'Invalid verification code or 2FA is not enabled');

  console.log('2FA backup codes regenerated for a user');
  res.json({ success: true, backupCodes: codes });
}));

// POST /api/auth/2fa/disable-with-backup
// Allows disabling 2FA using a backup code when authenticator is unavailable.
router.post('/disable-with-backup', verifyToken, verifyLimiter, asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) throw new ApiError(400, 'code is required');

  const ok = await twoFactor.disableTwoFactorWithBackup(req.user.uid, code);
  if (!ok) throw new ApiError(401, 'Invalid backup code');

  console.log('2FA disabled using backup code for a user');
  res.json({ success: true });
}));

export default router;
