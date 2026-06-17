import React from 'react';
import { motion } from 'framer-motion';

const getTileScatter = (index, variant = 'default') => {
  const xDrift = ((index * 29) % 40) - 20; // Slightly reduced distance for small containers
  const yDrift = variant === 'subtle' 
    ? -15 - ((index * 19) % 25)
    : -30 - ((index * 31) % 35); 
  const rotateDrift = ((index * 13) % 20) - 10;
  return { xDrift, yDrift, rotateDrift };
};

const TileSnappingText = ({ 
  text = "", 
  className = "", 
  variant = 'default', 
  baseDelay = 0.1, 
  stagger = 0.02,
  trigger = true 
}) => {
  const words = text.split(" ");
  let charCounter = 0;

  if (!trigger) return <span className={className}>{text}</span>;

  return (
    <span className="relative inline-block max-w-full overflow-visible">
      {/* 1. THE ANIMATION LAYER: Letters are explicitly grouped into non-breaking word parents 
           so they never collapse or warp inside tight CSS flex/grid cards.
      */}
      <span className="flex flex-wrap items-center justify-center lg:justify-start gap-x-[0.25em] row-gap-0 select-none overflow-visible">
        {words.map((word, wordIdx) => (
          <span key={`${word}-${wordIdx}`} className="inline-flex whitespace-nowrap overflow-visible">
            {word.split("").map((char) => {
              const currentIdx = charCounter++;
              const { xDrift, yDrift, rotateDrift } = getTileScatter(currentIdx, variant);

              return (
                <motion.span
                  key={`${char}-${currentIdx}`}
                  initial={{ opacity: 0, x: xDrift, y: yDrift, rotate: rotateDrift }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.01 }}
                  transition={{
                    type: 'tween',
                    ease: [0.25, 1.4, 0.5, 1], // Magnetic click snap physics
                    duration: 0.65,
                    delay: baseDelay + currentIdx * stagger,
                  }}
                  className={`inline-block will-change-transform origin-bottom ${className}`}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </span>

      {/* 2. THE BOUNDING LAYOUT GHOST: Invisible structural text ensuring the parent chip 
           always calculates perfect bounding dimensions natively from day one.
      */}
      <span className={`absolute inset-0 opacity-0 pointer-events-none select-none invisible whitespace-nowrap ${className}`}>
        {text}
      </span>
    </span>
  );
};

export default TileSnappingText;