import React from 'react';
import { motion } from 'framer-motion';

export default function Experience({ data }) {
  const experience = data.experience || [];

  return (
    <section id="experience" className="bunker-section" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ color: '#ff6600', fontSize: '0.75rem' }}>&#x25B6; DEPLOYMENT_RECORD</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(51,255,51,0.3), transparent)' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 15, top: 0, bottom: 0,
              width: 1, background: 'rgba(51,255,51,0.15)',
            }} />

            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'relative', paddingLeft: 44, paddingBottom: 32 }}
              >
                <div style={{
                  position: 'absolute', left: 10, top: 4,
                  width: 11, height: 11, borderRadius: '50%',
                  background: '#33ff33', border: '2px solid #0a0a0a',
                }} />
                <div style={{
                  border: '1px solid rgba(51, 255, 51, 0.1)',
                  background: 'rgba(51, 255, 51, 0.02)',
                  padding: 20,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ color: '#33ff33', fontSize: '0.9375rem', fontWeight: 600 }}>
                        {`> ${exp.role}`}
                      </h3>
                      <p style={{ color: '#ff6600', fontSize: '0.75rem', marginTop: 2 }}>
                        {exp.company}
                      </p>
                    </div>
                    <span style={{
                      color: '#666', fontSize: '0.625rem',
                      padding: '4px 8px', border: '1px solid rgba(51,255,51,0.15)',
                      whiteSpace: 'nowrap',
                    }}>
                      {exp.period}
                    </span>
                  </div>
                  <p style={{ color: '#999', fontSize: '0.8125rem', lineHeight: 1.7 }}>
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
