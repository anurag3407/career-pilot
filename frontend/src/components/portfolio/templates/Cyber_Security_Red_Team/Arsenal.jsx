import { useState } from "react";
import { useInView } from "./useInView";
import { usePortfolio } from "../../../../context/PortfolioContext";

function SkillCard({ skill, animate }) {
  const [hovered, setHovered] = useState(false);
  const categoryLabel = skill.category || "Core";
  const level = typeof skill.level === "number" ? skill.level : 0;
  const toolTags = skill.tools || [categoryLabel];

  return (
    <div
      className="group relative border overflow-hidden transition-all duration-500 ease-out flex flex-col h-full"
      style={{
        background: hovered ? "rgba(18,18,18,0.9)" : "rgba(11,11,11,0.6)",
        borderColor: hovered ? "rgba(255,43,43,0.3)" : "rgba(255,255,255,0.05)",
        boxShadow: hovered ? "0 10px 40px rgba(255,43,43,0.08), inset 0 0 20px rgba(255,43,43,0.02)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-0.5 h-full bg-[#111]">
        <div
          className="w-full bg-[#FF2B2B] transition-all duration-500 ease-out"
          style={{ height: hovered ? "100%" : "0%" }}
        />
      </div>

      <div className="p-5 flex flex-col h-full pl-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#555] tracking-[0.2em] font-mono text-[0.55rem]">
            [ {categoryLabel} ]
          </span>
          <span className="text-[#FF2B2B] tracking-[0.15em] font-mono text-[0.65rem]">
            {level}%
          </span>
        </div>
        <h3
          className="text-[#F5F5F5] mb-4 tracking-[0.05em]"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}
        >
          {skill.name}
        </h3>

        {/* Progress bar — animates on scroll entry */}
        <div className="mt-auto pt-2 border-t border-[#1A1A1A]/50">
          <div className="h-px bg-[#1A1A1A] w-full overflow-hidden">
            <div
              className="h-full"
              style={{
                width: animate ? `${level}%` : "0%",
                background: "linear-gradient(90deg, #D60000, #FF2B2B)",
                boxShadow: animate ? "0 0 8px rgba(255,43,43,0.5)" : "none",
                transition: animate ? "width 1.2s cubic-bezier(0.25,1,0.5,1)" : "none",
              }}
            />
          </div>
        </div>

        {/* Tool tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {toolTags.map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 border border-[#1A1A1A] text-[#555] group-hover:border-[#252525] group-hover:text-[#9A9A9A] transition-colors duration-300"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem" }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Arsenal() {
  const [active, setActive] = useState("ALL");
  const [gridRef, inView] = useInView(0.1);
  const { portfolioData } = usePortfolio();
  const skills = Array.isArray(portfolioData?.skills) ? portfolioData.skills : [];

  const categories = [
    "ALL",
    ...new Set(skills.map((skill) => skill.category || "Core"))
  ];

  const filtered = active === "ALL"
    ? skills
    : skills.filter((skill) => (skill.category || "Core") === active);

  return (
    <section id="arsenal" className="relative py-32 overflow-hidden bg-[#050505] cursor-crosshair">
      <style>{`
        @keyframes radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-14">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#FF2B2B] opacity-50" />
            <span className="relative inline-flex h-2 w-2 bg-[#FF2B2B]" />
          </div>
          <span className="text-[#FF2B2B] tracking-[0.35em] font-medium font-mono text-[0.7rem]">
            03 // TACTICAL ARSENAL
          </span>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#FF2B2B20_0%,transparent_100%)]" />
        </div>

        {/* MODIFIED: Increased column widths and added lg:gap-12 to prevent overlap */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] gap-8 lg:gap-12">
          
          {/* Left panel */}
          <div className="flex flex-col gap-6">
            <div>
              <h2
                className="leading-[0.95] text-[#F5F5F5] mb-3"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem,4vw,3.5rem)" }}
              >
                TACTICAL<br />
                <span style={{ color: "#FF2B2B" }}>CAPABILITIES</span>
              </h2>
              {/* MODIFIED: Added max-w-[320px] so the paragraph doesn't stretch weirdly in the wider column */}
              <p className="text-[#777] text-[0.85rem] leading-[1.6] max-w-[320px]">
                Full-spectrum offensive security tools, techniques, and frameworks deployed across real-world engagements.
              </p>
            </div>

            {/* Radar widget */}
            <div className="border border-[#1A1A1A] relative overflow-hidden p-6 flex flex-col items-center justify-center min-h-[280px] bg-[rgba(11,11,11,0.6)]">
              <div className="relative w-44 h-44 flex items-center justify-center overflow-hidden rounded-full">
                <div className="absolute inset-0 rounded-full border border-[#FF2B2B]/20" />
                <div className="absolute inset-4 rounded-full border border-[#FF2B2B]/10" />
                <div className="absolute inset-10 rounded-full border border-[#FF2B2B]/05" />
                <div className="absolute w-full h-px bg-[#FF2B2B]/10" />
                <div className="absolute h-full w-px bg-[#FF2B2B]/10" />
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_75%,rgba(255,43,43,0.25)_100%)] animate-[radar-spin_4s_linear_infinite]" />
                <div className="absolute top-[28%] left-[32%] w-1.5 h-1.5 bg-[#FF2B2B] rounded-full animate-pulse shadow-[0_0_8px_#FF2B2B]" />
                <div className="absolute bottom-[33%] right-[22%] w-1.5 h-1.5 bg-[#FF2B2B] rounded-full shadow-[0_0_8px_#FF2B2B]" />
                <div className="absolute top-[55%] left-[20%] w-1 h-1 bg-[#FF2B2B]/60 rounded-full" />
              </div>
              <span className="mt-4 text-[#555] tracking-[0.2em] font-mono text-[0.55rem]">CAPABILITY SCAN</span>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-6">
            {/* Category filter */}
            {/* MODIFIED: Removed the extreme mt-10/lg:mt-4 hacks since the grid structure now handles spacing automatically */}
            <div className="flex flex-wrap gap-2 border border-[#1A1A1A] p-1.5 self-start bg-[rgba(11,11,11,0.6)]">
              {categories.map((cat) => (
                <button type="button"
                  key={cat}
                  onClick={() => setActive(cat)}
                  className="relative px-4 py-2 tracking-[0.15em] transition-all duration-300 font-mono text-[0.6rem]"
                  style={{
                    color: active === cat ? "#F5F5F5" : "#666",
                    background: active === cat ? "rgba(255,255,255,0.03)" : "transparent",
                  }}
                >
                  {active === cat && (
                    <span className="absolute inset-0 border border-[#FF2B2B]/40 shadow-[0_0_10px_rgba(255,43,43,0.1)_inset]" />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>

            {/* Skill grid */}
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s, transform 0.7s",
              }}
            >
              {filtered.map((skill, index) => (
                <SkillCard key={`${skill.name || skill.category || 'skill'}-${index}`} skill={skill} animate={inView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}