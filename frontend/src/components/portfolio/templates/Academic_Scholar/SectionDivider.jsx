import React from "react";
import { GraduationCap } from "lucide-react";

const SectionDivider = () => {
  return (
    <div className="overflow-hidden border-y border-stone-800 bg-stone-900 py-3">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-6 mx-8 text-stone-400 uppercase tracking-[0.3em] text-sm"
          >
            <span>Academic Scholar</span>

            <GraduationCap
              size={16}
              className="text-amber-200"
            />

            <span>Research Portfolio</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionDivider;