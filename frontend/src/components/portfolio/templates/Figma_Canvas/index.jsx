import React, { useState, useRef } from 'react';
import data from '../../../../data/dummy_data.json';
import Toolbar from './Toolbar';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import Canvas from './Canvas';

/**
 * Figma Canvas Portfolio Template
 * Category: Famous UI Inspired
 */
export default function FigmaCanvas() {
  const [activeFrame, setActiveFrame] = useState('hero');
  const canvasRef = useRef(null);

  const handleFrameClick = (frameId) => {
    setActiveFrame(frameId);
    if (canvasRef.current) {
      canvasRef.current.panToFrame(frameId);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1E1E1E] text-white font-sans overflow-hidden">
      <Toolbar userName={data.personal.name} />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Drawers for mobile could be added here later. Currently hidden on small screens */}
        <LeftSidebar 
          activeFrame={activeFrame} 
          onFrameClick={handleFrameClick} 
        />
        
        <Canvas 
          ref={canvasRef}
          data={data} 
          activeFrame={activeFrame} 
          onFrameClick={handleFrameClick}
        />
        
        <RightSidebar 
          activeFrame={activeFrame} 
          data={data} 
        />
      </div>
    </div>
  );
}
