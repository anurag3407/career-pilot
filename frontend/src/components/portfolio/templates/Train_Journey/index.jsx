import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  animate,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValueEvent,
  useMotionValue,
  useMotionTemplate,
  useVelocity,
} from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Ticket,
  TrainFront,
  Clock,
  Quote,
  Send,
  ArrowRight,
  Gauge,
  Milestone,
  Navigation,
  Star,
  Compass,
  Sparkles,
  ArrowUp,
  Volume2,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import data from '../../../../data/dummy_data.json';

const M = motion;

/* ─────────────────────────────────────────────────────────────
   WEB AUDIO API SOUND SYNTHESIZER ENGINE (No External Assets)
   ───────────────────────────────────────────────────────────── */

let audioCtx = null;
let masterGain = null;
let rumbleSource = null;

const startAudio = (volume) => {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return;
  }
  
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioCtx = new AudioContextClass();
  
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);
  
  // Create Brownian noise for low train rumble
  const bufferSize = 2 * audioCtx.sampleRate;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5; 
  }
  
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;
  
  const lowpass = audioCtx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 65; 
  
  const rumbleGain = audioCtx.createGain();
  rumbleGain.gain.value = 0.65; 
  
  noiseSource.connect(lowpass);
  lowpass.connect(rumbleGain);
  rumbleGain.connect(masterGain);
  // Stop any previous rumble before starting a fresh looping source
  if (rumbleSource) {
    try {
      rumbleSource.stop();
    } catch {
      /* already stopped */
    }
  }
  noiseSource.start();
  rumbleSource = noiseSource;
};

const playHorn = () => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  
  const hornGain = audioCtx.createGain();
  hornGain.connect(masterGain);
  hornGain.gain.setValueAtTime(0, now);
  hornGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
  hornGain.gain.setValueAtTime(0.35, now + 0.65);
  hornGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
  
  // Nostalgic train horn minor triad (D4, F4, A4)
  [293.66, 349.23, 440.00].forEach(f => {
    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.value = f;
    
    // Low Frequency Oscillator for a realistic horn flutter / vibrato
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 5.5; 
    lfoGain.gain.value = 3.5; 
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    filter.type = 'lowpass';
    filter.frequency.value = 650; 
    
    osc.connect(filter);
    filter.connect(hornGain);
    
    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 1.1);
    osc.stop(now + 1.1);
  });
};

