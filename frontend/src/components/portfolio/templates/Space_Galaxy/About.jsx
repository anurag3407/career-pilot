import React, { useState, useEffect, useRef } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Send,
} from "lucide-react";

/**
 * Space-themed font stack.
 * @type {string}
 */
const SPACE_FONT = "'Orbitron', 'Exo 2', 'Rajdhani', 'Courier New', monospace;";

/* ─────────────────────────────────────────────
   DATA  — updated 
───────────────────────────────────────────── */

const skills = [
  "React",
  "Next.js",
  "Node.js",
  "Tailwind",
  "AWS",
  "Docker",
  "Postgres",
  "Typescript",
  "Python",
  "GraphQL",
];

const projects = [
  {
    num: "01",
    title: "NEURALDASH",
    desc: "AI-powered analytics dashboard with real-time data visualization, predictive insights, and customizable widget layouts. Built for enterprise teams handling petabyte-scale datasets.",
    tags: ["REACT", "PYTHON", "TENSORFLOW", "WEBSOCKET"],
    live: null,
    source: null,
  },
  {
    num: "02",
    title: "PIXELFORGE STUDIO",
    desc: "Browser-based creative suite for digital artists — vector illustration, pixel art, and animation tools. 50K+ monthly active users and counting.",
    tags: ["CANVAS API", "WEBGL", "VUE.JS", "RUST/WASM"],
    live: null,
    source: null,
  },
  {
    num: "03",
    title: "ECOTRACK",
    desc: "Sustainability platform that helps businesses measure, reduce, and offset their carbon footprint. Features gamified goals and real-time carbon market integration.",
    tags: ["NEXT.JS", "NODE.JS", "POSTGRESQL", "STRIPE"],
    live: null,
    source: null,
  },
  {
    num: "04",
    title: "VERSE — SOCIAL READING",
    desc: "Next-generation social reading app where readers annotate, discuss, and discover books together. Built-in AI summarisation and personalised recommendations.",
    tags: ["REACT NATIVE", "GRAPHQL", "MONGODB", "OPENAI"],
    live: null,
    source: null,
  },
  {
    num: "05",
    title: "PULSE CRM",
    desc: "Lightweight CRM for indie businesses — contact management, deal pipelines, email sequences, and revenue analytics. Competes with Salesforce at 1% of the price.",
    tags: ["REACT", "EXPRESS", "MYSQL", "REDIS"],
    live: null,
    source: null,
  },
  {
    num: "06",
    title: "ORBIT — 3D PORTFOLIO",
    desc: "Interactive 3D portfolio builder powered by Three.js and AI content generation. Users describe their work and the system assembles a stunning 3D showcase in seconds.",
    tags: ["THREE.JS", "REACT", "OPENAI", "WEBGL"],
    live: null,
    source: null,
  },
];

const experience = [
  {
    period: "2022 – PRESENT",
    company: "VERCEL",
    role: "SENIOR FULL STACK ENGINEER",
    desc: "Leading the development of Next.js deployment pipelines and edge runtime features. Reduced cold-start latency by 60% through custom caching strategies. Mentoring a team of 6 engineers.",
  },
  {
    period: "2020 – 2022",
    company: "FIGMA",
    role: "FRONTEND ENGINEER",
    desc: "Built the multiplayer presence system and real-time cursor sync using WebSockets and CRDTs. Shipped the Auto Layout 3.0 feature which became the most upvoted release in company history.",
  },
  {
    period: "2019 – 2020",
    company: "STRIPE",
    role: "FULL STACK DEVELOPER",
    desc: "Developed internal tooling for fraud detection and risk management. Built a real-time transaction monitoring dashboard processing 10M+ events per day.",
  },
  {
    period: "2018 – 2019",
    company: "STARTUP STUDIO",
    role: "JUNIOR DEVELOPER",
    desc: "Worked across 5 early-stage startups as an embedded developer. Built MVPs from zero to launch in under 3 months each. Gained broad experience across mobile, web, and backend systems.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    avatar: "https://i.pravatar.cc/150?img=5",
    text: "Working together was incredible. Every detail felt polished.",
  },
  {
    name: "Michael Ross",
    role: "Founder",
    avatar: "https://i.pravatar.cc/150?img=12",
    text: "Delivered beyond expectations with beautiful code.",
  },
  {
    name: "Emily Parker",
    role: "Engineering Manager",
    avatar: "https://i.pravatar.cc/150?img=32",
    text: "Strong technical skills and excellent communication.",
  },
];

