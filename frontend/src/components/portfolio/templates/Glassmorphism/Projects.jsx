
import React from "react";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "AI Portfolio",
    description: "Modern AI-powered portfolio website with smooth animations and responsive design.",
    tech: ["React", "Tailwind", "Node.js"],
  },
  {
    title: "Task Manager",
    description: "A productivity app for managing daily tasks with clean UI and fast performance.",
    tech: ["MongoDB", "Express", "React"],
  },
  {
    title: "Weather App",
    description: "Beautiful weather forecasting application using real-time API integration.",
    tech: ["JavaScript", "API", "CSS"],
  },
];

export default function Projects() {
  return (
    <section className="w-full min-h-screen px-6 py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            My Projects
          </h2>

          <p className="text-gray-300 mt-4 text-lg">
            Showcasing some of my featured works and creative developments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:scale-105 hover:bg-white/15 transition-all duration-300"
            >

              <div className="mb-5">
                <h3 className="text-2xl font-semibold text-white">
                  {project.title}
                </h3>

                <p className="text-gray-300 mt-3 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-white/10 border border-white/20 text-gray-200"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition">
                  <Github size={18} />
                  Code
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/30 border border-purple-300/20 text-white hover:bg-purple-500/40 transition">
                  <ExternalLink size={18} />
                  Live
                </button>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
