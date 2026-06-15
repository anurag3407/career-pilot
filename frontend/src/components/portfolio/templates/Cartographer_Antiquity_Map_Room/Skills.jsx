import React from 'react';
import { motion } from 'framer-motion';

export default function Skills({ data }) {
  const skills = data?.skills || [];

  if (skills.length === 0) return null;

  return (
    <section className="w-full py-24 px-6 md:px-16 border-b border-dashed border-[#8d6e63]">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-4xl font-black mb-16 text-center text-[#2e1d16] tracking-widest uppercase font-serif">
          <span className="border-t-2 border-b-2 border-[#5d4037] py-2 px-8 inline-block">Instruments & Proficiency</span>
        </h3>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-[#e8dac1] border border-[#c4a482] px-6 py-3 rounded-full shadow-[2px_2px_5px_rgba(62,39,35,0.15)] flex items-center justify-center"
            >
              <span className="text-[#3e2723] font-bold tracking-wider uppercase text-sm">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
