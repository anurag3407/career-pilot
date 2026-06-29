import { usePortfolio } from "../../../../context/PortfolioContext";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Leaf,
} from "lucide-react";

function LeafSVG({ className, style }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <svg viewBox="0 0 100 120" className={className} style={style} fill="currentColor">
      <path d="M50 0 C20 20 0 50 10 80 C20 110 50 120 50 120 C50 120 80 110 90 80 C100 50 80 20 50 0Z" />
    </svg>
  );
}

function BirdSVG({ className, style }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <svg viewBox="0 0 80 40" className={className} style={style} fill="currentColor">
      <path d="M40 20 C30 10 10 5 0 10 C10 15 20 18 30 20 C20 22 10 25 0 30 C10 35 30 30 40 20Z" />
      <path d="M40 20 C50 10 70 5 80 10 C70 15 60 18 50 20 C60 22 70 25 80 30 C70 35 50 30 40 20Z" />
    </svg>
  );
}

const LIGHT_SPOTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 120 + 40,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 3,
}));

const LEAVES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: Math.random() * 20 + 12,
  delay: Math.random() * 8,
  duration: Math.random() * 6 + 8,
  rotate: Math.random() * 360,
  color: ["text-emerald-400", "text-green-500", "text-lime-400"][Math.floor(Math.random() * 3)],
}));

const BIRDS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  y: Math.random() * 40 + 5,
  size: Math.random() * 16 + 10,
  delay: Math.random() * 10,
  duration: Math.random() * 8 + 10,
}));

