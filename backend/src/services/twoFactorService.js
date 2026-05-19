import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import TwoFactor from '../models/TwoFactor.model.js';

const ALGORITHM = 'aes-256-gcm';
const BACKUP_CODE_COUNT = 8;

const getKey = () => {
  const key = process.env.TOTP_ENCRYPTION_KEY;
  if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error('TOTP_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
  }
  return Buffer.from(key, 'hex');
};

const encrypt = (plaintext) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('hex'), encrypted.toString('hex'), tag.toString('hex')].join(':');
};

const decrypt = (ciphertext) => {
  const [ivHex, encHex, tagHex] = ciphertext.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([
    decipher.update(Buffer.from(encHex, 'hex')),
    decipher.final()
  ]).toString('utf8');
};

const normaliseCode = (code) => code.replace(/[^A-Fa-f0-9]/g, '').toUpperCase();

const makeBackupCodes = () =>
  Array.from({ length: BACKUP_CODE_COUNT }, () => {
    const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${hex.slice(0, 4)}-${hex.slice(4)}`;
  });

/**
 * Generate a new TOTP secret and return the base32 secret + QR data URL.
 * The secret is NOT stored yet — it must be confirmed with enableTwoFactor.
 */
export const generateSecret = async (email) => {
  const secret = speakeasy.generateSecret({
    name: `careerpilot (${email})`,
    issuer: 'careerpilot',
    length: 20
  });
  const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url);
  return { secret: secret.base32, qrDataUrl };
};

/**
 * Confirm setup: verify the first TOTP code against the raw secret, then
 * persist the encrypted secret and hashed backup codes. Returns plaintext
 * backup codes on success, null on bad token.
 */
export const enableTwoFactor = async (uid, rawSecret, token) => {
  const valid = speakeasy.totp.verify({
    secret: rawSecret,
    encoding: 'base32',
    token: String(token).replace(/\s/g, ''),
    window: 1
  });
  if (!valid) return null;

  const codes = makeBackupCodes();
  const hashed = await Promise.all(codes.map(c => bcrypt.hash(normaliseCode(c), 10)));

  await TwoFactor.findOneAndUpdate(
    { uid },
    { uid, secret: encrypt(rawSecret), enabled: true, backupCodes: hashed },
    { upsert: true, new: true }
  );

  return codes;
};

/**
 * Disable 2FA after verifying the user's current TOTP code.
 * Returns true on success, false on bad token or 2FA not enabled.
 */
export const disableTwoFactor = async (uid, token) => {
  const record = await TwoFactor.findOne({ uid, enabled: true }).select('+secret');
  if (!record?.secret) return false;

  const valid = speakeasy.totp.verify({
    secret: decrypt(record.secret),
    encoding: 'base32',
    token: String(token).replace(/\s/g, ''),
    window: 1
  });
  if (!valid) return false;

  record.secret = null;
  record.enabled = false;
  record.backupCodes = [];
  await record.save();
  return true;
};

/**
 * Verify a TOTP token during login. Returns true on valid code.
 */
export const verifyTotp = async (uid, token) => {
  const record = await TwoFactor.findOne({ uid, enabled: true }).select('+secret');
  if (!record?.secret) return false;

  return speakeasy.totp.verify({
    secret: decrypt(record.secret),
    encoding: 'base32',
    token: String(token).replace(/\s/g, ''),
    window: 1
  });
};

/**
 * Consume a backup code during login. Returns true and removes the used
 * code from storage; false if no matching code found.
 */
export const verifyBackupCode = async (uid, code) => {
  const record = await TwoFactor.findOne({ uid, enabled: true }).select('+backupCodes');
  if (!record?.backupCodes?.length) return false;

  const normalised = normaliseCode(code);
  let matchedHash = null;
  for (const hash of record.backupCodes) {
    if (await bcrypt.compare(normalised, hash)) {
      matchedHash = hash;
      break;
    }
  }
  if (!matchedHash) return false;

  // Atomic remove — concurrent requests racing on the same code will only
  // succeed if the hash is still present, preventing double-use.
  const updated = await TwoFactor.findOneAndUpdate(
    { uid, enabled: true, backupCodes: matchedHash },
    { $pull: { backupCodes: matchedHash } }
  );
  return updated !== null;
};

/**
 * Regenerate backup codes after verifying the current TOTP token.
 * Returns plaintext codes on success, null on bad token or 2FA not enabled.
 */
export const regenerateBackupCodes = async (uid, token) => {
  const record = await TwoFactor.findOne({ uid, enabled: true }).select('+secret');
  if (!record?.secret) return null;

  const valid = speakeasy.totp.verify({
    secret: decrypt(record.secret),
    encoding: 'base32',
    token: String(token).replace(/\s/g, ''),
    window: 1
  });
  if (!valid) return null;

  const codes = makeBackupCodes();
  record.backupCodes = await Promise.all(codes.map(c => bcrypt.hash(normaliseCode(c), 10)));
  await record.save();
  return codes;
};

/**
 * Return the 2FA status for a user (enabled flag + backup codes remaining).
 */
export const getStatus = async (uid) => {
  const record = await TwoFactor.findOne({ uid }).select('+backupCodes');
  return {
    enabled: record?.enabled ?? false,
    backupCodesRemaining: record?.backupCodes?.length ?? 0
  };
};
