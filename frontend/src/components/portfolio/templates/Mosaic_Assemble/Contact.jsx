import React, { useRef, useMemo, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import TileSnappingText from './TileSnappingText';

const MagneticButton = ({ children, href, disabled, className }) => {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 22 });
  const y = useSpring(rawY, { stiffness: 200, damping: 22 });

  const handleMove = (e) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) * 0.2);
    rawY.set((e.clientY - cy) * 0.2);
  };
  const handleLeave = () => { rawX.set(0); rawY.set(0); };

  const Tag = disabled ? motion.button : motion.a;
  const controlProps = Tag === motion.button
    ? { disabled: disabled || undefined }
    : { 'aria-disabled': disabled || undefined };

  return (
    <Tag ref={ref} href={disabled ? undefined : href} style={{ x, y }} onMouseMove={handleMove} onMouseLeave={handleLeave} className={className} {...controlProps}>
      {children}
    </Tag>
  );
};

const Contact = ({ socials = {} }) => {
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const headingWidth = useMemo(() => Math.max(280, Math.min(620, viewportWidth - 56)), [viewportWidth]);

  return (
    <section className="py-40 px-6 max-w-4xl mx-auto text-center border-t border-slate-800 relative z-20">
      <div className="mb-6 flex justify-center">
        <TileSnappingText text="// Connection Terminal" className="text-xs font-mono uppercase tracking-[0.5em] text-cyan-400" baseDelay={0.1} />
      </div>

      <div className="mb-6 flex justify-center">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight" style={{ maxWidth: `${headingWidth}px` }}>
          <TileSnappingText text="Let's Build Something" baseDelay={0.2} />
        </h2>
      </div>

      <div className="text-base md:text-lg text-slate-400 max-w-xl mx-auto mb-12 leading-relaxed">
        <TileSnappingText 
          text="Currently open for new opportunities. Whether you have an explicit project query or just want to establish sync, let's communicate." 
          variant="subtle" 
          stagger={0.005} 
          baseDelay={0.3} 
        />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
        <div className="relative inline-flex">
          {socials.email && <div className="absolute inset-0 rounded-xl bg-cyan-500/10 blur-xl animate-pulse" />}
          <MagneticButton
            href={socials.email ? `mailto:${socials.email}` : undefined}
            disabled={!socials.email}
            className={`inline-flex items-center gap-3 px-8 py-4 text-sm font-mono tracking-wider uppercase rounded-lg font-bold transition-all duration-300 relative z-10 ${socials.email ? 'bg-white text-slate-950 hover:bg-slate-200' : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'}`}
          >
            <Mail size={16} />
            {/* Snap button textual tiles */}
            <TileSnappingText text="Say Hello" baseDelay={0.5} stagger={0.03} />
            <ArrowRight size={16} />
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;