/* ─────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────── */

/**
 * Shared section heading used across all portfolio sections.
 * Renders a centred h2 in the Space Galaxy violet palette with wide
 * letter-spacing and the project's space font stack.
 *
 * @param {object}      props          - Component props.
 * @param {React.ReactNode} props.children - Heading text content.
 * @returns {JSX.Element} Styled h2 element.
 */
function SectionTitle({ children }) {
  return (
    <h2
      className="text-center text-3xl md:text-5xl font-bold tracking-[0.25em] text-violet-300 mb-20"
      style={{ fontFamily: SPACE_FONT }}
    >
      {children}
    </h2>
  );
}

/* ─────────────────────────────────────────────
   GALAXY BACKGROUND  (unchanged from original)
───────────────────────────────────────────── */
/**
 * Full-page animated canvas background for the Space Galaxy theme.
 * Draws three radial nebula gradient blobs and 350 drifting star
 * particles that loop from bottom to top at varying speeds and opacities.
 * Cleans up the animation frame and resize listener on unmount.
 *
 * @returns {JSX.Element} A full-bleed <canvas> element.
 */
function GalaxyBackground() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animation;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const stars = [...Array(350)].map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      speed: 0.04 + Math.random() * 0.35,
      opacity: 0.5 + Math.random() * 0.5,
    }));

    function drawNebula(x, y, radius, color) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#03020A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawNebula(canvas.width * 0.25, canvas.height * 0.3, 420, "rgba(168,85,247,.28)");
      drawNebula(canvas.width * 0.7,  canvas.height * 0.4, 480, "rgba(59,130,246,.22)");
      drawNebula(canvas.width * 0.5,  canvas.height * 0.75,430, "rgba(236,72,153,.18)");
      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
      });
      animation = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ─────────────────────────────────────────────
   SKILL CONSTELLATION  (unchanged from original)
───────────────────────────────────────────── */
/**
 * Interactive SVG skill constellation for the Space Galaxy theme.
 * Renders 10 skill nodes at fixed percentage-based positions connected
 * by dashed lines. Lines are drawn on a lower z-index layer so they
 * terminate cleanly at each circle's edge (offset by DOT_R = 12 px).
 * Clicking a node toggles a tooltip showing the skill name.
 * Height is fluid via clamp() for mobile responsiveness.
 *
 * @returns {JSX.Element} Positioned container with SVG lines and skill buttons.
 */
