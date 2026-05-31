import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Github, Linkedin, Twitter, Mail, MapPin,
  Star, Briefcase, User, Code, MessageSquare,
  Phone, ChevronRight, ExternalLink
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

const DOORS = [
  { number: 1,  section: "hero",         label: "👋 Welcome",      color: "from-red-600 to-red-800" },
  { number: 2,  section: "about",        label: "🧑 About",         color: "from-green-600 to-green-800" },
  { number: 3,  section: "stats",        label: "📊 Stats",         color: "from-blue-600 to-blue-800" },
  { number: 4,  section: "skills",       label: "⚡ Skills",        color: "from-purple-600 to-purple-800" },
  { number: 5,  section: "projects",     label: "🚀 Projects",      color: "from-yellow-600 to-yellow-800" },
  { number: 6,  section: "experience",   label: "💼 Experience",    color: "from-pink-600 to-pink-800" },
  { number: 7,  section: "testimonials", label: "💬 Reviews",       color: "from-indigo-600 to-indigo-800" },
  { number: 8,  section: "contact",      label: "📬 Contact",       color: "from-teal-600 to-teal-800" },
  { number: 9,  section: "hero",         label: "🎄 Surprise!",     color: "from-red-700 to-green-700" },
  { number: 10, section: "about",        label: "🌟 Fun Facts",     color: "from-amber-600 to-orange-700" },
  { number: 11, section: "skills",       label: "🛠️ Tools",         color: "from-cyan-600 to-cyan-800" },
  { number: 12, section: "projects",     label: "🎯 Work",          color: "from-rose-600 to-rose-800" },
  { number: 13, section: "experience",   label: "📅 Timeline",      color: "from-violet-600 to-violet-800" },
  { number: 14, section: "testimonials", label: "⭐ Praise",        color: "from-lime-600 to-lime-800" },
  { number: 15, section: "contact",      label: "🤝 Connect",       color: "from-sky-600 to-sky-800" },
  { number: 16, section: "stats",        label: "🏆 Wins",          color: "from-emerald-600 to-emerald-800" },
  { number: 17, section: "projects",     label: "💡 Ideas",         color: "from-fuchsia-600 to-fuchsia-800" },
  { number: 18, section: "skills",       label: "📚 Stack",         color: "from-orange-600 to-orange-800" },
  { number: 19, section: "experience",   label: "🏢 Companies",     color: "from-red-600 to-pink-700" },
  { number: 20, section: "contact",      label: "📧 Email",         color: "from-green-700 to-teal-700" },
  { number: 21, section: "hero",         label: "🎁 Gift",          color: "from-red-800 to-red-600" },
  { number: 22, section: "about",        label: "🌍 Location",      color: "from-blue-700 to-indigo-700" },
  { number: 23, section: "testimonials", label: "💝 Thanks",        color: "from-pink-700 to-rose-600" },
  { number: 24, section: "contact",      label: "🎅 Ho Ho Ho!",     color: "from-red-700 to-green-800" },
];

// ── Snowflakes ──────────────────────────────────────────────────────────────
const Snowflakes = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-white text-opacity-60 select-none"
        style={{ left: `${Math.random() * 100}%`, top: "-20px", fontSize: `${Math.random() * 16 + 8}px` }}
        animate={{ y: "110vh", rotate: 360, opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: Math.random() * 8 + 6, repeat: Infinity, delay: Math.random() * 10, ease: "linear" }}
      >
        ❄
      </motion.div>
    ))}
  </div>
);

// ── Door Component ───────────────────────────────────────────────────────────
const Door = ({ door, isOpen, onClick }) => (
  <motion.div
    className="relative cursor-pointer"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => onClick(door)}
    onKeyDown={(e) => e.key === 'Enter' && onClick(door)}
    role="button"
    tabIndex={0}
    aria-label={`Open door ${door}`}
  >
    <div className={`relative h-24 sm:h-28 rounded-xl bg-gradient-to-br ${door.color} border-2 border-white/20 shadow-lg overflow-hidden`}>
      {/* Wood texture lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-1 bg-white absolute left-1/3" />
        <div className="h-full w-1 bg-white absolute left-2/3" />
      </div>

      {/* Door number */}
      <div className="absolute top-2 left-3 text-white/80 text-xs font-bold">{door.number}</div>

      {/* Star decoration */}
      {isOpen && (
        <div className="absolute top-2 right-2">
          <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
        </div>
      )}

      {/* Door content */}
      <div className="flex items-center justify-center h-full">
        {isOpen ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-center px-2"
          >
            <div className="text-2xl mb-1">{door.label.split(" ")[0]}</div>
            <div className="text-white text-xs font-semibold opacity-90">{door.label.split(" ").slice(1).join(" ")}</div>
          </motion.div>
        ) : (
          <div className="text-center">
            <div className="text-3xl font-bold text-white/90">{door.number}</div>
            <div className="text-white/50 text-xs mt-1">Click to open</div>
          </div>
        )}
      </div>

      {/* Knob */}
      {!isOpen && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400 shadow" />
      )}
    </div>
  </motion.div>
);