const playStamp = () => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  
  // Low metallic strike/thud sound
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.linearRampToValueAtTime(25, now + 0.16);
  
  filter.type = 'lowpass';
  filter.frequency.value = 170;
  
  gain.gain.setValueAtTime(0.85, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
  
  osc.start(now);
  osc.stop(now + 0.22);
  
  // High-pitch stamp mechanism click
  const clickOsc = audioCtx.createOscillator();
  const clickGain = audioCtx.createGain();
  clickOsc.connect(clickGain);
  clickGain.connect(masterGain);
  clickOsc.frequency.value = 2600;
  clickGain.gain.setValueAtTime(0.15, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  clickOsc.start(now);
  clickOsc.stop(now + 0.04);
};

const playFlapClick = () => {
  if (!audioCtx || audioCtx.state === 'suspended') return;
  const now = audioCtx.currentTime;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(2800, now);
  osc.frequency.linearRampToValueAtTime(600, now + 0.012);
  
  filter.type = 'highpass';
  filter.frequency.value = 1100;
  
  gain.gain.setValueAtTime(0.025, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
  
  osc.start(now);
  osc.stop(now + 0.015);
};

/* ─────────────────────────────────────────────────────────────
   ATMOSPHERIC PRESETS CONFIGURATION
   ───────────────────────────────────────────────────────────── */

const PRESETS = {
  sunset: {
    name: 'Sunset Gold',
    skyGradient: 'linear-gradient(to bottom, #1e1b4b 0%, #7c2d12 50%, #f59e0b 100%)',
    sunColor: '#fed7aa',
    sunGlow: '0 0 110px 50px rgba(253,224,71,0.55)',
    mountainColor: 'bg-[#3b2a52]',
    midHillColor: 'bg-[#5b2d3a]',
    treeColor: '#065f46',
    stars: 0,
    aurora: false,
    cyber: false,
  },
  night: {
    name: 'Stardust Night',
    skyGradient: 'linear-gradient(to bottom, #010103 0%, #060814 60%, #0c1228 100%)',
    sunColor: '#f1f5f9',
    sunGlow: '0 0 70px 30px rgba(226,232,240,0.3)',
    mountainColor: 'bg-[#0a0c16]',
    midHillColor: 'bg-[#101528]',
    treeColor: '#1e293b',
    stars: 1.0,
    aurora: false,
    cyber: false,
  },
  aurora: {
    name: 'Aurora Borealis',
    skyGradient: 'linear-gradient(to bottom, #03000b 0%, #05141e 60%, #010208 100%)',
    sunColor: '#ccfbf1',
    sunGlow: '0 0 80px 40px rgba(20,184,166,0.35)',
    mountainColor: 'bg-[#0a0712]',
    midHillColor: 'bg-[#06121a]',
    treeColor: '#0f172a',
    stars: 0.8,
    aurora: true,
    cyber: false,
  },
  cyber: {
    name: 'Cyberpunk Grid',
    skyGradient: 'linear-gradient(to bottom, #04000e 0%, #1e001a 60%, #08000f 100%)',
    sunColor: '#f472b6',
    sunGlow: '0 0 90px 45px rgba(236,72,153,0.5)',
    mountainColor: 'bg-[#15041d]',
    midHillColor: 'bg-[#220731]',
    treeColor: '#3b0764',
    stars: 0,
    aurora: false,
    cyber: true,
  }
};

// Order the window sky travels through as the journey scrolls down the page
const SKY_SEQUENCE = ['sunset', 'night', 'aurora', 'cyber'];

/* ─────────────────────────────────────────────────────────────
   HELPERS & REUSABLE SUB-COMPONENTS
   ───────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const slideIn = {
  hidden: (dir = 1) => ({ opacity: 0, x: 48 * dir, y: 16 }),
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

function CountUp({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

function SectionTitle({ kicker, title, icon: Icon }) {
  return (
    <M.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      className="mb-10 sm:mb-14"
    >
      <div className="flex items-center gap-2 text-amber-300/90">
        {Icon && <Icon className="h-5 w-5" />}
        <span className="text-sm font-semibold uppercase tracking-[0.3em]">{kicker}</span>
      </div>
      <h2 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
        {title}
      </h2>
      <div className="mt-4 flex items-center gap-2">
        <M.span
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
        />
        <span className="h-1 w-2 rounded-full bg-amber-400/50" />
        <span className="h-1 w-1 rounded-full bg-amber-400/30" />
      </div>
    </M.div>
  );
}

function AnimatedName({ name }) {
  return (
    <M.span
      className="inline-block bg-gradient-to-r from-amber-300 via-rose-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,146,60,0.30)]"
      style={{ backgroundSize: '200% auto' }}
      animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
    >
      <M.span
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
        }}
        initial="hidden"
        animate="show"
        className="inline-block"
        aria-label={name}
      >
        {name.split('').map((ch, i) => (
          <M.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: '0.55em', scale: 0.55, rotate: -10 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                transition: { type: 'spring', stiffness: 260, damping: 14 },
              },
            }}
            aria-hidden="true"
            className="inline-block whitespace-pre"
          >
            {ch === ' ' ? ' ' : ch}
          </M.span>
        ))}
      </M.span>
    </M.span>
  );
}

function IconLink({ href, children, label }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-300 hover:shadow-lg hover:shadow-amber-500/20"
    >
      {children}
    </a>
  );
}

function SplitFlapCharacter({ char, playClick }) {
  const [displayChar, setDisplayChar] = useState(char);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (char !== displayChar) {
      setFlipping(true);
      if (playClick) playClick();
      const timer = setTimeout(() => {
        setDisplayChar(char);
        setFlipping(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [char, displayChar, playClick]);

  return (
    <div className="relative inline-flex h-9 w-6 sm:h-10 sm:w-7 flex-col items-center justify-center rounded bg-zinc-950 font-mono text-base sm:text-lg font-black text-amber-400 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] select-none overflow-hidden">
      {/* Top half */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#141416] border-b border-black/50 overflow-hidden flex items-center justify-center">
        <span className="translate-y-1/2 leading-none">{displayChar}</span>
      </div>
      {/* Bottom half */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#09090a] overflow-hidden flex items-center justify-center">
        <span className="-translate-y-1/2 leading-none">{displayChar}</span>
      </div>
      
      {/* Flipping overlay */}
      <M.div
        className="absolute top-0 left-0 w-full h-1/2 bg-[#141416] border-b border-black/50 origin-bottom flex items-center justify-center overflow-hidden"
        animate={flipping ? { rotateX: -90 } : { rotateX: 0 }}
        transition={{ duration: 0.1, ease: 'easeIn' }}
        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
      >
        <span className="translate-y-1/2 leading-none">{displayChar}</span>
      </M.div>

      {/* Center split line */}
      <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-[#000]/80 z-10" />
      {/* Hinge notches */}
      <div className="absolute top-1/2 -left-0.5 h-2 w-1 rounded-r bg-black z-20 -translate-y-1/2" />
      <div className="absolute top-1/2 -right-0.5 h-2 w-1 rounded-l bg-black z-20 -translate-y-1/2" />
    </div>
  );
}

function SplitFlapBoard({ text, playClick }) {
  const maxLength = 22;
  const paddedText = text.toUpperCase().padEnd(maxLength, ' ').slice(0, maxLength);
  const chars = paddedText.split('');

  return (
    <div className="flex gap-1 justify-center bg-black/90 p-3 sm:p-4 rounded-xl border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-w-full overflow-x-auto select-none">
      {chars.map((char, index) => (
        <SplitFlapCharacter key={index} char={char} playClick={playClick} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   AWARD-TIER INTERACTION LAYER
   reduced-motion · magnetic CTAs · headlight cursor · film grain
   · cinematic departures-board boot sequence
   ───────────────────────────────────────────────────────────── */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function Magnetic({ children, strength = 0.4, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 14, mass: 0.4 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <M.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className}`}
    >
      {children}
    </M.div>
  );
}

function HeadlightCursor({ reduced }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const haloX = useSpring(x, { stiffness: 150, damping: 18, mass: 0.5 });
  const haloY = useSpring(y, { stiffness: 150, damping: 18, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 600, damping: 30 });
  const dotY = useSpring(y, { stiffness: 600, damping: 30 });

  useEffect(() => {
    if (reduced) return undefined;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <>
      <M.div
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
        style={{ x: haloX, y: haloY }}
      >
        <div className="h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/15 blur-xl" />
      </M.div>
      <M.div
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
        style={{ x: dotX, y: dotY }}
      >
        <div className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200 shadow-[0_0_14px_5px_rgba(251,191,36,0.65)]" />
      </M.div>
    </>
  );
}

function FilmGrain() {
  return (
    <>
      {/* cinematic vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[44]"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 38%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* fine film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[45] opacity-[0.05] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  );
}

function BoardingIntro({ onDone, reduced }) {
  const target = data.personal.name.toUpperCase();
  const [display, setDisplay] = useState('');
  const [progress, setProgress] = useState(0);
  const [lift, setLift] = useState(false);

  const skip = () => {
    setLift(true);
    setTimeout(onDone, 500);
  };

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onDone, 250);
      return () => clearTimeout(t);
    }
    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZØ0123456789★✦';
    const len = target.length;
    let settled = 0;
    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      if (tick % 2 === 0 && settled < len) settled += 1;
      let out = '';
      for (let i = 0; i < len; i += 1) {
        if (target[i] === ' ') out += ' ';
        else if (i < settled) out += target[i];
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      setProgress(Math.round((settled / len) * 100));
      if (settled >= len) {
        clearInterval(id);
        setTimeout(() => setLift(true), 620);
        setTimeout(onDone, 1520);
      }
    }, 55);
    return () => clearInterval(id);
  }, [reduced, onDone, target]);

  if (reduced) return null;

  return (
    <M.div
      initial={{ y: 0 }}
      animate={{ y: lift ? '-100%' : 0 }}
      transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 overflow-hidden bg-[#050308] px-4"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[120px]" />

      <M.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.5em] text-amber-400"
      >
        <TrainFront className="h-4 w-4" /> Departures
      </M.div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {display.split('').map((c, i) => (
          <span
            key={i}
            className="inline-flex h-12 w-8 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 font-mono text-2xl font-black text-amber-400 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)] sm:h-14 sm:w-10 sm:text-3xl"
          >
            {c === ' ' ? ' ' : c}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 sm:text-[11px]">
        <span>Track 9¾</span>
        <span className="h-1 w-1 rounded-full bg-amber-400" />
        <span className="max-w-[60vw] truncate">{data.personal.title}</span>
      </div>

      <div className="relative mt-1 h-1 w-64 max-w-[80vw] overflow-hidden rounded-full bg-white/10">
        <M.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button type="button"
        onClick={skip}
        className="absolute bottom-8 right-8 rounded-full border border-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:border-amber-400/50 hover:text-amber-200"
      >
        Skip intro →
      </button>
    </M.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE 3D STEAM LOCOMOTIVE (pure CSS 3D · no libraries)
   ───────────────────────────────────────────────────────────── */

// A single 3D box built from six shaded faces. w→X, h→Y, d→Z.
function Box3D({ w, h, d, x = 0, y = 0, z = 0, top, side, front, radius = 4 }) {
  const f = { position: 'absolute', borderRadius: radius, backfaceVisibility: 'hidden' };
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 0,
        height: 0,
        transformStyle: 'preserve-3d',
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
      }}
    >
      <div style={{ ...f, width: w, height: h, left: -w / 2, top: -h / 2, transform: `translateZ(${d / 2}px)`, background: front }} />
      <div style={{ ...f, width: w, height: h, left: -w / 2, top: -h / 2, transform: `rotateY(180deg) translateZ(${d / 2}px)`, background: front }} />
      <div style={{ ...f, width: d, height: h, left: -d / 2, top: -h / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)`, background: side }} />
      <div style={{ ...f, width: d, height: h, left: -d / 2, top: -h / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)`, background: side }} />
      <div style={{ ...f, width: w, height: d, left: -w / 2, top: -d / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)`, background: top }} />
      <div style={{ ...f, width: w, height: d, left: -w / 2, top: -d / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)`, background: side }} />
    </div>
  );
}

function Wheel({ x, y, z, r, reduced, dur = 1.6 }) {
  const spokes = [0, 45, 90, 135];
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transformStyle: 'preserve-3d',
        transform: `translate3d(${x}px, ${y}px, ${z}px)`,
      }}
    >
      <M.div
        animate={reduced ? {} : { rotate: 360 }}
        transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'relative',
          width: r * 2,
          height: r * 2,
          marginLeft: -r,
          marginTop: -r,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 45%, #2c2c35 0 36%, #101015 38% 72%, #1b1b22 74%)',
          border: '2px solid rgba(251,191,36,0.7)',
          boxShadow: '0 0 10px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: r * 0.5,
            height: r * 0.5,
            marginLeft: -r * 0.25,
            marginTop: -r * 0.25,
            borderRadius: '50%',
            background: '#fbbf24',
            boxShadow: '0 0 6px rgba(251,191,36,0.7)',
          }}
        />
        {spokes.map((a) => (
          <div
            key={a}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: r * 1.7,
              height: 3,
              marginLeft: -r * 0.85,
              marginTop: -1.5,
              background: 'rgba(251,191,36,0.5)',
              borderRadius: 2,
              transform: `rotate(${a}deg)`,
            }}
          />
        ))}
      </M.div>
    </div>
  );
}

function SteamPuff({ delay, drift }) {
  return (
    <M.div
      className="absolute rounded-full bg-white/60 blur-md"
      style={{ width: 24, height: 24, left: -12, top: -12 }}
      initial={{ opacity: 0, y: 0, x: 0, scale: 0.4 }}
      animate={{ opacity: [0, 0.5, 0], y: -130, x: [0, drift, drift * 1.6], scale: [0.4, 1.3, 2.2] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: 'easeOut', delay }}
    />
  );
}

function Locomotive3D({ reduced }) {
  const rx = useMotionValue(14);
  const ry = useMotionValue(-26);
  const srx = useSpring(rx, { stiffness: 120, damping: 18, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18, mass: 0.6 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    ry.set(-26 + dx * 32);
    rx.set(14 - dy * 16);
  };
  const onLeave = () => {
    rx.set(14);
    ry.set(-26);
  };

  const bodyTop = 'linear-gradient(180deg,#34343f,#21212a)';
  const bodySide = '#14141b';
  const bodyFront = '#262630';
  const brassTop = '#fbbf24';
  const brassSide = '#b45309';
  const brassFront = '#f59e0b';

  return (
    <div
      onMouseMove={reduced ? undefined : onMove}
      onMouseLeave={reduced ? undefined : onLeave}
      className="relative mx-auto flex h-[260px] w-full max-w-2xl items-center justify-center sm:h-[340px]"
      style={{ perspective: 1100 }}
    >
      {/* rails + grounding shadow */}
      <div className="pointer-events-none absolute bottom-[58px] left-1/2 h-[2px] w-[80%] -translate-x-1/2 bg-amber-200/20" />
      <div className="pointer-events-none absolute bottom-[48px] left-1/2 h-[2px] w-[86%] -translate-x-1/2 bg-amber-200/10" />
      <div className="pointer-events-none absolute bottom-[54px] h-7 w-[56%] rounded-[50%] bg-black/55 blur-xl" />

      <div className="scale-[0.6] sm:scale-90 md:scale-100" style={{ transformStyle: 'preserve-3d' }}>
        <M.div style={{ transformStyle: 'preserve-3d', rotateX: srx, rotateY: sry }}>
          <M.div
            animate={reduced ? {} : { y: [0, -7, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', transformStyle: 'preserve-3d' }}
          >
            {/* footplate / chassis */}
            <Box3D w={300} h={16} d={116} x={0} y={54} top="#23232b" side="#0c0c11" front="#181820" />
            {/* boiler */}
            <Box3D w={196} h={84} d={92} x={-34} y={-4} top={bodyTop} side={bodySide} front={bodyFront} radius={10} />
            {/* brass boiler bands */}
            <Box3D w={10} h={88} d={96} x={-90} y={-4} top={brassTop} side={brassSide} front={brassFront} radius={6} />
            <Box3D w={10} h={88} d={96} x={10} y={-4} top={brassTop} side={brassSide} front={brassFront} radius={6} />
            {/* smokebox (front) */}
            <Box3D w={26} h={88} d={96} x={-134} y={-4} top="#1b1b22" side="#0e0e13" front="#15151c" radius={12} />
            {/* cabin */}
            <Box3D w={92} h={104} d={104} x={108} y={-14} top={bodyTop} side={bodySide} front={bodyFront} radius={8} />
            {/* cabin roof */}
            <Box3D w={106} h={12} d={118} x={108} y={-70} top={brassTop} side={brassSide} front={brassFront} radius={6} />
            {/* chimney + cap */}
            <Box3D w={30} h={46} d={30} x={-112} y={-72} top="#0c0c11" side="#08080b" front="#101016" radius={4} />
            <Box3D w={40} h={10} d={40} x={-112} y={-96} top={brassTop} side={brassSide} front={brassFront} radius={4} />
            {/* steam dome + sand dome */}
            <Box3D w={32} h={26} d={32} x={-44} y={-58} top={brassTop} side={brassSide} front={brassFront} radius={10} />
            <Box3D w={26} h={22} d={26} x={6} y={-56} top="#34343f" side={bodySide} front={bodyFront} radius={8} />

            {/* headlight on the smokebox front (-X end) */}
            <div style={{ position: 'absolute', left: '50%', top: '50%', transformStyle: 'preserve-3d', transform: 'translate3d(-150px,-26px,0)' }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  marginLeft: -12,
                  marginTop: -12,
                  borderRadius: '50%',
                  transform: 'rotateY(-90deg) translateZ(2px)',
                  background: 'radial-gradient(circle,#fff7d6,#fbbf24)',
                  boxShadow: '0 0 28px 9px rgba(251,191,36,0.85)',
                }}
              />
            </div>

            {/* glowing cabin window (near +Z side) */}
            <div style={{ position: 'absolute', left: '50%', top: '50%', transformStyle: 'preserve-3d', transform: 'translate3d(108px,-34px,53px)' }}>
              <div
                style={{
                  width: 54,
                  height: 46,
                  marginLeft: -27,
                  marginTop: -23,
                  borderRadius: 8,
                  background: 'linear-gradient(160deg, rgba(251,191,36,0.92), rgba(244,114,22,0.5))',
                  boxShadow: '0 0 18px rgba(251,191,36,0.6)',
                  border: '2px solid rgba(0,0,0,0.45)',
                }}
              />
            </div>

            {/* amber running stripe along the boiler (near +Z side) */}
            <div style={{ position: 'absolute', left: '50%', top: '50%', transformStyle: 'preserve-3d', transform: 'translate3d(-34px,30px,47px)' }}>
              <div style={{ width: 196, height: 8, marginLeft: -98, marginTop: -4, borderRadius: 4, background: 'linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)' }} />
            </div>

            {/* drive wheels (near + far side) */}
            <Wheel x={-70} y={46} z={58} r={26} reduced={reduced} />
            <Wheel x={-12} y={46} z={58} r={26} reduced={reduced} />
            <Wheel x={48} y={46} z={58} r={26} reduced={reduced} />
            <Wheel x={-128} y={50} z={58} r={16} reduced={reduced} dur={1.1} />
            <Wheel x={-70} y={46} z={-58} r={26} reduced={reduced} />
            <Wheel x={-12} y={46} z={-58} r={26} reduced={reduced} />
            <Wheel x={48} y={46} z={-58} r={26} reduced={reduced} />

            {/* steam from the chimney */}
            {!reduced && (
              <div style={{ position: 'absolute', left: '50%', top: '50%', transformStyle: 'preserve-3d', transform: 'translate3d(-112px,-104px,0)' }}>
                <SteamPuff delay={0} drift={-10} />
                <SteamPuff delay={1.1} drift={8} />
                <SteamPuff delay={2.2} drift={-4} />
              </div>
            )}
          </M.div>
        </M.div>
      </div>
    </div>
  );
}

function TrainShowcase({ reduced, boardText, playClick }) {
  return (
    <section className="relative px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker="The Locomotive" title="Meet the engine" icon={TrainFront} />
        <p className="mb-4 -mt-6 flex items-center gap-2 text-sm text-slate-400">
          <Sparkles className="h-4 w-4 text-amber-300" />
          Move your cursor across the engine to look around · live 3D
        </p>
        <Locomotive3D reduced={reduced} />
        <div className="mt-6 flex flex-col items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-400">
            <TrainFront className="h-3.5 w-3.5" /> Now arriving at
          </span>
          <SplitFlapBoard text={boardText} playClick={playClick} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PARALLAX LANDSCAPE ENGINE
   ───────────────────────────────────────────────────────────── */

function ParallaxLayer({ duration, className = '', children, style }) {
  return (
    <M.div
      className={`absolute bottom-0 left-0 flex w-[200%] ${className}`}
      style={style}
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <div className="flex w-1/2 shrink-0 items-end justify-around">{children}</div>
      <div className="flex w-1/2 shrink-0 items-end justify-around" aria-hidden>
        {children}
      </div>
    </M.div>
  );
}

function Hill({ color, w, h }) {
  return (
    <div
      className={`shrink-0 transition-colors duration-1000 ${color}`}
      style={{ width: w, height: h, borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }}
    />
  );
}

function Tree({ color = '#065f46' }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center" style={{ width: 44 }}>
      <div
        className="transition-all duration-1000"
        style={{
          width: 0,
          height: 0,
          borderLeft: '18px solid transparent',
          borderRight: '18px solid transparent',
          borderBottom: `46px solid ${color}`,
        }}
      />
      <div className="-mt-2 h-5 w-2 rounded bg-amber-950/80" />
    </div>
  );
}

function Pole() {
  return (
    <div className="relative flex shrink-0 flex-col items-center" style={{ width: 70 }}>
      <div className="h-2 w-10 rounded bg-amber-950/70" />
      <div className="h-24 w-1.5 bg-amber-950/70" />
    </div>
  );
}

const STARS = [
  { t: '8%', l: '12%', d: 2.4, s: 2 }, { t: '14%', l: '34%', d: 3.1, s: 1 },
  { t: '6%', l: '58%', d: 2.0, s: 2 }, { t: '18%', l: '74%', d: 3.6, s: 1 },
  { t: '10%', l: '88%', d: 2.8, s: 2 }, { t: '22%', l: '22%', d: 3.3, s: 1 },
  { t: '5%', l: '46%', d: 2.6, s: 1 }, { t: '20%', l: '64%', d: 2.2, s: 2 },
  { t: '12%', l: '6%', d: 3.0, s: 1 }, { t: '24%', l: '92%', d: 2.5, s: 1 },
];

function Starfield({ opacity = 1.0 }) {
  return (
    <M.div style={{ opacity }} className="pointer-events-none absolute inset-0 transition-opacity duration-1000">
      {STARS.map((st, i) => (
        <M.span
          key={i}
          className="absolute rounded-full bg-amber-50"
          style={{ top: st.t, left: st.l, width: st.s * 2, height: st.s * 2 }}
          animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: st.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
        />
      ))}
    </M.div>
  );
}

function Cloud({ top, scale, duration, delay = 0, opacity = 0.25 }) {
  return (
    <M.div
      className="absolute"
      style={{ top, left: 0, opacity }}
      initial={{ x: '-20%' }}
      animate={{ x: '120%' }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      <div className="relative" style={{ transform: `scale(${scale})` }}>
        <div className="h-6 w-20 rounded-full bg-white/80 blur-md" />
        <div className="absolute -top-3 left-5 h-8 w-12 rounded-full bg-white/80 blur-md" />
      </div>
    </M.div>
  );
}

function Bird({ top, duration, delay }) {
  return (
    <M.div
      className="absolute text-amber-950/60"
      style={{ top }}
      initial={{ x: '-10%', y: 0 }}
      animate={{ x: '115%', y: [0, -10, 0, -6, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    >
      <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
        <path d="M1 8C4 2 7 2 11 6C15 2 18 2 21 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </M.div>
  );
}

function AuroraRibbon() {
  return (
    <div className="absolute inset-x-0 top-[10%] h-[35%] pointer-events-none opacity-45 filter blur-2xl overflow-hidden">
      <M.svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <M.path
          d="M0,45 Q25,25 50,48 T100,38 L100,100 L0,100 Z"
          fill="url(#aurora-glow-grad)"
          animate={{
            d: [
              "M0,45 Q25,25 50,48 T100,38 L100,100 L0,100 Z",
              "M0,42 Q25,55 50,38 T100,48 L100,100 L0,100 Z",
              "M0,45 Q25,25 50,48 T100,38 L100,100 L0,100 Z"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="aurora-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="40%" stopColor="#10b981" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </M.svg>
    </div>
  );
}

function CyberGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div 
        className="w-full h-full opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(236,72,153,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(236,72,153,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
          perspective: '300px',
          transform: 'rotateX(75deg) translateY(-25%)',
          transformOrigin: 'top center',
        }}
      />
      {/* Neon glowing grid horizons */}
      <div className="absolute bottom-[35%] left-0 w-full h-[2px] bg-pink-500/30 blur-sm" />
    </div>
  );
}

function TrainWindow({ activePreset }) {
  const p = PRESETS[activePreset];

  // 3D Card Hover Tilt Values
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 120, damping: 18 });

  // Glare Sweep Translation
  const glareX = useTransform(x, [-0.5, 0.5], ['-30%', '130%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['-30%', '130%']);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <M.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border-[10px] border-[#1b140d] bg-[#03030b] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_0_60px_rgba(0,0,0,0.6)] sm:aspect-[4/3] cursor-pointer"
    >
      {/* Sky transition system */}
      {Object.entries(PRESETS).map(([key, value]) => (
        <M.div
          key={key}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: value.skyGradient,
            opacity: activePreset === key ? 1 : 0,
          }}
        />
      ))}

      {/* Twinkling star field */}
      <Starfield opacity={p.stars} />

      {/* Cloud & Bird systems */}
      <Cloud top="16%" scale={1.0} duration={38} opacity={activePreset === 'night' ? 0.08 : 0.22} />
      <Cloud top="30%" scale={0.75} duration={28} delay={8} opacity={activePreset === 'night' ? 0.05 : 0.18} />
      <Bird top="22%" duration={16} delay={2} />
      <Bird top="27%" duration={18} delay={3.2} />

      {/* Aurora Waving Ribbon overlay */}
      {p.aurora && <AuroraRibbon />}

      {/* Cyberpunk horizon grid */}
      {p.cyber && <CyberGrid />}

      {/* Glowing solar body (Sun / Moon) */}
      <M.div
        className="absolute left-1/2 top-[44%] h-40 w-40 -translate-x-1/2 rounded-full transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundColor: p.sunColor,
          filter: 'blur(3px)', 
          boxShadow: p.sunGlow 
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.85, 0.95, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Far mountains (Parallax Layer) */}
      <ParallaxLayer duration={45} className="h-2/3 opacity-70">
        <Hill color={p.mountainColor} w={230} h={150} />
        <Hill color={p.mountainColor} w={310} h={190} />
        <Hill color={p.mountainColor} w={270} h={165} />
      </ParallaxLayer>

      {/* Mid Hills (Parallax Layer) */}
      <ParallaxLayer duration={28} className="h-1/2 opacity-90">
        <Hill color={p.midHillColor} w={350} h={130} />
        <Hill color={p.midHillColor} w={435} h={170} />
        <Hill color={p.midHillColor} w={390} h={140} />
      </ParallaxLayer>

      {/* Tree Line (Parallax Layer) */}
      <ParallaxLayer duration={15} className="h-40 gap-6 px-6">
        <Tree color={p.treeColor} />
        <Tree color={p.treeColor} />
        <Tree color={p.treeColor} />
        <Tree color={p.treeColor} />
        <Tree color={p.treeColor} />
        <Tree color={p.treeColor} />
      </ParallaxLayer>

      {/* Ground layer */}
      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#1b140d] to-[#2e1d0f] transition-all duration-1000" />

      {/* Foreground poles */}
      <ParallaxLayer duration={6.5} className="h-32">
        <Pole /><Pole /><Pole /><Pole />
      </ParallaxLayer>

      {/* Rail Tracks */}
      <div className="absolute bottom-2 left-0 h-12 w-full overflow-hidden">
        <div className="absolute bottom-3 left-0 h-px w-full bg-amber-200/30" />
        <M.div
          className="absolute bottom-1 flex w-[200%] gap-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="h-2 w-6 shrink-0 rounded-sm bg-amber-950/70 border-t border-amber-900/30" />
          ))}
        </M.div>
      </div>

      {/* Motion Speed Lines */}
      <M.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.0, 0.22, 0.0] }}
        transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 90px)',
        }}
      />

      {/* Dynamic Glass Glare Sweep linked to Mouse X/Y */}
      <M.div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          background: useMotionTemplate`radial-gradient(circle 280px at ${glareX} ${glareY}, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 50%, transparent 100%)`,
        }}
      />

      {/* Outer corner rivets */}
      {['left-3 top-3', 'right-3 top-3', 'left-3 bottom-3', 'right-3 bottom-3'].map((pos) => (
        <span key={pos} className={`absolute ${pos} h-3 w-3 rounded-full bg-amber-950 shadow-inner ring-1 ring-amber-500/25`} />
      ))}

      {/* Window release mechanism latch */}
      <div className="absolute right-4 top-1/2 h-11 w-2 -translate-y-1/2 rounded-full bg-amber-800/80 shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)]" />
    </M.div>
  );
}

const EMBERS = [
  { l: '5%', s: 3, d: 9, delay: 0, x: 14 }, { l: '14%', s: 2, d: 11, delay: 1.5, x: -10 },
  { l: '23%', s: 4, d: 8, delay: 0.6, x: 8 }, { l: '33%', s: 2, d: 12, delay: 2.2, x: -16 },
  { l: '42%', s: 3, d: 10, delay: 1.0, x: 12 }, { l: '52%', s: 2, d: 13, delay: 3.0, x: -8 },
  { l: '61%', s: 4, d: 9, delay: 0.3, x: 18 }, { l: '70%', s: 2, d: 11, delay: 2.6, x: -12 },
  { l: '79%', s: 3, d: 8, delay: 1.8, x: 10 }, { l: '88%', s: 2, d: 12, delay: 0.9, x: -14 },
  { l: '94%', s: 3, d: 10, delay: 3.4, x: 8 }, { l: '47%', s: 2, d: 14, delay: 4.0, x: -6 },
];

function Embers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {EMBERS.map((e, i) => (
        <M.span
          key={i}
          className="absolute rounded-full bg-amber-300"
          style={{
            left: e.l,
            bottom: -12,
            width: e.s,
            height: e.s,
            boxShadow: '0 0 8px 1.5px rgba(251,191,36,0.75)',
          }}
          animate={{ y: [0, -750], x: [0, e.x, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: e.d, repeat: Infinity, ease: 'easeOut', delay: e.delay }}
        />
      ))}
    </div>
  );
}

function SceneryStrip() {
  return (
    <div className="relative h-16 w-full overflow-hidden border-y border-white/5 bg-[#03030b]">
      <ParallaxLayer duration={10} className="h-full opacity-60">
        <Hill color="bg-[#1f1730]" w={160} h={50} />
        <Tree color="#064e3b" />
        <Hill color="bg-[#2d1222]" w={200} h={64} />
        <Pole />
        <Tree color="#1e293b" />
        <Hill color="bg-[#181124]" w={140} h={44} />
      </ParallaxLayer>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-amber-300/25" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FLOATING COCKPIT CONTROL DECK (HUD Dashboard)
   ───────────────────────────────────────────────────────────── */

function TrainHUD({
  speed,
  activeStationIndex,
  preset,
  setPreset,
  autoSky,
  setAutoSky,
  isPlaying,
  setIsPlaying,
  volume,
  setVolume,
  onPlayHorn,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const activeStation = data.projects[activeStationIndex] || data.projects[0];
  const nextStation = data.projects[activeStationIndex + 1] || null;

  const strokeDash = 2 * Math.PI * 34; // r = 34
  const speedOffset = strokeDash - (strokeDash * Math.min(speed, 180)) / 180;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Collapsed HUD Trigger Badge */}
      {!isOpen && (
        <M.button
          onClick={() => {
            setIsOpen(true);
            playFlapClick();
          }}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 border border-amber-400/30 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.35)] backdrop-blur hover:border-amber-400 hover:text-amber-200"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <TrainFront className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[8px] text-zinc-950 font-black items-center justify-center">HUD</span>
          </span>
        </M.button>
      )}

      {/* Expanded HUD panel */}
      {isOpen && (
        <M.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-80 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/85 text-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
        >
          {/* HUD Header */}
          <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400">
              <Gauge className="h-4 w-4 animate-pulse" /> Cabin Instruments
            </div>
            <button type="button"
              onClick={() => {
                setIsOpen(false);
                playFlapClick();
              }}
              className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Speedometer & Stop Readout */}
            <div className="flex items-center gap-4">
              {/* Dial Gauge */}
              <div className="relative h-20 w-20 flex-shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="34"
                    fill="none"
                    stroke="url(#hud-speed-gradient)"
                    strokeWidth="6"
                    strokeDasharray={strokeDash}
                    strokeDashoffset={speedOffset}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="hud-speed-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="60%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white">{speed}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">km/h</span>
                </div>
              </div>

              {/* Station Indicators */}
              <div className="space-y-1 overflow-hidden">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Stop</div>
                <div className="text-sm font-black text-amber-300 truncate">{activeStation.title}</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Next Stop</div>
                <div className="text-xs font-semibold text-slate-400 truncate">
                  {nextStation ? nextStation.title : 'End of the Line'}
                </div>
              </div>
            </div>

            {/* Atmosphere Selectors */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Window Presets</div>
                <button type="button"
                  onClick={() => {
                    setAutoSky(true);
                    playFlapClick();
                  }}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border transition-all ${
                    autoSky
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                      : 'bg-white/5 text-slate-500 border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Compass className="h-2.5 w-2.5" /> Auto {autoSky ? '· On' : ''}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {Object.keys(PRESETS).map((key) => (
                  <button type="button"
                    key={key}
                    onClick={() => {
                      setPreset(key);
                      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                      if (!audioCtx) startAudio(volume);
                      playFlapClick();
                    }}
                    className={`rounded py-1 text-[9px] font-black uppercase border transition-all ${
                      preset === key
                        ? 'bg-amber-400 text-zinc-950 border-amber-400'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/15 hover:text-white'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Deck controllers */}
            <div className="border-t border-white/5 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button type="button"
                    onClick={() => {
                      if (!audioCtx) {
                        startAudio(volume);
                        setIsPlaying(true);
                      } else if (audioCtx.state === 'suspended') {
                        audioCtx.resume();
                        setIsPlaying(true);
                      } else if (isPlaying) {
                        audioCtx.suspend();
                        setIsPlaying(false);
                      } else {
                        audioCtx.resume();
                        setIsPlaying(true);
                      }
                      playFlapClick();
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      isPlaying ? 'bg-amber-400 text-zinc-950' : 'bg-white/10 text-slate-400 hover:bg-white/15'
                    }`}
                  >
                    {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ambient Engine</span>
                </div>

                <button type="button"
                  onClick={() => {
                    if (!audioCtx) startAudio(volume);
                    onPlayHorn();
                  }}
                  className="rounded bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-[10px] font-bold text-zinc-950 shadow hover:brightness-110"
                >
                  🎺 Horn
                </button>
              </div>

              {/* Master Volume */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-medium">Vol</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (masterGain) {
                      masterGain.gain.setValueAtTime(v, audioCtx.currentTime);
                    }
                  }}
                  className="h-1.5 w-full cursor-pointer rounded-lg bg-white/10 accent-amber-400"
                />
              </div>
            </div>
          </div>
        </M.div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PORTFOLIO SECTIONS
   ───────────────────────────────────────────────────────────── */

function Hero({ activePreset }) {
  const stats = [
    { to: data.stats.yearsExperience, suffix: '+', label: 'Years on the rails' },
    { to: data.stats.projectsCompleted, suffix: '', label: 'Stations reached' },
    { to: data.stats.happyClients, suffix: '', label: 'Happy passengers' },
  ];

  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-12 sm:pt-28 lg:pb-20">
      {/* Aurora visual glow */}
      <M.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 28% 32%, rgba(251,146,60,0.18), transparent 60%), radial-gradient(50% 50% at 78% 58%, rgba(244,63,94,0.15), transparent 62%), radial-gradient(45% 45% at 62% 18%, rgba(99,102,241,0.16), transparent 60%)',
        }}
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Grid depth overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 75%)',
        }}
      />
      <Embers />

      {/* Ambient glowing blobs */}
      <M.div
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <M.div
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-indigo-600/15 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <M.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
          <M.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-200"
          >
            <M.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"
            />
            Now boarding · {data.personal.location}
          </M.div>

          <M.h1 variants={fadeUp} className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <AnimatedName name={data.personal.name} />
          </M.h1>

          <M.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
            className="mt-4 h-1 w-48 origin-left rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-transparent"
          />

          <M.p variants={fadeUp} className="mt-5 text-xl font-semibold text-slate-100 sm:text-2xl">
            {data.personal.title}
          </M.p>
          <M.p variants={fadeUp} className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {data.personal.tagline || data.personal.bio}
          </M.p>

          <M.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3.5 text-base font-bold text-zinc-950 shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-full" />
                Book a journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic strength={0.3}>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-base font-semibold text-slate-200 transition-colors hover:border-amber-400/50 hover:text-amber-200"
              >
                View stops
              </a>
            </Magnetic>
            <div className="flex items-center gap-2">
              <IconLink href={data.socials.github} label="GitHub"><Github className="h-4 w-4" /></IconLink>
              <IconLink href={data.socials.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></IconLink>
              <IconLink href={data.socials.twitter} label="Twitter"><Twitter className="h-4 w-4" /></IconLink>
            </div>
          </M.div>

          {/* Ticket stats with count-up */}
          <M.div variants={fadeUp} className="mt-10 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur transition-colors hover:border-amber-400/30"
              >
                <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#03030b]" />
                <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#03030b]" />
                <div className="text-3xl font-black text-amber-300 sm:text-4xl">
                  <CountUp to={s.to} suffix={s.suffix} />
                </div>
                <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:text-xs">{s.label}</div>
              </div>
            ))}
          </M.div>
        </M.div>

        <M.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <TrainWindow activePreset={activePreset} />
        </M.div>
      </div>
    </section>
  );
}

function About() {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 15 });

  // Holographic sheen position
  const sheenX = useTransform(x, [-0.5, 0.5], ['20%', '80%']);
  const sheenY = useTransform(y, [-0.5, 0.5], ['20%', '80%']);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="about" className="scroll-mt-24 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker="The Passenger" title="About this traveller" icon={Compass} />
        <M.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transformStyle: 'preserve-3d',
            perspective: 1000,
            rotateX: springRotateX,
            rotateY: springRotateY,
          }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-2xl backdrop-blur transition-all duration-500 hover:border-amber-400/40"
        >
          {/* Holographic glowing sheen */}
          <M.div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 mix-blend-color-dodge"
            style={{
              background: useMotionTemplate`radial-gradient(circle 280px at ${sheenX} ${sheenY}, rgba(251,191,36,0.45) 0%, rgba(244,63,94,0.35) 40%, rgba(99,102,241,0.45) 75%, transparent 100%)`,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
            {/* Boarding pass stub */}
            <div className="relative flex flex-col items-center justify-center gap-4 border-b border-dashed border-white/15 bg-gradient-to-br from-amber-500/10 to-orange-600/5 p-8 md:border-b-0 md:border-r">
              {/* Ticket punches */}
              <div className="absolute top-1/2 -left-3 h-6 w-6 rounded-full bg-[#03030b] hidden md:block -translate-y-1/2 border-r border-dashed border-white/15" />
              <div className="absolute top-1/2 -right-3 h-6 w-6 rounded-full bg-[#03030b] hidden md:block -translate-y-1/2 border-l border-dashed border-white/15" />

              <M.div
                className="relative"
                whileHover={{ rotate: -3, scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
              >
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="h-32 w-32 rounded-2xl object-cover shadow-lg ring-4 ring-amber-400/25"
                />
                <span className="absolute -bottom-3 -right-3 rounded-full bg-amber-400 p-2 text-zinc-950 shadow-lg">
                  <TrainFront className="h-4 w-4" />
                </span>
              </M.div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">{data.personal.name}</div>
                <div className="text-xs uppercase tracking-widest text-amber-300/80 font-bold">Passenger</div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-300">
                <MapPin className="h-4 w-4 text-amber-300" />
                {data.personal.location}
              </div>
            </div>

            {/* Main Pass Data */}
            <div className="p-8 sm:p-10 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300/80">
                  <Ticket className="h-4 w-4" /> Boarding Pass · First Class Cabin
                </div>
                {/* Barcode representation */}
                <div className="flex gap-[2px] h-6 items-end opacity-40">
                  {[2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2].map((w, idx) => (
                    <span key={idx} className="bg-white shrink-0" style={{ width: w }} />
                  ))}
                </div>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-slate-200 sm:text-xl">{data.personal.bio}</p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { k: 'Ticket Category', v: 'First Class / Tech Stack', c: 'text-white' },
                  { k: 'Origin Platform', v: data.personal.location, c: 'text-white' },
                  { k: 'Journey Status', v: 'On Time ✓', c: 'text-emerald-400' },
                ].map((row) => (
                  <div key={row.k} className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-amber-400/30">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{row.k}</div>
                    <div className={`mt-1.5 text-base font-bold ${row.c}`}>{row.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </M.div>
      </div>
    </section>
  );
}

function RadialGauge({ skill, index }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const gid = `gauge-grad-${index}`;

  return (
    <M.div
      ref={ref}
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      whileHover={{ y: -6 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative h-28 w-28 sm:h-32 sm:w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <M.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: inView ? circ - (circ * skill.level) / 100 : circ }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: index * 0.12 }}
            style={{ filter: 'drop-shadow(0 0 6px rgba(251,146,60,0.5))' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-white sm:text-3xl">
            <CountUp to={skill.level} suffix="%" />
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-slate-100">{skill.name}</div>
        <div className="text-[11px] uppercase tracking-widest text-amber-300/70 font-semibold">{skill.category}</div>
      </div>
    </M.div>
  );
}

function SkillBar({ skill, i }) {
  return (
    <M.div
      custom={i}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-base font-semibold text-slate-100">{skill.name}</span>
        <span className="font-mono text-sm font-bold text-amber-300">{skill.level}%</span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/10">
        <M.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 shadow-[0_0_14px_rgba(251,146,60,0.5)]"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <M.span
            className="absolute inset-y-0 w-8 bg-white/40 blur-sm"
            animate={{ x: ['-32px', '160px'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
        </M.div>
      </div>
    </M.div>
  );
}

function Skills() {
  const categories = Array.from(new Set(data.skills.map((s) => s.category)));
  const topSkills = [...data.skills].sort((a, b) => b.level - a.level).slice(0, 4);
  return (
    <section id="skills" className="scroll-mt-24 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker="Engine Specs" title="Skills & gauges" icon={Gauge} />

        <div className="mb-14 grid grid-cols-2 gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur sm:grid-cols-4">
          {topSkills.map((s, i) => (
            <RadialGauge key={s.name} skill={s} index={i} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((cat, ci) => (
            <M.div
              key={cat}
              variants={fadeUp}
              custom={ci}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors hover:border-amber-400/30"
            >
              <h3 className="mb-6 flex items-center gap-2.5 text-base font-bold uppercase tracking-[0.2em] text-amber-300">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/15">
                  <Navigation className="h-4 w-4" />
                </span>
                {cat}
              </h3>
              <div className="space-y-5">
                {data.skills
                  .filter((s) => s.category === cat)
                  .map((s, i) => (
                    <SkillBar key={s.name} skill={s} i={i} />
                  ))}
              </div>
            </M.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Station({ project, index, onActive }) {
  const isLeft = index % 2 === 0;
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (inView) {
      onActive(index);
    }
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="relative md:grid md:grid-cols-2 md:gap-12 scroll-mt-28">
      {/* Central rail junction pin */}
      <div className="absolute left-4 top-7 z-10 md:left-1/2 md:-translate-x-1/2">
        <M.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-400 bg-zinc-950 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.65)]"
        >
          <Milestone className="h-4 w-4" />
        </M.span>
      </div>

      {/* Project content card */}
      <M.article
        variants={slideIn}
        custom={isLeft ? -1 : 1}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{ y: -6 }}
        className={`group ml-14 md:ml-0 ${isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}`}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] shadow-xl backdrop-blur transition-all duration-500 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-amber-500/15">
          {/* Neon hovering borders */}
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-amber-400/0 via-amber-400/0 to-amber-400/0 opacity-0 transition-opacity duration-500 group-hover:from-amber-400/10 group-hover:to-rose-400/10 group-hover:opacity-100" />
          
          <div className="relative h-44 overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-zinc-950/85 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur">
              <TrainFront className="h-3.5 w-3.5" />
              Stop {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div className={`relative p-5 ${isLeft ? 'md:text-right' : ''}`}>
            <h3 className="text-xl font-bold text-white transition-colors group-hover:text-amber-300 sm:text-2xl">{project.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-400 line-clamp-3 sm:text-base">{project.description}</p>
            <div className={`mt-4 flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
                  {tech}
                </span>
              ))}
            </div>
            <div className={`mt-5 flex items-center gap-3 ${isLeft ? 'md:justify-end' : ''}`}>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200">
                  Live <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white">
                  <Github className="h-3.5 w-3.5" /> Code
                </a>
              )}
            </div>
          </div>
        </div>
      </M.article>
    </div>
  );
}

function Projects({ onActiveStation }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });
  const trainTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 26 });

  return (
    <section id="projects" className="scroll-mt-24 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker="The Route" title="Stations along the line" icon={Milestone} />

        <div ref={ref} className="relative">
          {/* Main Track lines */}
          <div className="absolute left-8 top-0 h-full w-1 -translate-x-1/2 bg-zinc-900 border-x border-white/5 md:left-1/2" />
          {/* Track wooden ties repeating pattern */}
          <div className="absolute left-8 top-0 h-full w-2 -translate-x-1/2 md:left-1/2 opacity-30" 
               style={{
                 backgroundImage: 'repeating-linear-gradient(to bottom, #78350f 0px, #78350f 4px, transparent 4px, transparent 24px)',
               }}
          />
          {/* Progress fill */}
          <M.div
            className="absolute left-8 top-0 w-0.5 -translate-x-1/2 origin-top bg-gradient-to-b from-amber-400 via-orange-500 to-rose-500 md:left-1/2 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
            style={{ height: '100%', scaleY: lineScale }}
          />

          {/* Active train overlay rider */}
          <M.div
            className="absolute left-8 z-20 -translate-x-1/2 md:left-1/2"
            style={{ top: trainTop }}
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-zinc-950 shadow-[0_0_24px_rgba(251,191,36,0.85)] border border-amber-300">
              <M.span
                className="absolute inset-0 rounded-full border-2 border-amber-300"
                animate={{ scale: [1, 1.85], opacity: [0.65, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
              <TrainFront className="h-5 w-5" />
            </span>
          </M.div>

          <div className="space-y-12">
            {data.projects.map((proj, idx) => (
              <Station 
                key={proj.title} 
                project={proj} 
                index={idx} 
                onActive={onActiveStation} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionTitle kicker="The Timetable" title="Journey so far" icon={Clock} />
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur shadow-xl">
          {data.experience.map((exp, idx) => (
            <M.div
              key={`${exp.role}-${exp.company}`}
              variants={fadeUp}
              custom={idx}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="group grid grid-cols-1 gap-3 border-b border-white/10 p-6 transition-colors last:border-b-0 hover:bg-amber-400/[0.03] sm:grid-cols-[140px_1fr]"
            >
              <div className="flex items-start gap-3 sm:flex-col sm:gap-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1.5 font-mono text-sm font-semibold text-amber-300 border border-amber-400/10">
                  <Clock className="h-3.5 w-3.5" /> {exp.period}
                </span>
              </div>
              <div className="relative sm:pl-6">
                <span className="absolute -left-0.5 top-2.5 hidden h-2.5 w-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/15 transition-transform group-hover:scale-125 sm:block" />
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h3 className="text-lg font-bold text-white sm:text-xl">{exp.role}</h3>
                  <span className="text-base font-semibold text-amber-300">· {exp.company}</span>
                </div>
                <p className="mt-2.5 text-base leading-relaxed text-slate-400">{exp.description}</p>
              </div>
            </M.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionTitle kicker="Postcards" title="From passengers" icon={Quote} />
        <div className="grid gap-6 sm:grid-cols-2">
          {data.testimonials.map((t, idx) => (
            <M.figure
              key={t.name}
              variants={slideIn}
              custom={idx % 2 === 0 ? -1 : 1}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 backdrop-blur transition-colors hover:border-amber-400/30"
            >
              <Quote className="absolute right-5 top-5 h-12 w-12 text-amber-400/10 pointer-events-none" />
              <div className="mb-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="relative text-base leading-relaxed text-slate-200 sm:text-lg">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-400/25" />
                <div>
                  <div className="text-base font-bold text-white">{t.name}</div>
                  <div className="text-sm text-slate-400">{t.role}</div>
                </div>
              </figcaption>
            </M.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ activeStationIndex }) {
  const [name, setName] = useState('');
  const [dest, setDest] = useState('');
  const [msg, setMsg] = useState('');
  const [isValidated, setIsValidated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsValidated(true);
    playStamp();

    // Visual hackathon confetti explosion
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f97316', '#ec4899', '#3b82f6', '#10b981'],
    });
  };

  const activeProject = data.projects[activeStationIndex] || data.projects[0];

  return (
    <section id="contact" className="scroll-mt-24 px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-orange-600/5 to-indigo-900/10 p-8 shadow-2xl backdrop-blur sm:p-12">
          {/* Radial depth lights */}
          <M.div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/15 blur-3xl"
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-zinc-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              <Ticket className="h-3.5 w-3.5 animate-bounce" /> Next Departure
            </span>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">Print Your Boarding Pass</h2>
            <p className="mx-auto mt-3 max-w-md text-base text-slate-300">
              Complete the cabin manifesto below to dispatch your message and print your official travel stub.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Passenger Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setIsValidated(false);
                    }}
                    className="w-full rounded-xl border border-white/10 bg-[#03030b]/60 px-4 py-3 text-base text-white placeholder-slate-600 outline-none transition-all focus:border-amber-400/60 focus:bg-[#03030b]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Station</label>
                  <select
                    value={dest}
                    onChange={(e) => {
                      setDest(e.target.value);
                      setIsValidated(false);
                    }}
                    className="w-full rounded-xl border border-white/10 bg-[#03030b]/60 px-4 py-3 text-base text-slate-300 outline-none transition-all focus:border-amber-400/60 focus:bg-[#03030b]"
                  >
                    <option value="">-- Choose Stop --</option>
                    {data.projects.map((p) => (
                      <option key={p.title} value={p.title}>{p.title}</option>
                    ))}
                    <option value="Custom route">Custom Destination</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">MANIFEST NOTES / MESSAGE</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Where are we headed and what are we building?"
                  value={msg}
                  onChange={(e) => {
                    setMsg(e.target.value);
                    setIsValidated(false);
                  }}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#03030b]/60 px-4 py-3 text-base text-white placeholder-slate-600 outline-none transition-all focus:border-amber-400/60 focus:bg-[#03030b]"
                />
              </div>

              <button
                type="submit"
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3.5 text-base font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                Validate Manifest & Print
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Ticket Printer Slot */}
            <div className="flex flex-col items-center justify-center">
              {/* Mechanical Printer dispenser slot visual */}
              <div className="w-full max-w-xs h-3 bg-zinc-900 border-x border-t border-zinc-800 rounded-t-lg shadow-2xl relative z-10 flex justify-center">
                <div className="w-11/12 h-[2px] bg-black rounded" />
              </div>

              {/* Printed physical Boarding pass ticket */}
              <M.div
                initial={false}
                animate={isValidated ? { y: 0, scale: 1.02 } : { y: -20, scale: 1.0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="w-full max-w-xs overflow-hidden rounded-b-xl border-x border-b border-white/10 bg-zinc-900 p-5 shadow-2xl relative z-0 origin-top text-left select-none"
              >
                <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-amber-400 to-rose-400" />
                
                <div className="flex items-center justify-between mt-2">
                  <div className="text-[9px] font-black uppercase tracking-widest text-amber-400">Manifest Ticket</div>
                  <div className="text-[9px] font-mono text-slate-500">No. {name ? `#${name.slice(0, 3).toUpperCase()}-CP` : '#TKT-782'}</div>
                </div>

                <div className="mt-4 border-t border-dashed border-white/10 pt-3 space-y-2.5 font-mono text-xs">
                  <div>
                    <span className="text-[9px] uppercase text-slate-500 block leading-none">Passenger</span>
                    <span className="text-white font-bold text-sm tracking-wide uppercase truncate block">
                      {name || data.personal.name}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase text-slate-500 block leading-none">Destination Stop</span>
                    <span className="text-amber-200 font-bold tracking-wide uppercase truncate block">
                      {dest || activeProject.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 block leading-none">Gate</span>
                      <span className="text-white font-bold">9¾</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase text-slate-500 block leading-none">Seat</span>
                      <span className="text-white font-bold">CABIN-03</span>
                    </div>
                  </div>

                  <div className="h-9 border-t border-dashed border-white/10 pt-3 overflow-hidden text-[10px] text-slate-400 line-clamp-2 leading-tight">
                    {msg || 'Ready to board the creative technology journey...'}
                  </div>
                </div>

                {/* Simulated barcode */}
                <div className="mt-5 flex flex-col gap-1 items-center border-t border-white/5 pt-3">
                  <div className="flex gap-[2px] h-9 items-end w-full px-2 justify-center opacity-65">
                    {[1, 3, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1].map((w, idx) => (
                      <span key={idx} className="bg-white shrink-0 h-full" style={{ width: w }} />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono tracking-[0.2em] text-slate-500 uppercase mt-1">Platform 9 3/4 validated</span>
                </div>

                {/* Green Validated stamp */}
                {isValidated && (
                  <M.div
                    initial={{ scale: 2.2, rotate: 20, opacity: 0 }}
                    animate={{ scale: 1, rotate: -15, opacity: 0.95 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                    className="absolute inset-0 m-auto h-16 w-36 rounded border-4 border-emerald-500/80 bg-zinc-900/90 text-emerald-400 font-mono font-black text-lg tracking-widest flex items-center justify-center pointer-events-none shadow-lg shadow-emerald-950/40 z-20"
                  >
                    VALIDATED
                  </M.div>
                )}
              </M.div>
            </div>
          </div>

          {/* Quick email links */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <a href={`mailto:${data.socials.email}`} className="inline-flex items-center gap-2 text-base font-semibold text-amber-200 hover:text-amber-100">
              <Mail className="h-4 w-4" /> {data.socials.email}
            </a>
            <div className="flex items-center gap-3">
              <IconLink href={data.socials.github} label="GitHub"><Github className="h-4 w-4" /></IconLink>
              <IconLink href={data.socials.linkedin} label="LinkedIn"><Linkedin className="h-4 w-4" /></IconLink>
              <IconLink href={data.socials.twitter} label="Twitter"><Twitter className="h-4 w-4" /></IconLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <TrainFront className="h-4 w-4 text-amber-400" />
          <span>© {new Date().getFullYear()} {data.personal.name} · End of the line</span>
        </div>
        <span>Built with ♥ for Career Pilot</span>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   STYLISH JOURNEY PROGRESS BAR & HEADER
   ───────────────────────────────────────────────────────────── */

function JourneyProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const left = useTransform(x, [0, 1], ['0%', '100%']);
  const width = useTransform(x, [0, 1], ['0%', '100%']);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1.5 bg-[#03030b]/80 backdrop-blur">
      <M.div className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-400" style={{ width }} />
      <M.div className="absolute -top-1.5 -ml-3" style={{ left }}>
        <TrainFront className="h-4 w-4 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
      </M.div>
    </div>
  );
}

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Stations' },
  { id: 'experience', label: 'Timetable' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
];

function Navbar() {
  const firstName = data.personal.name.split(' ')[0];
  return (
    <M.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="sticky top-0 z-40 border-b border-white/5 bg-[#03030b]/70 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950 shadow-lg shadow-amber-500/20 transition-transform group-hover:-translate-y-0.5">
            <TrainFront className="h-5 w-5" />
          </span>
          <span className="text-lg font-black tracking-tight text-white">
            {firstName}
            <span className="text-amber-400">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-amber-200"
            >
              {n.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
        >
          <Ticket className="h-4 w-4" /> <span className="hidden sm:inline">Book</span>
        </a>
      </nav>
    </M.header>
  );
}

function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > 600));

  return (
    <M.button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-zinc-950 shadow-lg shadow-amber-500/30"
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6, y: show ? 0 : 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ pointerEvents: show ? 'auto' : 'none' }}
      whileHover={{ y: -3 }}
    >
      <ArrowUp className="h-5 w-5" />
    </M.button>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT PORTFOLIO
   ───────────────────────────────────────────────────────────── */

export default function TrainJourney() {
  const reduced = usePrefersReducedMotion();
  const [booted, setBooted] = useState(false);
  const [preset, setPreset] = useState('sunset');
  const [autoSky, setAutoSky] = useState(true);
  const [activeStationIndex, setActiveStationIndex] = useState(0);

  // Sound Synth States
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const [speed, setSpeed] = useState(0);

  // Scroll Velocity tracking for speed
  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Cinematic time-of-day journey: the window sky advances as you scroll
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!autoSky) return;
    const idx = Math.min(SKY_SEQUENCE.length - 1, Math.max(0, Math.floor(p * SKY_SEQUENCE.length)));
    const next = SKY_SEQUENCE[idx];
    setPreset((cur) => (cur === next ? cur : next));
  });

  // Manually choosing a preset disengages the auto journey
  const handlePresetSelect = (key) => {
    setAutoSky(false);
    setPreset(key);
  };
  const smoothSpeed = useSpring(0, { stiffness: 45, damping: 16 });

  // Map velocity updates to dial speed
  useEffect(() => {
    return scrollVelocity.on("change", (v) => {
      const absVal = Math.abs(v);
      const targetSpeed = Math.min(absVal * 0.05, 180);
      smoothSpeed.set(targetSpeed);
    });
  }, [scrollVelocity, smoothSpeed]);

  useMotionValueEvent(smoothSpeed, 'change', (latest) => {
    setSpeed(Math.round(latest));
  });

  // Synthesizer scheduler for periodic clacks depending on velocity
  useEffect(() => {
    if (!isPlaying || !audioCtx || speed === 0) {
      return;
    }
    
    // Interval rate dependent on speed: clicks happen more frequently at higher speed
    const intervalMs = Math.max(300, 1600 - (speed * 7));

    const playClick = (time) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, time);
      osc.frequency.exponentialRampToValueAtTime(120, time + 0.045);

      filter.type = 'bandpass';
      filter.frequency.value = 750;

      gain.gain.setValueAtTime(0.035, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);

      osc.start(time);
      osc.stop(time + 0.05);
    };

    const triggerClickClack = () => {
      if (!audioCtx || audioCtx.state === 'suspended') return;
      const now = audioCtx.currentTime;
      // click-clack pairs
      playClick(now);
      playClick(now + 0.08);

      playClick(now + 0.28);
      playClick(now + 0.36);
    };

    triggerClickClack();
    const id = setInterval(triggerClickClack, intervalMs);
    return () => clearInterval(id);
  }, [isPlaying, speed]);

  const activeProject = data.projects[activeStationIndex] || data.projects[0];

  return (
    <main className="relative min-h-screen scroll-smooth overflow-x-hidden bg-[#03030b] text-slate-100 antialiased selection:bg-amber-400 selection:text-zinc-950">
      {/* Cinematic departures-board boot sequence */}
      {!booted && <BoardingIntro reduced={reduced} onDone={() => setBooted(true)} />}

      {/* Premium texture + headlight cursor */}
      <FilmGrain />
      <HeadlightCursor reduced={reduced} />

      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-[8%] h-[34rem] w-[34rem] rounded-full bg-amber-600/[0.08] blur-[130px]" />
        <div className="absolute -right-32 top-[38%] h-[36rem] w-[36rem] rounded-full bg-rose-600/[0.08] blur-[130px]" />
        <div className="absolute left-[18%] top-[68%] h-[32rem] w-[32rem] rounded-full bg-indigo-600/[0.09] blur-[130px]" />
        <div className="absolute right-[12%] bottom-[2%] h-[30rem] w-[30rem] rounded-full bg-orange-600/[0.06] blur-[130px]" />
      </div>

      <div className="relative z-10">
        <JourneyProgress />
        <Navbar />
        <span id="top" />

        <Hero activePreset={preset} />
        
        {/* Interactive 3D locomotive + live destination board */}
        <TrainShowcase reduced={reduced} boardText={activeProject.title} playClick={playFlapClick} />

        <About />
        <Skills />
        <SceneryStrip />
        
        <Projects onActiveStation={setActiveStationIndex} />
        
        <Experience />
        <SceneryStrip />
        
        <Testimonials />
        <Contact activeStationIndex={activeStationIndex} />
        <Footer />
      </div>

      {/* Cockpit HUD control console */}
      <TrainHUD
        speed={speed}
        activeStationIndex={activeStationIndex}
        preset={preset}
        setPreset={handlePresetSelect}
        autoSky={autoSky}
        setAutoSky={setAutoSky}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        volume={volume}
        setVolume={setVolume}
        onPlayHorn={playHorn}
      />

      <BackToTop />
    </main>
  );
}
