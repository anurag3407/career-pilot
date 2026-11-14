// =============================================================================
// aiGateway.js — the single client for every AI call in the platform
// =============================================================================
// All AI traffic goes through the CareerPilot gateway Worker (worker/). Two
// modes, both configured in ONE place (Settings → AI Provider):
//
//   * Platform mode (default) — the Worker injects its own server-side keys.
//     Nothing to configure; free to run on Cloudflare's free tier.
//   * BYOK mode — the user stores their own key in useAIConfigStore (encrypted
//     in localStorage). The key is forwarded to the Worker via X-AI-* headers
//     and used instead of the platform key.
// =============================================================================

const GATEWAY_URL = import.meta.env.VITE_AI_GATEWAY_URL || '/gateway/v1';

async function withByok(headers = {}) {
  try {
    const { useAIConfigStore } = await import('../stores/useAIConfigStore');
    const config = useAIConfigStore.getState().getActiveConfig();
    if (config) {
      if (config.provider) headers['X-AI-Provider'] = config.provider;
      if (config.apiKey) headers['X-AI-Key'] = config.apiKey;
      if (config.model) headers['X-AI-Model'] = config.model;
      if (config.baseUrl) headers['X-AI-Base-Url'] = config.baseUrl;
    }
  } catch {
    // store not hydrated yet — platform mode still works
  }
  return headers;
}

async function request(path, { method = 'POST', body, headers = {}, signal, feature } = {}) {
  const finalHeaders = await withByok({
    'Content-Type': 'application/json',
    ...(feature ? { 'X-Feature': feature } : {}),
    ...headers,
  });

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method,
    headers: finalHeaders,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    signal,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Gateway error (${res.status})`);
    err.status = res.status;
    if (res.status === 503) err.requireApiKey = true;
    throw err;
  }
  return data;
}

/**
 * Generate text via the gateway.
 *
 * @param {object} opts
 * @param {string}   [opts.prompt]     user prompt (or use `messages`)
 * @param {Array}    [opts.messages]   [{ role, content }]
 * @param {string}   [opts.system]     system prompt
 * @param {boolean}  [opts.json]       request strict JSON output
 * @param {string}   [opts.provider]   override provider (else BYOK else platform default)
 * @param {string}   [opts.model]      override model
 * @param {number}   [opts.temperature]
 * @param {number}   [opts.maxTokens]
 * @param {string}   [opts.feature]    feature tag for the ai_usage ledger
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<{ text: string, provider: string, model: string, usage: object }>}
 */
export function generate(opts = {}) {
  return request('/ai/generate', { body: opts, feature: opts.feature });
}

/** Parse a strict-JSON AI response (strips ```json fences if a model adds them). */
export function parseJson(text) {
  if (typeof text !== 'string') return null;
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/[[{][\s\S]*[\]}]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/** Convenience: generate + parse JSON in one call. */
export async function generateJson(opts = {}) {
  const { text } = await generate({ ...opts, json: true });
  return parseJson(text);
}

export const getModels = (provider) =>
  request(`/ai/models?provider=${encodeURIComponent(provider)}`, { method: 'GET' });

export const validateKey = (provider, apiKey, config = {}) =>
  request('/ai/validate-key', { body: { provider, apiKey, ...config } });

/** Job search via the gateway (keeps the RapidAPI key server-side). */
export function searchJobs({ query, location, page = 1, num_pages = 1, datePosted, employmentTypes } = {}) {
  return request('/jobs/search', {
    body: { query, location, page, num_pages, datePosted, employmentTypes },
    feature: 'job-search',
  });
}

export default {
  generate,
  generateJson,
  parseJson,
  getModels,
  validateKey,
  searchJobs,
};
