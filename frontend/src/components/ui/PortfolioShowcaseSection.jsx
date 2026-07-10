import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
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
    description:
      "Showcase your projects, repositories, and technical skills in a clean portfolio layout.",
    skills: ["React", "TypeScript", "Node.js"],
    accent: "from-sky-500 to-blue-600",
    ring: "ring-sky-500/40",
    avatar: "from-sky-400 to-blue-600",
  },
  {
    id: 2,
    name: "Creative",
    description:
      "Display your design work, case studies, and creative projects with a minimalist aesthetic.",
    skills: ["Figma", "UI/UX", "Design Systems"],
    accent: "from-violet-500 to-fuchsia-600",
    ring: "ring-violet-500/40",
    avatar: "from-violet-400 to-fuchsia-600",
  },
  {
    id: 3,
    name: "Professional",
    description:
      "Highlight your career milestones, industry experience, and professional achievements.",
    skills: ["Product", "Strategy", "Growth"],
    accent: "from-amber-500 to-orange-600",
    ring: "ring-amber-500/40",
    avatar: "from-amber-400 to-orange-600",
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

  // 3D tilt
  const tiltRef = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  const onMove = (e) => {
    const rect = tiltRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 8);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % themes.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background py-28">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/4 h-[480px] w-[480px] rounded-full bg-secondary/10 blur-[150px]" />
        <div className="absolute left-0 bottom-0 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* ── Left: copy ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 backdrop-blur-md">
              <Palette className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Portfolio Builder
              </span>
            </div>

            <h2 className="mt-7 text-4xl font-black leading-[1.1] tracking-tight text-foreground md:text-5xl">
              Build stunning portfolios in{" "}
              <span className="gradient-text-animated">minutes</span>
            </h2>

            <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-muted-foreground">
              From Resume, GitHub, or LinkedIn — deployed instantly with AI
              content and 10+ premium themes.
            </p>

            {/* Source chips */}
            <div className="mt-8 flex flex-wrap gap-3">
              {sources.map((s) => (
                <div
                  key={s.label}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 backdrop-blur-md transition-colors hover:border-primary/40"
                >
                  <s.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Feature pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { label: "One-Click Deploy", icon: Rocket },
                { label: "AI Content", icon: Sparkles },
                { label: "10+ Themes", icon: Palette },
              ].map((p) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20"
                >
                  <p.icon className="h-3 w-3" />
                  {p.label}
                </span>
              ))}
            </div>

            <Link
              to="/register"
              className="group mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-8 py-4 font-bold text-background shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Build Your Portfolio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* ── Right: device mockup ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            style={{ perspective: 1200 }}
          >
            {/* Glow */}
            <div
              className={`absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br ${theme.accent} opacity-20 blur-3xl transition-all duration-700`}
            />

            <motion.div
              ref={tiltRef}
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
              className="relative overflow-hidden rounded-3xl border border-border bg-card/70 shadow-2xl backdrop-blur-xl"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                <div className="ml-3 flex-1 truncate rounded-md bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
                  yourname.careerpilot.io
                </div>
              </div>

              {/* Portfolio body */}
              <div className="relative min-h-[320px] p-6" style={{ transform: "translateZ(40px)" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Hero block */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-16 w-16 rounded-2xl bg-linear-to-br ${theme.avatar} ring-4 ${theme.ring}`}
                      />
                      <div className="space-y-2">
                        <div className="h-4 w-36 rounded-full bg-foreground/15" />
                        <div className="h-3 w-24 rounded-full bg-foreground/10" />
                      </div>
                    </div>

                    {/* Theme name banner */}
                    <div
                      className={`mt-6 inline-flex rounded-full bg-linear-to-r ${theme.accent} px-3 py-1 text-xs font-bold text-white`}
                    >
                      {theme.name} Theme
                    </div>

                    {/* Description lines */}
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-full rounded-full bg-foreground/10" />
                      <div className="h-3 w-5/6 rounded-full bg-foreground/[0.08]" />
                      <div className="h-3 w-2/3 rounded-full bg-foreground/[0.06]" />
                    </div>

                    {/* Project cards */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className="rounded-xl border border-border bg-muted/50 p-3"
                        >
                          <div
                            className={`mb-2 h-1.5 w-8 rounded-full bg-linear-to-r ${theme.accent}`}
                          />
                          <div className="h-2 w-full rounded-full bg-foreground/10" />
                          <div className="mt-1.5 h-2 w-2/3 rounded-full bg-foreground/[0.07]" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {theme.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Theme switcher dots */}
            <div className="mt-6 flex justify-center gap-3">
              {themes.map((t, i) => (
                <button type="button"
                  key={t.id}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${t.name} theme`}
                  className="group flex items-center gap-2"
                >
                  <span
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === active
                        ? `w-8 bg-linear-to-r ${t.accent}`
                        : "w-2.5 bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
