import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, GitBranch, Network, Zap, ShieldAlert } from "lucide-react";

const features = [
  {
    icon: Network,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    title: "Architecture Maps",
    desc: "Interactive visual graphs of your codebase modules.",
  },
  {
    icon: ShieldAlert,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    title: "Risk Hotspots",
    desc: "Detect complexity and coupling instantly.",
  },
  {
    icon: Zap,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    title: "AI Onboarding",
    desc: "Chat with an AI that knows your architecture.",
  },
];

const nodes = [
  {
    pos: "left-8 top-10",
    border: "border-cyan-500/60",
    bar: "bg-cyan-400",
    glow: "shadow-[0_0_24px_rgba(34,211,238,0.25)]",
    w: "w-24",
    delay: 0.2,
  },
  {
    pos: "right-10 top-28",
    border: "border-violet-500/60",
    bar: "bg-violet-400",
    glow: "shadow-[0_0_24px_rgba(139,92,246,0.25)]",
    w: "w-20",
    delay: 0.45,
  },
  {
    pos: "left-20 bottom-12",
    border: "border-orange-500/60",
    bar: "bg-orange-400",
    glow: "shadow-[0_0_24px_rgba(249,115,22,0.25)]",
    w: "w-28",
    delay: 0.7,
  },
];

export default function ProjectVisualizerSection() {
  return (
    <section className="relative overflow-hidden bg-background py-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-full max-w-3xl -translate-x-1/2 bg-linear-to-b from-cyan-500/10 to-violet-500/5 blur-3xl" />
        <div className="premium-grid absolute inset-0 opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* ── Copy ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-bold text-violet-400 backdrop-blur-md">
              <GitBranch className="h-4 w-4" />
              Project Visualizer
            </div>

            <h2 className="mt-7 text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-5xl">
              Understand any repo in{" "}
              <span className="bg-linear-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                seconds
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-muted-foreground">
              Paste a GitHub URL and let our AI engine instantly build a dynamic,
              visual architecture map. Explore modules, dependencies, and risks
              without cloning a single file.
            </p>

            <div className="mt-10 space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className="group flex items-start gap-4 rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-card/70"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${f.bg} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <f.icon className={`h-5 w-5 ${f.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{f.title}</h4>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to="/project-visualizer"
              className="group mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-8 py-4 font-bold text-background shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Try Visualizer Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* ── Visual graph mockup ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-tr from-cyan-500/20 to-violet-500/20 blur-[80px]" />

            <div className="relative flex aspect-[4/3] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-[#0b1120] shadow-2xl">
              {/* Window header */}
              <div className="flex h-11 items-center gap-2 border-b border-slate-800 bg-[#0a0f1c] px-4">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <div className="mx-auto rounded border border-slate-700/50 bg-slate-800/50 px-3 py-1 font-mono text-[10px] text-slate-400">
                  github.com/facebook/react
                </div>
              </div>

              {/* Graph body */}
              <div className="relative flex-1 p-6">
                {/* Animated connection paths */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  style={{ zIndex: 0 }}
                >
                  <defs>
                    <linearGradient id="pv-line" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  {[
                    "M 110 70 Q 230 70 300 150",
                    "M 90 110 Q 90 200 160 270",
                  ].map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      fill="none"
                      stroke="url(#pv-line)"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.7 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.5 + i * 0.3 }}
                    />
                  ))}
                </svg>

                {/* Nodes */}
                {nodes.map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                      delay: n.delay,
                    }}
                    className={`absolute ${n.pos} ${n.w} rounded-lg border ${n.border} ${n.glow} bg-[#1e293b] p-3`}
                  >
                    <div className={`mb-2 h-1 w-6 rounded-full ${n.bar}`} />
                    <div className="mb-1.5 h-2 w-full rounded-full bg-slate-600" />
                    <div className="h-2 w-2/3 rounded-full bg-slate-700" />
                  </motion.div>
                ))}

                {/* AI chat bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="absolute bottom-6 right-6 max-w-[210px] rounded-xl border border-slate-700 bg-slate-800/90 p-3 shadow-xl backdrop-blur"
                >
                  <div className="flex items-start gap-2">
                    <span className="relative mt-0.5 flex h-4 w-4 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                      <Zap className="relative h-4 w-4 text-cyan-400" />
                    </span>
                    <p className="text-xs leading-relaxed text-slate-300">
                      The core reconciler module seems heavily coupled. Consider
                      reviewing dependencies.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
