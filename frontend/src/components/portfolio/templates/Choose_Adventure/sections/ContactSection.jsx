import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle, RotateCcw } from 'lucide-react';

const SOCIAL_ICONS = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

export default function ContactSection({ data, onReset }) {
  const { personal, socials } = data;
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const submitForm = async () => {
    // Replace with actual API integration when a backend contact endpoint is available.
    return new Promise((resolve) => setTimeout(resolve, 700));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmissionError('');
    setIsSubmitting(true);

    try {
      await submitForm();
      setSubmitted(true);
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmissionError('Something went wrong. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-[#0f0e17] flex flex-col items-center justify-center px-4 py-16 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.p
          className="text-xs text-amber-400 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Final Chapter — The Meeting
        </motion.p>

        <motion.div
          className="border border-violet-800/50 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur p-8 mb-6 shadow-xl shadow-violet-950/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {!submitted ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-violet-400" />
                <h2 className="text-xl font-bold text-white">Start a Conversation</h2>
              </div>
              <p className="text-sm text-slate-400 mb-7">
                Every great collaboration begins with a single message. Let's write the next chapter together.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {submissionError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {submissionError}
                  </div>
                )}
                <div>
                  <label htmlFor="ca-name" className="block text-xs text-violet-400 mb-1.5 uppercase tracking-wider">Your Name</label>
                  <input
                    id="ca-name"
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="e.g. Jane Smith"
                    className={`w-full bg-[#0f0e17] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors ${errors.name ? 'border-red-500' : 'border-violet-800/50'}`}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="ca-email" className="block text-xs text-violet-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input
                    id="ca-email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="you@example.com"
                    className={`w-full bg-[#0f0e17] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors ${errors.email ? 'border-red-500' : 'border-violet-800/50'}`}
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="ca-message" className="block text-xs text-violet-400 mb-1.5 uppercase tracking-wider">Message</label>
                  <textarea
                    id="ca-message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange('message')}
                    placeholder="Tell me about your project..."
                    className={`w-full bg-[#0f0e17] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-violet-800/50'}`}
                  />
                  {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-violet-900/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? <RotateCcw size={14} className="animate-spin" /> : <Send size={14} />}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-slate-400 text-sm mb-6">
                Thanks, {form.name}. The adventure continues — I'll be in touch soon.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
                className="text-xs text-violet-400 hover:text-violet-200 transition-colors flex items-center gap-1 mx-auto"
              >
                <RotateCcw size={11} />
                Send another message
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="border border-violet-800/50 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur p-6 mb-6 shadow-xl shadow-violet-950/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-xs text-violet-400 uppercase tracking-wider mb-4">Find me online</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(socials).filter(([, url]) => url).map(([platform, url]) => {
              const Icon = SOCIAL_ICONS[platform];
              if (!Icon) return null;
              const isSafeUrl = platform === 'email'
                ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)
                : /^https?:\/\//i.test(url);
              if (!isSafeUrl) return null;
              const href = platform === 'email' ? `mailto:${url}` : url;
              return (
                <a
                  key={platform}
                  href={href}
                  target={platform !== 'email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-violet-800/40 hover:border-violet-500/60 bg-violet-950/30 hover:bg-violet-900/40 text-violet-300 hover:text-white transition-all text-xs"
                >
                  <Icon size={13} />
                  <span className="capitalize">{platform}</span>
                </a>
              );
            })}
          </div>
        </motion.div>

        <motion.button
          onClick={onReset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RotateCcw size={11} />
          Restart the adventure
        </motion.button>
      </div>
    </div>
  );
}
