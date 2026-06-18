import React from 'react';
import { motion } from 'framer-motion';
import { useViewportTypewriter, C } from './hooks';
import { MapPin, Mail, Github, Linkedin, Twitter, FileText } from 'lucide-react';

function TypedHeading({ text, speed = 45 }) {
  const { ref, displayed, done } = useViewportTypewriter(text, speed);
  return (
    <h2 ref={ref} className="tks-section-title">
      {displayed}
      {!done && <span className="tks-cursor-thin" />}
    </h2>
  );
}

function TypedParagraph({ text, speed = 18, style = {} }) {
  const { ref, displayed, done } = useViewportTypewriter(text, speed);
  return (
    <p ref={ref} style={{ fontSize: 14, lineHeight: 1.9, color: C.inkGray, ...style }}>
      {displayed}
      {!done && <span className="tks-cursor-thin" />}
    </p>
  );
}

export default function About({ data }) {
  const email = data.socials?.email || data.personal?.email || '';
  const resumeUrl = data.personal?.resumeUrl || '#contact';
  const location = data.personal?.location || '';

  return (
    <section id="about" style={{ background: C.vintageCream, position: 'relative' }}>
      {/* Torn paper top edge */}
      <div style={{ position: 'relative', height: 8 }}>
        <div className="tks-torn-top" />
      </div>

      {/* Decorative smudge */}
      <div className="tks-smudge" style={{ width: 160, height: 100, top: 40, right: '5%', opacity: 0.5 }} />

      <div className="tks-page tks-alt-bg" style={{ paddingTop: 60 }}>
        {/* Chapter label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="tks-chapter-num">Chapter 01</div>
          <TypedHeading text="About The Author" speed={50} />
          <div className="tks-section-subtitle">
            A brief introduction — in the author's own words
          </div>
        </motion.div>

        {/* Content grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.8fr)',
          gap: 56,
          alignItems: 'start',
        }} className="tks-about-grid-resp">
          {/* Left: avatar + socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ textAlign: 'center' }}
          >
            {data.personal.avatar && (
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                {/* Photo corners */}
                {['tl','tr','bl','br'].map(pos => (
                  <div key={pos} style={{
                    position: 'absolute',
                    width: 14, height: 14,
                    borderColor: C.deepRed,
                    borderStyle: 'solid',
                    borderWidth: pos.includes('t') ? '2px 0 0' : '0 0 2px',
                    ...(pos.includes('l') ? { left: -4, borderLeftWidth: 2, borderRightWidth: 0 } : { right: -4, borderRightWidth: 2, borderLeftWidth: 0 }),
                    ...(pos.includes('t') ? { top: -4 } : { bottom: -4 }),
                  }} />
                ))}
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  style={{
                    width: 180, height: 180, objectFit: 'cover',
                    border: `2px solid ${C.border}`,
                    filter: 'sepia(20%) saturate(0.8) contrast(1.05)',
                    display: 'block',
                  }}
                />
              </div>
            )}

            {/* Info items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {location && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: C.warmBrown }}>
                  <MapPin size={12} />
                  <span>{location}</span>
                </div>
              )}
              {email && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: C.warmBrown }}>
                  <Mail size={12} />
                  <a href={`mailto:${email}`} style={{ color: C.warmBrown, textDecoration: 'none' }}>{email}</a>
                </div>
              )}
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              {data.socials?.github   && <a href={data.socials.github}   className="tks-social" target="_blank" rel="noreferrer" aria-label="GitHub"><Github   size={14} /></a>}
              {data.socials?.linkedin && <a href={data.socials.linkedin} className="tks-social" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={14} /></a>}
              {data.socials?.twitter  && <a href={data.socials.twitter}  className="tks-social" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter  size={14} /></a>}
              {email                  && <a href={`mailto:${email}`}     className="tks-social" aria-label="Email"><Mail     size={14} /></a>}
            </div>
          </motion.div>

          {/* Right: bio text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {/* Manuscript-style "My journey began..." opener */}
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              color: C.deepRed,
              letterSpacing: 3,
              marginBottom: 14,
              textTransform: 'uppercase',
            }}>
              &mdash; Personal Account &mdash;
            </div>

            <TypedParagraph
              text={data.personal.bio}
              speed={12}
              style={{ marginBottom: 24 }}
            />

            {/* Tagline blockquote */}
            {data.personal.tagline && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                style={{
                  borderLeft: `3px solid ${C.deepRed}`,
                  paddingLeft: 16,
                  marginBottom: 28,
                  background: `${C.deepRed}06`,
                  padding: '12px 16px',
                }}
              >
                <p style={{ fontSize: 14, fontStyle: 'italic', color: C.deepRed, margin: 0 }}>
                  &ldquo;{data.personal.tagline}&rdquo;
                </p>
              </motion.div>
            )}

            {/* Editorial correction mark */}
            <div style={{ marginBottom: 20, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: C.deepRed, opacity: 0.5 }}>
              [stet] &mdash; approved for publication
            </div>

            {/* CTA */}
            {resumeUrl && resumeUrl !== '#contact' && (
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="tks-btn tks-btn-primary">
                <FileText size={13} />
                <span>&gt; Download CV</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .tks-about-grid-resp { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
