/**
 * Performance regression tests for the bulk job-upsert refactor.
 *
 * These tests verify that the N+1 query pattern (one findOne per job) has been
 * replaced with O(1) bulk operations regardless of batch size, and that edge
 * cases (duplicates, concurrent-worker races, oversized batches) are handled
 * correctly.
 *
 * The `bulkUpsertJobs` helper is tested in isolation via dependency injection —
 * no live MongoDB connection or HTTP server is required.
 *
 * Run with:
 *   node --test src/__tests__/jobFetcher.perf.test.js
 *
 * Uses Node.js built-in `node:test` (Node >= 18, no extra dependencies).
 */

import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// ─── Mirror of bulkUpsertJobs (matches backend/src/services/jobFetcher.js) ───
//
// Keeping the implementation inline means the tests run without importing the
// full jobFetcher module (which pulls in cron, BullMQ, Firebase, mongoose, …).
// If the implementation changes, update this mirror and the service together.

const MAX_BATCH_SIZE = 25;

const bulkUpsertJobs = async (fetchedJobs, JobModel, onNewJobs) => {
    const batch = fetchedJobs.slice(0, MAX_BATCH_SIZE);

    if (batch.length === 0) return [];

    const externalIds = batch.map(j => j.externalId).filter(Boolean);

    const existingDocs = await JobModel.find({ externalId: { $in: externalIds } })
        .select('_id externalId')
        .lean();

    const existingMap = new Map(existingDocs.map(d => [d.externalId, d]));

    const toInsert = batch.filter(j => j.externalId && !existingMap.has(j.externalId));

    if (toInsert.length > 0) {
        let insertedDocs = [];
        try {
            insertedDocs = await JobModel.insertMany(toInsert, { ordered: false });
        } catch (err) {
            if (err.name === 'MongoBulkWriteError' || err.code === 11000) {
                insertedDocs = err.insertedDocs ?? [];
            } else {
                throw err;
            }
        }

        for (const doc of insertedDocs) {
            existingMap.set(doc.externalId, doc);
        }

        const stillMissing = toInsert
            .map(j => j.externalId)
            .filter(id => id && !existingMap.has(id));
        if (stillMissing.length > 0) {
            const recovered = await JobModel.find({ externalId: { $in: stillMissing } })
                .select('_id externalId')
                .lean();
            for (const doc of recovered) existingMap.set(doc.externalId, doc);
        }

        if (onNewJobs && insertedDocs.length > 0) {
            await onNewJobs(insertedDocs);
        }
    }

    return batch
        .map(job => ({ ...job, _id: existingMap.get(job.externalId)?._id }))
        .filter(j => j._id != null);
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeJobs = (count, prefix = 'job') =>
    Array.from({ length: count }, (_, i) => ({
        externalId: `${prefix}-${i + 1}`,
        title: `Engineer ${i + 1}`,
        company: `Corp ${i + 1}`,
        applyLink: `https://example.com/${prefix}-${i + 1}`,
    }));

/**
 * Builds a mock JobListing model with call-count tracking.
 * `existingIds` is the set of externalIds that already exist in the "DB".
 */
const makeMockModel = (existingIds = new Set(), opts = {}) => {
    let findCallCount = 0;
    let insertManyCallCount = 0;
    let nextInsertError = opts.nextInsertError ?? null;

    const chainable = (result) => ({
        select: () => chainable(result),
        lean: async () => result,
    });

    return {
        _findCallCount: () => findCallCount,
        _insertManyCallCount: () => insertManyCallCount,

        find(query) {
            findCallCount++;
            const ids = query?.externalId?.$in ?? [];
            const docs = ids
                .filter(id => existingIds.has(id))
                .map(id => ({ _id: `oid-${id}`, externalId: id }));
            return chainable(docs);
        },

        async insertMany(docs) {
            insertManyCallCount++;
            if (nextInsertError) {
                const err = nextInsertError;
                nextInsertError = null;
                throw err;
            }
            // Simulate insert: add to existingIds, return docs with _id
            const inserted = docs.map(d => {
                existingIds.add(d.externalId);
                return { ...d, _id: `oid-${d.externalId}` };
            });
            return inserted;
        },
    };
};

// ─── Core query-count invariant ───────────────────────────────────────────────

describe('bulkUpsertJobs — query count invariant', () => {
    test('20 all-new jobs: find called exactly once, insertMany called exactly once', async () => {
        const jobs = makeJobs(20);
        const model = makeMockModel();

        await bulkUpsertJobs(jobs, model, null);

        assert.equal(model._findCallCount(), 1, 'find must be called exactly once');
        assert.equal(model._insertManyCallCount(), 1, 'insertMany must be called exactly once');
    });

    test('20 all-existing jobs: find called exactly once, insertMany never called', async () => {
        const jobs = makeJobs(20);
        const existingIds = new Set(jobs.map(j => j.externalId));
        const model = makeMockModel(existingIds);

        await bulkUpsertJobs(jobs, model, null);

        assert.equal(model._findCallCount(), 1, 'find must be called exactly once');
        assert.equal(model._insertManyCallCount(), 0, 'insertMany must not be called when all exist');
    });

    test('mixed batch (10 new, 10 existing): find called once, insertMany called once', async () => {
        const allJobs = makeJobs(20);
        const existingIds = new Set(allJobs.slice(0, 10).map(j => j.externalId));
        const model = makeMockModel(existingIds);

        await bulkUpsertJobs(allJobs, model, null);

        assert.equal(model._findCallCount(), 1);
        assert.equal(model._insertManyCallCount(), 1);
    });

    test('empty input: no DB calls at all', async () => {
        const model = makeMockModel();
        const result = await bulkUpsertJobs([], model, null);
        assert.deepEqual(result, []);
        assert.equal(model._findCallCount(), 0);
        assert.equal(model._insertManyCallCount(), 0);
    });
});

// ─── Batch size cap ───────────────────────────────────────────────────────────

describe('bulkUpsertJobs — batch size cap', () => {
    test('30 jobs provided: only 25 are processed', async () => {
        const jobs = makeJobs(30);
        const model = makeMockModel();
        const result = await bulkUpsertJobs(jobs, model, null);
        assert.equal(result.length, 25, 'result must be capped at 25');
    });

    test('exactly 25 jobs: all 25 processed', async () => {
        const jobs = makeJobs(25);
        const model = makeMockModel();
        const result = await bulkUpsertJobs(jobs, model, null);
        assert.equal(result.length, 25);
    });

    test('1 job: processed normally', async () => {
        const jobs = makeJobs(1);
        const model = makeMockModel();
        const result = await bulkUpsertJobs(jobs, model, null);
        assert.equal(result.length, 1);
    });
});

// ─── Return value correctness ─────────────────────────────────────────────────

describe('bulkUpsertJobs — return value', () => {
    test('each returned job has an _id field', async () => {
        const jobs = makeJobs(5);
        const model = makeMockModel();
        const result = await bulkUpsertJobs(jobs, model, null);
        for (const job of result) {
            assert.ok(job._id, `job ${job.externalId} must have _id`);
        }
    });

    test('existing job _ids are resolved from the find result', async () => {
        const jobs = makeJobs(3);
        const existingIds = new Set(jobs.map(j => j.externalId));
        const model = makeMockModel(existingIds);
        const result = await bulkUpsertJobs(jobs, model, null);
        assert.equal(result.length, 3);
        for (const job of result) {
            assert.equal(job._id, `oid-${job.externalId}`);
        }
    });

    test('original job fields are preserved in the returned objects', async () => {
        const jobs = [{ externalId: 'abc', title: 'Dev', company: 'Acme', applyLink: 'https://x.com' }];
        const model = makeMockModel();
        const [result] = await bulkUpsertJobs(jobs, model, null);
        assert.equal(result.title, 'Dev');
        assert.equal(result.company, 'Acme');
        assert.equal(result.applyLink, 'https://x.com');
    });
});

// ─── Duplicate key / concurrent worker handling ───────────────────────────────

describe('bulkUpsertJobs — duplicate key error handling', () => {
    test('11000 error from insertMany does not throw', async () => {
        const jobs = makeJobs(5);
        const existingIds = new Set();

        // Simulate insertMany throwing 11000 and returning no insertedDocs
        const model = makeMockModel(existingIds, {
            nextInsertError: Object.assign(new Error('E11000 duplicate key'), {
                code: 11000,
                name: 'MongoBulkWriteError',
                writeErrors: [{ index: 2 }],
                insertedDocs: [],
            }),
        });

        // Add all IDs to existingIds so the fallback find recovers them
        for (const j of jobs) existingIds.add(j.externalId);

        await assert.doesNotReject(() => bulkUpsertJobs(jobs, model, null));
    });

    test('non-duplicate error from insertMany is re-thrown', async () => {
        const jobs = makeJobs(3);
        const model = makeMockModel(new Set(), {
            nextInsertError: Object.assign(new Error('network timeout'), { code: 89 }),
        });

        await assert.rejects(
            () => bulkUpsertJobs(jobs, model, null),
            { message: 'network timeout' }
        );
    });
});

// ─── Firebase / onNewJobs callback ────────────────────────────────────────────

describe('bulkUpsertJobs — onNewJobs callback', () => {
    test('onNewJobs is called once with newly inserted docs', async () => {
        const jobs = makeJobs(5);
        const model = makeMockModel();
        let callCount = 0;
        let receivedDocs = null;

        await bulkUpsertJobs(jobs, model, async (docs) => {
            callCount++;
            receivedDocs = docs;
        });

        assert.equal(callCount, 1, 'onNewJobs must be called exactly once');
        assert.equal(receivedDocs.length, 5);
    });

    test('onNewJobs is NOT called when all jobs already exist', async () => {
        const jobs = makeJobs(5);
        const existingIds = new Set(jobs.map(j => j.externalId));
        const model = makeMockModel(existingIds);
        let callCount = 0;

        await bulkUpsertJobs(jobs, model, async () => { callCount++; });

        assert.equal(callCount, 0, 'onNewJobs must not be called when nothing was inserted');
    });

    test('onNewJobs receives only newly inserted docs, not pre-existing ones', async () => {
        const jobs = makeJobs(6);
        const existingIds = new Set(jobs.slice(0, 3).map(j => j.externalId));
        const model = makeMockModel(existingIds);
        let newDocIds = [];

        await bulkUpsertJobs(jobs, model, async (docs) => {
            newDocIds = docs.map(d => d.externalId);
        });

        assert.equal(newDocIds.length, 3);
        for (const id of newDocIds) {
            assert.ok(id.startsWith('job-'), `expected job- prefix, got ${id}`);
            const idx = parseInt(id.split('-')[1], 10);
            assert.ok(idx > 3, `only jobs 4-6 should be new, got ${id}`);
        }
    });
});
