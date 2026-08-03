/**
 * Performance and persistence regression tests for bulk job upserts.
 *
 * These tests verify that the job-fetching pipeline uses bounded database
 * operations, source-scoped storage identities, and safe duplicate-key
 * recovery.
 *
 * Run from the backend directory:
 * node --test src/__tests__/jobFetcher.perf.test.js
 */

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

/*
 * This test file intentionally mirrors the isolated identity helpers and
 * bulkUpsertJobs implementation from src/services/jobFetcher.js.
 *
 * Importing jobFetcher.js directly would initialize unrelated services such
 * as BullMQ, Firebase, cron jobs, Mongoose models, and external integrations.
 */

const normalizeSourceIdentity = (value) => {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();

  return normalized || 'rapidapi-jsearch';
};

const normalizeProviderExternalId = (value) =>
  value === null || value === undefined
    ? ''
    : String(value).trim();

const buildSourceScopedExternalId = (
  source,
  externalId,
) => {
  const normalizedSource =
    normalizeSourceIdentity(source);

  const normalizedExternalId =
    normalizeProviderExternalId(externalId);

  if (!normalizedExternalId) {
    return '';
  }

  return `${normalizedSource}:${normalizedExternalId}`;
};

const buildStorageExternalId = (job) =>
  buildSourceScopedExternalId(
    job.source,
    job.externalId,
  );

/**
 * Store fetched jobs using source-scoped database identities while retaining
 * the original provider fields in values returned to the notification flow.
 *
 * @param {object[]} fetchedJobs Jobs fetched from configured providers.
 * @param {object} JobModel Mongoose-compatible model.
 * @param {Function|null} onNewJobs Optional callback for newly inserted jobs.
 * @returns {Promise<object[]>} Jobs containing resolved MongoDB IDs.
 */
const bulkUpsertJobs = async (
  fetchedJobs,
  JobModel,
  onNewJobs,
) => {
  const MAX_BATCH_SIZE = 25;

  const batch = fetchedJobs.slice(
    0,
    MAX_BATCH_SIZE,
  );

  if (batch.length === 0) {
    return [];
  }

  const preparedBatch = batch
    .map((job) => {
      const rawExternalId =
        normalizeProviderExternalId(
          job.externalId,
        );

      const normalizedSource =
        normalizeSourceIdentity(job.source);

      return {
        job,
        rawExternalId,
        normalizedSource,
        storageExternalId:
          buildStorageExternalId(job),
      };
    })
    .filter(
      ({
        rawExternalId,
        storageExternalId,
      }) =>
        rawExternalId &&
        storageExternalId,
    );

  if (preparedBatch.length === 0) {
    return [];
  }

  /*
   * Query both new source-scoped storage IDs and legacy raw IDs.
   *
   * This allows the application to reuse existing same-source legacy records
   * while storing new records safely when providers reuse the same raw ID.
   */
  const lookupExternalIds = [
    ...new Set(
      preparedBatch.flatMap(
        ({
          rawExternalId,
          storageExternalId,
        }) => [
          rawExternalId,
          storageExternalId,
        ],
      ),
    ),
  ];

  const existingDocs = await JobModel.find({
    externalId: {
      $in: lookupExternalIds,
    },
  })
    .select('_id externalId source')
    .lean();

  const existingByStoredId = new Map(
    existingDocs.map((document) => [
      String(document.externalId),
      document,
    ]),
  );

  const existingLegacyBySourceId =
    new Map(
      existingDocs.map((document) => [
        buildSourceScopedExternalId(
          document.source,
          document.externalId,
        ),
        document,
      ]),
    );

  const resolveExistingDocument =
    (entry) =>
      existingByStoredId.get(
        entry.storageExternalId,
      ) ??
      existingLegacyBySourceId.get(
        buildSourceScopedExternalId(
          entry.normalizedSource,
          entry.rawExternalId,
        ),
      );

  const entriesToInsert =
    preparedBatch.filter(
      (entry) =>
        !resolveExistingDocument(entry),
    );

  if (entriesToInsert.length > 0) {
    const documentsToInsert =
      entriesToInsert.map((entry) => ({
        ...entry.job,
        externalId:
          entry.storageExternalId,
      }));

    let insertedDocs = [];

    try {
      insertedDocs =
        await JobModel.insertMany(
          documentsToInsert,
          {
            ordered: false,
          },
        );
    } catch (error) {
      if (
        error.name ===
          'MongoBulkWriteError' ||
        error.code === 11000
      ) {
        insertedDocs =
          error.insertedDocs ?? [];
      } else {
        throw error;
      }
    }

    for (const document of insertedDocs) {
      existingByStoredId.set(
        String(document.externalId),
        document,
      );
    }

    /*
     * A duplicate-key error can occur when another worker inserts records
     * between this worker's lookup and insert. Query any unresolved IDs again.
     */
    const stillMissingExternalIds =
      entriesToInsert
        .map(
          (entry) =>
            entry.storageExternalId,
        )
        .filter(
          (externalId) =>
            !existingByStoredId.has(
              externalId,
            ),
        );

    if (
      stillMissingExternalIds.length > 0
    ) {
      const recoveredDocs =
        await JobModel.find({
          externalId: {
            $in:
              stillMissingExternalIds,
          },
        })
          .select(
            '_id externalId source',
          )
          .lean();

      for (const document of recoveredDocs) {
        existingByStoredId.set(
          String(document.externalId),
          document,
        );
      }
    }

    if (
      onNewJobs &&
      insertedDocs.length > 0
    ) {
      await onNewJobs(insertedDocs);
    }
  }

  return preparedBatch
    .map((entry) => {
      const existingDocument =
        resolveExistingDocument(entry);

      return {
        ...entry.job,
        _id: existingDocument?._id,
      };
    })
    .filter((job) => job._id != null);
};

