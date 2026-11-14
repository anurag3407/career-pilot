import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, Mail, MapPin, Phone, FileText, Quote,
  Landmark, Library, ExternalLink, Award, Microscope,
  ScrollText, FlaskConical, Users, Globe, Linkedin, Github, Twitter
} from 'lucide-react';

/**
 * Academic Scholar Portfolio Template
 * Category: Professional / Industry
 * Description: Academic CV style with publications list with citations, research focus areas, conference presentations, education timeline. Scholarly serif fonts.
 */

const PAPER = '#f7f5ef';
const CARD = '#fffdf8';
const INK = '#211f1c';
const OX = '#6e1e2b';      // scholarly oxblood
const STONE = '#6b675e';
const HAIR = 'rgba(33,31,28,0.18)';
const HAIR_SOFT = 'rgba(33,31,28,0.10)';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'PS';
};

// Small-caps running head used at the top of each section
const RunningHead = ({ numeral, title }) => (
  <div className="flex items-center gap-4 mb-4">
    <span className="h-px flex-1" style={{ background: HAIR }} />
    <span className="whitespace-nowrap font-serif text-[11px] uppercase font-semibold"
      style={{ letterSpacing: '0.35em', color: OX }}>
      {numeral} &middot; {title}
    </span>
    <span className="h-px flex-1" style={{ background: HAIR }} />
  </div>
);

const SectionHead = ({ numeral, title, sub }) => (
  <motion.div variants={fadeUp} className="mb-12">
    <RunningHead numeral={numeral} title={title} />
    <h2 className="font-serif text-3xl md:text-4xl font-bold text-center" style={{ color: INK }}>
      {title}
    </h2>
    {sub && (
      <p className="text-center font-serif italic mt-3 text-sm md:text-base max-w-xl mx-auto" style={{ color: STONE }}>
        {sub}
      </p>
    )}
  </motion.div>
);

// Double-ruled scholarly ornament
const Rule = ({ className = '' }) => (
  <div aria-hidden className={className}
    style={{ borderTop: `3px double ${HAIR}`, height: 3 }} />
);

// Framed portrait with monogram fallback — like a faculty page photo
const Portrait = ({ data }) => {
  const name = data.personal?.name || 'Scholar';
  return (
    <motion.div variants={fadeUp} className="mx-auto md:mx-0 inline-block p-2.5"
      style={{ background: CARD, border: `1px solid ${HAIR}`, boxShadow: '0 2px 14px rgba(33,31,28,0.08)' }}>
      {data.personal?.avatar ? (
        <img src={data.personal.avatar} alt={name}
          className="w-52 h-60 md:w-60 md:h-72 object-cover"
          style={{ filter: 'grayscale(0.25) contrast(1.02)' }} />
      ) : (
        <div className="w-52 h-60 md:w-60 md:h-72 flex flex-col items-center justify-center gap-4"
          style={{ background: 'linear-gradient(160deg,#efe9dd,#e2d9c6)' }}>
          <GraduationCap size={30} style={{ color: OX }} />
          <span className="font-serif font-bold text-6xl tracking-[0.08em]" style={{ color: INK }}>
            {initialsOf(name)}
          </span>
        </div>
      )}
      <p className="text-center font-serif text-[11px] uppercase mt-2.5"
        style={{ letterSpacing: '0.22em', color: STONE }}>
        {name}
      </p>
    </motion.div>
  );
};

