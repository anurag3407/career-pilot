import { auth } from '../config/firebase';
import { decryptKey } from './encryption';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function buildHeaders(endpoint) {
    const headers = { 'Content-Type': 'application/json' };
    const user = auth?.currentUser;
    if (user) headers['Authorization'] = `Bearer ${await user.getIdToken()}`;

    const isAITarget = endpoint.includes('/enhance') || endpoint.includes('/ai');
    if (isAITarget) {
        const aiConfigStr = localStorage.getItem('aiConfig');
        if (aiConfigStr) {
            try {
                const aiConfig = JSON.parse(aiConfigStr);
                if (aiConfig.provider) headers['X-AI-Provider'] = aiConfig.provider;
                if (aiConfig.apiKey) headers['X-AI-Key'] = decryptKey(aiConfig.apiKey);
                if (aiConfig.model) headers['X-AI-Model'] = aiConfig.model;
            } catch { }
        } else {
            const openRouterKey = localStorage.getItem('openRouterApiKey');
            if (openRouterKey) headers['X-OpenRouter-Key'] = decryptKey(openRouterKey);
        }
    }
    return headers;
}

async function request(endpoint, options = {}) {
    const { method = 'GET', body, headers: customHeaders, ...rest } = options;
    const headers = await buildHeaders(endpoint);

    if (customHeaders) {
        Object.assign(headers, customHeaders);
    }

    if (body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const config = { method, headers, ...rest };
    if (body && method !== 'GET') {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Server error (${response.status})`);
    return data;
}

const apiClient = {
    get: (endpoint, opts) => request(endpoint, { ...opts, method: 'GET' }),
    post: (endpoint, body, opts) => request(endpoint, { ...opts, method: 'POST', body }),
    put: (endpoint, body, opts) => request(endpoint, { ...opts, method: 'PUT', body }),
    delete: (endpoint, opts) => request(endpoint, { ...opts, method: 'DELETE' }),
};

export default apiClient;
