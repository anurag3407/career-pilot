import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { cloneRepo, sessions } from './repoIngestionService.js';

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', '__pycache__', 
  '.cache', 'vendor', 'target', '.idea', '.vscode', 'coverage', 
  '.tox', 'venv', 'env', '.env'
]);

const ALLOWED_EXTS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.rs', '.java', '.kt', 
  '.rb', '.php', '.c', '.cpp', '.h', '.hpp', '.cs', '.swift', '.vue', 
  '.svelte', '.css', '.scss', '.html', '.json', '.yaml', '.yml', 
  '.toml', '.md', '.sql', '.sh', '.bash', '.dockerfile', '.graphql'
]);

export const detectLanguage = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.js': 'JavaScript', '.jsx': 'JavaScript React', '.ts': 'TypeScript', '.tsx': 'TypeScript React',
    '.py': 'Python', '.go': 'Go', '.rs': 'Rust', '.java': 'Java', '.kt': 'Kotlin',
    '.rb': 'Ruby', '.php': 'PHP', '.c': 'C', '.cpp': 'C++', '.h': 'C/C++ Header', '.hpp': 'C++ Header',
    '.cs': 'C#', '.swift': 'Swift', '.vue': 'Vue', '.svelte': 'Svelte',
    '.css': 'CSS', '.scss': 'SCSS', '.html': 'HTML', '.json': 'JSON',
    '.yaml': 'YAML', '.yml': 'YAML', '.toml': 'TOML', '.md': 'Markdown',
    '.sql': 'SQL', '.sh': 'Shell', '.bash': 'Shell', '.dockerfile': 'Dockerfile', '.graphql': 'GraphQL'
  };
  return map[ext] || 'Unknown';
};

export const countLOC = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.split('\n').filter(line => line.trim().length > 0).length;
  } catch (e) {
    return 0;
  }
};

export const walkAllFiles = async (dir, rootDir = dir, fileList = []) => {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory() && !IGNORED_DIRS.has(entry.name)) {
        await walkAllFiles(path.join(dir, entry.name), rootDir, fileList);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ALLOWED_EXTS.has(ext)) {
          fileList.push(path.join(dir, entry.name));
        }
      }
    }
  } catch (error) {
    console.warn(`Error walking dir ${dir}: ${error.message}`);
  }
  return fileList;
};

export const parseImportsMultiLang = async (filePath, lang) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const imports = [];
    
    if (lang.includes('JavaScript') || lang.includes('TypeScript') || lang === 'Vue' || lang === 'Svelte') {
      const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
      const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
      const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
      
      const extract = (regex) => {
        let match;
        while ((match = regex.exec(content)) !== null) {
          if (match[1].startsWith('.')) imports.push(match[1]);
        }
      };
      
      extract(importRegex);
      extract(requireRegex);
      extract(dynamicImportRegex);
    } else if (lang === 'Python') {
      const pyImport1 = /^from\s+([a-zA-Z0-9_.]+)\s+import/gm;
      const pyImport2 = /^import\s+([a-zA-Z0-9_.]+)/gm;
      let match;
      while ((match = pyImport1.exec(content)) !== null) {
          if (match[1].startsWith('.')) imports.push(match[1]);
      }
      // Usually standard/third party, but keeping for completeness
      while ((match = pyImport2.exec(content)) !== null) {
          if (match[1].startsWith('.')) imports.push(match[1]);
      }
    } else if (lang === 'Go') {
      const goImport = /import\s+(?:\(\s*)?(?:[a-zA-Z0-9_]+\s+)?['"]([^'"]+)['"]/g;
      let match;
      while ((match = goImport.exec(content)) !== null) {
         if (match[1].startsWith('.')) imports.push(match[1]);
      }
    } else if (lang === 'Ruby') {
       const rbImport = /require_relative\s+['"]([^'"]+)['"]/g;
       let match;
       while ((match = rbImport.exec(content)) !== null) {
         imports.push(match[1]);
       }
    } else if (lang === 'CSS' || lang === 'SCSS') {
       const cssImport = /@import\s+['"]([^'"]+)['"]/g;
       const cssUse = /@use\s+['"]([^'"]+)['"]/g;
       let match;
       while ((match = cssImport.exec(content)) !== null) {
         imports.push(match[1]);
       }
       while ((match = cssUse.exec(content)) !== null) {
         imports.push(match[1]);
       }
    }
    
    return imports;
  } catch (e) {
    return [];
  }
};

