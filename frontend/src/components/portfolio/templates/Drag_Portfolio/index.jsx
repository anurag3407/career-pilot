import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Cpu, 
  Briefcase, 
  FolderGit2, 
  MessageSquareQuote, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  RefreshCw, 
  HelpCircle,
  ExternalLink,
  Sparkles,
  Maximize2
} from 'lucide-react';
import DraggableCard from './DraggableCard';

export default function DragPortfolio() {
  const { portfolioData: data } = usePortfolio();

  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [showHelper, setShowHelper] = useState(true);

  // Responsive Viewport Hook
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Use 1024px for ideal canvas workspace spacing
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  // Safe accessor to handle potential empty fields gracefully
  const personal = data.personal || {};
  const socials = data.socials || {};
  const projects = data.projects || [];
  const skills = data.skills || [];
  const experience = data.experience || [];
  const testimonials = data.testimonials || [];

  // Desktop coordinates scattered nicely around the center of the canvas workspace
  const defaultPositions = {
    about: { x: -440, y: -220 },
    skills: { x: 40, y: -260 },
    projects: { x: -420, y: 160 },
    experience: { x: 60, y: 130 },
    testimonials: { x: 500, y: -120 },
    contact: { x: 520, y: 220 }
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#030712] text-slate-100 overflow-x-hidden select-none font-sans"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 60%),
          radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px'
      }}
    >
      {/* HUD HEADER CONTROL BAR */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#030712]/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
          <div>
            <h1 className="text-sm font-mono tracking-widest text-cyan-400 font-bold uppercase">
              CARPILOT_CANVAS // v1.0.0
            </h1>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-tight">
              {isMobile ? "📱 RESPONSIVE STACK FLOW ACTIVE" : "🔴 DYNAMIC PHYSICS ACTIVE (DRAG CARDS TO REARRANGE)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {showHelper && !isMobile && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-mono text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl hidden md:inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 animate-spin" /> Try overlapping cards to inspect layers!
              </motion.span>
            )}
          </AnimatePresence>

          {!isMobile && (
            <button type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-200 bg-white/5 border border-white/10 hover:bg-cyan-500 hover:border-cyan-400 hover:text-black rounded-xl transition-all duration-300 shadow-sm shadow-black"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Board
            </button>
          )}
        </div>
      </header>

      {/* MOBILE DESCRIPTIVE WELCOME BAR */}
      {isMobile && (
        <div className="mx-6 mt-6 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 text-center">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            💡 Drag physics disabled on mobile devices to ensure native scrolling stability. Enjoy the vertical stacked layout!
          </p>
        </div>
      )}

      {/* CANVAS CONTAINER */}
      <main 
        className={`
          relative w-full px-6 py-8
          ${isMobile ? 'flex flex-col gap-6 max-w-2xl mx-auto' : 'min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden'}
        `}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={resetKey}
            className={isMobile ? "w-full flex flex-col gap-6" : "relative w-full h-[700px] flex items-center justify-center"}
          >
            {/* CARD 1: ABOUT */}
            <DraggableCard
              title="About Me"
              icon={User}
              isMobile={isMobile}
              dragConstraints={containerRef}
              defaultPosition={defaultPositions.about}
              className="border-indigo-500/20 shadow-indigo-900/10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-4">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
                  <img 
                    src={personal.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"} 
                    alt={personal.name} 
                    className="relative w-20 h-20 rounded-2xl object-cover border-2 border-slate-800"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </span>
                </div>

                <h4 className="text-xl font-extrabold tracking-tight text-white mb-0.5">
                  {personal.name}
                </h4>
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3.5">
                  {personal.title}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed font-normal mb-5 px-1">
                  {personal.bio}
                </p>

                {/* Social Connects */}
                <div className="grid grid-cols-4 gap-2 w-full pt-1.5 border-t border-white/5">
                  {socials.github && (
                    <a 
                      href={socials.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {socials.linkedin && (
                    <a 
                      href={socials.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {socials.twitter && (
                    <a 
                      href={socials.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {personal.resumeUrl && (
                    <a 
                      href={personal.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 rounded-xl bg-white/5 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </DraggableCard>

            {/* CARD 2: SKILLS */}
            <DraggableCard
              title="Expertise"
              icon={Cpu}
              isMobile={isMobile}
              dragConstraints={containerRef}
              defaultPosition={defaultPositions.skills}
              className="border-emerald-500/20 shadow-emerald-900/10"
            >
              <div className="flex flex-col gap-4">
                {skills.slice(0, 4).map((skill) => (
                  <div key={skill.id || skill.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-200 tracking-wide font-mono">
                        {skill.name}
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {skill.proficiency}%
                      </span>
                    </div>
                    {/* Glowing Progress bar */}
                    <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 leading-normal line-clamp-1 font-medium">
                      {skill.description}
                    </span>
                  </div>
                ))}
              </div>
            </DraggableCard>

            {/* CARD 3: PROJECTS */}
            <DraggableCard
              title="Featured Builds"
              icon={FolderGit2}
              isMobile={isMobile}
              dragConstraints={containerRef}
              defaultPosition={defaultPositions.projects}
              className="border-pink-500/20 shadow-pink-900/10"
            >
              {projects.length > 0 && (
                <div className="flex flex-col gap-4">
                  {/* Image with zoom and release year tag */}
                  <div className="relative h-40 rounded-xl overflow-hidden border border-white/10 group">
                    <img 
                      src={projects[activeProjectIdx].image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=240"} 
                      alt={projects[activeProjectIdx].title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
                    
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-pink-500/85 text-[10px] font-bold font-mono tracking-wider text-white uppercase border border-pink-400/20">
                      {projects[activeProjectIdx].releaseYear || 'RECENT'}
                    </span>
                  </div>

                  {/* Project Details */}
                  <div>
                    <h4 className="font-extrabold text-white text-base truncate mb-1">
                      {projects[activeProjectIdx].title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal line-clamp-2 h-8.5">
                      {projects[activeProjectIdx].description}
                    </p>
                  </div>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {(projects[activeProjectIdx].techStack || []).slice(0, 3).map((tech) => (
                      <span 
                        key={tech} 
                        className="px-2 py-0.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-bold font-mono uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Dot sliders to switch project */}
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <div className="flex gap-1.5">
                      {projects.map((_, idx) => (
                        <button type="button"
                          key={idx}
                          onClick={() => setActiveProjectIdx(idx)}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            idx === activeProjectIdx 
                              ? 'bg-pink-400 scale-125 shadow-[0_0_6px_rgba(244,114,182,0.6)]' 
                              : 'bg-slate-700 hover:bg-slate-500'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      {projects[activeProjectIdx].githubUrl && (
                        <a 
                          href={projects[activeProjectIdx].githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono font-bold uppercase text-slate-300 hover:text-pink-400 transition-colors flex items-center gap-1"
                        >
                          Code <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DraggableCard>

            {/* CARD 4: EXPERIENCE */}
            <DraggableCard
              title="Career Path"
              icon={Briefcase}
              isMobile={isMobile}
              dragConstraints={containerRef}
              defaultPosition={defaultPositions.experience}
              className="border-violet-500/20 shadow-violet-900/10"
            >
              <div className="flex flex-col gap-4">
                {experience.slice(0, 2).map((exp, idx) => (
                  <div 
                    key={exp.id || exp.company} 
                    className={`relative pl-4 pb-1.5 ${idx === 0 ? 'border-l border-violet-500/30' : ''}`}
                  >
                    {/* Bullet marker */}
                    {idx === 0 && (
                      <span className="absolute -left-1.5 top-1 flex h-3 w-3">
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.6)]" />
                      </span>
                    )}

                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-extrabold text-sm text-white truncate">
                        {exp.role}
                      </h4>
                      <span className="text-[9px] font-bold font-mono text-violet-400 shrink-0 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    </div>
                    
                    <p className="text-[11px] font-bold font-mono text-slate-300 uppercase tracking-tight mt-0.5">
                      {exp.company}
                    </p>
                    
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal line-clamp-2">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </DraggableCard>

            {/* CARD 5: TESTIMONIALS */}
            <DraggableCard
              title="Endorsements"
              icon={MessageSquareQuote}
              isMobile={isMobile}
              dragConstraints={containerRef}
              defaultPosition={defaultPositions.testimonials}
              className="border-amber-500/20 shadow-amber-900/10"
            >
              {testimonials.length > 0 && (
                <div className="flex flex-col gap-3">
                  <div className="relative p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-xs text-slate-300 italic leading-relaxed font-normal">
                      "{testimonials[0].text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-white">
                        {testimonials[0].name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {testimonials[0].designation}, {testimonials[0].company}
                      </p>
                    </div>

                    <div className="flex gap-0.5">
                      {[...Array(testimonials[0].rating || 5)].map((_, i) => (
                        <span key={i} className="text-amber-400 text-xs">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DraggableCard>

            {/* CARD 6: CONTACT */}
            <DraggableCard
              title="Get in Touch"
              icon={Mail}
              isMobile={isMobile}
              dragConstraints={containerRef}
              defaultPosition={defaultPositions.contact}
              className="border-cyan-500/20 shadow-cyan-900/10"
            >
              <div className="flex flex-col gap-4">
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Want to collaborate on high-performance projects, optimize UI systems, or just chat web technologies? Drop a line!
                </p>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 text-center">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-cyan-400 uppercase block mb-1">
                    Direct Email Gateway
                  </span>
                  <a 
                    href={`mailto:${personal.email || 'jane.doe@devflix.io'}`}
                    className="text-sm font-extrabold text-white hover:text-cyan-400 transition-colors break-all font-mono"
                  >
                    {personal.email || 'jane.doe@devflix.io'}
                  </a>
                </div>

                <a
                  href={`mailto:${personal.email || 'jane.doe@devflix.io'}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-black font-extrabold text-xs uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                >
                  <Mail className="w-3.5 h-3.5" /> Send Message
                </a>
              </div>
            </DraggableCard>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