function SkillConstellation() {
  const [active, setActive] = useState();
  const containerRef = useRef();

  // Positions as percentages [x%, y%]
  const positions = [
    [50, 10], [72, 25], [85, 50], [70, 74], [50, 88],
    [24, 72], [14, 50], [26, 25], [50, 50], [40, 35],
  ];

  // Dot radius in px (w-6 = 24px → radius 12px). We shorten each line
  // endpoint by this amount so the line stops at the circle edge.
  const DOT_R = 12;

  // Compute the shortened line endpoints between two percentage-based points.
  // We work in a reference coordinate space of 1000×430 (matches container).
  const W_REF = 1000;
  const H_REF = 430;

  function shortenedLine(p, n) {
    const x1 = (p[0] / 100) * W_REF;
    const y1 = (p[1] / 100) * H_REF;
    const x2 = (n[0] / 100) * W_REF;
    const y2 = (n[1] / 100) * H_REF;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return { x1, y1, x2, y2 };
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: x1 + ux * DOT_R,
      y1: y1 + uy * DOT_R,
      x2: x2 - ux * DOT_R,
      y2: y2 - uy * DOT_R,
    };
  }

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "clamp(300px, 55vw, 430px)" }}>

      {/* ── Lines layer — z-0, renders BEHIND the dot buttons ── */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        viewBox={`0 0 ${W_REF} ${H_REF}`}
        preserveAspectRatio="none"
      >
        {positions.map((p, i) => {
          const n = positions[(i + 1) % positions.length];
          const { x1, y1, x2, y2 } = shortenedLine(p, n);
          return (
            <line
              key={i}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke="rgba(167,139,250,.45)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* ── Dot + label buttons — z-10, renders ON TOP of lines ── */}
      {skills.map((skill, i) => (
        <button
          key={skill}
          onClick={() => setActive(active === skill ? null : skill)}
          className="absolute flex flex-col items-center"
          style={{
            left: `${positions[i][0]}%`,
            top: `${positions[i][1]}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          {/* Outer glow ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 36, height: 36,
              top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          {/* Core dot */}
          <div
            className="w-6 h-6 rounded-full bg-violet-400 shadow-[0_0_20px_rgba(167,139,250,.9)]"
            style={{ flexShrink: 0 }}
          />
          {/* Label */}
          <div
            className="text-xs mt-2 whitespace-nowrap text-slate-300"
            style={{ textShadow: "0 0 8px rgba(167,139,250,0.6)" }}
          >
            {skill}
          </div>
        </button>
      ))}

      {/* Active tooltip */}
      {active && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur border border-violet-500/30 rounded-xl px-6 py-3 text-violet-300 font-semibold tracking-widest text-sm" style={{ zIndex: 20 }}>
          ✦ {active}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   INTRO SECTION  — updated: Alex Rivera layout
   with stats sidebar (5+ yrs, 48+ projects,
   32+ clients) and social icon buttons
───────────────────────────────────────────── */
/**
 * Hero introduction section (01 — INTRODUCTION).
 * Displays a two-column card: the left column shows the developer name
 * and title; the right column shows three stats (years, projects, clients)
 * and a row of social icon links rendered as aria-disabled placeholders
 * until real URLs are supplied in the data constants above.
 *
 * @returns {JSX.Element} Full-viewport-height intro section.
 */
function IntroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid md:grid-cols-[1fr_220px] gap-0 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/[0.02]">

        {/* Left — name + subtitle */}
        <div className="p-10 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/10">
          <p className="text-xs tracking-[0.35em] text-violet-400 mb-5 font-medium">
            01 — INTRODUCTION
          </p>
          <h1 className="text-6xl md:text-8xl font-black leading-none text-white mb-6">
            ALEX<br />RIVERA
          </h1>
          <div className="flex items-center gap-3 text-slate-400 tracking-[0.18em] text-sm">
            <span className="w-8 h-px bg-violet-400 inline-block" />
            FULL STACK DEVELOPER &amp; CREATIVE TECHNOLOGIST
          </div>
        </div>

        {/* Right — stats + socials */}
        <div className="flex flex-col divide-y divide-white/10">
          {[
            { val: "5+",  label: "YEARS"    },
            { val: "48+", label: "PROJECTS" },
            { val: "32+", label: "CLIENTS"  },
          ].map(({ val, label }) => (
            <div key={label} className="flex-1 flex flex-col justify-center px-8 py-6">
              <span className="text-4xl font-black text-violet-400 leading-none">{val}</span>
              <span className="text-xs tracking-[0.25em] text-slate-500 mt-1">{label}</span>
            </div>
          ))}

          {/* Social icon row */}
          <div className="px-8 py-6 flex items-center gap-3">
            {[
              { Icon: Github,   label: "GitHub"   },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Twitter,  label: "Twitter"  },
              { Icon: Mail,     label: "Email"    },
            ].map(({ Icon, label }) => (
              <span
                key={label}
                aria-label={label}
                title={label}
                className="w-9 h-9 flex items-center justify-center rounded border border-white/20 text-slate-500 cursor-not-allowed select-none"
                aria-disabled="true"
              >
                <Icon size={15} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT SECTION  — uses that man's photo
   from pravatar (img=12 = Michael Ross look)
───────────────────────────────────────────── */
/**
 * Personal bio section (02 — ABOUT).
 * Renders a two-column layout: an inline SVG astronaut avatar on the left
 * (no external image asset) and a bio paragraph on the right.
 * Uses the shared SectionTitle component for the heading.
 *
 * @returns {JSX.Element} About section with avatar and bio text.
 */
function AboutSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl w-full border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/[0.02]">
        <p className="text-xs tracking-[0.35em] text-violet-400 font-medium px-10 pt-10 pb-0">
          02 — ABOUT
        </p>
        <div className="grid md:grid-cols-[200px_1fr] gap-10 p-10">
          {/* SVG Avatar — no external image asset */}
          <div className="flex flex-col items-start gap-4">
            <div className="w-36 h-36 rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950 to-indigo-950 flex items-center justify-center overflow-hidden relative">
              {/* Subtle glow ring */}
              <div className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: "inset 0 0 30px rgba(139,92,246,0.15)" }} />
              {/* Inline astronaut SVG */}
              <svg viewBox="0 0 100 110" width="88" height="96" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Helmet */}
                <circle cx="50" cy="38" r="26" fill="url(#av-h)" />
                {/* Visor */}
                <circle cx="50" cy="38" r="20" fill="url(#av-v)" opacity="0.93" />
                {/* Visor shine */}
                <ellipse cx="43" cy="31" rx="6" ry="3.5" fill="white" opacity="0.13" transform="rotate(-30 43 31)" />
                {/* Body */}
                <path d="M22 100 Q22 68 50 68 Q78 68 78 100 Z" fill="url(#av-s)" />
                {/* Chest panel */}
                <rect x="40" y="72" width="20" height="12" rx="3" fill="rgba(99,102,241,0.4)" stroke="rgba(139,92,246,0.55)" strokeWidth="0.8" />
                <circle cx="46" cy="78" r="2" fill="#a78bfa" />
                <circle cx="50" cy="78" r="2" fill="#67e8f9" />
                <circle cx="54" cy="78" r="2" fill="#f472b6" />
                {/* Arms */}
                <path d="M22 72 Q13 76 16 88 Q19 93 26 91 L28 75 Z" fill="url(#av-s)" />
                <path d="M78 72 Q87 76 84 88 Q81 93 74 91 L72 75 Z" fill="url(#av-s)" />
                {/* Stars on helmet */}
                <circle cx="58" cy="32" r="1" fill="white" opacity="0.6" />
                <circle cx="45" cy="44" r="0.7" fill="white" opacity="0.4" />
                <circle cx="62" cy="42" r="0.8" fill="white" opacity="0.5" />
                <defs>
                  <radialGradient id="av-h" cx="38%" cy="32%">
                    <stop offset="0%" stopColor="#3b0764" />
                    <stop offset="100%" stopColor="#0f0628" />
                  </radialGradient>
                  <radialGradient id="av-v" cx="38%" cy="32%">
                    <stop offset="0%" stopColor="rgba(103,232,249,0.22)" />
                    <stop offset="60%" stopColor="rgba(79,70,229,0.1)" />
                    <stop offset="100%" stopColor="rgba(10,3,32,0.88)" />
                  </radialGradient>
                  <linearGradient id="av-s" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#312e81" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold tracking-wide" style={{ fontFamily: SPACE_FONT }}>Alex Rivera</p>
              <p className="text-slate-500 text-xs tracking-widest">FULL STACK DEV</p>
            </div>
          </div>

          {/* Bio text */}
          <div className="flex flex-col justify-center">
            <SectionTitle>ABOUT ME</SectionTitle>
            <p className="text-lg leading-8 text-slate-300">
              Passionate developer with 5+ years of experience crafting beautiful,
              performant web applications. I love turning complex problems into
              elegant, user-friendly solutions.
            </p>
            <p className="text-lg leading-8 text-slate-300 mt-4">
              When I&apos;m not coding, I&apos;m exploring new technologies,
              contributing to open source, or experimenting with digital art.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROJECT GALAXY  — numbered list with
   description, tech tags, LIVE SITE + SOURCE
───────────────────────────────────────────── */
/**
 * Project showcase section (04 — PROJECT GALAXY).
 * Iterates over the {@link projects} data array and renders each entry as
 * a numbered table row with title, description, tech-stack tags, and
 * LIVE SITE / SOURCE links. Links render as interactive anchors when a
 * URL is provided, or as aria-disabled placeholder spans when {@code null}.
 *
 * @returns {JSX.Element} Bordered list of project rows.
 */
function ProjectsSection() {
  return (
    <section className="px-6 py-28 max-w-6xl mx-auto w-full">
      <SectionTitle>PROJECT GALAXY</SectionTitle>
      <div className="border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/[0.02] divide-y divide-white/10">
        {projects.map((p) => (
          <div
            key={p.num}
            className="grid md:grid-cols-[80px_1fr_160px] gap-0 hover:bg-white/[0.03] transition-colors"
          >
            {/* Number */}
            <div className="flex items-start pt-8 pl-8">
              <span className="text-xs font-mono text-violet-500 tracking-widest">{p.num}</span>
            </div>

            {/* Title + desc + tags */}
            <div className="px-6 py-8 border-l border-white/10">
              <h3 className="text-lg font-black tracking-[0.12em] text-white mb-3">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-6 mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] tracking-widest px-2.5 py-1 border border-white/15 text-slate-400 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col justify-start gap-3 pt-8 pr-8 pl-6 border-l border-white/10">
              {p.live ? (
                <a href={p.live} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs tracking-widest text-slate-300 hover:text-violet-300 transition-colors">
                  <ExternalLink size={12} /> LIVE SITE
                </a>
              ) : (
                <span className="flex items-center gap-2 text-xs tracking-widest text-slate-600 cursor-not-allowed select-none" aria-disabled="true">
                  <ExternalLink size={12} /> LIVE SITE
                </span>
              )}
              {p.source ? (
                <a href={p.source} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs tracking-widest text-slate-300 hover:text-violet-300 transition-colors">
                  <Code2 size={12} /> SOURCE
                </a>
              ) : (
                <span className="flex items-center gap-2 text-xs tracking-widest text-slate-600 cursor-not-allowed select-none" aria-disabled="true">
                  <Code2 size={12} /> SOURCE
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   EXPERIENCE ORBIT  — period + company (violet)
   + role (bold) + description paragraph
───────────────────────────────────────────── */
/**
 * Work history section (05 — EXPERIENCE ORBIT).
 * Renders a sticky label column on the left and a divided list of roles on
 * the right. Each entry shows the date range, company name (in violet),
 * role title, and a description paragraph sourced from {@link experience}.
 *
 * @returns {JSX.Element} Two-column experience timeline.
 */
function ExperienceSection() {
  return (
    <section className="px-6 py-28 max-w-6xl mx-auto w-full">
      <div className="grid md:grid-cols-[220px_1fr] gap-0 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/[0.02]">

        {/* Sticky label */}
        <div className="p-10 md:p-12 border-b md:border-b-0 md:border-r border-white/10 flex items-start">
          <p className="text-xs tracking-[0.3em] text-violet-400 font-medium">
            05 — EXPERIENCE
          </p>
        </div>

        {/* Entries */}
        <div className="divide-y divide-white/10">
          {experience.map((e) => (
            <div
              key={e.company}
              className="grid md:grid-cols-[160px_1fr] gap-6 p-8 hover:bg-white/[0.02] transition-colors"
            >
              {/* Period + company */}
              <div>
                <p className="text-xs tracking-widest text-slate-500 mb-1">{e.period}</p>
                <p className="text-sm font-bold tracking-[0.15em] text-violet-400">{e.company}</p>
              </div>

              {/* Role + desc */}
              <div>
                <h3 className="text-base font-black tracking-[0.1em] text-white mb-3">{e.role}</h3>
                <p className="text-sm leading-6 text-slate-400">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS  (unchanged structure)
───────────────────────────────────────────── */
/**
 * Social proof section (06 — TESTIMONIAL SIGNALS).
 * Maps over {@link testimonials} and renders each as a card with a CSS
 * initials avatar (no external images), quote text, name, and role.
 * Avatar colours cycle through violet, cyan, and rose to match the
 * Space Galaxy palette.
 *
 * @returns {JSX.Element} Three-column testimonial grid.
 */
function TestimonialsSection() {
  return (
    <section className="px-6 py-28">
      <SectionTitle>TESTIMONIAL SIGNALS</SectionTitle>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t) => {
          // Derive initials from name
          const initials = t.name.split(" ").map(w => w[0]).join("").slice(0, 2);
          // Cycle colors per testimonial
          const colors = [
            { bg: "rgba(109,40,217,0.25)", border: "rgba(139,92,246,0.4)", text: "#c4b5fd" },
            { bg: "rgba(8,145,178,0.2)",   border: "rgba(34,211,238,0.4)", text: "#67e8f9" },
            { bg: "rgba(190,18,60,0.2)",   border: "rgba(244,114,182,0.4)",text: "#f9a8d4" },
          ];
          const idx = testimonials.indexOf(t);
          const c = colors[idx % colors.length];
          return (
          <div
            key={t.name}
            className="rounded-2xl bg-slate-900/30 backdrop-blur-xl p-8 text-center border border-white/10 hover:border-violet-500/30 transition-colors"
          >
            {/* CSS initials avatar — no external image */}
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-xl font-bold"
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                color: c.text,
                fontFamily: SPACE_FONT,
                boxShadow: `0 0 20px ${c.bg}`,
              }}
            >
              {initials}
            </div>
            <p className="text-slate-300 leading-7 italic">&ldquo;{t.text}&rdquo;</p>
            <h4 className="mt-6 text-violet-300 font-bold tracking-wide">{t.name}</h4>
            <p className="text-slate-500 text-sm">{t.role}</p>
          </div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT — Send a Message form (left) +
   Connect With Me panel (right) with email
   copy button + GitHub / LinkedIn / Twitter
───────────────────────────────────────────── */
/**
 * Contact section (07 — OPEN CHANNELS).
 * Left card: a controlled form with accessible labels (sr-only) for name,
 * email, and message fields. Shows a success state for 3 s after submit.
 * Right card: an email display with a clipboard-copy button, social media
 * links as aria-disabled placeholders, location line, and footer credits.
 *
 * @returns {JSX.Element} Two-column contact panel.
 */
function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const email = "alex.rivera@email.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  const inputCls =
    "w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors";

  return (
    <section className="px-6 py-28">
      {/* Label pill */}
      <div className="flex justify-center mb-6">
        <span className="text-xs tracking-[0.25em] px-4 py-2 rounded-full border border-violet-500/40 text-violet-400 bg-violet-500/10 flex items-center gap-2">
          <Mail size={11} /> CONTACT <Mail size={11} />
        </span>
      </div>

      <SectionTitle>OPEN CHANNELS</SectionTitle>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        {/* ── Send a Message ── */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8">
          <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="sg-name" className="sr-only">Your name</label>
              <input
                id="sg-name"
                name="name"
                autoComplete="name"
                className={inputCls}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="sg-email" className="sr-only">Your email</label>
              <input
                id="sg-email"
                name="email"
                type="email"
                autoComplete="email"
                className={inputCls}
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="sg-message" className="sr-only">Your message</label>
              <textarea
                id="sg-message"
                name="message"
                className={`${inputCls} resize-y min-h-[130px]`}
                placeholder="Your message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 transition-colors text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2"
            >
              {sent ? (
                <><Check size={15} /> Message Sent!</>
              ) : (
                <><Send size={15} /> Send Message</>
              )}
            </button>
          </form>
        </div>

        {/* ── Connect With Me ── */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white">Connect With Me</h3>

          {/* Email copy row */}
          <div>
            <p className="text-xs tracking-[0.2em] text-violet-400 mb-2">Email Me</p>
            <div className="flex items-center justify-between bg-violet-500/8 border border-violet-500/20 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Mail size={14} className="text-violet-400" />
                {email}
              </div>
              <button
                onClick={handleCopy}
                className="text-slate-500 hover:text-violet-300 transition-colors ml-3 flex-shrink-0"
                aria-label="Copy email"
              >
                {copied ? <Check size={14} className="text-violet-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Social buttons */}
          <div className="flex flex-wrap gap-3">
            {[
              { Icon: Github,   label: "GitHub",  cls: "bg-slate-800" },
              { Icon: Linkedin, label: "LinkedIn", cls: "bg-blue-700"  },
              { Icon: Twitter,  label: "Twitter",  cls: "bg-sky-500"   },
            ].map(({ Icon, label, cls }) => (
              <span
                key={label}
                aria-label={label}
                title={label}
                aria-disabled="true"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white/50 text-sm font-semibold cursor-not-allowed select-none ${cls} opacity-60`}
              >
                <Icon size={15} /> {label}
              </span>
            ))}
          </div>

          {/* Divider + location */}
          <div className="border-t border-white/10 pt-4 flex items-center gap-2 text-slate-500 text-sm">
            <MapPin size={14} className="text-violet-500" /> Deep Space Sector 7G
          </div>

          {/* Footer copy */}
          <div className="mt-auto text-center border-t border-white/10 pt-6">
            <p className="text-slate-500 text-xs">© 2026 Alex Rivera</p>
            <p className="text-violet-500 text-xs mt-1 tracking-wide">
              Made with ♥ · Space Galaxy Theme
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT  — same outer shell as original
───────────────────────────────────────────── */
/**
 * Space Galaxy — About page template.
 *
 * Root component that composes all portfolio sections inside a single
 * full-page wrapper with the animated {@link GalaxyBackground} canvas.
 * Designed to be dropped directly into any page as a standalone module.
 *
 * Sections rendered (in order):
 *  01 — Introduction  {@link IntroSection}
 *  02 — About         {@link AboutSection}
 *  03 — Skills        {@link SkillConstellation}
 *  04 — Projects      {@link ProjectsSection}
 *  05 — Experience    {@link ExperienceSection}
 *  06 — Testimonials  {@link TestimonialsSection}
 *  07 — Contact       {@link ContactSection}
 *
 * @returns {JSX.Element} Complete portfolio About page.
 */
export default function About() {
  return (
    <section className="relative overflow-hidden text-white">
      {/* Galaxy background — same as original */}
      <div className="absolute inset-0">
        <GalaxyBackground />
      </div>

      <div className="relative z-10">

        {/* 01 — INTRO  (updated: Alex Rivera + stats sidebar) */}
        <IntroSection />

        {/* 02 — ABOUT ME  (updated: photo + bio) */}
        <AboutSection />

        {/* 03 — SKILL CONSTELLATION  (unchanged) */}
        <section className="px-6 py-28">
          <SectionTitle>SKILL CONSTELLATION</SectionTitle>
          <SkillConstellation />
        </section>

        {/* 04 — PROJECT GALAXY  (updated: numbered list + tags + links) */}
        <ProjectsSection />

        {/* 05 — EXPERIENCE ORBIT  (updated: Vercel/Figma/Stripe/Startup) */}
        <ExperienceSection />

        {/* 06 — TESTIMONIAL SIGNALS  (unchanged) */}
        <TestimonialsSection />

        {/* 07 — OPEN CHANNELS  (updated: form + email copy + social btns) */}
        <ContactSection />

      </div>
    </section>
  );
}