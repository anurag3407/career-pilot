import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTypewriter } from './hooks';
import { C } from './hooks';
import { ChevronDown } from 'lucide-react';

export default function Hero({ data, onScrollTo }) {
  const name = useTypewriter(data.personal.name, 65, 600);
  const title = useTypewriter(data.personal.title, 38, name.done ? 300 : 99999);
  const tagline = useTypewriter(
    data.personal.tagline || 'Crafting elegant solutions, one keystroke at a time.',
    22,
    title.done ? 400 : 99999
  );

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
        position: 'relative',
        background: C.paperWhite,
      }}
      className="tks-lined tks-margin-line"
    >
      {/* Decorative smudges */}
      <div className="tks-smudge" style={{ width: 200, height: 140, top: '15%', right: '8%', opacity: 0.6 }} />
      <div className="tks-smudge" style={{ width: 100, height: 70, bottom: '20%', left: '5%', opacity: 0.4 }} />

      {/* Coffee stain */}
      <div className="tks-coffee-stain" style={{ bottom: '18%', right: '12%' }} />

      <div className="tks-page" style={{ width: '100%', paddingTop: 80, paddingBottom: 80 }}>
        {/* Margin note */}
        <div
          className="tks-margin-note"
          style={{ position: 'absolute', left: 20, top: 120, writingMode: 'vertical-lr' }}
        >
          draft v.1
        </div>

        {/* File header */}
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.warmBrown, letterSpacing: 3, marginBottom: 40, textTransform: 'uppercase' }}>
          &gt; portfolio_story.txt — loading...
        </div>

        {/* Story header */}
        <div
          className="tks-display"
          style={{ fontSize: 11, letterSpacing: 6, color: C.warmBrown, textTransform: 'uppercase', marginBottom: 20 }}
        >
          The Story of
        </div>

        {/* Name — large typewriter */}
        <h1
          className="tks-display"
          style={{
            fontSize: 'clamp(2.8rem, 9vw, 6.5rem)',
            lineHeight: 1,
            color: C.black,
            marginBottom: 16,
            fontWeight: 400,
            letterSpacing: '-1px',
          }}
        >
          {name.displayed}
          {!name.done && <span className="tks-cursor" />}
        </h1>

        {/* Title */}
        <div style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          color: C.deepRed,
          letterSpacing: 4,
          marginBottom: 32,
          textTransform: 'uppercase',
          fontFamily: "'IBM Plex Mono', monospace",
          minHeight: '1.6em',
        }}>
          {title.displayed}
          {name.done && !title.done && <span className="tks-cursor-thin" />}
        </div>

        {/* Divider line */}
        {title.done && (
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6 }}
            style={{ height: 1, background: `${C.border}`, marginBottom: 28, maxWidth: 480 }}
          />
        )}

        {/* Tagline / bio snippet */}
        <div style={{
          fontSize: 15,
          lineHeight: 1.9,
          color: C.inkGray,
          maxWidth: 520,
          marginBottom: 48,
          minHeight: '3em',
          fontStyle: 'italic',
        }}>
          {tagline.displayed}
          {title.done && !tagline.done && <span className="tks-cursor-thin" />}
        </div>

        {/* CTA buttons */}
        <AnimatePresence>
          {tagline.done && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 56 }}
            >
              <button type="button" className="tks-btn tks-btn-primary" onClick={() => onScrollTo('about')}>
                &gt; Start Reading
              </button>
              <button type="button" className="tks-btn tks-btn-outline" onClick={() => onScrollTo('contact')}>
                &gt; Contact Me
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <AnimatePresence>
          {tagline.done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ display: 'flex', gap: 0, borderTop: `1px dashed ${C.border}`, paddingTop: 24, maxWidth: 380 }}
            >
              {[
                { val: `${data.stats.yearsExperience}+`, label: 'Years' },
                { val: `${data.stats.projectsCompleted}+`, label: 'Projects' },
                { val: `${data.stats.happyClients}+`, label: 'Clients' },
              ].map(({ val, label }, i) => (
                <div key={i} style={{
                  flex: 1,
                  textAlign: 'center',
                  borderRight: i < 2 ? `1px solid ${C.border}` : 'none',
                  padding: '12px 8px',
                }}>
                  <div className="tks-display" style={{ fontSize: '1.7rem', color: C.deepRed }}>{val}</div>
                  <div style={{ fontSize: 10, color: C.warmBrown, letterSpacing: 2, marginTop: 2, textTransform: 'uppercase', fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator */}
      <button type="button"
        onClick={() => onScrollTo('about')}
        style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.warmBrown, fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        }}
        aria-label="Scroll down"
      >
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={18} />
        </motion.div>
        scroll
      </button>
    </section>
  );
}
