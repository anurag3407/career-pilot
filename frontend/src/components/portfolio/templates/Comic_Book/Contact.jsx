import React from 'react';
import { Send, Mail, MapPin } from 'lucide-react';

const DotPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="comic-dots-contact" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="2.5" fill="black" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#comic-dots-contact)" />
  </svg>
);

const SpeechBubble = ({ text }) => (
  <div className="relative inline-block">
    <div className="bg-white border-4 border-black px-6 py-3 rounded-2xl font-black text-black uppercase text-lg tracking-widest shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
      {text}
    </div>
    <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-[14px] border-l-transparent border-t-[18px] border-t-black border-r-[0px] border-r-transparent" />
    <div className="absolute -bottom-[13px] left-[35px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[14px] border-t-white border-r-[0px] border-r-transparent" />
  </div>
);

export default function Contact({ personal, socials }) {
  return (
    <section id="contact" className="relative w-full overflow-hidden bg-yellow-400 py-20 px-4 sm:px-8 border-b-4 border-black">
      <DotPattern />
      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-6 mb-16 text-center">
          <div className="relative inline-block">
            <h2 className="relative z-10 text-5xl sm:text-7xl font-black uppercase text-black tracking-tighter -rotate-1 drop-shadow-[6px_6px_0px_rgba(255,255,255,1)]">
              Summon Me
            </h2>
            <div className="absolute -bottom-2 left-0 w-full h-4 bg-red-500 border-2 border-black -rotate-1 -z-0" />
          </div>
          <div className="mt-6 rotate-1">
            <SpeechBubble text="🦇 Shine the signal!" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="font-black uppercase text-black text-lg tracking-wider">Alias</label>
                <input type="text" placeholder="Clark Kent" className="w-full border-4 border-black p-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-sky-400 bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-black uppercase text-black text-lg tracking-wider">Secure Frequency</label>
                <input type="email" placeholder="super@dailyplanet.com" className="w-full border-4 border-black p-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-sky-400 bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-black uppercase text-black text-lg tracking-wider">Transmission</label>
                <textarea rows={4} placeholder="We need your help!" className="w-full border-4 border-black p-4 font-bold text-black focus:outline-none focus:ring-4 focus:ring-sky-400 bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] resize-none" />
              </div>
              <button className="bg-red-500 hover:bg-red-600 text-white font-black uppercase text-xl px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex justify-center items-center gap-3">
                <Send className="w-6 h-6" /> Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-8 justify-center">
            {personal?.email && (
              <div className="bg-sky-400 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1 flex items-center gap-4 hover:scale-105 transition-transform">
                <div className="bg-white border-4 border-black p-3 rounded-full">
                  <Mail className="w-8 h-8 text-black" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-black text-black uppercase text-xl">Email</h3>
                  <a href={`mailto:${personal.email}`} className="font-bold text-gray-900 truncate block">{personal.email}</a>
                </div>
              </div>
            )}
            
            {personal?.location && (
              <div className="bg-green-400 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-2 flex items-center gap-4 hover:scale-105 transition-transform">
                <div className="bg-white border-4 border-black p-3 rounded-full">
                  <MapPin className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="font-black text-black uppercase text-xl">Headquarters</h3>
                  <p className="font-bold text-gray-900">{personal.location}</p>
                </div>
              </div>
            )}

            {socials && Object.entries(socials).map(([platform, url], i) => {
              if (!url || typeof url !== 'string' || !url.startsWith('http')) return null;
              const bgColors = ["bg-pink-400", "bg-purple-400", "bg-orange-400"];
              const color = bgColors[i % bgColors.length];
              const rotation = i % 2 === 0 ? "rotate-2" : "-rotate-1";
              
              return (
                <div key={platform} className={`${color} border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${rotation} flex items-center gap-4 hover:scale-105 transition-transform`}>
                  <div className="bg-white border-4 border-black p-3 rounded-full">
                    <Send className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h3 className="font-black text-black uppercase text-xl">{platform}</h3>
                    <a href={url} target="_blank" rel="noreferrer" className="font-bold text-gray-900 underline decoration-black decoration-2">Access Portal</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
