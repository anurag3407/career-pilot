import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Github, Linkedin, Twitter, ExternalLink, MapPin, Leaf, Mountain,
  Feather, User, ChevronDown, Phone
} from 'lucide-react';

/**
 * Bonsai Garden Portfolio Template
 * Category: Nature / Organic
 * Description: Japanese zen garden theme with bonsai tree illustrations, raked sand patterns (CSS), stone elements. Muted earth tones with moss green accents.
 */

const SAND = '#f2ead8';
const SAND_LIGHT = '#faf5e9';
const INK = '#3a352e';
const MOSS = '#55663f';
const MOSS_SOFT = '#6d7f52';
const PINE = '#2e3527';
const CLAY = '#a98e6c';

const fadeSlow = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } }
};
const stagger = { visible: { transition: { staggerChildren: 0.18 } } };

/* ---------- Decorative pieces ---------- */

const Bonsai = ({ className = '', sway = true }) => (
  <svg viewBox="0 0 220 240" className={className} aria-hidden="true">
    <path d="M70 200 h80 l-9 28 h-62 z" fill="#7a5c44" />
    <rect x="63" y="193" width="94" height="10" rx="4" fill="#8a6a50" />
    <ellipse cx="110" cy="196" rx="42" ry="6" fill="#4a3a2c" />
    <path d="M110 194 C105 168 119 150 104 128 C93 112 97 96 106 82"
      fill="none" stroke="#5c4634" strokeWidth="9" strokeLinecap="round" />
    <path d="M108 150 C124 143 139 140 152 132" fill="none" stroke="#5c4634" strokeWidth="5" strokeLinecap="round" />
    <path d="M106 110 C90 102 79 100 64 94" fill="none" stroke="#5c4634" strokeWidth="5" strokeLinecap="round" />
    <path d="M106 82 C118 75 131 73 142 66" fill="none" stroke="#5c4634" strokeWidth="4" strokeLinecap="round" />
    <g style={sway ? { transformOrigin: '110px 90px', animation: 'bonsaiSway 7s ease-in-out infinite' } : undefined}>
      <ellipse cx="152" cy="126" rx="30" ry="14" fill={MOSS_SOFT} />
      <ellipse cx="62" cy="88" rx="28" ry="13" fill="#5f7148" />
      <ellipse cx="142" cy="60" rx="31" ry="14" fill="#7c8f5f" />
      <ellipse cx="104" cy="72" rx="26" ry="12" fill={MOSS_SOFT} />
      <ellipse cx="104" cy="128" rx="22" ry="10" fill="#8ba06b" />
    </g>
  </svg>
);

const Enso = ({ className = '', stroke = INK, opacity = 0.45 }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="40" fill="none" stroke={stroke} strokeWidth="5" strokeLinecap="round"
      strokeDasharray="212 39" opacity={opacity} transform="rotate(-70 50 50)" />
  </svg>
);

const Stone = ({ size = 64, className = '' }) => (
  <div aria-hidden="true" className={className}
    style={{
      width: size, height: size * 0.6, borderRadius: '50%',
      background: 'radial-gradient(ellipse at 35% 30%, #a89e8b, #6e6759 72%)',
      boxShadow: '0 12px 20px rgba(60,52,40,0.22)'
    }} />
);

const rakedSand = {
  backgroundColor: SAND,
  backgroundImage:
    'repeating-radial-gradient(circle at 50% 118%, rgba(90,80,60,0.07) 0 2px, transparent 2px 46px),' +
    'repeating-linear-gradient(90deg, rgba(90,80,60,0.05) 0 1px, transparent 1px 58px)'
};

const VerticalWord = ({ word, className = '', color = '#8a8577', opacity = 0.55 }) => (
  <div aria-hidden="true"
    className={`hidden lg:block select-none text-[11px] font-semibold tracking-[0.7em] uppercase ${className}`}
    style={{ writingMode: 'vertical-rl', color, opacity }}>
    {word}
  </div>
);

/* ---------- Hero ---------- */

