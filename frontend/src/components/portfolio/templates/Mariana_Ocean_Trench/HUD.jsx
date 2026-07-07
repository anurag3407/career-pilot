import React from 'react';
import { Compass, Shield, Radio, Activity } from 'lucide-react';

export default function HUD({ depth, pressure, zone, scrollPercent }) {
  return (
    <div className="fixed z-50 pointer-events-none inset-0 flex justify-between p-4 md:p-8 font-mono select-none text-cyan-400">
      {/* Top Left: Submarine Diagnostics */}
      <div className="flex flex-col gap-2 self-start bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md p-3 rounded-lg pointer-events-auto shadow-[0_0_15px_rgba(6,182,212,0.15)] text-[10px] md:text-xs">
        <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-1.5 font-bold tracking-wider">
          <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>DEEP_SEA_EXPLO_v1.0</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-cyan-600">SYS_STATUS</span>
          <span className="text-emerald-400 animate-pulse font-semibold">ONLINE</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-cyan-600">OXYGEN_RESERVE</span>
          <span className="text-cyan-300">98.4 %</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-cyan-600">HULL_INTEGRITY</span>
          <span className="text-cyan-300">100.0 %</span>
        </div>
      </div>

      {/* Top Right: Sonar Scanner */}
      <div className="flex flex-col items-center gap-2 self-start bg-slate-950/80 border border-cyan-500/20 backdrop-blur-md p-3 rounded-lg pointer-events-auto shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border border-cyan-500/30 overflow-hidden flex items-center justify-center bg-cyan-950/20">
          {/* Sonar sweep line */}
          <div 
            className="absolute inset-0 origin-center bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-full"
            style={{
              animation: 'spin 4s linear infinite',
            }}
          />
          {/* Concentric rings */}
          <div className="absolute w-3/4 h-3/4 border border-cyan-500/20 rounded-full" />
          <div className="absolute w-1/2 h-1/2 border border-cyan-500/10 rounded-full animate-ping" />
          <div className="absolute w-1/4 h-1/4 border border-cyan-500/30 rounded-full" />
          {/* Radar center dot */}
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] animate-pulse" />
        </div>
        <div className="text-[9px] text-cyan-500/80 tracking-widest text-center mt-1 uppercase flex items-center gap-1">
          <Radio className="w-2.5 h-2.5 animate-bounce" />
          <span>Sonar Active</span>
        </div>
      </div>

      {/* Bottom Right: Real-time Depth Gauge */}
      <div className="self-end ml-auto flex flex-col gap-2 bg-slate-950/85 border border-cyan-500/35 backdrop-blur-md p-4 rounded-lg pointer-events-auto shadow-[0_0_20px_rgba(6,182,212,0.2)] w-56 md:w-64">
        <div className="flex items-center gap-2 text-cyan-300 font-bold border-b border-cyan-500/30 pb-2">
          <Compass className="w-4 h-4 animate-spin text-cyan-400" style={{ animationDuration: '8s' }} />
          <span className="tracking-widest uppercase text-xs md:text-sm">Expedition Log</span>
        </div>

        <div className="flex flex-col gap-1.5 my-1">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-cyan-600">DEPTH:</span>
            <span className="text-xl md:text-2xl font-bold text-cyan-100 tabular-nums">
              {depth.toLocaleString()} <span className="text-xs text-cyan-400">m</span>
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-cyan-600">PRESSURE:</span>
            <span className="text-sm md:text-base font-semibold text-cyan-300 tabular-nums">
              {pressure.toLocaleString()} <span className="text-[10px] text-cyan-400">atm</span>
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-cyan-600">ZONE:</span>
            <span className="text-xs font-bold text-cyan-300 tracking-wider text-right uppercase">
              {zone}
            </span>
          </div>
        </div>

        {/* Progress Bar resembling pressure level */}
        <div className="w-full h-1.5 bg-slate-900 border border-cyan-500/20 rounded overflow-hidden relative">
          <div 
            className="h-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] transition-all duration-300"
            style={{ width: `${scrollPercent * 100}%` }}
          />
        </div>

        <div className="flex justify-between text-[8px] text-cyan-600 mt-0.5">
          <span>0m (SURFACE)</span>
          <span>10,994m (HADAL)</span>
        </div>
      </div>

      {/* CSS Spin Keyframe injection */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
