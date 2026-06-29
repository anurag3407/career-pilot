import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const RiskSummaryChart = ({ risks }) => {
  const [dashArrays, setDashArrays] = useState({});
  const [dashOffsets, setDashOffsets] = useState({});

  if (!risks || risks.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/30">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Codebase is Healthy</h3>
        <p className="text-slate-400 max-w-[200px]">No significant risks or hotspots detected.</p>
      </div>
    );
  }

  const counts = {
    critical: risks.filter(r => r.severity === 'critical').length,
    high: risks.filter(r => r.severity === 'high').length,
    medium: risks.filter(r => r.severity === 'medium').length,
    low: risks.filter(r => r.severity === 'low').length,
  };

  const total = risks.length;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  // Calculate svg stroke offsets for the donut chart segments
  useEffect(() => {
    let offset = 0;
    const arrays = {};
    const offsets = {};

    ['critical', 'high', 'medium', 'low'].forEach(severity => {
      const count = counts[severity];
      if (count > 0) {
        const percentage = count / total;
        const length = percentage * circumference;
        
        arrays[severity] = `${length} ${circumference - length}`;
        offsets[severity] = -offset;
        
        offset += length;
      }
    });

    setDashArrays(arrays);
    setDashOffsets(offsets);
  }, [risks, total, circumference]); // eslint-disable-line react-hooks/exhaustive-deps

  const colors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#06b6d4'
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-6">Risk Breakdown</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
        {/* SVG Donut */}
        <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
          <circle cx="80" cy="80" r="60" fill="none" stroke="#1e293b" strokeWidth="20" />
          
          {['critical', 'high', 'medium', 'low'].map(severity => {
            if (counts[severity] === 0 || !dashArrays[severity]) return null;
            return (
              <motion.circle
                key={severity}
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke={colors[severity]}
                strokeWidth="20"
                strokeDasharray={dashArrays[severity]}
                strokeDashoffset={circumference}
                animate={{ strokeDashoffset: dashOffsets[severity] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-white">{total}</span>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {['critical', 'high', 'medium', 'low'].map(severity => {
          if (counts[severity] === 0) return null;
          return (
            <div key={severity} className="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[severity] }} />
                <span className="text-sm font-medium text-slate-300 capitalize">{severity}</span>
              </div>
              <span className="text-sm font-bold text-white">{counts[severity]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskSummaryChart;
