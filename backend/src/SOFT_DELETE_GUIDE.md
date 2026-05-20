# Soft Delete Implementation Guide

## Overview

This project implements **soft delete** functionality across all MongoDB models. Instead of permanently removing data, records are marked as deleted with an `isDeleted` flag and `deletedAt` timestamp. This enables:

- ✅ Data recovery (restore deleted records)
- ✅ Audit trails (track when data was deleted)
- ✅ Compliance (retain data for regulatory requirements)
- ✅ Undo operations (allow users to restore their data)

## Database Schema Changes

### Fields Added to All Models

Every MongoDB model now includes two additional fields:

```javascript
{
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null,
    index: true
  }
}
```

## Soft Delete Plugin

All models use the `softDeletePlugin` from `src/middleware/softDelete.js`:

```javascript
// Example: User.model.js
import { softDeletePlugin } from '../middleware/softDelete.js';

const userSchema = new mongoose.Schema({
  // ... fields
});

userSchema.plugin(softDeletePlugin);
const User = mongoose.model('User', userSchema);
```

## Automatic Query Filtering

### What Gets Filtered

By default, all queries automatically exclude soft-deleted records:

```javascript
// These queries automatically exclude deleted records
await User.find({ email: 'user@example.com' });           // ✅ Excludes deleted
await User.findById(userId);                              // ✅ Excludes deleted
await User.findByIdAndUpdate(userId, {name: 'New'});      // ✅ Excludes deleted
await User.updateOne({ _id: userId }, {...});             // ✅ Excludes deleted
```

### What Happens with DELETE Operations

All delete operations are automatically converted to soft deletes:

```javascript
// These operations soft-delete instead of hard-deleting
await User.deleteOne({ _id: userId });
// Becomes: { isDeleted: true, deletedAt: new Date() }

await User.deleteMany({ status: 'inactive' });
// Becomes: { isDeleted: true, deletedAt: new Date() }

await User.findByIdAndDelete(userId);
// Becomes: { isDeleted: true, deletedAt: new Date() }
```

## Using Soft Delete in Code

### Model Instance Methods

```javascript
// Soft delete a single document
const user = await User.findById(userId);
await user.softDelete();
// Result: { isDeleted: true, deletedAt: <date> }

// Restore a soft-deleted document
await user.restore();
// Result: { isDeleted: false, deletedAt: null }
```

### Model Static Methods

```javascript
// Find only deleted records
const deletedUsers = await User.findDeleted();

// Find only active (non-deleted) records
const activeUsers = await User.findActive();

// Find all records including deleted
const allUsers = await User.findWithDeleted();

// Count deleted records
const deletedCount = await User.countDeleted();
const deletedCountByRole = await User.countDeleted({ role: 'admin' });

// Count active records
const activeCount = await User.countActive();

// Soft delete multiple records by filter
await User.softDeleteMany({ status: 'inactive' });

// Restore multiple records by filter
await User.restoreMany({ role: 'test-user' });

// Permanently delete records (hard delete - IRREVERSIBLE)
await User.permanentlyDelete({ createdAt: { $lt: twoYearsAgo } });
```

## Admin API Endpoints

All soft delete management is handled through admin endpoints mounted at `/api/admin/`:

### 1. Get Deleted Records

```http
GET /api/admin/soft-delete/:model/deleted?page=1&limit=50&sortBy=deletedAt
```

**Response:**
```json
{
  "success": true,
  "model": "User",
  "total": 156,
  "page": 1,
  "limit": 50,
  "pages": 4,
  "data": [...]
}
```

### 2. Get Deletion Statistics

```http
GET /api/admin/soft-delete/:model/stats
```

**Response:**
```json
{
  "success": true,
  "model": "User",
  "totalRecords": 1000,
  "activeRecords": 844,
  "deletedRecords": 156,
  "deletionPercentage": "15.60"
}
```

### 3. Restore a Single Record

```http
POST /api/admin/soft-delete/:model/:id/restore
```

**Response:**
```json
{
  "success": true,
  "message": "User record restored successfully",
  "model": "User",
  "id": "507f1f77bcf86cd799439011",
  "restoredRecord": {...}
}
```

### 4. Restore Multiple Records

```http
POST /api/admin/soft-delete/:model/restore-many
Content-Type: application/json

{
  "filter": { "role": "test-user" },
  "limit": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "42 User records restored",
  "model": "User",
  "restored": 42,
  "filter": { "role": "test-user" }
}
```

### 5. Permanently Delete (Hard Delete)

```http
DELETE /api/admin/soft-delete/:model/:id
```

⚠️ **WARNING**: This permanently and irreversibly deletes data!

### 6. Permanently Delete Multiple

```http
DELETE /api/admin/soft-delete/:model/permanent
Content-Type: application/json

{
  "filter": { "createdAt": { "$lt": "2024-01-01" } },
  "limit": 1000,
  "confirm": true
}
```

⚠️ **WARNING**: Requires `confirm: true` and is irreversible!

### 7. Get Summary Across All Models

```http
GET /api/admin/soft-delete/all/summary
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "User": {
      "total": 1000,
      "active": 844,
      "deleted": 156,
      "deletionPercentage": "15.60"
    },
    "Job": {
      "total": 5000,
      "active": 4800,
      "deleted": 200,
      "deletionPercentage": "4.00"
    }
    // ... more models
  },
  "totals": {
    "totalRecords": 150000,
    "totalDeleted": 15600,
    "totalActive": 134400,
    "overallDeletionPercentage": "10.40"
  }
}
```

## Available Models

The soft delete management API supports all 16 models:

