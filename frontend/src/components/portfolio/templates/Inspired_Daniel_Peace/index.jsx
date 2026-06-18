import React, { useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import fallbackPortfolioData from '../../../../data/dummy_data.json';

const catImages = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=400&q=80"
];

const InspiredDanielPeace = () => {
  const hookInstance = usePortfolio?.();
  const data = hookInstance?.portfolioData || fallbackPortfolioData;

  const personal = data.personal || {};
  const projects = data.projects || [];
  const education = data.education || [];
  const socials = data.socials || {};

  const [catIndex, setCatIndex] = useState(0);

  const handleCatClick = () => {
    setCatIndex((prev) => (prev + 1) % catImages.length);
  };

  const currentCat = catImages[catIndex];

  return (
    <div 
      className="min-h-full bg-[#020617] text-[#f1f5f9] selection:bg-[#22d3ee] selection:text-[#020617] py-16"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', Courier, monospace" }}
    >
      <div className="max-w-[700px] mx-auto px-6 space-y-16">
        
        {/* Header / Hero Section */}
        <header className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight lowercase">
              hi, i'm {personal.name?.split(' ')[0] || "daniel"}
            </h1>
            
            <div className="space-y-1">
              <p className="text-[#f1f5f9] lowercase">
                {personal.title || "web developer & ai agent builder"} <span className="text-[#22d3ee]">★</span>
              </p>
              <p className="text-[#475569] text-sm lowercase">
                {personal.location || "piraman, gujarat, india"}
              </p>
            </div>

            <div className="pt-4 flex items-center gap-4 text-[#f1f5f9]">
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#22d3ee] transition-colors flex items-center gap-1 lowercase">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#22d3ee] transition-colors flex items-center gap-1 font-bold lowercase">
                  in
                </a>
              )}
              {(!socials.github && !socials.linkedin) && (
                <>
                  <a href="#" className="hover:text-[#22d3ee] transition-colors flex items-center gap-1 lowercase">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="hover:text-[#22d3ee] transition-colors flex items-center gap-1 font-bold lowercase">
                    in
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="w-40 h-48 overflow-hidden rounded shadow-sm bg-[#475569]/20 border border-[#475569]/30">
              <img 
                src={currentCat} 
                alt="Cat" 
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleCatClick}
              />
            </div>
            <span 
              className="text-xs text-[#f1f5f9] mt-2 cursor-pointer hover:underline lowercase"
              onClick={handleCatClick}
            >
              click me
            </span>
          </div>
        </header>

        {/* Content Section: Projects & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 pt-8">
          
          {/* Projects Column */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold lowercase tracking-wide text-[#f1f5f9]">projects</h2>
            <div className="space-y-6">
              {projects.length > 0 ? projects.slice(0, 5).map((project, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <a 
                      href={project.liveUrl || project.githubUrl || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-base font-semibold lowercase hover:text-[#22d3ee] hover:underline transition-colors"
                    >
                      {project.title}
                    </a>
                    {project.githubUrl && project.githubUrl !== "#" ? (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#f1f5f9] hover:text-[#22d3ee]">
                        <Github className="w-4 h-4" />
                      </a>
                    ) : (
                       <Github className="w-4 h-4 text-[#f1f5f9]" />
                    )}
                  </div>
                  <p className="text-sm text-[#f1f5f9] lowercase leading-snug">
                    {project.description?.split('.')[0] || "minimal project description"}
                  </p>
                  <p className="text-xs text-[#475569] lowercase mt-1">
                    {Array.isArray(project.technologies || project.techStack) 
                      ? (project.technologies || project.techStack).join(', ') 
                      : (project.technologies || project.techStack || "react, tailwindcss")}
                  </p>
                </div>
              )) : (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <a href="#" className="text-base font-semibold lowercase hover:text-[#22d3ee] hover:underline transition-colors">minimalist</a>
                      <Github className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-[#f1f5f9] lowercase leading-snug">hyper minimal todolist</p>
                    <p className="text-xs text-[#475569] lowercase mt-1">nextjs, react, tailwindcss, convexDB, clerkAuth</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <a href="#" className="text-base font-semibold lowercase hover:text-[#22d3ee] hover:underline transition-colors">dreamer</a>
                      <Github className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-[#f1f5f9] lowercase leading-snug">dream tracking website</p>
                    <p className="text-xs text-[#475569] lowercase mt-1">nextjs, react, tailwindcss, clerkAuth, convexDB</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Education Column */}
          <section className="space-y-6 md:text-right">
            <h2 className="text-xl font-bold lowercase tracking-wide text-[#f1f5f9]">education</h2>
            <div className="space-y-6">
              {education.length > 0 ? education.map((edu, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="text-base font-semibold lowercase text-[#f1f5f9]">{edu.institution}</h3>
                  <p className="text-sm text-[#f1f5f9] lowercase">{edu.degree}</p>
                  <p className="text-xs text-[#475569] lowercase mt-1">
                    {edu.year || edu.startDate || "2024-2028"}
                  </p>
                </div>
              )) : (
                <div className="space-y-1">
                  <h3 className="text-base font-semibold lowercase text-[#f1f5f9]">kolbe catholic college</h3>
                  <p className="text-sm text-[#f1f5f9] lowercase">academic excellence award</p>
                  <p className="text-xs text-[#475569] lowercase mt-1">2020-2025</p>
                </div>
              )}
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};

export default InspiredDanielPeace;
