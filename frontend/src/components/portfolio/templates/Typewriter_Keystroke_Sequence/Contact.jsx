import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewportTypewriter, C } from './hooks';
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle } from 'lucide-react';

function TypedLine({ text, speed = 22 }) {
  const { ref, displayed, done } = useViewportTypewriter(text, speed);
  return (
    <span ref={ref}>
      {displayed}
      {!done && <span className="tks-cursor-thin" />}
    </span>
  );
}

export default function Contact({ data }) {
  const email  = data.socials?.email  || data.personal?.email  || '';
  const github = data.socials?.github  || '';
  const linkedin = data.socials?.linkedin || '';
  const twitter  = data.socials?.twitter  || '';

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | done

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('done'), 1600);
  };

  const contactLinks = [
    email    && { icon: <Mail size={14} />,     label: 'Email',    href: `mailto:${email}`,    display: email },
    github   && { icon: <Github size={14} />,   label: 'GitHub',   href: github,               display: 'github.com' },
    linkedin && { icon: <Linkedin size={14} />, label: 'LinkedIn', href: linkedin,             display: 'linkedin.com' },
    twitter  && { icon: <Twitter size={14} />,  label: 'Twitter',  href: twitter,              display: 'twitter.com' },
  ].filter(Boolean);

  return (
    <section id="contact" style={{ background: C.paperWhite, position: 'relative' }}>
      <div className="tks-page">
        {/* THE END stamp */}
        <motion.div
          initial={{ opacity: 0, scale: 1.3, rotate: -4 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 48,
            right: 72,
            textAlign: 'center',
            border: `4px solid ${C.deepRed}30`,
            borderRadius: 4,
            padding: '6px 14px',
            color: `${C.deepRed}30`,
            fontFamily: "'Special Elite', cursive",
            fontSize: 22,
            letterSpacing: 4,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          THE END
        </motion.div>

        {/* Chapter header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="tks-chapter-num">Final Chapter</div>
          <h2 className="tks-section-title">Let's Write Together</h2>
          <div className="tks-section-subtitle">
            The last page is blank — let's fill it together
          </div>
        </motion.div>

        {/* Final typed message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10,
            color: C.border,
            letterSpacing: 2,
            marginBottom: 40,
          }}
        >
          &gt; compose_message.txt
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 56,
          alignItems: 'start',
        }} className="tks-contact-grid-resp">

          {/* Left: contact info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p style={{ fontSize: 14, lineHeight: 1.85, color: C.inkGray, marginBottom: 28, fontStyle: 'italic' }}>
              <TypedLine
                text="Like a letter sealed and sent — reach out and I shall reply before the ink dries on the page."
                speed={20}
              />
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {contactLinks.map((link, i) => (
                <motion.a
                  key={i}
                  href={link.href}
                  target={link.label !== 'Email' ? '_blank' : undefined}
                  rel={link.label !== 'Email' ? 'noreferrer' : undefined}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textDecoration: 'none',
                    color: C.black,
                    fontSize: 13,
                    padding: '10px 14px',
                    border: `1px solid ${C.border}`,
                    background: C.paperWhite,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.deepRed; e.currentTarget.style.color = C.deepRed; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.black; }}
                >
                  <div style={{
                    width: 36, height: 36,
                    border: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: C.vintageCream,
                    flexShrink: 0,
                  }}>
                    {link.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: C.warmBrown, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'IBM Plex Mono',monospace", marginBottom: 1 }}>
                      {link.label}
                    </div>
                    <div>{link.display}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right: contact form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {/* Form paper */}
            <div style={{
              background: C.paperWhite,
              border: `1px solid ${C.border}`,
              padding: '28px 28px 24px',
              boxShadow: `3px 3px 0 ${C.border}60`,
              position: 'relative',
            }}>
              {/* Form header */}
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: C.warmBrown,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 20,
                borderBottom: `1px dashed ${C.border}`,
                paddingBottom: 12,
              }}>
                [ Compose Message ]
              </div>

              <AnimatePresence mode="wait">
                {status === 'done' ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: C.deepRed,
                    }}
                  >
                    <CheckCircle size={32} style={{ marginBottom: 12, opacity: 0.7 }} />
                    <div style={{ fontFamily: "'Special Elite', cursive", fontSize: 18, marginBottom: 8 }}>
                      Message Sent!
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 2, color: C.warmBrown }}>
                      &gt; message_delivered.txt ✓
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
                  >
                    <div>
                      <label style={{ fontSize: 10, color: C.warmBrown, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'IBM Plex Mono',monospace", display: 'block', marginBottom: 4 }}>
                        Your Name
                      </label>
                      <input
                        className="tks-input"
                        placeholder="John Smith_"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                        aria-label="Your name"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: C.warmBrown, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'IBM Plex Mono',monospace", display: 'block', marginBottom: 4 }}>
                        Your Email
                      </label>
                      <input
                        className="tks-input"
                        type="email"
                        placeholder="john@example.com_"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                        aria-label="Your email"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: C.warmBrown, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'IBM Plex Mono',monospace", display: 'block', marginBottom: 4 }}>
                        Your Message
                      </label>
                      <textarea
                        className="tks-input"
                        placeholder="Dear friend, I wanted to reach out because_"
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        required
                        style={{ resize: 'vertical' }}
                        aria-label="Your message"
                      />
                    </div>

                    <button
                      type="submit"
                      className="tks-btn tks-btn-primary"
                      disabled={status === 'sending'}
                      style={{ justifyContent: 'center' }}
                      aria-label="Send message"
                    >
                      <Send size={12} />
                      <span>
                        {status === 'sending' ? '> sending...' : '[ SEND MESSAGE ]'}
                      </span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .tks-contact-grid-resp { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
