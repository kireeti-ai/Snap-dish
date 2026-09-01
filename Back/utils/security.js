import crypto from 'crypto';
import QRCode from 'qrcode';

// AES-256-CBC)
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
        return text;
    }
};

//(QR Code)
export const generateQRCode = async (data) => {
    try {
        // Returns a Data URI
        return await QRCode.toDataURL(data);
    } catch (err) {
        console.error("QR Generation failed:", err);
        return null;
    }
};

//  DIGITAL SIGNATURE (HMAC-SHA256 based)

const SIGNATURE_SECRET = process.env.JWT_SECRET || 'signature_secret_key_12345';


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
''
// RSA KEY PAIR GENERATION (Asymmetric Cryptography)
// Generates a pair of public and private keys for secure communication
export const generateKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048, // 2048-bit RSA key
        publicKeyEncoding: {
            type: 'spki', // SubjectPublicKeyInfo format
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8', // PKCS#8 format
            format: 'pem'
        }
    });

    return {
        publicKey,
        privateKey,
        generatedAt: new Date(),
        algorithm: 'RSA-2048'
    };
};

// DIGITAL SIGNATURE WITH RSA (Asymmetric Signature)
// Sign data with private key - only owner can create this signature
export const signDataWithPrivateKey = (data, privateKey) => {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const signature = crypto.sign(
        'sha256',
        Buffer.from(dataString),
        privateKey
    );
    return signature.toString('hex');
};

// Verify signature with public key - anyone can verify authenticity
export const verifySignatureWithPublicKey = (data, signature, publicKey) => {
    try {
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        return crypto.verify(
            'sha256',
            Buffer.from(dataString),
            publicKey,
            Buffer.from(signature, 'hex')
        );
    } catch (error) {
        console.error("RSA Signature verification failed:", error);
        return false;
    }
};

// ============================================
// DIFFIE-HELLMAN KEY EXCHANGE (Shared Secret Generation)
// ============================================
// Both parties generate a shared secret without transmitting it
export const generateDHKeyExchange = () => {
    const dh = crypto.createDiffieHellman(256); // 256-bit prime
    const publicKey = dh.generateKeys('hex');

    return {
        dh, // Private DH object
        publicKey, // Share this with the other party
        prime: dh.getPrime('hex'),
        generator: dh.getGenerator('hex')
    };
};

// Compute shared secret using the other party's public key
export const computeSharedSecret = (dh, otherPublicKey) => {
    try {
        const sharedSecret = dh.computeSecret(otherPublicKey, 'hex', 'hex');
        return sharedSecret;
    } catch (error) {
        console.error("Key exchange failed:", error);
        return null;
    }
};

// ============================================
// HASH-BASED INTEGRITY VERIFICATION (SHA-256)
// ============================================
// Create a hash of data for integrity verification
export const hashData = (data) => {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
};

// Verify data hasn't been modified by comparing hashes
export const verifyDataIntegrity = (originalData, storedHash) => {
    const computedHash = hashData(originalData);
    return computedHash === storedHash;
};