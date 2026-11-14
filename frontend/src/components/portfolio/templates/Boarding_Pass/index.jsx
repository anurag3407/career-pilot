import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Plane, PlaneTakeoff, PlaneLanding, Ticket as TicketIcon, Luggage, MapPin, Calendar,
  Mail, Github, Linkedin, Twitter, ExternalLink, ChevronDown, Radio
} from 'lucide-react';

/**
 * Boarding Pass Portfolio Template
 * Category: Unique / Creative
 * Description: Aviation boarding pass layout where each project is a flight. Departure = tech stack, Arrival = live site. Boarding pass tear-off stub design with barcodes.
 */

const NAVY = '#0b1733';
const NAVY_PANEL = '#101f42';
const RED = '#e02d3c';
const PAPER = '#f7f2e7';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const initialsOf = (name) =>
  (name || '').trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

/* ---------- Decorative bits ---------- */

const Barcode = ({ seed, barClass = 'bg-[#101c3a]', className = '' }) => (
  <div className={`flex items-stretch gap-[2px] h-9 ${className}`} aria-hidden="true">
    {Array.from({ length: 30 }).map((_, j) => (
      <div key={j} className={barClass}
        style={{ width: `${((seed * 7 + j * 13) % 3) + 1}px`, opacity: j % 6 === 0 ? 0.95 : 0.78 }} />
    ))}
  </div>
);

const Monogram = ({ name, className = '' }) => (
  <div className={`flex items-center justify-center rounded-full bg-[#e02d3c] text-white font-bold ${className}`}>
    {initialsOf(name) || <Plane size={18} />}
  </div>
);

