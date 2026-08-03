import React from "react";
import { motion } from "framer-motion";

export default function CanvasCard({
  children,
  className = "",
  delay = 0,
  rotate = 0,
}) {
  return (
    <motion.article
      role="article"
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.98,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
        shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        transition-all
        duration-300
        hover:border-cyan-400/20
        hover:shadow-[0_20px_60px_rgba(6,182,212,0.12)]
        ${className}
      `}
      style={{
        rotate,
      }}
    >
      {/* Subtle Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-purple-500/[0.03] pointer-events-none"
      />

      {/* Top Accent */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
      />

      <div className="relative z-10 p-6 md:p-7">
        {children}
      </div>
    </motion.article>
  );
}