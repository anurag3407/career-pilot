# Job Deduplication Engine

## Overview

Career Pilot aggregates job listings from RapidAPI JSearch and registered local scrapers. Different providers may return the same vacancy with different identifiers, formatting, URLs, or metadata, which can otherwise result in duplicate storage and repeated job-alert delivery.

The job deduplication engine removes exact and likely cross-source duplicates before the aggregated job batch is passed to the database upsert and notification flow.

## Location

The core service is implemented in:

```text
backend/src/services/jobDeduplicator.js
```

It is integrated into:

```text
backend/src/services/jobFetcher.js
```

Dedicated deduplication tests are located in:

```text
backend/src/services/__tests__/jobDeduplicator.test.js
```

Bulk persistence and performance regression tests are located in:

```text
backend/src/__tests__/jobFetcher.perf.test.js
```

The engine runs after all configured job sources have been collected and before `bulkUpsertJobs()` processes the resulting batch.

## Public API

```js
import { deduplicateJobs } from './jobDeduplicator.js';

const { jobs, stats } = deduplicateJobs(fetchedJobs);
```

The function accepts an array of job records and returns:

```js
{
  jobs: [],
  stats: {
    inputCount: 0,
    outputCount: 0,
    duplicatesRemoved: 0,
    exactMatches: 0,
    fuzzyMatches: 0,
    unmatchableCount: 0,
    candidateComparisons: 0,
  },
}
```

## Configuration

Optional matching behavior can be configured:

```js
const result = deduplicateJobs(jobs, {
  titleSimilarityThreshold: 0.8,
  postedAtToleranceDays: 14,
});
```

### `titleSimilarityThreshold`

Controls the minimum token similarity required for guarded fuzzy title matching.

* Default: `0.8`
* Valid range: `0` to `1`
* Invalid values fall back to the default

A conservative default is used because retaining an uncertain duplicate is safer than incorrectly merging two different vacancies.

### `postedAtToleranceDays`

Controls the maximum posting-date difference allowed during content-based matching.

* Default: `14`
* Must be zero or greater
* Invalid values fall back to the default

Exact source-ID and canonical-URL matches are considered strong identifiers and do not depend on fuzzy title matching.

## Matching Stages

The engine applies matching strategies from strongest to weakest.

### 1. Source-scoped external ID

A listing is matched using:

```text
normalized source + provider external ID
```

Provider external IDs are trimmed but otherwise preserved. Punctuation is not removed because values such as the following may identify different records:

```text
job/123
job.123
job-123
```

External identifiers are scoped to their provider because two providers may reuse the same raw ID for unrelated vacancies.

### Persistence identity

The `JobListing` model uses a globally unique `externalId` field. New database records therefore use a source-scoped storage identity:

```text
normalized-source:provider-external-id
```

For example:

```text
rapidapi-jsearch:shared-id
linkedin:shared-id
```

The original provider external ID remains unchanged in job objects returned to the alert and notification flow.

Existing legacy records that store only the raw provider external ID are reused when both their source and raw external ID match.

### 2. Canonical application URL

Application URLs are canonicalized before comparison.

Canonicalization includes:

* Lowercasing the protocol and hostname
* Removing a leading `www.`
* Removing URL fragments
* Removing duplicate and trailing path separators
* Removing known tracking parameters
* Sorting remaining query parameters
* Preserving meaningful query parameters such as job identifiers

The service examines the available URL fields in order:

```text
applyLink
applicationUrl
jobUrl
sourceUrl
```

Each field is validated independently. A placeholder or malformed earlier field does not prevent the engine from using a valid fallback URL.

Malformed URLs and unsupported protocols are ignored without interrupting processing.

### 3. Exact normalized content

Listings can be matched through normalized:

* Job title
* Company
* Location
* Employment type

Posting dates must also be compatible when both records provide valid dates.

### 4. Guarded fuzzy matching

When exact identifiers are unavailable, the engine performs conservative cross-source matching using:

* Normalized company names
* Token-based title similarity
* Compatible seniority
* Compatible locations
* Compatible employment types
* Compatible posting dates

Candidate records are obtained through an inverted company-and-title-token index rather than comparing every job against every other job.

High-frequency fuzzy buckets and final candidate lists are bounded to prevent generic titles from producing uncontrolled comparison growth. Exact source-ID, URL, and composite-key matching remain unrestricted.

## Normalization Rules

### Titles

Job titles are normalized by:

* Converting text to lowercase
* Removing punctuation differences
* Collapsing repeated whitespace
* Expanding common aliases such as `Sr` to `Senior` and `Jr` to `Junior`

For example:

```text
Sr. Backend Engineer
Senior Backend Engineer
```

can be treated as equivalent.

### Companies

Common legal suffixes are removed during comparison, including:

* Private Limited
* Pvt Ltd
* Limited
* Ltd
* LLC
* Incorporated
* Inc
* Corporation
* Corp
* Company
* Co
* PLC

For example:

```text
Example Systems Pvt Ltd
Example Systems Private Limited
```

normalize to the same company identity.

### Locations

Common remote-work labels are normalized, including:

```text
Remote
Work From Home
WFH
Home Based
```

Jurisdiction qualifiers are preserved.

For example:

```text
Remote - US
Remote Canada
```

normalize to distinct remote locations and are not merged solely because both jobs are remote.

Known non-remote locations must match. Vacancies in different cities are not merged solely because their titles and companies are similar.

### Employment types

Common employment-type aliases are normalized, including:

```text
fulltime → full-time
parttime → part-time
intern → internship
contractor → contract
```

Known conflicting employment types are not merged.

