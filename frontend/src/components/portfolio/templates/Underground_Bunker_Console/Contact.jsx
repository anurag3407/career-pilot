import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact({ data }) {
  const socials = data.socials || {};
  const name = data.personal?.name || 'OPERATOR';
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="bunker-section" style={{ padding: '100px 24px', borderBottom: 'none' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ color: '#ff6600', fontSize: '0.75rem' }}>&#x25B6; TRANSMISSION_CHANNEL</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(51,255,51,0.3), transparent)' }} />
          </div>

          <div style={{
            border: '1px solid rgba(51, 255, 51, 0.15)',
            background: 'rgba(51, 255, 51, 0.02)',
            padding: 32,
          }}>
            <div style={{ color: '#666', fontSize: '0.625rem', marginBottom: 20, letterSpacing: '0.1em' }}>
              // ENCRYPTED_COMMS — {new Date().toLocaleTimeString()} UTC
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <div>
                    <label style={{ display: 'block', color: '#666', fontSize: '0.6875rem', marginBottom: 6, letterSpacing: '0.05em' }}>
                      &gt; CALLSIGN
                    </label>
                    <input type="text" placeholder="YOUR_IDENTIFIER"
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: 'rgba(51,255,51,0.04)', border: '1px solid rgba(51,255,51,0.2)',
                        color: '#33ff33', fontSize: '0.8125rem', fontFamily: 'inherit',
                        outline: 'none',
                      }}
                      onFocus={e => e.target.style.borderColor = '#33ff33'}
                      onBlur={e => e.target.style.borderColor = 'rgba(51,255,51,0.2)'}
                    />
              </div>
              <div>
                    <label style={{ display: 'block', color: '#666', fontSize: '0.6875rem', marginBottom: 6, letterSpacing: '0.05em' }}>
                      &gt; MESSAGE
                    </label>
                    <textarea rows={4} placeholder="TRANSMISSION_CONTENT"
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: 'rgba(51,255,51,0.04)', border: '1px solid rgba(51,255,51,0.2)',
                        color: '#33ff33', fontSize: '0.8125rem', fontFamily: 'inherit',
                        outline: 'none', resize: 'vertical',
                      }}
                      onFocus={e => e.target.style.borderColor = '#33ff33'}
                      onBlur={e => e.target.style.borderColor = 'rgba(51,255,51,0.2)'}
                    />
              </div>
              <button type="submit"
                style={{
                  padding: '12px 28px', border: '1px solid #33ff33', background: 'transparent',
                  color: sent ? '#ff6600' : '#33ff33', fontSize: '0.75rem',
                  fontFamily: 'inherit', fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.background = 'rgba(51,255,51,0.1)'; e.target.style.boxShadow = '0 0 16px rgba(51,255,51,0.2)'; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.boxShadow = 'none'; }}
              >
                {sent ? '> TRANSMISSION_SENT' : '> SEND_TRANSMISSION'}
              </button>
            </form>

            <div style={{ borderTop: '1px solid rgba(51,255,51,0.1)', paddingTop: 24 }}>
              <div style={{ color: '#666', fontSize: '0.625rem', marginBottom: 16, letterSpacing: '0.1em' }}>
                // ALTERNATE_CHANNELS
              </div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#666', textDecoration: 'none', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => e.target.style.color = '#33ff33'}
                    onMouseLeave={e => e.target.style.color = '#666'}
                  >
                    &lt;/&gt; GITHUB
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#666', textDecoration: 'none', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => e.target.style.color = '#33ff33'}
                    onMouseLeave={e => e.target.style.color = '#666'}
                  >
                    &#x25C9; LINKEDIN
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#666', textDecoration: 'none', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => e.target.style.color = '#33ff33'}
                    onMouseLeave={e => e.target.style.color = '#666'}
                  >
                    &#x25B6; TWITTER
                  </a>
                )}
                {socials.email && (
                  <a href={`mailto:${socials.email}`}
                    style={{ color: '#666', textDecoration: 'none', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    onMouseEnter={e => e.target.style.color = '#33ff33'}
                    onMouseLeave={e => e.target.style.color = '#666'}
                  >
                    &#x2709; EMAIL
                  </a>
                )}
              </div>
            </div>

            <div style={{ marginTop: 32, textAlign: 'center', color: '#333', fontSize: '0.625rem', letterSpacing: '0.05em' }}>
              &#x25C9; BUNKER_OS v1.0 — ALL TRANSMISSIONS ARE MONITORED &#x25C9;
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
