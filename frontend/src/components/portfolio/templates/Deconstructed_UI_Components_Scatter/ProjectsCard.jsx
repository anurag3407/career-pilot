import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsCard({ projects, className }) {
  const [expanded, setExpanded] = useState(null);

  if (!projects || projects.length === 0) return null;

  return (
    <motion.div
      className={`ducs-card ducs-projects-pos ${className || ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <span
        className="ducs-corner-badge"
        style={{ color: '#22d3ee', borderColor: 'rgba(6,182,212,0.35)', background: 'rgba(6,182,212,0.1)' }}
      >
        Projects
      </span>

      <p className="ducs-section-label" style={{ color: 'rgba(6,182,212,0.6)' }}>
        Work
      </p>
      <h2 className="ducs-section-title">Featured Projects</h2>

      <div>
        {projects.slice(0, 5).map((project, index) => (
          <motion.div
            key={index}
            id={`ducs-project-${index}`}
            className="ducs-project-item"
            style={{ cursor: 'pointer' }}
            onClick={() => setExpanded(expanded === index ? null : index)}
            layout
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p className="ducs-project-title">{project.title || project.name}</p>
                <p className="ducs-project-desc">
                  {(project.description || project.summary)?.slice(0, 80)}
                  {(project.description || project.summary)?.length > 80 ? '…' : ''}
                </p>
              </div>
              <span style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.25)',
                marginLeft: '0.75rem',
                marginTop: '2px',
                flexShrink: 0,
                transform: expanded === index ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.25s',
              }}>▶</span>
            </div>

            <AnimatePresence>
              {expanded === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  {project.description?.length > 80 && (
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                      {project.description}
                    </p>
                  )}

                  {project.techStack?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="ducs-tag ducs-tag-cyan" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ducs-btn-primary"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.9rem' }}
                        id={`ducs-project-${index}-live`}
                        onClick={e => e.stopPropagation()}
                      >
                        Live Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ducs-btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.35rem 0.9rem' }}
                        id={`ducs-project-${index}-github`}
                        onClick={e => e.stopPropagation()}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
