import axios from 'axios';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;

try {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
        redisClient = new IORedis(redisUrl, {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                if (times > 3) return null;
                return Math.min(times * 100, 500);
            }
        });
        redisClient.on('error', (err) => {
            console.error('Redis error:', err.message);
        });
    }
} catch (error) {
    console.error('Redis cache error:', error.message);
    redisClient = null;
}

const githubClient = axios.create({
    baseURL: 'https://api.github.com',
    timeout: 10000
});

const getCached = async (key) => {
    if (!redisClient) return null;
    try {
        const cached = await redisClient.get(key);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('Redis cache error:', error.message);
        return null;
    }
};

const setCached = async (key, value, ttl = 3600) => {
    if (!redisClient) return;
    try {
        await redisClient.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
        console.error('Redis cache error:', error.message);
    }
};

const handleGithubError = (error) => {
    if (error.response) {
        const status = error.response.status;
        if (status === 403) {
            throw new Error('GitHub API rate limit exceeded');
        }
        throw new Error('GitHub API error');
    }
    throw new Error('GitHub API error');
};

export const fetchUserRepos = async (accessToken) => {
    const cacheKey = `github:userRepos`;
    const cached = await getCached(cacheKey);
    if (cached) return cached;

    const allRepos = [];
    const maxPages = 3;
    let hadError = false;

    for (let page = 1; page <= maxPages; page++) {
        try {
            const response = await githubClient.get('/user/repos', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    per_page: 100,
                    page,
                    type: 'public'
                }
            });

            if (!response.data || response.data.length === 0) break;

            const repos = response.data.map(repo => ({
                name: repo.name,
                description: repo.description,
                html_url: repo.html_url,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                language: repo.language
            }));

            allRepos.push(...repos);

            if (response.data.length < 100) break;
        } catch (error) {
            hadError = true;
            if (page === 1) handleGithubError(error);
            break;
        }
    }

    if (!hadError) {
        await setCached(cacheKey, allRepos);
    }
    return allRepos;
};

export const fetchRepoDetails = async (accessToken, owner, repo) => {
    const cacheKey = `github:repoDetails:${owner}:${repo}`;
    const cached = await getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await githubClient.get(`/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const data = response.data;
        const result = {
            name: data.name,
            description: data.description,
            stargazers_count: data.stargazers_count,
            forks_count: data.forks_count,
            open_issues_count: data.open_issues_count,
            default_branch: data.default_branch
        };

        await setCached(cacheKey, result);
        return result;
    } catch (error) {
        handleGithubError(error);
    }
};

export const fetchRepoLanguages = async (accessToken, owner, repo) => {
    const cacheKey = `github:languages:${owner}:${repo}`;
    const cached = await getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await githubClient.get(`/repos/${owner}/${repo}/languages`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        await setCached(cacheKey, response.data);
        return response.data;
    } catch (error) {
        handleGithubError(error);
    }
};

export const fetchRepoReadme = async (accessToken, owner, repo) => {
    const cacheKey = `github:readme:${owner}:${repo}`;
    const cached = await getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await githubClient.get(`/repos/${owner}/${repo}/readme`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const content = response.data?.content
            ? Buffer.from(response.data.content, 'base64').toString('utf-8')
            : '';
        await setCached(cacheKey, content);
        return content;
    } catch (error) {
        handleGithubError(error);
    }
};

export const fetchRepoContributors = async (accessToken, owner, repo) => {
    const cacheKey = `github:contributors:${owner}:${repo}`;
    const cached = await getCached(cacheKey);
    if (cached) return cached;

    try {
        const response = await githubClient.get(`/repos/${owner}/${repo}/contributors`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const contributors = response.data.map(contributor => ({
            login: contributor.login,
            contributions: contributor.contributions
        }));

        await setCached(cacheKey, contributors);
        return contributors;
    } catch (error) {
        handleGithubError(error);
    }
};

export default {
    fetchUserRepos,
    fetchRepoDetails,
    fetchRepoLanguages,
    fetchRepoReadme,
    fetchRepoContributors
};
