import React from "react";
import {
  Activity,
  Braces,
  Cpu,
  Database,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

const matrixRows = [
  "0110 0xAF NODE SKILL_STREAM // ACTIVE",
  "1011 0x7C LINK PROJECT_CACHE // SYNC",
  "0010 0xE1 AUTH CREATIVE_CORE // PASS",
  "1101 0x39 TRACE UX_SIGNAL // CLEAN",
  "0101 0xB4 ROUTE API_BRIDGE // LIVE",
  "1110 0x92 HASH VISUAL_LAYER // HOT",
  "0001 0xD8 PING CLIENT_GRID // FAST",
  "1001 0x6F LOAD CAREER_STACK // READY",
];

const telemetry = [
  { label: "signal", value: "99.8%", icon: RadioTower, color: "text-cyan-300" },
  { label: "latency", value: "12ms", icon: Activity, color: "text-lime-300" },
  { label: "firewall", value: "armed", icon: ShieldCheck, color: "text-fuchsia-300" },
];

const accentCards = [
  {
    label: "interface",
    title: "Neon command layer",
    text: "A high-contrast control surface for shipping sharp product experiences.",
    icon: Terminal,
  },
  {
    label: "system",
    title: "Adaptive skill graph",
    text: "Core abilities mapped like live circuitry across design, code, and delivery.",
    icon: Cpu,
  },
  {
    label: "archive",
    title: "Project data vault",
    text: "Selected builds indexed with stack traces, outcomes, and launch signals.",
    icon: Database,
  },
];

function MatrixLine({ row, index }) {
  return (
    <div
      className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b border-cyan-300/10 px-3 py-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-cyan-200/70 sm:text-xs"
      style={{ animationDelay: `${index * 140}ms` }}
    >
      <span className="text-fuchsia-300/80">0{index + 1}</span>
      <span className="truncate">{row}</span>
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.95)]" />
    </div>
  );
}

function SkillNode({ skill, index }) {
  const colorClass = index % 3 === 0 ? "border-cyan-300/50 text-cyan-100" : index % 3 === 1 ? "border-fuchsia-300/50 text-fuchsia-100" : "border-lime-300/50 text-lime-100";

  return (
    <div className={`relative rounded-md border bg-black/35 px-3 py-2 ${colorClass}`}>
      <div className="absolute -left-1 top-1/2 h-px w-3 -translate-y-1/2 bg-current opacity-70" />
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] opacity-70">
        {skill.category || "module"}
      </p>
      <p className="mt-1 truncate text-sm font-black">{skill.name}</p>
      <div className="mt-2 h-1 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-current shadow-[0_0_10px_currentColor]"
          style={{ width: `${skill.level || 76}%` }}
        />
      </div>
    </div>
  );
}

