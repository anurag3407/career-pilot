import React from 'react';
import { motion } from 'framer-motion';
import { Ship, Compass } from 'lucide-react';

export default function Hero({ data }) {
  const personal = data?.personal || data?.personalInfo || {};
  
  const handleBeginDive = () => {
    // Scroll down to the About section
    const aboutSection = document.getElementById('sunlight-zone');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between items-center text-white overflow-hidden select-none bg-gradient-to-b from-[#bae6fd] via-[#38bdf8] to-[#0284c7]">
      {/* Sunlight rays overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[150%] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.45)_0%,transparent_60%)] animate-pulse" style={{ animationDuration: '6s' }} />
        {/* Animated light rays */}
        <div className="absolute top-0 left-[20%] w-[20%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-ray-move-1 pointer-events-none" />
        <div className="absolute top-0 left-[60%] w-[15%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 animate-ray-move-2 pointer-events-none" />
      </div>

      {/* Floating clouds in sky */}
      <div className="absolute top-12 left-10 w-24 h-8 bg-white/40 blur-md rounded-full animate-float-slow pointer-events-none" />
      <div className="absolute top-20 right-20 w-36 h-12 bg-white/30 blur-md rounded-full animate-float-slower pointer-events-none" />

      {/* Floating bubbles rising from water */}
      <div className="absolute inset-x-0 bottom-0 h-64 overflow-hidden pointer-events-none z-10">
        <div className="bubble-hero bubble-1" />
        <div className="bubble-hero bubble-2" />
        <div className="bubble-hero bubble-3" />
        <div className="bubble-hero bubble-4" />
        <div className="bubble-hero bubble-5" />
      </div>

      {/* Top spacing */}
      <div className="h-16" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6 my-auto pt-10">
        {/* Submarine Expedition Logo / Icon */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
          className="bg-sky-100/10 border border-white/20 backdrop-blur-md p-4 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-4"
        >
          <Ship className="w-12 h-12 text-sky-100 animate-bounce" style={{ animationDuration: '3s' }} />
        </motion.div>

        {/* Developer Name */}
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)] font-sans"
        >
          {personal.name || "Explorer"}
        </motion.h1>

        {/* Professional Title */}
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="text-xl sm:text-2xl md:text-3xl font-medium text-sky-100 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] max-w-2xl"
        >
          {personal.title || "Deep Sea Oceanographer"}
        </motion.p>

        {/* Professional Bio */}
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="text-base sm:text-lg text-sky-50 max-w-2xl leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
        >
          {personal.bio || "Welcome to the research expedition. Join me as we descend into the depths of my professional journey, exploring finished projects and milestones down to the Mariana Trench floor."}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto"
        >
          <button 
            onClick={handleBeginDive}
            className="group px-8 py-4 bg-sky-100 hover:bg-white text-sky-950 font-bold rounded-full shadow-lg hover:shadow-sky-200/50 transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-transparent"
          >
            <span>🌊 Begin the Dive</span>
          </button>
          
          <button 
            onClick={() => {
              const projectsSection = document.getElementById('midnight-zone');
              if (projectsSection) projectsSection.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold rounded-full border-2 border-white/50 hover:border-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-sky-200 group-hover:rotate-45 transition-transform" />
            <span>🚀 Explore Projects</span>
          </button>
        </motion.div>
      </div>

      {/* Floating Avatar or Hero Image */}
      {personal.avatar && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/40 overflow-hidden shadow-2xl animate-float mb-6 mt-8"
        >
          <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover" />
        </motion.div>
      )}

      {/* Interactive Waves at the bottom boundary */}
      <div className="w-full relative h-36 md:h-48 z-10 select-none pointer-events-none mt-auto">
        {/* Layered animated SVG waves */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wave 1: Slow background wave */}
          <path 
            d="M0,80 C360,110 720,50 1080,90 C1260,110 1380,100 1440,90 L1440,120 L0,120 Z" 
            fill="#0369a1" 
            opacity="0.5"
            className="animate-wave-slow"
          />
          {/* Wave 2: Medium wave */}
          <path 
            d="M0,60 C360,30 720,90 1080,50 C1260,30 1380,70 1440,60 L1440,120 L0,120 Z" 
            fill="#0284c7" 
            opacity="0.8"
            className="animate-wave-medium"
          />
          {/* Wave 3: Foreground deep ocean block */}
          <path 
            d="M0,40 C360,80 720,20 1080,70 C1260,95 1380,45 1440,40 L1440,120 L0,120 Z" 
            fill="#075985" 
            className="animate-wave-fast"
          />
        </svg>
      </div>

      {/* Keyframe animations injected inside style block */}
      <style>{`
        @keyframes float-slow {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(30px) translateY(-5px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes float-slower {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-40px) translateY(10px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes ray-move-1 {
          0% { transform: translateX(-100%) skewX(12deg); opacity: 0.1; }
          50% { opacity: 0.25; }
          100% { transform: translateX(200%) skewX(12deg); opacity: 0.1; }
        }
        @keyframes ray-move-2 {
          0% { transform: translateX(-50%) skewX(12deg); opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { transform: translateX(250%) skewX(12deg); opacity: 0.1; }
        }
        @keyframes bubble-rise {
          0% { transform: translateY(100px) scale(0.6); opacity: 0; }
          20% { opacity: 0.6; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-800px) scale(1.2); opacity: 0; }
        }
        
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 20s ease-in-out infinite;
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-ray-move-1 {
          animation: ray-move-1 12s ease-in-out infinite;
        }
        .animate-ray-move-2 {
          animation: ray-move-2 16s ease-in-out infinite;
        }

        /* Bubble styles */
        .bubble-hero {
          position: absolute;
          bottom: -40px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.4), 0 2px 10px rgba(255,255,255,0.1);
          pointer-events: none;
        }
        .bubble-1 { left: 10%; width: 25px; height: 25px; animation: bubble-rise 9s infinite linear; }
        .bubble-2 { left: 30%; width: 12px; height: 12px; animation: bubble-rise 12s infinite linear; animation-delay: 2s; }
        .bubble-3 { left: 55%; width: 18px; height: 18px; animation: bubble-rise 8s infinite linear; animation-delay: 4s; }
        .bubble-4 { left: 75%; width: 8px; height: 8px; animation: bubble-rise 15s infinite linear; animation-delay: 1s; }
        .bubble-5 { left: 85%; width: 30px; height: 30px; animation: bubble-rise 10s infinite linear; animation-delay: 5s; }

        /* Custom Wave animation classes */
        @keyframes wave-h {
          0% { transform: translateX(0); }
          50% { transform: translateX(-40px); }
          100% { transform: translateX(0); }
        }
        .animate-wave-slow {
          animation: wave-h 25s ease-in-out infinite;
        }
        .animate-wave-medium {
          animation: wave-h 16s ease-in-out infinite;
        }
        .animate-wave-fast {
          animation: wave-h 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