const getModuleType = (name) => {
  const n = name.toLowerCase();
  if (['src', 'lib', 'core', 'app'].includes(n)) return 'core';
  if (['utils', 'helpers', 'common', 'shared'].includes(n)) return 'util';
  if (['test', 'tests', '__tests__', 'spec', 'specs'].includes(n)) return 'test';
  if (['config', 'configs', '.config', 'settings'].includes(n)) return 'config';
  if (['components', 'views', 'pages', 'ui', 'layouts'].includes(n)) return 'ui';
  if (['api', 'routes', 'controllers', 'endpoints', 'handlers'].includes(n)) return 'api';
  if (['docs', 'documentation'].includes(n)) return 'docs';
  if (['assets', 'public', 'static', 'images', 'fonts'].includes(n)) return 'assets';
  return 'other';
};

export const detectModules = async (files, rootDir) => {
  const moduleMap = new Map();
  
  for (const file of files) {
    const rel = path.relative(rootDir, file);
    const parts = rel.split(path.sep);
    const moduleName = parts.length > 1 ? parts[0] : 'root';
    const modulePath = parts.length > 1 ? parts[0] : '/';
    
    if (!moduleMap.has(moduleName)) {
      moduleMap.set(moduleName, {
        name: moduleName,
        path: modulePath,
        fileCount: 0,
        loc: 0,
        type: getModuleType(moduleName),
        files: []
      });
    }
    
    const mod = moduleMap.get(moduleName);
    mod.fileCount++;
    const loc = await countLOC(file);
    mod.loc += loc;
    mod.files.push(file);
  }
  
  return Array.from(moduleMap.values());
};

export const detectRisks = (files, rootDir, modules) => {
  const risks = [];
  
  // God module risk
  for (const mod of modules) {
    if (mod.fileCount > 30 && mod.name !== 'root') {
      risks.push({
        file: mod.path,
        type: 'monolith-risk',
        severity: 'high',
        description: `Module '${mod.name}' contains ${mod.fileCount} files. Consider breaking it down.`
      });
    }
  }
  
  const hasTests = modules.some(m => m.type === 'test');
  if (!hasTests) {
    risks.push({
      file: '/',
      type: 'missing-tests',
      severity: 'medium',
      description: 'No dedicated test directories detected.'
    });
  }

  return risks; // Other risks will be populated in buildFileGraph/analyzeRepo
};

export const buildFileGraph = async (files, rootDir, risks) => {
  const nodes = [];
  const edges = [];
  const pathToId = new Map();
  
  for (const file of files) {
    const relativePath = path.relative(rootDir, file);
    const id = relativePath;
    pathToId.set(file, id);
    
    const lang = detectLanguage(file);
    const loc = await countLOC(file);
    
    // File risks
    if (loc > 1000) {
      risks.push({ file: relativePath, type: 'large-file', severity: 'high', description: `Extremely large file with ${loc} LOC.` });
    } else if (loc > 500) {
      risks.push({ file: relativePath, type: 'large-file', severity: 'medium', description: `Large file with ${loc} LOC.` });
    }
    
    if (relativePath.split(path.sep).length > 5) {
      risks.push({ file: relativePath, type: 'deep-nesting', severity: 'low', description: 'Deeply nested file path reduces maintainability.' });
    }

    nodes.push({
      id,
      type: 'fileNode',
      position: { x: 0, y: 0 },
      data: { fileName: path.basename(file), relativePath, language: lang, loc }
    });
  }
  
  let totalDependencies = 0;
  
  for (const file of files) {
    const sourceId = pathToId.get(file);
    const lang = detectLanguage(file);
    const imports = await parseImportsMultiLang(file, lang);
    
    if (imports.length > 15) {
      risks.push({ file: sourceId, type: 'coupling-risk', severity: 'medium', description: `High coupling: imports ${imports.length} modules.` });
    }
    
    for (const imp of imports) {
      try {
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
          totalDependencies++;
        }
      } catch (e) {}
    }
  }
  
  return { nodes, edges, totalDependencies };
};

