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

export default function Experience({ experience }) {
  const rootRef = useRef(null);
  const isInView = useInView(rootRef, { once: true, margin: '-80px' });

  if (!experience || experience.length === 0) return null;

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
          className="flex items-center gap-4 mb-10"
        >
          <SectionLabel>Professional Journey</SectionLabel>
          <div className="flex-1 h-px bg-[#1a1a1a]/15" />
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.28em] text-[#1a1a1a]/40 border border-[#1a1a1a]/20 px-2.5 py-1">
            Career
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-12 lg:gap-8">
          {/* Header Column */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            custom={0.1}
          >
            <h2
              className="text-[#1a1a1a] leading-none mb-4"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                fontWeight: 900,
                fontStyle: 'italic',
                letterSpacing: '-0.03em',
              }}
            >
              Work
              <br />
              <span className="text-[#C41E3A] not-italic">History</span>
            </h2>
            <p className="text-[0.8rem] text-[#1a1a1a]/60 leading-relaxed max-w-xs">
              A curated chronological record of roles, responsibilities, and key achievements across various organizations.
            </p>
          </motion.div>

          {/* Experience List */}
          <div className="border-l border-[#1a1a1a]/12">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={0.2 + index * 0.1}
                className={`relative px-8 md:px-12 py-10 group transition-colors duration-500 hover:bg-[#1a1a1a]/[0.02] ${
                  index !== experience.length - 1 ? 'border-b border-[#1a1a1a]/12' : ''
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute top-12 -left-1.5 w-3 h-3 bg-[#f5f0e8] border-[1.5px] border-[#C41E3A] rounded-full group-hover:bg-[#C41E3A] transition-colors duration-300" />

                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
                  <h3
                    className="text-[#1a1a1a] leading-tight"
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                      fontWeight: 700,
                      fontStyle: 'italic',
                    }}
                  >
                    {exp.role || exp.title}
                  </h3>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/50">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#C41E3A]">
                    {exp.company}
                  </span>
                  {exp.location && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-[#1a1a1a]/20" />
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[#1a1a1a]/50">
                        {exp.location}
                      </span>
                    </>
                  )}
                </div>

                <p className="text-[0.85rem] text-[#1a1a1a]/70 leading-[1.8] max-w-2xl">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}