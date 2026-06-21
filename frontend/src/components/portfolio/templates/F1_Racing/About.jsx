import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Target, Navigation } from 'lucide-react';

export default function About({ data }) {
  const profile = data?.personalInfo || data?.personal;
  if (!profile) return null;

  return (
    <section id="about" className="relative py-20 bg-[#070709] border-b border-neutral-900 text-white overflow-hidden selection:bg-[#E10600] selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col md:flex-row gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left: Driver Profile Picture / Helmet */}
          <div className="w-full md:w-5/12 flex justify-center relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-64 h-64 md:w-80 md:h-80"
            >
              <div className="absolute inset-0 border-2 border-dashed border-[#E10600]/30 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 border border-neutral-800 rounded-full bg-[#121216] flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name || "Profile Avatar"} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-24 h-24 text-neutral-800" />
                )}
                {/* Overlay red gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#E10600]/40 to-transparent mix-blend-overlay" />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -bottom-4 right-4 bg-[#E10600] text-white px-4 py-2 font-mono font-bold text-sm tracking-widest transform -skew-x-12 shadow-lg shadow-[#E10600]/20">
                <div className="transform skew-x-12 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> SUPER LICENCE
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Bio & Info */}
          <div className="w-full md:w-7/12 space-y-6">
            <div className="inline-flex items-center bg-neutral-900/80 backdrop-blur-sm border-l-4 border-[#00ff66] px-3 py-1.5 text-xs font-mono text-neutral-300 gap-2 uppercase tracking-widest">
              <Navigation className="w-4 h-4 text-[#00ff66]" />
              <span>Driver Profile</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase italic transform -skew-x-12">
              <span className="block text-white">THE MIND</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 to-neutral-500">
                BEHIND THE WHEEL
              </span>
            </h2>

            <div className="text-neutral-400 font-sans text-base md:text-lg leading-relaxed space-y-4 pt-2">
              <p>
                {profile.bio || "A relentless engineer driven by performance, precision, and the continuous pursuit of optimization. Like a finely tuned F1 car, every line of code is meticulously crafted to deliver maximum speed and reliability."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-[#121216]/60 border border-neutral-800 p-4 rounded-lg">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Target className="w-3 h-3 text-[#E10600]" /> Focus
                </div>
                <div className="text-sm font-bold text-white">Performance Architecture</div>
              </div>
              <div className="bg-[#121216]/60 border border-neutral-800 p-4 rounded-lg">
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#00ff66]" /> Reliability
                </div>
                <div className="text-sm font-bold text-white">Zero Downtime Execution</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
