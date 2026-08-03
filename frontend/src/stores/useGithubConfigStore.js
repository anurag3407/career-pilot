import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptKey, decryptKey } from '../utils/encryption';

/**
 * GitHub BYOK configuration store.
 *
 * Holds the user's encrypted GitHub Personal Access Token (PAT) in
 * localStorage. The token is decrypted on-demand when an API call is made
 * (see services/api.js#getAuthHeaders).
 *
 * `oauthConnected` and `oauthLogin` are server-derived status flags — they
 * indicate whether the user has completed the OAuth flow, which stores a
 * different token server-side.
 */
export const useGithubConfigStore = create(
  persist(
    (set, get) => ({
      // PAT (encrypted in localStorage; never sent over the wire in plain)
      token: '',
      validated: false,
      validatedLogin: '',
      validatedAt: null,
      scopes: [],

      // OAuth status (server-managed)
      oauthConnected: false,
      oauthLogin: '',
      oauthConnectedAt: null,

      // UI state
      isValidating: false,
      validationError: null,

      setToken: (plainToken) => {
        const encrypted = plainToken ? encryptKey(plainToken) : '';
        set({
          token: encrypted,
          validated: false,
          validatedLogin: '',
          validatedAt: null,
          scopes: [],
          validationError: null,
        });
      },

      markValidated: ({ login, scopes }) =>
        set({
          validated: true,
          validatedLogin: login || '',
          validatedAt: Date.now(),
          scopes: scopes || [],
          validationError: null,
          isValidating: false,
        }),

      setValidating: (v) => set({ isValidating: v, validationError: null }),

      setValidationError: (msg) =>
        set({ validationError: msg, isValidating: false, validated: false }),

      clear: () =>
        set({
          token: '',
          validated: false,
          validatedLogin: '',
          validatedAt: null,
          scopes: [],
          validationError: null,
        }),

      setOauthStatus: ({ connected, login, connectedAt }) =>
        set({
          oauthConnected: !!connected,
          oauthLogin: login || '',
          oauthConnectedAt: connectedAt || null,
        }),

      disconnectOauth: () =>
        set({ oauthConnected: false, oauthLogin: '', oauthConnectedAt: null }),

      /**
       * Returns the plaintext PAT for the current request, or null if absent.
       * Safe to call on every API call — decryption is cheap.
       */
      getDecryptedToken: () => {
        const encrypted = get().token;
        if (!encrypted) return null;
        try {
          return decryptKey(encrypted) || null;
        } catch (err) {
          console.error('[useGithubConfigStore] decrypt failed:', err);
          return null;
        }
      },
    }),
    {
      name: 'github-config-v1',
      partialize: (s) => ({
        token: s.token,
        validated: s.validated,
        validatedLogin: s.validatedLogin,
        validatedAt: s.validatedAt,
        scopes: s.scopes,
        oauthConnected: s.oauthConnected,
        oauthLogin: s.oauthLogin,
        oauthConnectedAt: s.oauthConnectedAt,
      }),
    }
  )
);