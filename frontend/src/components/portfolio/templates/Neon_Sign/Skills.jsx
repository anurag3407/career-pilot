import React, { useEffect, useRef, useState } from "react";
import { motion as Motion, useInView } from "framer-motion";

const NEON_COLORS = [
  { bar: "#ff2bd6", glow: "#ff2bd6", label: "text-pink-300", border: "border-pink-500" },
  { bar: "#00d4ff", glow: "#00d4ff", label: "text-cyan-300", border: "border-cyan-500" },
  { bar: "#39ff14", glow: "#39ff14", label: "text-green-300", border: "border-green-500" },
  { bar: "#ffd000", glow: "#ffd000", label: "text-yellow-300", border: "border-yellow-500" },
  { bar: "#b026ff", glow: "#b026ff", label: "text-purple-300", border: "border-purple-500" },
  { bar: "#ff8c00", glow: "#ff8c00", label: "text-orange-300", border: "border-orange-500" },
  { bar: "#00ffff", glow: "#00ffff", label: "text-teal-300", border: "border-teal-400" },
];

function NeonProgressBar({ name, level, colorObj, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setWidth(level), delay * 100 + 300);
      return () => clearTimeout(timer);
    }
  }, [inView, level, delay]);

  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay * 0.08 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-sm font-black uppercase tracking-widest ${colorObj.label}`}
          style={{
            fontFamily: "'Courier New', monospace",
            textShadow: `0 0 8px ${colorObj.glow}`,
          }}
        >
          {name}
        </span>
        <span
          className="text-xs font-black"
          style={{
            color: colorObj.bar,
            textShadow: `0 0 6px ${colorObj.glow}`,
            fontFamily: "'Courier New', monospace",
          }}
        >
          {level}%
        </span>
      </div>

      {/* Track */}
      <div
        className="w-full h-3 rounded-full relative overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${colorObj.bar}40`,
          boxShadow: `inset 0 0 8px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Fill bar */}
        <div
          className="h-full rounded-full transition-all ease-out relative overflow-hidden"
          style={{
            width: `${width}%`,
            transitionDuration: "1.5s",
            background: `linear-gradient(90deg, ${colorObj.bar}80, ${colorObj.bar})`,
            boxShadow: `0 0 10px ${colorObj.glow}, 0 0 20px ${colorObj.glow}60`,
          }}
        >
          {/* Animated shimmer on fill */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
              animation: "shimmerMove 2s linear infinite",
            }}
          />
          {/* Tube end cap glow */}
          <div
            className="absolute right-0 top-0 bottom-0 w-2 rounded-full"
            style={{ background: colorObj.bar, boxShadow: `0 0 10px ${colorObj.glow}` }}
          />
        </div>
      </div>
    </Motion.div>
  );
}

export default function Skills({ data }) {
  const { skills } = data;

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="relative py-20 px-4 md:px-8 overflow-hidden">
      <style>{`
        @keyframes shimmerMove {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>

      {/* Ambient glow */}
      <div className="absolute left-0 top-1/2 w-64 h-64 rounded-full blur-[120px] bg-purple-600 opacity-8 pointer-events-none" />
      <div className="absolute right-0 top-1/3 w-64 h-64 rounded-full blur-[120px] bg-green-600 opacity-8 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div
            className="inline-block px-6 py-3 rounded border-2 border-green-400 mb-4"
            style={{
              background: "rgba(57,255,20,0.05)",
              boxShadow: "0 0 20px #39ff14, 0 0 40px #39ff1440",
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-black uppercase tracking-widest text-green-300"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14",
              }}
            >
              ⚡ SKILLS ⚡
            </h2>
          </div>
          <div
            className="w-40 h-1 mx-auto mt-2 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #39ff14, transparent)",
              boxShadow: "0 0 10px #39ff14",
            }}
          />
        </Motion.div>

        {/* Skills by category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, catIdx) => {
            const catSkills = skills.filter((s) => s.category === category);
            return (
              <Motion.div
                key={category}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: catIdx * 0.1 }}
                className="rounded-2xl border border-white/10 p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-500"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Category label */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: NEON_COLORS[catIdx % NEON_COLORS.length].bar,
                      boxShadow: `0 0 8px ${NEON_COLORS[catIdx % NEON_COLORS.length].glow}`,
                    }}
                  />
                  <h3
                    className="text-sm font-black uppercase tracking-widest"
                    style={{
                      fontFamily: "'Courier New', monospace",
                      color: NEON_COLORS[catIdx % NEON_COLORS.length].bar,
                      textShadow: `0 0 8px ${NEON_COLORS[catIdx % NEON_COLORS.length].glow}`,
                    }}
                  >
                    {category}
                  </h3>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background: `linear-gradient(90deg, ${NEON_COLORS[catIdx % NEON_COLORS.length].bar}60, transparent)`,
                    }}
                  />
                </div>

                {/* Skills */}
                <div className="flex flex-col gap-5">
                  {catSkills.map((skill, skillIdx) => {
                    const colorObj =
                      NEON_COLORS[(catIdx * catSkills.length + skillIdx) % NEON_COLORS.length];
                    return (
                      <NeonProgressBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        colorObj={colorObj}
                        delay={catIdx * catSkills.length + skillIdx}
                      />
                    );
                  })}
                </div>

                {/* Corner accent */}
                <div
                  className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full blur-xl opacity-20 pointer-events-none"
                  style={{ background: NEON_COLORS[catIdx % NEON_COLORS.length].bar }}
                />
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
