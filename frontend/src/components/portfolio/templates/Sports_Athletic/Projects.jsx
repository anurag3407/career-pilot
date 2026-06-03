import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Zap, Users, Star } from 'lucide-react';

const S = {
  bg: '#080808',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#111111',
  border: '#1e1e1e',
  gold: '#f59e0b',
};

const PROJECTS = [
  {
    id: '01', title: 'AthletIQ Dashboard',
    desc: 'Real-time performance analytics platform tracking biometrics, training loads, and injury risk for elite athletes. Adopted by 3 national teams.',
    tags: ['React', 'D3.js', 'Node.js', 'WebSockets'],
    stars: 842, team: 4, status: 'Live', featured: true,
    accentColor: S.red,
    github: 'https://github.com', live: 'https://example.com',
  },
  {
    id: '02', title: 'Sprint Tracker App',
    desc: 'Mobile-first GPS tracking app for sprint sessions with heatmaps, pace zones, and personal best alerts.',
    tags: ['React Native', 'GPS API', 'Firebase'],
    stars: 317, team: 2, status: 'Live',
    accentColor: S.gold,
    github: 'https://github.com', live: 'https://example.com',
  },
  {
    id: '03', title: 'Team Formation AI',
    desc: 'ML model that generates optimal lineup formations based on opponent analysis and player fitness data.',
    tags: ['Python', 'TensorFlow', 'FastAPI'],
    stars: 560, team: 3, status: 'Beta',
    accentColor: '#3b82f6',
    github: 'https://github.com', live: 'https://example.com',
  },
  {
    id: '04', title: 'Nutrition Planner',
    desc: 'AI-powered meal and supplement planner calibrated for sports-specific macros and competition calendars.',
    tags: ['Next.js', 'OpenAI', 'Prisma'],
    stars: 228, team: 2, status: 'Live',
    accentColor: '#22c55e',
    github: 'https://github.com', live: 'https://example.com',
  },
  {
    id: '05', title: 'Highlight Reel Generator',
    desc: 'Automated video highlight editor that clips peak performance moments using computer vision event detection.',
    tags: ['Python', 'OpenCV', 'FFMPEG'],
    stars: 193, team: 1, status: 'Open Source',
    accentColor: '#a855f7',
    github: 'https://github.com', live: 'https://example.com',
  },
];

function FeaturedCard({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
      className="sm:col-span-2"
      style={{
        background: S.card, border: `1px solid ${hovered ? project.accentColor + '50' : S.border}`,
        padding: '2.5rem', cursor: 'pointer', transition: 'border-color 0.25s',
        position: 'relative', overflow: 'hidden',
      }}>

      <div style={{
        position: 'absolute', top: 0, right: 0, width: '200px', height: '200px',
        background: `radial-gradient(circle at top right, ${project.accentColor}10, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{
              fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.18em',
              color: project.accentColor, textTransform: 'uppercase',
              padding: '0.25rem 0.75rem', border: `1px solid ${project.accentColor}40`,
            }}>
              Featured
            </span>
            <span style={{ fontSize: '0.65rem', color: S.muted, fontWeight: 600 }}>#{project.id}</span>
          </div>

          <h3 style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 900,
            color: S.white, textTransform: 'uppercase',
            letterSpacing: '-0.01em', marginBottom: '0.75rem',
          }}>
            {project.title}
          </h3>

          <p style={{ fontSize: '0.9rem', color: S.muted, lineHeight: 1.75, maxWidth: '520px', marginBottom: '1.5rem' }}>
            {project.desc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '0.65rem', fontWeight: 700, padding: '0.3rem 0.75rem',
                background: project.accentColor + '12', color: project.accentColor,
                border: `1px solid ${project.accentColor}25`,
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
          {/* Fix: render as real links */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { icon: <Github size={16} />, href: project.github },
              { icon: <ExternalLink size={16} />, href: project.live },
            ].map((item, i) => (
              <motion.a key={i} href={item.href} target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.1 }}
                style={{
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', background: 'none',
                  border: `1px solid ${S.border}`, color: S.muted,
                  textDecoration: 'none', transition: 'color 0.2s',
                }}>
                {item.icon}
              </motion.a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: S.muted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Star size={12} color={S.gold} fill={S.gold} /> {project.stars}
            </span>
            <span style={{ fontSize: '0.72rem', color: S.muted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Users size={12} /> {project.team}
            </span>
          </div>
          <span style={{
            fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em',
            color: '#22c55e', textTransform: 'uppercase', padding: '0.2rem 0.6rem',
            border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.06)',
          }}>
            {project.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -3 }}
      style={{
        background: S.card,
        border: `1px solid ${hovered ? project.accentColor + '50' : S.border}`,
        padding: '1.75rem', cursor: 'pointer', transition: 'border-color 0.25s',
      }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: project.accentColor, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          #{project.id}
        </span>
        {/* Fix: real anchor links */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { icon: <Github size={14} />, href: project.github },
            { icon: <ExternalLink size={14} />, href: project.live },
          ].map((item, i) => (
            <motion.a key={i} href={item.href} target="_blank" rel="noreferrer"
              whileHover={{ color: project.accentColor }}
              style={{ color: S.muted, textDecoration: 'none', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}>
              {item.icon}
            </motion.a>
          ))}
        </div>
      </div>

      <h3 style={{
        fontSize: '0.95rem', fontWeight: 900, color: S.white,
        textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem',
      }}>
        {project.title}
      </h3>

      <p style={{ fontSize: '0.8rem', color: S.muted, lineHeight: 1.7, marginBottom: '1.25rem' }}>
        {project.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {project.tags.map(tag => (
          <span key={tag} style={{
            fontSize: '0.6rem', fontWeight: 700, padding: '0.2rem 0.55rem',
            background: project.accentColor + '10', color: project.accentColor,
            textTransform: 'uppercase', letterSpacing: '0.07em',
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={{ fontSize: '0.68rem', color: S.muted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Star size={11} color={S.gold} fill={S.gold} /> {project.stars}
          </span>
          <span style={{ fontSize: '0.68rem', color: S.muted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={11} /> {project.team}
          </span>
        </div>
        <motion.div animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.2 }}>
          <Zap size={14} color={project.accentColor} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>

        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.red }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.red, textTransform: 'uppercase' }}>
            Projects & Ventures
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${S.border}, transparent)` }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900,
            textTransform: 'uppercase', color: S.white,
            letterSpacing: '-0.02em', lineHeight: 0.95, marginBottom: '3rem',
          }}>
          Off the<br /><span style={{ color: S.red }}>Field</span>
        </motion.h2>

        {/* Fix: removed inline gridTemplateColumns so Tailwind sm:grid-cols-2 takes effect */}
        <div className="grid sm:grid-cols-2" style={{ gap: '1rem' }}>
          <FeaturedCard project={PROJECTS[0]} />
          {PROJECTS.slice(1).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
