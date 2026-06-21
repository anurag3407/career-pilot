import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Layers } from 'lucide-react';

export default function Projects({ data }) {
  const { projects } = data;

  return (
    <section id="projects" style={{ padding: '96px 0', background: 'linear-gradient(135deg, #F8FAFC 0%, #F0F4FF 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="fi-section-tag">
            <Layers size={12} />
            PORTFOLIO
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', marginBottom: 16 }}>
            Featured <span className="fi-gradient-text">Projects</span>
          </h2>
          <p style={{ fontSize: 17, color: '#64748B', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            A curated selection of my most impactful work — built to solve real problems at scale.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div
          className="fi-projects-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
        >
          {(projects || []).map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="fi-card"
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Project Image */}
              <div style={{ position: 'relative', overflow: 'hidden', height: 180 }}>
                <img
                  src={project.image}
                  alt={project.title || "Project Screenshot"}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                {/* Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.7) 100%)' }} />
                {/* Invoice Number Badge */}
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.95)', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#1E40AF', letterSpacing: '0.5px' }}>
                  #{String(i + 1).padStart(3, '0')}
                </div>
              </div>

              {/* Project Content */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 8, lineHeight: 1.3 }}>{project.title}</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.7, marginBottom: 16, flexGrow: 1 }}>
                  {project.description?.slice(0, 120)}...
                </p>

                {/* Tech Stack */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {(project.techStack || []).map((tech, ti) => (
                    <span
                      key={ti}
                      style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                        background: 'rgba(37,99,235,0.08)', color: '#2563EB', border: '1px solid rgba(37,99,235,0.15)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: 10 }}>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 12, fontWeight: 600, color: '#64748B',
                        textDecoration: 'none', padding: '6px 12px', borderRadius: 8,
                        border: '1px solid #E5E7EB', transition: 'all 0.2s',
                        flex: 1, justifyContent: 'center',
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.color = '#0F172A'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#64748B'; }}
                    >
                      <Github size={13} />
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fi-btn-primary"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 12, fontWeight: 600, color: '#fff',
                        textDecoration: 'none', padding: '6px 12px', borderRadius: 8,
                        flex: 1, justifyContent: 'center',
                      }}
                    >
                      <ExternalLink size={13} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
