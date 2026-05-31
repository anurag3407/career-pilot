import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  FileCode2,
  FileJson,
  FileText,
  Github,
  Globe2,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Monitor,
  Play,
  Quote,
  Search,
  Send,
  Star,
  Terminal,
  Twitter,
  User,
  Zap,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const sectionFiles = [
  { id: 'hero', file: 'hero.jsx', icon: FileCode2, accent: 'text-[#4fc1ff]' },
  { id: 'about', file: 'about.md', icon: FileText, accent: 'text-[#dcdcaa]' },
  { id: 'skills', file: 'skills.json', icon: FileJson, accent: 'text-[#ce9178]' },
  { id: 'projects', file: 'projects.ts', icon: Code2, accent: 'text-[#4ec9b0]' },
  { id: 'experience', file: 'experience.tsx', icon: Briefcase, accent: 'text-[#c586c0]' },
  { id: 'testimonials', file: 'testimonials.yml', icon: Quote, accent: 'text-[#b5cea8]' },
  { id: 'contact', file: 'contact.html', icon: Mail, accent: 'text-[#569cd6]' },
];

const activityItems = [
  { label: 'Explorer', href: '#hero', icon: FileCode2 },
  { label: 'Search Skills', href: '#skills', icon: Search },
  { label: 'GitHub Profile', href: data.socials.github, icon: Github, external: true },
  { label: 'Terminal Contact', href: '#contact', icon: Terminal },
  { label: 'About Profile', href: '#about', icon: User },
];

const socials = [
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'twitter', label: 'Twitter', icon: Twitter },
  { key: 'email', label: 'Email', icon: Mail },
];

const statMeta = {
  yearsExperience: { label: 'Years', icon: Briefcase },
  projectsCompleted: { label: 'Projects', icon: Code2 },
  happyClients: { label: 'Clients', icon: Star },
};

const skillIcons = {
  Frontend: Monitor,
  Backend: Database,
  DevOps: Zap,
  Design: Layers,
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.55, ease: 'easeOut' },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, amount: 0.18 },
};

const item = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' },
};

const Motion = motion;

function getSocialHref(key, value) {
  return key === 'email' ? `mailto:${value}` : value;
}

function CodeLine({ number, children }) {
  return (
    <div className="grid grid-cols-[2.25rem_1fr] gap-4 text-sm leading-7 sm:text-[15px]">
      <span className="select-none text-right font-mono text-[#6e7681]">{number}</span>
      <code className="min-w-0 font-mono text-[#d4d4d4]">{children}</code>
    </div>
  );
}

function SectionTitle({ file, title, icon }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-2 flex items-center gap-2 font-mono text-xs text-[#6a9955]">
          {React.createElement(icon, { className: 'h-4 w-4' })}
          <span>// src/portfolio/{file}</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
      </div>
    </div>
  );
}

