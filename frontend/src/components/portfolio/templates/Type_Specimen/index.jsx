import { usePortfolio } from "../../../../context/PortfolioContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Github, Linkedin, Twitter, Mail, MapPin,
  ExternalLink, Briefcase, Code2, Star, Send,
  ChevronDown, Award, Users, Layers, ArrowRight,
} from "lucide-react";

// ─── Palette ────────────────────────────────────────────────────────────────
const c = {
  bg:      "#fafaf8",
  bgAlt:   "#f5f4f0",
  text:    "#111110",
  muted:   "#6b6b63",
  border:  "#d4d3ce",
  accent:  "#111110",
  accentR: "#c8321a",
  white:   "#ffffff",
};

// ─── Fade up preset ──────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

// ─── Ruled line ──────────────────────────────────────────────────────────────
const Rule = ({ thick = false, className = "" }) => (
  <div
    className={`w-full ${className}`}
    style={{ height: thick ? "2px" : "1px", background: c.border }}
  />
);

// ─── Section label (specimen tag) ────────────────────────────────────────────
const SpecimenTag = ({ children }) => (
  <span
    className="text-xs font-bold tracking-[0.3em] uppercase"
    style={{ color: c.muted }}
  >
    {children}
  </span>
);

// ─── NAV ─────────────────────────────────────────────────────────────────────
const Nav = () => {
  const { portfolioData: data } = usePortfolio();

  const links = ["about", "skills", "projects", "experience", "testimonials", "contact"];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(250,250,248,0.96)" : "rgba(250,250,248,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${scrolled ? c.border : "transparent"}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-black text-sm tracking-[0.15em] uppercase"
          style={{ color: c.text }}
        >
          {data.personal.name.split(" ")[0]}
          <span style={{ color: c.accentR }}>.</span>
        </motion.span>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-200 hover:opacity-60"
              style={{ color: c.muted }}
            >
              {link}
            </motion.a>
          ))}
        </div>

        <motion.a
          href="#contact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.04 }}
          className="hidden md:flex items-center gap-2 px-5 py-2 text-xs font-bold tracking-widest uppercase"
          style={{
            background: c.text,
            color: c.white,
            borderRadius: "2px",
          }}
        >
          Hire Me <ArrowRight size={12} />
        </motion.a>
      </div>
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { portfolioData: data } = usePortfolio();

  const { personal, socials, stats } = data;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

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

  // Split name for giant letter display
  const nameParts = personal.name.split(" ");

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: c.bg }}>
      {/* Top rule */}
      <Rule thick />

      {/* Specimen header row */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <SpecimenTag>Type Specimen — Portfolio No. 01</SpecimenTag>
        <SpecimenTag>{personal.location}</SpecimenTag>
      </div>
      <Rule />

      {/* Giant name block */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 overflow-hidden">
        <motion.div style={{ y }}>
          {nameParts.map((part, i) => (
            <motion.div
              key={part}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="leading-none font-black tracking-tighter select-none"
              style={{
                fontSize: "clamp(5rem, 18vw, 16rem)",
                color: i === 0 ? c.text : "transparent",
                WebkitTextStroke: i === 0 ? "0px" : `2px ${c.text}`,
                lineHeight: 0.88,
              }}
            >
              {part}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Rule />

      {/* Info row */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Title */}
        <motion.div {...fadeUp(0)} className="flex flex-col gap-2">
          <SpecimenTag>Role</SpecimenTag>
          <p className="text-lg font-bold leading-snug" style={{ color: c.text }}>
            {personal.title}
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.div {...fadeUp(0.1)} className="flex flex-col gap-2">
          <SpecimenTag>Tagline</SpecimenTag>
          <p className="text-base leading-relaxed" style={{ color: c.muted }}>
            {personal.tagline}
          </p>
        </motion.div>

        {/* Socials */}
        <motion.div {...fadeUp(0.2)} className="flex flex-col gap-3">
          <SpecimenTag>Find Me</SpecimenTag>
          <div className="flex gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 flex items-center justify-center border transition-colors duration-200"
                style={{ borderColor: c.border, color: c.muted, borderRadius: "2px" }}
                onMouseEnter={e => { e.currentTarget.style.background = c.text; e.currentTarget.style.color = c.white; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}
              >
                <Icon size={15} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <Rule />

      {/* Stats row */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-6">
        {statItems.map(({ label, value }, i) => (
          <motion.div key={label} {...fadeUp(i * 0.08)} className="flex flex-col gap-1">
            <span
              className="font-black leading-none"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: c.text }}
            >
              {value}
            </span>
            <SpecimenTag>{label}</SpecimenTag>
          </motion.div>
        ))}
      </div>

      <Rule thick />

      {/* Scroll hint */}
      <motion.div
        className="flex items-center justify-center gap-2 py-4"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ color: c.muted }}
      >
        <ChevronDown size={16} />
        <SpecimenTag>Scroll to explore</SpecimenTag>
      </motion.div>
    </section>
  );
};

// ─── ABOUT ───────────────────────────────────────────────────────────────────
const About = () => {
  const { portfolioData: data } = usePortfolio();

  const { personal, stats } = data;

  const capabilities = [
    { label: `${stats.yearsExperience}+ Yrs`, sub: "Experience" },
    { label: "Full Stack", sub: "Developer" },
    { label: "Open Src", sub: "Contributor" },
    { label: "UI / UX", sub: "Enthusiast" },
  ];

  return (
    <section id="about" className="scroll-mt-20" style={{ background: c.bgAlt }}>
      <Rule thick />
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SpecimenTag>Section 01 — About</SpecimenTag>
        <SpecimenTag>Bio & Profile</SpecimenTag>
      </div>
      <Rule />

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-16 items-start">
        {/* Left — giant A */}
        <motion.div {...fadeUp(0)} className="relative">
          <div
            className="absolute -top-6 -left-4 font-black leading-none select-none pointer-events-none opacity-[0.06]"
            style={{ fontSize: "clamp(8rem, 22vw, 18rem)", color: c.text, lineHeight: 1 }}
          >
            A
          </div>
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-start gap-6">
              <div className="relative shrink-0">
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-32 h-32 object-cover grayscale"
                  style={{ border: `2px solid ${c.border}` }}
                />
                <div
                  className="absolute -bottom-2 -right-2 w-6 h-6"
                  style={{ background: c.accentR }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-black leading-tight" style={{ color: c.text }}>
                  {personal.name}
                </h2>
                <p className="text-sm mt-1 font-semibold tracking-wide" style={{ color: c.muted }}>
                  {personal.title}
                </p>
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: c.muted }}>
                  <MapPin size={11} /> {personal.location}
                </p>
              </div>
            </div>
            <Rule />
            <p className="text-base leading-relaxed" style={{ color: c.muted }}>
              {personal.bio}
            </p>
          </div>
        </motion.div>

        {/* Right — capabilities as type specimens */}
        <motion.div {...fadeUp(0.15)} className="flex flex-col gap-0">
          <SpecimenTag>Capabilities</SpecimenTag>
          <div className="mt-4 flex flex-col gap-0">
            {capabilities.map(({ label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="py-4 flex items-baseline justify-between group cursor-default"
                style={{ borderBottom: `1px solid ${c.border}` }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
              >
                <span
                  className="font-black tracking-tighter leading-none group-hover:text-red-600 transition-colors"
                  style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: c.text }}
                >
                  {label}
                </span>
                <SpecimenTag>{sub}</SpecimenTag>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Rule thick />
    </section>
  );
};

// ─── SKILLS ──────────────────────────────────────────────────────────────────
const Skills = () => {
  const { portfolioData: data } = usePortfolio();

  const { skills } = data;
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="scroll-mt-20" style={{ background: c.bg }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SpecimenTag>Section 02 — Skills</SpecimenTag>
        <SpecimenTag>Proficiency Index</SpecimenTag>
      </div>
      <Rule />

      {/* Giant decorative word */}
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-black tracking-tighter leading-none select-none opacity-[0.04]"
          style={{ fontSize: "clamp(5rem, 20vw, 14rem)", color: c.text }}
        >
          SKILLS
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12 -mt-4 grid md:grid-cols-2 gap-12">
        {categories.map((cat, ci) => (
          <motion.div key={cat} {...fadeUp(ci * 0.1)}>
            <div className="flex items-center justify-between mb-5">
              <SpecimenTag>{cat}</SpecimenTag>
              <SpecimenTag>{skills.filter(s => s.category === cat).length} skills</SpecimenTag>
            </div>
            <Rule />
            <div className="mt-4 space-y-5">
              {skills.filter((s) => s.category === cat).map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span
                      className="font-bold tracking-tight"
                      style={{ fontSize: "clamp(1rem, 2.5vw, 1.4rem)", color: c.text }}
                    >
                      {skill.name}
                    </span>
                    <span className="text-xs font-bold tabular-nums" style={{ color: c.muted }}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="h-1 w-full" style={{ background: c.border }}>
                    <motion.div
                      className="h-full"
                      style={{ background: c.text }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.06, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <Rule thick />
    </section>
  );
};

// ─── PROJECTS ────────────────────────────────────────────────────────────────
const Projects = () => {
  const { portfolioData: data } = usePortfolio();

  const { projects } = data;

  return (
    <section id="projects" className="scroll-mt-20" style={{ background: c.bgAlt }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SpecimenTag>Section 03 — Projects</SpecimenTag>
        <SpecimenTag>{projects.length} works</SpecimenTag>
      </div>
      <Rule />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.6 }}
          >
            <div
              className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 group cursor-default"
              style={{ borderBottom: `1px solid ${c.border}` }}
            >
              {/* Index number */}
              <div className="md:col-span-1 flex items-start">
                <span className="text-xs font-bold tabular-nums" style={{ color: c.muted }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title — big */}
              <div className="md:col-span-4">
                <motion.h3
                  className="font-black tracking-tighter leading-tight group-hover:translate-x-2 transition-transform duration-200"
                  style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: c.text }}
                >
                  {project.title}
                </motion.h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-semibold tracking-wide uppercase px-2 py-0.5"
                      style={{ background: c.border, color: c.muted }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-4">
                <p className="text-sm leading-relaxed" style={{ color: c.muted }}>
                  {project.description}
                </p>
              </div>

              {/* Image + links */}
              <div className="md:col-span-3 flex flex-col gap-3 items-end">
                <div className="overflow-hidden w-full" style={{ maxWidth: "180px" }}>
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-24 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    style={{ border: `1px solid ${c.border}` }}
                  />
                </div>
                <div className="flex gap-3">
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase px-3 py-1.5"
                    style={{ background: c.text, color: c.white, borderRadius: "2px" }}
                  >
                    <ExternalLink size={10} /> Live
                  </motion.a>
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase px-3 py-1.5"
                    style={{ border: `1px solid ${c.text}`, color: c.text, borderRadius: "2px" }}
                  >
                    <Github size={10} /> Code
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Rule thick />
    </section>
  );
};

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────
const Experience = () => {
  const { portfolioData: data } = usePortfolio();

  const { experience } = data;

  return (
    <section id="experience" className="scroll-mt-20" style={{ background: c.bg }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SpecimenTag>Section 04 — Experience</SpecimenTag>
        <SpecimenTag>{experience.length} positions</SpecimenTag>
      </div>
      <Rule />

      {/* Big decorative word */}
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-black tracking-tighter select-none opacity-[0.04]"
          style={{ fontSize: "clamp(4rem, 16vw, 12rem)", color: c.text, lineHeight: 1 }}
        >
          WORK
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12 -mt-2 space-y-0">
        {experience.map((exp, i) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6"
            style={{ borderBottom: `1px solid ${c.border}` }}
          >
            {/* Period */}
            <div className="md:col-span-3">
              <SpecimenTag>{exp.period}</SpecimenTag>
            </div>

            {/* Role — big */}
            <div className="md:col-span-4">
              <h3
                className="font-black tracking-tight leading-tight"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", color: c.text }}
              >
                {exp.role}
              </h3>
              <p
                className="text-sm font-bold mt-1 tracking-wide"
                style={{ color: c.accentR }}
              >
                {exp.company}
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-5">
              <p className="text-sm leading-relaxed" style={{ color: c.muted }}>
                {exp.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <Rule thick />
    </section>
  );
};

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────
const Testimonials = () => {
  const { portfolioData: data } = usePortfolio();

  const { testimonials } = data;

  return (
    <section id="testimonials" className="scroll-mt-20" style={{ background: c.bgAlt }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SpecimenTag>Section 05 — Testimonials</SpecimenTag>
        <SpecimenTag>{testimonials.length} voices</SpecimenTag>
      </div>
      <Rule />

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-0">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            {...fadeUp(i * 0.1)}
            className="p-8 flex flex-col gap-6"
            style={{
              borderRight: i % 2 === 0 ? `1px solid ${c.border}` : "none",
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            {/* Giant quote mark */}
            <div
              className="font-black leading-none select-none"
              style={{ fontSize: "6rem", color: c.text, opacity: 0.08, lineHeight: 1 }}
            >
              "
            </div>
            <p
              className="text-base leading-relaxed font-medium italic -mt-8"
              style={{ color: c.text }}
            >
              "{t.text}"
            </p>
            <Rule />
            <div className="flex items-center gap-4">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 object-cover grayscale"
                style={{ border: `1px solid ${c.border}` }}
              />
              <div>
                <p className="font-black text-sm" style={{ color: c.text }}>{t.name}</p>
                <SpecimenTag>{t.role}</SpecimenTag>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Rule thick />
    </section>
  );
};

// ─── CONTACT ─────────────────────────────────────────────────────────────────
const Contact = () => {
  const { portfolioData: data } = usePortfolio();

  const { socials, personal } = data;

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements["name"].value;
    const email = e.target.elements["email"].value;
    const message = e.target.elements["message"].value;
    window.location.href = `mailto:${socials.email}?subject=${encodeURIComponent(`Message from ${name}`)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
  };

  const inputClass = `w-full px-0 py-3 text-sm font-medium outline-none bg-transparent border-b transition-colors duration-200`;
  const inputStyle = { borderColor: c.border, color: c.text };

  return (
    <section id="contact" className="scroll-mt-20" style={{ background: c.bg }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SpecimenTag>Section 06 — Contact</SpecimenTag>
        <SpecimenTag>Get In Touch</SpecimenTag>
      </div>
      <Rule />

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-16 items-start">
        {/* Left — big text */}
        <motion.div {...fadeUp(0)}>
          <div
            className="font-black tracking-tighter leading-none select-none"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)", color: c.text }}
          >
            Let's
          </div>
          <div
            className="font-black tracking-tighter leading-none select-none"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              color: "transparent",
              WebkitTextStroke: `2px ${c.text}`,
            }}
          >
            Talk.
          </div>
          <div className="mt-8 space-y-2">
            <p className="text-sm" style={{ color: c.muted }}>{socials.email}</p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: Github, href: socials.github, label: "GitHub" },
                { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
                { icon: Twitter, href: socials.twitter, label: "Twitter" },
                { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15 }}
                  className="w-9 h-9 flex items-center justify-center border transition-all duration-200"
                  style={{ borderColor: c.border, color: c.muted, borderRadius: "2px" }}
                  onMouseEnter={e => { e.currentTarget.style.background = c.text; e.currentTarget.style.color = c.white; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div {...fadeUp(0.15)}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-xs font-bold tracking-[0.2em] uppercase mb-3"
                style={{ color: c.muted }}>
                Your Name
              </label>
              <input
                id="name" name="name" type="text"
                placeholder="John Doe" required aria-label="Your Name"
                className={inputClass}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = c.text}
                onBlur={e => e.target.style.borderColor = c.border}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold tracking-[0.2em] uppercase mb-3"
                style={{ color: c.muted }}>
                Your Email
              </label>
              <input
                id="email" name="email" type="email"
                placeholder="john@example.com" required aria-label="Your Email"
                className={inputClass}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = c.text}
                onBlur={e => e.target.style.borderColor = c.border}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-bold tracking-[0.2em] uppercase mb-3"
                style={{ color: c.muted }}>
                Your Message
              </label>
              <textarea
                id="message" name="message" rows={4}
                placeholder="Tell me about your project..." required aria-label="Your Message"
                className={inputClass + " resize-none"}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = c.text}
                onBlur={e => e.target.style.borderColor = c.border}
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2"
              style={{ background: c.text, color: c.white, borderRadius: "2px" }}
            >
              <Send size={14} /> Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Rule thick />

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <SpecimenTag>© {new Date().getFullYear()} {personal.name}</SpecimenTag>
        <SpecimenTag>Type Specimen Portfolio</SpecimenTag>
      </div>
    </section>
  );
};

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function TypeSpecimen() {
  const { portfolioData: data } = usePortfolio();

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