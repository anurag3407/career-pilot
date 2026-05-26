import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

function CircularProgress({ level, size = 80, strokeWidth = 6, inView }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gradientId = `ring-gradient-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>

      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />

      {/* Animated progress arc */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={
          inView
            ? { strokeDashoffset: circumference - (circumference * level) / 100 }
            : { strokeDashoffset: circumference }
        }
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Center percentage text */}
      <motion.text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-white font-semibold"
        style={{ fontSize: size * 0.2 }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {level}%
      </motion.text>
    </svg>
  );
}

function SkillCard({ skill, index, inView }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.04,
        boxShadow: '0 0 30px 2px rgba(56,189,248,0.14), 0 0 60px 4px rgba(34,211,238,0.08)',
      }}
      className="group relative flex flex-col items-center gap-4 rounded-2xl border border-white/[0.1]
                 bg-white/[0.05] p-6 backdrop-blur-md
                 transition-colors duration-300 hover:border-white/[0.18] hover:bg-white/[0.08]"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.25)",
          background:
            "radial-gradient(120% 90% at 20% 0%, rgba(56,189,248,0.18) 0%, transparent 60%)",
        }}
      />
      {/* Subtle glow overlay on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity
                    duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Circular progress */}
      <CircularProgress level={skill.level ?? 0} inView={inView} />

      {/* Skill name */}
      <h3 className="text-center text-base font-semibold tracking-wide text-white sm:text-lg">
        {skill.name}
      </h3>

      {/* Category badge */}
      {skill.category && (
        <span
          className="rounded-full border border-white/[0.08] bg-white/[0.06] px-3 py-1
                      text-[11px] font-medium uppercase tracking-widest text-white/50"
        >
          {skill.category}
        </span>
      )}
    </motion.div>
  );
}

export default function Skills({ data }) {
  const skills = data?.skills ?? [];

  const categories = useMemo(() => {
    const cats = [...new Set(skills.map((s) => s.category).filter(Boolean))];
    return ['All', ...cats];
  }, [skills]);

  const [activeCategory, setActiveCategory] = useState('All');

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  const filteredSkills = useMemo(
    () =>
      activeCategory === 'All'
        ? skills
        : skills.filter((s) => s.category === activeCategory),
    [skills, activeCategory],
  );

  if (!skills.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      {/* ── Section Title ───────────────────────────── */}
      <motion.div
        className="mb-14 flex flex-col items-center"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Skills &amp; Expertise
        </h2>

        {/* Glass underline */}
        <motion.div
          className="mt-4 h-[3px] rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-500"
          initial={{ width: 0, opacity: 0 }}
          animate={inView ? { width: 120, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        />
        <div className="mt-1 h-[2px] w-16 rounded-full bg-white/10" />
      </motion.div>

      {/* ── Category Filter Tabs ────────────────────── */}
      <motion.div
        className="mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <motion.button
              key={cat}
              layout
              onClick={() => setActiveCategory(cat)}
              className={`relative rounded-full border px-4 py-1.5 text-xs font-medium uppercase
                         tracking-wider backdrop-blur-sm transition-colors duration-300 sm:px-5 sm:py-2 sm:text-sm
                         ${
                           isActive
                             ? 'border-white/20 bg-white/[0.12] text-white shadow-[0_0_14px_rgba(56,189,248,0.2)]'
                             : 'border-white/[0.08] bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70'
                         }`}
              whileTap={{ scale: 0.96 }}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTabGlow"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500/20 to-cyan-500/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Skills Grid ─────────────────────────────── */}
      <div className="mx-auto max-w-6xl">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, idx) => (
                <SkillCard
                  key={`${skill.name}-${skill.category}`}
                  skill={skill}
                  index={idx}
                  inView={inView}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredSkills.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center text-sm text-white/30"
          >
            No skills found in this category.
          </motion.p>
        )}
      </div>
    </section>
  );
}
