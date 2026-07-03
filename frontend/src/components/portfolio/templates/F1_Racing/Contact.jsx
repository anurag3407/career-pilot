import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle, Car, AlertCircle, FileText } from 'lucide-react';

export default function Contact({ data }) {
  const personal = data?.personalInfo || data?.personal;
  const socials = data?.socials;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('transmitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative py-20 bg-[#121216] border-b border-neutral-900 text-white overflow-hidden selection:bg-[#E10600] selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-[#E10600]/50 to-transparent" />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col items-center mb-16 text-center space-y-4">
          <div className="inline-flex items-center bg-neutral-900/80 backdrop-blur-sm border-l-4 border-white px-3 py-1.5 text-xs font-mono text-neutral-300 gap-2 uppercase tracking-widest">
            <Car className="w-4 h-4 text-white" />
            <span>Pit Lane Entry</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase italic transform -skew-x-12">
            <span className="block text-white">CONTRACT</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
              NEGOTIATIONS
            </span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-[#070709]/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Top caution tape design */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[linear-gradient(45deg,#E10600_25%,#000_25%,#000_50%,#E10600_50%,#E10600_75%,#000_75%,#000_100%)] bg-[size:20px_20px]" />
            
            <div className="flex items-center gap-3 mb-8">
              <Mail className="w-6 h-6 text-[#E10600]" />
              <h3 className="text-xl font-bold font-mono tracking-tight text-white uppercase">
                Send Transmission
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex justify-between">
                    <span>Driver / Team Name</span>
                    <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600] transition-colors font-mono placeholder:text-neutral-600"
                    placeholder="E.g. Toto Wolff"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex justify-between">
                    <span>Secure Comms Channel (Email)</span>
                    <span className="text-[#E10600]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600] transition-colors font-mono placeholder:text-neutral-600"
                    placeholder="team@mercedesamgf1.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex justify-between">
                  <span>Strategy / Proposal Details</span>
                  <span className="text-[#E10600]">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600] transition-colors font-sans placeholder:text-neutral-600 resize-none"
                  placeholder="We need a developer who can perform under pressure..."
                />
              </div>

              <button
                type="submit"
                disabled={status !== 'idle'}
                className="w-full relative group overflow-hidden bg-[#E10600] text-white px-8 py-4 font-mono font-extrabold uppercase tracking-widest text-sm rounded-none border border-[#E10600] transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 transform -skew-x-12 flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#fff_75%),linear-gradient(-45deg,transparent_75%,#fff_75%)] bg-[size:8px_8px] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2 transform skew-x-12">
                  {status === 'idle' && (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>SIGN CONTRACT</span>
                      <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  {status === 'transmitting' && (
                    <>
                      <AlertCircle className="w-4 h-4 animate-pulse" />
                      <span>TRANSMITTING DATA...</span>
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>TRANSMISSION RECEIVED</span>
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
          
          {/* Quick contact / personal info below form */}
          {personal && personal.email && (
            <div className="mt-8 text-center">
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                DIRECT RADIO FREQUENCY
              </p>
              <a href={`mailto:${personal.email}`} className="text-white hover:text-[#E10600] font-mono tracking-widest transition-colors">
                {personal.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
