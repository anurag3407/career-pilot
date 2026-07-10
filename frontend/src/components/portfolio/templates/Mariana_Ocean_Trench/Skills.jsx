import React from 'react';
import { motion } from 'framer-motion';
import { Eye, HelpCircle, Layers } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  // Resolve skill rating from various formats (rating, level string, etc.)
  const getProgress = (skill) => {
    if (typeof skill.rating === 'number') return skill.rating;
    if (typeof skill.level === 'number') return skill.level;
    const str = String(skill.level || '').toLowerCase();
    if (str.includes('expert') || str.includes('lead')) return 95;
    if (str.includes('advanced') || str.includes('senior')) return 85;
    if (str.includes('intermediate') || str.includes('mid')) return 70;
    if (str.includes('beginner') || str.includes('junior')) return 50;
    return 75; // Default fallback
  };

  return (
    <section 
      id="twilight-zone"
      className="relative w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#0b3c5d] via-[#082f49] to-[#0f172a] p-6 md:p-12 text-white overflow-hidden select-none"
    >
      {/* Twilight Zone background: glowing jellyfish and fading light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow spots */}
        <div className="absolute top-[10%] left-[20%] w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[20%] right-[25%] w-64 h-64 rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Floating Jellyfish 1 */}
        <div className="absolute top-[15%] right-[15%] w-24 h-36 opacity-30 animate-jelly-float-1">
          <svg className="w-full h-full text-cyan-300 fill-current" viewBox="0 0 100 150">
            {/* Jelly bell */}
            <path d="M20,60 C20,20 80,20 80,60 C80,70 20,70 20,60 Z" opacity="0.8" />
            <path d="M30,60 C30,35 70,35 70,60 Z" fill="#38bdf8" />
            {/* Tentacles */}
            <path d="M25,65 Q30,100 22,140" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M38,65 Q35,110 40,145" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
            <path d="M50,65 Q55,100 50,135" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
            <path d="M62,65 Q60,110 65,145" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
            <path d="M75,65 Q70,95 78,138" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
          </svg>
        </div>

        {/* Floating Jellyfish 2 */}
        <div className="absolute bottom-[10%] left-[10%] w-16 h-28 opacity-25 animate-jelly-float-2">
          <svg className="w-full h-full text-blue-400 fill-current" viewBox="0 0 100 150">
            <path d="M20,60 C20,20 80,20 80,60 C80,70 20,70 20,60 Z" opacity="0.8" />
            <path d="M25,65 Q30,105 28,140" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M45,65 Q50,95 42,130" stroke="#60a5fa" strokeWidth="2" fill="none" />
            <path d="M55,65 Q50,105 58,135" stroke="#60a5fa" strokeWidth="2" fill="none" />
            <path d="M75,65 Q70,100 72,138" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col gap-8 md:gap-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
          <Layers className="w-8 h-8 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider font-mono">
              02 // TWILIGHT_ZONE: BIOLUMINESCENT_CAPABILITIES
            </h2>
            <p className="text-xs text-cyan-400/80 font-mono mt-1">Status: Ambient Light Level 12% | Bioluminescent organisms detected</p>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => {
            const val = getProgress(skill);
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-slate-950/50 border border-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] p-5 rounded-xl transition-all relative flex flex-col justify-between group cursor-pointer"
              >
                {/* Sonar sweep effect on hover */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-mono font-bold text-sky-100 uppercase tracking-wide group-hover:text-cyan-300 transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] text-cyan-600 font-mono tracking-widest uppercase">
                      CAT: {skill.category || skill.type || "GENERAL"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Glowing LED status dot */}
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                    <span className="text-xs text-cyan-300 font-mono font-semibold">{val}%</span>
                  </div>
                </div>

                {/* Progress bar resembling glowing energy capsule */}
                <div className="w-full h-3.5 bg-slate-900 border border-cyan-500/30 rounded-full p-0.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${val}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: idx * 0.05 }}
                    className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)] relative"
                  >
                    {/* Glowing highlight in the bar */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-full" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes jelly-float-1 {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-25px) rotate(4deg) scale(1.05); }
          100% { transform: translateY(0) rotate(0); }
        }
        @keyframes jelly-float-2 {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-18px) rotate(-3deg) scale(0.95); }
          100% { transform: translateY(0) rotate(0); }
        }
        .animate-jelly-float-1 {
          animation: jelly-float-1 9s ease-in-out infinite;
        }
        .animate-jelly-float-2 {
          animation: jelly-float-2 11s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
