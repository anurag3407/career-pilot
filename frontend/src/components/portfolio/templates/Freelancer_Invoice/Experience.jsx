import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export default function Experience({ data }) {
  const { experience, stats } = data;

  return (
    <section id="experience" style={{ padding: '80px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="fi-section-tag">
            <Briefcase size={12} />
            EXPERIENCE
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', marginBottom: 12 }}>
            Career <span className="fi-gradient-text">Journey</span>
          </h2>
          <p style={{ fontSize: 16, color: '#64748B', maxWidth: 480, margin: '0 auto' }}>
            {stats?.yearsExperience}+ years building products at world-class companies.
          </p>
        </motion.div>

        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', paddingLeft: 40 }}>
          {/* Vertical Line */}
          <div style={{ position: 'absolute', left: 15, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, #2563EB 0%, #93C5FD 70%, transparent 100%)' }} />

          {(experience || []).map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ position: 'relative', marginBottom: i < experience.length - 1 ? 32 : 0 }}
            >
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute', left: -31, top: 20,
                width: 20, height: 20, borderRadius: '50%',
                background: i === 0 ? 'linear-gradient(135deg, #1E40AF, #2563EB)' : '#CBD5E1',
                border: '3px solid #fff',
                boxShadow: i === 0 ? '0 0 0 4px rgba(37,99,235,0.2)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2,
              }}>
                {i === 0 && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
              </div>

              <div
                className="fi-card"
                style={{ padding: '20px 24px', borderLeft: i === 0 ? '3px solid #2563EB' : '1px solid #E5E7EB', borderRadius: 12 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>{exp.role}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#2563EB', marginTop: 2 }}>{exp.company}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    {exp.period}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
