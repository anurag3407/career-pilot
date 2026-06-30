import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const WHITELISTED_FILES = [];

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      const ext = path.extname(filePath);
      if (ext === '.jsx' || ext === '.tsx') {
        results.push(filePath);
      }
    }
  });
  return results;
}

describe('No dangerouslySetInnerHTML in portfolio templates', () => {
  test('scans all template files and checks for dangerouslySetInnerHTML', () => {
    const templatesDir = path.resolve(__dirname, '../components/portfolio/templates');
    const files = getFilesRecursively(templatesDir);
    
    // Ensure we actually found template files
    expect(files.length).toBeGreaterThan(0);

    const violations = [];

    files.forEach((file) => {
      const relativePath = path.relative(templatesDir, file).replace(/\\/g, '/');
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('dangerouslySetInnerHTML')) {
        const isWhitelisted = WHITELISTED_FILES.some(whiteFile => {
          return relativePath === whiteFile || file.endsWith(whiteFile);
        });
        
        if (!isWhitelisted) {
          violations.push(relativePath);
        }
      }
    });

    expect(violations, `Found dangerouslySetInnerHTML in the following files: ${violations.join(', ')}`).toEqual([]);
  });
});
