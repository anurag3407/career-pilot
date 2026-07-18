import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { User, Shield, Target, Zap } from 'lucide-react';

export default function About() {
  const { portfolioData: data } = usePortfolio();

  if (!data?.about) return null;

  return (
    <section id="about" className="relative w-full bg-[#030e1a] py-24 px-6 md:px-16 font-mono text-cyan-50 border-t border-cyan-900/50">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Visual Schematic */}
        <div className="w-full lg:w-5/12 relative group">
          <div className="absolute inset-0 bg-cyan-900/20 mix-blend-screen opacity-50"></div>
          
          <div className="relative aspect-square border border-cyan-800/60 bg-[#030e1a]/80 p-4">
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>

            {data.about.avatarImage ? (
              <img 
                src={data.about.avatarImage} 
                alt={data.personal?.name || "Profile Schematic"} 
                className="w-full h-full object-cover filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-cyan-800">
                <User className="w-16 h-16 text-cyan-800 mb-4" />
                <span className="text-cyan-600 text-xs uppercase tracking-widest">Image File Missing</span>
              </div>
            )}

            {/* Overlay grid lines */}
            <div className="absolute inset-0 pointer-events-none border border-cyan-500/20"
                 style={{ backgroundImage: `linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`, backgroundSize: '10% 10%' }}>
            </div>

            {/* Scanning line animation */}
            <div className="absolute top-0 left-0 w-full h-px bg-cyan-400/50 shadow-[0_0_8px_#22d3ee] animate-[scan_3s_ease-in-out_infinite]"></div>
          </div>

          {/* Floating Data Labels */}
          <div className="absolute -right-4 top-1/4 bg-[#030e1a] border border-cyan-800 p-2 text-[10px] text-cyan-400 font-mono tracking-widest shadow-lg hidden md:block">
            OBJ_ID: {data.personal?.name?.replace(/\s+/g, '_').toUpperCase() || 'USER_01'}
          </div>
          <div className="absolute -left-4 bottom-1/4 bg-[#030e1a] border border-cyan-800 p-2 text-[10px] text-cyan-400 font-mono tracking-widest shadow-lg hidden md:block">
            STATUS: OPERATIONAL
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-7/12 flex flex-col">
          <div className="flex items-center gap-4 text-cyan-400 text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
            <span className="w-12 h-px bg-cyan-400"></span>
            <span>Profile Synopsis</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tight text-cyan-50 mb-8">
            Architectural <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Summary</span>
          </h2>

          <div className="space-y-6 text-cyan-100/70 leading-relaxed font-light">
            <p className="text-lg md:text-xl border-l-2 border-cyan-500 pl-6 text-cyan-50">
              {data.about.bio || "Crafting digital structures with precision, logic, and aesthetic integrity."}
            </p>

            <p className="pl-6 md:pl-8 text-sm md:text-base opacity-80">
              {data.about.longDescription || "Specializing in robust system architectures and seamless user interfaces, each project is approached as a complex blueprint waiting to be realized. By combining modern frameworks with structural design principles, the resulting products are both visually striking and fundamentally sound."}
            </p>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-cyan-900/50">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-cyan-500 mt-0.5" />
              <div>
                <div className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">Protocol</div>
                <div className="text-sm text-cyan-300">Clean Code & Security</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-cyan-500 mt-0.5" />
              <div>
                <div className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">Objective</div>
                <div className="text-sm text-cyan-300">Scalable Solutions</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-cyan-500 mt-0.5" />
              <div>
                <div className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">Performance</div>
                <div className="text-sm text-cyan-300">Highly Optimized</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 border border-cyan-500 rounded flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-cyan-400 rounded-sm"></div>
              </div>
              <div>
                <div className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">Methodology</div>
                <div className="text-sm text-cyan-300">Agile Engineering</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
