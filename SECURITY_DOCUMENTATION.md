# SnapDish - Security Implementation Documentation

This document outlines the security features implemented in the SnapDish food delivery application, mapping each rubric requirement to its corresponding implementation in the codebase.

---

## 📋 Table of Contents

1. [Authentication](#1-authentication)
2. [Authorization - Access Control](#2-authorization---access-control)
3. [Encryption](#3-encryption)
4. [Hashing & Digital Signature](#4-hashing--digital-signature)
5. [Encoding Techniques](#5-encoding-techniques)

---

## 1. Authentication

### 1.1 Single-Factor Authentication (Password/Username-based Login)

**Description:** Implementation of traditional username/password authentication where users provide their email and password to access the system.

| Component | File Location | Function/Method |
|-----------|---------------|-----------------|
| Login API | [Back/controllers/userController.js](Back/controllers/userController.js#L45) | `loginUser()` |
| Password Validation | [Back/models/userModel.js](Back/models/userModel.js#L91) | `comparePassword()` |
| Token Generation | [Back/controllers/userController.js](Back/controllers/userController.js#L25) | `createToken()` |
| Token Verification | [Back/middleware/authMiddleware.js](Back/middleware/authMiddleware.js#L17) | `jwt.verify()` |

**Frontend Implementations:**
| Application | File Location |
|-------------|---------------|
| Customer App | [Food/src/components/LoginPopup/LoginPopup.jsx](Food/src/components/LoginPopup/LoginPopup.jsx) |
| Admin Panel | [admin/src/components/LoginPage.jsx](admin/src/components/LoginPage.jsx) |
| Restaurant Admin | [restaurant-admin/src/pages/Login.jsx](restaurant-admin/src/pages/Login.jsx) |
| Delivery Agent | [DeliveryAgent/src/pages/LoginPage.jsx](DeliveryAgent/src/pages/LoginPage.jsx) |

**How it works:**
1. User enters email and password
2. Backend validates credentials against the database
3. Password is compared using bcrypt
4. JWT token is generated upon successful authentication

---

### 1.2 Multi-Factor Authentication (Password + Email OTP)

**Description:** Two-factor authentication combining password verification with a One-Time Password (OTP) sent via email.

| Component | File Location | Function/Method |
|-----------|---------------|-----------------|
| OTP Generation | [Back/controllers/userController.js](Back/controllers/userController.js#L88) | `loginUser()` - Generates 6-digit OTP |
| OTP Verification | [Back/controllers/userController.js](Back/controllers/userController.js#L212) | `verifyLoginOTP()` |
| Email Sending | [Back/utils/sendEmail.js](Back/utils/sendEmail.js) | `sendEmail()` |
| OTP Storage | [Back/models/userModel.js](Back/models/userModel.js#L36-L42) | `otp`, `otpExpires` fields |
| OTP Validation Helper | [Back/models/userModel.js](Back/models/userModel.js#L97) | `verifyOTP()` |

**Frontend OTP Verification:**
| Application | File Location | Lines |
|-------------|---------------|-------|
| Customer App | [Food/src/components/LoginPopup/LoginPopup.jsx](Food/src/components/LoginPopup/LoginPopup.jsx#L40-L100) | `onVerifyOTP()` |
| Admin Panel | [admin/src/components/LoginPage.jsx](admin/src/components/LoginPage.jsx#L25-L70) | `handleVerifyOTP()` |
| Restaurant Admin | [restaurant-admin/src/pages/Login.jsx](restaurant-admin/src/pages/Login.jsx#L27-L65) | `handleVerifyOTP()` |
| Delivery Agent | [DeliveryAgent/src/pages/LoginPage.jsx](DeliveryAgent/src/pages/LoginPage.jsx#L48-L100) | `handleVerifyOTP()` |

**MFA Flow:**
```
1. User enters email + password → Backend validates credentials
2. If valid, 6-digit OTP generated → Stored in DB with 10-min expiry
3. OTP sent to user's email → User enters OTP in frontend
4. OTP verified → JWT token issued → User authenticated
```

---

## 2. Authorization - Access Control

### 2.1 Policy Definition & Justification

**Description:** Clearly defined access rights based on user roles determining who can access what and why.

| Role | Description | Access Rights |
|------|-------------|---------------|
| `customer` | End users ordering food | Browse restaurants, place orders, manage cart, view own orders |
| `restaurant_owner` | Restaurant administrators | Manage own restaurant, menu items, view/update restaurant orders |
| `delivery_agent` | Delivery personnel | Accept/complete deliveries, view assigned orders |
| `admin` | Platform administrators | Full system access, manage all users, restaurants, orders, settings |

**Role Definition Location:**
| Component | File Location |
|-----------|---------------|
| User Role Schema | [Back/models/userModel.js](Back/models/userModel.js#L29-L33) |

```javascript
role: {
  type: String,
  enum: ["customer", "restaurant_owner", "delivery_agent", "admin"],
  default: "customer",
}
```

---

### 2.2 Implementation of Access Control

**Description:** Programmatic enforcement of access permissions using middleware functions.

| Component | File Location | Function |
|-----------|---------------|----------|
| Authentication Middleware | [Back/middleware/authMiddleware.js](Back/middleware/authMiddleware.js#L4) | `protect()` |
| Role-Based Authorization | [Back/middleware/authMiddleware.js](Back/middleware/authMiddleware.js#L47) | `restrictTo(...roles)` |

**Access Control Matrix Implementation:**

| Route | Subjects (Roles) | Object (Resource) | File Location |
|-------|------------------|-------------------|---------------|
| `GET /api/admin/statistics` | admin | Statistics | [Back/routes/adminRoutes.js](Back/routes/adminRoutes.js#L13) |
| `GET /api/orders/restaurant` | restaurant_owner, admin | Restaurant Orders | [Back/routes/orderRoute.js](Back/routes/orderRoute.js#L16) |
| `POST /api/orders/delivery/accept` | delivery_agent, admin | Delivery Acceptance | [Back/routes/orderRoute.js](Back/routes/orderRoute.js#L18) |
| `GET /api/orders/list` | admin | All Orders | [Back/routes/orderRoute.js](Back/routes/orderRoute.js#L19) |
| `GET /api/restaurants/admin/all` | admin | All Restaurants | [Back/routes/restaurantRoutes.js](Back/routes/restaurantRoutes.js#L27) |
| `PUT /api/restaurants/admin/:id` | admin | Restaurant Management | [Back/routes/restaurantRoutes.js](Back/routes/restaurantRoutes.js#L29) |

**Route Files with Access Control:**
| File | Description |
|------|-------------|
| [Back/routes/orderRoute.js](Back/routes/orderRoute.js) | Order management routes with role restrictions |
| [Back/routes/adminRoutes.js](Back/routes/adminRoutes.js) | Admin-only routes |
| [Back/routes/restaurantRoutes.js](Back/routes/restaurantRoutes.js) | Restaurant routes with owner/admin restrictions |
| [Back/routes/userRoutes.js](Back/routes/userRoutes.js) | User management routes |

---

## 3. Encryption

### 3.1 Key Exchange Mechanism

**Description:** Secure key generation using cryptographic key derivation function.

| Component | File Location | Implementation |
|-----------|---------------|----------------|
| Key Derivation | [Back/utils/security.js](Back/utils/security.js#L6) | `crypto.scryptSync()` |

```javascript
// Key derivation using scrypt (secure key derivation function)
const ENCRYPTION_KEY = crypto.scryptSync(
  process.env.JWT_SECRET || 'fallback_secret_key_12345',
  'salt',
  32  // 32 bytes = 256 bits for AES-256
);
```

**How it works:**
- Uses `scrypt` algorithm (memory-hard key derivation function)
- Derives a 256-bit key from the JWT_SECRET
- Resistant to brute-force and dictionary attacks

---

### 3.2 Encryption & Decryption (AES-256-CBC)

**Description:** Symmetric encryption for sensitive data storage using AES-256-CBC algorithm.

| Component | File Location | Function |
|-----------|---------------|----------|
| Encryption Function | [Back/utils/security.js](Back/utils/security.js#L10) | `encryptData(text)` |
| Decryption Function | [Back/utils/security.js](Back/utils/security.js#L21) | `decryptData(text)` |
| Address Encryption (Usage) | [Back/controllers/userController.js](Back/controllers/userController.js#L177) | During user registration |
| Address Decryption (Usage) | [Back/controllers/userController.js](Back/controllers/userController.js#L390) | When retrieving profile |

**Encryption Implementation:**
```javascript
export const encryptData = (text) => {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);  // Random 16-byte IV
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');  // iv:ciphertext
};
```

**What is encrypted:**
- User addresses (sensitive location data)

---

## 4. Hashing & Digital Signature

### 4.1 Hashing with Salt (Password Storage)

**Description:** Secure password storage using bcrypt with salt for protection against rainbow table attacks.

| Component | File Location | Implementation |
|-----------|---------------|----------------|
| Password Hashing | [Back/models/userModel.js](Back/models/userModel.js#L75-L83) | Pre-save middleware |
| Password Comparison | [Back/models/userModel.js](Back/models/userModel.js#L91) | `comparePassword()` |
| bcrypt Library | [Back/package.json](Back/package.json#L13-L14) | `bcrypt` / `bcryptjs` |

**Implementation:**
```javascript
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);  // 12 rounds of salting
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**Security Features:**
- Salt factor of 12 (2^12 = 4096 iterations)
- Unique salt for each password
- Passwords never stored in plain text

---

### 4.2 Digital Signature using Hash (HMAC-SHA256)

**Description:** Hash-based message authentication code for data integrity and authenticity verification.

| Component | File Location | Function |
|-----------|---------------|----------|
| Signature Creation | [Back/utils/security.js](Back/utils/security.js#L53) | `createDigitalSignature(data)` |
| Signature Verification | [Back/utils/security.js](Back/utils/security.js#L61) | `verifyDigitalSignature(data, signature)` |
| Sign Data Package | [Back/utils/security.js](Back/utils/security.js#L69) | `signData(data)` |
| Verify Signed Package | [Back/utils/security.js](Back/utils/security.js#L78) | `verifySignedData(signedPackage)` |

**Implementation:**
```javascript
// Create digital signature
export const createDigitalSignature = (data) => {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    const signature = crypto.createHmac('sha256', SIGNATURE_SECRET)
        .update(dataString)
        .digest('hex');
    return signature;
};

// Verify signature (timing-safe comparison to prevent timing attacks)
export const verifyDigitalSignature = (data, signature) => {
    const expectedSignature = createDigitalSignature(data);
    return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
    );
};
```

**Use Cases:**
- Ensuring data hasn't been tampered with
- Verifying authenticity of sensitive operations

---

## 5. Encoding Techniques

### 5.1 Encoding & Decoding Implementation (QR Code + Base64)

**Description:** Implementation of QR code generation for user identification and data encoding.

| Component | File Location | Function |
|-----------|---------------|----------|
| QR Code Generation | [Back/utils/security.js](Back/utils/security.js#L37) | `generateQRCode(data)` |
| QR Code Usage | [Back/controllers/userController.js](Back/controllers/userController.js#L393) | In `getUserProfile()` |
| QR Code Display | [restaurant-admin/src/pages/Settings.jsx](restaurant-admin/src/pages/Settings.jsx#L22-L242) | Profile QR code display |

**Implementation:**
```javascript
// QR Code generation returning Base64 Data URI
export const generateQRCode = async (data) => {
    try {
        // Returns: "data:image/png;base64,..."
        return await QRCode.toDataURL(data);
    } catch (err) {
        console.error("QR Generation failed:", err);
        return null;
    }
};
```

**What gets encoded:**
- User ID → QR Code (for quick identification/scanning)
- Output format: Base64 encoded PNG image as Data URI

**Frontend Display:**
```jsx
// restaurant-admin/src/pages/Settings.jsx
<img src={qrCode} alt="User QR Code" />
<p>This QR code contains your encrypted user ID.</p>
```

---

### 5.2 Security Levels & Risks (Theory)

| Security Layer | Risk Level | Mitigation Implemented |
|----------------|------------|------------------------|
| Password Storage | High | bcrypt with salt (12 rounds) |
| Data in Transit | Medium | JWT tokens, HTTPS recommended |
| Sensitive Data Storage | High | AES-256-CBC encryption |
| Session Management | Medium | JWT with validation |
| Access Control | High | Role-based middleware |
| Data Integrity | Medium | HMAC-SHA256 digital signatures |

---

### 5.3 Possible Attacks (Theory)

| Attack Type | Protection Mechanism | Implementation Location |
|-------------|---------------------|------------------------|
| **Brute Force** | Password hashing with bcrypt (12 rounds) | [Back/models/userModel.js](Back/models/userModel.js#L75) |
| **Rainbow Table** | Unique salt per password | bcrypt auto-salt generation |
| **SQL Injection** | MongoDB ODM (Mongoose) with parameterized queries | All models and controllers |
| **Timing Attack** | `crypto.timingSafeEqual()` for signature verification | [Back/utils/security.js](Back/utils/security.js#L63) |
| **Unauthorized Access** | JWT + Role-based access control | [Back/middleware/authMiddleware.js](Back/middleware/authMiddleware.js) |
| **Data Breach** | Encryption at rest (AES-256) | [Back/utils/security.js](Back/utils/security.js#L10) |
| **Token Theft** | Token expiry, OTP for sensitive actions | [Back/controllers/userController.js](Back/controllers/userController.js) |
| **CSRF** | Token-based authentication | JWT Bearer tokens |

---

## 📁 Summary: File Structure

```
Back/
├── controllers/
│   └── userController.js      # Authentication, Registration, Profile (with encryption)
├── middleware/
│   └── authMiddleware.js      # protect(), restrictTo() - Access Control
├── models/
│   └── userModel.js           # Password hashing, OTP fields, Role enum
├── routes/
│   ├── adminRoutes.js         # Admin-only routes
│   ├── orderRoute.js          # Role-restricted order routes
│   ├── restaurantRoutes.js    # Restaurant management routes
│   └── userRoutes.js          # User authentication routes
└── utils/
    ├── security.js            # Encryption, Digital Signature, QR Code
    └── sendEmail.js           # OTP email delivery

Frontend Apps/
├── Food/src/components/LoginPopup/   # Customer MFA login
├── admin/src/components/             # Admin MFA login
├── restaurant-admin/src/pages/       # Restaurant owner MFA login + QR display
└── DeliveryAgent/src/pages/          # Delivery agent MFA login
```

---

## 🔐 Security Best Practices Followed

1. **Defense in Depth:** Multiple layers of security (authentication → authorization → encryption)
2. **Principle of Least Privilege:** Role-based access ensures minimal necessary permissions
3. **Secure by Default:** Passwords hashed, sensitive data encrypted
4. **Fail Securely:** Decryption failures return original data, not crash
5. **Input Validation:** Email, password strength validation on both frontend and backend
6. **Timing Attack Prevention:** Using `crypto.timingSafeEqual()` for comparisons

---

*Document generated for SnapDish Security Assessment*
