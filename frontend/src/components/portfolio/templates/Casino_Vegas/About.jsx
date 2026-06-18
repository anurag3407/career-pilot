import React from "react";
import { Trophy, Flame } from "lucide-react";

export default function About({ data }) {
  const personal = data?.personal || {};

  return (
    <section className="relative overflow-hidden bg-black py-24 px-6 text-white border-y border-yellow-500/10">
      <div className="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-pink-600/10 blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          
          {/* Image/Visual Side */}
          <div className="relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border-2 border-yellow-500/30"></div>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-900/40 to-red-900/40 border border-yellow-500/20 backdrop-blur-sm p-2">
              <img 
                src={personal.avatar || "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop"} 
                alt={personal.name || "Profile"}
                className="w-full h-auto aspect-square object-cover rounded-2xl opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-yellow-500/20 pointer-events-none"></div>
            </div>
            {/* Floating Element */}
            <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full border-[8px] border-yellow-400/30 bg-black flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(250,204,21,0.2)]">
              <Trophy className="text-yellow-400" size={32} />
            </div>
          </div>

          {/* Text Side */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Flame className="animate-pulse text-red-500" size={28} />
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                The Story
              </h2>
            </div>
            
            <h3 className="mb-8 text-2xl font-bold text-yellow-400">
              {personal.role || "Developer & Designer"}
            </h3>

            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                {personal.bio || "I'm a passionate creator who turns bold ideas into digital reality. With a background in high-stakes projects, I bring a unique blend of technical expertise and creative vision."}
              </p>
              <p>
                Every project is a chance to hit the jackpot. I believe in writing clean, scalable code while delivering user experiences that shine brighter than the neon lights of the Strip.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="border-l-2 border-yellow-500 pl-4">
                <p className="text-4xl font-black text-white">5+</p>
                <p className="text-sm font-bold uppercase tracking-wider text-yellow-400 mt-1">Years Exp</p>
              </div>
              <div className="border-l-2 border-red-500 pl-4">
                <p className="text-4xl font-black text-white">50+</p>
                <p className="text-sm font-bold uppercase tracking-wider text-red-400 mt-1">Projects Won</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
