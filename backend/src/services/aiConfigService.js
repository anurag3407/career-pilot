import crypto from 'crypto';
import AiConfig from '../models/AiConfig.model.js';

const ALGORITHM = 'aes-256-gcm';

const getKey = () => {
  const key = process.env.TOTP_ENCRYPTION_KEY;
  if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error('TOTP_ENCRYPTION_KEY must be a 64-character hex string (32 bytes) for AI Key Encryption.');
  }
  return Buffer.from(key, 'hex');
};

export const encrypt = (plaintext) => {
  if (!plaintext) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('hex'), encrypted.toString('hex'), tag.toString('hex')].join(':');
};

export const decrypt = (ciphertext) => {
  if (!ciphertext) return '';
  const parts = ciphertext.split(':');
  if (parts.length !== 3) return '';
  const [ivHex, encHex, tagHex] = parts;
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([
    decipher.update(Buffer.from(encHex, 'hex')),
    decipher.final()
  ]).toString('utf8');
};

export const getAiConfig = async (uid) => {
  const config = await AiConfig.findOne({ uid });
  if (!config) return null;
  
  return {
    provider: config.provider,
    apiKey: decrypt(config.apiKeyEncrypted),
    model: config.model,
  };
};

export const saveAiConfig = async (uid, { provider, apiKey, model }) => {
  const updateData = { provider, model };
  
  // Only update the API key if a new one is provided.
  // The frontend sends '••••••••' as a placeholder if they haven't changed the key.
  if (apiKey && apiKey !== '••••••••') {
    updateData.apiKeyEncrypted = encrypt(apiKey);
  } else if (apiKey === '') {
    // If explicitly empty, clear it
    updateData.apiKeyEncrypted = '';
  }

  await AiConfig.findOneAndUpdate(
    { uid },
    updateData,
    { upsert: true, new: true }
  );
};
