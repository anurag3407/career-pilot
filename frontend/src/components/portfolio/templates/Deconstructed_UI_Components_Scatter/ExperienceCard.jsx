import React from 'react';
import { motion } from 'framer-motion';

export default function ExperienceCard({ experience, className }) {
  if (!experience || experience.length === 0) return null;

  return (
    <motion.div
      className={`ducs-card ducs-exp-pos ${className || ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <span className="ducs-corner-badge">Experience</span>

      <p className="ducs-section-label">Career</p>
      <h2 className="ducs-section-title">Work Experience</h2>

      <div>
        {experience.map((exp, index) => (
          <div key={index} className="ducs-timeline-item">
            <p className="ducs-item-title">{exp.position || exp.role || exp.title}</p>
            <p className="ducs-item-sub">{exp.company || exp.organization}</p>
            <p className="ducs-item-date">
              {exp.startDate || exp.from}
              {(exp.startDate || exp.from) && ' — '}
              {exp.current ? 'Present' : (exp.endDate || exp.to || 'Present')}
              {exp.location && ` · ${exp.location}`}
            </p>
            {(exp.description || exp.summary) && (
              <p className="ducs-item-desc">
                {(exp.description || exp.summary)?.slice(0, 160)}
                {(exp.description || exp.summary)?.length > 160 ? '…' : ''}
              </p>
            )}
            {exp.techStack?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                {exp.techStack.slice(0, 5).map((tech, i) => (
                  <span key={i} className="ducs-tag" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
