import React, { createContext, useContext, useState, useEffect } from 'react';
import dummyData from '../../../../data/dummy_data.json';
import { motion } from 'framer-motion';

import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Contact from './Contact';

export const PortfolioContext = createContext(null);

const OnePixelMasterLayout = ({ portfolioData }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const personal = {
    ...dummyData.personal,
    ...(portfolioData?.hero?.subtitle && { name: portfolioData.hero.subtitle }),
    ...(portfolioData?.hero?.title && { title: portfolioData.hero.title }),
    ...(portfolioData?.hero?.tagline && { tagline: portfolioData.hero.tagline }),
    ...(portfolioData?.about?.bio && { bio: portfolioData.about.bio }),
  };

  const socials = { ...dummyData.socials, ...portfolioData?.socials };

  let skills = dummyData.skills;
  if (portfolioData?.skills?.length > 0) {
    if (typeof portfolioData.skills[0] === 'string') {
      const categories = ["Core", "Technical", "Additional"];
      skills = portfolioData.skills.map((s, i) => ({
        name: s,
        level: Math.floor(Math.random() * 20) + 75,
        category: categories[i % categories.length]
      }));
    } else {
      skills = portfolioData.skills;
    }
  }

  let projects = dummyData.projects;
  if (portfolioData?.projects?.length > 0) {
    projects = portfolioData.projects.map((p, i) => ({
      title: p.title || p.name || 'Project',
      description: p.description || '',
      techStack: p.technologies || p.techStack || [],
      image: p.image || dummyData.projects[i % dummyData.projects.length].image,
      liveUrl: p.liveUrl || "#",
      githubUrl: p.githubUrl || "#"
    }));
  }

  const experience = portfolioData?.experience?.length > 0 ? portfolioData.experience : dummyData.experience;
  const testimonials = portfolioData?.testimonials?.length > 0 ? portfolioData.testimonials : dummyData.testimonials;
  const stats = portfolioData?.stats || dummyData.stats;

  const data = { personal, socials, skills, projects, experience, testimonials, stats };

  if (!data || !data.personal) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-green-500 font-mono text-xs uppercase tracking-widest">
          <p>[ INIT_PORTFOLIO_SYSTEM ]</p>
        </div>
      </div>
    );
  }

  return (
    <PortfolioContext.Provider value={data}>
      <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono selection:bg-green-500/30 selection:text-green-400">
        {/* CRT Scanline Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[100] opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] mix-blend-overlay"></div>
        
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-24 border-l border-r border-[#333] min-h-screen">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 1 }}>
            <div className="flex flex-col gap-12 md:gap-24">
              <Hero />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
              <About />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
              <Skills />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
              <Projects />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
              <Experience />
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
              <Contact />
            </div>
          </motion.div>
        </div>
      </div>
    </PortfolioContext.Provider>
  );
};

export default OnePixelMasterLayout;
