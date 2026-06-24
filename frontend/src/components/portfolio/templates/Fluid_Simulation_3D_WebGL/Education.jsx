import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, BookOpen } from 'lucide-react';

export default function Education({ data }) {
  const education = data?.education || [];
  const certifications = data?.certifications || [];

  const handleCardHover = (e, color = '#10b981') => {
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: {
        x: e.clientX,
        y: e.clientY,
        count: 8,
        color // Emerald/Mint or Cyan
      }
    }));
  };

  return (
    <section id="education-section" className="relative py-28 px-6 md:px-12 bg-slate-950/10 overflow-hidden text-white">
      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent uppercase tracking-wider"
          >
            Academic & Certifications Map
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-sm md:text-base leading-relaxed"
          >
            Education history and professional certifications. Hovering over blocks triggers local vector streams.
          </motion.p>
        </div>

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Education */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200 pl-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              Academic Studies
            </h3>

            <div className="space-y-6">
              {education.map((edu, idx) => {
                const degree = edu.degree || 'Degree';
                const inst = edu.institution || edu.school || 'Institution';
                const year = edu.year || edu.period || '';
                const desc = edu.description || '';

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    onMouseMove={(e) => handleCardHover(e, '#10b981')}
                    className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 backdrop-blur-md p-6 rounded-2xl shadow-xl transition duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                    
                    <div className="space-y-3 pl-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-base font-bold text-slate-100">{degree}</h4>
                          <span className="block text-emerald-400 font-semibold text-xs mt-0.5">
                            {inst}
                          </span>
                        </div>

                        {year && (
                          <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-850 self-start sm:self-center">
                            <Calendar className="w-3.5 h-3.5" />
                            {year}
                          </span>
                        )}
                      </div>

                      {desc && (
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-3 flex items-start gap-2">
                          <BookOpen className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                          <span>{desc}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Certifications */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200 pl-2">
              <Award className="w-5 h-5 text-cyan-400 animate-pulse" />
              Professional Certifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, idx) => {
                const name = cert.name || 'Certification';
                const issuer = cert.issuer || '';
                const year = cert.year || '';

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    onMouseMove={(e) => handleCardHover(e, '#06b6d4')}
                    className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 backdrop-blur-md p-5 rounded-2xl shadow-xl transition duration-300 relative overflow-hidden flex flex-col justify-between min-h-32"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500" />
                    
                    <div className="space-y-2 pl-2">
                      <h4 className="text-sm font-bold text-slate-100 leading-snug">{name}</h4>
                      {issuer && (
                        <span className="block text-cyan-400 font-semibold text-[10px] tracking-wider uppercase">
                          {issuer}
                        </span>
                      )}
                    </div>

                    {year && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-slate-500 font-mono bg-slate-950/40 px-2 py-0.5 rounded border border-slate-850 pl-2 mt-4 self-start">
                        <Calendar className="w-3 h-3" />
                        {year}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
