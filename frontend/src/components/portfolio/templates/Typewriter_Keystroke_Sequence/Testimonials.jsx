import React from 'react';
import { motion } from 'framer-motion';
import { C } from './hooks';
import { Mail } from 'lucide-react';

function LetterCard({ testimonial, index }) {
  return (
    <motion.div
      className="tks-letter"
      initial={{ opacity: 0, y: 20, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? 0.3 : -0.4 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ rotate: 0, scale: 1.01, transition: { duration: 0.2 } }}
    >
      {/* Letter date / recipient line */}
      <div className="tks-letter-header">
        <Mail size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
        Dear {testimonial.recipientName || 'Fellow Developer'},
      </div>

      {/* Letter body */}
      <p className="tks-letter-body">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Signature */}
      <div className="tks-letter-sig">
        {testimonial.avatar && (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            style={{
              width: 40, height: 40,
              objectFit: 'cover',
              border: `1px solid ${C.border}`,
              filter: 'sepia(20%)',
            }}
          />
        )}
        <div>
          <div style={{ fontSize: 14 }}>{testimonial.name}</div>
          <div style={{
            fontSize: 11,
            color: C.warmBrown,
            fontFamily: "'IBM Plex Mono', monospace",
            fontStyle: 'normal',
          }}>
            {testimonial.role}
          </div>
        </div>
      </div>

      {/* Ink stamp */}
      <motion.div
        initial={{ opacity: 0, scale: 1.5, rotate: -8 }}
        whileInView={{ opacity: 0.15, scale: 1, rotate: -6 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
        style={{
          position: 'absolute',
          top: 16, right: 16,
          width: 48, height: 48,
          borderRadius: '50%',
          border: `3px solid ${C.deepRed}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{
          fontSize: 8,
          color: C.deepRed,
          textAlign: 'center',
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: 1,
          lineHeight: 1.3,
        }}>
          VERIFIED<br/>✓
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function Testimonials({ testimonials }) {
  return (
    <section id="testimonials" style={{ background: C.vintageCream, position: 'relative' }}>
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
          <div className="tks-chapter-num">Letters of Recommendation</div>
          <h2 className="tks-section-title">What They Wrote</h2>
          <div className="tks-section-subtitle">
            Correspondence received from colleagues &amp; collaborators
          </div>
        </motion.div>

        {/* Typewriter label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: C.border,
            letterSpacing: 2,
            marginBottom: 36,
          }}
        >
          &gt; correspondence_archive — {testimonials.length} letters found
        </motion.div>

        {/* Letters grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 28,
        }}>
          {testimonials.map((t, i) => (
            <LetterCard key={i} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
