import React from 'react';
import { Mail, MapPin, Phone, ExternalLink } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal && (!socials || socials.length === 0)) return null;

  return (
    <section className="py-16 px-6 border-t border-white/10 relative z-10" id="contact">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 mb-2">
            Get In Touch
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            
            <div className="space-y-4">
              {personal?.email && (
                <a href={`mailto:${personal.email}`} className="flex items-center space-x-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group">
                  <div className="p-3 rounded-full bg-black/40 border border-white/5 group-hover:border-cyan-500/50 transition-colors">
                    <Mail className="w-5 h-5 text-gray-300 group-hover:text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Email</p>
                    <p className="font-medium">{personal.email}</p>
                  </div>
                </a>
              )}

              {personal?.phone && (
                <a href={`tel:${personal.phone}`} className="flex items-center space-x-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group">
                  <div className="p-3 rounded-full bg-black/40 border border-white/5 group-hover:border-purple-500/50 transition-colors">
                    <Phone className="w-5 h-5 text-gray-300 group-hover:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Phone</p>
                    <p className="font-medium">{personal.phone}</p>
                  </div>
                </a>
              )}

              {personal?.location && (
                <div className="flex items-center space-x-4 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="p-3 rounded-full bg-black/40 border border-white/5">
                    <MapPin className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Location</p>
                    <p className="font-medium">{personal.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Socials */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6">Social Profiles</h3>
            
            {socials && socials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:bg-white/10 transition-all group"
                  >
                    <span className="font-medium text-gray-200 group-hover:text-white">{social.platform}</span>
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-center">
                <p className="opacity-60 text-sm">No social profiles added yet.</p>
              </div>
            )}

            {/* Optional Form Placeholder styled nicely */}
            <div className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <p className="text-sm opacity-70 mb-4">Send a message directly:</p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50 text-sm"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50 text-sm"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows="3"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50 text-sm resize-none"
                ></textarea>
                <button 
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-2 rounded-lg transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
