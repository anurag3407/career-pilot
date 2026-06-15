import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { 
  parseGitHubUrl, 
  calculateHealthScore, 
  scanRepository, 
  setFetch 
} from '../repoScanner.js';

// Helper to construct a mock fetch response
const createMockResponse = (ok, status, statusText, data) => {
  return {
    ok,
    status,
    statusText,
    json: async () => data
  };
};

describe('GitHub Repository Scanner - parseGitHubUrl', () => {
  test('parses standard HTTPS url', () => {
    const { owner, repo } = parseGitHubUrl('https://github.com/anurag3407/career-pilot');
    assert.equal(owner, 'anurag3407');
    assert.equal(repo, 'career-pilot');
  });

  test('parses standard HTTPS url with www and .git suffix', () => {
    const { owner, repo } = parseGitHubUrl('https://www.github.com/anurag3407/career-pilot.git');
    assert.equal(owner, 'anurag3407');
    assert.equal(repo, 'career-pilot');
  });

  test('parses SSH url', () => {
    const { owner, repo } = parseGitHubUrl('git@github.com:anurag3407/career-pilot.git');
    assert.equal(owner, 'anurag3407');
    assert.equal(repo, 'career-pilot');
  });

  test('parses shorthand owner/repo format', () => {
    const { owner, repo } = parseGitHubUrl('anurag3407/career-pilot');
    assert.equal(owner, 'anurag3407');
    assert.equal(repo, 'career-pilot');
  });

  test('throws error for empty/null URL', () => {
    assert.throws(() => parseGitHubUrl(''), /Repository URL is required/);
  });

  test('throws error for non-GitHub URLs', () => {
    assert.throws(() => parseGitHubUrl('https://gitlab.com/owner/repo'), /Not a GitHub repository URL/);
  });

  test('throws error for malformed URLs', () => {
    assert.throws(() => parseGitHubUrl('invalid-url-format'), /Invalid GitHub repository URL format/);
  });
});

describe('GitHub Repository Scanner - calculateHealthScore', () => {
  test('calculates maximum score (100) for a perfect repository', () => {
    const mockMetadata = { stargazers_count: 150, open_issues_count: 5 };
    const mockStructure = [
      { name: 'README.md', type: 'file' },
      { name: 'LICENSE', type: 'file' },
      { name: '.gitignore', type: 'file' },
      { name: '.github', type: 'dir' },
      { name: 'Dockerfile', type: 'file' },
      { name: 'package.json', type: 'file' }
    ];
    const mockPackageJson = { scripts: { test: 'jest' } };
    const mockCommits = [
      { commit: { committer: { date: new Date().toISOString() } } }
    ];

    const result = calculateHealthScore(mockMetadata, mockStructure, mockPackageJson, mockCommits);
    assert.equal(result.score, 100);
    assert.ok(result.breakDown.hasReadme);
    assert.ok(result.breakDown.hasLicense);
    assert.ok(result.breakDown.hasGitignore);
    assert.ok(result.breakDown.hasCIWorkflow);
    assert.ok(result.breakDown.hasDockerfile);
    assert.ok(result.breakDown.hasPackageJson);
    assert.ok(result.breakDown.hasTests);
    assert.ok(result.breakDown.hasRecentActivity);
  });

  test('calculates correct partial score for minimal repository', () => {
    const mockMetadata = { stargazers_count: 0, open_issues_count: 0 };
    const mockStructure = [
      { name: 'README.md', type: 'file' }
    ];
    const mockPackageJson = null;
    const mockCommits = [];

    const result = calculateHealthScore(mockMetadata, mockStructure, mockPackageJson, mockCommits);
    // Documentation: README (+15)
    // Issues: 0 (+2)
    assert.equal(result.score, 17);
    assert.ok(result.breakDown.hasReadme);
    assert.ok(!result.breakDown.hasLicense);
    assert.ok(!result.breakDown.hasPackageJson);
  });
});

describe('GitHub Repository Scanner - scanRepository', () => {
  let originalFetch;
  
  afterEach(() => {
    // Restore default fetch
    setFetch(null);
  });

  test('successfully scans a valid repository', async () => {
    const mockMetadata = {
      name: 'career-pilot',
      description: 'An AI Resume Builder',
      language: 'JavaScript',
      stargazers_count: 42,
      forks_count: 10,
      open_issues_count: 3,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-06-01T00:00:00Z',
      pushed_at: '2026-06-02T00:00:00Z'
    };

    const mockStructure = [
      { name: 'README.md', type: 'file' },
      { name: 'package.json', type: 'file' }
    ];

    const mockPackageJson = {
      name: 'career-pilot',
      content: Buffer.from(JSON.stringify({ scripts: { test: 'node --test' } })).toString('base64'),
      encoding: 'base64'
    };

    const mockCommits = [
      { commit: { committer: { date: new Date().toISOString() } } }
    ];

    // Mock fetch implementation
    setFetch(async (url) => {
      if (url.endsWith('/career-pilot')) {
        return createMockResponse(true, 200, 'OK', mockMetadata);
      }
      if (url.endsWith('/contents')) {
        return createMockResponse(true, 200, 'OK', mockStructure);
      }
      if (url.endsWith('/contents/package.json')) {
        return createMockResponse(true, 200, 'OK', mockPackageJson);
      }
      if (url.includes('/commits?')) {
        return createMockResponse(true, 200, 'OK', mockCommits);
      }
      return createMockResponse(false, 404, 'Not Found', {});
    });

    const result = await scanRepository('https://github.com/anurag3407/career-pilot');
    
    assert.equal(result.owner, 'anurag3407');
    assert.equal(result.repo, 'career-pilot');
    assert.equal(result.name, 'career-pilot');
    assert.equal(result.primaryLanguage, 'JavaScript');
    assert.equal(result.stars, 42);
    assert.ok(result.health.score > 0);
    assert.ok(result.health.breakDown.hasReadme);
    assert.ok(result.health.breakDown.hasPackageJson);
    assert.ok(result.health.breakDown.hasTests);
  });

  test('throws error when repository is not found', async () => {
    setFetch(async () => {
      return createMockResponse(false, 404, 'Not Found', {});
    });

    await assert.rejects(
      async () => scanRepository('https://github.com/anurag3407/non-existent'),
      /Repository not found/
    );
  });

  test('throws error when rate limit is exceeded', async () => {
    setFetch(async () => {
      return createMockResponse(false, 403, 'Forbidden', {});
    });

    await assert.rejects(
      async () => scanRepository('https://github.com/anurag3407/career-pilot'),
      /GitHub API rate limit exceeded/
    );
  });
});
