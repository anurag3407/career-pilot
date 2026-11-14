import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Spade, Heart, Club, Diamond, Mail, Github, Linkedin, Twitter, MapPin,
  ExternalLink, RotateCw, Quote, Hand
} from 'lucide-react';

/**
 * Flip Card Deck Portfolio Template
 * Category: Animated / Motion
 * Description: Projects displayed as a deck of cards. Click to flip cards revealing project details on the back. Drag to shuffle. CSS 3D card flip animations.
 */

const FELT = '#1d6b45';
const FELT_DARK = '#0e3f28';
const FELT_DEEP = '#0a2e1d';
const CREAM = '#f3ecd9';
const CREAM_DIM = 'rgba(243,236,217,0.62)';
const GOLD = '#d4af37';
const GOLD_SOFT = 'rgba(212,175,55,0.45)';
const CARD_WHITE = '#fdfaf2';
const SUIT_RED = '#b23b34';

const SUITS = [Spade, Heart, Club, Diamond];

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
  return (parts.slice(0, 2).map((w) => w[0].toUpperCase()).join('')) || 'A';
};

// Playing-card back with a diamond lattice pattern and centered suit
const CardBackFace = ({ SuitIcon, red }) => (
  <div className="absolute inset-0 rounded-2xl p-2" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', background: CARD_WHITE, boxShadow: '0 10px 26px rgba(0,0,0,0.45)' }}>
    <div className="w-full h-full rounded-xl relative overflow-hidden flex items-center justify-center"
      style={{
        background: `
          repeating-linear-gradient(45deg, rgba(212,175,55,0.16) 0 2px, transparent 2px 14px),
          repeating-linear-gradient(-45deg, rgba(212,175,55,0.16) 0 2px, transparent 2px 14px),
          radial-gradient(120px 120px at 50% 50%, #22784f, #145c38 70%)`,
        border: '2px solid rgba(212,175,55,0.5)',
      }}>
      <span className="absolute top-2 left-2.5 text-[11px] font-bold" style={{ color: GOLD_SOFT }}>A</span>
      <span className="absolute top-2 right-2.5 text-[11px] font-bold rotate-180" style={{ color: GOLD_SOFT }}>*</span>
      <span className="absolute bottom-2 right-2.5 text-[11px] font-bold rotate-180" style={{ color: GOLD_SOFT }}>A</span>
      <span className="absolute bottom-2 left-2.5 text-[11px] font-bold" style={{ color: GOLD_SOFT }}>*</span>
      <div className="w-20 h-20 rounded-full flex items-center justify-center border-2"
        style={{ borderColor: GOLD_SOFT, background: 'rgba(10,46,29,0.65)' }}>
        <SuitIcon size={34} style={{ color: red ? SUIT_RED : GOLD }} />
      </div>
      <span className="absolute bottom-2.5 inset-x-0 text-center text-[9px] uppercase tracking-[0.35em]" style={{ color: GOLD_SOFT }}>
        house deck
      </span>
    </div>
  </div>
);

