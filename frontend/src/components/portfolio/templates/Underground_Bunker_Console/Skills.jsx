import React from 'react';
import { motion } from 'framer-motion';

export default function Skills({ data }) {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category))];

  const getLevelColor = (level) => {
    if (typeof level === 'number') {
      if (level >= 90) return '#33ff33';
      if (level >= 75) return '#66ff66';
      if (level >= 60) return '#99ff99';
      return '#ff6600';
    }
    return '#666';
  };

  return (
    <section id="skills" className="bunker-section" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ color: '#ff6600', fontSize: '0.75rem' }}>&#x25B6; SYSTEM_SPECS</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(51,255,51,0.3), transparent)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {categories.map((cat, ci) => (
              <div key={ci} style={{
                border: '1px solid rgba(51, 255, 51, 0.1)',
                background: 'rgba(51, 255, 51, 0.02)',
                padding: 28,
              }}>
                <div style={{
                  color: '#33ff33', fontSize: '0.75rem', fontWeight: 600,
                  marginBottom: 20, letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                  {'> '}{cat}_MODULE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                  {skills.filter(s => s.category === cat).map((skill, si) => (
                    <motion.div
                      key={si}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: si * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                      style={{ cursor: 'default' }}
                    >
                      <div style={{ fontSize: '0.8125rem', color: '#ccc', marginBottom: 8 }}>
                        {skill.name}
                      </div>
                      <div style={{ height: 4, background: 'rgba(51,255,51,0.08)', borderRadius: 0, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: typeof skill.level === 'number' ? skill.level + '%' : '70%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: si * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: '100%', background: getLevelColor(skill.level), borderRadius: 0 }}
                        />
                      </div>
                      <div style={{ fontSize: '0.625rem', color: '#666', marginTop: 4, textAlign: 'right' }}>
                        {typeof skill.level === 'number' ? skill.level + '%' : skill.level}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
