import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import LavaAnimate from '../LavaAnimate';
import SectionHeader from './SectionHeader';

export default function Skills({ skills }) {
  return (
    <section className="py-24 relative w-full z-10 flex justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <LavaAnimate className="flex! w-full" particleCount={90} formedDelay={1800} meltAmount={3}>
          <div className="w-full">
            <SectionHeader title="Skills" />
            
            {/* Added mt-12 for spacing below header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 w-full mt-12">
              {skills.map((skill, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px' }}
                  transition={{ duration: 0.5, delay: (idx % 10) * 0.1 }}
                  className="bg-stone-900/50 p-6 rounded-xl border border-stone-800/80 backdrop-blur-sm shadow-sm"
                >
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                      <Terminal size={18} className="text-orange-500" />
                      {skill.name}
                    </h3>
                    <span className="text-stone-400 text-sm font-semibold">{skill.level}%</span>
                  </div>

                  <div className="h-2 w-full bg-stone-950 rounded-full overflow-hidden shadow-inner border border-stone-800/60">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.075, 0.82, 0.165, 1], delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-orange-600 via-red-500 to-amber-400 relative overflow-hidden"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-white/20 skew-x-12"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </LavaAnimate>
      </div>
    </section>
  );
}