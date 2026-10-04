import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { motion } from 'framer-motion';
import { 
  Terminal, Code, Cpu, Briefcase, GraduationCap, 
  Award, FileBadge, Mail, Github, Linkedin, Globe, ExternalLink,
  ChevronRight, Activity, Database, MessageSquare
} from 'lucide-react';

/* ─── INLINE STYLES FOR COMPLEX SCIFI EFFECTS ───────────────── */
const CustomStyles = () => (
  <style>{`
    .grid-container {
      position: fixed;
      z-index: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 900px;
      opacity: 0.6;
      transform-origin: bottom center;
      transform: perspective(1000px) rotateX(60.5deg) scale(8) translateZ(0);
      backface-visibility: hidden;
      overflow: hidden;
      will-change: transform;
    }

    .grid-container:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(to top, transparent, transparent 70%, #020617);
      z-index: 10;
      pointer-events: none;
    }

    .grid-container:after {
      content: "";
      position: absolute;
      top: -900px;
      left: 0;
      right: 0;
      z-index: -2;
      background: rgba(2, 6, 23, 1) url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='10' y='10' width='180' height='180' rx='20' stroke='%2306b6d4' stroke-width='3' fill='none' /%3E%3C/svg%3E") repeat;
      background-size: 3.125%;
      width: 100%;
      height: 1800px;
      animation: slidegrid 12s forwards linear infinite;
      will-change: transform;
    }

    @keyframes slidegrid {
      0% { transform: translateY(0) translateZ(0); }
      100% { transform: translateY(50%) translateZ(0); }
    }

    .clip-scifi {
      clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    .clip-scifi-reverse {
      clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(200%); }
    }
    .animate-scanline {
      animation: scanline 3s linear infinite;
    }
    
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 15px rgba(6,182,212,0.2), inset 0 0 10px rgba(6,182,212,0.1); }
      50% { box-shadow: 0 0 30px rgba(6,182,212,0.5), inset 0 0 20px rgba(6,182,212,0.2); }
    }
    .hover-pulse-glow:hover {
      animation: pulse-glow 2s infinite;
    }
    
    .neon-text-glow {
      text-shadow: 0 0 8px rgba(6, 182, 212, 0.6), 0 0 20px rgba(6, 182, 212, 0.3);
    }
  `}</style>
);

/* ─── FRAMER MOTION ANIMATION VARIANTS ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

/* ─── UI COMPONENTS ───────────────────────── */
const HolographicPanel = ({ children, className = "", reverseClip = false }) => (
  <div className={`relative bg-[#020617]/95 border border-cyan-500/30 p-6 ${reverseClip ? 'clip-scifi-reverse' : 'clip-scifi'} hover-pulse-glow transition-all duration-300 group overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${className}`}>
    <div className="absolute inset-0 w-full h-1/2 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scanline pointer-events-none z-0"></div>
    <div className="absolute top-2 right-4 text-[8px] text-cyan-600 font-mono opacity-50">SYS_MEM_{Math.floor(Math.random() * 900 + 100)}</div>
    <div className="relative z-10">{children}</div>
  </div>
);

const SectionLabel = ({ icon: Icon, title }) => (
  <motion.div 
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    className="inline-flex items-center gap-3 mb-8 bg-[#083344] border border-cyan-500/50 pr-6 pl-3 py-2 clip-scifi shadow-[0_0_20px_rgba(0,0,0,0.8)]"
  >
    <Icon className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
    <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 uppercase tracking-[0.2em]">
      {title}
    </h2>
  </motion.div>
);

