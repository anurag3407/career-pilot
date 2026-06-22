import React, { useState } from 'react';
import {
  Play, Pause, ExternalLink, Github, Disc3, ListMusic, Star,
  Clock, Layers, ChevronRight, Radio, Headphones
} from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    trackNumber: 'A1',
    title: 'Harmonic Dashboard',
    subtitle: 'Full-Stack Analytics Suite',
    duration: '6 weeks',
    tags: ['React', 'Node.js', 'D3.js'],
    genre: 'Full-Stack',
    description:
      'A real-time analytics platform built to orchestrate data into visual symphonies. Streams live metrics with WebSocket-powered rhythm and a glass-morphic vinyl-dark UI.',
    stars: 128,
    liveUrl: '#',
    repoUrl: '#',
    labelBg: '#d97706',
  },
  {
    id: 2,
    trackNumber: 'A2',
    title: 'Groove API',
    subtitle: 'RESTful Music Metadata Service',
    duration: '3 weeks',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    genre: 'Backend',
    description:
      'A blazing-fast API that catalogs and streams music metadata. Engineered with FastAPI for near-zero latency, layered over a carefully normalised relational groove.',
    stars: 87,
    liveUrl: '#',
    repoUrl: '#',
    labelBg: '#ea580c',
  },
  {
    id: 3,
    trackNumber: 'B1',
    title: 'VinylOS',
    subtitle: 'Browser-based Music Player',
    duration: '4 weeks',
    tags: ['TypeScript', 'Web Audio API', 'Tailwind'],
    genre: 'Frontend',
    description:
      'A fully functional in-browser record player simulating the warm crackle of vinyl. Uses the Web Audio API to apply lo-fi filters and analog EQ curves.',
    stars: 214,
    liveUrl: '#',
    repoUrl: '#',
    labelBg: '#ca8a04',
  },
  {
    id: 4,
    trackNumber: 'B2',
    title: 'Crate Digger',
    subtitle: 'AI-Powered Playlist Curator',
    duration: '5 weeks',
    tags: ['Python', 'OpenAI', 'Spotify API'],
    genre: 'AI/ML',
    description:
      'An intelligent crate-digger that surfaces rare tracks matching your mood. Blends collaborative filtering with LLM-based lyric analysis to compose the perfect set.',
    stars: 173,
    liveUrl: '#',
    repoUrl: '#',
    labelBg: '#dc2626',
  },
];

const GENRE_COLORS = {
  'Full-Stack': { text: '#fbbf24', bg: 'rgba(120,53,15,0.4)', border: 'rgba(120,53,15,0.7)' },
  Backend:      { text: '#fb923c', bg: 'rgba(154,52,18,0.3)', border: 'rgba(154,52,18,0.6)' },
  Frontend:     { text: '#fde047', bg: 'rgba(133,77,14,0.3)', border: 'rgba(133,77,14,0.6)' },
  'AI/ML':      { text: '#f87171', bg: 'rgba(153,27,27,0.3)', border: 'rgba(153,27,27,0.6)' },
};

/**
 * Renders a mini vinyl record SVG with concentric groove rings,
 * a coloured center label, and an optional CSS spin animation.
 *
 * @param {string}  labelBg   - Background colour (hex/rgb) for the center label.
 * @param {boolean} isPlaying - When true, the record spins via CSS animation.
 * @returns {JSX.Element} A circular vinyl record div.
 */
