import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Home, User, Zap, FolderOpen, Briefcase, MessageSquare, Mail,
  Github, Linkedin, Twitter, Globe, ExternalLink, Star,
  MapPin, Phone, Send, ChevronDown, ArrowUpRight, Code2,
  Sparkles, Award, TrendingUp, Users
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

// ─── Helpers ────────────────────────────────────────────────────────────────
const safe = (obj, ...keys) => {
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
};

const arr = (v) => (Array.isArray(v) ? v : []);

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

// ─── Animated Section Wrapper ────────────────────────────────────────────────
function Section({ id, children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={`relative ${className}`}
    >
      {children}
    </motion.section>
  );
}

// ─── Glass Card ──────────────────────────────────────────────────────────────
function GlassCard({ children, className = "", hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        relative rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]
        overflow-hidden ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}

// ─── Glow Orb ────────────────────────────────────────────────────────────────
function GlowOrb({ className = "", color = "cyan" }) {
  const colors = {
    cyan: "bg-cyan-500/20",
    violet: "bg-violet-500/20",
    emerald: "bg-emerald-500/20",
    rose: "bg-rose-500/20",
  };
  return (
    <div
      className={`absolute rounded-full blur-[100px] pointer-events-none ${colors[color] ?? colors.cyan} ${className}`}
    />
  );
}

