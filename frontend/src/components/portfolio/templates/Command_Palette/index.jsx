import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import data from "../../../../data/dummy_data.json";

// ─── Constants ───────────────────────────────────────────────────────────────

const COMMANDS = [
  { id: "about",    label: "About",    icon: "⬡", desc: "Who I am"          },
  { id: "skills",   label: "Skills",   icon: "◈", desc: "What I work with"  },
  { id: "projects", label: "Projects", icon: "◻", desc: "What I've built"   },
  { id: "contact",  label: "Contact",  icon: "◌", desc: "Get in touch"      },
];

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

function useScrollLock(active) {
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [active]);
}

function FadeInSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Command Palette ──────────────────────────────────────────────────────────

function CommandPaletteModal({ open, onClose, onSelect }) {
  const [query, setQuery]       = useState("");
  const [active, setActive]     = useState(0);
  const inputRef                = useRef(null);

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.desc.toLowerCase().includes(query.toLowerCase())
  );

// Reset state when opening
useEffect(() => {
  if (open) {
    setQuery("");
    setActive(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }
}, [open]);

// Keyboard navigation
useEffect(() => {
  if (!open) return;

  const handler = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(
        (prev) =>
          (prev - 1 + Math.max(filtered.length, 1)) %
          Math.max(filtered.length, 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (filtered[active]) {
        onSelect(filtered[active].id);
      }
    }
  };

  window.addEventListener("keydown", handler);

  return () => window.removeEventListener("keydown", handler);
}, [open, filtered, active, onSelect]);

  // Reset active index when filter changes
  useEffect(() => { setActive(0); }, [query]);

  useScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-28 px-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="palette"
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(18,18,22,0.96)",
              border: "1px solid rgba(6,182,212,0.18)",
              boxShadow: "0 0 60px rgba(6,182,212,0.08), 0 32px 64px rgba(0,0,0,0.6)",
            }}
          >
            {/* Search row */}
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-40">
                <circle cx="6.5" cy="6.5" r="5" stroke="#06B6D4" strokeWidth="1.5" />
                <path d="M10.5 10.5L14 14" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands…"
                className="flex-1 bg-transparent outline-none text-base text-white placeholder-zinc-600 font-light tracking-wide"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />
              <kbd
                className="text-xs px-2 py-1 rounded opacity-30 text-zinc-400"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "monospace" }}
              >
                ESC
              </kbd>
            </div>

            {/* Commands list */}
            <div className="py-2 px-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-zinc-600 text-sm tracking-widest uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  No command found
                </div>
              ) : (
                filtered.map((cmd, i) => (
                  <motion.button
                    key={cmd.id}
                    onClick={() => onSelect(cmd.id)}
                    onMouseEnter={() => setActive(i)}
                    initial={false}
                    animate={{
                      backgroundColor: active === i
                        ? "rgba(6,182,212,0.08)"
                        : "rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.12 }}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left group relative"
                  >
                    {/* Active indicator line */}
                    <AnimatePresence>
                      {active === i && (
                        <motion.span
                          layoutId="cmd-active-bar"
                          className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                          style={{ background: "linear-gradient(to bottom, #06B6D4, #A855F7)" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon */}
                    <span
                      className="text-xl w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                      style={{
                        background: active === i ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.04)",
                        color: active === i ? "#06B6D4" : "#71717a",
                        transition: "all 0.15s",
                        fontFamily: "monospace",
                      }}
                    >
                      {cmd.icon}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-medium"
                        style={{ color: active === i ? "#e2e8f0" : "#a1a1aa" }}
                      >
                        {cmd.label}
                      </div>
                      <div className="text-xs text-zinc-600 mt-0.5">{cmd.desc}</div>
                    </div>

                    <kbd
                      className="text-xs px-2 py-1 rounded shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "monospace" }}
                    >
                      ↵
                    </kbd>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center gap-4 px-5 py-3 text-xs text-zinc-700"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span><kbd className="opacity-60">↑↓</kbd> navigate</span>
              <span><kbd className="opacity-60">↵</kbd> select</span>
              <span><kbd className="opacity-60">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Skill Bar ────────────────────────────────────────────────────────────────

function SkillBar({ skill, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex justify-between mb-3">
        <span className="text-sm text-zinc-300 font-medium tracking-wide">{skill.name}</span>
        <span className="text-xs font-mono" style={{ color: "#06B6D4" }}>{skill.level}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 0.9, delay: 0.2 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #06B6D4, #A855F7)" }}
        />
      </div>
    </motion.div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="group rounded-3xl overflow-hidden flex flex-col cursor-default"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.3s",
        boxShadow: "0 0 0 0 rgba(6,182,212,0)",
      }}
      
    >
      <div className="overflow-hidden relative h-52">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
        />
        {/* Overlay shimmer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.08) 0%, transparent 60%)" }}
        />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{project.title}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-5">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-xs rounded-md font-mono"
              style={{
                background: "rgba(6,182,212,0.07)",
                border: "1px solid rgba(6,182,212,0.15)",
                color: "#67e8f9",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Glow Orb background decoration ──────────────────────────────────────────

function GlowOrb({ color, size, top, left, opacity = 0.12 }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: color,
        opacity,
        filter: "blur(80px)",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  const scrollToSection = useCallback((id) => {
  const el = document.getElementById(id);

  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }

  setOpen(false);
}, []);

return (
  <div
    className="min-h-screen text-white overflow-x-hidden"
    style={{
      background: "#080810",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}
  >
      {/* ── Command Palette Modal ── */}
      <CommandPaletteModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={scrollToSection}
      />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Background orbs */}
        <GlowOrb color="#06B6D4" size="600px" top="40%" left="30%" opacity={0.1} />
        <GlowOrb color="#A855F7" size="500px" top="60%" left="70%" opacity={0.1} />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Palette hint badge */}
          <motion.button
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8 cursor-pointer"
            style={{
              background: "rgba(6,182,212,0.06)",
              border: "1px solid rgba(6,182,212,0.2)",
              color: "#67e8f9",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.06em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Press ⌘K · Ctrl+K to open palette
          </motion.button>

          {/* Name */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tighter"
            style={{
              background: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #e2e8f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {data.personal.name}
          </h1>

          {/* Title with accent */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-5 text-base md:text-lg tracking-widest uppercase"
            style={{
              color: "#06B6D4",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.22em",
            }}
          >
            {data.personal.title}
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="max-w-xl mt-7 text-zinc-500 leading-relaxed text-sm md:text-base"
          >
            {data.personal.bio}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex gap-3 mt-10 flex-wrap justify-center"
          >
            <a
              href={data.socials.github}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#d4d4d8",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              GitHub ↗
            </a>
            <a
              href={data.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: "rgba(6,182,212,0.08)",
                border: "1px solid rgba(6,182,212,0.22)",
                color: "#67e8f9",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(6,182,212,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(6,182,212,0.08)";
              }}
            >
              LinkedIn ↗
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-zinc-700 tracking-widest uppercase" style={{ fontFamily: "monospace" }}>scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-8 rounded-full"
            style={{ background: "linear-gradient(to bottom, rgba(6,182,212,0.5), transparent)" }}
          />
        </motion.div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-28 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <SectionLabel>01 · About</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-12 tracking-tight">Who I am</h2>
          </FadeInSection>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInSection delay={0.1}>
              <div className="relative">
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="w-72 h-72 rounded-3xl object-cover"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                />
                {/* Decorative accent */}
                <div
                  className="absolute -bottom-4 -right-4 w-72 h-72 rounded-3xl -z-10"
                  style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(168,85,247,0.08))", border: "1px solid rgba(6,182,212,0.1)" }}
                />
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <p className="text-zinc-400 leading-loose text-base md:text-lg">
                {data.personal.bio}
              </p>
              <div
                className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#71717a",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span style={{ color: "#06B6D4" }}>⌖</span>
                {data.personal.location}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className="py-28 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <SectionLabel>02 · Skills</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-12 tracking-tight">What I work with</h2>
          </FadeInSection>

          <div className="grid md:grid-cols-2 gap-4">
            {data.skills.map((skill, i) => (
              <SkillBar key={i} skill={skill} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-28 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <SectionLabel>03 · Projects</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-12 tracking-tight">What I've built</h2>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-28 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-3xl mx-auto text-center relative">
          <GlowOrb color="#A855F7" size="400px" top="50%" left="50%" opacity={0.1} />

          <FadeInSection>
            <SectionLabel className="justify-center">04 · Contact</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-5 tracking-tight">Let's build together</h2>
            <p className="text-zinc-500 mb-10 text-base">
              Have a project in mind or just want to connect? My inbox is always open.
            </p>

            <motion.a
              href={`mailto:${data.socials.email}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block px-10 py-4 rounded-2xl text-sm font-semibold tracking-wide"
              style={{
                background: "linear-gradient(135deg, #06B6D4, #A855F7)",
                color: "#fff",
                boxShadow: "0 0 40px rgba(6,182,212,0.25)",
              }}
            >
              Say Hello →
            </motion.a>
          </FadeInSection>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 px-6 text-center text-xs text-zinc-700"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.08em",
        }}
      >
        Built by {data.personal.name} · {new Date().getFullYear()}
      </footer>

            {/* ── Mobile FAB ── */}
      <>
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 right-6 z-40 md:hidden flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.9), rgba(168,85,247,0.9))",
            backdropFilter: "blur(12px)",
            color: "#fff",
            fontFamily: "'JetBrains Mono', monospace",
            boxShadow: "0 8px 32px rgba(6,182,212,0.35)",
          }}
          aria-label="Open command palette"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="white" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Menu
        </motion.button>
      </>

    </div>
  );
}
function SectionLabel({ children, className = "" }) {
  return (
    <div
      className={`flex items-center gap-2 text-xs tracking-widest uppercase ${className}`}
      style={{
        color: "#06B6D4",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <span
        className="w-4 h-px"
        style={{ background: "#06B6D4" }}
      />
      {children}
    </div>
  );
}