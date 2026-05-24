import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OpenRouterCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const err = searchParams.get('error');

      if (err) {
        setError(`Authentication failed: ${err}`);
        return;
      }

      if (!code) {
        setError('No authorization code found.');
        return;
      }

      const codeVerifier = sessionStorage.getItem('or_code_verifier');
      if (!codeVerifier) {
        setError('Session expired or missing code verifier.');
        return;
      }

      try {
        setStatus('Exchanging code for API key...');
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

        if (!response.ok) {
          throw new Error('Failed to exchange code');
        }

        const data = await response.json();
        if (data.key) {
          localStorage.setItem('openRouterApiKey', data.key);
          setStatus('Success! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          throw new Error('No API key returned');
        }
      } catch (e) {
        setError(e.message || 'An error occurred during authentication');
      }
    };

    processCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">OpenRouter Authorization</h2>
        {error ? (
          <div className="text-red-500 mb-4">
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => navigate('/')} 
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="text-gray-600 dark:text-gray-300">
            <p className="mb-6 text-lg">{status}</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
