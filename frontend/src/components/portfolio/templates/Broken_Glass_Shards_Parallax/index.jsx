import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, ExternalLink } from 'lucide-react';

const THEME = {
  bg: '#0a0a0f',
  primary: '#00f0ff',
  secondary: '#ff003c',
  accent: '#7000ff',
  glassBg: 'rgba(255, 255, 255, 0.03)',
  glassPanel: 'rgba(20, 20, 25, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  textMain: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.6)'
};

// SHARDS BACKGROUND — Replaces the orbs with actual polygonal glass shards
const FloatingShards = () => {
  const { portfolioData: dummyData } = usePortfolio();

  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  
  // Sharp polygonal shapes for shards
  const shards = [
    { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', width: '200px', height: '300px', left: '10%', top: '20%', y: y1, rotate: rotate1, color: THEME.glassBorder },
    { clipPath: 'polygon(20% 0%, 100% 30%, 50% 100%, 0% 60%)', width: '400px', height: '250px', right: '5%', top: '10%', y: y2, rotate: rotate2, color: 'rgba(112, 0, 255, 0.15)' },
    { clipPath: 'polygon(0 0, 100% 20%, 80% 100%, 10% 80%)', width: '300px', height: '400px', left: '40%', top: '60%', y: y3, rotate: rotate1, color: 'rgba(56, 189, 248, 0.1)' },
    { clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', width: '150px', height: '350px', right: '20%', top: '70%', y: y1, rotate: rotate2, color: 'rgba(255, 255, 255, 0.05)' },
    { clipPath: 'polygon(10% 10%, 90% 0, 100% 90%, 0 100%)', width: '250px', height: '250px', left: '5%', top: '80%', y: y2, rotate: rotate1, color: 'rgba(112, 0, 255, 0.1)' }
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      {/* Dynamic Shards */}
      {shards.map((shard, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: shard.width,
            height: shard.height,
            left: shard.left,
            right: shard.right,
            top: shard.top,
            clipPath: shard.clipPath,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.01))',
            border: `1px solid ${shard.color}`,
            backdropFilter: 'blur(8px)',
            boxShadow: `inset 0 0 40px ${shard.color}`,
            y: shard.y,
            rotate: shard.rotate
          }}
        />
      ))}
      
      {/* Shatter Overlay Grid */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundSize: '150px 150px',
        backgroundImage: `
          linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.03) 49%, transparent 51%),
          linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.03) 49%, transparent 51%)
        `,
        opacity: 0.5
      }} />
    </div>
  );
};

function ContentPanel({ children, delay = 0, className = '', style = {} }) {
  const { portfolioData: dummyData } = usePortfolio();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className={`relative z-10 ${className}`}
      style={{
        position: 'relative',
        background: THEME.glassPanel,
        backdropFilter: 'blur(20px) saturate(120%)',
        borderTop: `1px solid ${THEME.glassBorder}`,
        borderLeft: `1px solid ${THEME.glassBorder}`,
        boxShadow: THEME.glassShadow,
        borderRadius: '2px', // Sharp corners instead of rounded
        padding: '40px',
        overflow: 'hidden',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)', // Cut-off corner for shard effect
        ...style
      }}
    >
      {/* Shattered highlight effect */}
      <div style={{
        position: 'absolute',
        top: 0, left: '-100%', width: '50%', height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
        transform: 'skewX(-20deg)',
        animation: 'shimmer 8s infinite'
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          50% { left: 200%; }
          100% { left: 200%; }
        }
      `}</style>
    </motion.div>
  );
}

const BrokenGlassShardsParallax = ({ portfolioData }) => {
  const { portfolioData: dummyData } = usePortfolio();

  const data = portfolioData || dummyData;
  const containerRef = useRef(null);

  if (!data) return <div style={{ color: 'white' }}>Loading...</div>;

  return (
    <div ref={containerRef} style={{ background: THEME.bg, color: THEME.textMain, minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      <FloatingShards />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px', position: 'relative', zIndex: 10 }}>
        
        {/* HERO SECTION */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 style={{ fontSize: 'clamp(4rem, 8vw, 8rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', margin: 0, mixBlendMode: 'plus-lighter' }}>
              {data.personal.name.toUpperCase()}
            </h1>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: THEME.primary, fontWeight: 300, marginTop: '20px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {data.personal.role}
            </h2>
            <p style={{ maxWidth: '600px', fontSize: '1.1rem', color: THEME.textMuted, marginTop: '30px', lineHeight: 1.6 }}>
              {data.personal.bio}
            </p>

            <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
              {[
                { icon: Github, url: data.socials.github },
                { icon: Linkedin, url: data.socials.linkedin },
                { icon: Twitter, url: data.socials.twitter },
                { icon: Mail, url: `mailto:${data.socials.email}` }
              ].map((social, i) => social.url && (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.1, color: THEME.primary }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '50px', height: '50px', borderRadius: '50%',
                    background: THEME.glassBg, border: `1px solid ${THEME.glassBorder}`,
                    color: THEME.textMain, transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = THEME.glassBg}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* EXPERIENCE SECTION */}
        <section style={{ marginTop: '100px' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ width: '40px', height: '2px', background: THEME.secondary }} />
            EXPERIENCE
          </h3>
          <div style={{ display: 'grid', gap: '30px' }}>
            {(data.experience || []).map((exp, i) => (
              <ContentPanel key={i} delay={i * 0.1}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.5rem', fontWeight: 600, color: THEME.primary, margin: 0 }}>{exp.role}</h4>
                    <div style={{ fontSize: '1.1rem', color: THEME.textMain, marginTop: '8px' }}>{exp.company}</div>
                  </div>
                  <div style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.9rem', color: THEME.textMuted, letterSpacing: '0.05em' }}>
                    {exp.period || exp.duration}
                  </div>
                </div>
                <p style={{ marginTop: '20px', color: THEME.textMuted, lineHeight: 1.7 }}>{exp.description}</p>
              </ContentPanel>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section style={{ marginTop: '150px' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ width: '40px', height: '2px', background: THEME.accent }} />
            PROJECTS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {(data.projects || []).map((proj, i) => (
              <ContentPanel key={i} delay={i * 0.1} className="flex flex-col h-full">
                <h4 style={{ fontSize: '1.4rem', fontWeight: 600, margin: '0 0 15px 0' }}>{proj.title}</h4>
                <p style={{ color: THEME.textMuted, lineHeight: 1.6, flexGrow: 1 }}>{proj.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px 0' }}>
                  {(proj.techStack || proj.tech || []).map((t, idx) => (
                    <span key={idx} style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(112, 0, 255, 0.2)', border: `1px solid rgba(112, 0, 255, 0.3)`, borderRadius: '12px', color: '#c084ff' }}>
                      {t}
                    </span>
                  ))}
                </div>
                {(proj.liveUrl || proj.link) && (
                  <a href={proj.liveUrl || proj.link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: THEME.textMain, textDecoration: 'none', fontWeight: 500, marginTop: 'auto' }}>
                    View Project <ExternalLink size={16} />
                  </a>
                )}
              </ContentPanel>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section style={{ marginTop: '150px', marginBottom: '100px' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ width: '40px', height: '2px', background: THEME.primary }} />
            SKILLS
          </h3>
          <ContentPanel delay={0.2}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {(data.skills || []).map((skill, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${THEME.glassBorder}`,
                    clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)', // Parallelogram shards
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'default',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {skill.name || skill}
                </motion.div>
              ))}
            </div>
          </ContentPanel>
        </section>

      </div>
    </div>
  );
};

export default BrokenGlassShardsParallax;
