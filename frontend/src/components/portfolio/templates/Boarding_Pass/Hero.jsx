import React from 'react';
import { motion } from 'framer-motion';
import { PlaneTakeoff, QrCode } from 'lucide-react';

export default function Hero({ personal }) {
  // Generate a random-looking flight number based on initials
  const initials = personal.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  const flightNumber = `${initials}-${Math.floor(Math.random() * 899 + 100)}`;
  
  const today = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pt-12 pb-8">
      {/* The main boarding pass container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-stone-200"
      >
        {/* Left Side: Main Pass */}
        <div className="flex-1 p-6 md:p-10 border-b md:border-b-0 md:border-r-2 border-dashed border-stone-300 relative">
          
          {/* Airline Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                <PlaneTakeoff className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-blue-900 tracking-tighter text-2xl uppercase leading-none">AeroTech</h3>
                <span className="text-[10px] font-bold text-stone-400 tracking-[0.2em] uppercase">Global Airways</span>
              </div>
            </div>
            
            <div className="text-right">
              <span className="block text-[10px] font-bold text-stone-400 tracking-[0.1em] uppercase mb-1">Boarding Pass</span>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs uppercase rounded-full border border-amber-200">
                First Class
              </span>
            </div>
          </div>

          {/* Passenger Info & Route */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-8">
            {/* From/To */}
            <div className="col-span-1 md:col-span-8 flex items-center justify-between bg-stone-50 rounded-2xl p-6 border border-stone-100">
              <div className="text-left">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Origin</span>
                <h2 className="text-4xl md:text-5xl font-black text-stone-800 tracking-tighter">LOC</h2>
                <span className="block text-xs font-semibold text-stone-500 mt-1">{personal.location || "LocalHost"}</span>
              </div>
              
              <div className="flex-1 px-4 flex flex-col items-center">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Direct Flight</span>
                <div className="w-full relative flex items-center justify-center">
                  <div className="absolute w-full h-[2px] bg-stone-300 border-t-2 border-dashed border-stone-300"></div>
                  <PlaneTakeoff className="w-6 h-6 text-blue-600 relative z-10 bg-stone-50 px-1" />
                </div>
              </div>

              <div className="text-right">
                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Destination</span>
                <h2 className="text-4xl md:text-5xl font-black text-stone-800 tracking-tighter">WEB</h2>
                <span className="block text-xs font-semibold text-stone-500 mt-1">World Wide Web</span>
              </div>
            </div>

            {/* Avatar / Portrait */}
            <div className="col-span-1 md:col-span-4 flex justify-center md:justify-end">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-stone-100 shrink-0">
                <img 
                  src={personal.avatar} 
                  alt={personal.name} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Ticket Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div>
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Passenger</span>
              <p className="font-bold text-stone-800 truncate">{personal.name.toUpperCase()}</p>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Flight</span>
              <p className="font-bold text-stone-800 font-mono">{flightNumber}</p>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Date</span>
              <p className="font-bold text-stone-800 font-mono">{today}</p>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Seat</span>
              <p className="font-bold text-stone-800 font-mono">01A</p>
            </div>
          </div>

        </div>

        {/* Right Side: Tear-off Stub */}
        <div className="w-full md:w-64 bg-stone-50 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Half-circles for the perforated tear effect on desktop */}
          <div className="hidden md:block absolute -left-3 top-0 bottom-0 w-6 flex flex-col justify-between py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-stone-100 shadow-inner" />
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <PlaneTakeoff className="w-5 h-5 text-stone-400" />
              <span className="text-[10px] font-bold text-stone-400 tracking-[0.1em] uppercase">Boarding Stub</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider">Passenger</span>
                <p className="font-bold text-stone-800 text-sm truncate">{personal.name.toUpperCase()}</p>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider">Title</span>
                <p className="font-semibold text-stone-600 text-xs leading-tight">{personal.title}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider">Gate</span>
                  <p className="font-bold text-stone-800 font-mono">T1</p>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider">Seat</span>
                  <p className="font-bold text-stone-800 font-mono">01A</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            {/* CSS Barcode Simulation */}
            <div className="w-full h-12 flex items-center justify-between opacity-80 mix-blend-multiply">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-full bg-stone-800" 
                  style={{ width: `${Math.random() * 4 + 1}px` }}
                />
              ))}
            </div>
            <span className="text-[8px] font-mono text-stone-400 mt-2 tracking-widest">{flightNumber}-XYZ99</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
