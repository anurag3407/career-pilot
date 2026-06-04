import React, { useState, useRef } from 'react';
import data from '../../../../data/dummy_data.json';

/* ─── Windows 98 Design Tokens ─── */
const W = {
  desktop: '#008080',
  silver: '#C0C0C0',
  darkGray: '#808080',
  lightGray: '#DFDFDF',
  white: '#FFFFFF',
  black: '#000000',
  navy: '#000080',
  titleActive: 'linear-gradient(90deg, #000080, #1084d0)',
  green: '#008000',
  red: '#cc0000',
};

const raised = {
  borderTop: '2px solid #FFFFFF',
  borderLeft: '2px solid #FFFFFF',
  borderBottom: '2px solid #000000',
  borderRight: '2px solid #000000',
};

const sunken = {
  borderTop: '2px solid #000000',
  borderLeft: '2px solid #000000',
  borderBottom: '2px solid #FFFFFF',
  borderRight: '2px solid #FFFFFF',
};

const outerRaised = {
  borderTop: '1px solid #FFFFFF',
  borderLeft: '1px solid #FFFFFF',
  borderBottom: '1px solid #808080',
  borderRight: '1px solid #808080',
  boxShadow: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #808080',
};

/* ─── Injected CSS ─── */
const STYLES = `
  @keyframes w98Blink {
    0%, 49% { border-right-color: #000; }
    50%, 100% { border-right-color: transparent; }
  }

  .w98-contact-input {
    width: 100%;
    box-sizing: border-box;
    border-top: 2px solid #000;
    border-left: 2px solid #000;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
    background: #fff;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 11px;
    padding: 3px 5px;
    color: #000;
    outline: none;
  }

  .w98-contact-input:focus {
    border-top: 2px solid #000080;
    border-left: 2px solid #000080;
  }

  .w98-contact-textarea {
    width: 100%;
    box-sizing: border-box;
    border-top: 2px solid #000;
    border-left: 2px solid #000;
    border-bottom: 2px solid #fff;
    border-right: 2px solid #fff;
    background: #fff;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 11px;
    padding: 3px 5px;
    color: #000;
    outline: none;
    resize: vertical;
    min-height: 80px;
  }

  .w98-contact-textarea:focus {
    border-top: 2px solid #000080;
    border-left: 2px solid #000080;
  }

  .w98-contact-btn {
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
    background: #C0C0C0;
    cursor: pointer;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 11px;
    padding: 4px 16px;
    min-width: 75px;
    color: #000;
  }

  .w98-contact-btn:active {
    border-top: 2px solid #000 !important;
    border-left: 2px solid #000 !important;
    border-bottom: 2px solid #fff !important;
    border-right: 2px solid #fff !important;
    padding-top: 5px !important;
    padding-left: 17px !important;
  }

  .w98-contact-btn:disabled {
    color: #808080;
    cursor: default;
  }

  .w98-contact-link {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 8px;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 11px;
    color: #000;
    text-decoration: none;
    border-bottom: 1px dotted #C0C0C0;
  }

  .w98-contact-link:hover {
    background: #000080;
    color: #fff;
  }

  .w98-scrollbar::-webkit-scrollbar { width: 16px; }
  .w98-scrollbar::-webkit-scrollbar-track { background: #C0C0C0; border: 1px solid #808080; }
  .w98-scrollbar::-webkit-scrollbar-thumb {
    background: #C0C0C0;
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
  }
`;

const REQUIRED = ['name', 'email', 'subject', 'message'];

