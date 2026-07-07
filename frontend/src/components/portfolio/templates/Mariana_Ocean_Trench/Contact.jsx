import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Radio, Github, Linkedin, Terminal, ArrowUp, FileText } from 'lucide-react';

export default function Contact({ personal, socials }) {
  const [formState, setFormState] = useState('IDLE'); // IDLE, TRANSMITTING, SENT
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleTransmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setFormState('TRANSMITTING');
    setTimeout(() => {
      setFormState('SENT');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setFormState('IDLE'), 3500);
    }, 2000);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section 
      id="hadal-zone"
      className="relative w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#000814] via-[#00050a] to-[#000102] p-6 md:p-12 text-white overflow-hidden select-none"
    >
      {/* Hadal zone hydrothermal vent smoke effects and rock silhouettes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Rock formations at the bottom */}
        <div className="absolute bottom-0 left-0 w-[40%] h-32 bg-slate-950/80 blur-sm border-t border-slate-900 rounded-tr-full" />
        <div className="absolute bottom-0 right-0 w-[35%] h-24 bg-slate-950/80 blur-sm border-t border-slate-900 rounded-tl-full" />
        
        {/* Hydrothermal vents sending up warm neon cyan bubbles/fog */}
        <div className="absolute bottom-0 left-[15%] w-12 h-44 bg-gradient-to-t from-cyan-900/40 via-cyan-500/10 to-transparent blur-md transform origin-bottom animate-vent-plume" />
        <div className="absolute bottom-0 right-[25%] w-8 h-36 bg-gradient-to-t from-blue-900/30 via-blue-500/10 to-transparent blur-md transform origin-bottom animate-vent-plume" style={{ animationDelay: '3s' }} />

        {/* Small bioluminescent floor dots */}
        <div className="absolute bottom-6 left-[25%] w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_6px_#22d3ee]" />
        <div className="absolute bottom-16 left-[8%] w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_6px_#22d3ee] animation-delay-1000" />
        <div className="absolute bottom-10 right-[35%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_6px_#60a5fa] animation-delay-500" />
        <div className="absolute bottom-8 right-[12%] w-1 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_6px_#22d3ee] animation-delay-1500" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col gap-8 md:gap-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
          <Terminal className="w-8 h-8 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider font-mono">
              06 // HADAL_ZONE: TRENCH_FLOOR_TERMINAL
            </h2>
            <p className="text-xs text-cyan-500/80 font-mono mt-1">Status: Bottom Depth 10,994m reached | Pressure: 1,086 atm | System Uplink active</p>
          </div>
        </div>

        {/* Contact Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
          
          {/* Left Panel: Environment Specs & Coordinates */}
          <div className="lg:col-span-5 flex flex-col gap-6 font-mono text-xs">
            <div className="bg-slate-950/70 border border-cyan-500/20 p-5 rounded-xl shadow-lg flex flex-col gap-4 relative">
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/40" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/40" />

              <span className="text-[10px] text-cyan-500 tracking-wider font-bold uppercase border-b border-slate-900 pb-1.5">
                TERMINAL_PARAMETERS
              </span>
              
              <div className="flex flex-col gap-3 font-mono">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-cyan-500 mt-0.5" />
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest">TRANSMISSION_COORDINATES</div>
                    <div className="text-sm text-cyan-200 mt-0.5">{personal.location || "11.3733° N, 142.5917° E"}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-cyan-500 mt-0.5" />
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest">UPLINK_UBOX</div>
                    <div className="text-sm text-cyan-200 mt-0.5 break-all">{personal.email || "not-provided@system.net"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Uplinks panel */}
            <div className="bg-slate-950/70 border border-cyan-500/20 p-5 rounded-xl flex flex-col gap-3">
              <span className="text-[10px] text-cyan-500 tracking-wider font-bold uppercase border-b border-slate-900 pb-1.5 mb-1">
                SOCIAL_CHANNELS
              </span>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {socials?.github && (
                  <a 
                    href={socials.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 border border-cyan-900 bg-cyan-950/20 hover:border-cyan-400 hover:bg-cyan-900/40 rounded-lg transition-all text-cyan-300"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-[10px] tracking-wider uppercase">GITHUB</span>
                  </a>
                )}
                {socials?.linkedin && (
                  <a 
                    href={socials.linkedin} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 flex items-center justify-center gap-2 p-2.5 border border-cyan-900 bg-cyan-950/20 hover:border-cyan-400 hover:bg-cyan-900/40 rounded-lg transition-all text-cyan-300"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-[10px] tracking-wider uppercase">LINKEDIN</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Holographic Terminal Form */}
          <div className="lg:col-span-7 bg-slate-950/70 border border-cyan-500/20 p-6 rounded-2xl relative shadow-2xl flex flex-col">
            <div className="absolute top-2 right-4 font-mono text-[9px] text-cyan-600/80 tracking-widest uppercase">
              TRANSMITTER_MOD_U40
            </div>
            
            <h3 className="text-base font-bold font-mono text-cyan-300 mb-4 flex items-center gap-2 border-b border-slate-900 pb-2">
              <Radio className="w-4 h-4 animate-pulse text-cyan-400" />
              TRANSMIT_INCOMING_SIGNAL
            </h3>

            {formState === 'SENT' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center my-auto py-10 font-mono text-center gap-3 text-cyan-300"
              >
                <div className="w-12 h-12 rounded-full border-2 border-emerald-400 flex items-center justify-center animate-bounce">
                  <span className="text-emerald-400 font-bold">✓</span>
                </div>
                <h4 className="text-lg font-bold text-emerald-400">SIGNAL_TRANSMITTED</h4>
                <p className="text-xs text-cyan-500 max-w-sm">
                  Acoustic transmission success. The packet is rising through the ocean layers and will reach the developer shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleTransmit} className="flex flex-col gap-4 font-mono text-xs">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-cyan-500 uppercase text-[10px] tracking-wider font-bold">Sender Name</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ENTER_SENDER_NAME" 
                    disabled={formState === 'TRANSMITTING'}
                    className="bg-slate-900/60 border border-cyan-900 hover:border-cyan-700/60 focus:border-cyan-400 p-3 rounded-lg text-cyan-100 placeholder-cyan-900 outline-none transition-all focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-cyan-500 uppercase text-[10px] tracking-wider font-bold">Sender Coordinate (Email)</label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ENTER_SENDER_EMAIL" 
                    disabled={formState === 'TRANSMITTING'}
                    className="bg-slate-900/60 border border-cyan-900 hover:border-cyan-700/60 focus:border-cyan-400 p-3 rounded-lg text-cyan-100 placeholder-cyan-900 outline-none transition-all focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-cyan-500 uppercase text-[10px] tracking-wider font-bold">Signal Content (Message)</label>
                  <textarea 
                    id="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="ENTER_SIGNAL_MESSAGE_TEXT..." 
                    disabled={formState === 'TRANSMITTING'}
                    className="bg-slate-900/60 border border-cyan-900 hover:border-cyan-700/60 focus:border-cyan-400 p-3 rounded-lg text-cyan-100 placeholder-cyan-900 outline-none transition-all resize-none focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={formState === 'TRANSMITTING'}
                  className="mt-2 py-3 bg-cyan-950/30 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold border border-cyan-500/40 hover:border-transparent rounded-lg shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{formState === 'TRANSMITTING' ? 'TRANSMITTING_PACKETS...' : '📡 TRANSMIT SIGNAL'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Console Navigation Utilities */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-900 pt-6 mt-4 gap-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center sm:text-left">
            EXPEDITION_STATUS: COMPLETE // TRENCH_LOG_SHUTDOWN
          </span>

          <div className="flex gap-4 font-mono text-xs w-full sm:w-auto">
            {/* Resume Action */}
            {personal.resumeUrl && (
              <a 
                href={personal.resumeUrl}
                download
                className="flex-1 sm:flex-initial py-2.5 px-5 bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all rounded-lg flex items-center justify-center gap-2 text-cyan-300"
              >
                <FileText className="w-4 h-4" />
                <span>📄 Download Resume</span>
              </a>
            )}
            
            {/* Return to Surface */}
            <button 
              onClick={handleScrollToTop}
              className="flex-1 sm:flex-initial py-2.5 px-5 bg-cyan-950/20 border border-cyan-500/30 hover:border-cyan-400 rounded-lg flex items-center justify-center gap-2 text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all cursor-pointer"
            >
              <ArrowUp className="w-4 h-4 animate-bounce" />
              <span>🌊 Return to Surface</span>
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes vent-plume {
          0% { transform: scaleX(0.8) translateY(0); opacity: 0.1; }
          50% { transform: scaleX(1.3) translateY(-10px); opacity: 0.4; }
          100% { transform: scaleX(0.8) translateY(0); opacity: 0.1; }
        }
        .animate-vent-plume {
          animation: vent-plume 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
