import crypto from 'crypto';

const CF_API = 'https://api.cloudflare.com/client/v4';

// Cloudflare Pages project names: lowercase, hyphens only, max 28 chars (DNS label limit).
const MAX_PROJECT_NAME_LENGTH = 28;

function getCredentials() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!token || !accountId) {
    throw new Error(
      'CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID must be set in environment variables.'
    );
  }
  return { token, accountId };
}

// Allows alphanumeric, hyphens, and underscores — used for portfolioId and deploymentId.
function assertSafeId(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
    throw new Error(
      `${label} contains invalid characters. Use only letters, numbers, hyphens, and underscores.`
    );
  }
}

// Project names are derived slugs — stricter (no underscores, lowercase only).
// Cloudflare rejects names that start or end with a hyphen, so the regex enforces that too.
function assertSafeProjectName(value, label) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(value)) {
    throw new Error(
      `${label} must be lowercase, start and end with alphanumeric, and contain only letters, numbers, and hyphens.`
    );
  }
}

async function cfRequest(method, path, body, token) {
  const isForm = body instanceof FormData;
  const res = await fetch(`${CF_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(!isForm && body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  // Some DELETE endpoints return 204 with no body
  if (res.status === 204) return null;

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { success: false, errors: [{ message: text }] };
  }

  // Cloudflare API v4: always check the `success` flag, not just HTTP status
  if (!res.ok || !data.success) {
    const errMsg = Array.isArray(data.errors) && data.errors.length
      ? data.errors.map((e) => `[${e.code ?? '?'}] ${e.message}`).join('; ')
      : text;
    throw new Error(`Cloudflare API ${res.status} on ${method} ${path}: ${errMsg}`);
  }

  return data.result;
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function toProjectName(raw) {
  return (
    raw
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, MAX_PROJECT_NAME_LENGTH) || 'portfolio'
  );
}

/**
 * Sanitizes HTML before deployment to remove XSS vectors.
 *
 * Strips: <script> blocks, dangerous embedding tags (iframe/object/embed/applet/frame),
 * event-handler attributes (on*), javascript:/vbscript: URL schemes, and meta-refresh.
 *
 * NOTE: Regex sanitization cannot catch all edge cases. For untrusted third-party HTML,
 * pair this with a DOM-based sanitizer (e.g. DOMPurify via jsdom) in a separate step.
 */
function sanitizeHtml(html) {
  return html
    // Strip <script> blocks and any inline content between them
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*?\/?>/gi, '')
    // Strip dangerous embedding elements and their content
    .replace(/<(iframe|object|embed|applet|frame|frameset)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|applet|frame|frameset)[^>]*\/?>/gi, '')
    // Strip event-handler attributes (onclick, onload, onerror, etc.)
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Strip javascript:, vbscript:, and data: URL schemes from attributes
    .replace(/(\b(?:href|src|action|data)\s*=\s*["'])\s*(?:javascript|vbscript|data):[^"']*/gi, '$1')
    // Strip meta http-equiv refresh (open redirect)
    .replace(/<meta[^>]+http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi, '');
}

/**
 * Deploy an HTML portfolio to Cloudflare Pages via the Direct Upload API.
 * HTML is sanitized server-side before upload.
 *
 * @param {string} portfolioId  - Stable identifier used to name/find the Pages project
 * @param {string} htmlContent  - Full HTML string for index.html
 * @param {Object} assets       - Map of relative path → string/Buffer content, e.g. { 'style.css': '...' }
 * @returns {Promise<{ deploymentId: string, url: string, projectName: string }>}
 */
export async function deploy(portfolioId, htmlContent, assets = {}) {
  assertSafeId(portfolioId, 'portfolioId');
  const { token, accountId } = getCredentials();

  const projectName = toProjectName(`cp-${portfolioId}`);

  // Create the Pages project if it doesn't exist yet
  let projectExists = false;
  try {
    await cfRequest('GET', `/accounts/${accountId}/pages/projects/${projectName}`, undefined, token);
    projectExists = true;
  } catch (err) {
    if (!err.message.includes('404') && !err.message.includes('8000007')) throw err;
  }

  if (!projectExists) {
    await cfRequest('POST', `/accounts/${accountId}/pages/projects`, {
      name: projectName,
      production_branch: 'main',
    }, token);
  }

  // Sanitize HTML before upload — credentials stay server-side
  const sanitizedHtml = sanitizeHtml(
    Buffer.isBuffer(htmlContent) ? htmlContent.toString('utf8') : htmlContent
  );

  // Build file map: normalised path (no leading /) → Buffer
  const fileMap = {
    'index.html': Buffer.from(sanitizedHtml, 'utf8'),
  };
  for (const [path, content] of Object.entries(assets)) {
    const normalised = path.startsWith('/') ? path.slice(1) : path;
    fileMap[normalised] = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  }

  // Manifest: "/path" → SHA-256 hex (Cloudflare Pages Direct Upload format)
  const manifest = {};
  for (const [path, buf] of Object.entries(fileMap)) {
    manifest[`/${path}`] = sha256(buf);
  }

  // Build multipart form — manifest field + one entry per file
  const form = new FormData();
  form.append('manifest', JSON.stringify(manifest));
  for (const [path, buf] of Object.entries(fileMap)) {
    form.append(path, new Blob([buf]), path);
  }

  const deployment = await cfRequest(
    'POST',
    `/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    form,
    token
  );

  return {
    deploymentId: deployment.id,
    url: deployment.url ?? `https://${projectName}.pages.dev`,
    projectName,
  };
}

