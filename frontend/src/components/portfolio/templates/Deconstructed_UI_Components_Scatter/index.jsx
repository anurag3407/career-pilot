import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import HeroCard from './HeroCard';
import AboutCard from './AboutCard';
import SkillsCard from './SkillsCard';
import ProjectsCard from './ProjectsCard';
import ExperienceCard from './ExperienceCard';
import EducationCard from './EducationCard';
import ContactCard from './ContactCard';
import './scatter.css';

export default function DeconstructedUIComponentsScatter() {
  const { portfolioData: data } = usePortfolio();

  if (!data) return null;

  return (
    <div className="ducs-root" aria-label="Deconstructed UI Components Scatter Portfolio">
      {/* Dot-grid background */}
      <div className="ducs-bg-grid" aria-hidden="true" />

      {/* Ambient glow blobs */}
      <div className="ducs-blob ducs-blob-violet" aria-hidden="true" />
      <div className="ducs-blob ducs-blob-cyan" aria-hidden="true" />
      <div className="ducs-blob ducs-blob-pink" aria-hidden="true" />

      <div className="ducs-scatter-layout">
        {/* Hero card — top centre, slight right tilt */}
        <HeroCard data={data} className="ducs-hero-pos" />

        {/* About card — top-left, rotated slightly left */}
        <AboutCard data={data} className="ducs-about-pos" />

        {/* Skills card — top-right, rotated slightly right */}
        <SkillsCard skills={data.skills} className="ducs-skills-pos" />

        {/* Experience card — mid-left, slight tilt */}
        <ExperienceCard experience={data.experience} className="ducs-exp-pos" />

        {/* Projects card — mid-right, negative tilt */}
        <ProjectsCard projects={data.projects} className="ducs-projects-pos" />

        {/* Education card — bottom-left */}
        <EducationCard education={data.education} className="ducs-edu-pos" />

        {/* Contact card — bottom-right floating badge */}
        <ContactCard personal={data.personal} socials={data.socials} className="ducs-contact-pos" />
      </div>
    </div>
  );
}
