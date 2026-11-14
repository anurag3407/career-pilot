import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Mail, Github, Linkedin, Twitter, ArrowDown,
  MountainSnow, Telescope, Orbit, Waves, Zap, Compass
} from 'lucide-react';

/**
 * Aurora Sky Portfolio Template
 * Category: 3D / WebGL
 * Description: Northern lights (aurora borealis) animation across the hero using CSS gradient animations. Icy blue/green/purple palette on a starry dark sky.
 */

const SKY = '#040815';
const SKY_MID = '#081226';
const MINT = '#46f2b4';
const ICE = '#59b8ff';
const VIOLET = '#9d7bff';
const FROST = '#dceafc';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'N';
};

// Aurora + star keyframes injected once for the page
const SkyStyles = () => (
  <style>{`
    @keyframes auroraDriftA {
      0%   { transform: translate3d(-7%, 0, 0) skewX(-9deg) scaleY(1); opacity: 0.75; }
      50%  { transform: translate3d(7%, 3%, 0) skewX(7deg) scaleY(1.25); opacity: 1; }
      100% { transform: translate3d(-7%, 0, 0) skewX(-9deg) scaleY(1); opacity: 0.75; }
    }
    @keyframes auroraDriftB {
      0%   { transform: translate3d(6%, -2%, 0) skewX(8deg) scaleY(1.1); opacity: 0.6; }
      50%  { transform: translate3d(-8%, 2%, 0) skewX(-6deg) scaleY(0.9); opacity: 0.95; }
      100% { transform: translate3d(6%, -2%, 0) skewX(8deg) scaleY(1.1); opacity: 0.6; }
    }
    @keyframes auroraDriftC {
      0%   { transform: translate3d(-5%, 2%, 0) rotate(-2deg) scaleY(1); opacity: 0.5; }
      50%  { transform: translate3d(5%, -3%, 0) rotate(2deg) scaleY(1.3); opacity: 0.85; }
      100% { transform: translate3d(-5%, 2%, 0) rotate(-2deg) scaleY(1); opacity: 0.5; }
    }
    @keyframes starTwinkle {
      0%, 100% { opacity: 0.22; }
      50%      { opacity: 0.95; }
    }
  `}</style>
);

// Star field — deterministic positions, twinkling via CSS keyframes
const StarField = ({ count = 64, dim = false }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
    {Array.from({ length: count }).map((_, i) => {
      const left = (i * 29) % 100;
      const top = ((i * 41) % 100);
      const size = i % 7 === 0 ? 2.6 : i % 3 === 0 ? 1.8 : 1.1;
      return (
        <span key={i} className="absolute rounded-full"
          style={{
            left: `${left}%`, top: `${top}%`, width: size, height: size,
            background: i % 4 === 0 ? ICE : FROST,
            opacity: dim ? 0.3 : 0.8,
            animation: `starTwinkle ${(2.6 + ((i * 13) % 5)).toFixed(1)}s ease-in-out ${(i * 0.37).toFixed(2)}s infinite`
          }} />
      );
    })}
  </div>
);

// Layered aurora curtains — blurred animated gradient bands
const AuroraCurtains = ({ compact = false }) => (
  <div className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden" aria-hidden
    style={{ height: compact ? '38%' : '62%' }}>
    <div className="absolute" style={{
      left: '-10%', right: '-10%', top: compact ? '8%' : '0%', height: '78%', borderRadius: '48%',
      background: 'linear-gradient(180deg, rgba(70,242,180,0.02) 0%, rgba(70,242,180,0.42) 42%, rgba(70,242,180,0.10) 68%, transparent 100%)',
      filter: 'blur(42px)', mixBlendMode: 'screen',
      animation: 'auroraDriftA 13s ease-in-out infinite'
    }} />
    <div className="absolute" style={{
      left: '-14%', right: '-6%', top: compact ? '2%' : '-6%', height: '70%', borderRadius: '50%',
      background: 'linear-gradient(180deg, rgba(157,123,255,0.02) 0%, rgba(157,123,255,0.38) 45%, transparent 100%)',
      filter: 'blur(48px)', mixBlendMode: 'screen',
      animation: 'auroraDriftB 17s ease-in-out infinite'
    }} />
    <div className="absolute" style={{
      left: '-8%', right: '-12%', top: compact ? '16%' : '10%', height: '64%', borderRadius: '50%',
      background: 'linear-gradient(180deg, rgba(89,184,255,0.02) 0%, rgba(89,184,255,0.34) 50%, transparent 100%)',
      filter: 'blur(52px)', mixBlendMode: 'screen',
      animation: 'auroraDriftC 21s ease-in-out infinite'
    }} />
  </div>
);

