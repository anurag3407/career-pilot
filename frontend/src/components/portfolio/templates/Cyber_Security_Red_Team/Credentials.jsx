import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { useInView } from "./useInView";
import { usePortfolio } from "../../../../context/PortfolioContext";

function Counter({ end, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, inView]);

  return <>{String(count).padStart(2, "0")}</>;
}

function TestimonialCard({ review, delay }) {
  const [ref, inView] = useInView(0.15);

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <div className="group relative border border-[#1A1A1A] p-8 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:border-[#FF2B2B]/40 hover:shadow-[0_10px_30px_rgba(255,43,43,0.06)] overflow-hidden bg-[rgba(11,11,11,0.6)]">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF2B2B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Quote size={24} className="text-[#FF2B2B] opacity-20 absolute top-6 right-6" />

        <p className="text-[#AAA] leading-relaxed mb-8 flex-1 italic" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
          "{review.text}"
        </p>

        <div className="mt-auto pt-5 border-t border-[#1A1A1A]/50 flex items-center gap-4">
          <img
            src={review.avatar || "/placeholder-avatar.png"}
            alt={review.name}
            className="w-10 h-10 rounded-full grayscale border border-[#333] group-hover:grayscale-0 transition-all duration-300"
          />
          <div>
            <h3 className="text-[#F5F5F5] leading-snug tracking-[0.02em] group-hover:text-white transition-colors" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>
              {review.name}
            </h3>
            <span className="text-[#555] tracking-[0.05em] font-mono text-[0.6rem]">{review.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [headerRef, headerInView] = useInView(0.2);
  const [statsRef, statsInView] = useInView(0.2);
  const { portfolioData } = usePortfolio();

  const testimonials = Array.isArray(portfolioData?.testimonials) ? portfolioData.testimonials : [];

  const statsSource = portfolioData?.stats || {};
  const overviewStats = [
    { label: "HAPPY CLIENTS", value: statsSource.happyClients || 0 },
    { label: "PROJECTS", value: statsSource.projectsCompleted || 0 },
    { label: "YEARS EXP", value: statsSource.yearsExperience || 0 },
  ];

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.15]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-16">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#FF2B2B] opacity-50" />
            <span className="relative inline-flex h-2 w-2 bg-[#FF2B2B]" />
          </div>
          <span className="text-[#FF2B2B] tracking-[0.35em] font-medium font-mono text-[0.7rem]">05 // CLIENT FEEDBACK</span>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#FF2B2B20_0%,transparent_100%)]" />
        </div>

        <div ref={headerRef} className="mb-16" style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <h2 className="text-[#F5F5F5] leading-[0.95]" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            PARTNER <br /> <span style={{ color: "#FF2B2B" }}>TESTIMONIALS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr] gap-10 md:gap-14">
          <div ref={statsRef} className="flex flex-col gap-4 md:gap-6">
            {overviewStats.map((stat) => (
              <div key={stat.label} className="border border-[#1A1A1A] p-5 relative overflow-hidden group transition-colors duration-300 bg-[rgba(11,11,11,0.6)] backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#1A1A1A] group-hover:bg-[#FF2B2B] transition-colors duration-300" />
                <div className="text-[#F5F5F5] tracking-tighter mb-1.5 flex items-center font-mono text-[2.2rem] font-bold">
                  <span className="text-[#333] font-normal mr-1">[</span>
                  <span className="text-[#FF2B2B]"><Counter end={stat.value} inView={statsInView} /></span>
                  <span className="text-[#333] font-normal ml-1">]</span>
                </div>
                <div className="text-[#555] tracking-[0.15em] uppercase font-mono text-[0.6rem]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.length > 0 ? (
              testimonials.map((review, i) => (
                <TestimonialCard key={review.name || `testimonial-${i}`} review={review} delay={i * 100} />
              ))
            ) : (
              <div className="py-24 text-center text-[#888] border border-[#1A1A1A] rounded-3xl bg-[#090909]">
                <p className="font-mono text-[0.85rem] tracking-[0.25em]">NO TESTIMONIALS AVAILABLE</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}