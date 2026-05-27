
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  Code2,
  Briefcase,
  User,
  ChevronDown,
  Star,
  Globe,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import data from "../../../../data/dummy_data.json";
 
// ─── Sakura Petal SVG ────────────────────────────────────────────────────────
const PetalSVG = ({ className = "", style = {} }) => (
  <svg
    className={className}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="20" cy="20" rx="8" ry="18" fill="#FFAEC0" fillOpacity="0.7" transform="rotate(-30 20 20)" />
    <ellipse cx="20" cy="20" rx="8" ry="18" fill="#FFB7C5" fillOpacity="0.5" transform="rotate(30 20 20)" />
    <ellipse cx="20" cy="20" rx="8" ry="18" fill="#FFC0CB" fillOpacity="0.4" transform="rotate(90 20 20)" />
    <ellipse cx="20" cy="20" rx="8" ry="18" fill="#FFAEC0" fillOpacity="0.5" transform="rotate(150 20 20)" />
    <ellipse cx="20" cy="20" rx="8" ry="18" fill="#FFB7C5" fillOpacity="0.6" transform="rotate(210 20 20)" />
    <circle cx="20" cy="20" r="3" fill="#FF85A1" fillOpacity="0.9" />
  </svg>
);
 
// ─── Falling Sakura Petals Background ────────────────────────────────────────
const FallingPetals = () => {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 24 + 14,
    duration: Math.random() * 10 + 12,
    delay: Math.random() * 12,
    drift: Math.random() * 160 - 80,
    rotate: Math.random() * 720,
    opacity: Math.random() * 0.4 + 0.3,
  }));
 
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0"
          style={{ left: p.left, opacity: p.opacity }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift],
            rotate: [0, p.rotate],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <PetalSVG className="opacity-90" style={{ width: p.size, height: p.size }} />
        </motion.div>
      ))}
    </div>
  );
};
 
