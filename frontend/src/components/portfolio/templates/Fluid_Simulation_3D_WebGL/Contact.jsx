import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';

export default function Contact({ data }) {
  const personal = data?.personal || {};
  const socials = data?.socials || {};

  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    // Trigger visual blast wave
    const buttonRect = e.target.querySelector('button[type="submit"]').getBoundingClientRect();
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: {
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
        count: 120, // Huge blast!
        color: '#a855f7' // Purple explosion
      }
    }));

    // Trigger visual currents
    window.dispatchEvent(new CustomEvent('fluid-flow', {
      detail: {
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
        dx: 0,
        dy: -12,
        radius: 400,
        strength: 8
      }
    }));

    setSubmitted(true);
    setFormState({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleInputFocus = (e) => {
    // Little puff of current on focus
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: {
        x: e.clientX || window.innerWidth / 2,
        y: e.clientY || window.innerHeight / 2,
        count: 8,
        color: '#06b6d4'
      }
    }));
  };

  return (
    <section id="contact-section" className="relative py-28 px-6 md:px-12 bg-slate-950/20 backdrop-blur-[2px] border-t border-slate-900 overflow-hidden text-white">
      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-500 bg-clip-text text-transparent uppercase tracking-wider"
          >
            Initiate Connection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-sm md:text-base leading-relaxed"
          >
            Send a message into the flow network. Submitting the form releases a high-density velocity wave from the button node.
          </motion.p>
        </div>

        {/* Grid split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Info card */}
          <div className="md:col-span-5 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500" />
            
            <div className="space-y-6 pl-2">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Connection Portal
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Have an inquiry or project proposal? Reach out directly via the form, or use the connection markers below.
              </p>
            </div>

            <div className="space-y-6 pl-2">
              {/* Location */}
              {personal.location && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Location Node</span>
                    <span className="text-slate-200 text-sm font-medium">{personal.location}</span>
                  </div>
                </div>
              )}

              {/* Email */}
              {(socials.email || personal.email) && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Email Address</span>
                    <a 
                      href={`mailto:${socials.email || personal.email}`}
                      className="text-slate-200 text-sm font-medium hover:text-purple-400 transition"
                    >
                      {socials.email || personal.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pl-2 border-t border-slate-800/60 pt-6 font-mono text-[10px] text-slate-500">
              SECURE_HANDSHAKE: ACTIVE
            </div>
          </div>

          {/* Right Column: Message Form */}
          <div className="md:col-span-7 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8"
                >
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shadow-lg shadow-green-500/10">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Flow Packet Dispatched!</h3>
                  <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                    Thank you. Your message has been successfully injected into the stream and is traveling to my terminal.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold">
                        Sender Identity
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onFocus={handleInputFocus}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 transition"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold">
                        Return Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onFocus={handleInputFocus}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 transition"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold">
                        Message Payload
                      </label>
                      <textarea
                        required
                        rows="4"
                        value={formState.message}
                        onFocus={handleInputFocus}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        placeholder="Write your message here..."
                        className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-purple-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 transition resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-sm shadow-lg shadow-purple-500/10"
                  >
                    <span>Dispatch Payload</span>
                    <Send className="w-4 h-4" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
