import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Send } from 'lucide-react';

const ICONS = { github: Github, linkedin: Linkedin, twitter: Twitter, email: Mail };

export default function Contact({ data, isMaximized }) {
  const { socials } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto py-12 md:py-20 px-4 md:px-6"
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-white font-semibold text-lg mb-2">Connect With Me</h3>
        {Object.entries(socials ?? {}).map(([key, url]) => {
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

      <div className="flex flex-col justify-center gap-6">
        <div>
          <h2 className={`font-bold text-white ${isMaximized ? 'text-4xl mb-6' : 'text-2xl md:text-3xl mb-4'}`}>
            Let's <span className="text-[#0078D4]">Connect</span>
          </h2>
          <p className={`text-white/60 ${isMaximized ? 'text-base' : 'text-sm'}`}>
            Have a project in mind or just want to say hi? Feel free to reach out.
          </p>
        </div>
        <input
          type="text"
          placeholder="Your Name"
          className={`w-full bg-white/[0.05] border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#0078D4] focus:outline-none transition-all duration-200 ${isMaximized ? 'px-5 py-4 text-base' : 'px-4 py-2.5 text-sm'}`}
        />
        <input
          type="email"
          placeholder="Your Email"
          className={`w-full bg-white/[0.05] border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-[#0078D4] focus:outline-none transition-all duration-200 ${isMaximized ? 'px-5 py-4 text-base' : 'px-4 py-2.5 text-sm'}`}
        />
        <textarea
          rows={4}
          placeholder="Your Message"
          className={`w-full bg-white/[0.05] border border-white/20 rounded-xl text-white placeholder-white/25 focus:border-[#0078D4] focus:outline-none transition-all duration-200 resize-none ${isMaximized ? 'px-5 py-4 text-base' : 'px-4 py-3 text-sm'}`}
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
