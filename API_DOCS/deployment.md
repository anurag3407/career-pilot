# 🚀 Deployment & Security API

> Base URL: `http://localhost:5001/api`
> All endpoints require `Authorization: Bearer <firebase_id_token>`

---

## Table of Contents

- [Payments](#payments)
- [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)

---

## Payments

> Base path: `/api/payments`
> Powered by Razorpay. Used for fellowship challenge escrow payments.

### Create Payment Order

Creates a Razorpay order for accepting a student proposal. Uses the challenge price as the payment amount.

```http
POST /api/payments/create-order
```

**Body:**
```json
{
  "proposalId": "proposal_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_XXXXXXXXXX",
    "amount": 500000,
    "currency": "INR",
    "keyId": "rzp_live_XXXXXXXXXX",
    "proposalId": "proposal_id",
    "challengeTitle": "Build a Portfolio Website",
    "studentName": "Jane Doe"
  }
}
```

> `amount` is in paise (₹5000 = 500000 paise)

**Errors:**
- `400` - Proposal ID required
- `400` - Proposal is no longer pending
- `403` - Only the challenge owner can accept proposals
- `404` - Proposal or challenge not found

---

### Verify Payment & Accept Proposal

Verifies the Razorpay payment signature, accepts the proposal, creates a chat room, and sends an approval email to the student. Funds are held in escrow until released.

```http
POST /api/payments/verify-payment
```

**Body:**
```json
{
  "razorpay_order_id": "order_XXXXXXXXXX",
  "razorpay_payment_id": "pay_XXXXXXXXXX",
  "razorpay_signature": "signature_hash",
  "proposalId": "proposal_id",
  "feedback": "Great proposal! Excited to work with you."
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `razorpay_order_id` | string | ✅ | From create-order response |
| `razorpay_payment_id` | string | ✅ | From Razorpay callback |
| `razorpay_signature` | string | ✅ | From Razorpay callback |
| `proposalId` | string | ✅ | Proposal being accepted |
| `feedback` | string | ❌ | Optional message to student |

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and proposal accepted",
  "data": {
    "proposal": {
      "_id": "proposal_id",
      "status": "accepted",
      "corporateFeedback": "Great proposal!"
    },
    "chatRoom": {
      "_id": "room_id",
      "paymentStatus": "escrow",
      "amount": 5000,
      "paidAt": "2026-05-20T10:30:00.000Z"
    }
  }
}
```

**Errors:**
- `400` - Invalid payment signature
- `403` - Not the challenge owner
- `409` - Proposal already processed
- `404` - Proposal or challenge not found

---

### Release Funds

Releases escrowed funds and marks the challenge as completed. Only the corporate user can trigger this.

```http
POST /api/payments/release-funds/:roomId
```

**Response:**
```json
{
  "success": true,
  "message": "Funds released and challenge completed successfully",
  "data": {
    "chatRoom": {
      "_id": "room_id",
      "paymentStatus": "released",
      "releasedAt": "2026-06-01T10:00:00.000Z",
      "status": "closed"
    },
    "challenge": {
      "_id": "challenge_id",
      "status": "completed"
    }
  }
}
```

**Errors:**
- `400` - Funds not in escrow (already released or not paid)
- `403` - Only the company can release funds
- `404` - Chat room or challenge not found

---

### Get Payment Status

Returns the current payment status for a chat room.

```http
GET /api/payments/status/:roomId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentStatus": "escrow",
    "amount": 5000,
    "paidAt": "2026-05-20T10:30:00.000Z",
    "releasedAt": null
  }
}
```

| `paymentStatus` | Meaning |
|-----------------|---------|
| `escrow` | Payment received, held until work is approved |
| `released` | Funds released to student, challenge complete |

**Errors:**
- `403` - Not a participant in this chat room
- `404` - Chat room not found

---

## Two-Factor Authentication (2FA)

> Base path: `/api/auth/2fa`
> Uses TOTP (Time-based One-Time Passwords) compatible with Google Authenticator, Authy, etc.

### Get 2FA Status

Returns whether 2FA is enabled for the authenticated user.

```http
GET /api/auth/2fa/status
```

**Response:**
```json
{
  "success": true,
  "enabled": true,
  "hasBackupCodes": true
}
```

---

### Setup 2FA

Generates a new TOTP secret and QR code for scanning with an authenticator app. The secret is **not saved** until confirmed via `/enable`.

```http
POST /api/auth/2fa/setup
```

**Response:**
```json
{
  "success": true,
  "secret": "BASE32SECRETKEY",
  "qrDataUrl": "data:image/png;base64,..."
}
```

> Display the `qrDataUrl` as an `<img>` for the user to scan with their authenticator app.

---

### Enable 2FA

Verifies the first TOTP scan and permanently saves the secret. Returns one-time backup codes.

```http
POST /api/auth/2fa/enable
```

**Body:**
```json
{
  "secret": "BASE32SECRETKEY",
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "backupCodes": [
    "XXXX-XXXX",
    "XXXX-XXXX",
    "XXXX-XXXX",
    "XXXX-XXXX",
    "XXXX-XXXX"
  ]
}
```

> Store backup codes securely — they cannot be retrieved again.

**Errors:**
- `400` - Secret and token required
- `400` - Invalid verification code

---

### Disable 2FA

Disables 2FA after verifying the current TOTP code.

```http
POST /api/auth/2fa/disable
```

**Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `400` - Token required
- `400` - Invalid verification code

---

### Verify TOTP Code

Used during login to confirm the TOTP code after Firebase authentication.

> ⚠️ Rate limited to **5 attempts per 15 minutes** per user to prevent brute force.

```http
POST /api/auth/2fa/verify
```

**Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `400` - Token required
- `401` - Invalid or expired code
- `429` - Too many verification attempts, try again in 15 minutes

---

### Verify Backup Code

Allows login using a one-time backup code when the authenticator app is unavailable.

> ⚠️ Rate limited to **5 attempts per 15 minutes** per user.

```http
POST /api/auth/2fa/verify-backup
```

**Body:**
```json
{
  "code": "XXXX-XXXX"
}
```

**Response:**
```json
{
  "success": true
}
```

**Errors:**
- `400` - Code required
- `401` - Invalid backup code
- `429` - Too many attempts

---

### Regenerate Backup Codes

Generates a fresh set of backup codes. Requires the current TOTP to confirm intent.

```http
POST /api/auth/2fa/backup-codes/regenerate
```

**Body:**
```json
{
  "token": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "backupCodes": [
    "XXXX-XXXX",
    "XXXX-XXXX",
    "XXXX-XXXX",
    "XXXX-XXXX",
    "XXXX-XXXX"
  ]
}
```

**Errors:**
- `400` - Token required
- `400` - Invalid code or 2FA not enabled
