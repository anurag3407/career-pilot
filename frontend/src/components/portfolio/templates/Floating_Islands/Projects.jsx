import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects({ projects }) {
  return (
    <section id="projects" className="relative py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-6xl mx-auto"
      >
        {/* Island container */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl px-6 py-12 md:px-12 md:py-14 shadow-2xl shadow-sky-200/40 border border-white/60">
          {/* Island bottom */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-gradient-to-b from-amber-100 to-amber-300 rounded-b-[60%] opacity-50" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-6 bg-gradient-to-b from-green-200 to-green-400 rounded-b-[50%] opacity-40" />

          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10 text-center">
            Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-sky-100/50 transition-shadow"
              >
                {/* Project Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{project.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-sky-50 text-sky-600 border border-sky-100"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        <ExternalLink size={14} />
                        Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        <Github size={14} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
