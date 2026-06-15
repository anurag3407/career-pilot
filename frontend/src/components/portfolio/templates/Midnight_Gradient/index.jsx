import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';

// Section imports
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

export default function MidnightGradient({ portfolioData }) {
  const { portfolioData: dummyData } = usePortfolio();

  // Merge AI data with dummyData
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

  return (
    <div className="min-h-screen bg-[#020410] text-gray-100 font-sans relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Floating Mesh Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-900/10 blur-[150px]" />
      </div>

      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Experience data={data} />
      <Testimonials data={data} />
      <Contact data={data} />
    </div>
  );
}
