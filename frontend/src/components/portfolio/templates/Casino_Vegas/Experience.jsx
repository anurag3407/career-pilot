import React from "react";
import { Briefcase, Star } from "lucide-react";

export default function Experience({ data }) {
  if (!data?.experience || data.experience.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#050505] py-20 px-6 text-white border-y border-yellow-500/20">
      {/* Background glow */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-red-600/10 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-yellow-500/10 blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Star className="animate-pulse text-yellow-400" size={32} />
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] text-yellow-400 drop-shadow-[0_0_18px_rgba(250,204,21,0.9)]">
              High Rollers
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            A track record of winning big in the industry.
          </p>
        </div>

        <div className="space-y-8">
          {data.experience.map((exp, index) => (
            <div
              key={index}
              className="group relative flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden rounded-3xl border border-yellow-500/30 bg-white/[0.03] p-8 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]"
            >
              {/* Timeline marker / Icon */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                <Briefcase className="text-white" size={28} />
              </div>

              <div>
                <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                  <h3 className="text-2xl font-bold text-yellow-300">
                    {exp.role || exp.title}
                  </h3>
                  <span className="mt-2 inline-block rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-sm font-semibold tracking-wider text-red-400 md:mt-0">
                    {exp.period || exp.duration}
                  </span>
                </div>
                <h4 className="mb-4 text-xl font-medium text-gray-400">
                  {exp.company}
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {exp.description}
                </p>
              </div>

              {/* Casino chip accent */}
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full border-[12px] border-yellow-500/10 transition-transform duration-500 group-hover:rotate-45"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
