import React from 'react';
import { Mail, Github, Linkedin, ExternalLink, MapPin, ChevronRight } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

// --- Clean Apple-style Glass Component ---
const GlassPanel = ({ children, className = "" }) => (
  <div className={`relative overflow-hidden bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] shadow-2xl rounded-[32px] ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
    <div className="relative z-10 p-8 md:p-12">{children}</div>
  </div>
);

export default function LiquidGlass() {
  const { personal, socials, skills, projects, experience } = data;

  return (
    <div className="relative min-h-screen font-sans text-slate-200 bg-[#000000] selection:bg-white/20 overflow-hidden">
      
      {/* --- Subtle macOS-style Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Soft blue ambient glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/20 mix-blend-screen blur-[140px]" />
        {/* Soft purple ambient glow */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/20 mix-blend-screen blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col gap-8">
        
        {/* --- Hero Section --- */}
        <GlassPanel className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <img 
            src={personal.avatar} 
            alt={personal.name} 
            className="w-40 h-40 rounded-full object-cover border border-white/10 shadow-xl"
          />
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-4">
              {personal.name}
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-400 font-medium tracking-wide mb-6">
              {personal.title}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed mb-8">
              {personal.bio}
            </p>
            <div className="flex items-center gap-4">
              {socials.email && (
                <a href={`mailto:${socials.email}`} className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-slate-200 transition-colors">
                  Contact Me
                </a>
              )}
              {socials.github && (
                <a href={socials.github} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">
                  <Github className="w-5 h-5 text-white" />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>
        </GlassPanel>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Skills Section --- */}
          <GlassPanel className="col-span-1 lg:col-span-1 flex flex-col h-full">
            <h3 className="text-xl font-semibold text-white mb-8 tracking-tight">Skills</h3>
            <div className="flex flex-col gap-5 flex-1">
              {skills.map((skill, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-medium text-slate-300">
                    <span>{skill.name}</span>
                    <span className="text-slate-500">{skill.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-white/40 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* --- Experience Section --- */}
          <GlassPanel className="col-span-1 lg:col-span-2 flex flex-col h-full">
            <h3 className="text-xl font-semibold text-white mb-8 tracking-tight">Experience</h3>
            <div className="flex flex-col gap-8 flex-1">
              {experience.map((exp, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 md:gap-8 group">
                  <div className="md:w-32 text-sm font-medium text-slate-500 shrink-0 pt-1">
                    {exp.period}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white mb-1">{exp.role}</h4>
                    <div className="text-blue-400 text-sm font-medium mb-3">{exp.company}</div>
                    <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

        </div>

        {/* --- Projects Section --- */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-white mb-8 px-2 tracking-tight">Selected Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <div key={i} className="group relative overflow-hidden bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] shadow-2xl rounded-[32px] hover:bg-white/[0.05] transition-colors">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="relative p-8 z-10">
                  <h4 className="text-xl font-semibold text-white mb-3">{project.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a href={project.liveUrl} className="flex items-center gap-2 text-sm font-medium text-white hover:text-blue-400 transition-colors">
                        View Live <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Source Code <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="mt-16 flex flex-col items-center justify-center text-center pb-8">
          <div className="text-slate-500 text-sm mb-4">
            <MapPin className="w-4 h-4 inline-block mr-1 mb-0.5" />
            {personal.location}
          </div>
          <div className="text-slate-600 text-sm">
            © {new Date().getFullYear()} {personal.name}. All rights reserved.
          </div>
        </div>

      </div>
    </div>
  );
}
