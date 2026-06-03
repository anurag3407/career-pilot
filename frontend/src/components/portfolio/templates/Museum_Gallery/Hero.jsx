import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  ChevronDown,
} from 'lucide-react';
const Hero = ({data}) => {
  const { personal } = data;
  
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100">
      {/* Ornate double border frame */}
      <div className="absolute inset-8 md:inset-16 border-8 border-double border-amber-600/40 rounded-3xl pointer-events-none" />
      <div className="absolute inset-12 md:inset-20 border-4 border-double border-amber-500/30 rounded-2xl pointer-events-none" />
      
      {/* Subtle wall texture pattern */}
      <div className="absolute inset-2 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2392400e' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      {/* Spotlight effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/50 to-transparent pointer-events-none" />
      
      <div className="text-center z-10 px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {personal.avatar && (
            <div className="mx-auto m-8 relative inline-block group">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-400  to-amber-400 rounded-full blur-xl opacity-40" />
              
              {/* Main avatar frame */}
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] border-amber-600 shadow-2xl overflow-hidden from-amber-100 to-yellow-100">
                {/* <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-900/10" /> */}
                <img 
                  src={personal.avatar} 
                  alt={personal.name}
                  className="w-full h-full object-cover relative z-10"
                />
              </div>
              
              {/* Ornate outer ring */}
              <div className="absolute -inset-4 border-2 border-amber-500 rounded-full pointer-events-none" />
              <div className="absolute -inset-6 border border-amber-400/50 rounded-full pointer-events-none" />
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-7xl lg:text-8xl font-bold text-amber-900 mb-4 font-serif tracking-tight">
              {personal.name}
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full mb-6 ml-5 mr-5 shadow-lg border border-amber-400">
              <p className="text-m md:text-2xl lg:text-3xl text-amber-800 font-serif italic">
                {personal.title}
              </p>
            </div>
          </motion.div>
          
          {personal.location && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center justify-center gap-2 text-amber-700 mb-8"
            >
              <MapPin className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-lg md:text-xl font-serif">{personal.location}</span>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <a href="`#about`" className="inline-block" aria-label="Scroll to About section">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="w-10 h-10 md:w-12 md:h-12 text-amber-700 mx-auto" />
              </motion.div>
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-amber-600 rounded-tl-3xl opacity-60" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-amber-600 rounded-tr-3xl opacity-60" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-amber-600 rounded-bl-3xl opacity-60" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-amber-600 rounded-br-3xl opacity-60" />
    </section>
  );
};

export default Hero;