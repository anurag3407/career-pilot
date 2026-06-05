// using crypto module to encryypt and decrypt data  -- run npm install crypto-js if not install 
// Functions that i am going to write 
// encryptPII() : To encrypt a PII
// decryptPII() : To decrypt a PII
// Using try-catch for error handling
import crypto from 'crypto';
// Using AES-256-CBC for encryption
const ALGORITHM = 'aes-256-cbc';
// Get the encryption key from environment variable
if (!process.env.ENCRYPTION_KEY) {
  throw new Error('Missing ENCRYPTION_KEY');
}
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
export function encryptPII(plainText){
    // using random IV each time else it will produce same cipher text for same plain text
    const iv  = crypto.randomBytes(16);
    const dataEncrypter = crypto.createCipheriv(ALGORITHM,ENCRYPTION_KEY,iv);
    let encrypted = dataEncrypter.update(plainText,'utf8','hex');
    encrypted += dataEncrypter.final('hex');
    // return iv and encrypted data as hex string
    return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptPII(encryptedText){
    const [ivHex, encryptedData] = encryptedText.split(':');
    if (!ivHex || !encryptedData) {
        throw new Error('Invalid encrypted payload format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const dataDecrypter = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = dataDecrypter.update(encryptedData, 'hex', 'utf8');
    decrypted += dataDecrypter.final('utf8');
    return decrypted;
}
