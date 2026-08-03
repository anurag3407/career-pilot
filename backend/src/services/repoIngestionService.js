import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);

export const sessions = new Map();

export const cloneRepo = async (repoUrl) => {
  const sessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  const tempDir = path.join(os.tmpdir(), `repo-analyzer-${sessionId}`);

  // Full history is required by the time-series activity feature
  // (backend/src/services/activityService.js). A shallow clone
  // (`--depth 1`) would make `git log` return only the most recent
  // commit, breaking weekly aggregation.
  await execFileAsync('git', ['clone', repoUrl, tempDir]);
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
      type: 'fileNode',
      position: { x: 0, y: 0 },
      data: {
        label: path.basename(file),
        relativePath,
        fileName: path.basename(file)
      }
    });
  }
  
  const fileEdgesSet = new Set();
  
  for (const file of files) {
    const sourceId = pathToId.get(file);
    const imports = await parseImports(file);
    
    for (const imp of imports) {
      const targetPathRaw = path.resolve(path.dirname(file), imp);
      const possibleTargets = files.filter(f => f.startsWith(targetPathRaw));
      
      if (possibleTargets.length > 0) {
        const targetId = pathToId.get(possibleTargets[0]);
        const edgeId = `e-${sourceId}-${targetId}`;
        
        if (!fileEdgesSet.has(edgeId)) {
          fileEdgesSet.add(edgeId);
          edges.push({
            id: edgeId,
            source: sourceId,
            target: targetId,
            animated: true,
            style: { stroke: '#475569', strokeWidth: 1.5 }
          });
        }
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
    } catch (e) { /* ignore */ }
    
    skeleton += "\n";
  }
  
  return skeleton;
};