/* ─── MAIN TEMPLATE ─────────────────────────────────────────── */
export default function TronLegacyLightGrid() {
  const { portfolioData } = usePortfolio();
  
  const { 
    personal = {}, 
    skills = [], 
    projects = [], 
    experience = [], 
    education = [], 
    achievements = [],
    certifications = [],
    testimonials = [],
    socials = {} 
  } = portfolioData || {};

  return (
    <div className="relative min-h-screen bg-[#020617] text-cyan-50 font-mono selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden pb-12">
      <CustomStyles />
      
      {/* BACKGROUND SCENE */}
      <div className="fixed inset-0 bg-[#020617] -z-20"></div>
      <div className="grid-container"></div>
      <div className="fixed top-0 inset-x-0 h-64 bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none -z-10"></div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 pb-20 sm:px-6 lg:px-8 flex flex-col gap-20">
        
        {/* HERO SECTION */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full flex flex-col items-center text-center mt-12"
        >
          {/* Ambient Background Core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-[-1]"></div>
          
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 border border-cyan-500/40 bg-[#020617] text-cyan-400 text-xs tracking-[0.3em] clip-scifi">
            <Activity size={14} className="animate-pulse" /> SYSTEM.ONLINE
          </div>
          
          {personal.avatar && (
            <div className="relative w-40 h-40 mb-8 group">
              <div className="absolute inset-0 rounded-full border-[3px] border-cyan-500/30 border-t-cyan-400 animate-spin shadow-[0_0_20px_rgba(6,182,212,0.4)]" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-[-10px] rounded-full border-[2px] border-blue-500/20 border-b-blue-400 animate-[spin_4s_linear_infinite_reverse]"></div>
              <div className="absolute inset-2 rounded-full p-1 bg-gradient-to-tr from-cyan-950 to-[#020617] shadow-[0_0_40px_rgba(6,182,212,0.8)]">
                <img 
                  src={personal.avatar} 
                  alt={personal.name} 
                  className="w-full h-full object-cover rounded-full border-2 border-[#020617] opacity-90 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                />
              </div>
            </div>
          )}
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-4 neon-text-glow">
            {personal.name || "USER_UNKNOWN"}
          </h1>
          <p className="text-xl md:text-2xl text-cyan-300 font-light tracking-[0.2em]">
            <span className="opacity-50">&lt;</span> {personal.title || "DIGITAL CONSTRUCT"} <span className="opacity-50">/&gt;</span>
          </p>
        </motion.header>

        {/* ABOUT SECTION */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-4xl mx-auto -mt-6"
        >
          <HolographicPanel className="w-full text-gray-300 leading-relaxed text-sm md:text-base border-t-4 border-t-cyan-500 text-center">
            <Terminal size={18} className="inline mr-2 text-cyan-500 mb-1" />
            {personal.bio || "Awaiting sequence input. User bio parameters are currently offline."}
            
            <div className="mt-6 pt-4 border-t border-cyan-900/50 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-cyan-600 font-mono uppercase tracking-widest">
                <span>Location: <span className="text-cyan-400">{personal.location || "UNKNOWN"}</span></span>
                <span>Status: <span className="text-cyan-400">ACTIVE</span></span>
            </div>
          </HolographicPanel>
        </motion.section>

        {/* SKILLS */}
        {skills.length > 0 && (
          <section className="relative">
            <SectionLabel icon={Database} title="Skills" />
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {skills.map((skill, idx) => (
                <motion.div 
                  variants={fadeUp}
                  key={idx} 
                  className="group relative bg-[#020617]/95 border border-cyan-900/80 hover:border-cyan-400 p-4 clip-scifi hover:bg-cyan-950/40 transition-all cursor-crosshair shadow-lg"
                >
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[10px] border-r-[10px] border-t-transparent border-r-cyan-900 group-hover:border-r-cyan-400 transition-colors"></div>
                  <p className="text-cyan-50 font-bold tracking-wider truncate">{skill.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1 w-full bg-[#020617] border border-cyan-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]" 
                        style={{ width: `${skill.level || Math.floor(Math.random() * 40 + 60)}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-cyan-600 mt-2 uppercase tracking-widest">{skill.category || 'Core'}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="relative">
            <SectionLabel icon={Code} title="Projects" />
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, idx) => (
                <motion.div 
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  key={idx}
                >
                  <HolographicPanel reverseClip={idx % 2 !== 0} className="flex flex-col h-full group">
                    <div className="flex items-center justify-between mb-4 border-b border-cyan-500/20 pb-2">
                      <h3 className="text-xl font-bold text-cyan-100 tracking-wider flex items-center gap-2">
                        <ChevronRight size={18} className="text-cyan-500" /> {project.title}
                      </h3>
                    </div>
                    
                    {project.image && (
                      <div className="w-full h-48 overflow-hidden mb-4 border border-cyan-500/30 relative clip-scifi bg-[#020617]">
                        <div className="absolute inset-0 bg-cyan-900/40 mix-blend-color z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-20 opacity-50"></div>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-400 flex-grow mb-6 leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(project.techStack || []).map((tech, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-cyan-950/40 border border-cyan-800 text-cyan-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 mt-auto">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 py-2 bg-[#083344]/80 border border-cyan-500 hover:bg-cyan-500 hover:text-gray-900 text-cyan-400 text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                          <ExternalLink size={14} /> VIEW LIVE
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex justify-center items-center gap-2 py-2 bg-[#020617] border border-gray-600 hover:border-cyan-400 text-gray-400 hover:text-cyan-100 text-xs tracking-widest transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                          <Github size={14} /> SOURCE CODE
                        </a>
                      )}
                    </div>
                  </HolographicPanel>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-2 gap-16 relative">
          
          {/* EXPERIENCE */}
          {experience.length > 0 && (
            <section className="relative">
              <SectionLabel icon={Briefcase} title="Experience" />
              {/* Bulletproof Timeline Container */}
              <div className="relative pl-8 border-l border-cyan-800 space-y-12 ml-2">
                {experience.map((exp, idx) => (
                  <motion.div 
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    key={idx} 
                    className="relative"
                  >
                    {/* Locked Timeline Node */}
                    <div className="absolute -left-10 top-6 w-4 h-4 rounded-full bg-[#020617] border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-cyan-200 rounded-full animate-ping"></div>
                    </div>
                    
                    <HolographicPanel className="border-l-4 border-l-cyan-400">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-cyan-200">{exp.role}</h3>
                          <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{exp.company}</span>
                        </div>
                        <span className="text-[10px] text-cyan-500 border border-cyan-800 bg-cyan-950/30 px-2 py-1 tracking-widest whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{exp.description}</p>
                    </HolographicPanel>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <section className="relative mt-8 lg:mt-0">
              <SectionLabel icon={GraduationCap} title="Education" />
              {/* Bulletproof Timeline Container */}
              <div className="relative pl-8 border-l border-blue-900 space-y-12 ml-2">
                {education.map((edu, idx) => (
                  <motion.div 
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    key={idx} 
                    className="relative"
                  >
                    {/* Locked Timeline Node */}
                    <div className="absolute -left-10 top-6 w-4 h-4 rounded-full bg-[#020617] border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-200 rounded-full animate-ping"></div>
                    </div>

                    <HolographicPanel className="border-l-4 border-l-blue-500" reverseClip>
                      <h3 className="font-bold text-lg text-blue-200">{edu.degree}</h3>
                      <div className="flex flex-col md:flex-row md:justify-between text-sm mt-1 mb-3">
                        <span className="text-gray-400 uppercase tracking-widest">{edu.institution}</span>
                        <span className="text-blue-500 font-mono">{edu.year}</span>
                      </div>
                      {edu.score && (
                        <div className="inline-block px-3 py-1 bg-[#020617] border border-blue-900 text-xs text-blue-300">
                          SCORE: <span className="text-white">{edu.score}</span>
                        </div>
                      )}
                    </HolographicPanel>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ACHIEVEMENTS & CERTIFICATIONS */}
        <div className="grid md:grid-cols-2 gap-8">
          {achievements.length > 0 && (
            <section>
              <SectionLabel icon={Award} title="Achievements" />
              <div className="flex flex-col gap-4">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-[#020617]/90 p-4 clip-scifi border border-cyan-900/50 hover:border-cyan-500 transition-colors">
                    <Terminal className="text-cyan-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-gray-300 leading-relaxed">{ach}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <SectionLabel icon={FileBadge} title="Certifications" />
              <div className="flex flex-col gap-4">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-[#020617]/90 p-4 clip-scifi-reverse border border-blue-900/50 hover:border-blue-500 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-950/50 flex items-center justify-center border border-blue-500/30">
                      <FileBadge className="text-blue-400" size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-200">{cert.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{cert.issuer} {cert.date && `// ${cert.date}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* TESTIMONIALS */}
        {testimonials && testimonials.length > 0 && (
          <section className="relative pt-8">
            <SectionLabel icon={MessageSquare} title="Testimonials" />
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((test, idx) => (
                <motion.div 
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  key={idx}
                >
                  <HolographicPanel reverseClip={idx % 2 !== 0} className="h-full border-t border-t-cyan-600">
                    <div className="text-cyan-500 opacity-20 mb-2">
                      <MessageSquare size={32} />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                      "{test.text}"
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      {test.avatar ? (
                        <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full border border-cyan-500/50 object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-500/50 text-cyan-400 font-bold">
                          {test.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-cyan-100 font-bold text-sm">{test.name}</p>
                        <p className="text-cyan-600 text-[10px] tracking-widest uppercase">{test.role}</p>
                      </div>
                    </div>
                  </HolographicPanel>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pb-16 pt-16 relative text-center z-20"
        >
          <div className="inline-flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-cyan-500"></div>
            <h2 className="text-2xl font-bold text-cyan-100 uppercase tracking-[0.2em] neon-text-glow">Contact</h2>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-cyan-500"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
            {socials.email && (
              <a href={`mailto:${socials.email}`} className="group relative flex items-center gap-3 px-8 py-4 bg-[#020617]/95 border border-cyan-700 hover:border-cyan-300 clip-scifi hover-pulse-glow transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <Mail size={18} className="text-cyan-500 group-hover:text-cyan-300" /> 
                <span className="text-sm tracking-[0.15em] text-cyan-100">EMAIL</span>
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-3 px-8 py-4 bg-[#020617]/95 border border-cyan-700 hover:border-cyan-300 clip-scifi hover-pulse-glow transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <Github size={18} className="text-cyan-500 group-hover:text-cyan-300" /> 
                <span className="text-sm tracking-[0.15em] text-cyan-100">GITHUB</span>
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-3 px-8 py-4 bg-[#020617]/95 border border-cyan-700 hover:border-cyan-300 clip-scifi hover-pulse-glow transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <Linkedin size={18} className="text-cyan-500 group-hover:text-cyan-300" /> 
                <span className="text-sm tracking-[0.15em] text-cyan-100">LINKEDIN</span>
              </a>
            )}
            {socials.website && (
              <a href={socials.website} target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-3 px-8 py-4 bg-[#020617]/95 border border-cyan-700 hover:border-cyan-300 clip-scifi hover-pulse-glow transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <Globe size={18} className="text-cyan-500 group-hover:text-cyan-300" /> 
                <span className="text-sm tracking-[0.15em] text-cyan-100">WEBSITE</span>
              </a>
            )}
          </div>
        </motion.section>

      </div>
    </div>
  );
}

