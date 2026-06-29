import React, { useState } from 'react';
import { Mail, Send, Terminal } from 'lucide-react';

export default function Contact({ data }) {
  const [formState, setFormState] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('transmitting');
    setTimeout(() => setFormState('success'), 1600);
  };

  return (
    <div className="space-y-12 relative z-10">
      <div className="flex items-center gap-3">
        <Mail className="text-indigo-400 w-6 h-6" />
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Sync_Network_</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Channels are deeply synchronized. Connect your node below to initiate the data transfer protocol.
          </p>
          <div className="space-y-6 font-mono text-sm text-slate-300">
            {data.socials.email && (
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-indigo-500/10 liquid-shape shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:bg-indigo-500/30 transition-colors">
                  <Terminal className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 mb-1">SECURE_EMAIL:</span>
                  <a href={`mailto:${data.socials.email}`} className="text-base hover:text-indigo-400 transition-colors">{data.socials.email}</a>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-cyan-500/10 liquid-shape-fast shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:bg-cyan-500/30 transition-colors">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 mb-1">PHYSICAL_NODE:</span>
                <span className="text-base">{data.personal.location}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative">
          <div className="space-y-2">
            <label htmlFor="node-identifier" className="block text-xs text-slate-500 uppercase tracking-widest font-mono">NODE_IDENTIFIER</label>
            <input id="node-identifier" required type="text" placeholder="NODE_IDENTIFIER" className="w-full bg-slate-900/50 border border-slate-800/80 p-5 text-white font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 liquid-shape" />
          </div>
          <div className="space-y-2">
            <label htmlFor="secure-email-route" className="block text-xs text-slate-500 uppercase tracking-widest font-mono">SECURE_EMAIL_ROUTE</label>
            <input id="secure-email-route" required type="email" placeholder="SECURE_EMAIL_ROUTE" className="w-full bg-slate-900/50 border border-slate-800/80 p-5 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600 liquid-shape-fast" />
          </div>
          <div className="space-y-2">
            <label htmlFor="message-payload-data" className="block text-xs text-slate-500 uppercase tracking-widest font-mono">MESSAGE_PAYLOAD_DATA</label>
            <textarea id="message-payload-data" required rows="4" placeholder="MESSAGE_PAYLOAD_DATA..." className="w-full bg-slate-900/50 border border-slate-800/80 p-5 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder:text-slate-600 liquid-shape"></textarea>
          </div>
          
          <button type="submit" disabled={formState !== 'idle'} className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-black uppercase tracking-widest py-5 px-8 hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-[1.02] disabled:opacity-40 transition-all duration-300 flex items-center justify-center gap-3 liquid-shape relative overflow-hidden">
            {/* Melting inner glow on button hover */}
            <div className="absolute inset-0 bg-white/20 liquid-shape-fast opacity-0 hover:opacity-100 transition-opacity" />
            <Send className="w-5 h-5 relative z-10" /> 
            <span className="relative z-10">{formState === 'idle' ? 'Transmit_Data' : formState === 'transmitting' ? 'Encrypting...' : 'Sync_Established'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}