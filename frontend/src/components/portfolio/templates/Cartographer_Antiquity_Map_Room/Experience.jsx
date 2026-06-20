import React from 'react';
import { motion } from 'framer-motion';

export default function Experience({ data }) {
  const experiences = data?.experience || [];

  if (experiences.length === 0) return null;

  return (
    <section className="w-full py-24 px-6 md:px-16 border-b border-dashed border-[#8d6e63]">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-4xl font-black mb-16 text-center text-[#2e1d16] tracking-widest uppercase font-serif">
          <span className="border-y-2 border-[#5d4037] py-2 px-8 inline-block">Chronicles of Journey</span>
        </h3>

        <div className="relative border-l-4 border-double border-[#5d4037] ml-4 md:ml-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id || index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="mb-16 ml-10 relative"
            >
              {/* Map pin / node */}
              <div className="absolute -left-[3.25rem] w-6 h-6 bg-[#f4ebd8] border-4 border-[#8d6e63] rounded-full mt-1.5 shadow-[0_0_10px_rgba(93,64,55,0.5)] z-10" />
              
              <div className="bg-[#e8dac1] p-8 rounded shadow-[3px_3px_10px_rgba(62,39,35,0.15)] border border-[#d7c4a9] relative">
                <div className="absolute -top-3 -right-3 w-16 h-16 border border-[#c4a482] rounded-full flex items-center justify-center opacity-40 rotate-12">
                  <span className="text-xs font-serif text-[#5d4037]">SEAL</span>
                </div>
                
                <h4 className="text-2xl font-bold text-[#2e1d16] mb-1 font-serif uppercase tracking-wider">{exp.role}</h4>
                <div className="text-[#8d6e63] font-semibold text-lg mb-2 italic">
                  @ {exp.company}
                </div>
                <div className="text-[#5d4037] text-sm mb-6 uppercase tracking-widest border-b border-[#c4a482] pb-2 inline-block">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
                <p className="text-[#3e2723] leading-relaxed whitespace-pre-wrap">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
