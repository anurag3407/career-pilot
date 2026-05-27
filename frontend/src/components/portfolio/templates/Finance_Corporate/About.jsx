import React, {useId} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { User, LineChart, Shield, Brain, Code2, Target } from "lucide-react";

const skills = [
  {
    icon: Brain,
    title: "Analytical Thinking",
    desc: "Strong focus on structured problem solving, financial reasoning, and decision modeling.",
  },
  {
    icon: LineChart,
    title: "Market-Oriented Mindset",
    desc: "Understanding of data trends, risk behavior, and performance-driven systems.",
  },
  {
    icon: Code2,
    title: "Full-Stack Development",
    desc: "Building responsive, scalable web applications with modern frameworks.",
  },
];

const highlights = [
  "Focus on finance + technology intersection",
  "Building portfolio-grade UI systems",
  "Interest in trading systems & analytics dashboards",
  "Strong foundation in frontend architecture",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function About() {
  const gradientId = useId();
  const prefersReducedMotion = useReducedMotion();
  return (
    <section className="relative w-full bg-gray-950 text-white py-24 px-6 md:px-16 overflow-hidden">
      {/* 📈 Moving Chart Background */}
      <div className="absolute inset-0 opacity-20">
        <motion.svg className="w-full h-full">
          <motion.path
            d="M0,200 Q120,120 240,180 T480,160 T720,200 T960,140"
            stroke={`url(#${gradientId})`}
            strokeWidth="2"
            fill="transparent"
            initial={prefersReducedMotion ? false : { pathLength: 0 }}
            animate={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
           transition={
             prefersReducedMotion ? { duration: 0 } : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
          />
          <defs>
            <linearGradient id={gradientId}>
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* glow */}
      <div className="absolute top-24 left-10 w-72 h-72 bg-emerald-500/10 blur-3xl rounded-full motion-safe:animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full motion-safe:animate-pulse" />

      <div className="relative max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <User className="w-5 h-5" />
            <span className="text-xs tracking-widest uppercase">About Me</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-semibold leading-tight">
            I Build Systems Where{" "}
            <span className="text-emerald-400 block font-extrabold">
              Finance Meets Code
            </span>
          </h2>

          <p className="text-slate-400 mt-5 max-w-2xl leading-relaxed">
            I’m a developer with a strong interest in financial systems,
            analytics, and performance-driven applications. I enjoy building
            interfaces that turn complex data into clear decisions.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-white/90 mb-4">
              Core Strengths
            </h3>

            {skills.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  variants={item}
                  className="flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500 transition"
                >
                  <div className="text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="font-semibold">{s.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-5">
              <Target className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Focus Areas</h3>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              {highlights.map((h, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-400">•</span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 border-t border-white/10 rounded-lg p-4 bg-white/5">
              <div className="flex items-center gap-2 text-emerald-400">
                <Shield className="w-4 h-4" />
                <span className="text-xs tracking-wide uppercase">
                  Currently Exploring
                </span>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed">
                Financial dashboards, trading system UI design, and
                performance-heavy frontend architectures focused on real-time
                data visualization.
              </p>

              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <LineChart className="w-4 h-4 text-emerald-400" />
                <span>
                  Building systems that turn complexity into actionable insight
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
