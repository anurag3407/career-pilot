import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';

/* ---------------------------------------------------------------- */
/* Fixed background rig: bright sky + CSS clouds + the MASSIVE balloon */
/* ---------------------------------------------------------------- */
function SkyRig({ scrollYProgress }) {
  const skyColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['#DCF1F2', '#BDE3E5', '#FFDAB9', '#FFCBA4', '#FFB7B2']
  );

  // STARTING POSITION: Starts at 10vh to ensure the top and bottom are fully visible in the hero.
  // Scrolls upwards into the negative space as you scroll down the page.
  const rawY = useTransform(scrollYProgress, [0, 1], ['10vh', '-120vh']);
  const balloonY = useSpring(rawY, { stiffness: 45, damping: 14, mass: 0.8 });
  const sway = useTransform(scrollYProgress, [0, 0.5, 1], [-6, 6, -4]);
  const balloonRotate = useSpring(sway, { stiffness: 35, damping: 10 });

  const cloudFarX = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const cloudNearX = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const cloudFarY = useTransform(scrollYProgress, [0, 1], ['0vh', '-80vh']);
  const cloudNearY = useTransform(scrollYProgress, [0, 1], ['5vh', '-100vh']);

  return (
    <motion.div className="hab-fixed-sky" style={{ background: skyColor }}>
      {/* Background Clouds */}
      <motion.div className="hab-cloud-layer" style={{ x: cloudFarX, y: cloudFarY, zIndex: 1 }}>
        <CssCloud style={{ top: '15%', left: '10%', transform: 'scale(1.2)', opacity: 0.7 }} duration={25} />
        <CssCloud style={{ top: '40%', left: '60%', transform: 'scale(0.8)', opacity: 0.5 }} duration={35} reverse />
        <CssCloud style={{ top: '70%', left: '20%', transform: 'scale(1.5)', opacity: 0.6 }} duration={20} />
      </motion.div>

      {/* The animated balloon track (Shifted to 75% left to occupy the right-side of the hero) */}
      <motion.div className="hab-balloon-track" style={{ y: balloonY, rotate: balloonRotate, zIndex: 2 }}>
        <div className="hotair-balloon">
          <div className="cloud" style={{ top: '80px', right: '-40px', transform: 'scale(0.6)', opacity: 0.8 }}></div>
          <div className="balloon"></div>
          <div className="basket"></div>
        </div>
      </motion.div>

      {/* Foreground Clouds */}
      <motion.div className="hab-cloud-layer" style={{ x: cloudNearX, y: cloudNearY, zIndex: 3 }}>
        <CssCloud style={{ top: '25%', left: '75%', transform: 'scale(1.8)', opacity: 0.9 }} duration={18} reverse />
        <CssCloud style={{ top: '80%', left: '80%', transform: 'scale(1.4)', opacity: 0.8 }} duration={28} />
      </motion.div>
    </motion.div>
  );
}

