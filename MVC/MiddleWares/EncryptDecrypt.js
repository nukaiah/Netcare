import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config(); 

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPT_DECRYPT_KEY, 'utf-8'); // 32-byte key
const iv = Buffer.from('0123456789012345', 'utf-8'); // 16-byte IV

// Encrypt Function
export function encrypt(text) {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted; // Only returning encrypted text (no IV prefix)
}

// Decrypt Function
export function decrypt(encryptedText) {
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

// Example Usage
const originalText = "Hello, Node.js!";
const encryptedText = encrypt(originalText);
console.log("Encrypted:", encryptedText);

const decryptedText = decrypt(encryptedText);
console.log("Decrypted:", decryptedText);