/**
 * Create deterministic job fixtures.
 *
 * @param {number} count Number of jobs.
 * @param {string} prefix External-ID prefix.
 * @returns {object[]} Job fixtures.
 */
const makeJobs = (
  count,
  prefix = 'job',
) =>
  Array.from(
    {
      length: count,
    },
    (_, index) => ({
      externalId:
        `${prefix}-${index + 1}`,
      source: 'rapidapi-jsearch',
      title:
        `Engineer ${index + 1}`,
      company:
        `Corp ${index + 1}`,
      applyLink:
        `https://example.com/${prefix}-${index + 1}`,
    }),
  );

/**
 * Determine a source for a stored mock identifier.
 *
 * @param {*} externalId Stored external ID.
 * @returns {string} Provider source.
 */
const inferSourceFromStoredId = (
  externalId,
) => {
  const value = String(externalId);

  if (value.includes(':')) {
    return value.split(':', 1)[0];
  }

  return 'rapidapi-jsearch';
};

/**
 * Build a mock JobListing model with query and insertion call tracking.
 *
 * @param {Set<string>} existingIds Stored external IDs.
 * @param {object} options Mock configuration.
 * @returns {object} Mongoose-compatible mock.
 */
const makeMockModel = (
  existingIds = new Set(),
  options = {},
) => {
  let findCallCount = 0;
  let insertManyCallCount = 0;

  let nextInsertError =
    options.nextInsertError ?? null;

  const sourceByExternalId =
    options.sourceByExternalId ??
    new Map();

  const chainable = (result) => ({
    select: () => chainable(result),
    lean: async () => result,
  });

  return {
    _findCallCount: () =>
      findCallCount,

    _insertManyCallCount: () =>
      insertManyCallCount,

    find(query) {
      findCallCount += 1;

      const ids =
        query?.externalId?.$in ?? [];

      const documents = ids
        .filter((id) =>
          existingIds.has(id),
        )
        .map((id) => ({
          _id: `oid-${id}`,
          externalId: id,
          source:
            sourceByExternalId.get(id) ??
            inferSourceFromStoredId(id),
        }));

      return chainable(documents);
    },

    async insertMany(documents) {
      insertManyCallCount += 1;

      if (nextInsertError) {
        const error = nextInsertError;
        nextInsertError = null;

        if (
          options.recoverIdsOnInsertError
        ) {
          for (const document of documents) {
            existingIds.add(
              document.externalId,
            );

            sourceByExternalId.set(
              document.externalId,
              document.source,
            );
          }
        }

        throw error;
      }

      return documents.map((document) => {
        existingIds.add(
          document.externalId,
        );

        sourceByExternalId.set(
          document.externalId,
          document.source,
        );

        return {
          ...document,
          _id:
            `oid-${document.externalId}`,
        };
      });
    },
  };
};

