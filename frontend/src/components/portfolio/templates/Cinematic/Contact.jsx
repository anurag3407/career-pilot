import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact({ data }) {
  const contact = data?.contact || data?.personal || {};

  return (
    <section className="relative w-full py-32 bg-[#050505] text-white font-sans selection:bg-neutral-800 border-t border-neutral-900 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/10 via-[#050505] to-[#050505] z-0"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center animate-cinematic">
          <p className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-neutral-500 uppercase mb-4 flex items-center gap-3">
            <Send size={14} className="text-neutral-600" /> Get in Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 drop-shadow-lg">
            Box Office
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          
          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-widest text-neutral-100 mb-6 border-b border-neutral-800 pb-4">
                Booking Inquiries
              </h3>
              <p className="text-neutral-400 font-serif italic text-sm leading-relaxed mb-8">
                Ready to start production on your next big idea? Reach out to discuss collaborations, directing opportunities, or technical roles.
              </p>
            </div>

            <div className="space-y-6">
              {(contact.email || contact.emailAddress) && (
                <a href={`mailto:${contact.email || contact.emailAddress}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500 rounded-sm">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-mono tracking-widest text-neutral-400 group-hover:text-white transition-colors duration-500">
                    {contact.email || contact.emailAddress}
                  </span>
                </a>
              )}

              {(contact.phone || contact.phoneNumber) && (
                <a href={`tel:${contact.phone || contact.phoneNumber}`} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500 rounded-sm">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm font-mono tracking-widest text-neutral-400 group-hover:text-white transition-colors duration-500">
                    {contact.phone || contact.phoneNumber}
                  </span>
                </a>
              )}

              {(contact.location || contact.city) && (
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-500 rounded-sm">
                    <MapPin size={16} />
                  </div>
                  <span className="text-sm font-mono tracking-widest text-neutral-400 group-hover:text-white transition-colors duration-500">
                    {contact.location || contact.city} {contact.country && `, ${contact.country}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-[#080808] border border-neutral-800 p-8 flex flex-col gap-6 relative overflow-hidden rounded-sm" onSubmit={(e) => e.preventDefault()}>
            {/* Grain */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
            
            <div className="relative z-10 flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Name</label>
              <input type="text" placeholder="John Doe" className="bg-transparent border-b border-neutral-800 pb-2 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono" />
            </div>

            <div className="relative z-10 flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Email</label>
              <input type="email" placeholder="john@example.com" className="bg-transparent border-b border-neutral-800 pb-2 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono" />
            </div>

            <div className="relative z-10 flex flex-col gap-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Message</label>
              <textarea rows="4" placeholder="Your script goes here..." className="bg-transparent border-b border-neutral-800 pb-2 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono resize-none"></textarea>
            </div>

            <button type="submit" className="relative z-10 group mt-4 flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs sm:text-sm rounded-sm hover:bg-neutral-200 transition-all duration-500 overflow-hidden w-full">
              <div className="absolute inset-0 bg-neutral-900/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <span className="relative z-10">Send Message</span>
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}
