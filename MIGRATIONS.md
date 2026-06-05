# Database Migrations Guide

## Running migrations
```bash
cd backend
npm run migrate:up       # Apply pending migrations
npm run migrate:down     # Roll back last migration
npm run migrate:status   # See what's applied
```

## Creating a new migration
```bash
npm run migrate:create -- your-migration-name
# Creates: backend/migrations/<timestamp>-your-migration-name.js
```

## Rules
- Never edit an already-applied migration
- Always implement both `up` and `down`
- Name migrations descriptively: `006-add-skills-field-to-users`
- Test rollback locally before merging