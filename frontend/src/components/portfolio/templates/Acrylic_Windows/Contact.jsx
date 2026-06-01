import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Send } from 'lucide-react';

const ICONS = { github: Github, linkedin: Linkedin, twitter: Twitter, email: Mail };

export default function Contact({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="grid md:grid-cols-2 gap-8 p-8"
    >
      {/* Socials */}
      <div className="flex flex-col gap-4">
        <h3 className="text-white font-semibold text-lg mb-2">Connect With Me</h3>
        {Object.entries(data.socials).map(([key, url]) => {
          const Icon = ICONS[key];
          if (!Icon || !url) return null;
          const href = key === 'email' ? `mailto:${url}` : url;
          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-[#0078D4]/20 border border-white/10 hover:border-[#0078D4]/40 text-white/70 hover:text-white transition-all"
            >
              <Icon size={18} className="text-[#0078D4]" />
              <span className="text-sm capitalize">{key}</span>
            </a>
          );
        })}
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4">
        <h3 className="text-white font-semibold text-lg mb-2">Send a Message</h3>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:border-[#0078D4] focus:outline-none transition-colors"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:border-[#0078D4] focus:outline-none transition-colors"
        />
        <textarea
          rows={4}
          placeholder="Your Message"
          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:border-[#0078D4] focus:outline-none transition-colors resize-none"
        />
        <button
          onClick={(e) => e.preventDefault()}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0078D4] hover:bg-[#1084D8] rounded-xl font-medium text-sm transition-colors"
        >
          <Send size={15} /> Send Message
        </button>
      </div>
    </motion.div>
  );
}
