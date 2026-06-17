import React, { useContext, useState } from 'react';
import { PortfolioContext } from '../../../../context/PortfolioContext';

const CrosswordPuzzleWordFill = () => {
  // Pull live or fallback data streams straight from global context
  const { portfolioData, dummyData } = useContext(PortfolioContext);
  
  const source = portfolioData?.crosswordTemplate || dummyData?.crosswordTemplate || {
    title: "Interactive Skills Crossword",
    subtitle: "Solve the puzzle to explore my technology stack and achievements.",
    grid: [
      ["1", "T", "A", "I", "L", "W", "I", "N", "D", ""],
      ["", "", "", "", "", "", "I", "", "", ""],
      ["", "2", "R", "E", "A", "C", "T", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""]
    ],
    clues: {
      across: [
        { id: "A1", num: 1, text: "The primary utility-first CSS styling framework used here." },
        { id: "A2", num: 2, text: "Popular open-source declarative JavaScript library for UI composition." }
      ],
      down: [
        { id: "D1", num: 1, text: "Distributed source version control protocol." }
      ]
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center">
      <div className="max-w-5xl w-full text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
          {source.title}
        </h1>
        <p className="text-slate-400 text-lg">{source.subtitle}</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CROSSWORD INTERACTIVE GRID */}
        <div className="lg:col-span-7 bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl flex flex-col items-center">
          <div className="grid gap-1 bg-slate-950 p-3 rounded-xl border border-slate-800"
               style={{ gridTemplateColumns: `repeat(${source.grid[0].length}, minmax(0, 1fr))` }}>
            {source.grid.map((row, rIdx) => 
              row.map((cell, cIdx) => (
                <div key={`cell-${rIdx}-${cIdx}`} className={`relative w-10 h-10 flex items-center justify-center transition-all ${cell === "" ? 'bg-slate-900 border border-slate-900/40' : 'bg-slate-800 border border-slate-700 hover:border-indigo-500'}`}>
                  {cell.match(/[1-9]/) && (
                    <span className="absolute top-0.5 left-0.5 text-[9px] font-bold text-indigo-400 select-none">
                      {cell}
                    </span>
                  )}
                  {cell !== "" && !cell.match(/[1-9]/) && (
                    <input 
                      type="text" 
                      maxLength={1}
                      className="w-full h-full text-center bg-transparent uppercase font-bold text-white focus:outline-none focus:bg-indigo-950/40"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ACROSS / DOWN CLUES SIDEBAR MODULES */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xl font-bold text-indigo-400 border-b border-slate-700 pb-2 mb-3">Across Clues</h3>
            <ul className="space-y-2.5">
              {source.clues.across.map(clue => (
                <li key={clue.id} className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-white bg-indigo-600/30 border border-indigo-500/30 px-1.5 py-0.5 rounded mr-2">{clue.num}</span>
                  {clue.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xl font-bold text-cyan-400 border-b border-slate-700 pb-2 mb-3">Down Clues</h3>
            <ul className="space-y-2.5">
              {source.clues.down.map(clue => (
                <li key={clue.id} className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-white bg-cyan-600/30 border border-cyan-500/30 px-1.5 py-0.5 rounded mr-2">{clue.num}</span>
                  {clue.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CrosswordPuzzleWordFill;
