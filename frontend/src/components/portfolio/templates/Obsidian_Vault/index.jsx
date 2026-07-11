import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Code2,
  Briefcase,
  Star,
  MessageSquare,
  Send,
  ChevronDown,
  Link2,
  FileText,
  FolderOpen,
  Network,
  BookOpen,
  Sparkles,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function GraphBackground() {
  const { portfolioData: data } = usePortfolio();

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.6)';
        ctx.fill();
      });

      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
}

function VaultCard({ children, className = '', glow = false }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div
      className={`relative rounded-xl border border-purple-500/20 bg-[#0d0d14]/80 backdrop-blur-sm ${
        glow ? 'shadow-[0_0_30px_rgba(168,85,247,0.1)]' : ''
      } ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      {children}
    </div>
  );
}

function NoteLink({ children, icon: Icon }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
      {Icon && <Icon size={10} />}
      {children}
    </span>
  );
}

function Hero() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      <GraphBackground />

      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-[#0a0a0f]" />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-6">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-wider">
            <Network size={12} className="inline mr-1.5" />
            Knowledge Vault
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-white">{data.personal.name.split(' ')[0]}</span>{' '}
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
            {data.personal.name.split(' ').slice(1).join(' ')}
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-xl md:text-2xl text-gray-400 mb-4 font-light">
          {data.personal.title}
        </motion.p>

        <motion.p variants={fadeUp} className="text-gray-500 mb-8 max-w-2xl mx-auto">
          {data.personal.tagline}
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-12">
          <NoteLink icon={MapPin}>{data.personal.location}</NoteLink>
          <NoteLink icon={Briefcase}>{data.stats.yearsExperience}+ years</NoteLink>
          <NoteLink icon={FolderOpen}>{data.stats.projectsCompleted} projects</NoteLink>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${data.socials.email}`}
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            <Mail size={16} className="inline mr-2" />
            Get in Touch
          </a>
          <a
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-lg border border-purple-500/30 hover:border-purple-500/60 text-purple-300 hover:text-white transition-all"
          >
            <Github size={16} className="inline mr-2" />
            View Code
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-16 animate-bounce"
        >
          <ChevronDown size={24} className="text-purple-400/60 mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function About() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section className="relative px-6 py-24">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
          <BookOpen size={20} className="text-purple-400" />
          <h2 className="text-3xl font-bold text-white">About</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <VaultCard className="p-8 md:p-10" glow>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col items-center md:items-start">
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl" />
                  <img
                    src={data.personal.avatar}
                    alt={data.personal.name}
                    className="relative w-32 h-32 rounded-full object-cover border-2 border-purple-500/40"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{data.personal.name}</h3>
                <p className="text-purple-400 text-sm mb-3">{data.personal.title}</p>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin size={14} />
                  {data.personal.location}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                  {data.personal.bio}
                </p>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: `${data.stats.yearsExperience}+`, label: 'Years', icon: Briefcase },
                    { value: `${data.stats.projectsCompleted}+`, label: 'Projects', icon: FolderOpen },
                    { value: `${data.stats.happyClients}+`, label: 'Clients', icon: Star },
                  ].map(({ value, label, icon: Icon }) => (
                    <div
                      key={label}
                      className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/10 text-center"
                    >
                      <Icon size={18} className="text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{value}</div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </VaultCard>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Skills() {
  const { portfolioData: data } = usePortfolio();

  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <section className="relative px-6 py-24">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
          <Code2 size={20} className="text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Skills</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
        </motion.div>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat} variants={fadeUp}>
              <VaultCard className="p-6">
                <h3 className="text-purple-400 text-xs font-mono uppercase tracking-widest mb-5">
                  [[{cat}]]
                </h3>
                <div className="space-y-4">
                  {data.skills
                    .filter((s) => s.category === cat)
                    .map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-gray-200 text-sm font-medium">{skill.name}</span>
                          <span className="text-purple-400 text-xs font-mono">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-purple-500/10 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </VaultCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function Projects() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section className="relative px-6 py-24">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
          <FolderOpen size={20} className="text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Projects</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
        </motion.div>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {(data.projects || []).map((project, index) => (
            <motion.div key={index} variants={fadeUp}>
              <VaultCard className="overflow-hidden h-full flex flex-col group hover:border-purple-500/40 transition-all">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/40 transition-all"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/40 transition-all"
                    >
                      <Github size={14} />
                    </a>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    <FileText size={14} className="text-purple-400" />
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <NoteLink key={tech}>{tech}</NoteLink>
                    ))}
                  </div>
                </div>
              </VaultCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function Experience() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section className="relative px-6 py-24">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
          <Briefcase size={20} className="text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Experience</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/40 via-purple-500/20 to-transparent hidden md:block" />

          <motion.div variants={stagger} className="space-y-8">
            {(data.experience || []).map((exp, index) => (
              <motion.div key={index} variants={fadeUp} className="md:pl-16 relative">
                <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#0a0a0f] hidden md:block shadow-[0_0_10px_rgba(168,85,247,0.5)]" />

                <VaultCard className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{exp.role}</h3>
                      <p className="text-purple-400 text-sm font-mono">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                </VaultCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function Testimonials() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section className="relative px-6 py-24">
      <motion.div
        className="max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
          <MessageSquare size={20} className="text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Testimonials</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
        </motion.div>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {(data.testimonials || []).map((t, index) => (
            <motion.div key={index} variants={fadeUp}>
              <VaultCard className="p-6 h-full flex flex-col">
                <Sparkles size={20} className="text-purple-400 mb-4" />
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-purple-500/10">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                  />
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-purple-400 text-xs font-mono">{t.role}</div>
                  </div>
                </div>
              </VaultCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function Contact() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section className="relative px-6 py-24">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-6">
          <Send size={20} className="text-purple-400" />
          <h2 className="text-3xl font-bold text-white">Contact</h2>
        </motion.div>

        <motion.p variants={fadeUp} className="text-gray-400 mb-10">
          Have a project in mind? Let's connect and build something amazing together.
        </motion.p>

        <motion.div variants={fadeUp}>
          <VaultCard className="p-8" glow>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg bg-purple-500/5 border border-purple-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg bg-purple-500/5 border border-purple-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-lg bg-purple-500/5 border border-purple-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 transition-all mb-4"
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-lg bg-purple-500/5 border border-purple-500/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500/50 transition-all mb-4 resize-none"
            />
            <button type="button" className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Send size={16} className="inline mr-2" />
              Send Message
            </button>
          </VaultCard>
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-center gap-4 mt-10">
          {[
            { icon: Github, href: data.socials.github, label: 'GitHub' },
            { icon: Linkedin, href: data.socials.linkedin, label: 'LinkedIn' },
            { icon: Twitter, href: data.socials.twitter, label: 'Twitter' },
            { icon: Mail, href: `mailto:${data.socials.email}`, label: 'Email' },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-white transition-all"
            >
              <Icon size={18} />
            </a>
          ))}
        </motion.div>

        <motion.p variants={fadeUp} className="text-gray-600 text-xs mt-10 font-mono">
          © {new Date().getFullYear()} {data.personal.name}. All rights reserved.
        </motion.p>
      </motion.div>
    </section>
  );
}

export default function ObsidianVault() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-900/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
      </div>
    </div>
  );
}
