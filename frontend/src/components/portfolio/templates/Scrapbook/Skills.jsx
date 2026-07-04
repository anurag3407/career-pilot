import React from 'react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <>
      <style>{`
        .sb-body  { font-family: 'Patrick Hand', cursive; }
        .sb-hand  { font-family: 'Caveat', cursive; }
        .sb-marker{ font-family: 'Permanent Marker', cursive; }
      `}</style>
      <section className="relative w-full py-20 px-4 sm:px-8 bg-[#f4f1ea] overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      >
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16 relative">
            <h2 className="sb-marker text-5xl sm:text-6xl text-[#2d1f0e] rotate-[-2deg] inline-block bg-[#fffdf5] px-6 py-2 shadow-[4px_4px_0px_rgba(45,31,14,1)] border-[2.5px] border-[#2d1f0e]">
              My Toolkit 🎨
            </h2>
            {/* Tape over heading */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-pink-200/80 -rotate-3 border border-pink-300/40 mix-blend-multiply z-20" />
          </div>

          <div className="flex flex-wrap justify-center gap-6 gap-y-8 pt-4">
            {skills.map((skill, i) => {
              const rotations = ['rotate-[-4deg]', 'rotate-[3deg]', 'rotate-[-2deg]', 'rotate-[5deg]', 'rotate-[-6deg]', 'rotate-[2deg]'];
              const rot = rotations[i % rotations.length];
              
              return (
                <div key={i} className={`relative group cursor-pointer ${rot} transition-transform duration-300 hover:scale-110 hover:rotate-0 hover:z-30`}>
                  {/* Push pin */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 border border-red-700 shadow-[2px_3px_5px_rgba(0,0,0,0.3)] z-20">
                    <div className="absolute top-[2px] left-[2px] w-1.5 h-1.5 rounded-full bg-white/60" />
                  </div>
                  {/* Tag */}
                  <div className="bg-white border-[1.5px] border-[#d4b896] px-6 py-4 shadow-[2px_4px_10px_rgba(0,0,0,0.08)] rounded-sm relative pt-5 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-300 via-yellow-300 to-blue-300 opacity-60" />
                    <span className="sb-hand text-2xl font-bold text-[#4a3828]">{skill.name || skill}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}