const Hero = ({ p }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden" style={rakedSand}>
    <Enso className="absolute w-[26rem] h-[26rem] left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] opacity-40" />
    <Bonsai className="absolute w-56 md:w-72 right-[4%] bottom-0 opacity-90" />
    <Stone size={90} className="absolute left-[6%] bottom-16 hidden md:block" />
    <Stone size={44} className="absolute left-[16%] bottom-10 hidden md:block" />
    <Stone size={30} className="absolute right-[30%] bottom-8 hidden md:block" />
    <VerticalWord word="Harmony" className="absolute left-8 top-24" />
    <VerticalWord word="Simplicity" className="absolute right-8 top-32" />

    <motion.div className="relative z-10 text-center max-w-3xl" initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeSlow} className="mb-5">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-[#6d7f52]/40 text-[#55663f] text-xs font-semibold tracking-[0.3em] uppercase">
          <Leaf size={13} /> Zen Portfolio
        </span>
      </motion.div>
      <motion.h1 variants={fadeSlow} className="font-serif text-5xl md:text-7xl font-bold mb-5" style={{ color: INK }}>
        {p.name}
      </motion.h1>
      {p.title && <motion.p variants={fadeSlow} className="text-xl md:text-2xl font-serif mb-2" style={{ color: MOSS }}>{p.title}</motion.p>}
      {p.tagline && <motion.p variants={fadeSlow} className="text-[#6e6759] font-serif italic mb-2">{p.tagline}</motion.p>}
      {p.location && (
        <motion.p variants={fadeSlow} className="text-sm text-[#8a8577] flex items-center justify-center gap-1.5 mb-8">
          <MapPin size={14} /> {p.location}
        </motion.p>
      )}
      <motion.div variants={fadeSlow} className="flex justify-center gap-4 flex-wrap pt-2">
        <a href="#about" className="px-7 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-all hover:shadow-lg"
          style={{ backgroundColor: MOSS }}>
          Walk the Garden
        </a>
        <a href="#contact" className="px-7 py-3 rounded-full text-sm font-semibold border transition-colors hover:bg-white/60"
          style={{ borderColor: INK + '55', color: INK }}>
          Share Tea
        </a>
      </motion.div>
    </motion.div>

    <motion.div className="absolute bottom-8 z-10" style={{ color: '#8a8577' }} animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
      <ChevronDown size={26} />
    </motion.div>

    <style>{`@keyframes bonsaiSway { 0%,100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }`}</style>
  </section>
);

/* ---------- About ---------- */

