// frontend/src/components/portfolio/templates/Elevator_Pitch/index.jsx
import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import data from '../../../../data/dummy_data.json';
import { ElevatorDoors } from './ElevatorDoors';
import { Hero } from './Hero';
import { About } from './About';
import { Skills } from './Skills';
import { Projects } from './Projects';
import { Experience } from './Experience';
import { Contact } from './Contact';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function ElevatorPitchPortfolio() {
  const { scrollYProgress } = useScroll();
  const [currentFloor, setCurrentFloor] = useState(1);
  const [scrollDirection, setScrollDirection] = useState(null);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let newFloor = 1;
    if (latest > 0.8) newFloor = 5;
    else if (latest > 0.6) newFloor = 4;
    else if (latest > 0.4) newFloor = 3;
    else if (latest > 0.2) newFloor = 2;
    
    if (newFloor !== currentFloor) setCurrentFloor(newFloor);

    const velocity = scrollYProgress.getVelocity();
    if (velocity > 0) setScrollDirection('down');
    else if (velocity < 0) setScrollDirection('up');
    else setScrollDirection(null);
  });

  const scrollToFloor = (floorNum) => {
    const el = document.getElementById(`floor-${floorNum}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-black text-zinc-100 font-sans selection:bg-emerald-500/30 pt-10 overflow-x-hidden">
      
      {/* MOBILE OPTIMIZED CONTROL PANEL */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit max-w-[95%]">
        {/* Removed backdrop-blur on mobile, kept on desktop (md:backdrop-blur-xl) */}
        <div className="bg-[#111111]/95 md:bg-[#111111]/90 md:backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-2 shadow-lg md:shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex items-center gap-2 md:gap-4">
          
          <div className="flex flex-col items-center justify-center pl-2 md:pl-3">
             <ChevronUp size={18} className={`transition-colors duration-300 ${scrollDirection === 'up' ? 'text-emerald-500 md:drop-shadow-[0_0_8px_rgba(16,185,129,1)]' : 'text-zinc-700'}`} />
             <ChevronDown size={18} className={`transition-colors duration-300 ${scrollDirection === 'down' ? 'text-emerald-500 md:drop-shadow-[0_0_8px_rgba(16,185,129,1)]' : 'text-zinc-700'}`} />
          </div>

          <div className="bg-black border-2 border-zinc-800 rounded-xl px-4 md:px-6 py-2 shadow-[inset_0_4px_15px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-center min-w-[70px] md:min-w-[90px]">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <motion.span 
              key={currentFloor}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-mono text-2xl md:text-3xl font-black text-emerald-500 md:drop-shadow-[0_0_12px_rgba(16,185,129,0.8)] tracking-tighter"
            >
              0{currentFloor}
            </motion.span>
          </div>

          <div className="flex gap-1.5 md:gap-2 pr-1 md:pr-2">
             {[1, 2, 3, 4, 5].map(floor => (
                <button
                  key={floor}
                  onClick={() => scrollToFloor(floor)}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 relative
                    ${currentFloor === floor
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 md:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-zinc-800/40 text-zinc-500 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300'
                    }
                  `}
                >
                  {currentFloor === floor && (
                    <motion.div layoutId="active-floor-ring" className="absolute inset-[-2px] border-2 border-emerald-500/50 rounded-full hidden md:block" />
                  )}
                  {floor}
                </button>
             ))}
          </div>
        </div>
      </div>

      {/* --- FLOORS --- */}
      <main>
        <ElevatorDoors id="floor-1" floorNumber="1" title="Lobby">
          <Hero personal={data.personal} socials={data.socials} />
        </ElevatorDoors>

        <ElevatorDoors id="floor-2" floorNumber="2" title="Systems">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <About personal={data.personal} stats={data.stats} />
            <Skills skills={data.skills} />
          </div>
        </ElevatorDoors>

        <ElevatorDoors id="floor-3" floorNumber="3" title="Archives">
          <Projects projects={data.projects} />
        </ElevatorDoors>

        <ElevatorDoors id="floor-4" floorNumber="4" title="Logs">
          <Experience experience={data.experience} />
        </ElevatorDoors>

        <ElevatorDoors id="floor-5" floorNumber="5" title="Override">
          <Contact email={data.socials.email} />
        </ElevatorDoors>
      </main>
    </div>
  );
}