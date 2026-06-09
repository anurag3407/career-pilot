import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, RadioReceiver, Github, Linkedin, Terminal, ShieldCheck, Activity } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Contact() {
  const [formState, setFormState] = useState('IDLE'); // IDLE, TRANSMITTING, SENT

  const handleTransmit = (e) => {
    e.preventDefault();
    setFormState('TRANSMITTING');
    // Simulate network delay
    setTimeout(() => {
      setFormState('SENT');
      setTimeout(() => setFormState('IDLE'), 3000);
    }, 2000);
  };
  const socials = data?.socials || {};
  const personal = data?.personal || {};
  return (
    <section className="relative w-full min-h-[700px] bg-slate-950 p-6 md:p-12 overflow-hidden font-mono text-cyan-400 select-none border-y border-cyan-900/50">
      
      {/* Deep Space Background Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-20 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Comms Status & Uplink Nodes */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
            <RadioReceiver className="w-8 h-8 text-cyan-300" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-cyan-100">
                Contact
              </h2>
              <div className="text-sm text-cyan-600 mt-1">Open channel — awaiting signal</div>
            </div>
          </div>

          {/* System Environment Readout */}
          <div className="border border-cyan-900/50 bg-cyan-950/20 p-6 relative group">
            {/* Targeting Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50" />

            <div className="flex items-center gap-2 mb-6 border-b border-cyan-900/50 pb-2">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-cyan-300">RECEIVER_STATUS</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-cyan-600 mt-1" />
                <div>
                      <div className="text-[10px] text-cyan-600 tracking-widest">COORDINATES</div>
                      <div className="text-sm text-cyan-200">{personal?.location || 'Unknown'}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-cyan-600 mt-1" />
                <div>
                  <div className="text-[10px] text-cyan-600 tracking-widest">DIRECT_INBOX</div>
                  <div className="text-sm text-cyan-200">{socials?.email || 'not-provided'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* External Network Nodes */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-cyan-600 tracking-widest flex items-center gap-2 mb-2">
              <Terminal className="w-3 h-3" /> EXTERNAL_UPLINKS
            </span>
            
            {/* Social Buttons */}
              <div className="flex gap-4">
                {socials?.github && (
                  <a href={socials.github} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 border border-cyan-800 bg-cyan-950/30 hover:border-cyan-400 hover:bg-cyan-900/50 transition-all duration-300 group">
                    <Github className="w-5 h-5 text-cyan-500 group-hover:text-cyan-200 transition-colors" />
                    <span className="text-xs tracking-widest group-hover:text-cyan-200 transition-colors">GITHUB</span>
                  </a>
                )}
                {socials?.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 border border-cyan-800 bg-cyan-950/30 hover:border-cyan-400 hover:bg-cyan-900/50 transition-all duration-300 group">
                    <Linkedin className="w-5 h-5 text-cyan-500 group-hover:text-cyan-200 transition-colors" />
                    <span className="text-xs tracking-widest group-hover:text-cyan-200 transition-colors">LINKEDIN</span>
                  </a>
                )}
              </div>
          </div>
        </div>

        {/* Right Column: The Transmission Form */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <form 
            onSubmit={handleTransmit}
            className="relative border border-cyan-500/30 bg-cyan-950/10 p-8 shadow-[inset_0_0_30px_rgba(8,145,178,0.05)] backdrop-blur-sm"
          >
            {/* Background scanning line inside form */}
            <motion.div
              className="absolute left-0 w-full h-[1px] bg-cyan-400/20 pointer-events-none z-0"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />

            <div className="relative z-10 flex items-center gap-2 mb-8 text-cyan-400 border-b border-cyan-900/50 pb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs tracking-[0.2em] font-bold">ENCRYPTED_PAYLOAD_FORM</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative z-10">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-cyan-600 tracking-widest">SENDER_ALIAS</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter designation..."
                  className="w-full bg-slate-900/50 border border-cyan-800 p-3 text-sm text-cyan-100 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-cyan-600 tracking-widest">RETURN_FREQUENCY (EMAIL)</label>
                <input 
                  type="email" 
                  required
                  placeholder="Enter comms address..."
                  className="w-full bg-slate-900/50 border border-cyan-800 p-3 text-sm text-cyan-100 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-8 relative z-10">
              <label className="text-[10px] text-cyan-600 tracking-widest">TRANSMISSION_DATA</label>
              <textarea 
                required
                rows="5"
                placeholder="Input payload..."
                className="w-full bg-slate-900/50 border border-cyan-800 p-3 text-sm text-cyan-100 placeholder:text-cyan-800 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all resize-none"
              ></textarea>
            </div>

            {/* Transmit Button */}
            <div className="relative z-10 flex justify-end">
              <button 
                type="submit"
                disabled={formState !== 'IDLE'}
                className="relative overflow-hidden px-8 py-4 bg-cyan-950/80 border border-cyan-400 text-cyan-100 font-bold tracking-widest uppercase hover:text-white transition-all duration-300 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Button Scanning Overlay */}
                <motion.div 
                  className="absolute left-0 top-0 w-2 h-full bg-cyan-300 shadow-[0_0_15px_#67e8f9]"
                  animate={formState === 'TRANSMITTING' ? { x: ['-100%', '1000%'] } : { x: '-100%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />

                <span className="relative z-10 flex items-center gap-3">
                  {formState === 'IDLE' && (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      INITIATE_TRANSMISSION
                    </>
                  )}
                  {formState === 'TRANSMITTING' && (
                    <>
                      <Activity className="w-5 h-5 animate-pulse" />
                      ENCRYPTING_DATA...
                    </>
                  )}
                  {formState === 'SENT' && (
                    <>
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">PAYLOAD_DELIVERED</span>
                    </>
                  )}
                </span>
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}