import React from "react";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Stethoscope,
  ArrowUpRight,
} from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "AI Health Monitor",
      description:
        "Real-time patient monitoring dashboard using AI-powered analytics and wearable devices.",
      icon: HeartPulse,
      tech: ["React", "AI", "Tailwind"],
    },
    {
      title: "Smart Diagnosis System",
      description:
        "Medical diagnosis assistant that helps doctors analyze symptoms and patient records efficiently.",
      icon: Stethoscope,
      tech: ["Machine Learning", "Node.js", "MongoDB"],
    },
    {
      title: "Emergency Care Platform",
      description:
        "Fast emergency response management system designed for hospitals and healthcare centers.",
      icon: ShieldCheck,
      tech: ["React", "Firebase", "API"],
    },
    {
      title: "Fitness Tracking App",
      description:
        "Clean healthcare fitness application with activity tracking and health insights.",
      icon: Activity,
      tech: ["React Native", "Health API", "Charts"],
    },
  ];

  return (
    <section className="w-full py-16 px-6 md:px-12 bg-sky-50 rounded-3xl">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-cyan-700 font-semibold tracking-widest uppercase">
          Featured Projects
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-3">
          Healthcare Innovations
        </h2>

        <p className="text-gray-500 max-w-2xl mx-auto mt-4">
          A collection of modern healthcare and medical technology projects
          focused on improving patient care and digital wellness.
        </p>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => {
          const Icon = project.icon;

          return (
            <div
              key={index}
              className="bg-white border border-cyan-100 rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center mb-6">
                <Icon className="text-cyan-700 w-8 h-8" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-3 mb-6">
                {project.tech.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-sky-100 text-cyan-700 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Button */}
              <button className="flex items-center gap-2 text-cyan-700 font-semibold hover:gap-3 transition-all">
                View Project
                <ArrowUpRight size={18} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
