import React from 'react';
import { motion } from 'framer-motion';

const icons = ['&#x25B6;', '&#x25CF;', '&#x25A0;', '&#x25C6;', '&#x2666;', '&#x2605;'];

export default function Projects({ data }) {
  const projects = data.projects || [];

  return (
    <section id="projects" className="bunker-section" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ color: '#ff6600', fontSize: '0.75rem' }}>&#x25B6; MISSION_LOG</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(51,255,51,0.3), transparent)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {projects.map((proj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                style={{
                  border: '1px solid rgba(51, 255, 51, 0.12)',
                  background: i % 2 === 0 ? 'rgba(51,255,51,0.02)' : 'transparent',
                  padding: 24, cursor: 'default',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ color: '#666', fontSize: '0.625rem', marginBottom: 6, letterSpacing: '0.1em' }}>
                      MISSION_{String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 style={{ color: '#33ff33', fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>
                      {`> ${proj.title}`}
                    </h3>
                    <p style={{ color: '#999', fontSize: '0.8125rem', lineHeight: 1.7, marginBottom: 12 }}>
                      {proj.description}
                    </p>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {proj.techStack.map((tech, ti) => (
                          <span key={ti} style={{
                            padding: '3px 8px', fontSize: '0.625rem', color: '#ff6600',
                            border: '1px solid rgba(255,102,0,0.2)',
                            letterSpacing: '0.03em',
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {proj.image && (
                    <img src={proj.image} alt={proj.title}
                      style={{
                        width: 140, height: 100, objectFit: 'cover',
                        border: '1px solid rgba(51,255,51,0.15)',
                        filter: 'grayscale(80%) contrast(1.1)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 16, fontSize: '0.6875rem' }}>
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#33ff33', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.target.style.textDecoration = 'none'}
                    >
                      &#x2197; DEPLOY
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#666', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      onMouseEnter={e => e.target.style.color = '#33ff33'}
                      onMouseLeave={e => e.target.style.color = '#666'}
                    >
                      &lt;/&gt; SOURCE
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
