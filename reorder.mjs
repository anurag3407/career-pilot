import fs from 'fs';

// Read the original file
const filePath = 'frontend/src/data/templates.js';
const raw = fs.readFileSync(filePath, 'utf-8');

// The file exports `export const templates = [...]`
// We'll replace it with a temporary module.exports to evaluate it safely
const asCJS = raw.replace('export const templates =', 'module.exports =');
fs.writeFileSync('temp_templates.cjs', asCJS);
