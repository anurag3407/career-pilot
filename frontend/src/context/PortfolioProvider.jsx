import React, { useState, useEffect } from 'react';
import { PortfolioContext } from './PortfolioContext';
import dummyData from '../data/dummy_data.json';

/**
 * Provider component that normalized and exposes portfolio data
 * reactively to templates and components.
 */
export function PortfolioProvider({ children, initialData }) {
  const [portfolioData, setPortfolioData] = useState(() => {
    if (initialData) return initialData;
    
    // 1. Try window.__PORTFOLIO_DATA__ (Standalone mode)
    if (typeof window !== 'undefined' && window.__PORTFOLIO_DATA__) {
      return window.__PORTFOLIO_DATA__;
    }
    
    // 2. Try localStorage (Gallery/Preview draft mode)
    if (typeof window !== 'undefined') {
      try {
        const draft = window.localStorage.getItem('ai_portfolio_draft');
        if (draft) return JSON.parse(draft);
      } catch (e) {
        console.warn('Failed to parse ai_portfolio_draft from localStorage:', e);
      }
    }
    
    return null;
  });

  // Watch for localStorage updates (e.g. when parsing a new resume)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = () => {
      try {
        const draft = window.localStorage.getItem('ai_portfolio_draft');
        if (draft) {
          setPortfolioData(JSON.parse(draft));
        } else {
          setPortfolioData(null);
        }
      } catch (e) {
        console.warn('Failed to parse storage update:', e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Periodic check in development to guarantee instant reactivity
    const devCheck = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(devCheck);
    };
  }, []);

  // Normalization logic to build a unified profile structure
  const getNormalizedData = () => {
    const raw = portfolioData;

    // Normalize Personal Details
    const personal = {
      ...dummyData.personal,
      ...(raw?.personal),
      ...(raw?.hero?.subtitle && { name: raw.hero.subtitle }),
      ...(raw?.hero?.title && { title: raw.hero.title }),
      ...(raw?.hero?.tagline && { tagline: raw.hero.tagline }),
      ...(raw?.about?.bio && { bio: raw.about.bio }),
    };

    // Normalize Social Links
    const socials = {
      ...dummyData.socials,
      ...raw?.socials,
      ...(raw?.contact?.github && { github: raw.contact.github }),
      ...(raw?.contact?.linkedin && { linkedin: raw.contact.linkedin }),
      ...(raw?.contact?.email && { email: raw.contact.email }),
      ...(raw?.contact?.portfolio && { website: raw.contact.portfolio }),
      ...(raw?.contact?.twitter && { twitter: raw.contact.twitter }),
    };

    // Normalize Skills
    let skills = dummyData.skills;
    if (raw?.skills?.length > 0) {
      if (typeof raw.skills[0] === 'string') {
        const categories = ["Core", "Technical", "Additional"];
        skills = raw.skills.map((s, i) => ({
          name: s,
          level: Math.floor(Math.random() * 20) + 75, // 75-95%
          category: categories[i % categories.length]
        }));
      } else {
        skills = raw.skills.map(s => ({
          name: typeof s === 'string' ? s : (s.name || ''),
          level: typeof s === 'object' ? (s.level ?? 85) : 85,
          category: typeof s === 'object' ? (s.category ?? 'Skills') : 'Skills'
        }));
      }
    }

    // Normalize Projects
    let projects = dummyData.projects;
    if (raw?.projects?.length > 0) {
      projects = raw.projects.map((p, i) => ({
        title: p.title || p.name || 'Untitled Project',
        description: p.description || '',
        techStack: p.technologies || p.techStack || p.tech || [],
        image: p.image || dummyData.projects[i % dummyData.projects.length].image,
        liveUrl: p.liveUrl || p.link || "#",
        githubUrl: p.githubUrl || "#"
      }));
    }

    // Normalize Experience
    let experience = dummyData.experience;
    if (raw?.experience?.length > 0) {
      experience = raw.experience.map(exp => ({
        role: exp.role || exp.title || '',
        company: exp.company || '',
        period: exp.period || exp.duration || '',
        description: exp.description || ''
      }));
    }

    // Testimonials
    const testimonials = raw?.testimonials?.length > 0 ? raw.testimonials : dummyData.testimonials;
    
    // Stats
    const stats = raw?.stats || dummyData.stats;

    // Education
    let education = dummyData.education || [];
    if (raw?.education?.length > 0) {
      education = raw.education.map(edu => ({
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        school: edu.school || edu.institution || '',
        year: edu.year || edu.period || '',
        location: edu.location || ''
      }));
    } else if (raw?.personal?.education) {
      education = [{ degree: raw.personal.education, school: '', fieldOfStudy: '', year: '' }];
    }

    return {
      personal,
      socials,
      skills,
      projects,
      experience,
      testimonials,
      stats,
      education
    };
  };

  const normalizedData = getNormalizedData();

  return (
    <PortfolioContext.Provider value={{ rawData: portfolioData, data: normalizedData, setPortfolioData }}>
      {children}
    </PortfolioContext.Provider>
  );
}
