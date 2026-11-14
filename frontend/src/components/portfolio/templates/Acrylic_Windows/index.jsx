import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AppWindow, CircleUser, LayoutDashboard, Clock, Mail, MessageCircle,
  Minus, Square, X, MapPin, Github, Linkedin, Twitter, Send,
  GripHorizontal, FolderOpen, Sparkles, Cloud, Image as ImageIcon
} from 'lucide-react';

/**
 * Acrylic Windows Portfolio Template
 * Category: Glass / Modern UI
 * Description: Windows 11 Acrylic material with translucent panels with noise texture overlay, floating draggable windows, taskbar-style navigation, Fluent Design.
 */

const ACCENT = '#0067c0';       // Fluent accent blue
const ACCENT_LIGHT = '#4cc2ff';
const TXT = '#1f2733';
const SUB = '#5b6b7d';

const NOISE_URI = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'U';
};

// Fluent-style window title bar with (decorative) caption controls
const TitleBar = ({ icon: Icon, title, tone = 'light' }) => (
  <div className="flex items-center gap-2.5 px-4 h-10 select-none"
    style={{ borderBottom: `1px solid ${tone === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(31,39,51,0.10)'}` }}>
    <Icon size={14} style={{ color: tone === 'dark' ? ACCENT_LIGHT : ACCENT }} />
    <span className="text-xs font-medium truncate flex-1"
      style={{ color: tone === 'dark' ? 'rgba(255,255,255,0.85)' : SUB }}>{title}</span>
    <div className="flex items-center gap-1.5 opacity-60" aria-hidden>
      <Minus size={11} style={{ color: tone === 'dark' ? '#fff' : TXT }} />
      <Square size={9} style={{ color: tone === 'dark' ? '#fff' : TXT }} />
      <X size={12} style={{ color: tone === 'dark' ? '#fff' : TXT }} />
    </div>
  </div>
);

// Shared acrylic panel styles
const acrylic = (dark = false) => ({
  background: dark ? 'rgba(22,32,48,0.62)' : 'rgba(255,255,255,0.58)',
  backdropFilter: 'blur(28px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
  border: dark ? '1px solid rgba(255,255,255,0.14)' : '1px solid rgba(255,255,255,0.75)',
  boxShadow: dark
    ? '0 8px 32px rgba(10,18,32,0.35), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 8px 32px rgba(31,45,70,0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
});

// Wallpaper: pastel Fluent bloom blobs + noise texture overlay
const Wallpaper = () => (
  <div className="fixed inset-0 pointer-events-none" aria-hidden>
    <div className="absolute inset-0" style={{ background: 'linear-gradient(155deg,#dfeafc 0%,#e9e4fb 42%,#fbe7ef 78%,#fdf3e7 100%)' }} />
    <div className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full" style={{ background: 'radial-gradient(circle,#a8c6f5 0%,transparent 70%)', filter: 'blur(60px)', opacity: 0.75 }} />
    <div className="absolute top-1/4 -right-32 w-[560px] h-[560px] rounded-full" style={{ background: 'radial-gradient(circle,#d3b3f2 0%,transparent 70%)', filter: 'blur(70px)', opacity: 0.65 }} />
    <div className="absolute bottom-[-180px] left-1/4 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle,#ffc7d8 0%,transparent 70%)', filter: 'blur(70px)', opacity: 0.6 }} />
    <div className="absolute inset-0" style={{ backgroundImage: NOISE_URI, opacity: 0.05, mixBlendMode: 'multiply' }} />
  </div>
);

