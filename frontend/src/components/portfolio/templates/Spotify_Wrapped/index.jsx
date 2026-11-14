import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import {
  ChevronUp, ChevronDown, MapPin, Mail, Github, Linkedin, Twitter,
  ExternalLink, Play, Quote, Sparkles, Music2, User
} from 'lucide-react';

/**
 * Spotify Wrapped Portfolio Template
 * Category: Famous UI Inspired
 * Description: Spotify Wrapped-style vertical story cards with bold gradients and animated stats. Swipe/scroll through cards showing skills, projects, and achievements.
 */

const YEAR = new Date().getFullYear();

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const popIn = {
  hidden: { opacity: 0, y: 44, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};
const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const initials = (name) =>
  (name || '').trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

const statNumber = (v) => (typeof v === 'number' && isFinite(v) ? v : null);

// Giant animated number — starts counting when it scrolls into view
function StatCounter({ value, suffix = '', className = '' }) {
  const [started, setStarted] = useState(false);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!started) return;
    const controls = animate(0, value, { duration: 1.4, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [started, value]);
  return (
    <motion.span className={className} viewport={{ once: true, amount: 0.5 }} onViewportEnter={() => setStarted(true)}>
      {n}{suffix}
    </motion.span>
  );
}

// Full-screen duotone story card
function Story({ story, active, children }) {
  return (
    <section id={story.id} className="snap-start min-h-full relative flex flex-col justify-center overflow-hidden px-6 py-20 md:py-24"
      style={{ backgroundImage: `linear-gradient(160deg, ${story.grad[0]} 0%, ${story.grad[1]} 82%)` }}>
      {/* giant watermark index */}
      <span className="absolute -bottom-10 -right-4 text-[16rem] md:text-[22rem] font-black leading-none pointer-events-none select-none"
        style={{ color: 'rgba(255,255,255,0.06)' }} aria-hidden="true">
        {story.num}
      </span>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 20% 0%, rgba(255,255,255,0.10), transparent 60%)' }} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 12 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl mx-auto">
        {children}
      </motion.div>
    </section>
  );
}

const StoryEyebrow = ({ children }) => (
  <p className="text-[11px] md:text-xs font-bold tracking-[0.4em] uppercase text-white/70 mb-4">{children}</p>
);

