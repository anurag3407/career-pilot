import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, ArrowDown, Mail, Github, Linkedin, Twitter, Phone
} from 'lucide-react';

/**
 * Creative Agency Portfolio Template
 * Category: Professional / Industry
 * Description: Bold creative agency style with oversized typography, case study focus with before/after, black and white with one vibrant accent color.
 */

const ORANGE = '#ff4d00';
const BLACK = '#0a0a0a';
const WHITE = '#ffffff';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const initialsOf = (name) =>
  (name || '').trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const OutlineNumber = ({ n, className = '' }) => (
  <span aria-hidden="true" className={`font-black select-none leading-none ${className}`}
    style={{ WebkitTextStroke: `2px ${ORANGE}`, color: 'transparent' }}>
    {n}
  </span>
);

const SectionLabel = ({ num, title, light = false }) => (
  <div className="flex items-baseline gap-4 mb-12">
    <span className="font-mono text-xs tracking-widest" style={{ color: ORANGE }}>{num}</span>
    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none"
      style={{ color: light ? WHITE : BLACK }}>
      {title}
    </h2>
    <span className={`flex-1 border-t ${light ? 'border-white/20' : 'border-black/15'} mb-2`} />
  </div>
);

/* ---------- Hero ---------- */

const Hero = ({ p, stats }) => {
  const tickerItems = ['Strategy', 'Design', 'Development', 'Branding', 'Motion', 'Web'];
  const hasStats = stats && (stats.yearsExperience || stats.projectsCompleted || stats.happyClients);
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-between overflow-hidden" style={{ backgroundColor: WHITE }}>
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 pt-28 pb-10 max-w-7xl mx-auto w-full">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.35em] uppercase mb-6 flex items-center gap-2" style={{ color: ORANGE }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ORANGE }} />
            {p.location || 'Worldwide'} — taking new briefs
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-black uppercase leading-[0.92] tracking-tight text-[16vw] md:text-[9rem] break-words"
            style={{ color: BLACK }}>
            {p.name}
          </motion.h1>
          <motion.p variants={fadeUp} className="font-black uppercase tracking-tight text-[8vw] md:text-7xl mt-2" style={{ color: ORANGE }}>
            {p.title || 'Creative Studio'}
          </motion.p>
          {p.tagline && <motion.p variants={fadeUp} className="text-lg md:text-xl mt-8 max-w-2xl" style={{ color: '#3d3d3d' }}>{p.tagline}</motion.p>}
          <motion.div variants={fadeUp} className="flex gap-8 flex-wrap mt-10">
            <a href="#projects" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest px-7 py-4 transition-colors hover:text-white"
              style={{ backgroundColor: BLACK, color: WHITE }}>
              See the work <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </a>
            <a href="#contact" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest px-7 py-4 border-2 transition-colors hover:bg-[#ff4d00] hover:border-[#ff4d00] hover:text-white"
              style={{ borderColor: BLACK, color: BLACK }}>
              Start a project <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {hasStats && (
        <div className="border-y-2 border-black">
          <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x-2 divide-black">
            {[
              { label: 'Years', value: stats.yearsExperience },
              { label: 'Projects', value: stats.projectsCompleted },
              { label: 'Clients', value: stats.happyClients },
            ].map((s, i) => (
              <div key={i} className="py-6 text-center" style={{ backgroundColor: WHITE }}>
                <div className="text-4xl md:text-6xl font-black" style={{ color: ORANGE }}>{s.value || 0}<span className="text-black">+</span></div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] mt-1" style={{ color: BLACK }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticker */}
      <div className="overflow-hidden border-b-2 border-black py-3" style={{ backgroundColor: ORANGE }} aria-hidden="true">
        <div className="flex w-max" style={{ animation: 'tickerMove 22s linear infinite' }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {tickerItems.map((word, i) => (
                <span key={i} className="mx-6 text-sm font-black uppercase tracking-[0.3em] text-white">
                  {word} <span style={{ color: BLACK }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes tickerMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
};

/* ---------- About (inverted studio block) ---------- */

const About = ({ p, stats }) => {
  if (!p.bio && !p.avatar) return null;
  return (
    <section id="about" className="py-24 px-6 md:px-12" style={{ backgroundColor: BLACK }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel num="01" title="The Studio" light />
          </motion.div>
          <div className="grid md:grid-cols-[auto,1fr] gap-12 items-center">
            <motion.div variants={fadeUp}>
              {p.avatar
                ? <img src={p.avatar} alt={p.name} className="w-64 h-80 object-cover border-2" style={{ borderColor: ORANGE }} />
                : <div className="w-64 h-80 border-2 flex items-center justify-center" style={{ borderColor: ORANGE, backgroundColor: '#141414' }}>
                    <span className="text-7xl font-black" style={{ color: ORANGE }}>{initialsOf(p.name) || 'CA'}</span>
                  </div>}
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="text-2xl md:text-3xl font-bold leading-snug max-w-2xl" style={{ color: WHITE }}>
                {p.bio || 'A studio practice built on bold ideas and rigorous craft.'}
              </p>
              <div className="flex items-center gap-3 mt-8">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ORANGE }} />
                <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: '#8a8a8a' }}>
                  {p.name} · Founder & Director
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Skills (services ledger) ---------- */

const Skills = ({ skills }) => {
  if (!skills?.length) return null;
  return (
    <section id="skills" className="py-24 px-6 md:px-12" style={{ backgroundColor: WHITE }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel num="02" title="Services" />
          </motion.div>
          <div className="border-t-2 border-black">
            {skills.map((s, i) => (
              <motion.div key={i} variants={fadeUp}
                className="group grid grid-cols-[auto,1fr,auto] items-center gap-4 md:gap-8 border-b border-black/15 py-5 px-3 transition-colors hover:bg-black">
                <span className="font-mono text-xs w-8" style={{ color: ORANGE }}>{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight truncate transition-colors group-hover:text-white"
                    style={{ color: BLACK }}>
                    {s.name}
                  </h3>
                  {s.category && <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: '#8a8a8a' }}>{s.category}</span>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block w-28 h-1 bg-black/10">
                    <motion.div className="h-full" style={{ backgroundColor: ORANGE }}
                      initial={{ width: 0 }} whileInView={{ width: `${s.level || 85}%` }}
                      viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.05 }} />
                  </div>
                  <span className="font-mono text-sm w-12 text-right transition-colors group-hover:text-white" style={{ color: ORANGE }}>
                    {s.level || 85}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Projects (case studies) ---------- */

const Projects = ({ projects }) => {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="py-24 px-6 md:px-12" style={{ backgroundColor: WHITE }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel num="03" title="Selected Work" />
          </motion.div>
          <div className="space-y-24">
            {projects.map((project, i) => {
              const tech = Array.isArray(project.techStack) ? project.techStack : [];
              const flip = i % 2 === 1;
              return (
                <motion.article key={i} variants={fadeUp}
                  className={`grid md:grid-cols-2 gap-10 items-center ${flip ? 'md:[direction:rtl]' : ''}`}>
                  <div className="md:[direction:ltr]">
                    <div className="relative overflow-hidden group border-2 border-black">
                      {project.image ? (
                        <img src={project.image} alt={project.title}
                          className="w-full h-72 md:h-[26rem] object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-72 md:h-[26rem] flex items-center justify-center transition-colors group-hover:bg-[#ff4d00]"
                          style={{ backgroundColor: '#f2f0ec' }}>
                          <span className="text-6xl font-black transition-colors group-hover:text-white" style={{ WebkitTextStroke: `2px ${ORANGE}`, color: 'transparent' }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                      )}
                      <OutlineNumber n={String(i + 1).padStart(2, '0')} className="absolute -bottom-4 -left-2 text-[6rem] opacity-80" />
                    </div>
                  </div>
                  <div className="md:[direction:ltr]">
                    <div className="font-mono text-xs tracking-[0.3em] uppercase mb-3 flex items-center gap-2" style={{ color: ORANGE }}>
                      Case study — {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-5" style={{ color: BLACK }}>
                      {project.title}
                    </h3>
                    {project.description && <p className="text-base leading-relaxed mb-6 max-w-xl" style={{ color: '#3d3d3d' }}>{project.description}</p>}
                    {tech.length > 0 && (
                      <div className="mb-6">
                        <div className="font-mono text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: '#8a8a8a' }}>The toolkit</div>
                        <div className="flex flex-wrap gap-2">
                          {tech.map((t, j) => (
                            <span key={j} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border-2 border-black"
                              style={{ color: BLACK }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="border-t-2 pt-4 flex flex-wrap gap-x-8 gap-y-3" style={{ borderColor: BLACK }}>
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer"
                          className="group inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-widest hover:text-[#ff4d00] transition-colors"
                          style={{ color: BLACK }}>
                          View outcome <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                      {project.githubUrl && project.githubUrl !== '#' && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer"
                          className="group inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-widest hover:text-[#ff4d00] transition-colors"
                          style={{ color: '#6a6a6a' }}>
                          <Github size={15} /> Process
                        </a>
                      )}
                    </div>
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

/* ---------- Experience (track record) ---------- */

const Experience = ({ experience }) => {
  if (!experience?.length) return null;
  return (
    <section id="experience" className="py-24 px-6 md:px-12" style={{ backgroundColor: WHITE }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel num="04" title="Track Record" />
          </motion.div>
          <div className="border-t-2 border-black">
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp}
                className="group grid md:grid-cols-[180px,1fr,auto] gap-3 md:gap-8 border-b border-black/15 py-7 px-3 transition-colors hover:bg-black">
                <span className="font-mono text-xs md:text-sm font-bold pt-1 transition-colors group-hover:text-white" style={{ color: ORANGE }}>
                  {exp.period || '—'}
                </span>
                <div className="min-w-0">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight transition-colors group-hover:text-white" style={{ color: BLACK }}>
                    {exp.role}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] mt-1 transition-colors group-hover:text-[#8a8a8a]" style={{ color: '#6a6a6a' }}>
                    {exp.company}
                  </p>
                  {exp.description && <p className="text-sm leading-relaxed mt-3 max-w-2xl transition-colors group-hover:text-[#cfcfcf]" style={{ color: '#3d3d3d' }}>
                    {exp.description}
                  </p>}
                </div>
                <ArrowUpRight size={26} className="hidden md:block self-center opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: ORANGE }} />
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
    <section id="testimonials" className="py-24 px-6 md:px-12" style={{ backgroundColor: WHITE }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel num="05" title="Client Words" />
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}
                className="border-2 border-black p-7 flex flex-col transition-colors hover:bg-black group">
                <span className="text-6xl leading-none font-black" style={{ color: ORANGE }}>"</span>
                <p className="text-sm leading-relaxed mt-3 mb-6 flex-1 transition-colors group-hover:text-white" style={{ color: '#3d3d3d' }}>
                  {t.text}
                </p>
                <div className="flex items-center gap-3 border-t-2 pt-4 transition-colors group-hover:border-white/25" style={{ borderColor: BLACK }}>
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-black" />
                    : <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-black"
                        style={{ color: ORANGE }}>
                        {initialsOf(t.name) || '?'}
                      </div>}
                  <div className="min-w-0">
                    <div className="font-black text-sm uppercase tracking-wide truncate transition-colors group-hover:text-white" style={{ color: BLACK }}>{t.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest truncate" style={{ color: '#8a8a8a' }}>{t.role}</div>
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

/* ---------- Contact ---------- */

const Contact = ({ p, socials }) => {
  const links = [
    { url: socials?.github, label: 'GitHub', Icon: Github },
    { url: socials?.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { url: socials?.twitter, label: 'Twitter', Icon: Twitter },
  ].filter((l) => l.url);
  const email = p.email || socials?.email;

  return (
    <section id="contact" className="py-28 px-6 md:px-12" style={{ backgroundColor: WHITE }}>
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <SectionLabel num="06" title="Contact" />
          </motion.div>
          <motion.a variants={fadeUp} href={email ? `mailto:${email}` : '#contact'}
            className="block font-black uppercase tracking-tight leading-[0.9] text-[15vw] md:text-[9rem] transition-colors hover:text-[#ff4d00]"
            style={{ color: BLACK }}>
            Let's<br />Talk
            <ArrowUpRight className="inline-block align-top ml-2" size={64} style={{ color: ORANGE }} />
          </motion.a>
          <motion.div variants={fadeUp} className="mt-12 grid sm:grid-cols-3 border-2 border-black divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-black">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-3 px-5 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[#ff4d00] hover:text-white transition-colors"
                style={{ color: BLACK }}>
                <Mail size={16} /> {email}
              </a>
            )}
            {p.phone && (
              <a href={`tel:${p.phone}`} className="flex items-center gap-3 px-5 py-5 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                style={{ color: BLACK }}>
                <Phone size={16} /> {p.phone}
              </a>
            )}
            <div className="flex items-center gap-4 px-5 py-5">
              {links.map(({ url, label, Icon }) => (
                <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label}
                  className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-[#ff4d00] hover:border-[#ff4d00] hover:text-white transition-colors"
                  style={{ color: BLACK }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Main ---------- */

export default function CreativeAgency() {
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
    { label: 'Studio', href: '#about' }, { label: 'Services', href: '#skills' },
    { label: 'Work', href: '#projects' }, { label: 'Record', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="font-sans antialiased" style={{ backgroundColor: WHITE }}>
      <nav className="fixed top-0 inset-x-0 z-50 border-b-2 border-black" style={{ backgroundColor: WHITE }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#hero" className="font-black uppercase tracking-tight text-lg flex items-center gap-2" style={{ color: BLACK }}>
            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: ORANGE }} />
            {p.name || 'Studio'}
          </a>
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((n, i) => (
              <a key={n.label} href={n.href} className="text-xs font-bold uppercase tracking-[0.2em] hover:text-[#ff4d00] transition-colors"
                style={{ color: BLACK }}>
                <span className="font-mono mr-1.5" style={{ color: ORANGE }}>{String(i + 1).padStart(2, '0')}</span>
                {n.label}
              </a>
            ))}
          </div>
          <a href="#contact" className="md:hidden text-xs font-bold uppercase tracking-widest px-4 py-2 text-white"
            style={{ backgroundColor: ORANGE }}>
            Hire
          </a>
        </div>
      </nav>

      <Hero p={p} stats={stats} />
      <About p={p} stats={stats} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Testimonials testimonials={testimonials} />
      <Contact p={p} socials={socials} />

      <footer className="py-10 px-6 md:px-12" style={{ backgroundColor: BLACK }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-black uppercase tracking-tight text-lg" style={{ color: WHITE }}>
            <span style={{ color: ORANGE }}>●</span> {p.name}
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: '#8a8a8a' }}>
            © {year} {p.name} · Creative Agency
          </p>
          <a href="#hero" className="font-mono text-[10px] uppercase tracking-[0.3em] hover:text-[#ff4d00] transition-colors" style={{ color: WHITE }}>
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
