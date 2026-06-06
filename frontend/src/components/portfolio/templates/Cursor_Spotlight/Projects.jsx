import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, GithubIcon, Code2 } from 'lucide-react';

const Projects = ({ projects }) => {
  return (
    <section className="relative z-10 mx-auto max-w-5xl py-24 px-6">
      <div className="mb-12 flex items-center gap-4">
        <Code2 className="text-blue-500" />
        <h2 className="text-3xl font-bold text-white">Projects</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover="hover"
            className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-1"
          >
            <motion.div 
              variants={{
                hover: { opacity: 1, background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)", backgroundSize: "200% 100%" }
              }}
              initial={{ opacity: 0 }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 z-0"
            />
            
            <div className="relative z-10 h-full w-full rounded-xl bg-zinc-950 p-6 flex flex-col">
              <div className="mb-4 overflow-hidden rounded-lg">
                <motion.img 
                  variants={{ hover: { scale: 1.1, filter: "hue-rotate(15deg) contrast(1.2)" } }}
                  transition={{ duration: 0.4 }}
                  src={project.image} 
                  alt={project.title} 
                  className="h-48 w-full object-cover opacity-60 transition-opacity group-hover:opacity-100" 
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{project.title}</h3>
              <p className="mb-6 text-sm text-zinc-400">{project.description}</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {Array.isArray(project.techStack) && project.techStack.map((tech, j) => (
                  <span key={j} className="rounded bg-blue-500/10 px-2 py-1 text-xs text-blue-400">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 mt-auto">
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-400">
                  <ExternalLink size={16} /> Live Demo
                </a>
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                  <GithubIcon size={16} /> Source
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;