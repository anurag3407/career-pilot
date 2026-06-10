import React from "react";
import { Zap, Crown } from "lucide-react";

export default function Skills({ data }) {
  if (!data?.skills || data.skills.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-black py-20 px-6 text-white">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/10 blur-[150px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Zap className="animate-pulse text-yellow-400" size={32} />
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.9)]">
              Winning Hand
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            The technical arsenal stacked for the jackpot.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.skills.map((skill, index) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[24px] border border-yellow-500/20 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-yellow-400/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]"
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <Crown className="mb-4 text-yellow-400 opacity-50 group-hover:opacity-100 transition-opacity" size={36} />
                  <h3 className="text-xl font-bold text-gray-200 group-hover:text-yellow-300 transition-colors">
                    {skillName}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
