import React from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#f8f5f0] text-black flex items-center px-6 md:px-16 py-16 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center w-full">

        {/* Left Side */}
        <div className="space-y-8">
          <p className="uppercase tracking-[0.4em] text-sm text-gray-500">
            Editorial Portfolio 2026
          </p>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight font-bold">
            Designing Stories Through Creative Vision
          </h1>

          <div className="w-24 h-[2px] bg-black"></div>

          <p className="text-gray-700 text-lg leading-relaxed max-w-xl">
            A modern editorial-inspired portfolio template crafted for
            designers, photographers, and storytellers who want a bold
            visual identity.
          </p>

          <button type="button" className="group flex items-center gap-3 border border-black px-6 py-3 hover:bg-black hover:text-white transition-all duration-300">
            Explore Portfolio

            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Right Side */}
        <div className="relative flex justify-center">

          <div className="relative w-[320px] md:w-[420px] h-[500px] bg-black overflow-hidden shadow-2xl">

            <div className="relative w-[320px] md:w-[420px] h-[500px] bg-black text-white overflow-hidden shadow-2xl p-8 flex flex-col justify-end">
              <p className="uppercase tracking-[0.3em] text-sm mb-4 text-gray-400">
                Featured Creative
              </p>

              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                Magazine
                <br />
                Aesthetic
              </h2>

              <div className="mt-6 h-[1px] w-20 bg-gray-500"></div>

              <p className="mt-6 text-sm text-gray-400 leading-relaxed max-w-xs">
                A visually immersive editorial experience crafted with bold typography,
                clean layouts, and modern storytelling aesthetics.
              </p>

              {/* Decorative Circle */}
              <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full"></div>

              {/* Decorative Line */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
            </div>
          </div>

          {/* Decorative Border */}
          <div className="absolute -z-10 top-10 right-10 w-full h-full border-2 border-black"></div>
        </div>
      </div>
    </section>
  );
}
