import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Experience() {
  const { experience } = data;

  return (
    <section id="experience" className="py-24 bg-[#004b63] text-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#ff7f50] font-mono font-bold tracking-widest uppercase mb-4 block"
          >
            Career Path
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            My <span className="text-[#a3e635]">Journey</span>
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {experience.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative pl-12 pb-16 last:pb-0 group"
            >
              {/* Timeline Line */}
              {index !== experience.length - 1 && (
                <div className="absolute left-6 top-10 bottom-0 w-px bg-white/10 group-hover:bg-[#a3e635]/30 transition-colors" />
              )}

              {/* Timeline Icon */}
              <div className="absolute left-0 top-0 w-12 h-12 bg-[#001f2d] border border-white/10 rounded-2xl flex items-center justify-center text-[#ff7f50] shadow-xl group-hover:border-[#a3e635]/50 transition-all duration-300 z-10">
                <Briefcase size={20} />
              </div>

              {/* Content Card */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl group-hover:bg-white/10 transition-all duration-300 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{item.role}</h3>
                    <p className="text-[#a3e635] font-medium flex items-center gap-2">
                      {item.company}
                      <ChevronRight size={14} className="opacity-50" />
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#001f2d]/60 rounded-xl border border-white/5 text-sm text-gray-400 font-mono">
                    <Calendar size={14} className="text-[#ff7f50]" />
                    {item.period}
                  </div>
                </div>
                
                <p className="text-gray-400 leading-relaxed text-lg italic">
                  "{item.description}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
