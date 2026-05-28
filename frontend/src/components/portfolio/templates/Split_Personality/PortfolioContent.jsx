import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Sparkles, Github, Linkedin, Twitter, Mail,
  ExternalLink, Briefcase, Quote, Send, Code,
} from 'lucide-react';

/* ───────────────────── personality tokens ───────────────────── */
/*
 * The two sides are designed to feel like fundamentally different
 * design philosophies, not just a palette swap:
 *   DARK  → Cyberpunk / Edgy: sharp corners, neon glow, tech-grid bg
 *   LIGHT → Soft / Friendly:  ultra-rounded, glassmorphic, pastels
 */
const tokens = {
  dark: {
    bg: 'bg-[#0a0a14]',
    bgAlt: 'bg-[#0f0f1a]',
    bgCard: 'bg-[#111125]/80 backdrop-blur-sm',
    border: 'border-cyan-500/20',
    text: 'text-gray-100',
    textMuted: 'text-gray-400',
    textAccent: 'text-cyan-400',
    accent: 'cyan',
    accentBg: 'bg-cyan-500',
    accentBgSoft: 'bg-cyan-500/10',
    accentBorder: 'border-cyan-500/40',
    accentText: 'text-cyan-400',
    gradientFrom: 'from-cyan-400',
    gradientTo: 'to-fuchsia-500',
    barTrack: 'bg-gray-800',
    barFill: 'bg-gradient-to-r from-cyan-400 to-fuchsia-500',
    cardHover: 'hover:bg-[#161630]/90',
    shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.08)]',
    inputBg: 'bg-gray-900/60',
    inputBorder: 'border-cyan-500/20',
    tagBg: 'bg-cyan-500/10',
    tagText: 'text-cyan-300',
    timelineLine: 'bg-cyan-500/20',
    timelineDot: 'bg-cyan-400',
    // Shape & personality tokens
    radius: 'rounded-lg',
    radiusLg: 'rounded-xl',
    avatarFilter: 'grayscale contrast-125 brightness-90',
    avatarBorder: 'ring-2 ring-cyan-400/40',
    sectionDeco: true,  // show tech-grid background
    glowRing: 'ring-1 ring-cyan-500/20',
    cardExtra: 'border-l-2 border-l-cyan-500/50',
    headingFont: 'tracking-tight uppercase',
  },
  light: {
    bg: 'bg-[#faf9f7]',
    bgAlt: 'bg-white',
    bgCard: 'bg-white/70 backdrop-blur-md',
    border: 'border-indigo-100',
    text: 'text-gray-800',
    textMuted: 'text-gray-500',
    textAccent: 'text-indigo-500',
    accent: 'indigo',
    accentBg: 'bg-indigo-500',
    accentBgSoft: 'bg-indigo-50',
    accentBorder: 'border-indigo-200',
    accentText: 'text-indigo-500',
    gradientFrom: 'from-indigo-400',
    gradientTo: 'to-rose-400',
    barTrack: 'bg-indigo-100',
    barFill: 'bg-gradient-to-r from-indigo-400 to-rose-400',
    cardHover: 'hover:bg-indigo-50/50',
    shadow: 'shadow-[0_4px_24px_rgba(99,102,241,0.08)]',
    inputBg: 'bg-indigo-50/60',
    inputBorder: 'border-indigo-200',
    tagBg: 'bg-indigo-50',
    tagText: 'text-indigo-600',
    timelineLine: 'bg-indigo-200',
    timelineDot: 'bg-indigo-400',
    // Shape & personality tokens
    radius: 'rounded-2xl',
    radiusLg: 'rounded-3xl',
    avatarFilter: '',
    avatarBorder: 'ring-2 ring-indigo-200',
    sectionDeco: false,
    glowRing: '',
    cardExtra: '',
    headingFont: 'tracking-normal',
  },
};

