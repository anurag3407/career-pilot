import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Layout, Maximize } from 'lucide-react';
import { FRAMES_CONFIG } from './config';

export default function RightSidebar({ activeFrame, data }) {
  const activeFrameData = FRAMES_CONFIG.find(f => f.id === activeFrame);
  
  return (
    <div className="w-64 bg-[#2C2C2C] border-l border-[#1E1E1E] h-full flex flex-col z-40 shrink-0 hidden lg:flex overflow-y-auto custom-scrollbar">
      <div className="h-10 flex items-center px-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 uppercase tracking-wider">
          <Layout size={14} />
          Design
        </div>
      </div>
      
      {/* Mini-map */}
      <div className="p-4 border-b border-[#1E1E1E]">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-gray-400">
          <span>MINI MAP</span>
          <Maximize size={12} />
        </div>
        <div className="bg-[#1A1A1A] rounded aspect-video relative overflow-hidden border border-[#333]">
          {/* A tiny representation of the canvas */}
          {FRAMES_CONFIG.map(f => (
            <div 
              key={f.id}
              className={`absolute rounded-sm transition-colors ${activeFrame === f.id ? 'bg-blue-500' : 'bg-gray-700'}`}
              style={{
                left: `${(f.x / 3000) * 100}%`,
                top: `${(f.y / 2500) * 100}%`,
                width: `${(f.w / 3000) * 100}%`,
                height: `${(f.h / 2500) * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {activeFrameData && (
        <div className="p-4 border-b border-[#1E1E1E]">
          <div className="text-xs font-semibold text-gray-400 mb-3">FRAME</div>
          
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">X</span>
              <input type="text" readOnly value={activeFrameData.x} className="w-full bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 text-gray-300 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Y</span>
              <input type="text" readOnly value={activeFrameData.y} className="w-full bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 text-gray-300 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">W</span>
              <input type="text" readOnly value={activeFrameData.w} className="w-full bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 text-gray-300 focus:outline-none" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">H</span>
              <input type="text" readOnly value={activeFrameData.h} className="w-full bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 text-gray-300 focus:outline-none" />
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-[#1E1E1E]">
        <div className="text-xs font-semibold text-gray-400 mb-3">ALIGNMENT</div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">
            <AlignLeft size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">
            <AlignCenter size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors">
            <AlignRight size={16} />
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-[#1E1E1E]">
        <div className="text-xs font-semibold text-gray-400 mb-3">FILL</div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded border border-gray-600 bg-[#1A1A1A]"></div>
          <span className="text-sm text-gray-300">#1A1A1A</span>
          <span className="text-sm text-gray-500 ml-auto">100%</span>
        </div>
      </div>
      
      <div className="p-4 border-b border-[#1E1E1E]">
        <div className="text-xs font-semibold text-gray-400 mb-3">STROKE</div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded border border-gray-600 bg-[#333333]"></div>
          <span className="text-sm text-gray-300">#333333</span>
          <span className="text-sm text-gray-500 ml-auto">100%</span>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <div className="text-xs font-semibold text-gray-400 mb-3">EXPORT</div>
        <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm text-gray-300 font-medium transition-colors">
          Export Frame
        </button>
      </div>

    </div>
  );
}
