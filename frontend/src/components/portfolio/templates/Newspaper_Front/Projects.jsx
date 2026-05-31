import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';

export default function Projects({ data }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-2xl md:text-3xl font-black text-yellow-600 mb-4 tracking-wider border-l-4 border-yellow-600 pl-4" style={{ fontFamily: 'Georgia, serif' }}>
        FEATURED PROJECTS
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {data.projects.map((project, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-stone-800 border-2 border-yellow-600 overflow-hidden hover:shadow-xl transition group"
          >
            <div className="relative overflow-hidden h-40">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-0 left-0 bg-yellow-600 text-black px-3 py-1 text-xs font-black">
                {idx + 1}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-black text-yellow-500 mb-2 text-sm md:text-base">{project.title}</h4>
              <p className="text-gray-400 text-xs md:text-sm line-clamp-2 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.techStack.slice(0, 3).map((tech, i) => (
                  <span key={i} className="text-xs bg-yellow-600/20 text-yellow-500 px-2 py-1 font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <a href={project.liveUrl} className="flex-1 flex items-center justify-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-3 text-xs transition rounded">
                  <ExternalLink size={14} /> Live
                </a>
                <a href={project.githubUrl} className="flex-1 flex items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-3 text-xs transition rounded">
                  <Code2 size={14} /> Code
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
