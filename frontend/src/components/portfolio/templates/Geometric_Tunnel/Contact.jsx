import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Code2 } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import SectionHeading from './SectionHeading';

const SEC = "relative z-10 py-24 px-4";

export default function Contact() {
  const { personal } = data;
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className={SEC}>
      <div className="max-w-xl mx-auto">
        <SectionHeading>Contact</SectionHeading>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {[
              { label: "Your Name",  type: "text",  placeholder: "e.g. tommy"       },
              { label: "Your Email", type: "email", placeholder: "tommy@example.com"     },
            ].map(({ label, type, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">{label}</label>
                <input type={type} required placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Message</label>
              <textarea rows={4} required placeholder="Your message..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-colors resize-none"
              />
            </div>
            <button type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all duration-300"
            >
              Send Message <Send size={16} />
            </button>
          </form>

          <AnimatePresence>
            {submitted && (
              <motion.div
                className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <CheckCircle size={44} className="text-emerald-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">Message Sent!</h3>
                <p className="text-sm text-slate-400">Expect a reply shortly.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center mt-12 text-xs font-mono text-slate-600 flex items-center justify-center gap-2">
          <Code2 size={11} className="text-indigo-500/40" />
          {personal?.name} · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}