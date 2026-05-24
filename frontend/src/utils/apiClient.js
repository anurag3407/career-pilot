import { auth } from '../config/firebase';
import { decryptKey } from './encryption';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function buildHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const user = auth?.currentUser;
    if (user) headers['Authorization'] = `Bearer ${await user.getIdToken()}`;

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
    return headers;
}

async function request(endpoint, options = {}) {
    const { method = 'GET', body, signal } = options;
    const config = { method, headers: await buildHeaders(), signal };
    if (body && method !== 'GET') config.body = JSON.stringify(body);
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
