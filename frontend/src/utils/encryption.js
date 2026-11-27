import CryptoJS from 'crypto-js';

const FALLBACK_SECRET = 'fallback_secret_key_careerpilot';

function getActiveUserId() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const d1Raw = localStorage.getItem('careerpilot:d1:session');
    if (d1Raw) {
      const parsed = JSON.parse(d1Raw);
      if (parsed?.user?.id) return parsed.user.id;
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') && key.endsWith('-auth-token'))) {
        const item = JSON.parse(localStorage.getItem(key));
        if (item?.user?.id) return item.user.id;
      }
    }
  } catch {
    // Ignore storage parse issues
  }
  return null;
}

const getSecretKey = () => {
  const userId = getActiveUserId();
  return userId || FALLBACK_SECRET;
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

    if (originalText) return originalText;

    if (secret !== FALLBACK_SECRET) {
      const fallbackBytes = CryptoJS.AES.decrypt(cipherText, FALLBACK_SECRET);
      const fallbackText = fallbackBytes.toString(CryptoJS.enc.Utf8);
      if (fallbackText) return fallbackText;
    }

    return cipherText;
  } catch (error) {
    // If decryption throws, it might be plaintext
    return cipherText;
  }
};
