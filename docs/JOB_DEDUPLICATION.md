\# Job Deduplication Engine



\## Overview



Career Pilot aggregates job listings from RapidAPI JSearch and registered local scrapers. Because different providers may return the same vacancy with different identifiers, formatting, URLs, or metadata, duplicate records can otherwise be stored and delivered in the same job alert.



The job deduplication engine removes exact and likely cross-source duplicates before the aggregated job batch is passed to the database upsert flow.



\## Location



The core service is implemented in:



```text

backend/src/services/jobDeduplicator.js

```



It is integrated into:



```text

backend/src/services/jobFetcher.js

```



The engine runs after all configured job sources have been collected and before `bulkUpsertJobs()` processes the resulting batch.



\## Public API



```js

import { deduplicateJobs } from './jobDeduplicator.js';



const { jobs, stats } = deduplicateJobs(fetchedJobs);

```



The function accepts an array of job records and returns:



```js

{

&#x20; jobs: \[],

&#x20; stats: {

&#x20;   inputCount: 0,

&#x20;   outputCount: 0,

&#x20;   duplicatesRemoved: 0,

&#x20;   exactMatches: 0,

&#x20;   fuzzyMatches: 0,

&#x20;   unmatchableCount: 0,

&#x20;   candidateComparisons: 0

&#x20; }

}

```



\## Configuration



Optional matching behavior can be configured:



```js

const result = deduplicateJobs(jobs, {

&#x20; titleSimilarityThreshold: 0.8,

&#x20; postedAtToleranceDays: 14

});

```



\### `titleSimilarityThreshold`



Controls the minimum token similarity required for guarded fuzzy title matching.



\* Default: `0.8`

\* Valid range: `0` to `1`

\* Invalid values fall back to the default



A conservative default is used because retaining an uncertain duplicate is safer than incorrectly merging two different vacancies.



\### `postedAtToleranceDays`



Controls the maximum posting-date difference allowed during content-based matching.



\* Default: `14`

\* Must be zero or greater

\* Invalid values fall back to the default



Exact source-ID and canonical-URL matches are considered strong identifiers and do not depend on fuzzy title matching.



\## Matching Stages



The engine applies matching strategies from strongest to weakest.



\### 1. Source-scoped external ID



A listing is matched by:



```text

normalized source + normalized external ID

```



External identifiers are scoped to their provider. Two providers may use the same ID for unrelated vacancies, so an external ID is not treated as globally unique.



\### 2. Canonical application URL



Application URLs are canonicalized before comparison.



Canonicalization includes:



\* Lowercasing the protocol and hostname

\* Removing a leading `www.`

\* Removing URL fragments

\* Removing duplicate and trailing path separators

\* Removing known tracking parameters

\* Sorting remaining query parameters

\* Preserving meaningful query parameters such as job identifiers



Malformed URLs and unsupported protocols are ignored without interrupting processing.



\### 3. Exact normalized content



Listings can be matched through normalized:



\* Job title

\* Company

\* Location

\* Employment type



Posting dates must also be compatible when both records provide valid dates.



\### 4. Guarded fuzzy matching



When exact identifiers are unavailable, the engine performs conservative cross-source matching using:



\* Normalized company names

\* Token-based title similarity

\* Compatible seniority

\* Compatible locations

\* Compatible employment types

\* Compatible posting dates



Candidate records are obtained through an inverted title-token index rather than comparing every job against every other job.



\## Normalization Rules



\### Titles



Job titles are normalized by:



\* Converting text to lowercase

\* Removing punctuation differences

\* Collapsing repeated whitespace

\* Expanding common aliases such as `Sr` to `Senior` and `Jr` to `Junior`



For example:



```text

Sr. Backend Engineer

Senior Backend Engineer

```



can be treated as equivalent.



\### Companies



Common legal suffixes are removed during comparison, including:



\* Private Limited

\* Pvt Ltd

\* Limited

\* Ltd

\* LLC

\* Incorporated

\* Inc