// Hero "desktop" with draggable profile window + widgets
const Desktop = ({ data }) => {
  const desktopRef = useRef(null);
  const name = data.personal?.name || 'My Portfolio';
  const stats = [
    { label: 'Years active', value: data.stats?.yearsExperience },
    { label: 'Projects shipped', value: data.stats?.projectsCompleted },
    { label: 'Happy clients', value: data.stats?.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="hero" ref={desktopRef} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-28">
      <motion.div initial="hidden" animate="visible" variants={stagger} className="relative w-full max-w-4xl">

        {/* main profile window — draggable */}
        <motion.div variants={fadeUp} className="relative z-10 mx-auto w-full max-w-xl rounded-lg overflow-hidden"
          style={acrylic(false)} drag dragConstraints={desktopRef} dragMomentum={false} dragElastic={0.12}
          whileDrag={{ scale: 1.02, boxShadow: '0 24px 60px rgba(31,45,70,0.25)' }}>
          <TitleBar icon={CircleUser} title={`${name} — profile.exe`} />
          <div className="p-7 text-center">
            {data.personal?.avatar ? (
              <img src={data.personal.avatar} alt={name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-5"
                style={{ border: '3px solid rgba(255,255,255,0.9)', boxShadow: '0 6px 20px rgba(31,45,70,0.18)' }} />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-2xl font-semibold text-white"
                style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT_LIGHT})`, boxShadow: '0 6px 20px rgba(0,103,192,0.35)' }}>
                {initialsOf(name)}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2" style={{ color: TXT }}>
              {name}
            </h1>
            {data.personal?.title && (
              <p className="text-sm md:text-base font-medium mb-3" style={{ color: ACCENT }}>{data.personal.title}</p>
            )}
            {data.personal?.tagline && (
              <p className="text-sm leading-relaxed mb-5" style={{ color: SUB }}>{data.personal.tagline}</p>
            )}
            {data.personal?.location && (
              <p className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full mb-6"
                style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(31,39,51,0.1)', color: SUB }}>
                <MapPin size={12} style={{ color: ACCENT }} /> {data.personal.location}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              <a href="#about" className="px-5 py-2.5 rounded-md text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                style={{ background: ACCENT, boxShadow: '0 2px 8px rgba(0,103,192,0.4)' }}>
                Open profile
              </a>
              <a href="#projects" className="px-5 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-white/80"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(31,39,51,0.14)', color: TXT }}>
                View projects
              </a>
              <a href="#contact" className="px-5 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-white/80"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(31,39,51,0.14)', color: TXT }}>
                Contact
              </a>
            </div>
            <p className="mt-5 text-[10px] uppercase tracking-widest inline-flex items-center gap-1.5" style={{ color: 'rgba(91,107,125,0.7)' }}>
              <GripHorizontal size={12} /> Drag this window
            </p>
          </div>
        </motion.div>

        {/* floating stat widget — draggable */}
        {stats.length > 0 && (
          <motion.div variants={fadeUp}
            className="hidden md:block absolute -right-2 lg:right-0 -bottom-14 w-56 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing z-20"
            style={acrylic(false)} drag dragConstraints={desktopRef} dragMomentum={false} dragElastic={0.15}>
            <TitleBar icon={Sparkles} title="quickstats.widget" />
            <div className="p-4 space-y-3">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: SUB }}>{s.label}</span>
                  <span className="text-lg font-semibold" style={{ color: ACCENT }}>{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* notification toast — draggable */}
        {(data.personal?.tagline || data.personal?.title) && (
          <motion.div variants={fadeUp}
            className="hidden lg:flex absolute -left-4 xl:left-0 -top-10 items-center gap-3 w-64 p-3.5 rounded-lg cursor-grab active:cursor-grabbing z-0"
            style={acrylic(false)} drag dragConstraints={desktopRef} dragMomentum={false} dragElastic={0.15}>
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: 'rgba(76,194,255,0.25)' }}>
              <Cloud size={16} style={{ color: ACCENT }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold" style={{ color: TXT }}>Welcome</p>
              <p className="text-[11px] truncate" style={{ color: SUB }}>{data.personal.title || data.personal.tagline}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

// About window
const AboutWindow = ({ data }) => {
  const name = data.personal?.name || 'User';
  return (
    <section id="about" className="relative py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <motion.div variants={fadeUp} className="rounded-lg overflow-hidden" style={acrylic(false)}>
            <TitleBar icon={CircleUser} title="about.txt — Notepad" />
            <div className="p-7 md:p-8">
              <h2 className="text-2xl font-semibold tracking-tight mb-4" style={{ color: TXT }}>About</h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {data.personal?.avatar && (
                  <img src={data.personal.avatar} alt={name} className="w-20 h-20 rounded-xl object-cover shrink-0"
                    style={{ border: '1px solid rgba(255,255,255,0.8)' }} />
                )}
                <p className="text-sm md:text-[15px] leading-relaxed" style={{ color: '#3c4a5c' }}>
                  {data.personal?.bio || `${name} keeps this space reserved for a short biography.`}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Skills — Fluent "live tiles" grid
const SkillTiles = ({ data }) => (
  <section id="skills" className="relative py-16 px-4">
    <div className="max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
        <motion.div variants={fadeUp} className="rounded-lg overflow-hidden mb-6" style={acrylic(false)}>
          <TitleBar icon={LayoutDashboard} title="skills — dashboard" />
          <div className="p-6 md:p-7">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: TXT }}>Skills</h2>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}
              className="p-4 rounded-lg" style={acrylic(false)}>
              <div className="flex items-baseline justify-between mb-2.5">
                <span className="text-sm font-medium truncate" style={{ color: TXT }}>{skill.name}</span>
                <span className="text-xs font-semibold" style={{ color: ACCENT }}>{skill.level}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(31,39,51,0.1)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg,${ACCENT},${ACCENT_LIGHT})` }}
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.9, delay: (i % 3) * 0.1 }} viewport={{ once: true }} />
              </div>
              {skill.category && (
                <p className="text-[10px] uppercase tracking-wider mt-2.5" style={{ color: 'rgba(91,107,125,0.75)' }}>
                  {skill.category}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Projects — windows with explorer-style chrome
const ProjectWindows = ({ data }) => (
  <section id="projects" className="relative py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        <motion.div variants={fadeUp} className="rounded-lg overflow-hidden mb-6 max-w-md" style={acrylic(false)}>
          <TitleBar icon={FolderOpen} title={`projects — ${data.projects.length} items`} />
          <div className="p-5">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: TXT }}>Projects</h2>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-5">
          {data.projects.map((project, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -5 }}
              className="rounded-lg overflow-hidden flex flex-col" style={acrylic(false)}>
              <TitleBar icon={AppWindow} title={project.title || `Project ${i + 1}`} />
              <div className="p-5 flex flex-col flex-1">
                {project.image && (
                  <div className="rounded-md overflow-hidden mb-4" style={{ border: '1px solid rgba(31,39,51,0.08)' }}>
                    <img src={project.image} alt={project.title} className="w-full h-40 object-cover" />
                  </div>
                )}
                {project.description && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#3c4a5c' }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(0,103,192,0.09)', color: ACCENT }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-auto pt-2">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium text-white transition-transform hover:-translate-y-0.5"
                      style={{ background: ACCENT }}>
                      Launch app
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium transition-colors hover:bg-white/80"
                      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(31,39,51,0.14)', color: TXT }}>
                      <Github size={13} /> Source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Experience — timeline window
const ExperienceWindow = ({ data }) => (
  <section id="experience" className="relative py-16 px-4">
    <div className="max-w-3xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="rounded-lg overflow-hidden" style={acrylic(false)}>
          <TitleBar icon={Clock} title="career — history.log" />
          <div className="p-7 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-6" style={{ color: TXT }}>Experience</h2>
            <div className="relative pl-6 space-y-7" style={{ borderLeft: '2px solid rgba(0,103,192,0.25)' }}>
              {data.experience.map((exp, i) => (
                <motion.div key={i} variants={fadeUp} className="relative">
                  <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full"
                    style={{ background: ACCENT, boxShadow: '0 0 0 3px rgba(0,103,192,0.18)' }} />
                  {exp.period && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider inline-block mb-1"
                      style={{ color: ACCENT }}>{exp.period}</span>
                  )}
                  <h3 className="text-base font-semibold" style={{ color: TXT }}>{exp.role}</h3>
                  {exp.company && <p className="text-xs font-medium mb-1.5" style={{ color: SUB }}>at {exp.company}</p>}
                  {exp.description && (
                    <p className="text-sm leading-relaxed" style={{ color: '#3c4a5c' }}>{exp.description}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Testimonials — stacked toast notifications
const Toasts = ({ data }) => (
  <section id="testimonials" className="relative py-16 px-4">
    <div className="max-w-3xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}
        className="space-y-4">
        {data.testimonials.map((t, i) => (
          <motion.div key={i} variants={fadeUp} whileHover={{ x: 6 }}
            className="p-5 rounded-lg flex gap-4" style={acrylic(i % 2 === 1)}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
              style={t.avatar ? {} : { background: `linear-gradient(135deg,${ACCENT},${ACCENT_LIGHT})`, color: '#fff' }}>
              {t.avatar
                ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                : initialsOf(t.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold mb-1 flex items-center gap-2"
                style={{ color: i % 2 === 1 ? 'rgba(255,255,255,0.9)' : TXT }}>
                <MessageCircle size={12} style={{ color: i % 2 === 1 ? ACCENT_LIGHT : ACCENT }} />
                {t.name}
                {t.role && <span className="font-normal" style={{ color: i % 2 === 1 ? 'rgba(255,255,255,0.55)' : SUB }}>· {t.role}</span>}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: i % 2 === 1 ? 'rgba(255,255,255,0.75)' : '#3c4a5c' }}>
                {t.text}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// Contact — compose window
const ContactWindow = ({ data }) => {
  const socials = [
    { key: 'github', icon: Github, label: 'GitHub' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'twitter', icon: Twitter, label: 'Twitter' },
  ].filter(s => data.socials?.[s.key]);

  return (
    <section id="contact" className="relative py-16 px-4">
      <div className="max-w-xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.div variants={fadeUp} className="rounded-lg overflow-hidden" style={acrylic(false)}>
            <TitleBar icon={Mail} title="New message — Mail" />
            <div className="p-7 md:p-8">
              <h2 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: TXT }}>Let's connect</h2>
              <p className="text-sm mb-6" style={{ color: SUB }}>
                {data.personal?.bio ? 'Open to new opportunities and collaborations.' : 'Drop a message anytime.'}
              </p>
              {data.personal?.email && (
                <div className="flex items-center gap-2 text-sm p-3 rounded-md mb-5"
                  style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(31,39,51,0.1)', color: SUB }}>
                  <span className="font-medium w-8 shrink-0" style={{ color: TXT }}>To:</span>
                  <span className="truncate">{data.personal.email}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {data.personal?.email && (
                  <a href={`mailto:${data.personal.email}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: ACCENT, boxShadow: '0 2px 8px rgba(0,103,192,0.4)' }}>
                    <Send size={15} /> Send email
                  </a>
                )}
                {socials.map(({ key, icon: Icon, label }) => (
                  <a key={key} href={data.socials[key]} target="_blank" rel="noreferrer" aria-label={label}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-md transition-colors hover:bg-white/80"
                    style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(31,39,51,0.14)', color: TXT }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.p variants={fadeUp} className="text-center text-[11px] mt-16 pb-24" style={{ color: 'rgba(91,107,125,0.75)' }}>
            &copy; {new Date().getFullYear()} {data.personal?.name || 'My Portfolio'} · Built with Fluent Acrylic
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// Main component
export default function AcrylicWindows() {
  const { portfolioData: data } = usePortfolio();
  const [active, setActive] = useState('hero');

  const sections = [
    { id: 'hero', label: 'Start', icon: AppWindow, show: true },
    { id: 'about', label: 'About', icon: CircleUser, show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { id: 'skills', label: 'Skills', icon: LayoutDashboard, show: data.skills?.length > 0 },
    { id: 'projects', label: 'Projects', icon: FolderOpen, show: data.projects?.length > 0 },
    { id: 'experience', label: 'Work', icon: Clock, show: data.experience?.length > 0 },
    { id: 'testimonials', label: 'Reviews', icon: MessageCircle, show: data.testimonials?.length > 0 },
    { id: 'contact', label: 'Mail', icon: Mail, show: true },
  ].filter(s => s.show);

  const idsKey = sections.map(s => s.id).join(',');

  useEffect(() => {
    const ids = idsKey.split(',');
    const onScroll = () => {
      let current = ids[0] || 'hero';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [idsKey]);

  return (
    <div className="font-sans antialiased overflow-x-hidden relative" style={{ color: TXT }}>
      <Wallpaper />

      <Desktop data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <AboutWindow data={data} />}
      {data.skills?.length > 0 && <SkillTiles data={data} />}
      {data.projects?.length > 0 && <ProjectWindows data={data} />}
      {data.experience?.length > 0 && <ExperienceWindow data={data} />}
      {data.testimonials?.length > 0 && <Toasts data={data} />}
      <ContactWindow data={data} />

      {/* taskbar navigation */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 rounded-xl px-2.5 py-1.5 flex items-center gap-1 max-w-[94vw] overflow-x-auto"
        style={acrylic(false)}>
        {sections.map(section => {
          const isActive = active === section.id;
          return (
            <a key={section.id} href={`#${section.id}`} aria-label={section.label}
              className="relative flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors shrink-0"
              style={{ background: isActive ? 'rgba(0,103,192,0.12)' : 'transparent' }}>
              <section.icon size={18} style={{ color: isActive ? ACCENT : SUB }} />
              <span className="text-[8px] mt-0.5" style={{ color: isActive ? ACCENT : 'rgba(91,107,125,0.8)' }}>
                {section.label}
              </span>
              {isActive && <span className="absolute bottom-0.5 w-4 h-[3px] rounded-full" style={{ background: ACCENT }} />}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
