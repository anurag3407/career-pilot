import { create } from 'zustand';
import { encryptKey, decryptKey } from '../utils/encryption';

// ---------------------------------------------------------------------------
// Provider metadata – UI labels, default models, key URLs, etc.
// ---------------------------------------------------------------------------
// `category` drives the grouping in Settings:
//   popular → most-used providers
//   hosted  → OpenAI-compatible APIs
//   local   → self-hosted runtimes, no API key required
//   custom  → any OpenAI-compatible endpoint
export const PROVIDER_CATEGORIES = [
  { id: 'popular', label: 'Popular providers' },
  { id: 'hosted', label: 'More hosted providers' },
  { id: 'local', label: 'Local & self-hosted' },
  { id: 'custom', label: 'Custom endpoint' },
];

export const PROVIDER_META = {
  // ---------------------------------------------------------------- popular
  cloudflare: {
    name: 'Cloudflare AI',
    tagline: 'Fast, serverless edge AI (Meta Llama 3.1 & DeepSeek)',
    icon: '⚡',
    keyUrl: 'https://dash.cloudflare.com/profile/api-tokens',
    defaultModel: '@cf/meta/llama-3.1-8b-instruct',
    category: 'popular',
    color: 'orange',
    models: [
      { id: '@cf/meta/llama-3.1-8b-instruct', name: 'Meta: Llama 3.1 8B Instruct (Free)', isFree: true, price: 'Free' },
      { id: '@cf/meta/llama-3.3-70b-instruct', name: 'Meta: Llama 3.3 70B Instruct (Free)', isFree: true, price: 'Free' },
      { id: '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b', name: 'DeepSeek: R1 Distill Qwen 32B (Free)', isFree: true, price: 'Free' },
      { id: '@cf/mistral/mistral-7b-instruct-v0.2', name: 'Mistral: 7B Instruct v0.2 (Free)', isFree: true, price: 'Free' },
      { id: '@cf/qwen/qwen1.5-14b-chat-awq', name: 'Qwen: 1.5 14B Chat AWQ (Free)', isFree: true, price: 'Free' },
    ],
  },
  openai: {
    name: 'OpenAI',
    tagline: 'GPT-4o, GPT-4.1, o3-mini and more',
    icon: '🧠',
    keyUrl: 'https://platform.openai.com/api-keys',
    defaultModel: 'gpt-4o-mini',
    baseUrl: 'https://api.openai.com/v1',
    category: 'popular',
    color: 'emerald',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini', 'gpt-4.1', 'o3-mini', 'o1-mini'],
  },
  anthropic: {
    name: 'Anthropic Claude',
    tagline: 'Claude Haiku, Sonnet & Opus — long context, great writing',
    icon: '🎭',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    defaultModel: 'claude-3-5-haiku-latest',
    category: 'popular',
    color: 'amber',
    models: ['claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest', 'claude-3-opus-latest'],
  },
  gemini: {
    name: 'Google Gemini',
    tagline: 'Fast & affordable — free tier available',
    icon: '🔮',
    keyUrl: 'https://aistudio.google.com/apikey',
    defaultModel: 'gemini-2.5-flash',
    category: 'popular',
    color: 'blue',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
  },
  openrouter: {
    name: 'OpenRouter',
    tagline: '100+ models, one API key',
    icon: '🌐',
    keyUrl: 'https://openrouter.ai/keys',
    defaultModel: 'openai/gpt-4o-mini',
    baseUrl: 'https://openrouter.ai/api/v1',
    category: 'popular',
    color: 'violet',
    models: [
      { id: 'google/gemini-2.0-flash-exp:free', name: 'Google: Gemini 2.0 Flash (Free)', isFree: true, price: 'Free' },
      { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Meta: Llama 3.3 70B (Free)', isFree: true, price: 'Free' },
      { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek: R1 (Free)', isFree: true, price: 'Free' },
      { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek: V3 (Free)', isFree: true, price: 'Free' },
      { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen: 2.5 Coder 32B (Free)', isFree: true, price: 'Free' },
      { id: 'openai/gpt-4o-mini', name: 'OpenAI: GPT-4o Mini', isFree: false, price: '$0.15 / 1M prompt' },
      { id: 'openai/gpt-4o', name: 'OpenAI: GPT-4o', isFree: false, price: '$2.50 / 1M prompt' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Anthropic: Claude 3.5 Sonnet', isFree: false, price: '$3.00 / 1M prompt' },
      { id: 'anthropic/claude-3-haiku', name: 'Anthropic: Claude 3 Haiku', isFree: false, price: '$0.25 / 1M prompt' },
      { id: 'google/gemini-2.5-flash', name: 'Google: Gemini 2.5 Flash', isFree: false, price: '$0.15 / 1M prompt' },
      { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Meta: Llama 3.3 70B Instruct', isFree: false, price: '$0.70 / 1M prompt' },
      { id: 'mistralai/mistral-large-2411', name: 'Mistral: Mistral Large 2411', isFree: false, price: '$2.00 / 1M prompt' }
    ],
  },
  groq: {
    name: 'Groq',
    tagline: 'Ultra-fast inference — Llama & Gemma',
    icon: '🏎️',
    keyUrl: 'https://console.groq.com/keys',
    defaultModel: 'llama-3.3-70b-versatile',
    baseUrl: 'https://api.groq.com/openai/v1',
    category: 'popular',
    color: 'amber',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
  },
  deepseek: {
    name: 'DeepSeek',
    tagline: 'DeepSeek V3 & R1 reasoning at low cost',
    icon: '🐋',
    keyUrl: 'https://platform.deepseek.com/api_keys',
    defaultModel: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com/v1',
    category: 'popular',
    color: 'blue',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  mistral: {
    name: 'Mistral AI',
    tagline: 'Mistral Large, Small & Codestral',
    icon: '🌬️',
    keyUrl: 'https://console.mistral.ai/api-keys',
    defaultModel: 'mistral-large-latest',
    baseUrl: 'https://api.mistral.ai/v1',
    category: 'popular',
    color: 'orange',
    models: ['mistral-large-latest', 'mistral-small-latest', 'codestral-latest', 'open-mistral-nemo'],
  },
  xai: {
    name: 'xAI Grok',
    tagline: 'Grok models from xAI',
    icon: '🛰️',
    keyUrl: 'https://console.x.ai',
    defaultModel: 'grok-3',
    baseUrl: 'https://api.x.ai/v1',
    category: 'popular',
    color: 'slate',
    models: ['grok-3', 'grok-3-mini', 'grok-2-latest', 'grok-2-vision-latest'],
  },

  // ----------------------------------------------------------------- hosted
  together: {
    name: 'Together AI',
    tagline: 'Open-source models at scale',
    icon: '🤝',
    keyUrl: 'https://api.together.ai/settings/api-keys',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    baseUrl: 'https://api.together.xyz/v1',
    category: 'hosted',
    models: [
      'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
      'Qwen/Qwen2.5-72B-Instruct-Turbo',
      'deepseek-ai/DeepSeek-V3',
    ],
  },
  fireworks: {
    name: 'Fireworks AI',
    tagline: 'Fast open-source model hosting',
    icon: '🎆',
    keyUrl: 'https://fireworks.ai/account/api-keys',
    defaultModel: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    category: 'hosted',
    models: [
      'accounts/fireworks/models/llama-v3p3-70b-instruct',
      'accounts/fireworks/models/deepseek-v3',
      'accounts/fireworks/models/qwen2p5-72b-instruct',
    ],
  },
  perplexity: {
    name: 'Perplexity',
    tagline: 'Sonar models with live web search',
    icon: '🔎',
    keyUrl: 'https://www.perplexity.ai/settings/api',
    defaultModel: 'sonar',
    baseUrl: 'https://api.perplexity.ai',
    category: 'hosted',
    models: ['sonar', 'sonar-pro', 'sonar-reasoning', 'sonar-reasoning-pro'],
  },
  cohere: {
    name: 'Cohere',
    tagline: 'Command R models for enterprise RAG',
    icon: '🧵',
    keyUrl: 'https://dashboard.cohere.com/api-keys',
    defaultModel: 'command-r-plus',
    baseUrl: 'https://api.cohere.ai/compatibility/v1',
    category: 'hosted',
    models: ['command-r-plus', 'command-r', 'command-light'],
  },
  cerebras: {
    name: 'Cerebras',
    tagline: 'Wafer-scale inference, very low latency',
    icon: '🧩',
    keyUrl: 'https://cloud.cerebras.ai',
    defaultModel: 'llama-3.3-70b',
    baseUrl: 'https://api.cerebras.ai/v1',
    category: 'hosted',
    models: ['llama-3.3-70b', 'llama3.1-8b'],
  },
  sambanova: {
    name: 'SambaNova',
    tagline: 'Fast Llama & DeepSeek inference',
    icon: '🏔️',
    keyUrl: 'https://cloud.sambanova.ai/apis',
    defaultModel: 'Meta-Llama-3.3-70B-Instruct',
    baseUrl: 'https://api.sambanova.ai/v1',
    category: 'hosted',
    models: ['Meta-Llama-3.3-70B-Instruct', 'Meta-Llama-3.1-8B-Instruct', 'DeepSeek-R1'],
  },
  hyperbolic: {
    name: 'Hyperbolic',
    tagline: 'Affordable open-model inference',
    icon: '♾️',
    keyUrl: 'https://app.hyperbolic.xyz/settings',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
    baseUrl: 'https://api.hyperbolic.xyz/v1',
    category: 'hosted',
    models: [
      'meta-llama/Llama-3.3-70B-Instruct',
      'Qwen/Qwen2.5-72B-Instruct',
      'deepseek-ai/DeepSeek-R1',
    ],
  },
  novita: {
    name: 'Novita AI',
    tagline: 'Open models with GPU pricing',
    icon: '✨',
    keyUrl: 'https://novita.ai/settings/key-management',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct',
    baseUrl: 'https://api.novita.ai/v3/openai',
    category: 'hosted',
    models: [
      'meta-llama/llama-3.3-70b-instruct',
      'deepseek/deepseek-r1',
      'qwen/qwen-2.5-72b-instruct',
    ],
  },
  moonshot: {
    name: 'Moonshot (Kimi)',
    tagline: 'Kimi models with long context',
    icon: '🌙',
    keyUrl: 'https://platform.moonshot.ai/console/api-keys',
    defaultModel: 'moonshot-v1-8k',
    baseUrl: 'https://api.moonshot.ai/v1',
    category: 'hosted',
    models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
  },
  zhipu: {
    name: 'Zhipu GLM',
    tagline: 'GLM-4 family from Zhipu AI',
    icon: '🧭',
    keyUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
    defaultModel: 'glm-4-flash',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    category: 'hosted',
    models: ['glm-4-flash', 'glm-4-plus', 'glm-4-air'],
  },
  dashscope: {
    name: 'Alibaba Qwen',
    tagline: 'Qwen models via DashScope',
    icon: '🐉',
    keyUrl: 'https://dashscope.console.aliyun.com/apiKey',
    defaultModel: 'qwen-plus',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    category: 'hosted',
    models: ['qwen-plus', 'qwen-max', 'qwen-turbo', 'qwen2.5-coder-32b-instruct'],
  },
  nebius: {
    name: 'Nebius AI Studio',
    tagline: 'Open models on Nebius GPUs',
    icon: '☁️',
    keyUrl: 'https://studio.nebius.ai',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
    baseUrl: 'https://api.studio.nebius.ai/v1',
    category: 'hosted',
    models: [
      'meta-llama/Llama-3.3-70B-Instruct',
      'deepseek-ai/DeepSeek-V3',
      'Qwen/Qwen2.5-72B-Instruct',
    ],
  },
  chutes: {
    name: 'Chutes',
    tagline: 'Serverless open-model inference',
    icon: '🪂',
    keyUrl: 'https://chutes.ai/app/api',
    defaultModel: 'deepseek-ai/DeepSeek-V3',
    baseUrl: 'https://llm.chutes.ai/v1',
    category: 'hosted',
    models: ['deepseek-ai/DeepSeek-V3', 'deepseek-ai/DeepSeek-R1', 'chutesai/Llama-3.3-70B-Instruct'],
  },
  github: {
    name: 'GitHub Models',
    tagline: 'Models hosted by GitHub with a PAT',
    icon: '🐙',
    keyUrl: 'https://github.com/settings/tokens',
    defaultModel: 'openai/gpt-4o-mini',
    baseUrl: 'https://models.github.ai/inference',
    category: 'hosted',
    models: [
      'openai/gpt-4o-mini',
      'openai/gpt-4o',
      'meta/Llama-3.3-70B-Instruct',
      'mistral-ai/Mistral-Large-2411',
    ],
  },
  requesty: {
    name: 'Requesty',
    tagline: 'Multi-model router (OpenAI-compatible)',
    icon: '🧳',
    keyUrl: 'https://app.requesty.ai/api-keys',
    defaultModel: 'openai/gpt-4o-mini',
    baseUrl: 'https://router.requesty.ai/v1',
    category: 'hosted',
    models: [
      'openai/gpt-4o-mini',
      'openai/gpt-4o',
      'anthropic/claude-3-5-sonnet-latest',
      'google/gemini-2.5-flash',
    ],
  },
  azure: {
    name: 'Azure OpenAI',
    tagline: 'Your own Azure deployment — base URL required',
    icon: '🔷',
    keyUrl: 'https://portal.azure.com',
    defaultModel: 'gpt-4o-mini',
    baseUrl: '',
    category: 'hosted',
    showBaseUrl: true,
    requiresBaseUrl: true,
    models: ['gpt-4o-mini'],
    hint: 'Paste your deployment URL, e.g. https://my-resource.openai.azure.com/openai/deployments/gpt-4o — the gateway appends /chat/completions and api-version.',
  },

  // ------------------------------------------------------------------ local
  ollama: {
    name: 'Ollama',
    tagline: 'Run models locally — no API key needed',
    icon: '🦙',
    keyUrl: '',
    defaultModel: 'llama3.2',
    baseUrl: 'http://localhost:11434/v1',
    category: 'local',
    showBaseUrl: true,
    requiresKey: false,
    models: ['llama3.2', 'llama3.1', 'qwen2.5-coder', 'deepseek-r1', 'mistral'],
    hint: 'Start Ollama with OLLAMA_ORIGINS="*" so the gateway can reach it. Use your LAN/host URL when the gateway runs in the cloud.',
  },
  lmstudio: {
    name: 'LM Studio',
    tagline: 'Local OpenAI-compatible server',
    icon: '🖥️',
    keyUrl: '',
    defaultModel: 'local-model',
    baseUrl: 'http://localhost:1234/v1',
    category: 'local',
    showBaseUrl: true,
    requiresKey: false,
    models: ['local-model'],
    hint: 'In LM Studio, start the local server (Developer → Start Server) and load a model first.',
  },
  vllm: {
    name: 'vLLM',
    tagline: 'Self-hosted high-throughput inference',
    icon: '⚙️',
    keyUrl: '',
    defaultModel: 'local-model',
    baseUrl: 'http://localhost:8000/v1',
    category: 'local',
    showBaseUrl: true,
    requiresKey: false,
    models: ['local-model'],
    hint: 'Point this at your vLLM OpenAI-compatible server, e.g. http://my-gpu-box:8000/v1.',
  },
  llamacpp: {
    name: 'llama.cpp server',
    tagline: 'Self-hosted llama.cpp HTTP server',
    icon: '🧱',
    keyUrl: '',
    defaultModel: 'local-model',
    baseUrl: 'http://localhost:8080/v1',
    category: 'local',
    showBaseUrl: true,
    requiresKey: false,
    models: ['local-model'],
    hint: 'Start llama-server with --api-key if you want the gateway to authenticate.',
  },

  // ----------------------------------------------------------------- custom
  custom: {
    name: 'Custom Endpoint',
    tagline: 'Any OpenAI-compatible API — fetch models & test live',
    icon: '🔌',
    keyUrl: '',
    defaultModel: 'gpt-3.5-turbo',
    baseUrl: '',
    category: 'custom',
    color: 'slate',
    models: [],
    customEndpoint: true,
    showBaseUrl: true,
    requiresKey: false,
    hint: 'Works with LiteLLM, OpenRouter clones, Cloudflare AI Gateway, or any /v1 endpoint. Use Fetch models to pull the live list.',
  },
};

/** Providers grouped by category, preserving declaration order. */
export const PROVIDER_IDS_BY_CATEGORY = PROVIDER_CATEGORIES.reduce((acc, category) => {
  acc[category.id] = Object.keys(PROVIDER_META).filter(
    (id) => PROVIDER_META[id].category === category.id
  );
  return acc;
}, {});

/** True when the provider must be called through its own base URL. */
export const providerNeedsBaseUrl = (providerId) => {
  const meta = PROVIDER_META[providerId];
  return Boolean(meta?.customEndpoint || meta?.requiresBaseUrl);
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'aiConfig_v2';

const defaultProviderEntry = () => ({
  apiKey: '',
  model: '',
  baseUrl: '',
  modelList: [],
  validated: false,
  lastValidated: null,
});

/** Persist current state to localStorage. */
const persist = (state) => {
  try {
    const serializable = {
      activeProvider: state.activeProvider,
      providers: state.providers,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (e) {
    console.error('[useAIConfigStore] Failed to persist:', e);
  }
};

/**
 * Migrate legacy localStorage entries (`aiConfig` and `openRouterApiKey`)
 * into the new v2 format. Returns a partial state object to merge, or null
 * if there is nothing to migrate.
 */
const migrateFromLegacy = () => {
  try {
    const legacyRaw = localStorage.getItem('aiConfig');
    const legacyORKey = localStorage.getItem('openRouterApiKey');

    if (!legacyRaw && !legacyORKey) return null;

    const migrated = { activeProvider: '', providers: {} };

    // Migrate old aiConfig: { provider, apiKey, model }
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (legacy.provider && legacy.apiKey) {
        migrated.activeProvider = legacy.provider;
        migrated.providers[legacy.provider] = {
          apiKey: legacy.apiKey, // already encrypted (or plain – encrypt on next save)
          model: legacy.model || PROVIDER_META[legacy.provider]?.defaultModel || '',
          validated: false,
          lastValidated: null,
        };
      }
    }

    // Migrate standalone openRouterApiKey
    if (legacyORKey) {
      migrated.providers.openrouter = {
        apiKey: legacyORKey,
        model: PROVIDER_META.openrouter.defaultModel,
        validated: false,
        lastValidated: null,
      };
      // If no active provider was set, default to openrouter
      if (!migrated.activeProvider) {
        migrated.activeProvider = 'openrouter';
      }
    }

    // Clean up legacy keys
    localStorage.removeItem('aiConfig');
    localStorage.removeItem('openRouterApiKey');

    return migrated;
  } catch (e) {
    console.error('[useAIConfigStore] Legacy migration failed:', e);
    return null;
  }
};

/** Load initial state from localStorage (v2) or migrate from legacy. */
const hydrate = () => {
  const defaults = { activeProvider: 'cloudflare', providers: {} };

  try {
    // First, try the v2 format
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        activeProvider: parsed.activeProvider || 'cloudflare',
        providers: parsed.providers || {},
      };
    }

    // Fall back to legacy migration
    const migrated = migrateFromLegacy();
    if (migrated) {
      if (!migrated.activeProvider) migrated.activeProvider = 'cloudflare';
      // Persist migrated data in v2 format immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch (e) {
    console.error('[useAIConfigStore] Hydration failed:', e);
  }

  return defaults;
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
const initialState = hydrate();

export const useAIConfigStore = create((set, get) => ({
  // ---- State ----
  activeProvider: initialState.activeProvider,
  providers: initialState.providers,

  // ---- Actions ----

  setActiveProvider: (provider) => {
    set({ activeProvider: provider });
    persist(get());
  },

  setProviderKey: (provider, apiKey) => {
    const encrypted = encryptKey(apiKey);
    set((state) => ({
      providers: {
        ...state.providers,
        [provider]: {
          ...(state.providers[provider] || defaultProviderEntry()),
          apiKey: encrypted,
          // Reset validation when the key changes
          validated: false,
          lastValidated: null,
        },
      },
    }));
    persist(get());
  },

  setProviderModel: (provider, model) => {
    set((state) => ({
      providers: {
        ...state.providers,
        [provider]: {
          ...(state.providers[provider] || defaultProviderEntry()),
          model,
        },
      },
    }));
    persist(get());
  },

  setProviderBaseUrl: (provider, baseUrl) => {
    set((state) => ({
      providers: {
        ...state.providers,
        [provider]: {
          ...(state.providers[provider] || defaultProviderEntry()),
          baseUrl,
        },
      },
    }));
    persist(get());
  },

  /**
   * Cache a live model list fetched from the provider's /models endpoint so
   * the selector stays populated across sessions.
   */
  setProviderModels: (provider, modelList) => {
    set((state) => ({
      providers: {
        ...state.providers,
        [provider]: {
          ...(state.providers[provider] || defaultProviderEntry()),
          modelList: Array.isArray(modelList) ? modelList : [],
        },
      },
    }));
    persist(get());
  },

  markValidated: (provider, isValid) => {
    set((state) => ({
      providers: {
        ...state.providers,
        [provider]: {
          ...(state.providers[provider] || defaultProviderEntry()),
          validated: isValid,
          lastValidated: new Date().toISOString(),
        },
      },
    }));
    persist(get());
  },

  removeProvider: (provider) => {
    set((state) => {
      const { [provider]: _, ...rest } = state.providers;
      return {
        providers: rest,
        // Clear activeProvider if we just removed it
        activeProvider: state.activeProvider === provider ? '' : state.activeProvider,
      };
    });
    persist(get());
  },

  /**
   * Returns { provider, apiKey, model } for the currently active provider.
   * The apiKey is DECRYPTED before returning.
   * Returns null if no active provider is configured.
   */
  getActiveConfig: () => {
    let { activeProvider, providers } = get();
    
    if (!activeProvider) {
      const configuredProviders = Object.keys(providers).filter((key) => {
        const meta = PROVIDER_META[key];
        return !!providers[key]?.apiKey || (meta && meta.requiresKey === false);
      });
      if (configuredProviders.length > 0) {
        activeProvider = configuredProviders[0];
      } else {
        activeProvider = 'cloudflare';
      }
    }

    const entry = providers[activeProvider];
    const meta = PROVIDER_META[activeProvider] || {};
    // Cloudflare AI has platform support on the gateway worker without requiring a BYOK key
    if (activeProvider === 'cloudflare' && (!entry || !entry.apiKey)) {
      return {
        provider: 'cloudflare',
        apiKey: '',
        model: entry?.model || PROVIDER_META.cloudflare?.defaultModel || '@cf/meta/llama-3.1-8b-instruct',
        baseUrl: '',
      };
    }

    // Keyless providers (local runtimes, custom endpoints) work without a key
    const keyless = meta.requiresKey === false;
    const storedBaseUrl = entry?.baseUrl || '';
    const resolvedBaseUrl = storedBaseUrl || (keyless ? meta.baseUrl || '' : '');
    if (keyless && resolvedBaseUrl) {
      return {
        provider: activeProvider,
        apiKey: entry?.apiKey ? decryptKey(entry.apiKey) : '',
        model: entry?.model || meta.defaultModel || '',
        baseUrl: resolvedBaseUrl,
      };
    }
    if (!entry || !entry.apiKey) return null;

    return {
      provider: activeProvider,
      apiKey: decryptKey(entry.apiKey),
      model: entry.model || meta.defaultModel || '',
      baseUrl: resolvedBaseUrl,
    };
  },

  /**
   * Returns an array of provider names that have an apiKey set (or are
   * keyless providers configured with a base URL).
   */
  getConfiguredProviders: () => {
    const { providers } = get();
    return Object.keys(providers).filter((key) => {
      const meta = PROVIDER_META[key];
      if (providers[key]?.apiKey) return true;
      return Boolean(meta && meta.requiresKey === false && (providers[key]?.baseUrl || meta.baseUrl));
    });
  },
}));
