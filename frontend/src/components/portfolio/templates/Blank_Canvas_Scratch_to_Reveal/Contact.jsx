import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from './PortfolioContext';
import { Mail, Github, Linkedin, Twitter, Send } from 'lucide-react';

export default function Contact() {
  const { personal, socials } = usePortfolio();

  const socialLinks = [
    { 
      href: socials.email ? `mailto:${socials.email}` : '#', 
      icon: <Mail className="w-5 h-5" />, 
      label: 'Email', 
      value: socials.email,
      color: 'hover:text-white hover:border-white/40' 
    },
    { 
      href: socials.github || '#', 
      icon: <Github className="w-5 h-5" />, 
      label: 'GitHub', 
      value: socials.github ? socials.github.replace('https://', '') : '',
      color: 'hover:text-slate-200 hover:border-slate-500/40' 
    },
    { 
      href: socials.linkedin || '#', 
      icon: <Linkedin className="w-5 h-5" />, 
      label: 'LinkedIn', 
      value: socials.linkedin ? socials.linkedin.replace('https://', '') : '',
      color: 'hover:text-white hover:border-white/40' 
    },
    { 
      href: socials.twitter || '#', 
      icon: <Twitter className="w-5 h-5" />, 
      label: 'Twitter', 
      value: socials.twitter ? socials.twitter.replace('https://', '') : '',
      color: 'hover:text-white hover:border-white/40' 
    }
  ].filter(link => link.href && link.href !== '#');

  return (
    <section 
      id="contact" 
      className="relative py-28 md:py-36 px-6 overflow-hidden bg-black"
    >
      {/* Background glowing canvas circle */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.01] rounded-t-full blur-[110px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">[[ 06 // Contact ]]</span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-7xl font-black font-outfit text-white tracking-tight leading-none mb-6 max-w-2xl bg-gradient-to-r from-white via-slate-355 to-slate-500 bg-clip-text text-transparent"
        >
          Let's Build Something Remarkable.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 max-w-lg mb-14 font-light text-sm md:text-base"
        >
          The canvas is clear, the story is revealed, and the next creation awaits. Reach out to collaborate or discuss a project.
        </motion.p>

        {/* Contact Deck */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 w-full text-left items-stretch mb-20">
          {/* Left: Contact Info */}
          <div className="md:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-outfit text-white mb-2">Connect</h3>
              <p className="text-xs font-light text-slate-400 leading-relaxed">
                Prefer direct channels? Click one of the details below to open external links.
              </p>
            </div>

            <div className="space-y-3">
              {socialLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3.5 p-3.5 bg-[#05050c]/85 border border-slate-900 rounded-xl transition-all duration-300 cursor-pointer ${link.color}`}
                >
                  <div className="text-slate-400 transition-colors group-hover:text-inherit shrink-0">
                    {link.icon}
                  </div>
                  <div className="overflow-hidden">
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wide">{link.label}</span>
                    <span className="block text-sm font-light truncate">{link.value}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Premium Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-7 p-6 bg-[#040409]/90 border border-slate-900 rounded-xl relative overflow-hidden"
          >
            {/* Fine rule grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:100%_2rem] pointer-events-none z-0" />

            <form onSubmit={(e) => e.preventDefault()} className="relative z-10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter name"
                    className="w-full bg-black border border-slate-900 hover:border-slate-850 focus:border-white/20 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="Enter email"
                    className="w-full bg-black border border-slate-900 hover:border-slate-850 focus:border-white/20 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1.5">Message</label>
                <textarea 
                  rows={4} 
                  required
                  placeholder="Describe your project or inquiry..."
                  className="w-full bg-black border border-slate-900 hover:border-slate-850 focus:border-white/20 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-650 focus:outline-none transition-all resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-white hover:bg-slate-200 text-black font-semibold text-sm rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="w-full pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs font-mono">
          <span>© {new Date().getFullYear()} {personal.name}. All rights reserved.</span>
          <span className="text-[10px] uppercase tracking-wider">Design // Blank Canvas</span>
        </div>
      </div>
    </section>
  );
}
