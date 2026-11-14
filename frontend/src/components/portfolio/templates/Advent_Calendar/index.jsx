import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gift, Snowflake, Sparkles, Star, Heart, Candy, Bell, Calendar,
  Mail, Github, Linkedin, Twitter, MapPin, PartyPopper, ChevronDown
} from 'lucide-react';

/**
 * Advent Calendar Portfolio Template
 * Category: Unique / Creative
 * Description: Advent calendar grid with numbered doors that open on click to reveal portfolio sections. Festive design with snowflakes. Surprise/delight mechanic.
 */

const NIGHT = '#0b1f15';       // deep evergreen night
const NIGHT_2 = '#0f2b1d';
const CREAM = '#f6efe0';
const CREAM_2 = '#fbf6ea';
const RED = '#b23b3b';
const GREEN = '#2f5d44';
const GOLD = '#d9a441';
const GOLD_DEEP = '#b9822c';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'H';
};

// Continuous snowfall — deterministic flakes, mix of dots and crystal icons
const Snowfall = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-30" aria-hidden>
    {Array.from({ length: 26 }).map((_, i) => {
      const left = (i * 37) % 100;
      const size = 3 + ((i * 13) % 5);
      const dur = 9 + ((i * 7) % 9);
      const delay = ((i * 11) % 14);
      const drift = (i % 2 === 0 ? 1 : -1) * (24 + ((i * 17) % 36));
      const isCrystal = i % 6 === 0;
      return (
        <motion.span key={i}
          className="absolute"
          style={{ left: `${left}%`, top: '-6vh', color: 'rgba(246,239,224,0.55)' }}
          animate={{ y: ['0vh', '112vh'], x: [0, drift, 0], rotate: [0, 200, 360] }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}>
          {isCrystal
            ? <Snowflake size={size + 9} />
            : <span className="block rounded-full" style={{ width: size, height: size, background: 'rgba(246,239,224,0.7)' }} />}
        </motion.span>
      );
    })}
  </div>
);

// Twinkling stars for the night sky
const Stars = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    {Array.from({ length: 40 }).map((_, i) => {
      const left = (i * 23) % 100;
      const top = ((i * 41) % 70);
      const size = i % 5 === 0 ? 3 : 1.6;
      return (
        <motion.span key={i} className="absolute rounded-full"
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, background: CREAM }}
          animate={{ opacity: [0.25, 0.9, 0.25] }}
          transition={{ duration: 2.5 + ((i * 7) % 4), delay: (i * 13) % 5, repeat: Infinity }} />
      );
    })}
  </div>
);

// String of festive bulbs swaying across the top of a section
const Garland = ({ count = 14 }) => (
  <div className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none" aria-hidden>
    <svg viewBox="0 0 1200 40" className="w-full h-8" preserveAspectRatio="none">
      <path d="M0 6 Q 300 38 600 10 T 1200 14" fill="none" stroke="rgba(185,130,44,0.5)" strokeWidth="1.6" />
    </svg>
    <div className="absolute top-1 left-0 right-0 flex justify-between px-[4%]">
      {Array.from({ length: count }).map((_, i) => {
        const colors = [GOLD, RED, '#5c9e77'];
        const c = colors[i % 3];
        return (
          <motion.span key={i} className="rounded-full"
            style={{ width: 9, height: 12, background: c, boxShadow: `0 0 10px ${c}`, borderRadius: '50% 50% 45% 45%' }}
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 2 + (i % 4) * 0.4, repeat: Infinity, ease: 'easeInOut' }} />
        );
      })}
    </div>
  </div>
);

