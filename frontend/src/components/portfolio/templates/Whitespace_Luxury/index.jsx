import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Github, Linkedin, Twitter, Mail, MapPin,
  ExternalLink, Briefcase, Code2, Star, Send,
  ChevronDown, Award, Users, Layers, ArrowUpRight,
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

// ─── Palette ────────────────────────────────────────────────────────────────
const c = {
  bg:      "#ffffff",
  bgAlt:   "#fafaf9",
  bgDeep:  "#f5f4f1",
  text:    "#1a1a18",
  muted:   "#8c8c84",
  border:  "#e8e7e2",
  borderThin: "#d4d3ce",
  accent:  "#1a1a18",
  gold:    "#b8973a",
  goldLt:  "#d4b05a",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 1, delay },
});

// ─── Hairline rule ────────────────────────────────────────────────────────────
const HairRule = ({ className = "", vertical = false }) => (
  <div
    className={className}
    style={{
      [vertical ? "width" : "height"]: "1px",
      [vertical ? "height" : "width"]: "100%",
      background: c.border,
    }}
  />
);

// ─── Luxury label ─────────────────────────────────────────────────────────────
const LuxLabel = ({ children, className = "" }) => (
  <span
    className={`text-xs font-light tracking-[0.35em] uppercase ${className}`}
    style={{ color: c.muted, letterSpacing: "0.35em" }}
  >
    {children}
  </span>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ id, children, bg = c.bg, className = "" }) => (
  <section
    id={id}
    className={`scroll-mt-20 ${className}`}
    style={{ background: bg }}
  >
    {children}
  </section>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = () => {
  const links = ["about", "skills", "projects", "experience", "testimonials", "contact"];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? c.border : "transparent"}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <span
            className="font-serif text-base tracking-[0.12em]"
            style={{ color: c.text }}
          >
            {data.personal.name.split(" ")[0].toUpperCase()}
            <span style={{ color: c.gold }}>·</span>
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link, i) => (
            <motion.a
              key={link}
              href={`#${link}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 + 0.2 }}
              className="text-xs font-light tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-40"
              style={{ color: c.muted }}
            >
              {link}
            </motion.a>
          ))}
        </div>

        <motion.a
          href={`mailto:${data.socials.email}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="hidden md:flex items-center gap-2 text-xs font-light tracking-[0.2em] uppercase transition-all duration-300"
          style={{ color: c.gold }}
          whileHover={{ letterSpacing: "0.3em" }}
        >
          Contact <ArrowUpRight size={11} />
        </motion.a>
      </div>
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { personal, socials, stats } = data;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const socialLinks = [
    { icon: Github, href: socials.github, label: "GitHub" },
    { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: socials.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
  ];

  const statItems = [
    { label: "Years of Excellence", value: `${stats.yearsExperience}` },
    { label: "Works Completed", value: `${stats.projectsCompleted}` },
    { label: "Happy Clients", value: `${stats.happyClients}` },
  ];

  const nameParts = personal.name.split(" ");

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: c.bg }}>
      {/* Top hairline */}
      <div className="w-full h-px" style={{ background: c.gold, opacity: 0.6 }} />

      <div className="max-w-7xl mx-auto px-8">
        {/* Editorial header */}
        <div className="flex items-center justify-between py-5">
          <LuxLabel>Est. {new Date().getFullYear()} · Portfolio</LuxLabel>
          <div className="flex items-center gap-2">
            <MapPin size={10} style={{ color: c.muted }} />
            <LuxLabel>{personal.location}</LuxLabel>
          </div>
        </div>

        <HairRule />

        {/* Giant name */}
        <motion.div style={{ y: textY }} className="pt-16 pb-10">
          {nameParts.map((part, i) => (
            <motion.div
              key={part}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <span
                className="block font-serif leading-none tracking-[-0.02em]"
                style={{
                  fontSize: "clamp(4rem, 14vw, 12rem)",
                  color: i === 0 ? c.text : "transparent",
                  WebkitTextStroke: i === 0 ? "0" : `1px ${c.text}`,
                  lineHeight: 0.92,
                }}
              >
                {part}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <HairRule />

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 py-10">
          {/* Title */}
          <motion.div {...fadeUp(0)} className="pr-12 border-r" style={{ borderColor: c.border }}>
            <LuxLabel>Role</LuxLabel>
            <p className="font-serif text-xl mt-3 leading-snug" style={{ color: c.text }}>
              {personal.title}
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.div {...fadeUp(0.1)} className="px-12 border-r" style={{ borderColor: c.border }}>
            <LuxLabel>Philosophy</LuxLabel>
            <p className="text-sm font-light mt-3 leading-relaxed" style={{ color: c.muted }}>
              {personal.tagline}
            </p>
          </motion.div>

          {/* Socials */}
          <motion.div {...fadeUp(0.2)} className="pl-12">
            <LuxLabel>Connect</LuxLabel>
            <div className="flex gap-4 mt-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.2, color: c.gold }}
                  className="transition-all duration-300"
                  style={{ color: c.muted }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <HairRule />

        {/* Avatar + stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 py-16">
          {/* Avatar */}
          <motion.div
            {...fadeIn(0.3)}
            className="relative overflow-hidden pr-16"
          >
            <motion.div style={{ y: imgY }}>
              <img
                src={personal.avatar}
                alt={personal.name}
                className="w-full max-w-sm object-cover"
                style={{
                  aspectRatio: "3/4",
                  filter: "grayscale(20%)",
                  border: `1px solid ${c.border}`,
                }}
              />
            </motion.div>
            {/* Gold accent line */}
            <div
              className="absolute top-8 -left-0 w-px h-32"
              style={{ background: c.gold }}
            />
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUp(0.4)} className="flex flex-col justify-center gap-0 pl-8 border-l"
            style={{ borderColor: c.border }}>
            <LuxLabel className="mb-8">By the Numbers</LuxLabel>
            {statItems.map(({ label, value }, i) => (
              <div
                key={label}
                className="py-8"
                style={{ borderBottom: i < statItems.length - 1 ? `1px solid ${c.border}` : "none" }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.5, duration: 0.7 }}
                >
                  <span
                    className="block font-serif leading-none"
                    style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", color: c.text }}
                  >
                    {value}
                  </span>
                  <LuxLabel className="mt-2 block">{label}</LuxLabel>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="w-full h-px" style={{ background: c.gold, opacity: 0.6 }} />

      {/* Scroll cue */}
      <motion.div
        className="flex flex-col items-center gap-2 py-6"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        style={{ color: c.muted }}
      >
        <LuxLabel>Scroll</LuxLabel>
        <ChevronDown size={14} />
      </motion.div>
    </section>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────────────────
const About = () => {
  const { personal, stats } = data;

  const capabilities = [
    { value: `${stats.yearsExperience}+`, label: "Years of Experience" },
    { value: "Full Stack", label: "Development" },
    { value: "Open Source", label: "Contributor" },
    { value: "UI / UX", label: "Design Sensibility" },
  ];

  return (
    <Section id="about" bg={c.bgAlt}>
      <div className="w-full h-px" style={{ background: c.border }} />
      <div className="max-w-7xl mx-auto px-8">
        <div className="py-6 flex items-center justify-between">
          <LuxLabel>Chapter I — About</LuxLabel>
          <LuxLabel>The Person</LuxLabel>
        </div>
        <HairRule />

        <div className="grid md:grid-cols-2 gap-20 py-20">
          {/* Left */}
          <motion.div {...fadeUp(0)} className="flex flex-col gap-8">
            <div>
              <LuxLabel className="block mb-6">Profile</LuxLabel>
              <h2
                className="font-serif leading-tight"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: c.text }}
              >
                {personal.name}
              </h2>
              <p className="text-sm font-light mt-2 tracking-wide" style={{ color: c.gold }}>
                {personal.title}
              </p>
            </div>

            <HairRule />

            <p className="text-base font-light leading-[1.9]" style={{ color: c.muted }}>
              {personal.bio}
            </p>

            <HairRule />

            <div className="flex items-center gap-2">
              <MapPin size={12} style={{ color: c.gold }} />
              <LuxLabel>{personal.location}</LuxLabel>
            </div>
          </motion.div>

          {/* Right — capabilities */}
          <motion.div {...fadeUp(0.15)}>
            <LuxLabel className="block mb-8">Areas of Excellence</LuxLabel>
            <div className="flex flex-col gap-0">
              {capabilities.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  className="flex items-baseline justify-between py-6 cursor-default group"
                  style={{ borderBottom: `1px solid ${c.border}` }}
                >
                  <span
                    className="font-serif tracking-tight leading-none group-hover:text-amber-600 transition-colors duration-300"
                    style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)", color: c.text }}
                  >
                    {value}
                  </span>
                  <LuxLabel>{label}</LuxLabel>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-px" style={{ background: c.border }} />
    </Section>
  );
};

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const Skills = () => {
  const { skills } = data;
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <Section id="skills" bg={c.bg}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="py-6 flex items-center justify-between">
          <LuxLabel>Chapter II — Skills</LuxLabel>
          <LuxLabel>Proficiency</LuxLabel>
        </div>
        <HairRule />

        {/* Ghost watermark */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif tracking-tighter select-none"
            style={{
              fontSize: "clamp(5rem, 18vw, 14rem)",
              color: c.text,
              opacity: 0.03,
              lineHeight: 1,
            }}
          >
            SKILLS
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 pb-20 -mt-4">
          {categories.map((cat, ci) => (
            <motion.div key={cat} {...fadeUp(ci * 0.1)}>
              <div className="flex items-center justify-between mb-6">
                <LuxLabel>{cat}</LuxLabel>
                <LuxLabel>{skills.filter(s => s.category === cat).length} skills</LuxLabel>
              </div>
              <HairRule />
              <div className="mt-6 space-y-6">
                {skills.filter((s) => s.category === cat).map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex items-baseline justify-between mb-3">
                      <span
                        className="font-serif"
                        style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", color: c.text }}
                      >
                        {skill.name}
                      </span>
                      <LuxLabel>{skill.level}</LuxLabel>
                    </div>
                    <div className="h-px w-full" style={{ background: c.border }}>
                      <motion.div
                        className="h-px"
                        style={{ background: c.gold }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="w-full h-px" style={{ background: c.border }} />
    </Section>
  );
};

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const Projects = () => {
  const { projects } = data;

  return (
    <Section id="projects" bg={c.bgDeep}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="py-6 flex items-center justify-between">
          <LuxLabel>Chapter III — Projects</LuxLabel>
          <LuxLabel>{projects.length} Selected Works</LuxLabel>
        </div>
        <HairRule />

        <div className="py-16 space-y-0">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.7 }}
              className="group"
            >
              <div
                className="py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start cursor-default"
                style={{ borderBottom: `1px solid ${c.border}` }}
              >
                {/* Index */}
                <div className="md:col-span-1">
                  <LuxLabel>{String(i + 1).padStart(2, "0")}</LuxLabel>
                </div>

                {/* Title */}
                <div className="md:col-span-3">
                  <motion.h3
                    className="font-serif leading-tight group-hover:text-amber-700 transition-colors duration-300"
                    style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", color: c.text }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  >
                    {project.title}
                  </motion.h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-light tracking-widest"
                        style={{ color: c.muted }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-4">
                  <p className="text-sm font-light leading-relaxed" style={{ color: c.muted }}>
                    {project.description}
                  </p>
                </div>

                {/* Image + Links */}
                <div className="md:col-span-4 flex flex-col gap-4 items-end">
                  <div className="overflow-hidden w-full max-w-[200px]">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0"
                      style={{ aspectRatio: "4/3", border: `1px solid ${c.border}` }}
                    />
                  </div>
                  <div className="flex gap-4">
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-1.5 text-xs font-light tracking-[0.2em] uppercase"
                      style={{ color: c.gold }}
                    >
                      Live <ArrowUpRight size={11} />
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-1.5 text-xs font-light tracking-[0.2em] uppercase"
                      style={{ color: c.muted }}
                    >
                      Code <Github size={11} />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="w-full h-px" style={{ background: c.border }} />
    </Section>
  );
};

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
const Experience = () => {
  const { experience } = data;

  return (
    <Section id="experience" bg={c.bg}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="py-6 flex items-center justify-between">
          <LuxLabel>Chapter IV — Experience</LuxLabel>
          <LuxLabel>{experience.length} Positions</LuxLabel>
        </div>
        <HairRule />

        {/* Ghost word */}
        <div className="overflow-hidden">
          <div
            className="font-serif tracking-tighter select-none"
            style={{
              fontSize: "clamp(4rem, 14vw, 11rem)",
              color: c.text,
              opacity: 0.03,
              lineHeight: 1,
            }}
          >
            CAREER
          </div>
        </div>

        <div className="pb-20 -mt-2 space-y-0">
          {experience.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="py-10 grid grid-cols-1 md:grid-cols-12 gap-8"
              style={{ borderBottom: `1px solid ${c.border}` }}
            >
              {/* Period */}
              <div className="md:col-span-3">
                <LuxLabel>{exp.period}</LuxLabel>
              </div>

              {/* Role & Company */}
              <div className="md:col-span-4">
                <h3
                  className="font-serif leading-tight"
                  style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)", color: c.text }}
                >
                  {exp.role}
                </h3>
                <p
                  className="text-sm font-light mt-1 tracking-wide"
                  style={{ color: c.gold }}
                >
                  {exp.company}
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="text-sm font-light leading-relaxed" style={{ color: c.muted }}>
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="w-full h-px" style={{ background: c.border }} />
    </Section>
  );
};

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const Testimonials = () => {
  const { testimonials } = data;

  return (
    <Section id="testimonials" bg={c.bgAlt}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="py-6 flex items-center justify-between">
          <LuxLabel>Chapter V — Testimonials</LuxLabel>
          <LuxLabel>{testimonials.length} Voices</LuxLabel>
        </div>
        <HairRule />

        <div className="grid md:grid-cols-2 gap-0 py-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              {...fadeUp(i * 0.1)}
              className="p-10 flex flex-col gap-6"
              style={{
                borderRight: i % 2 === 0 ? `1px solid ${c.border}` : "none",
                borderBottom: `1px solid ${c.border}`,
              }}
            >
              {/* Gold quote */}
              <div
                className="font-serif leading-none select-none"
                style={{ fontSize: "5rem", color: c.gold, opacity: 0.3, lineHeight: 1 }}
              >
                "
              </div>
              <p
                className="text-base font-light leading-[2] italic -mt-6"
                style={{ color: c.text }}
              >
                "{t.text}"
              </p>
              <HairRule />
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 object-cover rounded-full"
                  style={{
                    border: `1px solid ${c.border}`,
                    filter: "grayscale(30%)",
                  }}
                />
                <div>
                  <p
                    className="font-serif text-sm"
                    style={{ color: c.text }}
                  >
                    {t.name}
                  </p>
                  <LuxLabel>{t.role}</LuxLabel>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="w-full h-px" style={{ background: c.border }} />
    </Section>
  );
};

// ─── CONTACT ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const { socials, personal } = data;

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements["name"].value;
    const email = e.target.elements["email"].value;
    const message = e.target.elements["message"].value;
    window.location.href = `mailto:${socials.email}?subject=${encodeURIComponent(`Message from ${name}`)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
  };

  const socialLinks = [
    { icon: Github, href: socials.github, label: "GitHub" },
    { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: socials.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
  ];

  const inputBase = {
    background: "transparent",
    borderBottom: `1px solid ${c.border}`,
    color: c.text,
    padding: "12px 0",
    width: "100%",
    fontSize: "14px",
    fontWeight: "300",
    outline: "none",
    letterSpacing: "0.05em",
    transition: "border-color 0.3s",
  };

  return (
    <Section id="contact" bg={c.bg}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="py-6 flex items-center justify-between">
          <LuxLabel>Chapter VI — Contact</LuxLabel>
          <LuxLabel>Correspondence</LuxLabel>
        </div>
        <HairRule />

        <div className="grid md:grid-cols-2 gap-24 py-20">
          {/* Left — editorial headline */}
          <motion.div {...fadeUp(0)} className="flex flex-col gap-10">
            <div>
              <div
                className="font-serif tracking-tighter leading-none"
                style={{ fontSize: "clamp(3rem, 9vw, 7rem)", color: c.text }}
              >
                Let's
              </div>
              <div
                className="font-serif tracking-tighter leading-none"
                style={{
                  fontSize: "clamp(3rem, 9vw, 7rem)",
                  color: "transparent",
                  WebkitTextStroke: `1px ${c.text}`,
                }}
              >
                Create.
              </div>
            </div>

            <HairRule />

            <div className="space-y-3">
              <LuxLabel className="block">Direct Line</LuxLabel>
              <p className="text-sm font-light" style={{ color: c.muted }}>
                {socials.email}
              </p>
            </div>

            <div className="flex gap-5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.2, color: c.gold }}
                  className="transition-all duration-300"
                  style={{ color: c.muted }}
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div {...fadeUp(0.2)}>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-light tracking-[0.25em] uppercase mb-4"
                  style={{ color: c.muted }}
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  required
                  aria-label="Full Name"
                  style={inputBase}
                  onFocus={e => e.target.style.borderBottomColor = c.gold}
                  onBlur={e => e.target.style.borderBottomColor = c.border}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-light tracking-[0.25em] uppercase mb-4"
                  style={{ color: c.muted }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  aria-label="Email Address"
                  style={inputBase}
                  onFocus={e => e.target.style.borderBottomColor = c.gold}
                  onBlur={e => e.target.style.borderBottomColor = c.border}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-light tracking-[0.25em] uppercase mb-4"
                  style={{ color: c.muted }}
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell me about your vision..."
                  required
                  aria-label="Your Message"
                  style={{ ...inputBase, resize: "none" }}
                  onFocus={e => e.target.style.borderBottomColor = c.gold}
                  onBlur={e => e.target.style.borderBottomColor = c.border}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ letterSpacing: "0.3em", backgroundColor: c.text }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 text-xs font-light tracking-[0.25em] uppercase transition-all duration-500 flex items-center justify-center gap-3"
                style={{
                  background: c.text,
                  color: c.bg,
                  border: `1px solid ${c.text}`,
                }}
              >
                <Send size={12} /> Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Gold footer line */}
      <div className="w-full h-px" style={{ background: c.gold, opacity: 0.6 }} />

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <LuxLabel>© {new Date().getFullYear()} {personal.name}</LuxLabel>
        <LuxLabel>Whitespace Luxury · Portfolio</LuxLabel>
      </div>
    </Section>
  );
};

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function WhitespaceLuxury() {
  return (
    <div className="min-h-screen" style={{ background: c.bg, fontFamily: "Georgia, 'Times New Roman', serif" }}>
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