export default function RainforestCanopy() {
  const { portfolioData: data } = usePortfolio();

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const canopyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const skillCategories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-[#0a1a0a] via-[#112b11] to-[#0a1a0a]"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Canopy Top */}
      <motion.div
        style={{ y: canopyY }}
        className="fixed top-0 left-0 right-0 z-10 pointer-events-none"
      >
        <div className="relative w-full h-48 overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0"
              style={{
                left: `${i * 7.5 - 2}%`,
                transform: `rotate(${Math.sin(i) * 20}deg) translateY(${Math.cos(i) * 20 - 10}px)`,
              }}
            >
              <LeafSVG
                className={i % 3 === 0 ? "text-emerald-800" : i % 3 === 1 ? "text-green-900" : "text-emerald-900"}
                style={{ width: `${80 + (i % 4) * 20}px`, height: `${100 + (i % 3) * 25}px`, opacity: 0.9 }}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dappled Sunlight */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {LIGHT_SPOTS.map((spot) => (
          <motion.div
            key={spot.id}
            animate={{ opacity: [0.03, 0.1, 0.03], scale: [1, 1.2, 1] }}
            transition={{ duration: spot.duration, repeat: Infinity, delay: spot.delay, ease: "easeInOut" }}
            className="absolute rounded-full bg-[radial-gradient(circle,rgba(255,230,100,0.6),transparent)]"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: spot.size,
              height: spot.size,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Floating Leaves */}
      <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
        {LEAVES.map((leaf) => (
          <motion.div
            key={leaf.id}
            initial={{ x: `${leaf.x}vw`, y: "-5vh", rotate: leaf.rotate }}
            animate={{
              y: "110vh",
              x: [`${leaf.x}vw`, `${leaf.x + 10}vw`, `${leaf.x - 5}vw`],
              rotate: [leaf.rotate, leaf.rotate + 180, leaf.rotate + 360],
            }}
            transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "linear" }}
          >
            <LeafSVG
              className={leaf.color}
              style={{ width: leaf.size, height: leaf.size, opacity: 0.6 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Flying Birds */}
      <div className="fixed inset-0 z-[3] pointer-events-none overflow-hidden">
        {BIRDS.map((bird) => (
          <motion.div
            key={bird.id}
            initial={{ x: "-10vw" }}
            animate={{ x: "110vw" }}
            transition={{ duration: bird.duration, delay: bird.delay, repeat: Infinity, ease: "linear" }}
            className="absolute"
            style={{ top: `${bird.y}%` }}
          >
            <BirdSVG
              className="text-emerald-300"
              style={{ width: bird.size, height: bird.size, opacity: 0.5 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 pt-52 pb-20">

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl scale-125" />
            <img
              src={data.personal.avatar}
              alt={data.personal.name}
              className="relative w-28 h-28 rounded-full object-cover border-4 border-emerald-400/60 shadow-xl shadow-emerald-900/50"
            />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-3 text-emerald-100 tracking-tight drop-shadow-lg">
            {data.personal.name}
          </h1>
          <p className="text-lg mb-4 text-emerald-300/80">{data.personal.title}</p>
          <p className="italic text-sm max-w-lg mx-auto mb-8 leading-relaxed text-emerald-200/60">
            &ldquo;{data.personal.tagline}&rdquo;
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {[
              { icon: <Github size={16} />, href: data.socials.github, label: "GitHub" },
              { icon: <Linkedin size={16} />, href: data.socials.linkedin, label: "LinkedIn" },
              { icon: <Twitter size={16} />, href: data.socials.twitter, label: "Twitter" },
              { icon: <Mail size={16} />, href: `mailto:${data.socials.email}`, label: "Email" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-900/40 text-emerald-200 text-sm backdrop-blur-sm hover:bg-emerald-800/50 transition-all"
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1 text-xs text-emerald-400/60">
            <MapPin size={12} /> {data.personal.location}
          </div>
        </motion.section>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { label: "Years Experience", value: `${data.stats.yearsExperience}+` },
            { label: "Projects Completed", value: `${data.stats.projectsCompleted}+` },
            { label: "Happy Clients", value: `${data.stats.happyClients}+` },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl border border-emerald-500/20 bg-emerald-900/30 backdrop-blur-sm"
            >
              <div className="text-3xl font-bold mb-1 text-emerald-300">{s.value}</div>
              <div className="text-xs text-emerald-400/60">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ABOUT */}
        <ForestCard title="About Me">
          <p className="leading-relaxed text-sm sm:text-base text-emerald-200/70">{data.personal.bio}</p>
        </ForestCard>

        {/* SKILLS */}
        <ForestCard title="Skills">
          {skillCategories.map((cat) => (
            <div key={cat} className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-emerald-400">{cat}</h4>
              <div className="space-y-3">
                {data.skills.filter((s) => s.category === cat).map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-emerald-100">{skill.name}</span>
                      <span className="text-xs text-emerald-400/60">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden bg-emerald-950/60">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-lime-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ForestCard>

        {/* PROJECTS */}
        <ForestCard title="Projects">
          <div className="grid sm:grid-cols-2 gap-5">
            {data.projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="rounded-xl border border-emerald-500/20 overflow-hidden bg-emerald-950/40 backdrop-blur-sm"
              >
                <img src={p.image} alt={p.title} className="w-full h-36 object-cover opacity-80" />
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 text-emerald-100">{p.title}</h3>
                  <p className="text-xs leading-relaxed mb-3 text-emerald-300/60">{p.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.techStack.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-900/40 text-emerald-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
                      <ExternalLink size={11} /> Live
                    </a>
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
                      <Github size={11} /> Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ForestCard>

        {/* EXPERIENCE */}
        <ForestCard title="Experience">
          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-emerald-700/40" />
            {data.experience.map((e, i) => (
              <motion.div
                key={e.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative mb-8"
              >
                <div className="absolute -left-4 top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/40" />
                <div className="text-xs mb-1 text-emerald-400/60">{e.period}</div>
                <div className="font-bold text-sm text-emerald-100">{e.role}</div>
                <div className="text-sm mb-2 text-emerald-400">{e.company}</div>
                <p className="text-xs leading-relaxed text-emerald-300/60">{e.description}</p>
              </motion.div>
            ))}
          </div>
        </ForestCard>

        {/* TESTIMONIALS */}
        <ForestCard title="Testimonials">
          <div className="grid sm:grid-cols-2 gap-4">
            {data.testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/40"
              >
                <p className="text-xs italic leading-relaxed mb-4 text-emerald-200/60">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/30" />
                  <div>
                    <div className="text-xs font-bold text-emerald-100">{t.name}</div>
                    <div className="text-xs text-emerald-400/60">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ForestCard>

        {/* CONTACT */}
        <ForestCard title="Get In Touch">
          <div className="text-center">
            <p className="text-sm mb-6 text-emerald-200/60">
              Whether it&apos;s a project, opportunity, or just a hello — my inbox is open.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${data.socials.email}`}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-500/30 bg-emerald-900/40 text-emerald-200 text-sm font-semibold hover:bg-emerald-800/50 transition-all"
              >
                <Mail size={15} /> {data.socials.email}
              </a>
              <a
                href={data.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-emerald-500/30 bg-emerald-900/40 text-emerald-200 text-sm font-semibold hover:bg-emerald-800/50 transition-all"
              >
                <Linkedin size={15} /> LinkedIn
              </a>
            </div>
          </div>
        </ForestCard>

        <div className="text-center text-xs mt-12 text-emerald-500/40 flex items-center justify-center gap-1">
          <Leaf size={12} /> Rainforest Canopy Portfolio · {data.personal.name}
        </div>
      </div>

      {/* Bottom foliage */}
      <div className="fixed bottom-0 left-0 right-0 z-10 pointer-events-none">
        <div className="relative w-full h-24 overflow-hidden flex items-end">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0"
              style={{ left: `${i * 11 - 3}%`, transform: `rotate(${Math.sin(i + 2) * 15}deg)` }}
            >
              <LeafSVG
                className="text-emerald-900"
                style={{ width: `${60 + (i % 3) * 20}px`, height: `${80 + (i % 4) * 15}px`, opacity: 0.95 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ForestCard({ title, children }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10 p-6 sm:p-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/50 backdrop-blur-md shadow-lg shadow-emerald-950/50"
    >
      <h2 className="text-xl font-bold mb-6 pb-3 border-b border-emerald-500/20 text-emerald-100">{title}</h2>
      {children}
    </motion.section>
  );
}
