import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_CONCURRENCY = 5;
const MAX_REQUEST_RETRIES = 2;

const getGitHubHeaders = (token) => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  return headers;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseRetryAfter = (headers = {}, status) => {
  const retryAfter = headers['retry-after'] || headers['Retry-After'];

  if (retryAfter) {
    const parsed = Number.parseInt(retryAfter, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }

  if (status === 429) {
    return 5;
  }

  const reset = headers['x-ratelimit-reset'] || headers['X-RateLimit-Reset'];
  if (reset) {
    const resetTimestamp = Number.parseInt(reset, 10);
    if (!Number.isNaN(resetTimestamp)) {
      return Math.max(1, resetTimestamp - Math.floor(Date.now() / 1000));
    }
  }

  return null;
};

class RequestQueue {
  constructor(concurrency = DEFAULT_CONCURRENCY) {
    this.concurrency = concurrency;
    this.activeCount = 0;
    this.queue = [];
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.dequeue();
    });
  }

  dequeue() {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const { task, resolve, reject } = this.queue.shift();
    this.activeCount += 1;

    Promise.resolve()
      .then(task)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.activeCount -= 1;
        this.dequeue();
      });
  }
}

const requestQueue = new RequestQueue(DEFAULT_CONCURRENCY);

const executeRequestWithRetry = async (requestFn, attempt = 1) => {
  try {
    return await requestFn();
  } catch (error) {
    const response = error?.response;
    const retryAfterSeconds = parseRetryAfter(response?.headers, response?.status);

    if (attempt < MAX_REQUEST_RETRIES && retryAfterSeconds) {
      await delay(retryAfterSeconds * 1000);
      return executeRequestWithRetry(requestFn, attempt + 1);
    }

    throw error;
  }
};

const fetchGitHubResource = async (path, token, options = {}) => {
  const requestFn = async () => {
    const url = `${GITHUB_API_BASE}${path}`;
    const response = await axios.get(url, {
      headers: getGitHubHeaders(token),
      ...options
    });

    return {
      status: response.status,
      data: response.data,
      headers: response.headers
    };
  };

  return requestQueue.enqueue(() => executeRequestWithRetry(requestFn));
};

const groupRepoRequests = async (owner, repo, token) => {
  const repoPath = `/repos/${owner}/${repo}`;
  const languagesPath = `/repos/${owner}/${repo}/languages`;
  const readmePath = `/repos/${owner}/${repo}/readme`;

  const requests = [
    fetchGitHubResource(repoPath, token),
    fetchGitHubResource(languagesPath, token),
    fetchGitHubResource(readmePath, token, { headers: { Accept: 'application/vnd.github.v3.raw' } })
  ];

  const [repoResult, languagesResult, readmeResult] = await Promise.allSettled(requests);

  return {
    owner,
    repo,
    repoData: repoResult.status === 'fulfilled' ? repoResult.value.data : null,
    languages: languagesResult.status === 'fulfilled' ? languagesResult.value.data : null,
    readme: readmeResult.status === 'fulfilled' ? readmeResult.value.data : null,
    errors: [repoResult, languagesResult, readmeResult]
      .filter((result) => result.status === 'rejected')
      .map((result) => {
        const error = result.reason;
        return {
          message: error?.message || 'Unknown GitHub error',
          status: error?.response?.status,
          path: error?.config?.url
        };
      })
  };
};

const batchRepoScans = async (repos = [], token) => {
  const scans = repos.map(({ owner, repo }) => groupRepoRequests(owner, repo, token));
  const results = await Promise.allSettled(scans);

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    const { owner, repo } = repos[index] || {};
    return {
      owner,
      repo,
      repoData: null,
      languages: null,
      readme: null,
      errors: [{ message: result.reason?.message || 'Batch failure', status: result.reason?.response?.status, path: null }]
    };
  });
};

export default {
  fetchGitHubResource,
  groupRepoRequests,
  batchRepoScans
};