\* Corporation

\* Corp

\* Company

\* Co

\* PLC



For example:



```text

Example Systems Pvt Ltd

Example Systems Private Limited

```



normalize to the same company identity.



\### Locations



Remote-work variants such as the following are grouped:



```text

Remote

Work From Home

WFH

Home Based

```



Known non-remote locations must match. Vacancies in different cities are not merged solely because their titles and companies are similar.



\### Employment types



Common employment-type aliases are normalized, including:



```text

fulltime → full-time

parttime → part-time

intern → internship

contractor → contract

```



Known conflicting employment types are not merged.



\## False-Positive Protection



The engine deliberately prevents several unsafe matches.



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

Contract Software Engineer

Full-time Software Engineer

```



Common protected seniority and role indicators include:



\* Intern

\* Trainee

\* Junior

\* Associate

\* Senior

\* Lead

\* Staff

\* Principal

\* Architect

\* Manager

\* Director

\* Head



If one title contains protected role information that conflicts with another title, the records are kept separate.



\## Record Selection and Merging



When duplicate records are identified, the engine calculates a completeness score and prefers the richer record.



Useful fields include:



\* Application link

\* Full description

\* Description snippet

\* Salary

\* Posting date

\* Expiry date

\* Location

\* Employment type

\* Company logo

\* Skills

\* Source URL



Missing values are backfilled from the secondary record.



Array fields such as skills, benefits, tags, and requirements are merged without duplicate values while preserving first-seen order.



The original input objects and their arrays are not mutated.



The output position of the first occurrence is preserved, even when a later duplicate becomes the richer representative.



\## Error Handling



The service throws a `TypeError` when its top-level input is not an array:



```js

deduplicateJobs(null);

// TypeError: deduplicateJobs expects an array of job records

```



Within a valid input array:



\* Invalid primitive entries are skipped

\* Invalid entries are included in `unmatchableCount`

\* Incomplete but valid objects are preserved

\* Invalid URLs are ignored as URL identities

\* Invalid dates are treated as unavailable

\* Missing optional arrays are treated safely

\* Processing continues without losing valid records



\## Performance



The engine uses hash maps and an inverted candidate index for:



\* Source-scoped external IDs

\* Canonical URLs

\* Exact normalized content keys

\* Company and title-token candidates



It does not unconditionally compare every job with every other job.



Practical complexity is approximately:



```text

O(n + candidate comparisons)

```



where candidate comparisons are restricted to records sharing the same normalized company and relevant title tokens.



Execution statistics expose `candidateComparisons` so performance behavior can be tested without relying only on machine-dependent timing assertions.



\## Testing



Dedicated tests are located at:



```text

backend/src/services/\_\_tests\_\_/jobDeduplicator.test.js

```



The suite covers:



\* Non-array and empty input

\* Source-scoped external IDs

\* Canonical application URLs

\* Meaningful URL query parameters

\* Cross-source normalized matching

\* Conservative fuzzy matching

\* Remote-location normalization

\* Seniority conflicts

\* Internship and employment-type conflicts

\* Location conflicts

\* Old repostings

\* Rich-record selection

\* Array merging

\* Input immutability

\* Malformed records

\* Stable output ordering

\* Large-dataset candidate indexing



Run the focused suite:



```bash

node --test src/services/\_\_tests\_\_/jobDeduplicator.test.js

```



Run the configured backend test suite:



```bash

npm test

```



Run targeted lint validation:



```bash

npx eslint src/services/jobFetcher.js src/services/jobDeduplicator.js src/services/\_\_tests\_\_/jobDeduplicator.test.js

```



\## Integration Flow



The resulting job-alert pipeline is:



```text

RapidAPI results

&#x20;       +

Local scraper results

&#x20;       ↓

Job deduplication engine

&#x20;       ↓

Bulk database upsert

&#x20;       ↓

Job-alert notification delivery

```



Deduplication statistics are logged during processing, including the input count, unique output count, and number of removed duplicate records.
