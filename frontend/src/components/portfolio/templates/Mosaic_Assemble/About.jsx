import React from 'react';
import { motion } from 'framer-motion';
import MosaicImage from './MosaicImage';
import TileSnappingText from './TileSnappingText';

const About = ({ data = {} }) => (
  <section className="py-32 px-6 max-w-7xl mx-auto relative z-20">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      
      {/* Profile Media Frame */}
      <motion.div
        className="w-full lg:col-span-4 relative group"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="relative p-3 bg-slate-950 border border-slate-900 rounded-2xl shadow-2xl">
          <MosaicImage
            src={data.avatar}
            alt="Profile"
            rows={4}
            cols={4}
            className="aspect-square rounded-xl object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </motion.div>

      {/* Content Metadata Display */}
      <div className="w-full lg:col-span-8 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-8 bg-cyan-500" />
          <TileSnappingText 
            text="Identity Registry" 
            className="text-xs font-mono uppercase tracking-[0.4em] text-cyan-400"
            baseDelay={0.1}
          />
        </div>

        <h2 className="text-4xl md:text-5xl font-black mb-8 text-white tracking-tight">
          <TileSnappingText text="About Me" baseDelay={0.2} />
        </h2>

        <div className="text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-3xl border-l-2 border-slate-900 pl-6 py-2">
          <TileSnappingText 
            text={data.bio} 
            className="text-slate-300" 
            variant="subtle" 
            stagger={0.003} // Fast stream for long descriptive copy
            baseDelay={0.3} 
          />
        </div>

        <div>
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-950 to-slate-900 rounded-lg border border-slate-800 text-slate-300 text-sm font-mono tracking-wide"
            whileHover={{ borderColor: 'rgba(34,211,238,0.4)', x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            OPERATIONAL BASE : <span className="text-white ml-1 font-sans font-bold">{data.location}</span>
          </motion.div>
        </div>
      </div>

    </div>
  </section>
);

export default About;