const About = ({ p, stats }) => {
  const hasStats = stats && (stats.yearsExperience || stats.projectsCompleted || stats.happyClients);
  if (!p.bio && !p.avatar && !hasStats) return null;
  const statItems = [
    { label: 'Seasons Tending', value: stats?.yearsExperience },
    { label: 'Trees Shaped', value: stats?.projectsCompleted },
    { label: 'Garden Visitors', value: stats?.happyClients },
  ].filter((s) => s.value);

  return (
    <section id="about" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: SAND_LIGHT }}>
      <Stone size={70} className="absolute right-[8%] top-10 opacity-70 hidden md:block" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}
          className="grid md:grid-cols-2 gap-14 items-center">
          <motion.div variants={fadeSlow} className="relative mx-auto">
            <Enso className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)]" stroke={MOSS_SOFT} opacity={0.5} />
            {p.avatar
              ? <img src={p.avatar} alt={p.name} className="relative w-64 h-64 object-cover shadow-lg"
                  style={{ borderRadius: '58% 42% 55% 45% / 52% 55% 45% 48%' }} />
              : <div className="relative w-64 h-64 flex items-center justify-center shadow-lg"
                  style={{ borderRadius: '58% 42% 55% 45% / 52% 55% 45% 48%', backgroundColor: MOSS }}>
                  <span className="font-serif text-6xl text-white">
                    {(p.name || '').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || <User size={56} />}
                  </span>
                </div>}
          </motion.div>
          <motion.div variants={fadeSlow}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: MOSS }}>
              <User size={14} /> The Gardener
            </span>
            <h2 className="font-serif text-4xl font-bold mt-3 mb-4" style={{ color: INK }}>About Me</h2>
            {p.bio && <p className="leading-relaxed mb-8 max-w-lg" style={{ color: '#5d564b' }}>{p.bio}</p>}
            {hasStats && (
              <div className="flex flex-wrap gap-4">
                {statItems.map((s, i) => (
                  <div key={i} className="text-center">
                    <Stone size={86} className="mx-auto flex items-center justify-center relative">
                      <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg drop-shadow">{s.value}</span>
                    </Stone>
                    <div className="text-[10px] font-semibold tracking-widest uppercase mt-3" style={{ color: '#8a8577' }}>{s.label}</div>
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

/* ---------- Skills (moss garden) ---------- */

const Skills = ({ skills }) => {
  if (!skills?.length) return null;
  return (
    <section id="skills" className="relative py-24 px-6 overflow-hidden" style={rakedSand}>
      <VerticalWord word="Patience" className="absolute right-8 top-24" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeSlow} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: MOSS }}>
              <Mountain size={14} /> Moss Garden
            </span>
            <h2 className="font-serif text-4xl font-bold mt-3" style={{ color: INK }}>Skills & Tools</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((s, i) => (
              <motion.div key={i} variants={fadeSlow} whileHover={{ y: -4 }}
                className="p-6 shadow-md"
                style={{
                  backgroundColor: MOSS,
                  borderRadius: `${58 + ((i * 13) % 8)}% ${42 + ((i * 7) % 6)}% 55% 45% / ${52 + ((i * 11) % 6)}% 48% 52% 48%`
                }}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif font-bold text-white text-lg">{s.name}</h3>
                  <span className="text-xs font-semibold text-white/80">{s.level || 85}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/25 mt-4 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-white/90"
                    initial={{ width: 0 }} whileInView={{ width: `${s.level || 85}%` }}
                    viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.08 }} />
                </div>
                {s.category && <div className="text-[10px] font-semibold tracking-widest uppercase text-white/70 mt-3">{s.category}</div>}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Projects (stones along a garden path) ---------- */

const Projects = ({ projects }) => {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: SAND_LIGHT }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.div variants={fadeSlow} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: MOSS }}>
              <Mountain size={14} /> Garden Map
            </span>
            <h2 className="font-serif text-4xl font-bold mt-3" style={{ color: INK }}>Selected Works</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-[#a99e88] hidden md:block" aria-hidden="true" />
            {projects.map((project, i) => {
              const tech = Array.isArray(project.techStack) ? project.techStack : [];
              return (
                <motion.div key={i} variants={fadeSlow}
                  className={`relative md:w-[calc(50%-2.5rem)] mb-12 ${i % 2 === 0 ? 'md:mr-auto md:pr-0' : 'md:ml-auto'}`}>
                  <Stone size={26} className={`hidden md:block absolute top-8 ${i % 2 === 0 ? '-right-14' : '-left-14'}`} />
                  <motion.div whileHover={{ y: -5 }} className="bg-white rounded-[2rem] shadow-md border border-[#e3d9c2] overflow-hidden">
                    {project.image && (
                      <img src={project.image} alt={project.title} className="w-full h-44 object-cover" />
                    )}
                    <div className="p-7">
                      <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] uppercase mb-2" style={{ color: CLAY }}>
                        <Leaf size={11} /> Bed {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: INK }}>{project.title}</h3>
                      {project.description && <p className="text-sm leading-relaxed mb-4" style={{ color: '#5d564b' }}>{project.description}</p>}
                      {tech.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {tech.map((t, j) => (
                            <span key={j} className="px-3 py-1 rounded-full text-xs font-medium border"
                              style={{ backgroundColor: SAND, borderColor: '#d9cdb2', color: '#5d564b' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-5">
                        {project.liveUrl && project.liveUrl !== '#' && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: MOSS }}>
                            <ExternalLink size={14} /> Visit
                          </a>
                        )}
                        {project.githubUrl && project.githubUrl !== '#' && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: '#6e6759' }}>
                            <Github size={14} /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Experience (seasons) ---------- */

const Experience = ({ experience }) => {
  if (!experience?.length) return null;
  const seasonColors = ['#6d7f52', '#7c8f5f', '#a98e6c', '#8a8577'];
  return (
    <section id="experience" className="relative py-24 px-6 overflow-hidden" style={rakedSand}>
      <Bonsai className="absolute w-48 -left-6 bottom-0 opacity-40 hidden lg:block" sway={false} />
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeSlow} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: MOSS }}>
              <Feather size={14} /> Passing Seasons
            </span>
            <h2 className="font-serif text-4xl font-bold mt-3" style={{ color: INK }}>Experience</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-[#a99e88]" aria-hidden="true" />
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeSlow} className="relative pl-14 pb-10 last:pb-0">
                <div className="absolute left-0 top-1 w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: SAND_LIGHT, borderColor: seasonColors[i % 4] }}>
                  <Leaf size={15} style={{ color: seasonColors[i % 4] }} />
                </div>
                <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-[#e3d9c2]">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white"
                    style={{ backgroundColor: seasonColors[i % 4] }}>
                    {exp.period || 'A season'}
                  </span>
                  <h3 className="font-serif text-xl font-bold mt-3" style={{ color: INK }}>{exp.role}</h3>
                  <p className="text-sm font-semibold mb-2" style={{ color: CLAY }}>{exp.company}</p>
                  {exp.description && <p className="text-sm leading-relaxed" style={{ color: '#5d564b' }}>{exp.description}</p>}
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
    <section id="testimonials" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: SAND_LIGHT }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeSlow} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: MOSS }}>
              <Feather size={14} /> Voices on the Wind
            </span>
            <h2 className="font-serif text-4xl font-bold mt-3" style={{ color: INK }}>Testimonials</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeSlow}
                className="p-7 shadow-sm border border-[#e3d9c2]"
                style={{
                  backgroundColor: '#fdf9ef',
                  borderRadius: `${i % 2 === 0 ? '1.75rem 1rem 1.75rem 1rem' : '1rem 1.75rem 1rem 1.75rem'}`,
                  backgroundImage: 'repeating-linear-gradient(45deg, rgba(169,142,108,0.04) 0 6px, transparent 6px 12px)'
                }}>
                <p className="font-serif italic leading-relaxed mb-6" style={{ color: '#4a443b' }}>"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-dashed border-[#d9cdb2]">
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: MOSS_SOFT }} />
                    : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: MOSS_SOFT }}>
                        {(t.name || '').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'}
                      </div>}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: INK }}>{t.name}</div>
                    <div className="text-xs truncate" style={{ color: '#8a8577' }}>{t.role}</div>
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

