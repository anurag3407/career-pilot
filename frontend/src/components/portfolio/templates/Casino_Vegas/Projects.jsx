import React from "react";
import {
  Trophy,
  Dice5,
  Star,
  Sparkles,
  ExternalLink,
  Github,
} from "lucide-react";

const projects = [
  {
    title: "Royal Poker App",
    description:
      "A luxury poker platform with live tables, tournaments, and real-time multiplayer gameplay.",
    tech: ["React", "Tailwind", "Socket.io"],
    icon: Dice5,
    color: "from-red-500 to-yellow-400",
  },
  {
    title: "Vegas Slot Machine",
    description:
      "An animated casino slot game with neon effects, jackpot sounds, and responsive gameplay.",
    tech: ["JavaScript", "Framer Motion", "CSS"],
    icon: Trophy,
    color: "from-pink-500 to-orange-400",
  },
  {
    title: "Diamond Casino UI",
    description:
      "A premium casino dashboard featuring betting analytics and glowing Vegas-inspired visuals.",
    tech: ["React", "Chart.js", "Tailwind"],
    icon: Star,
    color: "from-yellow-300 to-red-500",
  },
];

export default function Projects() {
  return (
    <section className="relative overflow-hidden bg-black py-20 px-6 text-white">
      {/* Neon Glow */}
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-red-500/20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-500/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Sparkles className="animate-pulse text-yellow-400" size={32} />

            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.9)]">
              Jackpot Projects
            </h2>
          </div>

          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Neon lights, luxury vibes, and Vegas-inspired experiences crafted
            with modern web technologies.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const Icon = project.icon;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-white/5 p-8 backdrop-blur-lg transition-all duration-500 hover:-translate-y-3 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.4)]"
              >
                {/* Hover Gradient */}
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20 bg-gradient-to-br ${project.color}`}
                ></div>

                {/* Icon */}
                <div
                  className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r p-4 shadow-lg ${project.color}`}
                >
                  <Icon className="text-white" size={34} />
                </div>

                {/* Title */}
                <h3 className="mb-4 text-2xl font-bold text-yellow-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="mb-6 leading-relaxed text-gray-300">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-8 flex flex-wrap gap-3">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-4 py-1 text-sm text-yellow-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2 font-semibold text-black transition hover:scale-105 hover:bg-yellow-300">
                    Live Demo
                    <ExternalLink size={18} />
                  </button>

                  <button className="flex items-center gap-2 rounded-full border border-yellow-400 px-5 py-2 font-semibold text-yellow-300 transition hover:bg-yellow-400 hover:text-black">
                    Code
                    <Github size={18} />
                  </button>
                </div>

                {/* Casino Chip */}
                <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full border-[10px] border-red-500/40"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}