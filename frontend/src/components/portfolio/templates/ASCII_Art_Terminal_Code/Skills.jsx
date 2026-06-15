import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate, useMotionValue } from 'framer-motion';
import { usePortfolio } from './PortfolioContext';

/* ─── ASCII progress bar ─────────────────────────────────────────── */
function AsciiBar({ name, level, animated, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useMotionValue(0);
  const [displayPct, setDisplayPct] = React.useState(0);

  useEffect(() => {
    if (inView && animated) {
      animate(count, level, { duration: 1.4 + index * 0.06, ease: 'easeOut' });
    }
  }, [inView, animated, level, count, index]);

  useEffect(() => {
    const unsubscribe = count.on('change', v => setDisplayPct(Math.round(v)));
    return unsubscribe;
  }, [count]);

  const TOTAL = 20;
  const filledCount = Math.round((displayPct / 100) * TOTAL);
  const emptyCount = TOTAL - filledCount;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="font-mono text-xs group"
    >
      <div className="flex items-center gap-2 flex-wrap">
        {/* Name padded */}
        <span className="text-white w-28 shrink-0 truncate">{name}</span>

        {/* Bar */}
        <span className="text-green-700">[</span>
        <span style={{ display: 'inline-block', minWidth: `${TOTAL}ch` }}>
          <span className="text-green-400">{'█'.repeat(filledCount)}</span>
          <span className="text-green-900">{'░'.repeat(emptyCount)}</span>
        </span>
        <span className="text-green-700">]</span>

        {/* Numeric */}
        <span className="text-cyan-400 w-8 text-right inline-block">
          {displayPct}%
        </span>
      </div>
    </motion.div>
  );
}



/* ─── Category group ─────────────────────────────────────────────── */
const CATEGORY_COLORS = {
  Frontend: 'text-cyan-400',
  Backend: 'text-green-400',
  DevOps: 'text-amber-400',
  Design: 'text-purple-400',
};

export default function Skills() {
  const data = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView) setAnimated(true);
  }, [inView]);

  // Group skills by category
  const grouped = data.skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  let globalIndex = 0;

  return (
    <section
      id="skills"
      ref={ref}
      className="bg-black py-20 px-4 border-t border-green-900/30"
      aria-label="Skills"
    >
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Command header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="font-mono"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-700">user@portfolio:~$</span>
            <span className="text-white"> ./skills --verbose</span>
          </div>
          <div className="text-green-700 text-xs mt-1 mb-4">
            {'# ── skills.sh ──────────────────────────────────────────────'}
          </div>
        </motion.div>

        {/* Legend line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="font-mono text-xs text-green-800 flex flex-wrap gap-4"
        >
          <span>FORMAT: skill_name [████████░░] pct%</span>
          <span className="text-green-900">|</span>
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <span key={cat} className={color}># {cat}</span>
          ))}
        </motion.div>

        {/* Categories */}
        {Object.entries(grouped).map(([category, skills]) => (
          <div key={category} className="space-y-2">
            {/* Category label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="font-mono text-xs"
            >
              <span className={CATEGORY_COLORS[category] || 'text-white'}>
                {'/* '}{category}{' */'}
              </span>
            </motion.div>

            <div className="pl-2 border-l border-green-900/40 space-y-1.5">
              {skills.map((skill) => {
                const idx = globalIndex++;
                return (
                  <AsciiBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    animated={animated}
                    index={idx}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Closing prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="font-mono text-xs text-green-900 pt-2"
        >
          <div>{'# exit code: 0 — all skills loaded successfully'}</div>
          <div className="flex items-center gap-1 text-green-500 mt-1">
            <span>user@portfolio:~$</span>
            <span
              className="inline-block w-2 h-3.5 bg-green-400 ml-0.5 align-middle"
              style={{ animation: 'termBlink 1s step-end infinite' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
