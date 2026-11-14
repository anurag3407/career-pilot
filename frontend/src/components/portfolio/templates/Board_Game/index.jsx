import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Dices, Flag, Trophy,
  Mail, MapPin, Github, Linkedin, Twitter, Star, Heart, Zap,
  Gamepad2, Rocket, Crown
} from 'lucide-react';

/**
 * Board Game Portfolio Template
 * Category: Unique / Creative
 * Description: Board game layout with winding game path with colored squares. Each square is a portfolio item. Dice roll animation to navigate. Cheerful aesthetic.
 */

const BG = '#fdf3e3';
const INK = '#232733';
const SUB = '#5d5f6b';
const RED = '#ef5b5b';
const YELLOW = '#f7b32b';
const BLUE = '#4d9de0';
const GREEN = '#61bf66';
const PURPLE = '#9b5de5';
const PINK = '#f28cb1';
const GOLD = '#f2b53a';
const COLORS = [RED, YELLOW, BLUE, GREEN, PURPLE, PINK];

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const fadeUp = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'P1';
};

// chunky toy-like button styling
const chunky = {
  border: `2px solid ${INK}`,
  boxShadow: `4px 4px 0 ${INK}`,
};
const chunkyLg = {
  border: `3px solid ${INK}`,
  boxShadow: `6px 6px 0 ${INK}`,
};

const SectionBadge = ({ color, icon: Icon, children }) => (
  <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4"
    style={{ ...chunky, background: color, color: INK }}>
    <Icon size={15} />
    <span className="text-xs font-extrabold uppercase tracking-widest">{children}</span>
  </motion.div>
);

