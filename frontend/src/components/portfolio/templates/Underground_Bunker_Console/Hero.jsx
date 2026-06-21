import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ data }) {
  const name = data.personal?.name || 'UNKNOWN';
  const title = data.personal?.title || 'OPERATOR';
  const bio = data.personal?.bio || '';
  const avatar = data.personal?.avatar || '';
  const location = data.personal?.location || 'CLASSIFIED';

  return (
    <section id="top" className="bunker-section" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingTop: 80, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(51,255,51,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 800, width: '100%', padding: '0 24px', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            border: '1px solid rgba(51, 255, 51, 0.3)',
            background: 'rgba(51, 255, 51, 0.03)',
            borderRadius: 0, padding: 40,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -1, left: 24, right: 24,
              height: 1, background: 'linear-gradient(90deg, transparent, #33ff33, transparent)',
            }} />

            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ color: '#ff6600', fontSize: '0.625rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                &#x25B6; SYSTEM BOOT SEQUENCE INITIALIZED
              </span>
              <span style={{ color: '#666', fontSize: '0.625rem' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            {avatar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: 24 }}
              >
                <img src={avatar} alt={name || "Profile Avatar"}
                  style={{
                    width: 96, height: 96, borderRadius: '50%',
                    border: '2px solid #33ff33', objectFit: 'cover',
                    filter: 'grayscale(100%) contrast(1.2)',
                    imageRendering: 'pixelated',
                  }}
                />
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 700, color: '#33ff33',
                marginBottom: 8, letterSpacing: '0.05em',
              }}
            >
              {`> USER_PROFILE: ${name}`}
              <span className="cursor-blink" style={{ color: '#33ff33' }}>_</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{ color: '#ff6600', fontSize: '0.875rem', marginBottom: 16, letterSpacing: '0.02em' }}
            >
              {`> DESIGNATION: ${title}`}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              style={{ color: '#999', fontSize: '0.8125rem', lineHeight: 1.8, marginBottom: 20 }}
            >
              {`> BIO: ${bio}`}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: '0.75rem', color: '#666' }}
            >
              <span>&#x25C9; LOCATION: {location}</span>
              <span>&#x25C9; STATUS: <span style={{ color: '#33ff33' }}>ACTIVE</span></span>
            </motion.div>

            <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
              <a href="#projects"
                onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{
                  padding: '10px 24px', border: '1px solid #33ff33', color: '#33ff33',
                  textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', transition: 'all 0.2s',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(51,255,51,0.1)'; e.target.style.boxShadow = '0 0 16px rgba(51,255,51,0.2)'; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none'; }}
              >
                &#x25B6; VIEW MISSIONS
              </a>
              <a href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{
                  padding: '10px 24px', border: '1px solid rgba(51,255,51,0.3)', color: '#666',
                  textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', transition: 'all 0.2s',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { e.target.style.color = '#33ff33'; e.target.style.borderColor = '#33ff33'; }}
                onMouseLeave={e => { e.target.style.color = '#666'; e.target.style.borderColor = 'rgba(51,255,51,0.3)'; }}
              >
                &#x25B6; TRANSMIT
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
