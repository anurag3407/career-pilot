import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github, Linkedin, Twitter, Mail, ExternalLink,
  CheckCircle, XCircle, Clock, ChevronRight, MapPin,
  Zap, Star, Send, ArrowUp, Menu, X, Terminal,
  GitBranch, Activity, Package, Globe, Code2, Layers
} from "lucide-react";

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ status = "ready", size = "sm" }) {
  const { portfolioData: data } = usePortfolio();

  const map = {
    ready:    { label: "Ready",    cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" },
    building: { label: "Building", cls: "bg-amber-500/20  text-amber-400  border-amber-500/40"  },
    error:    { label: "Error",    cls: "bg-red-500/20    text-red-400    border-red-500/40"    },
  };
  const s = map[status];
  const Icon = status === "ready" ? CheckCircle : status === "error" ? XCircle : Clock;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono font-semibold border text-xs ${s.cls}`}>
      <Icon size={9} />{s.label}
    </span>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const { portfolioData: data } = usePortfolio();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About","Skills","Projects","Experience","Testimonials","Contact"];
  return (
    <motion.nav initial={{ y: -56, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled ? "bg-black/95 border-zinc-800 backdrop-blur-xl" : "bg-black/80 border-zinc-900 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-sm" />
          </div>
          <span className="text-white font-mono font-bold text-sm">{data.personal?.name?.split(" ")[0] ?? "Portfolio"}</span>
          <Badge status="ready" />
        </div>
        <div className="hidden md:flex items-center gap-5">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-zinc-500 hover:text-white text-xs font-mono transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href={`mailto:${data.socials?.email ?? "#"}`} className="hidden sm:inline-flex bg-white text-black text-xs font-mono font-bold px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity">
            Hire Me →
          </a>
          <button className="md:hidden text-zinc-400" onClick={() => setOpen(v => !v)}>
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            className="md:hidden bg-black border-t border-zinc-900 overflow-hidden">
            <div className="px-4 py-3 flex flex-col gap-3">
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
                  className="text-zinc-400 hover:text-white text-sm font-mono">{l}</a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function TerminalLine({ children, color = "text-emerald-400", delay = 0 }) {
  const { portfolioData: data } = usePortfolio();

  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}}
      className={`font-mono text-xs leading-6 flex items-center gap-2 ${color}`}>
      {children}
    </motion.div>
  );
}

function Hero() {
  const { portfolioData: data } = usePortfolio();

  const name = data.personal?.name ?? "Your Name";
  const title = data.personal?.title ?? "Full Stack Developer";
  const bio = data.personal?.bio ?? "Building things for the web.";

  return (
    <section id="hero" className="bg-black relative overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-0">
        {/* Top breadcrumb bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-10 font-mono text-xs text-zinc-500">
          <span className="text-zinc-700">vercel.com</span>
          <ChevronRight size={12} className="text-zinc-700" />
          <span className="text-zinc-500">{name.toLowerCase().replace(" ", "-")}</span>
          <ChevronRight size={12} className="text-zinc-700" />
          <span className="text-white">portfolio</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">Live</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left — 3 cols */}
          <div className="lg:col-span-3 pb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono text-xs">Available for work</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none mb-4 tracking-tight">
              {name}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
              className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-emerald-500" />
              <span className="text-emerald-400 font-mono text-base font-semibold">{title}</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}
              className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-lg font-mono">
              {bio}
            </motion.p>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 mb-8 max-w-sm">
              {[
                { v: data.stats?.yearsExperience ?? "5+", l: "Years Exp" },
                { v: data.stats?.projectsCompleted ?? "48+", l: "Projects" },
                { v: data.stats?.happyClients ?? "32+", l: "Clients" },
              ].map(s => (
                <div key={s.l} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-white text-2xl font-black font-mono">{s.v}</div>
                  <div className="text-zinc-600 text-xs font-mono mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.46 }}
              className="flex flex-wrap gap-3 mb-6">
              <a href="#projects" className="inline-flex items-center gap-2 bg-white text-black font-mono font-bold text-sm px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity">
                <Zap size={14}/> View Projects
              </a>
              {data.socials?.github && (
                <a href={data.socials.github} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-zinc-700 text-white font-mono font-bold text-sm px-5 py-2.5 rounded-lg hover:border-zinc-500 transition-colors">
                  <Github size={14}/> GitHub
                </a>
              )}
            </motion.div>

            {data.personal?.location && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
                className="flex items-center gap-2 text-zinc-600 font-mono text-xs">
                <MapPin size={11}/> {data.personal.location}
              </motion.div>
            )}
          </div>

          {/* Right — 2 cols: dashboard panel */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-3 pb-8">

            {/* Terminal card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-zinc-500 text-xs font-mono ml-2 flex items-center gap-1.5">
                  <Terminal size={10}/> build log
                </span>
                <div className="ml-auto"><Badge status="ready" /></div>
              </div>
              <div className="p-4 space-y-0.5">
                {[
                  { t: "▶ Cloning repository...", c: "text-zinc-500", d: 300 },
                  { t: "npm install", c: "text-zinc-400", d: 700 },
                  { t: "✓ 558 packages installed", c: "text-zinc-400", d: 1100 },
                  { t: "npm run build", c: "text-zinc-400", d: 1400 },
                  { t: "✓ Build completed in 1.2s", c: "text-emerald-400", d: 1900 },
                  { t: "✓ Deploying to production...", c: "text-emerald-400", d: 2400 },
                  { t: "🚀 Deployment live!", c: "text-emerald-300", d: 2900 },
                ].map((l, i) => <TerminalLine key={i} color={l.c} delay={l.d}>{l.t}</TerminalLine>)}
              </div>
            </div>

            {/* Deployment URL */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Deployment</span>
                <Badge status="ready" />
              </div>
              <div className="text-blue-400 font-mono text-sm break-all">
                https://{name.toLowerCase().replace(/\s+/g, "-")}.vercel.app
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-900">
                <div className="text-xs font-mono text-zinc-600">Branch: <span className="text-zinc-400">main</span></div>
                <div className="text-xs font-mono text-zinc-600">Region: <span className="text-zinc-400">sfo1</span></div>
              </div>
            </div>

            {/* Mini activity */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-400 font-mono text-xs font-semibold flex items-center gap-1.5"><Activity size={11}/> Activity</span>
                <span className="text-zinc-600 font-mono text-xs">Last 7 days</span>
              </div>
              <div className="flex items-end gap-1 h-10">
                {[4,7,3,8,6,9,10].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-500/30 rounded-sm transition-all hover:bg-emerald-400/60"
                    style={{ height: `${h * 10}%` }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom metrics bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-900">
          {[
            { icon: <GitBranch size={12}/>, label: "Deployments", value: "143" },
            { icon: <Package size={12}/>,   label: "Build Time",  value: "1.2s" },
            { icon: <Globe size={12}/>,     label: "Uptime",      value: "99.9%" },
            { icon: <Code2 size={12}/>,     label: "Functions",   value: "12" },
          ].map(m => (
            <div key={m.label} className="px-4 sm:px-6 py-4 flex items-center gap-3">
              <div className="text-zinc-600">{m.icon}</div>
              <div>
                <div className="text-white font-mono text-sm font-bold">{m.value}</div>
                <div className="text-zinc-600 font-mono text-xs">{m.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ file }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="flex items-center gap-3 mb-10">
      <span className="text-zinc-700 font-mono text-xs">~/</span>
      <span className="text-emerald-400 font-mono text-sm font-bold">{file}</span>
      <div className="flex-1 h-px bg-zinc-900" />
    </motion.div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section id="about" className="bg-zinc-950 py-20 px-4 sm:px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <SectionHeading file="about.json" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Avatar */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-black border border-zinc-900 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500/40 mb-4 shadow-lg shadow-emerald-500/10">
              {data.personal?.avatar
                ? <img src={data.personal.avatar} alt={data.personal.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-emerald-400 text-3xl font-black">{(data.personal?.name ?? "U")[0]}</div>}
            </div>
            <h2 className="text-white font-mono font-bold text-lg mb-1">{data.personal?.name}</h2>
            <p className="text-emerald-400 font-mono text-xs mb-4">{data.personal?.title}</p>
            <div className="flex gap-2">
              {[
                [data.socials?.github, Github],
                [data.socials?.linkedin, Linkedin],
                [data.socials?.twitter, Twitter],
                [data.socials?.email ? `mailto:${data.socials.email}` : null, Mail],
              ].filter(([h]) => h).map(([href, Icon], i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer"
                  className="w-8 h-8 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
                  <Icon size={13}/>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Bio JSON */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-black border border-zinc-900 rounded-xl p-6">
            <div className="font-mono text-xs leading-7 mb-5 bg-zinc-950 rounded-lg p-4 border border-zinc-900">
              <div className="text-zinc-600">{"{"}</div>
              {[["name", data.personal?.name],["title", data.personal?.title],["location", data.personal?.location]].filter(([,v])=>v).map(([k,v])=>(
                <div key={k} className="pl-4">
                  <span className="text-blue-400">"{k}"</span>
                  <span className="text-zinc-600">: </span>
                  <span className="text-amber-300">"{v}"</span>
                  <span className="text-zinc-600">,</span>
                </div>
              ))}
              <div className="text-zinc-600">{"}"}</div>
            </div>
            <p className="text-zinc-400 font-mono text-sm leading-relaxed">{data.personal?.bio}</p>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { v: data.stats?.yearsExperience ?? "5+", l: "Years" },
                { v: data.stats?.projectsCompleted ?? "48+", l: "Projects" },
                { v: data.stats?.happyClients ?? "32+", l: "Clients" },
              ].map(s => (
                <div key={s.l} className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 text-center">
                  <div className="text-emerald-400 font-mono font-black text-xl">{s.v}</div>
                  <div className="text-zinc-600 font-mono text-xs mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
function Skills() {
  const { portfolioData: data } = usePortfolio();

  const skills = data.skills ?? [];
  const cats = [...new Set(skills.map(s => s.category).filter(Boolean))];
  return (
    <section id="skills" className="bg-black py-20 px-4 sm:px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <SectionHeading file="skills.config.js" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(cats.length ? cats : ["All"]).map((cat, ci) => {
            const list = cat === "All" ? skills : skills.filter(s => s.category === cat);
            return (
              <motion.div key={cat} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.08 }}
                className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={12} className="text-emerald-400" />
                  <span className="text-zinc-400 font-mono text-xs font-semibold uppercase tracking-widest">{cat}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {list.map((skill, i) => {
                    const lvl = skill.level ?? 80;
                    const cls = lvl >= 85 ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/5"
                              : lvl >= 70 ? "border-blue-500/40 text-blue-400 bg-blue-500/5"
                              : "border-lime-500/40 text-lime-400 bg-lime-500/5";
                    return (
                      <span key={i} className={`group border rounded-md px-2.5 py-1 font-mono text-xs cursor-default transition-all hover:scale-105 ${cls}`}>
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
const STATUSES = ["ready","ready","ready","building","error"];
function Projects() {
  const { portfolioData: data } = usePortfolio();

  const projects = data.projects ?? [];
  return (
    <section id="projects" className="bg-zinc-950 py-20 px-4 sm:px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <SectionHeading file="deployments.json" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="group bg-black border border-zinc-900 rounded-xl overflow-hidden hover:-translate-y-1.5 hover:border-zinc-700 hover:shadow-2xl hover:shadow-black transition-all duration-300">
              {p.image && (
                <div className="h-44 overflow-hidden relative bg-zinc-900">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute top-3 right-3"><Badge status={STATUSES[i % STATUSES.length]} /></div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {(p.techStack ?? []).slice(0, 3).map((t, j) => (
                      <span key={j} className="bg-black/70 backdrop-blur border border-zinc-700 text-blue-400 font-mono text-xs px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-white font-mono font-bold text-sm">{p.title}</h3>
                  <div className="flex gap-2 shrink-0">
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-white transition-colors"><Github size={14}/></a>}
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-emerald-400 transition-colors"><ExternalLink size={14}/></a>}
                  </div>
                </div>
                <p className="text-zinc-500 font-mono text-xs leading-relaxed line-clamp-2">{p.description}</p>
                {!p.image && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(p.techStack ?? []).map((t, j) => (
                      <span key={j} className="bg-zinc-900 border border-zinc-800 text-blue-400 font-mono text-xs px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────
function Experience() {
  const { portfolioData: data } = usePortfolio();

  const experience = data.experience ?? [];
  return (
    <section id="experience" className="bg-black py-20 px-4 sm:px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <SectionHeading file="git-log.txt" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {experience.map((exp, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div>
                  <h3 className="text-white font-mono font-bold text-sm">{exp.role}</h3>
                  <span className="text-emerald-400 font-mono text-xs">{exp.company}</span>
                </div>
                <span className="bg-zinc-900 border border-zinc-800 text-zinc-500 font-mono text-xs px-3 py-1 rounded-full shrink-0">{exp.period}</span>
              </div>
              <div className="h-px bg-zinc-900 mb-3" />
              <p className="text-zinc-500 font-mono text-xs leading-relaxed">{exp.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-emerald-400 shadow shadow-emerald-500/50" : "bg-zinc-700"}`} />
                <span className="text-zinc-600 font-mono text-xs">{i === 0 ? "Current" : "Previous"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials() {
  const { portfolioData: data } = usePortfolio();

  const testimonials = data.testimonials ?? [];
  return (
    <section id="testimonials" className="bg-zinc-950 py-20 px-4 sm:px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <SectionHeading file="reviews.stdout" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-black border border-zinc-900 rounded-xl p-6 hover:border-zinc-700 transition-colors flex flex-col">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} size={11} fill="#f59e0b" color="#f59e0b"/>)}
              </div>
              <p className="text-zinc-400 font-mono text-xs leading-relaxed flex-1 italic mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-900">
                {t.avatar
                  ? <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover"/>
                  : <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 text-sm font-bold">{(t.name??'?')[0]}</div>}
                <div>
                  <div className="text-white font-mono text-xs font-semibold">{t.name}</div>
                  <div className="text-zinc-600 font-mono text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const { portfolioData: data } = usePortfolio();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000); setForm({ name:"", email:"", message:"" }); };
  const inp = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-white font-mono text-sm outline-none focus:border-emerald-500/60 transition-colors placeholder:text-zinc-700";
  return (
    <section id="contact" className="bg-black py-20 px-4 sm:px-6 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <SectionHeading file="contact.init()" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-white font-mono font-black text-4xl leading-tight mb-4">
              Let's deploy<br /><span className="text-emerald-400">something</span><br />great.
            </h2>
            <p className="text-zinc-500 font-mono text-sm leading-relaxed mb-8 max-w-sm">
              Open to new opportunities, collaborations and interesting projects.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {data.socials?.email && <a href={`mailto:${data.socials.email}`} className="flex items-center gap-3 text-zinc-500 hover:text-emerald-400 font-mono text-sm transition-colors"><Mail size={13}/>{data.socials.email}</a>}
              {data.socials?.github && <a href={data.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-zinc-500 hover:text-blue-400 font-mono text-sm transition-colors"><Github size={13}/>{data.socials.github.replace("https://github.com/","@")}</a>}
              {data.socials?.linkedin && <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-zinc-500 hover:text-blue-400 font-mono text-sm transition-colors"><Linkedin size={13}/>LinkedIn</a>}
            </div>
            {/* Fun metrics */}
            <div className="grid grid-cols-2 gap-3">
              {[{l:"Response time", v:"< 24h"},{l:"Availability", v:"Full-time"}].map(m=>(
                <div key={m.l} className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
                  <div className="text-emerald-400 font-mono font-bold text-lg">{m.v}</div>
                  <div className="text-zinc-600 font-mono text-xs mt-0.5">{m.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
              <div className="bg-zinc-900 border-b border-zinc-800 px-5 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="text-zinc-500 font-mono text-xs ml-2">POST /api/contact</span>
              </div>
              <div className="p-6">
                <div className="text-zinc-700 font-mono text-xs mb-5 leading-6">
                  $ curl -X POST /api/contact \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;-d '&#123;"from": "you"&#125;'
                </div>
                <form onSubmit={submit} className="flex flex-col gap-4">
                  {[{k:"name",p:"your_name",t:"text",l:"--name"},{k:"email",p:"your@email.com",t:"email",l:"--email"}].map(f=>(
                    <div key={f.k}>
                      <label className="text-zinc-600 font-mono text-xs block mb-1.5">{f.l}</label>
                      <input type={f.t} placeholder={f.p} value={form[f.k]} required
                        onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} className={inp}/>
                    </div>
                  ))}
                  <div>
                    <label className="text-zinc-600 font-mono text-xs block mb-1.5">--message</label>
                    <textarea placeholder="your message..." value={form.message} required rows={3}
                      onChange={e=>setForm(p=>({...p,message:e.target.value}))} className={`${inp} resize-y`}/>
                  </div>
                  <button type="submit"
                    className={`flex items-center justify-center gap-2 w-full font-mono font-bold text-sm py-3 rounded-lg transition-all ${sent?"bg-emerald-500 text-white":"bg-white text-black hover:opacity-85"}`}>
                    {sent ? <><CheckCircle size={13}/>Sent!</> : <><Send size={13}/>Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const { portfolioData: data } = usePortfolio();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-black rounded-sm"/>
          </div>
          <span className="text-zinc-600 font-mono text-xs">© {new Date().getFullYear()} {data.personal?.name}</span>
        </div>
        <Badge status="ready"/>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/40 transition-all">
          <ArrowUp size={13}/>
        </button>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function VercelDeploy({ portfolioData }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="bg-black min-h-screen">
      <Navbar/>
      <Hero/>
      <About/>
      <Skills/>
      <Projects/>
      <Experience/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </div>
  );
}
