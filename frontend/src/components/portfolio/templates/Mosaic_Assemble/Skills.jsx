import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import TileSnappingText from './TileSnappingText';

const Skills = ({ skills = [] }) => {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const headingWidth = useMemo(() => {
    const available = Math.max(0, viewportWidth - 48);
    return Math.min(700, available);
  }, [viewportWidth]);

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto relative z-20 border-t border-slate-950">
      <div className="flex flex-col items-center mb-20 text-center">
        <div className="flex items-center gap-3 mb-3">
          <TileSnappingText 
            text="// Core capabilities" 
            className="text-xs font-mono uppercase tracking-[0.5em] text-violet-400"
            baseDelay={0.1}
          />
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-center text-white tracking-tight" style={{ width: `${headingWidth}px` }}>
          <TileSnappingText text="Technical Arsenal" baseDelay={0.2} />
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {skills.map((skill, i) => {
          const name = skill?.name || '';
          return (
            <motion.div
              key={`${skill?.id || skill?.name}-${i}`}
              className="relative p-5 bg-[#0b0f19]/40 border border-slate-900 rounded-xl overflow-hidden group backdrop-blur-sm"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              whileHover={{ 
                y: -5,
                borderColor: 'rgba(34,211,238,0.3)',
                boxShadow: '0 10px 30px -15px rgba(6,182,212,0.15)'
              }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex flex-col h-full justify-between gap-4">
                <span className="text-xs font-mono text-slate-600 group-hover:text-cyan-400 transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-base font-semibold text-slate-300 group-hover:text-white transition-colors duration-300 tracking-tight">
                  <TileSnappingText text={name} baseDelay={0.1 + (i * 0.02)} trigger={true} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;