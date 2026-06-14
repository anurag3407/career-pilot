import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import fallbackData from '../../../../data/dummy_data.json';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

const normalizeSkills = (skills, fallbackSkills) => {
  if (!Array.isArray(skills) || skills.length === 0) {
    return [...fallbackSkills];
  }

  if (typeof skills[0] === 'string') {
    const categories = ['Creative', 'Technical', 'Leadership'];

    return skills.map((skill, index) => ({
      name: skill,
      level: Math.min(100, Math.max(45, 70 + (index % 4) * 6)),
      category: categories[index % categories.length],
    }));
  }

  return skills
    .filter((skill) => skill && skill.name)
    .map((skill) => ({
      name: skill.name,
      level:
        typeof skill.level === 'number'
          ? Math.min(100, Math.max(0, skill.level))
          : 80,
      category: skill.category || 'Skill',
    }));
};

const normalizeProjects = (projects, fallbackProjects) => {
  if (!Array.isArray(projects) || projects.length === 0) {
    return [...fallbackProjects];
  }

  return projects.map((project, index) => {
    const fallback = fallbackProjects[index] || fallbackProjects[0] || {};

    return {
      title: project.title || project.name || fallback.title || 'Project',
      description: project.description || fallback.description || '',
      image: project.image || fallback.image || '',
      techStack:
        project.technologies ||
        project.techStack ||
        (typeof project.tech === 'string'
          ? project.tech
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : null) ||
        fallback.techStack ||
        fallback.technologies ||
        [],
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
    };
  });
};

/**
 * Art Deco Gold Portfolio Template
 * Category: Retro / Nostalgic
 * Description: 1920s Art Deco style with gold foil on black, geometric fan patterns,
 * Gatsby-era elegance. Luxury serif fonts, symmetrical ornamental borders.
 */
export default function ArtDecoGold({ portfolioData }) {
  const context = usePortfolio();
  const contextData = context?.portfolioData;

  const source = portfolioData || contextData || {};
  const hero = source.hero || {};
  const about = source.about || {};

  const personal = {
    ...fallbackData.personal,
    ...(source.personal || {}),
    ...(hero.subtitle && { name: hero.subtitle }),
    ...(hero.title && { title: hero.title }),
    ...(hero.tagline && { tagline: hero.tagline }),
    ...(about.bio && { bio: about.bio }),
  };

  const socials = {
    ...fallbackData.socials,
    ...(source.socials || {}),
  };

  const stats = {
    ...fallbackData.stats,
    ...(source.stats || {}),
  };

  const skills = normalizeSkills(
    source.skills,
    fallbackData.skills
  );

  const projects = normalizeProjects(
    source.projects,
    fallbackData.projects
  );

  const experience =
    Array.isArray(source.experience) && source.experience.length
      ? source.experience
      : fallbackData.experience;

  const testimonials =
    Array.isArray(source.testimonials) && source.testimonials.length
      ? source.testimonials
      : fallbackData.testimonials;

  const data = {
    personal,
    socials,
    stats,
    skills,
    projects,
    experience,
    testimonials,
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950 text-amber-100 font-sans"
      style={{
        fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-amber-400/15 via-transparent to-transparent" />
      <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-56 h-72 w-72 rounded-full bg-slate-800/60 blur-3xl" />

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