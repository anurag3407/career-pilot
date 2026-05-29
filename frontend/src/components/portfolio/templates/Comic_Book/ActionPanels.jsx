import React from 'react';
import { Zap, Shield, Target, Rocket, Star, Flame } from 'lucide-react';

const panelsData = [
  {
    id: 1,
    title: 'Super Speed',
    description: 'Lightning-fast delivery of highly optimized and scalable code. No delays, just speed!',
    icon: Zap,
    color: 'bg-blue-400',
    effect: 'ZAP!',
    effectColor: 'bg-yellow-400',
    rotation: '-rotate-2',
  },
  {
    id: 2,
    title: 'Iron Defense',
    description: 'Rock-solid security practices. Your data is protected by an impenetrable fortress.',
    icon: Shield,
    color: 'bg-red-500',
    effect: 'POW!',
    effectColor: 'bg-cyan-400',
    rotation: 'rotate-2',
  },
  {
    id: 3,
    title: 'Laser Focus',
    description: 'Precision targeting of user needs to deliver the ultimate, pixel-perfect experience.',
    icon: Target,
    color: 'bg-yellow-400',
    effect: 'BAM!',
    effectColor: 'bg-red-500',
    rotation: '-rotate-1',
  },
  {
    id: 4,
    title: 'Skyrocket',
    description: 'Propel your business to the stratosphere with cutting-edge tech and dynamic solutions.',
    icon: Rocket,
    color: 'bg-cyan-400',
    effect: 'BOOM!',
    effectColor: 'bg-orange-500',
    rotation: 'rotate-3',
  },
  {
    id: 5,
    title: 'Stellar UI',
    description: 'Out-of-this-world aesthetics that capture the imagination and keep users hooked.',
    icon: Star,
    color: 'bg-orange-500',
    effect: 'WHAM!',
    effectColor: 'bg-blue-400',
    rotation: '-rotate-3',
  },
  {
    id: 6,
    title: 'Raw Power',
    description: 'Harness the raw power of modern frontend frameworks to crush the competition.',
    icon: Flame,
    color: 'bg-purple-400',
    effect: 'CRASH!',
    effectColor: 'bg-yellow-400',
    rotation: 'rotate-1',
  },
];

const ActionPanels = () => {
  return (
    <section className="relative w-full py-24 md:py-32 bg-yellow-400 overflow-hidden border-y-8 border-black">
      {/* Halftone background pattern using CSS radial gradient */}
      <div 
        className="absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage: 'radial-gradient(#000 2.5px, transparent 2.5px)',
          backgroundSize: '20px 20px'
        }}
      ></div>

      {/* Diagonal Action Dividers */}
      <div className="absolute top-0 left-0 w-full h-12 bg-black -skew-y-2 transform origin-top-left z-10 border-b-8 border-white"></div>
      <div className="absolute bottom-0 left-0 w-full h-12 bg-black skew-y-2 transform origin-bottom-left z-10 border-t-8 border-white"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20">
        {/* Header Section */}
        <div className="flex justify-center mb-20 md:mb-28">
          <div className="relative inline-block group">
            {/* Background Burst Elements */}
            <div className="absolute -inset-6 bg-red-500 rotate-3 border-4 border-black z-0 transition-transform duration-300 group-hover:rotate-6"></div>
            <div className="absolute -inset-6 bg-blue-500 -rotate-3 border-4 border-black z-0 transition-transform duration-300 group-hover:-rotate-6"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-yellow-400 text-xl md:text-2xl font-black uppercase italic tracking-widest bg-black px-4 py-1 border-4 border-white transform -skew-x-12 mb-2 shadow-[4px_4px_0px_0px_#3b82f6]">
                Interactive
              </span>
              <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white bg-black px-6 py-4 border-4 border-white shadow-[8px_8px_0px_0px_#ef4444] transform -skew-x-12 transition-transform duration-300 group-hover:scale-105">
                Action <span className="text-cyan-400">Panels</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Action Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-14 pt-8">
          {panelsData.map((panel) => {
            const Icon = panel.icon;
            return (
              <div 
                key={panel.id} 
                className={`relative group ${panel.rotation} transition-all duration-300 hover:scale-105 hover:z-30`}
              >
                {/* Action Badge ("BOOM!", "POW!") */}
                <div 
                  className={`absolute -top-10 -right-4 md:-right-8 z-30 ${panel.effectColor} text-black font-black italic uppercase px-5 py-2 text-2xl md:text-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full transform rotate-12 group-hover:rotate-6 group-hover:scale-125 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]`}
                >
                  {panel.effect}
                </div>

                {/* Main Panel Card Container */}
                <div 
                  className={`h-full ${panel.color} border-4 border-black p-6 md:p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 flex flex-col justify-start relative overflow-visible`}
                >
                  {/* Subtle background graphic inside panel */}
                  <div className="absolute -bottom-12 -right-12 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                     <Icon className="w-56 h-56 text-black" strokeWidth={1} />
                  </div>

                  {/* Icon & Title Area */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="bg-white border-4 border-black rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 group-hover:-rotate-12 transition-transform duration-300">
                      <Icon className="w-8 h-8 md:w-10 md:h-10 text-black" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase italic text-black tracking-wide bg-white px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -skew-x-6">
                      {panel.title}
                    </h3>
                  </div>
                  
                  {/* Speech Bubble for Description */}
                  <div className="relative bg-white border-4 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-grow mt-2 z-10 group-hover:-translate-y-2 transition-transform duration-300">
                    {/* Speech Bubble Tail */}
                    <div className="absolute -top-[14px] left-8 w-6 h-6 bg-white border-t-4 border-l-4 border-black transform rotate-45 z-10"></div>
                    
                    <p className="text-black font-bold text-lg md:text-xl leading-snug relative z-20">
                      {panel.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActionPanels;
