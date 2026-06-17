import React from 'react';
import { Mail, Phone, MapPin, ExternalLink, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal && (!socials || socials.length === 0)) return null;

  const renderIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'instagram': return <Instagram className="w-5 h-5 opacity-70" />;
      case 'twitter': return <Twitter className="w-5 h-5 opacity-70" />;
      case 'linkedin': return <Linkedin className="w-5 h-5 opacity-70" />;
      case 'github': return <Github className="w-5 h-5 opacity-70" />;
      default: return <ExternalLink className="w-5 h-5 opacity-70" />;
    }
  };

  return (
    <section className="py-24 px-6 border-t border-white/10 bg-black/30 backdrop-blur-md relative overflow-hidden">
      {/* Decorative background elements for a photography/lens vibe */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light tracking-wider uppercase mb-4">Get In Touch</h2>
          <div className="w-16 h-1 bg-white/20 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-8 border border-white/10 p-8 rounded-2xl bg-white/5 backdrop-blur-sm shadow-2xl">
            <h3 className="text-2xl font-light tracking-wide mb-6 uppercase">Contact Details</h3>
            {personal?.email && (
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <a href={`mailto:${personal.email}`} className="hover:opacity-80 transition-opacity text-lg tracking-wide font-light">
                  {personal.email}
                </a>
              </div>
            )}
            {personal?.phone && (
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-lg tracking-wide font-light">{personal.phone}</span>
              </div>
            )}
            {personal?.location && (
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-lg tracking-wide font-light">{personal.location}</span>
              </div>
            )}
          </div>

          <div className="space-y-8 border border-white/10 p-8 rounded-2xl bg-white/5 backdrop-blur-sm shadow-2xl flex flex-col justify-center">
            <h3 className="text-2xl font-light tracking-wide mb-2 uppercase">Social Networks</h3>
            <p className="opacity-60 font-light mb-6">Follow my photography journey and see my latest shots across the web.</p>
            <div className="flex flex-col gap-5">
              {socials && socials.map((social, i) => (
                <a 
                  key={i} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 hover:opacity-100 opacity-70 transition-opacity group w-fit"
                >
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white/20 transition-colors">
                    {renderIcon(social.platform)}
                  </div>
                  <span className="capitalize tracking-widest font-light">{social.platform}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