## False-Positive Protection

The engine deliberately prevents unsafe matches.

Examples kept separate include:

```text
Junior Software Engineer
Senior Software Engineer
```

```text
Software Engineer Intern
Software Engineer
```

```text
Software Engineer — Jaipur
Software Engineer — Bengaluru
```

```text
Software Engineer — Remote US
Software Engineer — Remote Canada
```

```text
Contract Software Engineer
Full-time Software Engineer
```

Protected seniority and role indicators include:

* Intern
* Trainee
* Junior
* Associate
* Senior
* Lead
* Staff
* Principal
* Architect
* Manager
* Director
* Head

If one title contains protected role information that conflicts with another title, the records are kept separate.

## Record Selection and Merging

When duplicate records are identified, the engine calculates a completeness score and prefers the richer record.

Useful fields include:

* Application link
* Full description
* Description snippet
* Salary
* Posting date
* Expiry date
* Location
* Employment type
* Company logo
* Skills
* Source URL

Missing values are backfilled from the secondary record.

Array fields such as skills, benefits, tags, and requirements are merged without duplicate values while preserving first-seen order.

Array identity generation safely handles:

* Strings
* Primitive values
* `BigInt` values
* Objects
* Circular object references
* Values that cannot be serialized with `JSON.stringify()`

The original input objects and their arrays are not mutated.

The output position of the first occurrence is preserved, even when a later duplicate becomes the richer representative.

## Bulk Persistence

Before database insertion, each new job receives a source-scoped storage identity.

The bulk-upsert flow:

1. Limits each processed batch to the configured maximum.
2. Queries both source-scoped IDs and legacy raw IDs.
3. Reuses matching legacy records when the source and raw provider ID match.
4. Inserts new records with source-scoped storage IDs.
5. Preserves original provider IDs in returned alert jobs.
6. Handles concurrent duplicate-key races.
7. Re-queries unresolved records after duplicate-key errors.
8. Invokes the new-job callback only for successfully inserted documents.
9. Skips records without usable external IDs.

This prevents providers that reuse the same raw external ID from colliding with each other in MongoDB.

## Error Handling

The service throws a `TypeError` when its top-level input is not an array:

```js
deduplicateJobs(null);
// TypeError: deduplicateJobs expects an array of job records
```

Within a valid input array:

* Invalid primitive entries are skipped
* Invalid entries are included in `unmatchableCount`
* Incomplete but valid objects are preserved
* Invalid URLs are ignored as URL identities
* Valid fallback URL fields are still considered
* Invalid dates are treated as unavailable
* Missing optional arrays are handled safely
* Circular and non-serializable array values do not crash merging
* Invalid configuration values fall back to defaults
* Processing continues without losing valid records

## Performance

The engine uses hash maps and inverted indexes for:

* Source-scoped external IDs
* Canonical URLs
* Exact normalized content keys
* Company and title-token candidates

It does not unconditionally compare every job with every other job.

Practical complexity is approximately:

```text
O(n + bounded candidate comparisons)
```

Candidate comparisons are restricted to records sharing the same normalized company and relevant title tokens.

Frequently occurring fuzzy buckets and final candidate sets are capped, preventing generic titles from producing unbounded comparison growth.

Execution statistics expose `candidateComparisons` so performance behavior can be tested without relying only on machine-dependent timing assertions.

## Testing

Run all commands in this section from the `backend` directory:

```bash
cd backend
```

### Dedicated deduplication suite

```bash
node --test src/services/__tests__/jobDeduplicator.test.js
```

The suite covers:

* Non-array and empty input
* Source-scoped external IDs
* Provider-ID punctuation preservation
* Canonical application URLs
* Fallback across available URL fields
* Meaningful URL query parameters
* Cross-source normalized matching
* Conservative fuzzy matching
* Remote-location normalization
* Remote jurisdiction preservation
* Seniority conflicts
* Internship and employment-type conflicts
* Location conflicts
* Old repostings
* Rich-record selection
* Array merging
* Circular object handling
* `BigInt` handling
* Input immutability
* Malformed records
* Stable output ordering
* Large-dataset candidate indexing
* Bounded fuzzy comparisons for generic titles

### Bulk-upsert regression suite

```bash
node --test src/__tests__/jobFetcher.perf.test.js
```

The suite covers:

* Bounded database query counts
* Batch-size limits
* Source-scoped MongoDB identities
* Cross-provider raw-ID collisions
* Legacy raw-ID reuse
* Original provider-field preservation
* Missing external-ID handling
* Concurrent duplicate-key recovery
* Non-duplicate database errors
* New-job callback behavior

### Complete configured backend suite

```bash
npm test
```

### Targeted lint validation

```bash
npx eslint \
  src/services/jobFetcher.js \
  src/services/jobDeduplicator.js \
  src/services/__tests__/jobDeduplicator.test.js \
  src/__tests__/jobFetcher.perf.test.js
```

On Windows PowerShell, the repository-local executable may also be used:

```powershell
.\node_modules\.bin\eslint.cmd `
  src\services\jobFetcher.js `
  src\services\jobDeduplicator.js `
  src\services\__tests__\jobDeduplicator.test.js `
  src\__tests__\jobFetcher.perf.test.js
```

## Integration Flow

The resulting job-alert pipeline is:

```text
RapidAPI results
        +
Local scraper results
        ↓
Job deduplication engine
        ↓
Source-scoped bulk database upsert
        ↓
Job-alert notification delivery
```

Deduplication statistics are logged during processing, including:

* Input count
* Unique output count
* Exact matches
* Fuzzy matches
* Removed duplicate count
* Candidate comparison count