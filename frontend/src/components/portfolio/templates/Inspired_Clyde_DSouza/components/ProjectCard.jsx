import React from 'react';
import { Globe, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, index }) => {
  const defaultBadges = ['PROJECT', 'OPEN SOURCE', 'HIGHLIGHT', 'WORKSHOP'];
  const badgeLabel = project.techStack?.[0] || defaultBadges[index % defaultBadges.length];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="relative rounded-sm overflow-hidden bg-[#1B995E] text-white flex flex-col h-[320px] cursor-pointer shadow-md"
    >
      {/* Top Half: Image */}
      <div className="h-[55%] w-full relative bg-gray-100 overflow-hidden">
        {/* Yellow Badge */}
        <div className="absolute top-0 left-0 bg-[#FFF000] text-gray-900 text-[10px] font-bold uppercase px-3 py-1 z-10 tracking-widest shadow-sm rounded-br-sm">
          {badgeLabel}
        </div>
        <img 
          src={project.image || 'https://via.placeholder.com/400x200'} 
          alt={project.title || "Project Screenshot"} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Half: Content */}
      <div className="h-[45%] p-5 flex flex-col relative">
        <h3 className="text-xl font-normal mb-1.5 line-clamp-1">{project.title}</h3>
        <p className="text-[13px] text-white/95 line-clamp-3 leading-snug">
          {project.description}
        </p>

        {/* Action Icons - bottom right */}
        <div className="absolute bottom-4 right-4 flex gap-3 z-20">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-white hover:text-[#FFF000] transition-colors" onClick={(e) => e.stopPropagation()}>
              <Github className="w-[18px] h-[18px]" />
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-white hover:text-[#FFF000] transition-colors" onClick={(e) => e.stopPropagation()}>
              <Globe className="w-[18px] h-[18px]" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
