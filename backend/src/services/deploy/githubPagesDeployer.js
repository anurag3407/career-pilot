const GITHUB_API = 'https://api.github.com';

// Topic used as a safety marker so deleteDeployment never touches non-portfolio repos.
const PORTFOLIO_TOPIC = 'career-pilot-portfolio';

const MAX_REPO_NAME_LENGTH = 100;

// GitHub names allow alphanumeric, hyphens, underscores, and dots.
// Must start with alphanumeric to prevent hidden-file-style path segments.
function assertSafeSegment(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(value)) {
    throw new Error(
      `${label} contains invalid characters or starts with a non-alphanumeric character. ` +
      `Use only letters, numbers, hyphens, underscores, and dots.`
    );
  }
}

function githubHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

async function githubRequest(method, path, body, token) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: githubHeaders(token),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content (e.g. DELETE, some PATCHes)
  if (res.status === 204) return null;

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} on ${method} ${path}: ${data.message || text}`);
  }

  return data;
}

function toRepoSlug(raw) {
  return (
    raw
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, MAX_REPO_NAME_LENGTH) || 'portfolio'
  );
}

/**
 * Deploy an HTML portfolio to GitHub Pages using the Git Tree API.
 * All files are committed in a single batch — no per-file API calls.
 *
 * @param {string} portfolioId  - Stable identifier used to name/find the deployment repo
 * @param {string} htmlContent  - Full HTML string for index.html
 * @param {Object} assets       - Map of relative path → string/Buffer content, e.g. { 'style.css': '...' }
 * @param {string} [repoName]   - Desired repo name slug (auto-generated if omitted)
 * @param {string} token        - GitHub OAuth token (user must supply their own — never stored)
 * @returns {Promise<{ url: string, owner: string, repo: string, commitSha: string }>}
 */
export async function deploy(portfolioId, htmlContent, assets = {}, repoName, token) {
  if (!token) throw new Error('A GitHub OAuth token is required.');
  assertSafeSegment(portfolioId, 'portfolioId');

  // Resolve the authenticated user's login — token is used only for GitHub API calls.
  const user = await githubRequest('GET', '/user', undefined, token);
  if (!user?.login) {
    throw new Error('Could not resolve GitHub username from the provided token.');
  }
  const owner = user.login;

  const slug = repoName
    ? toRepoSlug(repoName)
    : toRepoSlug(`portfolio-${portfolioId}`);

  // Determine whether the portfolio repo already exists
  let repoExists = false;
  try {
    await githubRequest('GET', `/repos/${owner}/${slug}`, undefined, token);
    repoExists = true;
  } catch (err) {
    if (!err.message.includes('404')) throw err;
  }

  if (!repoExists) {
    await githubRequest('POST', '/user/repos', {
      name: slug,
      description: 'Portfolio deployed via Career Pilot',
      private: false,
      auto_init: false, // We create the first commit ourselves via the Tree API
    }, token);

    // GitHub's create-repo endpoint does not accept topics — set them separately.
    // This topic is the safety guard that allows deleteDeployment to identify our repos.
    try {
      await githubRequest('PUT', `/repos/${owner}/${slug}/topics`, {
        names: [PORTFOLIO_TOPIC],
      }, token);
    } catch {
      console.warn(
        `[githubPagesDeployer] Could not tag ${owner}/${slug} with topic "${PORTFOLIO_TOPIC}". ` +
        `deleteDeployment will refuse to remove this repo until the topic is set manually.`
      );
    }
  }

  // Build normalised file map — Git tree paths must NOT start with /
  const fileMap = {
    'index.html': Buffer.isBuffer(htmlContent) ? htmlContent : Buffer.from(htmlContent, 'utf8'),
  };
  for (const [path, content] of Object.entries(assets)) {
    const normalised = path.startsWith('/') ? path.slice(1) : path;
    fileMap[normalised] = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  }

  // Create all blobs in parallel; base64 encoding handles both text and binary files.
  const treeEntries = await Promise.all(
    Object.entries(fileMap).map(async ([filePath, buf]) => {
      const blob = await githubRequest(
        'POST',
        `/repos/${owner}/${slug}/git/blobs`,
        { content: buf.toString('base64'), encoding: 'base64' },
        token
      );
      return { path: filePath, sha: blob.sha, mode: '100644', type: 'blob' };
    })
  );

  // Resolve the current HEAD so we can build on top of existing history
  let baseTreeSha;
  let parentShas = [];

  if (repoExists) {
    try {
      const ref = await githubRequest(
        'GET',
        `/repos/${owner}/${slug}/git/ref/heads/main`,
        undefined,
        token
      );
      const parentCommit = await githubRequest(
        'GET',
        `/repos/${owner}/${slug}/git/commits/${ref.object.sha}`,
        undefined,
        token
      );
      parentShas = [ref.object.sha];
      baseTreeSha = parentCommit.tree.sha;
    } catch {
      // Repo exists but main branch has no commits yet (edge case: interrupted prior deploy)
    }
  }

  // Single-batch tree commit
  const tree = await githubRequest(
    'POST',
    `/repos/${owner}/${slug}/git/trees`,
    {
      tree: treeEntries,
      ...(baseTreeSha && { base_tree: baseTreeSha }),
    },
    token
  );

  const commit = await githubRequest(
    'POST',
    `/repos/${owner}/${slug}/git/commits`,
    {
      message: 'Deploy portfolio via Career Pilot',
      tree: tree.sha,
      ...(parentShas.length > 0 && { parents: parentShas }),
    },
    token
  );

  if (parentShas.length === 0) {
    // New repo: main branch ref doesn't exist yet — create it
    await githubRequest('POST', `/repos/${owner}/${slug}/git/refs`, {
      ref: 'refs/heads/main',
      sha: commit.sha,
    }, token);
  } else {
    // force: true so the branch always reflects the latest deployed state
    await githubRequest('PATCH', `/repos/${owner}/${slug}/git/refs/heads/main`, {
      sha: commit.sha,
      force: true,
    }, token);
  }

  // Enable Pages (409 = already enabled — not an error)
  await enablePages(owner, slug, token);

  // Standard Pages URL; the special <owner>.github.io repo has no subpath.
  const pagesUrl =
    slug === `${owner}.github.io`
      ? `https://${owner}.github.io`
      : `https://${owner}.github.io/${slug}`;

  return { url: pagesUrl, owner, repo: slug, commitSha: commit.sha };
}

