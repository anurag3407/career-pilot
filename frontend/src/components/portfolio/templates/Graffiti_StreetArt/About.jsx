import React from 'react';
import { User, Target, Flame } from 'lucide-react';

export default function About({ data }) {
  const { personal } = data || {};
  if (!personal) return null;

  return (
    <section className="relative py-24 bg-gray-900 overflow-hidden">
      {/* Diagonal tape strips */}
      <div className="absolute -left-10 top-20 h-16 w-96 -rotate-45 bg-yellow-400 opacity-90 shadow-lg flex items-center overflow-hidden">
        <div className="w-full flex space-x-4 whitespace-nowrap opacity-50">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-black font-black uppercase text-xl">DO NOT CROSS</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Image side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-pink-500 translate-x-4 translate-y-4 rounded-xl"></div>
            <div className="absolute inset-0 bg-yellow-400 translate-x-2 translate-y-2 rounded-xl"></div>
            <div className="relative bg-black rounded-xl border-4 border-white overflow-hidden aspect-[4/5] md:aspect-square flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 group">
              {personal.avatar ? (
                <img 
                  src={personal.avatar} 
                  alt={personal.name || "Profile Avatar"} 
                  className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
                />
              ) : (
                <div className="text-gray-700 flex flex-col items-center">
                  <User className="w-32 h-32 mb-4" />
                  <span className="font-black uppercase tracking-widest">No Image</span>
                </div>
              )}
              {/* Overlay grunge texture */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
              }}></div>
            </div>
          </div>

          {/* Content side */}
          <div className="w-full lg:w-1/2">
            <div className="inline-block bg-green-500 px-3 py-1 mb-6 rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-black font-black uppercase text-sm">Artist Profile</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2">
              <span className="bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">Hello,</span> I'm
            </h2>
            <h3 className="text-3xl md:text-5xl font-black uppercase text-gray-200 drop-shadow-md mb-6">
              {personal.name || 'Anonymous'}
            </h3>
            
            <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed mb-8 border-l-4 border-pink-500 pl-4">
              {personal.bio || 'Passionate creator pushing boundaries and painting the digital canvas with bold ideas.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                <Target className="w-8 h-8 text-yellow-400" />
                <div>
                  <div className="text-sm font-black uppercase text-gray-500">Focus</div>
                  <div className="text-white font-bold">{personal.role || 'Design & Code'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                <Flame className="w-8 h-8 text-pink-500" />
                <div>
                  <div className="text-sm font-black uppercase text-gray-500">Style</div>
                  <div className="text-white font-bold">Unapologetic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
