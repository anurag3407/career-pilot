"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function LavaAnimate({
  children,
  duration = 3.5,
  formedDelay = 2800,
  particleCount = 120,
  particleColor = "#ff6a00",
  particleSize = [15, 38],
  sourceX = "50%",
  sourceY = "55%",
  particles = true,
  textMelt = true,
  meltAmount = 10,
  className = "",
}) {
  const [formed, setFormed] = useState(false);
  const rootRef = useRef(null);
  
  const inView = useInView(rootRef, {
    once: true,
    amount: 0.05,
  });

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setFormed(true), formedDelay);
    return () => clearTimeout(t);
  }, [inView, formedDelay]);

  const droplets = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      tx: random(-400, 400),
      ty: random(-300, 60),
      delay: i * 0.015,
      duration: random(duration * 0.6, duration),
      size: random(particleSize[0], particleSize[1]),
    }));
  }, [particleCount, duration, particleSize]);

  const isTextElement = React.isValidElement(children) && typeof children.props.children === "string";

  return (
    <div ref={rootRef} className={`relative overflow-visible ${className}`}>
      <AnimatePresence>
        {!formed && inView && particles &&
          droplets.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
              animate={{ x: drop.tx, y: drop.ty, opacity: [0, 1, 1, 0], scale: [0.2, 1, 0.3] }}
              exit={{ opacity: 0 }}
              // Smooth bezier curve for droplet flow
              transition={{ duration: drop.duration, delay: drop.delay, ease: [0.16, 1, 0.3, 1] }}
              className="absolute pointer-events-none z-50"
              style={{ left: sourceX, top: sourceY }}
            >
              <div
                className="rounded-full"
                style={{
                  width: drop.size, height: drop.size,
                  background: `radial-gradient(circle, #ffd27a 0%, ${particleColor} 45%, #ff3d00 75%, #551000 100%)`,
                  boxShadow: `0 0 12px ${particleColor}`,
                }}
              />
            </motion.div>
          ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20, filter: "blur(10px)" }}
        animate={{
          opacity: formed ? 1 : 0,
          scale: formed ? 1 : 0.95,
          y: formed ? 0 : 20,
          filter: formed ? "blur(0px)" : "blur(10px)",
        }}
        // SMOOTH REVEAL: Longer duration with a buttery-soft easing profile
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        // CENTERING FIX: w-full and flex justify-center forces child mx-auto to work
        className="relative w-full flex justify-center"
      >
        {isTextElement && formed && textMelt ? (
          <motion.div animate={{ y: [0, meltAmount, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="relative">
            <div className="relative z-10">{children}</div>
            <motion.div
              animate={{ scaleY: [1, 1.08, 1], opacity: [0.18, 0.28, 0.18] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 pointer-events-none blur-[2px]"
              style={{ background: "linear-gradient(180deg, rgba(255,120,0,0.15), rgba(255,40,0,0.25))", WebkitBackgroundClip: "text" }}
            />
          </motion.div>
        ) : (
          children
        )}
      </motion.div>
    </div>
  );
}