import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const Crystal = ({ className, delay = 0, duration = 5, size = 'w-32 h-32', color = 'from-indigo-500/20 via-purple-500/10 to-emerald-500/20' }) => (
  <motion.div
    className={`absolute opacity-40 backdrop-blur-md bg-gradient-to-br ${color} ${size} ${className}`}
    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)' }}
    animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0], scale: [1, 1.05, 1] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

const AnimatedHeading = ({ title, gradientClass, lineClass }) => (
  <div className="mb-12 flex items-center gap-4">
    <motion.span className={`h-[2px] ${lineClass}`} animate={{ width: [30, 60, 30], opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
    <motion.h2 className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradientClass}`} style={{ backgroundSize: '200% auto' }} animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
      {title}
    </motion.h2>
  </div>
);

export default function Projects({ projects }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative overflow-hidden py-24 px-6">
      <Crystal className="top-1/4 left-10" size="w-64 h-64" duration={10} delay={0} color="from-purple-500/10 via-fuchsia-500/10 to-indigo-500/10" />
      <Crystal className="bottom-10 right-20" size="w-32 h-32" duration={6} delay={3} color="from-purple-500/20 via-indigo-500/10 to-slate-500/10" />

      <motion.div className="max-w-6xl mx-auto relative z-10" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <AnimatedHeading title="Projects" gradientClass="from-purple-300 to-purple-500" lineClass="bg-purple-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              className="group relative bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="h-56 overflow-hidden relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/20 transition-colors duration-500"></div>
              </div>
              <div className="p-8 relative z-10">
                <h3 className="text-2xl font-bold mb-3 text-slate-100">{project.title}</h3>
                <p className="text-slate-400 mb-6 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="text-xs text-purple-200 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                      Live Demo <ExternalLink size={16} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                      Source Code <Github size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}