async function enablePages(owner, repo, token) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pages`, {
    method: 'POST',
    headers: githubHeaders(token),
    body: JSON.stringify({ source: { branch: 'main', path: '/' } }),
  });

  // 201 = created, 409 = already enabled — both are acceptable outcomes
  if (res.status === 201 || res.status === 204 || res.status === 409) return;

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { message: text }; }
  throw new Error(`Failed to enable GitHub Pages ${res.status}: ${data.message || text}`);
}

/**
 * Get the GitHub Pages deployment status for a repository.
 *
 * @param {string} owner - GitHub username or organisation
 * @param {string} repo  - Repository name
 * @param {string} token - GitHub OAuth token
 * @returns {Promise<{ status: string, url: string|null, custom_domain: string|null }>}
 */
export async function getDeploymentStatus(owner, repo, token) {
  assertSafeSegment(owner, 'owner');
  assertSafeSegment(repo, 'repo');
  if (!token) throw new Error('A GitHub OAuth token is required.');

  const pages = await githubRequest('GET', `/repos/${owner}/${repo}/pages`, undefined, token);

  return {
    status: pages.status ?? 'unknown',
    url: pages.html_url ?? null,
    custom_domain: pages.custom_domain ?? null,
  };
}

/**
 * Delete a portfolio repository.
 *
 * Safety: only deletes repos tagged with the "career-pilot-portfolio" topic —
 * prevents accidental deletion of any repo the user didn't create through this service.
 *
 * @param {string} owner - GitHub username or organisation
 * @param {string} repo  - Repository name
 * @param {string} token - GitHub OAuth token
 * @returns {Promise<void>}
 */
export async function deleteDeployment(owner, repo, token) {
  assertSafeSegment(owner, 'owner');
  assertSafeSegment(repo, 'repo');
  if (!token) throw new Error('A GitHub OAuth token is required.');

  const repoData = await githubRequest('GET', `/repos/${owner}/${repo}`, undefined, token);
  const topics = repoData.topics ?? [];

  if (!topics.includes(PORTFOLIO_TOPIC)) {
    throw new Error(
      `Repository "${owner}/${repo}" is not tagged as a Career Pilot portfolio and will not be deleted. ` +
      `Only repositories with the topic "${PORTFOLIO_TOPIC}" can be removed via this service.`
    );
  }

  await githubRequest('DELETE', `/repos/${owner}/${repo}`, undefined, token);
}
