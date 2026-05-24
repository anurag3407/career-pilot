import React from "react";
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  Wand2,
  ArrowUpRight,
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Cpu,
      title: "Immersive Systems",
      description:
        "Building futuristic interfaces with layered depth, motion, and holographic interactions.",
    },
    {
      icon: ShieldCheck,
      title: "Clean Architecture",
      description:
        "Scalable frontend systems designed for performance, modularity, and long-term maintainability.",
    },
    {
      icon: Wand2,
      title: "Creative Engineering",
      description:
        "Blending visual storytelling with modern web technologies to craft memorable experiences.",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050816] px-6 py-20 text-white shadow-2xl sm:px-10 lg:px-16">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.16),transparent_35%)]" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:50px_50px] opacity-[0.08]" />

      {/* Floating Orbs */}
      <div className="absolute -left-16 top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              About The Vision
            </div>

            <h2 className="bg-gradient-to-r from-cyan-200 via-blue-300 to-fuchsia-300 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl lg:text-6xl">
              Designing Beyond The Screen
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              This holographic-inspired experience combines futuristic visuals,
              glowing interfaces, and glassmorphism aesthetics to create a
              next-generation digital presence.
            </p>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400">
              Every section is crafted with responsiveness, fluidity, and
              immersive interaction in mind — optimized for mobile, tablet, and
              desktop environments.
            </p>
          </div>

          {/* Holographic Display Panel */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-2xl">
              {/* Top Neon Line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-80" />

              {/* Animated Glow */}
              <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative z-10 space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={index}
                      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-cyan-300/30 hover:bg-white/[0.06]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20">
                          <Icon className="h-5 w-5 text-cyan-200" />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {feature.title}
                          </h3>

                          <p className="mt-2 text-sm leading-relaxed text-slate-300">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Corner Glow */}
              <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}