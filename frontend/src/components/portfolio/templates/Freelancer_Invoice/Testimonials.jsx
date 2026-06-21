import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials({ data }) {
  const { testimonials } = data;
  const [active, setActive] = useState(0);

  const prev = () => setActive(a => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive(a => (a + 1) % testimonials.length);

  return (
    <section id="testimonials" style={{ padding: '96px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="fi-section-tag">
            <Star size={12} />
            TESTIMONIALS
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', marginBottom: 12 }}>
            What Clients <span className="fi-gradient-text">Say</span>
          </h2>
          <p style={{ fontSize: 17, color: '#64748B', maxWidth: 480, margin: '0 auto' }}>
            Don't take my word for it — hear from the people I've worked with.
          </p>
        </motion.div>

        {/* All Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
          {(testimonials || []).map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="fi-card"
              style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
            >
              {/* Quote Icon */}
              <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.08 }}>
                <Quote size={48} color="#2563EB" />
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                {[...Array(5)].map((_, si) => (
                  <Star key={si} size={14} color="#F59E0B" fill="#F59E0B" />
                ))}
              </div>

              {/* Quote Text */}
              <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, marginBottom: 20, fontStyle: 'italic' }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={t.avatar}
                  alt={t.name || "Profile Avatar"}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #DBEAFE', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{t.role}</div>
                </div>
              </div>

              {/* Bottom Accent */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #1E40AF, #2563EB, transparent)' }} />
            </motion.div>
          ))}
        </div>

        {/* Featured Spotlight Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: 20, padding: '40px 48px', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* BG Decoration */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ flexGrow: 1, minWidth: 260 }}>
              <div style={{ fontSize: 40, color: '#2563EB', marginBottom: 8, lineHeight: 1 }}>"</div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: 18, color: '#E2E8F0', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}
                >
                  {testimonials?.[active]?.text}
                </motion.p>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`author-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <img
                    src={testimonials?.[active]?.avatar}
                    alt={testimonials?.[active]?.name}
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563EB' }}
                  />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{testimonials?.[active]?.name}</div>
                    <div style={{ fontSize: 13, color: '#94A3B8' }}>{testimonials?.[active]?.role}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <button onClick={prev} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(37,99,235,0.5)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <ChevronLeft size={18} />
              </button>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                {active + 1}/{testimonials?.length}
              </div>
              <button onClick={next} style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(37,99,235,0.5)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, position: 'relative', zIndex: 1 }}>
            {(testimonials || []).map((_, di) => (
              <button
                key={di}
                onClick={() => setActive(di)}
                style={{ width: di === active ? 20 : 8, height: 8, borderRadius: 4, background: di === active ? '#2563EB' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
