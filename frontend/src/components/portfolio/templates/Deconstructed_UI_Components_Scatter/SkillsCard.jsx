import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORY_COLORS = [
  { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.35)', text: '#c4b5fd' },
  { bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.35)',   text: '#67e8f9' },
  { bg: 'rgba(236,72,153,0.1)',  border: 'rgba(236,72,153,0.35)',  text: '#f9a8d4' },
  { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.35)',  text: '#fcd34d' },
  { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)',  text: '#6ee7b7' },
];

export default function SkillsCard({ skills, className }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!skills || skills.length === 0) return null;

  // Group skills by category if they have one
  const hasCategories = skills.some(s => s.category);
  const grouped = hasCategories
    ? skills.reduce((acc, skill) => {
        const cat = skill.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
      }, {})
    : { 'Skills': skills };

  const categories = Object.entries(grouped);

  return (
    <motion.div
      className={`ducs-card ducs-skills-pos ${className || ''}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <span className="ducs-corner-badge" style={{ color: '#f472b6', borderColor: 'rgba(236,72,153,0.35)', background: 'rgba(236,72,153,0.1)' }}>
        Skills
      </span>

      <p className="ducs-section-label" style={{ color: 'rgba(236,72,153,0.6)' }}>
        Expertise
      </p>
      <h2 className="ducs-section-title">Skills &amp; Tools</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {categories.map(([cat, catSkills], catIdx) => (
          <div key={cat}>
            {hasCategories && categories.length > 1 && (
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.6rem' }}>
                {cat}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {catSkills.map((skill, i) => {
                const globalIdx = catIdx * 10 + i;
                const colorScheme = CATEGORY_COLORS[catIdx % CATEGORY_COLORS.length];
                const isHovered = hoveredIndex === `${catIdx}-${i}`;

                return (
                  <motion.span
                    key={i}
                    id={`ducs-skill-${globalIdx}`}
                    onMouseEnter={() => setHoveredIndex(`${catIdx}-${i}`)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'default',
                      background: isHovered ? colorScheme.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isHovered ? colorScheme.border : 'rgba(255,255,255,0.08)'}`,
                      color: isHovered ? colorScheme.text : 'rgba(255,255,255,0.7)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {skill.name}
                    {skill.level && (
                      <span style={{
                        display: 'block',
                        width: '100%',
                        marginTop: '3px',
                        height: '2px',
                        background: `linear-gradient(90deg, ${colorScheme.text} ${skill.level}%, rgba(255,255,255,0.08) ${skill.level}%)`,
                        borderRadius: '2px',
                      }} />
                    )}
                  </motion.span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
