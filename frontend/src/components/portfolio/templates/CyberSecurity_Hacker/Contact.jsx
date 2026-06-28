import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, Terminal, Send, User, MessageSquare, Shield, Wifi, Lock } from 'lucide-react';

const BOOT_LINES = [
  '> Initializing secure contact protocol...',
  '> Establishing encrypted channel...',
  '> Identity verification: BYPASSED',
  '> Connection established. Proceed.',
];

function useTypewriter(text, speed = 35, start = true) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!start) return;
    setDisplayed('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return displayed;
}

function BootSequence({ onDone }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);
  const current = useTypewriter(BOOT_LINES[lineIndex] ?? '', 30, true);

  useEffect(() => {
    if (current === BOOT_LINES[lineIndex]) {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, BOOT_LINES[lineIndex]]);
        if (lineIndex + 1 < BOOT_LINES.length) {
          setLineIndex(i => i + 1);
        } else {
          setDone(true);
          setTimeout(onDone, 600);
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [current, lineIndex, onDone]);

  return (
    <div className="font-mono text-sm space-y-1 p-4" style={{ color: '#00ff41' }}>
      {lines.map((l, i) => (
        <p key={i} style={{ color: '#00cc33' }}>{l} <span style={{ color: '#00ff41' }}>✓</span></p>
      ))}
      {!done && <p style={{ color: '#00ff41' }}>{current}<span style={{ animation: 'blink 1s infinite' }}>█</span></p>}
    </div>
  );
}

function GlitchText({ text }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      style={glitch
        ? { textShadow: '3px 0 #ff0040, -3px 0 #00ffff, 0 0 20px #00ff41', transform: 'skewX(-2deg)', display: 'inline-block', transition: 'none' }
        : { textShadow: '0 0 20px #00ff41, 0 0 40px #00ff4166', display: 'inline-block' }
      }
    >
      {text}
    </span>
  );
}

