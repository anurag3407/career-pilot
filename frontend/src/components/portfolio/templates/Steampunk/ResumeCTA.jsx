import React from "react";
import { Download } from "lucide-react";

export default function ResumeCTA() {
  return (
    <section className="w-full py-16 px-6">
      <div className="max-w-4xl mx-auto rounded-2xl border border-amber-700 bg-[#24180f] p-8 md:p-12 text-center">
        <span className="inline-block mb-4 text-sm uppercase tracking-widest text-amber-500">
          Steampunk Portfolio
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-4">
          Download My Resume
        </h2>

        <p className="text-amber-200/80 max-w-2xl mx-auto mb-8">
          Interested in my work? Download my resume to learn more about my
          experience, technical skills, projects, and achievements.
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-amber-600 hover:scale-105"
        >
          <Download size={18} />
          Download Resume
        </button>
      </div>
    </section>
  );
}