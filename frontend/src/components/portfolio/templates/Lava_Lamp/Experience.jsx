import React from 'react';
import { motion } from 'framer-motion';
import { LiquidHeading } from './Shared';

const Experience = ({ data }) => (
  <section id="experience" className="scroll-mt-32 relative z-10 mt-24 md:mt-32">
    <LiquidHeading title="Experience" colorCode="bg-[#f28e2b]" />

    <div className="max-w-4xl mx-auto relative">
      <div className="absolute left-[30px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-3 md:w-4 bg-[#2b1318] rounded-full overflow-hidden">
         <motion.div 
           animate={{ y: ["-10%", "1000%"] }}
           transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
           className="w-full h-24 md:h-32 bg-[#ff5e57] rounded-full blur-[2px] will-change-transform"
         />
      </div>

      {data.experience.map((job, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className={`mb-12 relative flex items-center w-full ${idx % 2 === 0 ? 'md:justify-start' : 'md:justify-end'} justify-start`}
        >
          <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 w-8 h-8 md:w-10 md:h-10 bg-[#f28e2b] border-4 border-[#2b1318] rounded-full z-10 shadow-[2px_2px_0px_0px_#2b1318] md:shadow-[4px_4px_0px_0px_#2b1318]">
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-[#ff5e57] rounded-full will-change-transform"
            />
          </div>
          
          <motion.div 
            whileHover={{ scaleY: 1.05, scaleX: 0.98, originY: 0.5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-full md:w-[45%] pl-16 sm:pl-20 md:pl-0 ${idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'} will-change-transform`}
          >
            <div className="bg-[#fdf3e7] p-6 md:p-8 rounded-3xl border-4 border-[#2b1318] shadow-[6px_6px_0px_0px_#2b1318] md:shadow-[10px_10px_0px_0px_#2b1318]">
              <span className="inline-block bg-[#e15f41] text-[#fdf3e7] px-4 py-1 rounded-full font-bold text-xs md:text-sm mb-4 border-2 border-[#2b1318]">
                {job.period}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-[#ff5e57] uppercase mb-1 break-words">{job.role}</h3>
              <h4 className="text-lg md:text-xl font-bold mb-4 break-words">{job.company}</h4>
              <p className="font-sans font-medium text-sm md:text-base text-[#2b1318]/80 leading-relaxed">
                {job.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Experience;