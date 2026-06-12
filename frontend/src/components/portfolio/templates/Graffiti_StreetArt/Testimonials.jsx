import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 via-purple-950 to-black overflow-hidden">
      {/* Brick wall texture overlay (simulated with CSS) */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(335deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
        backgroundSize: '20px 20px'
      }} />

      <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/3 animate-pulse rounded-full bg-pink-600 opacity-10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <div className="mb-16 text-center">
          <div className="inline-block rotate-2 transform bg-yellow-400 px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-black md:text-6xl">
              Word On The Street
            </h2>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((test, i) => (
            <div key={i} className="group relative">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 opacity-30 blur transition duration-500 group-hover:opacity-70" />
              <div className="relative h-full bg-black/90 p-8 backdrop-blur-xl">
                <Quote className="absolute right-4 top-4 h-12 w-12 text-white/5" />
                
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-pink-500 bg-gray-800 text-xl font-bold text-pink-400">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold uppercase text-white">{test.name}</h3>
                    <p className="text-xs font-black uppercase text-green-400">{test.role || 'Collaborator'}</p>
                  </div>
                </div>
                
                <p className="relative z-10 text-gray-300 font-medium italic leading-relaxed">
                  "{test.content}"
                </p>

                {/* Decorative spray dot */}
                <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}