import React from 'react';
import { Camera, Map, Palette, Coffee, Heart, Star, Send, Sparkles } from 'lucide-react';

const SKILLS = [
  { name: 'React', color: 'bg-rose-200 text-rose-800 border-rose-300', rotation: '-rotate-2' },
  { name: 'Tailwind', color: 'bg-sky-200 text-sky-800 border-sky-300', rotation: 'rotate-3' },
  { name: 'Node.js', color: 'bg-emerald-200 text-emerald-800 border-emerald-300', rotation: '-rotate-1' },
  { name: 'Figma', color: 'bg-purple-200 text-purple-800 border-purple-300', rotation: 'rotate-2' },
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#f4f1ea] text-slate-800 font-sans p-4 sm:p-8 md:p-16 flex items-center">
      <style>{`
        @keyframes float-polaroid {
          0%, 100% { transform: translateY(0) rotate(var(--rot)); }
          50% { transform: translateY(-10px) rotate(calc(var(--rot) + 2deg)); }
        }
        .polaroid-anim-1 { --rot: 12deg; animation: float-polaroid 6s ease-in-out infinite; }
        .polaroid-anim-2 { --rot: -6deg; animation: float-polaroid 7s ease-in-out infinite 1s; }
        .polaroid-anim-3 { --rot: 3deg; animation: float-polaroid 8s ease-in-out infinite 2s; }
      `}</style>

      {/* Texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Grid lines (notebook paper effect) */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 pt-8 lg:pt-0">
        
        {/* Left side: Text content on torn paper */}
        <div className="relative flex flex-col justify-center">
          
          {/* Main Paper */}
          <div className="relative bg-[#faf9f6] p-8 md:p-12 lg:p-16 shadow-[4px_8px_24px_rgba(0,0,0,0.08)] border border-stone-200 transform -rotate-1 rounded-sm">
            
            {/* Washi Tape Top Left */}
            <div className="absolute -top-4 -left-6 w-28 h-9 bg-amber-200/90 -rotate-6 shadow-sm backdrop-blur-sm border border-amber-300/40 z-20 mix-blend-multiply opacity-90" />
            <div className="absolute -top-6 -left-2 w-24 h-8 bg-blue-200/80 -rotate-12 shadow-sm backdrop-blur-sm border border-blue-300/30 z-20 mix-blend-multiply opacity-80" />
            
            {/* Washi Tape Bottom Right */}
            <div className="absolute -bottom-5 -right-5 w-32 h-10 bg-rose-200/90 -rotate-3 shadow-sm backdrop-blur-sm border border-rose-300/40 z-20 mix-blend-multiply opacity-90" />
            
            {/* Paper texture inner border line */}
            <div className="absolute inset-0 border-[2px] border-dashed border-stone-300 pointer-events-none m-3 opacity-60" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <span className="px-4 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-black uppercase tracking-[0.2em] transform rotate-2 border-2 border-yellow-300 shadow-[2px_2px_0px_rgba(253,224,71,1)]">
                  Hi there! 👋
                </span>
                <Sparkles className="text-amber-400 w-6 h-6 rotate-12" />
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-stone-800 leading-[1.1]">
                I'm <span className="text-stone-600">Alex</span> <br/>
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 text-rose-500 font-serif italic font-normal tracking-wide pr-2">Creative</span>
                  <div className="absolute bottom-1 left-0 w-full h-4 bg-rose-200/60 -z-10 transform -rotate-2" />
                </span>
                <br/> Developer.
              </h1>

              <p className="text-lg md:text-xl text-stone-600 mb-10 font-medium leading-relaxed max-w-lg font-serif">
                A passionate software engineer based in San Francisco. Specializing in turning complex problems into beautiful, intuitive designs that tell a story.
              </p>

              {/* Skills / Stickers */}
              <div className="flex flex-wrap gap-3 mb-10">
                {SKILLS.map((skill, idx) => (
                  <div 
                    key={idx} 
                    className={`px-4 py-2 border-2 border-dashed rounded-md font-bold text-sm shadow-sm ${skill.color} ${skill.rotation} transition-all duration-300 hover:rotate-0 hover:scale-110 cursor-pointer`}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 mt-4">
                <button type="button" className="relative group inline-block">
                  <div className="absolute inset-0 bg-stone-800 transform translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2.5 group-hover:translate-y-2.5 rounded-sm" />
                  <div className="relative px-8 py-4 bg-white border-2 border-stone-800 text-stone-800 font-bold text-lg flex items-center gap-3 transform transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 rounded-sm">
                    <Send className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Contact Me
                  </div>
                </button>
                <button type="button" className="font-bold text-stone-600 hover:text-rose-500 transition-colors underline decoration-2 underline-offset-4 decoration-stone-300 hover:decoration-rose-300">
                  View Projects
                </button>
              </div>

            </div>
          </div>
          
          {/* Decorative blobs behind main paper */}
          <div className="absolute -z-10 -bottom-10 -left-10 w-48 h-48 bg-cyan-200/50 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute -z-10 -top-10 -right-10 w-56 h-56 bg-fuchsia-200/50 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        {/* Right side: Polaroids collage */}
        <div className="relative h-[500px] lg:h-auto min-h-[500px] flex items-center justify-center lg:justify-end pr-0 lg:pr-10">
          
          <div className="relative w-full max-w-md aspect-square mt-10 lg:mt-0">
            
            {/* Background elements */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-amber-200/40 rounded-full mix-blend-multiply filter blur-3xl" />
            
            {/* Polaroid 1 (Back Right) */}
            <div className="polaroid-anim-1 absolute top-4 -right-8 w-[220px] p-4 pb-6 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-500 hover:z-30 hover:scale-105 cursor-grab active:cursor-grabbing border border-stone-200">
              <div className="w-full aspect-square bg-stone-100 mb-4 flex items-center justify-center overflow-hidden relative border border-stone-200/60">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-80" />
              </div>
              <div className="font-serif text-xl text-center text-stone-700 flex items-center justify-center gap-2" style={{ fontFamily: '"Caveat", cursive, serif' }}>
                <Coffee className="w-4 h-4 text-stone-500" /> Late nights
              </div>
              {/* Push Pin */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_2px_4px_rgba(0,0,0,0.3)] border border-red-700">
                <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white/50" />
              </div>
            </div>

            {/* Polaroid 2 (Middle Left) */}
            <div className="polaroid-anim-2 absolute top-40 -left-12 w-[200px] p-4 pb-6 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-500 hover:z-30 hover:scale-105 cursor-grab active:cursor-grabbing z-10 border border-stone-200">
              <div className="absolute -top-3 -right-3 w-16 h-6 bg-emerald-200/90 rotate-12 shadow-sm backdrop-blur-sm border border-emerald-300/40 z-20 mix-blend-multiply" />
              <div className="w-full aspect-square bg-stone-100 mb-4 flex items-center justify-center overflow-hidden relative border border-stone-200/60">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-90" />
              </div>
              <div className="font-serif text-xl text-center text-stone-700" style={{ fontFamily: '"Caveat", cursive, serif' }}>
                Design process
              </div>
            </div>

            {/* Polaroid 3 (Front Center) */}
            <div className="polaroid-anim-3 absolute -bottom-8 left-12 w-[260px] p-4 pb-6 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-500 hover:z-40 hover:scale-105 cursor-grab active:cursor-grabbing z-20 border border-stone-200">
              {/* Binder clip effect */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-6 bg-stone-800 rounded-t-sm shadow-md flex items-start justify-center z-20 border-b-2 border-stone-900">
                <div className="w-8 h-8 border-2 border-stone-400 rounded-full -mt-5" />
              </div>
              
              <div className="w-full aspect-[4/4.5] bg-stone-900 mb-4 flex flex-col items-center justify-center text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent opacity-90" />
                <div className="relative z-10 text-center p-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                  <Star className="w-10 h-10 text-yellow-400 mb-3 mx-auto drop-shadow-md" fill="currentColor" />
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">Featured Work</h3>
                  <p className="text-xs text-stone-300 font-medium tracking-widest uppercase">Creative Coding</p>
                </div>
              </div>
              <div className="font-serif text-2xl text-center text-stone-800 flex items-center justify-center gap-2 font-medium" style={{ fontFamily: '"Caveat", cursive, serif' }}>
                The Masterpiece <Heart className="w-5 h-5 text-rose-500" fill="currentColor" />
              </div>
            </div>

            {/* Floating Doodles */}
            <svg className="absolute -right-16 top-1/3 w-20 h-20 text-stone-400 pointer-events-none transform rotate-12 opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 50 Q 30 10, 50 50 T 90 50" strokeDasharray="6,6" />
              <path d="M75 35 L 90 50 L 75 65" />
            </svg>
            
            <svg className="absolute -left-16 bottom-10 w-16 h-16 text-rose-400 pointer-events-none transform -rotate-12 opacity-70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="50" cy="50" r="35" strokeDasharray="10 10" />
              <path d="M35 50 L 50 65 L 75 35" />
            </svg>

          </div>
        </div>
      </div>
    </section>
  );
}
