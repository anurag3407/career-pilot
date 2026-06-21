import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Code } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Projects() {
  const { projects } = data;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="projects" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Featured{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Projects
          </span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="group relative flex flex-col h-full rounded-3xl bg-gray-900/30 border border-white/5 hover:border-purple-500/30 backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-gray-900/50 hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-2"
          >
            {/* Image Section */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-950">
              <img
                src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop'}
                alt={project.title || "Project Screenshot"}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech, techIdx) => (
                  <span
                    key={techIdx}
                    className="px-2.5 py-1 rounded-md bg-purple-500/5 border border-purple-500/15 text-purple-300 text-xs font-semibold uppercase tracking-wider"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {project.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <Github className="w-4 h-4" />
                  Code
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all duration-300 shadow-md shadow-purple-500/10"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
