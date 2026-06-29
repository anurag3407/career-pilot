import React from "react";
import { Wrench } from "lucide-react";

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#f6f1e7] px-6 py-24 md:px-12 border-t-2 border-black/10">
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-2 shadow-[4px_4px_0px_#000]">
            <Wrench size={16} />
            <span className="font-mono text-xs uppercase tracking-widest">
              Toolkit
            </span>
          </div>

          <h2 className="mt-6 text-4xl md:text-5xl font-black tracking-tight text-black">
            Skills & Expertise
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, i) => (
            <div
              key={i}
              className="group relative bg-white border-2 border-black px-6 py-3 shadow-[4px_4px_0px_#000] transition-all duration-300 hover:-translate-y-1 hover:-rotate-1 hover:shadow-[6px_6px_0px_#000] cursor-default"
            >
              {/* Fold Corner */}
              <div className="absolute top-0 right-0 h-4 w-4 bg-[#e9dcc7] border-b-2 border-l-2 border-black" />

              {/* Paper Shadow Layer */}
              <div className="absolute -bottom-1 -left-1 w-full h-full bg-[#efe6d6] border-2 border-black -z-10" />

              <span className="font-bold text-black text-sm tracking-wide">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}