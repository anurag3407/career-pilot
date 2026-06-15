import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Youtube, Zap } from 'lucide-react';

const S = {
  bg: '#0a0a0a',
  red: '#e11d48',
  white: '#f8fafc',
  muted: '#94a3b8',
  card: '#111111',
  border: '#1e1e1e',
  gold: '#f59e0b',
};

const CONTACT_INFO = [
  { icon: <Mail size={16} />, label: 'Email', value: 'marcus@athletemail.com' },
  { icon: <Phone size={16} />, label: 'Phone', value: '+1 (312) 555-0198' },
  { icon: <MapPin size={16} />, label: 'Location', value: 'Chicago, IL, USA' },
];

/* Fix: added href fields to each social so buttons can open links */
const SOCIALS = [
  { icon: <Instagram size={18} />, label: '@marcus.stone', platform: 'Instagram', href: 'https://instagram.com' },
  { icon: <Twitter size={18} />, label: '@marcusstone_23', platform: 'Twitter / X', href: 'https://twitter.com' },
  { icon: <Youtube size={18} />, label: 'Marcus Stone Official', platform: 'YouTube', href: 'https://youtube.com' },
];

function InputField({ label, type = 'text', placeholder, multiline = false }) {
  const [focused, setFocused] = useState(false);

  const baseStyle = {
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: `1px solid ${focused ? S.red : S.border}`,
    color: S.white, fontSize: '0.88rem', outline: 'none',
    transition: 'border-color 0.25s', fontFamily: "'Inter', sans-serif",
    padding: '0.6rem 0', resize: 'none',
  };

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <label style={{
        display: 'block', fontSize: '0.62rem', fontWeight: 800,
        letterSpacing: '0.2em', color: focused ? S.red : S.muted,
        textTransform: 'uppercase', marginBottom: '0.5rem',
        transition: 'color 0.25s',
      }}>
        {label}
      </label>
      {multiline ? (
        <textarea rows={4} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...baseStyle }} />
      ) : (
        <input type={type} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...baseStyle }} />
      )}
    </div>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [sent, setSent] = useState(false);

  return (
    <section ref={ref} style={{ background: S.bg, padding: '5rem 0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>

        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '3px', height: '24px', background: S.red }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.28em', color: S.red, textTransform: 'uppercase' }}>
            Get in Touch
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${S.border}, transparent)` }} />
        </motion.div>

        <div className="grid lg:grid-cols-2" style={{ gap: '3rem' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}>

            <h2 style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900,
              textTransform: 'uppercase', color: S.white,
              letterSpacing: '-0.02em', lineHeight: 0.95, marginBottom: '1.25rem',
            }}>
              Let's<br /><span style={{ color: S.red }}>Connect</span>
            </h2>

            <p style={{ fontSize: '0.92rem', color: S.muted, lineHeight: 1.8, maxWidth: '400px', marginBottom: '2.5rem' }}>
              Looking for sponsorships, media appearances, speaking engagements, or collaboration?
              Reach out to Marcus directly or contact his management team.
            </p>

            <div style={{ marginBottom: '2.5rem' }}>
              {CONTACT_INFO.map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -14 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', background: S.card,
                    border: `1px solid ${S.border}`, marginBottom: '0.5rem',
                  }}>
                  <div style={{
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: S.red + '12',
                    border: `1px solid ${S.red}30`, color: S.red, flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.15rem' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: S.white }}>{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div>
              <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.22em', color: S.muted, textTransform: 'uppercase', marginBottom: '1rem' }}>
                Follow the Journey
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Fix: render as <a> elements with href */}
                {SOCIALS.map((soc, i) => (
                  <motion.a key={i}
                    href={soc.href} target="_blank" rel="noreferrer"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.07 }}
                    whileHover={{ x: 6 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 1rem', background: 'none',
                      border: `1px solid ${S.border}`, textDecoration: 'none',
                      color: S.muted, transition: 'border-color 0.2s',
                    }}>
                    <span style={{ color: S.red }}>{soc.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: S.white }}>{soc.label}</div>
                      <div style={{ fontSize: '0.6rem', color: S.muted, marginTop: '0.1rem' }}>{soc.platform}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            style={{ padding: '2.5rem', background: S.card, border: `1px solid ${S.border}`, position: 'relative', overflow: 'hidden' }}>

            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
              background: 'repeating-linear-gradient(105deg, transparent, transparent 24px, rgba(225,29,72,0.8) 25px, transparent 26px)',
            }} />

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', paddingTop: '3rem', position: 'relative', zIndex: 1 }}>
                <Zap size={40} color={S.gold} fill={S.gold} style={{ margin: '0 auto 1.25rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: S.white, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Message Received!
                </h3>
                <p style={{ fontSize: '0.85rem', color: S.muted, lineHeight: 1.7 }}>
                  Marcus's team will get back to you within 48 hours. Stay fired up!
                </p>
              </motion.div>
            ) : (
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.22em', color: S.red, textTransform: 'uppercase', marginBottom: '2rem' }}>
                  Send a Message
                </p>
                <InputField label="Full Name" placeholder="Your full name" />
                <InputField label="Email Address" type="email" placeholder="you@example.com" />
                <InputField label="Subject" placeholder="Sponsorship / Appearance / Other" />
                <InputField label="Message" placeholder="Tell us what you're looking for..." multiline />

                <motion.button
                  onClick={() => setSent(true)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    width: '100%', padding: '1rem',
                    background: S.red, color: 'white', border: 'none', cursor: 'pointer',
                    fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
                    clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                  }}>
                  <Send size={15} />
                  Send Message
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
