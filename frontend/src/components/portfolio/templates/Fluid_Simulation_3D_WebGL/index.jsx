import React, { useEffect, useState } from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import dummyData from '../../../../data/dummy_data.json';

import FluidCanvas from './FluidCanvas';
import Hero from './Hero';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Education from './Education';
import Contact from './Contact';

export default function FluidSimulation3DWebGL({ portfolioData: propData }) {
  const { portfolioData: contextData } = usePortfolio() || {};
  const data = propData || contextData || dummyData;

  const [activeSection, setActiveSection] = useState('home');

  // Scrollspy to detect active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'skills', 'projects', 'experience', 'education', 'contact'];
      const scrollPosition = window.scrollY + 180; // offset for sticky nav

      for (const section of sections) {
        const element = document.getElementById(
          section === 'home' ? 'hero-section' : `${section}-section`
        );
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial trigger
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(
      sectionId === 'home' ? 'hero-section' : `${sectionId}-section`
    );
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavHover = (e) => {
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: {
        x: e.clientX,
        y: e.clientY,
        count: 5,
        color: '#06b6d4'
      }
    }));
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300 antialiased overflow-x-hidden">
      
      {/* Background Interactive Fluid Canvas */}
      <FluidCanvas />

      {/* Sticky Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/60 border-b border-slate-900/50 backdrop-blur-md transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Name */}
          <button 
            onClick={() => handleNavClick('home')}
            onMouseEnter={handleNavHover}
            className="flex items-center gap-1.5 font-black text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent cursor-pointer"
          >
            {data.personal?.name ? `${data.personal.name}.flow` : 'FLUID.DEVS'}
          </button>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {[
              { id: 'home', label: 'Home' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'experience', label: 'Experience' },
              { id: 'education', label: 'Education' },
              { id: 'contact', label: 'Contact' }
            ].map(item => {
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={handleNavHover}
                  className={`text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative py-1 ${
                    active 
                      ? 'text-cyan-400 font-extrabold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

        </div>
      </header>

      {/* Layout Sections */}
      <main className="relative">
        <div id="hero-section">
          <Hero data={data} />
        </div>
        <div id="skills-section">
          <Skills data={data} />
        </div>
        <div id="projects-section">
          <Projects data={data} />
        </div>
        <div id="experience-section">
          <Experience data={data} />
        </div>
        <div id="education-section">
          <Education data={data} />
        </div>
        <div id="contact-section">
          <Contact data={data} />
        </div>
      </main>

    </div>
  );
}
