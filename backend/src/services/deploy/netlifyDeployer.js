import crypto from 'crypto';

const NETLIFY_API = 'https://api.netlify.com/api/v1';

function getToken(token) {
  const resolved = token || process.env.NETLIFY_ACCESS_TOKEN;
  if (!resolved) {
    throw new Error('A Netlify access token is required. Pass it as a parameter or set NETLIFY_ACCESS_TOKEN in your environment.');
  }
  return resolved;
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
  const existing = allSites.find((s) => s.name && s.name.startsWith(`career-pilot-${portfolioId}`));

  if (existing) {
    siteId = existing.id;
  } else {
    const nameSlug = siteName
      ? siteName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : `career-pilot-${portfolioId.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;

    const newSite = await netlifyRequest('POST', '/sites', { name: nameSlug }, resolvedToken);
    siteId = newSite.id;
  }

  // Create a deploy with file digests; Netlify responds with which files are missing
  const deployPayload = { files: digestMap, async: false };
  const deployResult = await netlifyRequest('POST', `/sites/${siteId}/deploys`, deployPayload, resolvedToken);
  const deployId = deployResult.id;

  // Upload only the files Netlify says are missing
  const required = deployResult.required || [];
  for (const hash of required) {
    const entry = Object.entries(digestMap).find(([, h]) => h === hash);
    if (!entry) continue;

    const [filePath, fileHash] = entry;
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
      throw new Error(`Failed to upload ${filePath} (${fileHash}): ${errText}`);
    }
  }

  // Poll until the deploy is ready (max 60 s)
  const url = await waitForDeploy(deployId, resolvedToken);

  return { url, siteId, deployId };
}

async function waitForDeploy(deployId, token, maxWaitMs = 60_000, intervalMs = 3_000) {
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const status = await netlifyRequest('GET', `/deploys/${deployId}`, undefined, token);

    if (status.state === 'ready') {
      return `https://${status.ssl_url ? status.ssl_url.replace(/^https?:\/\//, '') : status.url.replace(/^https?:\/\//, '')}`;
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
 * @returns {Promise<{ state: string, url: string, sslUrl: string, publishedAt: string|null }>}
 */
export async function getDeploymentStatus(siteId, token) {
  const resolvedToken = getToken(token);
  const site = await netlifyRequest('GET', `/sites/${siteId}`, undefined, resolvedToken);

  return {
    state: site.published_deploy?.state ?? 'unknown',
    url: site.url ?? null,
    sslUrl: site.ssl_url ?? null,
    publishedAt: site.published_deploy?.published_at ?? null,
  };
}
