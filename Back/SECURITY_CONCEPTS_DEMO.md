# Security Concepts in Snap-Dish Project

## 1. DATA INTEGRITY & AUTHENTICITY USING HASH-BASED DIGITAL SIGNATURES

### What is it?
A digital signature proves that:
- **Data is authentic** (came from the claimed sender)
- **Data hasn't been modified** (integrity preserved)
- **Sender cannot deny sending it** (non-repudiation)

### How it works in your project:

#### HMAC-SHA256 (Symmetric - Shared Secret)
```javascript
import { signData, verifySignedData } from './utils/security.js';

// When creating an order
const orderData = {
    customerId: "123",
    restaurantId: "456",
    items: ["pizza", "coke"],
    total: 500
};

// SIGN the data
const signedOrder = signData(orderData);
// Result: { data, signature: "a1b2c3d4...", timestamp }

// VERIFY the signature
const isValid = verifySignedData(signedOrder);
// true = data is authentic & untampered, false = data was modified
```

**Where to use in your project:**
- When delivery partner confirms order pickup
- When customer submits payment
- When restaurant confirms order ready
- Order tracking history

---

## 2. SECURE KEY GENERATION

### What is it?
Cryptographic keys are random, unpredictable sequences used to encrypt/decrypt data.

#### A. Symmetric Key Generation (for AES encryption)
Already implemented in your `security.js`:
```javascript
const ENCRYPTION_KEY = crypto.scryptSync(
    process.env.JWT_SECRET,
    'salt',
    32 // 256-bit key
);
// Derived securely from your master secret
```

**Used for:**
- Encrypting sensitive addresses
- Protecting user PII data

#### B. Asymmetric Key Pair Generation (RSA)
New implementation - use for secure communication:
```javascript
import { generateKeyPair } from './utils/security.js';

const keyPair = generateKeyPair();
// keyPair.publicKey -> Share with others
// keyPair.privateKey -> Keep secret (only you have this)
```

**Real-world example in your project:**
```javascript
// Restaurant generates their keys
const restaurantKeys = generateKeyPair();
// Save privateKey in database (encrypted)
// Share publicKey with delivery system

// Later: Delivery partner signs order confirmation
const confirmation = {
    orderId: "ORD-001",
    status: "picked_up",
    timestamp: Date.now()
};

const signature = signDataWithPrivateKey(
    confirmation,
    restaurantKeys.privateKey
);

// Send: { confirmation, signature }
// Anyone can verify with restaurantKeys.publicKey
```

---

## 3. SECURE KEY EXCHANGE (DIFFIE-HELLMAN)

### What is it?
Two parties create a **shared secret** without ever transmitting the secret directly.
Even if someone intercepts all communication, they cannot compute the shared secret.

### How it works:

#### Step 1: Both parties independently generate keys
```javascript
import { generateDHKeyExchange } from './utils/security.js';

// Customer side
const customerDH = generateDHKeyExchange();
// { dh, publicKey: "1a2b3c...", prime, generator }

// Server side
const serverDH = generateDHKeyExchange();
// { dh, publicKey: "x9y8z7...", prime, generator }
```

#### Step 2: Exchange PUBLIC keys (safe to transmit)
```
Customer sends publicKey → Server
Server sends publicKey → Customer
```

#### Step 3: Both compute the SAME shared secret
```javascript
import { computeSharedSecret } from './utils/security.js';

// On Customer side
const customerSharedSecret = computeSharedSecret(
    customerDH.dh,
    serverPublicKey // Received from server
);

// On Server side
const serverSharedSecret = computeSharedSecret(
    serverDH.dh,
    customerPublicKey // Received from customer
);

// Result: customerSharedSecret === serverSharedSecret
// But no one else can compute this secret!
```

### Where to use in Snap-Dish:
- Secure session establishment between app and backend
- Protected communication with delivery partners
- End-to-end encrypted messaging between restaurant and customer
---

## 4. HASH-BASED INTEGRITY VERIFICATION

### What is it?
Hashing converts data into a fixed-size fingerprint.
Same data = same hash. Different data = different hash.

```javascript
import { hashData, verifyDataIntegrity } from './utils/security.js';

// When storing order
const orderData = { items: [...], total: 500 };
const orderHash = hashData(orderData);
// "a1b2c3d4e5f6..."

// Later: Verify data wasn't modified
const isIntact = verifyDataIntegrity(orderData, orderHash);
// true = data is intact, false = data was tampered
```

