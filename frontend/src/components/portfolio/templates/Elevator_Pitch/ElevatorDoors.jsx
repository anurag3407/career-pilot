// frontend/src/components/portfolio/templates/Elevator_Pitch/ElevatorDoors.jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Separate transitions for smooth opening and rapid reset-closing
const doorTransitionOpen = { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 };
const doorTransitionClosed = { duration: 0.3, ease: "easeInOut" }; 

const leftDoorVariants = {
  closed: { x: "0%", transition: doorTransitionClosed },
  open: { x: "-100%", transition: doorTransitionOpen }
};

const rightDoorVariants = {
  closed: { x: "0%", transition: doorTransitionClosed },
  open: { x: "100%", transition: doorTransitionOpen }
};

export const ElevatorDoors = ({ children, floorNumber, title, id }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 }); // Triggers when 20% visible

  return (
    <section 
      ref={sectionRef} 
      id={id} 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 py-20"
    >
      <div className="relative z-0 w-full max-w-6xl mx-auto px-6">
        {children}
      </div>

      <motion.div
        variants={leftDoorVariants}
        initial="closed"
        animate={isInView ? "open" : "closed"}
        style={{ willChange: "transform", WebkitTransform: "translateZ(0)" }}
        className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-zinc-800 to-zinc-600 z-10 border-r-2 border-zinc-900 shadow-[5px_0_15px_rgba(0,0,0,0.5)] flex items-center justify-end pr-4 pointer-events-none"
      >
        <span className="text-zinc-500 font-mono text-sm tracking-widest rotate-[-90deg] opacity-50">
          FLOOR {floorNumber}
        </span>
      </motion.div>

      <motion.div
        variants={rightDoorVariants}
        initial="closed"
        animate={isInView ? "open" : "closed"}
        style={{ willChange: "transform", WebkitTransform: "translateZ(0)" }}
        className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-800 to-zinc-600 z-10 border-l-2 border-zinc-900 shadow-[-5px_0_15px_rgba(0,0,0,0.5)] flex items-center justify-start pl-4 pointer-events-none"
      >
        <span className="text-zinc-500 font-mono text-sm tracking-widest rotate-90 opacity-50 uppercase">
          {title.toUpperCase()}
        </span>
      </motion.div>
    </section>
  );
};