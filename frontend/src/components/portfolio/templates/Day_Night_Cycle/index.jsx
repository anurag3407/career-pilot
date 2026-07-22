import { usePortfolio } from "../../../../context/PortfolioContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Sun, Moon } from "lucide-react";

const SKY_STAGES = [
  { hour: 0,  from: "#0a0a1a", to: "#0d0d2b", stars: 1,   sunY: 110, moonY: 20,  label: "Midnight"  },
  { hour: 6,  from: "#1a0a2e", to: "#ff6b35", stars: 0,   sunY: 60,  moonY: -20, label: "Dawn"      },
  { hour: 10, from: "#87ceeb", to: "#ffd700", stars: 0,   sunY: 15,  moonY: -60, label: "Morning"   },
  { hour: 14, from: "#4aa8e0", to: "#87ceeb", stars: 0,   sunY: 5,   moonY: -80, label: "Afternoon" },
  { hour: 18, from: "#ff6b35", to: "#c0392b", stars: 0,   sunY: 60,  moonY: 20,  label: "Dusk"      },
  { hour: 21, from: "#1a1a2e", to: "#16213e", stars: 0.5, sunY: 100, moonY: 25,  label: "Evening"   },
  { hour: 24, from: "#0a0a1a", to: "#0d0d2b", stars: 1,   sunY: 110, moonY: 20,  label: "Midnight"  },
];

function lerp(a, b, t) { return a + (b - a) * t; }
function hexToRgb(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}
function lerpColor(c1, c2, t) {
  const [r1,g1,b1] = hexToRgb(c1), [r2,g2,b2] = hexToRgb(c2);
  return `rgb(${Math.round(lerp(r1,r2,t))},${Math.round(lerp(g1,g2,t))},${Math.round(lerp(b1,b2,t))})`;
}
function getSkyState(hour) {
  const h = ((hour % 24) + 24) % 24;
  for (let i = 0; i < SKY_STAGES.length - 1; i++) {
    const a = SKY_STAGES[i], b = SKY_STAGES[i+1];
    if (h >= a.hour && h < b.hour) {
      const t = (h - a.hour) / (b.hour - a.hour);
      return {
        from:  lerpColor(a.from, b.from, t),
        to:    lerpColor(a.to,   b.to,   t),
        stars: lerp(a.stars, b.stars, t),
        sunY:  lerp(a.sunY,  b.sunY,  t),
        moonY: lerp(a.moonY, b.moonY, t),
        label: t < 0.5 ? a.label : b.label,
      };
    }
  }
  return { from: "#0a0a1a", to: "#0d0d2b", stars: 1, sunY: 110, moonY: 20, label: "Midnight" };
}

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i, x: Math.random()*100, y: Math.random()*50,
  r: Math.random()*1.5+0.5, delay: Math.random()*3,
}));

