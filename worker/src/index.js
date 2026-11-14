// =============================================================================
// CareerPilot AI Gateway — single Cloudflare Worker
// =============================================================================
// Every AI feature in CareerPilot calls this one Worker. It is the single
// place where platform AI keys live (as Worker secrets) and where BYOK keys
// are forwarded. The browser never holds platform keys.
//
// Routes:
//   GET  /v1/health                → liveness probe
//   GET  /v1/ai/models?provider=x  → curated model lists (mirror of frontend PROVIDER_META)
//   POST /v1/ai/generate           → unified text generation across providers
//   POST /v1/ai/validate-key       → lightweight BYOK key check
//   POST /v1/jobs/search           → RapidAPI JSearch proxy (server-side key)
//   POST /v1/jobs/track            → extension path: verify Supabase JWT + insert tracked job
// =============================================================================

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

const DEFAULT_MODELS = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o-mini',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'liquid/lfm-3-1.7b:free',
  anthropic: 'claude-3-5-haiku-latest',
  custom: 'gpt-4o-mini',
};

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
function corsHeaders(request, env) {
  const allow = (env.ALLOWED_ORIGINS || '*').split(',').map((s) => s.trim());
  const origin = request.headers.get('Origin') || '';
  const allowed = allow.includes('*') ? '*' : (allow.includes(origin) ? origin : allow[0]);
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-AI-Provider, X-AI-Key, X-AI-Model, X-AI-Base-Url, X-Feature',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...extraHeaders } });
}

// ---------------------------------------------------------------------------
// Minimal per-isolate rate limiter (best-effort on the free tier)
// ---------------------------------------------------------------------------
const buckets = new Map();
function rateLimit(ip, limit = 120, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(ip) || { count: 0, reset: now + windowMs };
  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + windowMs;
  }
  bucket.count += 1;
  buckets.set(ip, bucket);
  if (buckets.size > 5000) buckets.clear(); // memory guard
  return bucket.count <= limit;
}

// ---------------------------------------------------------------------------
// Provider resolution
// ---------------------------------------------------------------------------
// Resolution order: BYOK header key > BYOK body key > platform key for the
// requested provider > platform default provider.
function resolveProvider(request, env, body) {
  const headerKey = request.headers.get('X-AI-Key') || '';
  const headerProvider = request.headers.get('X-AI-Provider') || '';
  const headerModel = request.headers.get('X-AI-Model') || '';
  const headerBaseUrl = request.headers.get('X-AI-Base-Url') || '';

  let provider = body.provider || headerProvider || '';
  let apiKey = body.apiKey || headerKey || '';
  let model = body.model || headerModel || '';
  const baseUrl = body.baseUrl || headerBaseUrl || '';
  const byok = Boolean(apiKey);

  if (!apiKey) {
    provider = provider || env.DEFAULT_AI_PROVIDER || 'gemini';
    const platformKeys = {
      gemini: env.GEMINI_API_KEY,
      openai: env.OPENAI_API_KEY,
      groq: env.GROQ_API_KEY,
      openrouter: env.OPENROUTER_API_KEY,
      anthropic: env.ANTHROPIC_API_KEY,
    };
    if (!platformKeys[provider]) {
      // Requested provider has no platform key — fall back to the first configured one.
      const fallback = Object.entries(platformKeys).find(([, key]) => Boolean(key));
      if (!fallback) {
        return {
          error: 'No AI provider is configured on the server and no BYOK key was supplied.',
          status: 503,
        };
      }
      provider = fallback[0];
    }
    apiKey = platformKeys[provider];
  }

  if (!provider) provider = guessProvider(apiKey);
  model = model || DEFAULT_MODELS[provider] || DEFAULT_MODELS.openai;

  return { provider, apiKey, model, baseUrl, byok };
}

function guessProvider(key) {
  if (key.startsWith('gsk_')) return 'groq';
  if (key.startsWith('sk-or-')) return 'openrouter';
  if (key.startsWith('sk-ant-')) return 'anthropic';
  if (key.startsWith('sk-')) return 'openai';
  return 'gemini';
}

// ---------------------------------------------------------------------------
// Provider adapters — all return { text, usage }
// ---------------------------------------------------------------------------
const PROVIDER_BASES = {
  openai: 'https://api.openai.com/v1',
  groq: 'https://api.groq.com/openai/v1',
  openrouter: 'https://openrouter.ai/api/v1',
};

