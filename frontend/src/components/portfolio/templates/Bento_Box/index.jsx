import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Mail, Github, Linkedin, Twitter, ArrowUpRight,
  Quote, Sparkles
} from 'lucide-react';

/**
 * Bento Box Portfolio Template
 * Category: Glass / Modern UI
 * Description: Apple-style Bento box grid with mixed-size cards in a tight grid layout. Each card showcases a different aspect (photo, stat, skill, project).
 */

const BG = '#f5f5f7';
const CARD = '#ffffff';
const DARK = '#101013';
const TXT = '#1d1d1f';
const SUB = '#6e6e73';
const HAIR = 'rgba(0,0,0,0.08)';

const fadeUp = {
  hidden: { opacity: 0, y: 26, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'B';
};

const cardBase = 'rounded-[28px] transition-shadow hover:shadow-[0_10px_36px_rgba(0,0,0,0.09)]';
const cardLight = { background: CARD, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' };
const cardDark = { background: DARK };

const BandTitle = ({ children, count }) => (
  <div className="flex items-baseline justify-between mb-3 px-1">
    <h2 className="text-sm font-semibold tracking-wide" style={{ color: SUB }}>{children}</h2>
    {count !== undefined && (
      <span className="text-xs tabular-nums" style={{ color: 'rgba(110,110,115,0.6)' }}>{count}</span>
    )}
  </div>
);

// Hero band — the intro bento row
const HeroBand = ({ data }) => {
  const name = data.personal?.name || 'My Portfolio';
  const stats = [
    { label: 'Years of craft', value: data.stats?.yearsExperience },
    { label: 'Projects shipped', value: data.stats?.projectsCompleted },
    { label: 'Happy clients', value: data.stats?.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="hero" className="pt-24 pb-3 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-auto">
          {/* intro card 2x2 */}
          <motion.div variants={fadeUp} whileHover={{ scale: 1.015 }} className={`${cardBase} col-span-2 row-span-2 p-8 md:p-10 flex flex-col justify-between`}
            style={cardLight}>
            <div className="flex items-start justify-between gap-4">
              {data.personal?.avatar ? (
                <img src={data.personal.avatar} alt={name} className="w-16 h-16 rounded-2xl object-cover" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }} />
              ) : (
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-semibold text-white" style={{ background: DARK }}>
                  {initialsOf(name)}
                </div>
              )}
              <Sparkles size={18} style={{ color: 'rgba(29,29,31,0.35)' }} />
            </div>
            <div className="mt-8">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]" style={{ color: TXT }}>
                {name}
              </h1>
              {data.personal?.title && (
                <p className="text-lg mt-2 font-medium" style={{ color: SUB }}>{data.personal.title}</p>
              )}
              {data.personal?.tagline && (
                <p className="text-sm mt-4 leading-relaxed max-w-md" style={{ color: SUB }}>
                  {data.personal.tagline}
                </p>
              )}
              <div className="flex flex-wrap gap-2.5 mt-7">
                <a href="#about" className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-transform hover:scale-[1.03]"
                  style={{ background: DARK }}>
                  About me
                </a>
                <a href="#projects" className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-black/5"
                  style={{ background: 'rgba(0,0,0,0.05)', color: TXT }}>
                  View projects
                </a>
                <a href="#contact" className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors hover:bg-black/5"
                  style={{ background: 'rgba(0,0,0,0.05)', color: TXT }}>
                  Say hello
                </a>
              </div>
            </div>
          </motion.div>

          {/* stat cards */}
          {stats.slice(0, 3).map((s, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.03 }}
              className={`${cardBase} p-6 flex flex-col justify-between min-h-[130px]`} style={cardLight}>
              <span className="text-4xl md:text-5xl font-semibold tracking-tight" style={{ color: TXT }}>
                {s.value}
              </span>
              <span className="text-xs font-medium mt-2" style={{ color: SUB }}>
                {s.label}
              </span>
            </motion.div>
          ))}

          {/* location card fills the last hero cell */}
          <motion.div variants={fadeUp} whileHover={{ scale: 1.03 }} className={`${cardBase} p-6 flex flex-col justify-between min-h-[130px]`}
            style={cardLight}>
            <MapPin size={20} style={{ color: TXT }} />
            <div className="mt-2">
              <p className="text-sm font-semibold" style={{ color: TXT }}>
                {data.personal?.location || 'Everywhere'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: SUB }}>Based in</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// About band — bio + portrait