/* ───────────────── animation presets ───────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ─────────────── section wrapper ─────────────── */
function Section({ children, id, t }) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${t.bg} relative overflow-hidden`}>
      {/* Tech-grid background for dark mode */}
      {t.sectionDeco && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      )}
      <div className="relative max-w-6xl mx-auto px-6 sm:px-10">{children}</div>
    </section>
  );
}

function SectionTitle({ label, title, t }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      className="mb-12 sm:mb-16"
    >
      <span className={`text-xs font-bold uppercase tracking-[0.2em] ${t.textAccent}`}>{label}</span>
      <h2 className={`text-3xl sm:text-4xl font-bold mt-2 ${t.text} ${t.headingFont}`}>{title}</h2>
      <div className={`w-16 h-1 mt-4 ${t.radius} ${t.accentBg}`} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════ */
function Hero({ data, t }) {
  const p = data.personal || {};
  const st = data.stats || {};
  return (
    <section className={`min-h-screen flex items-center ${t.bg} relative overflow-hidden`}>
      {/* Decorative blobs */}
      <div className={`absolute top-20 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 ${t.accentBg}`} />
      <div className={`absolute bottom-20 -right-40 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15 bg-fuchsia-500`} />
      {/* Tech-grid for dark side */}
      {t.sectionDeco && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-24 w-full">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col gap-8"
        >
          <motion.div variants={fadeUp} custom={0} className={`inline-flex items-center gap-2 px-4 py-1.5 ${t.radius} border ${t.accentBorder} ${t.accentBgSoft} ${t.glowRing} w-fit`}>
            <Code className={`w-3.5 h-3.5 ${t.textAccent}`} />
            <span className={`text-xs font-semibold tracking-wide ${t.textAccent}`}>{p.title || 'Developer'}</span>
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className={`text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight ${t.text}`}>
            {(p.name || 'Your Name').split(' ').map((w, i) => (
              <span key={i} className="block">
                {i === 1 ? (
                  <span className={`bg-gradient-to-r ${t.gradientFrom} ${t.gradientTo} bg-clip-text text-transparent`}>{w}</span>
                ) : w}
              </span>
            ))}
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className={`text-lg sm:text-xl max-w-xl leading-relaxed ${t.textMuted}`}>
            {p.tagline || (p.bio || 'Building the future, one line of code at a time.').substring(0, 120) + '...'}
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-6 mt-2">
            {[
              { icon: MapPin, text: p.location || 'Remote' },
              { icon: Calendar, text: `${st.yearsExperience || 0}+ Years Exp` },
              { icon: Sparkles, text: `${st.projectsCompleted || 0} Projects` },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-2 text-sm ${t.textMuted}`}>
                <item.icon className={`w-4 h-4 ${t.textAccent}`} />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════════════ */
