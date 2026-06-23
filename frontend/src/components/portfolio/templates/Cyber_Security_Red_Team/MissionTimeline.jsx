import { useInView } from "./useInView";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Briefcase } from "lucide-react";

function TimelineCard({ entry, delay, isLatest }) {
  const [ref, inView] = useInView(0.2);

  return (
    <div
      ref={ref}
      className="relative group w-full"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.7s ${delay}ms, transform 0.7s ${delay}ms`,
      }}
    >
      <div className="absolute top-8 -left-8 w-8 h-px bg-[#1A1A1A] group-hover:bg-[#FF2B2B]/40 transition-colors" />

      <div
        className="border border-[#1A1A1A] bg-[#080808] relative overflow-hidden transition-all duration-500 hover:border-[#FF2B2B]/30 hover:shadow-[0_10px_40px_rgba(255,43,43,0.05)]"
      >
        {/* Left accent */}
        <div className="absolute top-0 left-0 w-0.5 h-full bg-[#111]">
          <div className={`w-full transition-all duration-700 ease-out ${isLatest ? "h-full bg-[#FF2B2B]" : "h-0 bg-[#FF2B2B] group-hover:h-full"}`} />
        </div>

        <div className="p-6 md:p-8 pl-8 md:pl-10">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-[#1A1A1A] pb-4">
            {entry.period && (
              <span className="text-[#FF2B2B] tracking-[0.2em] bg-[#FF2B2B]/10 px-2 py-0.5 border border-[#FF2B2B]/20 font-mono text-[0.55rem]">
                [ {entry.period} ]
              </span>
            )}
            <span className="text-[#555] tracking-[0.15em] font-mono text-[0.55rem]">ID: {entry.id}</span>
          </div>

          <div className="mb-5">
            <h3
              className="text-[#F5F5F5] leading-tight mb-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.4rem", letterSpacing: "0.03em" }}
            >
              {entry.role}
            </h3>
            <div className="flex items-center gap-2 text-[#9A9A9A]">
              <Briefcase size={12} className="text-[#FF2B2B]" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>{entry.company}</span>
              {entry.type && (
                <span className="ml-2 px-2 py-0.5 border border-[#1A1A1A] text-[#555] font-mono text-[0.55rem]">{entry.type}</span>
              )}
            </div>
          </div>

          {entry.description && (
            <p className="text-[#888] leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>
              {entry.description}
            </p>
          )}

          {Array.isArray(entry.highlights) && entry.highlights.length > 0 && (
            <div className="flex flex-wrap gap-x-6 gap-y-1.5">
              {entry.highlights.map((h, highlightIndex) => (
                <div key={`${entry.id}-highlight-${highlightIndex}`} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-[#FF2B2B] flex-shrink-0" />
                  <span className="text-[#555] font-mono text-[0.62rem]">{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MissionTimeline() {
  const [headerRef, headerInView] = useInView(0.3);
  const { portfolioData } = usePortfolio();
  const experience = Array.isArray(portfolioData?.experience) ? portfolioData.experience : [];

  const timeline = experience.map((item, index) => ({
    id: item.id || `${index}`,
    period: item.duration || item.period,
    role: item.role || item.title,
    company: item.company || item.organization,
    type: item.type || item.employmentType,
    description: item.description,
    highlights: item.highlights,
  }));

  return (
    <section id="timeline" className="relative py-32 overflow-hidden bg-[#050505]">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-14">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#FF2B2B] opacity-50" />
            <span className="relative inline-flex h-2 w-2 bg-[#FF2B2B]" />
          </div>
          <span className="text-[#FF2B2B] tracking-[0.35em] font-medium font-mono text-[0.7rem]">
            04 // MISSION TIMELINE
          </span>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#FF2B2B20_0%,transparent_100%)]" />
        </div>

        <div
          ref={headerRef}
          className="flex items-end justify-between mb-16 flex-wrap gap-6"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(15px)",
            transition: "opacity 0.7s, transform 0.7s",
          }}
        >
          <h2
            className="leading-[0.9] text-[#F5F5F5]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem,5vw,4rem)" }}
          >
            OPERATIONAL<br />
            <span style={{ color: "#FF2B2B" }}>HISTORY</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative ml-2 md:ml-4">
          <div className="absolute left-0 top-4 bottom-4 w-px bg-[#1A1A1A] overflow-hidden" />
          <div className="pl-10 md:pl-16 space-y-10">
            {timeline.map((entry, i) => {
              const isLatest = i === 0;
              return (
                <div key={entry.id} className="relative">
                  <div
                    className="absolute -left-10 md:-left-16 top-8 w-3 h-3 rounded-full flex items-center justify-center -translate-x-1/2 z-10"
                    style={{
                      background: isLatest ? "#FF2B2B" : "#111",
                      border: isLatest ? "none" : "1px solid #333",
                      boxShadow: isLatest ? "0 0 15px rgba(255,43,43,0.6)" : "none",
                    }}
                  >
                    {isLatest && <div className="absolute inset-0 rounded-full animate-ping bg-[#FF2B2B] opacity-40" />}
                    {!isLatest && <div className="w-1 h-1 bg-[#444] rounded-full" />}
                  </div>
                  <TimelineCard entry={entry} delay={i * 150} isLatest={isLatest} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
