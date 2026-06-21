import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";

export default function Cover() {
  const { portfolioData } = usePortfolio();
  const name = portfolioData?.personal?.name || "YOUR NAME";
  const title = portfolioData?.personal?.title || "DEVELOPER";

  return (
    <div className="border-2 border-black p-8 md:p-16 mb-12 bg-white relative">
      <div className="absolute top-4 right-4 bg-[#ffda1a] text-black font-bold text-xl px-3 py-1 border-2 border-black uppercase">
        IKEA
      </div>
      <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-4">
        {name}
      </h1>
      <h2 className="text-2xl md:text-4xl font-bold mb-8 text-[#0051ba] uppercase">
        {title}
      </h2>
      <div className="w-full max-w-sm border-2 border-black h-48 md:h-64 flex items-center justify-center bg-[#f4f4f0] mb-8 overflow-hidden relative">
        {portfolioData?.personal?.avatar ? (
          <img src={portfolioData.personal.avatar} alt={name || "Profile Avatar"} className="w-full h-full object-cover grayscale" />
        ) : (
          <span className="text-4xl font-black uppercase">FIGURE 1</span>
        )}
      </div>
      <p className="text-lg font-bold max-w-2xl">
        {portfolioData?.personal?.bio || "A brief description of who you are and what you build."}
      </p>
    </div>
  );
}
