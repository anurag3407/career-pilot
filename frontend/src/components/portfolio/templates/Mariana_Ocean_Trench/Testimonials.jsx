import React from 'react';
import { motion } from 'framer-motion';
import { Radio, MessageSquare, Terminal, RefreshCw } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section 
      id="testimonials-zone"
      className="relative w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-[#000105] via-[#00040c] to-[#000814] p-6 md:p-12 text-white overflow-hidden select-none"
    >
      {/* Testimonials background: digital streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-15">
        <div className="absolute top-10 left-[10%] w-[80%] h-0.5 bg-cyan-500/30 animate-pulse" />
        <div className="absolute bottom-20 left-[15%] w-[70%] h-0.5 bg-blue-500/20 animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Glowing floating bubbles */}
        <div className="absolute bottom-10 right-20 w-3 h-3 bg-cyan-400/40 rounded-full animate-bubble-rise" />
        <div className="absolute top-40 left-32 w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-bubble-rise" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col gap-8 md:gap-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
          <Radio className="w-8 h-8 text-cyan-400 animate-pulse" />
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider font-mono">
              05 // INCOMING_SIGNALS: ACOUSTIC_LOGS
            </h2>
            <p className="text-xs text-cyan-400/80 font-mono mt-1">Status: Decrypting acoustic signals | Encryption: RSA_4096_SECURE</p>
          </div>
        </div>

        {/* Testimonials Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-6 relative flex flex-col justify-between shadow-[0_0_25px_rgba(6,182,212,0.08)] group"
            >
              {/* Waveform graphic overlay in card */}
              <div className="absolute bottom-3 right-4 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none">
                <svg className="w-24 h-12 text-cyan-400" viewBox="0 0 100 40">
                  <path d="M0,20 Q10,5 20,20 T40,20 T60,20 T80,20 T100,20" fill="none" stroke="currentColor" strokeWidth="2" className="animate-wave-line" />
                </svg>
              </div>

              {/* Encryption Status tag */}
              <div className="flex justify-between items-center text-[9px] font-mono text-cyan-500/60 mb-4 uppercase tracking-widest border-b border-slate-900 pb-2">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400 animate-pulse" />
                  Signal Stream _0{idx + 1}
                </span>
                <span className="text-emerald-400 font-bold animate-pulse">DECRYPTED</span>
              </div>

              {/* Message quote */}
              <div className="relative mb-6">
                <MessageSquare className="absolute -top-1 -left-2 w-8 h-8 text-cyan-500/10 pointer-events-none" />
                <p className="text-sm md:text-base leading-relaxed text-cyan-100/90 italic pl-5 font-sans relative z-10">
                  "{t.content}"
                </p>
              </div>

              {/* Author / Metadata */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-900 font-mono">
                {/* Sonar Pulse Indicator */}
                <div className="relative w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-950/20">
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                  <div className="absolute inset-0 rounded-full border border-cyan-400/25 animate-ping" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-sky-100">{t.author}</h4>
                  <p className="text-[10px] text-cyan-500 tracking-wider uppercase mt-0.5">{t.role || "Expedition Consultant"}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
