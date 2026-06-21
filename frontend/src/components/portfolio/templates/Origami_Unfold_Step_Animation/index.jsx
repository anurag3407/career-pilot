import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, MapPin, Compass, Briefcase, Award, GraduationCap, RotateCcw } from 'lucide-react';

export default function Origami_Unfold_Step_Animation({ data: localData, portfolioData }) {
  // 🔒 Safe fallback data for preview and development
  const localDefault = {
    personal: {
      name: "Alex Morgan",
      title: "Lead Creative Technologist",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      bio: "Passionate full-stack developer and visual designer with 8+ years of experience blending physical computing, CSS 3D art, and robust web applications. Pushing the boundary of canvas animations.",
      avatar: "",
      website: "https://alexmorgan.dev",
      tagline: "Unrolling the future of interactive interface design, one fold at a time."
    },
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "WebGL / Three.js", level: 90 },
      { name: "Framer Motion", level: 98 },
      { name: "CSS 3D Art", level: 92 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Node.js & Python", level: 88 }
    ],
    experience: [
      {
        role: "Senior Creative Technologist",
        company: "Spectacle Interfaces",
        period: "2023 - Present",
        description: "Leading frontend animation architectures. Pioneered Awwwards-winning 3D web portals and custom rendering engines using React, Framer Motion, and raw webGL shader matrices."
      },
      {
        role: "Interactive Developer",
        company: "Studio Origami Lab",
        period: "2020 - 2023",
        description: "Created modular tactile web layouts representing traditional craft and paper aesthetics. Built micro-interactions and smooth physical physics models."
      }
    ],
    projects: [
      {
        title: "Tactile Paper Canvas Engine",
        description: "A framework simulating the physics of paper, folding, creases, and physical texture in vanilla WebGL.",
        techStack: ["React", "WebGL", "Framer Motion"],
        liveUrl: "#",
        githubUrl: "#"
      },
      {
        title: "Virtual Design Desk OS",
        description: "An interactive browser-based operating system designed like a physical wooden drafting table with floating paper modules.",
        techStack: ["Next.js", "Zustand", "Framer Motion"],
        liveUrl: "#",
        githubUrl: "#"
      }
    ],
    testimonials: [
      {
        name: "Devon Sinclair",
        role: "Creative Director at Studio Origami Lab",
        text: "Alex's work is a masterclass in merging code with sensory design. The animations feel heavy, physical, and alive."
      }
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      email: "alex@example.com"
    }
  };

  // Resolve data source
  const context = usePortfolio();
  const incoming = portfolioData || localData || context?.portfolioData || {};

  // Safe merging helper
  const personal = { ...localDefault.personal, ...incoming.personal, ...(incoming.personalInfo || {}) };
  const experience = incoming.experience && incoming.experience.length > 0 ? incoming.experience : localDefault.experience;
  const projects = incoming.projects && incoming.projects.length > 0 ? incoming.projects : localDefault.projects;
  const skills = incoming.skills && incoming.skills.length > 0 ? incoming.skills : localDefault.skills;
  const testimonials = incoming.testimonials && incoming.testimonials.length > 0 ? incoming.testimonials : localDefault.testimonials;
  const socials = { ...localDefault.socials, ...incoming.socials };

  // Generate random fiber positions once on render to avoid layout shifts
  const [fibers] = useState(() => 
    Array.from({ length: 45 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      length: Math.random() * 25 + 12,
      angle: Math.random() * 360,
      opacity: Math.random() * 0.15 + 0.05
    }))
  );

  // Timeline States: 'hidden' -> 'entry' -> 'unrolling' -> 'flattening' -> 'expanding' -> 'reveal'
  const [stage, setStage] = useState('hidden');
  const [surfaceScale, setSurfaceScale] = useState(4.5); // Wrinkle shadow depth (higher scale = more wrinkled)

  useEffect(() => {
    let t1, t2, t3, t4, t5;

    // Start Timeline Sequence
    t1 = setTimeout(() => setStage('entry'), 200);       // Scroll enters anchored on the left
    t2 = setTimeout(() => setStage('unrolling'), 1200);  // Unroll horizontally left-to-right
    t3 = setTimeout(() => setStage('flattening'), 2300); // 3D crease flattening fold release
    t4 = setTimeout(() => setStage('expanding'), 3100);  // Vertical canvas expansion
    t5 = setTimeout(() => setStage('reveal'), 3900);     // Printed content fades/slides in

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Smoothly animate the SVG filter crinkle depth using Framer Motion animate
  useEffect(() => {
    if (stage === 'hidden' || stage === 'entry') {
      setSurfaceScale(4.5);
    } else if (stage === 'unrolling') {
      animate(4.5, 3.2, {
        duration: 1.0,
        ease: 'easeOut',
        onUpdate: (latest) => setSurfaceScale(latest)
      });
    } else if (stage === 'flattening') {
      animate(surfaceScale, 1.8, {
        duration: 0.8,
        ease: 'easeOut',
        onUpdate: (latest) => setSurfaceScale(latest)
      });
    } else if (stage === 'expanding' || stage === 'reveal') {
      animate(surfaceScale, 1.1, {
        duration: 1.0,
        ease: 'easeOut',
        onUpdate: (latest) => setSurfaceScale(latest)
      });
    }
  }, [stage]);

  const handleReplay = () => {
    setStage('hidden');
    setSurfaceScale(4.5);
    setTimeout(() => setStage('entry'), 200);
    setTimeout(() => setStage('unrolling'), 1200);
    setTimeout(() => setStage('flattening'), 2300);
    setTimeout(() => setStage('expanding'), 3100);
    setTimeout(() => setStage('reveal'), 3900);
  };

  // 📐 Jagged paper clip-path edges simulation
  const jaggedClipPath = "polygon(0% 1.2%, 10% 0.5%, 20% 1.4%, 30% 0.7%, 40% 1.2%, 50% 0.6%, 60% 1.5%, 70% 0.8%, 80% 1.3%, 90% 0.7%, 100% 1.2%, 99.2% 10%, 100% 20%, 98.8% 30%, 99.4% 40%, 99% 50%, 98.6% 60%, 99.5% 70%, 99.1% 80%, 99.6% 90%, 100% 98.8%, 90% 99.3%, 80% 98.6%, 70% 99.4%, 60% 98.9%, 50% 99.5%, 40% 98.7%, 30% 99.3%, 20% 98.8%, 10% 99.4%, 0% 98.8%, 0.8% 90%, 0.4% 80%, 1.2% 70%, 0.5% 60%, 1% 50%, 0.7% 40%, 1.3% 30%, 0.6% 20%, 1.1% 10%)";

  return (
    <div className="relative min-h-screen w-full bg-[#11100e] text-[#0c0805] font-serif overflow-hidden flex items-center justify-start select-none">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(43, 27, 17, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(43, 27, 17, 0.25);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(43, 27, 17, 0.45);
        }
      `}</style>
      
      {/* 🛠️ SVG Textures and Shadows Filters */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <filter id="kraft-paper-texture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="#f9ebd8" surfaceScale={surfaceScale} result="light">
              <feDistantLight azimuth="55" elevation="45" />
            </feDiffuseLighting>
            <feBlend mode="multiply" in="SourceGraphic" in2="light" result="blend" />
          </filter>
        </defs>
      </svg>

      {/* 📐 Drafting Table Backdrop Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(210, 180, 140, 0.08), transparent 85%),
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      />

      <div className="absolute top-4 right-4 flex items-center gap-2 text-neutral-400 font-mono text-xs z-50">
        <button 
          onClick={handleReplay} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900/60 border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all pointer-events-auto cursor-pointer"
        >
          <RotateCcw size={12} /> Replay Scroll
        </button>
      </div>

      {/* 📦 Main perspective container */}
      <motion.div
        className="relative flex items-center justify-start w-full h-full"
        style={{
          width: '100vw',
          height: '100vh',
          perspective: 1500,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* 📜 THE ROLLED BLUEPRINT SCROLL CANVAS */}
        <motion.div
          className="relative bg-[#f0dfcc] shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-visible"
          style={{
            clipPath: stage === 'reveal' ? 'none' : jaggedClipPath,
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d'
          }}
          initial="hidden"
          animate={
            stage === 'hidden' ? 'hidden' :
            stage === 'entry' ? 'entry' :
            stage === 'unrolling' ? 'unrolling' :
            stage === 'flattening' ? 'flattening' :
            stage === 'expanding' ? 'expanding' : 'reveal'
          }
          variants={{
            hidden: {
              x: -300,
              rotate: -12,
              width: 60,
              height: 220,
              opacity: 0,
              scale: 0.98
            },
            entry: {
              x: 0,
              rotate: 4,
              width: 60,
              height: 220,
              opacity: 1,
              scale: 1,
              transition: { type: 'spring', stiffness: 90, damping: 13 }
            },
            unrolling: {
              x: 0,
              rotate: 0,
              width: '100vw',
              height: 220,
              opacity: 1,
              scale: 1,
              transition: { duration: 1.1, ease: 'easeInOut' }
            },
            flattening: {
              x: 0,
              rotate: 0,
              width: '100vw',
              height: 220,
              opacity: 1,
              scale: 1,
              transition: { duration: 0.4 }
            },
            expanding: {
              x: 0,
              rotate: 0,
              width: '100vw',
              height: '100vh',
              opacity: 1,
              scale: 1,
              transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
            },
            reveal: {
              x: 0,
              rotate: 0,
              width: '100vw',
              height: '100vh',
              opacity: 1,
              scale: 1
            }
          }}
        >
          {/* 📜 TEXTURED PAPER BACKGROUND (Filtered separately so text remains crisp and readable) */}
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              backgroundColor: '#f0dfcc',
              filter: 'url(#kraft-paper-texture)',
              zIndex: 0
            }}
          />

          {/* 🌾 Scattered Vintage Paper Fibers Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-6 mix-blend-multiply" style={{ zIndex: 1 }}>
            <svg className="w-full h-full">
              {fibers.map((fiber, idx) => (
                <path
                  key={idx}
                  d={`M ${fiber.x} ${fiber.y} Q ${fiber.x + Math.sin(fiber.angle) * fiber.length / 2} ${fiber.y + Math.cos(fiber.angle) * fiber.length / 2}, ${fiber.x + Math.sin(fiber.angle) * fiber.length} ${fiber.y + Math.cos(fiber.angle) * fiber.length}`}
                  stroke="#4c3624"
                  strokeWidth="0.4"
                  fill="none"
                  strokeLinecap="round"
                  opacity={fiber.opacity}
                  transform={`rotate(${fiber.angle} ${fiber.x} ${fiber.y})`}
                />
              ))}
            </svg>
          </div>

          {/* 🪵 Aging Vignette shading */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.08) 100%)',
              mixBlendMode: 'multiply',
              zIndex: 2
            }}
          />

          {/* 3D ACCORDION CREASE SYSTEM (Simulating fold lines release) */}
          <div className="absolute inset-0 w-full h-full flex transform-style-3d pointer-events-none" style={{ zIndex: 3 }}>
            {/* Panel 1 (Left 33.3%) */}
            <motion.div 
              className="h-full border-r border-[#6b5643]/10 transform-style-3d"
              style={{ width: '33.33%', transformOrigin: 'right center' }}
              animate={stage === 'flattening' ? { rotateY: [12, 0] } : stage === 'unrolling' ? { rotateY: 12 } : { rotateY: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {/* Panel 2 (Middle 33.3%) */}
            <motion.div 
              className="h-full border-r border-[#6b5643]/10 transform-style-3d"
              style={{ width: '33.33%', transformOrigin: 'center center' }}
              animate={stage === 'flattening' ? { rotateY: [-16, 0] } : stage === 'unrolling' ? { rotateY: -16 } : { rotateY: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {/* Panel 3 (Right 33.3%) */}
            <motion.div 
              className="h-full transform-style-3d"
              style={{ width: '33.33%', transformOrigin: 'left center' }}
              animate={stage === 'flattening' ? { rotateY: [12, 0] } : stage === 'unrolling' ? { rotateY: 12 } : { rotateY: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* 📐 Crease Line Shadow Overlays */}
          <motion.div 
            className="absolute left-[33.33%] top-0 bottom-0 w-[40px] -translate-x-1/2 pointer-events-none mix-blend-multiply opacity-25"
            style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)', zIndex: 3 }}
            animate={stage === 'reveal' || stage === 'expanding' ? { opacity: 0.05 } : { opacity: 0.25 }}
          />
          <motion.div 
            className="absolute left-[66.66%] top-0 bottom-0 w-[40px] -translate-x-1/2 pointer-events-none mix-blend-multiply opacity-25"
            style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)', zIndex: 3 }}
            animate={stage === 'reveal' || stage === 'expanding' ? { opacity: 0.05 } : { opacity: 0.25 }}
          />

          {/* 🌀 THE CYLINDRICAL SCROLL ROLL (Travels to the right and spins/shrinks) */}
          <AnimatePresence>
            {(stage === 'entry' || stage === 'unrolling') && (
              <motion.div
                className="absolute right-0 top-0 bottom-0 bg-[#b79672] shadow-[-10px_0_30px_rgba(0,0,0,0.4)] z-40 transform-style-3d origin-center"
                style={{
                  transform: 'translateX(50%)',
                  backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(255,255,255,0.1) 15%, rgba(255,255,255,0.25) 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.45) 85%, rgba(0,0,0,0.7) 100%)'
                }}
                initial="initial"
                animate={stage === 'unrolling' ? 'unrolling' : 'initial'}
                exit="exit"
                variants={{
                  initial: {
                    width: 48,
                    opacity: 1,
                    rotateY: 0
                  },
                  unrolling: {
                    width: [48, 12], // Shrink cylinder roll as paper unrolls
                    rotateY: 720,    // Spin cylinder roll
                    transition: { duration: 1.0, ease: 'easeInOut' }
                  },
                  exit: {
                    opacity: 0,
                    width: 0,
                    transition: { duration: 0.3 }
                  }
                }}
              >
                {/* Cylinder top spiral cap */}
                <div 
                  className="absolute top-0 left-0 right-0 h-4 rounded-full bg-[#9b7e5f] border border-[#524133] overflow-hidden" 
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <div className="absolute inset-1 rounded-full border border-[#6d5540] opacity-50" />
                  <div className="absolute inset-2 rounded-full border border-[#6d5540] opacity-50" />
                  <div className="absolute inset-3 rounded-full border border-[#6d5540] opacity-50" />
                </div>
                {/* Cylinder bottom spiral cap */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-4 rounded-full bg-[#9b7e5f] border border-[#524133] overflow-hidden" 
                  style={{ transform: 'translateY(50%)' }}
                >
                  <div className="absolute inset-1 rounded-full border border-[#6d5540] opacity-50" />
                  <div className="absolute inset-2 rounded-full border border-[#6d5540] opacity-50" />
                  <div className="absolute inset-3 rounded-full border border-[#6d5540] opacity-50" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🏷️ VINTAGE STAMPS */}
          <div className="absolute top-[28%] right-[8%] select-none pointer-events-none opacity-35 mix-blend-multiply border-2 border-dashed border-[#8d3030] text-[#8d3030] font-mono text-[10px] md:text-xs font-bold uppercase py-1 px-2.5 rotate-[15deg] rounded">
            ORIGAMI VOL. 01 // APPROVED
          </div>
          <div className="absolute bottom-[20%] left-[5%] select-none pointer-events-none opacity-25 mix-blend-multiply border-4 border-double border-indigo-900 text-indigo-900 font-mono text-[9px] font-bold uppercase py-0.5 px-2 -rotate-[8deg]">
            CLASSIFIED // CP-PORTFOLIO
          </div>

          {/* 📝 PORTFOLIO CONTENT PRINT REVEAL */}
          {stage === 'reveal' && (
            <motion.div
              className="w-full h-full p-6 md:p-12 overflow-y-auto select-text relative z-10 flex flex-col justify-between custom-scrollbar"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                {/* 📰 HEADER MASTHEAD */}
                <header className="border-b-4 border-double border-[#2b1b11] pb-6 mb-8 relative">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-950">
                      {personal.name}
                    </h1>
                    <span className="font-mono text-xs uppercase tracking-widest text-neutral-950 border border-neutral-950 px-2 py-0.5 rounded font-bold">
                      Portfolio Blueprint
                    </span>
                  </div>
                  <p className="text-lg md:text-xl font-bold font-serif italic text-neutral-900 mt-1.5">
                    {personal.title}
                  </p>

                  <div className="flex flex-wrap gap-y-2 gap-x-4 mt-4 font-mono text-xs text-neutral-900 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-neutral-950" />
                      {personal.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} className="text-neutral-950" />
                      {personal.email}
                    </span>
                    {personal.website && (
                      <span className="flex items-center gap-1.5">
                        <Compass size={13} className="text-neutral-950" />
                        <a href={personal.website} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-0.5 text-neutral-950 font-bold">
                          {personal.website.replace(/^https?:\/\//, '')} <ExternalLink size={9} />
                        </a>
                      </span>
                    )}
                  </div>
                </header>

                {/* 🗺️ MAIN POSTER GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column (Manifesto & Core Arsenal) */}
                  <div className="lg:col-span-4 space-y-8">
                    {/* Bio Card */}
                    <section className="border-2 border-neutral-950 p-5 bg-[#eedcb5]/35 rounded relative">
                      <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-950/30 pb-2 mb-3 flex items-center gap-2">
                        <Compass size={14} className="text-neutral-950" /> Manifesto // Bio
                      </h2>
                      <p className="text-sm leading-relaxed text-neutral-950 font-serif">
                        {personal.bio}
                      </p>
                      {personal.tagline && (
                        <p className="text-xs italic text-neutral-900 border-t border-dashed border-neutral-950/20 mt-3 pt-3">
                          "{personal.tagline}"
                        </p>
                      )}
                    </section>

                    {/* Skills Stamped labels */}
                    <section className="border-2 border-neutral-950 p-5 bg-[#eedcb5]/35 rounded">
                      <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-950/30 pb-2 mb-4 flex items-center gap-2">
                        <Award size={14} className="text-neutral-950" /> Core Arsenal [Skills]
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => {
                          const skillName = typeof skill === 'string' ? skill : skill.name;
                          return (
                            <span 
                              key={index} 
                              className="bg-neutral-900 text-neutral-50 font-mono text-[10px] uppercase font-bold tracking-tight px-2.5 py-1 rounded shadow-[1px_1px_3px_rgba(0,0,0,0.15)]"
                            >
                              {skillName}
                            </span>
                          );
                        })}
                      </div>
                    </section>

                    {/* Social coordinates */}
                    <section className="border-2 border-neutral-950 p-5 bg-[#eedcb5]/35 rounded font-mono text-xs">
                      <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-950 border-b border-neutral-950/30 pb-2 mb-3 flex items-center gap-2">
                        📡 Coordinates
                      </h2>
                      <div className="space-y-2.5">
                        {socials.github && (
                          <a href={socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-neutral-900 hover:text-black font-semibold hover:underline">
                            <span className="flex items-center gap-2"><Github size={13} /> github</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                        {socials.linkedin && (
                          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-neutral-900 hover:text-black font-semibold hover:underline">
                            <span className="flex items-center gap-2"><Linkedin size={13} /> linkedin</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                        {socials.twitter && (
                          <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-neutral-900 hover:text-black font-semibold hover:underline">
                            <span className="flex items-center gap-2"><Twitter size={13} /> twitter</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </section>
                  </div>

                  {/* Right Column (Experience & Projects) */}
                  <div className="lg:col-span-8 space-y-8">
                    {/* Experience Section */}
                    <section className="space-y-4">
                      <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-950 border-b-2 border-neutral-950 pb-2 flex items-center gap-2">
                        <Briefcase size={15} className="text-neutral-950" /> Logged Fragments [Experience]
                      </h2>
                      <div className="space-y-4">
                        {experience.map((exp, idx) => (
                          <div 
                            key={idx}
                            className="border border-neutral-950/30 bg-[#fdfaf2]/40 p-4 rounded hover:border-neutral-950/60 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                              <h3 className="text-md font-bold uppercase text-neutral-950 font-serif">
                                {exp.role || exp.position}
                              </h3>
                              <span className="font-mono text-[10px] text-white bg-neutral-900 px-2 py-0.5 rounded shrink-0 font-bold">
                                {exp.period || exp.startDate}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-neutral-900 uppercase mb-2">
                              @{exp.company}
                            </h4>
                            <p className="text-xs leading-relaxed text-neutral-950 font-serif">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Projects Section */}
                    <section className="space-y-4">
                      <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-950 border-b-2 border-neutral-950 pb-2 flex items-center gap-2">
                        🛠️ Cut-out Blueprints [Projects]
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {projects.map((proj, idx) => (
                          <div 
                            key={idx}
                            className="border-2 border-dashed border-neutral-950/40 bg-[#fdfaf2]/30 p-4 rounded hover:border-neutral-950/70 transition-colors flex flex-col justify-between"
                          >
                            <div>
                              <div className="bg-[#1b1008]/5 aspect-video mb-3 rounded flex items-center justify-center p-2 text-center border border-neutral-950/15">
                                <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-800">
                                  // Blueprint_{idx + 1}
                                </span>
                              </div>
                              <h3 className="text-sm font-bold uppercase text-neutral-950 mb-1.5 font-serif">
                                {proj.title || proj.name}
                              </h3>
                              <p className="text-[11px] leading-relaxed text-neutral-950 mb-4">
                                {proj.description}
                              </p>
                            </div>

                            <div>
                              <div className="flex flex-wrap gap-1 mb-4">
                                {(proj.techStack || proj.technologies || []).map((tech, tIdx) => (
                                  <span key={tIdx} className="text-[9px] font-mono border border-neutral-950/40 px-1.5 py-0.5 rounded bg-[#f0dfcc] text-neutral-950 font-medium">
                                    {tech}
                                  </span>
                                ))}
                              </div>

                              <div className="flex gap-3">
                                {proj.liveUrl && (
                                  <a 
                                    href={proj.liveUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="font-mono text-[10px] font-bold text-white bg-neutral-900 px-3 py-1.5 rounded hover:bg-neutral-950 transition-colors flex items-center gap-1"
                                  >
                                    Live <ExternalLink size={10} />
                                  </a>
                                )}
                                {proj.githubUrl && (
                                  <a 
                                    href={proj.githubUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="font-mono text-[10px] font-bold border border-neutral-900 text-neutral-900 px-3 py-1 rounded hover:bg-neutral-900 hover:text-white transition-colors flex items-center gap-1"
                                  >
                                    Code <Github size={10} />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Testimonial Quote */}
                    {testimonials.length > 0 && (
                      <section className="border-4 border-double border-neutral-950 p-5 bg-[#fdfaf2]/30 rounded relative">
                        <Compass className="absolute bottom-3 right-3 text-neutral-950/10 w-12 h-12" />
                        <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-neutral-950 mb-3">
                          📜 Dispatch From Adventurer
                        </h2>
                        <blockquote className="text-xs italic leading-relaxed text-neutral-950 font-serif mb-3 font-semibold">
                          "{testimonials[0].text || testimonials[0].content}"
                        </blockquote>
                        <cite className="block text-[10px] font-mono font-bold text-neutral-900 text-right">
                          — {testimonials[0].name}, {testimonials[0].role}
                        </cite>
                      </section>
                    )}
                  </div>
                </div>
              </div>

              {/* 📰 FOOTER SIGN-OFF */}
              <footer className="border-t border-neutral-900/30 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-neutral-900 font-medium">
                <p>© 2026 {personal.name}. All coordinates locked.</p>
                <p>Blueprint Unroll Template // System</p>
              </footer>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