// Aurora divider ribbon used between sections
const Ribbon = () => (
  <div aria-hidden className="mx-auto h-px w-56"
    style={{
      background: `linear-gradient(90deg, transparent, ${MINT}, ${ICE}, ${VIOLET}, transparent)`,
      opacity: 0.6
    }} />
);

const SectionHead = ({ kicker, title, sub }) => (
  <motion.div variants={fadeUp} className="text-center mb-12">
    <p className="text-[11px] uppercase mb-3 flex items-center justify-center gap-2"
      style={{ letterSpacing: '0.4em', color: MINT }}>
      <Sparkles size={12} /> {kicker}
    </p>
    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: FROST }}>
      {title}
    </h2>
    {sub && <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: 'rgba(220,234,252,0.55)' }}>{sub}</p>}
    <Ribbon />
    <div className="h-10" />
  </motion.div>
);

const panel = {
  background: 'rgba(12,24,46,0.62)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(89,184,255,0.16)',
  boxShadow: '0 10px 40px rgba(2,6,18,0.5)'
};

// Hero — starry sky with animated northern lights and mountain silhouette
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24"
    style={{ background: `linear-gradient(180deg, #02050f 0%, ${SKY} 45%, ${SKY_MID} 100%)` }}>
    <StarField count={72} />
    <AuroraCurtains />
    {/* mountain silhouettes */}
    <svg className="absolute bottom-0 left-0 right-0 w-full pointer-events-none" viewBox="0 0 1440 150" preserveAspectRatio="none" aria-hidden>
      <path d="M0 150 L0 118 L120 62 L190 108 L300 40 L400 112 L470 78 L560 122 L700 30 L820 116 L920 70 L1030 124 L1120 54 L1230 110 L1330 76 L1440 126 L1440 150 Z"
        fill="#060d1d" opacity="0.95" />
      <path d="M0 150 L0 136 L180 108 L340 134 L520 96 L700 138 L900 104 L1100 140 L1280 112 L1440 134 L1440 150 Z"
        fill="#030813" />
      <path d="M660 46 L700 30 L742 48 L700 62 Z" fill="rgba(89,184,255,0.35)" />
      <path d="M270 52 L300 40 L332 54 L300 66 Z" fill="rgba(70,242,180,0.3)" />
    </svg>
    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl text-center">
      <motion.p variants={fadeUp} className="text-[11px] uppercase mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
        style={{ letterSpacing: '0.35em', color: ICE, border: '1px solid rgba(89,184,255,0.3)', background: 'rgba(89,184,255,0.06)' }}>
        <Telescope size={13} /> Under a sky of northern lights
      </motion.p>
      <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-semibold tracking-tight mb-5"
        style={{ color: '#fff', textShadow: `0 0 24px rgba(70,242,180,0.35), 0 0 60px rgba(89,184,255,0.25)` }}>
        {data.personal?.name || 'My Portfolio'}
      </motion.h1>
      {data.personal?.title && (
        <motion.p variants={fadeUp} className="text-lg md:text-2xl font-light mb-4"
          style={{ color: MINT, textShadow: '0 0 18px rgba(70,242,180,0.4)' }}>
          {data.personal.title}
        </motion.p>
      )}
      {data.personal?.tagline && (
        <motion.p variants={fadeUp} className="text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-6"
          style={{ color: 'rgba(220,234,252,0.7)' }}>
          {data.personal.tagline}
        </motion.p>
      )}
      {data.personal?.location && (
        <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] uppercase mb-10"
          style={{ letterSpacing: '0.28em', color: 'rgba(220,234,252,0.6)' }}>
          <MountainSnow size={13} style={{ color: ICE }} /> {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
        <a href="#about" className="px-7 py-3 rounded-full text-sm font-medium transition-transform hover:-translate-y-0.5"
          style={{ background: `linear-gradient(90deg, ${MINT}, ${ICE})`, color: '#04101c', boxShadow: '0 0 26px rgba(70,242,180,0.35)' }}>
          Into the night
        </a>
        <a href="#projects" className="px-7 py-3 rounded-full text-sm font-medium border transition-colors hover:bg-white/5"
          style={{ borderColor: 'rgba(89,184,255,0.4)', color: FROST }}>
          Constellations
        </a>
        <a href="#contact" className="px-7 py-3 rounded-full text-sm font-medium border transition-colors hover:bg-white/5"
          style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(220,234,252,0.8)' }}>
          Signal home
        </a>
      </motion.div>
    </motion.div>
    <motion.a href="#about" aria-label="Scroll to about" className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10"
      animate={{ y: [0, 9, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} style={{ color: ICE }}>
      <ArrowDown size={22} />
    </motion.a>
  </section>
);

// About — the observatory
const Observatory = ({ data }) => {
  const name = data.personal?.name || 'The Observer';
  const stats = [
    { icon: Orbit, label: 'Nights observed', value: data.stats?.yearsExperience },
    { icon: Zap, label: 'Signals sent', value: data.stats?.projectsCompleted },
    { icon: Waves, label: 'Fellow travelers', value: data.stats?.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="relative py-24 px-6 overflow-hidden" style={{ background: `linear-gradient(180deg, ${SKY_MID}, #050b1c)` }}>
      <StarField count={26} dim />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead kicker="First light" title="The Observatory" />
          <div className="grid md:grid-cols-[auto_1fr] gap-12 items-center">
            <motion.div variants={fadeUp} className="mx-auto md:mx-0">
              <div className="relative p-2 rounded-3xl" style={panel}>
                {data.personal?.avatar ? (
                  <img src={data.personal.avatar} alt={name} className="w-52 h-52 md:w-60 md:h-60 rounded-2xl object-cover"
                    style={{ filter: 'saturate(0.85) brightness(0.95)' }} />
                ) : (
                  <div className="w-52 h-52 md:w-60 md:h-60 rounded-2xl flex items-center justify-center"
                    style={{ background: `linear-gradient(150deg, rgba(70,242,180,0.16), rgba(89,184,255,0.14), rgba(157,123,255,0.16))` }}>
                    <span className="text-6xl font-semibold" style={{ color: FROST, textShadow: `0 0 20px rgba(89,184,255,0.5)` }}>
                      {initialsOf(name)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="text-[15px] leading-[1.9] mb-8" style={{ color: 'rgba(220,234,252,0.78)' }}>
                {data.personal?.bio || `${name} keeps this clearing reserved for a story told under open skies.`}
              </p>
              {stats.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {stats.map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl text-center" style={panel}>
                      <s.icon size={16} className="mx-auto mb-2" style={{ color: i % 2 === 0 ? MINT : ICE }} />
                      <div className="text-2xl font-semibold" style={{ color: FROST }}>{s.value}</div>
                      <div className="text-[10px] uppercase mt-1" style={{ letterSpacing: '0.18em', color: 'rgba(220,234,252,0.5)' }}>
                        {s.label}
                      </div>
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
};

// Skills — glowing light pillars
const LightPillars = ({ data }) => (
  <section id="skills" className="relative py-24 px-6 overflow-hidden" style={{ background: SKY }}>
    <StarField count={22} dim />
    <div className="max-w-4xl mx-auto relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionHead kicker="Charged particles" title="Skill Spectrum" sub="Each band glows where the light is strongest." />
        <div className="space-y-6">
          {data.skills.map((skill, i) => {
            const colors = [MINT, ICE, VIOLET];
            const c = colors[i % 3];
            return (
              <motion.div key={i} variants={fadeUp}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-medium" style={{ color: FROST }}>{skill.name}</span>
                  <span className="text-sm tabular-nums" style={{ color: c }}>{skill.level}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(220,234,252,0.08)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${c}, ${colors[(i + 1) % 3]})`, boxShadow: `0 0 12px ${c}` }}
                    initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.1, delay: (i % 3) * 0.12 }} viewport={{ once: true }} />
                </div>
                {skill.category && (
                  <p className="text-[10px] uppercase mt-1.5" style={{ letterSpacing: '0.22em', color: 'rgba(220,234,252,0.45)' }}>
                    {skill.category}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  </section>
);

// Projects — constellations
const Constellations = ({ data }) => (
  <section id="projects" className="relative py-24 px-6 overflow-hidden" style={{ background: `linear-gradient(180deg, #050b1c, ${SKY_MID})` }}>
    <StarField count={30} dim />
    <div className="max-w-6xl mx-auto relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        <SectionHead kicker="Star charts" title="Constellations" sub="Projects plotted across the sky, brightest first." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={fadeUp} whileHover={{ y: -6 }}
              className="rounded-2xl overflow-hidden"
              style={{ ...panel, borderTop: `2px solid ${[MINT, ICE, VIOLET][i % 3]}` }}>
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full h-40 object-cover"
                  style={{ filter: 'saturate(0.9) brightness(0.92)', borderBottom: '1px solid rgba(89,184,255,0.14)' }} />
              ) : (
                <div className="w-full h-40 flex items-center justify-center"
                  style={{ background: 'rgba(89,184,255,0.05)' }}>
                  <Compass size={36} style={{ color: 'rgba(89,184,255,0.5)' }} />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold tracking-tight mb-2" style={{ color: FROST }}>{project.title}</h3>
                {project.description && (
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'rgba(220,234,252,0.62)' }}>
                    {project.description}
                  </p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-[10px] px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(70,242,180,0.08)', color: MINT, border: '1px solid rgba(70,242,180,0.2)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-5 text-xs font-medium">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{ color: MINT }}>Follow the light &rarr;</a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5"
                      style={{ color: 'rgba(220,234,252,0.6)' }}>
                      <Github size={13} /> Orbit
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

// Experience — the expedition trail
const Trail = ({ data }) => (
  <section id="experience" className="relative py-24 px-6 overflow-hidden" style={{ background: SKY }}>
    <StarField count={22} dim />
    <div className="max-w-3xl mx-auto relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionHead kicker="The expedition" title="Trail Log" />
        <div className="relative pl-8 md:pl-10 space-y-11" style={{ borderLeft: '1px solid rgba(89,184,255,0.25)' }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div className="absolute -left-[37px] md:-left-[45px] top-1.5 w-4 h-4 rounded-full"
                style={{
                  background: [MINT, ICE, VIOLET][i % 3],
                  boxShadow: `0 0 14px ${[MINT, ICE, VIOLET][i % 3]}`,
                  border: '3px solid rgba(4,8,21,0.9)'
                }} />
              {exp.period && (
                <span className="inline-block mb-2 text-[10px] uppercase px-3 py-1 rounded-full"
                  style={{ letterSpacing: '0.22em', color: ICE, border: '1px solid rgba(89,184,255,0.35)' }}>
                  {exp.period}
                </span>
              )}
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight" style={{ color: FROST }}>{exp.role}</h3>
              {exp.company && <p className="text-sm italic mb-1.5" style={{ color: MINT }}>{exp.company}</p>}
              {exp.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,234,252,0.62)' }}>{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Testimonials — campfire stories
const Stories = ({ data }) => (
  <section id="testimonials" className="relative py-24 px-6 overflow-hidden" style={{ background: `linear-gradient(180deg, ${SKY_MID}, #050b1c)` }}>
    <StarField count={26} dim />
    <div className="max-w-5xl mx-auto relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionHead kicker="Around the fire" title="Voices Carried North" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp} className="p-7 rounded-2xl" style={panel}>
              <blockquote className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(220,234,252,0.78)' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(89,184,255,0.14)' }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ background: 'rgba(157,123,255,0.2)', color: VIOLET }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold" style={{ color: FROST }}>{t.name}</div>
                  {t.role && <div className="text-xs" style={{ color: 'rgba(220,234,252,0.5)' }}>{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Contact — signal home
const Signal = ({ data }) => {
  const socials = [
    { key: 'github', icon: Github, label: 'GitHub' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'twitter', icon: Twitter, label: 'Twitter' },
  ].filter(s => data.socials?.[s.key]);

  return (
    <section id="contact" className="relative py-24 px-6 overflow-hidden"
      style={{ background: `radial-gradient(800px 360px at 50% 120%, rgba(70,242,180,0.14), transparent 65%), #02050f` }}>
      <StarField count={40} />
      <AuroraCurtains compact />
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.p variants={fadeUp} className="text-[11px] uppercase mb-4" style={{ letterSpacing: '0.4em', color: MINT }}>
            Signal home
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-semibold tracking-tight mb-5"
            style={{ color: '#fff', textShadow: '0 0 30px rgba(70,242,180,0.3)' }}>
            Send a flare into the sky
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm mb-10" style={{ color: 'rgba(220,234,252,0.6)' }}>
            Collaboration, opportunity, or simply a good story — every light on the horizon gets a reply.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-8">
            {data.personal?.email && (
              <a href={`mailto:${data.personal.email}`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-medium transition-transform hover:-translate-y-0.5"
                style={{ background: `linear-gradient(90deg, ${MINT}, ${ICE})`, color: '#04101c', boxShadow: '0 0 30px rgba(70,242,180,0.4)' }}>
                <Mail size={16} /> {data.personal.email}
              </a>
            )}
            {socials.map(({ key, icon: Icon, label }) => (
              <a key={key} href={data.socials[key]} target="_blank" rel="noreferrer" aria-label={label}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border transition-colors hover:bg-white/5"
                style={{ borderColor: 'rgba(89,184,255,0.35)', color: FROST }}>
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
          <motion.p variants={fadeUp} className="text-[11px] uppercase" style={{ letterSpacing: '0.26em', color: 'rgba(220,234,252,0.4)' }}>
            &copy; {new Date().getFullYear()} {data.personal?.name || 'My Portfolio'} · Lit by the northern sky
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

// Main component
export default function AuroraSky() {
  const { portfolioData: data } = usePortfolio();

  const navItems = [
    { label: 'Observatory', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Spectrum', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Constellations', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Trail', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Stories', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Signal', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: SKY }}>
      <SkyStyles />

      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex gap-1 md:gap-2 px-4 py-2 rounded-full backdrop-blur-md max-w-[94vw] overflow-x-auto"
        style={{ background: 'rgba(4,8,21,0.66)', border: '1px solid rgba(89,184,255,0.22)' }}>
        {navItems.map(item => (
          <a key={item.href} href={item.href}
            className="whitespace-nowrap text-[11px] uppercase px-2.5 py-1 rounded-full transition-colors hover:bg-white/10"
            style={{ letterSpacing: '0.16em', color: 'rgba(220,234,252,0.8)' }}>
            {item.label}
          </a>
        ))}
      </nav>

      <Hero data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <Observatory data={data} />}
      {data.skills?.length > 0 && <LightPillars data={data} />}
      {data.projects?.length > 0 && <Constellations data={data} />}
      {data.experience?.length > 0 && <Trail data={data} />}
      {data.testimonials?.length > 0 && <Stories data={data} />}
      <Signal data={data} />
    </div>
  );
}
