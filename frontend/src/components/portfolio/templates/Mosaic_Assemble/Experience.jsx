import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import TileSnappingText from './TileSnappingText';

const Experience = ({ experience = [] }) => {
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const headingWidth = useMemo(() => Math.max(240, Math.min(420, viewportWidth - 80)), [viewportWidth]);

  return (
    <section className="py-32 px-6 max-w-5xl mx-auto border-t border-slate-950 relative z-20">
      <div className="mb-24 flex flex-col items-center text-center">
        <TileSnappingText text="// Historical Track" className="text-xs font-mono uppercase tracking-[0.5em] text-indigo-400 mb-3" baseDelay={0.1} />
        <h2 className="text-4xl font-black text-center text-white tracking-tight" style={{ width: `${headingWidth}px` }}>
          <TileSnappingText text="Journey" baseDelay={0.2} />
        </h2>
      </div>

      <div className="relative pl-8 md:pl-0 border-l md:border-l-0 border-slate-900 md:grid md:grid-cols-12 md:gap-x-8">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-slate-900 via-slate-800 to-transparent transform -translate-x-1/2" />

        <div className="space-y-12 md:space-y-0 w-full md:col-span-12 relative">
          {experience.map((exp, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={i} className="relative md:grid md:grid-cols-12 items-center w-full md:mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                  className={`relative p-6 bg-[#090d16]/70 border border-slate-900/60 rounded-xl md:col-span-5 backdrop-blur-sm hover:border-slate-800 hover:bg-[#0b101b] transition-all duration-300 ${isEven ? 'md:col-start-1' : 'md:col-start-8'}`}
                >
                  <div className="flex flex-col mb-3">
                    <span className="text-xs font-mono text-cyan-400 mb-1">
                      <TileSnappingText text={exp.period} baseDelay={0.1} stagger={0.01} />
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      <TileSnappingText text={exp.role} baseDelay={0.2} />
                    </h3>
                    <h4 className="text-sm font-medium text-slate-400">{exp.company}</h4>
                  </div>
                  <div className="text-sm text-slate-500 leading-relaxed">
                    <TileSnappingText text={exp.description} variant="subtle" stagger={0.004} baseDelay={0.3} />
                  </div>
                </motion.div>

                <div className="absolute left-[-2.35rem] md:left-1/2 top-6 md:top-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-slate-800 transform -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;