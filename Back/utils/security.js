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

// 3. DIGITAL SIGNATURE (HMAC-SHA256 based)
// Used to ensure data integrity and authenticity
const SIGNATURE_SECRET = process.env.JWT_SECRET || 'signature_secret_key_12345';

// Create a digital signature for data (ensures integrity)
export const createDigitalSignature = (data) => {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const signature = crypto.createHmac('sha256', SIGNATURE_SECRET)
        .update(dataString)
        .digest('hex');
    return signature;
};

// Verify the digital signature
export const verifyDigitalSignature = (data, signature) => {
    const expectedSignature = createDigitalSignature(data);
    return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
};

// Create signed data package (data + signature)
export const signData = (data) => {
    const signature = createDigitalSignature(data);
    return {
        data,
        signature,
        timestamp: Date.now()
    };
};

// Verify signed data package
export const verifySignedData = (signedPackage) => {
    try {
        const { data, signature } = signedPackage;
        return verifyDigitalSignature(data, signature);
    } catch (error) {
        console.error("Signature verification failed:", error);
        return false;
    }
};