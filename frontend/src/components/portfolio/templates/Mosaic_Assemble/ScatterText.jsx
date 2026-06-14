import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* ─── "placed on table" easing: fast approach, gentle settle ─── */
const TABLE_EASE = [0.16, 1.2, 0.3, 1];

/* vary spring character so nothing feels copy-pasted */
const SPRING_VARIANTS = [
  { duration: 0.55, ease: TABLE_EASE },
  { duration: 0.65, ease: [0.12, 0.9, 0.28, 1.04] },
  { duration: 0.5, ease: [0.22, 1.3, 0.36, 1] },
];

export const ScatterItem = ({ children, delay = 0, className = '' }) => {
  const shouldReduce = useReducedMotion();

  /* stable seed per component instance */
  const seed = useRef({
    x: (Math.random() - 0.5) * 80,
    y: 20 + Math.random() * 60,
    rot: (Math.random() - 0.5) * 8,
    spring: SPRING_VARIANTS[Math.floor(Math.random() * SPRING_VARIANTS.length)],
    intermediateRot: (Math.random() - 0.5) * 3,
  });

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: seed.current.x, y: seed.current.y, rotate: seed.current.rot }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...seed.current.spring, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
