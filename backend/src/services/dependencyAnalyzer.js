import fs from 'fs/promises';
import path from 'path';
import semver from 'semver';
import fetch from 'node-fetch';

export const parseDependencyFiles = async (repoPath) => {
  const manifests = [];
  const packages = [];

  // 1. package.json
  try {
    const pkgPath = path.join(repoPath, 'package.json');
    const pkgContent = await fs.readFile(pkgPath, 'utf-8');
    const pkgJson = JSON.parse(pkgContent);
    manifests.push({ file: 'package.json', manager: 'npm' });

    const allDeps = {
      ...(pkgJson.dependencies || {}),
      ...(pkgJson.devDependencies || {})
    };

    for (const [name, versionStr] of Object.entries(allDeps)) {
      // Basic cleanup of version string
      const cleanVersion = versionStr.replace(/^[~^]/, '').split(' ')[0];
      packages.push({
        name,
        currentVersion: cleanVersion,
        latestVersion: null, // Will fetch
        status: 'up-to-date',
        manager: 'npm'
      });
    }
  } catch (e) {
    // No package.json
  }

  // 2. requirements.txt (Python)
  try {
    const reqPath = path.join(repoPath, 'requirements.txt');
    const reqContent = await fs.readFile(reqPath, 'utf-8');
    manifests.push({ file: 'requirements.txt', manager: 'pip' });
    
    const lines = reqContent.split('\n');
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        // e.g. "requests==2.25.1" or "flask>=1.1.2"
        const match = line.match(/^([a-zA-Z0-9_-]+)[=><~]+(.*)/);
        if (match) {
          packages.push({
            name: match[1],
            currentVersion: match[2].trim(),
            latestVersion: null,
            status: 'up-to-date',
            manager: 'pip'
          });
        }
      }
    }
  } catch (e) {
    // No requirements.txt
  }

  return { manifests, packages };
};

export const checkNpmVersions = async (packages) => {
  const updatedPackages = [];
  // Max out concurrent requests to avoid too many fetches at once
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < packages.length; i += BATCH_SIZE) {
    const batch = packages.slice(i, i + BATCH_SIZE);
    
    const promises = batch.map(async (pkg) => {
      if (pkg.manager !== 'npm') return pkg;
      try {
        const response = await fetch(`https://registry.npmjs.org/${pkg.name}/latest`);
        if (response.ok) {
          const data = await response.json();
          const latestVersion = data.version;
          pkg.latestVersion = latestVersion;
          pkg.status = compareSemver(pkg.currentVersion, latestVersion);
        }
      } catch (e) {
        console.warn(`Failed to fetch npm package ${pkg.name}: ${e.message}`);
      }
      return pkg;
    });

    const results = await Promise.all(promises);
    updatedPackages.push(...results);
  }
  return updatedPackages;
};

export const checkPyPiVersions = async (packages) => {
  const updatedPackages = [];
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < packages.length; i += BATCH_SIZE) {
    const batch = packages.slice(i, i + BATCH_SIZE);
    
    const promises = batch.map(async (pkg) => {
      if (pkg.manager !== 'pip') return pkg;
      try {
        const response = await fetch(`https://pypi.org/pypi/${pkg.name}/json`);
        if (response.ok) {
          const data = await response.json();
          const latestVersion = data.info.version;
          pkg.latestVersion = latestVersion;
          pkg.status = compareSemver(pkg.currentVersion, latestVersion);
        }
      } catch (e) {
        console.warn(`Failed to fetch PyPI package ${pkg.name}: ${e.message}`);
      }
      return pkg;
    });

    const results = await Promise.all(promises);
    updatedPackages.push(...results);
  }
  return updatedPackages;
};

const compareSemver = (current, latest) => {
  if (!current || !latest) return 'up-to-date';
  
  try {
    const cleanCurrent = semver.valid(semver.coerce(current));
    const cleanLatest = semver.valid(semver.coerce(latest));
    
    if (!cleanCurrent || !cleanLatest) return 'up-to-date';
    
    if (semver.eq(cleanCurrent, cleanLatest)) return 'up-to-date';
    
    const diff = semver.diff(cleanCurrent, cleanLatest);
    if (diff === 'major' || diff === 'premajor') return 'major-update';
    if (diff === 'minor' || diff === 'preminor' || diff === 'patch' || diff === 'prepatch') return 'minor-update';
    
    return 'up-to-date';
  } catch (e) {
    return 'up-to-date';
  }
};

export const analyzeDependencies = async (repoPath) => {
  const { manifests, packages } = await parseDependencyFiles(repoPath);
  
  let enrichedPackages = await checkNpmVersions(packages.filter(p => p.manager === 'npm'));
  let pipPackages = await checkPyPiVersions(packages.filter(p => p.manager === 'pip'));
  
  const allPackages = [...enrichedPackages, ...pipPackages];
  
  const summary = {
    total: allPackages.length,
    upToDate: allPackages.filter(p => p.status === 'up-to-date').length,
    minorUpdates: allPackages.filter(p => p.status === 'minor-update').length,
    majorUpdates: allPackages.filter(p => p.status === 'major-update').length,
    critical: allPackages.filter(p => p.status === 'critical').length,
  };

  return {
    manifests,
    packages: allPackages,
    summary
  };
};