// Masthead (Hero) — CV title page
const Masthead = ({ data }) => (
  <section id="hero" className="relative overflow-hidden px-6 pt-28 pb-20"
    style={{
      background: `radial-gradient(700px 320px at 50% -10%, rgba(110,30,43,0.07), transparent 65%), ${PAPER}`
    }}>
    <div className="max-w-3xl mx-auto text-center">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.p variants={fadeUp} className="font-serif text-xs uppercase mb-6"
          style={{ letterSpacing: '0.45em', color: OX }}>
          Curriculum Vitae
        </motion.p>
        <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-5"
          style={{ color: INK }}>
          {data.personal?.name || 'Portfolio'}
        </motion.h1>
        {data.personal?.title && (
          <motion.p variants={fadeUp} className="font-serif text-xl md:text-2xl italic mb-6" style={{ color: '#4d483f' }}>
            {data.personal.title}
          </motion.p>
        )}
        <Rule className="w-56 mx-auto mb-6" />
        {data.personal?.tagline && (
          <motion.p variants={fadeUp} className="font-serif text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6"
            style={{ color: STONE }}>
            {data.personal.tagline}
          </motion.p>
        )}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-9 text-xs font-serif"
          style={{ color: STONE }}>
          {data.personal?.location && (
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} style={{ color: OX }} /> {data.personal.location}</span>
          )}
          {data.personal?.email && (
            <a href={`mailto:${data.personal.email}`} className="inline-flex items-center gap-1.5 hover:opacity-75 transition-opacity">
              <Mail size={13} style={{ color: OX }} /> {data.personal.email}
            </a>
          )}
          {data.personal?.phone && (
            <span className="inline-flex items-center gap-1.5"><Phone size={13} style={{ color: OX }} /> {data.personal.phone}</span>
          )}
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <a href="#about"
            className="px-7 py-3 font-serif font-semibold text-sm transition-transform hover:-translate-y-0.5"
            style={{ background: INK, color: PAPER }}>
            Profile
          </a>
          <a href="#projects"
            className="px-7 py-3 font-serif font-semibold text-sm border transition-colors hover:bg-[#6e1e2b] hover:text-[#f7f5ef]"
            style={{ borderColor: OX, color: OX }}>
            Publications
          </a>
          <a href="#contact"
            className="px-7 py-3 font-serif font-semibold text-sm border transition-colors hover:bg-[#211f1c] hover:text-[#f7f5ef]"
            style={{ borderColor: INK, color: INK }}>
            Correspondence
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// I. Profile (About)
const Profile = ({ data }) => {
  const stats = [
    { icon: Award, label: 'Years of Research', value: data.stats?.yearsExperience },
    { icon: FileText, label: 'Completed Works', value: data.stats?.projectsCompleted },
    { icon: Users, label: 'Collaborators', value: data.stats?.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');
  const hasStats = stats.length > 0 || data.projects?.length > 0;

  return (
    <section id="about" className="py-24 px-6" style={{ background: CARD }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead numeral="I" title="Profile"
            sub="A brief research statement and biography." />
          <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-start">
            <div className="text-center md:text-left"><Portrait data={data} /></div>
            <motion.div variants={fadeUp}>
              <div className="pl-5 border-l-2" style={{ borderColor: OX }}>
                <p className="font-serif text-lg leading-relaxed" style={{ color: '#3a372f' }}>
                  {data.personal?.bio ||
                    `${data.personal?.name || 'This scholar'} has reserved this section for a biography and research statement.`}
                </p>
              </div>
              {hasStats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-px mt-10" style={{ background: HAIR }}>
                  {stats.map((s, i) => (
                    <div key={i} className="p-5 text-center" style={{ background: CARD }}>
                      <s.icon size={16} className="mx-auto mb-2" style={{ color: OX }} />
                      <div className="font-serif text-3xl font-bold" style={{ color: INK }}>{s.value}</div>
                      <div className="text-[10px] uppercase mt-1.5" style={{ letterSpacing: '0.18em', color: STONE }}>{s.label}</div>
                    </div>
                  ))}
                  {data.projects?.length > 0 && (
                    <div className="p-5 text-center" style={{ background: CARD }}>
                      <Library size={16} className="mx-auto mb-2" style={{ color: OX }} />
                      <div className="font-serif text-3xl font-bold" style={{ color: INK }}>{data.projects.length}</div>
                      <div className="text-[10px] uppercase mt-1.5" style={{ letterSpacing: '0.18em', color: STONE }}>Selected Publications</div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// II. Research Focus Areas (Skills)
const FocusAreas = ({ data }) => (
  <section id="skills" className="py-24 px-6" style={{ background: PAPER }}>
    <div className="max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionHead numeral="II" title="Research Focus Areas"
          sub="Domains of sustained inquiry and demonstrated expertise." />
        <div className="grid md:grid-cols-2 gap-x-14 gap-y-7">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp} className="group">
              <div className="flex items-baseline justify-between mb-2.5">
                <div>
                  <h3 className="font-serif font-bold text-lg" style={{ color: INK }}>{skill.name}</h3>
                  {skill.category && (
                    <span className="text-[10px] uppercase font-serif"
                      style={{ letterSpacing: '0.22em', color: STONE }}>
                      {skill.category}
                    </span>
                  )}
                </div>
                <span className="font-serif text-sm tabular-nums" style={{ color: OX }}>{skill.level}%</span>
              </div>
              <div className="h-[3px] w-full" style={{ background: HAIR_SOFT }}>
                <motion.div className="h-full" style={{ background: OX }}
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: (i % 2) * 0.12 }} viewport={{ once: true }} />
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2.5 mt-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-serif px-3 py-1.5"
            style={{ letterSpacing: '0.2em', color: STONE }}>
            <Microscope size={12} style={{ color: OX }} /> Methodologies
          </span>
          {data.skills.slice(0, 6).map((s, i) => (
            <span key={i} className="text-[11px] font-serif px-3 py-1.5 border"
              style={{ borderColor: HAIR, color: '#4d483f', background: CARD }}>
              {s.name}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// III. Selected Publications (Projects)
const Publications = ({ data }) => (
  <section id="projects" className="py-24 px-6" style={{ background: CARD }}>
    <div className="max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
        <SectionHead numeral="III" title="Selected Publications"
          sub="Peer-reviewed papers, conference proceedings & working papers." />
        <div className="space-y-10">
          {data.projects.map((pub, i) => (
            <motion.article key={i} variants={fadeUp}
              className="group grid md:grid-cols-[64px_1fr] gap-4 md:gap-6 pb-9 border-b"
              style={{ borderColor: HAIR }}>
              <div className="font-serif text-sm pt-1 md:text-right tabular-nums" style={{ color: OX }}>
                [{String(i + 1).padStart(2, '0')}]
              </div>
              <div className="transition-transform group-hover:translate-x-1.5" style={{ transitionDuration: '0.3s' }}>
                {pub.image && (
                  <div className="mb-4 p-1.5 inline-block" style={{ border: `1px solid ${HAIR}` }}>
                    <img src={pub.image} alt={pub.title} className="max-h-44 w-auto object-cover"
                      style={{ filter: 'grayscale(0.3)' }} />
                  </div>
                )}
                <h3 className="font-serif text-xl md:text-2xl font-bold leading-snug mb-2" style={{ color: INK }}>
                  {pub.title}
                </h3>
                {pub.description && (
                  <p className="font-serif text-sm md:text-[15px] leading-relaxed mb-4" style={{ color: '#4d483f' }}>
                    {pub.description}
                  </p>
                )}
                {pub.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-x-1 gap-y-1 mb-4 text-[11px] font-serif italic" style={{ color: STONE }}>
                    <span>Keywords:&nbsp;</span>
                    {pub.techStack.map((t, j) => (
                      <span key={j} style={{ color: OX }}>
                        {t}{j < pub.techStack.length - 1 ? ';' : '.'}&nbsp;
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-5 font-serif text-sm">
                  {pub.liveUrl && pub.liveUrl !== '#' && (
                    <a href={pub.liveUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:opacity-75 transition-opacity"
                      style={{ color: OX }}>
                      <ExternalLink size={13} /> Read &mdash; DOI
                    </a>
                  )}
                  {pub.githubUrl && pub.githubUrl !== '#' && (
                    <a href={pub.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:opacity-75 transition-opacity"
                      style={{ color: '#4d483f' }}>
                      <Github size={13} /> Code &amp; Data
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// IV. Education & Appointments (Experience)
const Timeline = ({ data }) => (
  <section id="experience" className="py-24 px-6" style={{ background: PAPER }}>
    <div className="max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionHead numeral="IV" title="Education & Appointments"
          sub="Institutions, positions and milestones in chronological order." />
        <div className="relative border-l-2 pl-8 md:pl-12 space-y-11" style={{ borderColor: HAIR }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div className="absolute -left-[38px] md:-left-[52px] top-1.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                style={{ background: OX, borderColor: PAPER }} />
              {exp.period && (
                <span className="inline-block mb-2.5 font-serif text-[11px] uppercase px-3 py-1 border"
                  style={{ letterSpacing: '0.22em', color: OX, borderColor: 'rgba(110,30,43,0.4)', background: CARD }}>
                  {exp.period}
                </span>
              )}
              <h3 className="font-serif text-2xl font-bold" style={{ color: INK }}>{exp.role}</h3>
              {exp.company && (
                <p className="font-serif italic mb-2 inline-flex items-center gap-2" style={{ color: '#4d483f' }}>
                  <Landmark size={14} style={{ color: OX }} /> {exp.company}
                </p>
              )}
              {exp.description && (
                <p className="font-serif text-sm leading-relaxed mt-1.5" style={{ color: STONE }}>
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

// V. References (Testimonials)
const References = ({ data }) => (
  <section id="testimonials" className="py-24 px-6" style={{ background: CARD }}>
    <div className="max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionHead numeral="V" title="References"
          sub="Kind words from colleagues, students and collaborators." />
        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp} className="p-7"
              style={{
                background: PAPER,
                border: `1px solid ${HAIR}`,
                borderTop: `3px solid ${OX}`,
                boxShadow: '0 2px 12px rgba(33,31,28,0.06)'
              }}>
              <Quote size={20} style={{ color: OX }} className="mb-3" />
              <blockquote className="font-serif italic leading-relaxed mb-5" style={{ color: '#3a372f' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${HAIR_SOFT}` }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover"
                    style={{ filter: 'grayscale(0.3)' }} />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm"
                    style={{ background: '#e7ded0', color: OX }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="font-serif font-bold text-sm" style={{ color: INK }}>{t.name}</div>
                  {t.role && <div className="font-serif text-xs italic" style={{ color: STONE }}>{t.role}</div>}
                </div>
                <FlaskConical size={13} className="ml-auto" style={{ color: 'rgba(110,30,43,0.45)' }} />
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// VI. Correspondence (Contact) + colophon
const Correspondence = ({ data }) => {
  const socials = [
    { key: 'github', label: 'GitHub profile', icon: Github },
    { key: 'linkedin', label: 'LinkedIn profile', icon: Linkedin },
    { key: 'twitter', label: 'Twitter profile', icon: Twitter },
  ].filter(s => data.socials?.[s.key]);

  return (
    <section id="contact" className="py-24 px-6"
      style={{ background: `radial-gradient(600px 280px at 50% 0%, rgba(110,30,43,0.08), transparent 65%), ${PAPER}` }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <SectionHead numeral="VI" title="Correspondence" />
          <motion.p variants={fadeUp} className="font-serif italic mb-9" style={{ color: STONE }}>
            <ScrollText size={15} className="inline mr-2 -mt-0.5" style={{ color: OX }} />
            Open to collaborations, peer review and academic correspondence.
          </motion.p>
          {data.personal?.email && (
            <motion.a variants={fadeUp} href={`mailto:${data.personal.email}`}
              className="inline-flex items-center gap-2.5 px-9 py-4 font-serif font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ background: OX, color: PAPER }}>
              <Mail size={17} /> {data.personal.email}
            </motion.a>
          )}
          <motion.div variants={fadeUp} className="flex justify-center gap-3 mt-8">
            {socials.map(({ key, label, icon: Icon }) => (
              <a key={key} href={data.socials[key]} target="_blank" rel="noreferrer" aria-label={label}
                className="inline-flex items-center justify-center w-11 h-11 border transition-colors hover:bg-[#211f1c] hover:text-[#f7f5ef]"
                style={{ borderColor: HAIR, color: INK, background: CARD }}>
                <Icon size={16} />
              </a>
            ))}
          </motion.div>
          <motion.div variants={fadeUp}>
            <Rule className="mt-14 mb-5" />
            <p className="font-serif text-[11px] uppercase" style={{ letterSpacing: '0.25em', color: STONE }}>
              &copy; {new Date().getFullYear()} {data.personal?.name || 'The Scholar'}
              <span className="mx-2" style={{ color: OX }}>&middot;</span>
              Typeset in a scholarly serif
              <Globe size={11} className="inline ml-2 -mt-0.5" />
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Main component
export default function AcademicScholar() {
  const { portfolioData: data } = usePortfolio();

  const navItems = [
    { label: 'Profile', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Focus Areas', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Publications', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Appointments', href: '#experience', show: data.experience?.length > 0 },
    { label: 'References', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Contact', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="font-serif antialiased overflow-x-hidden" style={{ background: PAPER, color: INK }}>
      {/* running head navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-sm"
        style={{ background: 'rgba(247,245,239,0.92)', borderColor: HAIR }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-12 flex items-center gap-6">
          <a href="#hero" className="font-serif font-bold text-sm whitespace-nowrap flex items-center gap-2"
            style={{ color: INK }}>
            <GraduationCap size={16} style={{ color: OX }} />
            {data.personal?.name || 'CV'}
          </a>
          <div className="flex gap-4 md:gap-6 overflow-x-auto ml-auto">
            {navItems.map(item => (
              <a key={item.href} href={item.href}
                className="whitespace-nowrap text-[11px] uppercase transition-colors hover:text-[#6e1e2b]"
                style={{ letterSpacing: '0.18em', color: STONE }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Masthead data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <Profile data={data} />}
      {data.skills?.length > 0 && <FocusAreas data={data} />}
      {data.projects?.length > 0 && <Publications data={data} />}
      {data.experience?.length > 0 && <Timeline data={data} />}
      {data.testimonials?.length > 0 && <References data={data} />}
      <Correspondence data={data} />
    </div>
  );
}
