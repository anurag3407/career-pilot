import React, { useEffect, useRef, useState } from "react";
import { motion as Motion, useInView } from "framer-motion";
import { Briefcase, FolderOpen, Users, Cpu } from "lucide-react";

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsBar({ data }) {
  const { stats, skills } = data;

  const statsItems = [
    {
      icon: Briefcase,
      value: stats.yearsExperience,
      suffix: "+",
      label: "YEARS EXPERIENCE",
      color: "#ff2bd6",
      glow: "#ff2bd6",
    },
    {
      icon: FolderOpen,
      value: stats.projectsCompleted,
      suffix: "+",
      label: "PROJECTS COMPLETED",
      color: "#00d4ff",
      glow: "#00d4ff",
    },
    {
      icon: Users,
      value: stats.happyClients,
      suffix: "+",
      label: "HAPPY CLIENTS",
      color: "#ffd000",
      glow: "#ffd000",
    },
    {
      icon: Cpu,
      value: skills.length,
      suffix: "",
      label: "TECHNOLOGIES",
      color: "#39ff14",
      glow: "#39ff14",
    },
  ];

  return (
    <section className="relative py-10 px-4 md:px-8 overflow-hidden">
      {/* Neon tube separator lines */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #ff2bd6, #00d4ff, #ffd000, #39ff14, transparent)",
          boxShadow: "0 0 10px #00d4ff",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #39ff14, #ffd000, #00d4ff, #ff2bd6, transparent)",
          boxShadow: "0 0 10px #ff2bd6",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col items-center gap-3 py-6 px-4 rounded-xl border-2 text-center transition-all duration-500 cursor-default"
                style={{
                  borderColor: `${item.color}50`,
                  background: `${item.color}05`,
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 0 15px ${item.color}15`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = item.color;
                  e.currentTarget.style.boxShadow = `0 0 30px ${item.glow}50, inset 0 0 20px ${item.glow}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${item.color}50`;
                  e.currentTarget.style.boxShadow = `0 0 15px ${item.color}15`;
                }}
              >
                {/* Icon with neon glow */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}60`,
                    boxShadow: `0 0 15px ${item.glow}40`,
                  }}
                >
                  <Icon
                    size={22}
                    style={{
                      color: item.color,
                      filter: `drop-shadow(0 0 6px ${item.glow})`,
                    }}
                  />
                </div>

                {/* Counter */}
                <div
                  className="text-4xl md:text-5xl font-black"
                  style={{
                    fontFamily: "'Courier New', monospace",
                    color: item.color,
                    textShadow: `0 0 10px ${item.glow}, 0 0 20px ${item.glow}80`,
                  }}
                >
                  <AnimatedCounter target={item.value} />
                  <span>{item.suffix}</span>
                </div>

                {/* Label */}
                <div
                  className="text-xs font-black tracking-widest uppercase text-gray-400"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  {item.label}
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full transition-all duration-500 group-hover:left-0 group-hover:right-0"
                  style={{
                    background: item.color,
                    boxShadow: `0 0 8px ${item.glow}`,
                  }}
                />
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
