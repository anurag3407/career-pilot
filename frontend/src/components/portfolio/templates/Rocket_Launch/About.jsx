import React from 'react';
import { FreeFadeIn } from './Shared';
import { Rocket } from 'lucide-react';

export default function About({ personal }) {
  return (
    <section className="min-h-screen flex items-center py-24">
      <div className="w-full grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-4 flex justify-start group">
          <FreeFadeIn xOffset={-40}>
            <img 
              src={personal.avatar} 
              alt="Profile" 
              className="w-48 h-48 md:w-72 md:h-72 object-cover rounded-2xl grayscale group-hover:grayscale-0 group-hover:border-orange-500 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all duration-700 border border-slate-800"
            />
          </FreeFadeIn>
        </div>
        <div className="hidden md:block md:col-span-2 pointer-events-none" />
        <div className="md:col-span-6 group">
          <FreeFadeIn xOffset={40}>
            <h2 className="text-xs font-mono uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
               ABOUT ME
            </h2>
            <p className="text-xl md:text-2xl font-light text-slate-300 leading-relaxed tracking-wide group-hover:text-white transition-colors">
              {personal.bio}
            </p>
            <div className="mt-6 font-mono text-xs text-slate-500 tracking-wider">
              LOCATION: <span className="text-orange-300">{personal.location.toUpperCase()}</span>
            </div>
          </FreeFadeIn>
        </div>
      </div>
    </section>
  );
}