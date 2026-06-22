import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 * AES-256-GCM encrypted GitHub access token, stored for OAuth-connected users.
 *
 * Encrypted at rest with a key derived from the runtime secret
 * (process.env.GITHUB_TOKEN_ENCRYPTION_KEY or a stable fallback derived from
 * FIREBASE_PROJECT_ID). Decryption happens in middleware/githubKey.js on demand.
 *
 * Fields:
 * - userId:   Firebase UID of owner
 * - provider: 'github-oauth-app'
 * - accessToken: ciphertext (string)
 * - iv:        initialisation vector (hex)
 * - authTag:   GCM authentication tag (hex)
 * - scopes:    granted scopes (string)
 * - githubLogin: the GitHub username
 * - lastUsedAt:  updated on each successful read
 */
const githubTokenSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    provider: { type: String, default: 'github-oauth-app' },
    accessToken: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    scopes: { type: String, default: '' },
    githubLogin: { type: String, default: '' },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

githubTokenSchema.index({ userId: 1, provider: 1 }, { unique: true });

const ENC_KEY = () => {
  const raw =
    process.env.GITHUB_TOKEN_ENCRYPTION_KEY ||
    (process.env.FIREBASE_PROJECT_ID || 'careerpilot-default-github-key').padEnd(32, '0').slice(0, 32);
  // Ensure 32-byte key
  return crypto.createHash('sha256').update(String(raw)).digest();
};

/**
 * Encrypt a GitHub access token for at-rest storage.
 * @param {string} plaintext
 * @returns {{accessToken: string, iv: string, authTag: string}}
 */
githubTokenSchema.statics.encryptToken = function encryptToken(plaintext) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENC_KEY(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    accessToken: ciphertext.toString('base64'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
};

/**
 * Decrypt a stored GitHub access token.
 * @param {{accessToken: string, iv: string, authTag: string}} record
 * @returns {string} plaintext token
 */
githubTokenSchema.statics.decryptToken = function decryptToken(record) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    ENC_KEY(),
    Buffer.from(record.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(record.authTag, 'hex'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(record.accessToken, 'base64')),
    decipher.final(),
  ]);
  return plaintext.toString('utf8');
};

export default mongoose.model('GithubToken', githubTokenSchema);