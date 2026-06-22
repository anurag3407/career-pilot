import React from "react";
import { ArrowRight, Sparkles, Zap, ShieldCheck, Orbit } from "lucide-react";

const statCards = [
  { value: "12+", label: "portfolio modules" },
  { value: "99%", label: "glass clarity" },
  { value: "24/7", label: "immersive glow" },
];

const highlights = ["React", "Tailwind", "Motion-ready"];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.14),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.35),rgba(2,6,23,0.95))]" />

      <div className="absolute left-6 top-10 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
      <div className="absolute right-8 top-1/4 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse [animation-delay:700ms]" />
      <div className="absolute bottom-8 left-1/3 h-28 w-28 rounded-full bg-blue-500/20 blur-3xl animate-pulse [animation-delay:1200ms]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950">
                <Sparkles className="h-4 w-4" />
              </span>
              Holographic portfolio experience
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="block text-white/90">Craft a future-ready</span>
                <span className="block bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                  holographic hero.
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-base leading-7 text-slate-300 sm:text-lg lg:mx-0">
                A cinematic landing section for modern portfolios, built with layered glassmorphism,
                glowing gradients, and clean responsive composition for every screen.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a href="#portfolio" aria-label="Explore the portfolio section" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-6 py-3.5 font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(168,85,247,0.35)]">
                Explore Portfolio
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a href="#work" aria-label="View work examples" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/6 px-6 py-3.5 font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-white/10 hover:shadow-[0_0_28px_rgba(56,189,248,0.14)]">
                View Work
                <Zap className="h-4 w-4 text-cyan-300" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute -left-6 top-10 h-20 w-20 rounded-full border border-cyan-300/20 bg-cyan-400/10 blur-2xl" />
            <div className="absolute -right-4 bottom-8 h-28 w-28 rounded-full border border-fuchsia-300/20 bg-fuchsia-500/10 blur-2xl" />

            <div className="relative w-full max-w-md rounded-[2rem] border border-white/12 bg-white/8 p-4 shadow-[0_30px_100px_rgba(2,6,23,0.65)] backdrop-blur-2xl sm:p-5">
              <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(168,85,247,0.08),rgba(236,72,153,0.14))]" />
              <div className="absolute inset-[1px] rounded-[2rem] border border-white/10" />

              <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/70 p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_30%)]" />

                <div className="relative flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Live interface</p>
                    <h2 className="text-2xl font-bold text-white">Alex Morgan</h2>
                    <p className="max-w-xs text-sm text-slate-300">Creative developer shaping immersive digital identities.</p>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-fuchsia-500/20 shadow-[0_0_35px_rgba(34,211,238,0.22)]">
                    <Orbit className="h-7 w-7 text-cyan-200" />
                  </div>
                </div>

                <div className="relative mt-8 grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Holographic signal</span>
                      <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    </div>

                    <div className="mt-5 space-y-4">
                      {statCards.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex items-end justify-between border-b border-white/8 pb-3 last:border-b-0 last:pb-0"
                        >
                          <span className="text-2xl font-bold text-white">{stat.value}</span>
                          <span className="text-xs uppercase tracking-[0.25em] text-slate-400">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(34,211,238,0.12),rgba(168,85,247,0.1),rgba(15,23,42,0.45))] p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-sm text-cyan-100">
                      <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
                      Active glow mode
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-xl">
                        Seamless glass layers with soft depth.
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-xl">
                        Cyan, violet, pink, and blue gradients.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}