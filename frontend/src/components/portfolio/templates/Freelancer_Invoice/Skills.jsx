import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function Skills({ data }) {
  const { skills } = data;

  const categories = [...new Set((skills || []).map(s => s.category))];
  const categoryColors = {
    Frontend: '#2563EB',
    Backend: '#7C3AED',
    DevOps: '#059669',
    Design: '#D97706',
  };

  return (
    <section id="skills" style={{ padding: '80px 0', background: 'linear-gradient(135deg, #F0F4FF 0%, #F8FAFC 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="fi-section-tag">
            <TrendingUp size={12} />
            SKILLS & EXPERTISE
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', marginBottom: 12 }}>
            My <span className="fi-gradient-text">Technical Arsenal</span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {categories.map((cat, ci) => {
            const catSkills = (skills || []).filter(s => s.category === cat);
            const color = categoryColors[cat] || '#2563EB';
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.1 }}
                style={{ background: '#fff', borderRadius: 16, padding: '24px 20px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: '1px', textTransform: 'uppercase' }}>{cat}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {catSkills.map((skill, si) => (
                    <div key={si}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{skill.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{skill.level}%</span>
                      </div>
                      <div className="fi-progress-bar">
                        <motion.div
                          className="fi-progress-fill"
                          style={{ background: `linear-gradient(90deg, ${color}, ${color}90)` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: si * 0.08 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
