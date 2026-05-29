import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';
import data from '../../../../data/dummy_data.json';

const PlayingCardsPortfolio = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!data || !data.personal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🃟</div>
          <p className="text-xl">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'home', label: 'Home', icon: '🃟' },
    { id: 'about', label: 'About', icon: '♠️' },
    { id: 'skills', label: 'Skills', icon: '♣️' },
    { id: 'projects', label: 'Projects', icon: '🃟' },
    { id: 'experience', label: 'Experience', icon: '♦️' },
    { id: 'testimonials', label: 'Testimonials', icon: '♥️' },
    { id: 'contact', label: 'Contact', icon: '📧' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Card Border Frame */}
      <div className="fixed inset-4 border-2 border-purple-500/30 rounded-3xl pointer-events-none"></div>
      
      {/* Corner Decorations */}
      <div className="fixed top-6 left-6 text-7xl opacity-10 pointer-events-none">🃟</div>
      <div className="fixed top-6 right-6 text-7xl opacity-10 pointer-events-none transform rotate-90">🃟</div>
      <div className="fixed bottom-6 left-6 text-7xl opacity-10 pointer-events-none transform -rotate-90">🃟</div>
      <div className="fixed bottom-6 right-6 text-7xl opacity-10 pointer-events-none transform rotate-180">🃟</div>

      {/* Sticky Navigation */}
      <nav className="sticky top-4 z-50 max-w-7xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-full shadow-xl p-2 flex flex-wrap justify-center gap-1 md:gap-2 border border-white/20">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const element = document.getElementById(section.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  setActiveSection(section.id);
                }
              }}
              className={`px-3 md:px-5 py-2 rounded-full capitalize transition-all text-sm md:text-base flex items-center gap-1 md:gap-2 ${
                activeSection === section.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              <span className="text-base md:text-lg">{section.icon}</span>
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.6 }}
        >
          <section id="home">
            <Hero data={data} />
          </section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <section id="about" className="scroll-mt-20">
            <About data={data} />
          </section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <section id="skills" className="scroll-mt-20">
            <Skills data={data} />
          </section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <section id="projects" className="scroll-mt-20">
            <Projects data={data} />
          </section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <section id="experience" className="scroll-mt-20">
            <Experience data={data} />
          </section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          <section id="testimonials" className="scroll-mt-20">
            <Testimonials data={data} />
          </section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <section id="contact" className="scroll-mt-20">
            <Contact data={data} />
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PlayingCardsPortfolio;