export default function DayNightCycle() {
  const { portfolioData: data } = usePortfolio();

  const [hour, setHour] = useState(14);
  const [dragging, setDragging] = useState(false);
  const sky = getSkyState(hour);
  const isNight = sky.stars > 0.3;

  useEffect(() => {
    if (dragging) return;
    const t = setInterval(() => setHour(h => (h + 0.05) % 24), 100);
    return () => clearInterval(t);
  }, [dragging]);

  const skillCategories = [...new Set(data.skills.map(s => s.category))];

  const cardClass = isNight
    ? "bg-slate-900/70 border-slate-700/50 backdrop-blur-md"
    : "bg-white/60 border-white/70 backdrop-blur-md";
  const textClass   = isNight ? "text-slate-100" : "text-slate-800";
  const subClass    = isNight ? "text-slate-400" : "text-slate-500";
  const accentClass = isNight ? "text-blue-300"  : "text-blue-600";
  const barBg       = isNight ? "bg-slate-700"   : "bg-slate-200";
  const barFill     = isNight ? "from-blue-500 to-cyan-400" : "from-blue-600 to-cyan-500";
  const tagClass    = isNight ? "bg-blue-900/40 text-blue-300 border-blue-700/40" : "bg-blue-100 text-blue-700 border-blue-200";
  const btnClass    = isNight ? "bg-slate-800/80 border-slate-600 text-slate-200 hover:bg-slate-700/80" : "bg-white/80 border-slate-300 text-slate-700 hover:bg-white";

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ fontFamily: "'Georgia', serif" }}>

      {/* Sky */}
      <div className="fixed inset-0 z-0 transition-all duration-500"
        style={{ background: `linear-gradient(to bottom, ${sky.from}, ${sky.to})` }} />

      {/* Stars */}
      <div className="fixed inset-0 z-1 pointer-events-none">
        {STARS.map(s => (
          <motion.div key={s.id}
            animate={{ opacity: sky.stars * (0.5 + Math.random()*0.5) }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: s.delay }}
            className="absolute rounded-full bg-white"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r*2, height: s.r*2, boxShadow: `0 0 ${s.r*3}px white` }}
          />
        ))}
      </div>

      {/* Sun */}
      <motion.div animate={{ top: `${sky.sunY}%` }} transition={{ duration: 0.5 }}
        className="fixed z-2 pointer-events-none rounded-full"
        style={{
          left: "75%", transform: "translateX(-50%)",
          width: 80, height: 80,
          background: "radial-gradient(circle, #fff7aa, #ffd700, #ff8c00)",
          boxShadow: "0 0 60px 30px rgba(255,200,0,0.4), 0 0 120px 60px rgba(255,150,0,0.2)",
          opacity: Math.max(0, 1 - sky.stars * 2),
        }}
      />

      {/* Moon */}
      <motion.div animate={{ top: `${sky.moonY}%` }} transition={{ duration: 0.5 }}
        className="fixed z-2 pointer-events-none rounded-full"
        style={{
          left: "20%", transform: "translateX(-50%)",
          width: 55, height: 55,
          background: "radial-gradient(circle at 35% 35%, #f0f0e0, #c8c8b0)",
          boxShadow: "0 0 30px 10px rgba(200,200,180,0.3)",
          opacity: sky.stars,
        }}
      />

      {/* Time Slider */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-2 rounded-full border shadow-lg ${cardClass}`}>
        <Sun size={15} className="text-yellow-400" />
        <input type="range" min={0} max={24} step={0.1} value={hour}
          onMouseDown={() => setDragging(true)} onMouseUp={() => setDragging(false)}
          onChange={e => setHour(parseFloat(e.target.value))}
          className="w-32 cursor-pointer accent-yellow-400"
        />
        <Moon size={15} className="text-slate-300" />
        <span className={`text-xs font-mono min-w-[90px] ${subClass}`}>
          {sky.label} {String(Math.floor(hour)).padStart(2,"0")}:{String(Math.floor((hour%1)*60)).padStart(2,"0")}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">

        {/* HERO */}
        <motion.section initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:1 }}
          className="text-center mb-20">
          <img src={data.personal.avatar} alt={data.personal.name}
            className={`w-28 h-28 rounded-full object-cover mx-auto mb-6 border-4 shadow-xl ${isNight ? "border-blue-400 shadow-blue-400/30" : "border-yellow-400 shadow-yellow-400/30"}`}
          />
          <h1 className={`text-4xl sm:text-6xl font-bold mb-3 tracking-tight ${textClass}`}>{data.personal.name}</h1>
          <p className={`text-lg mb-4 ${subClass}`}>{data.personal.title}</p>
          <p className={`italic text-sm max-w-lg mx-auto mb-8 leading-relaxed ${subClass}`}>"{data.personal.tagline}"</p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {[
              { icon: <Github size={16}/>, href: data.socials.github, label: "GitHub" },
              { icon: <Linkedin size={16}/>, href: data.socials.linkedin, label: "LinkedIn" },
              { icon: <Twitter size={16}/>, href: data.socials.twitter, label: "Twitter" },
              { icon: <Mail size={16}/>, href: `mailto:${data.socials.email}`, label: "Email" },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all ${btnClass}`}>
                {s.icon} {s.label}
              </a>
            ))}
          </div>
          <div className={`flex items-center justify-center gap-1 text-xs ${subClass}`}>
            <MapPin size={12}/> {data.personal.location}
          </div>
        </motion.section>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { label: "Years Experience", value: `${data.stats.yearsExperience}+` },
            { label: "Projects Completed", value: `${data.stats.projectsCompleted}+` },
            { label: "Happy Clients", value: `${data.stats.happyClients}+` },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              transition={{ delay: i*0.1 }} viewport={{ once:true }}
              className={`text-center p-6 rounded-2xl border ${cardClass}`}>
              <div className={`text-3xl font-bold mb-1 ${accentClass}`}>{s.value}</div>
              <div className={`text-xs ${subClass}`}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ABOUT */}
        <Card title="About Me" cardClass={cardClass} textClass={textClass} accentClass={accentClass}>
          <p className={`leading-relaxed text-sm sm:text-base ${subClass}`}>{data.personal.bio}</p>
        </Card>

        {/* SKILLS */}
        <Card title="Skills" cardClass={cardClass} textClass={textClass} accentClass={accentClass}>
          {skillCategories.map(cat => (
            <div key={cat} className="mb-6">
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 ${accentClass}`}>{cat}</h4>
              <div className="space-y-3">
                {data.skills.filter(s => s.category === cat).map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${textClass}`}>{skill.name}</span>
                      <span className={`text-xs ${subClass}`}>{skill.level}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${barBg}`}>
                      <motion.div initial={{ width:0 }} whileInView={{ width:`${skill.level}%` }}
                        transition={{ duration:1, ease:"easeOut" }} viewport={{ once:true }}
                        className={`h-full rounded-full bg-gradient-to-r ${barFill}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>

        {/* PROJECTS */}
        <Card title="Projects" cardClass={cardClass} textClass={textClass} accentClass={accentClass}>
          <div className="grid sm:grid-cols-2 gap-5">
            {data.projects.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay: i*0.08 }} viewport={{ once:true }}
                className={`rounded-xl border overflow-hidden ${cardClass}`}>
                <img src={p.image} alt={p.title} className="w-full h-36 object-cover" />
                <div className="p-4">
                  <h3 className={`font-bold text-sm mb-2 ${textClass}`}>{p.title}</h3>
                  <p className={`text-xs leading-relaxed mb-3 ${subClass}`}>{p.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.techStack.map(t => (
                      <span key={t} className={`text-xs px-2 py-0.5 rounded-full border ${tagClass}`}>{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a href={p.liveUrl} target="_blank" rel="noreferrer"
                      className={`flex items-center gap-1 text-xs ${accentClass}`}>
                      <ExternalLink size={11}/> Live
                    </a>
                    <a href={p.githubUrl} target="_blank" rel="noreferrer"
                      className={`flex items-center gap-1 text-xs ${accentClass}`}>
                      <Github size={11}/> Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* EXPERIENCE */}
        <Card title="Experience" cardClass={cardClass} textClass={textClass} accentClass={accentClass}>
          <div className="relative pl-6">
            <div className={`absolute left-2 top-0 bottom-0 w-0.5 ${isNight ? "bg-slate-700" : "bg-slate-200"}`} />
            {data.experience.map((e, i) => (
              <motion.div key={e.role} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
                transition={{ delay: i*0.1 }} viewport={{ once:true }}
                className="relative mb-8">
                <div className={`absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full ${isNight ? "bg-blue-400" : "bg-blue-500"} shadow-md`} />
                <div className={`text-xs mb-1 ${subClass}`}>{e.period}</div>
                <div className={`font-bold text-sm ${textClass}`}>{e.role}</div>
                <div className={`text-sm mb-2 ${accentClass}`}>{e.company}</div>
                <p className={`text-xs leading-relaxed ${subClass}`}>{e.description}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* TESTIMONIALS */}
        <Card title="Testimonials" cardClass={cardClass} textClass={textClass} accentClass={accentClass}>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay: i*0.08 }} viewport={{ once:true }}
                className={`p-4 rounded-xl border ${cardClass}`}>
                <p className={`text-xs italic leading-relaxed mb-4 ${subClass}`}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className={`text-xs font-bold ${textClass}`}>{t.name}</div>
                    <div className={`text-xs ${subClass}`}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* CONTACT */}
        <Card title="Get In Touch" cardClass={cardClass} textClass={textClass} accentClass={accentClass}>
          <div className="text-center">
            <p className={`text-sm mb-6 ${subClass}`}>Whether it's a project, opportunity, or just a hello — my inbox is open.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={`mailto:${data.socials.email}`}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-semibold transition-all ${btnClass}`}>
                <Mail size={15}/> {data.socials.email}
              </a>
              <a href={data.socials.linkedin} target="_blank" rel="noreferrer"
                className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-semibold transition-all ${btnClass}`}>
                <Linkedin size={15}/> LinkedIn
              </a>
            </div>
          </div>
        </Card>

        <div className={`text-center text-xs mt-12 ${subClass}`}>
          Built with ☀️🌙 · Day Night Cycle Portfolio · {data.personal.name}
        </div>
      </div>
    </div>
  );
}

function Card({ title, children, cardClass, textClass, accentClass }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.section initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ duration:0.6 }}
      className={`mb-10 p-6 sm:p-8 rounded-2xl border shadow-lg ${cardClass}`}>
      <h2 className={`text-xl font-bold mb-6 pb-3 border-b border-current/10 ${textClass}`}>{title}</h2>
      {children}
    </motion.section>
  );
}
