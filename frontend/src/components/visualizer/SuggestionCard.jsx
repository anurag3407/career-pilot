import React from 'react';
import { Lightbulb, ArrowRight, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';

const SuggestionCard = ({ suggestion, index }) => {
  const { title, description, module, priority } = suggestion;
  const { setSelectedModule, moduleGraph, setInspectorOpen } = useProjectVisualizerStore();

  const handleModuleClick = () => {
    if (module && moduleGraph.nodes) {
      // Try to find the exact module node or partial match
      const node = moduleGraph.nodes.find(n => 
        n.data.name.toLowerCase() === module.toLowerCase() || 
        module.toLowerCase().includes(n.data.name.toLowerCase())
      );
      if (node) {
        setSelectedModule(node.data);
        setInspectorOpen(true);
      }
    }
  };

  const priorityColors = {
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    low: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:bg-white/[0.07] transition-all"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-colors pointer-events-none" />
      
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold border border-violet-500/30">
            {index + 1}
          </div>
          <h4 className="font-bold text-white text-lg pr-4">{title}</h4>
        </div>
        
        {priority && (
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0",
            priorityColors[priority] || priorityColors.low
          )}>
            {priority}
          </span>
        )}
      </div>
      
      <p className="text-slate-300 text-sm leading-relaxed mb-4 relative z-10">
        {description}
      </p>
      
      {module && (
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Box className="w-4 h-4 text-cyan-400" />
            <span className="font-mono bg-black/30 px-2 py-0.5 rounded text-xs border border-white/5">{module}</span>
          </div>
          
          <button type="button" 
            onClick={handleModuleClick}
            className="flex items-center gap-1 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            Inspect <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default SuggestionCard;