function validate(fields) {
  const errors = {};
  if (!fields.name.trim()) errors.name = 'Name is required.';
  if (!fields.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email address.';
  if (!fields.subject.trim()) errors.subject = 'Subject is required.';
  if (!fields.message.trim()) errors.message = 'Message is required.';
  else if (fields.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
  return errors;
}

/* ─── Success dialog ─── */
function SuccessDialog({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: W.silver, ...outerRaised, width: 'min(320px, calc(100vw - 32px))' }}>
        <div style={{ background: W.titleActive, padding: '3px 4px', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}>
          <span style={{ fontSize: '14px' }}>📧</span>
          <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', flex: 1 }}>
            Outlook Express
          </span>
        </div>
        <div style={{ padding: '16px 16px 8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '36px', flexShrink: 0 }}>✅</span>
          <div>
            <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', color: '#000', marginBottom: '6px' }}>
              Message Sent Successfully!
            </div>
            <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000', lineHeight: '1.5' }}>
              Your message has been added to the Outbox and will be sent on the next mail check.
              <br /><br />
              Thank you for reaching out! Expect a reply within 24 hours.
            </div>
          </div>
        </div>
        <div style={{ padding: '4px 12px 10px', display: 'flex', justifyContent: 'center' }}>
          <button className="w98-contact-btn" onClick={onClose} style={{ outline: '1px solid #000', outlineOffset: '1px' }}>OK</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Contact component ─── */
export default function Contact() {
  const { personal, socials } = data;

  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const nameRef = useRef(null);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setFields(f => ({ ...f, [field]: val }));
    if (touched[field]) {
      const errs = validate({ ...fields, [field]: val });
      setErrors(ev => ({ ...ev, [field]: errs[field] }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched(t => ({ ...t, [field]: true }));
    const errs = validate(fields);
    setErrors(ev => ({ ...ev, [field]: errs[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(REQUIRED.map(f => [f, true]));
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  const handleReset = () => {
    setFields({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setTouched({});
    setSent(false);
    setTimeout(() => nameRef.current?.focus(), 100);
  };

  return (
    <section
      id="contact"
      style={{
        background: W.desktop,
        padding: '40px 16px 60px',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <style>{STYLES}</style>

      {sent && <SuccessDialog onClose={() => { setSent(false); handleReset(); }} />}

      {/* Desktop label */}
      <div style={{ position: 'absolute', top: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '24px' }}>📧</span>
        <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}>
          Contact Me
        </span>
      </div>

      <div style={{ width: 'min(720px, calc(100vw - 32px))', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '48px' }}>

        {/* Outlook Express New Message window */}
        <div style={{ background: W.silver, ...outerRaised, display: 'flex', flexDirection: 'column' }}>
          {/* Title bar */}
          <div style={{ background: W.titleActive, padding: '3px 4px', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}>
            <span style={{ fontSize: '14px' }}>📧</span>
            <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', flex: 1 }}>
              New Message — Outlook Express
            </span>
            {['_', '□', '✕'].map((ch, i) => (
              <div key={i} style={{ ...raised, width: '16px', height: '14px', background: W.silver, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', cursor: 'default', color: '#000' }}>
                {ch}
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '3px 4px', borderBottom: `1px solid ${W.darkGray}`, flexWrap: 'wrap' }}>
            {[
              { icon: '📤', label: 'Send', primary: true },
              { icon: '✂️', label: 'Cut' },
              { icon: '📋', label: 'Copy' },
              { icon: '📌', label: 'Paste' },
              { icon: '↩️', label: 'Undo' },
              { icon: '🔍', label: 'Check' },
            ].map(({ icon, label, primary }) => (
              <button
                key={label}
                onClick={primary ? handleSubmit : undefined}
                style={{
                  ...raised,
                  background: W.silver,
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  color: '#000',
                  border: primary ? `2px solid ${W.navy}` : undefined,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d4d4d4'; }}
                onMouseLeave={e => { e.currentTarget.style.background = W.silver; }}
              >
                <span style={{ fontSize: '14px' }}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Email header fields */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ padding: '4px 8px', borderBottom: `1px solid ${W.darkGray}` }}>
              {/* From (readonly) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 0', borderBottom: `1px dotted ${W.lightGray}` }}>
                <span style={{ width: '60px', flexShrink: 0, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', color: '#000' }}>From:</span>
                <div style={{ flex: 1, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: W.darkGray }}>
                  {fields.name || 'Your Name'} &lt;{fields.email || 'your@email.com'}&gt;
                </div>
              </div>
              {/* To */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 0', borderBottom: `1px dotted ${W.lightGray}` }}>
                <span style={{ width: '60px', flexShrink: 0, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', color: '#000' }}>To:</span>
                <div style={{ flex: 1, ...sunken, padding: '2px 4px', background: '#f0f0f0' }}>
                  <span style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000' }}>
                    {personal.name} &lt;{socials.email}&gt;
                  </span>
                </div>
              </div>
              {/* Subject */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 0' }}>
                <span style={{ width: '60px', flexShrink: 0, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', color: '#000' }}>Subject:</span>
                <div style={{ flex: 1 }}>
                  <input
                    className="w98-contact-input"
                    type="text"
                    placeholder="Enter subject..."
                    value={fields.subject}
                    onChange={handleChange('subject')}
                    onBlur={handleBlur('subject')}
                    aria-label="Subject"
                  />
                  {errors.subject && touched.subject && (
                    <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '10px', color: W.red, marginTop: '2px' }}>
                      ⚠ {errors.subject}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Name + Email row */}
            <div style={{ padding: '6px 8px', borderBottom: `1px solid ${W.darkGray}`, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <label style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', color: '#000', display: 'block', marginBottom: '3px' }}>
                  Your Name *
                </label>
                <input
                  ref={nameRef}
                  className="w98-contact-input"
                  type="text"
                  placeholder="Jane Smith"
                  value={fields.name}
                  onChange={handleChange('name')}
                  onBlur={handleBlur('name')}
                  aria-label="Your name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                />
                {errors.name && touched.name && (
                  <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '10px', color: W.red, marginTop: '2px' }}>⚠ {errors.name}</div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: '160px' }}>
                <label style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', color: '#000', display: 'block', marginBottom: '3px' }}>
                  Your Email *
                </label>
                <input
                  className="w98-contact-input"
                  type="email"
                  placeholder="jane@example.com"
                  value={fields.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  aria-label="Your email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                />
                {errors.email && touched.email && (
                  <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '10px', color: W.red, marginTop: '2px' }}>⚠ {errors.email}</div>
                )}
              </div>
            </div>

            {/* Message body */}
            <div style={{ padding: '0 8px 4px' }}>
              <textarea
                className="w98-contact-textarea"
                placeholder="Write your message here..."
                value={fields.message}
                onChange={handleChange('message')}
                onBlur={handleBlur('message')}
                rows={6}
                aria-label="Message"
                aria-required="true"
                aria-invalid={!!errors.message}
              />
              {errors.message && touched.message && (
                <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '10px', color: W.red, marginTop: '2px' }}>⚠ {errors.message}</div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ padding: '4px 8px 8px', display: 'flex', gap: '6px', borderTop: `1px solid ${W.darkGray}`, flexWrap: 'wrap' }}>
              <button
                type="submit"
                className="w98-contact-btn"
                disabled={sending}
                style={{ outline: '1px solid #000', outlineOffset: '1px', opacity: sending ? 0.7 : 1 }}
              >
                {sending ? '📤 Sending...' : '📤 Send'}
              </button>
              <button type="button" className="w98-contact-btn" onClick={handleReset}>
                🗑️ Clear
              </button>
              <button
                type="button"
                className="w98-contact-btn"
                onClick={() => window.open(`mailto:${socials.email}?subject=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(fields.message)}`)}
              >
                📩 Open in Mail
              </button>
            </div>
          </form>

          {/* Status bar */}
          <div style={{ borderTop: `1px solid ${W.darkGray}`, padding: '2px 6px', display: 'flex', gap: '4px', background: W.silver }}>
            {[
              sending ? '📤 Sending message...' : Object.keys(errors).length > 0 ? `⚠ ${Object.keys(errors).length} field(s) need attention` : 'Compose your message',
              `To: ${personal.name}`,
            ].map((t, i) => (
              <div key={i} style={{ ...sunken, padding: '1px 6px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', flex: i === 0 ? 2 : 1, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Contact info / Address Book window */}
        <div style={{ background: W.silver, ...outerRaised }}>
          <div style={{ background: W.titleActive, padding: '3px 4px', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}>
            <span style={{ fontSize: '14px' }}>📒</span>
            <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', flex: 1 }}>
              Address Book — {personal.name}
            </span>
            {['_', '□', '✕'].map((ch, i) => (
              <div key={i} style={{ ...raised, width: '16px', height: '14px', background: W.silver, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', cursor: 'default', color: '#000' }}>
                {ch}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
            {[
              { icon: '📧', label: 'Email', value: socials.email, action: () => window.open(`mailto:${socials.email}`) },
              { icon: '🐙', label: 'GitHub', value: 'github.com', action: () => window.open(socials.github, '_blank') },
              { icon: '💼', label: 'LinkedIn', value: 'linkedin.com', action: () => window.open(socials.linkedin, '_blank') },
              { icon: '🐦', label: 'Twitter', value: 'twitter.com', action: () => window.open(socials.twitter, '_blank') },
              { icon: '📍', label: 'Location', value: personal.location, action: null },
              { icon: '🟢', label: 'Status', value: 'Available for hire', action: null },
            ].map(({ icon, label, value, action }) => (
              <div
                key={label}
                className={action ? 'w98-contact-link' : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                  fontSize: '11px',
                  borderBottom: `1px dotted ${W.lightGray}`,
                  cursor: action ? 'pointer' : 'default',
                  flex: '1 0 calc(50% - 1px)',
                  minWidth: '180px',
                  color: '#000',
                }}
                onClick={action || undefined}
                onMouseEnter={e => { if (action) { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; } }}
                onMouseLeave={e => { if (action) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; } }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>
                <span style={{ fontWeight: 'bold', width: '60px', flexShrink: 0 }}>{label}:</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                {action && <span style={{ marginLeft: 'auto', opacity: 0.5, fontSize: '10px' }}>↗</span>}
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${W.darkGray}`, padding: '2px 6px', display: 'flex', gap: '4px', background: W.silver }}>
            <div style={{ ...sunken, padding: '1px 6px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', flex: 1, color: '#000' }}>
              6 contact entries — Click any link to open
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