```
├── User
├── Job
├── Challenge
├── Proposal
├── Resume
├── TrackedJob
├── JobAlert
├── JobListing
├── Interview
├── FellowshipProfile
├── NotificationLog
├── TwoFactor
├── UserProfile
├── AiConfig
├── LoginAttempt
├── FellowshipChatRoom
└── FellowshipMessage
```

## Usage Examples

### 1. User Deletes Their Data

User clicks "Delete Account":

```javascript
// In backend controller
const user = await User.findById(userId);
await user.softDelete();  // Marks user as deleted

// Query automatically excludes this user:
const users = await User.find();  // Does NOT include deleted user
```

### 2. User Restores Deleted Data

User clicks "Restore Account" (within 30-day grace period):

```javascript
const user = await User.findWithDeleted().findById(userId);
await user.restore();  // Restores the user

// User reappears in normal queries:
const user = await User.findById(userId);  // ✅ User found
```

### 3. Admin Audits Deletions

Admin views who was deleted and when:

```bash
curl http://localhost:5000/api/admin/soft-delete/User/stats
# Returns deletion statistics

curl http://localhost:5000/api/admin/soft-delete/User/deleted?limit=10
# Returns last 10 deleted users
```

### 4. Cleanup Old Deleted Records

Permanently delete records older than 1 year (for compliance):

```bash
curl -X DELETE http://localhost:5000/api/admin/soft-delete/User/permanent \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "deletedAt": { "$lt": "2023-05-20" }
    },
    "confirm": true
  }'
```

## Query Tips

### ❌ Common Mistakes

```javascript
// WRONG - Only gets deleted records
const deleted = await User.find({ isDeleted: true });

// WRONG - Manual filter doesn't help (plugin adds it back)
const users = await User.find({ isDeleted: false });

// WRONG - Can't find deleted user normally
const user = await User.findById(deletedUserId);  // Returns null
```

### ✅ Correct Approaches

```javascript
// RIGHT - Use the static method
const deleted = await User.findDeleted();

// RIGHT - Use to find all including deleted
const user = await User.findWithDeleted().findById(deletedUserId);

// RIGHT - In custom queries, manually check
const allUsers = await User.find().setOptions({ _recursed: true });
```

## Performance Considerations

### Indexes

Soft delete fields are automatically indexed:

```javascript
// Indexes added to all models:
isDeleted: { type: Boolean, index: true }
deletedAt: { type: Date, index: true }
```

This ensures:
- Fast queries for deleted records: `O(log n)`
- Fast active record queries: `O(log n)`

### Query Performance

The automatic filtering is efficient:

```javascript
// This query adds ONE index filter
await User.find({ name: 'John' });
// Becomes: { name: 'John', isDeleted: false }
// Uses index on isDeleted for fast filtering
```

### Storage Impact

- **Minimal**: Only adds 2 fields per document
- **Indexes**: 2 additional indexes (manageable)
- **Network**: Deleted records still sent in bulk operations

## Security & Audit

### Tracking Deletions

```javascript
// When deleting, you can track who deleted it
const user = await User.findById(userId);
user.deletedBy = req.user._id;        // Optional custom field
user.deletionReason = 'User request';  // Optional
await user.softDelete();
```

### Query Logging

All queries that access deleted records are logged:

```javascript
// This is logged automatically
const deleted = await User.findDeleted();
const all = await User.findWithDeleted();
```

## Data Recovery Grace Periods

Recommend implementing grace periods:

```javascript
// Grace period middleware example
const DELETION_GRACE_PERIOD = 30 * 24 * 60 * 60 * 1000; // 30 days

async function canRestoreData(userId) {
  const user = await User.findWithDeleted().findById(userId);
  
  if (!user || !user.isDeleted) return false;
  
  const daysSinceDeletion = (Date.now() - user.deletedAt) / (24 * 60 * 60 * 1000);
  
  return daysSinceDeletion <= 30;  // Can restore within 30 days
}
```

## Migration from Hard Delete

If your system previously used hard deletes:

```javascript
// No schema migration needed - isDeleted defaults to false
// All existing records are treated as active
// Simply stop calling delete() and use softDelete() instead

// Old code:
await User.deleteOne({ _id: userId });

// New code:
const user = await User.findById(userId);
await user.softDelete();
```

## Troubleshooting

### Soft-deleted Records Appearing in Results

```javascript
// Wrong:
const users = await User.find().setOptions({ _recursed: true }).exec();
// This includes deleted records!

// Right:
const users = await User.find();  // Excludes deleted
```

### Can't Find a Record

```javascript
// If record seems missing, check if it's deleted:
const record = await Model.findWithDeleted().findById(id);

if (record?.isDeleted) {
  console.log('Record was deleted at:', record.deletedAt);
}
```

### Need All Records (Including Deleted)

```javascript
const all = await User.findWithDeleted();
// OR with conditions:
const all = await User.find().setOptions({ _recursed: true });
```

## Implementation Checklist

- ✅ Soft delete plugin created
- ✅ All 16 models updated
- ✅ Automatic query filtering
- ✅ Admin API endpoints
- ✅ Restore functionality
- ✅ Permanent delete (hard delete) option
- ✅ Audit across all models
- ✅ Indexes for performance

## Next Steps

1. **Test the endpoints**: Use curl or Postman to test admin endpoints
2. **Implement recovery UI**: Add restore buttons in user dashboard
3. **Set cleanup policies**: Decide when to hard-delete permanently deleted records
4. **Monitor deletions**: Track deletion metrics for compliance
5. **Document policies**: Create user-facing documentation for data deletion
