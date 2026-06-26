import React from 'react';
import { motion } from 'framer-motion';

const SOCIAL_ICONS = {
  email:    '✉',
  github:   '⌥',
  linkedin: 'in',
  twitter:  '𝕏',
  website:  '🌐',
  portfolio:'🎨',
  youtube:  '▶',
  instagram:'📸',
};

export default function ContactCard({ personal, socials, className }) {
  const links = [];

  if (socials?.email || personal?.email) {
    links.push({ key: 'email', label: socials?.email || personal?.email, href: `mailto:${socials?.email || personal?.email}` });
  }
  if (socials?.github) {
    links.push({ key: 'github', label: 'GitHub', href: socials.github });
  }
  if (socials?.linkedin) {
    links.push({ key: 'linkedin', label: 'LinkedIn', href: socials.linkedin });
  }
  if (socials?.twitter) {
    links.push({ key: 'twitter', label: 'Twitter / X', href: socials.twitter });
  }
  if (socials?.website || personal?.website) {
    links.push({ key: 'website', label: 'Website', href: socials?.website || personal?.website });
  }

  return (
    <motion.div
      className={`ducs-card ducs-contact-pos ${className || ''}`}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <span className="ducs-corner-badge">Contact</span>

      <p className="ducs-section-label">Let's Talk</p>
      <h2 className="ducs-section-title">Get In Touch</h2>

      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
        Open to exciting opportunities, collaborations, and friendly conversations.
      </p>

      <div>
        {links.map(({ key, label, href }) => (
          <a
            key={key}
            href={href}
            target={key === 'email' ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="ducs-contact-link"
            id={`ducs-contact-${key}`}
          >
            <span className="ducs-contact-link-icon" aria-hidden="true">
              {SOCIAL_ICONS[key] || '→'}
            </span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          </a>
        ))}
      </div>

      <p style={{ marginTop: '1.25rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
        © {new Date().getFullYear()} {personal?.name}
      </p>
    </motion.div>
  );
}
