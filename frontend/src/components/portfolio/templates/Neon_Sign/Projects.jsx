import React from "react";
import { motion as Motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

const CARD_COLORS = [
  { border: "#ff2bd6", glow: "#ff2bd6", badge: "rgba(255,43,214,0.15)" },
  { border: "#00d4ff", glow: "#00d4ff", badge: "rgba(0,212,255,0.15)" },
  { border: "#39ff14", glow: "#39ff14", badge: "rgba(57,255,20,0.15)" },
  { border: "#ffd000", glow: "#ffd000", badge: "rgba(255,208,0,0.15)" },
  { border: "#b026ff", glow: "#b026ff", badge: "rgba(176,38,255,0.15)" },
  { border: "#ff8c00", glow: "#ff8c00", badge: "rgba(255,140,0,0.15)" },
];

export default function Projects({ data }) {
  const { projects } = data;

  return (
    <section id="projects" className="relative py-20 px-4 md:px-8 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[150px] bg-pink-600 opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[150px] bg-cyan-600 opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div
            className="inline-block px-6 py-3 rounded border-2 border-pink-500 mb-4"
            style={{
              background: "rgba(255,43,214,0.05)",
              boxShadow: "0 0 20px #ff2bd6, 0 0 40px #ff2bd640",
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-black uppercase tracking-widest text-pink-300"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 10px #ff2bd6, 0 0 20px #ff2bd6, 0 0 40px #ff2bd6",
              }}
            >
              ★ PROJECTS ★
            </h2>
          </div>
          <div
            className="w-40 h-1 mx-auto mt-2 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #ff2bd6, transparent)",
              boxShadow: "0 0 10px #ff2bd6",
            }}
          />
        </Motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, idx) => {
            const colorObj = CARD_COLORS[idx % CARD_COLORS.length];
            return (
              <Motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl overflow-hidden relative flex flex-col"
                style={{
                  border: `2px solid ${colorObj.border}60`,
                  background: "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 0 20px ${colorObj.glow}20`,
                  transition: "all 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colorObj.border;
                  e.currentTarget.style.boxShadow = `0 0 40px ${colorObj.glow}60, 0 20px 60px ${colorObj.glow}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${colorObj.border}60`;
                  e.currentTarget.style.boxShadow = `0 0 20px ${colorObj.glow}20`;
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title || "Project Screenshot"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Neon overlay on image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, ${colorObj.border}10 0%, transparent 40%, rgba(5,5,5,0.95) 100%)`,
                    }}
                  />
                  {/* Top neon line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{
                      background: colorObj.border,
                      boxShadow: `0 0 10px ${colorObj.glow}`,
                    }}
                  />
                  {/* Number badge */}
                  <div
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                    style={{
                      background: `${colorObj.border}30`,
                      border: `1px solid ${colorObj.border}`,
                      color: colorObj.border,
                      boxShadow: `0 0 8px ${colorObj.glow}`,
                      fontFamily: "'Courier New', monospace",
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Title */}
                  <h3
                    className="text-lg font-black uppercase tracking-wide"
                    style={{
                      fontFamily: "'Courier New', monospace",
                      color: colorObj.border,
                      textShadow: `0 0 8px ${colorObj.glow}`,
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-gray-400 text-sm leading-relaxed flex-1"
                    style={{ fontFamily: "'Courier New', monospace" }}
                  >
                    {project.description}
                  </p>

                  {/* Tech badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded text-xs font-black uppercase tracking-wider"
                        style={{
                          fontFamily: "'Courier New', monospace",
                          background: colorObj.badge,
                          border: `1px solid ${colorObj.border}50`,
                          color: colorObj.border,
                          textShadow: `0 0 4px ${colorObj.glow}`,
                          boxShadow: `0 0 6px ${colorObj.glow}20`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-3">
                    {project.githubUrl && (
                      <Motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 flex-1 justify-center px-3 py-2 rounded border text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                        style={{
                          fontFamily: "'Courier New', monospace",
                          borderColor: `${colorObj.border}60`,
                          color: colorObj.border,
                          background: `${colorObj.border}08`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = colorObj.border;
                          e.currentTarget.style.boxShadow = `0 0 15px ${colorObj.glow}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = `${colorObj.border}60`;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Github size={13} />
                        CODE
                      </Motion.a>
                    )}
                    {project.liveUrl && (
                      <Motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 flex-1 justify-center px-3 py-2 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                        style={{
                          fontFamily: "'Courier New', monospace",
                          background: `linear-gradient(135deg, ${colorObj.border}30, ${colorObj.border}15)`,
                          border: `1px solid ${colorObj.border}`,
                          color: colorObj.border,
                          boxShadow: `0 0 15px ${colorObj.glow}30`,
                          textShadow: `0 0 6px ${colorObj.glow}`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 25px ${colorObj.glow}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = `0 0 15px ${colorObj.glow}30`;
                        }}
                      >
                        <ExternalLink size={13} />
                        LIVE DEMO
                      </Motion.a>
                    )}
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
