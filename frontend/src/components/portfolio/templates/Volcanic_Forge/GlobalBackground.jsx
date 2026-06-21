import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_BRIGHTNESS = 2.0;
const PARTICLE_SPEED = 1.8;

export default function GlobalBackground() {
  const emberConfigs = useMemo(() => (
    Array.from({ length: 40 }, (_, index) => {
      const size = Math.random() * 4 + 1;
      const duration = (Math.random() * 10 + 10) / Math.max(PARTICLE_SPEED, 0.1);
      const delay = Math.random() * 10;
      const startX = Math.random() * 100;
      const driftX = (Math.random() - 0.5) * 200;
      const opacityPeak = Math.random() * 0.8 + 0.2;
      const blur = Math.min(PARTICLE_BRIGHTNESS, 3);
      const glowSpread = 10 * PARTICLE_BRIGHTNESS;
      const glowBlur = 2 * PARTICLE_BRIGHTNESS;

      return {
        key: `ember-${index}`,
        size,
        duration,
        delay,
        startX,
        driftX,
        opacityPeak,
        blur,
        glowSpread,
        glowBlur,
      };
    })
  ), []);
  
  return (
    <>
      {/* 
        ZIGZAG CRACKED EARTH OVERLAY
        Increased opacity from [0.04] to [0.15] to make the lines brighter 
      */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.11] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L40 50 L10 80 L60 120 L30 180 M150 0 L130 60 L180 90 L120 150 L160 200 M80 50 L120 80 L90 140' fill='none' stroke='%23f97316' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' /%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
        }}
      />
      
      {/* FLOATING EMBERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {emberConfigs.map((config) => {
          return (
            <motion.div
              key={config.key}
              className="absolute bottom-0 rounded-full bg-orange-500"
              style={{
                width: config.size,
                height: config.size,
                left: `${config.startX}vw`,
                filter: `blur(${config.blur}px) brightness(${PARTICLE_BRIGHTNESS})`,
                boxShadow: `0 0 ${config.glowSpread}px ${config.glowBlur}px rgba(249, 115, 22, ${0.5 * Math.min(PARTICLE_BRIGHTNESS, 2)})`
              }}
              animate={{ y: ['10vh', '-110vh'], x: [0, config.driftX], opacity: [0, config.opacityPeak, 0] }}
              transition={{ duration: config.duration, repeat: Infinity, delay: config.delay, ease: 'linear' }}
            />
          );
        })}
      </div>
    </>
  );
}