export default function Contact() {
  const [booted, setBooted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [log, setLog] = useState([]);
  const logRef = useRef(null);

  const addLog = (msg) => setLog(prev => [...prev, msg]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addLog('[ERR] Missing required fields. Aborting transmission.');
      return;
    }
    setStatus('sending');
    addLog('[SYS] Encrypting payload...');
    await new Promise(r => setTimeout(r, 600));
    addLog('[SYS] Routing through secure nodes...');
    await new Promise(r => setTimeout(r, 700));
    addLog('[SYS] Transmitting packet to target...');
    await new Promise(r => setTimeout(r, 800));
    addLog('[OK]  Message delivered. Channel closing.');
    setStatus('sent');
  };

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: '#', handle: '/your-handle' },
    { icon: Linkedin, label: 'LinkedIn', href: '#', handle: '/in/your-profile' },
    { icon: Mail, label: 'Email', href: 'mailto:you@example.com', handle: 'you@example.com' },
  ];

  const stats = [
    { icon: Shield, label: 'Encryption', value: 'AES-256' },
    { icon: Wifi, label: 'Protocol', value: 'TLS 1.3' },
    { icon: Lock, label: 'Status', value: 'SECURE' },
  ];

  return (
    <section style={{ background: '#000000', fontFamily: "'Courier New', monospace", minHeight: '100vh', padding: '4rem 1rem', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanline { 0%{top:0%} 100%{top:100%} }
        @keyframes pulse-border { 0%,100%{box-shadow:0 0 0 0 #00ff4133} 50%{box-shadow:0 0 0 4px #00ff4111} }
        .hack-input { background:#000!important; border:1px solid #00ff4133!important; color:#00ff41!important; font-family:'Courier New',monospace!important; width:100%; padding:8px 12px; border-radius:4px; font-size:13px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
        .hack-input:focus { border-color:#00ff41!important; box-shadow:0 0 0 1px #00ff4144, 0 0 12px #00ff4122!important; }
        .hack-input::placeholder { color:#00ff4133!important; }
        .send-btn:hover { box-shadow:0 0 24px #00ff4155!important; background:#00ff4115!important; }
        .social-row:hover .soc-bracket { color:#00ff41!important; }
        .social-row:hover .soc-icon-wrap { border-color:#00ff41!important; box-shadow:0 0 8px #00ff4144!important; }
        .scan-line { position:absolute;left:0;right:0;height:1px;background:#00ff41;opacity:0.08;animation:scanline 6s linear infinite;pointer-events:none; }
      `}</style>

      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(#00ff4108 1px, transparent 1px), linear-gradient(90deg, #00ff4108 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderTop: '2px solid #00ff4166', borderLeft: '2px solid #00ff4166', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderTop: '2px solid #00ff4166', borderRight: '2px solid #00ff4166', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, width: 40, height: 40, borderBottom: '2px solid #00ff4166', borderLeft: '2px solid #00ff4166', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 16, right: 16, width: 40, height: 40, borderBottom: '2px solid #00ff4166', borderRight: '2px solid #00ff4166', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#00ff41', border: '1px solid #00ff4133', padding: '3px 14px', borderRadius: 999, marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff41', display: 'inline-block', boxShadow: '0 0 6px #00ff41', animation: 'blink 2s infinite' }} />
            SECURE COMMS TERMINAL v2.1.0
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: '#00ff41', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
            <GlitchText text="./contact" />
          </h2>
          <p style={{ color: '#00ff4166', fontSize: 12, letterSpacing: '0.2em' }}>
            {'>'} ESTABLISH_CONNECTION --target=operator --encrypt=true
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: '2rem' }}>
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ border: '1px solid #00ff4122', background: '#000', borderRadius: 6, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, animation: 'pulse-border 3s infinite' }}>
              <Icon size={14} color="#00ff41" />
              <div>
                <div style={{ color: '#00ff4155', fontSize: 10, letterSpacing: '0.1em' }}>{label}</div>
                <div style={{ color: '#00ff41', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Terminal */}
            <div style={{ border: '1px solid #00ff4133', borderRadius: 8, background: '#000', overflow: 'hidden', position: 'relative' }}>
              <div className="scan-line" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderBottom: '1px solid #00ff4122', background: '#00ff410a' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, color: '#00ff4155', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Terminal size={10} color="#00ff4155" /> bash — contact_init.sh
                </span>
              </div>
              <div style={{ minHeight: 150 }}>
                {!booted
                  ? <BootSequence onDone={() => setBooted(true)} />
                  : (
                    <div style={{ padding: 16, fontFamily: "'Courier New',monospace", fontSize: 13 }}>
                      {BOOT_LINES.map((l, i) => (
                        <p key={i} style={{ color: '#00cc33', marginBottom: 4 }}>{l} <span style={{ color: '#00ff41' }}>✓</span></p>
                      ))}
                      <p style={{ color: '#00ff41', marginTop: 8 }}>{'>'} Ready. Awaiting operator input.<span style={{ animation: 'blink 1s infinite' }}>█</span></p>
                    </div>
                  )
                }
              </div>
            </div>

            {/* Transmission log */}
            {log.length > 0 && (
              <div style={{ border: '1px solid #00ff4133', borderRadius: 8, background: '#000', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderBottom: '1px solid #00ff4122', background: '#00ff410a' }}>
                  <Terminal size={10} color="#00ff4155" />
                  <span style={{ color: '#00ff4155', fontSize: 11 }}>transmission_log.txt</span>
                </div>
                <div ref={logRef} style={{ padding: 12, maxHeight: 120, overflowY: 'auto' }}>
                  {log.map((l, i) => (
                    <p key={i} style={{ fontFamily: "'Courier New',monospace", fontSize: 12, marginBottom: 2, color: l.startsWith('[ERR]') ? '#ff4444' : l.startsWith('[OK]') ? '#00ff41' : '#00ff4177' }}>
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Social links */}
            <div style={{ border: '1px solid #00ff4133', borderRadius: 8, background: '#000', padding: 16 }}>
              <p style={{ color: '#00ff4155', fontSize: 11, letterSpacing: '0.15em', marginBottom: 14 }}>{'>'} KNOWN_CHANNELS</p>
              {socialLinks.map(({ icon: Icon, label, href, handle }) => (
                <a key={label} href={href} className="social-row" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #00ff410f', textDecoration: 'none' }}>
                  <div className="soc-icon-wrap" style={{ width: 34, height: 34, border: '1px solid #00ff4133', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', transition: 'all 0.2s' }}>
                    <Icon size={15} color="#00ff41" />
                  </div>
                  <div>
                    <div style={{ color: '#00ff41', fontSize: 11, fontWeight: 700, letterSpacing: '0.15em' }}>{label.toUpperCase()}</div>
                    <div style={{ color: '#00ff4155', fontSize: 11 }}>{handle}</div>
                  </div>
                  <span className="soc-bracket" style={{ marginLeft: 'auto', color: '#00ff4133', fontSize: 11, transition: 'color 0.2s' }}>{'[connect]'}</span>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div style={{ border: '1px solid #00ff4133', borderRadius: 8, background: '#000', overflow: 'hidden', position: 'relative' }}>
            <div className="scan-line" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderBottom: '1px solid #00ff4122', background: '#00ff410a' }}>
              <Terminal size={10} color="#00ff4155" />
              <span style={{ color: '#00ff4155', fontSize: 11 }}>compose_message.sh</span>
              <span style={{ marginLeft: 'auto', color: '#00ff4133', fontSize: 11 }}>{status === 'sent' ? 'SENT' : 'DRAFT'}</span>
            </div>

            {status === 'sent' ? (
              <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360, textAlign: 'center', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #00ff41', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px #00ff4144', animation: 'blink 2s infinite' }}>
                  <Shield size={28} color="#00ff41" />
                </div>
                <p style={{ color: '#00ff41', fontWeight: 700, letterSpacing: '0.2em', fontSize: 16 }}>TRANSMISSION COMPLETE</p>
                <p style={{ color: '#00ff4166', fontSize: 12, fontFamily: "'Courier New',monospace" }}>Message encrypted and delivered.<br />Operator will respond via secure channel.</p>
                <button type="button"
                  onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }); setLog([]); }}
                  style={{ marginTop: 8, border: '1px solid #00ff4155', color: '#00ff41', background: 'transparent', padding: '8px 20px', borderRadius: 4, cursor: 'pointer', fontFamily: "'Courier New',monospace", fontSize: 12 }}
                >
                  {'>'} new_message()
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ color: '#00ff4155', fontSize: 11, fontFamily: "'Courier New',monospace" }}>{'>'} Fill required fields. All comms are encrypted.</p>

                {[
                  { icon: User, label: 'OPERATOR_ID', key: 'name', type: 'text', placeholder: 'your_name' },
                  { icon: Mail, label: 'RETURN_ADDRESS', key: 'email', type: 'email', placeholder: 'you@domain.com' },
                ].map(({ icon: Icon, label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00ff4188', fontSize: 11, letterSpacing: '0.1em', marginBottom: 6, fontFamily: "'Courier New',monospace" }}>
                      <Icon size={10} color="#00ff4188" /> {label} <span style={{ color: '#ff4444' }}>*</span>
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="hack-input"
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00ff4188', fontSize: 11, letterSpacing: '0.1em', marginBottom: 6, fontFamily: "'Courier New',monospace" }}>
                    <MessageSquare size={10} color="#00ff4188" /> PAYLOAD <span style={{ color: '#ff4444' }}>*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="// Enter your message here..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="hack-input"
                    style={{ resize: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="send-btn"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#000', border: '1px solid #00ff41', color: '#00ff41', fontFamily: "'Courier New',monospace", fontSize: 13, padding: '12px', borderRadius: 4, cursor: 'pointer', transition: 'all 0.2s', opacity: status === 'sending' ? 0.6 : 1, boxShadow: '0 0 10px #00ff4122' }}
                >
                  {status === 'sending' ? (
                    <>
                      <span style={{ width: 12, height: 12, border: '1px solid #00ff41', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      TRANSMITTING...
                    </>
                  ) : (
                    <><Send size={13} /> SEND_MESSAGE --encrypt=true</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, textAlign: 'center', color: '#00ff4133', fontSize: 11, fontFamily: "'Courier New',monospace" }}>
          {'>'} All transmissions are end-to-end encrypted &nbsp;|&nbsp; PGP key available on request
        </div>

      </div>
    </section>
  );
}