import crypto from 'crypto';
import QRCode from 'qrcode';

// 1. ENCRYPTION SETUP (AES-256-CBC)
// We derive a secure key from your JWT_SECRET or a fallback
const ENCRYPTION_KEY = crypto.scryptSync(process.env.JWT_SECRET || 'fallback_secret_key_12345', 'salt', 32);
const IV_LENGTH = 16; // For AES, this is always 16

// Function to Encrypt Text (Used for Address)
export const encryptData = (text) => {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // Return format: "iv:encryptedData"
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Function to Decrypt Text
export const decryptData = (text) => {
    if (!text) return text;
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error("Decryption failed:", error);
        return text; // Return original if fails (failsafe)
    }
};

// 2. ENCODING SETUP (QR Code)
export const generateQRCode = async (data) => {
    try {
        // Returns a Data URI (e.g., "data:image/png;base64,...")
        return await QRCode.toDataURL(data);
    } catch (err) {
        console.error("QR Generation failed:", err);
        return null;
    }
};