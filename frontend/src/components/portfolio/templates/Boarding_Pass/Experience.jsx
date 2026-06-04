import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, MapPin } from 'lucide-react';

export default function Experience({ experience }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase mb-1">Flight Log</h2>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Career Trajectory</span>
      </div>

      <div className="relative">
        {/* Timeline Path */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-stone-200 border-l-2 border-dashed border-stone-300 transform md:-translate-x-1/2 z-0"></div>

        <div className="space-y-12">
          {experience.map((exp, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={idx} className={`relative z-10 flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline Dot (Waypoint) */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm mt-6 md:mt-8"></div>

                <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20, x: isEven ? 20 : -20 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-stone-200 relative group hover:shadow-md transition-shadow"
                  >
                    {/* Small pointer arrow */}
                    <div className={`hidden md:block absolute top-8 w-4 h-4 bg-white border-t border-r border-stone-200 transform ${isEven ? '-right-2 rotate-45' : '-left-2 -rotate-[135deg]'}`}></div>

                    <div className={`flex items-center gap-2 mb-3 text-stone-500 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                      <Calendar className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{exp.period}</span>
                    </div>

                    <h3 className="text-xl font-black text-stone-900 tracking-tight uppercase mb-1">{exp.role}</h3>
                    
                    <div className={`flex items-center gap-2 mb-4 text-blue-600 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                      <Briefcase className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{exp.company}</span>
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
