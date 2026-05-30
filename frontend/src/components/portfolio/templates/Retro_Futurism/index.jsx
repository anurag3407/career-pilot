import React from 'react';
import data from '../../../../data/dummy_data.json';

/**
 * Retro Futurism Portfolio Template
 * Category: Retro / Nostalgic
 * Description: 70s/80s retro-futuristic vision with chrome text, sunset grids, DeLorean vibes. Outrun/synthwave color palette (pink, purple, cyan) on dark backgrounds.
 */
export default function RetroFuturism() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          {data.personal.name}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8">{data.personal.title}</p>
        <div className="p-8 border-2 border-dashed border-cyan-500/40 rounded-2xl bg-gray-900/50 backdrop-blur-sm">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
            Retro / Nostalgic
          </span>
          <h2 className="text-2xl font-bold text-gray-200 mb-3">Retro Futurism Template</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            70s/80s retro-futuristic vision with chrome text, sunset grids, DeLorean vibes. Outrun/synthwave color palette (pink, purple, cyan) on dark backgrounds.
          </p>
          <p className="text-cyan-400 font-semibold">Open an issue to contribute and build this template!</p>
        </div>
      </div>
    </div>
  );
}
