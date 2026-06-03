import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { MapPin, Mail, Github, ExternalLink, Briefcase, Award, ChevronUp, ChevronDown, Monitor, Code, Palette, Terminal } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

// --- SUB-COMPONENTS FOR EACH FLOOR ---

const Floor5Hero = ({ personal, socials }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="flex flex-col items-center justify-center h-full px-6 text-center"
  >
    <div className="relative mb-8 group">
      <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
      <img 
        src={personal.avatar} 
        alt={personal.name} 
        className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-zinc-800 shadow-2xl relative z-10"
      />
    </div>
    <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
      {personal.name}
    </h1>
    <h2 className="text-xl md:text-3xl text-cyan-400 font-medium mb-8">
      {personal.title}
    </h2>
    <div className="flex items-center gap-6 text-zinc-400">
      <span className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full border border-zinc-700/50">
        <MapPin className="w-4 h-4 text-cyan-500" /> {personal.location}
      </span>
      {socials.github && (
        <a href={socials.github} className="hover:text-white transition-colors p-2 bg-zinc-800/50 rounded-full border border-zinc-700/50 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <Github className="w-5 h-5" />
        </a>
      )}
      {socials.linkedin && (
        <a href={socials.linkedin} className="hover:text-white transition-colors p-2 bg-zinc-800/50 rounded-full border border-zinc-700/50 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        </a>
      )}
    </div>
  </motion.div>
);

