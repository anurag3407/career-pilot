import React from 'react';
import { Binary, Sparkles } from 'lucide-react';

const DOT_STYLES = [
  { bg: 'linear-gradient(135deg, #b8ecff, #e0b8ff)', shadow: 'rgba(180,230,255,0.7)' },
  { bg: 'linear-gradient(135deg, #e0b8ff, #ffd6f0)', shadow: 'rgba(220,160,255,0.7)', delay: '0.5s' },
  { bg: 'linear-gradient(135deg, #b8ffec, #b8ecff)', shadow: 'rgba(160,255,220,0.7)', delay: '1s' },
  { bg: 'linear-gradient(135deg, #fffdb8, #b8ffec)', shadow: 'rgba(255,240,160,0.7)', delay: '1.5s' },
  { bg: 'linear-gradient(135deg, #ffd6f0, #e0b8ff)', shadow: 'rgba(255,180,220,0.7)', delay: '2s' },
];

const SKILLS = [
  'System Architecture', 'React.js', 'Tailwind CSS',
  'Next.js', 'Data Pipeline Optimization',
];

export default function About() {
  return (
    <section className="min-h-screen bg-[#0a0a18] text-cyan-200 relative overflow-hidden font-mono text-sm">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 90% 70% at 15% 25%, rgba(180,220,255,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 70% 80% at 85% 10%, rgba(200,150,255,0.20) 0%, transparent 55%),
            radial-gradient(ellipse 100% 60% at 50% 90%, rgba(255,180,230,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 75% 65%, rgba(150,240,220,0.12) 0%, transparent 50%),
            radial-gradient(ellipse 60% 60% at 20% 75%, rgba(255,220,150,0.10) 0%, transparent 50%)`
        }} />
        <div className="absolute inset-0" style={{
          opacity: 0.1,
          background: `
            conic-gradient(from 0deg at 30% 40%, #ffe0f0, #c0f0ff, #e0c0ff, #fffac0, #b0ffe0, #ffd0f0, #c0f0ff, #ffe0f0),
            conic-gradient(from 180deg at 70% 60%, #c0f0ff, #e0c0ff, #fffac0, #b0ffe0, #ffd0f0, #c0f0ff, #e0c0ff, #c0f0ff)`,
          mixBlendMode: 'screen',
          animation: 'foilRotate 12s linear infinite',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(180,220,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,220,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute inset-0" style={{
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)`
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-8 py-16 space-y-10">
        <div className="text-center space-y-3">
          <p className="text-[10px] tracking-[0.4em] uppercase text-sky-300/50">
            [ PORTFOLIO.SYSTEM / ABOUT.MODULE / v2.4.1 ]
          </p>
          <h2
            className="font-black text-5xl tracking-widest uppercase leading-none inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#e0f4ff] via-[#ffd6f0] to-[#b8ecff]"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              backgroundSize: '200% auto',
              textShadow: '0 0 20px rgba(160,220,255,0.6), 0 0 40px rgba(180,160,255,0.4)',
              animation: 'iridescent 6s linear infinite',
            }}
          >
            ABOUT SECTION
          </h2>
          <p className="text-[9px] tracking-[0.35em] uppercase text-purple-300/35 border-t border-purple-900/15 inline-block px-4 pt-2">
            Core Attribute Scan &nbsp;/&nbsp; Projecting [About] Module &nbsp;/&nbsp; Neural Link: Active
          </p>
        </div>

        <div style={{
          height: '2px', borderRadius: '2px',
          background: 'linear-gradient(90deg, #b8ecff, #e0b8ff, #ffd6f0, #fffdb8, #b8ffec, #b8d8ff, #f0b8ff, #b8ecff)',
          backgroundSize: '200% auto',
          animation: 'prismFlow 3s linear infinite',
          boxShadow: '0 0 12px rgba(180,200,255,0.5), 0 0 24px rgba(220,160,255,0.3)',
        }} />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          <div className="md:col-span-5 relative rounded-sm p-6 backdrop-blur-2xl" style={{ background: 'rgba(10,8,30,0.65)' }}>
            <HoloBorder />
            <Corners />
            <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-sky-900/20">
              <Binary className="w-4 h-4 text-sky-300/70" />
              <span className="text-[12px] font-bold tracking-wider text-slate-100/90" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                &lt;Technical Attributes&gt;
              </span>
            </div>

            {SKILLS.map((skill, i) => (
              <div key={skill} className="flex items-center gap-2.5 py-2 border-b border-white/[0.035] last:border-none">
                <span className="text-[9px] text-sky-400/25 font-bold w-4 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-[11.5px] text-sky-100/75 tracking-wide">
                  {skill}
                </span>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                  background: DOT_STYLES[i].bg,
                  boxShadow: `0 0 7px ${DOT_STYLES[i].shadow}`,
                  animation: `dotPulse 2.5s ${DOT_STYLES[i].delay || '0s'} ease-in-out infinite`,
                }} />
              </div>
            ))}
          </div>

          <div className="md:col-span-7 relative rounded-sm p-6 backdrop-blur-2xl" style={{ background: 'rgba(5,8,28,0.65)' }}>
            <HoloBorder />
            <Corners />
            <div className="flex items-center gap-2.5 pb-3.5 mb-4 border-b border-purple-900/20">
              <Sparkles className="w-4 h-4 text-purple-300/80" style={{ animation: 'sparkle 3s ease-in-out infinite' }} />
              <span className="text-[14px] font-bold tracking-wider text-slate-100/90" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                DEVELOPER_PROFILE::
              </span>
            </div>
            <div className="space-y-3.5 text-[12.5px] leading-[1.9] text-slate-300/65">
              <p>
                Hello. I am a specialized developer focusing on synthesizing{' '}
                <span style={{ color: '#b8ecff', fontWeight: 'bold' }}>secure, efficient</span>, and intuitively
                structured digital solutions. I leverage complex system-level logic to drive aesthetic Front-End interfaces.
              </p>
              <p>
                Continuously engineering{' '}
                <span style={{ color: '#b8ecff', fontWeight: 'bold' }}>data-driven platforms</span>, optimizing
                performance metrics, and refining core technical knowledge base. Status:{' '}
                <span style={{ color: '#b8ecff', fontWeight: 'bold' }}>Active</span> // Mission: Engineering
                optimized user experiences.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-7 text-[12px] tracking-widest">
              <span style={{ color: 'rgba(160,210,255,0.5)' }}>$</span>
              <span style={{ color: 'rgba(210,170,255,0.65)' }}>INIT_MISSION</span>
              <span style={{
                width: '7px', height: '15px', display: 'inline-block',
                background: 'rgba(210,170,255,0.75)',
                animation: 'blink 1s step-end infinite',
                boxShadow: '0 0 8px rgba(210,170,255,0.6)',
              }} />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-7 flex-wrap pt-5 relative" style={{ borderTop: '1px solid rgba(180,200,255,0.08)' }}>
          <div className="absolute -top-px left-0 right-0 h-px" style={{
            background: 'linear-gradient(90deg, transparent, #b8ecff, #e0b8ff, #ffd6f0, #b8ffec, transparent)'
          }} />
          {[
            ['Projection Status: Active', true],
            ['// Link: Neural Matrix Established'],
            ['// Scan: Complete'],
            ['// Integrity: 100%'],
          ].map(([label, bright]) => (
            <span key={label} className="text-[8.5px] tracking-[0.3em] uppercase"
              style={{ color: bright ? 'rgba(180,220,255,0.45)' : 'rgba(160,190,230,0.22)' }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        @keyframes iridescent {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes prismFlow { to { background-position: 200% center; } }
        @keyframes borderShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes foilRotate { to { transform: rotate(360deg) scale(1.2); } }
        @keyframes dotPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.6) drop-shadow(0 0 3px rgba(200,220,255,0.7)); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.5; transform: scale(1.1) rotate(180deg); }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </section>
  );
}

function HoloBorder() {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-sm" style={{
      padding: '1px',
      background: 'linear-gradient(135deg, rgba(180,230,255,0.9), rgba(220,160,255,0.6), rgba(255,180,230,0.8), rgba(255,240,160,0.5), rgba(160,255,220,0.7), rgba(180,210,255,0.9))',
      backgroundSize: '300% 300%',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      animation: 'borderShimmer 4s linear infinite',
    }} />
  );
}

function Corners() {
  return (
    <>
      <div className="absolute top-2 left-2 w-3.5 h-3.5" style={{ borderTop: '1px solid rgba(180,230,255,0.65)', borderLeft: '1px solid rgba(180,230,255,0.65)' }} />
      <div className="absolute top-2 right-2 w-3.5 h-3.5" style={{ borderTop: '1px solid rgba(220,160,255,0.65)', borderRight: '1px solid rgba(220,160,255,0.65)' }} />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5" style={{ borderBottom: '1px solid rgba(160,255,220,0.65)', borderLeft: '1px solid rgba(160,255,220,0.65)' }} />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5" style={{ borderBottom: '1px solid rgba(255,200,230,0.65)', borderRight: '1px solid rgba(255,200,230,0.65)' }} />
    </>
  );
}