async function generateOpenAICompatible(provider, { apiKey, model, baseUrl }, messages, opts) {
  const base = (provider === 'custom' && baseUrl) ? baseUrl.replace(/\/$/, '') : PROVIDER_BASES[provider];
  if (!base) throw new Error(`Unknown OpenAI-compatible provider: ${provider}`);

  const payload = {
    model,
    messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 2048,
  };
  if (opts.json) payload.response_format = { type: 'json_object' };

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = opts.referer || 'https://careerpilot.app';
    headers['X-Title'] = 'CareerPilot';
  }

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Provider error (${res.status})`);
  return {
    text: data?.choices?.[0]?.message?.content || '',
    usage: data?.usage || {},
  };
}

async function generateGemini({ apiKey, model }, messages, opts) {
  const system = messages.find((m) => m.role === 'system');
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

  const payload = {
    contents,
    generationConfig: {
      temperature: opts.temperature ?? 0.7,
      maxOutputTokens: opts.maxTokens ?? 2048,
      ...(opts.json ? { responseMimeType: 'application/json' } : {}),
    },
  };
  if (system) payload.systemInstruction = { parts: [{ text: system.content }] };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Gemini error (${res.status})`);
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
  return {
    text,
    usage: {
      prompt_tokens: data?.usageMetadata?.promptTokenCount,
      completion_tokens: data?.usageMetadata?.candidatesTokenCount,
    },
  };
}

async function generateAnthropic({ apiKey, model }, messages, opts) {
  const system = messages.find((m) => m.role === 'system')?.content || '';
  const payload = {
    model,
    max_tokens: opts.maxTokens ?? 2048,
    temperature: opts.temperature ?? 0.7,
    messages: messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content })),
  };
  if (system) payload.system = system;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Anthropic error (${res.status})`);
  return {
    text: data?.content?.map((c) => c.text || '').join('') || '',
    usage: {
      prompt_tokens: data?.usage?.input_tokens,
      completion_tokens: data?.usage?.output_tokens,
    },
  };
}

async function generate(provider, config, messages, opts) {
  if (provider === 'gemini') return generateGemini(config, messages, opts);
  if (provider === 'anthropic') return generateAnthropic(config, messages, opts);
  return generateOpenAICompatible(provider, config, messages, opts);
}

// ---------------------------------------------------------------------------
// Route handlers — each returns { data, status }
// ---------------------------------------------------------------------------
async function handleGenerate(request, env) {
  const body = await request.json().catch(() => null);
  if (!body) return { data: { error: 'Invalid JSON body' }, status: 400 };

  const resolved = resolveProvider(request, env, body);
  if (resolved.error) return { data: { error: resolved.error }, status: resolved.status };

  const messages = [];
  if (body.system) messages.push({ role: 'system', content: body.system });
  if (Array.isArray(body.messages)) {
    messages.push(...body.messages.filter((m) => m && typeof m.content === 'string'));
  } else if (typeof body.prompt === 'string') {
    messages.push({ role: 'user', content: body.prompt });
  }
  if (messages.length === 0) return { data: { error: 'Provide `prompt`, `messages`, or `system`' }, status: 400 };

  const started = Date.now();
  try {
    const { text, usage } = await generate(resolved.provider, resolved, messages, body);
    logUsage(env, {
      user_id: body.userId || null,
      feature: request.headers.get('X-Feature') || body.feature || 'unknown',
      provider: resolved.provider,
      model: resolved.model,
      input_tokens: usage.prompt_tokens ?? 0,
      output_tokens: usage.completion_tokens ?? 0,
      latency_ms: Date.now() - started,
      byok: resolved.byok,
    });
    return { data: { text, provider: resolved.provider, model: resolved.model, usage }, status: 200 };
  } catch (err) {
    return { data: { error: err.message || 'AI generation failed' }, status: 502 };
  }
}

async function handleValidateKey(request) {
  const { provider, apiKey, baseUrl = '' } = await request.json().catch(() => ({}));
  if (!provider || !apiKey) return { data: { error: 'provider and apiKey are required' }, status: 400 };

  try {
    let ok = false;
    if (provider === 'gemini') {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
      ok = res.ok;
    } else if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/models', {
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      });
      ok = res.ok;
    } else {
      const base = provider === 'custom' && baseUrl ? baseUrl.replace(/\/$/, '') : PROVIDER_BASES[provider];
      if (!base) return { data: { error: `Unknown provider: ${provider}` }, status: 400 };
      const res = await fetch(`${base}/models`, { headers: { Authorization: `Bearer ${apiKey}` } });
      ok = res.ok;
    }
    return { data: { valid: ok }, status: 200 };
  } catch {
    return { data: { valid: false }, status: 200 };
  }
}

function handleModels(url) {
  const provider = url.searchParams.get('provider') || 'all';
  const catalog = {
    gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
    openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'o1-mini'],
    groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    openrouter: [
      'google/gemini-2.0-flash-exp:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-r1:free',
      'deepseek/deepseek-chat:free',
      'openai/gpt-4o-mini',
      'openai/gpt-4o',
      'anthropic/claude-3.5-sonnet',
      'google/gemini-2.5-flash',
    ],
    anthropic: ['claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest', 'claude-3-opus-latest'],
  };
  return { data: { models: provider === 'all' ? catalog : (catalog[provider] || []) }, status: 200 };
}

async function handleJobsSearch(request, env) {
  if (!env.RAPIDAPI_KEY) {
    return { data: { error: 'Job search is not configured on the server (RAPIDAPI_KEY missing).' }, status: 503 };
  }
  const body = await request.json().catch(() => ({}));
  const params = new URLSearchParams({
    query: body.query || 'software engineer',
    page: String(body.page || '1'),
    num_pages: String(body.num_pages || '1'),
  });
  if (body.location) params.set('location', body.location);
  if (body.datePosted) params.set('datePosted', body.datePosted);
  if (body.employmentTypes) params.set('employmentTypes', body.employmentTypes);

  const res = await fetch(`https://jsearch.p.rapidapi.com/search?${params}`, {
    headers: {
      'X-RapidAPI-Key': env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com',
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { data: { error: data?.message || `Job search failed (${res.status})` }, status: 502 };
  return { data, status: 200 };
}

