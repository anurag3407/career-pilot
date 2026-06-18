import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Copy, Check, Send } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Command button ─────────────────────────────────────────────── */
function CmdButton({ icon: Icon, label, cmd, href, id, color = 'text-green-400', borderColor = 'border-green-900/50' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(href || label).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <a
      id={id}
      href={href}
      target={href?.startsWith('mailto') ? undefined : '_blank'}
      rel="noreferrer"
      aria-label={label}
      className={`group border ${borderColor} bg-black hover:bg-green-950/20 transition-all block`}
    >
      <div className="px-4 py-3 font-mono">
        {/* cmd line */}
        <div className="text-xs text-green-700 mb-1">
          <span className="text-green-800">$ </span>
          <span className="text-green-600">{cmd}</span>
        </div>

        {/* Icon + label row */}
        <div className="flex items-center gap-2">
          <Icon size={14} className={`${color} shrink-0`} />
          <span className={`text-sm ${color}`}>{label}</span>
          <motion.div
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            whileTap={{ scale: 0.9 }}
          >
            <div className="border border-green-900/50 p-1 cursor-pointer text-green-800 hover:text-green-500">
              {copied
                ? <Check size={10} className="text-green-400" />
                : <Copy size={10} />
              }
            </div>
          </motion.div>
        </div>
      </div>
    </a>
  );
}

/* ─── Contact Section ─────────────────────────────────────────────── */
export default function Contact() {
  const data = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [sent, setSent] = useState(false);

  const contacts = [
    {
      id: 'contact-email',
      icon: Mail,
      label: data.socials.email,
      cmd: `connect --email ${data.socials.email}`,
      href: `mailto:${data.socials.email}`,
      color: 'text-amber-400',
      borderColor: 'border-amber-900/40',
    },
    {
      id: 'contact-github',
      icon: Github,
      label: 'github.com',
      cmd: 'connect --platform github',
      href: data.socials.github,
      color: 'text-white',
      borderColor: 'border-green-900/40',
    },
    {
      id: 'contact-linkedin',
      icon: Linkedin,
      label: 'linkedin.com',
      cmd: 'connect --platform linkedin',
      href: data.socials.linkedin,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-900/40',
    },
    {
      id: 'contact-twitter',
      icon: Twitter,
      label: 'twitter.com',
      cmd: 'connect --platform twitter',
      href: data.socials.twitter,
      color: 'text-sky-400',
      borderColor: 'border-sky-900/40',
    },
  ];

  const fadeUp = (i) => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { delay: i * 0.1, duration: 0.4 },
  });

  return (
    <section
      id="contact"
      ref={ref}
      className="bg-black py-20 px-4 border-t border-green-900/30"
      aria-label="Contact"
    >
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Command header */}
        <motion.div {...fadeUp(0)} className="font-mono">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-700">user@portfolio:~$</span>
            <span className="text-white"> ./connect --user</span>
          </div>
          <div className="text-green-700 text-xs mt-1">
            {'# ── initialising connection protocols ──────────────────────'}
          </div>
        </motion.div>

        {/* Status box */}
        <motion.div
          {...fadeUp(1)}
          className="border border-green-900/40 bg-green-950/10 font-mono text-xs p-4 space-y-1"
        >
          <div className="text-green-700">{'// connection_status.json'}</div>
          <div><span className="text-green-500">&nbsp;&nbsp;"status":</span> <span className="text-white">"AVAILABLE"</span></div>
          <div><span className="text-green-500">&nbsp;&nbsp;"response_time":</span> <span className="text-cyan-400">"&lt; 24h"</span></div>
          <div><span className="text-green-500">&nbsp;&nbsp;"location":</span> <span className="text-white">"{data.personal.location || 'Remote'}"</span></div>
          <div><span className="text-green-500">&nbsp;&nbsp;"open_to":</span> <span className="text-amber-400">["freelance", "full-time", "consulting"]</span></div>
        </motion.div>

        {/* Contact grid */}
        <motion.div {...fadeUp(2)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {contacts.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
            >
              <CmdButton {...c} />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick-message terminal */}
        <motion.div {...fadeUp(4)} className="border border-green-900/40 bg-black">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-950/80 border-b border-green-900/20 font-mono text-xs text-green-800">
            <Send size={10} className="text-green-600" />
            <span>compose_message.sh</span>
          </div>

          <div className="p-4 font-mono text-xs space-y-3">
            <div className="text-green-700">{'# Quick message — opens your mail client'}</div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-600 w-8 shrink-0">To:</span>
                <span className="text-cyan-400">{data.socials.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 w-8 shrink-0">Re:</span>
                <span className="text-green-400/70 italic">Let's collaborate!</span>
              </div>
            </div>

            <div className="pt-2">
              {!sent ? (
                <a
                  id="contact-send"
                  href={`mailto:${data.socials.email}?subject=Let's collaborate!`}
                  onClick={() => setSent(true)}
                  className="inline-flex items-center gap-2 border border-green-700/60 bg-green-950/20 text-green-400 hover:bg-green-900/30 hover:text-green-300 transition-all px-4 py-2"
                  aria-label="Send email"
                >
                  <Send size={12} />
                  <span>$ send --message</span>
                </a>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-green-400"
                >
                  <Check size={12} />
                  <span>Message queued — opening mail client...</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          {...fadeUp(5)}
          className="border-t border-green-900/20 pt-8 font-mono text-xs text-center space-y-2"
        >
          <div className="text-green-900">
            {'# ── EOF ────────────────────────────────────────────────────'}
          </div>
          <div className="text-green-800">
            Built with{' '}
            <span className="text-green-500">{'<Terminal />'}</span>
            {' '}by{' '}
            <span className="text-amber-400">{data.personal.name}</span>
          </div>
          <div className="text-green-900 text-[10px]">
            © {new Date().getFullYear()} — ASCII Art Terminal Portfolio
          </div>
        </motion.div>
      </div>
    </section>
  );
}
