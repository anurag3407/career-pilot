import React from 'react';
import { motion } from 'framer-motion';
import { useViewportTypewriter, C } from './hooks';
import { Briefcase } from 'lucide-react';

// Format period as a "diary date"
function formatDate(period = '') {
  return period.trim();
}

function DiaryEntry({ exp, index }) {
  const { ref, displayed, done } = useViewportTypewriter(exp.description, 14);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="tks-diary-entry"
    >
      {/* Date stamp */}
      <div className="tks-diary-date">{formatDate(exp.period)}</div>

      {/* Entry title */}
      <div className="tks-diary-title">{exp.role}</div>

      {/* Company */}
      <div className="tks-diary-company">@ {exp.company}</div>

      {/* Description — typed */}
      <p ref={ref} className="tks-diary-body">
        {displayed}
        {!done && <span className="tks-cursor-thin" />}
      </p>

      {/* Signature line */}
      <div style={{
        marginTop: 10,
        fontSize: 9,
        fontFamily: "'IBM Plex Mono', monospace",
        color: C.border,
        letterSpacing: 2,
      }}>
        — entry recorded —
      </div>
    </motion.div>
  );
}

export default function Experience({ experience }) {
  return (
    <section id="experience" style={{ background: C.paperWhite, position: 'relative' }}>
      <div className="tks-page">
        {/* Chapter header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="tks-chapter-num">
            <Briefcase size={12} />
            Professional History
          </div>
          <h2 className="tks-section-title">The Work Diary</h2>
          <div className="tks-section-subtitle">
            A chronological journal of professional endeavours
          </div>
        </motion.div>

        {/* Typewriter header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: C.border,
            letterSpacing: 2,
            marginBottom: 40,
          }}
        >
          &gt; diary_entries.log — {experience.length} records
        </motion.div>

        {/* Diary entries */}
        <div>
          {experience.map((exp, i) => (
            <DiaryEntry key={i} exp={exp} index={i} />
          ))}
        </div>

        {/* Coffee stain decoration */}
        <div className="tks-coffee-stain" style={{ bottom: 24, right: 24 }} />
      </div>
    </section>
  );
}
