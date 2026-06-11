import React, { useState, useEffect, useRef } from 'react';

/* ─── Font loader ─────────────────────────────────────────── */
function GoogleFontLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}

/* ─── Paper grain overlay ─────────────────────────────────── */
const PaperGrain = () => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, mixBlendMode: 'multiply', opacity: 0.18 }}
    aria-hidden="true"
  >
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.72 0.68" numOctaves="4" seed="8" stitchTiles="stitch" result="noise" />
      <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
      <feBlend in="SourceGraphic" in2="gray" mode="multiply" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" opacity="1" fill="rgba(210,190,180,0.6)" />
  </svg>
);

/* ─── Full-canvas background watercolor wash ─────────────── */
const BackgroundWash = () => (
  <svg
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    aria-hidden="true"
  >
    <defs>
      {/* Realistic watercolor displacement — high-freq turbulence for ragged pigment edges */}
      <filter id="wc-main" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="5" seed="3" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="55" xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="22" result="blur" />
        <feComposite in="blur" in2="SourceGraphic" operator="over" />
      </filter>
      <filter id="wc-mid" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.018 0.024" numOctaves="4" seed="7" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="40" xChannelSelector="G" yChannelSelector="R" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="16" result="blur" />
      </filter>
      <filter id="wc-accent" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="turbulence" baseFrequency="0.03 0.025" numOctaves="3" seed="12" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="28" xChannelSelector="R" yChannelSelector="B" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="10" />
      </filter>
      <filter id="wc-ink" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06 0.04" numOctaves="3" seed="5" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="18" xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="3" />
      </filter>
      <filter id="bloom-soft" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="8" />
      </filter>

      {/* Large wash gradients */}
      <radialGradient id="wash-blush" cx="30%" cy="35%" r="55%">
        <stop offset="0%" stopColor="#f7b8d5" stopOpacity="0.72" />
        <stop offset="45%" stopColor="#f0aac8" stopOpacity="0.38" />
        <stop offset="80%" stopColor="#e8a0c0" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#e0a0c0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="wash-sky" cx="75%" cy="25%" r="50%">
        <stop offset="0%" stopColor="#b0d4f8" stopOpacity="0.6" />
        <stop offset="50%" stopColor="#a8ccf4" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#a0c8f0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="wash-peach" cx="65%" cy="80%" r="48%">
        <stop offset="0%" stopColor="#fcd0a0" stopOpacity="0.6" />
        <stop offset="55%" stopColor="#f8c898" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#f4c090" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="wash-lavender" cx="15%" cy="75%" r="42%">
        <stop offset="0%" stopColor="#cdb8f0" stopOpacity="0.55" />
        <stop offset="55%" stopColor="#c8b0ec" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#c0a8e8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="wash-mint" cx="85%" cy="60%" r="40%">
        <stop offset="0%" stopColor="#a8e4cc" stopOpacity="0.45" />
        <stop offset="55%" stopColor="#a0dcc4" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#98d4bc" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="wash-coral" cx="50%" cy="15%" r="38%">
        <stop offset="0%" stopColor="#f8b4a0" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#f4ac98" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#f0a490" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Primary large washes — full bleed watercolor pools */}
    <ellipse cx="420" cy="310" rx="520" ry="440" fill="url(#wash-blush)" filter="url(#wc-main)" />
    <ellipse cx="1080" cy="220" rx="480" ry="400" fill="url(#wash-sky)" filter="url(#wc-main)" />
    <ellipse cx="950" cy="720" rx="460" ry="380" fill="url(#wash-peach)" filter="url(#wc-mid)" />
    <ellipse cx="200" cy="680" rx="400" ry="340" fill="url(#wash-lavender)" filter="url(#wc-mid)" />
    <ellipse cx="1240" cy="540" rx="360" ry="300" fill="url(#wash-mint)" filter="url(#wc-accent)" />
    <ellipse cx="720" cy="80" rx="380" ry="240" fill="url(#wash-coral)" filter="url(#wc-accent)" />

    {/* Secondary layered mid-tone washes for pigment depth */}
    <ellipse cx="600" cy="450" rx="300" ry="260" fill="rgba(240,176,210,0.22)" filter="url(#wc-mid)" />
    <ellipse cx="860" cy="350" rx="260" ry="220" fill="rgba(168,204,248,0.2)" filter="url(#wc-accent)" />
    <ellipse cx="300" cy="200" rx="240" ry="200" fill="rgba(216,188,248,0.2)" filter="url(#wc-accent)" />
    <ellipse cx="1100" cy="680" rx="280" ry="230" fill="rgba(200,240,218,0.18)" filter="url(#wc-accent)" />

    {/* Wet-on-wet bloom zones — pigment that pooled at wash edges */}
    <circle cx="380" cy="260" r="120" fill="rgba(248,160,196,0.28)" filter="url(#wc-ink)" />
    <circle cx="1060" cy="300" r="100" fill="rgba(148,196,248,0.26)" filter="url(#wc-ink)" />
    <circle cx="180" cy="600" r="90" fill="rgba(196,168,248,0.24)" filter="url(#wc-ink)" />
    <circle cx="1200" cy="560" r="80" fill="rgba(148,228,196,0.22)" filter="url(#wc-ink)" />
    <circle cx="760" cy="820" r="110" fill="rgba(248,196,148,0.24)" filter="url(#wc-ink)" />

    {/* Ink diffusion tendrils — thin organic paint runs */}
    <path d="M120 180 C200 160 280 220 340 180 C400 140 440 200 520 170" stroke="rgba(230,150,180,0.22)" strokeWidth="3" fill="none" filter="url(#wc-ink)" />
    <path d="M900 100 C960 140 1020 100 1080 150 C1140 200 1180 160 1260 190" stroke="rgba(148,192,240,0.2)" strokeWidth="2.5" fill="none" filter="url(#wc-ink)" />
    <path d="M80 560 C160 520 200 580 280 540 C360 500 380 560 460 520" stroke="rgba(196,160,240,0.2)" strokeWidth="2" fill="none" filter="url(#wc-ink)" />
    <path d="M960 720 C1020 680 1080 740 1150 700 C1220 660 1260 720 1340 690" stroke="rgba(148,220,190,0.18)" strokeWidth="2.5" fill="none" filter="url(#wc-ink)" />
    <path d="M400 800 C480 760 560 820 640 780 C720 740 760 800 840 760" stroke="rgba(240,190,140,0.2)" strokeWidth="2" fill="none" filter="url(#wc-ink)" />

    {/* Scattered micro ink drops */}
    {[
      [180,140,'#f4a8c7',7,0.38],[520,80,'#a8ccf4',5,0.35],[800,180,'#d8b8f8',6,0.32],
      [1100,120,'#a8e4c8',4,0.3],[1300,280,'#f4cca8',6,0.3],[100,380,'#f4a8c7',4,0.28],
      [340,520,'#a8ccf4',5,0.3],[640,680,'#d8b8f8',5,0.28],[1000,640,'#a8e4c8',6,0.26],
      [1360,740,'#f4cca8',4,0.28],[240,760,'#f4a8c7',5,0.25],[740,60,'#d8b8f8',4,0.3],
      [1180,820,'#a8ccf4',6,0.25],[60,240,'#a8e4c8',4,0.27],[1400,460,'#f4a8c7',5,0.26],
    ].map(([cx,cy,fill,r,op],i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity={op} filter="url(#bloom-soft)" />
    ))}
  </svg>
);

