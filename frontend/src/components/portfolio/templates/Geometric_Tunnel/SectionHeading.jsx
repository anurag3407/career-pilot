import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function SectionHeading({ children }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative flex items-center justify-center mb-16 overflow-hidden py-4">
      {inView && (
        <motion.span
          className="absolute w-2 h-2 rounded-full bg-indigo-400"
          style={{ boxShadow: "0 0 8px rgba(99,102,241,0.9)" }}
          animate={{ rotate: [0, 360], x: [0, 68, 0, -68, 0], y: [-34, 0, 34, 0, -34] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      )}

      <motion.h2
        initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl md:text-5xl font-black uppercase tracking-wider"
        style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          background: "linear-gradient(135deg, #ffffff 30%, #818cf8 70%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </motion.h2>

      {[0, 1, 2].map(idx => (
        <motion.div
          key={idx}
          className="absolute h-10 w-full pointer-events-none"
          style={{ border: "1px solid rgba(99,102,241,0.12)", borderRadius: "50%" }}
          animate={{
            rotateX: [0, 360],
            rotateY: [idx * 45, idx * 45 + 360],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 9 + idx * 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.span
        className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
        initial={{ width: 0, x: "-50%" }}
        animate={inView ? { width: "55%", x: "-50%" } : {}}
        transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}