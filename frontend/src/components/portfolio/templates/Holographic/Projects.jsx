import { useState, useRef, useEffect } from "react";
import { ExternalLink, Github, Layers, Cpu, Zap, Eye } from "lucide-react";

/**
 * Default project data — replace with real portfolio data prop in production.
 */
const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "Neural Interface Dashboard",
    description:
      "A real-time data visualization platform leveraging AI-driven insights and holographic rendering pipelines. Built with cutting-edge WebGL shaders and neural network APIs.",
    tags: ["React", "WebGL", "TensorFlow.js", "Node.js"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
    category: "AI / ML",
    stats: { stars: 248, forks: 64, views: "12K" },
  },
  {
    id: 2,
    title: "Quantum State Manager",
    description:
      "Next-generation state management library inspired by quantum superposition principles — manage parallel UI states with zero boilerplate and maximum predictability.",
    tags: ["TypeScript", "React", "Zustand", "Vite"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "Open Source",
    stats: { stars: 512, forks: 89, views: "28K" },
  },
  {
    id: 3,
    title: "Holo-Auth Framework",
    description:
      "Multi-dimensional authentication system combining biometric holographic scanning with cryptographic identity proofs, built on Web3 standards.",
    tags: ["Web3", "Ethereum", "Next.js", "Solidity"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "Web3",
    stats: { stars: 134, forks: 41, views: "8K" },
  },
  {
    id: 4,
    title: "Spectral Analytics Engine",
    description:
      "High-performance analytics pipeline that processes petabyte-scale event streams with spectral decomposition algorithms, delivering sub-millisecond query latency.",
    tags: ["Rust", "WebAssembly", "Kafka", "ClickHouse"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
    category: "Infrastructure",
    stats: { stars: 76, forks: 22, views: "5K" },
  },
  {
    id: 5,
    title: "Prism UI System",
    description:
      "A design system that refracts visual hierarchy into prismatic color spectrums. Includes 200+ accessible components with holographic depth theming.",
    tags: ["Figma", "Storybook", "CSS-in-JS", "a11y"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "Design",
    stats: { stars: 921, forks: 203, views: "45K" },
  },
  {
    id: 6,
    title: "Void Protocol API",
    description:
      "Ultra-low-latency REST and GraphQL gateway with adaptive rate limiting, distributed caching, and self-healing circuit breakers designed for planetary-scale systems.",
    tags: ["Go", "GraphQL", "Redis", "Kubernetes"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "Backend",
    stats: { stars: 387, forks: 91, views: "19K" },
  },
];

/* ─────────────────────────────────────────
   Holographic rainbow gradient — cycles through
   the visible spectrum on every card.
───────────────────────────────────────── */
const HOLO_GRADIENTS = [
  "from-cyan-400 via-blue-500 to-violet-600",
  "from-fuchsia-500 via-rose-400 to-orange-400",
  "from-emerald-400 via-cyan-400 to-blue-500",
  "from-violet-500 via-purple-400 to-fuchsia-500",
  "from-sky-400 via-indigo-400 to-violet-500",
  "from-teal-400 via-emerald-400 to-cyan-500",
];

const CATEGORY_COLORS = {
  "AI / ML": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Open Source": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Web3: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Infrastructure: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Design: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Backend: "bg-blue-500/20 text-blue-300 border-blue-500/30",
};

/* ─── Tilt-on-hover card ───────────────── */
function HoloCard({ project, index, isActive, onActivate }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const gradient = HOLO_GRADIENTS[index % HOLO_GRADIENTS.length];
  const categoryStyle =
    CATEGORY_COLORS[project.category] ||
    "bg-slate-500/20 text-slate-300 border-slate-500/30";

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -12, y: dx * 12 });
    setShine({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      role="article"
      aria-label={`Project: ${project.title}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onActivate(project.id === isActive ? null : project.id)}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.03 : 1})`,
        transition: hovered
          ? "transform 0.1s ease-out"
          : "transform 0.5s ease-out",
      }}
      className="relative cursor-pointer rounded-2xl overflow-hidden group"
    >
      {/* ── outer prismatic border ── */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{ padding: "1.5px" }}
      />
      <div
        className={`absolute inset-[1.5px] rounded-2xl bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
      />

      {/* ── glass body ── */}
      <div
        className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
        style={{ isolation: "isolate" }}
      >
        {/* Holographic shine layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Rainbow iridescent stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(90deg, #00f5ff, #7c3aed, #ec4899, #f97316, #eab308, #22c55e, #00f5ff)",
            backgroundSize: "200% 100%",
            animation: hovered ? "shimmer 2s linear infinite" : "none",
          }}
        />

        {/* Header band */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${gradient} opacity-80`} />

        <div className="p-6">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Icon avatar */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
              >
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-widest border px-2 py-0.5 rounded-full ${categoryStyle}`}
                >
                  {project.category}
                </span>
              </div>
            </div>

            {project.featured && (
              <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
                <Zap className="w-3 h-3" />
                Featured
              </div>
            )}
          </div>

          {/* Title */}
          <h3
            className={`text-lg font-bold text-white mb-2 group-hover:bg-gradient-to-r group-hover:${gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed mb-5 line-clamp-3">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-lg hover:border-white/20 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {project.stats.stars}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {project.stats.forks}
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {project.stats.views}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {project.liveUrl && project.liveUrl !== "#" && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} live`}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-200`}
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            {project.githubUrl && project.githubUrl !== "#" && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`View ${project.title} on GitHub`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200 flex-1"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {/* Fallback when both are placeholder "#" — show greyed buttons */}
            {project.liveUrl === "#" && project.githubUrl === "#" && (
              <>
                <span className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-semibold opacity-70`}>
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </span>
                <span className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 text-sm font-medium flex-1">
                  <Github className="w-4 h-4" />
                  GitHub
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Filter pill ─────────────────────── */
function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap
        ${
          active
            ? "bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white border-transparent shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            : "border-white/10 text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white"
        }`}
    >
      {label}
    </button>
  );
}

/* ─── Main Projects Component ─────────── */

/**
 * Projects section for the Holographic portfolio theme.
 *
 * @param {Object}   props
 * @param {Array}    [props.projects]    - Array of project objects. Defaults to sample data.
 * @param {string}   [props.title]       - Section heading. Defaults to "Projects".
 * @param {string}   [props.subtitle]    - Section subheading. Defaults to a description.
 */
export default function HolographicProjects({
  projects = DEFAULT_PROJECTS,
  title = "Projects",
  subtitle = "Engineered at the intersection of imagination and reality",
}) {
  const [filter, setFilter] = useState("All");
  const [activeId, setActiveId] = useState(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  /* Intersection observer for fade-in reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      {/* ── Keyframe animations injected via <style> ── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes holo-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-8px) rotate(1deg); }
          66%       { transform: translateY(-4px) rotate(-0.5deg); }
        }
        @keyframes holo-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-enter { animation: card-in 0.5s ease-out forwards; }
      `}</style>

      <section
        id="projects"
        ref={sectionRef}
        className="relative min-h-screen w-full overflow-hidden bg-[#03050f] px-4 py-20 sm:px-8"
        aria-labelledby="projects-heading"
      >
        {/* ────────────── Background FX ────────────── */}

        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.18),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(20,184,166,0.10),transparent)] pointer-events-none" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,200,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(120,200,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating orbs */}
        {[
          { top: "10%", left: "5%", size: 220, color: "rgba(99,102,241,0.12)", dur: "8s" },
          { top: "60%", left: "88%", size: 180, color: "rgba(20,184,166,0.10)", dur: "11s" },
          { top: "40%", left: "50%", size: 300, color: "rgba(236,72,153,0.06)", dur: "14s" },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl pointer-events-none"
            style={{
              top: orb.top,
              left: orb.left,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              animation: `holo-float ${orb.dur} ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}

        {/* Spinning prismatic ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none opacity-[0.06]"
          style={{
            width: 700,
            height: 700,
            border: "1.5px solid",
            borderImage:
              "linear-gradient(135deg,#00f5ff,#7c3aed,#ec4899,#f97316,#00f5ff) 1",
            borderRadius: "9999px",
            animation: "holo-spin 30s linear infinite",
          }}
        />

        {/* ────────────── Content ────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto">

          {/* Section header */}
          <div
            className={`text-center mb-14 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Portfolio
              </span>
            </div>

            {/* Heading */}
            <h2
              id="projects-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4"
            >
              <span
                className="bg-gradient-to-r from-cyan-300 via-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
                style={{ backgroundSize: "200% 100%", animation: "shimmer 5s linear infinite" }}
              >
                {title}
              </span>
            </h2>

            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/60" />
              <Cpu className="w-4 h-4 text-cyan-500/60" />
              <div className="h-px w-16 bg-gradient-to-r from-cyan-500/60 to-transparent" />
            </div>
          </div>

          {/* Filter tabs */}
          <div
            className={`flex flex-wrap items-center justify-center gap-2 mb-10 transition-all duration-700 delay-150 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            role="group"
            aria-label="Filter projects by category"
          >
            {categories.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                active={filter === cat}
                onClick={() => setFilter(cat)}
              />
            ))}
          </div>

          {/* Count badge */}
          <div className="flex justify-center mb-8">
            <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Cards grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-live="polite"
            aria-atomic="false"
          >
            {filtered.map((project, index) => (
              <div
                key={project.id}
                className={visible ? "card-enter" : "opacity-0"}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <HoloCard
                  project={project}
                  index={index}
                  isActive={activeId}
                  onActivate={setActiveId}
                />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Layers className="w-12 h-12 text-slate-600 mb-4" />
              <p className="text-slate-500 text-lg font-medium">No projects in this category yet</p>
              <button
                onClick={() => setFilter("All")}
                className="mt-4 text-sm text-cyan-400 hover:text-cyan-300 underline transition-colors"
              >
                Show all projects
              </button>
            </div>
          )}

          {/* Footer CTA */}
          <div
            className={`mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <a
              href="#contact"
              id="projects-cta-collaborate"
              className="group flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 text-white font-semibold text-sm shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] hover:brightness-110 transition-all duration-300"
            >
              <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Let&apos;s Collaborate
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              id="projects-cta-github"
              className="flex items-center gap-2 px-7 py-3 rounded-full border border-white/10 bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
            >
              <Github className="w-4 h-4" />
              All Repositories
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