export const buildModuleGraph = (modules, fileEdges, files, rootDir) => {
  const nodes = [];
  const edges = [];
  
  const fileToModule = new Map();
  for (const file of files) {
    const rel = path.relative(rootDir, file);
    const parts = rel.split(path.sep);
    const moduleName = parts.length > 1 ? parts[0] : 'root';
    fileToModule.set(rel, moduleName);
  }
  
  for (const mod of modules) {
    nodes.push({
      id: mod.name,
      type: 'moduleNode',
      position: { x: 0, y: 0 },
      data: {
        name: mod.name,
        path: mod.path,
        fileCount: mod.fileCount,
        loc: mod.loc,
        type: mod.type,
        riskLevel: 'low' // simplified
      }
    });
  }
  
  const moduleEdgesSet = new Set();
  
  for (const edge of fileEdges) {
    const sourceMod = fileToModule.get(edge.source);
    const targetMod = fileToModule.get(edge.target);
    
    if (sourceMod && targetMod && sourceMod !== targetMod) {
      const edgeId = `${sourceMod}->${targetMod}`;
      if (!moduleEdgesSet.has(edgeId)) {
        moduleEdgesSet.add(edgeId);
        edges.push({
          id: `me-${edgeId}`,
          source: sourceMod,
          target: targetMod,
          animated: true,
          style: { stroke: '#475569', strokeWidth: 2 }
        });
        
        const sourceModObj = modules.find(m => m.name === sourceMod);
        if (sourceModObj && !sourceModObj.dependencies) sourceModObj.dependencies = [];
        if (sourceModObj && !sourceModObj.dependencies.includes(targetMod)) {
           sourceModObj.dependencies.push(targetMod);
        }
      }
    }
  }
  
  return { nodes, edges };
};

export const buildCodebaseSkeleton = async (files, rootDir) => {
  let skeleton = "Codebase Skeleton Map:\\n\\n";
  
  for (const file of files) {
    const relativePath = path.relative(rootDir, file);
    const lang = detectLanguage(file);
    skeleton += `File: ${relativePath} (${lang})\n`;
    
    try {
      const content = await fs.readFile(file, 'utf-8');
      const exports = [];
      
      if (lang.includes('JavaScript') || lang.includes('TypeScript')) {
        const exportRegex = /export\s+(const|let|var|function|class)\s+([a-zA-Z0-9_]+)/g;
        let match;
        while ((match = exportRegex.exec(content)) !== null) {
          exports.push(match[2]);
        }
        const defaultExportRegex = /export\s+default\s+(function|class)?\s*([a-zA-Z0-9_]+)?/g;
        const defaultMatch = defaultExportRegex.exec(content);
        if (defaultMatch) {
          exports.push(`default ${defaultMatch[2] || 'Anonymous'}`);
        }
      } else if (lang === 'Python') {
        const defRegex = /^(?:async\s+)?def\s+([a-zA-Z0-9_]+)\s*\(/gm;
        const classRegex = /^class\s+([a-zA-Z0-9_]+)\s*(?:\(|:)/gm;
        let match;
        while ((match = defRegex.exec(content)) !== null) exports.push(match[1]);
        while ((match = classRegex.exec(content)) !== null) exports.push(match[1]);
      } else if (lang === 'Go') {
        const funcRegex = /^func\s+(?:\(\w+\s+\*?\w+\)\s+)?([A-Z][a-zA-Z0-9_]*)\s*\(/gm;
        let match;
        while ((match = funcRegex.exec(content)) !== null) exports.push(match[1]);
      }
      
      if (exports.length > 0) {
        skeleton += `  Exports/Definitions: ${exports.join(', ')}\n`;
      }
    } catch (e) {}
    
    skeleton += "\\n";
  }
  return skeleton;
};

export const analyzeRepo = async (repoUrl, userId) => {
  console.log(`🚀 Starting analysis for ${repoUrl} by user ${userId}`);
  const { sessionId, tempDir } = await cloneRepo(repoUrl);
  
  try {
    const files = await walkAllFiles(tempDir);
    
    const modules = await detectModules(files, tempDir);
    const risks = detectRisks(files, tempDir, modules);
    
    const { nodes: fileNodes, edges: fileEdges, totalDependencies } = await buildFileGraph(files, tempDir, risks);
    const fileGraph = { nodes: fileNodes, edges: fileEdges };
    
    const moduleGraph = buildModuleGraph(modules, fileEdges, files, tempDir);
    
    let totalLOC = 0;
    const languages = new Map();
    for (const node of fileNodes) {
      totalLOC += node.data.loc;
      const lang = node.data.language;
      languages.set(lang, (languages.get(lang) || 0) + node.data.loc);
    }
    
    const skeleton = await buildCodebaseSkeleton(files, tempDir);
    
    sessions.set(sessionId, { repoPath: tempDir, skeleton, modules });
    
    const stats = {
      totalFiles: files.length,
      totalLOC,
      languages,
      moduleCount: modules.length,
      dependencyCount: totalDependencies
    };
    
    console.log(`✅ Analysis complete for ${sessionId}. Files: ${files.length}, Modules: ${modules.length}`);
    
    return {
      sessionId,
      stats,
      modules,
      fileGraph,
      moduleGraph,
      risks,
      skeleton
    };
  } catch (error) {
    console.error('❌ Error analyzing repo:', error);
    // Cleanup if failed
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
      sessions.delete(sessionId);
    } catch (e) {}
    throw error;
  }
};
