import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Flag, ChevronRight, Gauge } from 'lucide-react';

export default function Experience({ data }) {
  const experience = data?.experience;
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="relative py-20 bg-[#070709] text-white overflow-hidden selection:bg-[#E10600] selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#E10600]/50 to-transparent transform -translate-x-1/2 hidden md:block" />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col items-center mb-16 text-center space-y-4">
          <div className="inline-flex items-center bg-neutral-900/80 backdrop-blur-sm border-l-4 border-[#E10600] px-3 py-1.5 text-xs font-mono text-neutral-300 gap-2 uppercase tracking-widest">
            <Gauge className="w-4 h-4 text-[#E10600]" />
            <span>Career Telemetry</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase italic transform -skew-x-12">
            <span className="block text-white">RACE HISTORY &</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] to-[#ff4d36]">
              TRACK RECORD
            </span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {experience.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center gap-8 mb-12 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Checkpoint / Node */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center hidden md:flex">
                <div className="w-4 h-4 rounded-full bg-[#121216] border-2 border-[#E10600] z-10 shadow-[0_0_10px_#E10600]" />
              </div>

              {/* Content Card */}
              <div className="w-full md:w-1/2 p-6 bg-[#121216]/80 backdrop-blur-md border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors duration-300 group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E10600] rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold font-mono tracking-tight text-white uppercase group-hover:text-[#E10600] transition-colors">
                      {exp.title}
                    </h3>
                    <div className="text-sm font-mono text-neutral-400 mt-1 flex items-center gap-2 uppercase tracking-wider">
                      <Flag className="w-3.5 h-3.5" />
                      <span>{exp.company}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-neutral-400" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-neutral-400 leading-relaxed font-sans mb-4">
                  {exp.description}
                </p>

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-2 mt-4 border-t border-neutral-800 pt-4">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-[#E10600] flex-shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}