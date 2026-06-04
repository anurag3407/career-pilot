import React, { useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, animate, useTransform } from 'framer-motion';

export const AnimatedCounter = ({ from = 0, to, suffix = "" }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest) + suffix);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      animate(count, parseInt(to, 10), { duration: 2.5, ease: "easeOut" });
    }
  }, [inView, count, to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

export const SectionHeading = ({ children, icon: Icon, className = "flex items-center justify-center gap-4 mb-16", disableAnimation = false }) => {
  if (disableAnimation) {
    return (
      <div className={className}>
        {Icon && <Icon className="text-zinc-400" size={36} />}
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-300 tracking-tight text-center">
          {children}
        </h2>
      </div>
    );
  }

  return (
    <div className={className}>
      {Icon && (
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="text-cyan-500" size={36} />
        </motion.div>
      )}
      <motion.h2 
        animate={{ 
          y: [-3, 3, -3],
          textShadow: [
            "0px 0px 0px rgba(6,182,212,0)", 
            "0px 0px 15px rgba(6,182,212,0.4)", 
            "0px 0px 0px rgba(6,182,212,0)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl md:text-5xl font-bold text-white text-center"
      >
        {children}
      </motion.h2>
    </div>
  );
};

export const AmbientBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/10 blur-[120px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite]" />
    
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, Math.random() * 100 - 50, 0],
          x: [0, Math.random() * 100 - 50, 0],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6 + Math.random() * 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2
        }}
        className="absolute rounded-full blur-3xl mix-blend-screen"
        style={{
          top: `${20 + Math.random() * 60}%`,
          left: `${20 + Math.random() * 60}%`,
          width: `${100 + Math.random() * 150}px`,
          height: `${100 + Math.random() * 150}px`,
          backgroundColor: i % 2 === 0 ? 'rgba(6, 182, 212, 0.1)' : 'rgba(99, 102, 241, 0.1)'
        }}
      />
    ))}
  </div>
);