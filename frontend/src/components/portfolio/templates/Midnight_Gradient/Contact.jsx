import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Send } from 'lucide-react';

const GlowingCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className={`relative group rounded-2xl border border-indigo-500/10 hover:border-cyan-400/40 bg-[#0a0d24]/60 backdrop-blur-md hover:shadow-[0_0_35px_rgba(34,211,238,0.12)] transition-all duration-300 ${className}`}
  >
    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-cyan-500/5 group-hover:to-purple-500/5 blur-xl transition-all duration-500" />
    {children}
  </motion.div>
);

export default function Contact({ data }) {
  return (
    <section className="relative px-6 py-24 text-left">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 justify-center">
            <Phone size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">Let's Connect</h2>
          <p className="text-gray-400 text-sm mt-3 leading-relaxed text-center">
            Have an exciting role, project, or general inquiry? Feel free to reach out and let's construct something awesome!
          </p>
        </div>

        {/* Contact form in glass container */}
        <GlowingCard className="p-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="user-name" className="sr-only">Full Name</label>
                <input
                  id="user-name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/40 border border-indigo-500/15 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                />
              </div>
              <div>
                <label htmlFor="user-email" className="sr-only">Email Address</label>
                <input
                  id="user-email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/40 border border-indigo-500/15 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message-subject" className="sr-only">Subject</label>
              <input
                id="message-subject"
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 rounded-xl bg-gray-950/40 border border-indigo-500/15 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-500 outline-none transition-all duration-300 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              />
            </div>

            <div>
              <label htmlFor="user-message" className="sr-only">Your Message</label>
              <textarea
                id="user-message"
                rows={5}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-xl bg-gray-950/40 border border-indigo-500/15 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 text-white placeholder-gray-500 outline-none transition-all duration-300 resize-none focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wider shadow-[0_4px_25px_rgba(6,182,212,0.25)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={16} /> Send Message
            </button>
          </form>
        </GlowingCard>

        {/* Footer info & Copyright */}
        <div className="mt-16 text-center text-gray-500 text-xs border-t border-indigo-950/40 pt-8">
          <p className="tracking-wide">
            © {new Date().getFullYear()} {data.personal.name}.
          </p>
        </div>
      </div>
    </section>
  );
}
