import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';

/* ---------------------------------------------------------------- */
/* A real CSS 3D Rubik's cube that continuously rotates.            */
/* Built from 6 faces, each a 3x3 grid of stickers.                 */
/* ---------------------------------------------------------------- */
const FACES = [
  { name: 'front', color: '#E53935' },
  { name: 'back', color: '#FB8C00' },
  { name: 'right', color: '#1E88E5' },
  { name: 'left', color: '#43A047' },
  { name: 'top', color: '#FDD835' },
  { name: 'bottom', color: '#FAFAFA' },
];

function RubikCube() {
  return (
    <div className="rk-stage" aria-hidden="true">
      <div className="rk-cube">
        {FACES.map((face) => (
          <div key={face.name} className={`rk-face rk-${face.name}`}>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="rk-sticker" style={{ background: face.color }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Shared scroll-reveal variants                                    */
/* ---------------------------------------------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function RubiksCube3DRotate() {
  const { portfolioData } = usePortfolio();
  if (!portfolioData) return <div className="p-10 text-center">Scrambling the cube…</div>;

  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;

  return (
    <div className="rk-root">
      <style>{`
        .rk-root {
          --ink: #0F172A;
          --paper: #0B1020;
          --accent: #E53935;
          --muted: #94A3B8;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #E2E8F0;
          background:
            radial-gradient(1200px 600px at 80% -10%, rgba(229,57,53,0.18), transparent 60%),
            radial-gradient(900px 500px at 0% 30%, rgba(30,136,229,0.16), transparent 60%),
            #0B1020;
          position: relative;
          overflow-x: hidden;
          min-height: 100vh;
        }
        .rk-root * { box-sizing: border-box; }
        .rk-display { font-family: 'Sora', 'Inter', sans-serif; letter-spacing: -0.02em; }

        /* ---------- LAYOUT ---------- */
        .rk-section { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 6rem 6vw; }
        .rk-head h2 { font-size: clamp(2rem, 4.5vw, 3.2rem); margin: 0 0 3rem; font-weight: 800; color: #F8FAFC; }
        .rk-head .kicker { display: inline-block; font-size: 0.75rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); font-weight: 700; margin-bottom: 0.75rem; }

        /* ---------- 3D CUBE ---------- */
        .rk-stage { width: 220px; height: 220px; perspective: 900px; margin: 0 auto; }
        .rk-cube {
          width: 100%; height: 100%; position: relative;
          transform-style: preserve-3d;
          animation: rk-spin 14s linear infinite;
        }
        .rk-face {
          position: absolute; width: 220px; height: 220px;
          display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr);
          gap: 6px; padding: 6px; background: #0A0A0A;
          border-radius: 10px;
        }
        .rk-sticker { border-radius: 6px; box-shadow: inset 0 0 6px rgba(0,0,0,0.35); }
        .rk-front  { transform: rotateY(0deg) translateZ(110px); }
        .rk-back   { transform: rotateY(180deg) translateZ(110px); }
        .rk-right  { transform: rotateY(90deg) translateZ(110px); }
        .rk-left   { transform: rotateY(-90deg) translateZ(110px); }
        .rk-top    { transform: rotateX(90deg) translateZ(110px); }
        .rk-bottom { transform: rotateX(-90deg) translateZ(110px); }
        @keyframes rk-spin {
          0%   { transform: rotateX(-20deg) rotateY(0deg); }
          100% { transform: rotateX(-20deg) rotateY(360deg); }
        }

        /* ---------- HERO ---------- */
        .rk-hero { position: relative; z-index: 1; min-height: 100vh; display: flex; align-items: center; padding: 6rem 6vw; }
        .rk-hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; align-items: center; gap: 3rem; max-width: 1180px; margin: 0 auto; width: 100%; }
        .rk-hero h1 { font-size: clamp(2.6rem, 7vw, 5rem); line-height: 1.04; margin: 0 0 1.1rem; font-weight: 800; color: #F8FAFC; }
        .rk-grad { background: linear-gradient(100deg, #E53935, #FB8C00 35%, #1E88E5 70%, #43A047); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .rk-tagline { font-size: clamp(1rem, 1.7vw, 1.3rem); max-width: 42ch; color: var(--muted); margin: 0 0 2rem; line-height: 1.6; }
        .rk-meta { font-size: 0.85rem; color: var(--muted); margin-bottom: 1.5rem; }

        .rk-btn { font-weight: 600; font-size: 0.95rem; padding: 0.8rem 1.6rem; border-radius: 999px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; background: var(--accent); color: #fff; border: 2px solid transparent; }
        .rk-btn-ghost { background: transparent; color: #E2E8F0; border: 2px solid rgba(226,232,240,0.25); }

        /* ---------- CARDS ---------- */
        .rk-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 2.5rem; backdrop-filter: blur(8px); }

        .rk-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
        .rk-stat { text-align: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.4rem 0.8rem; }
        .rk-stat .num { font-family: 'Sora', sans-serif; font-size: 2.4rem; font-weight: 800; display: block; background: linear-gradient(120deg, #E53935, #FB8C00); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .rk-stat .label { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); font-weight: 600; }

        .rk-skill-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.4rem 3rem; }
        .rk-skill-row { display: flex; align-items: center; gap: 1rem; }
        .rk-skill-name { font-weight: 600; width: 110px; color: #F1F5F9; }
        .rk-skill-track { flex: 1; height: 10px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .rk-skill-fill { height: 100%; background: linear-gradient(90deg, #E53935, #FB8C00); transform-origin: left; border-radius: 999px; }

        .rk-proj-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.8rem; }
        .rk-proj { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column; }
        .rk-proj-img { width: 100%; height: 180px; object-fit: cover; }
        .rk-proj-body { padding: 1.6rem; display: flex; flex-direction: column; flex: 1; }
        .rk-tag { font-size: 0.72rem; padding: 0.28rem 0.7rem; border-radius: 999px; background: rgba(229,57,53,0.15); color: #FCA5A0; font-weight: 700; margin-right: 0.4rem; margin-bottom: 0.4rem; display: inline-block; }
        .rk-proj-links { display: flex; gap: 1rem; margin-top: auto; padding-top: 1rem; }
        .rk-proj-links a { color: #93C5FD; font-size: 0.85rem; font-weight: 600; text-decoration: none; }

        .rk-timeline { border-left: 3px solid rgba(229,57,53,0.4); padding-left: 2rem; margin-left: 1rem; }
        .rk-tl-item { position: relative; margin-bottom: 3rem; }
        .rk-tl-dot { position: absolute; left: -2.6rem; top: 0.2rem; width: 1.1rem; height: 1.1rem; background: var(--accent); border-radius: 4px; border: 3px solid #0B1020; box-shadow: 0 0 0 2px rgba(229,57,53,0.4); }

        .rk-quote-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.8rem; }
        .rk-quote { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 2rem; }

        @media (max-width: 860px) {
          .rk-hero-grid { grid-template-columns: 1fr; text-align: center; }
          .rk-stage { margin-top: 2rem; }
          .rk-skill-grid { grid-template-columns: 1fr; }
          .rk-stats { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HERO */}
      <header className="rk-hero">
        <div className="rk-hero-grid">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.h1 className="rk-display" variants={fadeUp}>
              {personal?.name || 'Your Name'}
              <br />
              <span className="rk-grad">{personal?.title || 'Developer'}</span>
            </motion.h1>
            {personal?.location && (
              <motion.div className="rk-meta" variants={fadeUp}>📍 {personal.location}</motion.div>
            )}
            <motion.p className="rk-tagline" variants={fadeUp}>{personal?.tagline || personal?.bio}</motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {socials?.email && (
                <motion.a className="rk-btn" href={`mailto:${socials.email}`} whileHover={{ y: -3, scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  Solve Together
                </motion.a>
              )}
              {socials?.github && (
                <motion.a className="rk-btn rk-btn-ghost" href={socials.github} target="_blank" rel="noreferrer" whileHover={{ y: -3, scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  GitHub
                </motion.a>
              )}
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <RubikCube />
          </motion.div>
        </div>
      </header>

      {/* ABOUT */}
      <section className="rk-section">
        <motion.div className="rk-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
          <span className="kicker">The Solver</span>
          <h2 className="rk-display">About</h2>
        </motion.div>
        <div className="rk-panel">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#CBD5E1' }}>{personal?.bio}</p>
          <div className="rk-stats">
            {[
              ['years', stats?.yearsExperience, 'Years Experience'],
              ['projects', stats?.projectsCompleted, 'Projects Solved'],
              ['clients', stats?.happyClients, 'Happy Clients'],
            ].map(([k, v, l]) => (
              <motion.div key={k} className="rk-stat" whileHover={{ scale: 1.06 }}>
                <span className="num">{v ?? '—'}</span>
                <span className="label">{l}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="rk-section">
        <motion.div className="rk-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
          <span className="kicker">Algorithms</span>
          <h2 className="rk-display">Skills</h2>
        </motion.div>
        <div className="rk-panel rk-skill-grid">
          {skills?.slice(0, 10).map((skill, i) => (
            <motion.div className="rk-skill-row" key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="rk-skill-name">{skill.name}</span>
              <span className="rk-skill-track">
                <motion.div
                  className="rk-skill-fill"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: (skill.level || 70) / 100 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.08 }}
                />
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="rk-section">
        <motion.div className="rk-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
          <span className="kicker">Solved Patterns</span>
          <h2 className="rk-display">Projects</h2>
        </motion.div>
        <div className="rk-proj-grid">
          {projects?.map((proj, i) => (
            <motion.article
              key={i}
              className="rk-proj"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5 }}
            >
              {proj.image && <img src={proj.image} alt={proj.title || 'project'} className="rk-proj-img" />}
              <div className="rk-proj-body">
                <h3 className="rk-display" style={{ fontSize: '1.4rem', marginBottom: '0.7rem', color: '#F8FAFC' }}>{proj.title}</h3>
                <p style={{ color: '#94A3B8', lineHeight: '1.6', marginBottom: '1rem', fontSize: '0.95rem' }}>{proj.description}</p>
                <div>{proj.techStack?.map((t, idx) => <span key={idx} className="rk-tag">{t}</span>)}</div>
                <div className="rk-proj-links">
                  {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer">Live →</a>}
                  {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer">Code →</a>}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="rk-section">
        <motion.div className="rk-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
          <span className="kicker">Move History</span>
          <h2 className="rk-display">Experience</h2>
        </motion.div>
        <div className="rk-timeline">
          {experience?.map((job, i) => (
            <motion.div key={i} className="rk-tl-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="rk-tl-dot"></div>
              <div style={{ color: '#FB8C00', fontWeight: 700, marginBottom: '0.2rem', fontSize: '0.9rem' }}>{job.period}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#F8FAFC' }}>{job.role}</h3>
              <div style={{ fontWeight: 600, color: '#94A3B8', marginBottom: '0.7rem' }}>{job.company}</div>
              <p style={{ color: '#CBD5E1', lineHeight: '1.6' }}>{job.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="rk-section">
          <motion.div className="rk-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
            <span className="kicker">Cubers Say</span>
            <h2 className="rk-display">Testimonials</h2>
          </motion.div>
          <div className="rk-quote-grid">
            {testimonials.map((t, i) => (
              <motion.div key={i} className="rk-quote" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
                <p style={{ fontStyle: 'italic', color: '#CBD5E1', marginBottom: '1.4rem', lineHeight: '1.6' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  {t.avatar && <img src={t.avatar} alt={t.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />}
                  <div>
                    <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section className="rk-section" id="contact" style={{ paddingBottom: '8rem' }}>
        <motion.div className="rk-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
          <span className="kicker">Final Layer</span>
          <h2 className="rk-display">Get In Touch</h2>
        </motion.div>
        <div className="rk-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 className="rk-display" style={{ fontSize: '2.2rem', marginBottom: '1rem', color: '#F8FAFC' }}>Ready to solve the next puzzle?</h3>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Whether it's a tricky problem or a new collaboration, let's twist it into place together.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {socials?.email && (
              <motion.a className="rk-btn" href={`mailto:${socials.email}`} whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Email Me
              </motion.a>
            )}
            {socials?.github && (
              <motion.a className="rk-btn rk-btn-ghost" href={socials.github} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                GitHub
              </motion.a>
            )}
            {socials?.linkedin && (
              <motion.a className="rk-btn rk-btn-ghost" href={socials.linkedin} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                LinkedIn
              </motion.a>
            )}
            {socials?.twitter && (
              <motion.a className="rk-btn rk-btn-ghost" href={socials.twitter} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Twitter
              </motion.a>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>
          © {new Date().getFullYear()} {personal?.name}. Solved & shipped.
        </div>
      </section>
    </div>
  );
}
