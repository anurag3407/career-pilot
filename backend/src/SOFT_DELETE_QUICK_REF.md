# Soft Delete Quick Reference

## Common Operations

### Delete a Record (Soft Delete by Default)
```javascript
const user = await User.findById(userId);
await user.softDelete();
// OR
await User.deleteOne({ _id: userId });
// Both mark as deleted instead of removing
```

### Restore a Record
```javascript
const user = await User.findWithDeleted().findById(userId);
await user.restore();
```

### Find Deleted Records
```javascript
const deleted = await User.findDeleted();
const deletedByRole = await User.findDeleted().where({ role: 'admin' });
```

### Find Active Records (Default)
```javascript
const active = await User.find();  // Automatically excludes deleted
const active = await User.findActive();
```

### Find All Records (Including Deleted)
```javascript
const all = await User.findWithDeleted();
```

### Count Records
```javascript
const deleted = await User.countDeleted();
const active = await User.countActive();
const total = await User.countDocuments().setOptions({ _recursed: true });
```

## Admin API

### List Deleted Records
```bash
GET /api/admin/soft-delete/User/deleted?page=1&limit=50
```

### Get Statistics
```bash
GET /api/admin/soft-delete/User/stats
```

### Restore a Record
```bash
POST /api/admin/soft-delete/User/:id/restore
```

### Restore Multiple
```bash
POST /api/admin/soft-delete/User/restore-many
{
  "filter": { "role": "test-user" },
  "limit": 100
}
```

### Permanently Delete
```bash
DELETE /api/admin/soft-delete/User/:id
```

### Summary
```bash
GET /api/admin/soft-delete/all/summary
```

## Fields Added to All Models

Every model now has:

```javascript
{
  isDeleted: Boolean,    // true if deleted
  deletedAt: Date        // when it was deleted
}
```

## Important Notes

- ✅ Deleted records are automatically excluded from queries
- ✅ Only use `findWithDeleted()` to access deleted records
- ✅ Use `restore()` method to undelete records
- ⚠️ Hard delete with `permanentlyDelete()` is irreversible
- 📊 All 16 models support soft delete
