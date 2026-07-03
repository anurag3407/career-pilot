import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";

function ChalkMarks() {
  const marks = [
    { symbol: "✦", top: "5%", left: "12%", size: "1rem", rotate: "-15deg" },
    { symbol: "◦", top: "18%", right: "8%", size: "1.2rem", rotate: "12deg" },
    { symbol: "—", top: "45%", left: "5%", size: "1.5rem", rotate: "5deg" },
    { symbol: "·", bottom: "25%", right: "15%", size: "1.4rem", rotate: "-8deg" },
    { symbol: "✦", bottom: "10%", left: "20%", size: "0.8rem", rotate: "20deg" },
  ];

  return (
    <>
      {marks.map((mark, index) => (
        <span
          key={index}
          aria-hidden="true"
          style={{
            position: "absolute",
            color: "rgba(196, 255, 233, 0.18)",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: mark.size,
            lineHeight: 1,
            transform: `rotate(${mark.rotate})`,
            pointerEvents: "none",
            textShadow: "0 0 12px rgba(103, 232, 249, 0.12)",
            ...mark,
          }}
        >
          {mark.symbol}
        </span>
      ))}
    </>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-14 relative z-10 text-center">
      <div
        style={{
          color: "rgba(153, 246, 228, 0.96)",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          fontSize: "1.08rem",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          marginBottom: "1.1rem",
          textShadow: "0 0 18px rgba(34, 211, 238, 0.2)",
        }}
      >
        ✦ {subtitle} ✦
      </div>
      <h2
        style={{
          color: "#F8FFFC",
          fontFamily: "'Caveat', cursive",
          fontWeight: 700,
          fontSize: "clamp(3rem, 5vw, 4.5rem)",
          lineHeight: 1,
          margin: 0,
          textShadow: "0 0 1px rgba(248,255,252,0.75), 0 18px 38px rgba(34, 211, 238, 0.18)",
        }}
      >
        {title}
      </h2>
      <div className="mt-4 flex justify-center">
        <svg
          width="180"
          height="16"
          viewBox="0 0 180 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 8C15 4 25 12 35 8C45 4 55 12 65 8C75 4 85 12 95 8C105 4 115 12 125 8C135 4 145 12 155 8C165 4 175 12 178 8"
            stroke="url(#exp-underline)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 4"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="exp-underline" x1="0" y1="0" x2="180" y2="0">
              <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#ECFEFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default function Experience() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section
      id="experience"
      className="relative w-full overflow-hidden px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-24"
      style={{
        background: "linear-gradient(135deg, #061121 0%, #0A1930 40%, #071021 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(125,211,252,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.14) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="absolute left-[15%] top-32 h-64 w-64 rounded-full bg-cyan-400/10 blur-[80px] pointer-events-none" />
      <div className="absolute right-[10%] bottom-32 h-72 w-72 rounded-full bg-teal-300/10 blur-[90px] pointer-events-none" />
      <ChalkMarks />

      <div className="relative mx-auto max-w-[1200px] z-10">
        <SectionHeader title="Syllabus & Milestones" subtitle="Experience" />

        <div className="relative">
          {/* Timeline center line */}
          <div
            className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-px -translate-x-1/2"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.4), transparent)",
            }}
          />

          <div className="space-y-12">
            {data.experience.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? "md:flex-row-reverse" : ""
                  } gap-6 md:gap-12`}
                >
                  {/* Timeline Dot */}
                  <div
                    className="absolute left-[24px] md:left-1/2 -translate-x-1/2 mt-6 w-4 h-4 rounded-full border-2 border-cyan-300 bg-[#061121] shadow-[0_0_12px_rgba(34,211,238,0.6)] z-10"
                  />

                  <div className="w-full md:w-1/2 pl-[60px] md:pl-0 flex flex-col justify-center">
                    <div
                      className={`relative p-6 md:p-8 rounded-3xl border border-cyan-100/15 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_50px_rgba(6,17,40,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-300 hover:-translate-y-1 ${
                        isEven ? "md:mr-8" : "md:ml-8"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-white tracking-wide">
                            {exp.role}
                          </h3>
                          <div className="text-cyan-300/80 font-medium tracking-widest uppercase text-sm mt-1">
                            {exp.company}
                          </div>
                        </div>
                        <span className="inline-flex items-center rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-medium text-teal-100 whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                  {/* Empty space for the other half */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
