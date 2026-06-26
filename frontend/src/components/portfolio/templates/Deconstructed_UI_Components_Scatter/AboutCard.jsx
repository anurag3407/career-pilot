import React from 'react';
import { motion } from 'framer-motion';

export default function AboutCard({ data, className }) {
  const { personal } = data;

  return (
    <motion.div
      className={`ducs-card ducs-about-pos ${className || ''}`}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <span className="ducs-corner-badge" style={{ color: '#22d3ee', borderColor: 'rgba(6,182,212,0.35)', background: 'rgba(6,182,212,0.1)' }}>
        About
      </span>

      <p className="ducs-section-label" style={{ color: 'rgba(6,182,212,0.6)' }}>
        Who I Am
      </p>
      <h2 className="ducs-section-title">About Me</h2>

      {personal?.location && (
        <p style={{ fontSize: '0.78rem', color: '#22d3ee', marginBottom: '0.75rem', opacity: 0.8 }}>
          📍 {personal.location}
        </p>
      )}

      <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap' }}>
        {personal?.bio}
      </p>

      {(personal?.website || personal?.portfolio) && (
        <a
          href={personal.website || personal.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.8rem', color: '#22d3ee', textDecoration: 'none', borderBottom: '1px solid rgba(6,182,212,0.4)' }}
          id="ducs-about-website-link"
        >
          Visit Portfolio →
        </a>
      )}
    </motion.div>
  );
}
