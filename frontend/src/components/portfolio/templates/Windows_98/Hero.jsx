import React, { useState, useEffect, useRef } from 'react';
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
  titleInactive: 'linear-gradient(90deg, #7b7b7b, #a0a0a0)',
  btnFace: '#C0C0C0',
  btnHighlight: '#FFFFFF',
  btnShadow: '#808080',
  btnDarkShadow: '#000000',
  textBlue: '#000080',
  selectedBg: '#000080',
  selectedText: '#FFFFFF',
};

/* ─── Raised / Sunken border helpers ─── */
const raised = {
  borderTop: `2px solid ${W.btnHighlight}`,
  borderLeft: `2px solid ${W.btnHighlight}`,
  borderBottom: `2px solid ${W.btnDarkShadow}`,
  borderRight: `2px solid ${W.btnDarkShadow}`,
};

const sunken = {
  borderTop: `2px solid ${W.btnDarkShadow}`,
  borderLeft: `2px solid ${W.btnDarkShadow}`,
  borderBottom: `2px solid ${W.btnHighlight}`,
  borderRight: `2px solid ${W.btnHighlight}`,
};

const outerRaised = {
  borderTop: `1px solid ${W.btnHighlight}`,
  borderLeft: `1px solid ${W.btnHighlight}`,
  borderBottom: `1px solid ${W.btnShadow}`,
  borderRight: `1px solid ${W.btnShadow}`,
  boxShadow: `inset 1px 1px 0 ${W.btnHighlight}, inset -1px -1px 0 ${W.btnShadow}`,
};

