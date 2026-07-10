import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, Github, Linkedin, Twitter, Mail, Globe, Copy, Check, Send } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Remote entry row ────────────────────────────────────────── */
function RemoteRow({ name, url, type, icon: Icon, color, delay, inView }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(url || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 font-mono text-sm group px-4 py-3 hover:bg-[#1C2128] transition-colors rounded-md"
    >
      <Icon size={14} style={{ color }} className="shrink-0" />
      <span className="text-[#8B949E] w-20 shrink-0">{name}</span>
      <span className="text-[#8B949E] w-14 shrink-0 text-xs">{type}</span>
      <span className="text-[#58A6FF] flex-1 truncate hover:text-[#79C0FF] transition-colors">
        <a href={url} target="_blank" rel="noreferrer" aria-label={`Open ${name}`}>
          {url}
        </a>
      </span>
      <button type="button"
        onClick={handleCopy}
        aria-label={`Copy ${name} URL`}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-[#8B949E] hover:text-white"
      >
        {copied ? <Check size={12} className="text-[#3FB950]" /> : <Copy size={12} />}
      </button>
    </motion.div>
  );
}

/* ─── Contact / git remote Section ───────────────────────────── */
export default function Contact() {
  const { portfolioData } = usePortfolio();
  const { personal, socials } = portfolioData;
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const remotes = [
    { name: 'github',   url: socials.github,            type: '(fetch)',  icon: Github,   color: '#8B949E' },
    { name: 'github',   url: socials.github,            type: '(push)',   icon: Github,   color: '#8B949E' },
    { name: 'linkedin', url: socials.linkedin,          type: '(fetch)',  icon: Linkedin, color: '#58A6FF' },
    { name: 'linkedin', url: socials.linkedin,          type: '(push)',   icon: Linkedin, color: '#58A6FF' },
    { name: 'email',    url: `mailto:${socials.email}`, type: '(send)',   icon: Mail,     color: '#3FB950' },
    { name: 'twitter',  url: socials.twitter,           type: '(follow)', icon: Twitter,  color: '#58A6FF' },
  ].filter(r => r.url && r.url !== 'mailto:undefined');

  const handleSubmit = e => {
    e.preventDefault();
    // In production this would POST to a backend / email service
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="bg-[#0D1117] py-24 px-4 border-t border-[#30363D]"
      aria-label="Contact"
    >
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
            <Terminal size={20} className="text-[#3FB950]" />
            <h2 className="text-white font-semibold text-xl">
              <span className="text-[#8B949E] font-mono">$ </span>
              git remote -v
            </h2>
          </div>
          <p className="text-[#8B949E] font-mono text-sm pl-9">
            # Remote connections — push to get in touch
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Remote list terminal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden"
          >
            {/* Terminal toolbar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1117] border-b border-[#30363D]">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 font-mono text-xs text-[#8B949E]">terminal — git remote -v</span>
            </div>

            {/* Prompt */}
            <div className="px-4 py-3 font-mono text-sm border-b border-[#30363D]">
              <span className="text-[#3FB950]">~/{personal.name?.toLowerCase().replace(/\s+/g, '-')}</span>
              <span className="text-[#8B949E]"> $ </span>
              <span className="text-white">git remote -v</span>
            </div>

            {/* Remotes */}
            <div className="py-2">
              {remotes.map((r, i) => (
                <RemoteRow key={`${r.name}-${r.type}`} {...r} delay={0.2 + i * 0.06} inView={inView} />
              ))}
            </div>

            {/* Cursor prompt */}
            <div className="px-4 py-3 border-t border-[#30363D] font-mono text-sm flex items-center gap-2">
              <span className="text-[#3FB950]">~/{personal.name?.toLowerCase().replace(/\s+/g, '-')}</span>
              <span className="text-[#8B949E]">$</span>
              <span
                className="inline-block w-2 h-4 bg-[#3FB950] ml-0.5 align-middle"
                style={{ animation: 'gitCursorBlink 1s step-end infinite' }}
                aria-hidden="true"
              />
            </div>
          </motion.div>

          {/* Contact form — styled as a git commit message editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden"
          >
            {/* Form header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1117] border-b border-[#30363D]">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 font-mono text-xs text-[#8B949E]">COMMIT_EDITMSG — git commit</span>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 p-12 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#3FB950]/20 border border-[#3FB950]/40 flex items-center justify-center">
                  <Check size={24} className="text-[#3FB950]" />
                </div>
                <div className="text-white font-semibold text-lg font-mono">Commit pushed!</div>
                <div className="text-[#8B949E] text-sm font-mono">
                  feat: message sent to {personal.name?.split(' ')[0]}
                </div>
                <div className="text-[#3FB950] text-xs font-mono">
                  [main abc1234] Your message was received ✓
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="font-mono text-xs text-[#8B949E] border-b border-[#30363D] pb-3">
                  # Please enter your message. Lines starting with '#' are ignored.
                  <br /># On branch main — sending message to: {personal.name}
                </div>

                {[
                  { id: 'contact-name',    label: 'name',    type: 'text',  placeholder: 'Your full name',        key: 'name'    },
                  { id: 'contact-email',   label: 'email',   type: 'email', placeholder: 'your@email.com',        key: 'email'   },
                ].map(field => (
                  <div key={field.key} className="space-y-1">
                    <label htmlFor={field.id} className="font-mono text-xs text-[#3FB950]">
                      # {field.label}:
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      required
                      placeholder={field.placeholder}
                      value={formState[field.key]}
                      onChange={e => setFormState(s => ({ ...s, [field.key]: e.target.value }))}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm font-mono text-white placeholder-[#484F58] focus:outline-none focus:border-[#58A6FF] transition-colors"
                    />
                  </div>
                ))}

                <div className="space-y-1">
                  <label htmlFor="contact-message" className="font-mono text-xs text-[#3FB950]">
                    # commit message:
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Write your commit message here..."
                    value={formState.message}
                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-md px-3 py-2 text-sm font-mono text-white placeholder-[#484F58] focus:outline-none focus:border-[#58A6FF] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full flex items-center justify-center gap-2 bg-[#238636] hover:bg-[#2EA043] border border-[#3FB950]/40 text-white rounded-md px-4 py-2.5 text-sm font-medium font-mono transition-all"
                >
                  <Send size={14} />
                  git commit -m "message"
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Inline keyframe for cursor blink */}
      <style>{`
        @keyframes gitCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
