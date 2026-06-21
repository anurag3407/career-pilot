import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ─── physics-flavoured spring configs ─── */
const SPRING_CONFIGS = [
  { type: 'spring', stiffness: 90, damping: 20, mass: 1.0 },
  { type: 'spring', stiffness: 130, damping: 26, mass: 1.35 },
  { type: 'spring', stiffness: 70, damping: 16, mass: 0.85 },
  { type: 'spring', stiffness: 160, damping: 32, mass: 1.7 },
];

const MosaicImage = ({ src, alt, rows = 5, cols = 5, className = '' }) => {
  const tiles = useMemo(() => {
    const temp = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        /* ── throw each tile from a random screen quadrant ── */
        const quadX = c < cols / 2 ? -1 : 1;
        const quadY = r < rows / 2 ? -1 : 1;
        temp.push({
          r, c,
          /* distance varies wildly so tiles arrive at different times */
          x: quadX * (220 + Math.random() * 350),
          y: quadY * (180 + Math.random() * 280),
          rot: (Math.random() - 0.5) * 240,
          scale: 0.2 + Math.random() * 0.5,
          /* delay clustered around distance from centre, not row order */
          delay: (Math.abs(r - rows / 2) + Math.abs(c - cols / 2)) * 0.075
            + Math.random() * 0.18,
          spring: SPRING_CONFIGS[Math.floor(Math.random() * SPRING_CONFIGS.length)],
        });
      }
    }

    return temp;
  }, [rows, cols]);

  return (
    <motion.div
      className={`relative w-full overflow-hidden bg-slate-900/50 rounded-xl ${className}`.trim()}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <img src={src} alt={alt || "Image"} className="sr-only" />

      {tiles.map((tile) => {
        return (
          <motion.div
            key={`${tile.r}-${tile.c}`}
            initial={{ opacity: 0, x: tile.x, y: tile.y, rotate: tile.rot, scale: tile.scale }}
            variants={{
              hidden: {},
              show: {
                opacity: 1, x: 0, y: 0, rotate: 0, scale: 1,
                transition: { ...tile.spring, delay: tile.delay },
              },
            }}
            className="relative overflow-hidden shadow-sm"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${cols * 100}% ${rows * 100}%`,
              backgroundPosition: `${-tile.c * 100}% ${-tile.r * 100}%`,
              backgroundRepeat: 'no-repeat',
            }}
          >
            <span className="sr-only">{alt}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default MosaicImage;
