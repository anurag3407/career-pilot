import React, { useState } from 'react';
import { Mail, Terminal, Send } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { GlitchText, SectionWrapper } from './shared';

export default function Contact() {
  const [formStatus, setFormStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
      // This is a visual-only demo submission, so it just transitions states locally.
    setFormStatus('sending');
    setTimeout(() => setFormStatus('sent'), 1500);
  };

  return (
    <SectionWrapper id="contact">
      {/* The contact section keeps the terminal look with mail and location details. */}
      <div className="flex items-center gap-4 mb-12">
        <Mail className="text-cyan-400 animate-pulse" />
        <GlitchText text="Initiate_Link" as="h2" className="text-4xl font-bold text-white" />
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-zinc-400 font-mono mb-8">Transmission channels are open. Whether you have a secure contract or just want to establish a ping, deploy a message below.</p>
          <div className="space-y-4">
            {data.socials.email && (
              <a href={`mailto:${data.socials.email}`} className="flex items-center gap-4 text-zinc-300 hover:text-cyan-400 font-mono transition-colors group w-fit">
                <div className="p-2 border border-zinc-800 bg-zinc-900 group-hover:border-cyan-500 transition-colors"><Mail className="w-5 h-5 group-hover:animate-pulse" /></div>
                <span className="vibrate-hover cursor-crosshair">{data.socials.email}</span>
              </a>
            )}
            <div className="flex items-center gap-4 text-zinc-300 font-mono group w-fit">
              <div className="p-2 border border-zinc-800 bg-zinc-900 group-hover:border-fuchsia-500 transition-colors"><Terminal className="w-5 h-5 group-hover:animate-pulse" /></div>
              <span className="vibrate-hover cursor-crosshair">{data.personal.location}</span>
            </div>
          </div>
        </div>
        {/* Inputs are styled as a transmission form to match the template theme. */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="YOUR_NAME" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600" />
          <input type="email" required placeholder="YOUR_EMAIL" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white font-mono focus:outline-none focus:border-fuchsia-500 transition-colors placeholder:text-zinc-600" />
          <textarea required rows="4" placeholder="TRANSMISSION_DATA..." className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors resize-none placeholder:text-zinc-600"></textarea>
          <button type="submit" disabled={formStatus !== 'idle'} className="w-full bg-zinc-100 text-zinc-950 font-bold uppercase tracking-widest py-4 px-8 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 group relative overflow-hidden">
            <div className="absolute inset-0 bg-white mix-blend-difference opacity-0 group-hover:opacity-100 group-hover:animate-[violent-jitter_0.2s_infinite] pointer-events-none" />
            <span className="relative z-10 flex items-center gap-2">{formStatus === 'idle' ? <><Send className="w-5 h-5" /> Transmit</> : formStatus === 'sending' ? 'Encrypting...' : 'Transmission Sent'}</span>
          </button>
        </form>
      </div>
    </SectionWrapper>
  );
}
