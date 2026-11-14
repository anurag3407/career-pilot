import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Feather, Mail, Github, Linkedin, Twitter, MapPin,
  Star, ChevronDown, Quote, Bookmark
} from 'lucide-react';

/**
 * Story Unfold Portfolio Template
 * Category: Scroll-Triggered
 * Description: Narrative scroll portfolio where a personal story unfolds chapter by chapter. Text and images reveal with fade-in/slide-up animations as user scrolls.
 */

const INK = '#33291c';
const PARCHMENT = '#f3ead2';
const GOLD = '#a1762c';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'A';
};

// Ornamental book flourish (fleuron divider)
const Flourish = ({ className = '', light = false }) => (
  <svg viewBox="0 0 220 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    className={className} style={{ color: light ? 'rgba(233,223,199,0.65)' : 'rgba(161,118,44,0.75)' }}>
    <path d="M4 12 C 40 2, 70 22, 110 12 C 150 2, 180 22, 216 12"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="110" cy="12" r="3.5" fill="currentColor" />
    <circle cx="92" cy="12" r="1.5" fill="currentColor" />
    <circle cx="128" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// Body text with a serif drop cap on the first letter
const DropCapText = ({ text, className = '' }) => {
  if (!text) return null;
  const trimmed = text.trim();
  const first = trimmed.charAt(0);
  const rest = trimmed.slice(1);
  return (
    <p className={className}>
      <span className="float-left font-serif font-bold leading-[0.85] mr-3 mt-1 select-none"
        style={{ fontSize: '4.2rem', color: GOLD, textShadow: '1px 1px 0 rgba(51,41,28,0.15)' }}>
        {first}
      </span>
      {rest}
    </p>
  );
};

// "Ex libris" bookplate avatar with monogram fallback
const Bookplate = ({ data }) => {
  const name = data.personal?.name || 'The Author';
  return (
    <motion.div variants={fadeUp} className="inline-block p-3 border-2 bg-[#f8f1de] shadow-xl"
      style={{ borderColor: 'rgba(138,109,59,0.55)', transform: 'rotate(-1.2deg)' }}>
      <div className="p-2 border" style={{ borderColor: 'rgba(138,109,59,0.35)' }}>
        {data.personal?.avatar ? (
          <img src={data.personal.avatar} alt={name}
            className="w-56 h-64 md:w-64 md:h-72 object-cover" style={{ filter: 'sepia(0.22) saturate(0.9)' }} />
        ) : (
          <div className="w-56 h-64 md:w-64 md:h-72 flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(145deg,#ecdcb4,#d8c28c)' }}>
            <Feather size={30} style={{ color: GOLD }} className="mb-4" />
            <span className="font-serif font-bold text-6xl tracking-widest" style={{ color: '#5b4626' }}>
              {initialsOf(name)}
            </span>
          </div>
        )}
        <p className="text-center font-serif italic text-xs mt-2.5 tracking-wide" style={{ color: GOLD }}>
          ex libris &middot; {name}
        </p>
      </div>
    </motion.div>
  );
};

// Chapter heading with giant watermark numeral
const ChapterTitle = ({ numeral, title, night = false }) => (
  <motion.div variants={fadeUp} className="relative text-center mb-14">
    <div aria-hidden className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 -top-20 font-serif italic font-bold leading-none whitespace-nowrap"
      style={{ fontSize: '10rem', opacity: 0.06, color: night ? PARCHMENT : INK }}>
      {numeral}
    </div>
    <p className="font-serif italic text-xs md:text-sm uppercase mb-3" style={{ letterSpacing: '0.35em', color: night ? '#c9b98a' : GOLD }}>
      Chapter {numeral}
    </p>
    <h2 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: night ? PARCHMENT : INK }}>
      {title}
    </h2>
    <Flourish className="mx-auto mt-5 w-44 h-6" light={night} />
  </motion.div>
);

