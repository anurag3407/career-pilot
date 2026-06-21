// frontend/src/components/portfolio/templates/Elevator_Pitch/Components.jsx
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, ExternalLink, ChevronDown } from 'lucide-react';

// --- MAGNETIC BUTTON COMPONENT ---
export const MagneticButton = ({ children, href }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, willChange: "transform" }}
      className="p-3 md:p-4 rounded-full bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700 transition-colors text-zinc-300 hover:text-white relative overflow-hidden group"
    >
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
};

// --- HERO SECTION ---
export const Hero = ({ personal, socials }) => {
  return (
    <motion.div 
      animate={{ y: [-3, 3, -3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ willChange: "transform" }}
      className="flex flex-col items-center text-center space-y-8 mt-16"
    >
      <div className="relative inline-block">
        <img 
          src={personal.avatar} 
          alt={personal.name || "Profile Avatar"} 
          className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-700 object-cover shadow-xl"
        />
        <motion.div 
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-emerald-500 rounded-full border-2 border-zinc-900 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        />
      </div>
      
      <div className="space-y-4 px-4">
        <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tighter">
          {personal.name}
        </h1>
        <p className="text-lg md:text-2xl text-zinc-400 font-mono">
          {personal.title} | {personal.location}
        </p>
      </div>

      <div className="flex gap-4 md:gap-6 pt-4 md:pt-8">
        {socials.github && <MagneticButton href={socials.github}><Github size={20} /></MagneticButton>}
        {socials.linkedin && <MagneticButton href={socials.linkedin}><Linkedin size={20} /></MagneticButton>}
        {socials.twitter && <MagneticButton href={socials.twitter}><Twitter size={20} /></MagneticButton>}
      </div>

      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="pt-12 md:pt-20 text-zinc-500 flex flex-col items-center gap-2"
      >
        <ChevronDown size={28} />
      </motion.div>
    </motion.div>
  );
};

// --- PROJECTS SECTION ---
export const ProjectCard = ({ project }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ willChange: "transform, opacity" }}
      className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800"
    >
      <div className="aspect-video overflow-hidden bg-zinc-950">
        <img 
          src={project.image} 
          alt={project.title || "Project Screenshot"} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
      </div>
      
      <div className="p-5 md:p-6 relative z-20">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{project.title}</h3>
        <p className="text-sm md:text-base text-zinc-400 mb-6">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map(tech => (
            <span key={tech} className="px-2 py-1 text-xs font-mono text-zinc-300 bg-zinc-800 rounded-md border border-zinc-700">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
              <Github size={16} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};