import React from 'react';
import { Mail, MapPin, Clock, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="h-px w-12 bg-[#c5a880]" />
      <div className="w-2 h-2 rotate-45 bg-[#c5a880]" />
      <div className="h-px w-12 bg-[#c5a880]" />
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="block text-center text-[10px] font-medium tracking-[0.25em] uppercase text-[#c5a880] mb-4">
      {children}
    </span>
  );
}

const getSocialIcon = (platform) => {
  if (!platform) return <Mail className="w-4 h-4" />;
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
  if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4" />;
  if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
  if (p.includes('github')) return <Github className="w-4 h-4" />;
  return <Mail className="w-4 h-4" />;
};

export default function Contact({ personal, socials }) {
  return (
    <section className="w-full bg-[#0d0d0d] text-white py-24 lg:py-32 border-t border-[#1a1a1a] relative overflow-hidden">
      
      {/* Background visual */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c5a880]/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <GoldDivider />
          <Eyebrow>Join the Table</Eyebrow>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide text-white">
            Make a Reservation
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Left Details */}
          <div className="lg:col-span-2 space-y-10 z-10">
            <div>
              <h3 className="font-serif text-2xl mb-6 text-[#c5a880]">Inquiries</h3>
              <p className="text-gray-400 font-light mb-8 leading-relaxed">
                For private dining, event catering, or media inquiries, please reach out to our management team. We aim to respond within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-[#222] bg-[#111] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#c5a880]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Email</p>
                  <p className="font-serif text-lg text-gray-200">{personal?.email || 'chef@example.com'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-[#222] bg-[#111] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#c5a880]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Location</p>
                  <p className="font-serif text-lg text-gray-200">{personal?.location || 'Paris, France'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border border-[#222] bg-[#111] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-[#c5a880]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Service Hours</p>
                  <p className="font-serif text-lg text-gray-200">Tue - Sun: 17:00 - 23:00</p>
                </div>
              </div>
            </div>

            {socials && socials.length > 0 && (
              <div className="pt-8 border-t border-[#222]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Follow the Journey</p>
                <div className="flex gap-4">
                  {socials.map((social, i) => (
                    <a 
                      key={i} 
                      href={social.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 border border-[#222] bg-[#111] hover:border-[#c5a880] hover:bg-[#c5a880]/10 flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-[#c5a880]"
                    >
                      <span className="sr-only">{social.platform}</span>
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Form */}
          <div className="lg:col-span-3 z-10">
            <div className="bg-[#111] border border-[#222] p-8 md:p-12 relative overflow-hidden">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#c5a880]/30" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#c5a880]/30" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#c5a880]/30" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#c5a880]/30" />

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-transparent border-b border-[#333] px-0 py-3 text-white font-serif focus:outline-none focus:border-[#c5a880] transition-colors"
                      placeholder="Monsieur / Madame"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-transparent border-b border-[#333] px-0 py-3 text-white font-serif focus:outline-none focus:border-[#c5a880] transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-transparent border-b border-[#333] px-0 py-3 text-gray-400 font-serif focus:outline-none focus:border-[#c5a880] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Guests</label>
                    <select className="w-full bg-transparent border-b border-[#333] px-0 py-3 text-gray-400 font-serif focus:outline-none focus:border-[#c5a880] transition-colors">
                      <option className="bg-[#111]">2 People</option>
                      <option className="bg-[#111]">3 People</option>
                      <option className="bg-[#111]">4 People</option>
                      <option className="bg-[#111]">5+ People</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Special Requirements</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-transparent border-b border-[#333] px-0 py-3 text-white font-serif focus:outline-none focus:border-[#c5a880] transition-colors resize-none"
                    placeholder="Allergies, celebrations..."
                  />
                </div>

                <div className="pt-6">
                  <button type="button" className="w-full py-4 bg-[#c5a880] hover:bg-[#d4b896] text-[#0a0a0a] font-bold text-sm tracking-[0.2em] uppercase transition-colors duration-300">
                    Request Booking
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
