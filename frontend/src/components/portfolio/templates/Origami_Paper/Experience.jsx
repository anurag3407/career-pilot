import React from "react";
import { Briefcase } from "lucide-react";

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#f6f1e7] px-6 py-24 md:px-12 border-t-2 border-black/10">
      {/* Background origami shapes */}
      <div className="absolute left-[-5%] top-20 h-64 w-64 rotate-12 bg-[#efe6d6] border border-black/10 opacity-60" />
      <div className="absolute right-[-2%] bottom-10 h-40 w-40 -rotate-12 bg-[#f1e3cc] border border-black/10 opacity-70" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-2 shadow-[4px_4px_0px_#000]">
            <Briefcase size={16} />
            <span className="font-mono text-xs uppercase tracking-widest">
              Journey
            </span>
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-black">
            Experience Timeline
          </h2>
        </div>

        <div className="relative border-l-2 border-black/20 ml-4 md:ml-10 pl-6 md:pl-12 space-y-12">
          {experience.map((exp, i) => (
            <div key={i} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] md:-left-[55px] top-4 h-4 w-4 bg-[#e9dcc7] border-2 border-black rounded-sm shadow-[2px_2px_0px_#000] group-hover:bg-white transition-colors" />

              <div className="relative bg-white border-2 border-black p-6 md:p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                {/* Fold Corner */}
                <div className="absolute top-0 right-0 h-10 w-10 bg-[#e9dcc7] border-b-2 border-l-2 border-black" />

                {/* Paper Shadow Layer */}
                <div className="absolute -bottom-2 -left-2 w-full h-full bg-[#efe6d6] border-2 border-black -z-10" />

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <div>
                    <h3 className="text-2xl font-black text-black">
                      {exp.title}
                    </h3>
                    <p className="font-mono text-sm uppercase tracking-wider text-gray-600 mt-1">
                      {exp.company}
                    </p>
                  </div>
                  <div className="inline-block border border-black px-3 py-1 bg-[#f8f4ec] text-xs font-bold whitespace-nowrap">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed font-serif text-sm md:text-base">
                  {exp.description}
                </p>

                {/* Subtle fold line */}
                <div className="absolute left-0 bottom-4 w-full h-[1px] bg-black/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}