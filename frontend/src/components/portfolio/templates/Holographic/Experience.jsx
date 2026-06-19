import React, { useRef, useState, useEffect } from "react";
import { Briefcase, Calendar, ChevronRight, Zap } from "lucide-react";
import { usePortfolio } from "../../../../context/PortfolioContext";

const DEFAULT_EXPERIENCE = [
  {
    id: 1,
    role: "Senior Holographic Engineer",
    company: "Neon Lab",
    duration: "2024 - Present",
    description: "Lead developer for next-gen volumetric displays and interactive WebGL experiences. Optimized rendering pipelines by 40%.",
    technologies: ["React", "Three.js", "WebGL", "TypeScript"],
  },
  {
    id: 2,
    role: "UI/UX Architect",
    company: "Quantum Dynamics",
    duration: "2021 - 2024",
    description: "Designed and implemented the core design system used across 12 distinct product lines. Spearheaded the shift to micro-frontends.",
    technologies: ["Figma", "React", "Tailwind CSS", "Micro-frontends"],
  },
  {
    id: 3,
    role: "Frontend Developer",
    company: "Cyberdyne Systems",
    duration: "2018 - 2021",
    description: "Developed high-performance trading dashboards with sub-millisecond updates and resilient data pipelines.",
    technologies: ["Vue.js", "Node.js", "WebSockets", "Redis"],
  },
];

export default function Experience() {
  const { portfolioData } = usePortfolio();
  const experienceData = portfolioData?.experience?.length ? portfolioData.experience : DEFAULT_EXPERIENCE;

  const [activeId, setActiveId] = useState(experienceData[0]?.id);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative isolate min-h-screen overflow-hidden bg-slate-950 py-24 px-6 text-white sm:px-8"
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-32 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.1),rgba(2,6,23,0.9))]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-sm text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.1)] backdrop-blur-xl mb-6">
            <Zap className="h-4 w-4" />
            <span>Career Log</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              Experience
            </span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] items-start">
          {/* Left: Timeline List */}
          <div
            className={`flex flex-col gap-4 transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {experienceData.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setActiveId(exp.id)}
                className={`relative flex flex-col items-start gap-2 rounded-2xl border p-5 text-left transition-all duration-300 ${
                  activeId === exp.id
                    ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                } backdrop-blur-xl overflow-hidden group`}
              >
                {activeId === exp.id && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                )}
                <div className="flex w-full items-center justify-between">
                  <h3 className={`text-lg font-bold transition-colors ${activeId === exp.id ? "text-cyan-300" : "text-slate-200"}`}>
                    {exp.company}
                  </h3>
                  <ChevronRight className={`h-4 w-4 transition-transform ${activeId === exp.id ? "translate-x-1 text-cyan-300" : "text-slate-500"}`} />
                </div>
                <div className="text-sm font-medium text-slate-400">{exp.role}</div>
              </button>
            ))}
          </div>

          {/* Right: Active Detail */}
          <div
            className={`relative rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-10 backdrop-blur-2xl transition-all duration-700 delay-300 overflow-hidden ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.1),transparent_40%)]" />
            
            {experienceData.map((exp) => (
              <div
                key={exp.id}
                className={`relative transition-all duration-500 space-y-8 ${
                  activeId === exp.id
                    ? "opacity-100 translate-y-0 z-10 block"
                    : "opacity-0 translate-y-4 absolute inset-0 hidden pointer-events-none"
                }`}
              >
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white sm:text-4xl">
                    {exp.role} <span className="text-cyan-400">@ {exp.company}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <Calendar className="h-4 w-4" />
                    {exp.duration}
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300">
                  <p className="leading-relaxed text-lg">{exp.description}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm uppercase tracking-widest text-slate-500">Core Technologies</h4>
                  <div className="flex flex-wrap gap-3">
                    {exp.technologies?.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors hover:border-cyan-400/30 hover:bg-cyan-400/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}