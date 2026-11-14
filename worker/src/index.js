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
  cloudflare: '@cf/meta/llama-3.1-8b-instruct',
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
    provider = provider || env.DEFAULT_AI_PROVIDER || 'cloudflare';
    const platformKeys = {
      cloudflare: (env.AI ? 'binding' : null) || env.CLOUDFLARE_API_TOKEN,
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
  model = model || DEFAULT_MODELS[provider] || DEFAULT_MODELS.cloudflare || DEFAULT_MODELS.openai;

  return { provider, apiKey, model, baseUrl, byok };
}

function guessProvider(key) {
  if (key.startsWith('cfat_') || key.length === 40) return 'cloudflare';
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

async function generateCloudflare(env, { apiKey, model }, messages, opts) {
  const preparedMessages = messages.map((m) => ({ role: m.role, content: m.content }));
  if (opts.json) {
    const hasJsonInstruction = preparedMessages.some(
      (m) => m.content && m.content.toLowerCase().includes('json')
    );
    if (!hasJsonInstruction) {
      const sys = preparedMessages.find((m) => m.role === 'system');
      if (sys) {
        sys.content += '\n\nIMPORTANT: Return valid, parseable JSON only. Do not wrap in markdown code blocks.';
      } else {
        preparedMessages.unshift({
          role: 'system',
          content: 'You are an AI assistant. Return valid, parseable JSON only. Do not wrap in markdown code blocks.',
        });
      }
    }
  }

  // 1. Try native env.AI binding if present
  if (env.AI && typeof env.AI.run === 'function') {
    try {
      const aiParams = {
        messages: preparedMessages,
        max_tokens: opts.maxTokens ?? 2048,
        temperature: opts.temperature ?? 0.7,
      };
      const result = await env.AI.run(model, aiParams);
      let text = '';
      if (typeof result === 'string') {
        text = result;
      } else if (result?.response) {
        text = result.response;
      } else if (result?.choices?.[0]?.message?.content) {
        text = result.choices[0].message.content;
      } else if (result?.result?.response) {
        text = result.result.response;
      }

      if (text) {
        return {
          text,
          usage: {
            prompt_tokens: result?.usage?.prompt_tokens ?? 0,
            completion_tokens: result?.usage?.completion_tokens ?? 0,
            neurons: result?.usage?.neurons ?? 0,
          },
        };
      }
    } catch (err) {
      console.error('env.AI.run error, falling back to REST API:', err);
    }
  }

  // 2. Cloudflare Workers AI REST API
  const token = (apiKey && apiKey !== 'binding') ? apiKey : env.CLOUDFLARE_API_TOKEN;
  const accountId = env.CLOUDFLARE_ACCOUNT_ID || '74d877492e541ba6d459990fff4fad12';
  if (!token) {
    throw new Error('Cloudflare AI is not configured (missing AI binding or API Token).');
  }

  // Note: model path (e.g. @cf/meta/llama-3.1-8b-instruct) must preserve slashes in URL
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: preparedMessages,
        max_tokens: opts.maxTokens ?? 2048,
        temperature: opts.temperature ?? 0.7,
      }),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    const errMsg = data?.errors?.[0]?.message || data?.messages?.[0] || `Cloudflare AI error (${res.status})`;
    throw new Error(errMsg);
  }

  const result = data.result;
  const text = result?.response || result?.choices?.[0]?.message?.content || (typeof result === 'string' ? result : '');
  return {
    text,
    usage: {
      prompt_tokens: result?.usage?.prompt_tokens ?? 0,
      completion_tokens: result?.usage?.completion_tokens ?? 0,
      neurons: result?.usage?.neurons ?? 0,
    },
  };
}

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

