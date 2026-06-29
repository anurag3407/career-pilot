import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from './PortfolioContext';
import { Github, ExternalLink } from 'lucide-react';

export default function Projects() {
  const { projects } = usePortfolio();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  };

  return (
    <section
      id="projects"
      className="relative py-28 md:py-36 px-6 border-b border-slate-900/60 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">[[ 04 // Exhibition ]]</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold font-outfit text-white mb-6"
          >
            Featured Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto font-light"
          >
            Completed digital artworks, engineered with precision, displayed on the canvas.
          </motion.p>
        </div>

        {/* Projects Grid */}
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
              className="group relative flex flex-col bg-[#05050c]/80 border border-slate-900 rounded-xl overflow-hidden hover:border-slate-800 transition-all duration-300"
            >
              {/* Image Container with Zoom & Overlay */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-900/80">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Overlay layer on hover */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] flex items-center justify-center gap-4 z-20">
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-900 hover:bg-white hover:text-black border border-slate-800 hover:border-white rounded-full text-slate-200 transition-all cursor-pointer"
                      title="View Source"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-900 hover:bg-white hover:text-black border border-slate-800 hover:border-white rounded-full text-slate-200 transition-all cursor-pointer"
                      title="Live Preview"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Details Container */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-white transition-colors uppercase tracking-widest">
                    Exhib. {index + 1}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-white transition-colors" />
                </div>

                <h3 className="text-xl font-bold font-outfit text-white group-hover:text-white transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-sm font-light text-slate-400 leading-relaxed flex-grow mb-6">
                  {project.description}
                </p>

                {/* Tech stack tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {(project.techStack || []).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-900 text-slate-400 rounded group-hover:border-slate-800/80 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
