// frontend/src/components/portfolio/templates/Elevator_Pitch/MagneticButton.jsx
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticButton = ({ children, href }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.3);
    y.set(middleY * 0.3);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY, willChange: "transform" }}
      className="p-3 md:p-4 rounded-full bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700 hover:border-emerald-500/50 transition-colors text-zinc-300 hover:text-emerald-400 relative overflow-hidden group shadow-[0_0_0_rgba(16,185,129,0)] hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
    >
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
};