import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Github, Linkedin, Twitter, Mail, MapPin,
  ExternalLink, Briefcase, Code2, Star, Send,
  ChevronDown, Award, Users, Layers, Zap,
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

// ─── Palette ────────────────────────────────────────────────────────────────
const c = {
  bg:       "#0a0a0f",
  bgAlt:    "#0f0f18",
  card1:    "#12121e",
  card2:    "#1a1a2e",
  card3:    "#16213e",
  accent:   "#7c3aed",
  accentLt: "#a78bfa",
  accentDim:"#3b1f7a",
  gold:     "#f59e0b",
  text:     "#f1f0ff",
  muted:    "#8b8aad",
  border:   "#2a2a4a",
  glow:     "rgba(124,58,237,0.35)",
  glow2:    "rgba(124,58,237,0.12)",
};

const layeredShadow = () =>
  `4px 4px 0px ${c.accentDim}, 8px 8px 0px ${c.card2}, 12px 12px 0px ${c.card3}, 0 24px 60px rgba(0,0,0,0.7), 0 0 40px ${c.glow2}`;

const hoverShadow = () =>
  `6px 6px 0px ${c.accent}, 12px 12px 0px ${c.accentDim}, 18px 18px 0px ${c.card2}, 0 32px 80px rgba(0,0,0,0.8), 0 0 60px ${c.glow}`;

// ─── Reusable LayeredCard — uses whileHover, no onHoverStart ────────────────
const LayeredCard = ({ children, className = "", delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    whileHover={{
      y: -6,
      x: -3,
      boxShadow: hoverShadow(),
      transition: { duration: 0.25 },
    }}
    className={`rounded-2xl p-6 relative ${className}`}
    style={{
      background: c.card1,
      border: `1px solid ${c.border}`,
      boxShadow: layeredShadow(),
      ...style,
    }}
  >
    {children}
  </motion.div>
);

// ─── Floating particles ──────────────────────────────────────────────────────
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ background: c.accent, ...style }}
    animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1], scale: [1, 1.4, 1] }}
    transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
  />
);

const ParticleField = () => (
  <>
    {Array.from({ length: 20 }).map((_, i) => (
      <Particle
        key={i}
        style={{
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: 0.15,
        }}
      />
    ))}
  </>
);

// ─── Section heading ─────────────────────────────────────────────────────────
const SectionHeading = ({ icon: Icon, label, title }) => (
  <motion.div
    className="text-center mb-16"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
  >
    <div
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-xs font-bold tracking-[0.25em] uppercase"
      style={{
        background: c.accentDim,
        border: `1px solid ${c.accent}`,
        color: c.accentLt,
        boxShadow: `0 0 20px ${c.glow}`,
      }}
    >
      <Icon size={13} />
      {label}
    </div>
    <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: c.text }}>
      {title.split(" ").map((word, i, arr) => (
        <span key={i}>
          {i === arr.length - 1
            ? <span style={{ color: c.accentLt }}>{word}</span>
            : word + " "}
        </span>
      ))}
    </h2>
    <div className="flex items-center justify-center gap-3 mt-4">
      <div className="h-px w-20" style={{ background: `linear-gradient(to right, transparent, ${c.accent})` }} />
      <div className="w-2 h-2 rounded-full" style={{ background: c.accent, boxShadow: `0 0 8px ${c.accent}` }} />
      <div className="h-px w-20" style={{ background: `linear-gradient(to left, transparent, ${c.accent})` }} />
    </div>
  </motion.div>
);

