import React from 'react';
import { motion } from 'framer-motion';
import { Code, Terminal, Layers, Cpu } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const Skills = ({ colors }) => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const blockVariants = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 50 } } };

  return (
    <section className="p-6 md:p-16 border-b-4 border-black bg-[#F4F0EC]">
      <h2 className="text-4xl md:text-7xl font-black uppercase mb-8 md:mb-12 flex items-center gap-3 md:gap-4"><Code className="w-10 h-10 md:w-12 md:h-12" /> Arsenal</h2>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
        {data.skills.map((skill, index) => {
          const color = colors ? colors[index % 3] : '#E3000F';
          const icons = [Terminal, Layers, Cpu];
          const Icon = icons[index % icons.length];
          return (
            <motion.div key={index} variants={blockVariants} whileHover="hover" className="bg-white border-4 border-black p-5 md:p-6 flex flex-col items-start relative group cursor-crosshair shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity z-0" style={{ backgroundColor: color }} />
              <motion.div variants={{ hover: { rotate: 180, scale: 1.1 } }} transition={{ type: 'spring', stiffness: 200, damping: 10 }} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-black mb-4 md:mb-6 flex items-center justify-center z-10 bg-white" style={{ borderBottomColor: color, borderRightColor: color }}>
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-black uppercase mb-2 z-10">{skill.name}</h3>
              <p className="text-sm md:text-base font-bold text-gray-700 z-10 border-l-4 pl-3" style={{ borderColor: color }}>{skill.level} | {skill.category}</p>
              <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-l-4 border-b-4 border-black transition-all duration-300 group-hover:w-12 group-hover:h-12 md:group-hover:w-16 md:group-hover:h-16" style={{ backgroundColor: color }} />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Skills;