const AboutBand = ({ data }) => {
  const name = data.personal?.name || 'This maker';
  const hasAvatar = Boolean(data.personal?.avatar);
  return (
    <section id="about" className="py-3 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <BandTitle>About</BandTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.div variants={fadeUp} className={`${cardBase} col-span-2 p-8 md:p-10 ${hasAvatar ? 'md:col-span-3' : 'md:col-span-4'}`}
              style={cardLight}>
              <p className="text-xl md:text-2xl leading-relaxed font-medium tracking-tight" style={{ color: TXT }}>
                {data.personal?.bio || `${name} keeps this card reserved for a short introduction.`}
              </p>
              {data.personal?.email && (
                <a href={`mailto:${data.personal.email}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium mt-6 hover:opacity-70 transition-opacity"
                  style={{ color: TXT }}>
                  {data.personal.email} <ArrowUpRight size={14} />
                </a>
              )}
            </motion.div>
            {hasAvatar && (
              <motion.div variants={fadeUp} className="col-span-2 md:col-span-1 p-3 overflow-hidden" style={cardLight}>
                <img src={data.personal.avatar} alt={name}
                  className="w-full h-48 md:h-full min-h-[180px] object-cover rounded-[20px]"
                  style={{ filter: 'grayscale(1) contrast(1.05)' }} />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Skills band — one tight card per skill
const SkillsBand = ({ data }) => (
  <section id="skills" className="py-3 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
        <BandTitle count={data.skills.length}>Skills</BandTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.03 }} className={`${cardBase} p-5`} style={cardLight}>
              <div className="flex items-baseline justify-between gap-2 mb-3">
                <span className="text-sm font-semibold truncate" style={{ color: TXT }}>{skill.name}</span>
                <span className="text-xs tabular-nums" style={{ color: SUB }}>{skill.level}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                <motion.div className="h-full rounded-full" style={{ background: TXT }}
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.9, delay: (i % 4) * 0.06 }} viewport={{ once: true }} />
              </div>
              {skill.category && (
                <p className="text-[10px] uppercase tracking-wider mt-2.5" style={{ color: 'rgba(110,110,115,0.75)' }}>
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

// Projects band — wide cards with grayscale imagery
const ProjectsBand = ({ data }) => (
  <section id="projects" className="py-3 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        <BandTitle count={data.projects.length}>Selected work</BandTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.projects.map((project, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.015 }}
              className={`${cardBase} col-span-2 overflow-hidden group`} style={cardLight}>
              {project.image && (
                <img src={project.image} alt={project.title}
                  className="w-full h-44 md:h-52 object-cover transition-all duration-500"
                  style={{ filter: 'grayscale(1) contrast(1.05)' }} />
              )}
              <div className="p-6 md:p-7">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="text-lg font-semibold tracking-tight" style={{ color: TXT }}>{project.title}</h3>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full shrink-0"
                    style={{ background: 'rgba(0,0,0,0.05)', color: SUB }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                {project.description && (
                  <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: SUB }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.slice(0, 4).map((tech, j) => (
                      <span key={j} className="text-[10px] font-medium px-2 py-1 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.05)', color: SUB }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 text-sm font-medium">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:opacity-65 transition-opacity" style={{ color: TXT }}>
                      Preview <ArrowUpRight size={14} />
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 hover:opacity-65 transition-opacity" style={{ color: SUB }}>
                      <Github size={14} /> Code
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

// Experience band — slim timeline rows
const ExperienceBand = ({ data }) => (
  <section id="experience" className="py-3 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <BandTitle count={data.experience.length}>Experience</BandTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.015 }}
              className={`${cardBase} col-span-2 p-6 md:p-7`} style={i === 0 ? cardDark : cardLight}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? '#5ee27a' : TXT }} />
                <span className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: i === 0 ? 'rgba(255,255,255,0.55)' : SUB }}>
                  {exp.period || 'Timeline'}
                </span>
              </div>
              <h3 className="text-base font-semibold tracking-tight" style={{ color: i === 0 ? '#fff' : TXT }}>
                {exp.role}
              </h3>
              {exp.company && (
                <p className="text-xs mt-0.5 mb-2" style={{ color: i === 0 ? 'rgba(255,255,255,0.55)' : SUB }}>{exp.company}</p>
              )}
              {exp.description && (
                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: i === 0 ? 'rgba(255,255,255,0.7)' : SUB }}>
                  {exp.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Testimonials band — quote cards
const TestimonialsBand = ({ data }) => (
  <section id="testimonials" className="py-3 px-4">
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <BandTitle count={data.testimonials.length}>Kind words</BandTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ scale: 1.02 }}
              className={`${cardBase} col-span-2 p-7 flex flex-col justify-between`} style={i % 2 === 1 ? cardDark : cardLight}>
              <div>
                <Quote size={18} className="mb-4" style={{ color: i % 2 === 1 ? 'rgba(255,255,255,0.5)' : 'rgba(29,29,31,0.4)' }} />
                <p className="text-[15px] leading-relaxed" style={{ color: i % 2 === 1 ? 'rgba(255,255,255,0.85)' : TXT }}>
                  {t.text}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover"
                    style={i % 2 === 1 ? { border: '1px solid rgba(255,255,255,0.25)' } : {}} />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={i % 2 === 1
                      ? { background: 'rgba(255,255,255,0.14)', color: '#fff' }
                      : { background: 'rgba(0,0,0,0.06)', color: TXT }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold" style={{ color: i % 2 === 1 ? '#fff' : TXT }}>{t.name}</div>
                  {t.role && <div className="text-xs" style={{ color: i % 2 === 1 ? 'rgba(255,255,255,0.55)' : SUB }}>{t.role}</div>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Contact band — the big dark closing card + footer
const ContactBand = ({ data }) => {
  const name = data.personal?.name || 'My Portfolio';
  const socials = [
    { key: 'github', icon: Github, label: 'GitHub' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'twitter', icon: Twitter, label: 'Twitter' },
  ].filter(s => data.socials?.[s.key]);

  return (
    <section id="contact" className="py-3 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <BandTitle>Contact</BandTitle>
          <motion.div variants={fadeUp} className={`${cardBase} p-10 md:p-14 text-center`} style={cardDark}>
            <Sparkles size={20} className="mx-auto mb-5" style={{ color: 'rgba(255,255,255,0.6)' }} />
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight" style={{ color: '#fff' }}>
              Let's build something great.
            </h2>
            {data.personal?.email && (
              <a href={`mailto:${data.personal.email}`}
                className="inline-flex items-center gap-2 mt-7 px-6 py-3 rounded-full text-sm font-medium bg-white transition-transform hover:scale-[1.04]"
                style={{ color: TXT }}>
                <Mail size={15} /> {data.personal.email}
              </a>
            )}
            <div className="flex justify-center gap-3 mt-6">
              {socials.map(({ key, icon: Icon, label }) => (
                <a key={key} href={data.socials[key]} target="_blank" rel="noreferrer" aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>
          <motion.p variants={fadeUp} className="text-center text-xs py-8" style={{ color: 'rgba(110,110,115,0.7)' }}>
            &copy; {new Date().getFullYear()} {name} · Arranged in a bento box
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// Main component
export default function BentoBox() {
  const { portfolioData: data } = usePortfolio();

  const navItems = [
    { label: 'About', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Skills', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Work', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Experience', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Words', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Contact', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: BG, color: TXT }}>
      {/* minimal sticky header */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(245,245,247,0.8)', borderBottom: `1px solid ${HAIR}` }}>
        <div className="max-w-6xl mx-auto px-5 h-12 flex items-center gap-6">
          <a href="#hero" className="text-sm font-semibold whitespace-nowrap" style={{ color: TXT }}>
            {data.personal?.name || 'Bento'}
          </a>
          <div className="flex gap-5 overflow-x-auto ml-auto">
            {navItems.map(item => (
              <a key={item.href} href={item.href}
                className="whitespace-nowrap text-xs font-medium transition-colors hover:text-black"
                style={{ color: SUB }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <HeroBand data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <AboutBand data={data} />}
      {data.skills?.length > 0 && <SkillsBand data={data} />}
      {data.projects?.length > 0 && <ProjectsBand data={data} />}
      {data.experience?.length > 0 && <ExperienceBand data={data} />}
      {data.testimonials?.length > 0 && <TestimonialsBand data={data} />}
      <ContactBand data={data} />
    </div>
  );
}