function About({ data, t }) {
  const p = data.personal || {};
  const st = data.stats || {};
  return (
    <Section id="about" t={t}>
      <SectionTitle label="Introduction" title="About Me" t={t} />
      <div className="grid md:grid-cols-3 gap-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="md:col-span-2"
        >
          <div className={`flex items-start gap-6 p-6 sm:p-8 ${t.radiusLg} border ${t.border} ${t.bgCard} ${t.shadow} ${t.glowRing} ${t.cardExtra}`}>
            {p.avatar && (
              <img
                src={p.avatar}
                alt={p.name || 'Avatar'}
                className={`w-20 h-20 sm:w-24 sm:h-24 ${t.radiusLg} object-cover shrink-0 ${t.avatarFilter} ${t.avatarBorder} transition-all duration-500`}
              />
            )}
            <div>
              <h3 className={`text-xl font-bold mb-2 ${t.text}`}>{p.name || 'Your Name'}</h3>
              <p className={`text-sm mb-1 ${t.textAccent}`}>{p.title || 'Developer'}</p>
              <p className={`leading-relaxed mt-3 ${t.textMuted}`}>{p.bio || 'Your bio goes here.'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-col gap-4"
        >
          {[
            { label: 'Years Exp', value: `${st.yearsExperience || 0}+` },
            { label: 'Projects', value: st.projectsCompleted || 0 },
            { label: 'Happy Clients', value: st.happyClients || 0 },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className={`p-5 ${t.radius} border ${t.border} ${t.bgCard} ${t.shadow} ${t.glowRing} text-center`}
            >
              <div className={`text-2xl font-black ${t.textAccent}`}>{s.value}</div>
              <div className={`text-xs font-medium mt-1 uppercase tracking-wider ${t.textMuted}`}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   SKILLS
   ═══════════════════════════════════════════════════ */
function Skills({ data, t }) {
  const grouped = (data.skills || []).reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const categoryIcons = { Frontend: '🎨', Backend: '⚙️', DevOps: '🚀', Design: '✏️' };

  return (
    <Section id="skills" t={t}>
      <SectionTitle label="Expertise" title="Skills & Technologies" t={t} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="grid sm:grid-cols-2 gap-8"
      >
        {Object.entries(grouped).map(([category, skills], catIdx) => (
          <motion.div
            key={category}
            variants={fadeUp}
            custom={catIdx}
            className={`p-6 ${t.radiusLg} border ${t.border} ${t.bgCard} ${t.shadow} ${t.glowRing} ${t.cardExtra}`}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">{categoryIcons[category] || '📦'}</span>
              <h3 className={`font-bold ${t.text}`}>{category}</h3>
            </div>
            <div className="space-y-4">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className={`text-sm font-medium ${t.text}`}>{skill.name}</span>
                    <span className={`text-xs font-semibold ${t.textAccent}`}>
                      {Math.min(100, Math.max(0, Number(skill.level) || 0))}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${t.barTrack}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, Math.max(0, Number(skill.level) || 0))}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: catIdx * 0.15 + i * 0.08 }}
                      className={`h-full rounded-full ${t.barFill}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECTS
   ═══════════════════════════════════════════════════ */
function Projects({ data, t }) {
  return (
    <Section id="projects" t={t}>
      <SectionTitle label="Portfolio" title="Featured Projects" t={t} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="grid md:grid-cols-2 gap-8"
      >
        {(data.projects || []).map((project, idx) => (
          <motion.div
            key={idx}
            variants={fadeUp}
            custom={idx}
            whileHover={{ rotateX: -2, rotateY: 3, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ transformPerspective: 800 }}
            className={`${t.radiusLg} overflow-hidden border ${t.border} ${t.bgCard} ${t.shadow} ${t.glowRing} ${t.cardExtra} group cursor-pointer`}
          >
            {project.image && (
              <div className="overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${t.sectionDeco ? 'from-[#0a0a14]/60' : 'from-white/30'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            )}
            <div className="p-6">
              <h3 className={`text-lg font-bold mb-2 ${t.text}`}>{project.title}</h3>
              <p className={`text-sm leading-relaxed mb-4 ${t.textMuted}`}>{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(project.techStack || []).map((tech, i) => (
                  <span key={i} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${t.tagBg} ${t.tagText}`}>
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 text-xs font-semibold ${t.textAccent} hover:underline`}>
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 text-xs font-semibold ${t.textAccent} hover:underline`}>
                    <Github className="w-3.5 h-3.5" /> Source
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   EXPERIENCE
   ═══════════════════════════════════════════════════ */
function Experience({ data, t }) {
  return (
    <Section id="experience" t={t}>
      <SectionTitle label="Career" title="Work Experience" t={t} />
      <div className="relative">
        {/* Timeline line */}
        <div className={`absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 ${t.timelineLine}`} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="space-y-10"
        >
          {(data.experience || []).map((exp, idx) => (
            <motion.div key={idx} variants={fadeUp} custom={idx} className="flex gap-6 pl-2">
              {/* Dot */}
              <div className="relative flex-shrink-0">
                <div className={`w-4 h-4 rounded-full ${t.timelineDot} mt-1.5 ring-4 ${t.sectionDeco ? 'ring-[#0a0a14]' : 'ring-[#faf9f7]'}`} />
              </div>

              <div className={`flex-1 p-6 ${t.radiusLg} border ${t.border} ${t.bgCard} ${t.shadow} ${t.glowRing} ${t.cardExtra}`}>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <Briefcase className={`w-4 h-4 ${t.textAccent}`} />
                  <h3 className={`font-bold ${t.text}`}>{exp.role}</h3>
                </div>
                <p className={`text-sm font-medium mb-3 ${t.textAccent}`}>{exp.company} · {exp.period}</p>
                <p className={`text-sm leading-relaxed ${t.textMuted}`}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   TESTIMONIALS
   ═══════════════════════════════════════════════════ */
function Testimonials({ data, t }) {
  return (
    <Section id="testimonials" t={t}>
      <SectionTitle label="Kind Words" title="Testimonials" t={t} />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="grid sm:grid-cols-2 gap-8"
      >
        {(data.testimonials || []).map((test, idx) => (
          <motion.div
            key={idx}
            variants={fadeUp}
            custom={idx}
            className={`p-6 ${t.radiusLg} border ${t.border} ${t.bgCard} ${t.shadow} ${t.glowRing} ${t.cardExtra}`}
          >
            <Quote className={`w-8 h-8 mb-4 opacity-20 ${t.textAccent}`} />
            <p className={`text-sm leading-relaxed mb-6 italic ${t.textMuted}`}>"{test.text}"</p>
            <div className="flex items-center gap-3">
              {test.avatar && <img src={test.avatar} alt={test.name} className={`w-10 h-10 rounded-full object-cover ${t.avatarFilter} ${t.avatarBorder}`} />}
              <div>
                <div className={`text-sm font-bold ${t.text}`}>{test.name}</div>
                <div className={`text-xs ${t.textMuted}`}>{test.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════════════ */
function Contact({ data, t }) {
  const p = data.personal || {};
  const s = data.socials || {};
  const links = [
    s.github && { icon: Github, label: 'GitHub', url: s.github },
    s.linkedin && { icon: Linkedin, label: 'LinkedIn', url: s.linkedin },
    s.twitter && { icon: Twitter, label: 'Twitter', url: s.twitter },
    s.email && { icon: Mail, label: 'Email', url: `mailto:${s.email}` },
  ].filter(Boolean);

  return (
    <Section id="contact" t={t}>
      <SectionTitle label="Get In Touch" title="Contact" t={t} />
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <p className={`leading-relaxed mb-8 ${t.textMuted}`}>
            I'm always open to new opportunities, collaborations, and interesting projects.
            Feel free to reach out through any of these channels!
          </p>
          <div className="flex flex-wrap gap-3">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 ${t.radius} text-sm font-semibold border ${t.border} ${t.bgCard} ${t.text} ${t.cardHover} transition-colors ${t.shadow} ${t.glowRing}`}
              >
                <link.icon className={`w-4 h-4 ${t.textAccent}`} />
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
          className={`p-6 rounded-2xl border ${t.border} ${t.bgCard} ${t.shadow}`}
        >
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${t.textMuted}`}>Name</label>
              <div className={`w-full px-4 py-2.5 ${t.radius} border ${t.inputBorder} ${t.inputBg} ${t.text} text-sm`}>Your name</div>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${t.textMuted}`}>Email</label>
              <div className={`w-full px-4 py-2.5 ${t.radius} border ${t.inputBorder} ${t.inputBg} ${t.text} text-sm`}>your@email.com</div>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${t.textMuted}`}>Message</label>
              <div className={`w-full px-4 py-2.5 ${t.radius} border ${t.inputBorder} ${t.inputBg} ${t.text} text-sm h-24`}>Your message...</div>
            </div>
            <div className={`inline-flex items-center gap-2 px-6 py-2.5 ${t.radius} text-sm font-bold text-white ${t.accentBg} cursor-pointer hover:opacity-90 transition-opacity`}>
              <Send className="w-4 h-4" /> Send Message
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className={`mt-20 pt-8 border-t ${t.border} text-center`}>
        <p className={`text-sm ${t.textMuted}`}>
          © {new Date().getFullYear()} {p.name || 'Developer'}. Built with ❤️
        </p>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════ */
export default function PortfolioContent({ data, theme = 'dark' }) {
  const t = tokens[theme];
  return (
    <div className={`${t.bg} ${t.text} font-sans`}>
      <Hero data={data} t={t} />
      <About data={data} t={t} />
      <Skills data={data} t={t} />
      <Projects data={data} t={t} />
      <Experience data={data} t={t} />
      <Testimonials data={data} t={t} />
      <Contact data={data} t={t} />
    </div>
  );
}