/**
 * Get the status of a specific Cloudflare Pages deployment.
 *
 * @param {string} projectName  - Cloudflare Pages project name (returned by deploy())
 * @param {string} deploymentId - Deployment ID (returned by deploy())
 * @returns {Promise<{ state: string, url: string|null, createdOn: string|null }>}
 */
export async function getDeploymentStatus(projectName, deploymentId) {
  assertSafeProjectName(projectName, 'projectName');
  assertSafeId(deploymentId, 'deploymentId');
  const { token, accountId } = getCredentials();

  const deployment = await cfRequest(
    'GET',
    `/accounts/${accountId}/pages/projects/${projectName}/deployments/${deploymentId}`,
    undefined,
    token
  );

  return {
    state: deployment.latest_stage?.status ?? 'unknown',
    url: deployment.url ?? null,
    createdOn: deployment.created_on ?? null,
  };
}

/**
 * Delete a Cloudflare Pages project and all its deployments.
 *
 * @param {string} projectName - Cloudflare Pages project name (returned by deploy())
 * @returns {Promise<void>}
 */
export async function deleteDeployment(projectName) {
  assertSafeProjectName(projectName, 'projectName');
  const { token, accountId } = getCredentials();

  await cfRequest(
    'DELETE',
    `/accounts/${accountId}/pages/projects/${projectName}`,
    undefined,
    token
  );
}

/**
 * Verify and parse an incoming Cloudflare Pages deployment webhook notification.
 * Validates the HMAC-SHA256 signature before processing — rejects tampered requests.
 *
 * Requires CLOUDFLARE_WEBHOOK_SECRET to be set in environment variables.
 *
 * @param {string|Buffer} rawBody        - Raw (unparsed) request body
 * @param {string}        signatureHeader - Value of the CF-Webhook-Signature header
 * @returns {{ deploymentId: string|null, projectName: string|null, state: string, url: string|null }}
 */
export function handleDeploymentWebhook(rawBody, signatureHeader) {
  const secret = process.env.CLOUDFLARE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      'CLOUDFLARE_WEBHOOK_SECRET must be set in environment variables to verify webhook signatures.'
    );
  }

  if (!signatureHeader || typeof signatureHeader !== 'string') {
    throw new Error(
      'Webhook signature verification failed. CF-Webhook-Signature header is missing or invalid.'
    );
  }

  const body = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody);
  const expectedBuf = Buffer.from(
    crypto.createHmac('sha256', secret).update(body).digest('hex'),
    'hex'
  );

  // Strip optional "sha256=" prefix, then decode from hex
  const providedHex = signatureHeader.replace(/^sha256=/i, '');
  const providedBuf = Buffer.from(providedHex, 'hex');

  // timingSafeEqual throws if buffers are different lengths — check first
  if (providedBuf.length !== expectedBuf.length || providedBuf.length === 0) {
    throw new Error('Webhook signature verification failed. Invalid or missing signature.');
  }

  if (!crypto.timingSafeEqual(expectedBuf, providedBuf)) {
    throw new Error('Webhook signature verification failed. Request may have been tampered with.');
  }

  const event = JSON.parse(body.toString('utf8'));

  return {
    deploymentId: event.deployment?.id ?? null,
    projectName: event.project?.name ?? null,
    state: event.deployment?.latest_stage?.status ?? 'unknown',
    url: event.deployment?.url ?? null,
  };
}