// A single advent door with 3D flip
const Door = ({ door, open, onToggle }) => {
  const Icon = door.icon;
  const faceStyle = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', borderRadius: 10 };
  return (
    <motion.div variants={fadeUp} className="relative h-36 md:h-40" style={{ perspective: '1000px' }}>
      <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.35, 0, 0.25, 1] }}>
        {/* closed door (front) */}
        <button type="button" onClick={onToggle} aria-label={`Open door number ${door.num} — ${door.label}`}
          className="absolute inset-0 w-full cursor-pointer"
          style={{
            ...faceStyle,
            pointerEvents: open ? 'none' : 'auto',
            background: door.gold
              ? 'linear-gradient(160deg,#eec668 0%,#c98f2f 100%)'
              : `linear-gradient(165deg,${door.color} 0%, ${door.colorDark} 100%)`,
            boxShadow: '0 5px 16px rgba(0,0,0,0.35), inset 0 0 0 3px rgba(246,239,224,0.16)'
          }}>
          {/* door panel grooves */}
          <span className="absolute left-[14%] right-[14%] top-[16%] h-[30%] rounded-sm"
            style={{ border: '2px solid rgba(0,0,0,0.18)' }} />
          <span className="absolute left-[14%] right-[14%] bottom-[14%] h-[26%] rounded-sm"
            style={{ border: '2px solid rgba(0,0,0,0.18)' }} />
          <span className="absolute top-3 left-3.5 font-serif font-bold leading-none"
            style={{ color: door.gold ? '#3d2a08' : CREAM, fontSize: door.num > 9 ? 26 : 30, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            {door.num}
          </span>
          {/* wreath */}
          <span className="absolute bottom-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ border: `3px solid ${door.gold ? '#8a5a12' : GOLD}` }}>
            <span className="w-2 h-2 rounded-full" style={{ background: RED }} />
          </span>
        </button>
        {/* revealed scene (back) */}
        <a href={door.href || '#contact'} onClick={(e) => { if (!door.href) e.preventDefault(); }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center"
          style={{
            ...faceStyle,
            transform: 'rotateY(180deg)',
            pointerEvents: open ? 'auto' : 'none',
            background: `linear-gradient(170deg,${CREAM_2},${'#efe5cf'})`,
            boxShadow: 'inset 0 0 0 3px rgba(185,130,44,0.35)'
          }}>
          <Icon size={20} style={{ color: door.gold ? GOLD_DEEP : RED }} />
          <span className="font-serif font-bold text-sm" style={{ color: GREEN }}>{door.label}</span>
          <span className="text-[10px] uppercase tracking-widest" style={{ color: GOLD_DEEP }}>
            {door.gold ? 'The final door' : 'Knock knock — open me'}
          </span>
        </a>
      </motion.div>
    </motion.div>
  );
};

// Hero — festive night sky
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24"
    style={{ background: `radial-gradient(800px 400px at 50% 0%, ${NIGHT_2}, ${NIGHT} 65%, #071209 100%)` }}>
    <Stars />
    <Garland count={16} />
    {/* pine tree silhouettes */}
    <svg className="absolute bottom-0 left-0 right-0 w-full pointer-events-none" viewBox="0 0 1440 130" preserveAspectRatio="none" aria-hidden>
      <path d="M0 130 L0 96 L60 96 L38 60 L52 60 L26 24 L48 24 L18 0 L90 40 L110 14 L138 52 L156 34 L184 78 L204 58 L238 108 L280 108 L280 96 L340 96 L318 62 L332 62 L306 28 L326 28 L298 0 L376 46 L396 20 L422 56 L446 40 L472 86 L494 66 L528 116 L1440 116 L1440 130 Z"
        fill="#05100a" opacity="0.9" />
    </svg>
    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl text-center">
      <motion.p variants={fadeUp} className="text-[11px] uppercase mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
        style={{ letterSpacing: '0.35em', color: GOLD, border: `1px solid rgba(217,164,65,0.4)`, background: 'rgba(217,164,65,0.08)' }}>
        <PartyPopper size={13} /> 24 doors of festive portfolio
      </motion.p>
      <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-7xl font-bold mb-4"
        style={{ color: CREAM, textShadow: '0 2px 30px rgba(217,164,65,0.25)' }}>
        {data.personal?.name || 'My Portfolio'}
      </motion.h1>
      {data.personal?.title && (
        <motion.p variants={fadeUp} className="font-serif text-xl md:text-2xl italic mb-4" style={{ color: GOLD }}>
          {data.personal.title}
        </motion.p>
      )}
      {data.personal?.tagline && (
        <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-5" style={{ color: 'rgba(246,239,224,0.75)' }}>
          {data.personal.tagline}
        </motion.p>
      )}
      {data.personal?.location && (
        <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs uppercase mb-9"
          style={{ letterSpacing: '0.25em', color: 'rgba(246,239,224,0.6)' }}>
          <MapPin size={13} style={{ color: RED }} /> {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
        <a href="#calendar" className="px-7 py-3 font-semibold text-sm rounded-full transition-transform hover:-translate-y-0.5"
          style={{ background: RED, color: CREAM, boxShadow: '0 4px 18px rgba(178,59,59,0.45)' }}>
          Open the calendar
        </a>
        <a href="#projects" className="px-7 py-3 font-semibold text-sm rounded-full border transition-colors hover:bg-[#f6efe0]/10"
          style={{ borderColor: 'rgba(246,239,224,0.4)', color: CREAM }}>
          Peek at projects
        </a>
        <a href="#contact" className="px-7 py-3 font-semibold text-sm rounded-full transition-transform hover:-translate-y-0.5"
          style={{ background: GOLD, color: '#3d2a08' }}>
          Door 24
        </a>
      </motion.div>
    </motion.div>
    <motion.a href="#calendar" aria-label="Scroll to calendar" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ color: GOLD }}>
      <ChevronDown size={24} />
    </motion.a>
  </section>
);

// The advent calendar board
const CalendarBoard = ({ data }) => {
  const [open, setOpen] = useState({});
  const toggle = (num) => setOpen(o => ({ ...o, [num]: !o[num] }));

  const stats = [
    { label: 'Years crafting', value: data.stats?.yearsExperience },
    { label: 'Gifts shipped', value: data.stats?.projectsCompleted },
    { label: 'Happy friends', value: data.stats?.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  const doors = [
    { num: 1, label: 'About', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar), icon: Gift, color: RED, colorDark: '#8f2d2d' },
    { num: 2, label: 'Skills', href: '#skills', show: data.skills?.length > 0, icon: Sparkles, color: GREEN, colorDark: '#20422f' },
    { num: 3, label: 'Projects', href: '#projects', show: data.projects?.length > 0, icon: Star, color: RED, colorDark: '#8f2d2d' },
    { num: 4, label: 'Journey', href: '#experience', show: data.experience?.length > 0, icon: Calendar, color: GREEN, colorDark: '#20422f' },
    { num: 5, label: 'Letters', href: '#testimonials', show: data.testimonials?.length > 0, icon: Heart, color: RED, colorDark: '#8f2d2d' },
    { num: 6, label: 'Surprise', href: null, show: true, icon: Candy, color: GREEN, colorDark: '#20422f' },
    { num: 24, label: 'Contact', href: '#contact', show: true, icon: Bell, gold: true },
  ].filter(d => d.show);

  return (
    <section id="calendar" className="relative py-24 px-6 overflow-hidden" style={{ background: '#071209' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-center text-[11px] uppercase mb-3" style={{ letterSpacing: '0.4em', color: GOLD }}>
            Behind every door, a story
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold text-center mb-4" style={{ color: CREAM }}>
            The Portfolio Advent Calendar
          </motion.h2>
          <motion.p variants={fadeUp} className="text-center text-sm mb-12 max-w-md mx-auto" style={{ color: 'rgba(246,239,224,0.65)' }}>
            Tap a door to swing it open, then click inside to visit that corner of the workshop. Door 24 holds the magic word.
          </motion.p>
          {/* candy-striped board header */}
          <motion.div variants={fadeUp} className="rounded-3xl p-4 md:p-7"
            style={{
              background: `linear-gradient(175deg, ${NIGHT_2}, #0a1d13)`,
              border: '1px solid rgba(217,164,65,0.35)',
              boxShadow: '0 18px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(246,239,224,0.06)'
            }}>
            <div className="h-2.5 rounded-full mb-6"
              style={{ background: `repeating-linear-gradient(55deg, ${RED} 0 12px, ${CREAM} 12px 24px)` }} />
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {doors.map(door => (
                <Door key={door.num} door={door} open={Boolean(open[door.num])} onToggle={() => toggle(door.num)} />
              ))}
            </div>
            <motion.div variants={fadeUp} className="mt-7 text-center text-[11px] uppercase"
              style={{ letterSpacing: '0.3em', color: 'rgba(217,164,65,0.7)' }}>
              {open[6] && stats.length > 0
                ? stats.map(s => `${s.value} ${s.label}`).join('  ·  ')
                : 'Counting down to the good part'}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Door 1 — About
const About = ({ data }) => {
  const name = data.personal?.name || 'The Maker';
  return (
    <section id="about" className="relative py-24 px-6 overflow-hidden" style={{ background: CREAM }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[11px] uppercase mb-3 flex items-center gap-2" style={{ letterSpacing: '0.35em', color: RED }}>
            <Gift size={13} /> Door 1 · About the maker
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold mb-10" style={{ color: NIGHT_2 }}>
            Hello, hello
          </motion.h2>
          <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
            <motion.div variants={fadeUp} className="mx-auto md:mx-0">
              {data.personal?.avatar ? (
                <img src={data.personal.avatar} alt={name} className="w-52 h-52 rounded-2xl object-cover"
                  style={{ border: '4px solid #fff', boxShadow: '0 10px 30px rgba(11,31,21,0.18)' }} />
              ) : (
                <div className="w-52 h-52 rounded-2xl flex items-center justify-center font-serif text-6xl font-bold"
                  style={{ background: `linear-gradient(150deg,${GREEN},${NIGHT_2})`, color: GOLD }}>
                  {initialsOf(name)}
                </div>
              )}
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="font-serif text-lg leading-relaxed" style={{ color: '#2c3a2f' }}>
                {data.personal?.bio || `${name} keeps this door reserved for a warm little biography.`}
              </p>
              {data.personal?.location && (
                <p className="mt-5 inline-flex items-center gap-2 text-xs uppercase px-4 py-2 rounded-full"
                  style={{ letterSpacing: '0.22em', color: GREEN, border: '1px solid rgba(47,93,68,0.35)' }}>
                  <MapPin size={12} /> {data.personal.location}
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Door 2 — Skills (workshop)
const Skills = ({ data }) => (
  <section id="skills" className="relative py-24 px-6 overflow-hidden" style={{ background: `linear-gradient(180deg,${NIGHT_2},${NIGHT})` }}>
    <div className="max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.p variants={fadeUp} className="text-[11px] uppercase mb-3 flex items-center gap-2" style={{ letterSpacing: '0.35em', color: GOLD }}>
          <Sparkles size={13} /> Door 2 · Workshop skills
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold mb-10" style={{ color: CREAM }}>
          Tools of the toy chest
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp} className="p-4 rounded-xl"
              style={{ background: 'rgba(246,239,224,0.06)', border: '1px solid rgba(217,164,65,0.25)' }}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-semibold" style={{ color: CREAM }}>{skill.name}</span>
                <span className="font-serif text-sm" style={{ color: GOLD }}>{skill.level}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(246,239,224,0.12)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg,${GOLD_DEEP},${GOLD})` }}
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: (i % 2) * 0.12 }} viewport={{ once: true }} />
              </div>
              {skill.category && (
                <p className="text-[10px] uppercase mt-2" style={{ letterSpacing: '0.2em', color: 'rgba(246,239,224,0.5)' }}>
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

// Door 3 — Projects
const Projects = ({ data }) => (
  <section id="projects" className="relative py-24 px-6 overflow-hidden" style={{ background: CREAM_2 }}>
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <motion.p variants={fadeUp} className="text-[11px] uppercase mb-3 flex items-center gap-2" style={{ letterSpacing: '0.35em', color: RED }}>
          <Star size={13} /> Door 3 · The collection
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold mb-10" style={{ color: NIGHT_2 }}>
          Gifts from the workshop floor
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={fadeUp} whileHover={{ y: -6 }}
              className="rounded-2xl overflow-hidden bg-white"
              style={{ boxShadow: '0 8px 26px rgba(11,31,21,0.12)', border: '1px solid rgba(47,93,68,0.12)' }}>
              <div className="h-1.5" style={{ background: i % 2 === 0 ? `repeating-linear-gradient(55deg, ${RED} 0 10px, #fff 10px 20px)` : `repeating-linear-gradient(55deg, ${GREEN} 0 10px, #fff 10px 20px)` }} />
              {project.image && <img src={project.image} alt={project.title} className="w-full h-40 object-cover" />}
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold mb-2" style={{ color: NIGHT_2 }}>{project.title}</h3>
                {project.description && (
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: '#4d5a4f' }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(47,93,68,0.1)', color: GREEN }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 text-xs font-semibold">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ color: RED }}>Unwrap live →</a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ color: GREEN }}>See source →</a>
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

// Door 4 — Experience
const Journey = ({ data }) => (
  <section id="experience" className="relative py-24 px-6 overflow-hidden" style={{ background: `linear-gradient(180deg,${NIGHT},${NIGHT_2})` }}>
    <div className="max-w-3xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.p variants={fadeUp} className="text-[11px] uppercase mb-3 flex items-center gap-2" style={{ letterSpacing: '0.35em', color: GOLD }}>
          <Calendar size={13} /> Door 4 · The journey
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold mb-12" style={{ color: CREAM }}>
          One sleigh ride at a time
        </motion.h2>
        <div className="relative border-l-2 pl-8 md:pl-10 space-y-10" style={{ borderColor: 'rgba(217,164,65,0.4)' }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div className="absolute -left-[39px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: GOLD, border: `3px solid ${NIGHT}` }}>
                <Star size={7} style={{ color: NIGHT }} fill={NIGHT} />
              </div>
              {exp.period && (
                <span className="inline-block mb-2 text-[10px] uppercase px-3 py-1 rounded-full"
                  style={{ letterSpacing: '0.22em', color: GOLD, border: '1px solid rgba(217,164,65,0.4)' }}>
                  {exp.period}
                </span>
              )}
              <h3 className="font-serif text-xl md:text-2xl font-bold" style={{ color: CREAM }}>{exp.role}</h3>
              {exp.company && <p className="font-serif italic text-sm mb-1.5" style={{ color: GOLD }}>{exp.company}</p>}
              {exp.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(246,239,224,0.7)' }}>{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Door 5 — Testimonials (letters)
const Letters = ({ data }) => (
  <section id="testimonials" className="relative py-24 px-6 overflow-hidden" style={{ background: CREAM }}>
    <div className="max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.p variants={fadeUp} className="text-[11px] uppercase mb-3 flex items-center gap-2" style={{ letterSpacing: '0.35em', color: RED }}>
          <Heart size={13} /> Door 5 · Kind letters
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-4xl font-bold mb-12" style={{ color: NIGHT_2 }}>
          Mail from the North Pole
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp} className="relative p-6 pt-8 bg-white rounded-xl"
              style={{
                boxShadow: '0 6px 22px rgba(11,31,21,0.1)',
                transform: `rotate(${(i % 2 === 0 ? -0.8 : 0.8)}deg)`,
                border: '1px solid rgba(185,130,44,0.25)'
              }}>
              {/* wax seal */}
              <div className="absolute -top-3.5 right-5 w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-xs text-white"
                style={{ background: `radial-gradient(circle at 35% 30%, #d05252, ${RED})`, boxShadow: '0 2px 6px rgba(143,45,45,0.5)' }}>
                {initialsOf(t.name)}
              </div>
              <blockquote className="font-serif italic leading-relaxed mb-4" style={{ color: '#3a463c' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="pt-3" style={{ borderTop: '1px dashed rgba(185,130,44,0.4)' }}>
                <div className="font-serif font-bold text-sm" style={{ color: NIGHT_2 }}>{t.name}</div>
                {t.role && <div className="text-xs" style={{ color: GREEN }}>{t.role}</div>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Door 24 — Contact
const FinalDoor = ({ data }) => {
  const socials = [
    { key: 'github', icon: Github, label: 'GitHub' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'twitter', icon: Twitter, label: 'Twitter' },
  ].filter(s => data.socials?.[s.key]);

  return (
    <section id="contact" className="relative py-24 px-6 overflow-hidden"
      style={{ background: `radial-gradient(700px 320px at 50% 100%, rgba(217,164,65,0.14), transparent 60%), ${NIGHT}` }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[11px] uppercase mb-4 inline-flex items-center gap-2" style={{ letterSpacing: '0.35em', color: GOLD }}>
            <Bell size={13} /> Door 24 · Write to me
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl font-bold mb-5" style={{ color: CREAM }}>
            The final door is yours
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm mb-10" style={{ color: 'rgba(246,239,224,0.7)' }}>
            You opened every door — leave a letter before the snow settles.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-8">
            {data.personal?.email && (
              <a href={`mailto:${data.personal.email}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-sm rounded-full transition-transform hover:-translate-y-0.5"
                style={{ background: GOLD, color: '#3d2a08', boxShadow: '0 6px 22px rgba(217,164,65,0.35)' }}>
                <Mail size={16} /> {data.personal.email}
              </a>
            )}
            {socials.map(({ key, icon: Icon, label }) => (
              <a key={key} href={data.socials[key]} target="_blank" rel="noreferrer" aria-label={label}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border transition-colors hover:bg-[#f6efe0]/10"
                style={{ borderColor: 'rgba(217,164,65,0.5)', color: CREAM }}>
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-[11px] uppercase" style={{ letterSpacing: '0.28em', color: 'rgba(246,239,224,0.45)' }}>
            &copy; {new Date().getFullYear()} {data.personal?.name || 'My Portfolio'} · Unwrapped with care
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// Main component
export default function AdventCalendar() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: NIGHT }}>
      <Snowfall />

      {/* minimal festive nav */}
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex gap-1 md:gap-2 px-4 py-2 rounded-full backdrop-blur-sm max-w-[94vw] overflow-x-auto"
        style={{ background: 'rgba(7,18,9,0.7)', border: '1px solid rgba(217,164,65,0.3)' }}>
        {[
          { label: 'Calendar', href: '#calendar', show: true },
          { label: 'About', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
          { label: 'Projects', href: '#projects', show: data.projects?.length > 0 },
          { label: 'Journey', href: '#experience', show: data.experience?.length > 0 },
          { label: 'Door 24', href: '#contact', show: true },
        ].filter(i => i.show).map(item => (
          <a key={item.href} href={item.href}
            className="whitespace-nowrap text-[11px] uppercase px-2.5 py-1 rounded-full transition-colors hover:bg-[#f6efe0]/10"
            style={{ letterSpacing: '0.18em', color: CREAM }}>
            {item.label}
          </a>
        ))}
      </nav>

      <Hero data={data} />
      <CalendarBoard data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <About data={data} />}
      {data.skills?.length > 0 && <Skills data={data} />}
      {data.projects?.length > 0 && <Projects data={data} />}
      {data.experience?.length > 0 && <Journey data={data} />}
      {data.testimonials?.length > 0 && <Letters data={data} />}
      <FinalDoor data={data} />
    </div>
  );
}