describe(
  'bulkUpsertJobs - query count invariant',
  () => {
    test('20 all-new jobs use one find and one insertMany call', async () => {
      const jobs = makeJobs(20);
      const model = makeMockModel();

      await bulkUpsertJobs(
        jobs,
        model,
        null,
      );

      assert.equal(
        model._findCallCount(),
        1,
      );

      assert.equal(
        model._insertManyCallCount(),
        1,
      );
    });

    test('20 existing legacy jobs use one find and no insert', async () => {
      const jobs = makeJobs(20);

      const existingIds = new Set(
        jobs.map(
          (job) => job.externalId,
        ),
      );

      const model =
        makeMockModel(existingIds);

      await bulkUpsertJobs(
        jobs,
        model,
        null,
      );

      assert.equal(
        model._findCallCount(),
        1,
      );

      assert.equal(
        model._insertManyCallCount(),
        0,
      );
    });

    test('mixed new and legacy jobs use one find and one insert', async () => {
      const jobs = makeJobs(20);

      const existingIds = new Set(
        jobs
          .slice(0, 10)
          .map(
            (job) =>
              job.externalId,
          ),
      );

      const model =
        makeMockModel(existingIds);

      await bulkUpsertJobs(
        jobs,
        model,
        null,
      );

      assert.equal(
        model._findCallCount(),
        1,
      );

      assert.equal(
        model._insertManyCallCount(),
        1,
      );
    });

    test('empty input performs no database calls', async () => {
      const model = makeMockModel();

      const result =
        await bulkUpsertJobs(
          [],
          model,
          null,
        );

      assert.deepEqual(result, []);

      assert.equal(
        model._findCallCount(),
        0,
      );

      assert.equal(
        model._insertManyCallCount(),
        0,
      );
    });
  },
);

describe(
  'bulkUpsertJobs - batch size cap',
  () => {
    test('processes only 25 of 30 supplied jobs', async () => {
      const jobs = makeJobs(30);
      const model = makeMockModel();

      const result =
        await bulkUpsertJobs(
          jobs,
          model,
          null,
        );

      assert.equal(result.length, 25);
    });

    test('processes all 25 supplied jobs', async () => {
      const jobs = makeJobs(25);
      const model = makeMockModel();

      const result =
        await bulkUpsertJobs(
          jobs,
          model,
          null,
        );

      assert.equal(result.length, 25);
    });

    test('processes one job normally', async () => {
      const jobs = makeJobs(1);
      const model = makeMockModel();

      const result =
        await bulkUpsertJobs(
          jobs,
          model,
          null,
        );

      assert.equal(result.length, 1);
    });
  },
);

describe(
  'bulkUpsertJobs - return value and persistence identity',
  () => {
    test('each returned job has a MongoDB ID', async () => {
      const jobs = makeJobs(5);
      const model = makeMockModel();

      const result =
        await bulkUpsertJobs(
          jobs,
          model,
          null,
        );

      for (const job of result) {
        assert.ok(
          job._id,
          `job ${job.externalId} must have _id`,
        );
      }
    });

    test('resolves existing legacy document IDs', async () => {
      const jobs = makeJobs(3);

      const existingIds = new Set(
        jobs.map(
          (job) => job.externalId,
        ),
      );

      const model =
        makeMockModel(existingIds);

      const result =
        await bulkUpsertJobs(
          jobs,
          model,
          null,
        );

      assert.equal(result.length, 3);

      for (const job of result) {
        assert.equal(
          job._id,
          `oid-${job.externalId}`,
        );
      }
    });

    test('preserves original provider fields in returned jobs', async () => {
      const jobs = [
        {
          externalId: 'abc',
          source: 'linkedin',
          title: 'Developer',
          company: 'Acme',
          applyLink:
            'https://example.com/abc',
        },
      ];

      const model = makeMockModel();

      const [result] =
        await bulkUpsertJobs(
          jobs,
          model,
          null,
        );

      assert.equal(
        result.externalId,
        'abc',
      );

      assert.equal(
        result.source,
        'linkedin',
      );

      assert.equal(
        result.title,
        'Developer',
      );

      assert.equal(
        result.company,
        'Acme',
      );

      assert.equal(
        result.applyLink,
        'https://example.com/abc',
      );
    });

    test('stores identical provider IDs separately across sources', async () => {
      const existingIds = new Set();

      const model =
        makeMockModel(existingIds);

      const jobs = [
        {
          externalId: 'shared-id',
          source: 'rapidapi-jsearch',
          title: 'Backend Engineer',
          company: 'First Company',
          applyLink:
            'https://jobs.example.com/backend',
        },
        {
          externalId: 'shared-id',
          source: 'linkedin',
          title: 'Data Scientist',
          company: 'Second Company',
          applyLink:
            'https://jobs.example.com/data',
        },
      ];

      const result =
        await bulkUpsertJobs(
          jobs,
          model,
          null,
        );

      assert.equal(result.length, 2);

      assert.notEqual(
        result[0]._id,
        result[1]._id,
      );

      assert.equal(
        result[0].externalId,
        'shared-id',
      );

      assert.equal(
        result[1].externalId,
        'shared-id',
      );

      assert.ok(
        existingIds.has(
          'rapidapi-jsearch:shared-id',
        ),
      );

      assert.ok(
        existingIds.has(
          'linkedin:shared-id',
        ),
      );
    });

    test('reuses a legacy raw ID when its source matches', async () => {
      const existingIds = new Set([
        'legacy-job-1',
      ]);

      const model =
        makeMockModel(existingIds);

      const result =
        await bulkUpsertJobs(
          [
            {
              externalId:
                'legacy-job-1',
              source:
                'rapidapi-jsearch',
              title:
                'Legacy Engineer',
              company:
                'Legacy Company',
              applyLink:
                'https://jobs.example.com/legacy',
            },
          ],
          model,
          null,
        );

      assert.equal(result.length, 1);

      assert.equal(
        result[0]._id,
        'oid-legacy-job-1',
      );

      assert.equal(
        model._insertManyCallCount(),
        0,
      );
    });

    test('skips records without usable external IDs', async () => {
      const model = makeMockModel();

      const result =
        await bulkUpsertJobs(
          [
            {
              externalId: '',
              source: 'linkedin',
              title: 'Invalid job',
            },
            {
              externalId: null,
              source: 'rapidapi',
              title:
                'Another invalid job',
            },
          ],
          model,
          null,
        );

      assert.deepEqual(result, []);

      assert.equal(
        model._findCallCount(),
        0,
      );

      assert.equal(
        model._insertManyCallCount(),
        0,
      );
    });
  },
);

