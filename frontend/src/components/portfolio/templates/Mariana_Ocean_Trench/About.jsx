import React from 'react';
import { motion } from 'framer-motion';
import { Anchor, MapPin, User, FileText, Terminal } from 'lucide-react';

export default function About({ data }) {
  const personal = data?.personal || data?.personalInfo || {};

  return (
    <section 
      id="sunlight-zone"
      className="relative w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#075985] via-[#0c4a6e] to-[#0b3c5d] p-6 md:p-12 text-white overflow-hidden select-none"
    >
      {/* Sunlight zone background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
        <div className="absolute bottom-[-10%] left-[5%] w-32 h-64 bg-emerald-500/20 blur-xl skew-y-12" />
        <div className="absolute bottom-[-20%] right-[10%] w-48 h-80 bg-cyan-500/25 blur-2xl -skew-y-12" />
        
        {/* Subtle SVG Fish silhouettes floating across */}
        <svg className="absolute top-[20%] left-[-10%] w-24 h-12 text-sky-200 fill-current animate-fish-swim-1" viewBox="0 0 100 50">
          <path d="M10,25 C30,10 70,10 90,25 C70,40 30,40 10,25 Z M90,25 L100,15 L95,25 L100,35 Z" />
        </svg>
        <svg className="absolute top-[50%] right-[-10%] w-16 h-8 text-sky-300 fill-current animate-fish-swim-2" viewBox="0 0 100 50">
          <path d="M10,25 C30,10 70,10 90,25 C70,40 30,40 10,25 Z M90,25 L100,15 L95,25 L100,35 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col gap-8 md:gap-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-sky-400/30 pb-4">
          <Anchor className="w-8 h-8 text-sky-400 animate-pulse" />
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider font-mono">
              01 // SUNLIGHT_ZONE: RESEARCH_STATION
            </h2>
            <p className="text-xs text-sky-300/80 font-mono mt-1">Status: Ambient Light Level 70% | Core Temperature 14°C</p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Explorer ID Profile Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 bg-slate-950/40 border border-sky-500/25 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center text-center gap-4 relative group"
          >
            {/* Corner LED lights */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-emerald-400/50" />
            
            <div className="relative w-32 h-32 rounded-full border-4 border-sky-500/30 overflow-hidden shadow-lg group-hover:border-sky-400 transition-colors">
              {personal.avatar ? (
                <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <User className="w-16 h-16 text-sky-400" />
                </div>
              )}
            </div>

            <div className="font-mono w-full">
              <h3 className="text-lg font-bold text-sky-100">{personal.name}</h3>
              <p className="text-xs text-sky-400 mt-1">{personal.title || "Full Stack Developer"}</p>
              
              <div className="mt-4 border-t border-sky-500/20 pt-4 flex flex-col gap-2.5 text-left text-xs text-sky-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>LOC: {personal.location || "Ocean Floor coordinates"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span>EXP: {data.experience?.length || 0} Missions Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>DESCENT: Active Exploration</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2 & 3: Research Log / About Details */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Bio Log Panel */}
            <div className="bg-slate-950/40 border border-sky-500/25 backdrop-blur-md p-6 rounded-2xl relative">
              <div className="absolute top-3 right-4 font-mono text-[9px] text-sky-500 uppercase tracking-widest">
                LOG_ID: B-40912
              </div>
              <h3 className="text-base font-bold font-mono text-sky-300 mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                DIVER_BIOGRAPHY
              </h3>
              <p className="text-sm md:text-base leading-relaxed text-sky-100/90 whitespace-pre-line font-sans">
                {personal.bio || "No biography provided. The developer is currently scanning deep water segments and building responsive frameworks."}
              </p>
            </div>

            {/* Mission parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/40 border border-sky-500/25 backdrop-blur-md p-5 rounded-xl font-mono">
                <h4 className="text-xs font-bold text-sky-400 mb-2 uppercase">MISSION_STATEMENT</h4>
                <p className="text-xs text-sky-200 leading-relaxed font-sans">
                  To craft high-performing interfaces and modular software systems that withstand high scale and pressure.
                </p>
              </div>
              
              <div className="bg-slate-950/40 border border-sky-500/25 backdrop-blur-md p-5 rounded-xl font-mono">
                <h4 className="text-xs font-bold text-sky-400 mb-2 uppercase">DESCENT_PARAMETERS</h4>
                <div className="flex flex-col gap-1 text-[11px] text-sky-200 font-mono">
                  <div className="flex justify-between">
                    <span>PRESSURE_LEVEL</span>
                    <span>1.0 - 25.0 atm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DIVE_TARGET</span>
                    <span>Mariana Trench Floor</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SECTOR</span>
                    <span>Pacific Ocean Central</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes fish-swim-left {
          0% { transform: translateX(-10vw) translateY(0) scaleX(1); }
          50% { transform: translateX(50vw) translateY(-20px) scaleX(1); }
          51% { transform: translateX(50vw) translateY(-20px) scaleX(-1); }
          100% { transform: translateX(-10vw) translateY(0) scaleX(-1); }
        }
        @keyframes fish-swim-right {
          0% { transform: translateX(110vw) translateY(0) scaleX(-1); }
          50% { transform: translateX(40vw) translateY(30px) scaleX(-1); }
          51% { transform: translateX(40vw) translateY(30px) scaleX(1); }
          100% { transform: translateX(110vw) translateY(0) scaleX(1); }
        }
        .animate-fish-swim-1 {
          animation: fish-swim-left 35s linear infinite;
        }
        .animate-fish-swim-2 {
          animation: fish-swim-right 28s linear infinite;
        }
      `}</style>
    </section>
  );
}
