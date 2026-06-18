import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

export default function Contact({ personal, socials }) {
  if (!personal && (!socials || socials.length === 0)) return null;

  return (
    <section className="py-20 px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4 tracking-tight">
            Initiate Contact
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Ready to start a new mission? Send a transmission across the galaxy and let's explore new possibilities together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-shadow duration-500"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
              Comms Channels
            </h3>
            
            <div className="space-y-6">
              {personal?.email && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${personal.email}`} className="text-white hover:text-cyan-400 transition-colors text-lg">
                      {personal.email}
                    </a>
                  </div>
                </div>
              )}
              
              {personal?.phone && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Secure Line</p>
                    <a href={`tel:${personal.phone}`} className="text-white hover:text-cyan-400 transition-colors text-lg">
                      {personal.phone}
                    </a>
                  </div>
                </div>
              )}

              {personal?.location && (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Coordinates</p>
                    <p className="text-white text-lg">{personal.location}</p>
                  </div>
                </div>
              )}
            </div>

            {socials && socials.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">Social Network</p>
                <div className="flex gap-4">
                  {socials.map((social, i) => {
                    const Icon = iconMap[social.platform?.toLowerCase()] || ExternalLink;
                    return (
                      <motion.a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -5, scale: 1.1 }}
                        className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/20 transition-all duration-300"
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Contact Form placeholder (Visual only, no backend) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-shadow duration-500"
          >
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
              Send Transmission
            </h3>
            
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Identifier</label>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Return Frequency</label>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest pl-1">Message Payload</label>
                <textarea 
                  rows={4}
                  placeholder="Your Message" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
                ></textarea>
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold tracking-widest uppercase text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-shadow"
              >
                Launch Transmission
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
