
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';

/* ================================================================== */
/*  Rubik's Cube — 3D Rotate                                          */
/*                                                                    */
/*  A GIANT, real 3×3×3 Rubik's cube (27 cubies) lives behind the     */
/*  entire page and "solves itself" forever: the whole cube spins in  */
/*  3D while random horizontal / vertical / depth layers turn with    */
/*  mechanical easing. Scroll adds rotational momentum (inertia +      */
/*  damping); the cursor adds a subtle parallax. Layer turns commit    */
/*  their permutation seamlessly (no snap) because each turn lands on  */
/*  an exact 90°.                                                      */
/*                                                                    */
/*  All motion is driven imperatively through refs + one rAF loop, so  */
/*  React never re-renders during animation. Every section element is  */
/*  a frosted "cube piece" that tilts toward the cursor, catches a     */
/*  light reflection, and floats in space above the giant cube.        */
/* ================================================================== */

/* Classic Rubik's palette */
const CUBE = {
  white: '#F4F6FB',
  blue: '#1E66E8',
  red: '#E5352F',
  green: '#27A35A',
  yellow: '#F2C415',
  orange: '#F2820D',
};
const DARK = '#0A0B11'; // interior plastic of the cube

/* 27 cubie positions in a fixed, reproducible order. The engine reads
   the DOM in this same order so logical state stays aligned. */
const POSITIONS = [];
for (let x = -1; x <= 1; x++)
  for (let y = -1; y <= 1; y++)
    for (let z = -1; z <= 1; z++) POSITIONS.push([x, y, z]);

const AXIS_CSS = ['rotateX', 'rotateY', 'rotateZ'];

/* Exact 90° rotation of an integer vector about an axis (matches the
   matrix CSS rotateX/Y/Z use, so committing a turn is seamless). */
function rot(axis, dir, v) {
  const [x, y, z] = v;
  if (axis === 0) return dir > 0 ? [x, -z, y] : [x, z, -y];
  if (axis === 1) return dir > 0 ? [z, y, -x] : [-z, y, x];
  return dir > 0 ? [-y, x, z] : [y, -x, z];
}

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* Build the CSS transform for a cubie given its committed pos, its
   orientation (3 column vectors), and the live layer-turn angle. */
function cubieTransform(pos, orient, axis, angleDeg) {
  const [x, y, z] = pos;
  const o = orient;
  const m =
    `matrix3d(${o[0][0]},${o[0][1]},${o[0][2]},0,` +
    `${o[1][0]},${o[1][1]},${o[1][2]},0,` +
    `${o[2][0]},${o[2][1]},${o[2][2]},0,0,0,0,1)`;
  const spin = angleDeg ? `${AXIS_CSS[axis]}(${angleDeg}deg) ` : '';
  return `${spin}translate3d(calc(var(--G) * ${x}),calc(var(--G) * ${y}),calc(var(--G) * ${z})) ${m}`;
}

