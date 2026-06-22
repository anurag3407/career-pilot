import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';

/**
 * Elastic Cards Portfolio Template
 * Category: Animated / Motion
 * Description: Project cards that stretch and snap like rubber bands on hover/drag. Elastic deformation effect using CSS transforms and spring transitions.
 */
export default function ElasticCards() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          {data.personal.name}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8">{data.personal.title}</p>
        <div className="p-8 border-2 border-dashed border-cyan-500/40 rounded-2xl bg-gray-900/50 backdrop-blur-sm">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
            Animated / Motion
          </span>
          <h2 className="text-2xl font-bold text-gray-200 mb-3">Elastic Cards Template</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Project cards that stretch and snap like rubber bands on hover/drag. Elastic deformation effect using CSS transforms and spring transitions.
          </p>
          <p className="text-cyan-400 font-semibold">Open an issue to contribute and build this template!</p>
        </div>
      </div>
    </div>
  );
}
