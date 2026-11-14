import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Github, Linkedin, Twitter, ExternalLink, MapPin, Phone,
  User, ChevronDown, Hand
} from 'lucide-react';

/**
 * Ceramic Minimal Portfolio Template
 * Category: Glass / Modern UI
 * Description: Ceramic/pottery-inspired smooth matte surfaces. Earthy, warm undertones. Rounded shapes that look like sculpted clay objects. Organic plus minimal.
 */

const CREAM = '#faf6ef';
const SAND = '#ead9c0';
const SAND_DEEP = '#e0c9a6';
const TERRACOTTA = '#c26e4f';
const CLAY_DARK = '#9a5238';
const INK = '#453a30';
const WARM_GRAY = '#7a6c5e';

const fadeSoft = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};
const stagger = { visible: { transition: { staggerChildren: 0.14 } } };

const matteShadow = '0 20px 45px rgba(133, 94, 60, 0.16), 0 4px 10px rgba(133, 94, 60, 0.08)';

const initialsOf = (name) =>
  (name || '').trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/* ---------- Decorative clay objects ---------- */

const Vessel = ({ w = 90, h = 110, color = TERRACOTTA, className = '' }) => (
  <div aria-hidden="true" className={className} style={{ width: w }}>
    <div style={{
      width: w * 0.44, height: 12, margin: '0 auto', borderRadius: '10px 10px 0 0',
      background: `linear-gradient(90deg, ${color}cc, ${color})`
    }} />
    <div style={{
      width: w, height: h, marginTop: -2,
      borderRadius: '50% 50% 44% 44% / 68% 68% 26% 26%',
      background: `radial-gradient(circle at 33% 22%, rgba(255,255,255,0.42), transparent 42%), radial-gradient(circle at 60% 80%, rgba(0,0,0,0.12), transparent 40%), ${color}`,
      boxShadow: `inset -8px -10px 22px rgba(0,0,0,0.14), ${matteShadow}`
    }} />
  </div>
);

const ClayBlob = ({ size = 200, color = SAND, className = '', blur = 'blur-2xl' }) => (
  <div aria-hidden="true" className={`absolute ${blur} ${className}`}
    style={{
      width: size, height: size,
      borderRadius: '58% 42% 55% 45% / 52% 55% 45% 48%',
      background: `radial-gradient(circle at 40% 35%, ${color}, transparent 70%)`
    }} />
);

const Wheel = ({ className = '' }) => (
  <div aria-hidden="true" className={`absolute ${className}`}
    style={{
      width: 120, height: 120, borderRadius: '50%',
      border: '2px solid rgba(154,82,56,0.25)',
      boxShadow: 'inset 0 0 0 14px rgba(234,217,192,0.5), inset 0 0 0 15px rgba(154,82,56,0.18)',
      animation: 'wheelSpin 26s linear infinite'
    }}>
    <div style={{
      position: 'absolute', inset: 28, borderRadius: '50%',
      border: '1.5px solid rgba(154,82,56,0.3)'
    }} />
  </div>
);

/* ---------- Hero ---------- */

