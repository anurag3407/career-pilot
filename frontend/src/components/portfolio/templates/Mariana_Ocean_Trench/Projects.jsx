import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Database, Settings, Radio } from 'lucide-react';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section 
      id="midnight-zone"
      className="relative w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#020617] p-6 md:p-12 text-white overflow-hidden select-none"
    >
      {/* Midnight zone backgrounds: Pitch dark with submarine spotlights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-[-10%] w-[50%] h-[300px] bg-gradient-to-r from-cyan-500/10 to-transparent skew-y-12 animate-spotlight" style={{ transformOrigin: 'top left' }} />
        <div className="absolute bottom-1/4 right-[-10%] w-[55%] h-[250px] bg-gradient-to-l from-blue-500/10 to-transparent -skew-y-12 animate-spotlight" style={{ transformOrigin: 'bottom right', animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col gap-8 md:gap-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-blue-500/30 pb-4">
          <Database className="w-8 h-8 text-blue-400 animate-pulse" />
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider font-mono">
              03 // MIDNIGHT_ZONE: MISSION_ARCHIVES
            </h2>
            <p className="text-xs text-blue-500/80 font-mono mt-1">Status: Ambient Light Level 1% | Pressure Level 340 atm | Submarine Headlights ON</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => {
            const tech = project.techStack || project.technologies || project.tech || [];
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-slate-900/60 border border-slate-700/50 hover:border-cyan-500/50 rounded-2xl p-6 transition-all relative flex flex-col group shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              >
                {/* Steel border panel decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-600 group-hover:border-cyan-400" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-600 group-hover:border-cyan-400" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-600 group-hover:border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-600 group-hover:border-cyan-400" />

                {/* Submarine Control LEDs */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-3.5 tracking-widest">
                  <span>SYS_LOG_MISSION_{String(idx + 1).padStart(3, '0')}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse" />
                    <span className="text-blue-400">DATA_LINK_OK</span>
                  </div>
                </div>

                {/* Project Image Screen */}
                <div className="relative w-full h-48 md:h-52 bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden mb-4 group-hover:border-cyan-500/30">
                  {project.image ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none" />
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" 
                      />
                    </>
                  ) : (
                    /* Sonar indicator placeholder when image is missing */
                    <div className="w-full h-full flex flex-col items-center justify-center relative bg-slate-950/90 text-cyan-500/30">
                      <div className="absolute w-24 h-24 border border-cyan-500/10 rounded-full flex items-center justify-center animate-pulse">
                        <div className="absolute w-16 h-16 border border-cyan-500/5 rounded-full" />
                        <div className="absolute w-8 h-8 border border-cyan-500/10 rounded-full" />
                        <Radio className="w-6 h-6 text-cyan-500/20" />
                      </div>
                      <span className="text-[10px] font-mono tracking-widest mt-28 uppercase text-slate-600">NO_IMG_SONAR_SCANNING</span>
                    </div>
                  )}
                  {/* Depth overlay tag inside image */}
                  <div className="absolute bottom-2.5 left-2.5 z-20 bg-slate-950/90 border border-slate-800/80 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-400">
                    DEPTH: {3000 + idx * 250}m
                  </div>
                </div>

                {/* Project Details */}
                <div className="flex flex-col flex-grow gap-2 mb-5">
                  <h3 className="text-xl font-bold font-sans tracking-wide text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {project.description || "The expedition log has no descriptive content. Exploration data streams remain classified."}
                  </p>
                </div>

                {/* Tech Stack Tags */}
                {tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {tech.map((t, i) => (
                      <span 
                        key={i} 
                        className="text-[9px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-950 hover:border-cyan-800/50 px-2.5 py-0.5 rounded-md uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-auto w-full font-mono text-xs">
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 py-2.5 px-4 bg-cyan-950/30 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-center font-bold border border-cyan-500/40 hover:border-transparent rounded-lg shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>🚀 Launch Expedition</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== "#" && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 py-2.5 px-4 bg-slate-950/80 hover:bg-slate-800 text-slate-200 text-center font-bold border border-slate-700 hover:border-slate-500 rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>📂 Research Files</span>
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spotlight {
          0% { transform: skewY(12deg) rotate(0deg); opacity: 0.05; }
          50% { transform: skewY(12deg) rotate(5deg); opacity: 0.15; }
          100% { transform: skewY(12deg) rotate(0deg); opacity: 0.05; }
        }
        .animate-spotlight {
          animation: spotlight 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