// Cover page (Hero)
const Cover = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24"
    style={{ background: 'radial-gradient(900px 420px at 18% 8%, rgba(161,118,44,0.14), transparent 60%), linear-gradient(180deg, #f7efdb 0%, #efe3c6 100%)' }}>
    {/* vignette + deckle edge */}
    <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 140px rgba(89,66,28,0.18)' }} />
    <motion.div initial="hidden" animate="visible" variants={stagger}
      className="relative max-w-3xl w-full text-center border-2 p-3 shadow-2xl"
      style={{ borderColor: 'rgba(51,41,28,0.7)', background: 'rgba(248,241,222,0.6)' }}>
      <div className="border px-6 py-14 md:py-20" style={{ borderColor: 'rgba(161,118,44,0.5)' }}>
        <motion.p variants={fadeUp} className="font-serif italic text-xs md:text-sm uppercase mb-6"
          style={{ letterSpacing: '0.4em', color: GOLD }}>
          A Portfolio in Five Chapters
        </motion.p>
        <motion.div variants={fadeUp}>
          <BookOpen size={26} className="mx-auto mb-6" style={{ color: INK }} />
        </motion.div>
        <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-7xl font-bold mb-5" style={{ color: INK }}>
          {data.personal?.name || 'My Portfolio'}
        </motion.h1>
        {data.personal?.title && (
          <motion.p variants={fadeUp} className="font-serif text-xl md:text-2xl italic mb-3" style={{ color: '#6b5233' }}>
            {data.personal.title}
          </motion.p>
        )}
        {data.personal?.tagline && (
          <motion.p variants={fadeUp} className="text-sm md:text-base max-w-xl mx-auto mb-6 leading-relaxed" style={{ color: '#5c4a2f' }}>
            {data.personal.tagline}
          </motion.p>
        )}
        {data.personal?.location && (
          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs uppercase mb-10 px-4 py-1.5 border rounded-full"
            style={{ letterSpacing: '0.25em', color: '#6b5233', borderColor: 'rgba(161,118,44,0.45)' }}>
            <MapPin size={13} /> {data.personal.location}
          </motion.p>
        )}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <a href="#about"
            className="px-7 py-3 font-serif font-semibold transition-transform hover:-translate-y-0.5 shadow-md"
            style={{ background: INK, color: PARCHMENT }}>
            Begin Reading
          </a>
          <a href="#projects"
            className="px-7 py-3 font-serif font-semibold border transition-colors hover:bg-[#33291c]/10"
            style={{ borderColor: 'rgba(161,118,44,0.7)', color: '#6b5233' }}>
            The Works
          </a>
          <a href="#contact"
            className="px-7 py-3 font-serif font-semibold border transition-colors hover:bg-[#33291c]/10"
            style={{ borderColor: INK, color: INK }}>
            Skip to the End
          </a>
        </motion.div>
      </div>
    </motion.div>
    <motion.a href="#about" aria-label="Scroll to first chapter" className="absolute bottom-8 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ color: GOLD }}>
      <ChevronDown size={26} />
    </motion.a>
  </section>
);

