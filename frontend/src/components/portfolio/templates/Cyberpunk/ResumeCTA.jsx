import React from "react";
import { Download, Eye, Sparkles } from "lucide-react";

export default function ResumeCTA() {
  return (
    <section className="relative overflow-hidden bg-[#070b14] px-6 py-20 md:px-12">
      
      {/* Neon Glow Background */}
      <div className="absolute top-10 left-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-pink-500/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-5xl rounded-[32px] border border-cyan-400/20 bg-white/5 p-10 shadow-[0_0_40px_rgba(0,255,255,0.08)] backdrop-blur-xl">
        
        {/* Heading */}
        <div className="text-center">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm uppercase tracking-[0.3em] text-cyan-400">
            <Sparkles size={16} />
            Cyberpunk Resume
          </p>

          <h2 className="text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Access My
            <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              {" "}
              Digital Resume
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Explore my futuristic portfolio, technical expertise, innovative
            projects, and professional journey through an immersive cyberpunk
            experience.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
          
          <button type="button" className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 px-8 py-4 text-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.45)]">
            <Download
              size={22}
              className="transition-transform duration-300 group-hover:-translate-y-1"
            />
            Download Resume
          </button>

          <button type="button" className="group flex items-center gap-3 rounded-2xl border border-pink-400/30 bg-white/5 px-8 py-4 text-lg font-semibold text-pink-300 transition-all duration-300 hover:scale-105 hover:bg-pink-500/10 hover:shadow-[0_0_25px_rgba(255,0,200,0.25)]">
            <Eye
              size={22}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            Preview Resume
          </button>
        </div>

        {/* Bottom Accent */}
        <div className="mt-14 border-t border-cyan-400/10 pt-6 text-center">
          <p className="text-sm tracking-wide text-gray-500">
            “Building futuristic experiences through code & creativity.”
          </p>
        </div>
      </div>
    </section>
  );
}