// Hero — game title screen with the dice-roll navigator
const Hero = ({ data, onRoll, rolling, face, sections }) => {
  const FaceIcon = DICE_ICONS[face - 1];
  const name = data.personal?.name || 'Player One';
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden px-6 py-24" style={{ background: BG }}>
      {/* scattered decorative tokens */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span key={i} className="absolute rounded-full"
            style={{
              left: `${(i * 23 + 6) % 96}%`,
              top: `${(i * 41 + 10) % 88}%`,
              width: 14 + ((i * 7) % 20),
              height: 14 + ((i * 7) % 20),
              background: COLORS[i % 6],
              border: `2px solid ${INK}`,
              opacity: 0.5
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: 'easeInOut' }} />
        ))}
      </div>

      <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.p variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-extrabold uppercase tracking-widest"
          style={{ ...chunky, background: '#fff', color: INK }}>
          <Gamepad2 size={14} /> The board game edition
        </motion.p>
        <motion.h1 variants={fadeUp} className="font-black tracking-tight leading-[0.95] text-5xl md:text-7xl mb-5" style={{ color: INK }}>
          {name}
          <svg viewBox="0 0 320 18" className="w-56 md:w-80 mx-auto mt-3" aria-hidden>
            <path d="M4 10 Q 40 2 80 10 T 160 10 T 240 10 T 316 8" fill="none" stroke={RED} strokeWidth="5" strokeLinecap="round" />
          </svg>
        </motion.h1>
        {data.personal?.title && (
          <motion.p variants={fadeUp} className="text-lg md:text-xl font-bold mb-3" style={{ color: BLUE }}>
            {data.personal.title}
          </motion.p>
        )}
        {data.personal?.tagline && (
          <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-4 font-medium" style={{ color: SUB }}>
            {data.personal.tagline}
          </motion.p>
        )}
        {data.personal?.location && (
          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-9"
            style={{ color: SUB }}>
            <MapPin size={13} style={{ color: RED }} /> {data.personal.location}
          </motion.p>
        )}

        {/* dice roll navigator */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8">
          <motion.button type="button" onClick={onRoll} disabled={rolling}
            aria-label="Roll the dice to jump to a random section"
            animate={rolling ? { rotate: [0, -10, 10, 0], scale: [1, 1.06, 1] } : { rotate: 0, scale: 1 }}
            transition={rolling ? { duration: 0.35, repeat: Infinity } : { duration: 0.3 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center disabled:cursor-wait"
            style={{ ...chunkyLg, background: '#fff' }}>
            <FaceIcon size={44} style={{ color: INK }} />
          </motion.button>
          <div className="text-center sm:text-left">
            <button type="button" onClick={onRoll} disabled={rolling}
              className="px-7 py-3.5 rounded-2xl font-extrabold uppercase tracking-widest text-sm transition-transform hover:-translate-y-0.5"
              style={{ ...chunky, background: YELLOW, color: INK }}>
              {rolling ? 'Rolling…' : 'Roll the dice'}
            </button>
            <p className="text-xs font-semibold mt-2" style={{ color: SUB }}>
              Roll to jump straight into a random section
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3.5">
          <a href="#about" className="px-6 py-3 rounded-2xl text-sm font-extrabold uppercase tracking-wider"
            style={{ ...chunky, background: BLUE, color: '#fff' }}>
            Read my card
          </a>
          <a href="#projects" className="px-6 py-3 rounded-2xl text-sm font-extrabold uppercase tracking-wider"
            style={{ ...chunky, background: '#fff', color: INK }}>
            Quest log
          </a>
          <a href="#contact" className="px-6 py-3 rounded-2xl text-sm font-extrabold uppercase tracking-wider"
            style={{ ...chunky, background: RED, color: '#fff' }}>
            Reach the finish
          </a>
        </motion.div>
        <motion.p variants={fadeUp} className="text-xs font-bold mt-8" style={{ color: SUB }}>
          {sections.length} spaces on the board · 1 very competitive player
        </motion.p>
      </motion.div>
    </section>
  );
};

// Single square on the winding path
const PathCell = ({ cell }) => {
  const Icon = cell.icon;
  const inner = (
    <>
      {cell.filler ? (
        <div className="absolute inset-2 rounded-lg"
          style={{ background: `repeating-linear-gradient(45deg, ${cell.color} 0 5px, transparent 5px 11px)`, border: `2px solid ${INK}` }} />
      ) : (
        <>
          <span className="absolute top-1 left-1.5 text-[10px] font-black" style={{ color: 'rgba(35,39,51,0.55)' }}>{cell.num}</span>
          <Icon size={20} style={{ color: cell.iconColor }} />
          <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-wide leading-tight text-center px-0.5"
            style={{ color: cell.iconColor }}>
            {cell.label}
          </span>
        </>
      )}
    </>
  );
  const cls = 'relative flex-1 min-w-0 aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-transform hover:-translate-y-1 hover:rotate-2';
  const style = { ...chunky, background: cell.filler ? BG : cell.color };
  return cell.href ? (
    <a href={cell.href} className={cls} style={style} aria-label={cell.label}>{inner}</a>
  ) : (
    <div className={cls} style={style}>{inner}</div>
  );
};

// The winding game board — serpentine rows of colored squares
const GameBoard = ({ sections }) => {
  const cells = [];
  cells.push({ key: 'start', num: 0, label: 'Start', icon: Flag, color: GREEN, iconColor: '#fff', href: '#hero' });
  const itemIcons = { about: Rocket, skills: Zap, projects: Crown, experience: Star, testimonials: Heart, contact: Trophy };
  const itemColors = { about: RED, skills: BLUE, projects: PURPLE, experience: YELLOW, testimonials: PINK, contact: GOLD };
  sections.forEach((s) => {
    const color = itemColors[s.id] || BLUE;
    cells.push({ key: s.id, label: s.label, icon: itemIcons[s.id] || Star, color, iconColor: color === GOLD ? INK : '#fff', href: `#${s.id}`, count: s.count });
  });
  // fill the serpentine so the path winds nicely and the finish lands on a full row
  const fillers = (6 - ((cells.length + 1) % 6)) % 6;
  for (let i = 0; i < fillers; i++) {
    cells.push({ key: `fill-${i}`, filler: true, color: COLORS[i % 6], icon: null });
  }
  // trophy always marks the end of the path
  cells.push({ key: 'finish', num: cells.length, label: 'Finish', icon: Trophy, color: GOLD, iconColor: INK, href: '#contact' });

  const rows = [];
  for (let i = 0; i < cells.length; i += 6) rows.push(cells.slice(i, i + 6));

  return (
    <section id="board" className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="text-center mb-10">
          <SectionBadge color={GREEN} icon={Dices}>The game board</SectionBadge>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight mb-3" style={{ color: INK }}>
            Every square is a stop worth visiting
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm font-semibold max-w-lg mx-auto" style={{ color: SUB }}>
            Tap any square to jump there, or roll the dice up top and let chance pick your route.
          </motion.p>
        </motion.div>
        <motion.div variants={fadeUp} className="rounded-3xl p-4 md:p-7"
          style={{
            background: 'linear-gradient(160deg, #43a06b, #35844f)',
            border: `4px solid ${INK}`,
            boxShadow: `10px 10px 0 ${INK}`
          }}>
          <div className="space-y-2.5">
            {rows.map((row, r) => (
              <div key={r} className={`flex gap-2.5 ${r % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                {row.map(cell => <PathCell key={cell.key} cell={cell} />)}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.p variants={fadeUp} className="text-center text-xs font-bold mt-5" style={{ color: SUB }}>
          Suggested route: {sections.map(s => s.label).join(' → ')} → Finish
        </motion.p>
      </div>
    </section>
  );
};

// About — the player card
const PlayerCard = ({ data }) => {
  const name = data.personal?.name || 'Player One';
  const stats = [
    { label: 'XP years', value: data.stats?.yearsExperience },
    { label: 'Quests done', value: data.stats?.projectsCompleted },
    { label: 'Happy allies', value: data.stats?.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionBadge color={RED} icon={Rocket}>Player card</SectionBadge>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight mb-10" style={{ color: INK }}>
            Meet player one
          </motion.h2>
          <motion.div variants={fadeUp} className="rounded-3xl p-7 md:p-9" style={{ ...chunkyLg, background: '#fff' }}>
            <div className="flex flex-col md:flex-row gap-7 items-center md:items-start">
              {data.personal?.avatar ? (
                <img src={data.personal.avatar} alt={name} className="w-40 h-40 rounded-2xl object-cover shrink-0"
                  style={{ ...chunky, transform: 'rotate(-2deg)' }} />
              ) : (
                <div className="w-40 h-40 rounded-2xl shrink-0 flex items-center justify-center text-5xl font-black"
                  style={{ ...chunky, background: BLUE, color: '#fff', transform: 'rotate(-2deg)' }}>
                  {initialsOf(name)}
                </div>
              )}
              <div className="text-center md:text-left">
                <p className="text-[15px] leading-relaxed font-medium" style={{ color: '#3c4050' }}>
                  {data.personal?.bio || `${name} keeps this card reserved for the origin story.`}
                </p>
                {stats.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mt-5 justify-center md:justify-start">
                    {stats.map((s, i) => (
                      <span key={i} className="px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5"
                        style={{ ...chunky, background: COLORS[i % 6], color: '#fff' }}>
                        <Zap size={12} /> {s.value} {s.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Skills — power-up shelf
const PowerUps = ({ data }) => (
  <section id="skills" className="py-24 px-6" style={{ background: '#fbe9d1' }}>
    <div className="max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionBadge color={BLUE} icon={Zap}>Power-ups</SectionBadge>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight mb-10" style={{ color: INK }}>
          Inventory of abilities
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -4, rotate: i % 2 === 0 ? -1 : 1 }}
              className="rounded-2xl p-5" style={{ ...chunky, background: '#fff' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-extrabold text-sm" style={{ color: INK }}>{skill.name}</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ background: COLORS[i % 6], color: '#fff' }}>
                  {skill.level}
                </span>
              </div>
              <div className="h-3.5 rounded-full overflow-hidden" style={{ background: '#eceef2', border: `2px solid ${INK}` }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: COLORS[i % 6] }}
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 0.9, delay: (i % 3) * 0.1 }} viewport={{ once: true }} />
              </div>
              {skill.category && (
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2.5" style={{ color: SUB }}>
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

// Projects — quest log
const QuestLog = ({ data }) => (
  <section id="projects" className="py-24 px-6" style={{ background: BG }}>
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        <SectionBadge color={PURPLE} icon={Crown}>Quest log</SectionBadge>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight mb-10" style={{ color: INK }}>
          Adventures completed
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={fadeUp} whileHover={{ y: -6 }}
              className="rounded-3xl overflow-hidden" style={{ ...chunkyLg, background: '#fff' }}>
              <div className="px-5 py-2.5 flex items-center justify-between" style={{ background: COLORS[i % 6], borderBottom: `3px solid ${INK}` }}>
                <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#fff' }}>
                  Quest {String(i + 1).padStart(2, '0')}
                </span>
                <Star size={14} style={{ color: '#fff' }} fill="#fff" />
              </div>
              {project.image && <img src={project.image} alt={project.title} className="w-full h-40 object-cover" style={{ borderBottom: `3px solid ${INK}` }} />}
              <div className="p-5">
                <h3 className="font-black text-lg mb-2" style={{ color: INK }}>{project.title}</h3>
                {project.description && (
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3 font-medium" style={{ color: SUB }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-[10px] font-extrabold px-2 py-1 rounded-lg border-2"
                        style={{ borderColor: INK, background: BG, color: INK }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider"
                      style={{ ...chunky, background: GREEN, color: '#fff' }}>
                      Play
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider"
                      style={{ ...chunky, background: '#fff', color: INK }}>
                      <Github size={13} /> Repo
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

// Experience — the level-up trail
const LevelTrail = ({ data }) => (
  <section id="experience" className="py-24 px-6" style={{ background: '#fbe9d1' }}>
    <div className="max-w-3xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionBadge color={YELLOW} icon={Star}>Level up</SectionBadge>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight mb-12" style={{ color: INK }}>
          The campaign so far
        </motion.h2>
        <div className="relative space-y-9" style={{ paddingLeft: 4 }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative pl-16">
              {/* connector */}
              {i < data.experience.length - 1 && (
                <span className="absolute left-[27px] top-10 bottom-[-36px] border-l-[3px] border-dashed" style={{ borderColor: INK, opacity: 0.3 }} />
              )}
              <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg"
                style={{ ...chunky, background: COLORS[i % 6], color: '#fff' }}>
                {i + 1}
              </div>
              {exp.period && (
                <span className="inline-block mb-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                  style={{ border: `2px solid ${INK}`, background: '#fff', color: INK }}>
                  {exp.period}
                </span>
              )}
              <h3 className="font-black text-xl" style={{ color: INK }}>{exp.role}</h3>
              {exp.company && <p className="text-sm font-bold mb-1" style={{ color: BLUE }}>at {exp.company}</p>}
              {exp.description && (
                <p className="text-sm leading-relaxed font-medium" style={{ color: SUB }}>{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Testimonials — player reviews
const Reviews = ({ data }) => (
  <section id="testimonials" className="py-24 px-6" style={{ background: BG }}>
    <div className="max-w-5xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionBadge color={PINK} icon={Heart}>Player reviews</SectionBadge>
        <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight mb-10" style={{ color: INK }}>
          Five stars, apparently
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp} whileHover={{ y: -5, rotate: i % 2 === 0 ? -1 : 1 }}
              className="rounded-3xl p-6" style={{ ...chunkyLg, background: '#fff' }}>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={15} style={{ color: GOLD }} fill={GOLD} />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed font-medium mb-4" style={{ color: '#3c4050' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-3" style={{ borderTop: `2px dashed rgba(35,39,51,0.2)` }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-xl object-cover" style={{ border: `2px solid ${INK}` }} />
                ) : (
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black"
                    style={{ background: COLORS[i % 6], color: '#fff', border: `2px solid ${INK}` }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="font-black text-sm" style={{ color: INK }}>{t.name}</div>
                  {t.role && <div className="text-xs font-semibold" style={{ color: SUB }}>{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Contact — the finish square
const FinishSquare = ({ data }) => {
  const socials = [
    { key: 'github', icon: Github, label: 'GitHub' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'twitter', icon: Twitter, label: 'Twitter' },
  ].filter(s => data.socials?.[s.key]);

  return (
    <section id="contact" className="py-24 px-6" style={{ background: '#fbe9d1' }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.div variants={fadeUp} className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
            style={{ ...chunkyLg, background: GOLD }}>
            <Trophy size={36} style={{ color: INK }} />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black tracking-tight mb-3" style={{ color: INK }}>
            You reached the finish
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm font-semibold mb-9" style={{ color: SUB }}>
            Thanks for playing all the way through — the next move is yours.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-7">
            {data.personal?.email && (
              <a href={`mailto:${data.personal.email}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-extrabold uppercase tracking-wider transition-transform hover:-translate-y-0.5"
                style={{ ...chunky, background: RED, color: '#fff' }}>
                <Mail size={16} /> Roll into my inbox
              </a>
            )}
            {socials.map(({ key, icon: Icon, label }) => (
              <a key={key} href={data.socials[key]} target="_blank" rel="noreferrer" aria-label={label}
                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl transition-transform hover:-translate-y-0.5"
                style={{ ...chunky, background: '#fff', color: INK }}>
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-xs font-bold" style={{ color: SUB }}>
            &copy; {new Date().getFullYear()} {data.personal?.name || 'Player One'} · Winner of zero board game arguments
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// Main component
export default function BoardGame() {
  const { portfolioData: data } = usePortfolio();
  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState(6);
  const intervalRef = useRef(null);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const sections = [
    { id: 'about', label: 'About', show: Boolean(data.personal?.bio || data.personal?.avatar), count: data.personal?.bio ? 1 : 0 },
    { id: 'skills', label: 'Skills', show: data.skills?.length > 0, count: data.skills?.length || 0 },
    { id: 'projects', label: 'Quests', show: data.projects?.length > 0, count: data.projects?.length || 0 },
    { id: 'experience', label: 'Levels', show: data.experience?.length > 0, count: data.experience?.length || 0 },
    { id: 'testimonials', label: 'Reviews', show: data.testimonials?.length > 0, count: data.testimonials?.length || 0 },
    { id: 'contact', label: 'Finish', show: true, count: 1 },
  ].filter(s => s.show);

  const roll = () => {
    if (rolling || sections.length === 0) return;
    setRolling(true);
    let ticks = 0;
    intervalRef.current = setInterval(() => {
      ticks += 1;
      setFace(1 + Math.floor(Math.random() * 6));
      if (ticks >= 10) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        const target = sections[Math.floor(Math.random() * sections.length)];
        setFace((sections.indexOf(target) % 6) + 1);
        setRolling(false);
        const el = document.getElementById(target.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 95);
  };

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: BG, color: INK }}>
      {/* playful top nav */}
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex gap-1 md:gap-1.5 px-2.5 py-2 rounded-2xl max-w-[94vw] overflow-x-auto"
        style={{ ...chunky, background: '#fff' }}>
        {sections.map(s => (
          <a key={s.id} href={`#${s.id}`}
            className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition-colors hover:bg-[#fdf3e3]"
            style={{ color: INK }}>
            {s.label}
          </a>
        ))}
      </nav>

      <Hero data={data} onRoll={roll} rolling={rolling} face={face} sections={sections} />
      <GameBoard sections={sections} />
      {(data.personal?.bio || data.personal?.avatar) && <PlayerCard data={data} />}
      {data.skills?.length > 0 && <PowerUps data={data} />}
      {data.projects?.length > 0 && <QuestLog data={data} />}
      {data.experience?.length > 0 && <LevelTrail data={data} />}
      {data.testimonials?.length > 0 && <Reviews data={data} />}
      <FinishSquare data={data} />
    </div>
  );
}