### Real Example - Order Tracking:
```javascript
// Step 1: Customer places order
const order = {
    id: "ORD-123",
    items: ["Pizza", "Coke"],
    total: 500,
    timestamp: Date.now()
};
const orderHash = hashData(order);
// Store both in database

// Step 2: After 30 minutes, verify order data
const storedOrder = database.getOrder("ORD-123");
const isValid = verifyDataIntegrity(storedOrder, orderHash);
// If false = someone hacked the database and modified the order!
```

---

## PRACTICAL DEMO USING POSTMAN & DATABASE

### Setup Steps:

1. **Start your backend server:**
```bash
cd Back
npm start
```

2. **Create a new Postman Collection** called "Security Demo"

3. **Add these endpoints with examples below**

---

## DEMO 1: ORDER WITH DIGITAL SIGNATURE (HMAC)

### Create API Endpoint (Add to orderController.js):
```javascript
import { signData, verifySignedData, hashData } from '../utils/security.js';
import Order from '../models/orderModel.js';

// POST /api/orders/create-secure
export const createSecureOrder = async (req, res) => {
    try {
        const orderData = {
            customerId: req.body.customerId,
            restaurantId: req.body.restaurantId,
            items: req.body.items,
            total: req.body.total,
            deliveryAddress: req.body.deliveryAddress
        };

        // 1. Create digital signature
        const signedOrder = signData(orderData);

        // 2. Create hash for integrity check
        const integrityHash = hashData(JSON.stringify(orderData));

        // 3. Save to database with signature
        const order = await Order.create({
            ...orderData,
            signature: signedOrder.signature,
            signatureTimestamp: signedOrder.timestamp,
            integrityHash: integrityHash,
            status: 'pending_verification'
        });

        res.json({
            success: true,
            orderId: order._id,
            signature: signedOrder.signature,
            integrityHash: integrityHash,
            timestamp: signedOrder.timestamp,
            message: 'Order created with digital signature'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/orders/:orderId/verify
export const verifyOrderSignature = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        // Reconstruct original order data
        const originalOrderData = {
            customerId: order.customerId,
            restaurantId: order.restaurantId,
            items: order.items,
            total: order.total,
            deliveryAddress: order.deliveryAddress
        };

        // Verify signature
        const isSignatureValid = verifySignedData({
            data: originalOrderData,
            signature: order.signature
        });

        // Verify hash (integrity)
        const isIntegrityValid = verifyDataIntegrity(
            JSON.stringify(originalOrderData),
            order.integrityHash
        );

        res.json({
            orderId: order._id,
            signatureValid: isSignatureValid,
            integrityValid: isIntegrityValid,
            isDataTampered: !isSignatureValid || !isIntegrityValid,
            signatureCreatedAt: order.signatureTimestamp,
            message: isSignatureValid && isIntegrityValid
                ? 'Order is authentic and unmodified'
                : 'WARNING: Order data has been tampered with!'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

### Add Route (In orderRoute.js):
```javascript
import { createSecureOrder, verifyOrderSignature } from '../controllers/orderController.js';

router.post('/create-secure', createSecureOrder);
router.get('/:orderId/verify', verifyOrderSignature);
```

### Test in Postman:

**Step 1: Create Order with Signature**
```
POST http://localhost:5000/api/orders/create-secure

Headers:
Content-Type: application/json

Body (JSON):
{
  "customerId": "CUST-001",
  "restaurantId": "REST-001",
  "items": ["Margherita Pizza", "Coke"],
  "total": 550,
  "deliveryAddress": "123 Main St, Delhi"
}

Response:
{
  "success": true,
  "orderId": "63f7a1c2d4e5f6g7h8i9j0",
  "signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...",
  "integrityHash": "x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k...",
  "timestamp": 1709000000000,
  "message": "Order created with digital signature"
}
```

**Step 2: Verify Order Signature**
```
GET http://localhost:5000/api/orders/63f7a1c2d4e5f6g7h8i9j0/verify

