import test from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('jobs route registers the job detail endpoint', () => {
  const routeSource = readFileSync(
    resolve('src/routes/jobsRoute.js'),
    'utf8',
  );

  assert.match(
    routeSource,
    /import\s*\{\s*getJobById,\s*getJobs,\s*summarizeJob\s*\}\s*from\s*["']\.\.\/controllers\/jobFetch\.js["'];/,
  );
  assert.match(
    routeSource,
    /router\.get\(\s*["']\/:jobId["']\s*,\s*verifyToken\s*,\s*getJobById\s*\);/,
  );
});
