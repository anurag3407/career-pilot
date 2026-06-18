import fs from 'fs';
import path from 'path';

const analysis = JSON.parse(fs.readFileSync('/tmp/analysis.json', 'utf8'));

// Filter for strictly partial ones:
const strictlyPartial = analysis.filter(a => {
  // It has files
  if (a.files.length < 3) return false; // if it only has index.jsx and maybe one other, it's unworked or monolithic
  
  const hasHeroOrAbout = a.files.includes('Hero.jsx') || a.files.includes('About.jsx') || a.files.includes('AboutSection.jsx');
  const hasExperienceOrSkills = a.files.includes('Experience.jsx') || a.files.includes('Skills.jsx') || a.files.includes('SkillsSection.jsx');
  
  // It MUST have Hero/About (meaning someone started styling it)
  // But it MUST be missing Experience/Skills (meaning it's not finished)
  return hasHeroOrAbout && !hasExperienceOrSkills;
});

console.log('Strictly partial count:', strictlyPartial.length);
console.log(strictlyPartial.map(a => a.id));
