import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

function SectionLabel({ children }) {
  return (
    <p className="text-[0.55rem] font-bold uppercase tracking-[0.35em] text-[#C41E3A]">
      {children}
    </p>
  );
}

export default function Contact({ personal, socials }) {
  const rootRef = useRef(null);
  const isInView = useInView(rootRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={rootRef}
      className="bg-[#1a1a1a] text-[#f5f0e8] overflow-hidden"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <div className="px-6 md:px-16 pt-16 pb-24 border-b border-white/10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
          className="flex items-center gap-4 mb-12"
        >
          <SectionLabel>Correspondence</SectionLabel>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.28em] text-white/40 border border-white/20 px-2.5 py-1">
            Connect
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left: Copy */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.1}
          >
            <h2
              className="text-white leading-none mb-6"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                fontWeight: 900,
                fontStyle: 'italic',
                letterSpacing: '-0.03em',
              }}
            >
              Start a<br />
              <span className="text-[#C41E3A] not-italic">Dialogue</span>
            </h2>
            <p className="text-[0.9rem] text-white/60 leading-relaxed max-w-md mb-8">
              Open to new opportunities, collaborations, and discussions. Reach out to explore how we can create something exceptional together.
            </p>
            
            {socials?.email && (
              <a
                href={`mailto:${socials.email}`}
                className="inline-flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#C41E3A] group-hover:border-[#C41E3A] transition-colors duration-300">
                  <Mail size={18} className="text-white group-hover:text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/50 mb-1 group-hover:text-[#C41E3A] transition-colors">
                    Drop a Line
                  </span>
                  <span className="text-white font-medium tracking-wide">
                    {socials.email}
                  </span>
                </div>
              </a>
            )}
          </motion.div>

          {/* Right: Form / Graphic */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.2}
            className="relative p-8 md:p-12 border border-white/10 bg-[#161616]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 border-l border-b border-white/5" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-r border-t border-white/5" />
            
            <form className="relative z-10 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C41E3A] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C41E3A] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">
                  Message
                </label>
                <textarea
                  rows="3"
                  placeholder="Tell me about your project..."
                  className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder-white/20 focus:outline-none focus:border-[#C41E3A] transition-colors resize-none"
                />
              </div>
              <button
                type="button"
                className="self-start mt-4 flex items-center gap-3 group"
              >
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-white border-b border-white pb-0.5 group-hover:border-[#C41E3A] group-hover:text-[#C41E3A] transition-colors duration-300">
                  Send Message
                </span>
                <span className="w-7 h-7 rounded-full border border-white flex items-center justify-center group-hover:bg-[#C41E3A] group-hover:border-[#C41E3A] transition-all duration-300">
                  <ArrowRight size={12} className="text-white group-hover:text-white transition-colors duration-300" />
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
