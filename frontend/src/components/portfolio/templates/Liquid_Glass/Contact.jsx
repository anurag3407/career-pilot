import React from "react";
import { motion } from "framer-motion";
import { Phone, Github, Linkedin, Twitter, Mail } from "lucide-react";

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${className}`}
  >
    {children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Contact({ data }) {
  return (
    <section className="relative px-6 py-20 text-center">
      <div className="absolute top-0 left-1/2 w-72 h-72 rounded-full bg-purple-500/20 blur-[100px] pointer-events-none" />
      <motion.div
        className="max-w-3xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
          <Phone size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Get In Touch</h2>
        </motion.div>
        <motion.p variants={fadeUp} className="text-white/60 mb-10">
          Have a project in mind? Let's build something amazing together.
        </motion.p>

        <motion.div variants={fadeUp}>
          <GlassCard className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="contact-name" className="sr-only">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/60 backdrop-blur-sm transition-all"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">Your Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/60 backdrop-blur-sm transition-all"
                />
              </div>
            </div>
            <label htmlFor="contact-subject" className="sr-only">Subject</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/60 backdrop-blur-sm transition-all mb-4"
            />
            <label htmlFor="contact-message" className="sr-only">Your Message</label>
            <textarea
              id="contact-message"
              rows={4}
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/60 backdrop-blur-sm transition-all mb-4 resize-none"
            />
            <button type="button" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500/40 to-purple-500/40 hover:from-cyan-500/60 hover:to-purple-500/60 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all">
              Send Message
            </button>
          </GlassCard>
        </motion.div>

        {/* Social footer */}
        <motion.div variants={fadeUp} className="flex justify-center gap-4 mt-8">
          {[
            { icon: <Github size={18} />, href: data.socials.github, label: "GitHub" },
            { icon: <Linkedin size={18} />, href: data.socials.linkedin, label: "LinkedIn" },
            { icon: <Twitter size={18} />, href: data.socials.twitter, label: "Twitter" },
            { icon: <Mail size={18} />, href: `mailto:${data.socials.email}`, label: "Email" },
          ].filter(s => s.href).map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/60 hover:text-white transition-all"
            >
              {icon}
            </a>
          ))}
        </motion.div>

        <p className="text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} {data.personal.name}. All rights reserved.
        </p>
      </motion.div>
    </section>
  );
}
