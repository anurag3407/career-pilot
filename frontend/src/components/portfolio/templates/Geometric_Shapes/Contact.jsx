import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal) return null;

  return (
    <section id="contact" className="relative w-full overflow-hidden bg-[#050816] py-24 px-6 sm:px-8 lg:px-12 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:84px_84px] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(244,114,182,0.15),transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.34em] text-pink-100/90 backdrop-blur-md mb-6">
            <MessageCircle size={14} className="text-pink-300" />
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-300">Connect</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md h-full">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                Whether you have a question, a project proposal, or just want to say hi, I'll try my best to get back to you!
              </p>

              <div className="space-y-6">
                {personal.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-pink-400/30 bg-pink-400/10 flex items-center justify-center text-pink-300">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400">Email</p>
                      <a href={`mailto:${personal.email}`} className="text-white hover:text-pink-300 transition-colors font-medium">
                        {personal.email}
                      </a>
                    </div>
                  </div>
                )}

                {personal.phone && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-purple-400/30 bg-purple-400/10 flex items-center justify-center text-purple-300">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400">Phone</p>
                      <a href={`tel:${personal.phone}`} className="text-white hover:text-purple-300 transition-colors font-medium">
                        {personal.phone}
                      </a>
                    </div>
                  </div>
                )}

                {personal.location && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-indigo-400/30 bg-indigo-400/10 flex items-center justify-center text-indigo-300">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400">Location</p>
                      <p className="text-white font-medium">{personal.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Form placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form className="p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md space-y-6" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Your Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Your Email</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">Message</label>
                <textarea 
                  rows="4" 
                  placeholder="Hello, let's work together..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-pink-400/50 transition-colors resize-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 hover:from-pink-400 to-purple-500 hover:to-purple-400 text-white font-bold py-4 rounded-xl transition-all"
              >
                Send Message <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
