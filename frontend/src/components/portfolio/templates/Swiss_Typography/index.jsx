import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  ArrowUpRight,
  Phone,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const ACCENT = '#E63946';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Tiny helpers ──────────────────────────────────────── */
function Rule({ className = '' }) {
  return <div className={`h-px bg-black w-full ${className}`} />;
}

function Label({ children }) {
  return (
    <span className="text-[10px] md:text-xs font-black tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
function Hero() {
  const { name, title, location } = data.personal;
  const { github, linkedin, twitter, email } = data.socials;
  const { yearsExperience, projectsCompleted, happyClients } = data.stats;

  const stats = [
    { value: `${yearsExperience}+`, label: 'Years' },
    { value: `${projectsCompleted}+`, label: 'Projects' },
    { value: `${happyClients}+`, label: 'Clients' },
  ];

  const socialLinks = [
    { href: github, Icon: Github, label: 'GitHub' },
    { href: linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: twitter, Icon: Twitter, label: 'Twitter' },
    { href: `mailto:${email}`, Icon: Mail, label: 'Email' },
  ];

  return (
    <section className="border-b border-black">
      {/* top nav bar */}
      <div className="flex items-center justify-between px-5 md:px-12 py-3 border-b border-black">
        <Label>Portfolio — Swiss Typography</Label>
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold tracking-widest uppercase">
          <MapPin size={10} />
          {location}
        </div>
      </div>

      {/* hero grid */}
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* large name */}
        <div className="md:col-span-8 px-5 md:px-12 py-10 md:py-20 border-b md:border-b-0 md:border-r border-black">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-3">
            <Label>01 — Introduction</Label>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="font-black leading-[0.88] tracking-tight text-black uppercase"
            style={{ fontSize: 'clamp(2.6rem, 9vw, 7.5rem)' }}
          >
            {name.split(' ').map((word, i) => (
              <span key={i} className="block">
                {word}
              </span>
            ))}
          </motion.h1>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="mt-5 flex items-center gap-3"
          >
            <div className="w-8 h-px bg-black" />
            <p className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-[0.18em]">
              {title}
            </p>
          </motion.div>
        </div>

        {/* right sidebar: stats + socials */}
        <div className="md:col-span-4 flex flex-col">
          <div className="grid grid-cols-3 md:grid-cols-1 divide-x md:divide-x-0 md:divide-y divide-black border-b border-black md:border-b-0">
            {stats.map(({ value, label }, i) => (
              <motion.div
                key={label}
                initial="hidden"
                animate="visible"
                custom={i + 2}
                variants={fadeUp}
                className="px-5 md:px-8 py-5 md:py-8"
              >
                <div className="text-2xl md:text-4xl font-black leading-none" style={{ color: ACCENT }}>
                  {value}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* social row */}
          <div className="border-t border-black px-5 md:px-8 py-5 flex gap-3 mt-auto">
            {socialLinks.map(({ href, Icon, label }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                initial="hidden"
                animate="visible"
                custom={i + 5}
                variants={fadeUp}
                className="w-8 h-8 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-200"
              >
                <Icon size={13} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── About ───────────────────────────────────────────────── */
function About() {
  const { bio, avatar, name } = data.personal;

  return (
    <section className="border-b border-black">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-3 px-5 md:px-12 py-8 md:py-12 border-b md:border-b-0 md:border-r border-black flex flex-col gap-6">
          <Label>02 — About</Label>
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 md:w-24 md:h-24 grayscale border border-black object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="md:col-span-9 px-5 md:px-12 py-8 md:py-12 flex items-center"
        >
          <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-700 max-w-3xl">
            {bio}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Skills ──────────────────────────────────────────────── */
function Skills() {
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <section className="border-b border-black">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-3 px-5 md:px-12 py-8 md:py-12 border-b md:border-b-0 md:border-r border-black">
          <Label>03 — Skills</Label>
        </div>

        <div className="md:col-span-9 px-5 md:px-12 py-8 md:py-12 space-y-8">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={ci}
              variants={fadeUp}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4">
                {cat}
              </div>
              <div className="space-y-3">
                {data.skills
                  .filter((s) => s.category === cat)
                  .map((skill, si) => (
                    <div key={skill.name} className="flex items-center gap-4">
                      <span className="w-28 md:w-36 text-xs md:text-sm font-semibold text-black shrink-0">
                        {skill.name}
                      </span>
                      <div className="flex-1 relative" style={{ height: '2px', backgroundColor: '#e5e7eb' }}>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.7,
                            delay: si * 0.06,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="absolute inset-0 origin-left"
                          style={{
                            width: `${skill.level}%`,
                            backgroundColor: ACCENT,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-[10px] font-black text-gray-400">
                        {skill.level}
                      </span>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Projects ────────────────────────────────────────────── */
function Projects() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="border-b border-black">
      <div className="px-5 md:px-12 py-3 border-b border-black flex items-center justify-between">
        <Label>04 — Projects</Label>
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
          {data.projects.length} works
        </span>
      </div>

      <div className="divide-y divide-black">
        {data.projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            variants={fadeUp}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="grid grid-cols-1 md:grid-cols-12 transition-colors duration-200"
            style={{ backgroundColor: hovered === i ? '#f7f7f7' : 'white' }}
          >
            {/* index */}
            <div className="hidden md:flex md:col-span-1 px-5 md:px-8 pt-6 items-start">
              <span className="text-xs font-black" style={{ color: ACCENT }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* title */}
            <div className="md:col-span-3 px-5 md:px-4 pt-5 pb-1 md:py-6">
              <div className="flex items-center gap-2 md:hidden mb-1">
                <span className="text-[10px] font-black" style={{ color: ACCENT }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-black">
                {project.title}
              </h3>
              {project.featured && (
                <span
                  className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5"
                  style={{ backgroundColor: ACCENT, color: 'white' }}
                >
                  Featured
                </span>
              )}
            </div>

            {/* description + tags */}
            <div className="md:col-span-5 px-5 md:px-4 py-2 md:py-6">
              <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-black uppercase tracking-widest border border-gray-300 px-1.5 py-0.5 text-gray-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* links */}
            <div className="md:col-span-3 px-5 md:px-8 pb-5 pt-1 md:py-6 md:border-l border-black flex flex-row md:flex-col gap-4 md:gap-3 md:justify-center">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-60 transition-opacity"
                >
                  <ExternalLink size={10} /> Live Site
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-60 transition-opacity"
                >
                  <Github size={10} /> Source
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Experience ──────────────────────────────────────────── */
function Experience() {
  return (
    <section className="border-b border-black">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-3 px-5 md:px-12 py-8 md:py-12 border-b md:border-b-0 md:border-r border-black">
          <Label>05 — Experience</Label>
        </div>

        <div className="md:col-span-9 divide-y divide-black">
          {data.experience.map((job, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="px-5 md:px-12 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8"
            >
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                  {job.period}
                </p>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: ACCENT }}>
                  {job.company}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-black mb-2">
                  {job.role}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ────────────────────────────────────────── */
function Testimonials() {
  return (
    <section className="border-b border-black">
      <div className="px-5 md:px-12 py-3 border-b border-black">
        <Label>06 — Testimonials</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black">
        {data.testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            variants={fadeUp}
            className="px-5 md:px-10 py-8 md:py-10"
          >
            <div className="text-5xl font-black leading-none mb-4" style={{ color: ACCENT }}>
              "
            </div>
            <p className="text-sm text-gray-700 leading-relaxed italic mb-6">{t.text}</p>
            <Rule className="mb-4" />
            <div className="flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-8 h-8 grayscale border border-black object-cover shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-black">{t.name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Contact ─────────────────────────────────────────────── */
function Contact() {
  const { email, phone } = data.personal;
  const { github, linkedin, twitter } = data.socials;

  const secondaryLinks = [
    { label: 'GitHub', href: github, Icon: Github },
    { label: 'LinkedIn', href: linkedin, Icon: Linkedin },
    { label: 'Twitter', href: twitter, Icon: Twitter },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-3 px-5 md:px-12 py-8 md:py-12 border-b md:border-b-0 md:border-r border-black">
          <Label>07 — Contact</Label>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="md:col-span-9 px-5 md:px-12 py-8 md:py-12"
        >
          <h2
            className="font-black uppercase leading-none tracking-tight text-black mb-8"
            style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
          >
            Let's Work
            <br />
            <span style={{ color: ACCENT }}>Together.</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 px-5 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors duration-200"
            >
              <Mail size={12} />
              {email}
            </a>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-5 py-3 border border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-200"
              >
                <Phone size={12} />
                {phone}
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-5">
            {secondaryLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                <Icon size={11} />
                {label}
                <ArrowUpRight size={9} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────── */
function Footer() {
  const { name } = data.personal;
  return (
    <footer className="border-t border-black px-5 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-black">{name}</span>
      <span className="text-[10px] text-gray-400 uppercase tracking-widest">
        Swiss Typography — {new Date().getFullYear()}
      </span>
    </footer>
  );
}

/* ── Root export ─────────────────────────────────────────── */
export default function SwissTypography() {
  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
