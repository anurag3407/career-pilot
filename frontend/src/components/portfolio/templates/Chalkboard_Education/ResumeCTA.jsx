import React from "react";
import { Download, FileText, Sparkles } from "lucide-react";

export default function ResumeCTA() {
  return (
    <section className="relative overflow-hidden bg-[#1b1b1b] px-6 py-20 text-white md:px-12">
      
      {/* Chalk Dust Glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-white blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-green-200 blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl rounded-[32px] border-4 border-dashed border-green-200/40 bg-[#222222]/90 p-10 shadow-[0_0_40px_rgba(255,255,255,0.08)] backdrop-blur-lg">
        
        {/* Heading */}
        <div className="text-center">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm uppercase tracking-[0.3em] text-green-200">
            <Sparkles size={16} />
            Chalkboard Education
          </p>

          <h2 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Download My
            <span className="ml-3 text-green-300">Resume</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-300">
            Explore my academic journey, teaching philosophy, technical skills,
            and educational achievements in one comprehensive resume.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
          
          <button className="group flex items-center gap-3 rounded-2xl border-2 border-green-300 bg-green-200 px-8 py-4 text-lg font-bold text-[#1b1b1b] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(134,239,172,0.45)]">
            <Download
              size={22}
              className="transition-transform duration-300 group-hover:-translate-y-1"
            />
            Download Resume
          </button>

          <button className="group flex items-center gap-3 rounded-2xl border-2 border-dashed border-white/40 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white/10">
            <FileText
              size={22}
              className="transition-transform duration-300 group-hover:rotate-6"
            />
            Preview Resume
          </button>
        </div>

        {/* Chalkboard Footer */}
        <div className="mt-14 border-t-2 border-dashed border-white/20 pt-6 text-center">
          <p className="text-sm italic tracking-wide text-gray-400">
            “Education is the passport to the future.”
          </p>
        </div>
      </div>
    </section>
  );
}