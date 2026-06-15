import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { C } from './hooks';

// Single animated skill line: "JavaScript ............. 95%"
function SkillLine({ name, level, category, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const [typedName, setTypedName] = useState('');
  const [typedDots, setTypedDots] = useState('');
  const [typedPct, setTypedPct] = useState('');
  const [phase, setPhase] = useState(0); // 0=idle, 1=name, 2=dots, 3=pct

  const DOTS_COUNT = 20;

  useEffect(() => {
    if (!inView) return;
    const baseDelay = index * 220;

    // Phase 1: type name
    let destroyed = false;
    const t1 = setTimeout(() => {
      setPhase(1);
      let i = 0;
      const iv = setInterval(() => {
        if (destroyed) { clearInterval(iv); return; }
        i++;
        setTypedName(name.slice(0, i));
        if (i >= name.length) {
          clearInterval(iv);
          // Phase 2: type dots
          setPhase(2);
          const dotsStr = '.'.repeat(DOTS_COUNT);
          let d = 0;
          const iv2 = setInterval(() => {
            if (destroyed) { clearInterval(iv2); return; }
            d++;
            setTypedDots(dotsStr.slice(0, d));
            if (d >= DOTS_COUNT) {
              clearInterval(iv2);
              // Phase 3: type percentage
              setPhase(3);
              const pctStr = `${level}%`;
              let p = 0;
              const iv3 = setInterval(() => {
                if (destroyed) { clearInterval(iv3); return; }
                p++;
                setTypedPct(pctStr.slice(0, p));
                if (p >= pctStr.length) { clearInterval(iv3); setPhase(4); }
              }, 60);
            }
          }, 18);
        }
      }, 40);
    }, baseDelay);

    return () => { destroyed = true; clearTimeout(t1); };
  }, [inView, name, level, index]);

  return (
    <motion.div
      ref={ref}
      className="tks-skill-line"
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      {/* Category badge */}
      <span style={{
        position: 'absolute',
        left: 0,
        width: 3,
        top: '50%',
        transform: 'translateY(-50%)',
        height: 14,
        background: categoryColor(category),
        borderRadius: 1,
      }} />

      <span className="tks-skill-name" style={{ paddingLeft: 12 }}>
        {typedName}
        {phase === 1 && <span className="tks-cursor-thin" />}
      </span>

      <span className="tks-skill-dots" style={{ padding: '0 6px', letterSpacing: 3 }}>
        {typedDots}
        {phase === 2 && <span style={{ color: C.deepRed, animation: 'tks-blink 0.5s step-end infinite' }}>.</span>}
      </span>

      <span className="tks-skill-pct">
        {typedPct}
        {phase === 3 && <span className="tks-cursor-thin" />}
      </span>

      {/* Category label */}
      {phase >= 4 && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="tks-tag"
          style={{ marginLeft: 10 }}
        >
          {category}
        </motion.span>
      )}
    </motion.div>
  );
}

function categoryColor(cat = '') {
  const map = {
    Frontend: C.deepRed,
    Backend:  C.warmBrown,
    DevOps:   C.inkGray,
    Design:   C.amber,
    Core:     C.deepRed,
  };
  return map[cat] || C.border;
}

// Group skills by category
function groupByCategory(skills) {
  const groups = {};
  skills.forEach(s => {
    const cat = s.category || 'Core';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });
  return groups;
}

export default function Skills({ skills }) {
  const groups = groupByCategory(skills);

  return (
    <section id="skills" style={{ background: C.paperWhite, position: 'relative' }}>
      <div className="tks-page">
        {/* Chapter header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="tks-chapter-num">Chapter 02</div>
          <h2 className="tks-section-title">Skills &amp; Expertise</h2>
          <div className="tks-section-subtitle">
            A typewritten inventory of technical proficiencies
          </div>
        </motion.div>

        {/* Carriage-return decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: C.border,
            letterSpacing: 2,
            marginBottom: 24,
          }}
        >
          &lt;&lt; [CARRIAGE RETURN] &gt;&gt; typing skills manifest...
        </motion.div>

        {/* Skills list — optionally grouped */}
        <div style={{ position: 'relative' }}>
          {Object.entries(groups).map(([cat, catSkills], gi) => (
            <div key={cat} style={{ marginBottom: 32 }}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: categoryColor(cat),
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  paddingBottom: 4,
                  borderBottom: `1px solid ${C.border}40`,
                }}
              >
                — {cat} —
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0, position: 'relative' }}>
                {catSkills.map((skill, i) => (
                  <SkillLine
                    key={skill.name}
                    {...skill}
                    index={gi * 10 + i}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Margin note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 24 }}
        >
          <span className="tks-margin-note">
            * percentages indicate relative proficiency based on years of practice
          </span>
        </motion.div>
      </div>
    </section>
  );
}
