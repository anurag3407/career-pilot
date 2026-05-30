import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  Star, Code2, Globe, Layers, Cpu, Terminal,
  ChevronDown, Menu, X, Send, Zap,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/* ─── REFINED COLOUR SYSTEM ─── */
const C = {
  bg:      '#05030f',           // deep indigo-black
  aurora1: '#7b5ea7',           // soft violet
  aurora2: '#c084fc',           // lavender-purple
  aurora3: '#f472b6',           // rose pink
  aurora4: '#38bdf8',           // sky blue
  aurora5: '#34d399',           // emerald mint
  aurora6: '#fb923c',           // warm amber
  aurora7: '#e879f9',           // fuchsia
};

const createSeededRandom = (seed) => {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6D2B79F5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/* ─── GLOBAL CSS ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;600;800;900&family=Share+Tech+Mono&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  .pu-root{cursor:none;background:#05030f;min-height:100vh;overflow-x:hidden;overflow-y:auto;}
  .pu-root::-webkit-scrollbar{width:3px;}
  .pu-root::-webkit-scrollbar-track{background:#05030f;}
  .pu-root::-webkit-scrollbar-thumb{background:linear-gradient(#7b5ea7,#c084fc);border-radius:99px;}

  @keyframes shimmer{0%{background-position:-400px 0;}100%{background-position:400px 0;}}
  @keyframes scan{0%,100%{top:0;opacity:.5;}50%{top:calc(100% - 2px);opacity:.08;}}
  @keyframes twinkle{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.2;transform:scale(.4);}}
  @keyframes pulse-out{0%{transform:scale(1);opacity:.6;}100%{transform:scale(1.5);opacity:0;}}
  @keyframes float-up{0%{transform:translateY(0);opacity:0;}30%{opacity:1;}100%{transform:translateY(-80px);opacity:0;}}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes spin-rev{from{transform:rotate(0deg);}to{transform:rotate(-360deg);}}

  .aurora-text{
    background:linear-gradient(90deg,#c084fc,#f472b6,#38bdf8,#34d399,#fb923c,#e879f9,#c084fc);
    background-size:350%;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:shimmer 6s linear infinite;
  }
  .card-cosmic{
    background:linear-gradient(135deg,rgba(123,94,167,.04),rgba(192,132,252,.03));
    border:1px solid rgba(123,94,167,.12);
    backdrop-filter:blur(16px);
    position:relative;
    overflow:hidden;
    transition:border-color .4s,box-shadow .4s;
  }
  .card-cosmic::after{
    content:'';position:absolute;inset:0;border-radius:inherit;
    background:linear-gradient(135deg,rgba(192,132,252,.07),transparent 40%,rgba(244,114,182,.06));
    opacity:0;transition:opacity .4s;pointer-events:none;
  }
  .card-cosmic:hover::after{opacity:1;}
  .scan-line{
    position:absolute;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(192,132,252,.35),transparent);
    animation:scan 4s ease-in-out infinite;
    pointer-events:none;z-index:10;
  }
  .lc2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .lc3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
  @media(max-width:768px){.hide-mob{display:none!important;}.show-mob{display:block!important;}}
  @media(min-width:769px){.show-mob{display:none!important;}}
`;

/* ─── CUSTOM CURSOR ─── */
function CosmicCursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const pos  = useRef({ x: 0, y: 0 });
  const cur  = useRef({ x: 0, y: 0 });
  const raf  = useRef(null);

  useEffect(() => {
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', move);
    const tick = () => {
      cur.current.x += (pos.current.x - cur.current.x) * 0.13;
      cur.current.y += (pos.current.y - cur.current.y) * 0.13;
      if (dot.current)  dot.current.style.transform  = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      if (ring.current) ring.current.style.transform = `translate(${cur.current.x - 18}px,${cur.current.y - 18}px)`;
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dot} style={{ position:'fixed',top:0,left:0,width:8,height:8,borderRadius:'50%',
        background:C.aurora2,boxShadow:`0 0 12px ${C.aurora2},0 0 24px ${C.aurora7}80`,
        pointerEvents:'none',zIndex:9999,willChange:'transform' }} />
      <div ref={ring} style={{ position:'fixed',top:0,left:0,width:36,height:36,borderRadius:'50%',
        border:`1.5px solid ${C.aurora2}50`,
        pointerEvents:'none',zIndex:9999,willChange:'transform' }} />
    </>
  );
}

/* ─── ENHANCED PARTICLE FIELD (replaces DataStreams + old ParticleField) ─── */
function ParticleField() {
  const ref   = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf   = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx    = canvas.getContext('2d');
    let W, H;
    let particles = [], nebulae = [], rings = [];
    const handleMouseMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    // Refined aurora palette — softer, richer
    const PALETTE = [
      [123, 94,167],   // violet
      [192,132,252],   // lavender
      [244,114,182],   // rose
      [ 56,189,248],   // sky
      [ 52,211,153],   // emerald
      [251,146, 60],   // amber
      [232,121,249],   // fuchsia
    ];

    // Nebula clouds — slow drifting colour washes
    nebulae = Array.from({ length: 7 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      rx: 200 + Math.random() * 320, ry: 120 + Math.random() * 200,
      col: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      alpha: 0.010 + Math.random() * 0.018,
      dvx: (Math.random() - .5) * .10, dvy: (Math.random() - .5) * .07,
    }));

    // Floating ring halos — large gentle rings scattered across canvas
    rings = Array.from({ length: 5 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 80 + Math.random() * 180,
      col: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      alpha: 0.018 + Math.random() * 0.025,
      dvx: (Math.random() - .5) * .06, dvy: (Math.random() - .5) * .04,
      rot: 0, drot: (Math.random() - .5) * 0.004,
    }));

    class Star {
      constructor(type = 'normal') { this.type = type; this.init(); }
      init() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.bx = this.x; this.by = this.y;
        this.vx = (Math.random() - .5) * .5; this.vy = (Math.random() - .5) * .5;
        const base = this.type === 'giant' ? 2.2 + Math.random() * 2 :
                     this.type === 'micro'  ? .3 + Math.random() * .5 :
                     0.6 + Math.random() * 1.6;
        this.r   = base;
        this.col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        this.al  = this.type === 'micro' ? .12 + Math.random() * .28 : .25 + Math.random() * .55;
        this.ph  = Math.random() * Math.PI * 2;
        this.spd = .012 + Math.random() * .035;
        this.tail = []; this.maxT = this.type === 'giant' ? 16 : 0;

        // Extra: cursor-reactive strength
        this.reactStr = this.type === 'giant' ? 3.2 : this.type === 'micro' ? .8 : 1.8;
      }
      update() {
        const { x: mx, y: my } = mouse.current;
        const dx = mx - this.x, dy = my - this.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        const R  = this.type === 'giant' ? 220 : this.type === 'micro' ? 80 : 140;
        if (d < R && d > 0) {
          const f = (R - d) / R;
          // Particles flow around cursor like fluid
          const perp = { x: -dy / d, y: dx / d };
          this.vx -= (dx / d) * f * this.reactStr * .6;
          this.vy -= (dy / d) * f * this.reactStr * .6;
          this.vx += perp.x * f * this.reactStr * .4;
          this.vy += perp.y * f * this.reactStr * .4;
        }
        this.vx += (this.bx - this.x) * .003;
        this.vy += (this.by - this.y) * .003;
        this.vx *= .92; this.vy *= .92;
        if (this.maxT) { this.tail.push({ x: this.x, y: this.y }); if (this.tail.length > this.maxT) this.tail.shift(); }
        this.x += this.vx; this.y += this.vy;
        this.ph += this.spd;
        if (this.x < -80 || this.x > W + 80 || this.y < -80 || this.y > H + 80) {
          this.bx = Math.random() * W; this.by = Math.random() * H;
          this.x = this.bx; this.y = this.by; this.tail = [];
        }
      }
      draw() {
        const tw = .45 + .55 * Math.sin(this.ph);
        const [r, g, b] = this.col;
        const a = this.al * tw;

        // Comet tail for giants
        if (this.tail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(this.tail[0].x, this.tail[0].y);
          for (let i = 1; i < this.tail.length; i++) ctx.lineTo(this.tail[i].x, this.tail[i].y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${a * .4})`;
          ctx.lineWidth   = this.r * .5;
          ctx.stroke();
        }

        // Soft glow halo
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 8);
        grd.addColorStop(0,   `rgba(${r},${g},${b},${a})`);
        grd.addColorStop(.3,  `rgba(${r},${g},${b},${a * .18})`);
        grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 8, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();

        // Core dot
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, a * 1.4)})`; ctx.fill();

        // Bright core for giants
        if (this.type === 'giant') {
          ctx.beginPath(); ctx.arc(this.x, this.y, this.r * .4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${tw * .8})`; ctx.fill();
        }
      }
    }

    const N = Math.min(200, Math.floor(W * H / 4800));
    for (let i = 0; i < N; i++) particles.push(new Star('normal'));
    for (let i = 0; i < 12; i++) particles.push(new Star('giant'));
    for (let i = 0; i < N * .6; i++) particles.push(new Star('micro'));

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      // Nebula washes
      nebulae.forEach(n => {
        n.x += n.dvx; n.y += n.dvy;
        if (n.x < -n.rx) n.x = W + n.rx;
        if (n.x > W + n.rx) n.x = -n.rx;
        const [r, g, b] = n.col;
        const gn = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.rx);
        gn.addColorStop(0,  `rgba(${r},${g},${b},${n.alpha * 2})`);
        gn.addColorStop(.5, `rgba(${r},${g},${b},${n.alpha})`);
        gn.addColorStop(1,  `rgba(${r},${g},${b},0)`);
        ctx.save(); ctx.scale(1, n.ry / n.rx);
        ctx.beginPath(); ctx.arc(n.x, n.y * n.rx / n.ry, n.rx, 0, Math.PI * 2);
        ctx.fillStyle = gn; ctx.fill(); ctx.restore();
      });

      // Floating ring halos
      rings.forEach(rr => {
        rr.x += rr.dvx; rr.y += rr.dvy;
        rr.rot += rr.drot;
        if (rr.x < -rr.r) rr.x = W + rr.r;
        if (rr.x > W + rr.r) rr.x = -rr.r;
        const [r, g, b] = rr.col;
        ctx.save();
        ctx.translate(rr.x, rr.y);
        ctx.rotate(rr.rot);
        ctx.scale(1, 0.38);
        ctx.beginPath(); ctx.arc(0, 0, rr.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${rr.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // Update particles
      particles.forEach(p => p.update());

      // Constellation connectors
      const mains = particles.filter(p => p.type !== 'micro');
      for (let i = 0; i < mains.length; i++) {
        for (let j = i + 1; j < mains.length; j++) {
          const dx = mains[i].x - mains[j].x, dy = mains[i].y - mains[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          const M  = (mains[i].type === 'giant' || mains[j].type === 'giant') ? 200 : 130;
          if (d < M) {
            const ratio = 1 - d / M;
            const [r, g, b] = mains[i].col;
            ctx.beginPath();
            ctx.moveTo(mains[i].x, mains[i].y);
            ctx.lineTo(mains[j].x, mains[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${ratio * .22})`;
            ctx.lineWidth   = ratio * (mains[i].type === 'giant' ? 1.4 : .55);
            ctx.stroke();
          }
        }
      }

      // Cursor aura — two-tone
      const { x: mx, y: my } = mouse.current;
      if (mx > 0) {
        const aura = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        aura.addColorStop(0, 'rgba(192,132,252,.08)');
        aura.addColorStop(.45, 'rgba(244,114,182,.03)');
        aura.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(mx, my, 200, 0, Math.PI * 2);
        ctx.fillStyle = aura; ctx.fill();

        // Cursor spark ring
        ctx.beginPath(); ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(192,132,252,.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      particles.forEach(p => p.draw());
      raf.current = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={ref} style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',mixBlendMode:'screen' }} />;
}

/* ─── MINI BURST PARTICLES ─── */
function MiniBurst({ color = C.aurora2, active = false, count = 14 }) {
  const dots = useMemo(() => {
    const rand = createSeededRandom(count * 101);
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * 360,
      dist: 22 + rand() * 35,
      dur: 1 + rand() * .8,
      delay: rand() * .3,
      sz: 2 + rand() * 3,
    }));
  }, [count]);
  if (!active) return null;
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',zIndex:20 }}>
      {dots.map((d, i) => (
        <motion.div key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ opacity: 0, x: Math.cos(d.angle * Math.PI / 180) * d.dist, y: Math.sin(d.angle * Math.PI / 180) * d.dist, scale: 0 }}
          transition={{ duration: d.dur, delay: d.delay, ease: 'easeOut' }}
          style={{ position:'absolute',top:'50%',left:'50%',width:d.sz,height:d.sz,
            borderRadius:'50%',background:color,boxShadow:`0 0 8px ${color}`,
            marginTop:-d.sz/2,marginLeft:-d.sz/2 }} />
      ))}
    </div>
  );
}