// ─── NAV ─────────────────────────────────────────────────────────────────────
const Nav = () => {
  const links = ["about", "skills", "projects", "experience", "testimonials", "contact"];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10,10,15,0.95)" : "rgba(10,10,15,0.5)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? c.border : "transparent"}`,
        boxShadow: scrolled ? `0 4px 40px rgba(0,0,0,0.6), 0 0 20px ${c.glow2}` : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-black text-xl tracking-tight"
          style={{ color: c.text }}
        >
          {data.personal.name.split(" ")[0]}
          <span style={{ color: c.accent }}>_</span>
        </motion.div>
        <div className="hidden md:flex items-center gap-1">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{
                color: c.accentLt,
                backgroundColor: c.accentDim,
                boxShadow: `0 0 12px ${c.glow}`,
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors duration-200"
              style={{ color: c.muted }}
            >
              {link}
            </motion.a>
          ))}
        </div>
      </div>
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { personal, socials, stats } = data;
  const socialLinks = [
    { icon: Github, href: socials.github, label: "GitHub" },
    { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: socials.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
  ];
  const statItems = [
    { label: "Years Exp.", value: `${stats.yearsExperience}+` },
    { label: "Projects", value: `${stats.projectsCompleted}+` },
    { label: "Clients", value: `${stats.happyClients}+` },
  ];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 30% 50%, #1a0a2e 0%, ${c.bg} 60%)` }}
    >
      <ParticleField />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)`, filter: "blur(40px)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `linear-gradient(${c.accent} 1px, transparent 1px), linear-gradient(90deg, ${c.accent} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

      <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold"
            style={{ background: c.accentDim, border: `1px solid ${c.accent}`, color: c.accentLt, boxShadow: `0 0 16px ${c.glow}` }}
          >
            <MapPin size={12} /> {personal.location}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-7xl font-black leading-none mb-4 tracking-tighter"
            style={{ color: c.text }}
          >
            {personal.name.split(" ").map((word, i) => (
              <span key={i} className="block">
                {i === 1
                  ? <span style={{ color: c.accentLt, textShadow: `0 0 40px ${c.glow}` }}>{word}</span>
                  : word}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-8 h-0.5" style={{ background: c.accent }} />
            <p className="text-sm font-semibold tracking-wide" style={{ color: c.accentLt }}>{personal.title}</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm leading-relaxed mb-10 max-w-md"
            style={{ color: c.muted }}
          >
            {personal.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-3 mb-10"
          >
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={{ y: -4, scale: 1.1, color: c.accentLt, borderColor: c.accent, boxShadow: hoverShadow() }}
                whileTap={{ scale: 0.9 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: c.card1,
                  border: `1px solid ${c.border}`,
                  color: c.muted,
                  boxShadow: layeredShadow(),
                }}
              >
                <Icon size={17} />
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, ${c.accent}, #9333ea)`,
                color: "#fff",
                boxShadow: `0 4px 24px ${c.glow}, 6px 6px 0 ${c.accentDim}`,
              }}
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl font-bold text-sm"
              style={{
                background: "transparent",
                border: `1.5px solid ${c.accent}`,
                color: c.accentLt,
                boxShadow: `6px 6px 0 ${c.accentDim}`,
              }}
            >
              Contact Me
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl translate-x-4 translate-y-4"
              style={{ background: c.accentDim, filter: "blur(2px)" }} />
            <div className="absolute inset-0 rounded-2xl translate-x-2 translate-y-2"
              style={{ background: c.card2 }} />
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{ border: `2px solid ${c.accent}`, boxShadow: `0 0 40px ${c.glow}` }}
              animate={{ boxShadow: [`0 0 30px ${c.glow}`, `0 0 60px ${c.glow}`, `0 0 30px ${c.glow}`] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <img src={personal.avatar} alt={personal.name}
                className="w-64 h-64 md:w-72 md:h-72 object-cover" />
              <div className="absolute inset-0"
                style={{ background: `linear-gradient(to top, ${c.bg}cc, transparent 60%)` }} />
            </motion.div>
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded"
              style={{ background: c.accent, boxShadow: `0 0 12px ${c.accent}` }} />
            <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded"
              style={{ background: c.gold, boxShadow: `0 0 10px ${c.gold}` }} />
          </div>

          <div className="grid grid-cols-3 gap-4 w-full">
            {statItems.map(({ label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -4, x: -2, boxShadow: hoverShadow() }}
                className="rounded-xl p-4 text-center"
                style={{
                  background: c.card1,
                  border: `1px solid ${c.border}`,
                  boxShadow: `4px 4px 0 ${c.accentDim}, 8px 8px 0 ${c.card2}`,
                }}
              >
                <p className="text-2xl font-black" style={{ color: c.accentLt, textShadow: `0 0 20px ${c.glow}` }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: c.muted }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ color: c.muted }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
};

// ─── ABOUT ───────────────────────────────────────────────────────────────────
const About = () => {
  const { personal, stats } = data;
  const capabilities = [
    { icon: Award, label: `${stats.yearsExperience}+ Years Experience` },
    { icon: Code2, label: "Full Stack Dev" },
    { icon: Zap, label: "Open Source Lover" },
    { icon: Layers, label: "UI/UX Enthusiast" },
  ];

  return (
    <section id="about" className="py-28 px-6 scroll-mt-20 relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${c.bg} 0%, ${c.bgAlt} 100%)` }}>
      <div className="absolute top-0 left-0 w-full h-px"
        style={{ background: `linear-gradient(to right, transparent, ${c.accent}, transparent)` }} />
      <div className="max-w-5xl mx-auto">
        <SectionHeading icon={Users} label="About Me" title="Who I Am" />
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <LayeredCard delay={0.1}>
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full translate-x-3 translate-y-3"
                  style={{ background: c.accentDim }} />
                <img src={personal.avatar} alt={personal.name}
                  className="relative w-32 h-32 rounded-full object-cover"
                  style={{ border: `2px solid ${c.accent}`, boxShadow: `0 0 24px ${c.glow}` }} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black" style={{ color: c.text }}>{personal.name}</h3>
                <p className="text-sm mt-1 font-semibold" style={{ color: c.accentLt }}>{personal.title}</p>
                <p className="text-xs mt-1 flex items-center justify-center gap-1" style={{ color: c.muted }}>
                  <MapPin size={11} /> {personal.location}
                </p>
              </div>
              <div className="w-full h-px"
                style={{ background: `linear-gradient(to right, transparent, ${c.border}, transparent)` }} />
              <p className="text-sm leading-relaxed text-center" style={{ color: c.muted }}>{personal.bio}</p>
            </div>
          </LayeredCard>

          <div className="grid grid-cols-2 gap-4">
            {capabilities.map(({ icon: Icon, label }, i) => (
              <LayeredCard key={label} delay={0.15 + i * 0.08} className="!p-4">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: c.accentDim, border: `1px solid ${c.accent}`, boxShadow: `0 0 16px ${c.glow2}` }}>
                    <Icon size={20} style={{ color: c.accentLt }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: c.text }}>{label}</span>
                </div>
              </LayeredCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── SKILLS ──────────────────────────────────────────────────────────────────
const Skills = () => {
  const { skills } = data;
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="py-28 px-6 scroll-mt-20" style={{ background: c.bgAlt }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading icon={Code2} label="Skills" title="What I Master" />
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((cat, ci) => (
            <LayeredCard key={cat} delay={ci * 0.1}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-5 rounded-full"
                  style={{ background: c.accent, boxShadow: `0 0 8px ${c.accent}` }} />
                <h3 className="text-xs font-black tracking-widest uppercase" style={{ color: c.accentLt }}>{cat}</h3>
              </div>
              <div className="space-y-5">
                {skills.filter((s) => s.category === cat).map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold" style={{ color: c.text }}>{skill.name}</span>
                      <span className="text-xs font-bold" style={{ color: c.accentLt }}>{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden"
                      style={{ background: c.card2, border: `1px solid ${c.border}` }}>
                      <motion.div
                        className="h-full rounded-full relative"
                        style={{ background: `linear-gradient(90deg, ${c.accentDim}, ${c.accent}, ${c.accentLt})` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.07, ease: "easeOut" }}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-2 rounded-full"
                          style={{ background: c.accentLt, filter: "blur(1px)" }} />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </LayeredCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PROJECTS ────────────────────────────────────────────────────────────────
const Projects = () => {
  const { projects } = data;
  return (
    <section id="projects" className="py-28 px-6 scroll-mt-20"
      style={{ background: `linear-gradient(180deg, ${c.bgAlt} 0%, ${c.bg} 100%)` }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading icon={Layers} label="Projects" title="Things I've Built" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -8, x: -4, boxShadow: hoverShadow(), transition: { duration: 0.2 } }}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: c.card1,
                border: `1px solid ${c.border}`,
                boxShadow: layeredShadow(),
              }}
            >
              <div className="relative overflow-hidden h-44">
                <img src={project.image} alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${c.card1}, transparent 60%)` }} />
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full"
                  style={{ background: c.accent, boxShadow: `0 0 8px ${c.accent}` }} />
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="font-black text-base" style={{ color: c.text }}>{project.title}</h3>
                <p className="text-xs leading-relaxed flex-1" style={{ color: c.muted }}>{project.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                      style={{ background: c.accentDim, color: c.accentLt, border: `1px solid ${c.accent}33` }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 pt-1">
                  <motion.a href={project.liveUrl} target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-bold"
                    style={{ background: `linear-gradient(135deg, ${c.accent}, #9333ea)`, color: "#fff", boxShadow: `0 0 12px ${c.glow}` }}>
                    <ExternalLink size={11} /> Live
                  </motion.a>
                  <motion.a href={project.githubUrl} target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl font-bold"
                    style={{ background: "transparent", border: `1px solid ${c.accent}`, color: c.accentLt }}>
                    <Github size={11} /> Code
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────
const Experience = () => {
  const { experience } = data;
  return (
    <section id="experience" className="py-28 px-6 scroll-mt-20" style={{ background: c.bg }}>
      <div className="max-w-3xl mx-auto">
        <SectionHeading icon={Briefcase} label="Experience" title="Where I've Worked" />
        <div className="space-y-6">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex gap-5"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-5 h-5 rounded-full shrink-0 mt-1 flex items-center justify-center"
                  style={{ background: c.accent, boxShadow: `0 0 16px ${c.glow}, 0 0 0 4px ${c.accentDim}` }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </motion.div>
                {i < experience.length - 1 && (
                  <motion.div
                    className="w-0.5 flex-1 mt-2"
                    style={{ background: `linear-gradient(to bottom, ${c.accent}, transparent)` }}
                    initial={{ scaleY: 0, originY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                  />
                )}
              </div>
              <LayeredCard className="flex-1 mb-2 !p-5" delay={i * 0.1}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-black" style={{ color: c.text }}>{exp.role}</h3>
                    <p className="text-sm font-bold" style={{ color: c.accentLt }}>{exp.company}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-lg font-semibold self-start"
                    style={{ background: c.accentDim, color: c.accentLt, border: `1px solid ${c.accent}44` }}>
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>{exp.description}</p>
              </LayeredCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
const Testimonials = () => {
  const { testimonials } = data;
  return (
    <section id="testimonials" className="py-28 px-6 scroll-mt-20"
      style={{ background: `linear-gradient(180deg, ${c.bg} 0%, ${c.bgAlt} 100%)` }}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading icon={Star} label="Testimonials" title="What They Say" />
        <div className="grid sm:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <LayeredCard key={t.name} delay={i * 0.1}>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, si) => (
                  <Star key={si} size={13} style={{ color: c.gold, fill: c.gold }} />
                ))}
              </div>
              <div className="text-4xl font-black leading-none mb-3"
                style={{ color: c.accent, textShadow: `0 0 20px ${c.glow}` }}>"</div>
              <p className="text-sm leading-relaxed italic mb-5" style={{ color: c.muted }}>"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4"
                style={{ borderTop: `1px solid ${c.border}` }}>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full translate-x-1 translate-y-1"
                    style={{ background: c.accentDim }} />
                  <img src={t.avatar} alt={t.name}
                    className="relative w-11 h-11 rounded-full object-cover"
                    style={{ border: `2px solid ${c.accent}` }} />
                </div>
                <div>
                  <p className="font-black text-sm" style={{ color: c.text }}>{t.name}</p>
                  <p className="text-xs" style={{ color: c.accentLt }}>{t.role}</p>
                </div>
              </div>
            </LayeredCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── CONTACT ─────────────────────────────────────────────────────────────────
const Contact = () => {
  const { socials, personal } = data;

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements["name"].value;
    const email = e.target.elements["email"].value;
    const message = e.target.elements["message"].value;
    const body = `${message}\n\nFrom: ${email}`;
    window.location.href = `mailto:${socials.email}?subject=${encodeURIComponent(`Message from ${name}`)}&body=${encodeURIComponent(body)}`;
  };

  const inputStyle = {
    background: c.card2,
    border: `1px solid ${c.border}`,
    color: c.text,
    borderRadius: "12px",
    padding: "14px 20px",
    width: "100%",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <section id="contact" className="py-28 px-6 scroll-mt-20 relative overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 70% 50%, #1a0a2e 0%, ${c.bgAlt} 60%)` }}>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`, filter: "blur(60px)" }} />
      <div className="max-w-2xl mx-auto relative z-10">
        <SectionHeading icon={Send} label="Contact" title="Let's Connect" />
        <LayeredCard delay={0.1} className="!p-8">
          <p className="text-sm text-center leading-relaxed mb-7" style={{ color: c.muted }}>
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider"
                style={{ color: c.accentLt }}>Your Name</label>
              <input id="name" name="name" type="text" placeholder="John Doe" required aria-label="Your Name"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = c.accent; e.target.style.boxShadow = `0 0 16px ${c.glow}`; }}
                onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider"
                style={{ color: c.accentLt }}>Your Email</label>
              <input id="email" name="email" type="email" placeholder="john@example.com" required aria-label="Your Email"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = c.accent; e.target.style.boxShadow = `0 0 16px ${c.glow}`; }}
                onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-bold mb-1.5 ml-1 uppercase tracking-wider"
                style={{ color: c.accentLt }}>Your Message</label>
              <textarea id="message" name="message" rows={4} placeholder="Tell me about your project..." required aria-label="Your Message"
                style={{ ...inputStyle, resize: "none" }}
                onFocus={e => { e.target.style.borderColor = c.accent; e.target.style.boxShadow = `0 0 16px ${c.glow}`; }}
                onBlur={e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = "none"; }}
              />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${c.accent}, #9333ea)`,
                color: "#fff",
                boxShadow: `0 4px 24px ${c.glow}, 4px 4px 0 ${c.accentDim}`,
              }}>
              <Send size={15} /> Send Message
            </motion.button>
          </form>

          <div className="flex justify-center gap-4 mt-7 pt-6"
            style={{ borderTop: `1px solid ${c.border}` }}>
            {[
              { icon: Github, href: socials.github, label: "GitHub" },
              { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
              { icon: Twitter, href: socials.twitter, label: "Twitter" },
              { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                whileHover={{ scale: 1.2, y: -4, color: c.accentLt, borderColor: c.accent }}
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: c.card2,
                  border: `1px solid ${c.border}`,
                  color: c.muted,
                  boxShadow: `4px 4px 0 ${c.accentDim}`,
                }}>
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </LayeredCard>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs mt-8"
          style={{ color: c.muted }}
        >
          © {new Date().getFullYear()} {personal.name} · Built with shadows & soul
        </motion.p>
      </div>
    </section>
  );
};

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function ShadowLayers() {
  return (
    <div className="min-h-screen font-sans" style={{ background: c.bg }}>
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
    </div>
  );
}