// ─── Section Title ───────────────────────────────────────────────────────────
function SectionTitle({ label, title, subtitle }) {
  return (
    <motion.div variants={fadeUp} className="text-center mb-16 space-y-3">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-widest uppercase">
        <Sparkles size={12} />
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{title}</h2>
      {subtitle && <p className="text-white/50 text-lg max-w-xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
}

// ─── Floating Dock Nav ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "hero", icon: Home, label: "Home" },
  { id: "about", icon: User, label: "About" },
  { id: "skills", icon: Zap, label: "Skills" },
  { id: "projects", icon: FolderOpen, label: "Projects" },
  { id: "experience", icon: Briefcase, label: "Experience" },
  { id: "testimonials", icon: MessageSquare, label: "Reviews" },
  { id: "contact", icon: Mail, label: "Contact" },
];

function FloatingNav({ activeSection }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-1 px-3 py-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const isActive = activeSection === id;
          return (
            <motion.button
              key={id}
              onClick={() => scrollTo(id)}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative group flex flex-col items-center"
            >
              <div
                className={`
                  relative p-2.5 rounded-xl transition-all duration-300
                  ${isActive
                    ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.4)]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                  }
                `}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                {isActive && (
                  <motion.div
                    layoutId="dock-active"
                    className="absolute inset-0 rounded-xl border border-cyan-500/40 bg-cyan-500/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </div>
              {/* Tooltip */}
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-black/80 border border-white/10 text-white/80 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}

// ─── Social Icon Map ─────────────────────────────────────────────────────────
const socialIconMap = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe };

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 120]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const personal = safe(data, "personal") ?? {};
  const socials = arr(safe(data, "socials"));

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.12)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(139,92,246,0.12)_0%,_transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <GlowOrb className="w-[600px] h-[600px] -top-40 -left-40" color="cyan" />
      <GlowOrb className="w-[500px] h-[500px] -bottom-20 -right-20" color="violet" />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.3 }}
          className="relative inline-block mb-8"
        >
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-cyan-500/40 overflow-hidden mx-auto shadow-[0_0_40px_rgba(6,182,212,0.3)]">
            {personal.avatar ? (
              <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center text-4xl font-black text-white">
                {(personal.name ?? "P")[0]}
              </div>
            )}
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center"
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </motion.div>
        </motion.div>

        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6"
        >
          <Sparkles size={14} />
          {personal.tagline ?? personal.role ?? "Portfolio"}
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-4 leading-[0.9] tracking-tight"
        >
          {personal.name ?? "Your Name"}
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl font-light text-white/50 mb-6"
        >
          {personal.role ?? personal.title ?? "Creative Developer"}
        </motion.p>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/40 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
        >
          {personal.bio ?? personal.summary ?? "Building beautiful digital experiences."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
          >
            <FolderOpen size={16} /> View Work <ArrowUpRight size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/15 bg-white/5 text-white/80 font-semibold text-sm hover:bg-white/10 transition-all"
          >
            <Mail size={16} /> Get In Touch
          </motion.button>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3"
        >
          {socials.map((s, i) => {
            const Icon = socialIconMap[s.platform?.toLowerCase()] ?? Globe;
            return (
              <motion.a
                key={i}
                href={s.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/50 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
              >
                <Icon size={18} />
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = arr(safe(data, "stats"));
  if (!stats.length) return null;

  const icons = [TrendingUp, Award, Users, Code2];

  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="relative group"
            >
              <GlassCard className="p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {stat.value ?? stat.count ?? "—"}
                </div>
                <div className="text-white/40 text-xs font-medium uppercase tracking-wider">
                  {stat.label ?? stat.name ?? ""}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  const personal = safe(data, "personal") ?? {};
  return (
    <Section id="about" className="py-24 px-6">
      <GlowOrb className="w-[400px] h-[400px] top-0 right-0" color="violet" />
      <div className="max-w-5xl mx-auto">
        <SectionTitle label="About Me" title="Who I Am" subtitle="A little bit about my journey and what drives me." />
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image / Initials */}
          <motion.div variants={fadeUp} className="relative">
            <div className="aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(6,182,212,0.15)]">
              {personal.avatar ? (
                <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-transparent flex items-center justify-center text-8xl font-black text-white/20">
                  {(personal.name ?? "P")[0]}
                </div>
              )}
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 md:right-4"
            >
              <GlassCard className="px-4 py-3 flex items-center gap-2" hover={false}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/70 text-sm font-medium">Available for work</span>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="space-y-6">
            <motion.h3 variants={fadeUp} className="text-3xl font-bold text-white">
              {personal.name ?? "Your Name"}
            </motion.h3>
            <motion.p variants={fadeUp} className="text-white/50 leading-relaxed text-base">
              {personal.about ?? personal.bio ?? personal.summary ?? "I'm a passionate developer who loves building beautiful and functional digital experiences."}
            </motion.p>

            {/* Info pills */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {personal.location && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm">
                  <MapPin size={13} className="text-cyan-400" /> {personal.location}
                </span>
              )}
              {personal.email && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm">
                  <Mail size={13} className="text-cyan-400" /> {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm">
                  <Phone size={13} className="text-cyan-400" /> {personal.phone}
                </span>
              )}
            </motion.div>

            {personal.resumeUrl && (
              <motion.a
                variants={fadeUp}
                href={personal.resumeUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-semibold text-sm hover:bg-cyan-500/20 transition-all"
              >
                <ExternalLink size={15} /> Download Resume
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────
function Skills() {
  const skills = arr(safe(data, "skills"));

  return (
    <Section id="skills" className="py-24 px-6">
      <GlowOrb className="w-[500px] h-[500px] bottom-0 left-0" color="emerald" />
      <div className="max-w-5xl mx-auto">
        <SectionTitle label="Skills" title="My Expertise" subtitle="Technologies and tools I work with." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill, i) => {
            const level = skill.level ?? skill.proficiency ?? 80;
            const name = skill.name ?? skill.title ?? `Skill ${i + 1}`;
            const category = skill.category ?? "";
            return (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-white font-semibold text-sm">{name}</div>
                      {category && <div className="text-white/30 text-xs mt-0.5">{category}</div>}
                    </div>
                    <span className="text-cyan-400 font-bold text-sm">{level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
function Projects() {
  const projects = arr(safe(data, "projects"));

  return (
    <Section id="projects" className="py-24 px-6">
      <GlowOrb className="w-[400px] h-[400px] top-0 right-0" color="cyan" />
      <div className="max-w-6xl mx-auto">
        <SectionTitle label="Projects" title="Featured Work" subtitle="A selection of projects I'm proud of." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => {
            const title = project.title ?? project.name ?? `Project ${i + 1}`;
            const desc = project.description ?? project.summary ?? "";
            const tags = arr(project.tags ?? project.tech ?? project.technologies);
            const live = project.liveUrl ?? project.live ?? project.demo ?? null;
            const github = project.githubUrl ?? project.github ?? project.repo ?? null;
            const image = project.image ?? project.thumbnail ?? null;

            return (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <GlassCard className="flex flex-col h-full group cursor-pointer" hover>
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10">
                    {image ? (
                      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Code2 size={40} className="text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">{title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed flex-1 mb-4">{desc}</p>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tags.slice(0, 4).map((tag, j) => (
                          <span key={j} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-3 mt-auto">
                      {live && (
                        <motion.a
                          href={live}
                          target="_blank"
                          rel="noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/25 transition-all"
                        >
                          <Globe size={13} /> Live
                        </motion.a>
                      )}
                      {github && (
                        <motion.a
                          href={github}
                          target="_blank"
                          rel="noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-semibold hover:bg-white/10 transition-all"
                        >
                          <Github size={13} /> Code
                        </motion.a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────
function Experience() {
  const experience = arr(safe(data, "experience"));

  return (
    <Section id="experience" className="py-24 px-6">
      <GlowOrb className="w-[400px] h-[400px] bottom-0 right-0" color="violet" />
      <div className="max-w-3xl mx-auto">
        <SectionTitle label="Experience" title="Work History" subtitle="My professional journey so far." />
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/30 to-transparent" />

          <div className="space-y-8">
            {experience.map((exp, i) => {
              const title = exp.title ?? exp.role ?? exp.position ?? "Role";
              const company = exp.company ?? exp.organization ?? "";
              const period = exp.period ?? exp.duration ?? `${exp.startDate ?? ""} – ${exp.endDate ?? "Present"}`;
              const desc = exp.description ?? exp.summary ?? "";
              const achievements = arr(exp.achievements ?? exp.responsibilities ?? exp.highlights);

              return (
                <motion.div key={i} variants={fadeUp} custom={i} className="relative pl-16">
                  {/* Dot */}
                  <div className="absolute left-[19px] top-6 w-3 h-3 rounded-full bg-cyan-500 border-2 border-black shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

                  <GlassCard className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{title}</h3>
                        <p className="text-cyan-400 font-medium text-sm">{company}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/40 text-xs whitespace-nowrap">
                        {period}
                      </span>
                    </div>
                    {desc && <p className="text-white/40 text-sm leading-relaxed mb-4">{desc}</p>}
                    {achievements.length > 0 && (
                      <ul className="space-y-1.5">
                        {achievements.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-white/40 text-sm">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = arr(safe(data, "testimonials"));
  if (!testimonials.length) return null;

  return (
    <Section id="testimonials" className="py-24 px-6">
      <GlowOrb className="w-[400px] h-[400px] top-0 left-0" color="rose" />
      <div className="max-w-5xl mx-auto">
        <SectionTitle label="Testimonials" title="What People Say" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const name = t.name ?? t.author ?? "Anonymous";
            const role = t.role ?? t.position ?? t.title ?? "";
            const company = t.company ?? t.organization ?? "";
            const text = t.text ?? t.content ?? t.review ?? t.quote ?? "";
            const rating = t.rating ?? 5;
            const avatar = t.avatar ?? t.image ?? null;

            return (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <GlassCard className="p-6 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className={j < rating ? "fill-amber-400 text-amber-400" : "text-white/15"}
                      />
                    ))}
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed flex-1 mb-5 italic">&ldquo;{text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-gradient-to-br from-cyan-500/30 to-violet-500/30 flex items-center justify-center flex-shrink-0">
                      {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white/60 font-bold text-sm">{name[0]}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{name}</div>
                      <div className="text-white/30 text-xs">{[role, company].filter(Boolean).join(", ")}</div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

// ─── CONTACT / FOOTER ────────────────────────────────────────────────────────
function Contact() {
  const personal = safe(data, "personal") ?? {};
  const socials = arr(safe(data, "socials"));
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Section id="contact" className="py-24 pb-36 px-6">
      <GlowOrb className="w-[600px] h-[400px] bottom-0 left-1/2 -translate-x-1/2" color="cyan" />
      <div className="max-w-4xl mx-auto">
        <SectionTitle label="Contact" title="Let's Connect" subtitle="Have a project in mind? I'd love to hear from you." />

        <div className="grid md:grid-cols-5 gap-8">
          {/* Info */}
          <motion.div variants={fadeUp} className="md:col-span-2 space-y-5">
            {personal.email && (
              <GlassCard className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-cyan-400" />
                </div>
                <div>
                  <div className="text-white/30 text-xs mb-0.5">Email</div>
                  <a href={`mailto:${personal.email}`} className="text-white/70 text-sm hover:text-cyan-400 transition-colors">{personal.email}</a>
                </div>
              </GlassCard>
            )}
            {personal.phone && (
              <GlassCard className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-violet-400" />
                </div>
                <div>
                  <div className="text-white/30 text-xs mb-0.5">Phone</div>
                  <a href={`tel:${personal.phone}`} className="text-white/70 text-sm hover:text-violet-400 transition-colors">{personal.phone}</a>
                </div>
              </GlassCard>
            )}
            {personal.location && (
              <GlassCard className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-white/30 text-xs mb-0.5">Location</div>
                  <span className="text-white/70 text-sm">{personal.location}</span>
                </div>
              </GlassCard>
            )}

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s, i) => {
                const Icon = socialIconMap[s.platform?.toLowerCase()] ?? Globe;
                return (
                  <motion.a
                    key={i}
                    href={s.url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp} custom={1} className="md:col-span-3">
            <GlassCard className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/30 text-xs mb-2 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/30 text-xs mb-2 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/30 text-xs mb-2 uppercase tracking-wider">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(6,182,212,0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-bold text-sm shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all"
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.span key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      ✓ Sent!
                    </motion.span>
                  ) : (
                    <motion.span key="send" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Send size={15} /> Send Message
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </GlassCard>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div variants={fadeUp} custom={2} className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white/20 text-sm">
            © {new Date().getFullYear()} {personal.name ?? "Portfolio"}. All rights reserved.
          </span>
          <span className="text-white/20 text-xs">Built with Career Pilot</span>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── ROOT EXPORT ─────────────────────────────────────────────────────────────
export default function FloatingDock() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((n) => n.id);
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3, rootMargin: "-10% 0px -40% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="min-h-screen bg-[#060810] text-white font-sans antialiased overflow-x-hidden">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
      />

      <div className="relative z-10">
        <Hero />
        <Section id="stats-bar" className="relative">
          <StatsBar />
        </Section>
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
      </div>

      <FloatingNav activeSection={activeSection} />
    </div>
  );
}
