import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Rocket,
  Sparkles,
  Palette,
  Github,
  Linkedin,
  FileText,
} from "lucide-react";

const themes = [
  {
    id: 1,
    name: "Developer",
    skills: ["React", "TypeScript", "Node.js"],
    accent: "from-sky-500 to-blue-600",
    dot: "bg-sky-400",
  },
  {
    id: 2,
    name: "Creative",
    skills: ["Figma", "UI/UX", "Design Systems"],
    accent: "from-violet-500 to-fuchsia-600",
    dot: "bg-violet-400",
  },
  {
    id: 3,
    name: "Professional",
    skills: ["Product", "Strategy", "Growth"],
    accent: "from-amber-500 to-orange-600",
    dot: "bg-amber-400",
  },
];

const sources = [
  { icon: FileText, label: "Resume" },
  { icon: Github, label: "GitHub" },
  { icon: Linkedin, label: "LinkedIn" },
];

export default function PortfolioShowcaseSection() {
  const [active, setActive] = useState(0);
  const theme = themes[active];

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % themes.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background py-32">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Centered header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">
            004 — Portfolio
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-[0.95] tracking-tighter text-foreground md:text-7xl">
            Ship a portfolio
            <br />
            <span className="text-muted-foreground/40">before your coffee cools.</span>
          </h2>
        </motion.div>

        {/* Browser mockup - full width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mx-auto max-w-4xl"
        >
          {/* Glow behind */}
          <div className={`absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br ${theme.accent} opacity-10 blur-3xl transition-all duration-700`} />

          <div className="overflow-hidden rounded-2xl border border-border bg-card/50 shadow-2xl backdrop-blur-xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
              <div className="mx-auto rounded-md bg-background/60 px-4 py-1 text-xs text-muted-foreground">
                yourname.careerpilot.io
              </div>
            </div>

            {/* Portfolio body */}
            <div className="relative min-h-[340px] p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-5">
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${theme.accent} shadow-lg`} />
                    <div>
                      <div className="h-4 w-36 rounded bg-foreground/12" />
                      <div className="mt-2 h-3 w-24 rounded bg-foreground/6" />
                    </div>
                    <div className={`ml-auto rounded-full bg-gradient-to-r ${theme.accent} px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white`}>
                      {theme.name}
                    </div>
                  </div>

                  {/* Content lines */}
                  <div className="mt-8 space-y-2.5">
                    <div className="h-3 w-full rounded bg-foreground/8" />
                    <div className="h-3 w-4/5 rounded bg-foreground/5" />
                    <div className="h-3 w-3/5 rounded bg-foreground/4" />
                  </div>

                  {/* Project grid */}
                  <div className="mt-8 grid grid-cols-3 gap-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="rounded-xl border border-border bg-muted/40 p-4">
                        <div className={`mb-3 h-1.5 w-8 rounded-full bg-gradient-to-r ${theme.accent}`} />
                        <div className="h-2 w-full rounded bg-foreground/8" />
                        <div className="mt-2 h-2 w-2/3 rounded bg-foreground/5" />
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="mt-8 flex gap-2">
                    {theme.skills.map((skill) => (
                      <span key={skill} className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Theme switcher - horizontal pills */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {themes.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  i === active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                {t.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bottom info row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex flex-col items-center gap-8"
        >
          {/* Source chips */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {sources.map((s) => (
              <span key={s.label} className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-4 py-2 text-sm font-bold text-foreground">
                <s.icon className="h-4 w-4 text-primary" />
                {s.label}
              </span>
            ))}
            <span className="text-muted-foreground/40">→</span>
            {[
              { label: "One-Click Deploy", icon: Rocket },
              { label: "AI Content", icon: Sparkles },
              { label: "10+ Themes", icon: Palette },
            ].map((p) => (
              <span key={p.label} className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold text-primary">
                <p.icon className="h-3.5 w-3.5" />
                {p.label}
              </span>
            ))}
          </div>

          <Link
            to="/register"
            className="group inline-flex items-center gap-3 rounded-xl bg-foreground px-8 py-4 text-sm font-black text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Build Your Portfolio
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
