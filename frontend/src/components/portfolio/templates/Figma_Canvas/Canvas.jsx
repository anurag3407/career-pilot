import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FRAMES_CONFIG } from './config';
import Frame from './Frame';
import HeroFrame from './frames/HeroFrame';
import AboutFrame from './frames/AboutFrame';
import SkillsFrame from './frames/SkillsFrame';
import ProjectsFrame from './frames/ProjectsFrame';
import ExperienceFrame from './frames/ExperienceFrame';
import TestimonialsFrame from './frames/TestimonialsFrame';
import ContactFrame from './frames/ContactFrame';

const Canvas = forwardRef(({ data, activeFrame, onFrameClick }, ref) => {
  const containerRef = useRef(null);
  const controls = useAnimation();

  // Expose a method to pan to a specific frame
  useImperativeHandle(ref, () => ({
    panToFrame: (frameId) => {
      const frame = FRAMES_CONFIG.find(f => f.id === frameId);
      if (!frame || !containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      // Calculate position to center the frame in the viewport
      const x = -(frame.x + frame.w / 2) + containerWidth / 2;
      const y = -(frame.y + frame.h / 2) + containerHeight / 2;
      
      controls.start({
        x,
        y,
        transition: { type: 'spring', stiffness: 100, damping: 20 }
      });
    }
  }));

  // Initial pan to Hero on load
  useEffect(() => {
    if (ref && ref.current) {
      setTimeout(() => ref.current.panToFrame('hero'), 100);
    }
  }, []);

  const renderFrameContent = (id) => {
    switch (id) {
      case 'hero': return <HeroFrame data={data} />;
      case 'about': return <AboutFrame data={data} />;
      case 'skills': return <SkillsFrame data={data} />;
      case 'projects': return <ProjectsFrame data={data} />;
      case 'experience': return <ExperienceFrame data={data} />;
      case 'testimonials': return <TestimonialsFrame data={data} />;
      case 'contact': return <ContactFrame data={data} />;
      default: return null;
    }
  };

  return (
    <div 
      className="flex-1 relative overflow-hidden bg-[#1E1E1E] select-none" 
      ref={containerRef}
      style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}
    >
      <motion.div
        drag
        animate={controls}
        dragElastic={0.1}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ width: 4000, height: 4000 }} // Huge draggable area
      >
        {FRAMES_CONFIG.map(frame => (
          <Frame 
            key={frame.id}
            id={frame.id}
            title={frame.title}
            x={frame.x}
            y={frame.y}
            width={frame.w}
            height={frame.h}
            isActive={activeFrame === frame.id}
            onClick={(e) => {
              e.stopPropagation();
              onFrameClick(frame.id);
            }}
          >
            {renderFrameContent(frame.id)}
          </Frame>
        ))}
      </motion.div>
    </div>
  );
});

export default Canvas;
