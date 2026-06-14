import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function MasterTailorMeasuringTape() {
  const { portfolioData } = usePortfolio();
  const { personal, socials, skills, projects, experience } = portfolioData;

  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i < 200; i++) {
      const isInch = i % 10 === 0;
      const isHalf = i % 5 === 0 && !isInch;
      
      ticks.push(
        <div key={i} className={`flex items-center w-full ${isInch ? 'mt-4 mb-4' : 'my-1'}`}>
          <div className={`bg-black ${isInch ? 'h-1 w-12' : isHalf ? 'h-0.5 w-8' : 'h-0.5 w-4'}`}></div>
          {isInch && <span className="ml-2 text-black font-bold text-xl font-mono">{i / 10}</span>}
        </div>
      );
    }
    return ticks;
  };

  return (
    <div className="min-h-screen bg-neutral-900 font-serif text-neutral-200 selection:bg-yellow-400 selection:text-black">
      {/* Background fabric texture effect */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
      
      <div className="max-w-5xl mx-auto flex relative z-10 flex-col md:flex-row">
        
        {/* Measuring Tape Sidebar */}
        <div className="w-24 md:w-32 bg-yellow-400 flex-shrink-0 border-r-4 border-yellow-600 shadow-2xl flex flex-col items-start py-8 z-20">
          <div className="w-full">
            {renderTicks()}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-16 bg-neutral-100 shadow-2xl min-h-screen text-neutral-800">
          
          <header className="mb-20 border-b-2 border-neutral-300 pb-12">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-neutral-900 mb-4" style={{ fontFamily: 'Impact, sans-serif' }}>
              {personal?.name || 'Your Name'}
            </h1>
            <h2 className="text-2xl md:text-3xl text-neutral-600 italic font-serif mb-6">
              {personal?.title || 'Your Title'}
            </h2>
            <p className="text-lg text-neutral-700 max-w-2xl leading-relaxed">
              {personal?.bio || 'Your bio goes here. Share your story, your passions, and what drives you to create amazing things.'}
            </p>
            
            <div className="flex gap-4 mt-8">
              {socials?.github && <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-black transition-colors"><Github size={24} /></a>}
              {socials?.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-blue-700 transition-colors"><Linkedin size={24} /></a>}
              {socials?.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-blue-400 transition-colors"><Twitter size={24} /></a>}
              {socials?.email && <a href={`mailto:${socials.email}`} className="text-neutral-600 hover:text-red-600 transition-colors"><Mail size={24} /></a>}
            </div>
          </header>

          {experience && experience.length > 0 && (
            <section className="mb-20">
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-neutral-900 mb-8 border-l-8 border-yellow-400 pl-4">Experience</h3>
              <div className="space-y-12">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-neutral-300">
                    <div className="absolute w-4 h-4 bg-yellow-400 border-2 border-black rounded-full -left-[9px] top-1"></div>
                    <h4 className="text-2xl font-bold text-black">{exp.role}</h4>
                    <div className="text-lg text-neutral-600 font-semibold mb-2">{exp.company} <span className="text-neutral-400 mx-2">|</span> {exp.period}</div>
                    <p className="text-neutral-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects && projects.length > 0 && (
            <section className="mb-20">
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-neutral-900 mb-8 border-l-8 border-yellow-400 pl-4">Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, idx) => (
                  <div key={idx} className="bg-white p-6 border-2 border-neutral-200 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    <h4 className="text-2xl font-bold text-black mb-3">{project.title}</h4>
                    <p className="text-neutral-600 mb-4 line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack?.slice(0, 4).map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-neutral-100 border border-neutral-300 text-xs font-semibold text-neutral-700 rounded-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section className="mb-20">
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-neutral-900 mb-8 border-l-8 border-yellow-400 pl-4">Measurements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.slice(0, 12).map((skill, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-neutral-800">{skill.name}</span>
                      <span className="text-neutral-500 font-mono">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-yellow-400 h-full border-r-2 border-black" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
        </div>
      </div>
    </div>
  );
}