Response:
{
  "orderId": "63f7a1c2d4e5f6g7h8i9j0",
  "signatureValid": true,
  "integrityValid": true,
  "isDataTampered": false,
  "signatureCreatedAt": 1709000000000,
  "message": "Order is authentic and unmodified"
}
```

**Step 3: Verify Tampering Detection**
Try to modify the order in database (change total from 550 to 1000) and verify again:
```
GET http://localhost:5000/api/orders/63f7a1c2d4e5f6g7h8i9j0/verify

Response:
{
  "orderId": "63f7a1c2d4e5f6g7h8i9j0",
  "signatureValid": false,
  "integrityValid": false,
  "isDataTampered": true,
  "message": "WARNING: Order data has been tampered with!"
}
```

---

## DEMO 2: RSA KEY PAIR (ASYMMETRIC SIGNATURE)

### Create API Endpoint:
```javascript
import { generateKeyPair, signDataWithPrivateKey, verifySignatureWithPublicKey } from '../utils/security.js';
import DeliveryPartner from '../models/deliveryPartnerModel.js';

// POST /api/delivery/generate-keys
export const generateDeliveryPartnerKeys = async (req, res) => {
    try {
        const { partnerId } = req.body;

        // Generate RSA key pair
        const keyPair = generateKeyPair();

        // Save public key in database (can share)
        // Encrypt and save private key (keep secret)
        await DeliveryPartner.findByIdAndUpdate(partnerId, {
            publicKey: keyPair.publicKey,
            privateKeyEncrypted: encryptData(keyPair.privateKey), // Use your encryption
            keyGeneratedAt: new Date(),
            keyAlgorithm: 'RSA-2048'
        });

        res.json({
            success: true,
            message: 'Keys generated for delivery partner',
            publicKey: keyPair.publicKey,
            warning: 'Private key is encrypted and stored. Never share it!'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/delivery/sign-pickup
export const signPickupConfirmation = async (req, res) => {
    try {
        const { partnerId, orderId } = req.body;
        const partner = await DeliveryPartner.findById(partnerId);

        // Decrypt partner's private key
        const privateKey = decryptData(partner.privateKeyEncrypted);

        // Data to sign
        const pickupData = {
            orderId: orderId,
            partnerId: partnerId,
            pickupTime: new Date(),
            status: 'picked_up'
        };

        // Sign with private key (only this partner can create this signature)
        const signature = signDataWithPrivateKey(
            JSON.stringify(pickupData),
            privateKey
        );

        res.json({
            success: true,
            pickupData: pickupData,
            signature: signature,
            publicKey: partner.publicKey,
            message: 'Pickup confirmed and digitally signed by delivery partner'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/orders/verify-pickup-signature
export const verifyPickupSignature = async (req, res) => {
    try {
        const { pickupData, signature, publicKey } = req.body;

        // Verify signature using public key
        const isValid = verifySignatureWithPublicKey(
            JSON.stringify(pickupData),
            signature,
            publicKey
        );

        res.json({
            success: true,
            signatureValid: isValid,
            pickupData: pickupData,
            message: isValid
                ? 'Pickup confirmed by verified delivery partner'
                : 'Signature verification failed - possible fraud!'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

### Test in Postman:

**Step 1: Generate Keys for Delivery Partner**
```
POST http://localhost:5000/api/delivery/generate-keys

Body (JSON):
{
  "partnerId": "DELIVERY-001"
}

Response:
{
  "success": true,
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANB...\n-----END PUBLIC KEY-----",
  "message": "Keys generated for delivery partner"
}
```

**Step 2: Sign Pickup Confirmation**
```
POST http://localhost:5000/api/delivery/sign-pickup

Body (JSON):
{
  "partnerId": "DELIVERY-001",
  "orderId": "ORD-001"
}

Response:
{
  "success": true,
  "pickupData": {
    "orderId": "ORD-001",
    "partnerId": "DELIVERY-001",
    "pickupTime": "2026-02-05T10:30:45.123Z",
    "status": "picked_up"
  },
  "signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0...",
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANB...\n-----END PUBLIC KEY-----",
  "message": "Pickup confirmed and digitally signed by delivery partner"
}
```

**Step 3: Verify Pickup Signature**
```
POST http://localhost:5000/api/orders/verify-pickup-signature

Body (JSON):
{
  "pickupData": {
    "orderId": "ORD-001",
    "partnerId": "DELIVERY-001",
    "pickupTime": "2026-02-05T10:30:45.123Z",
    "status": "picked_up"
  },
  "signature": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0...",
  "publicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANB...\n-----END PUBLIC KEY-----"
}

Response:
{
  "success": true,
  "signatureValid": true,
  "message": "Pickup confirmed by verified delivery partner"
}
```

---

## DEMO 3: DATA ENCRYPTION (FOR SENSITIVE ADDRESSES)

### Test in Postman:

**Store Encrypted Address:**
```
POST http://localhost:5000/api/addresses/create

Body (JSON):
{
  "userId": "USER-001",
  "address": "123 Main Street, New Delhi, India - 110001"
}

Backend will:
1. Encrypt the address using AES-256-CBC
2. Store encrypted format in database
3. Return encrypted address for verification

Response:
{
  "success": true,
  "encryptedAddress": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6:x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1...",
  "message": "Address stored securely"
}
```

**Decrypt for Delivery Partner:**
```
GET http://localhost:5000/api/addresses/decrypt/ADDRESS-ID

Response:
{
  "success": true,
  "decryptedAddress": "123 Main Street, New Delhi, India - 110001",
  "message": "Address decrypted only for authorized user"
}
```

---

## DATABASE SCHEMA EXAMPLE

### Order Model with Security Fields:
```javascript
const orderSchema = new Schema({
    customerId: String,
    restaurantId: String,
    items: [String],
    total: Number,
    deliveryAddress: String,

    // Security fields
    signature: String,              // HMAC signature
    signatureTimestamp: Date,        // When signature was created
    integrityHash: String,          // SHA-256 hash for integrity

    // For RSA signatures
    deliveryPartnerSignature: String,
    deliveryPartnerPublicKey: String,

    status: {
        type: String,
        enum: ['pending_verification', 'verified', 'tampered', 'shipped', 'delivered'],
        default: 'pending_verification'
    },

    // Track verification
    signatureVerifiedAt: Date,
    verifiedBy: String,

    createdAt: { type: Date, default: Date.now }
});
```

### Delivery Partner Model:
```javascript
const deliveryPartnerSchema = new Schema({
    name: String,
    email: String,
    phone: String,

    // RSA Keys for signing
    publicKey: String,              // Can be shared
    privateKeyEncrypted: String,    // Encrypted, never expose
    keyAlgorithm: String,
    keyGeneratedAt: Date,

    // Track signatures
    signaturesCreated: Number,
    lastSignedAt: Date,

    createdAt: { type: Date, default: Date.now }
});
```

---

## IMPLEMENTATION CHECKLIST FOR YOUR PROJECT

### For Order Management:
```javascript
// controllers/orderController.js
import { signData, verifySignedData, hashData } from '../utils/security.js';

// When creating order
export const createOrder = async (req, res) => {
    const orderData = req.body;

    // 1. Hash for integrity
    const integrityHash = hashData(orderData);

    // 2. Sign for authenticity
    const signedOrder = signData(orderData);

    // Save to database
    await Order.create({
        ...orderData,
        integrityHash,
        signature: signedOrder.signature,
        signatureTimestamp: signedOrder.timestamp
    });
};

// When verifying order
export const verifyOrder = async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    // Verify integrity
    const integrityValid = verifyDataIntegrity(
        { items: order.items, total: order.total },
        order.integrityHash
    );

    // Verify signature
    const signatureValid = verifySignedData({
        data: order.data,
        signature: order.signature
    });

    return res.json({
        integrityValid,
        signatureValid,
        isTampered: !integrityValid || !signatureValid
    });
};
```

### For Delivery Partner Communication:
```javascript
// When delivery partner picks up order
import { generateKeyPair, signDataWithPrivateKey } from '../utils/security.js';

const deliveryConfirmation = {
    orderId: "ORD-123",
    location: { lat: 28.5355, lng: 77.3910 },
    status: "picked_up",
    timestamp: Date.now()
};

const partnerPrivateKey = deliveryPartner.encryptedPrivateKey; // Decrypt first
const signature = signDataWithPrivateKey(
    deliveryConfirmation,
    partnerPrivateKey
);

// Send to server
await sendDeliveryUpdate({
    confirmation: deliveryConfirmation,
    signature: signature,
    partnerPublicKey: deliveryPartner.publicKey
});
```

---

## SECURITY FLOW VISUALIZATION

```
┌─────────────────────────────────────────────────────────┐
│ CUSTOMER PLACES ORDER                                   │
├─────────────────────────────────────────────────────────┤
│ 1. Customer enters order data                            │
│ 2. System HASHES it for integrity check                 │
│ 3. System SIGNS it with HMAC for authenticity           │
│ 4. Save: { order, hash, signature }                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ RESTAURANT RECEIVES & VERIFIES                          │
├─────────────────────────────────────────────────────────┤
│ 1. Verify hash - (Is data tampered?)                    │
│ 2. Verify signature - (Is it really from customer?)     │
│ 3. If both valid → Accept order                         │
│ 4. If invalid → Reject & Log security alert            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ DELIVERY PARTNER PICKUP                                 │
├─────────────────────────────────────────────────────────┤
│ 1. Partner has RSA keypair                              │
│ 2. Partner SIGNS pickup confirmation with private key   │
│ 3. Anyone can VERIFY with public key                    │
│ 4. Proof: Partner really picked up (non-repudiation)   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ ENCRYPTED SESSION (KEY EXCHANGE)                        │
├─────────────────────────────────────────────────────────┤
│ 1. Customer ↔ Server use Diffie-Hellman                 │
│ 2. Establish shared secret (both know, no one else)     │
│ 3. Use secret to encrypt real-time location tracking    │
│ 4. Secure messaging during delivery                     │
└─────────────────────────────────────────────────────────┘
```

---

## HOW TO EXPLAIN TO YOUR FRIEND

### Simple Analogy:

**1. Digital Signature (HMAC):**
- "Imagine you write a check and sign it. The signature proves it's from you. In our system, `signData()` creates a unique signature for order data. If someone changes the amount, the signature won't match anymore."

**2. RSA Key Pair:**
- "Think of it like a mailbox with two keys: one public (everyone has it, they can put letters in), one private (only you have it, you can open and read). Delivery partner has their private key. They sign orders with it. Everyone can verify with their public key."

**3. Key Exchange:**
- "When customer and restaurant first connect, they exchange public information (DH keys). Each computes a secret number that no one listening to the network can figure out. They use this secret to encrypt private messages."

**4. Hashing:**
- "Like a fingerprint. Same person = same fingerprint. If someone claims to be you but their fingerprint is different, they're lying. `hashData()` creates a fingerprint of order data."

---

## TEST IT YOURSELF

Run this in a Node.js file in your `Back` folder:

```javascript
import {
    signData,
    verifySignedData,
    generateKeyPair,
    signDataWithPrivateKey,
    verifySignatureWithPublicKey,
    hashData,
    verifyDataIntegrity
} from './utils/security.js';

console.log("=== DEMO: DIGITAL SIGNATURE ===");
const order = { customerId: "123", items: ["pizza"], total: 500 };
const signed = signData(order);
console.log("Signed:", signed);
console.log("Verified:", verifySignedData(signed)); // true

console.log("\n=== DEMO: RSA KEY PAIR ===");
const keyPair = generateKeyPair();
console.log("Public Key created:", keyPair.publicKey.substring(0, 50) + "...");

console.log("\n=== DEMO: RSA SIGNATURE ===");
const rsaSignature = signDataWithPrivateKey(order, keyPair.privateKey);
const rsaVerified = verifySignatureWithPublicKey(order, rsaSignature, keyPair.publicKey);
console.log("RSA Signature Verified:", rsaVerified); // true

console.log("\n=== DEMO: HASH INTEGRITY ===");
const hash = hashData(order);
console.log("Hash:", hash);
console.log("Integrity Check:", verifyDataIntegrity(order, hash)); // true
const tamperedOrder = { ...order, total: 1000 };
console.log("After tampering:", verifyDataIntegrity(tamperedOrder, hash)); // false
```

---

## SECURITY BEST PRACTICES IN YOUR PROJECT

✅ **Do:**
- Store private keys encrypted in database
- Use environment variables for secrets
- Verify signatures on critical operations (orders, payments)
- Hash sensitive data before storing
- Use HTTPS for all communications
- Rotate keys periodically

❌ **Don't:**
- Log private keys
- Commit keys to Git
- Use weak passwords for key encryption
- Trust data without verification
- Hardcode secrets in code
