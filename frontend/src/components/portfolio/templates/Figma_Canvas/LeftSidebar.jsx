import React from 'react';
import { Layers, ChevronDown, Frame, Eye, Lock } from 'lucide-react';
import { FRAMES_CONFIG } from './config';

export default function LeftSidebar({ activeFrame, onFrameClick }) {
  return (
    <div className="w-64 bg-[#2C2C2C] border-r border-[#1E1E1E] h-full flex flex-col z-40 shrink-0 hidden md:flex">
      <div className="h-10 flex items-center px-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
          <Layers size={14} />
          Layers
        </div>
      </div>
      
      <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
        <div className="flex items-center gap-1 p-1 mb-2">
          <ChevronDown size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Portfolio Design</span>
        </div>
        
        <div className="pl-5">
          {FRAMES_CONFIG.map((frame) => {
            const isActive = activeFrame === frame.id;
            return (
              <div 
                key={frame.id}
                onClick={() => onFrameClick(frame.id)}
                className={`flex items-center justify-between p-1.5 rounded cursor-pointer group ${
                  isActive ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Frame size={14} className={isActive ? 'text-blue-400' : 'text-gray-500'} />
                  <span className={`text-sm truncate w-32 ${isActive ? 'font-medium' : ''}`}>
                    {frame.title}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock size={12} className="text-gray-500 hover:text-gray-300" />
                  <Eye size={12} className="text-gray-500 hover:text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
