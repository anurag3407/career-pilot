import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FolderCode, Box, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const typeColors = {
  core: '#06b6d4',
  util: '#8b5cf6',
  test: '#22c55e',
  config: '#f59e0b',
  ui: '#ec4899',
  api: '#3b82f6',
  docs: '#64748b',
  assets: '#f97316',
  other: '#6b7280'
};

const riskColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#06b6d4'
};

const ModuleNode = ({ data, selected }) => {
  const { name, fileCount, loc, type, riskLevel } = data;
  const color = typeColors[type] || typeColors.other;
  const rColor = riskColors[riskLevel] || riskColors.low;

  return (
    <div
      className={cn(
        "relative w-[220px] rounded-xl bg-[#0f172a] border transition-all duration-300",
        selected 
          ? "border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-105 z-10" 
          : "border-slate-800 hover:border-slate-600 hover:scale-[1.02]"
      )}
    >
      {/* Target Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 bg-[#0f172a] transition-colors"
        style={{ borderColor: color }}
      />
      
      {/* Top Border Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl opacity-80"
        style={{ backgroundColor: color }}
      />

      <div className="p-4 pt-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 max-w-[80%]">
            <Box className="w-5 h-5 shrink-0" style={{ color }} />
            <span className="font-semibold text-white truncate" title={name}>
              {name}
            </span>
          </div>
          
          {riskLevel && riskLevel !== 'low' && (
             <div 
               className="w-2.5 h-2.5 rounded-full shadow-sm"
               style={{ backgroundColor: rColor, boxShadow: `0 0 5px ${rColor}` }}
               title={`${riskLevel} risk detected`}
             />
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2 text-xs font-medium">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
              {fileCount} files
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
              {loc.toLocaleString()} LOC
            </span>
          </div>
        </div>
        
        <div className="mt-3 flex">
           <span 
             className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold"
             style={{ color: color, backgroundColor: `${color}20` }}
           >
             {type}
           </span>
        </div>
      </div>

      {/* Source Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 bg-[#0f172a] transition-colors"
        style={{ borderColor: color }}
      />
    </div>
  );
};

export default ModuleNode;
