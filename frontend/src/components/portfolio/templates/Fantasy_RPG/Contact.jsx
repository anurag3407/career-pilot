import React, { useRef, useEffect, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { Mail, Send, Github, Linkedin, Twitter, MapPin } from 'lucide-react';

export default function Contact() {
  const { portfolioData } = usePortfolio();
  const data = portfolioData?.contact || {};
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [summoning, setSummoning] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSummon = (e) => {
    e.preventDefault();
    setSummoning(true);
    setTimeout(() => {
      setSummoning(false);
      alert("A raven has been dispatched to the intended recipient.");
    }, 2000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`relative min-h-screen w-full bg-[#0a090e] text-amber-100/90 py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-amber-900/60 overflow-hidden select-none transition-all duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#201910_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-45" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="flex items-center gap-4 mb-3">
            <Mail className="w-7 h-7 text-amber-500 animate-pulse" />
            <span className="font-fantasy-game text-sm text-amber-400 tracking-widest uppercase bg-amber-950/40 px-4 py-1.5 border border-amber-800/60 rounded">
              COMMUNICATION
            </span>
            <Mail className="w-7 h-7 text-amber-500 animate-pulse" />
          </div>

          <h2 className="font-fantasy-title text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 tracking-wider my-2 uppercase select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            SEND A RAVEN
          </h2>

          <p className="font-fantasy-game text-base md:text-lg text-amber-500/80 max-w-2xl tracking-wide uppercase mt-1">
            ESTABLISH A MAGICAL LINK
          </p>

          <div className="w-64 h-3 flex items-center justify-center gap-2 mt-4 text-amber-600/40">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent to-amber-700/40" />
            <span className="text-amber-500/60 font-fantasy-game">✦</span>
            <div className="w-full h-0.5 bg-gradient-to-l from-transparent to-amber-700/40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
          {/* Scroll / Form */}
          <div className="bg-[#121118]/90 border border-[#302718] p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative gold-border-glow">
            <div className="metal-corner-tl" />
            <div className="metal-corner-tr" />
            <div className="metal-corner-bl" />
            <div className="metal-corner-br" />

            <h3 className="font-fantasy-title text-xl font-bold text-amber-200 uppercase mb-6 text-center border-b border-amber-900/40 pb-4">
              Parchment of Inquiry
            </h3>

            <form onSubmit={handleSummon} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="font-fantasy-game text-[10px] text-amber-500 tracking-widest uppercase">Your Name (Title Optional)</label>
                <input 
                  type="text" 
                  required
                  className="bg-black/60 border border-amber-900/60 text-amber-100 px-4 py-2.5 rounded focus:outline-none focus:border-amber-500 font-fantasy-body text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  placeholder="Lord / Lady..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-fantasy-game text-[10px] text-amber-500 tracking-widest uppercase">Magical Address (Email)</label>
                <input 
                  type="email" 
                  required
                  className="bg-black/60 border border-amber-900/60 text-amber-100 px-4 py-2.5 rounded focus:outline-none focus:border-amber-500 font-fantasy-body text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  placeholder="name@realm.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-fantasy-game text-[10px] text-amber-500 tracking-widest uppercase">The Message</label>
                <textarea 
                  required
                  rows={4}
                  className="bg-black/60 border border-amber-900/60 text-amber-100 px-4 py-2.5 rounded focus:outline-none focus:border-amber-500 font-fantasy-body text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] resize-none"
                  placeholder="Write your missive here..."
                />
              </div>

              <button 
                type="submit"
                disabled={summoning}
                className="mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-b from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 text-amber-100 font-fantasy-game text-xs font-bold border border-amber-500/60 rounded shadow-[inset_0_1px_4px_rgba(255,255,255,0.2)] hover:text-amber-200 transition-all cursor-pointer uppercase tracking-widest"
              >
                {summoning ? (
                  <span className="animate-pulse">Casting Spell...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Dispatch Raven
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Socials / Direct Link */}
          <div className="flex flex-col justify-center">
            <div className="bg-[#18161f]/80 border border-amber-900/30 rounded-xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-900/10 rounded-full blur-2xl" />
              <h3 className="font-fantasy-title text-lg font-bold text-amber-300 uppercase mb-2">
                Direct Channels
              </h3>
              <p className="font-fantasy-body text-xs text-amber-100/60 mb-6">
                Prefer not to use a raven? You can find me in these local taverns and guilds.
              </p>

              <div className="flex flex-col gap-4">
                {data.email && (
                  <a href={`mailto:${data.email}`} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 bg-amber-950/50 border border-amber-800/50 rounded flex items-center justify-center group-hover:border-amber-500 transition-colors">
                      <Mail className="w-5 h-5 text-amber-500 group-hover:text-amber-300" />
                    </div>
                    <div className="font-fantasy-game text-xs text-amber-100/80 group-hover:text-amber-300 transition-colors uppercase tracking-wider">
                      {data.email}
                    </div>
                  </a>
                )}
                
                {data.location && (
                  <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-amber-950/50 border border-amber-800/50 rounded flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="font-fantasy-game text-xs text-amber-100/80 uppercase tracking-wider">
                      {data.location}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {data.social && (
              <div className="flex flex-col items-center">
                <span className="font-fantasy-game text-[10px] text-amber-500/60 tracking-widest uppercase mb-4">
                  Guild Memberships
                </span>
                <div className="flex gap-4">
                  {data.social.github && (
                    <a href={data.social.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-black/60 border border-amber-900/60 hover:border-amber-500 text-amber-400 hover:text-amber-200 rounded transition-all">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {data.social.linkedin && (
                    <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-black/60 border border-amber-900/60 hover:border-amber-500 text-amber-400 hover:text-amber-200 rounded transition-all">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {data.social.twitter && (
                    <a href={data.social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-black/60 border border-amber-900/60 hover:border-amber-500 text-amber-400 hover:text-amber-200 rounded transition-all">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