async function generate(provider, config, messages, opts, env) {
  if (provider === 'cloudflare') return generateCloudflare(env, config, messages, opts);
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
    const { text, usage } = await generate(resolved.provider, resolved, messages, body, env);
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

async function handleValidateKey(request, env) {
  const { provider, apiKey, baseUrl = '' } = await request.json().catch(() => ({}));
  if (!provider || !apiKey) return { data: { error: 'provider and apiKey are required' }, status: 400 };

  try {
    let ok = false;
    if (provider === 'cloudflare') {
      const accountId = env?.CLOUDFLARE_ACCOUNT_ID || '74d877492e541ba6d459990fff4fad12';
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/tokens/verify`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const data = await res.json().catch(() => ({}));
      ok = res.ok && data.success === true;
    } else if (provider === 'gemini') {
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
    cloudflare: [
      '@cf/meta/llama-3.1-8b-instruct',
      '@cf/meta/llama-3.3-70b-instruct',
      '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
      '@cf/mistral/mistral-7b-instruct-v0.2',
      '@cf/qwen/qwen1.5-14b-chat-awq',
    ],
    gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
    openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'o1-mini'],
    groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    openrouter: [
      'liquid/lfm-3-1.7b:free',
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
  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const body = await request.json().catch(() => ({}));
  if (!body.title || !body.company) return { data: { error: 'title and company are required' }, status: 400 };

  let userId = 'anonymous';

  // 1. Verify user if Supabase is configured
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && token) {
    const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      },
    }).catch(() => null);
    const user = userRes ? await userRes.json().catch(() => ({})) : null;
    if (user?.id) userId = user.id;
  }

  // 2. Persist in Cloudflare D1 if bound
  if (env.DB) {
    const id = body.id || crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO tracked_jobs (id, user_id, company, title, location, status, notes, job_url, raw_data, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      id,
      userId,
      body.company,
      body.title,
      body.location || '',
      body.status || 'saved',
      body.notes || '',
      body.jobUrl || body.url || '',
      JSON.stringify(body)
    ).run();

    const trackedJob = await env.DB.prepare(`SELECT * FROM tracked_jobs WHERE id = ?`).bind(id).first();
    return { data: { success: true, trackedJob }, status: 200 };
  }

  // 3. Fallback to Supabase if D1 is not bound
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    const insertRes = await fetch(`${env.SUPABASE_URL}/rest/v1/tracked_jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        user_id: userId,
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

  return { data: { error: 'No database (D1 or Supabase) is configured.' }, status: 503 };
}

// ---------------------------------------------------------------------------
// Cloudflare D1 CRUD Handlers
// ---------------------------------------------------------------------------
async function handleD1Jobs(request, env, url, method) {
  if (!env.DB) return { data: { error: 'Cloudflare D1 database is not bound' }, status: 503 };

  const userId = request.headers.get('X-User-Id') || url.searchParams.get('user_id');

  if (method === 'GET') {
    if (!userId) return { data: { error: 'user_id is required' }, status: 400 };
    const { results } = await env.DB.prepare(
      `SELECT * FROM tracked_jobs WHERE user_id = ? ORDER BY created_at DESC`
    ).bind(userId).all();
    return { data: { jobs: results || [] }, status: 200 };
  }

  if (method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const uid = body.userId || body.user_id || userId;
    if (!uid || !body.company || !body.title) {
      return { data: { error: 'userId, company, and title are required' }, status: 400 };
    }
    const id = body.id || crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO tracked_jobs (id, user_id, company, title, location, status, salary, job_url, notes, raw_data, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         company = excluded.company,
         title = excluded.title,
         location = excluded.location,
         status = excluded.status,
         salary = excluded.salary,
         job_url = excluded.job_url,
         notes = excluded.notes,
         raw_data = excluded.raw_data,
         updated_at = datetime('now')`
    ).bind(
      id,
      uid,
      body.company,
      body.title,
      body.location || '',
      body.status || 'saved',
      body.salary || '',
      body.jobUrl || body.url || '',
      body.notes || '',
      JSON.stringify(body)
    ).run();

    const job = await env.DB.prepare(`SELECT * FROM tracked_jobs WHERE id = ?`).bind(id).first();
    return { data: { success: true, job }, status: 200 };
  }

  if (method === 'DELETE') {
    const id = url.searchParams.get('id');
    if (!id) return { data: { error: 'id is required' }, status: 400 };
    await env.DB.prepare(`DELETE FROM tracked_jobs WHERE id = ?`).bind(id).run();
    return { data: { success: true }, status: 200 };
  }

  return { data: { error: 'Method not allowed' }, status: 405 };
}

async function handleD1Resumes(request, env, url, method) {
  if (!env.DB) return { data: { error: 'Cloudflare D1 database is not bound' }, status: 503 };

  const userId = request.headers.get('X-User-Id') || url.searchParams.get('user_id');

  if (method === 'GET') {
    const resumeId = url.searchParams.get('id');
    if (resumeId) {
      const resume = await env.DB.prepare(`SELECT * FROM resumes WHERE id = ?`).bind(resumeId).first();
      if (!resume) return { data: { error: 'Resume not found' }, status: 404 };
      return { data: { resume }, status: 200 };
    }
    if (!userId) return { data: { error: 'user_id is required' }, status: 400 };
    const { results } = await env.DB.prepare(
      `SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC`
    ).bind(userId).all();
    return { data: { resumes: results || [] }, status: 200 };
  }

  if (method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const uid = body.userId || body.user_id || userId;
    if (!uid || !body.title || !body.originalText) {
      return { data: { error: 'userId, title, and originalText are required' }, status: 400 };
    }
    const id = body.id || crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO resumes (id, user_id, title, original_text, enhanced_text, job_role, ats_score, pdf_url, preferences_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         title = excluded.title,
         original_text = excluded.original_text,
         enhanced_text = excluded.enhanced_text,
         job_role = excluded.job_role,
         ats_score = excluded.ats_score,
         pdf_url = excluded.pdf_url,
         preferences_json = excluded.preferences_json,
         updated_at = datetime('now')`
    ).bind(
      id,
      uid,
      body.title,
      body.originalText,
      body.enhancedText || null,
      body.jobRole || null,
      body.atsScore || null,
      body.pdfUrl || null,
      body.preferences ? JSON.stringify(body.preferences) : null
    ).run();

    const resume = await env.DB.prepare(`SELECT * FROM resumes WHERE id = ?`).bind(id).first();
    return { data: { success: true, resume }, status: 200 };
  }

  return { data: { error: 'Method not allowed' }, status: 405 };
}

async function handleD1Portfolios(request, env, url, method) {
  if (!env.DB) return { data: { error: 'Cloudflare D1 database is not bound' }, status: 503 };

  const userId = request.headers.get('X-User-Id') || url.searchParams.get('user_id');

  if (method === 'GET') {
    const slug = url.searchParams.get('slug');
    const id = url.searchParams.get('id');
    if (slug) {
      const portfolio = await env.DB.prepare(`SELECT * FROM portfolios WHERE slug = ?`).bind(slug).first();
      if (!portfolio) return { data: { error: 'Portfolio not found' }, status: 404 };
      return { data: { portfolio }, status: 200 };
    }
    if (id) {
      const portfolio = await env.DB.prepare(`SELECT * FROM portfolios WHERE id = ?`).bind(id).first();
      if (!portfolio) return { data: { error: 'Portfolio not found' }, status: 404 };
      return { data: { portfolio }, status: 200 };
    }
    if (!userId) return { data: { error: 'user_id is required' }, status: 400 };
    const { results } = await env.DB.prepare(
      `SELECT * FROM portfolios WHERE user_id = ? ORDER BY updated_at DESC`
    ).bind(userId).all();
    return { data: { portfolios: results || [] }, status: 200 };
  }

  if (method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const uid = body.userId || body.user_id || userId;
    if (!uid || !body.slug) {
      return { data: { error: 'userId and slug are required' }, status: 400 };
    }
    const id = body.id || crypto.randomUUID();
    const sectionsJson = body.sections ? JSON.stringify(body.sections) : (body.sections_json || '{}');
    await env.DB.prepare(
      `INSERT INTO portfolios (id, user_id, slug, template_id, title, sections_json, deployed_url, project_name, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(user_id, slug) DO UPDATE SET
         template_id = excluded.template_id,
         title = excluded.title,
         sections_json = excluded.sections_json,
         deployed_url = coalesce(excluded.deployed_url, portfolios.deployed_url),
         project_name = coalesce(excluded.project_name, portfolios.project_name),
         updated_at = datetime('now')`
    ).bind(
      id,
      uid,
      body.slug,
      body.templateId || body.template_id || 'default',
      body.title || 'My Portfolio',
      sectionsJson,
      body.deployedUrl || body.deployed_url || null,
      body.projectName || body.project_name || null
    ).run();

    const portfolio = await env.DB.prepare(`SELECT * FROM portfolios WHERE user_id = ? AND slug = ?`).bind(uid, body.slug).first();
    return { data: { success: true, portfolio }, status: 200 };
  }

  if (method === 'DELETE') {
    const id = url.searchParams.get('id');
    const slug = url.searchParams.get('slug');
    if (id) {
      await env.DB.prepare(`DELETE FROM portfolios WHERE id = ?`).bind(id).run();
      return { data: { success: true }, status: 200 };
    }
    if (slug && userId) {
      await env.DB.prepare(`DELETE FROM portfolios WHERE user_id = ? AND slug = ?`).bind(userId, slug).run();
      return { data: { success: true }, status: 200 };
    }
    return { data: { error: 'id or slug is required' }, status: 400 };
  }

  return { data: { error: 'Method not allowed' }, status: 405 };
}

// ---------------------------------------------------------------------------
// ImageKit Authentication & Upload Handlers
// ---------------------------------------------------------------------------
async function handleImageKitAuth(env) {
  const privateKey = env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return { data: { error: 'IMAGEKIT_PRIVATE_KEY is not configured on gateway' }, status: 503 };
  }
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 1800; // 30 minutes validity
  const encoder = new TextEncoder();
  const keyData = encoder.encode(privateKey);
  const message = encoder.encode(token + expire);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signatureBuf = await crypto.subtle.sign('HMAC', cryptoKey, message);
  const signature = Array.from(new Uint8Array(signatureBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    data: {
      token,
      expire,
      signature,
      publicKey: env.IMAGEKIT_PUBLIC_KEY || 'public_HbKrLXFCb5VWNjz7jBfAteEOhBM=',
      urlEndpoint: env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/anurag3407',
    },
    status: 200,
  };
}

async function handleImageKitUpload(request, env) {
  const privateKey = env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return { data: { error: 'IMAGEKIT_PRIVATE_KEY is not configured on gateway' }, status: 503 };
  }

  const contentType = request.headers.get('content-type') || '';
  let forwardFormData;

  if (contentType.includes('multipart/form-data')) {
    forwardFormData = await request.formData();
  } else {
    const body = await request.json().catch(() => ({}));
    if (!body.file || !body.fileName) {
      return { data: { error: 'file and fileName are required' }, status: 400 };
    }
    // Size check for base64 uploads (~10MB limit)
    if (typeof body.file === 'string' && body.file.length > 14 * 1024 * 1024) {
      return { data: { error: 'File size exceeds maximum allowed limit of 10MB' }, status: 413 };
    }
    forwardFormData = new FormData();
    forwardFormData.append('file', body.file);
    forwardFormData.append('fileName', body.fileName);
    if (body.folder) forwardFormData.append('folder', body.folder);
    if (body.tags) forwardFormData.append('tags', Array.isArray(body.tags) ? body.tags.join(',') : body.tags);
  }

  // File extension whitelist guard
  const fileName = String(forwardFormData.get('fileName') || '').toLowerCase();
  const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.pdf', '.doc', '.docx', '.txt'];
  const hasValidExt = ALLOWED_EXTS.some((ext) => fileName.endsWith(ext));
  if (!hasValidExt) {
    return { data: { error: 'Invalid file format. Allowed: PDF, DOC, DOCX, TXT, PNG, JPG, WEBP, GIF' }, status: 400 };
  }

  const basicAuth = btoa(`${privateKey}:`);
  const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
    },
    body: forwardFormData,
  });

  const ikData = await ikRes.json().catch(() => ({}));
  if (!ikRes.ok) {
    return { data: { error: ikData.message || 'ImageKit upload failed' }, status: ikRes.status };
  }

  // Record uploaded file in Cloudflare D1
  if (env.DB) {
    try {
      const fileId = ikData.fileId || crypto.randomUUID();
      const userId = request.headers.get('X-User-Id') || 'anonymous';
      await env.DB.prepare(
        `INSERT INTO files (id, user_id, file_id, file_name, file_url, file_type, size)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(),
        userId,
        fileId,
        ikData.name || 'file',
        ikData.url,
        ikData.fileType || 'file',
        ikData.size || 0
      ).run();
    } catch (dbErr) {
      console.warn('Failed to record file in D1:', dbErr.message);
    }
  }

  return {
    data: {
      success: true,
      fileId: ikData.fileId,
      name: ikData.name,
      url: ikData.url,
      thumbnail: ikData.thumbnailUrl || ikData.thumbnail || ikData.url,
      size: ikData.size,
      filePath: ikData.filePath,
      fileType: ikData.fileType,
    },
    status: 200,
  };
}

// Fire-and-forget usage logging (never blocks or fails the request).
async function logUsage(env, entry) {
  if (env.DB) {
    try {
      await env.DB.prepare(
        `INSERT INTO ai_usage (user_id, provider, model, prompt_tokens, completion_tokens)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(
        entry.user_id || 'anonymous',
        entry.provider || 'cloudflare',
        entry.model || '',
        entry.prompt_tokens || 0,
        entry.completion_tokens || 0
      ).run();
    } catch {
      // best effort
    }
  }

  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
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
        result = { data: { ok: true, service: 'careerpilot-gateway', d1: Boolean(env.DB), imagekit: Boolean(env.IMAGEKIT_PRIVATE_KEY) }, status: 200 };
      } else if ((request.method === 'GET' || request.method === 'HEAD') && path === '/v1/ai/models') {
        result = handleModels(url);
      } else if (request.method === 'POST' && path === '/v1/ai/generate') {
        if (!rateLimit(`${ip}:ai`, 20, 60_000)) {
          return json({ error: 'AI rate limit exceeded (max 20 requests per minute). Please wait a moment.' }, 429, cors);
        }
        result = await handleGenerate(request, env);
      } else if (request.method === 'POST' && path === '/v1/ai/validate-key') {
        result = await handleValidateKey(request, env);
      } else if (request.method === 'POST' && path === '/v1/jobs/search') {
        result = await handleJobsSearch(request, env);
      } else if (request.method === 'POST' && path === '/v1/jobs/track') {
        result = await handleJobsTrack(request, env);
      } else if (request.method === 'GET' && path === '/v1/imagekit/auth') {
        result = await handleImageKitAuth(env);
      } else if (request.method === 'POST' && path === '/v1/imagekit/upload') {
        result = await handleImageKitUpload(request, env);
      } else if (path === '/v1/db/jobs') {
        result = await handleD1Jobs(request, env, url, request.method);
      } else if (path === '/v1/db/resumes') {
        result = await handleD1Resumes(request, env, url, request.method);
      } else if (path === '/v1/db/portfolios') {
        result = await handleD1Portfolios(request, env, url, request.method);
      } else {
        result = { data: { error: 'Not found' }, status: 404 };
      }
      return json(result.data, result.status, cors);
    } catch (err) {
      return json({ error: err.message || 'Gateway error' }, 500, cors);
    }
  },
};
