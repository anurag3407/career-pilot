import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const Projects = () => {
  return (
    <section className="p-6 md:p-16 border-b-4 border-black bg-[#00509E] relative overflow-hidden">
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="absolute -right-20 -top-20 w-64 h-64 md:-right-32 md:-top-32 md:w-96 md:h-96 border-[20px] md:border-[40px] border-[#E3000F] rounded-full mix-blend-multiply opacity-80 pointer-events-none" />
      <h2 className="text-4xl md:text-7xl font-black uppercase text-white mb-8 md:mb-12 relative z-10">Selected Works</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 relative z-10">
        {data.projects.map((project, i) => (
          <motion.div key={i} whileHover={{ y: -5, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-white border-4 border-black flex flex-col h-full shadow-[8px_8px_0px_0px_rgba(227,0,15,1)] md:shadow-[16px_16px_0px_0px_rgba(227,0,15,1)] group">
            <div className="overflow-hidden border-b-4 border-black relative">
              <motion.div className="absolute inset-0 bg-[#FFD700] mix-blend-color opacity-0 group-hover:opacity-50 transition-opacity z-10 pointer-events-none" />
              <img src={project.image} alt={project.title} className="w-full h-48 md:h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105" />
            </div>
            <div className="p-5 md:p-8 flex flex-col flex-grow">
              <h3 className="text-2xl md:text-4xl font-black uppercase mb-3 md:mb-4">{project.title}</h3>
              <p className="text-base md:text-lg font-bold mb-5 md:mb-6 flex-grow border-l-4 md:border-l-8 border-[#00509E] pl-3 md:pl-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6 md:mb-8">{project.techStack.map((tech, idx) => (<span key={idx} className="bg-[#F4F0EC] text-xs md:text-sm font-black px-2 py-1 md:px-3 uppercase border-2 border-black whitespace-nowrap">{tech}</span>))}</div>
              <div className="flex flex-row gap-3 md:gap-4 mt-auto">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#FFD700] py-3 md:py-4 border-2 md:border-4 border-black font-black uppercase text-sm md:text-base text-center flex items-center justify-center gap-1 md:gap-2 hover:bg-black hover:text-[#FFD700] transition-colors whitespace-nowrap">Live <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6"/></a>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white py-3 md:py-4 border-2 md:border-4 border-black font-black uppercase text-sm md:text-base text-center flex items-center justify-center gap-1 md:gap-2 hover:bg-[#E3000F] hover:text-white transition-colors whitespace-nowrap"><Github className="w-4 h-4 md:w-6 md:h-6"/> Code</a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
