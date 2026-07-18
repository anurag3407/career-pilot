import React, { createContext, useContext, useMemo } from 'react';
import dummyData from '../data/dummy_data.json';

export const PortfolioContext = createContext({
  portfolioData: dummyData,
  dummyData,
});

export function normalizePortfolioData(portfolioData = {}) {
  const source = portfolioData && Object.keys(portfolioData).length ? portfolioData : dummyData;

  const personal = {
    ...dummyData.personal,
    ...source.personal,
    ...(source.hero?.subtitle && { name: source.hero.subtitle }),
    ...(source.hero?.title && { title: source.hero.title }),
    ...(source.hero?.tagline && { tagline: source.hero.tagline }),
    ...(source.about?.bio && { bio: source.about.bio }),
  };

  const skills = Array.isArray(source.skills) && source.skills.length
    ? source.skills.map((skill, index) => (
        typeof skill === 'string'
          ? {
              name: skill,
              level: 72 + ((index * 7) % 24),
              category: 'Core',
            }
          : skill
      ))
    : dummyData.skills;

  const projects = Array.isArray(source.projects) && source.projects.length
    ? source.projects.map((project, index) => ({
        ...project,
        title: project.title || project.name || dummyData.projects[index % dummyData.projects.length].title,
        description: project.description || project.summary || dummyData.projects[index % dummyData.projects.length].description,
        techStack: project.techStack || project.technologies || project.tech || dummyData.projects[index % dummyData.projects.length].techStack,
        image: project.image || dummyData.projects[index % dummyData.projects.length].image,
      }))
    : dummyData.projects;

  return {
    ...dummyData,
    ...source,
    personal,
    socials: {
      ...dummyData.socials,
      ...source.socials,
      ...source.contact,
    },
    stats: {
      ...dummyData.stats,
      ...source.stats,
    },
    skills,
    projects,
    experience: Array.isArray(source.experience) && source.experience.length ? source.experience : dummyData.experience,
    testimonials: Array.isArray(source.testimonials) && source.testimonials.length ? source.testimonials : dummyData.testimonials,
  };
}

export function PortfolioProvider({ children, portfolioData }) {
  const value = useMemo(() => {
    const normalized = normalizePortfolioData(portfolioData);
    return {
      portfolioData: normalized,
      dummyData,
    };
  }, [portfolioData]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
