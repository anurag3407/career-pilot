import React from "react";
import {
  Sparkles,
  Crown,
  Download,
  ArrowRight,
  Star,
  Coins,
  Trophy,
  Gem,
} from "lucide-react";

export default function ResumeCTA() {
  return (
    <section className="relative overflow-hidden bg-[#050505] py-28 text-white">
      {/* Animated Background Glow */}
      <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-red-600/20 blur-[160px]" />
      <div className="absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-yellow-500/20 blur-[160px]" />
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[120px]" />

      {/* Floating Icons */}
      <Coins
        className="absolute left-10 top-24 hidden animate-bounce text-yellow-400/20 lg:block"
        size={90}
      />
      <Crown
        className="absolute right-20 top-24 hidden animate-pulse text-red-500/20 lg:block"
        size={90}
      />
      <Gem
        className="absolute bottom-16 left-1/4 hidden animate-pulse text-pink-500/20 lg:block"
        size={70}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[42px] border border-yellow-400/20 bg-white/[0.04] p-10 shadow-[0_0_80px_rgba(255,215,0,0.08)] backdrop-blur-2xl md:p-16">
          
          {/* Neon Border */}
          <div className="absolute inset-0 rounded-[42px] border border-yellow-400/10"></div>

          {/* Glitter Effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-12 top-16 h-2 w-2 rounded-full bg-yellow-400 animate-ping"></div>
            <div className="absolute right-20 top-32 h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>
            <div className="absolute bottom-24 left-1/3 h-2 w-2 rounded-full bg-pink-400 animate-bounce"></div>
          </div>

          {/* Badge */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-7 py-3 backdrop-blur-md">
              <Sparkles className="animate-pulse text-yellow-400" size={22} />
              <span className="text-sm font-bold uppercase tracking-[0.35em] text-yellow-300">
                Vegas Elite Resume
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-5xl font-black uppercase leading-[1.1] tracking-[0.15em] text-transparent bg-gradient-to-r from-yellow-200 via-yellow-500 to-red-500 bg-clip-text drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] md:text-7xl xl:text-8xl">
              WIN THE
              <br />
              CAREER JACKPOT
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
              Step into the spotlight with a dazzling Vegas-inspired resume
              designed to attract recruiters, unlock opportunities, and make
              your professional brand unforgettable.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-16 flex flex-col items-center justify-center gap-5 sm:flex-row">
            <button type="button" className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 px-9 py-4 text-lg font-black uppercase tracking-wide text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(250,204,21,0.6)]">
              Download Resume
              <Download
                size={22}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </button>

            <button type="button" className="group flex items-center gap-3 rounded-full border border-yellow-400/40 bg-white/5 px-9 py-4 text-lg font-black uppercase tracking-wide text-yellow-300 backdrop-blur-md transition-all duration-300 hover:border-yellow-300 hover:bg-yellow-400 hover:text-black">
              Explore Portfolio
              <ArrowRight
                size={22}
                className="transition-transform duration-300 group-hover:translate-x-2"
              />
            </button>
          </div>

          {/* Premium Stats */}
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Trophy,
                value: "99%",
                label: "Interview Success",
              },
              {
                icon: Crown,
                value: "24/7",
                label: "Career Support",
              },
              {
                icon: Star,
                value: "50+",
                label: "Luxury Templates",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="group rounded-[28px] border border-yellow-400/10 bg-white/[0.03] p-8 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400/30 hover:shadow-[0_0_30px_rgba(250,204,21,0.15)]"
                >
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-400 to-red-500 shadow-lg">
                    <Icon className="text-white" size={30} />
                  </div>

                  <h3 className="text-5xl font-black text-yellow-400">
                    {item.value}
                  </h3>

                  <p className="mt-3 text-lg text-gray-400">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Decorative Casino Chips */}
          <div className="absolute -bottom-14 -right-14 h-44 w-44 rounded-full border-[18px] border-red-500/20"></div>
          <div className="absolute -top-10 -left-10 h-28 w-28 rounded-full border-[12px] border-yellow-400/20"></div>
        </div>
      </div>
    </section>
  );
}