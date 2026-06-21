import React from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";

export default function Testimonials() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section
      id="testimonials"
      className="relative w-full overflow-hidden px-4 py-16 sm:px-6 md:px-8 lg:px-10 lg:py-24 bg-[#081326]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(45,212,191,0.06),_transparent_60%)]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      <div className="relative mx-auto max-w-[1400px] z-10">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <p className="whitespace-normal break-normal text-xs uppercase tracking-[0.3em] text-teal-300/80 mb-3">
            Peer & Mentor Feedback
          </p>
          <h2
            className="text-[#F8FFFC] font-bold m-0"
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "clamp(3.2rem, 5.5vw, 4.8rem)",
              lineHeight: 0.95,
              textShadow: "0 0 1px rgba(248,255,252,0.5), 0 10px 20px rgba(6, 182, 212, 0.15)",
            }}
          >
            Classroom Impact
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl border border-cyan-100/10 bg-slate-900/40 p-8 shadow-[0_20px_40px_rgba(6,17,40,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="absolute -left-2 -top-2 text-6xl text-cyan-400/20 font-serif leading-none select-none">
                "
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-slate-200 leading-relaxed text-sm sm:text-base italic mb-8">
                  "{testimonial.text}"
                </p>
                
                <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-4">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name || "Profile Avatar"}
                      className="w-12 h-12 rounded-full border border-cyan-300/30 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-semibold tracking-wide">{testimonial.name}</h4>
                    <p className="text-cyan-200/60 text-xs uppercase tracking-widest mt-0.5">{testimonial.role || "Mentor"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
