import React from "react";
import { motion as Motion } from "framer-motion";
import { Briefcase, Calendar, Building2 } from "lucide-react";

const TIMELINE_COLORS = ["#ff2bd6", "#00d4ff", "#ffd000", "#b026ff"];

export default function Experience({ data = {} }) {
  const { experience = [] } = data;

  return (
    <section id="experience" className="relative py-20 px-4 md:px-8 overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full blur-[130px] bg-yellow-500 opacity-5 pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full blur-[130px] bg-purple-600 opacity-5 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div
            className="inline-block px-6 py-3 rounded border-2 border-yellow-400 mb-4"
            style={{
              background: "rgba(255,208,0,0.05)",
              boxShadow: "0 0 20px #ffd000, 0 0 40px #ffd00040",
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-black uppercase tracking-widest text-yellow-300"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 10px #ffd000, 0 0 20px #ffd000, 0 0 40px #ffd000",
              }}
            >
              ◈ EXPERIENCE ◈
            </h2>
          </div>
          <div
            className="w-40 h-1 mx-auto mt-2 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #ffd000, transparent)",
              boxShadow: "0 0 10px #ffd000",
            }}
          />
        </Motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Central vertical neon tube */}
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
            style={{
              background: "linear-gradient(to bottom, #ff2bd6, #00d4ff, #ffd000, #b026ff)",
              boxShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff40",
            }}
          />

          <div className="flex flex-col gap-12">
            {experience.map((exp, idx) => {
              const color = TIMELINE_COLORS[idx % TIMELINE_COLORS.length];
              const isLeft = idx % 2 === 0;

              return (
                <Motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content Card (takes up half width on desktop) */}
                  <div className={`pl-14 md:pl-0 md:w-[calc(50%_-_2rem)] ${isLeft ? "md:pr-10" : "md:pl-10"}`}>
                    <div
                      className="group rounded-2xl border-2 p-5 md:p-6 relative overflow-hidden cursor-default transition-all duration-500"
                      style={{
                        borderColor: `${color}60`,
                        background: `${color}06`,
                        backdropFilter: "blur(10px)",
                        boxShadow: `0 0 20px ${color}15`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = color;
                        e.currentTarget.style.boxShadow = `0 0 40px ${color}50, 0 0 80px ${color}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${color}60`;
                        e.currentTarget.style.boxShadow = `0 0 20px ${color}15`;
                      }}
                    >
                      {/* Corner accent */}
                      <div
                        className={`absolute top-0 ${isLeft ? "right-0" : "left-0"} w-6 h-6`}
                        style={{
                          borderTop: `2px solid ${color}`,
                          [isLeft ? "borderRight" : "borderLeft"]: `2px solid ${color}`,
                          boxShadow: `0 0 8px ${color}`,
                        }}
                      />

                      {/* Role */}
                      <h3
                        className="text-base md:text-lg font-black uppercase tracking-wide mb-1"
                        style={{
                          fontFamily: "'Courier New', monospace",
                          color: color,
                          textShadow: `0 0 8px ${color}`,
                        }}
                      >
                        {exp.role}
                      </h3>

                      {/* Company + Period */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Building2
                            size={13}
                            style={{ color, filter: `drop-shadow(0 0 4px ${color})` }}
                          />
                          <span
                            className="text-sm font-bold text-gray-300"
                            style={{ fontFamily: "'Courier New', monospace" }}
                          >
                            {exp.company}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-gray-500" />
                          <span
                            className="text-xs text-gray-500 font-bold"
                            style={{ fontFamily: "'Courier New', monospace" }}
                          >
                            {exp.period}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="text-gray-400 text-sm leading-relaxed"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        {exp.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node on timeline */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    {/* Outer ring */}
                    <Motion.div
                      animate={{
                        boxShadow: [
                          `0 0 8px ${color}, 0 0 16px ${color}60`,
                          `0 0 16px ${color}, 0 0 32px ${color}60`,
                          `0 0 8px ${color}, 0 0 16px ${color}60`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: `radial-gradient(circle, ${color}30, ${color}10)`,
                        border: `2px solid ${color}`,
                      }}
                    >
                      <Briefcase size={16} style={{ color, filter: `drop-shadow(0 0 4px ${color})` }} />
                    </Motion.div>
                  </div>

                  {/* Spacer for right side on desktop */}
                  <div className="hidden md:block md:w-[calc(50%-32px)]" />
                </Motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
