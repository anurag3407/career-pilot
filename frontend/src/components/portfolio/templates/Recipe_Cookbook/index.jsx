import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChefHat, UtensilsCrossed, Star, Clock, Flame, Check, Timer, Users,
  Mail, Github, Linkedin, Twitter, ExternalLink, Heart, BookOpen, Wheat
} from 'lucide-react';

/**
 * Recipe Cookbook Portfolio Template
 * Category: Unique / Creative
 * Description: Recipe card layout where skills are ingredients, projects are dishes, experience is cooking time. Recipe card UI with checkable ingredient lists.
 */

/* ------------------------------------------------------------------ */
/* Palette — butcher paper cream, recipe-card red, herb green          */
/* ------------------------------------------------------------------ */
const CREAM = '#faf6ee';
const CARD = '#fffdf8';
const INK = '#3e3020';
const MUTED = 'rgba(62,48,32,0.6)';
const EDGE = 'rgba(62,48,32,0.22)';
const RED = '#d64545';
const HERB = '#7d8c5c';
const MUSTARD = '#e2b13c';
const SERIF = "Georgia, 'Times New Roman', serif";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/* Recipe card furniture                                               */
/* ------------------------------------------------------------------ */
/* A recipe card: solid outer edge + stitched inner border */
const RecipeCard = ({ children, className = '', rotate = 0 }) => (
  <div className={`relative ${className}`} style={{ transform: `rotate(${rotate}deg)` }}>
    <div className="p-[5px] h-full" style={{ background: CARD, border: `1.5px solid ${EDGE}`, borderRadius: 10, boxShadow: '0 6px 18px rgba(62,48,32,0.1)' }}>
      <div className="h-full rounded-md p-5" style={{ border: `1.5px dashed ${EDGE}` }}>
        {children}
      </div>
    </div>
  </div>
);

const SectionHead = ({ icon: Icon, kicker, title, note }) => (
  <motion.div variants={fadeUp} className="mb-10">
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3"
      style={{ background: 'rgba(214,69,69,0.08)', color: RED }}>
      {Icon ? <Icon size={14} strokeWidth={1.8} /> : null}
      <span className="text-[11px] font-bold uppercase" style={{ letterSpacing: '0.25em' }}>{kicker}</span>
    </div>
    <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: SERIF, color: INK }}>{title}</h2>
    {note ? <p className="text-sm italic mt-2" style={{ fontFamily: SERIF, color: MUTED }}>{note}</p> : null}
  </motion.div>
);

const DifficultyStars = ({ level }) => (
  <span className="inline-flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={12}
        style={{ color: i < level ? MUSTARD : 'rgba(62,48,32,0.2)', fill: i < level ? MUSTARD : 'transparent' }} />
    ))}
  </span>
);

