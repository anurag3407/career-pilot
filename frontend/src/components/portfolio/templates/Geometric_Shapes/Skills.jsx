import React from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Triangle, Square, Circle } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="relative min-h-screen w-full overflow-hidden bg-[#050816] py-24 px-6 sm:px-8 lg:px-12 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:84px_84px] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,_rgba(5,8,22,0.1)_55%,rgba(5,8,22,0.92)_100%)] pointer-events-none" />

      {/* Floating Shapes */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 right-20 w-64 h-64 border border-cyan-400/10 rounded-full pointer-events-none"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 left-10 w-48 h-48 border border-fuchsia-400/10 rounded-md pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.34em] text-cyan-100/90 backdrop-blur-md mb-6">
            <Hexagon size={14} className="text-cyan-300" />
            Core Skills
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-300">Proficiency</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-transparent to-fuchsia-400/0 group-hover:from-cyan-400/10 group-hover:to-fuchsia-400/10 transition-colors duration-500" />
              
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {index % 3 === 0 ? <Triangle className="text-cyan-400" size={24} /> : 
                   index % 3 === 1 ? <Square className="text-fuchsia-400" size={24} /> : 
                   <Circle className="text-amber-300" size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level || 80}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                      className={`h-full rounded-full ${
                        index % 3 === 0 ? 'bg-cyan-400' : 
                        index % 3 === 1 ? 'bg-fuchsia-400' : 
                        'bg-amber-300'
                      }`}
                    />
                  </div>
                  {skill.keywords && skill.keywords.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skill.keywords.map((keyword, kidx) => (
                        <span key={kidx} className="text-[10px] uppercase tracking-wider text-slate-400 border border-white/10 rounded-full px-2 py-1 bg-white/5">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}