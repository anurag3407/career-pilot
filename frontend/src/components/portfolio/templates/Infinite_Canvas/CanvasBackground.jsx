import React from "react";
import { motion } from "framer-motion";

export default function CanvasBackground() {
  return (
    <>
      {/* Grid Background */}
      <div
        className="fixed inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Gradient Glow 1 */}
      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -40, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="fixed top-20 left-10 w-96 h-96 rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none"
      />

      {/* Gradient Glow 2 */}
      <motion.div
        animate={{
          x: [0, -100, 60, 0],
          y: [0, 60, -80, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
        className="fixed bottom-20 right-10 w-[30rem] h-[30rem] rounded-full bg-purple-500/10 blur-[160px] pointer-events-none"
      />

      {/* Floating Dots */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1.5 h-1.5 bg-cyan-400/30 rounded-full pointer-events-none"
          style={{
            left: `${(i * 7) % 100}%`,
            top: `${(i * 13) % 100}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + (i % 5),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Whiteboard Connection Lines */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.05]">
        <line
          x1="15%"
          y1="20%"
          x2="45%"
          y2="35%"
          stroke="white"
          strokeWidth="1"
        />
        <line
          x1="45%"
          y1="35%"
          x2="70%"
          y2="20%"
          stroke="white"
          strokeWidth="1"
        />
        <line
          x1="30%"
          y1="60%"
          x2="60%"
          y2="75%"
          stroke="white"
          strokeWidth="1"
        />
        <line
          x1="60%"
          y1="75%"
          x2="85%"
          y2="55%"
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    </>
  );
}