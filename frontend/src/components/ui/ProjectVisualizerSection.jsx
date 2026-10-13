import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, GitBranch, Network, Zap, ShieldAlert } from "lucide-react";

const features = [
  {
    icon: Network,
    title: "Architecture Maps",
    desc: "Interactive visual graphs of your codebase modules.",
  },
  {
    icon: ShieldAlert,
    title: "Risk Hotspots",
    desc: "Detect complexity and coupling instantly.",
  },
  {
    icon: Zap,
    title: "AI Onboarding",
    desc: "Chat with an AI that knows your architecture.",
  },
];

export default function ProjectVisualizerSection() {
  return (
    <section className="relative overflow-hidden bg-[#080b12] py-32">
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan-400/70">
            005 — Visualizer
          </span>
          <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-tighter text-white md:text-7xl">
            Paste a URL.
            <br />
            <span className="text-white/30">See the whole codebase.</span>
          </h2>
        </motion.div>

        {/* Terminal window - full width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/5 bg-[#161b22] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-4 font-mono text-xs text-white/40">
              careerpilot visualize github.com/facebook/react
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 md:p-10">
            {/* Command output lines */}
            <div className="space-y-2 font-mono text-sm">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-emerald-400"
              >
                ✓ Analyzing repository structure...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-emerald-400"
              >
                ✓ Mapping 1,247 modules across 89 packages
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="text-amber-400"
              >
                ⚠ 3 high-coupling risk hotspots detected
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="text-cyan-400"
              >
                → Architecture map ready. Opening visual explorer...
              </motion.p>
            </div>

            {/* Visual graph area */}
            <div className="relative mt-8 rounded-xl border border-white/5 bg-[#0a0e14] p-8">
              {/* Connection lines */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40">
                <defs>
                  <linearGradient id="pv-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M 120 60 Q 250 80 340 140"
                  fill="none"
                  stroke="url(#pv-grad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
                <motion.path
                  d="M 100 90 Q 120 180 200 220"
                  fill="none"
                  stroke="url(#pv-grad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                />
              </svg>

              {/* Module nodes */}
              {[
                { label: "react-reconciler", x: "8%", y: "15%", color: "border-cyan-500/50 text-cyan-400" },
                { label: "react-dom", x: "55%", y: "45%", color: "border-violet-500/50 text-violet-400" },
                { label: "scheduler", x: "25%", y: "70%", color: "border-amber-500/50 text-amber-400" },
              ].map((node, i) => (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + i * 0.2, type: "spring", stiffness: 200 }}
                  className={`absolute rounded-lg border ${node.color} bg-[#161b22] px-3 py-2 font-mono text-xs`}
                  style={{ left: node.x, top: node.y }}
                >
                  {node.label}
                </motion.div>
              ))}

              {/* AI insight bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.8 }}
                className="absolute bottom-4 right-4 max-w-[240px] rounded-lg border border-white/10 bg-[#1c2128] p-3"
              >
                <div className="flex items-start gap-2">
                  <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                  <p className="text-xs leading-relaxed text-white/60">
                    The core reconciler module seems heavily coupled. Consider reviewing dependencies.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Feature pills + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col items-center gap-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            {features.map((f) => (
              <span key={f.title} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/70">
                <f.icon className="h-4 w-4 text-cyan-400" />
                {f.title}
              </span>
            ))}
          </div>

          <Link
            to="/project-visualizer"
            className="group inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-black text-[#080b12] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/20"
          >
            Try Visualizer Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