/* ─── Keyframes injected once ─── */
const W98_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

  .w98-font {
    font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
    font-size: 11px;
  }

  .w98-title-font {
    font-family: 'MS Sans Serif', 'Tahoma', 'Arial', sans-serif;
    font-size: 12px;
    font-weight: bold;
  }

  .w98-btn:active {
    border-top: 2px solid #000000 !important;
    border-left: 2px solid #000000 !important;
    border-bottom: 2px solid #FFFFFF !important;
    border-right: 2px solid #FFFFFF !important;
    padding-top: 3px !important;
    padding-left: 3px !important;
  }

  @keyframes w98Blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes w98Bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  @keyframes w98TypeCursor {
    0%, 100% { border-right-color: #000; }
    50% { border-right-color: transparent; }
  }

  @keyframes w98WindowOpen {
    from { transform: scale(0.3) translate(-50%, -50%); opacity: 0; }
    to { transform: scale(1) translate(0, 0); opacity: 1; }
  }

  @keyframes w98Scanline {
    0% { background-position: 0 0; }
    100% { background-position: 0 4px; }
  }

  .w98-window-anim {
    animation: w98WindowOpen 0.2s cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
  }

  .w98-cursor-blink {
    animation: w98TypeCursor 0.8s step-end infinite;
    border-right: 2px solid #000;
    padding-right: 2px;
  }

  .w98-taskbar-btn:active {
    border-top: 2px solid #808080 !important;
    border-left: 2px solid #808080 !important;
    border-bottom: 2px solid #FFFFFF !important;
    border-right: 2px solid #FFFFFF !important;
  }

  .w98-start-btn:active {
    border-top: 2px solid #808080 !important;
    border-left: 2px solid #808080 !important;
  }

  .w98-icon:hover .w98-icon-label {
    background: #000080;
    color: #fff;
  }

  .w98-scrollbar::-webkit-scrollbar { width: 16px; }
  .w98-scrollbar::-webkit-scrollbar-track {
    background: #C0C0C0;
    border: 1px solid #808080;
  }
  .w98-scrollbar::-webkit-scrollbar-thumb {
    background: #C0C0C0;
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
  }
`;

/* ─── Window Title Bar ─── */
function TitleBar({ title, icon, active = true, onClose, onMinimize, onMaximize }) {
  return (
    <div style={{
      background: active ? W.titleActive : W.titleInactive,
      padding: '3px 4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      userSelect: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {icon && <span style={{ fontSize: '14px', lineHeight: 1 }}>{icon}</span>}
        <span style={{
          color: W.white,
          fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '0.01em',
        }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '2px' }}>
        {onMinimize && (
          <button
            onClick={onMinimize}
            aria-label="Minimise window"
            className="w98-btn"
            style={{
              ...raised,
              width: '20px', height: '18px',
              background: W.silver,
              cursor: 'pointer',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              padding: '0 0 3px 0',
              fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
              fontSize: '10px',
              lineHeight: 1,
              touchAction: 'manipulation',
            }}
          >
            <span style={{ display: 'block', width: '8px', height: '2px', background: '#000', marginBottom: '1px' }} />
          </button>
        )}
        {onMaximize && (
          <button
            onClick={onMaximize}
            aria-label="Maximise window"
            className="w98-btn"
            style={{
              ...raised,
              width: '20px', height: '18px',
              background: W.silver,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              touchAction: 'manipulation',
            }}
          >
            <span style={{
              display: 'block', width: '9px', height: '8px',
              border: '1px solid #000',
              borderTop: '2px solid #000',
            }} />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close window"
            className="w98-btn"
            style={{
              ...raised,
              width: '20px', height: '18px',
              background: W.silver,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
              fontWeight: 'bold',
              fontSize: '11px',
              color: '#000',
              lineHeight: 1,
              touchAction: 'manipulation',
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Windows 98 Window container ─── */
function Win98Window({ title, icon, active = true, onClose, onMinimize, style, children, className }) {
  return (
    <div
      className={className}
      style={{
        background: W.silver,
        ...outerRaised,
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      <TitleBar title={title} icon={icon} active={active} onClose={onClose} onMinimize={onMinimize} onMaximize={() => {}} />
      {children}
    </div>
  );
}

/* ─── Desktop Icon ─── */
function DesktopIcon({ emoji, label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w98-icon"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
        width: '72px',
        padding: '4px',
      }}
    >
      <span style={{
        fontSize: '32px',
        lineHeight: 1,
        filter: selected ? 'hue-rotate(0deg) saturate(1)' : 'none',
        outline: selected ? '1px dotted #000080' : 'none',
      }}>
        {emoji}
      </span>
      <span
        className="w98-icon-label"
        style={{
          fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
          fontSize: '11px',
          color: W.white,
          textAlign: 'center',
          padding: '1px 2px',
          lineHeight: '1.3',
          background: selected ? '#000080' : 'transparent',
          textShadow: selected ? 'none' : '1px 1px 2px #000',
          maxWidth: '72px',
          wordBreak: 'break-word',
        }}
      >
        {label}
      </span>
    </button>
  );
}

/* ─── W98 Button ─── */
function W98Btn({ children, onClick, primary, style }) {
  return (
    <button
      onClick={onClick}
      className="w98-btn"
      style={{
        ...raised,
        background: W.silver,
        padding: '4px 16px',
        cursor: 'pointer',
        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
        fontSize: '11px',
        color: '#000',
        minWidth: '75px',
        outline: primary ? '1px solid #000' : 'none',
        outlineOffset: '1px',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ─── Typewriter hook ─── */
function useTypewriter(text, speed = 45, delay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let interval;
    setDisplayed('');
    setDone(false);
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
    }, delay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, speed, delay]);

  return { displayed, done };
}

/* ─── Clock component ─── */
function W98Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return (
    <div style={{
      ...sunken,
      padding: '2px 8px',
      fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
      fontSize: '11px',
      color: '#000',
      userSelect: 'none',
      minWidth: '60px',
      textAlign: 'center',
    }}>
      {fmt}
    </div>
  );
}

/* ─── Start Menu ─── */
function StartMenu({ open, onClose }) {
  if (!open) return null;
  const items = [
    { icon: '📁', label: 'My Documents' },
    { icon: '🖥️', label: 'My Computer' },
    { icon: '🌐', label: 'Internet Explorer' },
    { icon: '📧', label: 'Outlook Express' },
    { icon: '🗒️', label: 'Notepad' },
    { icon: '🎨', label: 'Paint' },
    { icon: '⚙️', label: 'Control Panel' },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '32px',
      left: '0',
      zIndex: 1000,
      background: W.silver,
      ...outerRaised,
      width: '180px',
      display: 'flex',
    }}>
      {/* Vertical banner */}
      <div style={{
        width: '24px',
        background: 'linear-gradient(0deg, #000080, #1084d0)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '8px 0',
        flexShrink: 0,
      }}>
        <span style={{
          color: W.white,
          fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
          fontSize: '13px',
          fontWeight: 'bold',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          letterSpacing: '0.05em',
          userSelect: 'none',
        }}>
          Windows <span style={{ fontStyle: 'italic', fontWeight: 300 }}>98</span>
        </span>
      </div>

      {/* Menu items */}
      <div style={{ flex: 1 }}>
        {items.map(({ icon, label }) => (
          <div
            key={label}
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 8px',
              cursor: 'pointer',
              fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
              fontSize: '11px',
              color: '#000',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
          >
            <span style={{ fontSize: '16px' }}>{icon}</span>
            {label}
          </div>
        ))}
        <div style={{ height: '1px', background: W.btnShadow, margin: '4px 0' }} />
        <div
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 8px',
            cursor: 'pointer',
            fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
            fontSize: '11px',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
        >
          <span style={{ fontSize: '16px' }}>🔌</span>
          Shut Down…
        </div>
      </div>
    </div>
  );
}

/* ─── Progress Bar ─── */
function W98Progress({ value, max = 100, color = '#000080' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ ...sunken, height: '14px', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        {Array.from({ length: Math.floor(pct / 4) }).map((_, i) => (
          <div key={i} style={{
            width: '4px', height: '100%',
            background: color,
            marginRight: '1px',
            flexShrink: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Hero ─── */
export default function Hero() {
  const { personal, socials, stats, skills } = data;
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [startOpen, setStartOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [activeWindow, setActiveWindow] = useState('main');
  const [aboutOpen, setAboutOpen] = useState(false);
  const desktopRef = useRef(null);

  const { displayed: typedTitle, done: titleDone } = useTypewriter(personal.title, 40, 1000);

  const topSkills = skills.slice(0, 6);

  useEffect(() => {
    const handler = (e) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target)) {
        setStartOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const desktopIcons = [
    { emoji: '🖥️', label: 'My Portfolio', key: 'portfolio' },
    { emoji: '📁', label: 'Projects', key: 'projects' },
    { emoji: '📧', label: 'Contact Me', key: 'contact' },
    { emoji: '📄', label: 'Resume.pdf', key: 'resume' },
    { emoji: '🌐', label: 'GitHub', key: 'github' },
    { emoji: '💼', label: 'LinkedIn', key: 'linkedin' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <style>{W98_STYLES}</style>

      {/* Desktop */}
      <div
        ref={desktopRef}
        style={{
          background: W.desktop,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(0,0,0,0.15) 0%, transparent 60%)',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) { setStartOpen(false); setSelectedIcon(null); }
        }}
      >
        {/* Desktop icons — left column */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 10,
        }}>
          {desktopIcons.map(({ emoji, label, key }) => (
            <DesktopIcon
              key={key}
              emoji={emoji}
              label={label}
              selected={selectedIcon === key}
              onClick={(e) => { e.stopPropagation(); setSelectedIcon(key); setStartOpen(false); }}
            />
          ))}
        </div>

        {/* Main portfolio window */}
        {!minimized && (
          <div
            className="w98-window-anim"
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(640px, calc(100vw - 110px))',
              zIndex: activeWindow === 'main' ? 20 : 15,
              marginLeft: '30px',
            }}
            onClick={() => setActiveWindow('main')}
          >
            <Win98Window
              title={`${personal.name} - Portfolio`}
              icon="🖥️"
              active={activeWindow === 'main'}
              onClose={() => setMinimized(true)}
              onMinimize={() => setMinimized(true)}
            >
              {/* Menu bar */}
              <div style={{
                display: 'flex',
                gap: '0',
                padding: '2px 4px',
                borderBottom: `1px solid ${W.btnShadow}`,
              }}>
                {['File', 'Edit', 'View', 'Help'].map((m) => (
                  <button
                    key={m}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '2px 6px',
                      cursor: 'pointer',
                      fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                      fontSize: '11px',
                      color: '#000',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#000'; }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Toolbar */}
              <div style={{
                display: 'flex',
                gap: '2px',
                padding: '3px 4px',
                borderBottom: `1px solid ${W.btnShadow}`,
                flexWrap: 'wrap',
              }}>
                {['⬅', '➡', '⬆', '🔍'].map((icon, i) => (
                  <button
                    key={i}
                    className="w98-btn"
                    style={{
                      ...raised,
                      background: W.silver,
                      width: '24px', height: '22px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: 'none',
                      ...raised,
                    }}
                  >
                    {icon}
                  </button>
                ))}
                <div style={{
                  ...sunken,
                  flex: 1,
                  padding: '2px 6px',
                  fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                  fontSize: '11px',
                  color: '#000',
                  minWidth: '80px',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  C:\Users\{personal.name.split(' ')[0]}\Portfolio
                </div>
              </div>

              {/* Content area */}
              <div style={{
                display: 'flex',
                flex: 1,
                minHeight: '320px',
              }}>
                {/* Left panel — folder tree */}
                <div style={{
                  width: '130px',
                  flexShrink: 0,
                  ...sunken,
                  margin: '4px',
                  padding: '4px',
                  background: W.white,
                  overflow: 'auto',
                  fontSize: '11px',
                  fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                }} className="w98-scrollbar">
                  {[
                    { depth: 0, icon: '🖥️', label: 'Desktop' },
                    { depth: 1, icon: '📁', label: 'My Portfolio' },
                    { depth: 2, icon: '📄', label: 'About.htm' },
                    { depth: 2, icon: '📁', label: 'Projects' },
                    { depth: 2, icon: '📄', label: 'Resume.pdf' },
                    { depth: 2, icon: '📧', label: 'Contact.htm' },
                    { depth: 1, icon: '📁', label: 'My Documents' },
                    { depth: 1, icon: '🌐', label: 'GitHub' },
                  ].map(({ depth, icon, label }, i) => (
                    <div
                      key={i}
                      style={{
                        paddingLeft: `${depth * 12}px`,
                        padding: `1px 2px 1px ${depth * 12 + 2}px`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#000'; }}
                    >
                      <span style={{ fontSize: '13px' }}>{icon}</span>
                      {label}
                    </div>
                  ))}
                </div>

                {/* Right panel — main content */}
                <div style={{
                  flex: 1,
                  ...sunken,
                  margin: '4px 4px 4px 0',
                  padding: '16px',
                  background: W.white,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }} className="w98-scrollbar">
                  {/* Profile section */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Avatar in W98 frame */}
                    <div style={{
                      flexShrink: 0,
                      ...raised,
                      padding: '3px',
                      background: W.silver,
                    }}>
                      <div style={{
                        ...sunken,
                        width: '72px', height: '72px',
                        overflow: 'hidden',
                      }}>
                        <img
                          src={personal.avatar}
                          alt={personal.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: '140px' }}>
                      <div style={{
                        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: W.navy,
                        marginBottom: '4px',
                      }}>
                        {personal.name}
                      </div>
                      <div style={{
                        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                        fontSize: '11px',
                        color: '#000',
                        marginBottom: '6px',
                        minHeight: '16px',
                      }}>
                        <span className={titleDone ? '' : 'w98-cursor-blink'}>
                          {typedTitle}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '4px',
                        flexWrap: 'wrap',
                      }}>
                        <W98Btn primary onClick={() => window.open(socials.github, '_blank', 'noopener,noreferrer')}>
                          🐙 GitHub
                        </W98Btn>
                        <W98Btn onClick={() => window.open(socials.linkedin, '_blank', 'noopener,noreferrer')}>
                          💼 LinkedIn
                        </W98Btn>
                        <W98Btn onClick={() => window.open(`mailto:${socials.email}`)}>
                          📧 Email
                        </W98Btn>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}>
                    {[
                      { label: 'Years Experience', value: stats.yearsExperience },
                      { label: 'Projects Done', value: stats.projectsCompleted },
                      { label: 'Happy Clients', value: stats.happyClients },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        style={{
                          ...outerRaised,
                          padding: '6px 12px',
                          background: W.silver,
                          textAlign: 'center',
                          flex: '1',
                          minWidth: '80px',
                        }}
                      >
                        <div style={{
                          fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: W.navy,
                        }}>
                          {value}+
                        </div>
                        <div style={{
                          fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                          fontSize: '10px',
                          color: '#000',
                        }}>
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Skills progress */}
                  <div>
                    <div style={{
                      ...raised,
                      background: W.navy,
                      color: W.white,
                      padding: '2px 6px',
                      fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                      fontSize: '11px',
                      fontWeight: 'bold',
                      marginBottom: '6px',
                    }}>
                      📊 Skills
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {topSkills.map(({ name, level }) => (
                        <div key={name}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                            fontSize: '10px',
                            marginBottom: '2px',
                          }}>
                            <span>{name}</span>
                            <span>{level}%</span>
                          </div>
                          <W98Progress value={level} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location / tagline */}
                  <div style={{
                    ...sunken,
                    padding: '6px 8px',
                    background: '#f0f0f0',
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '11px',
                    color: '#000',
                    fontStyle: 'italic',
                  }}>
                    📍 {personal.location} — "{personal.tagline}"
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div style={{
                borderTop: `1px solid ${W.btnShadow}`,
                padding: '2px 6px',
                display: 'flex',
                gap: '4px',
                background: W.silver,
              }}>
                {['Portfolio ready', `${stats.projectsCompleted} projects`, personal.location].map((t, i) => (
                  <div key={i} style={{
                    ...sunken,
                    padding: '1px 6px',
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '11px',
                    flex: i === 0 ? 2 : 1,
                  }}>
                    {t}
                  </div>
                ))}
              </div>
            </Win98Window>
          </div>
        )}

        {/* Welcome dialog */}
        {dialogOpen && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              right: '3%',
              transform: 'translateY(-50%)',
              zIndex: 30,
              width: 'min(220px, calc(100vw - 130px))',
            }}
            onClick={() => setActiveWindow('dialog')}
          >
            <Win98Window
              title="Welcome!"
              icon="✨"
              active={activeWindow === 'dialog'}
              onClose={() => setDialogOpen(false)}
            >
              <div style={{
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '28px', flexShrink: 0 }}>💻</span>
                  <div style={{
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '11px',
                    color: '#000',
                    lineHeight: '1.5',
                  }}>
                    Welcome to <strong>{personal.name}</strong>'s portfolio!
                    <br /><br />
                    You're running <strong>Portfolio 98</strong> on Windows.
                  </div>
                </div>

                <div style={{
                  height: '1px',
                  background: `linear-gradient(90deg, ${W.btnDarkShadow}, ${W.btnHighlight})`,
                }} />

                <div style={{
                  fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                  fontSize: '11px',
                }}>
                  ✅ System Status:
                  <div style={{ marginTop: '4px' }}>
                    <W98Progress value={100} color="#008000" />
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '10px', color: '#008000' }}>
                    All systems operational
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                  <W98Btn primary onClick={() => setDialogOpen(false)}>
                    OK
                  </W98Btn>
                  <W98Btn onClick={() => { setAboutOpen(true); setDialogOpen(false); }}>
                    About
                  </W98Btn>
                </div>
              </div>
            </Win98Window>
          </div>
        )}

        {/* About Me mini-window */}
        {aboutOpen && (
          <div
            style={{
              position: 'absolute',
              top: '30%',
              right: '3%',
              zIndex: 35,
              width: 'min(240px, calc(100vw - 130px))',
            }}
            onClick={() => setActiveWindow('about')}
          >
            <Win98Window
              title="About Me"
              icon="ℹ️"
              active={activeWindow === 'about'}
              onClose={() => setAboutOpen(false)}
            >
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  ...sunken,
                  padding: '6px',
                  background: W.white,
                  fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                  fontSize: '11px',
                  lineHeight: '1.6',
                  maxHeight: '120px',
                  overflowY: 'auto',
                }} className="w98-scrollbar">
                  {personal.bio}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <W98Btn primary onClick={() => setAboutOpen(false)}>OK</W98Btn>
                </div>
              </div>
            </Win98Window>
          </div>
        )}

        {/* Minimized window in taskbar */}
        {minimized && (
          <div style={{ position: 'absolute', bottom: '34px', left: '4px', zIndex: 100 }}>
            <button
              className="w98-taskbar-btn"
              onClick={() => { setMinimized(false); setActiveWindow('main'); }}
              style={{
                ...raised,
                background: W.silver,
                padding: '2px 8px',
                cursor: 'pointer',
                fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              🖥️ {personal.name} - Portfolio
            </button>
          </div>
        )}

        {/* ─── Taskbar ─── */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          background: W.silver,
          borderTop: `2px solid ${W.btnHighlight}`,
          display: 'flex',
          alignItems: 'center',
          padding: '2px 4px',
          gap: '4px',
          zIndex: 50,
        }}>
          {/* Start button */}
          <div style={{ position: 'relative' }}>
            <button
              className="w98-btn w98-start-btn"
              onClick={(e) => { e.stopPropagation(); setStartOpen(o => !o); }}
              style={{
                ...raised,
                background: W.silver,
                padding: '2px 8px',
                cursor: 'pointer',
                fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '24px',
              }}
            >
              <span style={{ fontSize: '14px' }}>🪟</span>
              <strong>Start</strong>
            </button>
            <StartMenu open={startOpen} onClose={() => setStartOpen(false)} />
          </div>

          {/* Divider */}
          <div style={{
            width: '2px', height: '20px',
            borderLeft: `1px solid ${W.btnShadow}`,
            borderRight: `1px solid ${W.btnHighlight}`,
          }} />

          {/* Open windows in taskbar */}
          {!minimized && (
            <button
              className="w98-taskbar-btn"
              onClick={() => setActiveWindow('main')}
              style={{
                ...raised,
                background: activeWindow === 'main' ? W.btnShadow : W.silver,
                padding: '2px 8px',
                cursor: 'pointer',
                fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '24px',
                minWidth: '120px',
                maxWidth: '160px',
              }}
            >
              🖥️ {personal.name.split(' ')[0]} - Portfolio
            </button>
          )}

          {dialogOpen && (
            <button
              className="w98-taskbar-btn"
              onClick={() => setActiveWindow('dialog')}
              style={{
                ...raised,
                background: activeWindow === 'dialog' ? W.btnShadow : W.silver,
                padding: '2px 8px',
                cursor: 'pointer',
                fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '24px',
              }}
            >
              ✨ Welcome!
            </button>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* System tray */}
          <div style={{
            ...sunken,
            display: 'flex',
            alignItems: 'center',
            padding: '2px 6px',
            gap: '6px',
          }}>
            <span style={{ fontSize: '13px' }} title="Network connected">🌐</span>
            <span style={{ fontSize: '13px' }} title="Volume">🔊</span>
            <W98Clock />
          </div>
        </div>
      </div>
    </div>
  );
}