/* ---------- Contact (tea house) ---------- */

const Contact = ({ p, socials }) => {
  const links = [
    { url: socials?.github, label: 'GitHub', Icon: Github },
    { url: socials?.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { url: socials?.twitter, label: 'Twitter', Icon: Twitter },
  ].filter((l) => l.url);
  const email = p.email || socials?.email;

  return (
    <section id="contact" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: PINE }}>
      <Enso className="absolute w-80 h-80 left-1/2 -translate-x-1/2 top-10" stroke={SAND} opacity={0.15} />
      <Stone size={60} className="absolute left-[10%] bottom-12 opacity-60 hidden md:block" />
      <motion.div className="relative z-10 max-w-2xl mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
        <motion.div variants={fadeSlow}>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: '#a9bd85' }}>
            <Leaf size={14} /> The Tea House
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-3" style={{ color: SAND }}>Let's Sit Together</h2>
          <p className="mb-10" style={{ color: '#b8b29f' }}>The kettle is warm and there is always time for one more conversation.</p>
        </motion.div>
        <motion.div variants={fadeSlow} className="flex justify-center gap-4 flex-wrap mb-10">
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold shadow-md transition-all hover:shadow-lg"
              style={{ backgroundColor: MOSS_SOFT, color: 'white' }}>
              <Mail size={17} /> Write a Letter
            </a>
          )}
          {p.phone && (
            <a href={`tel:${p.phone}`} className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold border transition-colors hover:bg-white/10"
              style={{ borderColor: '#b8b29f55', color: SAND }}>
              <Phone size={16} /> {p.phone}
            </a>
          )}
        </motion.div>
        <motion.div variants={fadeSlow} className="flex justify-center gap-3">
          {links.map(({ url, label, Icon }) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label}
              className="w-11 h-11 rounded-full border flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ borderColor: '#b8b29f44', color: SAND }}>
              <Icon size={17} />
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ---------- Main ---------- */

export default function BonsaiGarden() {
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

  const navItems = [
    { label: 'About', href: '#about' }, { label: 'Skills', href: '#skills' },
    { label: 'Works', href: '#projects' }, { label: 'Path', href: '#experience' },
    { label: 'Tea', href: '#contact' },
  ];

  return (
    <div className="font-sans antialiased" style={{ backgroundColor: SAND }}>
      <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <div className="flex items-center gap-5 sm:gap-8 px-6 py-2.5 rounded-full shadow-md border border-[#e3d9c2] overflow-x-auto max-w-full"
          style={{ backgroundColor: 'rgba(250,245,233,0.92)', backdropFilter: 'blur(8px)' }}>
          <a href="#hero" className="flex items-center gap-1.5 font-serif font-bold text-sm whitespace-nowrap" style={{ color: MOSS }}>
            <Leaf size={15} /> {p.name || 'Garden'}
          </a>
          {navItems.map((n) => (
            <a key={n.label} href={n.href}
              className="text-[11px] font-semibold tracking-[0.2em] uppercase whitespace-nowrap hover:opacity-70 transition-opacity"
              style={{ color: INK }}>
              {n.label}
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

      <footer className="py-10 px-6 text-center" style={{ backgroundColor: '#232a1e' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf size={14} style={{ color: '#a9bd85' }} />
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#8b977a' }}>Bonsai Garden</span>
        </div>
        <p className="text-xs" style={{ color: '#6f7a63' }}>© {year} {p.name}</p>
      </footer>
    </div>
  );
}
