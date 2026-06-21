import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import TileSnappingText from './TileSnappingText';

const Testimonials = ({ testimonials = [] }) => {
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const headingWidth = useMemo(() => {
    const available = Math.max(0, viewportWidth - 56);
    return Math.max(Math.min(available, 620), Math.min(300, available));
  }, [viewportWidth]);

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto relative z-20 border-t border-slate-950">
      <div className="mb-20 flex flex-col items-center text-center">
        <TileSnappingText text="// Endorsements" className="text-xs font-mono uppercase tracking-[0.4em] text-violet-400 mb-3" baseDelay={0.1} />
        <h2 className="text-4xl md:text-5xl font-black text-center text-white tracking-tight" style={{ width: `${headingWidth}px` }}>
          <TileSnappingText text="Words from Others" baseDelay={0.2} />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.1)' }}
            className="p-8 bg-gradient-to-br from-[#080c14] to-[#04070d] border border-slate-900 rounded-xl h-full flex flex-col justify-between relative shadow-xl"
          >
            <div className="absolute top-4 right-6 text-5xl font-serif text-slate-800/40 select-none pointer-events-none">”</div>
            
            <div className="text-slate-300 font-normal leading-relaxed text-base mb-8 relative z-10 italic">
              <TileSnappingText text={`"${t.text}"`} variant="subtle" stagger={0.004} baseDelay={0.15} />
            </div>

            <div className="flex items-center gap-4 border-t border-slate-900/60 pt-6">
              {t.avatar ? (
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-800" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 text-sm font-bold">
                  {t.name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="text-white font-bold text-sm tracking-tight">
                  <TileSnappingText text={t.name} baseDelay={0.2} />
                </p>
                <p className="text-slate-500 text-xs font-mono">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;