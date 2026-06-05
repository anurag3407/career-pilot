import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Twitter, MapPin, SendHorizontal } from 'lucide-react';

const Contact = ({ data = {}, socials = {} }) => {
  const [formStatus, setFormStatus] = useState('idle');
  const sendTimerRef = useRef(null);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (sendTimerRef.current) window.clearTimeout(sendTimerRef.current);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formStatus !== 'idle') return;
    setFormStatus('sending');
    sendTimerRef.current = window.setTimeout(() => {
      setFormStatus('sent');
      resetTimerRef.current = window.setTimeout(() => setFormStatus('idle'), 1400);
    }, 900);
  };

  return (
  <section className="relative py-10 sm:py-12 md:py-24 px-5 md:px-6 border-t border-slate-900 mt-10 md:mt-20 overflow-hidden">
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.9 }}
      className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.12),transparent_55%)]"
    />
    <motion.h2
      initial={{ opacity: 0, y: 24, rotateX: 18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.75 }}
      className="relative text-3xl md:text-4xl font-bold mb-3 md:mb-6 text-center"
      style={{ transformPerspective: 900 }}
    >
      Get In Touch
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.08 }}
      className="relative text-slate-400 mb-6 md:mb-12 text-center max-w-2xl mx-auto"
    >
      Ready to build something ambitious together? Drop a message or connect through any channel below.
    </motion.p>

    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Contact Channels</h3>
        <div className="space-y-4">
          {socials?.email && (
            <a href={`mailto:${socials.email}`} className="flex items-center gap-3 text-slate-300 hover:text-cyan-300 transition-colors">
              <Mail size={18} className="text-cyan-300" />
              <span>{socials.email}</span>
            </a>
          )}
          {data?.location && (
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin size={18} className="text-cyan-300" />
              <span>{data.location}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {socials?.linkedin && (
            <a href={socials.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-200">
              <Linkedin size={16} />
              <span>LinkedIn</span>
            </a>
          )}
          {socials?.github && (
            <a href={socials.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-200">
              <Github size={16} />
              <span>GitHub</span>
            </a>
          )}
          {socials?.twitter && (
            <a href={socials.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-200">
              <Twitter size={16} />
              <span>Twitter</span>
            </a>
          )}
        </div>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.72, delay: 0.05 }}
        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-6 space-y-4"
      >
        <h3 className="text-xl font-semibold">Send a Message</h3>
        <label htmlFor="contact-name" className="block text-sm text-slate-300">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none"
        />
        <label htmlFor="contact-email" className="block text-sm text-slate-300">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          placeholder="Your email"
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none"
        />
        <label htmlFor="contact-message" className="block text-sm text-slate-300">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows="4"
          placeholder="Tell me about your project"
          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none resize-none"
        />

        <button
          type="submit"
          disabled={formStatus !== 'idle'}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition-colors disabled:opacity-70"
        >
          <SendHorizontal size={18} />
          <span>{formStatus === 'idle' ? 'Send Message' : formStatus === 'sending' ? 'Sending...' : 'Sent'}</span>
        </button>
      </motion.form>
    </div>
  </section>
);
};

export default Contact;
