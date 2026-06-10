import fs from 'fs';
import path from 'path';

const analysis = JSON.parse(fs.readFileSync('/tmp/analysis.json', 'utf8'));

// We want to find templates that are currently NOT complete, but HAVE SOME components (not just unworked skeletons)
const content = fs.readFileSync('./src/data/templates.js', 'utf8');

// Get all complete ids (from our previous check, there are 43)
const completeIds = new Set();
const blocks = content.split('  },');
blocks.forEach(block => {
  if (block.includes('isComplete: true')) {
    const idMatch = block.match(/id:\s*["']([^"']+)["']/);
    if (idMatch) completeIds.add(idMatch[1]);
  }
});

const partialsToFinish = analysis.filter(a => {
  // If it's already complete, we assume it's done (or should we check if it has missing sections?)
  if (completeIds.has(a.id)) {
     if (a.missingSections) return true;
     return false;
  }
  
  // If it's incomplete
  // If it has multiple files, it's partially worked on
  if (a.files.length > 2) return true;
  
  return false;
});

console.log(partialsToFinish.map(a => a.id));
