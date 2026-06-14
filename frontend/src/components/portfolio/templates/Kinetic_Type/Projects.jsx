import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Projects() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-gray-950">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-5xl w-full"
      >
        {/* Section title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Projects
            </span>
            <span className="text-gray-600 ml-4">/</span>
          </h2>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 rounded-xl overflow-hidden transition-all duration-300"
            >
              {/* Project image */}
              <div className="relative h-48 md:h-56 overflow-hidden bg-gray-800">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-950 opacity-60"></div>
              </div>

              {/* Project content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-100 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all"
                >
                  {project.title}
                </motion.h3>

                {/* Description */}
                <p className="text-gray-400 text-sm line-clamp-3 group-hover:text-gray-300 transition-colors">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="px-3 py-1 text-xs font-medium bg-gray-800 text-cyan-400 rounded-full border border-cyan-400/30"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-4 border-t border-gray-700/30">
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition-all text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} />
                    Visit
                  </motion.a>
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 rounded-lg transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={16} />
                    Code
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Projects count */}
        <motion.div variants={itemVariants} className="mt-16 pt-12 border-t border-gray-700/30 text-center">
          <p className="text-gray-400">
            <span className="text-cyan-400 font-semibold text-2xl">{data.projects.length}</span>{' '}
            <span>Featured Projects</span>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
