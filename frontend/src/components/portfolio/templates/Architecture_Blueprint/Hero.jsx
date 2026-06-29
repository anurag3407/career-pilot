import React from 'react';
import { ArrowRight, Compass, Maximize, Ruler, Square, Hexagon, Crosshair } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-[#030e1a] overflow-hidden font-mono text-cyan-50 selection:bg-cyan-500/30">
      
      {/* --- BACKGROUND BLUEPRINT GRID --- */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '8px 8px'
        }}
      ></div>

      {/* Radial vignette to fade out edges focus on center */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#030e1a_100%)] opacity-80"></div>

      {/* --- TECHNICAL FRAMES & GUIDES --- */}
      <div className="absolute inset-4 md:inset-8 border border-cyan-800/50 pointer-events-none flex justify-between z-0">
        {/* Top/Left Ruler Marks */}
        <div className="absolute top-0 left-0 w-full h-4 flex gap-[8px] overflow-hidden opacity-30">
          {[...Array(200)].map((_, i) => (
            <div key={`top-rule-${i}`} className={`w-px bg-cyan-400 ${i % 5 === 0 ? 'h-3' : 'h-1.5'}`}></div>
          ))}
        </div>
        <div className="absolute top-0 left-0 h-full w-4 flex flex-col gap-[8px] overflow-hidden opacity-30">
          {[...Array(100)].map((_, i) => (
            <div key={`left-rule-${i}`} className={`h-px bg-cyan-400 ${i % 5 === 0 ? 'w-3' : 'w-1.5'}`}></div>
          ))}
        </div>

        {/* Technical Corner Brackets */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan-500"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500"></div>
        
        {/* Crosshairs in corners */}
        <Crosshair className="absolute top-4 left-4 w-4 h-4 text-cyan-700" />
        <Crosshair className="absolute bottom-4 right-4 w-4 h-4 text-cyan-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 pt-32 pb-24 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* --- LEFT CONTENT COLUMN --- */}
        <div className="w-full lg:w-[55%] flex flex-col gap-8 relative z-20">
          
          {/* Annotation Label */}
          <div className="flex items-center gap-4 text-cyan-400 text-xs md:text-sm tracking-[0.25em] uppercase">
            <span className="w-12 h-px bg-cyan-400"></span>
            <span>Blueprint ID: Alpha-01</span>
            <span className="text-[10px] opacity-60 ml-auto border border-cyan-800 px-2 py-0.5">REV. 01</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light uppercase tracking-tight text-cyan-50 leading-[1.1]">
            Drafting The <br/>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Future Foundation
            </span>
          </h1>

          <p className="text-lg md:text-xl text-cyan-200/60 font-light max-w-xl leading-relaxed border-l-2 border-cyan-600/40 pl-6">
            Architecting robust, scalable web solutions. Every line of code is meticulously drafted to construct performant and breathtaking digital experiences.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-6 pt-4">
            <button className="group relative px-8 py-4 bg-cyan-950/40 border border-cyan-500 text-cyan-300 font-semibold uppercase tracking-widest overflow-hidden hover:bg-cyan-900/60 transition-all duration-300">
              <span className="relative z-10 flex items-center gap-3">
                Examine Blueprints
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </span>
              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {/* Scanning line animation */}
              <div className="absolute top-0 left-0 w-full h-px bg-cyan-400/50 -translate-y-full group-hover:translate-y-[60px] transition-transform duration-1000 ease-in-out"></div>
            </button>

            <button className="px-8 py-4 text-cyan-500/80 font-medium uppercase tracking-widest hover:text-cyan-300 transition-colors flex items-center gap-3 border border-transparent hover:border-cyan-800/50">
              <Compass className="w-5 h-5" />
              Begin Draft
            </button>
          </div>

          {/* Technical Specs Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-8 border-t border-cyan-800/50">
            <div>
              <div className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Square className="w-3 h-3"/> Scale</div>
              <div className="text-cyan-300 font-semibold text-sm">1:100</div>
            </div>
            <div>
              <div className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Hexagon className="w-3 h-3"/> Status</div>
              <div className="text-cyan-300 font-semibold text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></span>
                In Progress
              </div>
            </div>
            <div>
              <div className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1.5">Elevation</div>
              <div className="text-cyan-300 font-semibold text-sm">Front / UI</div>
            </div>
            <div>
              <div className="text-[10px] text-cyan-600 uppercase tracking-widest mb-1.5">Coordinates</div>
              <div className="text-cyan-300 font-semibold text-sm tracking-wider">45°N 12°E</div>
            </div>
          </div>
        </div>

        {/* --- RIGHT VISUAL COLUMN (Isometric 3D Architecture) --- */}
        <div className="w-full lg:w-[45%] relative min-h-[450px] lg:min-h-[550px] flex items-center justify-center group cursor-crosshair">
           
           {/* Center Reference Rings */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] border border-cyan-900/30 rounded-full"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] border border-dashed border-cyan-800/40 rounded-full animate-[spin_60s_linear_infinite]"></div>
           
           {/* Axis Lines */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-px bg-cyan-800/30"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full max-h-[600px] w-px bg-cyan-800/30"></div>

           {/* 3D Isometric Container */}
           <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 transition-transform duration-700 ease-in-out" style={{ transform: 'perspective(1200px) rotateX(60deg) rotateZ(-45deg)', transformStyle: 'preserve-3d' }}>
              
              {/* Base Blueprint Floor */}
              <div 
                className="absolute inset-0 border-2 border-cyan-600/50 bg-[#030e1a]/80 backdrop-blur-md"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(34, 211, 238, 0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(34, 211, 238, 0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px'
                }}
              ></div>

              {/* Base floor nodes */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400"></div>

              {/* Tower 1 (Left Area) */}
              <div className="absolute bottom-6 left-6 w-24 h-24 border border-cyan-500/40" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 border-2 border-cyan-400 bg-cyan-900/30 backdrop-blur-[2px] transition-all duration-700 ease-out [transform:translateZ(1px)] group-hover:[transform:translateZ(50px)] shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  {/* Roof grid detail */}
                  <div className="w-full h-full bg-[linear-gradient(to_right,rgba(34,211,238,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.2)_1px,transparent_1px)] bg-[size:8px_8px]"></div>
                </div>
              </div>

              {/* Tower 2 (Right Area) */}
              <div className="absolute top-12 right-6 w-20 h-32 border border-cyan-500/40" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 border-2 border-cyan-300 bg-cyan-800/40 backdrop-blur-[2px] transition-all duration-1000 ease-out [transform:translateZ(1px)] group-hover:[transform:translateZ(90px)] shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center">
                  <div className="w-8 h-8 border border-cyan-200/50 rotate-45"></div>
                </div>
              </div>

              {/* Main Central Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-cyan-400/60" style={{ transformStyle: 'preserve-3d' }}>
                <div className="absolute inset-0 border-2 border-cyan-200 bg-cyan-600/50 backdrop-blur-md transition-all duration-[1200ms] ease-out [transform:translateZ(1px)] group-hover:[transform:translateZ(140px)] shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                  <div className="absolute inset-2 border border-cyan-100/60 animate-pulse"></div>
                </div>
              </div>

              {/* Floating Blueprint Markers */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-1000 delay-300 [transform:translateZ(0px)] group-hover:[transform:translateZ(180px)]"></div>
              <div className="absolute bottom-4 right-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] transition-all duration-700 delay-100 [transform:translateZ(0px)] group-hover:[transform:translateZ(80px)]"></div>
           </div>

           {/* Floating Info Panels (2D Overlays) */}
           <div className="absolute top-[10%] -right-4 md:right-0 bg-[#030e1a]/80 backdrop-blur-md border border-cyan-700/60 p-3 hidden md:block w-40 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transform translate-y-4 group-hover:-translate-y-2 transition-transform duration-700">
             <div className="flex items-center gap-2 mb-2">
               <Maximize className="w-3.5 h-3.5 text-cyan-400" />
               <span className="text-[10px] text-cyan-300 uppercase tracking-widest font-bold">Structural Load</span>
             </div>
             <div className="w-full h-1 bg-cyan-950 overflow-hidden mb-1">
               <div className="h-full bg-cyan-400 w-[78%]"></div>
             </div>
             <div className="text-right text-[9px] text-cyan-500 font-mono">CAPACITY: 78%</div>
           </div>

           <div className="absolute bottom-[10%] -left-4 md:-left-4 bg-[#030e1a]/80 backdrop-blur-md border border-cyan-700/60 p-3 hidden md:block w-36 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transform -translate-y-4 group-hover:translate-y-2 transition-transform duration-700 delay-100">
             <div className="flex items-center gap-2 mb-1.5">
               <Ruler className="w-3.5 h-3.5 text-cyan-400" />
               <span className="text-[10px] text-cyan-300 uppercase tracking-widest font-bold">Tolerance</span>
             </div>
             <div className="text-sm text-white font-mono tracking-widest">±0.005<span className="text-cyan-500 text-xs">mm</span></div>
           </div>

        </div>
      </div>
    </div>
  );
}