export default function GlitchMatrix() {
  const featuredSkills = data.skills.slice(0, 6);
  const featuredProject = data.projects[0];

  return (
    <section className="relative isolate overflow-hidden bg-[#03040b] px-4 py-16 text-white sm:px-6 md:py-24 lg:px-10">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_18%,rgba(236,72,153,0.28),transparent_28%),radial-gradient(circle_at_84%_26%,rgba(34,211,238,0.22),transparent_30%),linear-gradient(135deg,#03040b_0%,#080313_44%,#050812_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(rgba(34,211,238,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.13)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_5px)] opacity-25" />
      <div className="absolute left-0 top-14 h-px w-full bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      <div className="absolute bottom-10 left-0 h-px w-full bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />

      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.28em] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
            <Sparkles size={14} />
            Glitch Matrix
          </div>

          <h2 className="max-w-3xl font-mono text-4xl font-black uppercase leading-none tracking-normal text-white sm:text-5xl md:text-6xl">
            <span className="relative inline-block text-cyan-200 drop-shadow-[0_0_18px_rgba(34,211,238,0.75)]">
              Decode
              <span className="absolute -right-2 top-1 text-fuchsia-400/80">_</span>
            </span>{" "}
            the portfolio signal
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            {data.personal.name}'s skills, projects, and operating stats rendered as a live cyberpunk data wall.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {telemetry.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_0_24px_rgba(255,255,255,0.035)]">
                <div className={`mb-3 ${color}`}>
                  {React.createElement(Icon, { size: 19 })}
                </div>
                <p className="font-mono text-[0.64rem] uppercase tracking-[0.22em] text-slate-500">{label}</p>
                <p className="mt-1 font-mono text-lg font-black uppercase text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {accentCards.map(({ label, title, text, icon: Icon }) => (
              <article key={title} className="group relative overflow-hidden border border-fuchsia-300/18 bg-[#090611]/80 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/45 hover:shadow-[0_0_28px_rgba(34,211,238,0.16)]">
                <div className="absolute right-0 top-0 h-14 w-14 bg-fuchsia-400/15 [clip-path:polygon(100%_0,0_0,100%_100%)]" />
                <div className="flex items-center gap-2 font-mono text-[0.63rem] uppercase tracking-[0.22em] text-fuchsia-200/80">
                  {React.createElement(Icon, { size: 14 })}
                  {label}
                </div>
                <h3 className="mt-4 text-sm font-black uppercase text-white">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-fuchsia-500/20 via-cyan-400/10 to-lime-300/10 blur-2xl" />
          <div className="relative overflow-hidden border border-cyan-300/30 bg-[#050713]/[0.92] shadow-[0_0_60px_rgba(34,211,238,0.14),inset_0_0_44px_rgba(236,72,153,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-300/20 bg-cyan-300/5 px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] text-cyan-200">
              <span className="flex items-center gap-2">
                <Braces size={16} />
                neural-map.exe
              </span>
              <span className="text-fuchsia-300">access granted</span>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1fr_0.82fr]">
              <div className="relative min-h-[360px] overflow-hidden border-b border-cyan-300/20 lg:border-b-0 lg:border-r">
                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(34,211,238,0.08)_38%,transparent_42%),radial-gradient(circle_at_50%_35%,rgba(236,72,153,0.2),transparent_35%)]" />
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-cyan-300/10 to-transparent" />
                <div className="relative p-4">
                  <div className="mb-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
                    <span>packet stream</span>
                    <span className="text-lime-300">live</span>
                  </div>

                  <div className="overflow-hidden border border-cyan-300/15 bg-black/35">
                    {matrixRows.map((row, index) => (
                      <MatrixLine key={row} row={row} index={index} />
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {featuredSkills.map((skill, index) => (
                      <SkillNode key={skill.name} skill={skill} index={index} />
                    ))}
                  </div>
                </div>
              </div>

              <aside className="relative flex flex-col justify-between gap-5 p-4 sm:p-5">
                <div className="absolute right-5 top-5 h-24 w-24 border border-fuchsia-300/20 bg-fuchsia-400/5 [clip-path:polygon(50%_0,100%_28%,100%_72%,50%_100%,0_72%,0_28%)]" />
                <div className="relative">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-fuchsia-300">featured payload</p>
                  <h3 className="mt-3 max-w-xs text-2xl font-black uppercase leading-tight text-white">
                    {featuredProject.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{featuredProject.description}</p>
                </div>

                <div className="relative grid gap-2">
                  {featuredProject.techStack.slice(0, 5).map((tech, index) => (
                    <div key={tech} className="flex items-center justify-between border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-xs uppercase tracking-[0.16em]">
                      <span className="text-slate-300">{tech}</span>
                      <span className={index % 2 === 0 ? "text-cyan-300" : "text-fuchsia-300"}>0{index + 1}</span>
                    </div>
                  ))}
                </div>

                <div className="relative border border-lime-300/25 bg-lime-300/8 p-4 font-mono">
                  <div className="mb-3 flex items-center gap-2 text-lime-200">
                    <Zap size={15} />
                    <span className="text-xs uppercase tracking-[0.2em]">build status</span>
                  </div>
                  <p className="text-3xl font-black text-lime-200">{data.stats.projectsCompleted}+</p>
                  <p className="mt-1 text-[0.65rem] uppercase tracking-[0.18em] text-lime-100/60">completed deployments</p>
                </div>
              </aside>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-fuchsia-300/20 px-4 py-3 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-slate-500">
              <span>checksum: cp-{data.stats.yearsExperience}{data.stats.happyClients}</span>
              <span className="text-cyan-300">matrix stable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