/* ─── Rich watercolor artwork panel (right side) ─────────── */
const WatercolorArtwork = () => (
  <svg
    viewBox="0 0 520 580"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    aria-hidden="true"
  >
    <defs>
      {/* Panel-level watercolor displacement */}
      <filter id="pa-main" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.022 0.018" numOctaves="5" seed="9" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="36" xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="14" result="out" />
      </filter>
      <filter id="pa-mid" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.035 0.028" numOctaves="4" seed="14" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="24" xChannelSelector="G" yChannelSelector="R" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="9" />
      </filter>
      <filter id="pa-fine" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
        <feTurbulence type="turbulence" baseFrequency="0.055 0.045" numOctaves="3" seed="6" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="14" xChannelSelector="R" yChannelSelector="B" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="5" />
      </filter>
      <filter id="pa-ink" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.07 0.055" numOctaves="3" seed="11" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="10" xChannelSelector="R" yChannelSelector="G" result="disp" />
        <feGaussianBlur in="disp" stdDeviation="2.5" />
      </filter>
      <filter id="pa-glow">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <filter id="pa-sharp">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>

      {/* Wash gradients for the panel */}
      <radialGradient id="p-blush" cx="38%" cy="33%" r="55%">
        <stop offset="0%" stopColor="#f7aed0" stopOpacity="0.88" />
        <stop offset="40%" stopColor="#f2a4c8" stopOpacity="0.55" />
        <stop offset="75%" stopColor="#eca0c0" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#e8a0bc" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="p-sky" cx="68%" cy="62%" r="50%">
        <stop offset="0%" stopColor="#a4ccf8" stopOpacity="0.82" />
        <stop offset="45%" stopColor="#9cc4f4" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#98bef0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="p-peach" cx="55%" cy="85%" r="45%">
        <stop offset="0%" stopColor="#fcc898" stopOpacity="0.75" />
        <stop offset="50%" stopColor="#f8c090" stopOpacity="0.38" />
        <stop offset="100%" stopColor="#f4b888" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="p-lav" cx="20%" cy="70%" r="40%">
        <stop offset="0%" stopColor="#d0b4f4" stopOpacity="0.72" />
        <stop offset="50%" stopColor="#c8acec" stopOpacity="0.36" />
        <stop offset="100%" stopColor="#c0a4e4" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="p-mint" cx="82%" cy="20%" r="38%">
        <stop offset="0%" stopColor="#a4e0c8" stopOpacity="0.65" />
        <stop offset="55%" stopColor="#9cd8c0" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#94d0b8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="p-rose" cx="15%" cy="22%" r="35%">
        <stop offset="0%" stopColor="#f8b4c0" stopOpacity="0.62" />
        <stop offset="55%" stopColor="#f4acb8" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#f0a4b0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="p-center" cx="50%" cy="48%" r="35%">
        <stop offset="0%" stopColor="#fff8f8" stopOpacity="0.8" />
        <stop offset="60%" stopColor="#fff4f6" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#fff0f4" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* ── Layer 1: deep background washes ── */}
    <ellipse cx="255" cy="265" rx="240" ry="225" fill="url(#p-blush)" filter="url(#pa-main)" />
    <ellipse cx="310" cy="330" rx="210" ry="195" fill="url(#p-sky)" filter="url(#pa-main)" />
    <ellipse cx="200" cy="390" rx="195" ry="175" fill="url(#p-peach)" filter="url(#pa-mid)" />
    <ellipse cx="160" cy="200" rx="175" ry="160" fill="url(#p-lav)" filter="url(#pa-mid)" />
    <ellipse cx="380" cy="150" rx="165" ry="148" fill="url(#p-mint)" filter="url(#pa-fine)" />
    <ellipse cx="115" cy="135" rx="145" ry="130" fill="url(#p-rose)" filter="url(#pa-fine)" />

    {/* ── Layer 2: mid-tone pigment clouds ── */}
    <ellipse cx="280" cy="200" rx="140" ry="125" fill="rgba(248,160,200,0.32)" filter="url(#pa-mid)" />
    <ellipse cx="340" cy="380" rx="130" ry="115" fill="rgba(148,196,248,0.3)" filter="url(#pa-mid)" />
    <ellipse cx="170" cy="340" rx="120" ry="108" fill="rgba(200,165,248,0.28)" filter="url(#pa-fine)" />
    <ellipse cx="380" cy="280" rx="110" ry="98" fill="rgba(148,224,192,0.26)" filter="url(#pa-fine)" />
    <ellipse cx="120" cy="430" rx="105" ry="92" fill="rgba(248,196,145,0.28)" filter="url(#pa-fine)" />
    <ellipse cx="410" cy="450" rx="100" ry="88" fill="rgba(248,155,180,0.24)" filter="url(#pa-fine)" />

    {/* ── Layer 3: wet-on-wet bloom spots ── */}
    <circle cx="210" cy="175" r="75" fill="rgba(252,150,192,0.38)" filter="url(#pa-ink)" />
    <circle cx="335" cy="310" r="68" fill="rgba(140,188,252,0.36)" filter="url(#pa-ink)" />
    <circle cx="155" cy="370" r="60" fill="rgba(200,155,252,0.32)" filter="url(#pa-ink)" />
    <circle cx="370" cy="220" r="58" fill="rgba(140,220,184,0.3)" filter="url(#pa-ink)" />
    <circle cx="260" cy="450" r="65" fill="rgba(252,192,140,0.32)" filter="url(#pa-ink)" />
    <circle cx="420" cy="380" r="50" fill="rgba(252,148,172,0.28)" filter="url(#pa-ink)" />
    <circle cx="90" cy="260" r="55" fill="rgba(200,155,252,0.26)" filter="url(#pa-ink)" />

    {/* ── Layer 4: luminous core ── */}
    <ellipse cx="258" cy="270" rx="155" ry="140" fill="url(#p-center)" filter="url(#pa-glow)" />

    {/* ── Layer 5: ink diffusion strokes ── */}
    <path d="M80 180 C130 155 175 195 215 165 C255 135 280 175 330 150 C380 125 410 165 460 145"
      stroke="rgba(228,145,182,0.28)" strokeWidth="2.5" fill="none" filter="url(#pa-ink)" />
    <path d="M60 340 C110 310 155 355 200 320 C245 285 270 335 320 305 C370 275 405 325 455 300"
      stroke="rgba(140,188,248,0.25)" strokeWidth="2" fill="none" filter="url(#pa-ink)" />
    <path d="M90 450 C145 420 185 465 235 435 C285 405 315 450 370 420 C425 390 450 435 490 410"
      stroke="rgba(200,155,248,0.22)" strokeWidth="2" fill="none" filter="url(#pa-ink)" />
    <path d="M150 510 C195 485 235 525 280 498 C325 470 355 510 400 485"
      stroke="rgba(248,190,140,0.22)" strokeWidth="1.8" fill="none" filter="url(#pa-ink)" />
    {/* Vertical runs — gravity drips */}
    <path d="M140 80 C138 130 142 180 135 240 C128 300 140 340 132 400"
      stroke="rgba(228,145,182,0.18)" strokeWidth="1.5" fill="none" filter="url(#pa-ink)" />
    <path d="M370 60 C372 115 366 170 374 225 C382 280 368 330 376 385"
      stroke="rgba(140,220,184,0.16)" strokeWidth="1.2" fill="none" filter="url(#pa-ink)" />

    {/* ── Layer 6: scattered ink drops and spatter ── */}
    {[
      [130,105,'#f4a4c4',9,0.48],[88,195,'#c8b0f0',6,0.42],[195,82,'#a4c8f4',7,0.44],
      [370,95,'#a4dcc4',8,0.4],[440,195,'#f4a4c4',5,0.38],[465,300,'#a4c8f4',7,0.36],
      [445,420,'#c8b0f0',6,0.36],[385,500,'#f8c090',8,0.38],[270,530,'#f4a4c4',5,0.35],
      [130,490,'#a4dcc4',6,0.34],[72,390,'#f8c090',7,0.36],[75,155,'#a4c8f4',5,0.38],
      [310,100,'#c8b0f0',4,0.35],[490,145,'#f4a4c4',4,0.32],[48,310,'#a4dcc4',5,0.3],
      [200,550,'#a4c8f4',6,0.32],[430,540,'#f4a4c4',4,0.3],[480,480,'#c8b0f0',5,0.28],
    ].map(([cx,cy,fill,r,op],i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity={op} filter="url(#pa-sharp)" />
    ))}

    {/* Tiny micro-spatter */}
    {[
      [160,130,3],[280,78,2.5],[420,130,3],[490,260,2],[460,370,2.5],
      [390,455,2],[220,510,3],[110,450,2.5],[65,270,2],[155,540,2],
      [310,550,2.5],[475,510,2],[58,195,2.5],[335,68,2],[498,405,2],
    ].map(([cx,cy,r],i) => (
      <circle key={`sp${i}`} cx={cx} cy={cy} r={r}
        fill={['#f4a4c4','#a4c8f4','#c8b0f0','#a4dcc4','#f8c090'][i%5]}
        opacity={0.38 - (i%4)*0.05} />
    ))}
  </svg>
);