function MiniVinyl({ labelBg, isPlaying }) {
  return (
    <div
      style={{
        width: '64px', height: '64px', borderRadius: '50%',
        background: '#111', border: '2px solid #3f2e20',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.6)', flexShrink: 0, position: 'relative',
        animation: isPlaying ? 'vinyl-spin 3s linear infinite' : 'none',
      }}
    >
      <style>{`@keyframes vinyl-spin { to { transform: rotate(360deg); } }`}</style>
      {/* grooves */}
      <div style={{ position:'absolute', inset:'6%', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.06)' }} />
      <div style={{ position:'absolute', inset:'16%', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)' }} />
      <div style={{ position:'absolute', inset:'28%', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)' }} />
      {/* center label */}
      <div style={{
        width:'36%', height:'36%', borderRadius:'50%',
        background: labelBg, zIndex:2, display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'inset 0 2px 4px rgba(0,0,0,0.4)', border: '2px solid rgba(0,0,0,0.3)',
      }}>
        <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#d1d5db' }} />
      </div>
      {/* sheen */}
      <div style={{
        position:'absolute', inset:0, borderRadius:'50%',
        background:'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)',
        pointerEvents:'none',
      }} />
    </div>
  );
}

/**
 * Displays a single project as a vinyl track card.
 *
 * Shows a spinning {@link MiniVinyl}, track number, genre badge, project title,
 * description, tech-stack tags, duration, and action buttons (GitHub + Live).
 * Hover state lifts the card with an amber glow shadow.
 *
 * @param {Object}   project              - Project data object.
 * @param {number}   project.id           - Unique project identifier.
 * @param {string}   project.trackNumber  - Vinyl side label, e.g. "A1".
 * @param {string}   project.title        - Project display name.
 * @param {string}   project.subtitle     - Short one-line descriptor.
 * @param {string}   project.genre        - Genre/category string used for colour lookup.
 * @param {string}   project.description  - Full project description paragraph.
 * @param {string[]} project.tags         - Technology/library tags.
 * @param {number}   project.stars        - GitHub star count to display.
 * @param {string}   project.duration     - Time taken, e.g. "6 weeks".
 * @param {string}   project.liveUrl      - Live demo URL ('#' disables the button).
 * @param {string}   project.repoUrl      - GitHub repo URL ('#' disables the button).
 * @param {string}   project.labelBg      - CSS colour for the vinyl center label.
 * @returns {JSX.Element} A styled project card.
 */
function TrackCard({ project }) {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const gc = GENRE_COLORS[project.genre] || GENRE_COLORS['Full-Stack'];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1a110a',
        border: `1px solid ${hovered ? 'rgba(217,119,6,0.6)' : 'rgba(120,53,15,0.35)'}`,
        borderRadius: '12px',
        padding: '18px',
        transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 8px 30px rgba(217,119,6,0.12)' : 'none',
      }}
    >
      {/* top row */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', marginBottom:'12px' }}>
        {/* vinyl + play btn */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <MiniVinyl labelBg={project.labelBg} isPlaying={playing} />
          <button
            onClick={() => setPlaying(p => !p)}
            aria-label={playing ? 'Pause' : 'Play'}
            style={{
              position:'absolute', bottom:'-4px', right:'-4px',
              width:'22px', height:'22px', borderRadius:'50%', border:'none', cursor:'pointer',
              background: playing ? '#d97706' : '#292524',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 2px 6px rgba(0,0,0,0.5)',
              outline:'1px solid rgba(217,119,6,0.4)',
              transition: 'background 0.15s',
            }}
          >
            {playing
              ? <Pause style={{ width:'9px', height:'9px', color:'#1a0f0a' }} />
              : <Play  style={{ width:'9px', height:'9px', color:'#fbbf24', marginLeft:'1px' }} />}
          </button>
        </div>

        {/* title block */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'3px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'10px', fontWeight:700, color:'rgba(120,53,15,0.9)', fontFamily:'monospace', letterSpacing:'0.12em' }}>
              {project.trackNumber}
            </span>
            <span style={{
              fontSize:'10px', fontWeight:700, fontFamily:'monospace', letterSpacing:'0.08em',
              textTransform:'uppercase', padding:'1px 6px', borderRadius:'3px',
              color: gc.text, background: gc.bg, border:`1px solid ${gc.border}`,
            }}>
              {project.genre}
            </span>
          </div>
          <h3 style={{ fontSize:'15px', fontWeight:900, color:'#fef3c7', margin:0, lineHeight:1.2, fontFamily:'Georgia, serif' }}>
            {project.title}
          </h3>
          <p style={{ fontSize:'11px', color:'rgba(253,186,74,0.6)', margin:'2px 0 0', fontFamily:'sans-serif' }}>
            {project.subtitle}
          </p>
        </div>

        {/* stars */}
        <div style={{ display:'flex', alignItems:'center', gap:'3px', flexShrink:0 }}>
          <Star style={{ width:'12px', height:'12px', color:'#d97706', fill:'rgba(217,119,6,0.5)' }} />
          <span style={{ fontSize:'11px', fontWeight:700, color:'#d97706', fontFamily:'monospace' }}>{project.stars}</span>
        </div>
      </div>

      {/* description */}
      <p style={{ fontSize:'12px', color:'rgba(253,230,138,0.55)', lineHeight:1.7, fontFamily:'sans-serif', margin:'0 0 10px' }}>
        {project.description}
      </p>

      {/* tech tags */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'14px' }}>
        {project.tags.map(tag => (
          <span key={tag} style={{
            fontSize:'10px', fontFamily:'monospace',
            padding:'2px 8px', borderRadius:'3px',
            color:'rgba(217,119,6,0.85)', background:'#0f0804',
            border:'1px solid rgba(120,53,15,0.45)',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* footer row */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderTop:'1px solid rgba(120,53,15,0.25)', paddingTop:'10px',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'5px', color:'rgba(120,53,15,0.85)' }}>
          <Clock style={{ width:'12px', height:'12px' }} />
          <span style={{ fontSize:'11px', fontFamily:'monospace' }}>{project.duration}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
          {/* GitHub */}
          <div style={{
            width:'26px', height:'26px', borderRadius:'50%',
            background:'rgba(28,20,14,0.9)', border:'1px solid rgba(120,53,15,0.45)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Github style={{ width:'12px', height:'12px', color:'#fbbf24' }} />
          </div>
          {/* Live btn */}
          <div style={{
            display:'flex', alignItems:'center', gap:'5px',
            padding:'5px 12px', background:'#d97706', borderRadius:'999px', cursor:'pointer',
          }}>
            <span style={{ fontSize:'10px', fontWeight:700, color:'#0a0502', fontFamily:'sans-serif', textTransform:'uppercase', letterSpacing:'0.06em' }}>
              Listen Live
            </span>
            <ExternalLink style={{ width:'9px', height:'9px', color:'#0a0502' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop-only sidebar that renders all projects as a clickable track listing,
 * styled after vinyl record liner notes. Visible only on `lg` screens and above.
 *
 * @param {Object[]}  projects         - Full list of project objects to display.
 * @param {number}    activeId         - ID of the currently selected project.
 * @param {Function}  onSelect         - Callback invoked with the selected project ID.
 * @returns {JSX.Element} A vertical nav list of track entries.
 */
function TracklistSidebar({ projects, activeId, onSelect }) {
  return (
    <div className="hidden lg:flex flex-col gap-1 shrink-0" style={{ width:'220px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'#d97706', marginBottom:'16px', padding:'0 8px' }}>
        <ListMusic style={{ width:'14px', height:'14px' }} />
        <span style={{ fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'rgba(253,186,74,0.7)', fontFamily:'monospace' }}>
          Track Listing
        </span>
      </div>
      {projects.map(p => {
        const isActive = activeId === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            style={{
              display:'flex', alignItems:'center', gap:'10px',
              padding:'8px 10px', borderRadius:'8px', textAlign:'left',
              background: isActive ? 'rgba(120,53,15,0.4)' : 'transparent',
              border: isActive ? '1px solid rgba(217,119,6,0.45)' : '1px solid transparent',
              color: isActive ? '#fef3c7' : 'rgba(253,186,74,0.65)',
              cursor:'pointer', width:'100%', transition:'all 0.15s',
            }}
          >
            <span style={{ fontSize:'10px', fontWeight:700, fontFamily:'monospace', color:'rgba(120,53,15,0.9)', width:'18px', flexShrink:0 }}>
              {p.trackNumber}
            </span>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:'11px', fontWeight:700, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</p>
              <p style={{ fontSize:'10px', color:'rgba(217,119,6,0.5)', margin:0, fontFamily:'monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.genre}</p>
            </div>
            {isActive && <ChevronRight style={{ width:'12px', height:'12px', color:'#fbbf24', flexShrink:0 }} />}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Projects section for the Music Vinyl portfolio theme.
 *
 * Renders a full-viewport dark section with:
 * - A spinning hero vinyl and gradient heading.
 * - Genre filter pills (All / Full-Stack / Backend / Frontend / AI/ML).
 * - A responsive project card grid (1 col → 2 col on md+).
 * - A desktop track-listing sidebar (lg+).
 * - A footer CTA linking to the full GitHub catalog.
 *
 * All background colours are applied via inline styles to ensure correct
 * rendering regardless of Tailwind's JIT purge configuration.
 *
 * @returns {JSX.Element} The full Projects section element.
 */
export default function Projects() {
  const [activeId, setActiveId] = useState(PROJECTS[0].id);
  const [filter, setFilter]     = useState('All');

  const genres   = ['All', ...Array.from(new Set(PROJECTS.map(p => p.genre)))];
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.genre === filter);

  return (
    <section
      style={{
        width:'100%', minHeight:'100vh',
        background:'linear-gradient(135deg, #2c1b12 0%, #1a0f0a 55%, #0a0502 100%)',
        color:'#fef3c7',
        padding:'80px 16px',
        fontFamily:'Georgia, serif',
        overflow:'hidden',
        boxSizing:'border-box',
      }}
      className="sm:px-8 md:px-12 lg:px-20"
    >
      {/* spinning hero vinyl animation */}
      <style>{`
        @keyframes hero-spin { to { transform: rotate(360deg); } }
        @keyframes vinyl-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth:'1280px', margin:'0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ display:'flex', alignItems:'center', gap:'28px', marginBottom:'60px', flexWrap:'wrap' }}>
          {/* hero vinyl */}
          <div style={{
            width:'110px', height:'110px', borderRadius:'50%',
            background:'#0d0805', border:'4px solid #3f2e20',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 40px rgba(217,119,6,0.2)',
            animation:'hero-spin 8s linear infinite',
            flexShrink:0,
          }}>
            <div style={{ width:'100%', height:'100%', borderRadius:'50%', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ position:'absolute', inset:'5%',  borderRadius:'50%', border:'1px solid rgba(255,255,255,0.05)' }} />
              <div style={{ position:'absolute', inset:'12%', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)' }} />
              <div style={{ position:'absolute', inset:'21%', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)' }} />
              <div style={{ position:'absolute', inset:'32%', borderRadius:'50%', border:'1px solid rgba(255,255,255,0.04)' }} />
              <div style={{
                width:'34%', height:'34%', borderRadius:'50%', zIndex:2,
                background:'linear-gradient(135deg, #d97706, #c2410c)',
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'3px solid rgba(120,53,15,0.5)',
              }}>
                <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#d1d5db' }} />
              </div>
              <div style={{
                position:'absolute', inset:0, borderRadius:'50%',
                background:'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
                pointerEvents:'none',
              }} />
            </div>
          </div>

          {/* title text */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'#d97706', marginBottom:'8px' }}>
              <Headphones style={{ width:'16px', height:'16px' }} />
              <span style={{ fontSize:'12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.14em', fontFamily:'monospace' }}>
                Discography
              </span>
            </div>
            <h2 style={{
              fontSize:'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight:900, letterSpacing:'-0.03em', lineHeight:1.05,
              margin:0,
              background:'linear-gradient(90deg, #fde68a, #fb923c)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              fontFamily:'Georgia, serif',
            }}>
              Featured<br />Releases
            </h2>
            <p style={{ marginTop:'10px', color:'rgba(253,230,138,0.5)', fontFamily:'sans-serif', fontSize:'14px', lineHeight:1.6, maxWidth:'500px' }}>
              A curated collection of projects pressed to wax — each track engineered for maximum impact and minimal noise.
            </p>
          </div>
        </div>

        {/* ── GENRE FILTER ── */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'28px' }}>
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              style={{
                padding:'5px 16px', borderRadius:'999px', cursor:'pointer',
                fontFamily:'monospace', fontSize:'11px', fontWeight:700,
                textTransform:'uppercase', letterSpacing:'0.1em',
                transition:'all 0.15s', border:'none',
                background: filter === g ? '#d97706' : 'transparent',
                color:       filter === g ? '#0a0502' : 'rgba(253,186,74,0.7)',
                outline: filter === g ? 'none' : '1px solid rgba(120,53,15,0.55)',
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* ── LAYOUT: sidebar + grid ── */}
        <div style={{ display:'flex', gap:'32px' }}>
          <TracklistSidebar projects={filtered} activeId={activeId} onSelect={setActiveId} />

          {/* grid */}
          <div style={{ flex:1, minWidth:0 }}>
            {filtered.length > 0 ? (
              <div
                style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
                  gap:'14px',
                }}
              >
                {filtered.map(project => (
                  <div key={project.id} onClick={() => setActiveId(project.id)}>
                    <TrackCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'80px 0', color:'rgba(120,53,15,0.7)' }}>
                <Disc3 style={{ width:'48px', height:'48px', marginBottom:'12px', opacity:0.4 }} />
                <p style={{ fontFamily:'sans-serif', fontSize:'13px' }}>No tracks found in this genre.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER CTA ── */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexWrap:'wrap', gap:'12px',
          marginTop:'60px', paddingTop:'24px',
          borderTop:'1px solid rgba(120,53,15,0.3)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'rgba(120,53,15,0.85)' }}>
            <Layers style={{ width:'16px', height:'16px' }} />
            <span style={{ fontFamily:'sans-serif', fontSize:'13px' }}>{PROJECTS.length} tracks pressed &amp; mastered</span>
          </div>
          <a
            href="#"
            style={{
              display:'flex', alignItems:'center', gap:'8px',
              padding:'10px 20px',
              border:'1px solid rgba(217,119,6,0.5)', borderRadius:'999px',
              color:'#fbbf24', textDecoration:'none',
              fontFamily:'sans-serif', fontSize:'12px', fontWeight:700,
              textTransform:'uppercase', letterSpacing:'0.08em',
              transition:'all 0.15s',
            }}
          >
            <Github style={{ width:'14px', height:'14px' }} />
            <span>Full Catalog on GitHub</span>
            <ExternalLink style={{ width:'12px', height:'12px', opacity:0.7 }} />
          </a>
        </div>

      </div>
    </section>
  );
}