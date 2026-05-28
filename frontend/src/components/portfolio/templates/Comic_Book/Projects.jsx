import React, { useState } from "react";
import { GithubIcon, ExternalLink, Zap, Star, Rocket, Code2, Bug, Gamepad2, Cloud } from "lucide-react";

/* ─────────────────────────────────────────────
   MOCK DATA  (fully self-contained)
 ───────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    title: "Career Pilot",
    description:
      "AI-powered career guidance platform that matches job seekers with their dream roles using smart resume analysis and personalized roadmaps.",
    tags: ["React", "Node.js", "MongoDB", "OpenAI", "TailwindCSS"],
    liveLink: "https://career-pilot.vercel.app",
    githubLink: "https://github.com/anurag3407/career-pilot",
    accentColor: "bg-yellow-400",
    borderColor: "border-yellow-500",
    icon: <Rocket className="w-6 h-6" />,
    panelSize: "col-span-1 md:col-span-2",
    badge: "⚡ FEATURED",
    badgeBg: "bg-red-500",
    rotate: "-rotate-1",
  },
  {
    id: 2,
    title: "DevChat Hub",
    description:
      "Real-time collaborative coding chat with syntax highlighting, code execution, and GitHub integration for developers.",
    tags: ["Socket.io", "Express", "Monaco Editor", "Redis"],
    liveLink: "https://devchat.io",
    githubLink: "https://github.com/user/devchat-hub",
    accentColor: "bg-sky-400",
    borderColor: "border-sky-500",
    icon: <Code2 className="w-6 h-6" />,
    panelSize: "col-span-1",
    badge: "🔥 HOT",
    badgeBg: "bg-orange-500",
    rotate: "rotate-1",
  },
  {
    id: 3,
    title: "PixelMart",
    description:
      "Full-stack e-commerce platform with real-time inventory, Stripe payments, and an admin dashboard.",
    tags: ["Next.js", "Stripe", "PostgreSQL", "Prisma", "Vercel"],
    liveLink: "https://pixelmart.store",
    githubLink: "https://github.com/user/pixelmart",
    accentColor: "bg-pink-400",
    borderColor: "border-pink-500",
    icon: <Star className="w-6 h-6" />,
    panelSize: "col-span-1",
    badge: "🛒 SOLD OUT",
    badgeBg: "bg-purple-600",
    rotate: "-rotate-1",
  },
  {
    id: 4,
    title: "NeuralDraw",
    description:
      "Browser-based generative art tool powered by TensorFlow.js that creates comic-style illustrations from text prompts.",
    tags: ["TensorFlow.js", "Canvas API", "Vue 3", "FastAPI"],
    liveLink: "https://neuraldraw.art",
    githubLink: "https://github.com/user/neuraldraw",
    accentColor: "bg-green-400",
    borderColor: "border-green-500",
    icon: <Zap className="w-6 h-6" />,
    panelSize: "col-span-1 md:col-span-2",
    badge: "🤖 AI",
    badgeBg: "bg-indigo-500",
    rotate: "rotate-1",
  },
  {
    id: 5,
    title: "BUG BUSTER",
    description:
      "A smart debug assistant and log analyzer that sweeps through source code, isolating memory leaks and fixing styling issues on the fly.",
    tags: ["TypeScript", "Node.js", "Docker", "Puppeteer"],
    liveLink: "https://bugbuster.dev",
    githubLink: "https://github.com/user/bug-buster",
    accentColor: "bg-red-400",
    borderColor: "border-red-500",
    icon: <Bug className="w-6 h-6" />,
    panelSize: "col-span-1",
    badge: "🐛 EXTERMINATED",
    badgeBg: "bg-green-600",
    rotate: "rotate-1",
  },
  {
    id: 6,
    title: "CRYPTOCLASH",
    description:
      "A fast-paced card battling game built on blockchain protocols with unique collectible character cards as custom digital tokens.",
    tags: ["React", "Solidity", "Ethers.js", "Web3.js"],
    liveLink: "https://cryptoclash.game",
    githubLink: "https://github.com/user/cryptoclash",
    accentColor: "bg-purple-400",
    borderColor: "border-purple-500",
    icon: <Gamepad2 className="w-6 h-6" />,
    panelSize: "col-span-1",
    badge: "🎮 PLAYABLE",
    badgeBg: "bg-yellow-500",
    rotate: "-rotate-1",
  },
  {
    id: 7,
    title: "HELIOS WEATHER",
    description:
      "An interactive weather visualization hub featuring dynamic, hand-drawn anime skies that change live based on local climate data.",
    tags: ["React", "TailwindCSS", "Framer Motion", "OpenWeather API"],
    liveLink: "https://heliosweather.app",
    githubLink: "https://github.com/user/helios-weather",
    accentColor: "bg-orange-400",
    borderColor: "border-orange-500",
    icon: <Cloud className="w-6 h-6" />,
    panelSize: "col-span-1",
    badge: "☀️ LIVE NOW",
    badgeBg: "bg-pink-500",
    rotate: "rotate-1",
  },
];

/* ─────────────────────────────────────────────
   DOT-PATTERN SVG BACKGROUND (inline)
───────────────────────────────────────────── */
const DotPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="comic-dots"
        x="0"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="4" cy="4" r="2.5" fill="black" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#comic-dots)" />
  </svg>
);

