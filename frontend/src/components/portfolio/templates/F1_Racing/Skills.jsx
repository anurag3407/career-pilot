import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Cpu, Zap, Activity } from 'lucide-react';

export default function Skills({ data }) {
  const skills = data?.skills;
  if (!skills || skills.length === 0) return null;

  // Icons mapping based on skill index or type if available
  const getIcon = (index) => {
    const icons = [Cpu, Zap, Settings, Activity];
    const Icon = icons[index % icons.length];
    return <Icon className="w-5 h-5" />;
  };

  return (
    <section id="skills" className="relative py-20 bg-[#121216] border-y border-neutral-900 text-white overflow-hidden selection:bg-[#E10600] selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E10600]/5 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col items-center mb-16 text-center space-y-4">
          <div className="inline-flex items-center bg-neutral-900/80 backdrop-blur-sm border-l-4 border-[#00ff66] px-3 py-1.5 text-xs font-mono text-neutral-300 gap-2 uppercase tracking-widest">
            <Settings className="w-4 h-4 text-[#00ff66]" />
            <span>Technical Specifications</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase italic transform -skew-x-12">
            <span className="block text-white">POWER UNIT &</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] to-[#00cc52]">
              PERFORMANCE UPGRADES
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skills.map((skill, index) => {
            const skillLevel = skill.level || skill.rating || Math.floor(Math.random() * 20 + 80); // Default to high score if missing
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-[#070709]/80 backdrop-blur-md border border-neutral-800 rounded-xl p-6 group hover:border-neutral-600 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#00ff66] group-hover:scale-110 transition-transform">
                      {getIcon(index)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-white group-hover:text-[#00ff66] transition-colors">
                        {skill.name}
                      </h3>
                      {skill.type && (
                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                          {skill.type}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono italic text-white group-hover:text-[#00ff66] transition-colors">
                      {skillLevel}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block -mt-1">
                      SCORE
                    </span>
                  </div>
                </div>

                {/* Telemetry Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest text-neutral-600">
                    <span>Efficiency</span>
                    <span>Max Output</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skillLevel}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="bg-gradient-to-r from-[#00cc52] to-[#00ff66] h-full relative"
                    >
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 skew-x-12 -translate-x-2" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}