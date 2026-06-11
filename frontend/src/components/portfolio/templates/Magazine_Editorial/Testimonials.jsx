import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

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

export default function Testimonials({ testimonials }) {
  const rootRef = useRef(null);
  const isInView = useInView(rootRef, { once: true, margin: '-80px' });

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      ref={rootRef}
      className="bg-[#f5f0e8] text-[#1a1a1a] overflow-hidden border-b border-[#1a1a1a]/12"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <div className="px-6 md:px-16 pt-16 pb-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          custom={0}
          className="flex items-center gap-4 mb-12"
        >
          <SectionLabel>Endorsements</SectionLabel>
          <div className="flex-1 h-px bg-[#1a1a1a]/15" />
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.28em] text-[#1a1a1a]/40 border border-[#1a1a1a]/20 px-2.5 py-1">
            Voices
          </span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              custom={0.1 + i * 0.1}
              className="relative p-8 md:p-10 border border-[#1a1a1a]/12 hover:border-[#C41E3A]/40 transition-colors duration-500 group"
            >
              {/* Decorative Quote */}
              <div
                aria-hidden="true"
                className="absolute -top-4 right-8 leading-none text-[#1a1a1a]/[0.04] group-hover:text-[#C41E3A]/[0.08] transition-colors duration-500 select-none pointer-events-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 900, fontSize: 'clamp(5rem, 8vw, 8rem)' }}
              >
                "
              </div>

              <blockquote
                className="text-[#1a1a1a] leading-relaxed mb-8 relative z-10"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  fontStyle: 'italic',
                  fontWeight: 600,
                }}
              >
                "{test.text}"
              </blockquote>

              <div className="flex items-center justify-between border-t border-[#1a1a1a]/12 pt-5">
                <div>
                  <h4 className="text-[0.8rem] font-bold uppercase tracking-[0.15em] text-[#1a1a1a]">
                    {test.name}
                  </h4>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#1a1a1a]/50 mt-1">
                    {test.position} {test.company && `at ${test.company}`}
                  </p>
                </div>
                <div className="w-8 h-px bg-[#C41E3A]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}