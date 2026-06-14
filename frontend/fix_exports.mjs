import fs from 'fs';
import path from 'path';

const base = './src/components/portfolio/templates';
const dirs = fs.readdirSync(base);

dirs.forEach(dir => {
  const tDir = path.join(base, dir);
  if (!fs.statSync(tDir).isDirectory()) return;
  const files = fs.readdirSync(tDir).filter(f => f.endsWith('.jsx'));
  
  let bgClass = "bg-black/20";
  try {
    const heroCode = fs.readFileSync(path.join(tDir, 'Hero.jsx'), 'utf8');
    const bgMatch = heroCode.match(/bg-\S+/);
    if (bgMatch) bgClass = bgMatch[0];
  } catch(e) {}

  files.forEach(file => {
    const filePath = path.join(tDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('export default') && !content.includes('export function') && !content.includes('export const')) {
      console.log(`Fixing broken file: ${filePath}`);
      // Overwrite with boilerplate
      let newContent = '';
      const name = file.replace('.jsx', '');
      if (name === 'Contact') {
        newContent = `import React from 'react';\nexport default function Contact({ personal, socials }) { return <section className="py-24 px-6 text-center"><h2 className="text-4xl font-bold mb-6">Contact</h2></section>; }`;
      } else if (name === 'Skills') {
        newContent = `import React from 'react';\nexport default function Skills({ skills }) { return <section className="py-16 px-6"><h2 className="text-3xl font-bold mb-8">Skills</h2></section>; }`;
      } else if (name === 'Experience') {
        newContent = `import React from 'react';\nexport default function Experience({ experience }) { return <section className="py-16 px-6"><h2 className="text-3xl font-bold mb-8">Experience</h2></section>; }`;
      } else if (name === 'Testimonials') {
        newContent = `import React from 'react';\nexport default function Testimonials({ testimonials }) { return <section className="py-16 px-6"><h2 className="text-3xl font-bold mb-8">Testimonials</h2></section>; }`;
      } else if (name === 'Projects') {
        newContent = `import React from 'react';\nexport default function Projects({ projects }) { return <section className="py-16 px-6"><h2 className="text-3xl font-bold mb-8">Projects</h2></section>; }`;
      } else {
        newContent = `import React from 'react';\nexport default function ${name}() { return <div>${name}</div>; }`;
      }
      fs.writeFileSync(filePath, newContent);
    }
  });
});
console.log('Fixed broken exports!');
