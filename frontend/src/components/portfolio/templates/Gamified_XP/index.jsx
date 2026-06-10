import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  Briefcase,
  Code2,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Shield,
  Sparkles,
  Twitter,
  Wrench,
} from 'lucide-react';

void motion;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
};

const techIconMap = {
  react: Code2,
  'react native': Code2,
  'node.js': Wrench,
  express: Wrench,
  'express.js': Wrench,
  graphql: Sparkles,
  postgresql: Briefcase,
  mongodb: Briefcase,
  mysql: Briefcase,
  redis: Briefcase,
  stripe: Globe,
  'next.js': Code2,
};

const categoryIconMap = {
  frontend: Code2,
  backend: Wrench,
  devops: Shield,
  design: Sparkles,
};

function PixelPanel({ children, className = '' }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div
      className={`rounded-md border border-[#5a3a82] bg-[#11111a]/90 shadow-[0_0_0_2px_#2b1f40,0_0_0_4px_#1a1128,0_0_16px_rgba(212,175,55,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}

export default function GamifiedXP() {
  const { portfolioData: data } = usePortfolio();

  const { scrollYProgress } = useScroll();
  const xpProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 22 });
  const xpWidth = useTransform(xpProgress, [0, 1], ['0%', '100%']);
  const xpText = useTransform(xpProgress, (v) => `${Math.round(v * 100)}%`);
  const ringProgress = useTransform(xpProgress, [0.05, 0.25], [0, 1]);
  const ringOffset = useTransform(ringProgress, (v) => 326.7 - v * 326.7);

  const level = Math.max(1, Math.floor((data.stats?.yearsExperience ?? 0) * 2));
  const statValues = useMemo(
    () => [
      { label: 'STR', value: Math.min(100, 45 + (data.stats?.projectsCompleted ?? 0)) },
      { label: 'INT', value: Math.min(100, 40 + (data.stats?.yearsExperience ?? 0) * 10) },
      { label: 'DEX', value: Math.min(100, 50 + (data.stats?.happyClients ?? 0)) },
    ],
    []
  );

  const skillsByCategory = useMemo(() => {
    return (data.skills || []).reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f7f4ff]">
      <div className="fixed left-0 top-0 z-50 w-full px-3 pt-2 md:px-6">
        <PixelPanel className="overflow-hidden">
          <div className="relative h-8 bg-[#171321] font-mono text-xs">
            <motion.div
              style={{ width: xpWidth }}
              className="h-full bg-gradient-to-r from-[#45f882] via-[#77ff90] to-[#d4af37] drop-shadow-[0_0_8px_rgba(71,255,138,0.7)]"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
              <span className="font-bold tracking-wider text-[#0a0a0f]">XP</span>
              <motion.span className="font-bold text-[#0a0a0f]">{xpText}</motion.span>
            </div>
          </div>
        </PixelPanel>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-16 md:gap-10 md:px-8">
        <motion.section
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-4xl"
        >
          <PixelPanel className="p-5 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.55 }}
              className="grid gap-6 md:grid-cols-[280px_1fr]"
            >
              <div className="relative mx-auto w-full max-w-[280px]">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: [0.8, 1.08, 1], opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 rounded-xl bg-[#d4af37]/20 blur-2xl"
                />
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="relative h-[320px] w-full rounded-xl border-2 border-[#d4af37] object-cover shadow-[0_0_24px_rgba(212,175,55,0.45)]"
                />
              </div>

              <div className="space-y-5">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-wide md:text-5xl">{data.personal.name}</h1>
                  <p className="mt-2 inline-flex items-center rounded-md border border-[#5a3a82] bg-[#1a1427] px-3 py-1 font-mono text-sm text-[#d4af37]">
                    Class: {data.personal.title}
                  </p>
                  <p className="mt-3 font-mono text-lg text-[#8cf8aa]">Level {level}</p>
                </div>

                <div className="space-y-3">
                  {statValues.map((stat) => (
                    <div key={stat.label}>
                      <div className="mb-1 flex justify-between font-mono text-xs text-[#c7bddf]">
                        <span>{stat.label}</span>
                        <span>{stat.value}</span>
                      </div>
                      <div className="h-2.5 rounded bg-[#231a33]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded bg-gradient-to-r from-[#6d47a5] to-[#d4af37]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </PixelPanel>
        </motion.section>

        <motion.section initial="hidden" whileInView="show" viewport={{ once: true }} variants={itemVariants}>
          <PixelPanel className="p-5 md:p-8">
            <div className="grid gap-6 md:grid-cols-[240px_1fr] md:items-center">
              <div className="mx-auto">
                <div className="relative h-40 w-40">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#2f2345" strokeWidth="8" />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="8"
                      strokeDasharray="326.7"
                      style={{ strokeDashoffset: ringOffset }}
                    />
                  </svg>
                  <img
                    src={data.personal.avatar}
                    alt={data.personal.name}
                    className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#6d47a5] object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="mb-3 text-2xl font-bold">Profile Panel</h2>
                <p className="text-sm leading-relaxed text-[#d6cee9]">{data.personal.bio}</p>
                <p className="mt-4 inline-flex items-center gap-2 rounded border border-[#5a3a82] bg-[#1a1427] px-3 py-1.5 text-sm">
                  <MapPin size={16} className="text-[#d4af37]" /> {data.personal.location}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(data.stats || {}).map(([key, value]) => (
                    <span key={key} className="rounded border border-[#5a3a82] bg-[#161222] px-2.5 py-1 font-mono text-xs">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </PixelPanel>
        </motion.section>

        <section>
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Skill Tree</h2>

          <div className="hidden gap-4 md:grid md:grid-cols-2">
            {Object.entries(skillsByCategory).map(([category, skills]) => {
              const Icon = categoryIconMap[category.toLowerCase()] || Sparkles;
              return (
                <motion.div
                  key={category}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <PixelPanel className="p-4">
                    <div className="mb-3 inline-flex items-center gap-2 rounded border border-[#5a3a82] bg-[#1b1530] px-3 py-1.5 font-mono text-sm">
                      <Icon size={16} className="text-[#d4af37]" />
                      {category}
                    </div>
                    <svg className="pointer-events-none h-12 w-full" viewBox="0 0 400 48" preserveAspectRatio="none">
                      <line x1="200" y1="0" x2="200" y2="16" stroke="#5a3a82" strokeWidth="2" />
                      <line x1="40" y1="16" x2="360" y2="16" stroke="#5a3a82" strokeWidth="2" />
                    </svg>
                    <div className="grid grid-cols-2 gap-3">
                      {skills.map((skill) => (
                        <motion.div key={skill.name} variants={itemVariants} className="rounded border border-[#4a3169] bg-[#13101d] p-2.5">
                          <p className="text-sm font-semibold">{skill.name}</p>
                          <div className="mt-2 h-1.5 rounded bg-[#2a203b]">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.45 }}
                              className="h-full rounded bg-gradient-to-r from-[#8f6bff] to-[#d4af37]"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </PixelPanel>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-3 md:hidden">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <details key={category} className="rounded border border-[#5a3a82] bg-[#11111a] p-3">
                <summary className="cursor-pointer font-mono text-sm text-[#d4af37]">{category}</summary>
                <div className="mt-3 space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.name} className="rounded border border-[#433058] bg-[#161222] p-2">
                      <p className="text-sm">{skill.name}</p>
                      <div className="mt-1.5 h-1.5 rounded bg-[#2a203b]">
                        <div className="h-full rounded bg-gradient-to-r from-[#8f6bff] to-[#d4af37]" style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Quest Board</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-4 md:grid-cols-2"
          >
            {(data.projects || []).map((project) => (
              <motion.article
                key={project.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="rounded-md border border-[#6a4a1f] bg-gradient-to-br from-[#1d1711] to-[#120f19] p-4 shadow-[0_0_0_1px_#4d3a20,0_0_16px_rgba(212,175,55,0.18)] transition"
              >
                <h3 className="text-xl font-bold text-[#f6d173]">{project.title}</h3>
                <p className="mt-2 text-sm text-[#e4dcc9]">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(project.techStack || []).map((tech) => {
                    const TechIcon = techIconMap[tech.toLowerCase()] || Sparkles;
                    return (
                      <span key={tech} className="inline-flex items-center gap-1 rounded border border-[#5a3a82] bg-[#1b1530] px-2 py-1 text-xs">
                        <TechIcon size={12} className="text-[#8cf8aa]" />
                        {tech}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-[#41c974] bg-[#183324] px-3 py-1.5 text-xs font-bold text-[#9bf8b2] hover:drop-shadow-[0_0_8px_rgba(112,255,160,0.75)]"
                  >
                    Accept Quest
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded border border-[#5a3a82] bg-[#1a1427] px-3 py-1.5 text-xs font-bold text-[#d7c7ff] hover:drop-shadow-[0_0_8px_rgba(172,139,255,0.65)]"
                  >
                    View Scroll
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Level Progression Log</h2>
          <div className="relative pl-6">
            <div className="absolute left-2 top-0 h-full w-0.5 bg-[#4a3368]" />
            <div className="space-y-4">
              {(data.experience || []).map((exp) => (
                <motion.div
                  key={`${exp.role}-${exp.company}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="relative"
                >
                  <span className="absolute -left-[25px] top-4 inline-block h-3 w-3 rounded-full border border-[#d4af37] bg-[#0a0a0f]" />
                  <PixelPanel className="p-4">
                    <p className="font-mono text-xs text-[#8cf8aa]">{exp.period}</p>
                    <h3 className="mt-1 text-lg font-bold">{exp.role}</h3>
                    <p className="text-sm text-[#f2cf7d]">{exp.company}</p>
                    <p className="mt-2 text-sm text-[#d9d0eb]">{exp.description}</p>
                  </PixelPanel>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Achievement Badges</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-4 md:grid-cols-2"
          >
            {(data.testimonials || []).map((testimony) => (
              <motion.div
                key={testimony.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-md border border-[#5a3a82] bg-[#151222] p-4"
              >
                <motion.div
                  className="absolute inset-y-0 -left-10 w-8 bg-white/15"
                  whileHover={{ x: 360 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative">
                  <div className="mb-2 inline-flex items-center gap-2 rounded border border-[#5a3a82] bg-[#1b1530] px-2.5 py-1 text-xs font-mono text-[#d4af37]">
                    <Shield size={14} /> Achievement Unlocked
                  </div>
                  <p className="text-sm text-[#ebe4ff]">"{testimony.text}"</p>
                  <p className="mt-3 text-sm font-semibold">{testimony.name}</p>
                  <p className="text-xs text-[#d4af37]">{testimony.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <PixelPanel className="mx-auto max-w-3xl p-6 text-center">
            <h2 className="text-2xl font-extrabold text-[#f7d777] md:text-3xl">Begin a new adventure?</h2>
            <p className="mt-2 text-sm text-[#d6cee9]">{data.personal.tagline}</p>

            <div className="mt-5 flex justify-center gap-3">
              <a
                href={data.socials.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                className="rounded border border-[#5a3a82] bg-[#1a1427] p-2 text-[#d9c9ff] hover:drop-shadow-[0_0_8px_rgba(165,128,255,0.8)]"
              >
                <Code2 size={18} />
              </a>
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                className="rounded border border-[#5a3a82] bg-[#1a1427] p-2 text-[#d9c9ff] hover:drop-shadow-[0_0_8px_rgba(165,128,255,0.8)]"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={data.socials.twitter}
                target="_blank"
                rel="noreferrer"
                title="Twitter"
                className="rounded border border-[#5a3a82] bg-[#1a1427] p-2 text-[#d9c9ff] hover:drop-shadow-[0_0_8px_rgba(165,128,255,0.8)]"
              >
                <Twitter size={18} />
              </a>
            </div>

            <a
              href={`mailto:${data.socials.email}`}
              className="mt-5 inline-flex items-center gap-2 rounded border border-[#d4af37] bg-[#2b220e] px-5 py-2.5 font-semibold text-[#f4d98d] hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
            >
              <Mail size={16} />
              Send Message
            </a>
          </PixelPanel>
        </motion.section>
      </main>
    </div>
  );
}
