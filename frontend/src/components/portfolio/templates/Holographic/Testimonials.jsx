import React, { useRef, useState, useEffect } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Quote, Star } from "lucide-react";

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "CTO at Nexus Core",
    content: "An absolute visionary in frontend architecture. The holographic interfaces they built for us revolutionized our entire user experience.",
    rating: 5,
  },
  {
    id: 2,
    name: "David Chen",
    role: "Lead Designer, Prisma",
    content: "The level of detail and polish is unmatched. They perfectly translated our complex Figma prototypes into fluid, high-performance web experiences.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Founder, Aether Tech",
    content: "A rare blend of deep technical expertise and an exceptional eye for design. Delivered our multi-platform dashboard ahead of schedule.",
    rating: 5,
  },
];

export default function Testimonials() {
  const { portfolioData } = usePortfolio();
  const testimonialsData = portfolioData?.testimonials?.length ? portfolioData.testimonials : DEFAULT_TESTIMONIALS;

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
      id="testimonials"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-slate-950 py-24 px-6 text-white sm:px-8"
    >
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 h-[600px] w-[600px] rounded-full bg-fuchsia-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        <div
          className={`text-center mb-20 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-300/30 bg-white/5 backdrop-blur-xl mb-6">
            <Star className="h-4 w-4 text-fuchsia-300" />
            <span className="text-xs uppercase tracking-[0.25em] text-fuchsia-100">Client Signals</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-fuchsia-300 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              Endorsements
            </span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className={`relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-white/10" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-cyan-400 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                ))}
              </div>

              <p className="text-slate-300 mb-8 leading-relaxed relative z-10 text-lg">
                "{testimonial.content}"
              </p>

              <div className="mt-auto">
                <div className="font-bold text-white text-lg">{testimonial.name}</div>
                <div className="text-sm font-medium text-cyan-400/80 uppercase tracking-wider mt-1">{testimonial.role}</div>
              </div>

              {/* Bottom Glow Line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-fuchsia-400/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}