/* ─── ORBITING DOT RING ─── */
function OrbitRing({ radius = 100, count = 8, color = C.aurora2, dur = 20, size = 2.5 }) {
  const dots = useMemo(() => {
    const rand = createSeededRandom(count * 211 + Math.round(size * 100));
    return Array.from({ length: count }, (_, i) => ({
      startAngle: (i / count) * 360,
      r: size * (.6 + rand() * .8),
      al: .4 + rand() * .5,
    }));
  }, [count, size]);

  return (
    <div style={{ position:'absolute',width:radius*2,height:radius*2,pointerEvents:'none' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
        style={{ width:'100%',height:'100%',position:'relative' }}>
        {dots.map((d, i) => {
          const rad = (d.startAngle * Math.PI) / 180;
          return (
            <div key={i} style={{
              position:'absolute',
              top:  radius - d.r + radius * Math.sin(rad),
              left: radius - d.r + radius * Math.cos(rad),
              width: d.r * 2, height: d.r * 2, borderRadius: '50%',
              background: color, opacity: d.al,
              boxShadow: `0 0 ${d.r * 5}px ${color}`,
            }} />
          );
        })}
      </motion.div>
      <div style={{ position:'absolute',inset:0,borderRadius:'50%',border:`1px solid ${color}18` }} />
    </div>
  );
}

/* ─── FLOATING PARTICLES ─── */
function FloatParticles({ color = C.aurora2, count = 6 }) {
  const items = useMemo(() => {
    const rand = createSeededRandom(count * 313);
    return Array.from({ length: count }, () => ({
      left: 5 + rand() * 90,
      dur: 2.2 + rand() * 2.8,
      delay: rand() * 2.5,
      sz: 2 + rand() * 3,
    }));
  }, [count]);
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden',zIndex:2 }}>
      {items.map((p, i) => (
        <motion.div key={i}
          style={{ position:'absolute',bottom:0,left:`${p.left}%`,
            width:p.sz,height:p.sz,borderRadius:'50%',
            background:color,boxShadow:`0 0 8px ${color}` }}
          animate={{ y:[0,-50,-90],opacity:[0,.9,0],scale:[0,1,0] }}
          transition={{ duration:p.dur,delay:p.delay,repeat:Infinity,ease:'easeOut' }} />
      ))}
    </div>
  );
}

/* ─── HEX GRID ─── */
function HexGrid({ opacity = .05 }) {
  return (
    <div style={{ position:'absolute',inset:0,pointerEvents:'none',overflow:'hidden',opacity }}>
      <svg width="100%" height="100%">
        <defs>
          <pattern id="hex-pat" x="0" y="0" width="70" height="60" patternUnits="userSpaceOnUse">
            <polygon points="35,3 67,20 67,54 35,71 3,54 3,20"
              fill="none" stroke={C.aurora2} strokeWidth=".5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-pat)" />
      </svg>
    </div>
  );
}

/* ─── NAV ─── */
const NAV_LINKS = ['About','Skills','Projects','Experience','Testimonials','Contact'];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .85, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(5,3,15,.90)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? `1px solid ${C.aurora1}14` : 'none',
        transition: 'all .4s',
      }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ cursor: 'pointer', userSelect: 'none' }}>
          <span className="aurora-text" style={{ fontFamily:'Exo 2',fontWeight:900,fontSize:22,letterSpacing:4 }}>
            {(data.personal?.name || 'DEV').split(' ')[0].toUpperCase()}
          </span>
          <span style={{ color:`${C.aurora2}50`,fontSize:12,marginLeft:4,fontFamily:'Share Tech Mono' }}>.exe</span>
        </div>

        <ul className="hide-mob" style={{ display:'flex',gap:36,listStyle:'none' }}>
          {NAV_LINKS.map(l => (
            <li key={l}>
              <button onClick={() => go(l)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,.38)', fontSize: 11,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                fontFamily: 'Share Tech Mono', transition: 'color .3s',
              }}
                onMouseEnter={e => { e.target.style.color = C.aurora2; e.target.style.textShadow = `0 0 12px ${C.aurora2}`; }}
                onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,.38)'; e.target.style.textShadow = 'none'; }}>
                {l}
              </button>
            </li>
          ))}
        </ul>

        <button className="show-mob" onClick={() => setOpen(!open)}
          style={{ background:'none',border:'none',cursor:'pointer',color:'white' }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ background:'rgba(5,3,15,.97)',borderBottom:`1px solid ${C.aurora1}12`,overflow:'hidden' }}>
            <div style={{ padding: '18px 28px', display:'flex', flexDirection:'column', gap: 18 }}>
              {NAV_LINKS.map(l => (
                <button key={l} onClick={() => go(l)}
                  style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.55)',
                    fontSize:13,letterSpacing:'0.2em',textAlign:'left',fontFamily:'Share Tech Mono',textTransform:'uppercase' }}>
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─── SECTION WRAPPER ─── */
function Sec({ id, children, bg = 'transparent' }) {
  return (
    <section id={id} style={{ position:'relative',zIndex:10,padding:'120px 24px',background:bg }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

function SecTitle({ tag, title, sub }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: .7 }}
      style={{ textAlign: 'center', marginBottom: 80 }}>
      <div style={{ display:'inline-flex',alignItems:'center',gap:10,
        padding:'7px 20px',borderRadius:999,
        border:`1px solid ${C.aurora2}28`,background:`${C.aurora1}09`,marginBottom:22 }}>
        <motion.div animate={{ scale:[1,1.4,1],opacity:[1,.4,1] }} transition={{ duration:1.8,repeat:Infinity }}
          style={{ width:5,height:5,borderRadius:'50%',background:C.aurora2,boxShadow:`0 0 8px ${C.aurora2}` }} />
        <span style={{ fontFamily:'Share Tech Mono',fontSize:11,letterSpacing:'0.35em',
          color:C.aurora2,textTransform:'uppercase' }}>{tag}</span>
        <motion.div animate={{ scale:[1,1.4,1],opacity:[1,.4,1] }} transition={{ duration:1.8,repeat:Infinity,delay:.9 }}
          style={{ width:5,height:5,borderRadius:'50%',background:C.aurora7,boxShadow:`0 0 8px ${C.aurora7}` }} />
      </div>

      <h2 className="aurora-text" style={{ fontFamily:'Exo 2',fontWeight:900,
        fontSize:'clamp(36px,5vw,68px)',lineHeight:1.05,display:'block',marginBottom:16 }}>
        {title}
      </h2>
      {sub && <p style={{ color:'rgba(255,255,255,.35)',maxWidth:500,margin:'0 auto',
        fontSize:15,lineHeight:1.8,fontFamily:'Rajdhani' }}>{sub}</p>}

      <div style={{ marginTop:26,display:'flex',alignItems:'center',justifyContent:'center',gap:12 }}>
        <div style={{ height:1,width:60,background:`linear-gradient(90deg,transparent,${C.aurora2})` }} />
        <div style={{ width:7,height:7,borderRadius:'50%',background:C.aurora7,
          boxShadow:`0 0 14px ${C.aurora7},0 0 28px ${C.aurora7}50` }} />
        <div style={{ height:1,width:60,background:`linear-gradient(90deg,${C.aurora2},transparent)` }} />
      </div>
    </motion.div>
  );
}

