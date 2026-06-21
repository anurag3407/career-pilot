import { useMemo, useState } from "react";
import { ExternalLink, Github, Activity, Terminal } from "lucide-react";
import { useInView } from "./useInView";
import { usePortfolio } from "../../../../context/PortfolioContext";

function OperationCard({ op, delay }) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView(0.15);
  const projectId = op.codename;
  const hasActions = Boolean(op.github || op.report);

  return (
    <div
      ref={ref}
      className="border flex flex-col h-full relative overflow-hidden group"
      style={{
        background: hovered ? "rgba(15,15,15,0.95)" : "rgba(8,8,8,0.7)",
        borderColor: hovered ? "rgba(255,43,43,0.4)" : "rgba(30,30,30,1)",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,43,43,0.04)" : "0 10px 30px rgba(0,0,0,0.5)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.5s ease, opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line on hover */}
      <div
        className="h-px w-full transition-all duration-500 z-30 relative"
        style={{ background: hovered ? "linear-gradient(90deg, transparent 0%, #FF2B2B 50%, transparent 100%)" : "transparent" }}
      />

      {/* Corner brackets */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FF2B2B] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FF2B2B] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 pointer-events-none" />

      {/* Image Container with B&W to Color Hover Effect */}
      {op.image && (
        <div className="relative h-48 w-full overflow-hidden border-b border-[#1A1A1A] group-hover:border-[#FF2B2B]/30 transition-colors duration-500">
          {/* Subtle tactical red overlay that appears on hover */}
          <div className="absolute inset-0 bg-[#FF2B2B]/10 mix-blend-overlay z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src={op.image}
            alt={op.title || "Operation Visual"}
            loading="lazy"
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-1 relative z-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[#FF2B2B] tracking-[0.2em] font-mono text-[0.6rem] block mb-1">
              {projectId}
            </span>
            <h3
              className="text-[#F5F5F5] leading-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.3rem", letterSpacing: "0.03em" }}
            >
              {op.title ? op.title.toUpperCase() : ""}
            </h3>
          </div>
          <Activity size={14} className="text-[#555] group-hover:text-[#FF2B2B] transition-colors duration-500 flex-shrink-0 mt-1" />
        </div>

        {op.description && (
          <p className="text-[#888] leading-relaxed mb-5 flex-1 group-hover:text-[#AAA] transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>
            {op.description}
          </p>
        )}

        {Array.isArray(op.tags) && op.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {op.tags.map((tag, tagIndex) => (
              <span
                key={`${projectId}-tag-${tagIndex}`}
                className="px-2.5 py-1 border border-[#222] text-[#666] font-mono text-[0.55rem] tracking-wider bg-[#050505] group-hover:border-[#FF2B2B]/30 group-hover:text-[#E5E5E5] group-hover:bg-[#FF2B2B]/5 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {hasActions && (
          <div className="flex items-center gap-6 pt-5 border-t border-[#1A1A1A] group-hover:border-[#333] transition-colors duration-500">
            {op.github && (
              <a href={op.github} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" aria-label={`Open source code for ${op.title}`} className="flex items-center gap-2 text-[#777] hover:text-[#F5F5F5] transition-all duration-300 hover:translate-x-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.15em" }}>
                <Github size={13} /> SOURCE
              </a>
            )}
            {op.report && (
              <a href={op.report} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" aria-label={`Open live project for ${op.title}`} className="flex items-center gap-2 text-[#777] hover:text-[#FF2B2B] transition-all duration-300 hover:translate-x-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.15em" }}>
                <ExternalLink size={13} /> REPORT
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Operations() {
  const [headerRef, headerInView] = useInView(0.1);
  const { portfolioData } = usePortfolio();

  const projects = Array.isArray(portfolioData?.projects) ? portfolioData.projects : [];
  const operations = useMemo(() => {
    const validProjects = projects.filter(
      (project) =>
        project &&
        ((typeof project.title === "string" && project.title.trim()) ||
          (typeof project.name === "string" && project.name.trim()))
    );

    return validProjects.map((project, index) => ({
      codename: `OP-${String(index + 1).padStart(2, "0")}`,
      title: project.title || project.name || "",
      description: project.description || project.summary || "",
      tags: Array.isArray(project.techStack)
        ? project.techStack
        : Array.isArray(project.technologies)
        ? project.technologies
        : ["PROJECT"],
      github: project.githubUrl || project.github || project.repo || "",
      report: project.liveUrl || project.website || project.live || "",
      // Added the mapping for the image here to pass it down safely
      image: project.image || project.coverUrl || project.imgUrl || "",
    }));
  }, [projects]);

  return (
    <section id="operations" className="relative py-32 overflow-hidden bg-[#050505] cursor-crosshair">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: `linear-gradient(#F5F5F5 1px, transparent 1px), linear-gradient(90deg, #F5F5F5 1px, transparent 1px)`, backgroundSize: "60px 60px" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-14">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#FF2B2B] opacity-50" />
            <span className="relative inline-flex h-2 w-2 bg-[#FF2B2B]" />
          </div>
          <span className="text-[#FF2B2B] tracking-[0.35em] font-medium font-mono text-[0.7rem]">
            05 // FIELD OPERATIONS
          </span>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#FF2B2B20_0%,transparent_100%)]" />
        </div>

        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.2,0.8,0.2,1)",
          }}
        >
          <h2
            className="leading-[0.9] text-[#F5F5F5]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem,5vw,4rem)" }}
          >
            FIELD<br />
            <span style={{ color: "#FF2B2B" }}>DEPLOYMENTS</span>
          </h2>

          <div className="flex items-center gap-2 px-3 py-1.5 border border-[#1A1A1A] bg-[#0A0A0A]">
            <Terminal size={14} className="text-[#555]" />
            <span className="font-mono text-[0.6rem] tracking-[0.1em] text-[#888]">
              OPERATIONS_ACTIVE: {operations.length}
            </span>
          </div>
        </div>

        {operations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operations.map((op, i) => (
              <OperationCard key={op.codename} op={op} delay={i * 100} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-[#888] border border-[#1A1A1A] rounded-3xl bg-[#090909]">
            <p className="font-mono text-[0.85rem] tracking-[0.25em]">NO OPERATIONS AVAILABLE</p>
          </div>
        )}
      </div>
    </section>
  );
}