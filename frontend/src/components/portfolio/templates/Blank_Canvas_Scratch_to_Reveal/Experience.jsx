import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from './PortfolioContext';
import { Calendar } from 'lucide-react';

export default function Experience() {
  const { experience } = usePortfolio();

  return (
    <section 
      id="experience" 
      className="relative py-28 md:py-36 px-6 border-b border-slate-900/60 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">[[ 03 // Journey ]]</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold font-outfit text-white mb-6"
          >
            Professional Experience
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto font-light"
          >
            The milestones and milestones that shaped my craft.
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical central line (hidden on mobile, centered on desktop) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-slate-800/10 to-transparent -translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-16">
            {experience.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index} 
                  className={`flex flex-col md:flex-row items-stretch w-full ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Card Side */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 40 : -40, y: 20 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
                      className="relative bg-[#05050c]/80 border border-slate-900 rounded-xl hover:border-slate-800 transition-all duration-300 group"
                    >
                      {/* Timeline dot connector */}
                      <div className="absolute -left-[44px] md:-left-0 md:group-hover:scale-125 transition-transform md:-translate-x-1/2 top-6 md:top-8 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center z-40">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500 group-hover:bg-white transition-colors" />
                      </div>

                      <div className="p-6">
                        {/* Header details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg font-bold font-outfit text-white group-hover:text-white transition-colors">
                              {item.role}
                            </h3>
                            <p className="text-xs text-slate-400 font-mono tracking-wide uppercase">
                              {item.company}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 border border-slate-850 rounded-lg text-xs font-mono text-slate-400 w-fit shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{item.period}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm font-light text-slate-300 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Empty Side (Only for spacing on desktop, hidden on mobile) */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
