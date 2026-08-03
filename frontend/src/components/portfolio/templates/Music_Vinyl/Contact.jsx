import React from 'react';
import { Mail, Phone, MapPin, Send, Headphones, Github, Linkedin, Twitter, Link2, Instagram } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal && (!socials || socials.length === 0)) return null;

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
  };

  return (
    <section className="w-full bg-gradient-to-t from-[#0a0502] to-[#1a0f0a] text-amber-50 py-20 px-4 sm:px-8 md:px-12 lg:px-20 font-serif border-t border-amber-900/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center space-x-3 text-amber-500 mb-16">
          <Headphones className="w-8 h-8" />
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-widest text-amber-100">Bookings & Inquiries</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#1a110a] p-8 md:p-12 rounded-2xl border border-amber-900/40 shadow-2xl relative overflow-hidden">
          {/* Decorative Vinyl Edge */}
          <div className="absolute -right-32 -top-32 w-64 h-64 rounded-full border-[16px] border-[#0a0502] bg-[#1a110a] opacity-50 z-0"></div>

          {/* Contact Form side */}
          <div className="relative z-10 space-y-6">
            <h3 className="text-2xl font-bold text-amber-100 mb-6">Drop a Demo</h3>
            <form className="space-y-4 font-sans" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-500/80 mb-2">Artist Name</label>
                <input 
                  type="text" 
                  className="w-full bg-[#0a0502] border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-500/80 mb-2">Frequency (Email)</label>
                <input 
                  type="email" 
                  className="w-full bg-[#0a0502] border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-500/80 mb-2">The Mix (Message)</label>
                <textarea 
                  rows="4"
                  className="w-full bg-[#0a0502] border border-amber-900/50 rounded-lg px-4 py-3 text-amber-100 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  placeholder="What's on your mind?"
                ></textarea>
              </div>
              <button type="button" className="w-full bg-amber-600 hover:bg-amber-500 text-[#0a0502] font-bold uppercase tracking-widest py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                <span>Send Track</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="relative z-10 flex flex-col justify-between">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-amber-100 mb-6">Studio Info</h3>
              
              {personal?.email && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center shrink-0 border border-amber-900/50">
                    <Mail className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-amber-500/80 font-mono mb-1">Email</p>
                    <a href={`mailto:${personal.email}`} className="text-amber-100 hover:text-amber-400 font-sans transition-colors">
                      {personal.email}
                    </a>
                  </div>
                </div>
              )}

              {personal?.phone && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center shrink-0 border border-amber-900/50">
                    <Phone className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-amber-500/80 font-mono mb-1">Direct Line</p>
                    <p className="text-amber-100 font-sans">
                      {personal.phone}
                    </p>
                  </div>
                </div>
              )}

              {personal?.location && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center shrink-0 border border-amber-900/50">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-amber-500/80 font-mono mb-1">Base</p>
                    <p className="text-amber-100 font-sans">
                      {personal.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {socials && socials.length > 0 && (
              <div className="mt-12 pt-8 border-t border-amber-900/40">
                <p className="text-xs uppercase tracking-widest text-amber-500/80 font-mono mb-4">Record Labels (Socials)</p>
                <div className="flex flex-wrap gap-4">
                  {socials.map((social, i) => {
                    const Icon = socialIcons[social.platform?.toLowerCase()] || Link2;
                    return (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-[#0a0502] border border-amber-900/50 flex items-center justify-center text-amber-500 hover:text-amber-400 hover:border-amber-500 transition-all hover:-translate-y-1"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
