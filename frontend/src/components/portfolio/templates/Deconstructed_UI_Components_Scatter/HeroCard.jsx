import React from 'react';
import { motion } from 'framer-motion';

export default function HeroCard({ data, className }) {
  const { personal, socials } = data;

  return (
    <motion.div
      className={`ducs-card ducs-hero-pos ${className || ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <span className="ducs-corner-badge">Hero</span>

      <div className="ducs-hero-inner">
        {personal?.avatar && (
          <img
            src={personal.avatar}
            alt={personal?.name || 'Profile'}
            className="ducs-avatar"
          />
        )}

        <div>
          <h1 className="ducs-hero-name">{personal?.name}</h1>
          <p className="ducs-hero-title">{personal?.title}</p>
          <p className="ducs-hero-tagline">
            {personal?.tagline || personal?.bio?.slice(0, 120)}
          </p>

          <div className="ducs-hero-btns">
            {socials?.email && (
              <a
                href={`mailto:${socials.email}`}
                className="ducs-btn-primary"
                id="ducs-hero-email-btn"
              >
                Get in Touch
              </a>
            )}
            {(personal?.resumeUrl || personal?.resume) && (
              <a
                href={personal.resumeUrl || personal.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="ducs-btn-outline"
                id="ducs-hero-resume-btn"
              >
                View Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