// ─── Decorative Branch ───────────────────────────────────────────────────────
const SakuraBranch = ({ className = "", flip = false }) => (
  <svg
    className={`${className} ${flip ? "scale-x-[-1]" : ""}`}
    viewBox="0 0 200 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 110 Q60 80 120 50 Q160 30 190 10" stroke="#D4698A" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
    <path d="M80 65 Q95 40 110 20" stroke="#D4698A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
    <path d="M50 85 Q65 65 80 45" stroke="#D4698A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.35" />
    {[[120,50],[80,45],[110,22],[160,30],[55,80]].map(([cx,cy],i) => (
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx="6" ry="9" fill="#FFB7C5" fillOpacity="0.7" transform={`rotate(${i*30} ${cx} ${cy})`} />
        <ellipse cx={cx} cy={cy} rx="6" ry="9" fill="#FFAEC0" fillOpacity="0.5" transform={`rotate(${i*30+60} ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r="2.5" fill="#FF85A1" fillOpacity="0.8" />
      </g>
    ))}
  </svg>
);
 
// ─── Section Reveal Wrapper ───────────────────────────────────────────────────
const RevealSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
 
// ─── Section Heading ─────────────────────────────────────────────────────────
const SectionHeading = ({ label, title, subtitle }) => (
  <div className="text-center mb-14">
    <motion.span
      className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-pink-400 mb-3 px-4 py-1 rounded-full bg-pink-50 border border-pink-100"
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {label}
    </motion.span>
    <h2 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mt-2 leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-rose-400 mt-3 text-base max-w-xl mx-auto font-light">{subtitle}</p>
    )}
    <div className="flex items-center justify-center gap-2 mt-5">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300" />
      <PetalSVG className="w-5 h-5 opacity-70" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300" />
    </div>
  </div>
);
 
// ─── Social Icon Map ─────────────────────────────────────────────────────────
const socialIconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
  instagram: Instagram,
  youtube: Youtube,
  globe: Globe,
};
 
const SocialLink = ({ platform, url }) => {
  const Icon = socialIconMap[platform?.toLowerCase()] || Globe;
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-sm border border-pink-100 flex items-center justify-center text-rose-400 hover:text-white hover:bg-pink-400 hover:border-pink-400 shadow-sm transition-colors duration-200"
      whileHover={{ scale: 1.15, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={16} />
    </motion.a>
  );
};
 
// ─── Skill Pill ──────────────────────────────────────────────────────────────
const SkillPill = ({ skill, index }) => (
  <motion.div
    className="px-4 py-2 rounded-full text-sm font-medium bg-white/60 backdrop-blur-sm border border-pink-100 text-rose-700 shadow-sm cursor-default select-none"
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.04, duration: 0.4 }}
    whileHover={{
      scale: 1.08,
      backgroundColor: "#fce7f3",
      boxShadow: "0 0 14px rgba(244,114,182,0.35)",
      borderColor: "#f9a8d4",
    }}
  >
    {typeof skill === "string" ? skill : skill?.name || skill?.label || ""}
  </motion.div>
);
 
// ─── Project Card ─────────────────────────────────────────────────────────────
const ProjectCard = ({ project, index }) => (
  <RevealSection delay={index * 0.1}>
    <motion.div
      className="group relative bg-white/50 backdrop-blur-md rounded-3xl border border-pink-100 shadow-md overflow-hidden flex flex-col h-full"
      whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(244,114,182,0.18)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {/* Card accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-pink-300 via-rose-400 to-pink-200" />
 
      {/* Thumbnail / placeholder */}
      {project.image ? (
        <div className="w-full h-44 overflow-hidden">
          <img
            src={project.image}
            alt={project.title || project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
          <Code2 size={40} className="text-pink-200" />
        </div>
      )}
 
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-bold text-rose-900 mb-2">
          {project.title || project.name}
        </h3>
        <p className="text-rose-500 text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>
 
        {/* Tech tags */}
        {(project.tech || project.tags || project.technologies || []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {(project.tech || project.tags || project.technologies).map((t, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-600 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        )}
 
        <div className="flex gap-3 mt-auto">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700 font-medium transition-colors"
            >
              <Github size={14} /> Code
            </a>
          )}
          {(project.live || project.url || project.demo) && (
            <a
              href={project.live || project.url || project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700 font-medium transition-colors"
            >
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>
      </div>
 
      {/* Decorative petal corner */}
      <div className="absolute top-3 right-3 opacity-20 pointer-events-none">
        <PetalSVG className="w-10 h-10" />
      </div>
    </motion.div>
  </RevealSection>
);
 
// ─── Experience Timeline Item ─────────────────────────────────────────────────
const TimelineItem = ({ exp, index, isLast }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
 
  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6"
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <motion.div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center shadow-md flex-shrink-0 z-10"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: index * 0.12 + 0.2, type: "spring", stiffness: 280 }}
        >
          <Briefcase size={16} className="text-white" />
        </motion.div>
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-pink-200 to-transparent mt-2 min-h-[40px]" />}
      </div>
 
      {/* Card */}
      <motion.div
        className="flex-1 bg-white/50 backdrop-blur-sm rounded-2xl border border-pink-100 p-5 mb-8 shadow-sm"
        whileHover={{ boxShadow: "0 8px 30px rgba(244,114,182,0.14)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-lg font-bold text-rose-900">
            {exp.role || exp.title || exp.position}
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-500 font-medium whitespace-nowrap">
            {exp.period || exp.duration || exp.date || `${exp.startDate || ""} – ${exp.endDate || "Present"}`}
          </span>
        </div>
        <p className="text-pink-500 text-sm font-semibold mb-2">{exp.company || exp.organization}</p>
        {exp.description && (
          <p className="text-rose-500 text-sm leading-relaxed">{exp.description}</p>
        )}
        {(exp.achievements || exp.highlights || []).length > 0 && (
          <ul className="mt-3 space-y-1">
            {(exp.achievements || exp.highlights).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-rose-500 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.div>
  );
};
 
// ─── Testimonial Card ─────────────────────────────────────────────────────────
const TestimonialCard = ({ testimonial, index }) => (
  <RevealSection delay={index * 0.08}>
    <motion.div
      className="bg-white/50 backdrop-blur-md rounded-3xl border border-pink-100 p-6 shadow-sm h-full flex flex-col"
      whileHover={{ y: -4, boxShadow: "0 16px 50px rgba(244,114,182,0.15)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
          <Star key={i} size={13} className="fill-pink-400 text-pink-400" />
        ))}
      </div>
 
      <p className="text-rose-600 text-sm leading-relaxed italic flex-1 mb-5">
        "{testimonial.text || testimonial.content || testimonial.review}"
      </p>
 
      <div className="flex items-center gap-3 mt-auto">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-pink-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(testimonial.name || "?")[0]}
          </div>
        )}
        <div>
          <p className="font-semibold text-rose-900 text-sm">{testimonial.name}</p>
          <p className="text-pink-400 text-xs">
            {testimonial.role || testimonial.position}
            {testimonial.company && ` @ ${testimonial.company}`}
          </p>
        </div>
      </div>
    </motion.div>
  </RevealSection>
);
 
// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ stat, index }) => (
  <motion.div
    className="text-center px-6 py-5 rounded-2xl bg-white/50 backdrop-blur-sm border border-pink-100 shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
    whileHover={{ scale: 1.04, boxShadow: "0 8px 30px rgba(244,114,182,0.15)" }}
  >
    <p className="font-serif text-3xl font-bold text-rose-800 mb-1">
      {stat.value || stat.count || stat.number}
    </p>
    <p className="text-pink-400 text-xs font-semibold tracking-widest uppercase">
      {stat.label || stat.name || stat.title}
    </p>
  </motion.div>
);
 
// ─── Floating Navbar ──────────────────────────────────────────────────────────
const Navbar = ({ personal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
 
  const navLinks = ["About", "Skills", "Projects", "Experience", "Testimonials", "Contact"];
 
  const scrollTo = (id) => {
    const el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
 
  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-pink-100 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <PetalSVG className="w-7 h-7" />
          <span className="font-serif text-xl font-bold text-rose-800">
            {personal?.name?.split(" ")[0] || "Portfolio"}
          </span>
        </motion.div>
 
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="px-4 py-2 rounded-full text-sm font-medium text-rose-600 hover:text-rose-900 hover:bg-pink-50 transition-all duration-200"
            >
              {link}
            </button>
          ))}
        </nav>
 
        {/* CTA */}
        <motion.a
          href={`mailto:${personal?.email || "#"}`}
          className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white text-sm font-semibold shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Mail size={14} /> Hire Me
        </motion.a>
 
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-rose-500"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-5 h-0.5 bg-rose-400 mb-1 rounded transition-all" style={{ transform: menuOpen ? "rotate(45deg) translateY(6px)" : "" }} />
          <div className="w-5 h-0.5 bg-rose-400 mb-1 rounded transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-rose-400 rounded transition-all" style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "" }} />
        </button>
      </div>
 
      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-pink-100 shadow-lg px-6 py-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="block w-full text-left px-3 py-3 text-rose-600 hover:text-rose-900 font-medium border-b border-pink-50 last:border-0"
              >
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
 
// ─── HERO SECTION ─────────────────────────────────────────────────────────────
const HeroSection = ({ personal, socials, stats }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
 
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-pink-100 blur-[120px] opacity-60" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-rose-100 blur-[120px] opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-pink-50 blur-[160px] opacity-40" />
      </div>
 
      {/* Decorative branches */}
      <SakuraBranch className="absolute top-16 left-0 w-52 opacity-50 pointer-events-none" />
      <SakuraBranch className="absolute top-16 right-0 w-52 opacity-50 pointer-events-none" flip />
 
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{ y, opacity }}
      >
        {/* Avatar */}
        <motion.div
          className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-pink-100"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, type: "spring", stiffness: 140, damping: 16 }}
        >
          {personal?.avatar || personal?.photo || personal?.image ? (
            <img
              src={personal.avatar || personal.photo || personal.image}
              alt={personal?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
          )}
        </motion.div>
 
        {/* Greeting label */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-500 text-sm font-medium mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Sparkles size={13} />
          {personal?.greeting || "Welcome to my portfolio"}
        </motion.div>
 
        {/* Name */}
        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-rose-900 leading-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {personal?.name}
        </motion.h1>
 
        {/* Title */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-rose-500 font-light mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          {personal?.title || personal?.role || personal?.headline}
        </motion.p>
 
        {/* Bio excerpt */}
        {personal?.bio && (
          <motion.p
            className="text-rose-400 max-w-xl mx-auto leading-relaxed text-base mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            {personal.bio.length > 180 ? `${personal.bio.slice(0, 180)}…` : personal.bio}
          </motion.p>
        )}
 
        {/* Social links */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          {socials && Object.entries(socials).map(([platform, url]) =>
            url ? <SocialLink key={platform} platform={platform} url={url} /> : null
          )}
        </motion.div>
 
        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
        >
          <motion.a
            href={personal?.resume || personal?.cv || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold shadow-lg hover:shadow-xl text-sm"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowUpRight size={16} /> View Resume
          </motion.a>
          <motion.button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/70 backdrop-blur-sm border border-pink-200 text-rose-600 font-semibold text-sm shadow-sm hover:bg-pink-50"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
          >
            <Mail size={16} /> Contact Me
          </motion.button>
        </motion.div>
 
        {/* Stats row */}
        {stats && stats.length > 0 && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
          >
            {stats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
          </motion.div>
        )}
      </motion.div>
 
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-pink-300"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
};
 
// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
const AboutSection = ({ personal }) => (
  <section id="about" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
    <SectionHeading label="My Story" title="About Me" subtitle="The person behind the pixels" />
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Left: decorative visual */}
      <RevealSection>
        <div className="relative">
          <div className="w-full aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-xl">
            {personal?.avatar || personal?.photo || personal?.image ? (
              <img
                src={personal.avatar || personal.photo || personal.image}
                alt={personal?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center">
                <User size={80} className="text-pink-300" />
              </div>
            )}
          </div>
          {/* Floating badge */}
          <motion.div
            className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-pink-100"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <PetalSVG className="w-8 h-8 mx-auto mb-1" />
            <p className="text-xs font-semibold text-rose-700 text-center">Open to Work</p>
          </motion.div>
          {/* Decorative branch */}
          <SakuraBranch className="absolute -top-8 -left-8 w-40 opacity-40 pointer-events-none" />
        </div>
      </RevealSection>
 
      {/* Right: bio */}
      <RevealSection delay={0.15}>
        <div className="space-y-5">
          <h3 className="font-serif text-3xl font-bold text-rose-900">
            Hi, I&apos;m {personal?.name?.split(" ")[0] || "there"} 👋
          </h3>
          <p className="text-rose-500 leading-relaxed">{personal?.bio}</p>
          {personal?.about && (
            <p className="text-rose-500 leading-relaxed">{personal.about}</p>
          )}
 
          <div className="space-y-2 pt-2">
            {personal?.location && (
              <div className="flex items-center gap-2 text-rose-400 text-sm">
                <MapPin size={14} className="text-pink-400" />
                {personal.location}
              </div>
            )}
            {personal?.email && (
              <div className="flex items-center gap-2 text-rose-400 text-sm">
                <Mail size={14} className="text-pink-400" />
                {personal.email}
              </div>
            )}
            {personal?.phone && (
              <div className="flex items-center gap-2 text-rose-400 text-sm">
                <Phone size={14} className="text-pink-400" />
                {personal.phone}
              </div>
            )}
          </div>
 
          {personal?.resume || personal?.cv ? (
            <motion.a
              href={personal.resume || personal.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold text-sm shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowUpRight size={15} /> Download Resume
            </motion.a>
          ) : null}
        </div>
      </RevealSection>
    </div>
  </section>
);
 
// ─── SKILLS SECTION ───────────────────────────────────────────────────────────
const SkillsSection = ({ skills }) => {
  // Normalise: skills can be an array of strings, or array of { category, items[] }, or { [category]: string[] }
  const isGrouped =
    !Array.isArray(skills) ||
    (skills.length > 0 && typeof skills[0] === "object" && (skills[0].category || skills[0].name) && Array.isArray(skills[0].items || skills[0].skills || skills[0].list));
 
  const groups = (() => {
    if (!skills) return [];
    if (!Array.isArray(skills)) {
      // object of arrays e.g. { Frontend: [...], Backend: [...] }
      return Object.entries(skills).map(([cat, items]) => ({ category: cat, items }));
    }
    if (isGrouped) {
      return skills.map((g) => ({
        category: g.category || g.name || g.title || "Skills",
        items: g.items || g.skills || g.list || [],
      }));
    }
    // flat string array
    return [{ category: "Skills", items: skills }];
  })();
 
  return (
    <section id="skills" className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
      <SectionHeading
        label="Expertise"
        title="Skills & Technologies"
        subtitle="Tools I use to bring ideas to life"
      />
      <div className="space-y-10">
        {groups.map((group, gi) => (
          <RevealSection key={gi} delay={gi * 0.1}>
            <div>
              {groups.length > 1 && (
                <h3 className="font-serif text-lg font-semibold text-rose-700 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-pink-400" />
                  </span>
                  {group.category}
                </h3>
              )}
              <div className="flex flex-wrap gap-3">
                {group.items.map((skill, i) => (
                  <SkillPill key={i} skill={skill} index={i} />
                ))}
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
};
 
// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────
const ProjectsSection = ({ projects }) => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? projects : projects?.slice(0, 6);
 
  return (
    <section id="projects" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading label="My Work" title="Featured Projects" subtitle="Things I have built with love" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed?.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
        {projects?.length > 6 && (
          <div className="text-center mt-10">
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3.5 rounded-full border border-pink-200 text-rose-600 font-semibold text-sm hover:bg-pink-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {showAll ? "Show Less" : `View All ${projects.length} Projects`}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};
 
// ─── EXPERIENCE SECTION ───────────────────────────────────────────────────────
const ExperienceSection = ({ experience }) => (
  <section id="experience" className="py-16 md:py-24 px-4 sm:px-6 max-w-3xl mx-auto">
    <SectionHeading label="Journey" title="Work Experience" subtitle="Where I have grown professionally" />
    <div>
      {experience?.map((exp, i) => (
        <TimelineItem key={i} exp={exp} index={i} isLast={i === experience.length - 1} />
      ))}
    </div>
  </section>
);
 
// ─── TESTIMONIALS SECTION ─────────────────────────────────────────────────────
const TestimonialsSection = ({ testimonials }) => (
  <section id="testimonials" className="py-16 md:py-24 px-4 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <SectionHeading
        label="Kind Words"
        title="Testimonials"
        subtitle="What people say about working with me"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials?.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} index={i} />
        ))}
      </div>
    </div>
  </section>
);
 
// ─── CONTACT / FOOTER ─────────────────────────────────────────────────────────
const ContactSection = ({ personal, socials }) => (
  <section id="contact" className="py-16 md:py-24 px-4 sm:px-6">
    <div className="max-w-2xl mx-auto text-center">
      <RevealSection>
        <SectionHeading label="Get In Touch" title="Let's Work Together" subtitle="I'm always open to new opportunities" />
 
        <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-pink-100 p-10 shadow-md relative overflow-hidden">
          <SakuraBranch className="absolute -top-6 -right-6 w-48 opacity-25 pointer-events-none" />
          <SakuraBranch className="absolute -bottom-6 -left-6 w-48 opacity-25 pointer-events-none" flip />
 
          <PetalSVG className="w-16 h-16 mx-auto mb-5 opacity-80" />
 
          <p className="text-rose-500 mb-8 leading-relaxed">
            Have a project in mind or just want to chat? Feel free to reach out — I'd love to connect!
          </p>
 
          <motion.a
            href={`mailto:${personal?.email || "#"}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white font-semibold text-base shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
          >
            <Mail size={18} /> Send a Message
          </motion.a>
 
          <div className="flex items-center justify-center gap-4 mt-8">
            {socials && Object.entries(socials).map(([platform, url]) =>
              url ? <SocialLink key={platform} platform={platform} url={url} /> : null
            )}
          </div>
 
          {personal?.location && (
            <p className="flex items-center justify-center gap-1.5 text-pink-400 text-sm mt-6">
              <MapPin size={13} /> {personal.location}
            </p>
          )}
        </div>
      </RevealSection>
    </div>
 
    {/* Footer bar */}
    <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-pink-300">
      <div className="flex items-center gap-2">
        <PetalSVG className="w-5 h-5" />
        <span className="font-serif font-semibold text-rose-800">{personal?.name}</span>
      </div>
      <p>© {new Date().getFullYear()} · Built with 🌸 using React & Framer Motion</p>
    </div>
  </section>
);
 
// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function CherryBlossomPortfolio() {
  const { personal, socials, skills, projects, experience, testimonials, stats } = data;
 
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden relative scroll-smooth"
      style={{
        background: "linear-gradient(135deg, #fff5f7 0%, #fef0f3 30%, #fff8fa 60%, #fef0f4 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pink-100 blur-[100px] opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-100 blur-[100px] opacity-35" />
      </div>
 
      {/* Falling petals */}
      <FallingPetals />
 
      {/* Sticky Navbar */}
      <Navbar personal={personal} />
 
      {/* Main content */}
      <main className="relative z-10">
        <HeroSection personal={personal} socials={socials} stats={stats} />
 
        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
        </div>
 
        <AboutSection personal={personal} />
 
        {/* Decorative full-width divider */}
        <div className="relative py-4 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
            <PetalSVG className="w-6 h-6 opacity-50" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent" />
          </div>
        </div>
 
        {skills && <SkillsSection skills={skills} />}
 
        <div className="bg-gradient-to-b from-pink-50/50 to-white/30">
          {projects && projects.length > 0 && <ProjectsSection projects={projects} />}
        </div>
 
        {experience && experience.length > 0 && <ExperienceSection experience={experience} />}
 
        <div className="bg-gradient-to-b from-white/20 to-pink-50/40">
          {testimonials && testimonials.length > 0 && (
            <TestimonialsSection testimonials={testimonials} />
          )}
        </div>
 
        <ContactSection personal={personal} socials={socials} />
      </main>
    </div>
  );
}