const Monogram = ({ name, size = 96 }) => {
  const initials = (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="inline-flex items-center justify-center rounded-full font-bold"
      style={{ width: size, height: size, background: HERB, color: '#ffffff', fontSize: size * 0.3, fontFamily: SERIF, border: `4px solid ${MUSTARD}` }}>
      {initials || '?'}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  return (
    <section id="hero" className="relative overflow-hidden" style={{ background: CREAM }}>
      <div aria-hidden="true" className="absolute top-10 right-8 opacity-[0.08] pointer-events-none">
        <UtensilsCrossed size={220} strokeWidth={1} style={{ color: INK }} />
      </div>
      <motion.div initial="hidden" animate="visible" variants={stagger} className="relative max-w-3xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: CARD, border: `1.5px solid ${EDGE}` }}>
          <ChefHat size={15} strokeWidth={1.8} style={{ color: RED }} />
          <span className="text-[11px] font-bold uppercase" style={{ letterSpacing: '0.25em', color: MUTED }}>
            From the test kitchen
          </span>
        </motion.div>
        <motion.p variants={fadeUp} className="text-sm uppercase mb-3" style={{ letterSpacing: '0.3em', color: HERB }}>
          The unofficial cookbook of
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold leading-tight mb-5" style={{ fontFamily: SERIF, color: INK }}>
          {p.name || 'The House Chef'}
        </motion.h1>
        {p.tagline ? (
          <motion.p variants={fadeUp} className="text-base italic max-w-xl mx-auto mb-3" style={{ fontFamily: SERIF, color: MUTED }}>
            &ldquo;{p.tagline}&rdquo;
          </motion.p>
        ) : null}
        {p.title ? (
          <motion.p variants={fadeUp} className="text-sm font-bold uppercase mb-4" style={{ letterSpacing: '0.2em', color: RED }}>
            {p.title}
          </motion.p>
        ) : null}
        {p.location ? (
          <motion.p variants={fadeUp} className="text-xs mb-10" style={{ color: MUTED }}>
            Kitchen located in {p.location} · serves worldwide
          </motion.p>
        ) : null}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <a href="#projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-transform hover:-translate-y-0.5"
            style={{ background: RED, color: '#ffffff', boxShadow: '0 8px 20px rgba(214,69,69,0.3)' }}>
            <BookOpen size={16} strokeWidth={1.8} /> Open the cookbook
          </a>
          <a href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-colors hover:bg-[rgba(125,140,92,0.12)]"
            style={{ border: `1.5px solid ${HERB}`, color: HERB }}>
            <Heart size={16} strokeWidth={1.8} /> Cook together
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const facts = [
    { Icon: Timer, label: 'Years simmering', value: stats.yearsExperience },
    { Icon: UtensilsCrossed, label: 'Dishes plated', value: stats.projectsCompleted },
    { Icon: Users, label: 'Happy eaters', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" style={{ background: CREAM }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead icon={ChefHat} kicker="Foreword" title="Meet the chef" note="(no MSG, all passion)" />
          <motion.div variants={fadeUp}>
            <RecipeCard rotate={-0.5}>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {p.avatar ? (
                  <img src={p.avatar} alt={p.name || 'Portrait'} className="w-32 h-32 rounded-full object-cover"
                    style={{ border: `4px solid ${MUSTARD}` }} />
                ) : (
                  <Monogram name={p.name} />
                )}
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm md:text-base leading-relaxed mb-4" style={{ fontFamily: SERIF, color: INK }}>
                    {p.bio || 'Recipes from this kitchen are still being tested. The ones on the following pages are tried, tasted, and true.'}
                  </p>
                  {facts.length > 0 && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      {facts.map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{ background: 'rgba(125,140,92,0.12)', color: HERB }}>
                          <f.Icon size={13} strokeWidth={1.8} /> {f.value} {f.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </RecipeCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* Skills — ingredients with checkable boxes */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'Pantry'))];
  const [checked, setChecked] = useState({});
  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <section id="skills" style={{ background: 'linear-gradient(180deg, rgba(226,177,60,0.08), transparent)' }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
          <SectionHead icon={Wheat} kicker="Pantry" title="Ingredients on hand"
            note="Click an ingredient to check it off — just like a real recipe card." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, ci) => (
              <motion.div key={ci} variants={fadeUp}>
                <RecipeCard rotate={ci % 2 === 0 ? -0.6 : 0.7} className="h-full">
                  <p className="text-[10px] font-bold uppercase text-center mb-1" style={{ letterSpacing: '0.3em', color: RED }}>
                    Ingredients
                  </p>
                  <h3 className="text-center text-lg font-bold mb-4 pb-3" style={{ fontFamily: SERIF, color: INK, borderBottom: `1px solid ${EDGE}` }}>
                    for {cat}
                  </h3>
                  <ul className="space-y-3">
                    {skills.filter(s => (s.category || 'Pantry') === cat).map((skill, i) => {
                      const key = `${ci}-${i}`;
                      const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
                      const cups = Math.round((level / 100) * 4 * 4) / 4;
                      const isOn = Boolean(checked[key]);
                      return (
                        <li key={i}>
                          <button onClick={() => toggle(key)}
                            className="flex items-center gap-2.5 w-full text-left group/ing">
                            <span className="w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-colors"
                              style={{
                                borderColor: isOn ? RED : 'rgba(62,48,32,0.4)',
                                background: isOn ? RED : 'transparent',
                              }}>
                              {isOn ? <Check size={11} strokeWidth={3.5} style={{ color: '#ffffff' }} /> : null}
                            </span>
                            <span className={`text-sm font-semibold flex-1 transition-all ${isOn ? 'line-through opacity-60' : ''}`}
                              style={{ color: INK }}>
                              {skill.name}
                            </span>
                            <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: HERB }}>
                              {cups} cups
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </RecipeCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Projects — the dishes */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" style={{ background: CREAM }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
          <SectionHead icon={UtensilsCrossed} kicker="The menu" title="Signature dishes"
            note="Every dish tested at least twice. Results, delicious." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((project, i) => {
              const tech = project.techStack || [];
              const stars = 1 + (i % 4);
              const hours = 2 + (i * 3) % 6;
              return (
                <motion.div key={i} variants={fadeUp} className="transition-transform hover:-translate-y-1.5 h-full">
                  <RecipeCard rotate={i % 2 === 0 ? -0.8 : 0.8} className="h-full">
                    {/* card header band */}
                    <div className="flex items-center justify-between mb-3 pb-2.5" style={{ borderBottom: `1px solid ${EDGE}` }}>
                      <span className="text-[10px] font-bold uppercase" style={{ letterSpacing: '0.2em', color: RED }}>
                        Recipe No. {String(i + 1).padStart(3, '0')}
                      </span>
                      <DifficultyStars level={stars} />
                    </div>
                    {project.image ? (
                      <div className="rounded-lg overflow-hidden mb-3" style={{ border: `1.5px solid ${EDGE}` }}>
                        <img src={project.image} alt={project.title} className="w-full h-32 object-cover" />
                      </div>
                    ) : null}
                    <h3 className="text-xl font-bold mb-1.5" style={{ fontFamily: SERIF, color: INK }}>{project.title}</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase" style={{ color: HERB, letterSpacing: '0.1em' }}>
                        <Clock size={11} strokeWidth={2} /> {hours} hrs
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase" style={{ color: MUSTARD, letterSpacing: '0.1em' }}>
                        <Flame size={11} strokeWidth={2} /> {['mild', 'medium', 'hot'][i % 3]}
                      </span>
                    </div>
                    {project.description ? (
                      <p className="text-[13px] leading-relaxed mb-4" style={{ fontFamily: SERIF, color: MUTED }}>
                        {project.description}
                      </p>
                    ) : null}
                    {tech.length > 0 && (
                      <p className="text-[11px] mb-4" style={{ color: INK }}>
                        <span className="font-bold uppercase" style={{ letterSpacing: '0.15em', color: RED }}>Serves with: </span>
                        {tech.join(', ')}
                      </p>
                    )}
                    <div className="flex gap-4 pt-2" style={{ borderTop: `1px dashed ${EDGE}` }}>
                      {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70"
                          style={{ color: RED }}>
                          <ExternalLink size={13} strokeWidth={1.8} /> Taste it
                        </a>
                      ) : null}
                      {project.githubUrl ? (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-70"
                          style={{ color: HERB }}>
                          <Github size={13} strokeWidth={1.8} /> The recipe
                        </a>
                      ) : null}
                    </div>
                  </RecipeCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Experience — method steps / cooking time */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" style={{ background: 'linear-gradient(180deg, rgba(125,140,92,0.07), transparent)' }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Timer} kicker="Method" title="Cooking time, explained"
            note="Prepare each step thoroughly before moving to the next." />
          <div className="space-y-5">
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-5">
                {/* step number badge */}
                <span className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-base font-bold"
                  style={{
                    background: i === 0 ? RED : HERB,
                    color: '#ffffff',
                    fontFamily: SERIF,
                    boxShadow: '0 4px 10px rgba(62,48,32,0.15)',
                  }}>
                  {i + 1}
                </span>
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-lg font-bold" style={{ fontFamily: SERIF, color: INK }}>{exp.role}</h3>
                    <span className="text-sm font-semibold" style={{ color: HERB }}>@ {exp.company}</span>
                    <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                      style={{ background: 'rgba(226,177,60,0.16)', color: '#a3720f', letterSpacing: '0.1em' }}>
                      <Timer size={11} strokeWidth={2} /> {exp.period}
                    </span>
                  </div>
                  {exp.description ? (
                    <p className="text-sm leading-relaxed mt-1.5" style={{ fontFamily: SERIF, color: MUTED }}>
                      {exp.description}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Testimonials — table reviews */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" style={{ background: CREAM }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Star} kicker="Reviews" title="From the dinner table"
            note="Unpaid, unhurried, and seconded by seconds." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => {
              const initials = (t.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <motion.figure key={i} variants={fadeUp} className="transition-transform hover:-translate-y-1">
                  <RecipeCard rotate={i % 2 === 0 ? -1 : 1} className="h-full">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={13} style={{ color: MUSTARD, fill: MUSTARD }} />
                      ))}
                    </div>
                    <blockquote className="text-[13px] leading-relaxed mb-4" style={{ fontFamily: SERIF, color: INK }}>
                      &ldquo;{t.text}&rdquo;
                    </blockquote>
                    <figcaption className="flex items-center gap-3 pt-3" style={{ borderTop: `1px dashed ${EDGE}` }}>
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover"
                          style={{ border: `2px solid ${MUSTARD}` }} />
                      ) : (
                        <span className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                          style={{ background: HERB, fontFamily: SERIF }}>
                          {initials}
                        </span>
                      )}
                      <span>
                        <span className="block text-sm font-bold" style={{ color: INK }}>{t.name}</span>
                        <span className="block text-[11px] italic" style={{ fontFamily: SERIF, color: MUTED }}>{t.role}</span>
                      </span>
                    </figcaption>
                  </RecipeCard>
                </motion.figure>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Contact = ({ data }) => {
  const socials = data.socials || {};
  const p = data.personal || {};
  const email = socials.email || p.email;
  const socialLinks = [
    { key: 'github', label: 'GitHub', href: socials.github, Icon: Github },
    { key: 'linkedin', label: 'LinkedIn', href: socials.linkedin, Icon: Linkedin },
    { key: 'twitter', label: 'Twitter', href: socials.twitter, Icon: Twitter },
  ].filter(l => l.href);

  return (
    <section id="contact" style={{ background: 'linear-gradient(180deg, rgba(214,69,69,0.06), transparent)' }}>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-20 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: RED, boxShadow: '0 0 0 8px rgba(214,69,69,0.15)' }}>
              <ChefHat size={26} strokeWidth={1.8} style={{ color: '#ffffff' }} />
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: SERIF, color: INK }}>
            Let&rsquo;s cook something up
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base mb-10 max-w-lg mx-auto leading-relaxed" style={{ color: MUTED }}>
            Have an idea that needs a chef? Reservations are open — bring an appetite and I&rsquo;ll bring the recipe.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-8">
            {email ? (
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-transform hover:-translate-y-0.5"
                style={{ background: RED, color: '#ffffff', boxShadow: '0 8px 20px rgba(214,69,69,0.3)' }}>
                <Mail size={16} strokeWidth={1.8} /> Email the kitchen
              </a>
            ) : null}
            {socialLinks.map(l => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold text-sm transition-colors hover:bg-[rgba(125,140,92,0.12)]"
                style={{ border: `1.5px solid ${HERB}`, color: HERB }}>
                <l.Icon size={15} strokeWidth={1.8} /> {l.label}
              </a>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-xs italic" style={{ fontFamily: SERIF, color: MUTED }}>
            &copy; {new Date().getFullYear()} {p.name || ''} · Recipe Cookbook Portfolio · made from scratch
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function RecipeCookbook() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'Foreword', href: '#about' },
    { label: 'Ingredients', href: '#skills' },
    { label: 'Dishes', href: '#projects' },
    { label: 'Method', href: '#experience' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'Reserve', href: '#contact' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: CREAM, color: INK, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-sm"
        style={{ background: 'rgba(250,246,238,0.92)', borderBottom: `1.5px solid ${EDGE}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <a href="#hero" className="inline-flex items-center gap-2 font-bold" style={{ color: INK }}>
            <ChefHat size={18} strokeWidth={1.8} style={{ color: RED }} />
            <span style={{ fontFamily: SERIF }}>{p.name || 'Test Kitchen'}</span>
          </a>
          <div className="hidden md:flex items-center gap-5">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                className="text-xs font-semibold uppercase transition-colors hover:text-[#d64545]"
                style={{ letterSpacing: '0.14em', color: MUTED }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Hero data={data} />
      {(p.bio || p.avatar) ? <About data={data} /> : null}
      {data.skills?.length > 0 ? <Skills data={data} /> : null}
      {data.projects?.length > 0 ? <Projects data={data} /> : null}
      {data.experience?.length > 0 ? <Experience data={data} /> : null}
      {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
      <Contact data={data} />
    </div>
  );
}
