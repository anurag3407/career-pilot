import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function CanvasBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {/* Grid */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Dot Pattern */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow 1 */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 60, -40, 0],
                y: [0, -40, 30, 0],
              }
        }
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="fixed top-20 left-10 w-[28rem] h-[28rem] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none"
      />

      {/* Glow 2 */}
      <motion.div
        aria-hidden="true"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, -70, 50, 0],
                y: [0, 40, -50, 0],
              }
        }
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        className="fixed bottom-20 right-10 w-[30rem] h-[30rem] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none"
      />

      {/* Floating Dots */}
      {!prefersReducedMotion &&
        Array.from({ length: 18 }).map((_, index) => (
          <motion.div
            key={index}
            aria-hidden="true"
            className="fixed w-2 h-2 rounded-full bg-cyan-400/30 pointer-events-none"
            style={{
              left: `${(index * 11) % 100}%`,
              top: `${(index * 17) % 100}%`,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 3 + (index % 4),
              repeat: Infinity,
              delay: index * 0.15,
            }}
          />
        ))}

      {/* Canvas Accent Lines */}
      <svg
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.04]"
      >
        <line
          x1="10%"
          y1="20%"
          x2="35%"
          y2="30%"
          stroke="white"
          strokeWidth="1"
        />

        <line
          x1="35%"
          y1="30%"
          x2="65%"
          y2="18%"
          stroke="white"
          strokeWidth="1"
        />

        <line
          x1="65%"
          y1="18%"
          x2="85%"
          y2="35%"
          stroke="white"
          strokeWidth="1"
        />

        <line
          x1="20%"
          y1="70%"
          x2="55%"
          y2="80%"
          stroke="white"
          strokeWidth="1"
        />

        <line
          x1="55%"
          y1="80%"
          x2="85%"
          y2="60%"
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    </>
  );
}