import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import HUD from './HUD';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Stats from './Stats';
import Contact from './Contact';

export default function MarianaOceanTrenchTemplate({ portfolioData: propData }) {
  const context = usePortfolio();
  const data = propData || context?.portfolioData;

  const [scrollPercent, setScrollPercent] = useState(0);
  const [depth, setDepth] = useState(0);
  const [pressure, setPressure] = useState(1);
  const [zone, setZone] = useState('Surface');

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = window.scrollY / docHeight;
        const boundedScrolled = Math.min(Math.max(scrolled, 0), 1);
        setScrollPercent(boundedScrolled);
        
        // Depth mapping: 0 to 10,994m
        const currentDepth = Math.round(boundedScrolled * 10994);
        setDepth(currentDepth);

        // Pressure mapping: 1 to 1,086 atm
        const currentPressure = Math.round(1 + boundedScrolled * 1085);
        setPressure(currentPressure);

        // Zone mapping
        if (currentDepth < 150) {
          setZone('Surface');
        } else if (currentDepth >= 150 && currentDepth < 1000) {
          setZone('Sunlight Zone');
        } else if (currentDepth >= 1000 && currentDepth < 3000) {
          setZone('Twilight Zone');
        } else if (currentDepth >= 3000 && currentDepth < 4500) {
          setZone('Midnight Zone');
        } else if (currentDepth >= 4500 && currentDepth < 7000) {
          setZone('The Abyss');
        } else {
          setZone('Hadal Zone');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial trigger
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) {
    return (
      <div className="w-full h-full min-h-screen bg-black flex items-center justify-center text-cyan-400 font-mono">
        INITIALIZING SYSTEMS... NO EXPEDITION DATA LOADED.
      </div>
    );
  }

  // Graceful fallback for empty/undefined lists
  const personal = data.personal || data.personalInfo || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];
  const testimonials = data.testimonials || [];
  const socials = data.socials || {};

  return (
    <div className="min-h-screen text-slate-100 bg-[#000102] overflow-x-hidden relative font-sans">
      {/* Immersive HUD Overlay */}
      <HUD 
        depth={depth} 
        pressure={pressure} 
        zone={zone} 
        scrollPercent={scrollPercent} 
      />

      {/* Surface Zone (Hero) */}
      <Hero data={data} />

      {/* Sunlight Zone (About) */}
      <About data={data} />

      {/* Twilight Zone (Skills) */}
      {skills.length > 0 && <Skills skills={skills} />}

      {/* Midnight Zone (Projects) */}
      {projects.length > 0 && <Projects projects={projects} />}

      {/* Abyss Zone (Experience) */}
      {experience.length > 0 && <Experience experience={experience} />}

      {/* Ocean Research Dashboard (Stats) */}
      <Stats data={data} />

      {/* Deep Ocean Signals (Testimonials) */}
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}

      {/* Hadal Zone Floor (Contact) */}
      <Contact personal={personal} socials={socials} />
    </div>
  );
}
