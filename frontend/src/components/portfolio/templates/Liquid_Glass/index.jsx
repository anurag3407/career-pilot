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

export default function LiquidGlass({ portfolioData }) {
  const { portfolioData: dummyData } = usePortfolio();

  const hasUser = Boolean(
    portfolioData &&
    (
      portfolioData.personal?.name ||
      portfolioData.hero?.subtitle ||
      portfolioData.hero?.title ||
      (Array.isArray(portfolioData.skills) && portfolioData.skills.length > 0) ||
      (Array.isArray(portfolioData.projects) && portfolioData.projects.length > 0)
    )
  );

  const personal = {
    ...(hasUser ? {} : dummyData.personal),
    ...portfolioData?.personal,
    name: portfolioData?.personal?.name || portfolioData?.hero?.subtitle || (hasUser ? 'My Portfolio' : dummyData.personal.name),
    title: portfolioData?.personal?.title || portfolioData?.hero?.title || (hasUser ? '' : dummyData.personal.title),
    tagline: portfolioData?.personal?.tagline || portfolioData?.hero?.tagline || (hasUser ? '' : dummyData.personal.tagline),
    bio: portfolioData?.personal?.bio || portfolioData?.about?.bio || (hasUser ? '' : dummyData.about.bio),
  };

  const socials = { ...(hasUser ? {} : dummyData.socials), ...portfolioData?.socials, ...portfolioData?.contact };

  let skills = hasUser ? [] : dummyData.skills;
  if (portfolioData?.skills?.length > 0) {
    if (typeof portfolioData.skills[0] === 'string') {
      const categories = ["Core", "Technical", "Additional"];
      skills = portfolioData.skills.map((s, i) => ({
        name: s,
        level: 80 + ((i * 5) % 16),
        category: categories[i % categories.length]
      }));
    } else {
      skills = portfolioData.skills;
    }
  }

  let projects = hasUser ? [] : dummyData.projects;
  if (portfolioData?.projects?.length > 0) {
    projects = portfolioData.projects.map((p, i) => ({
      title: p.title || p.name || `Project ${i + 1}`,
      description: p.description || '',
      techStack: p.technologies || p.techStack || [],
      image: p.image || '',
      liveUrl: p.liveUrl || p.link || "#",
      githubUrl: p.githubUrl || p.repoUrl || "#"
    }));
  }

  const experience = portfolioData?.experience?.length > 0 ? portfolioData.experience : (hasUser ? [] : dummyData.experience);
  const testimonials = portfolioData?.testimonials?.length > 0 ? portfolioData.testimonials : (hasUser ? [] : dummyData.testimonials);
  const stats = portfolioData?.stats || (hasUser ? {} : dummyData.stats);

  const data = { personal, socials, skills, projects, experience, testimonials, stats };

  return (
    <div className="min-h-screen bg-[#060918] relative overflow-hidden">
      {/* Global ambient blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600/20 blur-[150px] pointer-events-none" />

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