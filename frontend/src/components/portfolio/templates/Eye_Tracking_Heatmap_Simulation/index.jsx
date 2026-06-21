import { usePortfolio } from "../../../../context/PortfolioContext";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Eye, Zap, Star } from "lucide-react";

// ---------------------------------------------------------------------------
// Heatmap blob engine
// ---------------------------------------------------------------------------
const MAX_POINTS = 120;

function useHeatmap(canvasRef) {
  const points = useRef([]);

  const addPoint = useCallback((x, y) => {
    points.current.push({ x, y, age: 0 });
    if (points.current.length > MAX_POINTS) points.current.shift();
  }, []);

  useEffect(() => {
    let raf;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.current.forEach((p) => {
        p.age += 0.4;
        const alpha = Math.max(0, 1 - p.age / 60);
        const radius = 80 + p.age * 1.2;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        grad.addColorStop(0, `rgba(255, 80, 120, ${0.55 * alpha})`);
        grad.addColorStop(0.35, `rgba(255, 160, 40, ${0.35 * alpha})`);
        grad.addColorStop(0.7, `rgba(80, 200, 255, ${0.18 * alpha})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
      points.current = points.current.filter((p) => p.age < 60);
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);

  return addPoint;
}

// ---------------------------------------------------------------------------
// Scanpath cursor dot
// ---------------------------------------------------------------------------
function CursorDot({ x, y }) {
  const { portfolioData: data } = usePortfolio();

  const springX = useSpring(x, { stiffness: 300, damping: 28 });
  const springY = useSpring(y, { stiffness: 300, damping: 28 });
  return (
    <motion.div
      style={{ left: springX, top: springY }}
      className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        className="w-5 h-5 rounded-full border-2 border-rose-400"
        animate={{ scale: [1, 1.6, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-rose-400" />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section label chip
// ---------------------------------------------------------------------------
function Chip({ children }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-white/5 border border-white/10 text-slate-400">
      <Eye size={10} />
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Skill bar
// ---------------------------------------------------------------------------
function SkillBar({ name, level, delay }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-300 font-medium">{name}</span>
        <span className="text-rose-400 font-mono text-xs">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-full rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300"
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Project card
// ---------------------------------------------------------------------------
function ProjectCard({ project, index }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="relative rounded-2xl overflow-hidden border border-white/8 bg-white/3 backdrop-blur-sm group cursor-pointer"
    >
      {/* image */}
      {project.image && (
        <div className="h-44 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0d14]" />
        </div>
      )}

      {/* scanpath overlay dot on hover */}
      <motion.div
        className="absolute top-3 right-3 w-3 h-3 rounded-full bg-rose-400 opacity-0 group-hover:opacity-100"
        animate={{ scale: [1, 1.8, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      <div className="p-5">
        <h3 className="text-white font-semibold text-base mb-1.5">{project.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack?.map((t) => (
            <span key={t} className="px-2 py-0.5 text-xs rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono">
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <ExternalLink size={12} /> Live
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <Github size={12} /> Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Testimonial card
// ---------------------------------------------------------------------------
function TestimonialCard({ item, index }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl p-5 bg-white/3 border border-white/8"
    >
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
      </div>
      <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{item.text}"</p>
      <div className="flex items-center gap-3">
        <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
        <div>
          <div className="text-white text-sm font-medium">{item.name}</div>
          <div className="text-slate-500 text-xs">{item.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main template
// ---------------------------------------------------------------------------
export default function EyeTrackingHeatmapSimulation() {
  const { portfolioData: data } = usePortfolio();

  const canvasRef = useRef(null);
  const addPoint = useHeatmap(canvasRef);

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const [showCursor, setShowCursor] = useState(false);

  const handleMouseMove = useCallback((e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    setShowCursor(true);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) addPoint(e.clientX - rect.left, e.clientY - rect.top);
  }, [addPoint, cursorX, cursorY]);

  const handleMouseLeave = () => setShowCursor(false);

  // Simulate auto scanpath on mount
  useEffect(() => {
    const points = [
      [200, 120], [400, 80], [650, 200], [300, 350],
      [700, 400], [150, 500], [500, 300], [250, 450],
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i >= points.length) { i = 0; }
      addPoint(points[i][0], points[i][1]);
      i++;
    }, 500);
    return () => clearInterval(interval);
  }, [addPoint]);

  const { personal, socials, skills, projects, experience, testimonials, stats } = data;
  const grouped = skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <div
      className="relative min-h-screen bg-[#0b0d14] text-white overflow-x-hidden font-sans"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "none" }}
    >
      {/* Heatmap canvas — fixed, full-screen */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-10"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Custom cursor */}
      {showCursor && <CursorDot x={cursorX} y={cursorY} />}

      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* HERO */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative z-20 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-28 pt-24 pb-16">
        {/* top label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <Chip>Eye-Tracking Active</Chip>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              {personal.name.split(" ").map((w, i) => (
                <span key={i} className={i % 2 === 0 ? "text-white" : "text-rose-400"}>
                  {w}{" "}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-xl text-rose-300 font-mono mb-4"
            >
              {personal.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              className="text-slate-400 leading-relaxed max-w-lg mb-8"
            >
              {personal.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 text-slate-500 text-sm mb-8"
            >
              <MapPin size={14} className="text-rose-400" />
              {personal.location}
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4"
            >
              {[
                { icon: Github, href: socials.github, label: "GitHub" },
                { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
                { icon: Twitter, href: socials.twitter, label: "Twitter" },
                { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-rose-400/50 hover:bg-rose-500/10 transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Avatar + scanpath ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            {/* Rotating dashed ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 m-auto w-72 h-72 rounded-full border border-dashed border-rose-500/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 m-auto w-56 h-56 rounded-full border border-dashed border-orange-400/15"
            />

            <div className="relative w-64 h-64 rounded-full overflow-hidden border-2 border-rose-400/30 shadow-[0_0_60px_rgba(244,63,94,0.25)]">
              <img
                src={personal.avatar}
                alt={personal.name}
                className="w-full h-full object-cover"
              />
              {/* scanpoint pulse on avatar */}
              <motion.div
                className="absolute top-6 right-8 w-3 h-3 rounded-full bg-rose-400"
                animate={{ scale: [1, 2.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            {/* Scanpath connector lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 400">
              <motion.path
                d="M 200 50 Q 350 100 300 200 Q 250 300 150 350 Q 80 380 60 280"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-xl"
        >
          {[
            { label: "Years Exp.", value: stats.yearsExperience },
            { label: "Projects", value: stats.projectsCompleted },
            { label: "Clients", value: stats.happyClients },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-4 rounded-xl bg-white/3 border border-white/8">
              <div className="text-3xl font-bold text-white font-mono">{value}+</div>
              <div className="text-xs text-slate-500 mt-1 tracking-wider uppercase">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SKILLS */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative z-20 px-6 md:px-16 lg:px-28 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Chip>Skill Heatmap</Chip>
          <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            What I <span className="text-rose-400">Focus</span> On
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="rounded-2xl p-6 bg-white/3 border border-white/8">
              <div className="flex items-center gap-2 mb-5">
                <Zap size={14} className="text-rose-400" />
                <span className="text-sm font-mono text-slate-400 uppercase tracking-widest">{category}</span>
              </div>
              <div className="space-y-4">
                {items.map((s, i) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 0.07} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* EXPERIENCE */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative z-20 px-6 md:px-16 lg:px-28 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Chip>Scanpath Timeline</Chip>
          <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            My <span className="text-rose-400">Journey</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/50 via-orange-400/30 to-transparent" />

          <div className="space-y-10 pl-12 md:pl-20">
            {experience.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* node */}
                <motion.div
                  className="absolute -left-[2.85rem] md:-left-[4.85rem] top-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-[#0b0d14] shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                  whileInView={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                />
                <div className="text-xs text-rose-400 font-mono mb-1">{exp.period}</div>
                <h3 className="text-white font-semibold text-lg">{exp.role}</h3>
                <div className="text-slate-400 text-sm mb-2">{exp.company}</div>
                <p className="text-slate-500 text-sm leading-relaxed">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PROJECTS */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative z-20 px-6 md:px-16 lg:px-28 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Chip>Fixation Zones</Chip>
          <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Selected <span className="text-rose-400">Work</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* TESTIMONIALS */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative z-20 px-6 md:px-16 lg:px-28 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Chip>Social Proof</Chip>
          <h2 className="text-4xl font-bold mt-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            What They <span className="text-rose-400">Say</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} item={t} index={i} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER / CTA */}
      {/* ------------------------------------------------------------------ */}
      <footer className="relative z-20 px-6 md:px-16 lg:px-28 py-20 border-t border-white/8">
        <div className="text-center max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Chip>Let's Connect</Chip>
            <h2 className="text-4xl font-bold mt-5 mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
              Ready to <span className="text-rose-400">Collaborate?</span>
            </h2>
            <p className="text-slate-400 mb-8">Move your cursor. Every glance leaves a trace.</p>
            <a
              href={`mailto:${socials.email}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-rose-500 text-white font-semibold hover:bg-rose-400 transition-colors shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_40px_rgba(244,63,94,0.5)]"
            >
              <Mail size={16} />
              {socials.email}
            </a>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-slate-600 text-xs mt-12 font-mono"
        >
          © {new Date().getFullYear()} {personal.name} · Eye-Tracking Heatmap Simulation
        </motion.p>
      </footer>

      {/* Google Font: Syne */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap');
      `}</style>
    </div>
  );
}