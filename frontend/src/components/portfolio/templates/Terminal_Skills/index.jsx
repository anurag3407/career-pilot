import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { Terminal, Code2, Folder, ExternalLink, Briefcase, FileText } from 'lucide-react';

const Terminal_Skills = () => {
  const { portfolioData } = usePortfolio();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // Simulate boot sequence
    const timer = setTimeout(() => {
      setBooted(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-black text-[#22c55e] flex items-center justify-center font-mono">
        [ SYSTEM_ERROR: PORTFOLIO_DATA_NOT_FOUND ]
      </div>
    );
  }

  const { personal, projects, skills, experience } = portfolioData;

  const dataProjects = projects || [];
  const dataSkills = skills || [];
  const dataExperience = experience || [];

  return (
    <div className="relative min-h-screen bg-black text-white font-mono selection:bg-[#22c55e] selection:text-black overflow-x-hidden">
      {/* CSS Effects */}
      <style>{`
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(#ffffff05 1px, transparent 0),
                            linear-gradient(90deg, #ffffff05 1px, transparent 0);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }
        .ambient-glow {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: radial-gradient(circle at 30% 25%, #22c55e1a 0, #22c55e0a 18%, transparent 50%),
                      radial-gradient(circle at 70% 75%, #22c55e0d 0, transparent 40%);
          pointer-events: none;
          z-index: 1;
        }
        .bracket-heading::before { content: "[ "; color: #666; }
        .bracket-heading::after { content: " ]"; color: #666; }
        
        .boot-screen {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: #000;
          color: #22c55e;
          font-family: monospace;
          display: flex;
          flex-direction: column;
          padding: 24px;
          transition: opacity 0.3s ease;
        }
        .boot-screen.is-booted {
          opacity: 0;
          pointer-events: none;
        }
        
        .ts-card {
          background: rgba(10, 10, 10, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }
        .ts-card:hover {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
          transform: translateY(-2px);
        }
        .ts-tag {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Boot Screen */}
      <div className={`boot-screen ${booted ? 'is-booted' : ''}`}>
        <div className="mb-4 text-xl font-bold">
          <span className="text-gray-500">[</span>
          <span className="text-white">TERMINAL &middot; SKILLS</span>
          <span className="text-gray-500">]</span>
        </div>
        <div className="space-y-1 text-sm opacity-80">
          <div>&gt; mounting system...</div>
          <div>&gt; indexing {dataProjects.length} projects...</div>
          <div>&gt; linking profile: {personal?.name || 'USER'}</div>
          <div>&gt; ready.</div>
        </div>
      </div>

      <div className="grid-bg"></div>
      <div className="ambient-glow"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        
        {/* Header Section */}
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-6 text-[#22c55e]">
            <Terminal className="w-8 h-8" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              {personal?.name || 'Developer_Profile'}
            </h1>
          </div>
          
          <div className="space-y-4 max-w-2xl">
            <p className="text-gray-400 text-lg leading-relaxed">
              <span className="text-[#22c55e] mr-2">$ cat bio.txt</span>
              {personal?.bio || 'Full-stack developer building scalable systems.'}
            </p>
            {personal?.location && (
              <p className="text-gray-500 text-sm">
                <span className="text-gray-600 mr-2">&gt;</span>
                Location: {personal.location}
              </p>
            )}
            <div className="flex gap-4 pt-4">
              {personal?.github && (
                <a href={personal.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#22c55e] transition-colors flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> GitHub
                </a>
              )}
              {personal?.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#22c55e] transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Skills Section (Tags style) */}
        {dataSkills.length > 0 && (
          <section className="mb-20">
            <h2 className="text-xl font-semibold mb-8 text-[#22c55e] bracket-heading">SKILLS</h2>
            <div className="flex flex-wrap gap-3">
              {dataSkills.map((skill, i) => (
                <span key={i} className="ts-tag px-3 py-1.5 text-sm text-gray-300 rounded flex items-center gap-2">
                  <span className="text-[#22c55e] opacity-50">#</span>
                  {skill.name || skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Grid */}
        {dataProjects.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-2 mb-8">
              <h2 className="text-xl font-semibold text-[#22c55e] bracket-heading">PROJECTS</h2>
              <span className="text-gray-600 text-sm ml-2">--all</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataProjects.map((project, i) => (
                <div key={i} className="ts-card rounded-lg p-6 flex flex-col h-full relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#22c55e] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                  <div className="flex justify-between items-start mb-4">
                    <Folder className="w-6 h-6 text-[#22c55e]" />
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">{project.description}</p>
                  
                  {project.technologies && (
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-800/50">
                      {project.technologies.map((tech, j) => (
                        <span key={j} className="text-xs text-gray-500">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience / Logs */}
        {dataExperience.length > 0 && (
          <section className="mb-20">
             <h2 className="text-xl font-semibold mb-8 text-[#22c55e] bracket-heading">SYSTEM_LOGS</h2>
             <div className="space-y-6">
               {dataExperience.map((exp, i) => (
                 <div key={i} className="flex gap-4 md:gap-8 group">
                   <div className="w-32 flex-shrink-0 text-sm text-gray-500 font-mono mt-1">
                     [{exp.duration || exp.year || '----'}]
                   </div>
                   <div className="flex-grow pb-6 border-l border-gray-800 pl-6 relative">
                     <div className="absolute w-2 h-2 bg-gray-800 rounded-full -left-[5px] top-1.5 group-hover:bg-[#22c55e] transition-colors"></div>
                     <h3 className="text-lg font-bold text-white mb-1">{exp.role || exp.title}</h3>
                     <h4 className="text-[#22c55e] text-sm mb-3">@ {exp.company || exp.organization}</h4>
                     <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                   </div>
                 </div>
               ))}
             </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default Terminal_Skills;
