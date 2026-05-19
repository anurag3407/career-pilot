import crypto from 'crypto';

const NETLIFY_API = 'https://api.netlify.com/api/v1';

// Netlify enforces a 63-character limit on site name slugs (DNS label rules).
const MAX_SITE_NAME_LENGTH = 63;

function getToken(token) {
  const resolved = token || process.env.NETLIFY_ACCESS_TOKEN;
  if (!resolved) {
    throw new Error(
      'A Netlify access token is required. Pass it as a parameter or set NETLIFY_ACCESS_TOKEN in your environment.'
    );
  }
  return resolved;
}

function assertSafeId(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  // Only allow alphanumeric, hyphens, and underscores — prevents path traversal in URL segments.
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
    throw new Error(`${label} contains invalid characters. Use only letters, numbers, hyphens, and underscores.`);
  }
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function netlifyRequest(method, path, body, token) {
  const res = await fetch(`${NETLIFY_API}${path}`, {
    method,
    headers: authHeaders(token),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    throw new Error(`Netlify API error ${res.status}: ${data.message || text}`);
  }

  return data;
}

function sha1(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

function toSiteNameSlug(raw) {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .slice(0, MAX_SITE_NAME_LENGTH);
}

/**
 * Deploy an HTML portfolio to Netlify using the file-digest method.
 *
 * @param {string} portfolioId  - Stable identifier used to find an existing site
 * @param {string} htmlContent  - Full HTML string for index.html
 * @param {Object} assets       - Map of relative path → string/Buffer content, e.g. { 'style.css': '...' }
 * @param {string} [siteName]   - Desired Netlify subdomain (auto-generated if omitted)
 * @param {string} [token]      - Netlify personal access token (falls back to NETLIFY_ACCESS_TOKEN)
 * @returns {Promise<{ url: string, siteId: string, deployId: string }>}
 */
export async function deploy(portfolioId, htmlContent, assets = {}, siteName, token) {
  assertSafeId(portfolioId, 'portfolioId');
  const resolvedToken = getToken(token);

  // Build file map: path → Buffer
  const files = {
    '/index.html': Buffer.isBuffer(htmlContent) ? htmlContent : Buffer.from(htmlContent, 'utf8'),
  };
  for (const [path, content] of Object.entries(assets)) {
    const normalised = path.startsWith('/') ? path : `/${path}`;
    files[normalised] = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  }

  // Compute SHA1 digest for every file
  const digestMap = {};
  for (const [path, buf] of Object.entries(files)) {
    digestMap[path] = sha1(buf);
  }

  // Find or create the Netlify site for this portfolioId
  let siteId;
  const allSites = await netlifyRequest('GET', '/sites?per_page=100', undefined, resolvedToken);

  if (!Array.isArray(allSites)) {
    throw new Error('Unexpected response from Netlify when listing sites. Check your access token and try again.');
  }

  const prefix = `career-pilot-${portfolioId}`;
  const existing = allSites.find((s) => s.name && s.name.startsWith(prefix));

  if (existing) {
    siteId = existing.id;
  } else {
    const nameSlug = siteName
      ? toSiteNameSlug(siteName)
      : toSiteNameSlug(`career-pilot-${portfolioId}`);

    const newSite = await netlifyRequest('POST', '/sites', { name: nameSlug }, resolvedToken);
    siteId = newSite.id;
  }

  // Create a deploy with file digests; Netlify responds with which files are missing
  const deployResult = await netlifyRequest(
    'POST',
    `/sites/${siteId}/deploys`,
    { files: digestMap },
    resolvedToken
  );
  const deployId = deployResult.id;

  // Build a reverse map: hash → filePath for O(1) lookup during upload
  const hashToPath = {};
  for (const [path, hash] of Object.entries(digestMap)) {
    hashToPath[hash] = path;
  }

  // Upload all missing files in parallel
  const required = deployResult.required || [];
  await Promise.all(
    required.map(async (hash) => {
      const filePath = hashToPath[hash];
      if (!filePath) return;

      const fileBuffer = files[filePath];
      const uploadRes = await fetch(`${NETLIFY_API}/deploys/${deployId}/files${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${resolvedToken}`,
          'Content-Type': 'application/octet-stream',
        },
        body: fileBuffer,
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Failed to upload ${filePath}: ${errText}`);
      }
    })
  );

  const url = await waitForDeploy(deployId, resolvedToken);

  return { url, siteId, deployId };
}

async function waitForDeploy(deployId, token, maxWaitMs = 60_000, intervalMs = 3_000) {
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const status = await netlifyRequest('GET', `/deploys/${deployId}`, undefined, token);

    if (status.state === 'ready') {
      // ssl_url and url both include the protocol; prefer HTTPS.
      const rawUrl = status.ssl_url || status.url;
      if (!rawUrl) {
        throw new Error(`Deploy ${deployId} is ready but no URL was returned by Netlify.`);
      }
      return rawUrl.startsWith('https://') ? rawUrl : `https://${rawUrl.replace(/^https?:\/\//, '')}`;
    }

    if (status.state === 'error') {
      throw new Error(`Deploy ${deployId} failed: ${status.error_message || 'unknown error'}`);
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Deploy ${deployId} did not become ready within ${maxWaitMs / 1000}s`);
}

/**
 * Get the current deployment status for a Netlify site.
 *
 * @param {string} siteId  - Netlify site ID
 * @param {string} [token] - Netlify personal access token (falls back to NETLIFY_ACCESS_TOKEN)
 * @returns {Promise<{ state: string, url: string|null, sslUrl: string|null, publishedAt: string|null }>}
 */
export async function getDeploymentStatus(siteId, token) {
  assertSafeId(siteId, 'siteId');
  const resolvedToken = getToken(token);
  const site = await netlifyRequest('GET', `/sites/${siteId}`, undefined, resolvedToken);

  return {
    state: site.published_deploy?.state ?? 'unknown',
    url: site.url ?? null,
    sslUrl: site.ssl_url ?? null,
    publishedAt: site.published_deploy?.published_at ?? null,
  };
}
