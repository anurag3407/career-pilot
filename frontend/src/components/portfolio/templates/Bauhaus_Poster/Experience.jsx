import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const Experience = () => {
  return (
    <section className="p-6 md:p-16 border-b-4 border-black bg-white">
      <h2 className="text-4xl md:text-7xl font-black uppercase mb-8 md:mb-12 flex items-center gap-3 md:gap-4"><Briefcase className="w-10 h-10 md:w-12 md:h-12" /> Track Record</h2>
      <div className="flex flex-col border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-[#F4F0EC]">
        {data.experience.map((exp, i) => (
          <motion.div key={i} whileHover={{ x: 5 }} className="flex flex-col md:flex-row border-b-4 border-black last:border-b-0 group bg-white">
            <div className="md:w-1/3 bg-black text-white p-6 md:p-8 md:border-r-4 border-black flex flex-col justify-center group-hover:bg-[#E3000F] transition-colors relative overflow-hidden">
              <span className="font-black text-xl md:text-3xl uppercase tracking-widest relative z-10">{exp.period}</span>
              <motion.div className="absolute -right-5 -bottom-5 w-16 h-16 md:-right-10 md:-bottom-10 md:w-32 md:h-32 bg-white opacity-10 rounded-full" />
            </div>
            <div className="md:w-2/3 p-6 md:p-8 group-hover:bg-[#F4F0EC] transition-colors">
              <h3 className="text-2xl md:text-4xl font-black uppercase mb-2">{exp.role}</h3>
              <h4 className="text-lg md:text-2xl font-black text-[#00509E] mb-4 md:mb-6 bg-[#FFD700] inline-block px-2 md:px-3 py-1 border-2 md:border-4 border-black transform -skew-x-6">{exp.company}</h4>
              <p className="font-bold text-base md:text-xl leading-relaxed">{exp.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
