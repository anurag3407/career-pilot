import React from 'react';
import { 
  Menu, 
  MousePointer2, 
  Frame, 
  Square, 
  PenTool, 
  Type, 
  MessageSquare,
  Share2,
  Play
} from 'lucide-react';

export default function Toolbar({ userName }) {
  return (
    <div className="h-12 bg-[#2C2C2C] border-b border-[#1E1E1E] flex items-center justify-between px-4 z-50 relative shrink-0">
      <div className="flex items-center gap-4 h-full">
        <button className="text-gray-300 hover:text-white transition-colors">
          <Menu size={20} />
        </button>
        
        <div className="w-px h-6 bg-[#444] mx-2"></div>
        
        <div className="flex items-center gap-1 h-full">
          <button className="p-2 text-blue-400 bg-blue-500/10 rounded">
            <MousePointer2 size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">
            <Frame size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">
            <Square size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">
            <PenTool size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">
            <Type size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center h-full items-center">
        <div className="px-3 py-1 rounded bg-[#1E1E1E] border border-[#333] text-sm text-gray-300 cursor-pointer hover:border-gray-500 transition-colors">
          {userName}'s Portfolio.fig
        </div>
      </div>
      
      <div className="flex items-center gap-3 h-full">
        <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">
          <MessageSquare size={18} />
        </button>
        <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center gap-2 transition-colors">
          <Share2 size={16} />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button className="p-2 text-gray-300 hover:text-white rounded hover:bg-white/5 transition-colors">
          <Play size={18} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
