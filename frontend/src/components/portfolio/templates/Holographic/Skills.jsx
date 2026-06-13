import React, { useRef, useState, useEffect } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Terminal, Database, Palette, Cpu } from "lucide-react";

const DEFAULT_SKILLS = [
  {
    category: "Frontend",
    icon: Terminal,
    color: "from-cyan-400 to-blue-500",
    items: ["React", "Vue", "TypeScript", "Tailwind CSS", "Three.js", "WebGL"],
  },
  {
    category: "Backend",
    icon: Database,
    color: "from-fuchsia-400 to-pink-500",
    items: ["Node.js", "Python", "GraphQL", "PostgreSQL", "Redis", "Docker"],
  },
  {
    category: "Design",
    icon: Palette,
    color: "from-violet-400 to-indigo-500",
    items: ["Figma", "UI/UX", "Prototyping", "Wireframing", "Design Systems"],
  },
  {
    category: "Core",
    icon: Cpu,
    color: "from-emerald-400 to-teal-500",
    items: ["Algorithms", "Data Structures", "System Design", "Agile", "Git"],
  },
];

export default function Skills() {
  const { portfolioData } = usePortfolio();
  const skillsData = portfolioData?.skills?.length ? portfolioData.skills : DEFAULT_SKILLS;

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
      id="skills"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#050B14] py-24 px-6 text-white sm:px-8 min-h-screen flex items-center"
    >
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
           
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.08),transparent_70%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl w-full">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              Technical Arsenal
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A comprehensive matrix of tools and technologies mastered across multiple dimensions of development.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {skillsData.map((skillGroup, index) => {
            // If data is coming from backend, it might not have icon/color properties mapped.
            // Provide fallbacks.
            const Icon = skillGroup.icon || Terminal;
            const gradientColor = skillGroup.color || "from-cyan-400 to-blue-500";
            
            return (
              <div
                key={skillGroup.category || index}
                className={`relative group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:-translate-y-2 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Glow behind card */}
                <div className={`absolute -inset-0.5 rounded-3xl bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradientColor} mb-6 shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="mb-4 text-xl font-bold text-white">{skillGroup.category}</h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items?.map((item) => (
                      <span
                        key={item.name || item}
                        className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-100"
                      >
                        {item.name || item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}