// ── Modal Sections ───────────────────────────────────────────────────────────
const HeroContent = () => (
  <div className="text-center py-4">
    <img src={data.personal.avatar} alt={data.personal.name}
      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-400 object-cover shadow-xl" />
    <h1 className="text-3xl font-bold text-white mb-2">{data.personal.name}</h1>
    <p className="text-yellow-300 font-medium mb-3">{data.personal.title}</p>
    <p className="text-white/80 text-sm leading-relaxed max-w-sm mx-auto">{data.personal.tagline}</p>
    <div className="flex justify-center gap-3 mt-4">
      {[
        { icon: Github, url: data.socials.github },
        { icon: Linkedin, url: data.socials.linkedin },
        { icon: Twitter, url: data.socials.twitter },
        { icon: Mail, url: `mailto:${data.socials.email}` },
      ].map(({ icon: Icon, url }, i) => (
        <a key={i} href={url} target="_blank" rel="noreferrer"
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
          <Icon className="w-5 h-5 text-white" />
        </a>
      ))}
    </div>
  </div>
);

const AboutContent = () => (
  <div className="py-2">
    <div className="flex items-center gap-2 mb-3">
      <User className="w-5 h-5 text-yellow-400" />
      <h2 className="text-xl font-bold text-white">About Me</h2>
    </div>
    <p className="text-white/80 text-sm leading-relaxed mb-4">{data.personal.bio}</p>
    <div className="flex items-center gap-2 text-white/60 text-sm">
      <MapPin className="w-4 h-4 text-red-400" />
      <span>{data.personal.location}</span>
    </div>
  </div>
);