export default function VSCodeTheme() {
  const skillsByCategory = data.skills.reduce((groups, skill) => {
    const category = skill.category || 'Core';
    return { ...groups, [category]: [...(groups[category] || []), skill] };
  }, {});

  const featuredSkills = data.skills.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#cccccc] selection:bg-[#264f78] selection:text-white">
      <div className="mx-auto min-h-screen max-w-[1500px] bg-[#1e1e1e] shadow-2xl shadow-black/60">
        <header className="sticky top-0 z-40 border-b border-[#2d2d2d] bg-[#181818]/95 backdrop-blur">
          <div className="flex h-9 items-center justify-between gap-4 px-3 text-xs text-[#cccccc]">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 hidden text-[#858585] sm:inline">Career Pilot - VS Code Portfolio</span>
            </div>
            <div className="hidden min-w-0 max-w-xl flex-1 items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#252526] px-3 py-1 text-[#858585] md:flex">
              <Search className="h-3.5 w-3.5" />
              <span className="truncate">{data.personal.name} / {data.personal.title}</span>
            </div>
            <div className="flex items-center gap-2 text-[#858585]">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">main</span>
            </div>
          </div>

          <div className="flex overflow-x-auto border-t border-[#2d2d2d] bg-[#252526]">
            {sectionFiles.map(({ id, file, icon, accent }, index) => (
              <a
                key={id}
                href={`#${id}`}
                className={`flex min-w-max items-center gap-2 border-r border-[#1e1e1e] px-4 py-2 font-mono text-xs transition hover:bg-[#2d2d2d] ${
                  index === 0 ? 'border-t-2 border-t-[#007acc] bg-[#1e1e1e] text-white' : 'text-[#a9a9a9]'
                }`}
              >
                {React.createElement(icon, { className: `h-3.5 w-3.5 ${accent}` })}
                {file}
              </a>
            ))}
          </div>
        </header>

        <div className="grid min-h-screen lg:grid-cols-[56px_280px_1fr]">
          <aside className="hidden border-r border-[#2d2d2d] bg-[#333333] py-4 text-[#b9b9b9] lg:block">
            <div className="flex flex-col items-center gap-6">
              {activityItems.map((activity, index) => (
                <a
                  key={activity.label}
                  href={activity.href}
                  target={activity.external ? '_blank' : undefined}
                  rel={activity.external ? 'noreferrer' : undefined}
                  title={activity.label}
                  className={`group relative rounded-md p-2 transition hover:bg-white/10 hover:text-white ${
                    index === 0 ? 'border-l-2 border-white text-white' : ''
                  }`}
                  aria-label={activity.label}
                >
                  {React.createElement(activity.icon, { className: 'h-6 w-6' })}
                  <span className="pointer-events-none absolute left-12 top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded bg-[#252526] px-2 py-1 text-xs text-white shadow-lg ring-1 ring-[#3c3c3c] group-hover:block">
                    {activity.label}
                  </span>
                </a>
              ))}
            </div>
          </aside>

          <aside className="hidden border-r border-[#2d2d2d] bg-[#252526] lg:block">
            <div className="border-b border-[#2d2d2d] px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-[#bbbbbb]">
              Explorer
            </div>
            <div className="px-3 py-4">
              <div className="mb-3 flex items-center gap-1 font-mono text-xs uppercase text-[#cccccc]">
                <ChevronRight className="h-4 w-4 rotate-90" />
                Portfolio
              </div>
              <nav className="space-y-1">
                {sectionFiles.map(({ id, file, icon, accent }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="flex items-center gap-2 rounded px-3 py-2 font-mono text-sm text-[#cccccc] transition hover:bg-[#37373d]"
                  >
                    {React.createElement(icon, { className: `h-4 w-4 ${accent}` })}
                    <span>{file}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="mx-3 mt-5 rounded border border-[#3c3c3c] bg-[#1e1e1e] p-4">
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="h-12 w-12 rounded-full border border-[#007acc]/60 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{data.personal.name}</p>
                  <p className="truncate text-xs text-[#858585]">{data.personal.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {Object.entries(data.stats).map(([key, value]) => {
                  const meta = statMeta[key] || { label: key, icon: Star };
                  return (
                    <div key={key} className="rounded bg-[#252526] px-2 py-2">
                      <p className="text-lg font-semibold text-[#4fc1ff]">{value}+</p>
                      <p className="text-[10px] uppercase text-[#858585]">{meta.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="min-w-0 bg-[#1e1e1e]">
            <section id="hero" className="scroll-mt-24 border-b border-[#2d2d2d]">
              <div className="grid gap-0 xl:grid-cols-[1fr_420px]">
                <motion.div
                  className="px-5 py-10 sm:px-8 lg:px-10 xl:py-16"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                >
                  <div className="mb-6 inline-flex items-center gap-2 rounded border border-[#3c3c3c] bg-[#252526] px-3 py-2 font-mono text-xs text-[#b5cea8]">
                    <Play className="h-3.5 w-3.5 fill-[#89d185]" />
                    portfolio.dev is running
                  </div>

                  <div className="overflow-hidden rounded-lg border border-[#3c3c3c] bg-[#0d1117] shadow-2xl shadow-black/40">
                    <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-3">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#858585]">
                        <FileCode2 className="h-4 w-4 text-[#4fc1ff]" />
                        hero.jsx
                      </div>
                      <div className="flex items-center gap-2 text-[#858585]">
                        <span className="h-2 w-2 rounded-full bg-[#f14c4c]" />
                        <span className="h-2 w-2 rounded-full bg-[#cca700]" />
                        <span className="h-2 w-2 rounded-full bg-[#89d185]" />
                      </div>
                    </div>
                    <div className="px-2 py-5 sm:px-4">
                      <CodeLine number="01">
                        <span className="text-[#c586c0]">const</span> <span className="text-[#4fc1ff]">developer</span> = {'{'}
                      </CodeLine>
                      <CodeLine number="02">
                        &nbsp;&nbsp;<span className="text-[#9cdcfe]">name</span>: <span className="text-[#ce9178]">"{data.personal.name}"</span>,
                      </CodeLine>
                      <CodeLine number="03">
                        &nbsp;&nbsp;<span className="text-[#9cdcfe]">title</span>: <span className="text-[#ce9178]">"{data.personal.title}"</span>,
                      </CodeLine>
                      <CodeLine number="04">
                        &nbsp;&nbsp;<span className="text-[#9cdcfe]">location</span>: <span className="text-[#ce9178]">"{data.personal.location}"</span>,
                      </CodeLine>
                      <CodeLine number="05">
                        &nbsp;&nbsp;<span className="text-[#9cdcfe]">tagline</span>: <span className="text-[#ce9178]">"{data.personal.tagline}"</span>,
                      </CodeLine>
                      <CodeLine number="06">{'};'}</CodeLine>
                    </div>
                  </div>

                  <div className="mt-8 max-w-4xl">
                    <p className="mb-3 font-mono text-sm text-[#6a9955]">// Hello world</p>
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                      {data.personal.name}
                    </h1>
                    <p className="mt-4 text-xl text-[#4fc1ff] sm:text-2xl">{data.personal.title}</p>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-[#cccccc] sm:text-lg">{data.personal.bio}</p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={`mailto:${data.socials.email}`}
                        className="inline-flex items-center gap-2 rounded bg-[#007acc] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#007acc]/20 transition hover:bg-[#1188d8]"
                      >
                        <Send className="h-4 w-4" />
                        Contact Me
                      </a>
                      <a
                        href={data.socials.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded border border-[#3c3c3c] bg-[#252526] px-5 py-3 text-sm font-semibold text-[#cccccc] transition hover:border-[#007acc] hover:text-white"
                      >
                        <Github className="h-4 w-4" />
                        View Source
                      </a>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="border-t border-[#2d2d2d] bg-[#181818] p-5 xl:border-l xl:border-t-0 xl:p-6"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
                >
                  <div className="rounded-lg border border-[#3c3c3c] bg-[#1e1e1e]">
                    <div className="border-b border-[#3c3c3c] px-4 py-3 font-mono text-xs text-[#858585]">
                      Terminal
                    </div>
                    <div className="space-y-3 p-4 font-mono text-sm">
                      <p><span className="text-[#89d185]">$</span> whoami</p>
                      <p className="text-[#dcdcaa]">{data.personal.name}</p>
                      <p><span className="text-[#89d185]">$</span> npm run stats</p>
                      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                        {Object.entries(data.stats).map(([key, value]) => {
                          const meta = statMeta[key] || { label: key, icon: Star };
                          return (
                            <div key={key} className="flex items-center gap-3 rounded border border-[#30363d] bg-[#0d1117] p-3">
                              {React.createElement(meta.icon, { className: 'h-5 w-5 text-[#4fc1ff]' })}
                              <div>
                                <p className="text-xl font-semibold text-white">{value}+</p>
                                <p className="text-xs text-[#858585]">{meta.label}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p><span className="text-[#89d185]">$</span> status --availability</p>
                      <p className="flex items-center gap-2 text-[#89d185]">
                        <CheckCircle2 className="h-4 w-4" />
                        ready for ambitious builds
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-lg border border-[#3c3c3c] bg-[#0d1117]">
                    <img src={data.personal.avatar} alt={data.personal.name} className="h-72 w-full object-cover" />
                    <div className="border-t border-[#30363d] p-4">
                      <div className="flex items-center gap-2 text-sm text-[#cccccc]">
                        <MapPin className="h-4 w-4 text-[#4fc1ff]" />
                        {data.personal.location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            <div className="space-y-0">
              <motion.section id="about" className="scroll-mt-24 border-b border-[#2d2d2d] px-5 py-12 sm:px-8 lg:px-10" {...fadeUp}>
                <SectionTitle file="about.md" title="About" icon={FileText} />
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-6">
                    <p className="mb-4 font-mono text-sm text-[#569cd6]"># {data.personal.name}</p>
                    <p className="text-lg leading-8 text-[#d4d4d4]">{data.personal.bio}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {featuredSkills.map((skill) => (
                        <span key={skill.name} className="rounded border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-1.5 font-mono text-xs text-[#4ec9b0]">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#3c3c3c] bg-[#0d1117] p-6">
                    <p className="mb-4 font-mono text-sm text-[#6a9955]">// runtime profile</p>
                    <div className="space-y-4">
                      {[
                        ['role', data.personal.title],
                        ['location', data.personal.location],
                        ['projects', `${data.stats.projectsCompleted}+ completed`],
                        ['clients', `${data.stats.happyClients}+ happy clients`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-start justify-between gap-4 border-b border-[#30363d] pb-3">
                          <span className="font-mono text-sm text-[#9cdcfe]">{label}</span>
                          <span className="text-right text-sm text-[#dcdcaa]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section id="skills" className="scroll-mt-24 border-b border-[#2d2d2d] px-5 py-12 sm:px-8 lg:px-10" {...stagger}>
                <SectionTitle file="skills.json" title="Skills" icon={FileJson} />
                <div className="grid gap-5 lg:grid-cols-2">
                  {Object.entries(skillsByCategory).map(([category, skills]) => {
                    const skillIcon = skillIcons[category] || Code2;
                    return (
                      <motion.div key={category} className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-5" variants={item}>
                        <div className="mb-5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {React.createElement(skillIcon, { className: 'h-5 w-5 text-[#4fc1ff]' })}
                            <h3 className="font-mono text-lg text-white">{category}</h3>
                          </div>
                          <span className="font-mono text-xs text-[#858585]">{skills.length} modules</span>
                        </div>
                        <div className="space-y-4">
                          {skills.map((skill) => (
                            <div key={skill.name}>
                              <div className="mb-2 flex items-center justify-between font-mono text-sm">
                                <span className="text-[#d4d4d4]">{skill.name}</span>
                                <span className="text-[#b5cea8]">{skill.level}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-[#1e1e1e]">
                                <motion.div
                                  className="h-full rounded-full bg-gradient-to-r from-[#007acc] via-[#4fc1ff] to-[#4ec9b0]"
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.level}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.9, ease: 'easeOut' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>

              <motion.section id="projects" className="scroll-mt-24 border-b border-[#2d2d2d] px-5 py-12 sm:px-8 lg:px-10" {...stagger}>
                <SectionTitle file="projects.ts" title="Projects" icon={Code2} />
                <div className="grid gap-6 lg:grid-cols-2">
                  {data.projects.map((project, index) => (
                    <motion.article
                      key={project.title}
                      className="group overflow-hidden rounded-lg border border-[#3c3c3c] bg-[#252526] transition hover:-translate-y-1 hover:border-[#007acc] hover:shadow-2xl hover:shadow-black/30"
                      variants={item}
                    >
                      <div className="relative h-56 overflow-hidden bg-[#0d1117]">
                        <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e]/20 to-transparent" />
                        <div className="absolute left-4 top-4 rounded bg-[#007acc] px-2 py-1 font-mono text-xs text-white">
                          project_{String(index + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                        <p className="mt-3 leading-7 text-[#cccccc]">{project.description}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span key={tech} className="rounded border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1 font-mono text-xs text-[#ce9178]">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded bg-[#007acc] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1188d8]">
                            <Globe2 className="h-4 w-4" />
                            Live
                          </a>
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded border border-[#3c3c3c] bg-[#1e1e1e] px-4 py-2 text-sm font-semibold text-[#cccccc] transition hover:border-[#007acc] hover:text-white">
                            <Github className="h-4 w-4" />
                            Code
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.section>

              <motion.section id="experience" className="scroll-mt-24 border-b border-[#2d2d2d] px-5 py-12 sm:px-8 lg:px-10" {...fadeUp}>
                <SectionTitle file="experience.tsx" title="Experience" icon={Briefcase} />
                <div className="relative space-y-5 lg:pl-8">
                  <div className="absolute left-3 top-3 hidden h-[calc(100%-1.5rem)] w-px bg-[#3c3c3c] lg:block" />
                  {data.experience.map((job) => (
                    <motion.article
                      key={`${job.role}-${job.company}`}
                      className="relative rounded-lg border border-[#3c3c3c] bg-[#252526] p-5"
                      whileHover={{ x: 6 }}
                      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                    >
                      <span className="absolute -left-[34px] top-6 hidden h-3 w-3 rounded-full border-2 border-[#1e1e1e] bg-[#4fc1ff] lg:block" />
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{job.role}</h3>
                          <p className="mt-1 font-mono text-sm text-[#4fc1ff]">{job.company}</p>
                        </div>
                        <span className="rounded border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-1 font-mono text-xs text-[#b5cea8]">
                          {job.period}
                        </span>
                      </div>
                      <p className="mt-4 leading-7 text-[#cccccc]">{job.description}</p>
                    </motion.article>
                  ))}
                </div>
              </motion.section>

              <motion.section id="testimonials" className="scroll-mt-24 border-b border-[#2d2d2d] px-5 py-12 sm:px-8 lg:px-10" {...stagger}>
                <SectionTitle file="testimonials.yml" title="Testimonials" icon={Quote} />
                <div className="grid gap-5 lg:grid-cols-2">
                  {data.testimonials.map((testimonial) => (
                    <motion.figure key={testimonial.name} className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-6" variants={item}>
                      <Quote className="mb-4 h-7 w-7 text-[#4fc1ff]" />
                      <blockquote className="leading-7 text-[#d4d4d4]">{testimonial.text}</blockquote>
                      <figcaption className="mt-6 flex items-center gap-3">
                        <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-white">{testimonial.name}</p>
                          <p className="text-sm text-[#858585]">{testimonial.role}</p>
                        </div>
                      </figcaption>
                    </motion.figure>
                  ))}
                </div>
              </motion.section>

              <motion.section id="contact" className="scroll-mt-24 px-5 py-12 sm:px-8 lg:px-10" {...fadeUp}>
                <SectionTitle file="contact.html" title="Contact" icon={Mail} />
                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-6">
                    <p className="font-mono text-sm text-[#6a9955]">// open channels</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Build something with {data.personal.name}</h3>
                    <p className="mt-3 leading-7 text-[#cccccc]">{data.personal.tagline}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      {socials.map(({ key, label, icon }) => {
                        const value = data.socials[key];
                        if (!value) return null;
                        return (
                          <a
                            key={key}
                            href={getSocialHref(key, value)}
                            target={key === 'email' ? undefined : '_blank'}
                            rel={key === 'email' ? undefined : 'noreferrer'}
                            className="flex min-w-0 items-center gap-3 rounded border border-[#3c3c3c] bg-[#1e1e1e] p-3 text-sm text-[#cccccc] transition hover:border-[#007acc] hover:text-white"
                          >
                            {React.createElement(icon, { className: 'h-4 w-4 shrink-0 text-[#4fc1ff]' })}
                            <span className="font-semibold">{label}</span>
                            <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-[#858585]" />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <form className="rounded-lg border border-[#3c3c3c] bg-[#0d1117] p-6">
                    <div className="mb-5 flex items-center gap-2 border-b border-[#30363d] pb-3 font-mono text-sm text-[#858585]">
                      <Terminal className="h-4 w-4 text-[#4fc1ff]" />
                      new-message.sh
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Your name"
                        className="rounded border border-[#3c3c3c] bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#858585] focus:border-[#007acc]"
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        className="rounded border border-[#3c3c3c] bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#858585] focus:border-[#007acc]"
                      />
                    </div>
                    <textarea
                      rows="5"
                      placeholder="Tell me about the project"
                      className="mt-4 w-full rounded border border-[#3c3c3c] bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#858585] focus:border-[#007acc]"
                    />
                    <button
                      type="button"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-[#007acc] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1188d8] sm:w-auto"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </button>
                  </form>
                </div>
              </motion.section>
            </div>

            <footer className="border-t border-[#2d2d2d] bg-[#007acc] px-4 py-2 font-mono text-xs text-white">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>main</span>
                <span>{data.projects.length} projects</span>
                <span>{data.personal.location}</span>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
