import { usePortfolio } from "../../../../context/PortfolioContext";
﻿import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const Error404InfiniteGallery = ({ portfolioData }) => {
  const { portfolioData: dummyData } = usePortfolio();

  // Merge provided portfolioData with dummy fallbacks
  const data = useMemo(() => {
    const projects = portfolioData?.projects || dummyData.projects || [];
    return { projects };
  }, [portfolioData]);

  // Fallback images in case the user's data profile has no projects yet
  const fallbackImages = [
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809",
    "https://images.unsplash.com/photo-1504333631130-c8ea9f17d3bd",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
  ];

  const galleryItems = (data.projects.length > 0
    ? data.projects.map((p) => p.image || p.coverImage).filter(Boolean)
    : fallbackImages);

  // Duplicate items to ensure seamless infinite looping animation
  const duplicatedItems = [...galleryItems, ...galleryItems, ...galleryItems];

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center overflow-hidden font-sans">
      
      {/* Background Infinite Moving Gallery Rows */}
      <div className="absolute inset-0 flex flex-col gap-4 opacity-15 rotate-12 scale-125 pointer-events-none select-none">
        {[...Array(3)].map((_, rowIndex) => (
          <motion.div 
            key={rowIndex}
            className="flex gap-4 min-w-max"
            animate={{ x: rowIndex % 2 === 0 ? [0, -1000] : [-1000, 0] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {duplicatedItems.map((imgSrc, idx) => (
              <img 
                key={idx} 
                src={imgSrc} 
                alt="Gallery Track" 
                className="w-72 h-48 object-cover rounded-xl border border-neutral-800 shadow-2xl"
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Foreground 404 Glassmorphism Content Card */}
      <div className="relative z-10 max-w-xl text-center px-6 py-12 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-xl shadow-2xl mx-4">
        <motion.h1 
          className="text-8xl font-black tracking-tighter bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="mt-4 text-2xl font-bold tracking-tight text-neutral-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Lost in the Matrix of Creativity
        </motion.h2>
        
        <p className="mt-3 text-base text-neutral-400 max-w-md mx-auto">
          The page you are looking for doesn't exist, but the visual journey never ends. Feel free to browse through the gallery loop in the backdrop.
        </p>

        <motion.div className="mt-8" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors shadow-lg"
          >
            Return to Dashboard
          </a>
        </motion.div>
      </div>

    </div>
  );
};

export default Error404InfiniteGallery;