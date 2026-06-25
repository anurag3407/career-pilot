import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";

export default function Skills() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section
      id="skills"
      className="relative w-full overflow-hidden px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-24 bg-[#061121] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_40%),radial-gradient(circle_at_top_left,_rgba(45,212,191,0.1),_transparent_30%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10px 10px, rgba(125, 211, 252, 0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-[1300px] z-10">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-300/8 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.16)] mb-6">
            ✦ Core Competencies ✦
          </div>
          <h2
            className="text-[#F8FFFC] font-bold m-0"
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
              lineHeight: 0.9,
              textShadow: "0 0 1px rgba(248,255,252,0.6), 0 14px 30px rgba(34, 211, 238, 0.15)",
            }}
          >
            Skill Repertory
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.skills.map((skill, index) => {
            const progress = skill.level || Math.floor(Math.random() * 40 + 60);
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-slate-900/60 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(6,17,40,0.6),0_0_20px_rgba(34,211,238,0.1)]"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-400/10 to-transparent blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
                
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white tracking-wide">
                    {skill.name}
                  </h3>
                  <span className="text-sm font-medium text-cyan-200/80 uppercase tracking-widest">
                    {progress}%
                  </span>
                </div>
                
                <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-500 shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                {skill.tags && skill.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {skill.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium tracking-wide text-slate-300 transition-colors group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 group-hover:text-cyan-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
