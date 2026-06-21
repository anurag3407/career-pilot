import { create } from 'zustand';
import { encryptKey, decryptKey } from '../utils/encryption';
import logger from '../utils/logger';
// ---------------------------------------------------------------------------
// Provider metadata – UI labels, default models, key URLs, etc.
// ---------------------------------------------------------------------------
export const PROVIDER_META = {
  gemini: {
    name: 'Google Gemini',
    tagline: 'Fast & affordable — free tier available',
    icon: '🔮',
    keyUrl: 'https://aistudio.google.com/apikey',
    defaultModel: 'gemini-2.5-flash',
    color: 'blue',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
  },
  openai: {
    name: 'OpenAI',
    tagline: 'GPT-4o, o1, and more',
    icon: '🧠',
    keyUrl: 'https://platform.openai.com/api-keys',
    defaultModel: 'gpt-4o-mini',
    color: 'emerald',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'o1-mini'],
  },
  openrouter: {
    name: 'OpenRouter',
    tagline: '100+ models, one API key',
    icon: '🌐',
    keyUrl: 'https://openrouter.ai/keys',
    defaultModel: 'openai/gpt-4o-mini',
    color: 'violet',
    models: [], // Fetched dynamically
  },
  groq: {
    name: 'Groq',
    tagline: 'Ultra-fast inference — Llama & Mixtral',
    icon: '⚡',
    keyUrl: 'https://console.groq.com/keys',
    defaultModel: 'llama-3.3-70b-versatile',
    color: 'amber',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'aiConfig_v2';

const defaultProviderEntry = () => ({
  apiKey: '',
  model: '',
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
    logger.error('[useAIConfigStore] Failed to persist:', e);
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
    logger.error('[useAIConfigStore] Legacy migration failed:', e);
    return null;
  }
};

/** Load initial state from localStorage (v2) or migrate from legacy. */
const hydrate = () => {
  const defaults = { activeProvider: '', providers: {} };

  try {
    // First, try the v2 format
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        activeProvider: parsed.activeProvider || '',
        providers: parsed.providers || {},
      };
    }

    // Fall back to legacy migration
    const migrated = migrateFromLegacy();
    if (migrated) {
      // Persist migrated data in v2 format immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch (e) {
    logger.error('[useAIConfigStore] Hydration failed:', e);
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
    const { activeProvider, providers } = get();
    if (!activeProvider) return null;

    const entry = providers[activeProvider];
    if (!entry || !entry.apiKey) return null;

    return {
      provider: activeProvider,
      apiKey: decryptKey(entry.apiKey),
      model: entry.model || PROVIDER_META[activeProvider]?.defaultModel || '',
    };
  },

  /**
   * Returns an array of provider names that have an apiKey set.
   */
  getConfiguredProviders: () => {
    const { providers } = get();
    return Object.keys(providers).filter((key) => !!providers[key]?.apiKey);
  },
}));
