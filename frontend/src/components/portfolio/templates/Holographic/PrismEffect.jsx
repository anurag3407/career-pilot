import { useId } from 'react';
import { Code2, Sparkles, Database, Palette, Rocket, Shield, Gem, Layers } from 'lucide-react';

const SPECTRUM = 'linear-gradient(90deg,#ff2d95,#ff7a18,#ffe600,#23ff7a,#23d6ff,#7a5cff,#ff2d95)';

const FEATURES = [
  { icon: Code2,    title: 'Full-Stack Craft',  description: 'Building responsive apps with modern React, Node.js, and cloud-native architecture.' },
  { icon: Sparkles, title: 'UI Engineering',     description: 'Designing immersive interfaces with glass morphism, motion, and iridescent aesthetics.' },
  { icon: Database, title: 'Data Systems',       description: 'Modeling scalable databases and APIs that stay fast under real-world load.' },
  { icon: Palette,  title: 'Creative Direction', description: 'Translating brand vision into cohesive visual systems and interactive experiences.' },
  { icon: Rocket,   title: 'Product Launch',     description: 'Shipping MVPs to production with CI/CD pipelines and performance-first workflows.' },
  { icon: Shield,   title: 'Secure by Design',   description: 'Embedding auth, validation, and best practices from prototype to deployment.' },
];

const SKILLS = [
  { label: 'React',      level: 92 },
  { label: 'TypeScript', level: 88 },
  { label: 'Node.js',    level: 85 },
  { label: 'Design',     level: 80 },
  { label: 'DevOps',     level: 74 },
];

const STATS = [
  { value: '24',  label: 'Projects'     },
  { value: '3yr', label: 'Experience'   },
  { value: '12',  label: 'Technologies' },
  { value: '98%', label: 'Satisfaction' },
];

function CrystalShape({ className }) {
  const gid = `cg-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#ff5cdc" stopOpacity="0.9" />
          <stop offset="50%"  stopColor="#5ce8ff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a16bff" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <polygon points="50,4 92,30 92,90 50,116 8,90 8,30" fill={`url(#${gid})`} stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
      <polyline points="50,4 50,116"  stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" fill="none" />
      <polyline points="8,30 92,90"   stroke="rgba(255,255,255,0.2)"  strokeWidth="0.5" fill="none" />
      <polyline points="92,30 8,90"   stroke="rgba(255,255,255,0.2)"  strokeWidth="0.5" fill="none" />
    </svg>
  );
}

export default function PrismEffect() {
  const beamGradId = `beamGrad-${useId().replace(/:/g, '')}`;

  return (
    <div id="prism" className="relative min-h-screen overflow-hidden text-white bg-[#070417]">

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-50 animate-orb-drift bg-[radial-gradient(circle,#ff2d95,transparent_60%)]" />
        <div className="absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full blur-3xl opacity-50 animate-orb-drift [animation-delay:2s] bg-[radial-gradient(circle,#23d6ff,transparent_60%)]" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full blur-3xl opacity-40 animate-orb-drift [animation-delay:4s] bg-[radial-gradient(circle,#7a5cff,transparent_60%)]" />

        <CrystalShape className="absolute top-24 right-10 w-24 opacity-60 animate-[float-crystal_6s_ease-in-out_infinite]" />
        <CrystalShape className="absolute top-[55%] left-8 w-16 opacity-50 animate-[float-crystal_6s_ease-in-out_2s_infinite]" />
        <CrystalShape className="absolute bottom-32 right-1/4 w-20 opacity-50 animate-[float-crystal_6s_ease-in-out_4s_infinite]" />

        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">

        {/* ── Prism orb hero ── */}
        <section className="relative flex flex-col items-center text-center">
          <div className="relative mb-10 h-64 w-64">
            {/* Outer glow — spectrum bg needs inline (7-stop custom gradient) */}
            <div className="absolute inset-0 rounded-full blur-2xl animate-prism-pulse" style={{ background: SPECTRUM }} />
            {/* Rotating conic ring */}
            <div className="absolute inset-4 rounded-full animate-rotate-grad bg-[conic-gradient(from_0deg,#ff2d95,#ff7a18,#ffe600,#23ff7a,#23d6ff,#7a5cff,#ff2d95)] [mask-image:radial-gradient(circle,transparent_45%,#000_47%,#000_60%,transparent_62%)] [-webkit-mask-image:radial-gradient(circle,transparent_45%,#000_47%,#000_60%,transparent_62%)]" />

            {/* Light beams */}
            <svg viewBox="0 0 200 200" className="absolute inset-0">
              <defs>
                <linearGradient id={beamGradId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="50%"  stopColor="#ffffff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0,1,2,3,4,5].map(i => (
                <line key={i} x1="100" y1="100" x2="100" y2="10"
                  stroke={`url(#${beamGradId})`} strokeWidth="2"
                  transform={`rotate(${i * 30 - 75} 100 100)`}
                  className="animate-prism-pulse" style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </svg>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Gem className="h-16 w-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
            </div>
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] backdrop-blur">
            <Layers className="h-3.5 w-3.5" /> Holographic Prism
          </div>

          {/* Spectrum title — custom 7-stop gradient needs inline */}
          <h1 className="text-5xl font-black tracking-tight md:text-7xl bg-clip-text text-transparent animate-holo-shimmer bg-[length:200%_auto]" style={{ backgroundImage: SPECTRUM }}>
            Spectrum Developer
          </h1>

          <p className="mt-6 max-w-xl text-center text-base text-white/70 md:text-lg">
            Crafting digital experiences through light, color, and crystalline precision
          </p>
        </section>

        {/* ── Features grid ── */}
        <section className="mt-28">
          <div className="mb-10 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" />
            <h2 className="text-sm uppercase tracking-[0.4em] text-white/70">Core Capabilities</h2>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/25">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: SPECTRUM }}>
                  <Icon className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skill bars ── */}
        <section className="mt-28">
          <h2 className="mb-8 text-center text-sm uppercase tracking-[0.4em] text-white/70">Prism Spectrum</h2>

          {/* Rainbow bar */}
          <div className="relative mb-10 h-3 overflow-hidden rounded-full" style={{ background: SPECTRUM }}>
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-spec-shimmer" />
          </div>

          <div className="space-y-5">
            {SKILLS.map(({ label, level }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-white/80">{label}</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="absolute inset-y-0 left-0 rounded-full animate-spec-shimmer" style={{ width: `${level}%`, background: SPECTRUM }} />
                </div>
                <span className="w-12 text-right text-sm tabular-nums text-white/60">{level}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="mt-28">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="p-8 text-center bg-[#070417]">
                <div className="text-4xl font-black md:text-5xl bg-clip-text text-transparent animate-holo-shimmer bg-[length:200%_auto]" style={{ backgroundImage: SPECTRUM }}>
                  {value}
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 text-center text-xs uppercase tracking-[0.3em] text-white/40">
          Refracted with light · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
