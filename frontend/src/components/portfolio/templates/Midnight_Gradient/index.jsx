import React from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  MapPin,
  Download,
  Star,
  Briefcase,
  User,
  Code2,
  MessageSquare,
  Phone,
  Globe,
  Award,
  Sparkles,
  Send
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

// Sleek, reusable glass card with glowing aura and border
const GlowingCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className={`relative group rounded-2xl border border-indigo-500/10 hover:border-cyan-400/40 bg-[#0a0d24]/60 backdrop-blur-md hover:shadow-[0_0_35px_rgba(34,211,238,0.12)] transition-all duration-300 ${className}`}
  >
    {/* Radial hover light overlay */}
    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-cyan-500/5 group-hover:to-purple-500/5 blur-xl transition-all duration-500" />
    {children}
  </motion.div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// ─── Hero Section ────────────────────────────────────────────────────────────
function Hero() {
  const nameParts = data.personal.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Background Animated Gradients (Mesh Theme) */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -100, 60, 0],
            scale: [1, 1.25, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-cyan-600/15 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 100, 0],
            y: [0, 80, -80, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 50, -50, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[110px]"
        />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Left Side: Content & Actions */}
        <motion.div variants={fadeUp} className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-300 text-xs font-semibold uppercase tracking-wider">
              {data.personal.availability}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
            Hi, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 drop-shadow-[0_2px_10px_rgba(6,182,212,0.15)]">
              {firstName} {lastName}
            </span>
          </h1>

          {/* Title */}
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-cyan-400 animate-pulse" />
            <p className="text-gray-300 text-xl font-medium tracking-wide">
              {data.personal.title}
            </p>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed mb-8">
            {data.personal.tagline}
          </p>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href={`mailto:${data.socials.email}`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.4)] transition-all duration-300"
            >
              <Mail size={16} /> Hire Me
            </a>
            <a
              href={data.personal.resumeUrl ?? "#"}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-700/60 hover:border-gray-500 text-gray-200 font-bold text-sm tracking-wide transition-all duration-300"
            >
              <Download size={16} /> Download CV
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[
              { icon: <Github size={19} />, href: data.socials.github, label: "GitHub", hover: "hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]" },
              { icon: <Linkedin size={19} />, href: data.socials.linkedin, label: "LinkedIn", hover: "hover:text-blue-400 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]" },
              { icon: <Twitter size={19} />, href: data.socials.twitter, label: "Twitter", hover: "hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]" },
            ].map(({ icon, href, label, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`w-11 h-11 flex items-center justify-center rounded-xl bg-[#090b20]/80 border border-gray-800 text-gray-400 transition-all duration-300 ${hover}`}
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Glowing Avatar Frame & Stats */}
        <motion.div variants={fadeUp} className="lg:col-span-5 flex flex-col items-center">
          <div className="relative group mb-10">
            {/* Spinning/pulsing neon border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 animate-spin blur-md opacity-60 group-hover:opacity-80 transition-all duration-500" style={{ animationDuration: '9s' }} />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 blur-lg opacity-40 group-hover:opacity-60 transition-all duration-500" />
            <img
              src={data.personal.avatar}
              alt={data.personal.name}
              className="relative w-44 h-44 md:w-52 md:h-52 rounded-full object-cover border-[6px] border-gray-950/90 mx-auto transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Stats Bento Box Grid */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {[
              { value: `${data.stats.yearsExperience}+`, label: "Years Exp", gradient: "from-cyan-400 to-blue-400" },
              { value: `${data.stats.projectsCompleted}+`, label: "Completed", gradient: "from-blue-400 to-indigo-400" },
              { value: `${data.stats.happyClients}+`, label: "Clients", gradient: "from-indigo-400 to-purple-400" },
            ].map(({ value, label, gradient }) => (
              <div
                key={label}
                className="p-3.5 rounded-2xl bg-[#0a0d24]/75 border border-indigo-500/10 text-center hover:border-cyan-500/30 transition-all duration-300 shadow-lg"
              >
                <div className={`text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                  {value}
                </div>
                <div className="text-gray-400 text-xs mt-1 font-semibold tracking-wider uppercase">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── About Section ───────────────────────────────────────────────────────────
function About() {
  return (
    <section className="relative px-6 py-24 bg-[#030514]/40 border-y border-indigo-950/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <User size={20} />
          </div>
          <div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Background</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">About Me</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Detailed Narrative */}
          <GlowingCard className="p-8 lg:col-span-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              My Engineering Philosophy <Sparkles size={16} className="text-cyan-400" />
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6 text-base">
              {data.personal.bio}
            </p>
            <div className="flex items-center gap-2.5 text-gray-400 text-sm">
              <MapPin size={16} className="text-cyan-400" />
              <span>Based in {data.personal.location}</span>
            </div>
          </GlowingCard>

          {/* Quick Profile Meta */}
          <div className="lg:col-span-4 space-y-4">
            {[
              { label: "Current Role", value: data.personal.title, icon: <Briefcase size={16} /> },
              { label: "Work Email", value: data.socials.email, icon: <Mail size={16} /> },
              { label: "Personal Site", value: data.socials.website ?? `https://github.com/${data.personal.name.toLowerCase().replace(" ", "")}`, icon: <Globe size={16} /> },
            ].map(({ label, value, icon }) => (
              <GlowingCard key={label} className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-cyan-400">
                  {icon}
                </div>
                <div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</div>
                  <div className="text-gray-200 text-sm font-medium mt-0.5 truncate max-w-[200px]" title={value}>
                    {value}
                  </div>
                </div>
              </GlowingCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills Section ──────────────────────────────────────────────────────────
function Skills() {
  // Extract unique categories
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <section className="relative px-6 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-14">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-cyan-400">
            <Code2 size={20} />
          </div>
          <div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Skills & Technologies</h2>
          </div>
        </div>

        {/* Bento-like Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, catIdx) => (
            <GlowingCard key={cat} className="p-6" delay={catIdx * 0.1}>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-indigo-500/10">
                <h3 className="text-white font-bold text-lg">{cat}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-2xs uppercase font-extrabold tracking-widest">
                  Expertise
                </span>
              </div>
              <div className="space-y-4">
                {data.skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div key={skill.name} className="group/item">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-300 font-medium group-hover/item:text-cyan-300 transition-colors duration-200">
                          {skill.name}
                        </span>
                        <span className="text-cyan-400 font-bold">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-950/75 border border-indigo-950/20 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects Section ────────────────────────────────────────────────────────
function Projects() {
  return (
    <section className="relative px-6 py-24 bg-[#030514]/40 border-y border-indigo-950/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-14">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-cyan-400">
            <Star size={20} />
          </div>
          <div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Showcase</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Featured Projects</h2>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data.projects || []).map((project, idx) => (
            <GlowingCard key={project.title} className="flex flex-col h-full overflow-hidden" delay={idx * 0.08}>
              {/* Image Container */}
              <div className="relative overflow-hidden group/img">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover/img:scale-108"
                />
                {/* Visual shadow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
                {project.featured && (
                  <span className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <Award size={12} /> Featured
                  </span>
                )}
              </div>

              {/* Content body */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-xl mb-2.5 group-hover:text-cyan-400 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md bg-[#0e1236]/80 border border-indigo-500/10 text-cyan-300/80 text-2xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Interactive Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-indigo-500/10">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-gray-200 transition-colors duration-200 ml-auto"
                  >
                    <Github size={14} /> Source Code
                  </a>
                </div>
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Experience Section ──────────────────────────────────────────────────────
function Experience() {
  return (
    <section className="relative px-6 py-24">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-16 justify-center text-center">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Briefcase size={20} />
          </div>
          <div className="text-left">
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Journey</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Work History</h2>
          </div>
        </div>

        {/* Timeline Pipeline */}
        <div className="relative">
          {/* Main timeline track with dual neon glow */}
          <div className="absolute left-6 md:left-1/2 top-2 bottom-2 w-[2px] bg-gradient-to-b from-cyan-500 via-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />

          <div className="space-y-12">
            {(data.experience || []).map((exp, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row relative items-start md:items-center ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Neon timeline bullet point */}
                  <div className="absolute left-[18px] md:left-1/2 -translate-x-[5px] md:-translate-x-[5px] z-10 w-3 h-3 rounded-full bg-cyan-400 border-2 border-gray-950 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

                  {/* Card Container */}
                  <div className={`w-full md:w-[46%] pl-12 md:pl-0 ${isEven ? "md:pr-10" : "md:pl-10"}`}>
                    <GlowingCard className="p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors duration-200">
                            {exp.role}
                          </h3>
                          <p className="text-cyan-400 font-semibold text-sm mt-0.5">{exp.company}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-gray-400 text-2xs font-bold tracking-wide">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {exp.description}
                      </p>
                      {/* Optional skills used */}
                      {exp.techStack && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-indigo-500/5">
                          {exp.techStack.map((tech) => (
                            <span key={tech} className="px-2 py-0.5 rounded bg-indigo-500/5 text-cyan-300 text-[10px]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </GlowingCard>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="relative px-6 py-24 bg-[#030514]/40 border-y border-indigo-950/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-14">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-cyan-400">
            <MessageSquare size={20} />
          </div>
          <div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Endorsements</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Recommendations</h2>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.testimonials || []).map((t, idx) => (
            <GlowingCard key={t.name} className="p-6 flex flex-col justify-between h-full" delay={idx * 0.08}>
              <div>
                <span className="text-cyan-500/30 text-5xl font-serif leading-none select-none">“</span>
                <p className="text-gray-300 text-sm leading-relaxed italic mb-6">
                  {t.text}
                </p>
              </div>
              
              <div className="flex items-center gap-3.5 pt-4 border-t border-indigo-500/10">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-cyan-500/25"
                />
                <div>
                  <h4 className="text-white font-bold text-sm">{t.name}</h4>
                  <p className="text-gray-400 text-2xs mt-0.5 font-semibold uppercase tracking-wider">
                    {t.role}
                  </p>
                </div>
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function Contact() {
  return (
    <section className="relative px-6 py-24">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 justify-center">
            <Phone size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Let's Connect</h2>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed">
            Have an exciting role, project, or general inquiry? Feel free to reach out and let's construct something awesome!
          </p>
        </div>

        {/* Contact form in glass container */}
        <GlowingCard className="p-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="user-name" className="sr-only">Full Name</label>
                <input
                  id="user-name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/40 border border-indigo-500/15 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                />
              </div>
              <div>
                <label htmlFor="user-email" className="sr-only">Email Address</label>
                <input
                  id="user-email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/40 border border-indigo-500/15 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message-subject" className="sr-only">Subject</label>
              <input
                id="message-subject"
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 rounded-xl bg-gray-950/40 border border-indigo-500/15 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              />
            </div>

            <div>
              <label htmlFor="user-message" className="sr-only">Your Message</label>
              <textarea
                id="user-message"
                rows={5}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-xl bg-gray-950/40 border border-indigo-500/15 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-500 outline-none transition-all duration-300 resize-none focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wider shadow-[0_4px_25px_rgba(6,182,212,0.25)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={16} /> Send Message
            </button>
          </form>
        </GlowingCard>

        {/* Footer info & Copyright */}
        <div className="mt-16 text-center text-gray-500 text-xs border-t border-indigo-950/40 pt-8">
          <p className="tracking-wide">
            © {new Date().getFullYear()} {data.personal.name}.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function MidnightGradient() {
  return (
    <div className="min-h-screen bg-[#020410] text-gray-100 font-sans relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Floating Mesh Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-900/10 blur-[150px]" />
      </div>

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
