import React, { useState, useEffect } from 'react';
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
  red: '#800000',
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
  @keyframes w98ProgressFill {
    from { width: 0; }
    to { width: 100%; }
  }

  @keyframes w98Blink {
    0%, 100% { opacity: 1; }
    49% { opacity: 1; }
    50% { opacity: 0; }
    99% { opacity: 0; }
  }

  @keyframes w98Scan {
    0% { top: 0; opacity: 0.15; }
    100% { top: 100%; opacity: 0.15; }
  }

  .w98-resume-btn {
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
    background: #C0C0C0;
    cursor: pointer;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 11px;
    padding: 5px 16px;
    min-width: 80px;
    color: #000;
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;
  }

  .w98-resume-btn:active {
    border-top: 2px solid #000 !important;
    border-left: 2px solid #000 !important;
    border-bottom: 2px solid #fff !important;
    border-right: 2px solid #fff !important;
    padding-top: 6px !important;
    padding-left: 17px !important;
  }

  .w98-resume-btn:hover {
    background: #d4d4d4;
  }

  .w98-resume-primary {
    background: #000080 !important;
    color: #fff !important;
    border-top: 2px solid #4444cc;
    border-left: 2px solid #4444cc;
    border-bottom: 2px solid #000;
    border-right: 2px solid #000;
  }

  .w98-resume-primary:hover {
    background: #1111aa !important;
  }

  .w98-resume-primary:active {
    border-top: 2px solid #000 !important;
    border-left: 2px solid #000 !important;
    border-bottom: 2px solid #4444cc !important;
    border-right: 2px solid #4444cc !important;
    padding-top: 6px !important;
    padding-left: 17px !important;
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

/* ─── Progress bar ─── */
function W98ProgressBar({ value = 100, animated = false, color = W.navy, label }) {
  const [displayed, setDisplayed] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated) return;
    let v = 0;
    const interval = setInterval(() => {
      v += 4;
      if (v >= value) { setDisplayed(value); clearInterval(interval); return; }
      setDisplayed(v);
    }, 40);
    return () => clearInterval(interval);
  }, [value, animated]);

  const blocks = Math.floor(displayed / 5);

  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '10px', marginBottom: '3px', color: '#000' }}>
          <span>{label}</span>
          <span>{displayed}%</span>
        </div>
      )}
      <div style={{ ...sunken, height: '16px', background: W.white, display: 'flex', alignItems: 'center', padding: '1px 2px', gap: '1px', overflow: 'hidden' }}>
        {Array.from({ length: blocks }).map((_, i) => (
          <div key={i} style={{ width: '10px', height: '12px', background: color, flexShrink: 0 }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Print dialog simulation ─── */
function PrintDialog({ onClose, onPrint }) {
  const [copies, setCopies] = useState(1);
  const [allPages, setAllPages] = useState(true);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: W.silver, ...outerRaised, width: 'min(360px, calc(100vw - 32px))' }}>
        <div style={{ background: W.titleActive, padding: '3px 4px', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}>
          <span style={{ fontSize: '14px' }}>🖨️</span>
          <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', flex: 1 }}>
            Print
          </span>
          <button onClick={onClose} className="w98-resume-btn" style={{ ...raised, width: '16px', height: '14px', padding: '0', minWidth: '16px', fontSize: '10px', fontWeight: 'bold' }}>✕</button>
        </div>

        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Printer */}
          <div style={{ ...outerRaised, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', color: '#000', marginBottom: '2px' }}>
              Printer
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🖨️</span>
              <div>
                <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000' }}>HP LaserJet 1200</div>
                <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '10px', color: W.green }}>Ready</div>
              </div>
            </div>
          </div>

          {/* Page range */}
          <div style={{ ...outerRaised, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', marginBottom: '2px', color: '#000' }}>Print Range</div>
            {[
              { label: 'All pages', val: true },
              { label: 'Pages: 1-2 (Resume only)', val: false },
            ].map(({ label, val }) => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', cursor: 'pointer', color: '#000' }}>
                <input type="radio" checked={allPages === val} onChange={() => setAllPages(val)} />
                {label}
              </label>
            ))}
          </div>

          {/* Copies */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000' }}>Number of copies:</span>
            <div style={{ ...sunken, width: '40px', padding: '2px 4px', background: W.white }}>
              <input
                type="number"
                value={copies}
                onChange={e => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '100%', border: 'none', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', outline: 'none', background: 'transparent' }}
                min={1}
                max={99}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '4px 8px 8px', display: 'flex', justifyContent: 'flex-end', gap: '6px', borderTop: `1px solid ${W.darkGray}` }}>
          <button className="w98-resume-btn w98-resume-primary" onClick={onPrint}>🖨️ Print</button>
          <button className="w98-resume-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Download progress dialog ─── */
function DownloadDialog({ filename, onClose, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let v = 0;
    const interval = setInterval(() => {
      v += 3;
      setProgress(Math.min(v, 100));
      if (v >= 100) { setDone(true); clearInterval(interval); }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9990, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
      <div style={{ background: W.silver, ...outerRaised, width: 'min(320px, calc(100vw - 32px))' }}>
        <div style={{ background: W.titleActive, padding: '3px 4px', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}>
          <span style={{ fontSize: '14px' }}>⬇️</span>
          <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', flex: 1 }}>
            Downloading...
          </span>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000' }}>
            Saving: <strong>{filename}</strong>
          </div>
          <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000' }}>
            Estimated time remaining: {done ? '0 seconds' : `${Math.ceil((100 - progress) / 25)} seconds`}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '10px', marginBottom: '3px', color: '#000' }}>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div style={{ ...sunken, height: '16px', background: W.white, display: 'flex', alignItems: 'center', padding: '1px 2px', gap: '1px', overflow: 'hidden' }}>
              {Array.from({ length: Math.floor(progress / 5) }).map((_, i) => (
                <div key={i} style={{ width: '10px', height: '12px', background: W.navy, flexShrink: 0 }} />
              ))}
            </div>
          </div>
          {done && (
            <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: W.green, fontWeight: 'bold' }}>
              ✅ Download complete!
            </div>
          )}
        </div>
        <div style={{ padding: '4px 8px 8px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="w98-resume-btn"
            onClick={() => { if (done) { onComplete?.(); } onClose(); }}
            style={{ opacity: done ? 1 : 0.5, cursor: done ? 'pointer' : 'default' }}
          >
            {done ? 'Open' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ResumeCTA component ─── */
export default function ResumeCTA() {
  const { personal, socials, stats, skills } = data;
  const [showPrint, setShowPrint] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const handleDownload = () => {
    if (downloadDone) return;
    setShowDownload(true);
  };

  const handlePrint = () => {
    setShowPrint(false);
    window.print();
  };

  return (
    <section
      id="resume"
      style={{
        background: W.desktop,
        padding: '40px 16px 60px',
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{STYLES}</style>

      {showPrint && <PrintDialog onClose={() => setShowPrint(false)} onPrint={handlePrint} />}
      {showDownload && (
        <DownloadDialog
          filename={`${personal.name.replace(/\s/g, '_')}_Resume.pdf`}
          onClose={() => setShowDownload(false)}
          onComplete={() => { setShowDownload(false); setDownloadDone(true); }}
        />
      )}

      {/* Desktop label */}
      <div style={{ position: 'absolute', top: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '24px' }}>📄</span>
        <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}>
          Resume
        </span>
      </div>

      {/* Main resume window */}
      <div style={{ background: W.silver, ...outerRaised, width: 'min(620px, calc(100vw - 32px))', marginTop: '40px' }}>
        {/* Title bar */}
        <div style={{ background: W.titleActive, padding: '3px 4px', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}>
          <span style={{ fontSize: '14px' }}>📄</span>
          <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', flex: 1 }}>
            {personal.name.replace(/\s/g, '_')}_Resume.pdf — Acrobat Reader
          </span>
          {['_', '□', '✕'].map((ch, i) => (
            <div key={i} style={{ ...raised, width: '16px', height: '14px', background: W.silver, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', cursor: 'default', color: '#000' }}>
              {ch}
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '3px 4px', borderBottom: `1px solid ${W.darkGray}`, flexWrap: 'wrap' }}>
          <button className="w98-resume-btn" style={{ padding: '3px 10px', minWidth: 'auto', fontSize: '10px' }}
            onClick={handleDownload}>
            💾 Save
          </button>
          <button className="w98-resume-btn" style={{ padding: '3px 10px', minWidth: 'auto', fontSize: '10px' }}
            onClick={() => setShowPrint(true)}>
            🖨️ Print
          </button>
          <button className="w98-resume-btn" style={{ padding: '3px 10px', minWidth: 'auto', fontSize: '10px' }}
            onClick={() => window.open(`mailto:${socials.email}`)}>

            📧 Email
          </button>
          <div style={{ width: '1px', height: '20px', background: W.darkGray, margin: '0 2px' }} />
          <button className="w98-resume-btn" style={{ padding: '3px 8px', minWidth: 'auto', fontSize: '10px' }}>🔍 Zoom</button>
          <button className="w98-resume-btn" style={{ padding: '3px 8px', minWidth: 'auto', fontSize: '10px' }}>⬅ Page 1</button>
          <button className="w98-resume-btn" style={{ padding: '3px 8px', minWidth: 'auto', fontSize: '10px' }}>➡ Page 2</button>
        </div>

        {/* Resume preview area */}
        <div style={{ padding: '16px', background: W.darkGray, display: 'flex', justifyContent: 'center' }}>
          {/* Page 1 */}
          <div style={{
            background: W.white,
            width: '100%',
            maxWidth: '540px',
            padding: '32px 28px',
            boxShadow: '4px 4px 12px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Scan line effect */}
            <div style={{
              position: 'absolute',
              left: 0, right: 0,
              height: '3px',
              background: 'rgba(0,128,0,0.08)',
              animation: 'w98Scan 4s linear infinite',
              pointerEvents: 'none',
            }} />

            {/* Header */}
            <div style={{ borderBottom: '2px solid #000', paddingBottom: '8px', marginBottom: '12px' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Tahoma, Arial, sans-serif', color: '#000' }}>
                {personal.name}
              </div>
              <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '12px', color: '#333', marginTop: '2px' }}>
                {personal.title}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                {[
                  `📍 ${personal.location}`,
                  `📧 ${socials.email}`,
                  `🐙 github.com`,
                  `💼 linkedin.com`,
                ].map((item) => (
                  <span key={item} style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '10px', color: '#444' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '12px', fontWeight: 'bold', color: '#000', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #ccc', marginBottom: '4px' }}>
                Summary
              </div>
              <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '10px', color: '#333', lineHeight: '1.5' }}>
                {personal.bio.substring(0, 200)}...
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '12px', fontWeight: 'bold', color: '#000', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #ccc', marginBottom: '6px' }}>
                Technical Skills
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 16px' }}>
                {skills.slice(0, 10).map((skill) => (
                  <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#000', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '10px', color: '#333' }}>
                      {skill.name} ({skill.level}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '12px', fontWeight: 'bold', color: '#000', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #ccc', marginBottom: '6px' }}>
                Highlights
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Years Experience', value: `${stats.yearsExperience}+` },
                  { label: 'Projects Completed', value: `${stats.projectsCompleted}` },
                  { label: 'Happy Clients', value: `${stats.happyClients}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '18px', fontWeight: 'bold', color: '#000' }}>{value}</div>
                    <div style={{ fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '9px', color: '#666' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Page number */}
            <div style={{ textAlign: 'right', marginTop: '12px', fontFamily: 'Tahoma, Arial, sans-serif', fontSize: '9px', color: '#999' }}>
              Page 1 of 2
            </div>
          </div>
        </div>

        {/* CTA button section */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${W.darkGray}`, background: W.silver }}>
          <div style={{ ...outerRaised, padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', color: W.navy }}>
              💼 Ready to collaborate?
            </div>
            <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000', lineHeight: '1.6' }}>
              "{personal.tagline}"
              <br />
              <br />
              Download my resume or reach out directly — I'm open to full-time, contract, and freelance opportunities.
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="w98-resume-btn w98-resume-primary"
                onClick={handleDownload}
                style={{ fontSize: '12px', padding: '6px 20px' }}
              >
                💾 {downloadDone ? 'Downloaded!' : 'Download Resume'}
              </button>
              <button
                className="w98-resume-btn"
                onClick={() => setShowPrint(true)}
                style={{ fontSize: '12px', padding: '6px 16px' }}
              >
                🖨️ Print Resume
              </button>
              <button
                className="w98-resume-btn"
                onClick={() => window.open(`mailto:${socials.email}`)}
                style={{ fontSize: '12px', padding: '6px 16px' }}
              >
                📧 Email Me
              </button>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', borderTop: `1px dotted ${W.darkGray}`, paddingTop: '8px' }}>
              {[
                { icon: '🐙', label: 'GitHub', url: socials.github },
                { icon: '💼', label: 'LinkedIn', url: socials.linkedin },
                { icon: '🐦', label: 'Twitter', url: socials.twitter },
              ].map(({ icon, label, url }) => (
                <button
                  key={label}
                  className="w98-resume-btn"
                  onClick={() => window.open(url, '_blank')}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{ borderTop: `1px solid ${W.darkGray}`, padding: '2px 6px', display: 'flex', gap: '4px', background: W.silver }}>
          {['PDF | Page 1 of 2', `${personal.location}`, downloadDone ? '✅ Resume downloaded' : 'Click Download to save'].map((t, i) => (
            <div key={i} style={{ ...sunken, padding: '1px 6px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', flex: i === 0 ? 2 : 1, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
