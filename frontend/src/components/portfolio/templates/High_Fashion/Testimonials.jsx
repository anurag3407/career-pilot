import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';

const F = {
  bg:       '#faf9f7',
  surface:  '#f2efe9',
  dark:     '#0a0a0a',
  charcoal: '#1a1a1a',
  muted:    '#6b6b6b',
  subtle:   '#b0b0b0',
  gold:     '#c9a84c',
  goldLight:'#e8c96e',
  cream:    '#f7f3ed',
  border:   '#e0dbd4',
};

export default function Testimonials() {
  const { portfolioData: data } = usePortfolio();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(c => (c + 1) % data.testimonials.length);
  const prev = () => setCurrent(c => (c - 1 + data.testimonials.length) % data.testimonials.length);

  return (
    <section ref={sectionRef} style={{ background: F.dark, color: F.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="flex items-center justify-between px-5 md:px-16 py-5"
        style={{ borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2" style={{ background: F.gold }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: F.muted }}>Voices</span>
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: F.muted }}>§ 03</span>
      </motion.div>

      <div className="px-5 md:px-16 py-16 md:py-24 flex flex-col items-center">
        <Quote size={32} style={{ color: F.gold }} className="mb-10 opacity-80" />
        
        <div className="relative w-full max-w-4xl min-h-[250px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center flex flex-col items-center">
              
              <p className="font-bold tracking-tight leading-tight mb-8"
                style={{ 
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  background: `linear-gradient(135deg, #fff, ${F.subtle})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                "{data.testimonials[current].text}"
              </p>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: `1px solid ${F.gold}` }}>
                  <img src={data.testimonials[current].avatar} alt={data.testimonials[current].name || "Profile Avatar"} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black uppercase tracking-widest" style={{ color: F.goldLight }}>
                    {data.testimonials[current].name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: F.muted }}>
                    {data.testimonials[current].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-16">
          <button onClick={prev} className="w-12 h-12 flex items-center justify-center transition-all hover:bg-white/5" style={{ border: `1px solid rgba(255,255,255,0.2)` }}>
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {data.testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className="w-2 h-2 transition-all" style={{ background: i === current ? F.gold : 'rgba(255,255,255,0.2)' }} aria-label={`Go to testimonial ${i + 1}`} />
            ))}
          </div>
          <button onClick={next} className="w-12 h-12 flex items-center justify-center transition-all hover:bg-white/5" style={{ border: `1px solid rgba(255,255,255,0.2)` }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}