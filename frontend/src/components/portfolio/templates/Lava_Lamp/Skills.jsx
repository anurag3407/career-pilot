import React from 'react';
import { motion } from 'framer-motion';
import { LiquidHeading } from './Shared';

const Skills = ({ data }) => {
  const colors = ['bg-[#f28e2b]', 'bg-[#ff5e57]', 'bg-[#e15f41]'];

  return (
    <section id="skills" className="scroll-mt-32 relative z-10 mt-24 md:mt-32">
      <LiquidHeading title="Skills" colorCode="bg-[#ff5e57]" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {data.skills.map((skill, idx) => (
          <motion.div 
            key={skill.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover="hover"
            className="bg-[#fdf3e7] rounded-3xl border-4 border-[#2b1318] p-5 md:p-6 relative overflow-hidden group shadow-[6px_6px_0px_0px_#2b1318] md:shadow-[8px_8px_0px_0px_#2b1318]"
          >
            <motion.div 
              variants={{
                hover: { y: 0, borderRadius: "0%" }
              }}
              initial={{ y: "100%", borderRadius: "50% 50% 0 0" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`absolute inset-0 ${colors[idx % colors.length]} z-0 will-change-transform`}
            />
            
            <div className="relative z-10 flex justify-between items-center group-hover:text-[#fdf3e7] transition-colors duration-300">
              <h4 className="text-xl md:text-2xl font-black uppercase break-words pr-2">{skill.name}</h4>
              <span className="text-lg md:text-xl font-bold bg-[#2b1318] text-[#fdf3e7] px-3 py-1 rounded-full group-hover:bg-[#fdf3e7] group-hover:text-[#2b1318] transition-colors shrink-0">
                {skill.level}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;