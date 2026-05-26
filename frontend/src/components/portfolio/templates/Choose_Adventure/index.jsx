import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import data from '../../../../data/dummy_data.json';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import ExperienceSection from './sections/ExperienceSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';

const PAGE_TRANSITION = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const SECTIONS = {
  hero: null,
  about: null,
  skills: null,
  projects: null,
  experience: null,
  testimonials: null,
  contact: null,
};

export default function ChooseAdventurePortfolio() {
  const [scene, setScene] = useState('hero');

  const navigate = useCallback((next) => {
    if (!(next in SECTIONS) || next === scene) return;
    setScene(next);
  }, [scene]);

  const reset = useCallback(() => {
    setScene('hero');
  }, []);

  const renderScene = () => {
    switch (scene) {
      case 'hero':
        return (
          <HeroSection
            data={data}
            onBegin={() => navigate('about')}
          />
        );
      case 'about':
        return (
          <AboutSection
            data={data}
            onChoice={navigate}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            data={data}
            onChoice={navigate}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            data={data}
            onChoice={navigate}
          />
        );
      case 'experience':
        return (
          <ExperienceSection
            data={data}
            onChoice={navigate}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsSection
            data={data}
            onChoice={navigate}
          />
        );
      case 'contact':
        return (
          <ContactSection
            data={data}
            onReset={reset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full">
      {scene !== 'hero' && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0e17]/80 backdrop-blur border-b border-violet-900/30 px-4 py-2.5 flex items-center justify-between font-mono">
          <span className="text-xs text-violet-400 tracking-widest uppercase">
            {data.personal.name}
          </span>
          <div className="hidden sm:flex items-center gap-1">
            {['about', 'skills', 'projects', 'experience', 'testimonials', 'contact'].map((s) => (
              <button
                key={s}
                onClick={() => navigate(s)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors capitalize ${scene === s ? 'bg-violet-800/50 text-white' : 'text-slate-500 hover:text-slate-200'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={reset}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            ↺ Restart
          </button>
        </nav>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          {...PAGE_TRANSITION}
          className={scene !== 'hero' ? 'pt-10' : ''}
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>

      {scene !== 'hero' && (
        <div className="fixed bottom-4 right-4 z-50 font-mono">
          <div className="flex gap-1">
            {['about', 'skills', 'projects', 'experience', 'testimonials', 'contact'].map((s) => (
              <button
                key={s}
                onClick={() => navigate(s)}
                aria-label={`Go to ${s}`}
                aria-current={scene === s ? 'page' : undefined}
                className={`w-2 h-2 rounded-full transition-colors ${scene === s ? 'bg-violet-400' : 'bg-slate-700 hover:bg-slate-500'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
