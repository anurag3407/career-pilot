import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Linkedin, Twitter, Github, Send, Briefcase, ChevronRight } from 'lucide-react';
import dummyData from '../../../../data/dummy_data.json';

/* ──────────────────────────────────────────────────────────────
   Finance Theme Background
────────────────────────────────────────────────────────────── */
const BackgroundGlow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div 
      className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
      style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)' }}
    />
    <div 
      className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.07] blur-[150px]"
      style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
    />
    {/* Subtle ascending trendline watermark for Finance Corporate feel */}
    <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center">
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 350 L 200 300 L 350 320 L 500 200 L 700 220 L 900 50 L 1000 10" stroke="#0ea5e9" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M0 400 L 0 350 L 200 300 L 350 320 L 500 200 L 700 220 L 900 50 L 1000 10 L 1000 400 Z" fill="url(#trend-gradient)" />
        <defs>
          <linearGradient id="trend-gradient" x1="500" y1="0" x2="500" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0ea5e9" stopOpacity="1" />
            <stop offset="1" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
);

export default function Contact() {
  const { socials, personal } = dummyData;
  const [hoveredInput, setHoveredInput] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <section 
      id="contact" 
      className="relative min-h-screen flex items-center justify-center py-24 px-6 lg:px-8 overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #050b14 0%, #0a1128 100%)' }}
    >
      <BackgroundGlow />

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase border border-sky-500/30 text-sky-400 bg-sky-500/10">
            <Briefcase className="w-3.5 h-3.5" />
            Corporate Inquiries
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Initiate a <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Partnership</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ready to scale your enterprise infrastructure? Connect with our strategic advisory team to discuss bespoke solutions tailored to your market objectives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Info Panel */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            <div 
              className="relative p-8 md:p-10 rounded-3xl border border-slate-700/50 overflow-hidden"
              style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl" />
              
              <h3 className="text-2xl font-bold text-white mb-8">Executive Contact</h3>
              
              <div className="space-y-8">
                {[
                  { icon: Mail, label: 'Secure Email', value: socials.email, href: `mailto:${socials.email}` },
                  { icon: Phone, label: 'Direct Line', value: '+1 (555) 019-8273', href: 'tel:+15550198273' },
                  { icon: MapPin, label: 'Global Headquarters', value: personal.location, href: '#' }
                ].map((item, idx) => (
                  <motion.a
                    key={idx}
                    href={item.href}
                    className="group flex items-start gap-5 cursor-pointer"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700 text-sky-400 group-hover:bg-sky-500/20 group-hover:border-sky-500/50 transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{item.label}</p>
                      <p className="text-base text-slate-200 group-hover:text-white transition-colors">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800 flex items-center gap-4">
                {[
                  { icon: Linkedin, href: socials.linkedin },
                  { icon: Twitter, href: socials.twitter },
                  { icon: Github, href: socials.github }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Micro-interaction badge */}
            <motion.div 
              className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <p className="text-sm text-emerald-400/90 font-medium">Currently accepting new corporate clients for Q3</p>
            </motion.div>
          </motion.div>

          {/* Form Panel */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-7"
          >
            <div 
              className="p-8 md:p-10 rounded-3xl border border-slate-700/50 relative overflow-hidden"
              style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(20px)' }}
            >
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="relative">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 ml-1">Full Name</label>
                    <motion.div
                      animate={{ 
                        borderColor: hoveredInput === 'name' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(51, 65, 85, 0.8)',
                        boxShadow: hoveredInput === 'name' ? '0 0 15px rgba(56, 189, 248, 0.1)' : 'none'
                      }}
                      className="border rounded-xl bg-slate-900/50 overflow-hidden transition-colors"
                    >
                      <input 
                        type="text" 
                        onFocus={() => setHoveredInput('name')}
                        onBlur={() => setHoveredInput(null)}
                        className="w-full px-5 py-4 bg-transparent text-slate-200 placeholder-slate-600 outline-none"
                        placeholder="John Doe"
                      />
                    </motion.div>
                  </div>

                  {/* Company Input */}
                  <div className="relative">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 ml-1">Organization</label>
                    <motion.div
                      animate={{ 
                        borderColor: hoveredInput === 'company' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(51, 65, 85, 0.8)',
                        boxShadow: hoveredInput === 'company' ? '0 0 15px rgba(56, 189, 248, 0.1)' : 'none'
                      }}
                      className="border rounded-xl bg-slate-900/50 overflow-hidden transition-colors"
                    >
                      <input 
                        type="text" 
                        onFocus={() => setHoveredInput('company')}
                        onBlur={() => setHoveredInput(null)}
                        className="w-full px-5 py-4 bg-transparent text-slate-200 placeholder-slate-600 outline-none"
                        placeholder="Acme Corp"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 ml-1">Work Email</label>
                  <motion.div
                    animate={{ 
                      borderColor: hoveredInput === 'email' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(51, 65, 85, 0.8)',
                      boxShadow: hoveredInput === 'email' ? '0 0 15px rgba(56, 189, 248, 0.1)' : 'none'
                    }}
                    className="border rounded-xl bg-slate-900/50 overflow-hidden transition-colors"
                  >
                    <input 
                      type="email" 
                      onFocus={() => setHoveredInput('email')}
                      onBlur={() => setHoveredInput(null)}
                      className="w-full px-5 py-4 bg-transparent text-slate-200 placeholder-slate-600 outline-none"
                      placeholder="john@acme.com"
                    />
                  </motion.div>
                </div>

                {/* Message Input */}
                <div className="relative">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 ml-1">Proposal Details</label>
                  <motion.div
                    animate={{ 
                      borderColor: hoveredInput === 'message' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(51, 65, 85, 0.8)',
                      boxShadow: hoveredInput === 'message' ? '0 0 15px rgba(56, 189, 248, 0.1)' : 'none'
                    }}
                    className="border rounded-xl bg-slate-900/50 overflow-hidden transition-colors"
                  >
                    <textarea 
                      onFocus={() => setHoveredInput('message')}
                      onBlur={() => setHoveredInput(null)}
                      rows="4"
                      className="w-full px-5 py-4 bg-transparent text-slate-200 placeholder-slate-600 outline-none resize-none"
                      placeholder="Detail your objectives and timeline..."
                    ></textarea>
                  </motion.div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full group relative flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-slate-900 overflow-hidden"
                  style={{ background: 'linear-gradient(90deg, #38bdf8, #34d399)' }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  <span className="relative z-10">Transmit Request</span>
                  <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
