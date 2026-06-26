import React from 'react';
import { motion } from 'framer-motion';

export default function EducationCard({ education, className }) {
  if (!education || education.length === 0) return null;

  return (
    <motion.div
      className={`ducs-card ducs-edu-pos ${className || ''}`}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <span
        className="ducs-corner-badge"
        style={{ color: '#f472b6', borderColor: 'rgba(236,72,153,0.35)', background: 'rgba(236,72,153,0.1)' }}
      >
        Education
      </span>

      <p className="ducs-section-label" style={{ color: 'rgba(236,72,153,0.6)' }}>
        Academic
      </p>
      <h2 className="ducs-section-title">Education</h2>

      <div>
        {education.map((edu, index) => (
          <div key={index} className="ducs-timeline-item" style={{ '--dot-color': '#ec4899' }}>
            <p className="ducs-item-title">{edu.degree || edu.title}</p>
            <p className="ducs-item-sub" style={{ color: '#f472b6' }}>
              {edu.institution || edu.school || edu.university}
            </p>
            <p className="ducs-item-date">
              {edu.startDate || edu.from}
              {(edu.startDate || edu.from) && ' — '}
              {edu.current ? 'Present' : (edu.endDate || edu.to || edu.year || '')}
              {edu.gpa && ` · GPA: ${edu.gpa}`}
            </p>
            {(edu.description || edu.field) && (
              <p className="ducs-item-desc">
                {edu.field ? `Field: ${edu.field}` : edu.description?.slice(0, 120)}
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
