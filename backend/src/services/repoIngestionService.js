import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import redisManager from '../config/redis.js';
import { ApiError } from '../middleware/errorHandler.js';

const execFileAsync = promisify(execFile);

class RepoSessionStore {
  constructor() {
    this.fallbackMap = new Map();
    this.warned = false;
  }

  getClient() {
    if (!process.env.REDIS_URL) {
      if (process.env.NODE_ENV === 'production') {
        throw new ApiError(503, 'Session store configuration error');
      }
      return null;
    }
    try {
      return redisManager.get('repo-analyzer');
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        throw new ApiError(503, 'Session store connection error');
      }
      if (!this.warned) {
        console.warn('⚠️ [RepoSessionStore] Redis client retrieval failed. Falling back to local Map:', err.message);
        this.warned = true;
      }
      return null;
    }
  }

  async set(sessionId, value) {
    const client = this.getClient();
    if (client) {
      try {
        const key = `v1:session:${sessionId}`;
        await client.set(key, JSON.stringify(value), 'EX', 3600); // 1 hour TTL
        return;
      } catch (err) {
        console.error('❌ [RepoSessionStore] Redis error during set:', err.message);
        if (process.env.NODE_ENV === 'production') {
          throw new ApiError(503, 'Session store error');
        }
      }
    }

    if (!this.warned && process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ [RepoSessionStore] Redis unavailable, using local Map fallback.');
      this.warned = true;
    }
    this.fallbackMap.set(sessionId, value);
  }

  async get(sessionId) {
    const client = this.getClient();
    if (client) {
      try {
        const key = `v1:session:${sessionId}`;
        const val = await client.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        console.error('❌ [RepoSessionStore] Redis error during get:', err.message);
        if (process.env.NODE_ENV === 'production') {
          throw new ApiError(503, 'Session store error');
        }
      }
    }
    return this.fallbackMap.get(sessionId);
  }

  async delete(sessionId) {
    const client = this.getClient();
    if (client) {
      try {
        const key = `v1:session:${sessionId}`;
        await client.del(key);
        return;
      } catch (err) {
        console.error('❌ [RepoSessionStore] Redis error during delete:', err.message);
        if (process.env.NODE_ENV === 'production') {
          throw new ApiError(503, 'Session store error');
        }
      }
    }
    this.fallbackMap.delete(sessionId);
  }
}

export const sessions = new RepoSessionStore();

export const cloneRepo = async (repoUrl) => {
  const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  const tempDir = path.join(os.tmpdir(), `repo-analyzer-${sessionId}`);
  
  await execFileAsync('git', ['clone', '--depth', '1', repoUrl, tempDir]);
  return { sessionId, tempDir };
};

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'public', 'assets', 'coverage']);
const ALLOWED_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

export const walkSourceFiles = async (dir, rootDir = dir, fileList = []) => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory() && !IGNORED_DIRS.has(entry.name)) {
        await walkSourceFiles(path.join(dir, entry.name), rootDir, fileList);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ALLOWED_EXTS.has(ext)) {
          fileList.push(path.join(dir, entry.name));
        }
      }
    }
  } catch (error) {
    // Ignore read errors
  }
  return fileList;
};

export const parseImports = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const imports = [];
    
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (importPath.startsWith('.')) {
        imports.push(importPath);
      }
    }
    return imports;
  } catch (error) {
    return [];
  }
};

export const buildReactFlowGraph = async (files, rootDir) => {
  const nodes = [];
  const edges = [];
  const pathToId = new Map();
  
  for (const file of files) {
    const relativePath = path.relative(rootDir, file);
    const id = relativePath;
    pathToId.set(file, id);
    
    nodes.push({
      id,
      type: 'analyzerNode',
      position: { x: 0, y: 0 },
      data: {
        label: path.basename(file),
        relativePath,
        fileName: path.basename(file)
      }
    });
  }
  
  for (const file of files) {
    const sourceId = pathToId.get(file);
    const imports = await parseImports(file);
    
    for (const imp of imports) {
      const targetPathRaw = path.resolve(path.dirname(file), imp);
      const possibleTargets = files.filter(f => f.startsWith(targetPathRaw));
      
      if (possibleTargets.length > 0) {
        const targetId = pathToId.get(possibleTargets[0]);
        edges.push({
          id: `e-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          animated: true,
          style: { stroke: '#475569', strokeWidth: 1.5 }
        });
      }
    }
  }
  
  return { nodes, edges };
};

export const buildCodebaseSkeleton = async (files, rootDir) => {
  let skeleton = "Codebase Skeleton Map:\n\n";
  
  for (const file of files) {
    const relativePath = path.relative(rootDir, file);
    skeleton += `File: ${relativePath}\n`;
    
    try {
      const content = await fs.readFile(file, 'utf-8');
      
      const exportRegex = /export\s+(const|let|var|function|class)\s+([a-zA-Z0-9_]+)/g;
      let match;
      const exports = [];
      while ((match = exportRegex.exec(content)) !== null) {
        exports.push(match[2]);
      }
      
      const defaultExportRegex = /export\s+default\s+(function|class)?\s*([a-zA-Z0-9_]+)?/g;
      const defaultMatch = defaultExportRegex.exec(content);
      if (defaultMatch) {
        exports.push(`default ${defaultMatch[2] || 'Anonymous'}`);
      }
      
      if (exports.length > 0) {
        skeleton += `  Exports: ${exports.join(', ')}\n`;
      }
    } catch (e) {}
    
    skeleton += "\n";
  }
  
  return skeleton;
};