describe(
  'bulkUpsertJobs - duplicate key handling',
  () => {
    test('recovers records after a concurrent duplicate-key race', async () => {
      const jobs = makeJobs(5);
      const existingIds = new Set();

      const duplicateError =
        Object.assign(
          new Error(
            'E11000 duplicate key',
          ),
          {
            code: 11000,
            name:
              'MongoBulkWriteError',
            writeErrors: [
              {
                index: 2,
              },
            ],
            insertedDocs: [],
          },
        );

      const model = makeMockModel(
        existingIds,
        {
          nextInsertError:
            duplicateError,
          recoverIdsOnInsertError:
            true,
        },
      );

      const result =
        await bulkUpsertJobs(
          jobs,
          model,
          null,
        );

      assert.equal(result.length, 5);

      assert.equal(
        model._findCallCount(),
        2,
      );

      assert.equal(
        model._insertManyCallCount(),
        1,
      );
    });

    test('rethrows non-duplicate insertion errors', async () => {
      const jobs = makeJobs(3);

      const model = makeMockModel(
        new Set(),
        {
          nextInsertError:
            Object.assign(
              new Error(
                'network timeout',
              ),
              {
                code: 89,
              },
            ),
        },
      );

      await assert.rejects(
        () =>
          bulkUpsertJobs(
            jobs,
            model,
            null,
          ),
        {
          message:
            'network timeout',
        },
      );
    });
  },
);

describe(
  'bulkUpsertJobs - onNewJobs callback',
  () => {
    test('calls onNewJobs once with newly inserted documents', async () => {
      const jobs = makeJobs(5);
      const model = makeMockModel();

      let callCount = 0;
      let receivedDocs = null;

      await bulkUpsertJobs(
        jobs,
        model,
        async (documents) => {
          callCount += 1;
          receivedDocs = documents;
        },
      );

      assert.equal(callCount, 1);

      assert.equal(
        receivedDocs.length,
        5,
      );
    });

    test('does not call onNewJobs when all jobs already exist', async () => {
      const jobs = makeJobs(5);

      const existingIds = new Set(
        jobs.map(
          (job) => job.externalId,
        ),
      );

      const model =
        makeMockModel(existingIds);

      let callCount = 0;

      await bulkUpsertJobs(
        jobs,
        model,
        async () => {
          callCount += 1;
        },
      );

      assert.equal(callCount, 0);
    });

    test('passes only newly inserted documents to onNewJobs', async () => {
      const jobs = makeJobs(6);

      const existingIds = new Set(
        jobs
          .slice(0, 3)
          .map(
            (job) =>
              job.externalId,
          ),
      );

      const model =
        makeMockModel(existingIds);

      let newDocumentIds = [];

      await bulkUpsertJobs(
        jobs,
        model,
        async (documents) => {
          newDocumentIds =
            documents.map(
              (document) =>
                document.externalId,
            );
        },
      );

      assert.equal(
        newDocumentIds.length,
        3,
      );

      for (
        const storedExternalId
        of newDocumentIds
      ) {
        const rawExternalId =
          storedExternalId
            .split(':')
            .at(-1);

        assert.ok(
          rawExternalId.startsWith(
            'job-',
          ),
          `expected job provider ID, got ${storedExternalId}`,
        );

        const index =
          Number.parseInt(
            rawExternalId
              .split('-')[1],
            10,
          );

        assert.ok(
          index > 3,
          `only jobs 4-6 should be new, got ${storedExternalId}`,
        );
      }
    });
  },
);