/* ─── Animated watercolor bloom (canvas-drawn) ───────────── */
const AnimatedBloom = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;

    const blobs = [
      { x: 0.38, y: 0.4, r: 0.28, h: 340, s: 0.65, lt: 0.72, phase: 0 },
      { x: 0.62, y: 0.55, r: 0.24, h: 210, s: 0.55, lt: 0.68, phase: 1.8 },
      { x: 0.25, y: 0.62, r: 0.2, h: 270, s: 0.5, lt: 0.75, phase: 3.2 },
      { x: 0.7, y: 0.32, r: 0.22, h: 160, s: 0.45, lt: 0.78, phase: 2.1 },
      { x: 0.5, y: 0.75, r: 0.19, h: 30, s: 0.5, lt: 0.72, phase: 4.0 },
      { x: 0.2, y: 0.28, r: 0.17, h: 300, s: 0.4, lt: 0.8, phase: 0.9 },
      { x: 0.78, y: 0.7, r: 0.16, h: 185, s: 0.45, lt: 0.76, phase: 3.7 },
    ];

    function hsl(h,s,l,a){ return `hsla(${h},${s*100}%,${l*100}%,${a})`; }

    function drawBlob(bx, by, br, h, s, l, alpha) {
      const W = canvas.width, H = canvas.height;
      const x = bx * W, y = by * H, r = br * Math.min(W, H);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0,   hsl(h, s, l, alpha * 0.9));
      grad.addColorStop(0.3, hsl(h, s * 0.9, l + 0.04, alpha * 0.6));
      grad.addColorStop(0.65,hsl(h, s * 0.75, l + 0.08, alpha * 0.25));
      grad.addColorStop(1,   hsl(h, s * 0.5, l + 0.12, 0));
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.88, t * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.005;

      blobs.forEach(b => {
        const breathe = Math.sin(t * 0.7 + b.phase) * 0.018;
        const driftX  = Math.sin(t * 0.4 + b.phase) * 0.022;
        const driftY  = Math.cos(t * 0.35 + b.phase * 1.3) * 0.016;
        const alpha   = 0.28 + Math.sin(t * 0.5 + b.phase) * 0.06;
        drawBlob(b.x + driftX, b.y + driftY, b.r + breathe, b.h, b.s, b.lt, alpha);
      });

      raf = requestAnimationFrame(draw);
    }

    const resize = () => {
      const p = canvas.parentElement;
      canvas.width  = p.offsetWidth;
      canvas.height = p.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    draw();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2, mixBlendMode: 'multiply', opacity: 0.85 }}
      aria-hidden="true"
    />
  );
};

