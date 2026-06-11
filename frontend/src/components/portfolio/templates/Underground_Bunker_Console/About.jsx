import React from 'react';
import { motion } from 'framer-motion';

export default function About({ data }) {
  const bio = data.personal?.bio || '';
  const location = data.personal?.location || '';
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section id="about" className="bunker-section" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ color: '#ff6600', fontSize: '0.75rem' }}>&#x25B6; DOSSIER_FILE</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(51,255,51,0.3), transparent)' }} />
          </div>

          <div style={{
            border: '1px solid rgba(51, 255, 51, 0.15)',
            background: 'rgba(51, 255, 51, 0.02)',
            padding: 32,
          }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: '#666', fontSize: '0.625rem', marginBottom: 8, letterSpacing: '0.1em' }}>// PERSONNEL_RECORD</div>
              <p style={{ color: '#aaa', fontSize: '0.875rem', lineHeight: 1.8 }}>
                {bio}
              </p>
              {location && (
                <p style={{ color: '#666', fontSize: '0.75rem', marginTop: 12 }}>
                  &#x25C9; LAST_KNOWN_LOCATION: {location}
                </p>
              )}
            </div>

            <div>
              <div style={{ color: '#666', fontSize: '0.625rem', marginBottom: 12, letterSpacing: '0.1em' }}>// SKILL_PROFICIENCY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {skills.slice(0, 6).map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                      <span style={{ color: '#ccc' }}>{skill.name}</span>
                      <span style={{ color: '#666' }}>{typeof skill.level === 'number' ? skill.level + '%' : skill.level}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(51,255,51,0.1)', borderRadius: 0, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: typeof skill.level === 'number' ? skill.level + '%' : '70%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        style={{ height: '100%', background: '#33ff33', borderRadius: 0 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {categories.length > 0 && (
                <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {categories.map((cat, i) => (
                    <span key={i} style={{
                      padding: '4px 10px', fontSize: '0.625rem', color: '#ff6600',
                      border: '1px solid rgba(255,102,0,0.3)', letterSpacing: '0.05em',
                    }}>
                      {cat.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
