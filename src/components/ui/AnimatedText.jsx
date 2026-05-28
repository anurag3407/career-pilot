import { motion } from "framer-motion";

export function AnimatedGradientText({ children, className = "" }) {
  return (
    <span
      className={`text-sky-400 ${className}`}
    >
      {children}
    </span>
  );
}

export function AnimatedLetters({ text, className = "", delay = 0 }) {
  return (
    <span className={className}>
      {text.split("").map((char, idx) => (
        <motion.span
          key={idx}
          className="inline-block"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + idx * 0.03 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function TypewriterText({ text, className = "", delay = 0 }) {
  return (
    <span className={className}>
      {text.split("").map((char, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05, delay: delay + idx * 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function FadeInText({ children, className = "", delay = 0 }) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.span>
  );
}