// Chapter I — Origins (About)
const ChapterOrigins = ({ data }) => (
  <section id="about" className="relative py-24 overflow-hidden"
    style={{ background: 'linear-gradient(180deg,#efe3c6 0%,#e7d8b6 100%)' }}>
    <div className="max-w-5xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <ChapterTitle numeral="I" title="Origins" />
        <div className="grid md:grid-cols-[auto_1fr] gap-12 items-center justify-center">
          <div className="text-center md:text-left"><Bookplate data={data} /></div>
          <motion.div variants={fadeUp} className="max-w-2xl">
            <p className="text-xs uppercase mb-4 flex items-center gap-2" style={{ letterSpacing: '0.3em', color: GOLD }}>
              <Feather size={14} /> In which the author introduces himself
            </p>
            <DropCapText text={data.personal?.bio || `${data.personal?.name || 'This author'} keeps this chapter reserved for a biography. The story is still being written.`}
              className="font-serif text-lg leading-relaxed" />
            {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
              <div className="grid grid-cols-3 gap-4 mt-10">
                {[
                  { label: 'Years in the tale', value: data.stats.yearsExperience },
                  { label: 'Works completed', value: data.stats.projectsCompleted },
                  { label: 'Delighted readers', value: data.stats.happyClients },
                ].filter(s => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                  <div key={i} className="text-center p-4 border bg-[#f8f1de]/80 shadow-sm" style={{ borderColor: 'rgba(161,118,44,0.4)' }}>
                    <div className="font-serif text-3xl font-bold" style={{ color: INK }}>{s.value}</div>
                    <div className="text-[10px] uppercase mt-1.5" style={{ letterSpacing: '0.18em', color: '#8a6d3b' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

// Chapter II — The Craft (Skills)
const ChapterCraft = ({ data }) => (
  <section id="skills" className="relative py-24 overflow-hidden"
    style={{ background: 'linear-gradient(180deg,#e7d8b6 0%,#d3bd94 100%)' }}>
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <ChapterTitle numeral="II" title="The Craft" />
        <motion.p variants={fadeUp} className="text-center font-serif italic mb-12 max-w-xl mx-auto" style={{ color: '#6b5233' }}>
          Every craft is a language; these are the words our author knows by heart.
        </motion.p>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-5">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp} className="border-b pb-4" style={{ borderColor: 'rgba(51,41,28,0.2)' }}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-serif font-semibold text-lg" style={{ color: INK }}>{skill.name}</span>
                <span className="font-serif italic text-sm" style={{ color: GOLD }}>{skill.level}%</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(51,41,28,0.12)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, #8a6d3b, ${GOLD})` }}
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1.1, delay: (i % 2) * 0.15 }} viewport={{ once: true }} />
              </div>
              {skill.category && (
                <span className="text-[10px] uppercase mt-2 inline-block" style={{ letterSpacing: '0.2em', color: '#8a6d3b' }}>
                  {skill.category}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Chapter III — The Works (Projects), dusk begins
const ChapterWorks = ({ data }) => (
  <section id="projects" className="relative py-24 overflow-hidden"
    style={{ background: 'linear-gradient(180deg,#d3bd94 0%,#8a7a70 30%,#413a4d 70%,#2c2939 100%)' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
        <ChapterTitle numeral="III" title="The Works" night />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={fadeUp}
              className="group p-4 border shadow-2xl backdrop-blur-sm transition-all hover:-translate-y-1.5"
              style={{ background: 'rgba(18,20,32,0.82)', borderColor: 'rgba(233,223,199,0.16)' }}>
              {project.image && (
                <div className="p-2 mb-4 border" style={{ borderColor: 'rgba(233,223,199,0.25)', background: 'rgba(233,223,199,0.06)' }}>
                  <img src={project.image} alt={project.title}
                    className="w-full h-40 object-cover group-hover:opacity-90 transition-opacity"
                    style={{ filter: 'sepia(0.15)' }} />
                </div>
              )}
              <h3 className="font-serif text-xl font-bold italic mb-2" style={{ color: PARCHMENT }}>
                {project.title}
              </h3>
              {project.description && (
                <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'rgba(233,223,199,0.75)' }}>
                  {project.description}
                </p>
              )}
              {project.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, j) => (
                    <span key={j} className="text-[10px] uppercase px-2 py-1 border" style={{ letterSpacing: '0.15em', color: '#c9b98a', borderColor: 'rgba(201,185,138,0.35)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-4 font-serif italic text-sm">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:opacity-80 transition-opacity" style={{ color: '#e3c565' }}>
                    read it live
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== '#' && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:opacity-80 transition-opacity" style={{ color: 'rgba(233,223,199,0.7)' }}>
                    the manuscript
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Chapter IV — The Journey (Experience), night falls
const ChapterJourney = ({ data }) => (
  <section id="experience" className="relative py-24 overflow-hidden"
    style={{ background: 'linear-gradient(180deg,#2c2939 0%,#1a1d2c 55%,#12141f 100%)' }}>
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <ChapterTitle numeral="IV" title="The Journey" night />
        <div className="relative border-l-2 pl-8 md:pl-12 space-y-12" style={{ borderColor: 'rgba(201,185,138,0.3)' }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div className="absolute -left-[42px] md:-left-[58px] top-1.5 w-4 h-4 rounded-full border-2"
                style={{ background: GOLD, borderColor: '#12141f', boxShadow: '0 0 12px rgba(227,197,101,0.5)' }} />
              {exp.period && (
                <span className="text-xs uppercase inline-block mb-2 px-3 py-1 border rounded-full" style={{ letterSpacing: '0.22em', color: '#e3c565', borderColor: 'rgba(227,197,101,0.4)' }}>
                  {exp.period}
                </span>
              )}
              <h3 className="font-serif text-2xl font-bold" style={{ color: PARCHMENT }}>{exp.role}</h3>
              {exp.company && <p className="font-serif italic mb-2" style={{ color: '#c9b98a' }}>at {exp.company}</p>}
              {exp.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(233,223,199,0.7)' }}>{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Chapter V — Kind Words (Testimonials)
const ChapterVoices = ({ data }) => (
  <section id="testimonials" className="relative py-24 overflow-hidden" style={{ background: '#0e101a' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <ChapterTitle numeral="V" title="Kind Words" night />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp}
              className="p-7 shadow-xl transition-transform hover:-translate-y-1"
              style={{ background: PARCHMENT, borderRadius: '2px', boxShadow: '0 14px 40px rgba(0,0,0,0.45)', transform: `rotate(${(i % 2 === 0 ? -0.6 : 0.6)}deg)` }}>
              <Quote size={22} style={{ color: GOLD }} className="mb-3" />
              <blockquote className="font-serif italic leading-relaxed mb-5" style={{ color: '#4a3b22' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={13} style={{ color: GOLD }} fill={GOLD} />)}
              </div>
              <figcaption className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" style={{ filter: 'sepia(0.2)' }} />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-sm"
                    style={{ background: '#e3d3a6', color: '#5b4626' }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="font-serif font-bold text-sm" style={{ color: INK }}>{t.name}</div>
                  {t.role && <div className="text-xs italic" style={{ color: '#8a6d3b' }}>{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Epilogue — Contact
const Epilogue = ({ data }) => (
  <section id="contact" className="relative py-24 overflow-hidden"
    style={{ background: 'radial-gradient(700px 300px at 50% 110%, rgba(161,118,44,0.16), transparent 60%), #080910' }}>
    <div className="max-w-2xl mx-auto px-6 text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
        <motion.p variants={fadeUp} className="text-xs uppercase mb-4" style={{ letterSpacing: '0.4em', color: '#c9b98a' }}>
          Epilogue
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold mb-5" style={{ color: PARCHMENT }}>
          The story continues with you
        </motion.h2>
        <motion.p variants={fadeUp} className="font-serif italic mb-10" style={{ color: 'rgba(233,223,199,0.65)' }}>
          Every good book deserves a sequel. Write the next line together.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-12">
          {data.socials?.email && (
            <a href={`mailto:${data.socials.email}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 font-serif font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ background: PARCHMENT, color: INK }}>
              <Mail size={18} /> Write a Letter
            </a>
          )}
          {['github', 'linkedin', 'twitter'].map((key) => {
            const url = data.socials?.[key];
            if (!url) return null;
            const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
            return (
              <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border transition-colors hover:bg-[#f3ead2]/10"
                style={{ borderColor: 'rgba(233,223,199,0.4)', color: PARCHMENT }}>
                <Icon size={18} />
              </a>
            );
          })}
        </motion.div>
        <motion.p variants={fadeUp} className="text-[11px] uppercase" style={{ letterSpacing: '0.25em', color: 'rgba(233,223,199,0.4)' }}>
          &copy; {new Date().getFullYear()} {data.personal?.name || 'The Author'} &middot; Story Unfold
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// Main component
export default function StoryUnfold() {
  const { portfolioData: data } = usePortfolio();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Origins', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'The Craft', href: '#skills', show: data.skills?.length > 0 },
    { label: 'The Works', href: '#projects', show: data.projects?.length > 0 },
    { label: 'The Journey', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Kind Words', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Epilogue', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="font-serif antialiased overflow-x-hidden" style={{ background: '#080910' }}>
      {/* reading progress ribbon */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1" style={{ background: 'rgba(51,41,28,0.15)' }}>
        <div className="h-full transition-[width] duration-150" style={{ width: `${progress}%`, background: `linear-gradient(90deg,#8a6d3b,${GOLD})` }} />
        <div className="absolute top-1 transition-[left] duration-150" style={{ left: `calc(${progress}% - 9px)`, color: GOLD }}>
          <Bookmark size={16} fill="currentColor" />
        </div>
      </div>

      {/* running header nav */}
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex gap-1 md:gap-2 px-4 py-2 border shadow-xl backdrop-blur-sm max-w-[94vw] overflow-x-auto"
        style={{ background: 'rgba(248,241,222,0.92)', borderColor: 'rgba(161,118,44,0.45)' }}>
        {navItems.map(item => (
          <a key={item.href} href={item.href}
            className="whitespace-nowrap text-[11px] uppercase px-2.5 py-1 transition-colors hover:bg-[#33291c] hover:text-[#f3ead2] rounded-sm"
            style={{ letterSpacing: '0.16em', color: '#5c4a2f' }}>
            {item.label}
          </a>
        ))}
      </nav>

      <Cover data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <ChapterOrigins data={data} />}
      {data.skills?.length > 0 && <ChapterCraft data={data} />}
      {data.projects?.length > 0 && <ChapterWorks data={data} />}
      {data.experience?.length > 0 && <ChapterJourney data={data} />}
      {data.testimonials?.length > 0 && <ChapterVoices data={data} />}
      <Epilogue data={data} />
    </div>
  );
}
