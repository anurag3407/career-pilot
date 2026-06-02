import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Radar, Terminal, Shield, Crosshair } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function HologramDisplay() {
  const [dataStream, setDataStream] = useState(['SYS_INIT', 'CALIBRATING...']);
  const personal = data?.personal || {};

  // Simulates a live data stream of hex codes for the HUD
  useEffect(() => {
    const interval = setInterval(() => {
      setDataStream((prev) => {
        const newCode = `0x${Math.random().toString(16).substring(2, 6).toUpperCase()}`;
        const updated = [...prev, newCode];
        return updated.length > 6 ? updated.slice(1) : updated;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[520px] bg-slate-950 p-4 md:p-12 flex flex-col items-center justify-center overflow-hidden font-mono text-cyan-400 select-none border border-cyan-900/20 rounded-xl shadow-[inset_0_0_30px_rgba(8,145,178,0.08)]">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Animated Scanning Line */}
      <motion.div
        className="absolute w-full h-[1px] md:h-[2px] bg-cyan-400/40 shadow-[0_0_10px_#22d3ee] pointer-events-none z-10"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-20 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Left HUD Panel - System Diagnostics */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 p-6 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-xl bg-cyan-950/10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-2">
            <Cpu className="w-5 h-5 text-cyan-300" />
            <h3 className="text-sm md:text-base font-bold text-cyan-300">Diagnostics</h3>
          </div>
          
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-cyan-600">NEURAL_NET</span>
              <span className="text-cyan-300">STABLE</span>
            </div>
            <div className="w-full h-1 bg-cyan-900/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" 
                animate={{ width: ['40%', '80%', '60%', '95%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-cyan-600">MEMORY_ALLOC</span>
              <span className="text-cyan-300">84.2%</span>
            </div>
            <div className="w-full h-1 bg-cyan-900/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" 
                initial={{ width: '84%' }}
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-cyan-950/30 border border-cyan-800/50 rounded">
            <div className="flex items-center gap-2 mb-2 text-cyan-500 text-xs">
              <Terminal className="w-4 h-4" />
              <span>TERMINAL_OUTPUT</span>
            </div>
            <div className="flex flex-col gap-1 text-[10px] text-cyan-300/70">
              {dataStream.map((code, i) => (
                <div key={i} className="animate-pulse">{`> ${code}`}</div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center - Hologram Projection */}
        <div className="relative flex justify-center items-center h-[240px] md:h-[360px]">
          {/* Base Projector Glow */}
          <div className="absolute bottom-0 w-32 h-8 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
          
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="relative flex items-center justify-center w-full h-full"
            >
            {/* Outer Rotating Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="absolute w-48 md:w-64 h-48 md:h-64 border-[1px] border-dashed border-cyan-400/40 rounded-full"
            />
            
            {/* Middle Rotating Ring (Opposite direction) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              className="absolute w-36 md:w-48 h-36 md:h-48 border-2 border-cyan-500/30 rounded-full flex items-center justify-center"
            >
              <div className="w-full h-[1px] bg-cyan-500/30 absolute" />
              <div className="w-[1px] h-full bg-cyan-500/30 absolute" />
            </motion.div>

            {/* Inner Glitching Core */}
            <motion.div
              animate={{ scale: [1, 1.03, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="absolute w-24 md:w-32 h-24 md:h-32 border border-cyan-300 shadow-[0_0_20px_#06b6d4] rounded-full flex items-center justify-center bg-cyan-950/40 backdrop-blur-md"
            >
              <div className="text-center">
                <div className="text-xs md:text-sm text-cyan-200 font-semibold">{personal?.name || 'Unknown'}</div>
                <Radar className="w-10 h-10 md:w-12 md:h-12 text-cyan-100 opacity-80 mt-1" />
              </div>
            </motion.div>

            {/* Floating Particles inside Core */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-200 rounded-full"
                animate={{
                  y: [-20, 20, -20],
                  x: [-20, 20, -20],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Right HUD Panel - Targeting & Biometrics */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6 p-6 border-r-2 border-b-2 border-cyan-500/30 rounded-br-xl bg-cyan-950/10 backdrop-blur-sm"
        >
          <div className="flex items-center justify-end gap-3 border-b border-cyan-500/30 pb-2">
            <h3 className="text-sm md:text-base font-bold text-cyan-300">Target Lock</h3>
            <Crosshair className="w-5 h-5 text-cyan-300" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded flex flex-col items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-[10px] text-cyan-600">FIREWALL</span>
              <span className="text-xs font-bold text-cyan-300">ACTIVE</span>
            </div>
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded flex flex-col items-center justify-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span className="text-[10px] text-cyan-600">PING</span>
              <span className="text-xs font-bold text-cyan-300">12ms</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] text-cyan-600 tracking-widest">SPATIAL_COORDINATES</div>
            <div className="flex justify-between text-xs border border-cyan-900/50 p-2 bg-slate-900/50">
              <span className="text-cyan-500">X:</span>
              <motion.span 
                className="text-cyan-200"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                104.22.9
              </motion.span>
            </div>
            <div className="flex justify-between text-xs border border-cyan-900/50 p-2 bg-slate-900/50">
              <span className="text-cyan-500">Y:</span>
              <span className="text-cyan-200">-88.41.0</span>
            </div>
            <div className="flex justify-between text-xs border border-cyan-900/50 p-2 bg-slate-900/50">
              <span className="text-cyan-500">Z:</span>
              <span className="text-cyan-200">ALT_299</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}