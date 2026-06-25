import React from 'react';
import { AlertTriangle, FileWarning, HelpCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';

const RiskCard = ({ risk }) => {
  const { file, type, severity, description } = risk;
  const { setSelectedFile, setInspectorOpen } = useProjectVisualizerStore();
  
  const colors = {
    critical: 'border-red-500 bg-red-500/10 text-red-400',
    high: 'border-orange-500 bg-orange-500/10 text-orange-400',
    medium: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    low: 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
  };

  const borderLeft = {
    critical: 'border-l-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]',
    high: 'border-l-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]',
    medium: 'border-l-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    low: 'border-l-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
  };

  const getIcon = () => {
    if (type.includes('coupling')) return <Network className="w-5 h-5" />;
    if (type.includes('large') || type.includes('monolith')) return <FileWarning className="w-5 h-5" />;
    if (type.includes('missing-test')) return <ShieldAlert className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  const handleFileClick = () => {
    // If it's a file path, open it
    if (file && file !== '/') {
      setSelectedFile({ relativePath: file, fileName: file.split('/').pop() });
      setInspectorOpen(true);
    }
  };

  return (
    <div 
      className={cn(
        "bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 border-l-4",
        borderLeft[severity] || borderLeft.low
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", colors[severity]?.replace('border-', '') || colors.low)}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white capitalize">{type.replace('-', ' ')}</h4>
            <button 
              onClick={handleFileClick}
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 truncate max-w-[200px] sm:max-w-sm text-left"
              title={file}
            >
              {file}
            </button>
          </div>
        </div>
        <span className={cn(
          "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
          colors[severity] || colors.low
        )}>
          {severity}
        </span>
      </div>
      
      <p className="text-slate-300 text-sm leading-relaxed ml-12">
        {description}
      </p>
    </div>
  );
};

export default RiskCard;
