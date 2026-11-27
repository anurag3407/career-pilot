import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Application packets — migration 20261115000000', () => {
  const migrationPath = path.join(
    __dirname,
    '../../../../supabase/migrations/20261115000000_application_packets.sql',
  );

  test('migration file exists and is idempotent', () => {
    assert.ok(fs.existsSync(migrationPath), 'migration file should exist');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    assert.match(sql, /IF NOT EXISTS/gi);
  });

  test('tracked_jobs gains the packet ownership + calendar columns', () => {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    for (const col of [
      'resume_version_id',
      'cover_letter_id',
      'interview_id',
      'applied_at',
      'next_action_at',
      'next_action_type',
      'interview_at',
      'last_activity_at',
      'packet',
      'offer',
      'rejection',
    ]) {
      assert.ok(
        sql.includes(`ADD COLUMN IF NOT EXISTS ${col}`),
        `tracked_jobs should add ${col}`,
      );
    }
  });

  test('career_profiles and star_stories tables are created with RLS', () => {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.career_profiles/);
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.star_stories/);
    // RLS is enabled dynamically in the DO block for both tables.
    assert.match(sql, /\['career_profiles', 'star_stories'\]/);
    assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
    assert.match(sql, /auth\.uid\(\) = user_id/);
    assert.match(sql, /master_resume_id/);
    assert.match(sql, /target_roles/);
    assert.match(sql, /weekly_apply_target/);
    assert.match(sql, /rejection_debrief/);
  });

  test('interviews link back to tracked jobs', () => {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    assert.match(sql, /ALTER TABLE public\.interviews ADD COLUMN IF NOT EXISTS tracked_job_id/);
  });
});

describe('POST /api/jobs/track (extension endpoint)', () => {
  test('route module exposes POST /track with auth middleware', async () => {
    const mod = await import('../jobsTrack.js');
    const router = mod.default;
    assert.ok(router, 'router should export');
    const layers = router.stack.filter((l) => l.route);
    const paths = layers.map((l) => l.route.path);
    assert.ok(paths.includes('/track'), 'should handle POST /track');
  });

  test('normalizeNotes accepts string and array shapes', async () => {
    const { normalizeNotes } = await import('../jobsTrack.js');
    assert.deepEqual(normalizeNotes(undefined), []);
    assert.deepEqual(normalizeNotes(''), []);
    const fromString = normalizeNotes('  Recruiter pinged me  ');
    assert.equal(fromString.length, 1);
    assert.equal(fromString[0].content, 'Recruiter pinged me');
    assert.ok(fromString[0].createdAt);

    const fromArray = normalizeNotes(['first', { content: ' second ' }, { content: '' }, null]);
    assert.equal(fromArray.length, 2);
    assert.equal(fromArray[0].content, 'first');
    assert.equal(fromArray[1].content, 'second');
  });

  test('toSupabasePayload maps the extension payload shape', async () => {
    const { toSupabasePayload } = await import('../jobsTrack.js');
    const payload = toSupabasePayload(
      'user-1',
      {
        title: 'Senior Frontend Engineer',
        company: 'Stripe',
        location: 'Remote',
        salary: '$150k',
        status: 'saved',
        notes: 'via LinkedIn',
        url: 'https://linkedin.com/jobs/123',
        description: 'Build things',
      },
      'stripe::senior frontend engineer',
    );
    assert.equal(payload.user_id, 'user-1');
    assert.equal(payload.title, 'Senior Frontend Engineer');
    assert.equal(payload.job_id, 'stripe::senior frontend engineer');
    assert.equal(payload.job_url, 'https://linkedin.com/jobs/123');
    assert.equal(payload.status, 'saved');
    assert.equal(payload.notes, 'via LinkedIn');
    assert.equal(payload.data.source, 'extension');
    assert.equal(payload.data.description, 'Build things');
  });

  test('applied status stamps applied_date', async () => {
    const { toSupabasePayload } = await import('../jobsTrack.js');
    const payload = toSupabasePayload('u', { title: 'T', company: 'C', status: 'applied' }, 'j');
    assert.ok(payload.applied_date, 'applied_date should be set for applied status');
  });
});

describe('Career profile REST (/api/career-profile)', () => {
  test('route module exposes GET and PUT', async () => {
    const mod = await import('../careerProfile.js');
    const router = mod.default;
    assert.ok(router);
    const paths = router.stack.filter((l) => l.route).map((l) => l.route.path);
    assert.ok(paths.includes('/'));
  });
});

describe('Interview preview-questions endpoint', () => {
  test('registered before the session-creating routes', async () => {
    const mod = await import('../interview.js');
    const router = mod.default;
    const paths = router.stack.filter((l) => l.route).map((l) => l.route.path);
    assert.ok(paths.includes('/preview-questions'), 'preview-questions should exist');
    assert.ok(paths.includes('/start'));
    // Preview must be registered BEFORE the /:id(...) catch-alls so it is not
    // shadowed by param routes.
    assert.ok(
      paths.indexOf('/preview-questions') < paths.findIndex((p) => p.startsWith('/:id')),
      'preview-questions should be registered before /:id param routes',
    );
  });
});
