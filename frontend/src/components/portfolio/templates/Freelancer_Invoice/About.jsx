import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, User, Star, Award, TrendingUp } from 'lucide-react';

export default function About({ data }) {
  const { personal, skills, experience, stats } = data;

  const frontendSkills = (skills || []).filter(s => s.category === 'Frontend');
  const backendSkills = (skills || []).filter(s => s.category === 'Backend');
  const devopsSkills = (skills || []).filter(s => s.category === 'DevOps');
  const designSkills = (skills || []).filter(s => s.category === 'Design');

  const skillGroups = [
    { label: 'Frontend', skills: frontendSkills, color: '#2563EB' },
    { label: 'Backend', skills: backendSkills, color: '#7C3AED' },
    { label: 'DevOps', skills: devopsSkills, color: '#059669' },
    { label: 'Design', skills: designSkills, color: '#D97706' },
  ].filter(g => g.skills.length > 0);

  return (
    <section id="about" style={{ padding: '96px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="fi-section-tag">ABOUT & SKILLS</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', marginBottom: 12 }}>
            The <span className="fi-gradient-text">Professional</span> Behind the Work
          </h2>
        </motion.div>

        <div className="fi-three-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 32 }}>
          {/* ── COLUMN 1: ABOUT ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ background: '#F8FAFC', borderRadius: 20, padding: '28px 24px', border: '1px solid #E5E7EB', height: '100%' }}>
              {/* Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <img
                    src={personal?.avatar}
                    alt={personal?.name}
                    style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '4px solid #DBEAFE', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 2, right: 2, width: 20, height: 20, background: '#22C55E', borderRadius: '50%', border: '3px solid #fff' }} />
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>{personal?.name}</div>
                <div style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 4 }}>{personal?.title}</div>
              </div>

              {/* Info Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 10, padding: '10px 14px', border: '1px solid #E5E7EB' }}>
                  <MapPin size={14} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#374151' }}>{personal?.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 10, padding: '10px 14px', border: '1px solid #E5E7EB' }}>
                  <Mail size={14} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#374151', wordBreak: 'break-all' }}>{data.socials?.email}</span>
                </div>
              </div>

              {/* Bio */}
              <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.75, marginBottom: 20 }}>
                {personal?.bio?.slice(0, 220)}...
              </p>

              {/* Signature */}
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
                <div style={{ fontSize: 22, fontFamily: 'Georgia, serif', fontStyle: 'italic', color: '#1E40AF', fontWeight: 400 }}>
                  {personal?.name}
                </div>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', marginTop: 2 }}>Digital Signature</div>
              </div>
            </div>
          </motion.div>

          {/* ── COLUMN 2: SKILLS ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div style={{ background: '#F8FAFC', borderRadius: 20, padding: '28px 24px', border: '1px solid #E5E7EB', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1E40AF, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Technical Skills</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{skills?.length} skills across {skillGroups.length} categories</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {skillGroups.slice(0, 3).map((group, gi) => (
                  <div key={gi}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: group.color, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 }}>{group.label}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {group.skills.slice(0, 3).map((skill, si) => (
                        <div key={si}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{skill.name}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: group.color }}>{skill.level}%</span>
                          </div>
                          <div className="fi-progress-bar">
                            <motion.div
                              className="fi-progress-fill"
                              style={{ background: `linear-gradient(90deg, ${group.color}, ${group.color}90)` }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: 'easeOut', delay: si * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── COLUMN 3: EXPERIENCE ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div style={{ background: '#F8FAFC', borderRadius: 20, padding: '28px 24px', border: '1px solid #E5E7EB', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #059669, #10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={16} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Experience</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{stats?.yearsExperience}+ years in the industry</div>
                </div>
              </div>

              <div style={{ position: 'relative', paddingLeft: 28 }}>
                <div className="fi-timeline-line" />
                {(experience || []).map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    style={{ marginBottom: i < (experience.length - 1) ? 24 : 0, position: 'relative' }}
                  >
                    {/* Timeline Dot */}
                    <div style={{
                      position: 'absolute', left: -28, top: 4,
                      width: 16, height: 16, borderRadius: '50%',
                      background: i === 0 ? 'linear-gradient(135deg, #1E40AF, #2563EB)' : '#CBD5E1',
                      border: '3px solid #fff',
                      boxShadow: i === 0 ? '0 0 0 3px rgba(37,99,235,0.2)' : 'none',
                      zIndex: 2,
                    }} />

                    <div style={{ background: '#fff', borderRadius: 12, padding: '12px 14px', border: '1px solid #E5E7EB', boxShadow: i === 0 ? '0 2px 8px rgba(37,99,235,0.08)' : 'none' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? '#2563EB' : '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 3 }}>{exp.period}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{exp.role}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#2563EB', marginBottom: 6 }}>{exp.company}</div>
                      <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6 }}>{exp.description?.slice(0, 110)}...</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
