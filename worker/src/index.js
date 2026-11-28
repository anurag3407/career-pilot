// =============================================================================
// CareerPilot AI & D1 Gateway — single Cloudflare Worker
// =============================================================================
// Single gateway for CareerPilot:
//   * Native Auth (PBKDF2 + HS256 JWT + D1 sessions)
//   * Complete Cloudflare D1 CRUD across all platform tables
//   * Unified AI provider router (Cloudflare AI, Gemini, OpenAI, Groq, etc.)
//   * RapidAPI JSearch job search proxy
//   * ImageKit object storage auth & upload
// =============================================================================

import { handleAuthRoutes, authenticateRequest } from './auth.js';
import { handleD1Routes } from './db.js';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

// ---------------------------------------------------------------------------
// Provider registry
// ---------------------------------------------------------------------------
// Every OpenAI-compatible provider shares one code path. Adding an entry here
// makes the provider available for generation, live model discovery and key
// validation. `keyless` providers (local runtimes) work without an API key.
const PROVIDER_REGISTRY = {
  openai: {
    base: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini', 'gpt-4.1', 'o3-mini', 'o1-mini'],
  },
  groq: {
    base: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
  },
  openrouter: {
    base: 'https://openrouter.ai/api/v1',
    defaultModel: 'liquid/lfm-3-1.7b:free',
    models: [
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
  },
  requesty: {
    base: 'https://router.requesty.ai/v1',
    defaultModel: 'openai/gpt-4o-mini',
    models: [
      'openai/gpt-4o-mini',
      'openai/gpt-4o',
      'anthropic/claude-3-5-sonnet-latest',
      'google/gemini-2.5-flash',
    ],
  },
  deepseek: {
    base: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  mistral: {
    base: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-large-latest',
    models: ['mistral-large-latest', 'mistral-small-latest', 'codestral-latest', 'open-mistral-nemo'],
  },
  xai: {
    base: 'https://api.x.ai/v1',
    defaultModel: 'grok-3',
    models: ['grok-3', 'grok-3-mini', 'grok-2-latest', 'grok-2-vision-latest'],
  },
  together: {
    base: 'https://api.together.xyz/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    models: [
      'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      'Qwen/Qwen2.5-72B-Instruct-Turbo',
      'deepseek-ai/DeepSeek-V3',
    ],
  },
  fireworks: {
    base: 'https://api.fireworks.ai/inference/v1',
    defaultModel: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
    models: [
      'accounts/fireworks/models/llama-v3p3-70b-instruct',
      'accounts/fireworks/models/deepseek-v3',
      'accounts/fireworks/models/qwen2p5-72b-instruct',
    ],
  },
  perplexity: {
    base: 'https://api.perplexity.ai',
    defaultModel: 'sonar',
    models: ['sonar', 'sonar-pro', 'sonar-reasoning', 'sonar-reasoning-pro'],
  },
  cohere: {
    base: 'https://api.cohere.ai/compatibility/v1',
    defaultModel: 'command-r-plus',
    models: ['command-r-plus', 'command-r', 'command-light'],
  },
  cerebras: {
    base: 'https://api.cerebras.ai/v1',
    defaultModel: 'llama-3.3-70b',
    models: ['llama-3.3-70b', 'llama3.1-8b'],
  },
  sambanova: {
    base: 'https://api.sambanova.ai/v1',
    defaultModel: 'Meta-Llama-3.3-70B-Instruct',
    models: ['Meta-Llama-3.3-70B-Instruct', 'Meta-Llama-3.1-8B-Instruct', 'DeepSeek-R1'],
  },
  hyperbolic: {
    base: 'https://api.hyperbolic.xyz/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
    models: [
      'meta-llama/Llama-3.3-70B-Instruct',
      'Qwen/Qwen2.5-72B-Instruct',
      'deepseek-ai/DeepSeek-R1',
    ],
  },
  novita: {
    base: 'https://api.novita.ai/v3/openai',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct',
    models: [
      'meta-llama/llama-3.3-70b-instruct',
      'deepseek/deepseek-r1',
      'qwen/qwen-2.5-72b-instruct',
    ],
  },
  moonshot: {
    base: 'https://api.moonshot.ai/v1',
    defaultModel: 'moonshot-v1-8k',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
  },
  zhipu: {
    base: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4-flash',
    models: ['glm-4-flash', 'glm-4-plus', 'glm-4-air'],
  },
  dashscope: {
    base: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    models: ['qwen-plus', 'qwen-max', 'qwen-turbo', 'qwen2.5-coder-32b-instruct'],
  },
  nebius: {
    base: 'https://api.studio.nebius.ai/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
    models: [
      'meta-llama/Llama-3.3-70B-Instruct',
      'deepseek-ai/DeepSeek-V3',
      'Qwen/Qwen2.5-72B-Instruct',
    ],
  },
  chutes: {
    base: 'https://llm.chutes.ai/v1',
    defaultModel: 'deepseek-ai/DeepSeek-V3',
    models: ['deepseek-ai/DeepSeek-V3', 'deepseek-ai/DeepSeek-R1', 'chutesai/Llama-3.3-70B-Instruct'],
  },
  github: {
    base: 'https://models.github.ai/inference',
    defaultModel: 'openai/gpt-4o-mini',
    models: [
      'openai/gpt-4o-mini',
      'openai/gpt-4o',
      'meta/Llama-3.3-70B-Instruct',
      'mistral-ai/Mistral-Large-2411',
    ],
  },
  ollama: {
    base: 'http://localhost:11434/v1',
    defaultModel: 'llama3.2',
    keyless: true,
    models: ['llama3.2', 'llama3.1', 'qwen2.5-coder', 'deepseek-r1', 'mistral'],
  },
  lmstudio: {
    base: 'http://localhost:1234/v1',
    defaultModel: 'local-model',
    keyless: true,
    models: ['local-model'],
  },
  vllm: {
    base: 'http://localhost:8000/v1',
    defaultModel: 'local-model',
    keyless: true,
    models: ['local-model'],
  },
  llamacpp: {
    base: 'http://localhost:8080/v1',
    defaultModel: 'local-model',
    keyless: true,
    models: ['local-model'],
  },
  azure: {
    base: '',
    defaultModel: 'gpt-4o-mini',
    requiresBaseUrl: true,
    models: ['gpt-4o-mini'],
  },
};

// Providers that can run without an API key (local runtimes / user endpoints)
const KEYLESS_PROVIDERS = new Set([
  'custom',
  ...Object.entries(PROVIDER_REGISTRY)
    .filter(([, config]) => config.keyless)
    .map(([id]) => id),
]);

const DEFAULT_MODELS = {
  cloudflare: '@cf/meta/llama-3.1-8b-instruct',
  gemini: 'gemini-2.5-flash',
  anthropic: 'claude-3-5-haiku-latest',
  custom: 'gpt-4o-mini',
  ...Object.fromEntries(
    Object.entries(PROVIDER_REGISTRY).map(([id, config]) => [id, config.defaultModel]),
  ),
};

const PROVIDER_BASES = Object.fromEntries(
  Object.entries(PROVIDER_REGISTRY)
    .filter(([, config]) => config.base)
    .map(([id, config]) => [id, config.base]),
);

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
function corsHeaders(request, env) {
  const allow = (env.ALLOWED_ORIGINS || '*').split(',').map((s) => s.trim());
  const origin = request.headers.get('Origin') || '';
  const allowed = allow.includes('*') ? '*' : (allow.includes(origin) ? origin : allow[0]);
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id, X-Gateway-Secret, X-AI-Provider, X-AI-Key, X-AI-Model, X-AI-Base-Url, X-Feature',
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
function rateLimit(ip, limit = 240, windowMs = 60_000) {
  const now = Date.now();
  const bucket = buckets.get(ip) || { count: 0, reset: now + windowMs };
  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + windowMs;
  }
  bucket.count += 1;
  buckets.set(ip, bucket);
  if (buckets.size > 5000) buckets.clear();
  return bucket.count <= limit;
}

// ---------------------------------------------------------------------------
// Provider resolution
// ---------------------------------------------------------------------------
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

  // Keyless providers (local runtimes, self-hosted endpoints) never borrow the
  // platform key — they must be addressed at their own base URL.
  if (!apiKey && provider && KEYLESS_PROVIDERS.has(provider)) {
    if (!baseUrl && !PROVIDER_REGISTRY[provider]?.base) {
      return { error: `Provider "${provider}" requires a base URL`, status: 400 };
    }
    return {
      provider,
      apiKey: '',
      model: model || DEFAULT_MODELS[provider] || '',
      baseUrl: baseUrl || PROVIDER_REGISTRY[provider]?.base || '',
      byok: false,
    };
  }

  if (!apiKey) {
    provider = provider || env.DEFAULT_AI_PROVIDER || 'cloudflare';
    const platformKeys = {
      cloudflare: (env.AI ? 'binding' : null) || env.CLOUDFLARE_API_TOKEN,
      gemini: env.GEMINI_API_KEY,
      openai: env.OPENAI_API_KEY,
      groq: env.GROQ_API_KEY,
      openrouter: env.OPENROUTER_API_KEY,
      anthropic: env.ANTHROPIC_API_KEY,
      requesty: env.REQUESTY_API_KEY,
      deepseek: env.DEEPSEEK_API_KEY,
      mistral: env.MISTRAL_API_KEY,
      xai: env.XAI_API_KEY,
      together: env.TOGETHER_API_KEY,
    };
    if (!platformKeys[provider]) {
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
  if (!PROVIDER_BASES[provider] && !baseUrl && provider !== 'cloudflare' && provider !== 'gemini' && provider !== 'anthropic') {
    return { error: `Unknown provider: ${provider}`, status: 400 };
  }
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

  const token = (apiKey && apiKey !== 'binding') ? apiKey : env.CLOUDFLARE_API_TOKEN;
  const accountId = env.CLOUDFLARE_ACCOUNT_ID || '74d877492e541ba6d459990fff4fad12';
  if (!token) {
    throw new Error('Cloudflare AI is not configured (missing AI binding or API Token).');
  }

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
  const rawBase = baseUrl ? baseUrl.replace(/\/+$/, '') : PROVIDER_BASES[provider];
  if (!rawBase) throw new Error(`Unknown OpenAI-compatible provider: ${provider}`);
  const base = rawBase.replace(/\/chat\/completions$/, '');

  const payload = {
    model,
    messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: opts.maxTokens ?? 2048,
  };
  if (opts.json) payload.response_format = { type: 'json_object' };

  const headers = { 'Content-Type': 'application/json' };
  let url = `${base}/chat/completions`;

  if (provider === 'azure') {
    // Azure OpenAI: deployments live under the resource URL and require api-version
    headers['api-key'] = apiKey;
    if (!/[?&]api-version=/.test(url)) {
      url += `${url.includes('?') ? '&' : '?'}api-version=${opts.apiVersion || '2024-08-01-preview'}`;
    }
  } else if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = opts.referer || 'https://careerpilot.sayalabs.in';
    headers['X-Title'] = 'CareerPilot';
  }

  const res = await fetch(url, {
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
// AI & Jobs Handlers
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

  const auth = await authenticateRequest(request, env).catch(() => null);
  const started = Date.now();
  try {
    const { text, usage } = await generate(resolved.provider, resolved, messages, body, env);
    logUsage(env, {
      user_id: auth?.user?.id || body.userId || 'anonymous',
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

// ---------------------------------------------------------------------------
// Provider discovery — live /models lookups with a static catalog fallback
// ---------------------------------------------------------------------------
const STATIC_MODEL_CATALOG = {
  cloudflare: [
    '@cf/meta/llama-3.1-8b-instruct',
    '@cf/meta/llama-3.3-70b-instruct',
    '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
    '@cf/mistral/mistral-7b-instruct-v0.2',
    '@cf/qwen/qwen1.5-14b-chat-awq',
  ],
  gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
  anthropic: ['claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest', 'claude-3-opus-latest'],
  custom: [],
  ...Object.fromEntries(
    Object.entries(PROVIDER_REGISTRY).map(([id, config]) => [id, config.models || []])
  ),
};

function normalizeProviderId(provider) {
  const id = String(provider || '').toLowerCase().trim();
  if (id === 'claude') return 'anthropic';
  if (id === 'google') return 'gemini';
  if (id === 'openai-compatible') return 'custom';
  return id;
}

function modelBaseUrl(provider, baseUrl) {
  if (baseUrl) {
    return baseUrl
      .replace(/\/+$/, '')
      .replace(/\/chat\/completions$/, '')
      .replace(/\/models$/, '');
  }
  return PROVIDER_BASES[provider] || '';
}

/** Normalise the many shapes of provider /models responses into sorted ids. */
function modelsFromPayload(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.models || payload?.result || [];
  if (!Array.isArray(list)) return [];
  const ids = list
    .map((item) => {
      if (typeof item === 'string') return item;
      return item?.id || item?.name || item?.model || item?.slug || '';
    })
    .map((id) => String(id || '').replace(/^models\//, '').trim())
    .filter(Boolean);
  return [...new Set(ids)].sort((a, b) => a.localeCompare(b));
}

/**
 * Fetch the live model list for a provider. Never throws — returns
 * `{ models, error, latencyMs }`.
 */
async function fetchProviderModels({ provider, apiKey = '', baseUrl = '', env = {} }) {
  const started = Date.now();
  const id = normalizeProviderId(provider);

  try {
    if (id === 'cloudflare') {
      const token = apiKey || env.CLOUDFLARE_API_TOKEN || '';
      const accountId = env.CLOUDFLARE_ACCOUNT_ID || '';
      if (!token) throw new Error('Cloudflare API token is required for live model discovery');
      if (!accountId) throw new Error('CLOUDFLARE_ACCOUNT_ID is not configured on the gateway');
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/models/search?per_page=100&page=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload.success === false) {
        throw new Error(payload?.errors?.[0]?.message || `Cloudflare error (${res.status})`);
      }
      return { models: modelsFromPayload(payload.result), latencyMs: Date.now() - started };
    }

    if (id === 'gemini') {
      const key = apiKey || env.GEMINI_API_KEY || '';
      if (!key) throw new Error('Gemini API key is required');
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${encodeURIComponent(key)}`
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error?.message || `Gemini error (${res.status})`);
      const list = Array.isArray(payload.models) ? payload.models : [];
      const models = [
        ...new Set(
          list
            .filter(
              (m) =>
                !Array.isArray(m.supportedGenerationMethods) ||
                m.supportedGenerationMethods.includes('generateContent')
            )
            .map((m) => String(m.name || m.id || '').replace(/^models\//, ''))
            .filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b));
      if (!models.length) throw new Error('Gemini returned no text-generation models');
      return { models, latencyMs: Date.now() - started };
    }

    if (id === 'anthropic') {
      const key = apiKey || env.ANTHROPIC_API_KEY || '';
      if (!key) throw new Error('Anthropic API key is required');
      const res = await fetch('https://api.anthropic.com/v1/models?limit=100', {
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error?.message || `Anthropic error (${res.status})`);
      const models = modelsFromPayload(payload);
      if (!models.length) throw new Error('Anthropic returned an empty model list');
      return { models, latencyMs: Date.now() - started };
    }

    if (id === 'azure') {
      throw new Error(
        'Azure OpenAI does not expose a models list — enter your deployment name manually.'
      );
    }

    const base = modelBaseUrl(id, baseUrl);
    if (!base) throw new Error(`Unknown provider: ${id || '(none)'}`);

    const headers = {};
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
    const res = await fetch(`${base}/models`, { headers });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(payload?.error?.message || payload?.message || `Provider error (${res.status})`);
    }
    const models = modelsFromPayload(payload);
    if (!models.length) throw new Error('Provider returned an empty model list');
    return { models, latencyMs: Date.now() - started };
  } catch (err) {
    return {
      models: [],
      error: err?.message || 'Model discovery failed',
      latencyMs: Date.now() - started,
    };
  }
}

async function handleValidateKey(request, env) {
  const body = await request.json().catch(() => ({}));
  const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
  const provider = normalizeProviderId(has('provider') ? body.provider : request.headers.get('X-AI-Provider'));
  const apiKey = has('apiKey') ? (body.apiKey || '') : (request.headers.get('X-AI-Key') || '');
  const baseUrl = has('baseUrl') ? (body.baseUrl || '') : (request.headers.get('X-AI-Base-Url') || '');
  const model = body.model || '';

  if (!provider) {
    return { data: { valid: false, error: 'provider is required' }, status: 400 };
  }

  const needsKey = !KEYLESS_PROVIDERS.has(provider);
  if (needsKey && !apiKey && !baseUrl) {
    return {
      data: { valid: false, error: `An API key is required for ${provider}` },
      status: 200,
    };
  }

  const live = await fetchProviderModels({ provider, apiKey, baseUrl, env });
  const fallback = STATIC_MODEL_CATALOG[provider] || [];
  const models = live.models.length ? live.models : fallback;

  // Some OpenAI-compatible endpoints (notably Azure deployments, some
  // proxies) don't expose /models. Verify those with a 1-token completion
  // so "Test connection" still gives a real answer.
  const canProbe =
    live.models.length === 0 &&
    !['cloudflare', 'gemini', 'anthropic'].includes(provider) &&
    (apiKey || KEYLESS_PROVIDERS.has(provider));
  let probeSucceeded = false;
  let probeError = '';
  if (canProbe) {
    try {
      await generateOpenAICompatible(
        provider,
        { apiKey, model: model || DEFAULT_MODELS[provider] || '', baseUrl },
        [{ role: 'user', content: 'Reply with OK.' }],
        { maxTokens: 1, temperature: 0 }
      );
      probeSucceeded = true;
    } catch (probeFailure) {
      probeError = probeFailure?.message || 'Chat probe failed';
    }
  }

  const valid = live.models.length > 0 || probeSucceeded;
  const modelAvailable = !model || models.length === 0 || models.includes(model);

  let warning;
  if (live.error) {
    warning = probeSucceeded
      ? `Models list unavailable (${live.error}); verified with a 1-token completion instead.`
      : live.error;
  }

  return {
    data: {
      valid,
      provider,
      models,
      modelCount: models.length,
      source: live.models.length ? 'live' : (probeSucceeded ? 'chat-probe' : 'static'),
      latencyMs: live.latencyMs,
      modelAvailable,
      ...(warning ? { warning } : {}),
      ...(!valid ? { error: probeError || live.error || 'Connection failed' } : {}),
    },
    status: 200,
  };
}

async function handleModels(request, url, env) {
  let provider = normalizeProviderId(url.searchParams.get('provider') || '');
  let apiKey = url.searchParams.get('apiKey') || request.headers.get('X-AI-Key') || '';
  let baseUrl = url.searchParams.get('baseUrl') || request.headers.get('X-AI-Base-Url') || '';

  if (request.method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
    // Explicit body fields win — never fall back to the active provider's
    // BYOK headers when testing a different endpoint.
    if (has('provider')) provider = normalizeProviderId(body.provider);
    if (has('apiKey')) apiKey = body.apiKey || '';
    if (has('baseUrl')) baseUrl = body.baseUrl || '';
  }

  if (!provider || provider === 'all') {
    return { data: { models: STATIC_MODEL_CATALOG, source: 'static' }, status: 200 };
  }

  const fallback = STATIC_MODEL_CATALOG[provider] || [];
  const needsKey = !KEYLESS_PROVIDERS.has(provider);
  if (needsKey && !apiKey && !baseUrl) {
    return {
      data: {
        provider,
        models: fallback,
        source: 'static',
        count: fallback.length,
        warning: `Add an API key to fetch live ${provider} models`,
      },
      status: 200,
    };
  }

  const live = await fetchProviderModels({ provider, apiKey, baseUrl, env });
  if (live.models.length > 0) {
    return {
      data: {
        provider,
        models: live.models,
        source: 'live',
        count: live.models.length,
        latencyMs: live.latencyMs,
      },
      status: 200,
    };
  }

  return {
    data: {
      provider,
      models: fallback,
      source: 'static',
      count: fallback.length,
      latencyMs: live.latencyMs,
      ...(live.error ? { warning: live.error } : {}),
    },
    status: 200,
  };
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

// Extension path: verify native D1 JWT, then idempotently insert into D1 `tracked_jobs`.
async function handleJobsTrack(request, env) {
  if (!env.DB) return { data: { error: 'Cloudflare D1 database is not bound' }, status: 503 };

  const auth = await authenticateRequest(request, env);
  if (!auth) {
    return { data: { error: 'Authentication required. Paste your CareerPilot token in the extension settings.' }, status: 401 };
  }

  const body = await request.json().catch(() => ({}));
  if (!body.title || !body.company) return { data: { error: 'title and company are required' }, status: 400 };

  const userId = auth.user.id;
  const jobId = body.jobId || `${body.company}::${body.title}`.toLowerCase().slice(0, 180);

  const existing = await env.DB.prepare(
    `SELECT * FROM tracked_jobs WHERE user_id = ? AND job_id = ?`
  )
    .bind(userId, jobId)
    .first();

  if (existing) {
    return {
      data: { success: true, alreadyTracked: true, trackedJob: existing, data: existing },
      status: 200,
    };
  }

  const id = body.id || crypto.randomUUID();
  const now = new Date().toISOString();
  const applyLink = body.applyLink || body.jobUrl || body.url || '';
  const notesArray = Array.isArray(body.notes)
    ? body.notes
    : (typeof body.notes === 'string' && body.notes.trim()
      ? [{ content: body.notes.trim(), createdAt: now }]
      : []);
  const doc = {
    description: body.description || '',
    jobType: body.jobType || 'Full-time',
    applyLink,
    notes: notesArray,
    source: 'extension',
  };

  await env.DB.prepare(
    `INSERT INTO tracked_jobs (
       id, user_id, job_id, company, title, location, status, salary, job_url,
       notes, applied_date, applied_at, last_activity_at, raw_data, data, updated_at
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
  )
    .bind(
      id,
      userId,
      jobId,
      body.company,
      body.title,
      body.location || 'Remote',
      body.status || 'saved',
      body.salary || '',
      applyLink,
      notesArray[0]?.content || '',
      body.status === 'applied' ? now : null,
      body.status === 'applied' ? now : null,
      now,
      JSON.stringify(body),
      JSON.stringify(doc)
    )
    .run();

  const trackedJob = await env.DB.prepare(`SELECT * FROM tracked_jobs WHERE id = ?`).bind(id).first();
  return {
    data: { success: true, alreadyTracked: false, trackedJob, data: trackedJob },
    status: 201,
  };
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
  const expire = Math.floor(Date.now() / 1000) + 1800;
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
  let fallbackFileName = '';

  if (contentType.includes('multipart/form-data')) {
    forwardFormData = await request.formData();
    const fileObj = forwardFormData.get('file');
    if (!fileObj) {
      return { data: { error: 'file is required' }, status: 400 };
    }
    if (typeof fileObj.size === 'number' && fileObj.size > 10 * 1024 * 1024) {
      return { data: { error: 'File size exceeds maximum allowed limit of 10MB' }, status: 413 };
    }
    if (typeof fileObj === 'object' && fileObj.name) {
      fallbackFileName = String(fileObj.name);
    }
  } else {
    const body = await request.json().catch(() => ({}));
    if (!body.file || !body.fileName) {
      return { data: { error: 'file and fileName are required' }, status: 400 };
    }
    if (typeof body.file === 'string' && body.file.length > 14 * 1024 * 1024) {
      return { data: { error: 'File size exceeds maximum allowed limit of 10MB' }, status: 413 };
    }
    forwardFormData = new FormData();
    forwardFormData.append('file', body.file);
    forwardFormData.append('fileName', body.fileName);
    if (body.folder) forwardFormData.append('folder', body.folder);
    if (body.tags) forwardFormData.append('tags', Array.isArray(body.tags) ? body.tags.join(',') : body.tags);
  }

  const rawFileName = String(forwardFormData.get('fileName') || fallbackFileName || '');
  const cleanFileName = rawFileName.replace(/[/\\?%*:|"<>]/g, '-').replace(/\.\./g, '').slice(0, 100);
  forwardFormData.set('fileName', cleanFileName);
  const fileName = cleanFileName.toLowerCase();
  const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.pdf', '.doc', '.docx', '.txt'];
  const hasValidExt = ALLOWED_EXTS.some((ext) => fileName.endsWith(ext));
  if (!hasValidExt) {
    return { data: { error: 'Invalid file format. Allowed: PDF, DOC, DOCX, TXT, PNG, JPG, WEBP, GIF' }, status: 400 };
  }

  const basicAuth = btoa(`${privateKey}:`);
  const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: `Basic ${basicAuth}` },
    body: forwardFormData,
  });

  const ikData = await ikRes.json().catch(() => ({}));
  if (!ikRes.ok) {
    return { data: { error: ikData.message || 'ImageKit upload failed' }, status: ikRes.status };
  }

  if (env.DB) {
    try {
      const auth = await authenticateRequest(request, env).catch(() => null);
      const fileId = ikData.fileId || crypto.randomUUID();
      const userId = auth?.user?.id || request.headers.get('X-User-Id') || 'anonymous';
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

// Fire-and-forget D1 usage logging
async function logUsage(env, entry) {
  if (!env.DB) return;
  try {
    await env.DB.prepare(
      `INSERT INTO ai_usage (user_id, feature, provider, model, prompt_tokens, completion_tokens, input_tokens, output_tokens, latency_ms, byok)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        entry.user_id || 'anonymous',
        entry.feature || 'unknown',
        entry.provider || 'cloudflare',
        entry.model || '',
        entry.input_tokens || 0,
        entry.output_tokens || 0,
        entry.input_tokens || 0,
        entry.output_tokens || 0,
        entry.latency_ms || 0,
        entry.byok ? 1 : 0
      )
      .run();
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
      if ((request.method === 'GET' || request.method === 'HEAD') && (path === '/v1/health' || path === '/health')) {
        let d1Ready = false;
        let tables = 0;
        if (env.DB) {
          try {
            const row = await env.DB.prepare(
              `SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name NOT LIKE '_cf_%' AND name != 'sqlite_sequence'`
            ).first();
            tables = row?.cnt ?? 0;
            d1Ready = true;
          } catch {
            d1Ready = false;
          }
        }
        return json(
          {
            ok: true,
            service: 'careerpilot-gateway',
            database: 'cloudflare-d1',
            d1: d1Ready,
            tables,
            auth: d1Ready,
            imagekit: Boolean(env.IMAGEKIT_PRIVATE_KEY),
          },
          200,
          cors
        );
      }

      if (path.startsWith('/v1/auth/')) {
        const authResult = await handleAuthRoutes(request, env, url, path);
        if (authResult?.redirect) {
          return Response.redirect(authResult.redirect, 302);
        }
        if (authResult) {
          return json(authResult.data, authResult.status, cors);
        }
      }

      if (path.startsWith('/v1/db/')) {
        const dbResult = await handleD1Routes(request, env, url, path);
        if (dbResult) {
          return json(dbResult.data, dbResult.status, cors);
        }
      }

      let result;
      if (
        (request.method === 'GET' || request.method === 'HEAD' || request.method === 'POST') &&
        path === '/v1/ai/models'
      ) {
        result = await handleModels(request, url, env);
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
      } else {
        result = { data: { error: 'Not found' }, status: 404 };
      }

      return json(result.data, result.status, cors);
    } catch (err) {
      return json({ error: err.message || 'Gateway error' }, 500, cors);
    }
  },
};