const RadarRings = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {[34, 26, 18].map((s) => (
        <div key={s} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]"
          style={{ width: `${s}rem`, height: `${s}rem` }} />
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full"
        style={{ background: 'conic-gradient(from 0deg, rgba(224,45,60,0.12), transparent 22%)' }} />
    </div>
  </div>
);

const RunwayStrip = () => (
  <div className="relative h-8 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-4 border-dashed border-white/20" />
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-white/10 translate-y-2" />
  </div>
);

/* ---------- Hero ---------- */

const Hero = ({ p }) => {
  const flightNo = `CA-${100 + ((p.name.length * 37) % 900)}`;
  const seat = `${(p.name.length % 30) + 1}${'ABCDEF'[p.name.length % 6]}`;
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const Field = ({ label, value, red = false }) => (
    <div>
      <div className="text-[9px] font-bold tracking-[0.25em] text-slate-400">{label}</div>
      <div className={`text-sm font-bold truncate ${red ? 'text-[#e02d3c]' : 'text-slate-900'}`}>{value || '—'}</div>
    </div>
  );

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060d1f 0%, #0b1733 55%, #12275c 100%)' }}>
      <RadarRings />
      <motion.div className="relative z-10 w-full max-w-2xl" initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-slate-200 text-xs font-semibold tracking-[0.3em] uppercase">
            <MapPin size={13} className="text-[#ff6b78]" /> {p.location || 'Worldwide'}
          </span>
        </motion.div>

        {/* The passenger boarding pass */}
        <motion.div variants={fadeUp} className="rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: PAPER }}>
          <div className="flex items-center justify-between px-6 py-3" style={{ backgroundColor: RED }}>
            <span className="flex items-center gap-2 text-white text-xs font-bold tracking-[0.3em] uppercase">
              <TicketIcon size={15} /> Boarding Pass
            </span>
            <span className="text-white/90 text-[10px] font-semibold tracking-[0.25em] uppercase">Portfolio Airlines</span>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[9px] font-bold tracking-[0.25em] text-slate-400">Passenger</div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 truncate">{p.name}</h1>
                <p className="text-sm text-slate-500 mt-1 truncate">{p.title || 'Freelance Professional'}</p>
              </div>
              {p.avatar
                ? <img src={p.avatar} alt={p.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#e02d3c]/40 shrink-0" />
                : <Monogram name={p.name} className="w-16 h-16 text-xl shrink-0 border-2 border-[#e02d3c]/40" />}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-dashed border-slate-300">
              <Field label="Flight" value={flightNo} red />
              <Field label="Seat" value={seat} />
              <Field label="Date" value={today} />
              <Field label="From" value={p.location || 'Home Base'} />
              <Field label="To" value="New Heights" />
              <Field label="Class" value="First" />
            </div>
            <Barcode seed={p.name.length + 3} className="mt-6" />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap mt-8">
          <a href="#projects" className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-lg transition-all hover:brightness-110"
            style={{ backgroundColor: RED }}>
            <PlaneTakeoff size={16} /> View Flights
          </a>
          <a href="#contact" className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-white/25 text-slate-200 hover:bg-white/10 transition-all">
            <Radio size={16} /> Contact Control Tower
          </a>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-6 text-white/50 z-10" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <ChevronDown size={26} />
      </motion.div>
    </section>
  );
};

/* ---------- About ---------- */

const About = ({ p, stats }) => {
  const hasStats = stats && (stats.yearsExperience || stats.projectsCompleted || stats.happyClients);
  if (!p.bio && !p.avatar && !hasStats) return null;
  const statItems = [
    { label: 'Flight Hours', value: stats?.yearsExperience },
    { label: 'Missions Flown', value: stats?.projectsCompleted },
    { label: 'Happy Passengers', value: stats?.happyClients },
  ].filter((s) => s.value);

  return (
    <section id="about" className="py-24 px-6" style={{ backgroundColor: PAPER }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
          className="grid md:grid-cols-[auto,1fr] gap-10 items-center">
          <motion.div variants={fadeUp} className="mx-auto">
            {p.avatar
              ? <img src={p.avatar} alt={p.name} className="w-56 h-56 rounded-2xl object-cover shadow-xl border-4 border-white" />
              : <Monogram name={p.name} className="w-56 h-56 text-6xl border-4 border-white shadow-xl" />}
            <div className="mt-4 mx-auto w-max px-3 py-1 rounded bg-[#101c3a] text-white text-[10px] font-bold tracking-[0.3em] uppercase">
              Crew ID · {initialsOf(p.name) || 'CA'}
            </div>
          </motion.div>
          <motion.div variants={fadeUp}>
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#e02d3c]">Passenger Profile</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">The Captain</h2>
            {p.bio && <p className="text-slate-600 leading-relaxed mb-6 max-w-xl">{p.bio}</p>}
            {hasStats && (
              <div className="flex flex-wrap gap-3">
                {statItems.map((s, i) => (
                  <div key={i} className="px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm min-w-[120px]">
                    <div className="text-2xl font-extrabold text-[#101c3a]">{s.value}{Number.isFinite(+s.value) ? '+' : ''}</div>
                    <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Skills (baggage tags) ---------- */

const Skills = ({ skills }) => {
  if (!skills?.length) return null;
  return (
    <section id="skills" className="py-24 px-6" style={{ backgroundColor: NAVY }}>
      <RunwayStrip />
      <div className="max-w-5xl mx-auto pt-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-[#ff6b78]">
              <Luggage size={15} /> Baggage Claim
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2">Certified Equipment</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-5">
            {skills.map((s, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}>
                <div className="relative w-44 rounded-xl rounded-l-md p-4 pl-8 shadow-lg border-2"
                  style={{ backgroundColor: PAPER, borderColor: i % 2 === 0 ? NAVY : RED, transform: `rotate(${((i * 37) % 7) - 3}deg)` }}>
                  <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-[#0b1733]" style={{ borderColor: '#cbd5e1' }} />
                  <div className="text-[9px] font-bold tracking-[0.25em] uppercase" style={{ color: i % 2 === 0 ? '#5b6b8c' : RED }}>
                    Tag {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="font-bold text-slate-900 leading-tight mt-0.5">{s.name}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: i % 2 === 0 ? NAVY : RED }}
                      initial={{ width: 0 }} whileInView={{ width: `${s.level || 85}%` }}
                      viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.06 }} />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1.5 font-semibold uppercase tracking-wider">
                    Wt {s.level || 85}kg{s.category ? ` · ${s.category}` : ''}
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

/* ---------- Projects (stacked flight tickets) ---------- */

const Ticket = ({ project, i }) => {
  const tech = Array.isArray(project.techStack) ? project.techStack : [];
  const dep = tech[0] || 'DEV';
  const arr = project.liveUrl && project.liveUrl !== '#' ? 'LIVE' : 'CODE';
  return (
    <motion.article variants={fadeUp} whileHover={{ y: -4 }}
      className="relative flex flex-col md:flex-row rounded-xl shadow-2xl"
      style={{ backgroundColor: PAPER }}>
      {/* Main ticket body */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: RED }}>
            Flight BP-{String(i + 1).padStart(3, '0')}
          </span>
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-slate-400">Non-stop · On time</span>
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{project.title}</h3>
        {project.description && <p className="text-sm text-slate-600 leading-relaxed mt-2 max-w-xl">{project.description}</p>}

        <div className="flex items-center gap-4 mt-5">
          <div className="text-center">
            <div className="text-[9px] font-bold tracking-[0.25em] text-slate-400">DEP</div>
            <div className="text-xl font-extrabold text-slate-900 max-w-[120px] truncate">{dep}</div>
          </div>
          <div className="flex-1 relative h-px border-t-2 border-dashed border-slate-300 min-w-[60px]">
            <Plane size={16} className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#e02d3c] rotate-90" />
          </div>
          <div className="text-center">
            <div className="text-[9px] font-bold tracking-[0.25em] text-slate-400">ARR</div>
            <div className="text-xl font-extrabold text-[#e02d3c] max-w-[120px]">{arr}</div>
          </div>
        </div>

        {tech.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {tech.map((t, j) => (
              <span key={j} className="px-2.5 py-1 rounded-full text-xs font-semibold text-[#101c3a] bg-white border border-slate-200">
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-5">
          {project.liveUrl && project.liveUrl !== '#' && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white px-4 py-2 rounded-full transition-all hover:brightness-110"
              style={{ backgroundColor: RED }}>
              <ExternalLink size={14} /> Arrive
            </a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#101c3a] px-4 py-2 rounded-full border-2 border-[#101c3a]/20 hover:border-[#101c3a]/50 transition-all">
              <Github size={14} /> Manifest
            </a>
          )}
        </div>
      </div>

      {/* Tear-off stub */}
      <div className="relative md:w-52 shrink-0 border-t-2 border-dashed md:border-t-0 md:border-l-2 border-slate-300 p-4 flex md:flex-col items-center justify-between gap-3 rounded-b-xl md:rounded-b-none md:rounded-r-xl">
        <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full" style={{ backgroundColor: NAVY }} />
        <div className="absolute -right-3 -top-3 md:right-auto md:-top-3 md:top-auto md:-bottom-3 w-6 h-6 rounded-full" style={{ backgroundColor: NAVY }} />
        <div className="text-center md:text-left">
          <div className="text-[9px] font-bold tracking-[0.25em] text-slate-400">Gate</div>
          <div className="text-lg font-extrabold text-slate-900">G{String((i * 7) % 24 + 1).padStart(2, '0')}</div>
          <div className="text-[9px] font-bold tracking-[0.25em] text-slate-400 mt-2">Boarding</div>
          <div className="text-sm font-bold" style={{ color: RED }}>{['09:40', '11:15', '13:50', '16:05'][i % 4]}</div>
        </div>
        <div className="md:mt-auto md:w-full">
          <Barcode seed={i * 31 + 11} barClass="bg-slate-800" className="h-8" />
          <div className="text-[8px] font-bold tracking-[0.35em] text-slate-400 mt-2 uppercase hidden md:block">Keep this stub</div>
        </div>
      </div>
    </motion.article>
  );
};

const Projects = ({ projects }) => {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="py-24 px-6" style={{ backgroundColor: NAVY }}>
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="space-y-8">
          <motion.div variants={fadeUp} className="text-center mb-4">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-[#ff6b78]">
              <PlaneTakeoff size={15} /> Departures
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2">Flight Schedule</h2>
            <p className="text-slate-400 text-sm mt-2">Every project is a flight. Departure = the stack, arrival = the live site.</p>
          </motion.div>
          {projects.map((project, i) => <Ticket key={i} project={project} i={i} />)}
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Experience (flight logbook) ---------- */

const Experience = ({ experience }) => {
  if (!experience?.length) return null;
  return (
    <section id="experience" className="py-24 px-6" style={{ backgroundColor: PAPER }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-[#e02d3c]">
              <Calendar size={15} /> Flight Logbook
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Career Route</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 border-l-2 border-dashed border-slate-300" />
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="relative pl-14 pb-10 last:pb-0">
                <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-[#e02d3c]/50 shadow flex items-center justify-center">
                  <Plane size={16} className="text-[#e02d3c] rotate-90" style={{ transform: `rotate(${45 + ((i % 2) * 45)}deg)` }} />
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 rounded border-2 border-dashed border-[#e02d3c]/50 text-[10px] font-bold tracking-widest uppercase text-[#e02d3c]"
                      style={{ transform: `rotate(${((i * 37) % 5) - 2}deg)` }}>
                      {exp.period || 'EN ROUTE'}
                    </span>
                    <h3 className="font-extrabold text-slate-900">{exp.role}</h3>
                    <span className="text-sm font-semibold text-slate-500">· {exp.company}</span>
                  </div>
                  {exp.description && <p className="text-sm text-slate-600 leading-relaxed mt-2">{exp.description}</p>}
                </div>
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
    <section id="testimonials" className="py-24 px-6" style={{ backgroundColor: NAVY_PANEL }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-[#ff6b78]">
              <Radio size={15} /> Tower Feedback
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2">Passenger Reviews</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-xl p-6 shadow-lg relative"
                style={{ backgroundColor: PAPER, transform: `rotate(${((i * 29) % 5) - 2}deg)` }}>
                <span className="absolute top-3 right-4 text-5xl leading-none font-black" style={{ color: 'rgba(224,45,60,0.18)' }}>"</span>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-5">{t.text}</p>
                <div className="flex items-center gap-3 border-t border-dashed border-slate-300 pt-4">
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-[#e02d3c]/40" />
                    : <Monogram name={t.name} className="w-10 h-10 text-xs" />}
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 text-sm truncate">{t.name}</div>
                    <div className="text-xs text-slate-500 truncate">{t.role}</div>
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
    <section id="contact" className="py-24 px-6" style={{ background: 'linear-gradient(180deg, #101f42 0%, #060d1f 100%)' }}>
      <div className="max-w-2xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] uppercase text-[#ff6b78]">
              <PlaneLanding size={15} /> Final Call
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2">Contact Control Tower</h2>
            <p className="text-slate-400 mt-3">Ready for the next departure? The tower is standing by.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex justify-center gap-3 flex-wrap">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-all hover:brightness-110"
                style={{ backgroundColor: RED }}>
                <Mail size={17} /> Email the Captain
              </a>
            )}
            {p.phone && (
              <a href={`tel:${p.phone}`} className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold border border-white/25 text-slate-200 hover:bg-white/10 transition-all">
                {p.phone}
              </a>
            )}
            {links.map(({ url, label, Icon }) => (
              <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:border-[#ff6b78] transition-all">
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Main ---------- */

export default function BoardingPass() {
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

  const navItems = ['About', 'Skills', 'Flights', 'Logbook', 'Contact'];
  const navTargets = ['#about', '#skills', '#projects', '#experience', '#contact'];

  return (
    <div className="font-sans antialiased" style={{ backgroundColor: NAVY }}>
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b border-white/10" style={{ backgroundColor: 'rgba(6,13,31,0.9)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <a href="#hero" className="flex items-center gap-2 text-white font-bold tracking-widest uppercase text-xs shrink-0">
            <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: RED }}>
              <Plane size={14} />
            </span>
            Portfolio Air
          </a>
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto">
            {navItems.map((item, i) => (
              <a key={item} href={navTargets[i]}
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 hover:text-[#ff6b78] transition-colors whitespace-nowrap">
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Hero p={p} />
      <About p={p} stats={stats} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Testimonials testimonials={testimonials} />
      <Contact p={p} socials={socials} />

      <footer className="py-8 px-6 text-center border-t border-white/10" style={{ backgroundColor: '#060d1f' }}>
        <Barcode seed={year} barClass="bg-white/30" className="h-6 justify-center mx-auto mb-4 w-max" />
        <p className="text-slate-500 text-xs tracking-wider">© {year} {p.name} · Boarding Pass Portfolio</p>
      </footer>
    </div>
  );
}
