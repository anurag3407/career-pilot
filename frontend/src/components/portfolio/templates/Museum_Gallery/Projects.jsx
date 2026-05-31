import React from 'react';

import { motion } from 'framer-motion';
import { 
  ExternalLink, 
  Code,
  Sparkles
} from 'lucide-react';


const Projects = ({data}) => {
  const { projects } = data;
  
  return (
    <section id="projects" className="py-20 md:py-28 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div className="w-12 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-50 mb-4 font-serif tracking-tight">
            Gallery Collection
          </h2>
          <p className="text-lg text-amber-300 font-serif italic">Exquisite Masterpieces</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group cursor-pointer m-4"
            >
              {/* Ornate 3D gold frame */}
              <div className="absolute -inset-3 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-400 rounded-xl shadow-2xl" />
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-800 via-amber-900 to-amber-800 rounded-xl" />
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-600 rounded-xl" />
              
              <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all">
                {project.image && (
                  <div className="relative h-48 md:h-56 bg-gradient-to-br from-amber-100 to-yellow-100 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent" />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-l md:text-2xl font-bold text-amber-900 mb-3 font-serif group-hover:text-amber-700 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-s md:text-base line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.techStack?.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs md:text-sm rounded-full font-medium border border-amber-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl font-medium text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-4 py-2 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-all font-medium text-sm"
                      >
                        <Code className="w-4 h-4" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Ornate corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600 rounded-br-lg" />
                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;