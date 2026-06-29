import React from 'react';
import { FreeFadeIn } from './Shared';
import { Rocket, Mail } from 'lucide-react';

export default function Contact({ personal, socials }) {
  return (
    <section className="min-h-screen flex flex-col justify-center py-24">
      <div className="w-full max-w-4xl mx-auto">
        <FreeFadeIn>
          <div className="text-left mb-16 group">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase mb-4 group-hover:text-orange-500 transition-colors drop-shadow-[0_0_15px_rgba(249,115,22,0)] group-hover:drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">Contact Me</h2>
            <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">Let's work together</p>
          </div>
        </FreeFadeIn>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-12 w-full">
          <FreeFadeIn delay={0.1}>
            <div className="relative group w-full">
              <input type="text" className="w-full bg-transparent border-b border-slate-700 py-4 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 hover:border-orange-500/50 hover:shadow-[0_15px_20px_-10px_rgba(249,115,22,0.15)] font-light transition-all" placeholder="Name" />
            </div>
          </FreeFadeIn>

          <FreeFadeIn delay={0.2}>
            <div className="relative group w-full">
              <input type="email" className="w-full bg-transparent border-b border-slate-700 py-4 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 hover:border-orange-500/50 hover:shadow-[0_15px_20px_-10px_rgba(249,115,22,0.15)] font-light transition-all" placeholder="Email" />
            </div>
          </FreeFadeIn>

          <FreeFadeIn delay={0.3}>
            <div className="relative group w-full">
              <textarea rows={4} className="w-full bg-transparent border-b border-slate-700 py-4 text-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 hover:border-orange-500/50 hover:shadow-[0_15px_20px_-10px_rgba(249,115,22,0.15)] font-light transition-all resize-none" placeholder="Message" />
            </div>
          </FreeFadeIn>

          <FreeFadeIn delay={0.4}>
            {/* ROCKET LAUNCH BUTTON HOVER */}
            <button type="submit" className="group/btn relative mt-4 font-mono text-sm uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors overflow-hidden py-2 px-1">
              <span className="relative z-10 flex items-center gap-3 transition-transform duration-500 group-hover/btn:-translate-y-12">
                <Rocket size={16} /> SEND MESSAGE
              </span>
              <span className="absolute inset-0 z-10 flex items-center gap-3 translate-y-12 group-hover/btn:translate-y-0 transition-transform duration-500 text-orange-400">
                <Rocket size={16} className="animate-bounce drop-shadow-[0_5px_5px_rgba(249,115,22,1)]" /> LIFT OFF
              </span>
            </button>
          </FreeFadeIn>
        </form>
      </div>

      <footer className="mt-32 w-full border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center font-mono text-xs text-slate-600 gap-4">
        <p>© {new Date().getFullYear()} {personal.name}. All Rights Reserved.</p>
        <a href={`mailto:${socials.email}`} className="hover:text-orange-500 hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] transition-all flex items-center gap-2">
          <Mail size={12}/> {socials.email}
        </a>
      </footer>
    </section>
  );
}