import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, ArrowRight } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal && !socials) return null;

  const socialIcons = {
    linkedin: <Linkedin className="w-5 h-5" />,
    github: <Github className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />
  };

  return (
    <section className="relative w-full bg-gray-950 text-white py-24 px-6 md:px-16 overflow-hidden border-t border-white/5">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Mail className="w-5 h-5" />
              <span className="text-xs tracking-widest uppercase">Connect</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Let's Discuss <br/>
              <span className="text-emerald-400">Opportunities</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-8 max-w-md">
              Whether you have a question, a project proposal, or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="space-y-6">
              {personal?.email && (
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Email</p>
                    <p className="font-medium text-white/90 group-hover:text-emerald-400 transition-colors">{personal.email}</p>
                  </div>
                </div>
              )}
              {personal?.phone && (
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Phone</p>
                    <p className="font-medium text-white/90 group-hover:text-emerald-400 transition-colors">{personal.phone}</p>
                  </div>
                </div>
              )}
              {personal?.location && (
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Location</p>
                    <p className="font-medium text-white/90 group-hover:text-emerald-400 transition-colors">{personal.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            {socials && socials.length > 0 && (
              <div className="mt-10 flex items-center gap-4 pt-8 border-t border-white/10">
                {socials.map((social, i) => (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
                  >
                    {socialIcons[social.platform.toLowerCase()] || <ArrowRight className="w-4 h-4" />}
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl pointer-events-none" />
            <form className="relative space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">First Name</label>
                  <input type="text" className="w-full bg-gray-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Last Name</label>
                  <input type="text" className="w-full bg-gray-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Email Address</label>
                <input type="email" className="w-full bg-gray-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all" placeholder="john@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Message</label>
                <textarea rows={4} className="w-full bg-gray-950/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-emerald-500 hover:bg-emerald-600 text-gray-950 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 group">
                Send Message
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
