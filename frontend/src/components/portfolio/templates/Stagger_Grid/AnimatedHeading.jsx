import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedHeading = ({ text, dark = false }) => {
  const baseColor = dark ? "#ffffff" : "#18181b";
  const highlightColor = "#4f46e5";

  return (
    <motion.div 
      className="flex flex-wrap mb-10 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      // amount: 0.5 ensures half the heading must be visible before it triggers
      viewport={{ once: true, amount: 0.5 }}
    >
      {text.split('').map((char, index) => (
        <motion.h2
          key={index}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
          style={{ color: baseColor }}
          variants={{
            hidden: { y: 50, opacity: 0 },
            visible: { 
              y: 0, 
              opacity: 1,
              transition: { type: "spring", damping: 12, delay: index * 0.05 }
            }
          }}
        >
          <motion.span
            animate={{ color: [baseColor, highlightColor, baseColor] }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.1, ease: "easeInOut" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </motion.h2>
      ))}
    </motion.div>
  );
};