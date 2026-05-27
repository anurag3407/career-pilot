import React, { useId } from 'react';
import {
  Code2,
  Sparkles,
  Database,
  Palette,
  Rocket,
  Shield,
  Gem,
  Layers,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Code2,
    title: 'Full-Stack Craft',
    description: 'Building responsive apps with modern React, Node.js, and cloud-native architecture.',
  },
  {
    icon: Sparkles,
    title: 'UI Engineering',
    description: 'Designing immersive interfaces with glass morphism, motion, and iridescent aesthetics.',
  },
  {
    icon: Database,
    title: 'Data Systems',
    description: 'Modeling scalable databases and APIs that stay fast under real-world load.',
  },
  {
    icon: Palette,
    title: 'Creative Direction',
    description: 'Translating brand vision into cohesive visual systems and interactive experiences.',
  },
  {
    icon: Rocket,
    title: 'Product Launch',
    description: 'Shipping MVPs to production with CI/CD pipelines and performance-first workflows.',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'Embedding auth, validation, and best practices from prototype to deployment.',
  },
];

const SPECTRUM_SKILLS = [
  { label: 'React', level: 92 },
  { label: 'TypeScript', level: 88 },
  { label: 'Node.js', level: 85 },
  { label: 'Design', level: 80 },
  { label: 'DevOps', level: 74 },
];

const STATS = [
  { value: '24', label: 'Projects' },
  { value: '3yr', label: 'Experience' },
  { value: '12', label: 'Technologies' },
  { value: '98%', label: 'Satisfaction' },
];

function CrystalShape({ className, style }) {
  const gradientId = useId().replace(/:/g, '');
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 80 80" className="h-full w-full drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
            <stop offset="50%" stopColor="rgba(168,85,247,0.25)" />
            <stop offset="100%" stopColor="rgba(236,72,153,0.35)" />
          </linearGradient>
        </defs>
        <polygon
          points="40,4 72,28 60,76 20,76 8,28"
          fill={`url(#${gradientId})`}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export default function PrismEffect() {
  const gradientId = useId().replace(/:/g, '');
  const beamGradId = `beamGrad-${gradientId}`;

  return (
    <section className="relative w-full overflow-hidden bg-[#0a0a0f] text-white">
      <style>{`
        @keyframes holographic-shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes rotate-gradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes prism-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
        @keyframes float-crystal {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(12deg); }
        }
        @keyframes spectrum-shimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes orb-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(12px, -16px) scale(1.05); }
          66% { transform: translate(-8px, 10px) scale(0.95); }
        }
        .prism-shimmer-text {
          background-size: 200% auto;
          animation: holographic-shimmer 5s linear infinite;
        }
        .prism-rotate-bg {
          animation: rotate-gradient 20s linear infinite;
        }
        .prism-beam-pulse {
          animation: prism-pulse 3s ease-in-out infinite;
        }
        .prism-float-crystal {
          animation: float-crystal 6s ease-in-out infinite;
        }
        .prism-spectrum-shimmer {
          animation: spectrum-shimmer 2.5s ease-in-out infinite;
        }
        .prism-orb-drift {
          animation: orb-drift 8s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(34,211,238,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(168,85,247,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_90%,rgba(236,72,153,0.1),transparent_50%)]" />
        <div
          className="prism-rotate-bg absolute -top-1/2 -left-1/2 h-[200%] w-[200%] opacity-30"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(34,211,238,0.08), rgba(59,130,246,0.06), rgba(168,85,247,0.08), rgba(236,72,153,0.06), rgba(34,211,238,0.08))',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="prism-orb-drift absolute top-16 left-[10%] h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />
        <div
          className="prism-orb-drift absolute bottom-24 right-[12%] h-40 w-40 rounded-full bg-purple-500/20 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="prism-orb-drift absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Hero section */}
        <div className="relative mb-20 text-center">
          <CrystalShape
            className="prism-float-crystal top-0 left-[8%] h-14 w-14 opacity-70"
            style={{ animationDelay: '0s' }}
          />
          <CrystalShape
            className="prism-float-crystal top-8 right-[10%] h-10 w-10 opacity-60"
            style={{ animationDelay: '1.5s' }}
          />
          <CrystalShape
            className="prism-float-crystal bottom-4 left-[18%] h-8 w-8 opacity-50"
            style={{ animationDelay: '3s' }}
          />

          <svg
            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2"
            viewBox="0 0 400 200"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={beamGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                <stop offset="30%" stopColor="#a855f7" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#ec4899" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = i * 30 - 75;
              return (
                <line
                  key={i}
                  x1="200"
                  y1="100"
                  x2={200 + Math.cos((angle * Math.PI) / 180) * 180}
                  y2={100 + Math.sin((angle * Math.PI) / 180) * 80}
                  stroke={`url(#${beamGradId})`}
                  strokeWidth="2"
                  className="prism-beam-pulse"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              );
            })}
            <polygon
              points="200,60 230,100 200,140 170,100"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1"
              className="prism-beam-pulse"
            />
          </svg>

          <div className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <Gem className="h-4 w-4 text-cyan-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-200/80">Holographic Prism</span>
          </div>

          <h1 className="relative mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            <span className="prism-shimmer-text block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Spectrum Developer
            </span>
          </h1>
          <p className="relative mx-auto max-w-xl bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-base text-transparent sm:text-lg">
            Crafting digital experiences through light, color, and crystalline precision
          </p>
        </div>

        {/* Skills / features grid */}
        <div className="mb-20">
          <div className="mb-10 flex items-center justify-center gap-2">
            <Layers className="h-5 w-5 text-purple-400" />
            <h2 className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
              Core Capabilities
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-cyan-500/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-purple-400/40 hover:bg-white/10 hover:shadow-purple-500/50"
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(168,85,247,0.08), rgba(236,72,153,0.08))',
                  }}
                  aria-hidden="true"
                />
                <div className="relative mb-4 inline-flex rounded-xl border border-white/20 bg-white/10 p-3 shadow-lg shadow-cyan-500/25">
                  <Icon className="h-6 w-6 text-cyan-300 transition-colors duration-300 group-hover:text-pink-300" />
                </div>
                <h3 className="relative mb-2 text-lg font-semibold text-white">{title}</h3>
                <p className="relative text-sm leading-relaxed text-white/60">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prism spectrum bar */}
        <div className="mb-20 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8">
          <h2 className="mb-6 text-center bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-lg font-semibold text-transparent sm:text-xl">
            Prism Spectrum
          </h2>
          <div className="relative mb-8 h-3 overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 via-pink-500 to-cyan-400" />
            <div className="prism-spectrum-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>
          <div className="space-y-4">
            {SPECTRUM_SKILLS.map(({ label, level }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-24 shrink-0 text-sm text-white/70">{label}</span>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
                    style={{ width: `${level}%` }}
                    aria-hidden="true"
                  />
                  <div
                    className="prism-spectrum-shimmer absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{ width: `${level}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="w-10 shrink-0 text-right font-mono text-xs text-cyan-300">{level}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 backdrop-blur-md sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {STATS.map(({ value, label }, index) => (
              <React.Fragment key={label}>
                <div className="flex-1 text-center">
                  <div className="prism-shimmer-text text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent sm:text-4xl">
                    {value}
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/50 sm:text-sm">{label}</p>
                </div>
                {index < STATS.length - 1 && (
                  <div
                    className="hidden h-12 w-px shrink-0 bg-gradient-to-b from-transparent via-purple-500/60 to-transparent sm:block"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