// One deck card: click flips (CSS 3D), drag sideways shuffles it to the back
function DeckCard({ project, index, onFlip, flipped, onShuffle }) {
  const draggingRef = useRef(false);
  const SuitIcon = SUITS[index % SUITS.length];
  const red = index % SUITS.length === 1 || index % SUITS.length === 3;
  const tilt = ((index * 7) % 5) - 2;

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{ perspective: 1200 }}
      whileHover={{ scale: 1.035, y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragStart={() => { draggingRef.current = true; }}
        onDragEnd={(e, info) => {
          if (Math.abs(info.offset.x) > 60) onShuffle(index);
          setTimeout(() => { draggingRef.current = false; }, 60);
        }}
        onClick={() => { if (!draggingRef.current) onFlip(index); }}
        animate={{ rotateY: flipped ? 180 : 0, rotate: tilt }}
        transition={{ rotateY: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }, rotate: { duration: 0.35 } }}
        className="relative w-full aspect-[3/4.2]"
        style={{ transformStyle: 'preserve-3d' }}
        role="button"
        aria-label={`Project card: ${project.title}. Click to flip, drag to shuffle.`}
      >
        {/* front — house card back */}
        <CardBackFace SuitIcon={SuitIcon} red={red} />
        {/* back — project details */}
        <div className="absolute inset-0 rounded-2xl p-2"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: CARD_WHITE, boxShadow: '0 10px 26px rgba(0,0,0,0.45)' }}>
          <div className="w-full h-full rounded-xl p-4 flex flex-col overflow-hidden" style={{ background: CARD_WHITE, border: '2px solid rgba(212,175,55,0.4)' }}>
            <div className="flex items-center justify-between mb-2">
              <SuitIcon size={16} style={{ color: red ? SUIT_RED : '#145c38' }} />
              <span className="text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: '#8a815f' }}>
                {red ? 'hearts run' : 'spade run'}
              </span>
            </div>
            {project.image && (
              <img src={project.image} alt={project.title} className="w-full h-24 object-cover rounded-lg mb-3" style={{ border: '1px solid rgba(120,110,90,0.3)' }} />
            )}
            <h3 className="text-base font-bold leading-snug mb-1.5" style={{ color: '#232d24' }}>{project.title}</h3>
            {project.description && (
              <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: 'rgba(35,45,36,0.65)' }}>{project.description}</p>
            )}
            {project.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-auto">
                {project.techStack.slice(0, 5).map((tech, j) => (
                  <span key={j} className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border"
                    style={{ borderColor: 'rgba(20,92,56,0.4)', color: '#145c38', background: 'rgba(20,92,56,0.07)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-3 text-[11px] font-bold pt-3">
              {project.liveUrl && project.liveUrl !== '#' && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 underline underline-offset-2" style={{ color: '#145c38' }}>
                  <ExternalLink size={12} /> Play
                </a>
              )}
              {project.githubUrl && project.githubUrl !== '#' && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 underline underline-offset-2" style={{ color: 'rgba(35,45,36,0.6)' }}>
                  <Github size={12} /> Source
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Poker chip (skills)
const Chip = ({ skill, i }) => {
  const colors = ['#b23b34', '#2471a3', '#1e8449', '#212f3d', '#6c3483', '#b9770e'];
  const c = colors[i % colors.length];
  return (
    <motion.div variants={fadeUp} whileHover={{ scale: 1.1, rotate: (i % 2 ? 4 : -4), y: -4 }}
      transition={{ type: 'spring', stiffness: 320, damping: 12 }} className="flex flex-col items-center gap-2.5">
      <div className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: c,
          border: '4px dashed rgba(243,236,217,0.85)',
          boxShadow: '0 6px 14px rgba(0,0,0,0.45), inset 0 0 0 3px rgba(0,0,0,0.25)',
        }}>
        <span className="text-sm font-black" style={{ color: CREAM }}>{Number(skill.level) || 85}</span>
      </div>
      <span className="text-[11px] font-semibold text-center max-w-[7rem] leading-tight" style={{ color: CREAM }}>{skill.name || 'Skill'}</span>
    </motion.div>
  );
};

const RailHead = ({ kicker, title }) => (
  <motion.div variants={fadeUp} className="mb-12 text-center">
    <p className="text-[11px] uppercase tracking-[0.45em] mb-3" style={{ color: GOLD }}>{kicker}</p>
    <h2 className="text-3xl md:text-4xl font-bold" style={{ color: CREAM }}>{title}</h2>
    <div aria-hidden className="mx-auto mt-4 flex items-center justify-center gap-2">
      <Spade size={11} style={{ color: GOLD_SOFT }} />
      <span className="h-px w-24" style={{ background: GOLD_SOFT }} />
      <Spade size={11} style={{ color: GOLD_SOFT, transform: 'rotate(180deg)' }} />
    </div>
  </motion.div>
);

export default function FlipCardDeck() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'My Portfolio';
  const projects = data.projects || [];
  const [flipped, setFlipped] = useState({});
  const [orderState, setOrderState] = useState(null);

  const toggleFlip = (i) => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }));
  const shuffleToBack = (i) => {
    setOrderState((prev) => {
      const base = prev || projects.map((_, k) => k);
      const pos = base.indexOf(i);
      if (pos < 0) return base;
      const next = [...base];
      next.splice(pos, 1);
      next.push(i);
      return next;
    });
  };
  const order = orderState || projects.map((_, k) => k);

  const navItems = [
    { label: 'The Player', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Chips', href: '#skills', show: data.skills?.length > 0 },
    { label: 'The Deck', href: '#projects', show: projects.length > 0 },
    { label: 'Hands Played', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Table Talk', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Join Table', href: '#contact', show: true },
  ].filter((item) => item.show);

  return (
    <div className="antialiased overflow-x-hidden font-sans" style={{ color: CREAM }}>
      {/* felt vignette overlay */}
      <div aria-hidden className="fixed inset-0 z-40 pointer-events-none" style={{ boxShadow: 'inset 0 0 240px rgba(0,0,0,0.6)' }} />

      {/* wood rail nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-black/40"
        style={{ background: 'linear-gradient(180deg, #3b2a1a, #2a1d11)', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 overflow-x-auto">
          <span className="flex items-center gap-2 text-xs font-black tracking-[0.25em] whitespace-nowrap pr-2" style={{ color: GOLD }}>
            <Spade size={14} /> THE&nbsp;TABLE
          </span>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className="whitespace-nowrap text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors hover:bg-[#d4af37] hover:text-[#1a1208]"
              style={{ borderColor: GOLD_SOFT, color: CREAM_DIM }}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-28 pb-20"
        style={{ background: `radial-gradient(900px 560px at 50% 42%, ${FELT} 0%, ${FELT_DARK} 58%, ${FELT_DEEP} 100%)` }}>
        {/* felt texture */}
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-40"
          style={{ background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0 3px, transparent 3px 6px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.05) 0 3px, transparent 3px 6px)' }} />
        {/* decorative scattered chips + suits */}
        {Array.from({ length: 8 }).map((_, i) => {
          const Icon = SUITS[i % SUITS.length];
          return (
            <motion.div key={i} aria-hidden
              className="absolute pointer-events-none select-none"
              animate={{ y: [0, -14, 0], rotate: [0, (i % 2 ? 10 : -10), 0], opacity: [0.08, 0.16, 0.08] }}
              transition={{ duration: 6 + (i % 4) * 1.5, repeat: Infinity, delay: (i % 5) * 0.8, ease: 'easeInOut' }}
              style={{ left: `${(i * 41 + 6) % 92}%`, top: `${(i * 31 + 12) % 80}%` }}>
              <Icon size={30 + ((i * 13) % 30)} style={{ color: GOLD }} />
            </motion.div>
          );
        })}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-2xl text-center">
          <motion.div variants={fadeUp} className="flex justify-center gap-2 mb-7">
            {SUITS.map((Icon, i) => (
              <motion.span key={i} animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center border"
                style={{ borderColor: GOLD_SOFT, background: 'rgba(10,46,29,0.6)' }}>
                <Icon size={17} style={{ color: i % 2 ? SUIT_RED : GOLD }} />
              </motion.span>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-[11px] uppercase tracking-[0.45em] mb-4" style={{ color: GOLD }}>
            Take a seat at the table
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black mb-5 break-words"
            style={{ color: CREAM, textShadow: '0 3px 0 rgba(0,0,0,0.35)' }}>
            {name}
          </motion.h1>
          {data.personal?.title && (
            <motion.p variants={fadeUp} className="text-xl md:text-2xl font-bold mb-4" style={{ color: GOLD }}>
              {data.personal.title}
            </motion.p>
          )}
          {data.personal?.tagline && (
            <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6" style={{ color: CREAM_DIM }}>
              {data.personal.tagline}
            </motion.p>
          )}
          {data.personal?.location && (
            <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] mb-10" style={{ color: CREAM_DIM }}>
              <MapPin size={13} style={{ color: GOLD }} /> {data.personal.location}
            </motion.p>
          )}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
            <a href="#projects"
              className="px-7 py-3 rounded-full text-sm font-black transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(180deg, #e6c75a, ${GOLD})`, color: '#1a1208', boxShadow: '0 6px 16px rgba(0,0,0,0.4)' }}>
              Deal the projects
            </a>
            <a href="#about"
              className="px-7 py-3 rounded-full text-sm font-bold border-2 transition-transform hover:-translate-y-0.5"
              style={{ borderColor: GOLD_SOFT, color: CREAM }}>
              Meet the player
            </a>
            <a href="#contact"
              className="px-7 py-3 rounded-full text-sm font-bold border-2 transition-transform hover:-translate-y-0.5"
              style={{ borderColor: 'rgba(243,236,217,0.3)', color: CREAM_DIM }}>
              Join the table
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT — the player */}
      {(data.personal?.bio || data.personal?.avatar) && (
        <section id="about" className="relative py-24 px-6 overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${FELT_DEEP} 0%, ${FELT_DARK} 100%)` }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
              <RailHead kicker="Player profile" title="The player behind the deck" />
              <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
                <motion.div variants={fadeUp} className="mx-auto" style={{ rotate: -2 }}>
                  {data.personal?.avatar ? (
                    <div className="w-52 h-64 rounded-2xl p-2.5" style={{ background: CARD_WHITE, boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
                      <img src={data.personal.avatar} alt={name} className="w-full h-full object-cover rounded-xl" />
                      <span className="sr-only">{name}</span>
                    </div>
                  ) : (
                    <div className="w-52 h-64 rounded-2xl p-2.5" style={{ background: CARD_WHITE, boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
                      <div className="w-full h-full rounded-xl flex flex-col items-center justify-center gap-3"
                        style={{ background: `radial-gradient(140px 140px at 50% 30%, rgba(212,175,55,0.15), transparent), ${FELT_DARK}` }}>
                        <Spade size={22} style={{ color: GOLD }} />
                        <span className="text-5xl font-black tracking-widest" style={{ color: CREAM }}>{initialsOf(name)}</span>
                        <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: GOLD_SOFT }}>house player</span>
                      </div>
                    </div>
                  )}
                </motion.div>
                <motion.div variants={fadeUp}>
                  <div className="rounded-2xl p-6" style={{ background: 'rgba(10,46,29,0.55)', border: '1px solid rgba(212,175,55,0.3)' }}>
                    <p className="text-base md:text-lg leading-relaxed" style={{ color: CREAM_DIM }}>
                      {data.personal?.bio || 'This player has not filled in their bio yet. The seat is still warm, though.'}
                    </p>
                    {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
                      <div className="grid grid-cols-3 gap-4 mt-8">
                        {[
                          { label: 'Years at the table', value: data.stats.yearsExperience },
                          { label: 'Hands delivered', value: data.stats.projectsCompleted },
                          { label: 'Happy backers', value: data.stats.happyClients },
                        ].filter((s) => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                          <div key={i} className="rounded-xl border p-4 text-center" style={{ borderColor: GOLD_SOFT, background: 'rgba(10,46,29,0.5)' }}>
                            <div className="text-3xl font-black" style={{ color: GOLD }}>{s.value}</div>
                            <div className="text-[10px] uppercase tracking-[0.15em] mt-1.5" style={{ color: CREAM_DIM }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SKILLS — poker chips */}
      {data.skills?.length > 0 && (
        <section id="skills" className="relative py-24 px-6 overflow-hidden"
          style={{ background: `radial-gradient(700px 400px at 50% 50%, ${FELT_DARK}, ${FELT_DEEP})` }}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <RailHead kicker="Buy-in" title="Chips on the table" />
              <div className="flex flex-wrap justify-center gap-x-7 gap-y-9">
                {data.skills.slice(0, 16).map((skill, i) => <Chip key={i} skill={skill} i={i} />)}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* PROJECTS — the deck */}
      {projects.length > 0 && (
        <section id="projects" className="relative py-24 px-6 overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${FELT_DEEP} 0%, ${FELT_DARK} 100%)` }}>
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
              <RailHead kicker="On the felt" title="The project deck" />
              <motion.p variants={fadeUp} className="text-center text-xs mb-10 inline-flex items-center gap-2 w-full justify-center"
                style={{ color: CREAM_DIM }}>
                <Hand size={14} style={{ color: GOLD }} /> Click a card to flip it. Drag it sideways to send it to the back of the deck.
              </motion.p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-9 pt-4">
                {order.map((projectIndex, pos) => {
                  const project = projects[projectIndex];
                  if (!project) return null;
                  return (
                    <DeckCard
                      key={projectIndex}
                      index={pos}
                      project={project}
                      flipped={Boolean(flipped[projectIndex])}
                      onFlip={toggleFlip}
                      onShuffle={shuffleToBack}
                    />
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* EXPERIENCE — hands played */}
      {data.experience?.length > 0 && (
        <section id="experience" className="relative py-24 px-6 overflow-hidden"
          style={{ background: `radial-gradient(700px 400px at 50% 50%, ${FELT_DARK}, ${FELT_DEEP})` }}>
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <RailHead kicker="The long session" title="Hands played" />
              <div className="space-y-7">
                {data.experience.map((exp, i) => {
                  const Icon = SUITS[i % SUITS.length];
                  const red = i % SUITS.length === 1 || i % SUITS.length === 3;
                  return (
                    <motion.div key={i} variants={fadeUp} className="relative rounded-2xl p-6"
                      style={{ background: 'rgba(10,46,29,0.55)', border: '1px solid rgba(212,175,55,0.28)', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}>
                      <div className="flex items-start gap-4">
                        <span className="w-10 h-10 rounded-lg flex items-center justify-center border shrink-0"
                          style={{ borderColor: GOLD_SOFT, background: 'rgba(10,46,29,0.7)' }}>
                          <Icon size={16} style={{ color: red ? SUIT_RED : GOLD }} />
                        </span>
                        <div className="min-w-0">
                          {exp.period && (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] px-2.5 py-1 rounded-full border mb-2"
                              style={{ borderColor: GOLD_SOFT, color: GOLD }}>
                              {exp.period}
                            </span>
                          )}
                          <h3 className="text-lg font-bold" style={{ color: CREAM }}>{exp.role || 'Role'}</h3>
                          {exp.company && <p className="text-sm font-semibold mt-0.5 mb-2" style={{ color: GOLD }}>{exp.company}</p>}
                          {exp.description && <p className="text-sm leading-relaxed" style={{ color: CREAM_DIM }}>{exp.description}</p>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS — table talk */}
      {data.testimonials?.length > 0 && (
        <section id="testimonials" className="relative py-24 px-6 overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${FELT_DEEP} 0%, ${FELT_DARK} 100%)` }}>
          <div className="max-w-6xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
              <RailHead kicker="Overheard" title="Table talk" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.testimonials.map((t, i) => (
                  <motion.figure key={i} variants={fadeUp} className="relative rounded-2xl p-6 pt-7"
                    style={{
                      background: CARD_WHITE,
                      boxShadow: '0 10px 26px rgba(0,0,0,0.45)',
                      transform: `rotate(${(i % 2 ? 1 : -1)}deg)`,
                    }}>
                    <span aria-hidden className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                      style={{ background: 'radial-gradient(circle at 35% 30%, #e2574d, #93312b)', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }} />
                    <Quote size={17} style={{ color: '#145c38' }} className="mb-3" />
                    <blockquote className="text-sm leading-relaxed mb-4" style={{ color: '#232d24' }}>&ldquo;{t.text}&rdquo;</blockquote>
                    <figcaption className="flex items-center gap-3">
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border-2" style={{ borderColor: GOLD_SOFT }} />
                      ) : (
                        <span className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black"
                          style={{ background: FELT_DARK, color: GOLD }}>
                          {initialsOf(t.name)}
                        </span>
                      )}
                      <span>
                        <span className="block text-sm font-bold" style={{ color: '#232d24' }}>{t.name || 'Anonymous'}</span>
                        {t.role && <span className="block text-xs" style={{ color: 'rgba(35,45,36,0.6)' }}>{t.role}</span>}
                      </span>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="relative py-28 px-6 overflow-hidden"
        style={{ background: `radial-gradient(760px 420px at 50% 100%, rgba(212,175,55,0.14), transparent 60%), ${FELT_DEEP}` }}>
        <div className="max-w-2xl mx-auto text-center relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.div variants={fadeUp} className="flex justify-center mb-5">
              <span className="w-14 h-14 rounded-full flex items-center justify-center border-2"
                style={{ borderColor: GOLD_SOFT, background: 'rgba(10,46,29,0.7)' }}>
                <RotateCw size={22} style={{ color: GOLD }} />
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black mb-5" style={{ color: CREAM }}>
              Join the next hand
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm md:text-base mb-10" style={{ color: CREAM_DIM }}>
              The dealer is ready when you are. Place your message and let&apos;s see what we win together.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center items-center gap-4 mb-9">
              {(data.personal?.email || data.socials?.email) && (
                <a href={`mailto:${data.personal?.email || data.socials?.email}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-sm transition-transform hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(180deg, #e6c75a, ${GOLD})`, color: '#1a1208', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
                  <Mail size={17} /> Place your bet
                </a>
              )}
              {['github', 'linkedin', 'twitter'].map((key) => {
                const url = data.socials?.[key];
                if (!url) return null;
                const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
                return (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 transition-transform hover:-translate-y-1"
                    style={{ borderColor: GOLD_SOFT, color: CREAM, background: 'rgba(10,46,29,0.6)' }}>
                    <Icon size={18} />
                  </a>
                );
              })}
            </motion.div>
            {(data.personal?.phone || data.personal?.location) && (
              <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase" style={{ color: CREAM_DIM }}>
                {[data.personal?.phone, data.personal?.location].filter(Boolean).join('  •  ')}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      <footer className="py-7 text-center border-t" style={{ borderColor: 'rgba(212,175,55,0.2)', background: '#081f14', color: CREAM_DIM }}>
        <p className="text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <Spade size={11} style={{ color: GOLD }} />
          &copy; {new Date().getFullYear()} {name} &middot; Flip Card Deck
        </p>
      </footer>
    </div>
  );
}
