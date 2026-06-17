import React from 'react';
import { motion } from 'framer-motion';

export default function Projects({ data }) {
  const projects = data?.projects || [];

  if (projects.length === 0) return null;

  return (
    <section className="w-full py-24 px-6 md:px-16 border-b border-dashed border-[#8d6e63]">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-4xl font-black mb-16 text-center text-[#2e1d16] tracking-widest uppercase font-serif">
          <span className="border-b border-[#5d4037] pb-2 px-8 inline-block">Discoveries & Artifacts</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-[#faf3e3] border-2 border-[#d7c4a9] p-6 shadow-[4px_4px_15px_rgba(62,39,35,0.1)] relative group hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Photo corners styling */}
              <div className="absolute top-0 left-0 w-4 h-4 bg-[#c4a482]"></div>
              <div className="absolute top-0 right-0 w-4 h-4 bg-[#c4a482]"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#c4a482]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#c4a482]"></div>
              
              <div className="aspect-video w-full bg-[#e8dac1] mb-6 overflow-hidden border border-[#c4a482] sepia-[0.3]">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#8d6e63] italic font-serif">No Sketch Available</span>
                  </div>
                )}
              </div>
              
              <h4 className="text-xl font-bold text-[#2e1d16] mb-3 uppercase tracking-wider">{project.title}</h4>
              <p className="text-[#5d4037] text-sm mb-4 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies?.map((tech, i) => (
                  <span key={i} className="text-xs font-bold uppercase tracking-wider bg-[#e8dac1] text-[#3e2723] px-2 py-1 border border-[#c4a482]">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 border-t border-[#d7c4a9] pt-4">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#8d6e63] hover:text-[#2e1d16] font-bold text-sm tracking-widest uppercase transition-colors">
                    [ Blueprint ]
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#8d6e63] hover:text-[#2e1d16] font-bold text-sm tracking-widest uppercase transition-colors">
                    [ Expedition ]
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
