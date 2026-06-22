import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const About = () => {
  return (
    <section className="p-6 md:p-16 border-b-4 border-black bg-white grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
      <div className="md:col-span-4 flex justify-center">
        <motion.div whileHover={{ rotate: 90 }} transition={{ type: 'spring', stiffness: 100 }} className="w-32 sm:w-48 md:w-full md:max-w-[250px] aspect-square bg-[#E3000F] rounded-tl-full rounded-br-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center cursor-pointer">
          <User className="text-white w-16 h-16 md:w-24 md:h-24" />
        </motion.div>
      </div>
      <div className="md:col-span-8">
        <h2 className="text-4xl md:text-7xl font-black uppercase mb-6 flex items-center gap-4">Overview <span className="h-2 md:h-4 grow bg-black"></span></h2>
        <p className="text-lg md:text-3xl font-medium leading-relaxed mb-6 md:mb-8">{data.personal.bio}</p>
        <div className="flex flex-wrap md:flex-nowrap gap-6 md:gap-8 font-black text-base md:text-xl uppercase border-t-4 border-black pt-6 md:pt-8">
          <div className="flex items-center gap-3 md:gap-4 group">
            <span className="text-4xl md:text-5xl text-[#00509E] group-hover:scale-125 transition-transform">{data.stats.yearsExperience}+</span>
            <span className="leading-tight">Years<br/>Experience</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 group">
            <span className="text-4xl md:text-5xl text-[#E3000F] group-hover:scale-125 transition-transform">{data.stats.projectsCompleted}</span>
            <span className="leading-tight">Projects<br/>Completed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
