import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Layers } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Projects() {
  const { projects } = data;

  return (
    <section id="projects" className="py-24 bg-[#001f2d] text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl text-left">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[#ff7f50] font-mono font-bold tracking-widest uppercase mb-4 block"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Featured <span className="text-[#a3e635]">Explorations</span>
            </motion.h2>
            <p className="text-gray-400 text-lg">
              A collection of projects where I've dived deep into code, design, and problem solving.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hidden md:flex items-center gap-4 text-[#a3e635] font-medium"
          >
            <span>View All Projects</span>
            <div className="w-12 h-px bg-[#a3e635]" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#004b63]/20 border border-white/10 rounded-3xl overflow-hidden hover:border-[#a3e635]/50 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001f2d] via-transparent to-transparent opacity-60" />
                
                {/* Tech Stack Badges on Image */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-[#001f2d]/80 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-tighter text-[#a3e635]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Container */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold group-hover:text-[#a3e635] transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#ff7f50] transition-colors"
                    >
                      <Github size={20} />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-[#a3e635] transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed mb-8">
                  {project.description}
                </p>

                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#a3e635] hover:text-white transition-colors group/link"
                >
                  Deep Dive 
                  <Layers size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
