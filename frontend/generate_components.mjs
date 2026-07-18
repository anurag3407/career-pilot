import fs from 'fs';
import path from 'path';

const idsToMark = [
  'Comic_Book', 'Culinary_Restaurant', 'CyberSecurity_Hacker', 'Cyberpunk', 'Dark_Mystery', 'Deep_Ocean', 'Developer_IDE', 'Ecommerce_Style', 'F1_Racing', 'Fantasy_RPG', 'Finance_Corporate', 'Geometric_Shapes', 'Glassmorphism', 'Graffiti_StreetArt', 'High_Fashion', 'Holographic', 'MacOS_Desktop', 'Magazine_Editorial', 'Medical_Clean', 'Minimalist_White', 'Monospace_Minimal', 'Music_Vinyl', 'Nature_Forest', 'Neon_Noir', 'Neumorphism', 'Origami_Paper', 'Pastel_Soft', 'Photography_Focus', 'SciFi_HUD', 'Scrapbook', 'Space_Galaxy', 'Sports_Athletic', 'Steampunk', 'Tech_Startup', 'Terminal_CLI', 'Typographic_Heavy', 'Vaporwave', 'Vintage_Newspaper', 'Watercolor_Artistic', 'Windows_98'
];

const base = './src/components/portfolio/templates';

idsToMark.forEach(id => {
  const dir = path.join(base, id);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  
  // Extract a base color from Hero.jsx or About.jsx to make it blend somewhat
  let bgClass = "bg-black/20";
  let textClass = "text-foreground";
  
  try {
    const heroCode = fs.readFileSync(path.join(dir, 'Hero.jsx'), 'utf8');
    const bgMatch = heroCode.match(/bg-\S+/);
    if (bgMatch) bgClass = bgMatch[0];
  } catch(e) {}

  const generateFile = (name, content) => {
    if (!files.includes(`${name}.jsx`) || fs.readFileSync(path.join(dir, `${name}.jsx`), 'utf8').length < 50) {
      fs.writeFileSync(path.join(dir, `${name}.jsx`), content);
    }
  };

  generateFile('Experience', `import React from 'react';
export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;
  return (
    <section className={\`py-16 px-6 \${"${bgClass}"} bg-opacity-50\`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Experience</h2>
        <div className="space-y-6">
          {experience.map((exp, i) => (
            <div key={i} className="border border-white/10 p-6 rounded-xl bg-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-bold">{exp.title} <span className="opacity-70">@ {exp.company}</span></h3>
              <p className="text-sm opacity-60 mb-4">{exp.startDate} - {exp.endDate}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`);

  generateFile('Skills', `import React from 'react';
export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;
  return (
    <section className="py-16 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Skills & Expertise</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill, i) => (
            <span key={i} className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}`);

  generateFile('Testimonials', `import React from 'react';
export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="py-16 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/5">
              <p className="italic mb-4">"{t.content}"</p>
              <p className="font-bold">— {t.author}, <span className="opacity-70">{t.role}</span></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`);

  generateFile('Contact', `import React from 'react';
export default function Contact({ personal, socials }) {
  if (!personal) return null;
  return (
    <section className="py-24 px-6 text-center border-t border-white/10">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
        <p className="opacity-70 mb-8">Reach out for opportunities or just to say hi.</p>
        <a href={\`mailto:\${personal.email}\`} className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-opacity-90 transition-all">
          Email Me
        </a>
      </div>
    </section>
  );
}`);

  generateFile('index', `import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function Template() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;

  return (
    <div className="min-h-screen text-foreground bg-background overflow-hidden relative">
      <Hero data={data} />
      <About data={data} />
      <Skills skills={data.skills} />
      <Experience experience={data.experience} />
      <Projects projects={data.projects} />
      <Testimonials testimonials={data.testimonials} />
      <Contact personal={data.personal} socials={data.socials} />
    </div>
  );
}`);

});
console.log('Generated basic components for all templates!');
