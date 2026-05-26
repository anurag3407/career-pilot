import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Briefcase } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = (direction) => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -80 : 80,
    y: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function TimelineCard({ item, index, totalItems }) {
  const isLeft = index % 2 === 0;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div
      ref={ref}
      className={`relative flex w-full items-start ${
        isLeft
          ? 'md:flex-row md:justify-start'
          : 'md:flex-row-reverse md:justify-start'
      } flex-row justify-start`}
    >
      {/* Card — desktop left or right, mobile always right */}
      <motion.div
        className={`w-full md:w-[calc(50%-2rem)] ml-10 md:ml-0 ${
          isLeft ? 'md:mr-8 md:text-right' : 'md:ml-8 md:text-left'
        }`}
        variants={cardVariants(isLeft ? 'left' : 'right')}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div
          className="group relative rounded-2xl border border-white/[0.1] bg-white/[0.05]
            p-5 sm:p-6 backdrop-blur-md transition-all duration-500
            hover:border-white/[0.2] hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(120,120,255,0.08)]
            hover:-translate-y-1"
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.22)",
              background:
                "radial-gradient(120% 90% at 15% 0%, rgba(56,189,248,0.16) 0%, transparent 60%)",
            }}
          />
          {/* Subtle inner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

          {/* Role */}
          <div
            className={`flex items-center gap-2 mb-1 ${
              isLeft ? 'md:justify-end' : 'md:justify-start'
            }`}
          >
            <Briefcase className="h-4 w-4 text-sky-300/70 shrink-0" />
            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {item.role}
            </h3>
          </div>

          {/* Company */}
          <p
            className="text-sm sm:text-base font-semibold bg-gradient-to-r from-sky-300 to-cyan-300
              bg-clip-text text-transparent mb-3"
          >
            {item.company}
          </p>

          {/* Period pill */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.1]
              bg-white/[0.06] px-3 py-1 text-xs font-medium text-gray-300 backdrop-blur-sm mb-3 ${
                isLeft ? 'md:ml-auto' : ''
              }`}
          >
            <Calendar className="h-3 w-3 text-sky-300/80" />
            {item.period}
          </span>

          {/* Description */}
          {item.description && (
            <p
              className={`text-sm leading-relaxed text-gray-400 ${
                isLeft ? 'md:text-right' : 'md:text-left'
              } text-left`}
            >
              {item.description}
            </p>
          )}
        </div>
      </motion.div>

      {/* Timeline dot — centered on desktop, on the left edge on mobile */}
      <motion.div
        className="absolute left-0 md:left-1/2 top-6 z-10 -translate-x-1/2"
        variants={dotVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <span className="relative flex h-4 w-4 items-center justify-center">
          {/* Outer pulse ring */}
          <motion.span
            className="absolute inline-flex h-full w-full rounded-full bg-sky-400/40"
            animate={
              isInView
                ? {
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 0, 0.5],
                  }
                : {}
            }
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
          />
          {/* Core dot */}
          <span className="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
        </span>
      </motion.div>

      {/* Connector line from dot to card — hidden on mobile (card is adjacent) */}
      <motion.div
        className={`hidden md:block absolute top-[1.65rem] h-px w-6 bg-gradient-to-r ${
          isLeft
            ? 'right-1/2 mr-2 from-transparent to-sky-400/30'
            : 'left-1/2 ml-2 from-sky-400/30 to-transparent'
        }`}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ transformOrigin: isLeft ? 'right' : 'left' }}
      />
    </div>
  );
}

export default function Experience({ data }) {
  const experiences = data?.experience ?? [];
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: '-60px' });

  if (experiences.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-sky-500/[0.04] blur-[120px]" />
        <div className="absolute left-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-cyan-400/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Section heading */}
        <motion.div
          className="mb-16 sm:mb-20 text-center"
          variants={sectionVariants}
          initial="hidden"
          animate={isSectionInView ? 'visible' : 'hidden'}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Experience
          </h2>
          {/* Glass underline */}
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-sky-400 to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.35)]" />
        </motion.div>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical glowing timeline line */}
          <motion.div
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            initial={{ scaleY: 0 }}
            animate={isSectionInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top' }}
          >
            {/* Gradient line */}
            <div className="h-full w-full bg-gradient-to-b from-sky-400/60 via-cyan-400/35 to-transparent" />
            {/* Glow effect */}
            <div className="absolute inset-0 w-px bg-gradient-to-b from-sky-400/30 via-cyan-400/20 to-transparent blur-sm" />
          </motion.div>

          {/* Experience entries */}
          <div className="flex flex-col gap-10 sm:gap-14">
            {experiences.map((item, index) => (
              <TimelineCard
                key={`${item.company}-${item.role}-${index}`}
                item={item}
                index={index}
                totalItems={experiences.length}
              />
            ))}
          </div>

          {/* Bottom cap for the timeline */}
          <motion.div
            className="absolute left-0 md:left-1/2 bottom-0 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={isSectionInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <span className="block h-2 w-2 rounded-full bg-gradient-to-br from-sky-400/40 to-cyan-400/40" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
