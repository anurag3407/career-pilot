import React from 'react';
import { Send, Heart, MapPin, Mail } from 'lucide-react';

export default function Contact({ personal, socials }) {
  const socialsArray = socials
    ? (Array.isArray(socials)
      ? socials
      : Object.entries(socials)
          .filter(([_, url]) => !!url)
          .map(([platform, url]) => ({
            platform: platform.charAt(0).toUpperCase() + platform.slice(1),
            url: url
          }))
      )
    : [];

  return (
    <>
      <style>{`
        .sb-body  { font-family: 'Patrick Hand', cursive; }
        .sb-hand  { font-family: 'Caveat', cursive; }
        .sb-marker{ font-family: 'Permanent Marker', cursive; }
        .stamp-border { border: 4px dashed #e2e8f0; }
      `}</style>
      <section className="relative w-full py-24 px-4 sm:px-8 bg-[#2d2a26] overflow-hidden flex justify-center items-center">
        {/* Chalkboard / Dark Paper texture */}
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="max-w-4xl w-full relative z-10 transform rotate-[1deg] hover:rotate-0 transition-transform duration-500">
          
          {/* Tape */}
          <div className="absolute -top-4 left-10 w-32 h-8 bg-yellow-200/55 backdrop-blur-sm -rotate-3 z-20 mix-blend-screen" />
          <div className="absolute -bottom-4 right-10 w-32 h-8 bg-yellow-200/55 backdrop-blur-sm -rotate-3 z-20 mix-blend-screen" />

          {/* Postcard */}
          <div className="bg-[#fffdf5] w-full rounded-sm shadow-[8px_16px_32px_rgba(0,0,0,0.5)] border-[1.5px] border-[#d4b896] flex flex-col md:flex-row overflow-hidden relative">
            
            {/* Postcard divider */}
            <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-[#d4b896] border-l border-dashed border-[#c4a882]" />

            {/* Left Side: Message */}
            <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col">
               <h2 className="sb-marker text-4xl text-[#2d1f0e] mb-8">Drop a line! ✍️</h2>
               <form className="space-y-6 flex-grow flex flex-col" onSubmit={(e) => e.preventDefault()}>
                 <div>
                   <label className="sb-body text-[#a07850] block mb-1">Dear,</label>
                   <input type="text" placeholder="Your Name" className="w-full bg-transparent border-b-[1.5px] border-[#d4b896] focus:border-[#e05a3a] outline-none sb-hand text-[22px] text-[#4a3828] px-2 py-1 placeholder-[#d4b896]" />
                 </div>
                 <div>
                   <label className="sb-body text-[#a07850] block mb-1">Return Address:</label>
                   <input type="email" placeholder="Email" className="w-full bg-transparent border-b-[1.5px] border-[#d4b896] focus:border-[#e05a3a] outline-none sb-hand text-[22px] text-[#4a3828] px-2 py-1 placeholder-[#d4b896]" />
                 </div>
                 <div className="flex-grow">
                   <label className="sb-body text-[#a07850] block mb-1">Message:</label>
                   <textarea placeholder="Write something nice..." rows="3" className="w-full bg-transparent border-b-[1.5px] border-[#d4b896] focus:border-[#e05a3a] outline-none sb-hand text-[22px] text-[#4a3828] px-2 py-1 resize-none placeholder-[#d4b896]" />
                 </div>
                 <button className="flex items-center gap-2 sb-marker text-xl bg-[#2d1f0e] text-[#fffdf5] px-6 py-3 hover:bg-[#e05a3a] transition-colors transform hover:-rotate-2 w-fit mt-4 shadow-[3px_3px_0px_rgba(224,90,58,0.5)] border border-[#2d1f0e]">
                   <Send size={20} /> Send Mail
                 </button>
               </form>
            </div>

            {/* Right Side: Stamp & Address */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
              <div className="flex justify-end w-full mb-8">
                {/* Stamp */}
                <div className="w-20 h-24 bg-rose-50 stamp-border flex flex-col items-center justify-center p-2 rotate-6 shadow-sm">
                  <Heart className="text-rose-400 mb-1" size={24} fill="currentColor" />
                  <span className="sb-marker text-[10px] text-[#4a3828]">FIRST CLASS</span>
                </div>
              </div>

              {/* Address Lines */}
              <div className="w-full space-y-8 mt-4 flex-grow">
                <div className="border-b-[1.5px] border-[#d4b896] pb-1">
                  <span className="sb-hand text-3xl font-bold text-[#2d1f0e]">{personal?.name || 'Alexander Jordan'}</span>
                </div>
                <div className="border-b-[1.5px] border-[#d4b896] pb-1 flex items-center gap-2">
                  <Mail size={18} className="text-[#a07850]" />
                  <span className="sb-hand text-[24px] text-[#4a3828]">{personal?.email || 'hello@example.com'}</span>
                </div>
                <div className="border-b-[1.5px] border-[#d4b896] pb-1 flex flex-wrap gap-4 items-center">
                  {socialsArray.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer" className="sb-hand text-[22px] text-[#3f51b5] hover:text-[#e05a3a] font-bold">
                      {s.platform}
                    </a>
                  ))}
                  {socialsArray.length === 0 && (
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-[#a07850]" />
                      <span className="sb-hand text-[24px] text-[#4a3828]">{personal?.location || 'San Francisco, CA'}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex justify-start">
                 <div className="w-24 h-24 rounded-full border-[3px] border-rose-400/60 flex items-center justify-center -rotate-12 opacity-70 mix-blend-multiply">
                   <div className="w-[88px] h-[88px] rounded-full border border-rose-400/40 flex items-center justify-center">
                     <span className="sb-marker text-[14px] text-rose-500/80 -rotate-[10deg]">APPROVED</span>
                   </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
