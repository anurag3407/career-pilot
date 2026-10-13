import React from "react";
import { ArrowRight, Download, Sparkles } from "lucide-react";

export default function Hero({ data }) {
  const personal = data?.personal || {};

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] flex items-center justify-center py-20 px-6 text-white">
      {/* Las Vegas style background effects */}
      <div className="absolute inset-0 bg-black/40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[150px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-yellow-500/20 blur-[150px]"></div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 backdrop-blur-md">
            <Sparkles className="animate-pulse text-yellow-400" size={20} />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">
              Welcome to the Show
            </span>
          </div>
        </div>

        <h1 className="mb-6 text-5xl font-black uppercase leading-[1.1] tracking-[0.1em] md:text-7xl lg:text-8xl">
          <span className="block text-transparent bg-gradient-to-r from-white to-gray-400 bg-clip-text">
            I am
          </span>
          <span className="mt-2 block text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-red-500 bg-clip-text drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]">
            {personal.name || "John Doe"}
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300 font-medium uppercase tracking-widest">
          {personal.title || "Software Engineer"}
        </p>

        <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-400 leading-relaxed">
          {personal.tagline || "Betting on innovation and hitting the jackpot with code."}
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <button type="button" className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 px-8 py-4 font-black uppercase tracking-wider text-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(250,204,21,0.6)]">
            See Projects
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
          
          <button type="button" className="group flex items-center gap-3 rounded-full border-2 border-yellow-500/50 bg-black/50 px-8 py-4 font-black uppercase tracking-wider text-yellow-400 backdrop-blur-md transition-all hover:bg-yellow-500/10 hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]">
            Download CV
            <Download size={20} className="transition-transform group-hover:translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
