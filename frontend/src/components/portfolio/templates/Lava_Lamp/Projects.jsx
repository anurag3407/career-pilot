import React from 'react';
import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { LiquidHeading } from './Shared';

const Projects = ({ data }) => (
  <section id="projects" className="scroll-mt-32 relative z-10 mt-24 md:mt-32">
    <LiquidHeading title="Projects" colorCode="bg-[#e15f41]" />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
      {data.projects.map((project, idx) => (
        <motion.div 
          key={project.title}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          whileHover="hover"
          className="bg-[#fdf3e7] border-4 border-[#2b1318] flex flex-col overflow-hidden shadow-[12px_12px_0px_0px_#2b1318] md:shadow-[16px_16px_0px_0px_#2b1318] will-change-transform"
          animate={{ borderRadius: ["20px", "30px", "20px"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          variants={{
             hover: { 
               borderRadius: "60% 40% 50% 50% / 40% 50% 60% 50%",
               y: -5,
               transition: { duration: 0.3 }
             }
          }}
        >
          <div className="h-56 sm:h-64 md:h-80 border-b-4 border-[#2b1318] relative overflow-hidden bg-[#2b1318]">
            <motion.img 
              variants={{ hover: { scale: 1.05, opacity: 0.6 } }}
              transition={{ duration: 0.4 }}
              src={project.image || `https://picsum.photos/seed/${idx}/800/600`} 
              alt={project.title} 
              className="w-full h-full object-cover will-change-transform"
            />
            <motion.div 
              variants={{ hover: { scale: 1.5, opacity: 1 } }}
              initial={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-[#f28e2b] mix-blend-color flex items-center justify-center rounded-full origin-center will-change-transform"
              transition={{ duration: 0.4 }}
            />
          </div>
          
          <div className="p-6 md:p-8 flex flex-col flex-grow bg-[#fdf3e7]">
            <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase text-[#ff5e57] break-words">{project.title}</h3>
            <p className="font-sans font-medium mb-8 text-lg md:text-xl text-[#2b1318] flex-grow">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.map(tech => (
                <span key={tech} className="bg-[#2b1318] text-[#fdf3e7] px-4 py-1 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider">
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="flex gap-4">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex-1 text-center font-black uppercase bg-[#e15f41] text-[#fdf3e7] py-3 rounded-xl border-4 border-[#2b1318] shadow-[4px_4px_0px_0px_#2b1318] hover:translate-y-1 hover:shadow-none transition-all">
                  Launch
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center font-black uppercase bg-[#fdf3e7] text-[#2b1318] px-6 py-3 rounded-xl border-4 border-[#2b1318] shadow-[4px_4px_0px_0px_#2b1318] hover:translate-y-1 hover:shadow-none transition-all">
                  <Github size={24} />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Projects;