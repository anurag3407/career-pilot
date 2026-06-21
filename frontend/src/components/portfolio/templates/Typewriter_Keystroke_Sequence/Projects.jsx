import React from 'react';
import { motion } from 'framer-motion';
import { useViewportTypewriter, C } from './hooks';
import { ExternalLink, Github, BookOpen } from 'lucide-react';

function TypedTitle({ text, speed = 40 }) {
  const { ref, displayed, done } = useViewportTypewriter(text, speed);
  return (
    <h3 ref={ref} className="tks-display" style={{ fontSize: 18, color: C.black, marginBottom: 6 }}>
      {displayed}
      {!done && <span className="tks-cursor-thin" />}
    </h3>
  );
}

function ProjectCard({ project, index }) {
  const chapterNum = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      className="tks-project-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Paper clip decoration */}
      <div className="tks-paperclip" aria-hidden="true" />

      {/* Project image */}
      {project.image && (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={project.image}
            alt={project.title || "Project Screenshot"}
            className="tks-img"
            loading="lazy"
          />
          {/* Overlay chapter number */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(31,31,31,0.7))',
            padding: '20px 14px 10px',
          }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9,
              letterSpacing: 4,
              color: `${C.paperWhite}cc`,
              textTransform: 'uppercase',
            }}>
              Chapter {chapterNum}
            </span>
          </div>
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: '20px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <TypedTitle text={project.title} speed={45} />

        {/* Description */}
        <p style={{
          fontSize: 12,
          lineHeight: 1.75,
          color: C.inkGray,
          marginBottom: 14,
          flex: 1,
        }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
          {(project.techStack || []).map((tech, i) => (
            <span key={i} className="tks-tag">{tech}</span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 8 }}>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="tks-btn tks-btn-primary"
              style={{ fontSize: 10, padding: '6px 12px' }}
              aria-label={`View live demo of ${project.title}`}
            >
              <ExternalLink size={10} />
              <span>Live</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="tks-btn tks-btn-outline"
              style={{ fontSize: 10, padding: '6px 12px' }}
              aria-label={`View source code of ${project.title}`}
            >
              <Github size={10} />
              <span>Code</span>
            </a>
          )}
        </div>
      </div>

      {/* Bookmark */}
      <div className="tks-bookmark" aria-hidden="true" />
    </motion.article>
  );
}

export default function Projects({ projects }) {
  return (
    <section id="projects" style={{ background: C.vintageCream, position: 'relative' }}>
      <div style={{ position: 'relative', height: 8 }}>
        <div className="tks-torn-top" />
      </div>

      <div className="tks-page tks-alt-bg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="tks-chapter-num">
            <BookOpen size={12} />
            Featured Works
          </div>
          <h2 className="tks-section-title">The Portfolio Chapters</h2>
          <div className="tks-section-subtitle">
            Each project is a story — here are the ones worth telling
          </div>
        </motion.div>

        {/* Intro line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: C.border,
            letterSpacing: 2,
            marginBottom: 32,
          }}
        >
          &gt; loading project_files... {projects.length} entries found
        </motion.div>

        {/* Projects grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 28,
        }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.title || i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
