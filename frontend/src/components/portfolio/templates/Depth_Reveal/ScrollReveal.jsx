import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const depthPresets = {
  soft: { x: 55, y: 80, scale: 0.9, rotateX: 10, rotateY: 8, rotateZ: -1, blur: '16px', z: -100 },
  medium: { x: 80, y: 120, scale: 0.82, rotateX: 16, rotateY: 12, rotateZ: -2, blur: '22px', z: -140 },
  heavy: { x: 105, y: 160, scale: 0.74, rotateX: 22, rotateY: 18, rotateZ: -3, blur: '30px', z: -190 },
  extreme: { x: 130, y: 190, scale: 0.68, rotateX: 27, rotateY: 24, rotateZ: -4, blur: '36px', z: -250 },
};

export const ScrollReveal = ({
  children,
  className = '',
  depth = 'medium',
  delay = 0,
  sectionIndex = 0,
}) => {
  const reduceMotion = useReducedMotion();
  const preset = depthPresets[depth] ?? depthPresets.medium;
  const direction = sectionIndex % 2 === 0 ? 1 : -1;

  const initialState = reduceMotion
    ? {
        opacity: 0,
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        filter: 'blur(0px)',
      }
    : {
        opacity: 0,
        x: direction * preset.x,
        y: preset.y,
        z: preset.z,
        scale: preset.scale,
        rotateX: preset.rotateX,
        rotateY: direction * preset.rotateY,
        rotateZ: preset.rotateZ,
        filter: `blur(${preset.blur})`,
      };

  const inViewState = {
    opacity: 1,
    x: 0,
    y: 0,
    z: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    filter: 'blur(0px)',
  };

  return (
    <motion.div
      initial={initialState}
      whileInView={inViewState}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0.35 : 1.15,
        delay,
        type: 'spring',
        stiffness: reduceMotion ? 180 : 78,
        damping: reduceMotion ? 24 : 16,
        mass: reduceMotion ? 0.8 : 1.2,
      }}
      style={{ transformPerspective: 1200, transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: reduceMotion ? 0 : 1, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: delay + 0.05 }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.09),transparent_60%)]" />
      </motion.div>
      {children}
    </motion.div>
  );
};