/* ─── HERO ─── */
function Hero() {
  const { personal, socials, stats } = data;
  const [burst, setBurst] = useState(false);

  const fireBurst = (id) => {
    setBurst(true);
    setTimeout(() => setBurst(false), 1400);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section style={{ position:'relative',zIndex:10,minHeight:'100vh',overflow:'hidden',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      padding:'100px 24px 60px',textAlign:'center' }}>

      <HexGrid opacity={.028} />

      {/* Orbital decoration rings */}
      {[
        { r:260, n:14, c:C.aurora2, dur:42, sz:2   },
        { r:350, n:9,  c:C.aurora7, dur:62, sz:3   },
        { r:430, n:22, c:C.aurora4, dur:28, sz:1.5 },
        { r:520, n:6,  c:C.aurora3, dur:75, sz:4   },
      ].map((o, i) => (
        <div key={i} style={{ position:'absolute',top:'50%',left:'50%',
          transform:`translate(-50%,-50%)`,pointerEvents:'none',zIndex:0 }}>
          <OrbitRing radius={o.r} count={o.n} color={o.c} dur={o.dur} size={o.sz} />
        </div>
      ))}

      {/* Avatar */}
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type:'spring',stiffness:110,damping:13,delay:.2 }}
        style={{ position:'relative',marginBottom:32,zIndex:5 }}>
        <div style={{ position:'relative',width:170,height:170 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 11, repeat: Infinity, ease:'linear' }}
            style={{ position:'absolute',inset:-4,borderRadius:'50%',padding:3,
              background:`conic-gradient(${C.aurora2},${C.aurora7},${C.aurora3},${C.aurora4},${C.aurora5},${C.aurora2})` }}>
            <div style={{ borderRadius:'50%',background:C.bg,width:'100%',height:'100%' }} />
          </motion.div>
          <img src={personal?.avatar} alt={personal?.name}
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personal?.name || 'Dev')}&background=7b5ea7&color=ffffff&size=200&bold=true`; }}
            style={{ position:'absolute',inset:6,width:'calc(100% - 12px)',height:'calc(100% - 12px)',
              borderRadius:'50%',objectFit:'cover',zIndex:3 }} />
          {[1, 1.5, 2].map((scale, i) => (
            <motion.div key={i}
              animate={{ scale:[1,1+scale*.18],opacity:[.45,0] }}
              transition={{ duration:2.4,delay:i*.6,repeat:Infinity,ease:'easeOut' }}
              style={{ position:'absolute',inset:-6*i-4,borderRadius:'50%',
                border:`1.5px solid ${[C.aurora2,C.aurora4,C.aurora7][i]}`,pointerEvents:'none' }} />
          ))}
          <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:4 }}>
            <OrbitRing radius={96} count={5} color={C.aurora3} dur={9} size={3.5} />
          </div>
        </div>
      </motion.div>

      {/* Available badge */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:.5 }}
        style={{ display:'inline-flex',alignItems:'center',gap:8,
          padding:'6px 18px',borderRadius:999,
          border:`1px solid ${C.aurora5}45`,background:`${C.aurora5}10`,marginBottom:24 }}>
        <motion.div animate={{ scale:[1,1.4,1],opacity:[1,.5,1] }} transition={{ duration:1.3,repeat:Infinity }}
          style={{ width:7,height:7,borderRadius:'50%',background:C.aurora5,boxShadow:`0 0 12px ${C.aurora5}` }} />
        <span style={{ fontFamily:'Share Tech Mono',fontSize:11,letterSpacing:'0.32em',
          color:C.aurora5,textTransform:'uppercase' }}>Available for Projects</span>
      </motion.div>

      {/* Name */}
      <motion.h1 initial={{ opacity:0,y:50 }} animate={{ opacity:1,y:0 }}
        transition={{ delay:.4,duration:1 }}
        style={{ fontFamily:'Exo 2',fontWeight:900,
          fontSize:'clamp(48px,9vw,120px)',lineHeight:.92,marginBottom:14,zIndex:2,
          letterSpacing:'-0.03em' }}>
        <span className="aurora-text">{personal?.name || 'Your Name'}</span>
      </motion.h1>

      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.68 }}
        style={{ display:'flex',alignItems:'center',gap:14,marginBottom:14,justifyContent:'center' }}>
        <div style={{ height:1,width:45,background:`linear-gradient(90deg,transparent,${C.aurora7})` }} />
        <p style={{ fontFamily:'Share Tech Mono',fontSize:13,letterSpacing:'0.28em',
          color:C.aurora7,textTransform:'uppercase',
          textShadow:`0 0 14px ${C.aurora7}70` }}>
          {personal?.title || 'Creative Developer'}
        </p>
        <div style={{ height:1,width:45,background:`linear-gradient(90deg,${C.aurora7},transparent)` }} />
      </motion.div>

      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.82 }}
        style={{ color:'rgba(255,255,255,.30)',maxWidth:520,fontSize:15,lineHeight:1.85,
          marginBottom:44,fontFamily:'Rajdhani',fontWeight:400 }}>
        {(personal?.bio || '').substring(0, 160)}…
      </motion.p>

      {/* Stats strip */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:.95 }}
        style={{ display:'flex',borderRadius:18,overflow:'hidden',
          border:`1px solid ${C.aurora1}18`,background:`${C.aurora1}05`,marginBottom:48 }}>
        {[
          { v: stats?.yearsExperience, l: 'Years Exp', c: C.aurora2 },
          { v: stats?.projectsCompleted, l: 'Projects',  c: C.aurora3 },
          { v: stats?.happyClients,      l: 'Clients',   c: C.aurora4 },
        ].map(({ v, l, c }, i) => (
          <div key={l} style={{ padding:'22px 38px',textAlign:'center',position:'relative',
            borderRight: i < 2 ? `1px solid ${C.aurora1}12` : 'none' }}>
            <FloatParticles color={c} count={3} />
            <div style={{ fontFamily:'Exo 2',fontWeight:900,fontSize:40,
              color:c,lineHeight:1,textShadow:`0 0 24px ${c}55` }}>{v}+</div>
            <div style={{ fontFamily:'Share Tech Mono',fontSize:9,color:'rgba(255,255,255,.28)',
              letterSpacing:'0.3em',textTransform:'uppercase',marginTop:5 }}>{l}</div>
          </div>
        ))}
      </motion.div>

      {/* CTA buttons */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
        style={{ display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center',zIndex:2 }}>
        <motion.button whileHover={{ scale:1.06,y:-3 }} whileTap={{ scale:.96 }}
          onClick={() => fireBurst('projects')}
          style={{ position:'relative',padding:'15px 40px',borderRadius:50,overflow:'hidden',
            background:`linear-gradient(135deg,${C.aurora1},${C.aurora2},${C.aurora7})`,
            border:'none',cursor:'pointer',
            color:'white',fontFamily:'Exo 2',fontWeight:800,fontSize:14,letterSpacing:'0.18em',textTransform:'uppercase',
            boxShadow:`0 0 35px ${C.aurora2}40,0 0 70px ${C.aurora7}18` }}>
          <MiniBurst color={C.aurora2} active={burst} />
          <span style={{ position:'relative',zIndex:1 }}>Explore Work</span>
        </motion.button>
        <motion.button whileHover={{ scale:1.06,y:-3 }} whileTap={{ scale:.96 }}
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' })}
          style={{ padding:'15px 40px',borderRadius:50,
            background:'transparent',border:`1.5px solid ${C.aurora3}50`,cursor:'pointer',
            color:C.aurora3,fontFamily:'Exo 2',fontWeight:700,fontSize:14,
            letterSpacing:'0.18em',textTransform:'uppercase',
            boxShadow:`0 0 22px ${C.aurora3}15`,transition:'all .35s' }}
          onMouseEnter={e => { e.currentTarget.style.background=`${C.aurora3}12`; e.currentTarget.style.boxShadow=`0 0 35px ${C.aurora3}38`; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.boxShadow=`0 0 22px ${C.aurora3}15`; }}>
          Beam Me In
        </motion.button>
      </motion.div>

      {/* Social links */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.28 }}
        style={{ display:'flex',gap:14,marginTop:36,flexWrap:'wrap',justifyContent:'center' }}>
        {[
          { Icon: Github,   href: socials?.github,              c: C.aurora2 },
          { Icon: Linkedin, href: socials?.linkedin,            c: C.aurora4 },
          { Icon: Twitter,  href: socials?.twitter,             c: C.aurora7 },
          { Icon: Mail,     href: `mailto:${socials?.email}`,   c: C.aurora3 },
        ].filter(s => s.href).map(({ Icon, href, c }, i) => (
          <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer"
            whileHover={{ scale:1.18,y:-4 }}
            style={{ width:44,height:44,borderRadius:'50%',
              border:`1px solid ${c}30`,background:`${c}0c`,
              display:'flex',alignItems:'center',justifyContent:'center',
              color:c,textDecoration:'none',transition:'all .3s',position:'relative',overflow:'hidden' }}>
            <FloatParticles color={c} count={2} />
            <Icon size={16} style={{ position:'relative',zIndex:2 }} />
          </motion.a>
        ))}
      </motion.div>

      <motion.div animate={{ y:[0,10,0] }} transition={{ duration:2,repeat:Infinity }}
        style={{ position:'absolute',bottom:38,left:'50%',transform:'translateX(-50%)' }}>
        <ChevronDown size={22} style={{ color:`${C.aurora2}40` }} />
      </motion.div>
    </section>
  );
}

/* ─── ABOUT ─── */
function About() {
  const { personal, socials } = data;
  return (
    <Sec id="about">
      <SecTitle tag="01 // Identity" title="Who Am I?" />
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:64,alignItems:'center' }}>

        <motion.div initial={{ opacity:0,x:-60 }} whileInView={{ opacity:1,x:0 }}
          viewport={{ once:true }} transition={{ duration:.9 }}
          style={{ display:'flex',justifyContent:'center' }}>
          <div style={{ position:'relative',width:320,height:390 }}>
            <motion.div animate={{ rotate:360 }} transition={{ duration:20,repeat:Infinity,ease:'linear' }}
              style={{ position:'absolute',inset:-4,borderRadius:24,padding:3,
                background:`conic-gradient(${C.aurora2},${C.aurora7},${C.aurora3},${C.aurora4},${C.aurora2})` }}>
              <div style={{ borderRadius:22,background:C.bg,width:'100%',height:'100%' }} />
            </motion.div>
            <img src={personal?.avatar} alt={personal?.name}
              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personal?.name || 'Dev')}&background=7b5ea7&color=ffffff&size=400`; }}
              style={{ position:'absolute',inset:5,width:'calc(100% - 10px)',height:'calc(100% - 10px)',
                borderRadius:20,objectFit:'cover',zIndex:2 }} />
            {[
              { top:-16,  left:-16,  c:C.aurora2 },
              { top:-16,  right:-16, c:C.aurora7 },
              { bottom:-16,left:-16, c:C.aurora3 },
              { bottom:-16,right:-16,c:C.aurora4 },
            ].map((pos, i) => (
              <motion.div key={i} animate={{ scale:[1,1.4,1],opacity:[.6,.25,.6] }}
                transition={{ duration:2.5,delay:i*.5,repeat:Infinity }}
                style={{ position:'absolute',...pos,width:26,height:26,borderRadius:'50%',
                  background:pos.c,opacity:.55,boxShadow:`0 0 18px ${pos.c},0 0 36px ${pos.c}45`,filter:'blur(4px)' }} />
            ))}
            <FloatParticles color={C.aurora2} count={10} />
            <div className="scan-line" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0,x:60 }} whileInView={{ opacity:1,x:0 }}
          viewport={{ once:true }} transition={{ duration:.9,delay:.2 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
            <div style={{ width:28,height:1,background:C.aurora2 }} />
            <span style={{ fontFamily:'Share Tech Mono',fontSize:10,color:C.aurora2,letterSpacing:'0.35em' }}>PROFILE.SYS</span>
          </div>
          <h3 style={{ fontFamily:'Exo 2',fontWeight:900,fontSize:44,color:'white',marginBottom:6,lineHeight:1 }}>
            {personal?.name}
          </h3>
          <p style={{ fontFamily:'Share Tech Mono',fontSize:11,color:C.aurora7,
            letterSpacing:'0.25em',textTransform:'uppercase',marginBottom:22,
            textShadow:`0 0 12px ${C.aurora7}55` }}>
            {personal?.title}
          </p>
          <p style={{ color:'rgba(255,255,255,.45)',lineHeight:1.9,fontSize:15,
            fontFamily:'Rajdhani',marginBottom:22 }}>
            {personal?.bio}
          </p>
          <div style={{ display:'flex',alignItems:'center',gap:8,
            color:'rgba(255,255,255,.28)',fontSize:13,fontFamily:'Share Tech Mono',marginBottom:28 }}>
            <MapPin size={13} style={{ color:C.aurora3 }} /> {personal?.location}
          </div>

          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:28 }}>
            {[
              { l:'Status',     v:'Available',              c:C.aurora5 },
              { l:'Type',       v:'Full-time / Freelance',  c:C.aurora2 },
              { l:'Location',   v:personal?.location,       c:C.aurora4 },
              { l:'Experience', v:`${data.stats?.yearsExperience}+ Years`, c:C.aurora7 },
            ].map(({ l, v, c }) => (
              <div key={l} className="card-cosmic" style={{ padding:'11px 15px',borderRadius:12,position:'relative' }}>
                <FloatParticles color={c} count={2} />
                <div style={{ fontFamily:'Share Tech Mono',fontSize:9,color:'rgba(255,255,255,.22)',
                  letterSpacing:'0.3em',textTransform:'uppercase',marginBottom:4 }}>{l}</div>
                <div style={{ fontFamily:'Rajdhani',fontWeight:700,color:c,fontSize:14 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
            {[[Github,socials?.github,C.aurora2,'GitHub'],[Linkedin,socials?.linkedin,C.aurora4,'LinkedIn']].map(([Icon,href,c,label]) => href && (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale:1.05,y:-2 }}
                style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 20px',
                  borderRadius:10,border:`1px solid ${c}28`,background:`${c}08`,
                  color:c,textDecoration:'none',fontFamily:'Share Tech Mono',
                  fontSize:11,letterSpacing:'0.18em',textTransform:'uppercase',transition:'all .3s' }}>
                <Icon size={14} />{label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </Sec>
  );
}

/* ─── SKILLS ─── */
const CAT = {
  Frontend: { c: C.aurora2,  Icon: Globe },
  Backend:  { c: C.aurora7,  Icon: Cpu },
  Design:   { c: C.aurora3,  Icon: Layers },
  DevOps:   { c: C.aurora4,  Icon: Terminal },
  default:  { c: C.aurora5,  Icon: Code2 },
};

function SkillBar({ name, level, category, index }) {
  const { c } = CAT[category] || CAT.default;
  const [hov, setHov] = useState(false);
  return (
    <motion.div initial={{ opacity:0,x:-30 }} whileInView={{ opacity:1,x:0 }}
      viewport={{ once:true }} transition={{ duration:.5,delay:index*.05 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position:'relative' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8 }}>
        <span style={{ fontFamily:'Rajdhani',fontWeight:600,fontSize:15,
          color: hov ? 'white' : 'rgba(255,255,255,.65)',transition:'color .3s' }}>{name}</span>
        <motion.span animate={{ color: hov ? c : 'rgba(255,255,255,.22)' }}
          style={{ fontFamily:'Share Tech Mono',fontSize:11 }}>{level}%</motion.span>
      </div>
      <div style={{ height:5,background:'rgba(255,255,255,.04)',borderRadius:99,overflow:'visible',position:'relative' }}>
        <motion.div initial={{ width:0 }} whileInView={{ width:`${level}%` }}
          viewport={{ once:true }}
          transition={{ duration:1.3,delay:index*.05+.25,ease:[.25,.46,.45,.94] }}
          style={{ height:'100%',borderRadius:99,
            background:`linear-gradient(90deg,${c}70,${c})`,
            boxShadow:hov?`0 0 16px ${c}70`:`0 0 6px ${c}35`,
            position:'relative',overflow:'hidden',transition:'box-shadow .3s' }}>
          <motion.div animate={{ x:['-100%','200%'] }}
            transition={{ duration:2.5,repeat:Infinity,delay:index*.08+1.2 }}
            style={{ position:'absolute',inset:0,
              background:'linear-gradient(90deg,transparent,rgba(255,255,255,.38),transparent)',
              width:'50%' }} />
          <div style={{ position:'absolute',right:-3,top:'50%',transform:'translateY(-50%)',
            width:9,height:9,borderRadius:'50%',background:c,
            boxShadow:`0 0 12px ${c},0 0 24px ${c}55` }} />
        </motion.div>
        {hov && <FloatParticles color={c} count={4} />}
      </div>
    </motion.div>
  );
}

function Skills() {
  const skills = data.skills || [];
  const cats   = [...new Set(skills.map(s => s.category))];
  return (
    <Sec id="skills" bg="rgba(123,94,167,.015)">
      <HexGrid opacity={.022} />
      <SecTitle tag="02 // Arsenal" title="Tech Stack" sub="Skills and technologies I've mastered across the digital cosmos." />
      <div style={{ display:'grid',gap:24 }}>
        {cats.map((cat, ci) => {
          const { c, Icon } = CAT[cat] || CAT.default;
          const catSkills = skills.filter(s => s.category === cat);
          return (
            <motion.div key={cat} initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }}
              viewport={{ once:true }} transition={{ duration:.65,delay:ci*.08 }}
              className="card-cosmic" style={{ padding:28,borderRadius:20,position:'relative',overflow:'hidden',
                border:`1px solid ${c}18` }}>
              <div className="scan-line" />
              <FloatParticles color={c} count={5} />
              <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:24 }}>
                <div style={{ width:42,height:42,borderRadius:13,
                  background:`${c}12`,border:`1px solid ${c}28`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  boxShadow:`0 0 16px ${c}20`,position:'relative',overflow:'hidden' }}>
                  <Icon size={19} style={{ color:c }} />
                  <FloatParticles color={c} count={2} />
                </div>
                <div>
                  <div style={{ fontFamily:'Exo 2',fontWeight:800,fontSize:19,color:'white' }}>{cat}</div>
                  <div style={{ fontFamily:'Share Tech Mono',fontSize:10,color:'rgba(255,255,255,.25)',
                    letterSpacing:'0.28em' }}>{catSkills.length} MODULES LOADED</div>
                </div>
                <div style={{ marginLeft:'auto',position:'relative',width:44,height:44 }}>
                  <OrbitRing radius={22} count={4} color={c} dur={6} size={2} />
                </div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'16px 50px' }}>
                {catSkills.map((s, i) => <SkillBar key={s.name} {...s} index={i} />)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Sec>
  );
}

/* ─── PROJECTS ─── */
function ProjectCard({ project, index }) {
  const [hov, setHov] = useState(false);
  const COLS = [C.aurora2, C.aurora7, C.aurora3, C.aurora4];
  const c    = COLS[index % COLS.length];

  return (
    <motion.div initial={{ opacity:0,y:50 }} whileInView={{ opacity:1,y:0 }}
      viewport={{ once:true }} transition={{ duration:.65,delay:index*.09 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="card-cosmic"
      style={{ borderRadius:22,overflow:'hidden',position:'relative',cursor:'default',
        border:`1px solid ${hov ? c+'40' : `${C.aurora1}0e`}`,
        boxShadow: hov ? `0 0 45px ${c}15,0 24px 60px rgba(0,0,0,.5)` : '0 4px 30px rgba(0,0,0,.4)',
        transition:'all .5s',transform: hov ? 'translateY(-7px)' : 'translateY(0)' }}>

      <div style={{ position:'relative',height:210,overflow:'hidden' }}>
        <img src={project.image} alt={project.title}
          onError={e => { e.target.src=`https://picsum.photos/seed/${encodeURIComponent(project.title)}/700/350`; }}
          style={{ width:'100%',height:'100%',objectFit:'cover',
            transform: hov ? 'scale(1.1)' : 'scale(1)',transition:'transform .8s' }} />
        <div style={{ position:'absolute',inset:0,
          background:`linear-gradient(to bottom,transparent 35%,${C.bg} 100%)` }} />
        <div style={{ position:'absolute',inset:0,
          background:`radial-gradient(circle at 50% 80%,${c}15,transparent 70%)`,
          opacity: hov ? 1 : 0,transition:'opacity .5s' }} />

        <div style={{ position:'absolute',top:14,left:14,
          padding:'4px 13px',borderRadius:999,
          background:`${c}20`,border:`1px solid ${c}40`,
          fontFamily:'Share Tech Mono',fontSize:10,color:c,letterSpacing:'0.22em' }}>
          {String(index + 1).padStart(2,'0')}_PROJECT
        </div>

        <div style={{ position:'absolute',top:14,right:14,display:'flex',gap:8,
          opacity: hov ? 1 : 0,transform: hov ? 'translateY(0)' : 'translateY(8px)',transition:'all .35s' }}>
          {project.liveUrl && (
            <motion.a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale:1.18 }}
              style={{ width:38,height:38,borderRadius:'50%',
                background:'rgba(0,0,0,.65)',backdropFilter:'blur(12px)',
                border:`1px solid ${c}40`,display:'flex',alignItems:'center',justifyContent:'center',
                color:c,textDecoration:'none' }}>
              <ExternalLink size={14} />
            </motion.a>
          )}
          {project.githubUrl && (
            <motion.a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale:1.18 }}
              style={{ width:38,height:38,borderRadius:'50%',
                background:'rgba(0,0,0,.65)',backdropFilter:'blur(12px)',
                border:'1px solid rgba(255,255,255,.15)',display:'flex',alignItems:'center',justifyContent:'center',
                color:'rgba(255,255,255,.65)',textDecoration:'none' }}>
              <Github size={14} />
            </motion.a>
          )}
        </div>
      </div>

      <div style={{ padding:24,position:'relative' }}>
        {hov && <FloatParticles color={c} count={6} />}
        <h3 style={{ fontFamily:'Exo 2',fontWeight:800,fontSize:20,
          color: hov ? 'white' : 'rgba(255,255,255,.88)',
          marginBottom:8,transition:'all .3s',
          textShadow: hov ? `0 0 20px ${c}45` : 'none' }}>
          {project.title}
        </h3>
        <p style={{ color:'rgba(255,255,255,.35)',fontSize:13,lineHeight:1.75,
          fontFamily:'Rajdhani',marginBottom:16 }} className="lc2">
          {project.description}
        </p>
        <div style={{ display:'flex',flexWrap:'wrap',gap:7 }}>
          {(project.techStack || []).map(tech => (
            <span key={tech} style={{ padding:'3px 11px',borderRadius:7,
              border:`1px solid ${c}22`,background:`${c}09`,
              fontFamily:'Share Tech Mono',fontSize:10,color:c,letterSpacing:'0.1em' }}>
              {tech}
            </span>
          ))}
        </div>
        <motion.div animate={{ scaleX: hov ? 1 : 0 }}
          style={{ position:'absolute',bottom:0,left:24,right:24,height:1,
            background:`linear-gradient(90deg,transparent,${c},transparent)`,
            transformOrigin:'left' }}
          transition={{ duration:.45 }} />
      </div>
    </motion.div>
  );
}

