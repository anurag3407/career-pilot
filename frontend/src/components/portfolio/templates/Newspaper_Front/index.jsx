import React, { useMemo } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import dummyData from '../../../../data/dummy_data.json';

// Sub-components
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Stats from './Stats';
import Skills from './Skills';
import Contact from './Contact';
import Social from './Social';

/**
 * Newspaper Front Portfolio Template
 * Category: Unique / Creative
 * Description: Newspaper front page with multi-column layout, bold headlines, classified-ad-style skills section
 */

export default function NewspaperFront({ portfolioData }) {
  // Merge AI extracted data with dummy data fallbacks for visual completeness
  const personal = {
    ...dummyData.personal,
    ...(portfolioData?.hero?.subtitle && { name: portfolioData.hero.subtitle }),
    ...(portfolioData?.hero?.title && { title: portfolioData.hero.title }),
    ...(portfolioData?.hero?.tagline && { tagline: portfolioData.hero.tagline }),
    ...(portfolioData?.about?.bio && { bio: portfolioData.about.bio }),
  };

  const socials = { ...dummyData.socials, ...portfolioData?.socials };
  
  // Adapt skills array from simple strings to richer objects for the UI
  const skills = useMemo(() => {
    let skillsData = dummyData.skills;
    if (Array.isArray(portfolioData?.skills) && portfolioData.skills.length > 0) {
      if (typeof portfolioData.skills[0] === 'string') {
        const categories = ["Core", "Technical", "Additional"];
        skillsData = portfolioData.skills.map((s, i) => ({
          name: s,
          level: Math.floor(Math.random() * 20) + 75, // Random 75-95%
          category: categories[i % categories.length]
        }));
      } else {
        skillsData = portfolioData.skills;
      }
    }
    return skillsData;
  }, [portfolioData?.skills]);

  // Adapt projects to ensure they have images and URLs
  const projects = useMemo(() => {
    let projectsData = dummyData.projects;
    if (Array.isArray(portfolioData?.projects) && portfolioData.projects.length > 0) {
      projectsData = portfolioData.projects.map((p, i) => ({
        title: p.title || p.name || 'Project',
        description: p.description || '',
        techStack: p.technologies || p.techStack || [],
        image: p.image || dummyData.projects[i % dummyData.projects.length].image,
        liveUrl: p.liveUrl || "#",
        githubUrl: p.githubUrl || "#"
      }));
    }
    return projectsData;
  }, [portfolioData?.projects]);

  const experience = useMemo(() => {
    return Array.isArray(portfolioData?.experience) && portfolioData.experience.length > 0 
      ? portfolioData.experience 
      : dummyData.experience;
  }, [portfolioData?.experience]);

  const testimonials = useMemo(() => {
    return Array.isArray(portfolioData?.testimonials) && portfolioData.testimonials.length > 0 
      ? portfolioData.testimonials 
      : dummyData.testimonials;
  }, [portfolioData?.testimonials]);

  const stats = portfolioData?.stats || dummyData.stats;

  const data = { personal, socials, skills, projects, experience, testimonials, stats };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-black to-stone-950 text-gray-100">
      {/* Newspaper Header */}
      <header className="border-b-4 border-double border-yellow-600 bg-stone-950 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 items-center gap-4 mb-4">
            <div className="hidden md:block text-xs text-gray-500 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-black text-yellow-600 tracking-wider drop-shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                PORTFOLIO
              </h1>
              <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase mt-1">Est. {new Date().getFullYear()}</p>
            </div>
            <div className="hidden md:flex justify-end gap-3">
              {data.socials.github && <a href={data.socials.github} className="hover:text-yellow-500 transition" title="GitHub"><Github size={20} /></a>}
              {data.socials.linkedin && <a href={data.socials.linkedin} className="hover:text-yellow-500 transition" title="LinkedIn"><Linkedin size={20} /></a>}
              {data.socials.email && <a href={`mailto:${data.socials.email}`} className="hover:text-yellow-500 transition" title="Email"><Mail size={20} /></a>}
            </div>
          </div>
          <div className="border-t-2 border-yellow-600 pt-3 hidden md:block">
            <p className="text-center text-sm text-gray-400 italic tracking-wide">{data.personal.tagline}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-8">
            <Hero data={data} />
            <About data={data} />
            <Projects data={data} />
            <Experience data={data} />
            <Testimonials data={data} />
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            <Stats data={data} />
            <Skills data={data} />
            <Contact />
            <Social data={data} />
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-double border-yellow-600 bg-stone-950 mt-12 py-6 text-center text-gray-500 text-xs tracking-widest">
        <p>© {new Date().getFullYear()} {data.personal.name} • All Rights Reserved</p>
        <p className="mt-2">Built with React, Tailwind CSS & Framer Motion</p>
      </footer>
    </div>
  );
}
