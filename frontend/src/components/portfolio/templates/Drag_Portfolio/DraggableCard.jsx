import React from 'react';
import { motion } from 'framer-motion';

export default function DraggableCard({ 
  children, 
  title, 
  icon: Icon,
  className = "", 
  style = {}, 
  dragConstraints, 
  isMobile,
  defaultPosition = { x: 0, y: 0 }
}) {
  return (
    <motion.div
      drag={!isMobile}
      dragConstraints={dragConstraints}
      dragElastic={0.12}
      dragMomentum={true}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileDrag={{ 
        scale: 1.04, 
        zIndex: 50,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px 4px rgba(56, 189, 248, 0.3)",
        cursor: "grabbing"
      }}
      whileHover={!isMobile ? { 
        scale: 1.01,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px 2px rgba(56, 189, 248, 0.15)"
      } : {}}
      initial={{ 
        opacity: 0, 
        scale: 0.9, 
        x: defaultPosition.x, 
        y: defaultPosition.y,
        rotate: isMobile ? 0 : (Math.random() * 4 - 2) 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
      }}
      style={style}
      className={`
        ${isMobile ? 'relative w-full' : 'absolute w-[360px] md:w-[400px] cursor-grab'}
        rounded-2xl border bg-card text-card-foreground p-6 shadow-xl
        backdrop-blur-md select-none transition-colors duration-300
        ${className}
      `}
    >
      {/* Decorative Card Pin/Tack on Canvas */}
      {!isMobile && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 flex items-center justify-center z-20">
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white shadow-md animate-pulse" />
          <div className="absolute top-1.5 w-0.5 h-3 bg-gray-400 transform origin-top rotate-12" />
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h3 className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
        {!isMobile && (
          <div className="flex gap-1.5 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="overflow-hidden">
        {children}
      </div>

      {/* Card Footer Grab Indicator */}
      {!isMobile && (
        <div className="mt-4 pt-3.5 border-t border-border/40 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity">
          <div className="flex flex-col gap-0.5 items-center">
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            </div>
            <div className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider mt-1 text-muted-foreground">DRAG OBJECT</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