const Floor4AboutSkills = ({ personal, skills }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="flex flex-col justify-center h-full max-w-4xl mx-auto px-6"
  >
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-cyan-400 uppercase border border-cyan-500/30 rounded-full bg-cyan-500/10">
          About Me
        </div>
        <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
          Crafting digital experiences with precision and passion.
        </h3>
        <p className="text-zinc-400 text-lg leading-relaxed">
          {personal.bio}
        </p>
      </div>
      
      <div className="bg-zinc-800/40 p-8 rounded-2xl border border-zinc-700/50 shadow-xl backdrop-blur-sm">
        <h4 className="text-white font-bold mb-6 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-500" /> Core Arsenal
        </h4>
        <div className="space-y-5 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {skills.map((skill, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-zinc-300">{skill.name}</span>
                <span className="text-cyan-500 font-bold">{skill.level}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.5 + (i * 0.05), ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const Floor3Projects = ({ projects }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="flex flex-col justify-center h-full max-w-6xl mx-auto px-6"
  >
    <div className="inline-block px-3 py-1 mb-8 text-xs font-bold tracking-widest text-cyan-400 uppercase border border-cyan-500/30 rounded-full bg-cyan-500/10 self-start">
      Featured Work
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.slice(0, 3).map((project, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
          className="group relative bg-zinc-800/60 rounded-2xl border border-zinc-700/50 overflow-hidden hover:border-cyan-500/50 transition-colors h-full flex flex-col"
        >
          <div className="h-48 overflow-hidden relative">
            <div className="absolute inset-0 bg-zinc-900/40 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h4>
            <p className="text-sm text-zinc-400 mb-6 flex-1 line-clamp-3">{project.description}</p>
            
            <div className="flex gap-3 mt-auto pt-4 border-t border-zinc-700/50">
              {project.liveUrl && (
                <a href={project.liveUrl} className="flex-1 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-zinc-900 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                  <ExternalLink className="w-4 h-4" /> Live
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} className="flex-1 bg-zinc-700/50 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                  <Github className="w-4 h-4" /> Code
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Floor2Experience = ({ experience }) => (
  <motion.div 
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="flex flex-col justify-center h-full max-w-4xl mx-auto px-6"
  >
    <div className="inline-block px-3 py-1 mb-10 text-xs font-bold tracking-widest text-cyan-400 uppercase border border-cyan-500/30 rounded-full bg-cyan-500/10 self-start">
      Career Journey
    </div>
    
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-700 before:to-transparent">
      {experience.map((exp, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + (i * 0.2) }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-zinc-900 bg-cyan-500 text-zinc-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-cyan-500/50 z-10">
            <Briefcase className="w-4 h-4" />
          </div>
          
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-zinc-800/40 border border-zinc-700/50 hover:border-cyan-500/30 transition-colors shadow-lg backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h4 className="font-bold text-lg text-white">{exp.role}</h4>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md mt-2 sm:mt-0">{exp.period}</span>
            </div>
            <div className="text-zinc-400 text-sm font-medium mb-3">{exp.company}</div>
            <p className="text-zinc-500 text-sm leading-relaxed">{exp.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const Floor1Contact = ({ testimonials, socials, personal }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="flex flex-col justify-center h-full max-w-5xl mx-auto px-6"
  >
    <div className="grid md:grid-cols-2 gap-16 items-center">
      {/* Testimonial (Lobby Chat) */}
      <div>
        <div className="inline-block px-3 py-1 mb-8 text-xs font-bold tracking-widest text-cyan-400 uppercase border border-cyan-500/30 rounded-full bg-cyan-500/10">
          Word on the street
        </div>
        
        {testimonials.length > 0 && (
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-zinc-800/40 p-6 rounded-3xl border border-zinc-700/50 relative">
                <div className="absolute -top-2 -left-2 text-4xl text-cyan-500/20 font-serif">"</div>
                <p className="text-zinc-300 text-base leading-relaxed italic mb-6 relative z-10">
                  {t.text}
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full ring-2 ring-cyan-500/30" />
                  <div>
                    <h5 className="text-white font-bold text-sm">{t.name}</h5>
                    <p className="text-cyan-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Contact CTA */}
      <div className="text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
          Ready to reach <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">new heights?</span>
        </h2>
        <p className="text-zinc-400 text-lg mb-10">
          The elevator is waiting. Let's discuss your next big project and bring it to the top floor.
        </p>
        
        {socials.email && (
          <a href={`mailto:${socials.email}`} className="inline-flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-900 px-8 py-4 rounded-xl text-lg font-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Mail className="w-6 h-6" /> Start a Conversation
          </a>
        )}
        
        <div className="mt-12 text-sm text-zinc-600 font-medium">
          © {new Date().getFullYear()} {personal.name}. Building the future.
        </div>
      </div>
    </div>
  </motion.div>
);


// --- MAIN ELEVATOR COMPONENT ---

export default function ElevatorPitch() {
  const containerRef = useRef(null);
  
  // Track scroll progress for the whole 500vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [currentFloor, setCurrentFloor] = useState(5);

  // Update logic to match exact scroll positions
  // 5 Floors = 5 distinct segments. 
  // F5: 0.0 - 0.2
  // F4: 0.2 - 0.4
  // F3: 0.4 - 0.6
  // F2: 0.6 - 0.8
  // F1: 0.8 - 1.0
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.8) setCurrentFloor(1);
    else if (latest >= 0.6) setCurrentFloor(2);
    else if (latest >= 0.4) setCurrentFloor(3);
    else if (latest >= 0.2) setCurrentFloor(4);
    else setCurrentFloor(5);
  });

  // Calculate Door Animations based on exact scroll thresholds
  // The doors should be FULLY CLOSED at exactly 0.2, 0.4, 0.6, 0.8 so the background can swap invisibly.
  const leftDoorX = useTransform(
    scrollYProgress,
    [
      0, 0.16, 0.2, 0.24,  // F5 -> F4
      0.36, 0.4, 0.44,     // F4 -> F3
      0.56, 0.6, 0.64,     // F3 -> F2
      0.76, 0.8, 0.84,     // F2 -> F1
      1
    ],
    [
      "-100%", "-100%", "0%", "-100%", 
      "-100%", "0%", "-100%", 
      "-100%", "0%", "-100%", 
      "-100%", "0%", "-100%", 
      "-100%"
    ]
  );
  
  const rightDoorX = useTransform(
    scrollYProgress,
    [
      0, 0.16, 0.2, 0.24,  
      0.36, 0.4, 0.44,     
      0.56, 0.6, 0.64,     
      0.76, 0.8, 0.84,     
      1
    ],
    [
      "100%", "100%", "0%", "100%", 
      "100%", "0%", "100%", 
      "100%", "0%", "100%", 
      "100%", "0%", "100%", 
      "100%"
    ]
  );

  // Floor Display Text Mapping
  const floorNames = {
    5: "PH", // Penthouse
    4: "04",
    3: "03",
    2: "02",
    1: "LB"  // Lobby
  };
  
  const floorTitles = {
    5: "PROFILE",
    4: "SKILLS",
    3: "PROJECTS",
    2: "EXPERIENCE",
    1: "CONTACT"
  };

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-zinc-950 font-sans selection:bg-cyan-500/30">
      
      {/* STICKY ELEVATOR CAR VIEWPORT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-zinc-900 border-x-[8px] md:border-x-[24px] border-zinc-800 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
        
        {/* ELEVATOR CEILING LIGHTING */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-zinc-950/80 to-transparent z-40 pointer-events-none flex justify-center pt-2">
           <div className="w-3/4 max-w-3xl h-2 bg-cyan-100/10 rounded-full blur-[2px] shadow-[0_5px_30px_rgba(6,182,212,0.15)]"></div>
        </div>

        {/* BACKGROUND FLOOR CONTENT (Swaps when doors are closed) */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-zinc-900 pt-20 pb-10">
           {/* Add subtle metallic grid background */}
           <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
           
           <AnimatePresence mode="wait">
             {currentFloor === 5 && <Floor5Hero key="f5" personal={data.personal} socials={data.socials} />}
             {currentFloor === 4 && <Floor4AboutSkills key="f4" personal={data.personal} skills={data.skills} />}
             {currentFloor === 3 && <Floor3Projects key="f3" projects={data.projects} />}
             {currentFloor === 2 && <Floor2Experience key="f2" experience={data.experience} />}
             {currentFloor === 1 && <Floor1Contact key="f1" testimonials={data.testimonials} socials={data.socials} personal={data.personal} />}
           </AnimatePresence>
        </div>

        {/* ELEVATOR DOORS */}
        <motion.div 
          style={{ x: leftDoorX }}
          className="absolute top-0 bottom-0 left-0 w-1/2 bg-zinc-800 z-20 border-r-4 border-zinc-950 shadow-[10px_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-center items-end pr-8"
        >
          {/* Door Texture Details */}
          <div className="absolute right-2 top-0 bottom-0 w-px bg-zinc-700"></div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-32 bg-zinc-900 rounded-full border border-zinc-700 shadow-inner"></div>
        </motion.div>
        
        <motion.div 
          style={{ x: rightDoorX }}
          className="absolute top-0 bottom-0 right-0 w-1/2 bg-zinc-800 z-20 border-l-4 border-zinc-950 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col justify-center items-start pl-8"
        >
          {/* Door Texture Details */}
          <div className="absolute left-2 top-0 bottom-0 w-px bg-zinc-700"></div>
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1.5 h-32 bg-zinc-900 rounded-full border border-zinc-700 shadow-inner"></div>
        </motion.div>

        {/* ELEVATOR UI OVERLAYS (Fixed inside car) */}
        
        {/* Top Digital Floor Indicator */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border-2 border-zinc-800 p-3 rounded-xl flex items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col items-center gap-1">
             <ChevronUp className={`w-4 h-4 ${currentFloor < 5 ? 'text-cyan-500 animate-pulse' : 'text-zinc-700'}`} />
             <ChevronDown className={`w-4 h-4 ${currentFloor > 1 ? 'text-cyan-500 animate-pulse' : 'text-zinc-700'}`} />
          </div>
          <div className="flex flex-col items-center border-l border-zinc-800 pl-6">
            <span className="text-red-500 font-mono text-3xl font-black tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              {floorNames[currentFloor]}
            </span>
            <span className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">
              {floorTitles[currentFloor]}
            </span>
          </div>
        </div>

        {/* Scroll Instruction Overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-zinc-500 pointer-events-none">
          <div className="text-xs font-bold tracking-widest uppercase bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800/50 backdrop-blur-sm">
            Scroll to Navigate
          </div>
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-black/50 p-2 rounded-full border border-zinc-800/50"
          >
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
