import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const leaves = [
  // SVG paths for different types of leaves
  "M10,0 C15,5 20,10 15,15 C10,20 5,15 0,10 C5,5 5,0 10,0 Z", // Basic leaf
  "M10,0 C12,4 18,6 18,10 C18,15 10,20 10,20 C10,20 2,15 2,10 C2,6 8,4 10,0 Z", // Pointy leaf
  "M10,0 C16,2 20,8 15,14 C10,20 8,16 5,12 C2,8 4,2 10,0 Z" // Round leaf
];

const colors = ['#d97706', '#ea580c', '#c2410c', '#b45309', '#a16207'];

export default function LeafAnimation() {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only access window after mount to avoid SSR issues
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowDimensions.width === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => {
        const leafType = leaves[i % leaves.length];
        const leafColor = colors[i % colors.length];
        const startX = Math.random() * windowDimensions.width;
        const duration = 10 + Math.random() * 15;
        const delay = Math.random() * -20; // negative delay so they start immediately
        const rotation = Math.random() * 360;

        return (
          <motion.svg
            key={i}
            width="24"
            height="24"
            viewBox="0 0 20 20"
            style={{
              position: 'absolute',
              fill: leafColor,
              opacity: 0.4 + Math.random() * 0.4,
              top: -30,
              left: startX,
            }}
            animate={{
              y: windowDimensions.height + 50,
              x: startX + (Math.random() * 100 - 50),
              rotate: rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            }}
          >
            <path d={leafType} />
          </motion.svg>
        );
      })}
    </div>
  );
}