const IDENTITY = () => [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

/* ------------------------------------------------------------------ */
/*  A single cubie: 6 faces, only outward ones get a bright sticker.  */
/* ------------------------------------------------------------------ */
function Cubie({ pos }) {
  const [x, y, z] = pos;
  const faces = [
    { k: 'fz', t: 'translateZ(calc(var(--F) / 2))', c: z === 1 ? CUBE.red : DARK },
    { k: 'bz', t: 'rotateY(180deg) translateZ(calc(var(--F) / 2))', c: z === -1 ? CUBE.orange : DARK },
    { k: 'rx', t: 'rotateY(90deg) translateZ(calc(var(--F) / 2))', c: x === 1 ? CUBE.blue : DARK },
    { k: 'lx', t: 'rotateY(-90deg) translateZ(calc(var(--F) / 2))', c: x === -1 ? CUBE.green : DARK },
    { k: 'ty', t: 'rotateX(90deg) translateZ(calc(var(--F) / 2))', c: y === -1 ? CUBE.white : DARK },
    { k: 'by', t: 'rotateX(-90deg) translateZ(calc(var(--F) / 2))', c: y === 1 ? CUBE.yellow : DARK },
  ];
  const base = cubieTransform(pos, IDENTITY(), 0, 0);
  return (
    <div className="rk-cubie" data-cubie style={{ transform: base }}>
      {faces.map((f) => (
        <span key={f.k} className="rk-cubie-face" style={{ transform: f.t, '--c': f.c }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The giant self-solving background cube + ambient environment.     */
/* ------------------------------------------------------------------ */
function GiantCube() {
  const cubeRef = useRef(null);
  const rootRef = useRef(null);

  /* Decorative floating fragments — computed once, stable across renders. */
  const fragments = useMemo(() => {
    const seeds = [11, 29, 47, 7, 83, 61, 37, 19, 71, 53, 97, 5];
    return seeds.map((s, i) => ({
      id: i,
      left: (s * 13) % 100,
      top: (s * 37) % 100,
      size: 14 + ((s * 7) % 26),
      dur: 16 + ((s * 3) % 18),
      delay: -((s * 5) % 20),
      hue: [CUBE.red, CUBE.blue, CUBE.green, CUBE.yellow, CUBE.orange][i % 5],
    }));
  }, []);

  useEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;
    const cubies = Array.from(cube.querySelectorAll('[data-cubie]')).map((el, i) => ({
      el,
      pos: [...POSITIONS[i]],
      orient: IDENTITY(),
    }));

    // "Reduced motion" no longer freezes the cube — the cube must always
    // keep turning its slices. It only calms the cube: slower spin, slower
    // layer turns, and no scroll/cursor reactivity (which is the jarring,
    // input-driven part that the preference is really about).
    const calm =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- whole-cube rotation state (inertia / damping) ----
    let rotX = -26;
    let rotY = -32;
    let velX = 0;
    let velY = calm ? 0.05 : 0.16; // gentle idle drift
    let pointerX = 0;
    let pointerY = 0;
    let parX = 0;
    let parY = 0;
    let lastScroll = window.scrollY || 0;

    // ---- layer-turn state machine ----
    let turn = null; // { axis, dir, layer, start, dur, members[] }
    let nextTurnAt = 0; // timestamp to begin the next turn (brief rest between moves)
    let lastKey = '';

    const startTurn = (ts) => {
      // Pick a fresh axis+layer (avoid immediately repeating the same slice).
      let axis, layer, key;
      let guard = 0;
      do {
        axis = Math.floor(Math.random() * 3);
        layer = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        key = `${axis}:${layer}`;
        guard++;
      } while (key === lastKey && guard < 6);
      lastKey = key;
      const dir = Math.random() > 0.5 ? 1 : -1;
      const members = cubies.filter((c) => c.pos[axis] === layer);
      const base = calm ? 1100 : 620;
      const span = calm ? 400 : 520;
      turn = { axis, dir, layer, start: ts, dur: base + Math.random() * span, members };
    };

    const commitTurn = (ts) => {
      const { axis, dir, members } = turn;
      members.forEach((c) => {
        c.pos = rot(axis, dir, c.pos);
        c.orient = c.orient.map((col) => rot(axis, dir, col));
        c.el.style.transform = cubieTransform(c.pos, c.orient, 0, 0);
      });
      turn = null;
      // Short, human-like rest before the next slice turn begins.
      nextTurnAt = ts + (calm ? 420 : 220) + Math.random() * 260;
    };

    const onScroll = () => {
      if (calm) return;
      const y = window.scrollY || 0;
      const d = y - lastScroll;
      lastScroll = y;
      velY += d * 0.02; // scroll down -> forward, up -> backward
      velX += d * 0.006;
    };
    const onPointer = (e) => {
      if (calm) return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      pointerX = (e.clientX / w - 0.5) * 2;
      pointerY = (e.clientY / h - 0.5) * 2;
    };

    let raf = 0;
    let running = true;
    const tick = (ts) => {
      // idle drift, momentum + friction
      velY += (0.16 - velY) * 0.012;
      rotY += velY;
      rotX += velX;
      velX *= 0.92;
      if (rotX > -10) velX -= 0.05;
      if (rotX < -44) velX += 0.05;

      // eased cursor parallax (kept subtle for a premium feel)
      parX += (pointerX * 6 - parX) * 0.05;
      parY += (pointerY * 5 - parY) * 0.05;

      cube.style.transform =
        `translateZ(calc(var(--S) * -0.35)) rotateX(${rotX - parY}deg) rotateY(${rotY + parX}deg)`;

      // layer-turn mechanism: rest briefly between moves, then turn one
      // slice at a time (start -> ease -> commit -> rest -> repeat).
      if (!turn) {
        if (ts >= nextTurnAt) startTurn(ts);
      } else {
        const p = (ts - turn.start) / turn.dur;
        if (p >= 1) {
          commitTurn(ts);
        } else {
          const ang = turn.dir * 90 * easeInOut(p);
          for (const c of turn.members) {
            c.el.style.transform = cubieTransform(c.pos, c.orient, turn.axis, ang);
          }
        }
      }
      if (running) raf = window.requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        // resync timers so the cube resumes smoothly (no fast-forward).
        const now = performance.now();
        if (turn) turn.start = now - 1;
        nextTurnAt = Math.min(nextTurnAt, now + 200);
        raf = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    raf = window.requestAnimationFrame(tick);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="rk-bg" aria-hidden="true" ref={rootRef}>
      {/* depth fog + ambient sheen */}
      <div className="rk-fog rk-fog-1" />
      <div className="rk-fog rk-fog-2" />
      <div className="rk-sheen" />

      {/* floating cube fragments */}
      {fragments.map((f) => (
        <span
          key={f.id}
          className="rk-frag"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            width: f.size,
            height: f.size,
            background: f.hue,
            animationDuration: `${f.dur}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}

      {/* the giant cube */}
      <div className="rk-bg-stage">
        <div className="rk-cube" ref={cubeRef}>
          {POSITIONS.map((pos) => (
            <Cubie key={pos.join(',')} pos={pos} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable premium primitives                                       */
/* ------------------------------------------------------------------ */

/* Char-by-char reveal with a soft idle breathe on the wrapper. */
const charReveal = {
  hidden: { opacity: 0, y: '0.5em', rotateX: -85 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: 0.2 + i * 0.035, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};
function SplitText({ text = '', className = '', gradient = false }) {
  // Split into words. Each word is an inline-block that never breaks
  // internally (white-space: nowrap), so a word that starts on a line
  // always ends on the same line — on every screen size. Line breaks
  // can only happen at the spaces between words. Characters still
  // animate individually for the per-letter reveal.
  const words = text.split(' ');
  let idx = 0;
  return (
    <span className={`rk-split ${className}`}>
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="rk-word">
            {[...word].map((ch) => {
              const i = idx++;
              return (
                <motion.span
                  key={i}
                  className={gradient ? 'rk-grad' : undefined}
                  custom={i}
                  variants={charReveal}
                  initial="hidden"
                  animate="show"
                  style={{ display: 'inline-block', whiteSpace: 'pre' }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 && <span className="rk-space"> </span>}
        </React.Fragment>
      ))}
    </span>
  );
}

/* Section heading: letters assemble in 3D, then idle-float gently. */
function AnimatedHeading({ kicker, title }) {
  const letters = [...title];
  return (
    <div className="rk-head">
      <motion.span
        className="rk-kicker"
        initial={{ opacity: 0, letterSpacing: '0.6em', y: 10 }}
        whileInView={{ opacity: 1, letterSpacing: '0.28em', y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {kicker}
      </motion.span>
      <h2 className="rk-display rk-h2 rk-float-soft">
        {letters.map((ch, i) => (
          <motion.span
            key={i}
            className="rk-h2-ltr"
            initial={{ opacity: 0, y: 46, rotateX: -90, z: -80 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.05, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {ch}
          </motion.span>
        ))}
      </h2>
    </div>
  );
}

/* A frosted cube piece that tilts toward the cursor, catches a moving
   light reflection, floats idly, and enters in 3D. Layers (entrance /
   float / tilt) are separated so their transforms never collide. */
function TiltCard({
  children,
  edge,
  className = '',
  style = {},
  floatDur = 7,
  delay = 0,
  tiltMax = 9,
}) {
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 160, damping: 18 });
  const ry = useSpring(0, { stiffness: 160, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry.set((px - 0.5) * tiltMax * 2);
      rx.set(-(py - 0.5) * tiltMax * 2);
      gx.set(px * 100);
      gy.set(py * 100);
    },
    [rx, ry, gx, gy, tiltMax]
  );
  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }, [rx, ry, gx, gy]);

  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.16), transparent 50%)`;

  return (
    <motion.div
      className="rk-enter"
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rk-float" style={{ animationDuration: `${floatDur}s` }}>
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={`rk-tile ${className}`}
          style={{ ...style, '--edge': edge, rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        >
          <motion.div className="rk-glare" style={{ background: glare }} />
          <div className="rk-tile-in">{children}</div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
export default function RubiksCube3DRotate() {
  const { portfolioData } = usePortfolio();

  // Hero text parallax (subtle, springed) — layered against the cube.
  const hxRaw = useMotionValue(0);
  const hyRaw = useMotionValue(0);
  const hx = useSpring(hxRaw, { stiffness: 120, damping: 20 });
  const hy = useSpring(hyRaw, { stiffness: 120, damping: 20 });
  const onHeroMove = useCallback(
    (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      hxRaw.set((e.clientX / w - 0.5) * -26);
      hyRaw.set((e.clientY / h - 0.5) * -18);
    },
    [hxRaw, hyRaw]
  );

  if (!portfolioData) return <div className="p-10 text-center">Scrambling the cube…</div>;
  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;

  const projEdges = [
    'linear-gradient(90deg, var(--red), var(--orange))',
    'linear-gradient(90deg, var(--blue), var(--green))',
    'linear-gradient(90deg, var(--yellow), var(--red))',
  ];
  const skillEdges = [
    'linear-gradient(120deg, var(--red), var(--orange))',
    'linear-gradient(120deg, var(--blue), var(--green))',
    'linear-gradient(120deg, var(--yellow), var(--orange))',
    'linear-gradient(120deg, var(--green), var(--blue))',
  ];
  const skillFaces = [CUBE.red, CUBE.blue, CUBE.green, CUBE.yellow, CUBE.orange];

  return (
    <div className="rk-root">
      <style>{`
        .rk-root {
          --paper: #060810;
          --ink: #E7ECF6;
          --muted: #93A0B8;
          --white: ${CUBE.white}; --blue: ${CUBE.blue}; --red: ${CUBE.red};
          --green: ${CUBE.green}; --yellow: ${CUBE.yellow}; --orange: ${CUBE.orange};
          --S: min(70vw, 70vh);
          --F: calc(var(--S) / 3.25);
          --G: calc(var(--F) * 1.08);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--ink);
          background:
            radial-gradient(1200px 700px at 82% -8%, rgba(30,102,232,0.16), transparent 60%),
            radial-gradient(1000px 600px at 4% 18%, rgba(229,53,47,0.13), transparent 60%),
            radial-gradient(900px 600px at 50% 112%, rgba(39,163,90,0.12), transparent 60%),
            var(--paper);
          position: relative; overflow-x: hidden; min-height: 100vh;
        }
        .rk-root * { box-sizing: border-box; }
        .rk-display { font-family: 'Sora', 'Inter', sans-serif; letter-spacing: -0.025em; }

        /* ---------- BACKGROUND ENVIRONMENT ---------- */
        .rk-bg { position: fixed; inset: 0; z-index: 0; display: grid; place-items: center; pointer-events: none; overflow: hidden; }
        .rk-bg::after { content: ''; position: absolute; inset: 0; background: radial-gradient(62% 62% at 50% 48%, transparent 32%, rgba(6,8,16,0.6) 100%); }
        .rk-fog { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
        .rk-fog-1 { width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(30,102,232,0.28), transparent 70%); top: -10%; left: -8%; animation: rk-fog 26s ease-in-out infinite; }
        .rk-fog-2 { width: 55vw; height: 55vw; background: radial-gradient(circle, rgba(229,53,47,0.22), transparent 70%); bottom: -12%; right: -6%; animation: rk-fog 32s ease-in-out infinite reverse; }
        @keyframes rk-fog { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(4%, 6%, 0) scale(1.12); } }
        .rk-sheen { position: absolute; width: 140vmax; height: 140vmax; background: conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.05) 40deg, transparent 90deg, transparent 360deg); opacity: 0.5; animation: rk-spin360 60s linear infinite; }
        @keyframes rk-spin360 { to { transform: rotate(360deg); } }
        .rk-frag { position: absolute; border-radius: 5px; opacity: 0.35; box-shadow: inset 0 0 8px rgba(0,0,0,0.4), 0 0 16px rgba(255,255,255,0.08); animation-name: rk-frag; animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
        @keyframes rk-frag {
          0%   { transform: translateY(0) rotate3d(1,1,0, 0deg); }
          50%  { transform: translateY(-28px) rotate3d(1,1,1, 180deg); }
          100% { transform: translateY(0) rotate3d(1,1,0, 360deg); }
        }

        .rk-bg-stage { width: var(--S); height: var(--S); perspective: 1500px; opacity: 0.5; filter: drop-shadow(0 60px 90px rgba(0,0,0,0.6)); }
        .rk-cube { position: relative; width: var(--F); height: var(--F); margin: auto; top: calc(50% - var(--F) / 2); transform-style: preserve-3d; transform: translateZ(calc(var(--S) * -0.35)) rotateX(-26deg) rotateY(-32deg); will-change: transform; }
        .rk-cubie { position: absolute; width: var(--F); height: var(--F); transform-style: preserve-3d; will-change: transform; }
        .rk-cubie-face {
          position: absolute; width: var(--F); height: var(--F);
          background: var(--c); border-radius: calc(var(--F) * 0.12);
          border: 2px solid rgba(0,0,0,0.55);
          box-shadow: inset 0 0 calc(var(--F) * 0.14) rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.16);
          backface-visibility: hidden;
        }

        /* ---------- LAYOUT ---------- */
        .rk-section { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; padding: 6.5rem 6vw; }
        .rk-head { margin-bottom: 3rem; }
        .rk-h2 { font-size: clamp(2rem, 4.5vw, 3.3rem); margin: 0; font-weight: 800; color: #FFFFFF; perspective: 700px; }
        .rk-kicker { display: inline-block; font-size: 0.72rem; letter-spacing: 0.28em; text-transform: uppercase; font-weight: 800; margin-bottom: 0.85rem;
          background: linear-gradient(100deg, var(--red), var(--orange) 40%, var(--yellow)); -webkit-background-clip: text; background-clip: text; color: transparent; }

        /* idle motions (transform-only, GPU friendly) */
        .rk-float { animation: rk-float 7s ease-in-out infinite; will-change: transform; }
        @keyframes rk-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .rk-float-soft { display: inline-block; animation: rk-floatsoft 6s ease-in-out infinite; }
        @keyframes rk-floatsoft { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

        /* ---------- TILE / CUBE PIECE ---------- */
        .rk-enter { transform-style: preserve-3d; }
        .rk-tile {
          position: relative; border-radius: 22px; padding: 2.4rem;
          background: linear-gradient(160deg, rgba(255,255,255,0.075), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.10);
          backdrop-filter: blur(16px) saturate(125%); -webkit-backdrop-filter: blur(16px) saturate(125%);
          box-shadow: 0 1px 0 rgba(255,255,255,0.14) inset, 0 28px 60px -26px rgba(0,0,0,0.7);
          transform-style: preserve-3d; overflow: hidden;
        }
        .rk-tile::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px; background: var(--edge, linear-gradient(90deg, var(--red), var(--blue))); opacity: 0.92; z-index: 3; }
        .rk-tile::after { content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
          background-size: 33.33% 33.33%; mask-image: radial-gradient(120% 120% at 50% 0%, #000 30%, transparent 80%); opacity: 0.55; }
        .rk-glare { position: absolute; inset: 0; pointer-events: none; z-index: 2; border-radius: inherit; transition: opacity 0.3s ease; }
        .rk-tile-in { position: relative; z-index: 1; transform: translateZ(0.1px); }

        .rk-btn { font-weight: 600; font-size: 0.95rem; padding: 0.85rem 1.7rem; border-radius: 999px; cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; background: linear-gradient(120deg, var(--red), var(--orange)); color: #fff; border: 1px solid transparent;
          box-shadow: 0 12px 30px -12px rgba(229,53,47,0.7); }
        .rk-btn-ghost { background: rgba(255,255,255,0.04); color: var(--ink); border: 1px solid rgba(255,255,255,0.22); box-shadow: none; backdrop-filter: blur(8px); }

        /* ---------- HERO ---------- */
        .rk-hero { position: relative; z-index: 2; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 7rem 6vw 5rem; }
        .rk-hero-inner { transform-style: preserve-3d; }
        .rk-hero h1 { font-size: clamp(2.8rem, 8vw, 6rem); line-height: 1.02; margin: 0 0 1.2rem; font-weight: 800; color: #FFFFFF; perspective: 800px; }
        .rk-grad { background: linear-gradient(100deg, var(--red), var(--orange) 30%, var(--yellow) 55%, var(--blue) 80%, var(--green));
          -webkit-background-clip: text; background-clip: text; color: transparent; }
        /* Per-word wrapping: words never break internally, only at spaces. */
        .rk-split { white-space: normal; }
        .rk-word { display: inline-block; white-space: nowrap; }
        .rk-space { display: inline; white-space: normal; }
        .rk-hero-title { display: inline-block; max-width: 100%; animation: rk-breathe 6s ease-in-out infinite; }
        @keyframes rk-breathe { 0%,100% { transform: translateY(0) scale(1); filter: brightness(1); } 50% { transform: translateY(-8px) scale(1.012); filter: brightness(1.08); } }
        .rk-tagline { font-size: clamp(1rem, 1.8vw, 1.3rem); max-width: 46ch; color: var(--muted); margin: 0 auto 2.2rem; line-height: 1.65; }
        .rk-meta { font-size: 0.85rem; color: var(--muted); margin-bottom: 1.4rem; letter-spacing: 0.04em; }
        .rk-cta { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
        .rk-scroll-hint { position: absolute; bottom: 2.2rem; left: 50%; transform: translateX(-50%); font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--muted); animation: rk-floatsoft 3.4s ease-in-out infinite; }

        /* ---------- ABOUT / STATS ---------- */
        .rk-about-body { font-size: 1.12rem; line-height: 1.85; color: #C6D0E2; margin: 0; }
        .rk-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr)); gap: 1.1rem; margin-top: 2rem; }
        .rk-stat { text-align: center; border-radius: 16px; padding: 1.5rem 0.8rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); position: relative; overflow: hidden; }
        .rk-stat::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 2px; background: var(--edge); opacity: 0.85; }
        .rk-stat .num { font-family: 'Sora', sans-serif; font-size: 2.4rem; font-weight: 800; display: block; background: linear-gradient(120deg, var(--red), var(--orange)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .rk-stat .label { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); font-weight: 700; }

        /* ---------- SKILLS — mini cube blocks ---------- */
        .rk-skill-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr)); gap: 1.1rem; align-items: stretch; }
        .rk-skill-card { height: 100%; display: flex; flex-direction: column; gap: 0.9rem; padding: 1.4rem 1.3rem; min-width: 0; }
        .rk-skill-top { display: flex; align-items: center; gap: 0.85rem; min-width: 0; }
        .rk-skill-face { flex: 0 0 auto; width: 38px; height: 38px; border-radius: 9px; display: grid; grid-template-columns: repeat(3,1fr); grid-template-rows: repeat(3,1fr); gap: 2px; padding: 3px; background: rgba(0,0,0,0.45); box-shadow: 0 6px 14px -6px rgba(0,0,0,0.8); }
        .rk-skill-face span { border-radius: 2px; }
        .rk-skill-name { font-weight: 700; color: #F1F5F9; font-size: 0.98rem; line-height: 1.2; overflow-wrap: anywhere; min-width: 0; }
        .rk-skill-meta { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.72rem; color: var(--muted); font-weight: 700; letter-spacing: 0.04em; }
        .rk-skill-track { width: 100%; height: 8px; border-radius: 999px; background: rgba(255,255,255,0.10); overflow: hidden; }
        .rk-skill-fill { height: 100%; border-radius: 999px; transform-origin: left; background: var(--edge); }

        /* ---------- PROJECTS — detached multi-plane layers ---------- */
        .rk-proj-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: 1.8rem; align-items: stretch; }
        .rk-proj-card { height: 100%; padding: 0; overflow: hidden; }
        .rk-proj-card .rk-tile-in { height: 100%; display: flex; flex-direction: column; }
        .rk-proj-img { width: 100%; height: 184px; object-fit: cover; transform: translateZ(34px); }
        .rk-proj-imgwrap { overflow: hidden; }
        .rk-proj-body { padding: 1.6rem; display: flex; flex-direction: column; flex: 1; transform: translateZ(18px); }
        .rk-tag { font-size: 0.7rem; padding: 0.3rem 0.7rem; border-radius: 999px; background: rgba(255,255,255,0.06); color: #CBD5E1; font-weight: 700; border: 1px solid rgba(255,255,255,0.10); margin: 0 0.4rem 0.4rem 0; display: inline-block; }
        .rk-proj-links { display: flex; gap: 1.2rem; margin-top: auto; padding-top: 1.1rem; }
        .rk-proj-links a { color: #8FB7FF; font-size: 0.86rem; font-weight: 700; text-decoration: none; }

        /* ---------- EXPERIENCE — cube segments ---------- */
        .rk-timeline { position: relative; padding-left: 2.4rem; margin-left: 0.6rem; }
        .rk-timeline::before { content: ''; position: absolute; left: 0; top: 0.4rem; bottom: 0.4rem; width: 2px; background: linear-gradient(180deg, var(--red), var(--yellow), var(--green), var(--blue)); box-shadow: 0 0 14px rgba(242,196,21,0.5); }
        .rk-tl-item { position: relative; margin-bottom: 1.4rem; }
        .rk-tl-dot { position: absolute; left: -3rem; top: 0.5rem; width: 1.15rem; height: 1.15rem; border-radius: 5px; background: var(--edge); border: 3px solid var(--paper); box-shadow: 0 0 0 2px rgba(255,255,255,0.18), 0 0 16px var(--glow, rgba(242,196,21,0.6)); z-index: 3; }
        .rk-tl-period { color: var(--orange); font-weight: 800; font-size: 0.85rem; letter-spacing: 0.05em; }

        /* ---------- TESTIMONIALS ---------- */
        .rk-quote-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: 1.6rem; align-items: stretch; }
        .rk-quote-card { height: 100%; }

        /* ---------- CONTACT ---------- */
        .rk-contact { text-align: center; padding: 3.5rem 2rem; }
        .rk-final-grid { display: grid; grid-template-columns: repeat(3,1fr); grid-template-rows: repeat(3,1fr); gap: 6px; width: 120px; height: 120px; margin: 0 auto 2rem; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); transform: translateZ(30px); }
        .rk-final-grid span { border-radius: 8px; background: var(--green); box-shadow: inset 0 0 10px rgba(0,0,0,0.3); }
        .rk-footer { text-align: center; margin-top: 3rem; font-size: 0.88rem; color: #64748B; font-weight: 500; }

        @media (max-width: 860px) {
          .rk-section { padding: 5rem 7vw; }
          .rk-bg-stage { opacity: 0.32; }
          .rk-frag { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rk-float, .rk-float-soft, .rk-hero-title, .rk-scroll-hint, .rk-frag, .rk-fog, .rk-sheen { animation: none !important; }
        }
      `}</style>

      {/* GIANT SELF-SOLVING CUBE */}
      <GiantCube />

      {/* HERO */}
      <header className="rk-hero" onMouseMove={onHeroMove}>
        <motion.div className="rk-hero-inner" style={{ x: hx, y: hy }}>
          {personal?.location && (
            <motion.div
              className="rk-meta"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              📍 {personal.location}
            </motion.div>
          )}
          <h1 className="rk-display">
            <span className="rk-hero-title">
              <SplitText text={personal?.name || 'Your Name'} />
              <br />
              <SplitText text={personal?.title || 'Developer'} gradient />
            </span>
          </h1>
          <motion.p
            className="rk-tagline"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
          >
            {personal?.tagline || personal?.bio}
          </motion.p>
          <motion.div
            className="rk-cta"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
          >
            {socials?.email && (
              <motion.a
                className="rk-btn"
                href={`mailto:${socials.email}`}
                whileHover={{ y: -4, scale: 1.05, boxShadow: '0 20px 40px -12px rgba(229,53,47,0.85)' }}
                whileTap={{ scale: 0.96 }}
              >
                Solve Together
              </motion.a>
            )}
            {socials?.github && (
              <motion.a
                className="rk-btn rk-btn-ghost"
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                GitHub
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      
      </header>

      {/* ABOUT */}
      <section className="rk-section">
        <AnimatedHeading kicker="The Solver" title="About" />
        <TiltCard edge="linear-gradient(90deg, var(--red), var(--orange))" tiltMax={6} floatDur={8}>
          <p className="rk-about-body">{personal?.bio}</p>
          <div className="rk-stats">
            {[
              ['years', stats?.yearsExperience, 'Years Experience', 'linear-gradient(90deg, var(--red), var(--orange))'],
              ['projects', stats?.projectsCompleted, 'Projects Solved', 'linear-gradient(90deg, var(--blue), var(--green))'],
              ['clients', stats?.happyClients, 'Happy Clients', 'linear-gradient(90deg, var(--yellow), var(--orange))'],
            ].map(([k, v, l, edge]) => (
              <motion.div key={k} className="rk-stat" style={{ '--edge': edge }} whileHover={{ y: -4, scale: 1.04 }}>
                <span className="num">{v ?? '—'}</span>
                <span className="label">{l}</span>
              </motion.div>
            ))}
          </div>
        </TiltCard>
      </section>

      {/* SKILLS */}
      <section className="rk-section">
        <AnimatedHeading kicker="Algorithms" title="Skills" />
        <div className="rk-skill-grid">
          {skills?.slice(0, 12).map((skill, i) => {
            const lvl = skill.level || 70;
            const faceA = skillFaces[i % skillFaces.length];
            const faceB = skillFaces[(i + 2) % skillFaces.length];
            return (
              <TiltCard
                key={i}
                className="rk-skill-card"
                edge={skillEdges[i % skillEdges.length]}
                tiltMax={12}
                floatDur={6 + (i % 4)}
                delay={(i % 4) * 0.05}
              >
                <div className="rk-skill-top">
                  <span className="rk-skill-face" aria-hidden="true">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <span key={j} style={{ background: (j * 2 + i) % 3 === 0 ? faceB : faceA }} />
                    ))}
                  </span>
                  <span className="rk-skill-name">{skill.name}</span>
                </div>
                <div>
                  <div className="rk-skill-meta">
                    <span>{skill.category || 'Core'}</span>
                    <span>{lvl}%</span>
                  </div>
                  <span className="rk-skill-track">
                    <motion.div
                      className="rk-skill-fill"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: lvl / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="rk-section">
        <AnimatedHeading kicker="Solved Patterns" title="Projects" />
        <div className="rk-proj-grid">
          {projects?.map((proj, i) => (
            <TiltCard
              key={i}
              className="rk-proj-card"
              edge={projEdges[i % projEdges.length]}
              tiltMax={11}
              floatDur={7 + (i % 3)}
              delay={(i % 3) * 0.06}
            >
              {proj.image && (
                <div className="rk-proj-imgwrap">
                  <img src={proj.image} alt={proj.title || 'project'} className="rk-proj-img" />
                </div>
              )}
              <div className="rk-proj-body">
                <h3 className="rk-display" style={{ fontSize: '1.35rem', marginBottom: '0.7rem', color: '#FFFFFF' }}>{proj.title}</h3>
                <p style={{ color: '#9FAEC6', lineHeight: '1.65', marginBottom: '1rem', fontSize: '0.95rem' }}>{proj.description}</p>
                <div>{proj.techStack?.map((t, idx) => <span key={idx} className="rk-tag">{t}</span>)}</div>
                <div className="rk-proj-links">
                  {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer">Live →</a>}
                  {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer">Code →</a>}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="rk-section">
        <AnimatedHeading kicker="Move History" title="Experience" />
        <div className="rk-timeline">
          {experience?.map((job, i) => {
            const palette = [
              ['var(--red)', 'rgba(229,53,47,0.6)'],
              ['var(--blue)', 'rgba(30,102,232,0.6)'],
              ['var(--yellow)', 'rgba(242,196,21,0.6)'],
              ['var(--green)', 'rgba(39,163,90,0.6)'],
            ];
            const [edge, glow] = palette[i % palette.length];
            return (
              <div className="rk-tl-item" key={i}>
                <div className="rk-tl-dot" style={{ '--edge': edge, '--glow': glow }} />
                <TiltCard
                  edge={`linear-gradient(90deg, ${edge}, transparent)`}
                  tiltMax={5}
                  floatDur={8 + (i % 3)}
                  style={{ padding: '1.6rem 1.8rem' }}
                >
                  <div className="rk-tl-period">{job.period}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: '0.2rem 0' }}>{job.role}</h3>
                  <div style={{ fontWeight: 600, color: '#93A0B8', marginBottom: '0.7rem' }}>{job.company}</div>
                  <p style={{ color: '#C6D0E2', lineHeight: '1.65', margin: 0 }}>{job.description}</p>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="rk-section">
          <AnimatedHeading kicker="Cubers Say" title="Testimonials" />
          <div className="rk-quote-grid">
            {testimonials.map((t, i) => {
              const edges = [
                'linear-gradient(90deg, var(--blue), var(--green))',
                'linear-gradient(90deg, var(--yellow), var(--orange))',
                'linear-gradient(90deg, var(--red), var(--blue))',
              ];
              return (
                <TiltCard key={i} className="rk-quote-card" edge={edges[i % edges.length]} tiltMax={8} floatDur={7 + (i % 3)}>
                  <p style={{ fontStyle: 'italic', color: '#C6D0E2', marginBottom: '1.4rem', lineHeight: '1.65' }}>“{t.text}”</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                    {t.avatar && <img src={t.avatar} alt={t.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />}
                    <div>
                      <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{t.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#93A0B8' }}>{t.role}</div>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section className="rk-section" id="contact" style={{ paddingBottom: '8rem' }}>
        <AnimatedHeading kicker="Final Layer" title="Get In Touch" />
        <TiltCard
          className="rk-contact"
          edge="linear-gradient(90deg, var(--green), var(--blue), var(--yellow))"
          tiltMax={5}
          floatDur={9}
        >
          <div className="rk-final-grid" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => <span key={i} />)}
          </div>
          <h3 className="rk-display" style={{ fontSize: '2.1rem', marginBottom: '1rem', color: '#FFFFFF' }}>Ready to solve the next puzzle?</h3>
          <p style={{ fontSize: '1.05rem', color: '#93A0B8', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Whether it's a tricky problem or a new collaboration, let's twist it into place together.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {socials?.email && (
              <motion.a className="rk-btn" href={`mailto:${socials.email}`} whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>Email Me</motion.a>
            )}
            {socials?.github && (
              <motion.a className="rk-btn rk-btn-ghost" href={socials.github} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>GitHub</motion.a>
            )}
            {socials?.linkedin && (
              <motion.a className="rk-btn rk-btn-ghost" href={socials.linkedin} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>LinkedIn</motion.a>
            )}
            {socials?.twitter && (
              <motion.a className="rk-btn rk-btn-ghost" href={socials.twitter} target="_blank" rel="noreferrer" whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}>Twitter</motion.a>
            )}
          </div>
        </TiltCard>
        <div className="rk-footer">© {new Date().getFullYear()} {personal?.name}. Solved &amp; shipped.</div>
      </section>
    </div>
  );
}
