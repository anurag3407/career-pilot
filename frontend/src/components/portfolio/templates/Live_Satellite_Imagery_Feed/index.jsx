import React from 'react';
import { Antenna, ArrowUpRight, BadgeCheck, Github, Linkedin, Mail, MapPin, Radio, Satellite, ScanLine, Twitter } from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';

const fallbackImage = 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1200&h=800&fit=crop';

function Metric({ label, value }) {
  return (
    <div className="border border-cyan-300/20 bg-slate-950/70 p-4">
      <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/60">{label}</p>
      <p className="mt-2 font-mono text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 border-b border-cyan-300/20 pb-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-300">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{title}</h2>
      </div>
      <ScanLine className="hidden text-cyan-200/60 sm:block" size={28} />
    </div>
  );
}

export default function LiveSatelliteImageryFeed() {
  const { portfolioData } = usePortfolio();
  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;
  const featuredProjects = projects.slice(0, 4);
  const topSkills = skills.slice(0, 8);
  const contactLinks = [
    { icon: Mail, href: socials.email?.includes('@') ? `mailto:${socials.email}` : socials.email, label: 'Email' },
    { icon: Github, href: socials.github, label: 'GitHub' },
    { icon: Linkedin, href: socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: socials.twitter, label: 'Twitter' },
  ].filter((item) => item.href);

  return (
    <main className="min-h-screen bg-[#07100f] text-slate-100">
      <div className="fixed inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(34,211,238,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.08) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,rgba(20,184,166,.25),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(56,189,248,.18),transparent_30%),linear-gradient(180deg,rgba(2,6,23,.1),rgba(2,6,23,.92))]" />

      <nav className="sticky top-0 z-40 border-b border-cyan-300/20 bg-[#07100f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-emerald-300/40 bg-emerald-300/10 text-emerald-200">
              <Satellite size={18} />
            </span>
            <span className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-100">Orbital Feed</span>
          </a>
          <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.18em] text-cyan-100/70 md:flex">
            {['Projects', 'Skills', 'Signal', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-emerald-200">{item}</a>
            ))}
          </div>
        </div>
      </nav>

      <section id="top" className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1.02fr_.98fr] lg:py-16">
        <div className="flex min-h-[560px] flex-col justify-between border border-cyan-300/20 bg-slate-950/60 p-6 sm:p-8">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 border border-emerald-300/30 bg-emerald-300/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-emerald-200">
              <Radio size={14} className="animate-pulse" /> Live telemetry
            </div>
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/60">{personal.title}</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.95] text-white sm:text-7xl">{personal.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{personal.bio}</p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <Metric label="Years in orbit" value={`${stats.yearsExperience}+`} />
            <Metric label="Missions shipped" value={stats.projectsCompleted} />
            <Metric label="Ground stations" value={stats.happyClients} />
          </div>
        </div>

        <div className="relative min-h-[560px] overflow-hidden border border-cyan-300/20 bg-slate-950">
          <img src={featuredProjects[0]?.image || fallbackImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-screen" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_0_34%,rgba(6,182,212,.22)_35%,transparent_36%),radial-gradient(circle,transparent_0_57%,rgba(16,185,129,.2)_58%,transparent_59%)]" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/40" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/20" />
          <div className="absolute inset-x-0 top-1/2 border-t border-cyan-200/30" />
          <div className="absolute inset-y-0 left-1/2 border-l border-cyan-200/30" />
          <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-2">
            <div className="border border-cyan-300/30 bg-black/60 p-4 backdrop-blur">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-100">Target lock</p>
              <p className="mt-2 text-lg font-semibold text-white">{personal.location || 'Remote sector'}</p>
            </div>
            <div className="border border-emerald-300/30 bg-black/60 p-4 backdrop-blur">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-100">Signal</p>
              <p className="mt-2 text-lg font-semibold text-white">{personal.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="relative mx-auto max-w-7xl px-5 py-12">
        <SectionTitle eyebrow="Image Products" title="Project passes" />
        <div className="grid gap-4 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <article key={project.title} className="group border border-cyan-300/20 bg-slate-950/70">
              <div className="aspect-[16/9] overflow-hidden border-b border-cyan-300/20">
                <img src={project.image || fallbackImage} alt="" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.18em] text-cyan-200/60">
                  <span>Pass 0{index + 1}</span>
                  <ArrowUpRight size={16} />
                </div>
                <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.techStack || []).slice(0, 4).map((tech) => (
                    <span key={tech} className="border border-emerald-300/20 px-2.5 py-1 text-xs text-emerald-100">{tech}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="relative mx-auto grid max-w-7xl gap-6 px-5 py-12 lg:grid-cols-[.85fr_1.15fr]">
        <div>
          <SectionTitle eyebrow="Spectral Bands" title="Capability map" />
          <div className="grid grid-cols-2 gap-3">
            {topSkills.map((skill) => (
              <div key={skill.name} className="border border-cyan-300/20 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{skill.name}</span>
                  <span className="font-mono text-cyan-200">{skill.level || 80}%</span>
                </div>
                <div className="mt-3 h-1.5 bg-cyan-950">
                  <div className="h-full bg-emerald-300" style={{ width: `${skill.level || 80}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="signal" className="border border-cyan-300/20 bg-slate-950/70 p-6">
          <SectionTitle eyebrow="Mission Log" title="Recent trajectory" />
          <div className="space-y-5">
            {experience.slice(0, 4).map((item) => (
              <div key={`${item.company}-${item.role}`} className="border-l border-emerald-300/50 pl-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200/60">{item.period}</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{item.role}</h3>
                <p className="text-sm font-semibold text-emerald-200">{item.company}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 3).map((item) => (
            <figure key={item.name} className="border border-cyan-300/20 bg-slate-950/70 p-5">
              <BadgeCheck className="text-emerald-200" />
              <blockquote className="mt-4 text-sm leading-6 text-slate-300">"{item.text}"</blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-white">{item.name}</figcaption>
              <p className="text-xs text-cyan-200/70">{item.role}</p>
            </figure>
          ))}
        </div>
      </section>

      <footer id="contact" className="relative border-t border-cyan-300/20 bg-slate-950/80">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-emerald-200"><Antenna size={18} /><span className="font-mono text-xs uppercase tracking-[0.22em]">Downlink open</span></div>
            <h2 className="text-3xl font-semibold text-white">Transmit a new mission brief.</h2>
            <p className="mt-2 flex items-center gap-2 text-slate-300"><MapPin size={16} />{personal.location}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {contactLinks.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} className="inline-flex h-11 w-11 items-center justify-center border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-emerald-300 hover:text-slate-950" aria-label={label}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