/* ─── Glass card ─────────────────────────────────────────── */
const GlassCard = ({ children, style = {} }) => (
  <div style={{
    background: 'rgba(255,255,255,0.48)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.75)',
    borderRadius: '20px',
    boxShadow: '0 4px 32px rgba(200,160,200,0.13), inset 0 1px 0 rgba(255,255,255,0.85)',
    ...style,
  }}>
    {children}
  </div>
);

/* ─── Hero ───────────────────────────────────────────────── */
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => setMousePos({
      x: (e.clientX / window.innerWidth  - 0.5) * 12,
      y: (e.clientY / window.innerHeight - 0.5) * 8,
    });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <section style={{
      fontFamily: "'DM Sans', sans-serif",
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #fdf6f0 0%, #fef0f5 30%, #f5f0ff 60%, #f0f8ff 100%)',
      display: 'flex',
      alignItems: 'center',
    }}>
      <GoogleFontLoader />

      <style>{`
        @keyframes floatA {
          0%,100% { transform:translate(-50%,-50%) translateY(0) rotate(0deg); }
          33%      { transform:translate(-50%,-50%) translateY(-18px) rotate(3deg); }
          66%      { transform:translate(-50%,-50%) translateY(10px) rotate(-2deg); }
        }
        @keyframes floatB {
          0%,100% { transform:translate(-50%,-50%) translateY(0) rotate(0deg); }
          40%     { transform:translate(-50%,-50%) translateY(14px) rotate(-4deg); }
          75%     { transform:translate(-50%,-50%) translateY(-20px) rotate(2deg); }
        }
        @keyframes floatC {
          0%,100% { transform:translate(-50%,-50%) translateY(0) scale(1); }
          50%     { transform:translate(-50%,-50%) translateY(-12px) scale(1.04); }
        }
        @keyframes artFloat {
          0%,100% { transform:translateY(0) rotate(0deg); }
          50%     { transform:translateY(-16px) rotate(1deg); }
        }
        @keyframes shimmer {
          0%,100% { opacity:0.6; }
          50%     { opacity:1; }
        }
        @keyframes breatheA {
          0%,100% { opacity:0.55; transform:scale(1); }
          50%     { opacity:0.78; transform:scale(1.06); }
        }
        @keyframes breatheB {
          0%,100% { opacity:0.48; transform:scale(1) rotate(0deg); }
          50%     { opacity:0.68; transform:scale(1.04) rotate(2deg); }
        }
        @keyframes bloomPulse {
          0%,100% { opacity:0.3; transform:scale(1); }
          50%     { opacity:0.5; transform:scale(1.08); }
        }
        .hero-tag { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.62); border:1px solid rgba(220,180,220,0.45); border-radius:100px; padding:6px 16px 6px 8px; }
        .cta-primary { background:linear-gradient(135deg,#e88ab0 0%,#d070a0 100%); color:white; border:none; border-radius:100px; padding:14px 32px; font-size:14px; font-weight:500; font-family:'DM Sans',sans-serif; cursor:pointer; letter-spacing:0.02em; transition:transform 0.2s ease,box-shadow 0.2s ease; box-shadow:0 4px 20px rgba(210,100,160,0.3); }
        .cta-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(210,100,160,0.4); }
        .cta-secondary { background:rgba(255,255,255,0.5); color:#8860a0; border:1px solid rgba(200,160,220,0.4); border-radius:100px; padding:14px 32px; font-size:14px; font-weight:400; font-family:'DM Sans',sans-serif; cursor:pointer; letter-spacing:0.02em; transition:all 0.2s ease; backdrop-filter:blur(8px); }
        .cta-secondary:hover { background:rgba(255,255,255,0.78); transform:translateY(-2px); }
        .stat-pill:hover { transform:translateY(-3px); transition:transform 0.3s ease; }
      `}</style>

      {/* ── Full-canvas watercolor washes ── */}
      <BackgroundWash />

      {/* ── Paper grain ── */}
      <PaperGrain />

      {/* ── Animated ambient blobs (DOM layer) ── */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:3 }}>
        <div style={{ position:'absolute', left:'-5%', top:'-10%', width:'55%', height:'65%', borderRadius:'30% 70% 60% 40% / 40% 50% 60% 50%', background:'radial-gradient(ellipse, rgba(248,180,210,0.38) 0%, rgba(248,200,230,0.15) 60%, transparent 100%)', filter:'blur(55px)', animation:'breatheA 13s ease-in-out infinite' }} />
        <div style={{ position:'absolute', right:'-8%', top:'10%', width:'50%', height:'60%', borderRadius:'60% 40% 30% 70% / 50% 70% 30% 50%', background:'radial-gradient(ellipse, rgba(180,210,255,0.3) 0%, rgba(200,220,255,0.12) 60%, transparent 100%)', filter:'blur(65px)', animation:'breatheB 16s ease-in-out infinite' }} />
        <div style={{ position:'absolute', left:'20%', bottom:'-5%', width:'60%', height:'50%', borderRadius:'50% 50% 30% 70% / 60% 40% 60% 40%', background:'radial-gradient(ellipse, rgba(255,210,180,0.3) 0%, rgba(255,220,200,0.12) 60%, transparent 100%)', filter:'blur(50px)', animation:'breatheA 11s ease-in-out infinite 2s' }} />
        <div style={{ position:'absolute', left:'40%', top:'20%', width:'35%', height:'40%', borderRadius:'40% 60% 70% 30% / 50% 40% 60% 50%', background:'radial-gradient(ellipse, rgba(210,180,255,0.25) 0%, transparent 70%)', filter:'blur(75px)', animation:'breatheB 19s ease-in-out infinite reverse' }} />
        <div style={{ position:'absolute', right:'5%', bottom:'10%', width:'30%', height:'35%', borderRadius:'60% 40% 50% 50%', background:'radial-gradient(ellipse, rgba(160,230,210,0.25) 0%, transparent 70%)', filter:'blur(55px)', animation:'breatheA 14s ease-in-out infinite reverse 3s' }} />
      </div>

      {/* ── Main layout ── */}
      <div style={{
        position:'relative', zIndex:10,
        maxWidth:'1280px', width:'100%', margin:'0 auto',
        padding:'80px 40px',
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
        gap:'64px',
        alignItems:'center',
      }}>

        {/* ══ LEFT COLUMN ══ */}
        <div style={{ display:'flex', flexDirection:'column', gap:'32px' }}>

          {/* Headline */}
          <div style={{ opacity:mounted?1:0, transform:mounted?'none':'translateY(24px)', transition:'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s' }}>
            <h1 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontWeight:300, fontSize:'clamp(52px, 7vw, 88px)', lineHeight:1.02, letterSpacing:'-0.02em', color:'#2a1830', margin:0 }}>
              Where Art{' '}
              <em style={{ fontStyle:'italic', background:'linear-gradient(135deg,#d870a8 0%,#9060d0 50%,#60a0e8 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Breathes
              </em>
            </h1>
            <h1 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontWeight:300, fontSize:'clamp(52px, 7vw, 88px)', lineHeight:1.02, letterSpacing:'-0.02em', color:'#2a1830', margin:0 }}>
              Into Life
            </h1>
          </div>

          {/* Decorative rule */}
          <div style={{ opacity:mounted?1:0, transition:'opacity 0.6s ease 0.35s', display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ height:1, width:48, background:'linear-gradient(90deg, rgba(210,130,180,0.65), transparent)' }} />
            <div style={{ width:6, height:6, borderRadius:'50%', background:'rgba(210,130,180,0.55)' }} />
            <div style={{ height:1, flex:1, background:'rgba(210,130,180,0.15)' }} />
          </div>

          {/* Body */}
          <p style={{ opacity:mounted?1:0, transform:mounted?'none':'translateY(16px)', transition:'opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s', fontSize:17, lineHeight:1.75, color:'#6a5070', fontWeight:300, maxWidth:420, margin:0 }}>
            A curated space for creative work — fluid, expressive, and alive.
            Each piece painted with intention, each project crafted like a poem.
          </p>

          {/* Tags */}
          <div style={{ opacity:mounted?1:0, transition:'opacity 0.6s ease 0.5s', display:'flex', flexWrap:'wrap', gap:8 }}>
            {['Illustration','Brand Identity','Digital Art','Editorial'].map(tag => (
              <span key={tag} style={{ fontSize:12, fontWeight:400, color:'#9070b0', background:'rgba(200,170,230,0.2)', border:'1px solid rgba(200,170,230,0.35)', borderRadius:'100px', padding:'6px 14px', letterSpacing:'0.02em' }}>
                {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ opacity:mounted?1:0, transform:mounted?'none':'translateY(16px)', transition:'opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s', display:'flex', flexWrap:'wrap', gap:12 }}>
            <button className="cta-primary">View Portfolio</button>
            <button className="cta-secondary">Get in Touch</button>
          </div>

          {/* Stats */}
          <div style={{ opacity:mounted?1:0, transition:'opacity 0.7s ease 0.7s', display:'flex', gap:24, paddingTop:8 }}>
            {[{ value:'120+', label:'Projects' },{ value:'8 yrs', label:'Experience' },{ value:'40+', label:'Clients' }].map(({ value, label }) => (
              <div key={label} className="stat-pill" style={{ textAlign:'center', cursor:'default' }}>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:28, fontWeight:400, color:'#3a2048', lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:11, color:'#a090b0', letterSpacing:'0.06em', textTransform:'uppercase', marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT COLUMN — Artwork ══ */}
        <div style={{
          position:'relative', display:'flex', justifyContent:'center', alignItems:'center',
          minHeight:520,
          opacity:mounted?1:0, transition:'opacity 0.9s ease 0.3s',
        }}>
          {/* Parallax wrapper */}
          <div style={{
            transform:`translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
            transition:'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
            position:'relative', width:'100%', maxWidth:480, aspectRatio:'1 / 1.05',
          }}>

            {/* ── Outer glow halo ── */}
            <div style={{
              position:'absolute', inset:'-8%',
              borderRadius:'50%',
              background:'radial-gradient(ellipse, rgba(230,170,210,0.22) 0%, rgba(180,200,248,0.12) 50%, transparent 75%)',
              filter:'blur(30px)',
              animation:'bloomPulse 9s ease-in-out infinite',
              zIndex:0,
            }} aria-hidden="true" />

            {/* ── Static SVG washes ── */}
            <div style={{ position:'absolute', inset:0, borderRadius:40, overflow:'hidden', zIndex:1 }}>
              <WatercolorArtwork />
            </div>

            {/* ── Animated canvas bloom layer ── */}
            <div style={{ position:'absolute', inset:0, borderRadius:40, overflow:'hidden', zIndex:2 }}>
              <AnimatedBloom />
            </div>

            {/* ── Glass cards ── */}

            {/* Card top-left: Current Series */}
            <GlassCard style={{
              position:'absolute', top:'8%', left:'-6%',
              padding:'14px 18px', zIndex:10,
              animation:'artFloat 6s ease-in-out infinite',
              transform:`translate(${mousePos.x * -0.15}px, ${mousePos.y * -0.15}px)`,
              transition:'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
            }}>
              <div style={{ fontSize:11, color:'#c080b0', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:4 }}>Current Series</div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:18, color:'#3a2048', fontWeight:400 }}>Petal & Mist</div>
              <div style={{ display:'flex', gap:4, marginTop:6 }}>
                {['#f4a8c7','#a8c8f4','#a8e8d0','#f4d4a0'].map(c => (
                  <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c, border:'1px solid rgba(255,255,255,0.8)' }} />
                ))}
              </div>
            </GlassCard>

            {/* Card bottom-right: Featured Work */}
            <GlassCard style={{
              position:'absolute', bottom:'8%', right:'-8%',
              padding:'16px 20px', zIndex:10,
              animation:'artFloat 8s ease-in-out infinite reverse',
              transform:`translate(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px)`,
              transition:'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#f4a8c7,#a8c8f4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>✦</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'#3a2048' }}>Featured Work</div>
                  <div style={{ fontSize:11, color:'#a090b0' }}>Awwwards Nominee</div>
                </div>
              </div>
              <div style={{ height:1, background:'rgba(200,170,230,0.3)', marginBottom:8 }} />
              <div style={{ display:'flex', gap:6 }}>
                {['Dreaming','Series No. 4'].map(t => (
                  <span key={t} style={{ fontSize:10, color:'#9060c0', background:'rgba(180,140,220,0.15)', borderRadius:100, padding:'3px 10px', border:'1px solid rgba(180,140,220,0.25)' }}>{t}</span>
                ))}
              </div>
            </GlassCard>

            {/* Card top-right: Collections */}
            <GlassCard style={{
              position:'absolute', top:'22%', right:'-4%',
              padding:'12px 16px', zIndex:10,
              animation:'artFloat 7s ease-in-out infinite 1s',
              transform:`translate(${mousePos.x * 0.1}px, ${mousePos.y * -0.2}px)`,
              transition:'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
            }}>
              <div style={{ fontSize:20, fontFamily:"'Cormorant Garamond', serif", color:'#8060b0', lineHeight:1 }}>03</div>
              <div style={{ fontSize:10, color:'#b090c0', marginTop:2, letterSpacing:'0.06em' }}>COLLECTIONS</div>
            </GlassCard>

            {/* ── Centre frosted pane ── */}
            <div style={{
              position:'absolute', inset:'10%', borderRadius:28,
              background:'rgba(255,255,255,0.18)',
              backdropFilter:'blur(3px)', WebkitBackdropFilter:'blur(3px)',
              border:'1px solid rgba(255,255,255,0.5)',
              display:'flex', alignItems:'center', justifyContent:'center',
              overflow:'hidden', zIndex:5,
            }}>
              <svg viewBox="0 0 280 300" xmlns="http://www.w3.org/2000/svg" style={{ width:'80%', height:'80%' }} aria-hidden="true">
                <defs>
                  <filter id="inner-blur"><feGaussianBlur stdDeviation="3.5" /></filter>
                  <filter id="inner-ink" x="-15%" y="-15%" width="130%" height="130%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05 0.04" numOctaves="3" seed="4" result="t" />
                    <feDisplacementMap in="SourceGraphic" in2="t" scale="12" xChannelSelector="R" yChannelSelector="G" result="d" />
                    <feGaussianBlur in="d" stdDeviation="2.5" />
                  </filter>
                  <radialGradient id="if1" cx="40%" cy="35%" r="55%">
                    <stop offset="0%" stopColor="#f4a8c7" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#f4a8c7" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="if2" cx="65%" cy="65%" r="50%">
                    <stop offset="0%" stopColor="#a8c8f4" stopOpacity="0.78" />
                    <stop offset="100%" stopColor="#a8c8f4" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="if3" cx="50%" cy="50%" r="40%">
                    <stop offset="0%" stopColor="#d8b4f8" stopOpacity="0.68" />
                    <stop offset="100%" stopColor="#d8b4f8" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="if4" cx="25%" cy="70%" r="38%">
                    <stop offset="0%" stopColor="#a8e4c8" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a8e4c8" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="if5" cx="78%" cy="28%" r="35%">
                    <stop offset="0%" stopColor="#fcc898" stopOpacity="0.58" />
                    <stop offset="100%" stopColor="#fcc898" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Deep background washes */}
                <ellipse cx="108" cy="108" rx="98" ry="93" fill="url(#if1)" filter="url(#inner-blur)" />
                <ellipse cx="175" cy="188" rx="94" ry="88" fill="url(#if2)" filter="url(#inner-blur)" />
                <ellipse cx="138" cy="150" rx="65" ry="60" fill="url(#if3)" filter="url(#inner-blur)" />
                <ellipse cx="68" cy="195" rx="60" ry="55" fill="url(#if4)" filter="url(#inner-blur)" />
                <ellipse cx="210" cy="95" rx="55" ry="50" fill="url(#if5)" filter="url(#inner-blur)" />

                {/* Wet-on-wet bloom spots */}
                <circle cx="105" cy="105" r="48" fill="rgba(248,155,195,0.38)" filter="url(#inner-ink)" />
                <circle cx="178" cy="185" r="42" fill="rgba(140,190,248,0.35)" filter="url(#inner-ink)" />
                <circle cx="140" cy="150" r="35" fill="rgba(200,155,248,0.32)" filter="url(#inner-ink)" />

                {/* Petal shapes */}
                <path d="M140 58 C162 80,182 112,160 142 C138 172,108 170,98 140 C88 110,110 78,140 58Z" fill="rgba(244,168,199,0.32)" filter="url(#inner-ink)" />
                <path d="M140 58 C118 80,98 112,118 142 C138 172,170 166,176 138 C182 110,166 80,140 58Z" fill="rgba(168,200,244,0.28)" filter="url(#inner-ink)" />
                {/* Extra petals */}
                <path d="M140 148 C155 110,195 100,210 125 C225 150,205 185,175 190 C145 195,125 186,140 148Z" fill="rgba(200,155,248,0.22)" filter="url(#inner-ink)" />
                <path d="M140 148 C125 110,85 100,70 125 C55 150,75 185,105 190 C135 195,155 186,140 148Z" fill="rgba(168,232,200,0.2)" filter="url(#inner-ink)" />

                {/* Ink diffusion strokes */}
                <path d="M60 90 C90 75 120 95 148 78" stroke="rgba(228,145,182,0.28)" strokeWidth="1.8" fill="none" filter="url(#inner-ink)" />
                <path d="M155 220 C185 208 215 228 245 215" stroke="rgba(140,188,248,0.25)" strokeWidth="1.5" fill="none" filter="url(#inner-ink)" />
                <path d="M50 195 C75 180 98 200 118 185" stroke="rgba(200,155,248,0.22)" strokeWidth="1.2" fill="none" filter="url(#inner-ink)" />

                {/* Center bloom */}
                <circle cx="140" cy="148" r="20" fill="rgba(255,255,255,0.75)" />
                <circle cx="140" cy="148" r="12" fill="rgba(216,180,248,0.85)" />
                <circle cx="140" cy="148" r="5"  fill="rgba(180,120,220,0.92)" />

                {/* Micro ink drops */}
                {[
                  [88,85,'#f4a4c4',4],[195,115,'#a4c4f4',3.5],[175,228,'#a4dcc4',4],
                  [78,198,'#a4c4f4',3],[218,195,'#f8c090',3.5],[58,140,'#d8b4f8',3],
                  [222,148,'#f4a4c4',3],[155,52,'#a4dcc4',3],[125,248,'#a4c4f4',3.5],
                ].map(([cx,cy,fill,r],i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} fill={fill} opacity={0.5 - i*0.02} />
                ))}

                {/* Fine hair lines */}
                <line x1="140" y1="36" x2="140" y2="50" stroke="rgba(210,150,200,0.4)" strokeWidth="1" />
                <line x1="98"  y1="52" x2="106" y2="64" stroke="rgba(210,150,200,0.35)" strokeWidth="0.8" />
                <line x1="182" y1="52" x2="174" y2="64" stroke="rgba(210,150,200,0.35)" strokeWidth="0.8" />
                <line x1="62"  y1="148" x2="75"  y2="148" stroke="rgba(168,192,248,0.3)" strokeWidth="0.8" />
                <line x1="205" y1="148" x2="218" y2="148" stroke="rgba(168,192,248,0.3)" strokeWidth="0.8" />
              </svg>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:mounted?0.6:0, transition:'opacity 1s ease 1s', zIndex:10 }}>
        <span style={{ fontSize:10, color:'#a090b0', letterSpacing:'0.12em', textTransform:'uppercase' }}>Scroll</span>
        <div style={{ width:1, height:32, background:'linear-gradient(180deg, rgba(180,140,200,0.6), transparent)', animation:'shimmer 2s ease-in-out infinite' }} />
      </div>
    </section>
  );
}