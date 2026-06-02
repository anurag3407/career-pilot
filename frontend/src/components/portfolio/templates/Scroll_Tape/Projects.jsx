import React, { useState } from 'react';
import { Briefcase, ArrowUpRight, Github } from 'lucide-react';

export default function Projects({ data }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const currentProject = data.projects[selectedIdx] || data.projects[0];

  return (
    <div className="flex-1 flex flex-col justify-between h-full font-mono text-[#00f3ff]">
      {/* OSD label */}
      <div className="flex justify-between items-center text-xs tracking-wider text-pink-500 font-bold border-b border-cyan-900/30 pb-3 mb-4">
        <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> INDEX: 04_WORK</span>
        <span className="text-cyan-400">PLAY: 0:07:30</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-stretch">
        
        {/* Project Selector List (Tape Stack / Shelf) */}
        <div className="md:col-span-5 flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
          <span className="text-[10px] text-gray-500 font-bold tracking-widest mb-1">SELECT VIDEO TAPE:</span>
          {data.projects.map((proj, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#121319] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                    : 'bg-[#08080a] text-gray-400 border-gray-900 hover:border-gray-800 hover:text-gray-300'
                }`}
              >
                {/* Visual cassette gear pattern indicator */}
                <div className="flex items-center gap-2.5">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-dashed flex-shrink-0 ${isSelected ? 'border-cyan-400 animate-spin' : 'border-gray-700'}`} />
                  <span className="text-xs font-bold truncate select-text">{proj.title}</span>
                </div>
                {isSelected && (
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider scale-90">
                    PLAYING
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Project Details Panel (TV Display monitor / Video Output) */}
        <div className="md:col-span-7 flex flex-col bg-[#121319] p-4 rounded-xl border border-cyan-500/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] relative min-h-[250px] justify-between">
          <div className="absolute top-2 right-3 text-[9px] text-pink-500 font-bold uppercase tracking-widest">
            SOURCE: VTR-1
          </div>

          {currentProject && (
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-500 tracking-wider">PROJECT DETAIL:</span>
                <h3 className="text-lg font-black text-white uppercase select-text mt-0.5">{currentProject.title}</h3>
                
                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentProject.techStack.map((tech) => (
                    <span key={tech} className="text-[9px] font-bold bg-[#08080a] text-cyan-400 border border-cyan-900/40 px-2 py-0.5 rounded select-text">
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-xs text-gray-300 leading-relaxed font-sans select-text">
                  {currentProject.description}
                </p>
              </div>

              {/* Action Links */}
              <div className="flex gap-3 pt-3 border-t border-gray-800 shrink-0">
                {currentProject.liveUrl && (
                  <a
                    href={currentProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-cyan-400 text-black text-xs font-bold rounded hover:bg-white transition-colors flex items-center gap-1.5"
                  >
                    <span>LIVE DEMO</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
                {currentProject.githubUrl && (
                  <a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#08080a] text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700 text-xs font-bold rounded transition-colors flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>CODE</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="text-[9px] text-gray-600 border-t border-cyan-900/30 pt-3 mt-4 text-right">
        VTR AUDIO MONO TRACK ACTIVE
      </div>
    </div>
  );
}
