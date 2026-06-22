import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Projects({ projects }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-[#f5f1ed] to-[#ede7de]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-[#f0ebe6] to-transparent rounded-full blur-3xl opacity-20" />
      </div>

      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#3e3a37] via-[#8b6f47] to-[#3e3a37] bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#c7a77f] to-[#b8956a] rounded-full" />
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              onHoverStart={() => setHoveredIdx(index)}
              onHoverEnd={() => setHoveredIdx(null)}
              whileHover={{ y: -8 }}
              className="group h-full rounded-3xl overflow-hidden transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(240,235,230,0.4) 100%)',
                boxShadow: hoveredIdx === index
                  ? '0 30px 80px rgba(199, 167, 127, 0.25)'
                  : '0 12px 40px rgba(199, 167, 127, 0.12)'
              }}
            >
              {/* Project Image Container */}
              <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden bg-gradient-to-br from-[#e8ddd6] to-[#d4c5b5]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Image Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIdx === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-[#3e3a37] via-transparent to-transparent opacity-60"
                />

                {/* View Project Link on Hover */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: hoveredIdx === index ? 1 : 0, y: hoveredIdx === index ? 0 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <p className="text-white font-semibold text-lg">View Project</p>
                </motion.div>
              </div>

              {/* Project Content */}
              <div className="p-7 sm:p-8 flex flex-col h-full">
                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#3e3a37] mb-3 group-hover:text-[#c7a77f] transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-[#7a6f66] text-sm sm:text-base leading-relaxed font-light mb-5 flex-grow">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-6">
                  <p className="text-xs text-[#8b6f47] font-semibold uppercase tracking-widest mb-3">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(199, 167, 127, 0.15) 0%, rgba(184, 149, 106, 0.08) 100%)',
                          color: '#8b6f47',
                          border: '1px solid rgba(199, 167, 127, 0.2)'
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-6 border-t border-[#e8ddd6]">
                  {project.liveUrl && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2.5 text-center font-semibold text-sm sm:text-base text-white rounded-xl transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #c7a77f 0%, #b8956a 100%)',
                        boxShadow: '0 6px 20px rgba(199, 167, 127, 0.2)'
                      }}
                    >
                      Live
                    </motion.a>
                  )}
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-4 py-2.5 text-center font-semibold text-sm sm:text-base text-[#c7a77f] rounded-xl border-2 border-[#c7a77f] hover:bg-[#faf8f5] transition-all duration-300"
                    >
                      Code
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