const Hero = ({ p }) => (
  <section id="hero" className="relative min-h-screen flex items-center overflow-hidden px-6 pt-28 pb-20" style={{ backgroundColor: CREAM }}>
    <ClayBlob size={420} className="-left-40 -top-32" color={SAND} />
    <ClayBlob size={360} className="-right-32 bottom-0" color="#eec9b4" />
    <Wheel className="right-[8%] top-28 hidden lg:block" />
    <div className="absolute right-[4%] bottom-10 hidden md:flex items-end gap-8" aria-hidden="true">
      <Vessel w={74} h={92} color={SAND_DEEP} />
      <Vessel w={104} h={134} color={TERRACOTTA} />
      <Vessel w={58} h={74} color={CLAY_DARK} />
    </div>

    <motion.div className="relative z-10 max-w-3xl" initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeSoft} className="mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-white"
          style={{ backgroundColor: TERRACOTTA }}>
          <Hand size={13} /> Hand-thrown portfolio
        </span>
      </motion.div>
      <motion.h1 variants={fadeSoft} className="font-serif text-5xl md:text-7xl leading-[1.05] mb-5" style={{ color: INK }}>
        {p.name}
      </motion.h1>
      {p.title && <motion.p variants={fadeSoft} className="font-serif text-xl md:text-2xl italic mb-3" style={{ color: TERRACOTTA }}>{p.title}</motion.p>}
      {p.tagline && <motion.p variants={fadeSoft} className="text-lg mb-2 max-w-xl" style={{ color: WARM_GRAY }}>{p.tagline}</motion.p>}
      {p.location && (
        <motion.p variants={fadeSoft} className="text-sm flex items-center gap-1.5 mb-9" style={{ color: WARM_GRAY }}>
          <MapPin size={14} /> {p.location}
        </motion.p>
      )}
      <motion.div variants={fadeSoft} className="flex gap-4 flex-wrap">
        <a href="#projects" className="px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ backgroundColor: TERRACOTTA, boxShadow: matteShadow }}>
          See the Collection
        </a>
        <a href="#contact" className="px-7 py-3.5 rounded-full text-sm font-semibold transition-colors hover:bg-white"
          style={{ color: INK, border: '1.5px solid rgba(69,58,48,0.25)' }}>
          Say Hello
        </a>
      </motion.div>
    </motion.div>

    <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10" style={{ color: '#b7a892' }}
      animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
      <ChevronDown size={24} />
    </motion.div>
    <style>{`@keyframes wheelSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </section>
);

/* ---------- About ---------- */

const About = ({ p, stats }) => {
  const hasStats = stats && (stats.yearsExperience || stats.projectsCompleted || stats.happyClients);
  if (!p.bio && !p.avatar && !hasStats) return null;
  const pebbleColors = [TERRACOTTA, CLAY_DARK, SAND_DEEP];
  const statItems = [
    { label: 'Years at the Wheel', value: stats?.yearsExperience },
    { label: 'Pieces Made', value: stats?.projectsCompleted },
    { label: 'Happy Collectors', value: stats?.happyClients },
  ].filter((s) => s.value);

  return (
    <section id="about" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: CREAM }}>
      <ClayBlob size={300} className="-right-24 top-10" color={SAND} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}
          className="grid md:grid-cols-2 gap-14 items-center">
          <motion.div variants={fadeSoft} className="mx-auto">
            {p.avatar
              ? <img src={p.avatar} alt={p.name} className="w-64 h-64 object-cover" style={{ borderRadius: '58% 42% 55% 45% / 52% 55% 45% 48%', boxShadow: matteShadow }} />
              : <div className="w-64 h-64 flex items-center justify-center"
                  style={{ borderRadius: '58% 42% 55% 45% / 52% 55% 45% 48%', backgroundColor: SAND, boxShadow: matteShadow }}>
                  {initialsOf(p.name)
                    ? <span className="font-serif text-6xl" style={{ color: CLAY_DARK }}>{initialsOf(p.name)}</span>
                    : <User size={56} style={{ color: CLAY_DARK }} />}
                </div>}
          </motion.div>
          <motion.div variants={fadeSoft}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: TERRACOTTA }}>The Maker</span>
            <h2 className="font-serif text-4xl font-bold mt-2 mb-5" style={{ color: INK }}>About Me</h2>
            {p.bio && <p className="leading-relaxed mb-8 max-w-lg" style={{ color: WARM_GRAY }}>{p.bio}</p>}
            {hasStats && (
              <div className="flex flex-wrap gap-4">
                {statItems.map((s, i) => (
                  <div key={i} className="px-6 py-4 text-center transition-transform hover:scale-[1.04]"
                    style={{
                      backgroundColor: i === 0 ? TERRACOTTA : CREAM,
                      color: i === 0 ? 'white' : INK,
                      borderRadius: `${46 + i * 8}% ${54 - i * 6}% 52% 48% / 55% 48% 52% 45%`,
                      boxShadow: matteShadow, minWidth: 128
                    }}>
                    <div className="font-serif text-2xl font-bold">{s.value}</div>
                    <div className={`text-[10px] font-medium uppercase tracking-widest mt-1 ${i === 0 ? 'text-white/80' : ''}`}
                      style={i === 0 ? {} : { color: WARM_GRAY }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Skills (clay coils) ---------- */

const Skills = ({ skills }) => {
  if (!skills?.length) return null;
  return (
    <section id="skills" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: SAND }}>
      <ClayBlob size={280} className="-left-24 bottom-0" color="#f6e3c8" blur="blur-3xl" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeSoft} className="text-center mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: CLAY_DARK }}>The Glazes</span>
            <h2 className="font-serif text-4xl font-bold mt-2" style={{ color: INK }}>Skills & Materials</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {skills.map((s, i) => (
              <motion.div key={i} variants={fadeSoft} className="group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-lg font-bold" style={{ color: INK }}>{s.name}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: TERRACOTTA }}>
                    {s.level || 85}%
                  </span>
                </div>
                <div className="relative h-3 rounded-full overflow-visible" style={{ backgroundColor: 'rgba(250,246,239,0.85)' }}>
                  <motion.div className="absolute left-0 top-0 h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${SAND_DEEP}, ${TERRACOTTA})` }}
                    initial={{ width: 0 }} whileInView={{ width: `${s.level || 85}%` }}
                    viewport={{ once: true }} transition={{ duration: 1.1, delay: i * 0.07, ease: 'easeOut' }} />
                  <motion.div className="absolute w-5 h-5 rounded-full border-2 border-white"
                    style={{ backgroundColor: CLAY_DARK, boxShadow: matteShadow, left: `calc(${s.level || 85}% - 10px)`, top: 'calc(50% - 10px)' }}
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.9 + i * 0.07 }} />
                </div>
                {s.category && <div className="text-[10px] font-medium uppercase tracking-[0.2em] mt-2" style={{ color: '#a08a70' }}>{s.category}</div>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Projects (the collection shelf) ---------- */

const Projects = ({ projects }) => {
  if (!projects?.length) return null;
  const offsets = ['md:mt-0', 'md:mt-10', 'md:mt-5'];
  return (
    <section id="projects" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: CREAM }}>
      <ClayBlob size={320} className="-right-28 -top-20" color="#eec9b4" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.div variants={fadeSoft} className="text-center mb-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: TERRACOTTA }}>Fresh from the Kiln</span>
            <h2 className="font-serif text-4xl font-bold mt-2" style={{ color: INK }}>The Collection</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {projects.map((project, i) => {
              const tech = Array.isArray(project.techStack) ? project.techStack : [];
              const blobRadius = i % 2 === 0
                ? '62% 38% 55% 45% / 55% 48% 52% 45%'
                : '45% 55% 48% 52% / 50% 60% 40% 50%';
              return (
                <motion.article key={i} variants={fadeSoft} whileHover={{ y: -8, rotate: i % 2 === 0 ? -1 : 1 }}
                  className={`rounded-[2.5rem] p-6 ${offsets[i % 3]}`}
                  style={{ backgroundColor: '#fffdf8', boxShadow: matteShadow }}>
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-44 object-cover mb-5"
                      style={{ borderRadius: blobRadius }} />
                  ) : (
                    <div className="w-full h-28 mb-5 flex items-center justify-center"
                      style={{ borderRadius: blobRadius, backgroundColor: SAND }}>
                      <Vessel w={44} h={58} color={TERRACOTTA} />
                    </div>
                  )}
                  <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: INK }}>{project.title}</h3>
                  {project.description && <p className="text-sm leading-relaxed mb-4" style={{ color: WARM_GRAY }}>{project.description}</p>}
                  {tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {tech.map((t, j) => (
                        <span key={j} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                          style={{ backgroundColor: CREAM, color: '#6d5b49' }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: TERRACOTTA }} />
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-5 pt-1">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                        style={{ color: CLAY_DARK }}>
                        <ExternalLink size={14} /> View Piece
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                        style={{ color: WARM_GRAY }}>
                        <Github size={14} /> Studio Notes
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Experience ---------- */

const Experience = ({ experience }) => {
  if (!experience?.length) return null;
  return (
    <section id="experience" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: CREAM }}>
      <ClayBlob size={260} className="-left-20 top-24" color={SAND} />
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeSoft} className="text-center mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: TERRACOTTA }}>Thrown Over Time</span>
            <h2 className="font-serif text-4xl font-bold mt-2" style={{ color: INK }}>Experience</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-5 top-3 bottom-3 w-px" style={{ backgroundColor: '#dcc9ab' }} aria-hidden="true" />
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeSoft} className="relative pl-16 pb-9 last:pb-0">
                <div className="absolute left-0 top-1 w-11 h-11 rounded-full border-[3px] flex items-center justify-center"
                  style={{ backgroundColor: CREAM, borderColor: i % 2 === 0 ? TERRACOTTA : SAND_DEEP, boxShadow: matteShadow }}>
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: i % 2 === 0 ? TERRACOTTA : SAND_DEEP }} />
                </div>
                <div className="rounded-[2rem] p-6" style={{ backgroundColor: '#fffdf8', boxShadow: matteShadow }}>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full mb-3"
                    style={{ backgroundColor: SAND, color: CLAY_DARK }}>
                    {exp.period || 'A season'}
                  </span>
                  <h3 className="font-serif text-xl font-bold" style={{ color: INK }}>{exp.role}</h3>
                  <p className="text-sm font-medium mb-2" style={{ color: TERRACOTTA }}>{exp.company}</p>
                  {exp.description && <p className="text-sm leading-relaxed" style={{ color: WARM_GRAY }}>{exp.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Testimonials ---------- */

const Testimonials = ({ testimonials }) => {
  if (!testimonials?.length) return null;
  return (
    <section id="testimonials" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: SAND }}>
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeSoft} className="text-center mb-14">
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: CLAY_DARK }}>Kind Words</span>
            <h2 className="font-serif text-4xl font-bold mt-2" style={{ color: INK }}>Testimonials</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeSoft} whileHover={{ y: -5 }}
                className="p-7"
                style={{
                  backgroundColor: CREAM,
                  borderRadius: i % 2 === 0 ? '2.5rem 1.75rem 2.5rem 1.75rem' : '1.75rem 2.5rem 1.75rem 2.5rem',
                  boxShadow: matteShadow
                }}>
                <span className="font-serif text-5xl leading-none block mb-2" style={{ color: TERRACOTTA }}>"</span>
                <p className="font-serif italic leading-relaxed mb-6" style={{ color: '#5d5145' }}>{t.text}</p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px dashed #d9c8a8' }}>
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" style={{ boxShadow: matteShadow }} />
                    : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: TERRACOTTA }}>
                        {initialsOf(t.name) || '?'}
                      </div>}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: INK }}>{t.name}</div>
                    <div className="text-xs truncate" style={{ color: WARM_GRAY }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Contact (the kiln) ---------- */

const Contact = ({ p, socials }) => {
  const links = [
    { url: socials?.github, label: 'GitHub', Icon: Github },
    { url: socials?.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { url: socials?.twitter, label: 'Twitter', Icon: Twitter },
  ].filter((l) => l.url);
  const email = p.email || socials?.email;

  return (
    <section id="contact" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: CREAM }}>
      <ClayBlob size={300} className="-left-24 -bottom-20" color="#eec9b4" />
      <ClayBlob size={260} className="-right-20 top-8" color={SAND} />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}
          className="p-10 md:p-12" style={{ backgroundColor: '#fffdf8', borderRadius: '3rem', boxShadow: matteShadow }}>
          <motion.div variants={fadeSoft}>
            <Vessel w={54} h={70} color={TERRACOTTA} className="mx-auto mb-6" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: TERRACOTTA }}>Open Studio</span>
            <h2 className="font-serif text-4xl font-bold mt-2 mb-3" style={{ color: INK }}>Let's Make Something</h2>
            <p className="mb-9" style={{ color: WARM_GRAY }}>Commissions, collaborations, or just a quiet chat over coffee — the studio door is open.</p>
          </motion.div>
          <motion.div variants={fadeSoft} className="flex justify-center gap-4 flex-wrap mb-8">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: TERRACOTTA, boxShadow: matteShadow }}>
                <Mail size={17} /> {email}
              </a>
            )}
            {p.phone && (
              <a href={`tel:${p.phone}`} className="flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold transition-colors hover:bg-white"
                style={{ color: INK, border: '1.5px solid rgba(69,58,48,0.25)' }}>
                <Phone size={16} /> {p.phone}
              </a>
            )}
          </motion.div>
          <motion.div variants={fadeSoft} className="flex justify-center gap-3">
            {links.map(({ url, label, Icon }) => (
              <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: SAND, color: CLAY_DARK }}>
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Main ---------- */

export default function CeramicMinimal() {
  const { portfolioData } = usePortfolio();
  const d = portfolioData || {};
  const p = d.personal || {};
  const socials = d.socials || {};
  const skills = Array.isArray(d.skills) ? d.skills : [];
  const projects = Array.isArray(d.projects) ? d.projects : [];
  const experience = Array.isArray(d.experience) ? d.experience : [];
  const testimonials = Array.isArray(d.testimonials) ? d.testimonials : [];
  const stats = d.stats || {};
  const year = new Date().getFullYear();

  const navItems = ['About', 'Skills', 'Collection', 'Journey', 'Studio'];

  return (
    <div className="font-sans antialiased" style={{ backgroundColor: CREAM }}>
      <nav className="fixed top-5 inset-x-0 z-50 flex justify-center px-4">
        <div className="flex items-center gap-4 sm:gap-7 px-6 py-2.5 rounded-full overflow-x-auto max-w-full"
          style={{ backgroundColor: 'rgba(250,246,239,0.88)', backdropFilter: 'blur(10px)', boxShadow: matteShadow }}>
          <a href="#hero" className="flex items-center gap-2 font-serif font-bold text-sm whitespace-nowrap" style={{ color: CLAY_DARK }}>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TERRACOTTA }} />
            {p.name || 'Studio'}
          </a>
          {navItems.map((item, i) => (
            <a key={item} href={['#about', '#skills', '#projects', '#experience', '#contact'][i]}
              className="text-[11px] font-medium uppercase tracking-[0.2em] whitespace-nowrap hover:opacity-60 transition-opacity"
              style={{ color: INK }}>
              {item}
            </a>
          ))}
        </div>
      </nav>

      <Hero p={p} />
      <About p={p} stats={stats} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Testimonials testimonials={testimonials} />
      <Contact p={p} socials={socials} />

      <footer className="py-10 px-6 text-center" style={{ backgroundColor: CREAM }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TERRACOTTA }} />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SAND_DEEP }} />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CLAY_DARK }} />
        </div>
        <p className="text-xs" style={{ color: WARM_GRAY }}>© {year} {p.name} · Ceramic Minimal</p>
      </footer>
    </div>
  );
}
