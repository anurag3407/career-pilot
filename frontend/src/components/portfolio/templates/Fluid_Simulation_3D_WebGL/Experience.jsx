import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

export default function Experience({ data }) {
  const experiences = data?.experience || [];

  const handleMilestoneHover = (e) => {
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: {
        x: e.clientX,
        y: e.clientY,
        count: 12,
        color: '#f97316' // warm magma/amber flow
      }
    }));
  };

  return (
    <section id="experience-section" className="relative py-28 px-6 md:px-12 bg-slate-950/20 backdrop-blur-[2px] border-t border-b border-slate-900 overflow-hidden text-white">
      {/* Dynamic vector flow indicator */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-cyan-500/0 to-teal-500/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent uppercase tracking-wider"
          >
            Flow Timeline
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-sm md:text-base leading-relaxed"
          >
            Chronological milestones representing professional growth. Hover over cards to stream warm energy vectors into the grid.
          </motion.p>
        </div>

        {/* Timeline Path Container */}
        <div className="relative">
          
          {/* Animated Winding Wavy Current SVG Line (Hidden on tiny screens, left-aligned on mobile, centered on desktop) */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-8 pointer-events-none hidden sm:block">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <pattern id="sine-wave" width="32" height="120" patternUnits="userSpaceOnUse">
                <path
                  d="M 16 0 Q 32 30 16 60 T 16 120"
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.15)"
                  strokeWidth="3"
                />
                <path
                  d="M 16 0 Q 0 30 16 60 T 16 120"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.1)"
                  strokeWidth="1.5"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#sine-wave)" />
            </svg>
          </div>

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const role = exp.role || exp.title || 'Software Engineer';
              const company = exp.company || 'Tech Company';
              const period = exp.period || (exp.startDate && exp.endDate ? `${exp.startDate} – ${exp.endDate}` : '');
              const description = exp.description || '';
              const location = exp.location || '';
              
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-stretch gap-8 md:gap-0 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Space filler / left-right alignments for desktop */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Winding Node Marker */}
                  <div className="relative z-10 flex items-center justify-start md:justify-center">
                    <div 
                      onMouseEnter={handleMilestoneHover}
                      className="w-10 h-10 rounded-2xl bg-slate-900 border-2 border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10 cursor-pointer hover:scale-110 active:scale-95 transition-all"
                    >
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card Container */}
                  <div className="md:w-1/2 pl-4 sm:pl-8 md:pl-0 md:px-8">
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.6 }}
                      onMouseMove={handleMilestoneHover}
                      className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 backdrop-blur-md p-6 rounded-2xl shadow-xl transition duration-300 space-y-4 cursor-default relative overflow-hidden"
                    >
                      {/* Glow indicator */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-500 to-indigo-500" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1 pl-2">
                          <h3 className="text-lg font-bold text-slate-100">{role}</h3>
                          <span className="block text-cyan-400 font-semibold text-xs tracking-wider uppercase">
                            {company}
                          </span>
                        </div>

                        <div className="flex flex-col sm:items-end text-xs text-slate-500 font-mono gap-1">
                          {period && (
                            <span className="flex items-center gap-1.5 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/45">
                              <Calendar className="w-3.5 h-3.5" />
                              {period}
                            </span>
                          )}
                          {location && (
                            <span className="flex items-center gap-1.5 pl-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-600" />
                              {location}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-4 pl-2">
                        {description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