// Extension path: verify a Supabase access token, then insert the tracked job.
async function handleJobsTrack(request, env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return { data: { error: 'Tracking backend is not configured.' }, status: 503 };
  }
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return { data: { error: 'Missing bearer token' }, status: 401 };

  const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  });
  const user = await userRes.json().catch(() => ({}));
  if (!userRes.ok || !user?.id) return { data: { error: 'Invalid or expired token' }, status: 401 };

  const body = await request.json().catch(() => ({}));
  if (!body.title || !body.company) return { data: { error: 'title and company are required' }, status: 400 };

  const insertRes = await fetch(`${env.SUPABASE_URL}/rest/v1/tracked_jobs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      user_id: user.id,
      title: body.title,
      company: body.company,
      status: body.status || 'saved',
      notes: body.notes || '',
      location: body.location || '',
      job_url: body.jobUrl || body.url || '',
      data: body,
    }),
  });
  const inserted = await insertRes.json().catch(() => ({}));
  if (!insertRes.ok) return { data: { error: inserted?.message || 'Failed to track job' }, status: 502 };
  return { data: { trackedJob: Array.isArray(inserted) ? inserted[0] : inserted }, status: 200 };
}

// Fire-and-forget usage logging (never blocks or fails the request).
async function logUsage(env, entry) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return;
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/ai_usage`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
  } catch {
    // best effort
  }
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/gateway/, '');
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    if (!rateLimit(ip)) return json({ error: 'Rate limit exceeded, try again in a minute.' }, 429, cors);

    try {
      let result;
      if ((request.method === 'GET' || request.method === 'HEAD') && (path === '/v1/health' || path === '/health')) {
        result = { data: { ok: true, service: 'careerpilot-gateway' }, status: 200 };
      } else if ((request.method === 'GET' || request.method === 'HEAD') && path === '/v1/ai/models') {
        result = handleModels(url);
      } else if (request.method === 'POST' && path === '/v1/ai/generate') {
        result = await handleGenerate(request, env);
      } else if (request.method === 'POST' && path === '/v1/ai/validate-key') {
        result = await handleValidateKey(request);
      } else if (request.method === 'POST' && path === '/v1/jobs/search') {
        result = await handleJobsSearch(request, env);
      } else if (request.method === 'POST' && path === '/v1/jobs/track') {
        result = await handleJobsTrack(request, env);
      } else {
        result = { data: { error: 'Not found' }, status: 404 };
      }
      return json(result.data, result.status, cors);
    } catch (err) {
      return json({ error: err.message || 'Gateway error' }, 500, cors);
    }
  },
};