function CssCloud({ style, duration, reverse }) {
  return (
    <motion.div
      className="hab-css-cloud"
      style={style}
      animate={{ x: reverse ? [0, -60, 0] : [0, 60, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Animated, letter-staggered hero headline                         */
/* ---------------------------------------------------------------- */
function DriftText({ text, className }) {
  const letters = text.split('');
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block' }}
          initial={{ y: 40, opacity: 0, rotate: 6 }}
          animate={{ y: [0, -6, 0], opacity: 1, rotate: 0 }}
          transition={{
            delay: i * 0.035,
            duration: 0.6,
            y: { duration: 3.2 + (i % 4) * 0.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 0.6 + i * 0.035 },
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function HotAirBalloonDrifting() {
  const { portfolioData } = usePortfolio();
  if (!portfolioData) return <div className="p-10 text-center">Loading Flight Data...</div>;

  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <div className="hab-root" ref={containerRef}>
      <style>{`
        .hab-root {
          --ink: #1F2937;
          --paper: #ffffff;
          --accent: #F27C68;
          font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--ink);
          position: relative;
          isolation: isolate;
          overflow-x: hidden;
        }
        .hab-root * { box-sizing: border-box; }
        .hab-display { font-family: 'Fraunces', Georgia, serif; }

        /* ---------- FIXED SKY RIG ---------- */
        .hab-fixed-sky { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .hab-cloud-layer { position: absolute; inset: 0; }
        .hab-balloon-track { position: absolute; left: 75%; top: 0; margin-left: -12.5rem; width: 25rem; }

        /* ---------- MASSIVE BALLOON STYLES ---------- */
        .hotair-balloon { 
          width: 25rem; 
          height: 25rem; 
          position: relative; 
          margin: 0 auto; 
          transform: scale(1.8); /* Massively increased size */
          transform-origin: top center;
        }
        
        .balloon {
          width: 9.35rem; height: 9.35rem; background-color: #F27C68; border-radius: 50%;
          border: 4px solid #D7E7EA; position: absolute; left: 50%; top: 50px;
          transform: translate(-50%); animation: moving-balloon 3s ease infinite;
        }
        .balloon::after {
          width: 4.35rem; height: 0; border-top: 3.75rem solid #F27C68;
          border-left: 1.85rem solid transparent; border-right: 1.85rem solid transparent;
          content: ""; position: absolute; top: 100px; left: 50%; transform: translate(-50%);
        }
        .balloon::before {
          width: 70px; height: 25px; background-color: #E86B5A; border-radius: 5px;
          content: ""; position: absolute; left: 50%; top: 9.35rem; transform: translate(-50%);
        }

        .basket {
          width: 2.65rem; height: 1.75rem; background: #D1C1A6; border-radius: 0 0 3px 3px;
          position: absolute; left: 50%; transform: translate(-50%); top: 16.85rem;
          animation: moving-basket 3s ease infinite;
        }
        .basket::before {
          width: 3.15rem; height: 0.65rem; background: #B2A082; border-radius: 3px;
          content: ""; position: absolute; top: -0.65rem; left: 50%; transform: translate(-50%);
        }
        .basket::after {
          width: 1.55rem; height: 2.15rem; border-left: 2px solid #B2A082; border-right: 2px solid #B2A082;
          content: ""; position: absolute; top: -2.5rem; left: 50%;
          transform: translate(-50%) perspective(50px) rotateX(-40deg);
        }

        .hab-css-cloud, .cloud {
          width: 140px; height: 1.85rem; background: rgba(255,255,255,0.9);
          border-radius: 3.15rem; position: absolute; animation: moving-cloud 4s ease-in-out infinite;
        }
        .hab-css-cloud::before, .cloud::before {
          width: 3.75rem; height: 3.75rem; background: rgba(255,255,255,0.9); border-radius: 50%;
          content: ""; position: absolute; top: -2.5rem; left: 1.25rem;
        }
        .hab-css-cloud::after, .cloud::after {
          width: 3.15rem; height: 3.15rem; background: rgba(255,255,255,0.9); border-radius: 50%;
          content: ""; position: absolute; top: -1.85rem; right: 1.55rem;
        }

        @keyframes moving-balloon { 0% { transform: translate(-50%); } 50% { transform: translate(-50%, -6%); } }
        @keyframes moving-basket { 0% { transform: translate(-50%); } 50% { transform: translate(-50%, -20%); } }
        @keyframes moving-cloud { 0% { transform: translateX(0); } 50% { transform: translateX(-5%); } }
        @keyframes bg-pan { 0% { background-position: 0% 0%; } 100% { background-position: 100% 100%; } }

        /* ---------- BACKGROUND PATTERNS ---------- */
        .bg-pattern { position: absolute; inset: 0; z-index: -1; animation: bg-pan 30s linear infinite; opacity: 0.08; }
        .rotated { --s: 80px; --c: #542437; --_g: #b22f2f93 calc(-650%/13) calc(50%/13), var(--c) 0 calc(100%/13), #e04a4ac6 0 calc(150%/13), var(--c) 0 calc(200%/13), #4cec86b9 0 calc(250%/13), var(--c) 0 calc(300%/13); --_g0: repeating-linear-gradient(45deg, var(--_g)); --_g1: repeating-linear-gradient(-45deg, var(--_g)); background: var(--_g0), var(--_g0) var(--s) var(--s), var(--_g1), var(--_g1) var(--s) var(--s) #C02942; background-size: calc(2*var(--s)) calc(2*var(--s)); }
        .hypnotic { --r: 56px; --c1: #3FB8AF 99%, #0000 101%; --c2: #FF9E9D 99%, #0000 101%; --s: calc(var(--r)*.866); --g0: radial-gradient(var(--r), var(--c1)); --g1: radial-gradient(var(--r), var(--c2)); --f: radial-gradient(var(--r) at calc(100% + var(--s)) 50%, var(--c1)); --p: radial-gradient(var(--r) at 100% 50%, var(--c2)); background: var(--f) 0 calc(-5*var(--r)/2), var(--f) calc(-2*var(--s)) calc(var(--r)/2), var(--p) 0 calc(-2*var(--r)), var(--g0) var(--s) calc(-5*var(--r)/2), var(--g1) var(--s) calc(5*var(--r)/2), radial-gradient(var(--r) at 100% 100%, var(--c1)) 0 calc(-1*var(--r)), radial-gradient(var(--r) at 0% 50%, var(--c1)) 0 calc(-4*var(--r)), var(--g1) calc(-1*var(--s)) calc(-7*var(--r)/2), var(--g0) calc(-1*var(--s)) calc(-5*var(--r)/2), var(--p) calc(-2*var(--s)) var(--r), var(--g0) calc(-1*var(--s)) calc(var(--r)/ 2), var(--g1) calc(-1*var(--s)) calc(var(--r)/-2), var(--g0) 0 calc(-1*var(--r)), var(--g1) var(--s) calc(var(--r)/-2), var(--g0) var(--s) calc(var(--r)/ 2) #FF9E9D; background-size: calc(4*var(--s)) calc(6*var(--r)); }
        .evermore { --s: 150px; background: linear-gradient(135deg, #0000 18.75%, #5E412F 0 31.25%, #1598a1ce 0), repeating-linear-gradient(45deg, #5E412F -6.25% 6.25%, #FCEBB6 0 18.75%); background-size: var(--s) var(--s); }
        .rvo { --s: 120px; --c1: #4E395D; --c2: #8EBE94; --_g: var(--c1) 15%, var(--c2) 0 28%, #0000 0 72%, var(--c2) 0 85%, var(--c1) 0; background: conic-gradient(from 90deg at 2px 2px, #0000 25%, var(--c1) 0) -1px -1px, linear-gradient(-45deg, var(--_g)), linear-gradient(45deg, var(--_g)), conic-gradient(from 90deg at 40% 40%, var(--c1) 25%, var(--c2) 0) calc(var(--s)/-5) calc(var(--s)/-5); background-size: var(--s) var(--s); }
        .circular { --s: 120px; --_g: radial-gradient(#bcae16cf 80%, #1340bdb3 51%, rgb(18, 120, 45) 15%); background: var(--_g), var(--_g) calc(var(--s)/2) calc(var(--s)/2), conic-gradient(#0f9177 25%, #fdebad 10% 50%, #d34434 15% 75%, #b5d999 0); background-size: var(--s) var(--s); }
        .moon { background-color: #e5e5f7; background-image: radial-gradient(at 10px 10px, #2f3387, #444cf7 50%, #e5e5f7 50%); background-size: 10px 10px; }

        /* ---------- SECTION SHELL (Transparent to let sky through) ---------- */
        .hab-section-wrapper { position: relative; z-index: 1; overflow: hidden; padding: 6rem 6vw; max-width: 1180px; margin: 0 auto; }
        .hab-section-head h2 { font-size: clamp(2rem, 4vw, 3rem); margin: 0; font-weight: 700; color: var(--ink); margin-bottom: 3rem; }

        /* ---------- HERO ---------- */
        .hab-hero { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 6rem 6vw 4rem; }
        .hab-hero-grid { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 2rem; max-width: 1180px; margin: 0 auto; width: 100%; }
        .hab-hero h1 { font-size: clamp(3rem, 7vw, 5.5rem); line-height: 1.05; margin: 0 0 1.1rem; font-weight: 700; color: #1F2937; }
        .hab-shimmer { background: linear-gradient(100deg, var(--accent) 0%, #E86B5A 25%, #D7E7EA 50%, var(--accent) 75%); background-size: 250% auto; -webkit-background-clip: text; background-clip: text; color: transparent; font-style: italic; animation: hab-shimmer-move 6s linear infinite; }
        .hab-hero p.hab-tagline { font-size: clamp(1.1rem, 1.8vw, 1.4rem); max-width: 40ch; opacity: 0.85; margin: 0 0 2rem; color: #374151; font-weight: 500; }
        
        .hab-btn { font-weight: 600; font-size: 1rem; padding: 0.85rem 1.8rem; border-radius: 999px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; background: var(--accent); color: white; box-shadow: 0 10px 24px rgba(242,124,104,0.35); border: 2px solid transparent; }
        .hab-btn-ghost { background: transparent; color: var(--accent); border: 2px solid var(--accent); box-shadow: none; }
        
        /* ---------- CARDS (Glassmorphism applied here) ---------- */
        .hab-panel, .hab-log-entry, .hab-postcard { 
          background: rgba(255, 255, 255, 0.5); /* Semi-transparent white */
          backdrop-filter: blur(12px); 
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6); 
          box-shadow: 0 10px 30px rgba(0,0,0,0.05); 
          border-radius: 24px; 
          padding: 2.5rem; 
        }
        
        .hab-gauges { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
        .hab-gauge { text-align: center; }
        .hab-gauge .num { font-family: 'Fraunces', serif; font-size: 2.5rem; color: var(--accent); display: block; }
        .hab-gauge .label { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; color: #6B7280; }

        .hab-skill-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem 3rem; }
        .hab-skill-row { display: flex; align-items: center; gap: 1rem; }
        .hab-skill-name { font-weight: 600; width: 100px; }
        .hab-skill-track { flex: 1; height: 10px; border-radius: 999px; background: rgba(0,0,0,0.08); overflow: hidden; }
        .hab-skill-fill { height: 100%; background: linear-gradient(90deg, #F27C68, #E86B5A); transform-origin: left; border-radius: 999px; }

        .hab-log-entry { display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem; padding: 0; margin-bottom: 2rem; }
        .hab-log-img { width: 100%; height: 100%; object-fit: cover; min-height: 250px; }
        .hab-log-body { padding: 2rem; display: flex; flex-direction: column; justify-content: center; }
        .hab-tag { font-size: 0.75rem; padding: 0.3rem 0.8rem; border-radius: 999px; background: rgba(242,124,104,0.15); color: #E86B5A; font-weight: 700; margin-right: 0.5rem; margin-bottom: 0.5rem; display: inline-block; }

        .hab-timeline { border-left: 3px solid rgba(242,124,104,0.3); padding-left: 2rem; margin-left: 1rem; }
        .hab-tl-item { position: relative; margin-bottom: 3rem; }
        .hab-tl-dot { position: absolute; left: -2.6rem; top: 0; width: 1.2rem; height: 1.2rem; background: var(--accent); border-radius: 50%; border: 4px solid white; box-shadow: 0 0 0 2px rgba(242,124,104,0.3); }
        
        .hab-postcard { padding: 2rem; border-radius: 16px; }
        .hab-postcard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }

        @media (max-width: 860px) {
          .hab-hero-grid, .hab-log-entry { grid-template-columns: 1fr; }
          .hab-balloon-track { left: 50%; }
          .hotair-balloon { transform: scale(1.1); } /* Smaller on mobile to prevent overflow */
          .hab-skill-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <SkyRig scrollYProgress={scrollYProgress} />

      {/* HERO */}
      <header className="hab-hero">
        <div className="bg-pattern moon"></div>
        <div className="hab-hero-grid">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <h1 className="hab-display">
              <motion.div variants={fadeUp}><DriftText text={personal.name || 'Alex Rivera'} /></motion.div>
              <motion.div variants={fadeUp}><DriftText text={personal.title || 'Full Stack Developer'} className="hab-shimmer" /></motion.div>
            </h1>
            <motion.p className="hab-tagline" variants={fadeUp}>{personal.tagline || personal.bio}</motion.p>
            <motion.div variants={fadeUp}>
              {socials?.email && (
                <motion.a className="hab-btn" href={`mailto:${socials.email}`} whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Begin Journey
                </motion.a>
              )}
            </motion.div>
          </motion.div>
          <div className="hab-hero-balloon-wrap" />
        </div>
      </header>

      {/* ABOUT */}
      <section className="hab-section-wrapper">
        <div className="bg-pattern circular"></div>
        <motion.div className="hab-section-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
           <h2 className="hab-display">The Pilot</h2>
        </motion.div>
        <div className="hab-panel">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4B5563', marginBottom: '1rem' }}>{personal.bio}</p>
          <div className="hab-gauges">
            {[ ['years', stats?.yearsExperience, 'Years Aloft'], ['flights', stats?.projectsCompleted, 'Missions'], ['clients', stats?.happyClients, 'Passengers'] ].map(([k, v, l]) => (
              <motion.div key={k} className="hab-gauge" whileHover={{ scale: 1.1 }}>
                <span className="num">{v || '-'}</span><span className="label">{l}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="hab-section-wrapper">
         <div className="bg-pattern hypnotic opacity-5"></div>
         <motion.div className="hab-section-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
           <h2 className="hab-display">Control Board</h2>
         </motion.div>
         <div className="hab-panel hab-skill-grid">
            {skills?.slice(0, 8).map((skill, i) => (
               <motion.div className="hab-skill-row" key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <span className="hab-skill-name">{skill.name}</span>
                  <span className="hab-skill-track">
                     <motion.div className="hab-skill-fill" initial={{ scaleX: 0 }} whileInView={{ scaleX: (skill.level || 70)/100 }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} />
                  </span>
               </motion.div>
            ))}
         </div>
      </section>

      {/* PROJECTS */}
      <section className="hab-section-wrapper">
        <div className="bg-pattern evermore"></div>
        <motion.div className="hab-section-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
          <h2 className="hab-display">Flight Log</h2>
        </motion.div>
        <div>
          {projects?.map((proj, i) => (
            <motion.article key={i} className="hab-log-entry" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -5 }}>
              {proj.image && <img src={proj.image} alt="project" className="hab-log-img" />}
              <div className="hab-log-body">
                <h3 className="hab-display" style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1F2937' }}>{proj.title}</h3>
                <p style={{ color: '#4B5563', lineHeight: '1.6', marginBottom: '1.5rem' }}>{proj.description}</p>
                <div>{proj.techStack?.map((t, idx) => <span key={idx} className="hab-tag">{t}</span>)}</div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="hab-section-wrapper">
         <div className="bg-pattern rvo opacity-[0.04]"></div>
         <motion.div className="hab-section-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
           <h2 className="hab-display">Logged Hours</h2>
         </motion.div>
         <div className="hab-timeline">
           {experience?.map((job, i) => (
             <motion.div key={i} className="hab-tl-item" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
               <div className="hab-tl-dot"></div>
               <div style={{ color: '#F27C68', fontWeight: '700', marginBottom: '0.2rem' }}>{job.period}</div>
               <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1F2937' }}>{job.role}</h3>
               <div style={{ fontWeight: '600', color: '#6B7280', marginBottom: '0.8rem' }}>{job.company}</div>
               <p style={{ color: '#4B5563', lineHeight: '1.6' }}>{job.description}</p>
             </motion.div>
           ))}
         </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="hab-section-wrapper">
          <div className="bg-pattern rotated opacity-[0.03]"></div>
          <motion.div className="hab-section-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
            <h2 className="hab-display">Postcards</h2>
          </motion.div>
          <div className="hab-postcard-grid">
            {testimonials.map((t, i) => (
              <motion.div key={i} className="hab-postcard" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
                 <p style={{ fontStyle: 'italic', color: '#4B5563', marginBottom: '1.5rem', lineHeight: '1.6' }}>"{t.text}"</p>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {t.avatar && <img src={t.avatar} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />}
                    <div>
                      <div style={{ fontWeight: '700', color: '#1F2937' }}>{t.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{t.role}</div>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT / TOUCHDOWN */}
      <section className="hab-section-wrapper" id="contact" style={{ paddingBottom: '10rem' }}>
         <div className="bg-pattern moon opacity-[0.05]"></div>
         <motion.div className="hab-section-head" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={fadeUp}>
           <h2 className="hab-display">Touchdown & Contact</h2>
         </motion.div>
         
         <div className="hab-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
           <h3 className="hab-display" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1F2937' }}>Ready for a new expedition?</h3>
           <p style={{ fontSize: '1.1rem', color: '#4B5563', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto' }}>
             My radio comms are always open for new alliances, collaborative constructs, or simple data exchanges. Let's build something remarkable.
           </p>
           
           <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
             {socials?.email && (
               <motion.a className="hab-btn" href={`mailto:${socials.email}`} whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 Send Transmission
               </motion.a>
             )}
             {socials?.github && (
               <motion.a className="hab-btn hab-btn-ghost" href={socials.github} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 GitHub
               </motion.a>
             )}
             {socials?.linkedin && (
               <motion.a className="hab-btn hab-btn-ghost" href={socials.linkedin} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 LinkedIn
               </motion.a>
             )}
             {socials?.twitter && (
               <motion.a className="hab-btn hab-btn-ghost" href={socials.twitter} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                 Twitter
               </motion.a>
             )}
           </div>
         </div>
         
         <div style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.9rem', color: '#6B7280', fontWeight: '500' }}>
            © {new Date().getFullYear()} {personal.name}. Safely landed.
         </div>
      </section>

    </div>
  );
}