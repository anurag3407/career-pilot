import React, { createContext, useContext, useMemo } from 'react';
import dummyData from '../data/dummy_data.json';

export const PortfolioContext = createContext({
  portfolioData: dummyData,
  dummyData,
});

/**
 * Normalizes portfolio data across all template surfaces.
 * 
 * In preview mode without user data, dummyData is shown for visual demonstration.
 * In deploy mode (or whenever user content is present), dummyData is NEVER injected:
 * missing fields render empty, preventing strangers' names, photos, or testimonials
 * ("Alex Rivera", "Sarah Chen, CTO at NeuralDash") from ever appearing on deployed sites.
 */
export function normalizePortfolioData(portfolioData = {}, options = {}) {
  const isDeploy = options.isDeploy ?? Boolean(typeof window !== 'undefined' && window.__PORTFOLIO_DATA__);
  
  const hasUserContent = Boolean(
    portfolioData &&
    Object.keys(portfolioData).length > 0 &&
    (
      portfolioData.personal?.name ||
      portfolioData.hero?.subtitle ||
      portfolioData.hero?.name ||
      portfolioData.hero?.title ||
      portfolioData.about?.bio ||
      (Array.isArray(portfolioData.skills) && portfolioData.skills.length > 0) ||
      (Array.isArray(portfolioData.projects) && portfolioData.projects.length > 0)
    )
  );

  const shouldIsolateUserData = isDeploy || hasUserContent;
  const source = portfolioData || {};

  const name =
    source.personal?.name ||
    source.hero?.subtitle ||
    source.hero?.name ||
    (shouldIsolateUserData ? (source.title || 'My Portfolio') : dummyData.personal.name);

  const title =
    source.personal?.title ||
    source.hero?.title ||
    (shouldIsolateUserData ? '' : dummyData.personal.title);

  const tagline =
    source.personal?.tagline ||
    source.hero?.tagline ||
    (shouldIsolateUserData ? '' : dummyData.personal.tagline);

  const bio =
    source.personal?.bio ||
    source.about?.bio ||
    (shouldIsolateUserData ? '' : (dummyData.personal?.bio || dummyData.about?.bio || ''));

  const location =
    source.personal?.location ||
    (shouldIsolateUserData ? '' : dummyData.personal.location);

  const email =
    source.personal?.email ||
    source.contact?.email ||
    source.socials?.email ||
    (shouldIsolateUserData ? '' : dummyData.personal.email);

  const phone =
    source.personal?.phone ||
    source.contact?.phone ||
    (shouldIsolateUserData ? '' : dummyData.personal.phone);

  const personal = {
    name,
    title,
    tagline,
    bio,
    location,
    email,
    phone,
    avatar: source.personal?.avatar || source.hero?.image || (shouldIsolateUserData ? '' : dummyData.personal.avatar),
  };

  const socials = {
    ...(shouldIsolateUserData ? {} : dummyData.socials),
    ...source.socials,
    ...source.contact,
    ...(email ? { email } : {}),
  };

  const stats = shouldIsolateUserData
    ? (source.stats || {})
    : (source.stats || dummyData.stats);

  const skills = Array.isArray(source.skills) && source.skills.length > 0
    ? source.skills.map((skill, index) => (
        typeof skill === 'string'
          ? {
              name: skill,
              level: 80 + ((index * 5) % 16), // deterministic level between 80-95%
              category: 'Core',
            }
          : { ...skill, level: skill.level || 85 }
      ))
    : (shouldIsolateUserData ? [] : dummyData.skills);

  const projects = Array.isArray(source.projects) && source.projects.length > 0
    ? source.projects.map((project, index) => ({
        ...project,
        title: project.title || project.name || `Project ${index + 1}`,
        description: project.description || project.summary || '',
        techStack: project.techStack || project.technologies || project.tech || [],
        image: project.image || project.imageUrl || '',
        liveUrl: project.liveUrl || project.link || '#',
        githubUrl: project.githubUrl || project.repoUrl || '#',
      }))
    : (shouldIsolateUserData ? [] : dummyData.projects);

  const experience = Array.isArray(source.experience) && source.experience.length > 0
    ? source.experience
    : (shouldIsolateUserData ? [] : dummyData.experience);

  const testimonials = Array.isArray(source.testimonials) && source.testimonials.length > 0
    ? source.testimonials
    : (shouldIsolateUserData ? [] : dummyData.testimonials);

  return {
    ...source,
    personal,
    hero: {
      title,
      subtitle: name,
      tagline,
      bio,
      image: personal.avatar,
      ...source.hero,
    },
    about: {
      bio,
      ...source.about,
    },
    socials,
    stats,
    skills,
    projects,
    experience,
    testimonials,
  };
}

export function PortfolioProvider({ children, portfolioData, isDeploy = false }) {
  const value = useMemo(() => {
    const normalized = normalizePortfolioData(portfolioData, { isDeploy });
    return {
      portfolioData: normalized,
      dummyData,
    };
  }, [portfolioData, isDeploy]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
