import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Fingerprint, Search, Briefcase, Mail, Github, Linkedin, FileText, Camera } from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';

// --- ANIMATIONS & HELPERS (FRAMER MOTION) ---

const Stamp = ({ text, delay = 0 }) => (
  <motion.div
    initial={{ scale: 3, opacity: 0, rotate: -15 }}
    whileInView={{ scale: 1, opacity: 0.8, rotate: -5 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ type: 'spring', damping: 15, stiffness: 300, delay }}
    className="absolute -top-6 -right-6 border-4 border-red-700 text-red-700 font-bold text-3xl px-4 py-1 uppercase tracking-widest pointer-events-none z-20 mix-blend-multiply"
    style={{ fontFamily: '"Courier New", Courier, monospace' }}
  >
    {text}
  </motion.div>
);

const CaseFileDrop = ({ children, delay = 0, rotation = 0 }) => (
  <motion.div
    initial={{ y: -100, opacity: 0, rotate: rotation - 5, scale: 1.05 }}
    whileInView={{ y: 0, opacity: 1, rotate: rotation, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ type: 'spring', bounce: 0.3, duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

// --- MAIN TEMPLATE ---

export default function ForensicInvestigatorDesk() {
  // CRITICAL: Pulling directly from global context. No local JSON, no prop drilling.
  const { portfolioData } = usePortfolio();
  const { personal, stats, skills, projects, experience, testimonials, socials } = portfolioData;

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#1a1614] text-zinc-800 font-mono relative overflow-hidden selection:bg-red-900 selection:text-white pb-24"
      style={{
        backgroundImage: `radial-gradient(circle at center, #2a2422 0%, #110e0d 100%)`,
      }}
    >
      {/* Parallax Desk Texture */}
      <motion.div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{ 
          backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
          y: yBackground 
        }}
      />

      <div className="max-w-6xl mx-auto p-4 md:p-12 relative z-10 flex flex-col gap-16 pt-16">
        
        {/* --- DOSSIER (HERO & ABOUT) --- */}
        <CaseFileDrop rotation={-1}>
          <div className="bg-[#e8dcc7] p-8 md:p-12 shadow-[10px_10px_30px_rgba(0,0,0,0.5)] relative border-l-8 border-yellow-600">
            <Stamp text="CONFIDENTIAL" delay={0.3} />
            
            <div className="flex justify-between items-start border-b-2 border-zinc-400 pb-4 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-zinc-900 mb-1">SUBJECT DOSSIER</h1>
                <p className="text-zinc-600 font-bold">ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
              <Fingerprint className="w-12 h-12 text-red-800 opacity-50" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="relative group mx-auto md:mx-0 w-64 md:w-full">
                <div className="absolute -inset-2 bg-white shadow-xl rotate-3 transition-transform duration-500 group-hover:rotate-1" />
                <img 
                  src={personal.avatar} 
                  alt={personal.name}
                  className="relative z-10 w-full aspect-square object-cover grayscale contrast-125 border-4 border-white"
                />
                <motion.div 
                  className="absolute inset-0 bg-blue-500/20 z-20 pointer-events-none mix-blend-color-burn"
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
                <p className="absolute -bottom-2 -right-2 z-30 bg-black text-white text-xs px-2 py-1 font-bold shadow-md">EXHIBIT A</p>
              </div>

              <div className="md:col-span-2 space-y-4 text-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-bold text-zinc-500">NAME:</span> <span className="font-bold text-zinc-900">{personal.name}</span></div>
                  <div><span className="font-bold text-zinc-500">LOCATION:</span> <span className="font-bold text-zinc-900">{personal.location}</span></div>
                  <div className="md:col-span-2"><span className="font-bold text-zinc-500">ALIAS:</span> <span className="font-bold text-zinc-900">{personal.title}</span></div>
                </div>
                
                <div className="mt-6 bg-zinc-900/5 p-4 border border-zinc-900/20 font-serif italic text-zinc-700 relative shadow-inner">
                  <span className="absolute -left-2 -top-2 text-4xl text-zinc-400">"</span>
                  {personal.bio}
                </div>
                
                <div className="flex flex-wrap gap-6 pt-4 border-t border-zinc-400 border-dashed">
                  {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-500 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-2xl font-bold text-zinc-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CaseFileDrop>

        {/* --- EVIDENCE BOARD (PROJECTS) --- */}
        <div className="relative mt-8">
          <h2 className="text-2xl font-bold text-[#e8dcc7] mb-8 flex items-center gap-2 uppercase tracking-widest border-b border-zinc-700 pb-2">
            <Camera className="w-6 h-6" /> Evidence Board
          </h2>
          
          {/* Red string canvas */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }}>
            <motion.path 
              d="M 150 150 Q 400 50 600 200 T 900 100" 
              stroke="#8b0000" strokeWidth="2.5" fill="none" strokeDasharray="5,5"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }}
            />
             <motion.path 
              d="M 200 400 Q 500 500 800 300" 
              stroke="#8b0000" strokeWidth="2.5" fill="none"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            />
          </svg>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, rotate: Math.random() * 8 - 4 }}
                whileInView={{ opacity: 1, scale: 1, rotate: Math.random() * 4 - 2 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 50, transition: { duration: 0.2 } }}
                className="bg-[#fcfaf5] p-3 pb-10 shadow-2xl relative cursor-pointer border border-zinc-200"
              >
                {/* Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm rotate-[-2deg]" />
                
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover mb-4 grayscale hover:grayscale-0 transition-all duration-500 border border-zinc-300" />
                <h3 className="font-bold text-xl marker:text-red-600 mb-2 uppercase text-zinc-900">{project.title}</h3>
                <p className="text-sm text-zinc-700 mb-4 line-clamp-3 font-serif leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.techStack.map(tech => (
                    <span key={tech} className="text-[10px] bg-zinc-200 px-2 py-1 font-bold text-zinc-700 uppercase border border-zinc-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- CASE HISTORY (EXPERIENCE) & CAPABILITIES (SKILLS) --- */}
        <div className="grid lg:grid-cols-2 gap-12 mt-8">
          <CaseFileDrop rotation={1} delay={0.1}>
            <div className="bg-[#dcd1bc] p-8 shadow-2xl relative h-full border-t-8 border-zinc-800">
              <Stamp text="VERIFIED" delay={0.5} />
              <h2 className="text-2xl font-bold border-b-2 border-zinc-800 pb-2 mb-8 flex items-center gap-2">
                <Briefcase className="w-6 h-6" /> TIMELINE OF EVENTS
              </h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-zinc-800 before:via-zinc-400 before:to-transparent">
                {experience.map((exp, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ x: -30, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-[#dcd1bc] bg-zinc-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-5 border border-zinc-400 bg-white/60 backdrop-blur-sm shadow-sm relative transition-colors hover:bg-white/90">
                      {/* paperclip */}
                      <div className="absolute -top-4 -right-2 w-4 h-8 border-2 border-zinc-500 rounded-full bg-transparent z-20 rotate-45" />
                      
                      <div className="font-bold text-lg text-zinc-900">{exp.role}</div>
                      <div className="text-red-800 font-bold text-sm mb-1">@ {exp.company}</div>
                      <div className="text-xs font-bold text-zinc-500 mb-3 bg-zinc-200 inline-block px-2 py-0.5">{exp.period}</div>
                      <p className="text-sm font-serif leading-relaxed text-zinc-700">{exp.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CaseFileDrop>

          <CaseFileDrop rotation={-1} delay={0.2}>
            <div className="bg-[#111216] text-green-500 p-8 shadow-2xl h-full border border-zinc-800 relative overflow-hidden">
              {/* Scanline CRT Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-0 opacity-50" />
              
              <h2 className="text-2xl font-bold border-b border-green-800 pb-2 mb-8 flex items-center gap-2 relative z-10">
                <Search className="w-6 h-6" /> CAPABILITIES MATRIX
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                {skills.map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold font-mono tracking-wider">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 border border-green-900/30 overflow-hidden">
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        style={{ originX: 0, width: `${skill.level}%` }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.05 }}
                        className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CaseFileDrop>
        </div>

        {/* --- WITNESS STATEMENTS (TESTIMONIALS) --- */}
        <div className="mt-16 relative z-10">
           <h2 className="text-2xl font-bold text-[#e8dcc7] mb-8 flex items-center gap-2 uppercase tracking-widest border-b border-zinc-700 pb-2">
            <FileText className="w-6 h-6" /> Witness Statements
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimony, idx) => (
              <CaseFileDrop key={idx} delay={idx * 0.15} rotation={Math.random() * 3 - 1.5}>
                <div className="bg-[#f4f1ea] p-6 border-l-4 border-zinc-800 shadow-lg flex gap-5 relative">
                   <div className="absolute top-4 right-4 opacity-10">
                     <FileText className="w-12 h-12" />
                   </div>
                  <img src={testimony.avatar} alt={testimony.name} className="w-16 h-16 object-cover grayscale rounded-sm border border-zinc-400 shrink-0" />
                  <div className="relative z-10">
                    <p className="font-serif italic text-zinc-700 text-sm mb-4 leading-relaxed">"{testimony.text}"</p>
                    <div className="font-bold text-zinc-900 text-sm uppercase tracking-wide">{testimony.name}</div>
                    <div className="text-xs text-red-800 font-bold">{testimony.role}</div>
                  </div>
                </div>
              </CaseFileDrop>
            ))}
          </div>
        </div>

        {/* --- SECURE COMMS (CONTACT) --- */}
        <CaseFileDrop rotation={0} delay={0.2}>
          <div className="bg-zinc-900 text-zinc-300 p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t-4 border-red-800 mt-16 text-center relative overflow-hidden">
            <Stamp text="ACTION REQ" delay={0.6} />
            <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">Establish Secure Connection</h2>
            <p className="max-w-xl mx-auto mb-10 font-serif text-zinc-400 text-lg">If you have leads regarding ongoing operations or require investigative engineering services, transmit a message via the secure channels below.</p>
            
            <div className="flex flex-wrap justify-center gap-6">
              {socials.email && (
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={`mailto:${socials.email}`} 
                  className="bg-zinc-800 hover:bg-red-900 text-white px-8 py-4 font-bold tracking-widest transition-colors flex items-center gap-3 border border-zinc-700"
                >
                  <Mail className="w-5 h-5" /> ENCRYPTED COMM
                </motion.a>
              )}
              <div className="flex gap-4">
                {socials.github && (
                  <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={socials.github} target="_blank" rel="noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 transition-colors border border-zinc-700 flex items-center justify-center">
                    <Github className="w-6 h-6" />
                  </motion.a>
                )}
                {socials.linkedin && (
                  <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={socials.linkedin} target="_blank" rel="noreferrer" className="bg-zinc-800 hover:bg-zinc-700 text-white p-4 transition-colors border border-zinc-700 flex items-center justify-center">
                    <Linkedin className="w-6 h-6" />
                  </motion.a>
                )}
              </div>
            </div>
            
            <div className="mt-16 text-xs text-zinc-600 uppercase border-t border-zinc-800 pt-6 font-mono tracking-widest">
              Transmission trace: {new Date().toISOString()} <br className="md:hidden" /> <span className="hidden md:inline">//</span> Location Ping: <span className="font-bold text-zinc-400">{personal.location}</span>
            </div>
          </div>
        </CaseFileDrop>

      </div>
    </div>
  );
}