import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { encryptKey } from '../utils/encryption';
import { useAIConfigStore } from '../stores/useAIConfigStore';
import { aiApi } from '../services/api';

export default function OpenRouterCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing authorization...');
  const [error, setError] = useState(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (isProcessing.current) return;
    
    const processCallback = async () => {
      isProcessing.current = true;
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const err = searchParams.get('error');

      if (err) {
        setError(`Authentication failed: ${err}`);
        return;
      }

      if (!code) {
        setError('No authorization code found in callback URL.');
        return;
      }

      const codeVerifier = sessionStorage.getItem('or_code_verifier') || localStorage.getItem('or_code_verifier');
      if (!codeVerifier) {
        setError('Session expired or missing code verifier. Please try connecting again from Settings.');
        return;
      }

      try {
        setStatus('Exchanging authorization code for API key...');
        let apiKey = null;

        // Try direct browser fetch first
        try {
          const response = await fetch('https://openrouter.ai/api/v1/auth/keys', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              code: code,
              code_verifier: codeVerifier,
              code_challenge_method: 'S256'
            })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.key) {
              apiKey = data.key;
            }
          }
        } catch (directErr) {
          console.warn('Direct OAuth key exchange failed, trying backend proxy fallback:', directErr);
        }

        // Backend fallback if direct fetch failed or returned no key
        if (!apiKey) {
          const res = await aiApi.openRouterOAuthExchange(code, codeVerifier);
          if (res && res.key) {
            apiKey = res.key;
          } else if (res && res.error) {
            throw new Error(res.error);
          }
        }

        if (apiKey) {
          // Update Zustand Store (v2 format)
          const store = useAIConfigStore.getState();
          store.setProviderKey('openrouter', apiKey);
          store.setProviderModel('openrouter', 'openai/gpt-4o-mini');
          store.markValidated('openrouter', true);
          store.setActiveProvider('openrouter');

          // Legacy storage fallback
          const encryptedKey = encryptKey(apiKey);
          localStorage.setItem('openRouterApiKey', encryptedKey);
          localStorage.setItem('aiConfig', JSON.stringify({
            provider: 'openrouter',
            apiKey: encryptedKey,
            model: 'openai/gpt-4o-mini'
          }));

          // Clean up session storage
          sessionStorage.removeItem('or_code_verifier');
          localStorage.removeItem('or_code_verifier');

          setStatus('Successfully connected OpenRouter! Redirecting to Settings...');
          setTimeout(() => navigate('/settings'), 1200);
        } else {
          throw new Error('Failed to retrieve API key from OpenRouter. Please try again.');
        }
      } catch (e) {
        setError(e.message || 'An error occurred during OpenRouter authentication');
      }
    };

    processCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center max-w-md w-full">
        <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto mb-4 text-2xl">
          🌐
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">OpenRouter Authorization</h2>
        {error ? (
          <div className="text-red-500 my-4 space-y-4">
            <p className="text-sm bg-red-50 dark:bg-red-950/40 p-3 rounded-lg border border-red-200 dark:border-red-900">{error}</p>
            <button 
              onClick={() => navigate('/settings')} 
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Back to Settings
            </button>
          </div>
        ) : (
          <div className="text-gray-600 dark:text-gray-300 py-4 space-y-4">
            <p className="text-base">{status}</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
