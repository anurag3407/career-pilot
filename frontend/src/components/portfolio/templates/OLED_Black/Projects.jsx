import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code } from 'lucide-react';
import { fadeUp, SectionHeading } from './shared';

const ProjectCard = ({ project, index }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover="hover"
    className="group relative block w-full overflow-hidden border border-gray-800 bg-black"
  >
    <motion.div
      variants={{ hover: { opacity: 1 } }}
      initial={{ opacity: 0 }}
      className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-cyan-950/40 to-transparent transition-opacity duration-500"
    />

    <div className="relative h-64 overflow-hidden border-b border-gray-800">
      <motion.img
        variants={{ hover: { scale: 1.05 } }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        src={project.image}
        alt={project.title}
        className="h-full w-full object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-100"
      />
    </div>

    <div className="relative z-10 p-8">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-cyan-400">{project.title}</h3>
        <div className="flex gap-3 text-gray-500">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
              <Github size={20} />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cyan-400 hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
      <p className="mb-6 line-clamp-2 font-light text-gray-400">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.techStack.map((tech, techIndex) => (
          <span key={techIndex} className="border border-cyan-900/50 bg-cyan-950/30 px-2 py-1 font-mono text-xs text-cyan-400/70">
            {tech}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const Projects = ({ projects }) => (
  <section className="py-24">
    <SectionHeading title="Deployment" icon={Code} />
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} index={index} />
      ))}
    </div>
  </section>
);

export default Projects;