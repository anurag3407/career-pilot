import React from "react";
import { motion } from "framer-motion";

export default function CanvasCard({
  children,
  className = "",
  delay = 0,
  rotate = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.7,
        delay,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
      className={`
        bg-white/[0.03]
        backdrop-blur-xl
        border
        border-white/10
        shadow-[0_0_40px_rgba(255,255,255,0.04)]
        rounded-3xl
        p-6
        transition-all
        duration-300
        hover:border-cyan-400/30
        hover:shadow-[0_0_60px_rgba(34,211,238,0.12)]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}