function Projects() {
  return (
    <Sec id="projects">
      <SecTitle tag="03 // Creations" title="Featured Work" sub="Handcrafted digital experiences launched into the cosmos." />
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:22 }}>
        {(data.projects || []).map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
      </div>
    </Sec>
  );
}

/* ─── EXPERIENCE ─── */
function Experience() {
  const COLS = [C.aurora2, C.aurora7, C.aurora3, C.aurora4];
  return (
    <Sec id="experience" bg="rgba(192,132,252,.012)">
      <HexGrid opacity={.018} />
      <SecTitle tag="04 // Journey" title="Career Timeline" />
      <div style={{ position:'relative',maxWidth:860,margin:'0 auto' }}>
        <div style={{ position:'absolute',left:'50%',top:0,bottom:0,width:1,
          background:`linear-gradient(to bottom,transparent,${C.aurora2}40 15%,${C.aurora7}40 85%,transparent)`,
          transform:'translateX(-50%)' }} />

        {(data.experience || []).map((exp, i) => {
          const c     = COLS[i % COLS.length];
          const left  = i % 2 === 0;
          return (
            <motion.div key={i} initial={{ opacity:0,x: left ? -60 : 60 }}
              whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}
              transition={{ duration:.7,delay:i*.1 }}
              style={{ display:'flex',justifyContent: left ? 'flex-end' : 'flex-start',
                marginBottom:50,position:'relative' }}>

              <div style={{ position:'absolute',left:'50%',top:20,transform:'translate(-50%,-50%)',zIndex:6 }}>
                <div style={{ position:'relative',width:46,height:46,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <OrbitRing radius={23} count={4} color={c} dur={7} size={2.5} />
                  <div style={{ width:13,height:13,borderRadius:'50%',background:c,zIndex:3,
                    boxShadow:`0 0 20px ${c},0 0 40px ${c}50` }} />
                </div>
              </div>

              <div style={{ width:'42%',padding:24,borderRadius:18,
                border:`1px solid ${c}1e`,
                background:`linear-gradient(135deg,${c}06,rgba(5,3,15,.85))`,
                position:'relative',overflow:'hidden',
                boxShadow:`0 0 30px ${c}08` }}
                className="card-cosmic">
                <FloatParticles color={c} count={4} />
                <div className="scan-line" />
                <div style={{ position:'absolute',top:26,
                  [left ? 'right' : 'left']: -44,
                  width:44,height:1,
                  background:`linear-gradient(${left?'90deg':'270deg'},transparent,${c}50)` }} />

                <div style={{ display:'flex',justifyContent:'space-between',
                  alignItems:'flex-start',marginBottom:10,flexWrap:'wrap',gap:8 }}>
                  <div>
                    <h3 style={{ fontFamily:'Exo 2',fontWeight:800,fontSize:17,color:'white' }}>{exp.role}</h3>
                    <p style={{ fontFamily:'Share Tech Mono',fontSize:11,color:c,
                      letterSpacing:'0.2em',textTransform:'uppercase',
                      textShadow:`0 0 10px ${c}55` }}>{exp.company}</p>
                  </div>
                  <span style={{ fontFamily:'Share Tech Mono',fontSize:10,
                    color:'rgba(255,255,255,.25)',padding:'4px 11px',
                    border:'1px solid rgba(255,255,255,.06)',borderRadius:999,whiteSpace:'nowrap' }}>
                    {exp.period}
                  </span>
                </div>
                <p style={{ color:'rgba(255,255,255,.38)',fontSize:13,lineHeight:1.75,fontFamily:'Rajdhani' }}>
                  {exp.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Sec>
  );
}

/* ─── TESTIMONIALS ─── */
function TestCard({ t, index }) {
  const [hov, setHov] = useState(false);
  const COLS = [C.aurora2, C.aurora7, C.aurora3, C.aurora4];
  const c    = COLS[index % COLS.length];
  return (
    <motion.div initial={{ opacity:0,scale:.88 }} whileInView={{ opacity:1,scale:1 }}
      viewport={{ once:true }} transition={{ duration:.55,delay:index*.09 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="card-cosmic"
      style={{ borderRadius:22,padding:28,position:'relative',overflow:'hidden',
        border:`1px solid ${hov ? c+'35' : `${C.aurora1}0e`}`,
        boxShadow: hov ? `0 0 40px ${c}10` : 'none',transition:'all .4s' }}>
      {hov && <FloatParticles color={c} count={7} />}
      <div className="scan-line" />
      <div style={{ fontSize:80,lineHeight:1,color:`${c}10`,
        fontFamily:'serif',marginBottom:-22,marginTop:-12,userSelect:'none',position:'relative',zIndex:0 }}>❝</div>
      <div style={{ display:'flex',gap:5,marginBottom:16,position:'relative',zIndex:1 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div key={i} animate={{ scale:[1,1.35,1],opacity:[1,.6,1] }}
            transition={{ duration:2,delay:i*.22,repeat:Infinity }}>
            <Star size={13} fill={C.aurora6} style={{ color:C.aurora6,filter:`drop-shadow(0 0 5px ${C.aurora6})` }} />
          </motion.div>
        ))}
      </div>
      <p style={{ color:'rgba(255,255,255,.48)',fontSize:14,lineHeight:1.85,
        fontFamily:'Rajdhani',fontStyle:'italic',marginBottom:22,
        position:'relative',zIndex:1 }} className="lc3">
        "{t.text}"
      </p>
      <div style={{ display:'flex',alignItems:'center',gap:13,position:'relative',zIndex:1 }}>
        <div style={{ position:'relative',flexShrink:0 }}>
          <img src={t.avatar} alt={t.name}
            onError={e => { e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=7b5ea7&color=fff&size=50`; }}
            style={{ width:46,height:46,borderRadius:'50%',objectFit:'cover',border:`1.5px solid ${c}45` }} />
          <motion.div animate={{ scale:[1,1.5],opacity:[.45,0] }} transition={{ duration:2,repeat:Infinity }}
            style={{ position:'absolute',inset:-4,borderRadius:'50%',border:`1px solid ${c}38` }} />
        </div>
        <div>
          <div style={{ fontFamily:'Exo 2',fontWeight:700,color:'white',fontSize:14 }}>{t.name}</div>
          <div style={{ fontFamily:'Share Tech Mono',fontSize:10,color:c,
            letterSpacing:'0.15em',textShadow:`0 0 10px ${c}55` }}>{t.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

function Testimonials() {
  return (
    <Sec id="testimonials">
      <SecTitle tag="05 // Signals" title="What They Say" sub="Transmissions from across the collaboration cosmos." />
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20 }}>
        {(data.testimonials || []).map((t, i) => <TestCard key={i} t={t} index={i} />)}
      </div>
    </Sec>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  const { socials, personal } = data;
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [sent, setSent] = useState(false);
  const [burst, setBurst] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLockRef = useRef(false);
  const submitTimersRef = useRef([]);

  useEffect(() => {
    return () => {
      submitTimersRef.current.forEach(clearTimeout);
      submitTimersRef.current = [];
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (submitLockRef.current || isSubmitting || sent || burst) return;
    if (!form.name || !form.email || !form.message) return;

    submitLockRef.current = true;
    setIsSubmitting(true);
    setBurst(true);

    const burstTimer = setTimeout(() => {
      setSent(true);
      setBurst(false);
    }, 900);

    const resetTimer = setTimeout(() => {
      setSent(false);
      setForm({ name:'', email:'', message:'' });
      setIsSubmitting(false);
      submitLockRef.current = false;
      submitTimersRef.current = [];
    }, 4500);

    submitTimersRef.current = [burstTimer, resetTimer];
  };

  const inputStyle = {
    width:'100%', padding:'13px 17px', borderRadius:12,
    background:'rgba(255,255,255,.03)',
    border:`1px solid rgba(123,94,167,.18)`,
    color:'white', fontSize:14, fontFamily:'Rajdhani',
    outline:'none', transition:'border-color .3s',
  };

  return (
    <Sec id="contact" bg="rgba(123,94,167,.01)">
      <HexGrid opacity={.02} />
      <SecTitle tag="06 // Transmission" title="Open a Channel" sub="Let's build something that defies gravity together." />

      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:52,maxWidth:1050,margin:'0 auto' }}>

        <motion.div initial={{ opacity:0,x:-45 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }}>
          <h3 style={{ fontFamily:'Exo 2',fontWeight:800,fontSize:30,color:'white',marginBottom:10 }}>
            Let's Connect
          </h3>
          <p style={{ color:'rgba(255,255,255,.35)',fontSize:14,lineHeight:1.85,fontFamily:'Rajdhani',marginBottom:30 }}>
            Whether you have a mission-critical project, a creative idea, or just want to say hello — my comm-link is always open.
          </p>

          <div style={{ display:'flex',flexDirection:'column',gap:14,marginBottom:32 }}>
            {[
              { Icon:Mail,   val:socials?.email,    href:`mailto:${socials?.email}`, c:C.aurora2, l:'Email Signal' },
              { Icon:MapPin, val:personal?.location,href:null,                       c:C.aurora7, l:'Location' },
              { Icon:Zap,    val:'Available Now',   href:null,                       c:C.aurora5, l:'Status' },
            ].filter(s => s.val).map(({ Icon, val, href, c, l }) => (
              <motion.div key={l} whileHover={{ x:7 }}
                className="card-cosmic"
                style={{ display:'flex',alignItems:'center',gap:15,padding:'14px 18px',
                  borderRadius:14,border:`1px solid ${c}18`,cursor: href ? 'pointer' : 'default',
                  textDecoration:'none',position:'relative' }}>
                <FloatParticles color={c} count={2} />
                <div style={{ width:40,height:40,borderRadius:11,flexShrink:0,
                  background:`${c}12`,border:`1px solid ${c}25`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  boxShadow:`0 0 14px ${c}20` }}>
                  <Icon size={16} style={{ color:c }} />
                </div>
                <div>
                  <div style={{ fontFamily:'Share Tech Mono',fontSize:9,
                    color:'rgba(255,255,255,.22)',letterSpacing:'0.3em',textTransform:'uppercase' }}>{l}</div>
                  <div style={{ fontFamily:'Rajdhani',fontWeight:600,color:'rgba(255,255,255,.65)',fontSize:14,marginTop:2 }}>{val}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
            {[
              { Icon:Github,   href:socials?.github,   c:C.aurora2 },
              { Icon:Linkedin, href:socials?.linkedin, c:C.aurora4 },
              { Icon:Twitter,  href:socials?.twitter,  c:C.aurora7 },
            ].filter(s => s.href).map(({ Icon, href, c }, i) => (
              <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale:1.14,y:-4 }}
                style={{ width:48,height:48,borderRadius:'50%',
                  border:`1px solid ${c}28`,background:`${c}0a`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color:c,textDecoration:'none',transition:'all .3s',
                  position:'relative',overflow:'hidden' }}>
                <FloatParticles color={c} count={2} />
                <Icon size={17} style={{ position:'relative',zIndex:2 }} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0,x:45 }} whileInView={{ opacity:1,x:0 }}
          viewport={{ once:true }} transition={{ delay:.2 }}>
          <div className="card-cosmic" style={{ padding:32,borderRadius:22,position:'relative',overflow:'hidden' }}>
            <div className="scan-line" />
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent"
                  initial={{ opacity:0,scale:.85 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0 }}
                  style={{ display:'flex',flexDirection:'column',alignItems:'center',
                    justifyContent:'center',padding:'44px 0',textAlign:'center' }}>
                  <div style={{ position:'relative',marginBottom:22 }}>
                    <div style={{ width:74,height:74,borderRadius:'50%',
                      background:`${C.aurora2}12`,border:`1px solid ${C.aurora2}28`,
                      display:'flex',alignItems:'center',justifyContent:'center' }}>
                      <Send size={30} style={{ color:C.aurora2 }} />
                    </div>
                    <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)' }}>
                      <OrbitRing radius={44} count={8} color={C.aurora2} dur={5} size={2} />
                    </div>
                  </div>
                  <h4 style={{ fontFamily:'Exo 2',fontWeight:800,color:'white',fontSize:24,marginBottom:8 }}>
                    Transmission Sent!
                  </h4>
                  <p style={{ color:'rgba(255,255,255,.38)',fontSize:14,fontFamily:'Rajdhani',lineHeight:1.7 }}>
                    Signal received loud and clear.<br/>I'll respond from across the cosmos shortly.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:20 }}>
                  {[
                    { label:'Your Name', type:'text', key:'name', ph:'Commander Shepard' },
                    { label:'Email Signal', type:'email', key:'email', ph:'commander@n7.space' },
                  ].map(({ label, type, key, ph }) => (
                    <div key={key}>
                      <label style={{ display:'block',fontFamily:'Share Tech Mono',fontSize:9,
                        color:'rgba(255,255,255,.25)',letterSpacing:'0.32em',textTransform:'uppercase',marginBottom:8 }}>
                        {label}
                      </label>
                      <input type={type} value={form[key]} required placeholder={ph}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = C.aurora2; }}
                        onBlur={e  => { e.target.style.borderColor = 'rgba(123,94,167,.18)'; }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display:'block',fontFamily:'Share Tech Mono',fontSize:9,
                      color:'rgba(255,255,255,.25)',letterSpacing:'0.32em',textTransform:'uppercase',marginBottom:8 }}>
                      Message
                    </label>
                    <textarea rows={5} value={form.message} required placeholder="Describe your mission…"
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      style={{ ...inputStyle, resize:'vertical' }}
                      onFocus={e => { e.target.style.borderColor = C.aurora2; }}
                      onBlur={e  => { e.target.style.borderColor = 'rgba(123,94,167,.18)'; }} />
                  </div>
                  <motion.button type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale:1.03,boxShadow:`0 0 45px ${C.aurora2}45` }}
                    whileTap={{ scale:.97 }}
                    style={{ padding:'15px',borderRadius:13,
                      background:`linear-gradient(135deg,${C.aurora1},${C.aurora2},${C.aurora7})`,
                      border:'none',cursor:isSubmitting ? 'not-allowed' : 'pointer',
                      color:'white',fontFamily:'Exo 2',fontWeight:800,fontSize:14,
                      letterSpacing:'0.2em',textTransform:'uppercase',
                      display:'flex',alignItems:'center',justifyContent:'center',gap:9,
                      position:'relative',overflow:'hidden',
                      boxShadow:`0 0 22px ${C.aurora2}28`,transition:'box-shadow .35s, opacity .2s',
                      opacity: isSubmitting ? 0.7 : 1 }}>
                    <MiniBurst color={C.aurora2} active={burst} />
                    <Send size={16} style={{ position:'relative',zIndex:1 }} />
                    <span style={{ position:'relative',zIndex:1 }}>Send Transmission</span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Sec>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ position:'relative',zIndex:10,
      borderTop:`1px solid ${C.aurora1}08`,padding:'44px 24px',textAlign:'center' }}>
      <div style={{ maxWidth:1280,margin:'0 auto' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:12 }}>
          <div style={{ height:1,width:50,background:`linear-gradient(90deg,transparent,${C.aurora2}38)` }} />
          <div style={{ position:'relative' }}>
            <OrbitRing radius={14} count={3} color={C.aurora2} dur={5} size={1.5} />
          </div>
          <span style={{ fontFamily:'Share Tech Mono',fontSize:11,
            color:'rgba(255,255,255,.16)',letterSpacing:'0.3em' }}>
            © {new Date().getFullYear()} — {data.personal?.name}
          </span>
          <div style={{ position:'relative' }}>
            <OrbitRing radius={14} count={3} color={C.aurora7} dur={7} size={1.5} />
          </div>
          <div style={{ height:1,width:50,background:`linear-gradient(90deg,${C.aurora2}38,transparent)` }} />
        </div>
        <p style={{ fontFamily:'Share Tech Mono',fontSize:10,
          color:'rgba(255,255,255,.08)',letterSpacing:'0.25em' }}>
          CRAFTED IN THE <span className="aurora-text" style={{ fontSize:10 }}>PARTICLE UNIVERSE</span>
        </p>
      </div>
    </footer>
  );
}

/* ─── ROOT ─── */
export default function ParticleUniverse() {
  useEffect(() => {
    const priorBodyBg = document.body.style.background;
    const priorOverflowX = document.body.style.overflowX;
    const priorDocElBg = document.documentElement.style.background;

    document.body.style.background    = C.bg;
    document.body.style.overflowX     = 'hidden';
    document.documentElement.style.background = C.bg;

    return () => {
      document.body.style.background = priorBodyBg;
      document.body.style.overflowX = priorOverflowX;
      document.documentElement.style.background = priorDocElBg;
    };
  }, []);

  return (
    <div className="pu-root" style={{ background: C.bg }}>
      <style>{GLOBAL_CSS}</style>
      <CosmicCursor />
      <ParticleField />
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
