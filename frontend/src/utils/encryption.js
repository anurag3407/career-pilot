import CryptoJS from 'crypto-js';

const getSecretKey = () => {
  const user = window.Clerk?.user;
  // Fallback secret if user is not fully loaded
  return user?.id || 'fallback_secret_key_careerpilot';
};

export const encryptKey = (plainTextKey) => {
  if (!plainTextKey) return plainTextKey;
  try {
    const secret = getSecretKey();
    return CryptoJS.AES.encrypt(plainTextKey, secret).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return null;
  }
};

export const decryptKey = (cipherText) => {
  if (!cipherText) return cipherText;

  try {
    const secret = getSecretKey();
    const bytes = CryptoJS.AES.decrypt(cipherText, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return originalText || cipherText;
  } catch (error) {
    // If decryption throws, it might be plaintext
    return cipherText;
  }
};