const StatsContent = () => (
  <div className="py-2">
    <div className="flex items-center gap-2 mb-4">
      <Star className="w-5 h-5 text-yellow-400" />
      <h2 className="text-xl font-bold text-white">Stats</h2>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: "Years Exp.", value: data.stats.yearsExperience + "+" },
        { label: "Projects", value: data.stats.projectsCompleted + "+" },
        { label: "Clients", value: data.stats.happyClients + "+" },
      ].map((stat, i) => (
        <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-yellow-300">{stat.value}</div>
          <div className="text-white/60 text-xs mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const SkillsContent = () => {
  const categories = [...new Set(data.skills.map(s => s.category))];
  return (
    <div className="py-2">
      <div className="flex items-center gap-2 mb-4">
        <Code className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Skills</h2>
      </div>
      {categories.map(cat => (
        <div key={cat} className="mb-3">
          <div className="text-yellow-300 text-xs font-bold uppercase mb-2">{cat}</div>
          <div className="flex flex-wrap gap-2">
            {data.skills.filter(s => s.category === cat).map((skill, i) => (
              <div key={i} className="px-2 py-1 bg-white/10 rounded-full text-white text-xs">
                {skill.name} <span className="text-yellow-300">{skill.level}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProjectsContent = () => (
  <div className="py-2">
    <div className="flex items-center gap-2 mb-4">
      <ChevronRight className="w-5 h-5 text-yellow-400" />
      <h2 className="text-xl font-bold text-white">Projects</h2>
    </div>
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {data.projects.map((project, i) => (
        <div key={i} className="bg-white/10 rounded-xl p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-white font-semibold text-sm">{project.title}</h3>
            <div className="flex gap-2">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="w-4 h-4 text-white/60 hover:text-white" />
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4 text-white/60 hover:text-white" />
                </a>
              )}
            </div>
          </div>
          <p className="text-white/60 text-xs mb-2">{project.description.slice(0, 80)}...</p>
          <div className="flex flex-wrap gap-1">
            {project.techStack.slice(0, 3).map((tech, j) => (
              <span key={j} className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">{tech}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ExperienceContent = () => (
  <div className="py-2">
    <div className="flex items-center gap-2 mb-4">
      <Briefcase className="w-5 h-5 text-yellow-400" />
      <h2 className="text-xl font-bold text-white">Experience</h2>
    </div>
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {data.experience.map((exp, i) => (
        <div key={i} className="relative pl-4 border-l-2 border-yellow-400/40">
          <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-yellow-400" />
          <h3 className="text-white font-semibold text-sm">{exp.role}</h3>
          <div className="text-yellow-300 text-xs">{exp.company}</div>
          <div className="text-white/40 text-xs mb-1">{exp.period}</div>
          <p className="text-white/60 text-xs">{exp.description.slice(0, 80)}...</p>
        </div>
      ))}
    </div>
  </div>
);

const TestimonialsContent = () => (
  <div className="py-2">
    <div className="flex items-center gap-2 mb-4">
      <MessageSquare className="w-5 h-5 text-yellow-400" />
      <h2 className="text-xl font-bold text-white">Testimonials</h2>
    </div>
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {data.testimonials.map((t, i) => (
        <div key={i} className="bg-white/10 rounded-xl p-3">
          <p className="text-white/80 text-xs italic mb-2">"{t.text.slice(0, 100)}..."</p>
          <div className="flex items-center gap-2">
            <img src={t.avatar} alt={t.name} className="w-6 h-6 rounded-full object-cover" />
            <div>
              <div className="text-white text-xs font-semibold">{t.name}</div>
              <div className="text-yellow-300 text-xs">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContactContent = () => (
  <div className="py-2">
    <div className="flex items-center gap-2 mb-4">
      <Phone className="w-5 h-5 text-yellow-400" />
      <h2 className="text-xl font-bold text-white">Contact</h2>
    </div>
    <div className="space-y-3">
      {[
        { icon: Mail, label: "Email", value: data.socials.email, href: `mailto:${data.socials.email}` },
        { icon: Github, label: "GitHub", value: "github.com", href: data.socials.github },
        { icon: Linkedin, label: "LinkedIn", value: "linkedin.com", href: data.socials.linkedin },
        { icon: Twitter, label: "Twitter", value: "twitter.com", href: data.socials.twitter },
      ].map(({ icon: Icon, label, value, href }, i) => (
        <a key={i} href={href} target="_blank" rel="noreferrer"
          className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
          <Icon className="w-5 h-5 text-yellow-400" />
          <div>
            <div className="text-white/60 text-xs">{label}</div>
            <div className="text-white text-sm font-medium">{value}</div>
          </div>
        </a>
      ))}
    </div>
  </div>
);

const SECTION_MAP = {
  hero: HeroContent,
  about: AboutContent,
  stats: StatsContent,
  skills: SkillsContent,
  projects: ProjectsContent,
  experience: ExperienceContent,
  testimonials: TestimonialsContent,
  contact: ContactContent,
};

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdventCalendar() {
  const [openDoors, setOpenDoors] = useState([]);
  const [activeDoor, setActiveDoor] = useState(null);

  const handleDoorClick = (door) => {
    if (!openDoors.includes(door.number)) {
      setOpenDoors(prev => [...prev, door.number]);
    }
    setActiveDoor(door);
  };

  const closeModal = () => setActiveDoor(null);

  const ActiveContent = activeDoor ? SECTION_MAP[activeDoor.section] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-red-950 to-green-950 relative overflow-hidden">
      <Snowflakes />

      {/* Header */}
      <div className="relative z-10 text-center pt-10 pb-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-5xl mb-2">🎄</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {data.personal.name}'s
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">
            Advent Calendar Portfolio
          </h2>
          <p className="text-white/60 text-sm">
            Click each door to discover something new! ✨
          </p>
          <div className="mt-3 text-white/40 text-xs">
            {openDoors.length} / {DOORS.length} doors opened
          </div>
        </motion.div>
      </div>

      {/* Calendar Grid */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {DOORS.map((door, i) => (
            <motion.div
              key={door.number}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
            >
              <Door
                door={door}
                isOpen={openDoors.includes(door.number)}
                onClick={handleDoorClick}
              />
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8">
          <div className="flex justify-between text-white/40 text-xs mb-2">
            <span>Progress</span>
            <span>{Math.round((openDoors.length / DOORS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"
              animate={{ width: `${(openDoors.length / DOORS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeDoor && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />

            {/* Modal Card */}
            <motion.div
              className={`relative w-full max-w-sm bg-gradient-to-br ${activeDoor.color} rounded-2xl p-6 shadow-2xl border border-white/20`}
              initial={{ scale: 0.5, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, rotateY: -90 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Close button */}
              <button
    onClick={closeModal}
    aria-label="Close modal"
    className="absolute top-3 right-3 p-1 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
  >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Door number badge */}
              <div className="absolute top-3 left-3 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-green-900">{activeDoor.number}</span>
              </div>

              {/* Section content */}
              <div className="mt-4">
                {ActiveContent && <ActiveContent />}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
