import React from 'react';
import data from '../../../../data/dummy_data.json';

// Import Modular Components
import { Hero } from './Hero';
import { About } from './About';
import { Skills } from './Skills';
import { Projects } from './Projects';
import { Experience } from './Experience';
import { Testimonials } from './Testimonials';
import { Contact } from './Contact';

export default function StaggerGridPortfolio() {
  return (
    <div className="font-sans antialiased bg-white selection:bg-indigo-500 selection:text-white">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      
      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-500 text-center py-8">
        <p>© {new Date().getFullYear()} {data.personal.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}