/* ─────────────────────────────────────────────
   SPEECH BUBBLE (section title decoration)
───────────────────────────────────────────── */
const SpeechBubble = ({ text }) => (
  <div className="relative inline-block">
    <div
      className="bg-white border-4 border-black px-6 py-3 rounded-2xl font-black text-black uppercase text-lg tracking-widest
                    shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
    >
      {text}
    </div>
    {/* tail */}
    <div
      className="absolute -bottom-4 left-8 w-0 h-0
                    border-l-[14px] border-l-transparent
                    border-t-[18px] border-t-black
                    border-r-[0px] border-r-transparent"
    />
    <div
      className="absolute -bottom-[13px] left-[35px] w-0 h-0
                    border-l-[10px] border-l-transparent
                    border-t-[14px] border-t-white
                    border-r-[0px] border-r-transparent"
    />
  </div>
);

/* ─────────────────────────────────────────────
   SINGLE PROJECT CARD
───────────────────────────────────────────── */
const ProjectCard = ({ project }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative group ${project.panelSize} transition-all duration-200 ease-out
                  ${hovered ? "scale-[1.03] -translate-y-1 z-20" : "scale-100 z-10"}
                  ${project.rotate}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card shell */}
      <div
        className={`relative overflow-hidden bg-white border-4 border-black h-full flex flex-col
                    transition-shadow duration-200
                    ${hovered
            ? "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
            : "shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
          }`}
      >
        {/* Coloured header strip */}
        <div className={`${project.accentColor} border-b-4 border-black p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            {/* Icon bubble */}
            <div className="bg-white border-4 border-black rounded-full p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {project.icon}
            </div>
            <h3 className="font-black text-black uppercase text-xl leading-none tracking-tight drop-shadow-[2px_2px_0px_rgba(255,255,255,0.6)]">
              {project.title}
            </h3>
          </div>
          {/* Badge */}
          <span
            className={`${project.badgeBg} text-white text-xs font-black uppercase px-3 py-1
                         border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-2 whitespace-nowrap`}
          >
            {project.badge}
          </span>
        </div>

        {/* Diagonal stripe divider */}
        <div
          className="w-full h-3 border-b-4 border-black"
          style={{
            background:
              "repeating-linear-gradient(-45deg, #000 0, #000 3px, #fff 3px, #fff 10px)",
          }}
        />

        {/* Body */}
        <div className="flex-1 p-5 flex flex-col gap-4 bg-white relative">
          {/* Description */}
          <p className="text-sm font-bold text-gray-800 leading-snug">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-black text-white text-[11px] font-black uppercase px-2 py-[3px] tracking-wider
                           border border-black shadow-[2px_2px_0px_0px_rgba(255,215,0,0.9)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-black text-white text-xs font-black uppercase px-4 py-2
                         border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)]
                         hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.6)] hover:-translate-y-px hover:-translate-x-px
                         transition-all duration-150"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 ${project.accentColor} text-black text-xs font-black uppercase px-4 py-2
                          border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)]
                          hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,0.6)] hover:-translate-y-px hover:-translate-x-px
                          transition-all duration-150`}
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          </div>
        </div>

        {/* Corner fold decoration */}
        <div
          className="absolute bottom-0 right-0 w-10 h-10 border-t-4 border-l-4 border-black"
          style={{
            background: "linear-gradient(135deg, transparent 50%, #e5e7eb 50%)",
          }}
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function Projects() {
  return (
    <section
      id="projects"
      className="relative w-full overflow-hidden bg-yellow-50 py-20 px-4 sm:px-8"
    >
      {/* Full-section dot pattern */}
      <DotPattern />

      {/* Decorative torn-edge top */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-5 bg-black"
        style={{
          clipPath:
            "polygon(0 0,4% 100%,8% 0,12% 100%,16% 0,20% 100%,24% 0,28% 100%,32% 0,36% 100%,40% 0,44% 100%,48% 0,52% 100%,56% 0,60% 100%,64% 0,68% 100%,72% 0,76% 100%,80% 0,84% 100%,88% 0,92% 100%,96% 0,100% 100%,100% 0)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <div className="flex flex-col items-center gap-6 mb-16 text-center">
          {/* Big title */}
          <div className="relative inline-block">
            <h2
              className="relative z-10 text-5xl sm:text-7xl font-black uppercase text-black tracking-tighter -rotate-1
                         drop-shadow-[6px_6px_0px_rgba(250,204,21,1)]"
            >
              My Projects
            </h2>
            {/* underline swipe */}
            <div className="absolute -bottom-2 left-0 w-full h-4 bg-red-500 border-2 border-black -rotate-1 -z-0" />
          </div>

          {/* Speech bubble sub-heading */}
          <div className="mt-6 rotate-1">
            <SpeechBubble text="🦸 What I've Built So Far..." />
          </div>

          {/* Count badge */}
          <div
            className="mt-4 bg-black text-yellow-400 font-black uppercase text-sm px-5 py-2
                          border-4 border-yellow-400 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] -rotate-1"
          >
            {PROJECTS.length} Epic Missions Completed
          </div>
        </div>

        {/* ── Asymmetric Comic Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* ── Bottom CTA strip ── */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="relative">
            <div
              className="bg-red-500 text-white font-black uppercase text-base px-8 py-4 border-4 border-black
                            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1 tracking-wider
                            hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-px hover:-translate-y-px
                            transition-all duration-150 cursor-pointer inline-flex items-center gap-3"
            >
              <Zap className="w-5 h-5" />
              View All on GitHub
              <Github className="w-5 h-5" />
            </div>
          </div>
          {/* Exclamation bubble */}
          <div
            className="bg-yellow-400 text-black font-black uppercase text-sm px-5 py-3 border-4 border-black
                          shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2"
          >
            POW! More coming soon 💥
          </div>
        </div>
      </div>

      {/* Decorative torn-edge bottom */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full h-5 bg-black"
        style={{
          clipPath:
            "polygon(0 100%,4% 0,8% 100%,12% 0,16% 100%,20% 0,24% 100%,28% 0,32% 100%,36% 0,40% 100%,44% 0,48% 100%,52% 0,56% 100%,60% 0,64% 100%,68% 0,72% 100%,76% 0,80% 100%,84% 0,88% 100%,92% 0,96% 100%,100% 0,100% 100%)",
        }}
      />
    </section>
  );
}