// ---------------- Main ----------------
export default function SpotifyWrapped() {
  const { portfolioData: data } = usePortfolio();
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  useEffect(() => { activeRef.current = active; }, [active]);

  const hasStats = [data.stats?.yearsExperience, data.stats?.projectsCompleted, data.stats?.happyClients]
    .some((v) => statNumber(v) !== null);

  // Build the story deck from available content (deploy-mode safe)
  const stories = [];
  stories.push({
    id: 'hero', num: '01', grad: ['#7b2ff7', '#12002e'],
    label: 'Your Wrapped',
  });
  if (data.personal.bio || data.personal.avatar || hasStats) {
    stories.push({ id: 'about', num: '02', grad: ['#00c9a7', '#032b23'], label: 'The Artist' });
  }
  if (data.skills?.length > 0) {
    stories.push({ id: 'skills', num: '03', grad: ['#ff5e78', '#2b0510'], label: 'Top Skills' });
  }
  if (data.projects?.length > 0) {
    stories.push({ id: 'projects', num: '04', grad: ['#38b6ff', '#041830'], label: 'Top Projects' });
  }
  if (data.experience?.length > 0) {
    stories.push({ id: 'experience', num: '05', grad: ['#ff9f1c', '#2b1400'], label: 'The Journey' });
  }
  if (data.testimonials?.length > 0) {
    stories.push({ id: 'testimonials', num: '06', grad: ['#3ddad7', '#052e2e'], label: 'Fan Reviews' });
  }
  stories.push({ id: 'contact', num: '07', grad: ['#a55eea', '#150429'], label: 'Thank You' });

  const goTo = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(stories.length - 1, i));
    el.scrollTo({ top: clamped * el.clientHeight, behavior: 'smooth' });
  };

  const goToId = (id) => {
    const idx = stories.findIndex((s) => s.id === id);
    if (idx >= 0) goTo(idx);
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientHeight <= 0) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setActive(Math.max(0, Math.min(stories.length - 1, idx)));
  };

  // Arrow-key story navigation, like skipping tracks
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(activeRef.current + 1); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(activeRef.current - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stories.length]);

  const topSkills = [...data.skills].sort((a, b) => (b.level || 0) - (a.level || 0)).slice(0, 6);
  const stats = [
    { label: 'Years Experience', value: statNumber(data.stats?.yearsExperience), suffix: '+' },
    { label: 'Projects Completed', value: statNumber(data.stats?.projectsCompleted), suffix: '+' },
    { label: 'Happy Clients', value: statNumber(data.stats?.happyClients), suffix: '+' },
  ].filter((s) => s.value !== null);

  return (
    <div className="relative h-screen overflow-hidden bg-[#121212] font-sans antialiased text-white">
      {/* Story progress segments */}
      <div className="absolute top-0 inset-x-0 z-40 flex gap-1.5 p-4">
        {stories.map((s, i) => (
          <button key={s.id} aria-label={`Go to ${s.label}`} onClick={() => goTo(i)}
            className="h-1 flex-1 rounded-full overflow-hidden bg-white/20">
            <motion.div className="h-full bg-white rounded-full"
              initial={false}
              animate={{ width: i <= active ? '100%' : '0%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }} />
          </button>
        ))}
      </div>
      {/* Story counter */}
      <div className="absolute top-8 right-4 z-40 text-[11px] font-bold tracking-[0.3em] text-white/60 bg-black/40 rounded-full px-3 py-1 backdrop-blur-sm">
        {String(active + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}
      </div>
      {/* Prev / next story buttons */}
      <div className="absolute bottom-5 right-4 z-40 flex flex-col gap-2">
        <button onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous story"
          className="w-10 h-10 rounded-full bg-black/45 border border-white/20 flex items-center justify-center backdrop-blur-sm disabled:opacity-30 hover:bg-black/70 transition-colors">
          <ChevronUp size={18} />
        </button>
        <button onClick={() => goTo(active + 1)} disabled={active === stories.length - 1} aria-label="Next story"
          className="w-10 h-10 rounded-full bg-black/45 border border-white/20 flex items-center justify-center backdrop-blur-sm disabled:opacity-30 hover:bg-black/70 transition-colors">
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Scroll-snap story deck */}
      <div ref={scrollerRef} onScroll={handleScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

        {/* STORY 1 — Intro */}
        <Story story={stories[0]} active={active === 0}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}><StoryEyebrow>Your {YEAR} Wrapped</StoryEyebrow></motion.div>
            <motion.h1 variants={popIn} className="text-6xl md:text-8xl font-black uppercase leading-[0.95] mb-6"
              style={{ textShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
              {data.personal.name || 'My Portfolio'}
            </motion.h1>
            {data.personal.title && (
              <motion.p variants={fadeUp} className="text-xl md:text-3xl font-bold mb-2 text-white/90">{data.personal.title}</motion.p>
            )}
            {data.personal.tagline && (
              <motion.p variants={fadeUp} className="text-white/70 md:text-lg mb-3 max-w-xl">{data.personal.tagline}</motion.p>
            )}
            {data.personal.location && (
              <motion.p variants={fadeUp} className="text-white/55 text-sm flex items-center gap-1.5 mb-8">
                <MapPin size={14} /> {data.personal.location}
              </motion.p>
            )}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {stories.some((s) => s.id === 'about') && (
                <a href="#about" onClick={(e) => { e.preventDefault(); goToId('about'); }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition-transform">
                  <Play size={14} fill="currentColor" /> Play the Recap
                </a>
              )}
              {stories.some((s) => s.id === 'projects') && (
                <a href="#projects" onClick={(e) => { e.preventDefault(); goToId('projects'); }}
                  className="px-5 py-2.5 rounded-full border border-white/40 text-white text-sm font-bold hover:bg-white/10 transition-colors">
                  Skip to Projects
                </a>
              )}
              <a href="#contact" onClick={(e) => { e.preventDefault(); goToId('contact'); }}
                className="px-5 py-2.5 rounded-full border border-white/40 text-white text-sm font-bold hover:bg-white/10 transition-colors">
                Finale
              </a>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-10 text-white/40 text-xs tracking-[0.3em] uppercase flex items-center gap-2">
              Scroll or swipe to begin <ChevronDown size={14} />
            </motion.p>
          </motion.div>
        </Story>

        {/* STORY 2 — The Artist (about) */}
        {stories.some((s) => s.id === 'about') && (
          <Story story={stories.find((s) => s.id === 'about')} active={active === 1}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={stagger}>
              <motion.div variants={fadeUp}><StoryEyebrow>The Artist of {YEAR}</StoryEyebrow></motion.div>
              <motion.h2 variants={popIn} className="text-5xl md:text-7xl font-black uppercase leading-none mb-8">
                {data.personal.name || 'About'}
              </motion.h2>
              <motion.div variants={stagger} className="flex flex-col md:flex-row gap-8 items-start">
                <motion.div variants={fadeUp} className="shrink-0">
                  {data.personal.avatar
                    ? <img src={data.personal.avatar} alt={data.personal.name || 'Portrait'}
                        className="w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover border-4 border-white/30 shadow-2xl" />
                    : <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl border-4 border-white/30 bg-black/30 flex items-center justify-center text-5xl font-black tracking-widest text-white/80">
                        {initials(data.personal.name)}
                      </div>}
                </motion.div>
                <motion.div variants={fadeUp} className="flex-1">
                  {data.personal.bio && <p className="text-white/85 text-lg leading-relaxed mb-6 max-w-2xl">{data.personal.bio}</p>}
                  {stats.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 max-w-xl">
                      {stats.map((s, i) => (
                        <div key={i} className="rounded-2xl bg-black/30 border border-white/15 p-4 backdrop-blur-sm">
                          <StatCounter value={s.value} suffix={s.suffix} className="block text-4xl md:text-5xl font-black text-white" />
                          <div className="text-[10px] tracking-widest uppercase text-white/60 mt-1">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </Story>
        )}

        {/* STORY 3 — Top Skills */}
        {stories.some((s) => s.id === 'skills') && (
          <Story story={stories.find((s) => s.id === 'skills')}
            active={active === stories.findIndex((s) => s.id === 'skills')}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.25 }} variants={stagger}>
              <motion.div variants={fadeUp} className="flex items-center gap-2">
                <Music2 size={16} className="text-white/70" />
                <StoryEyebrow>Your Top Skills This Year</StoryEyebrow>
              </motion.div>
              <motion.h2 variants={popIn} className="text-5xl md:text-7xl font-black uppercase leading-none mb-10">
                Heavy Rotation
              </motion.h2>
              <motion.div variants={stagger} className="space-y-4">
                {topSkills.map((skill, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-4">
                    <span className="text-4xl md:text-5xl font-black w-14 shrink-0" style={{ color: 'rgba(255,255,255,0.85)' }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="font-bold text-lg truncate">{skill.name}</span>
                        <span className="text-sm font-bold text-white/70">{skill.level || 85}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-black/40 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-white"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level || 85}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.08, ease: 'easeOut' }} />
                      </div>
                    </div>
                    <StatCounter value={skill.level || 85} className="text-3xl md:text-4xl font-black w-16 text-right shrink-0 hidden sm:block" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Story>
        )}

        {/* STORY 4 — Top Projects */}
        {stories.some((s) => s.id === 'projects') && (
          <Story story={stories.find((s) => s.id === 'projects')}
            active={active === stories.findIndex((s) => s.id === 'projects')}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={stagger}>
              <motion.div variants={fadeUp}><StoryEyebrow>On Repeat — Top Projects</StoryEyebrow></motion.div>
              <motion.h2 variants={popIn} className="text-5xl md:text-7xl font-black uppercase leading-none mb-10">
                The Demos
              </motion.h2>
              <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-5">
                {data.projects.slice(0, 4).map((project, i) => (
                  <motion.article key={i} variants={fadeUp}
                    className="rounded-2xl bg-black/35 border border-white/15 overflow-hidden backdrop-blur-sm hover:bg-black/50 transition-colors">
                    <div className="relative h-36 overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      {project.image
                        ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Sparkles size={34} className="text-white/30" /></div>}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-[10px] font-bold tracking-[0.2em] uppercase border border-white/20">
                        #{i + 1}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1.5 truncate">{project.title}</h3>
                      {project.description && <p className="text-white/65 text-sm leading-snug line-clamp-2 mb-3">{project.description}</p>}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(project.techStack || []).slice(0, 4).map((tech, j) => (
                          <span key={j} className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold">{tech}</span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        {project.liveUrl && project.liveUrl !== '#' && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold hover:underline">
                            <ExternalLink size={12} /> Live
                          </a>
                        )}
                        {project.githubUrl && project.githubUrl !== '#' && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-white/60 hover:text-white">
                            <Github size={12} /> Code
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </motion.div>
          </Story>
        )}

        {/* STORY 5 — The Journey (experience) */}
        {stories.some((s) => s.id === 'experience') && (
          <Story story={stories.find((s) => s.id === 'experience')}
            active={active === stories.findIndex((s) => s.id === 'experience')}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.25 }} variants={stagger}>
              <motion.div variants={fadeUp}><StoryEyebrow>Your Listening History</StoryEyebrow></motion.div>
              <motion.h2 variants={popIn} className="text-5xl md:text-7xl font-black uppercase leading-none mb-10">
                The Journey
              </motion.h2>
              <motion.div variants={stagger} className="space-y-4 max-w-3xl">
                {data.experience.map((exp, i) => (
                  <motion.div key={i} variants={fadeUp}
                    className="flex gap-4 rounded-2xl bg-black/30 border border-white/15 p-5 backdrop-blur-sm">
                    <span className="text-2xl md:text-3xl font-black shrink-0 w-10" style={{ color: 'rgba(255,255,255,0.5)' }}>{i + 1}</span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/60">{exp.period || 'UNDATED'}</span>
                      <h3 className="font-bold text-lg leading-tight mt-0.5">{exp.role}</h3>
                      {exp.company && <p className="text-white/70 text-sm font-semibold">{exp.company}</p>}
                      {exp.description && <p className="text-white/60 text-sm leading-snug line-clamp-2 mt-1">{exp.description}</p>}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Story>
        )}

        {/* STORY 6 — Fan Reviews (testimonials) */}
        {stories.some((s) => s.id === 'testimonials') && (
          <Story story={stories.find((s) => s.id === 'testimonials')}
            active={active === stories.findIndex((s) => s.id === 'testimonials')}>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.25 }} variants={stagger}>
              <motion.div variants={fadeUp} className="flex items-center gap-2">
                <User size={16} className="text-white/70" />
                <StoryEyebrow>What the Fans Said</StoryEyebrow>
              </motion.div>
              <motion.h2 variants={popIn} className="text-5xl md:text-7xl font-black uppercase leading-none mb-10">
                Top Fans
              </motion.h2>
              <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5 max-w-3xl">
                {data.testimonials.slice(0, 4).map((t, i) => (
                  <motion.blockquote key={i} variants={fadeUp}
                    className="rounded-2xl bg-black/30 border border-white/15 p-5 backdrop-blur-sm">
                    <Quote size={18} className="text-white/50 mb-3" />
                    <p className="text-white/85 text-sm leading-relaxed italic mb-4">“{t.text}”</p>
                    <footer className="flex items-center gap-3">
                      {t.avatar
                        ? <img src={t.avatar} alt={t.name || 'Fan'} className="w-9 h-9 rounded-full object-cover border-2 border-white/30" />
                        : <div className="w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-[11px] font-black">{initials(t.name)}</div>}
                      <div>
                        <div className="text-sm font-bold">{t.name}</div>
                        {t.role && <div className="text-[11px] text-white/60">{t.role}</div>}
                      </div>
                    </footer>
                  </motion.blockquote>
                ))}
              </motion.div>
            </motion.div>
          </Story>
        )}

        {/* STORY 7 — Thank You (contact + footer) */}
        <Story story={stories[stories.length - 1]} active={active === stories.length - 1}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={stagger} className="text-center">
            <motion.div variants={fadeUp}><StoryEyebrow>That's a Wrap on {YEAR}</StoryEyebrow></motion.div>
            <motion.h2 variants={popIn} className="text-5xl md:text-8xl font-black uppercase leading-[0.95] mb-6">
              Thank You for Watching
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 md:text-lg mb-10 max-w-lg mx-auto">
              {data.personal.name ? `${data.personal.name}'s` : 'This'} story never stops streaming — let's make the next chapter together.
            </motion.p>
            <motion.div variants={stagger} className="flex flex-wrap justify-center gap-3 mb-14">
              {data.socials.email && (
                <motion.a variants={fadeUp} href={`mailto:${data.socials.email}`}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:scale-105 transition-transform">
                  <Mail size={16} /> Email Me
                </motion.a>
              )}
              {data.socials.github && (
                <motion.a variants={fadeUp} href={data.socials.github} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/40 font-bold text-sm hover:bg-white/10 transition-colors">
                  <Github size={16} /> GitHub
                </motion.a>
              )}
              {data.socials.linkedin && (
                <motion.a variants={fadeUp} href={data.socials.linkedin} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/40 font-bold text-sm hover:bg-white/10 transition-colors">
                  <Linkedin size={16} /> LinkedIn
                </motion.a>
              )}
              {data.socials.twitter && (
                <motion.a variants={fadeUp} href={data.socials.twitter} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/40 font-bold text-sm hover:bg-white/10 transition-colors">
                  <Twitter size={16} /> Twitter
                </motion.a>
              )}
            </motion.div>
            <motion.p variants={fadeUp} className="text-[11px] tracking-[0.3em] uppercase text-white/40">
              © {new Date().getFullYear()} {data.personal.name || 'Portfolio'} · Spotify Wrapped Stories
            </motion.p>
          </motion.div>
        </Story>
      </div>
    </div>
  );
}
