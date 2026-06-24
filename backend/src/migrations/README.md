# Database Migration Framework

Career Pilot backend migrations are executed through:

```bash
npm run migrate
npm run migrate:status
npm run migrate:down -- --steps=1
npm run migrate -- --dry-run
```

## Migration file format

Create migration files in:

```txt
backend/src/migrations/steps
```

Use a sortable numeric prefix:

```txt
001-create-user-index.js
002-backfill-job-alert-status.js
```

Each migration exports an `up(db)` function and may export a `down(db)` rollback function.

```js
export const description = 'Create index for user email lookups';

export async function up(db) {
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
}

export async function down(db) {
  await db.collection('users').dropIndex('email_1');
}
```

## Safety behavior

- Applied migrations are stored in the `schema_migrations` collection.
- Already-applied migrations are skipped.
- A MongoDB-backed lock prevents concurrent migration runs during deployment.
- Failed migrations are not recorded as applied.
- `--dry-run` shows pending work without mutating the database.

## Deployment usage

Run migrations after the backend has access to `MONGODB_URI` and before routing production traffic to the new release.

Recommended deployment order:

```bash
npm install
npm run migrate
npm start
```

## Rollback usage

To roll back the latest applied migration:

```bash
npm run migrate:down -- --steps=1
```

Only migrations that define a `down(db)` function can be rolled back.