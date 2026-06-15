import React from "react";
import { FoldHorizontal } from "lucide-react";

export default function Hero({ data }) {
  if (!data?.personal) return null;

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-[#f6f1e7] px-6 py-24 md:px-12 overflow-hidden border-b-2 border-black/10">
      {/* Background origami shapes */}
      <div className="absolute top-20 right-10 h-48 w-48 rotate-45 bg-[#efe6d6] border border-black/10 opacity-70" />
      <div className="absolute bottom-1/4 left-[-2%] h-72 w-72 -rotate-12 bg-[#f1e3cc] border border-black/10 opacity-60" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-2 shadow-[4px_4px_0px_#000] mb-8">
          <FoldHorizontal size={16} />
          <span className="font-mono text-xs uppercase tracking-widest">
            Origami Paper Theme
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
          {data.personal.name || "John Doe"}
        </h1>

        <p className="text-xl md:text-3xl font-serif text-gray-700 max-w-2xl mx-auto leading-relaxed mb-12">
          {data.personal.role || "Creative Developer & Designer"}
        </p>

        <a 
          href="#projects" 
          className="inline-block bg-white border-2 border-black px-8 py-4 font-bold text-black shadow-[6px_6px_0px_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all"
        >
          Unfold My Work
        </a>
      </div>
    </section>
  );
}
