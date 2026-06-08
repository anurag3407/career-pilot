import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, MapPin, Github, Linkedin, Twitter, Send, ArrowRight } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const F = {
  bg:       '#faf9f7',
  surface:  '#f2efe9',
  dark:     '#0a0a0a',
  charcoal: '#1a1a1a',
  muted:    '#6b6b6b',
  subtle:   '#b0b0b0',
  gold:     '#c9a84c',
  goldLight:'#e8c96e',
  cream:    '#f7f3ed',
  border:   '#e0dbd4',
};

function InputField({ label, type = 'text', value, onChange, multiline }) {
  const [focused, setFocused] = useState(false);
  const props = {
    value, onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className: 'w-full bg-transparent outline-none text-sm resize-none',
    style: { color: F.charcoal, fontFamily: "'Inter', sans-serif" },
  };
  return (
    <div className="pb-4 mb-2" style={{ borderBottom: `1px solid ${focused ? F.gold : F.border}`, transition: 'border-color 0.2s' }}>
      <label className="block text-xs font-black uppercase tracking-widest mb-2"
        style={{ color: focused ? F.gold : F.subtle }}>
        {label}
      </label>
      {multiline
        ? <textarea {...props} rows={4} placeholder={`Your ${label.toLowerCase()}…`} style={{ ...props.style, minHeight: '80px' }} />
        : <input type={type} {...props} placeholder={`Your ${label.toLowerCase()}…`} />
      }
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section ref={sectionRef} style={{ background: F.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="flex items-center justify-between px-5 md:px-16 py-5"
        style={{ borderBottom: `1px solid ${F.border}` }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2" style={{ background: F.gold }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: F.muted }}>Contact</span>
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: F.subtle }}>§ 04</span>
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="grid lg:grid-cols-2">

        {/* Left — info */}
        <div className="px-5 md:px-16 py-10 md:py-14" style={{ borderRight: `1px solid ${F.border}` }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-black tracking-tight mb-2"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: F.charcoal, lineHeight: 1.1 }}>
            Let's
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="font-black tracking-tight mb-8 italic"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1,
              background: `linear-gradient(135deg, ${F.gold}, ${F.goldLight})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
            Connect
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-sm leading-relaxed mb-10 max-w-sm" style={{ color: F.muted }}>
            Available for freelance projects, full-time roles, and exciting collaborations. Let's build something remarkable together.
          </motion.p>

          {/* Contact details */}
          <div className="space-y-5 mb-10">
            {[
              { icon: Mail,    label: 'Email',    value: data.socials.email },
              { icon: MapPin,  label: 'Location', value: data.personal.location },
            ].map(({ icon: Icon, label, value }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="flex items-start gap-4">
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                  style={{ background: F.dark, color: F.gold }}>
                  <Icon size={14} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: F.subtle }}>{label}</p>
                  <p className="text-sm font-semibold" style={{ color: F.charcoal }}>{value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social links */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: F.charcoal }}>Follow</p>
            <div className="flex gap-2">
              {[
                { icon: Github,   href: data.socials.github,   label: 'GH' },
                { icon: Linkedin, href: data.socials.linkedin, label: 'LI' },
                { icon: Twitter,  href: data.socials.twitter,  label: 'TW' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ background: F.charcoal, color: F.gold }}
                  transition={{ duration: 0.18 }}
                  className="w-10 h-10 flex items-center justify-center text-xs"
                  style={{ border: `1px solid ${F.border}`, color: F.muted }}>
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="px-5 md:px-16 py-10 md:py-14">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center mb-6"
                style={{ background: F.dark, color: F.gold }}>
                <Send size={24} />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-3" style={{ color: F.charcoal }}>
                Message Sent
              </h3>
              <p className="text-sm" style={{ color: F.muted }}>
                Thank you for reaching out. I'll be in touch shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <motion.p
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="text-xs font-black uppercase tracking-widest mb-8" style={{ color: F.gold }}>
                — Send a message
              </motion.p>

              <InputField label="Name"    value={form.name}    onChange={set('name')} />
              <InputField label="Email"   type="email" value={form.email}   onChange={set('email')} />
              <InputField label="Subject" value={form.subject} onChange={set('subject')} />
              <InputField label="Message" value={form.message} onChange={set('message')} multiline />

              <motion.button
                type="submit"
                whileHover={{ backgroundColor: F.charcoal }}
                transition={{ duration: 0.2 }}
                className="mt-8 w-full flex items-center justify-between px-8 py-4 text-sm font-black uppercase tracking-widest"
                style={{ background: F.dark, color: '#fff' }}>
                <span>Send Message</span>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <ArrowRight size={16} style={{ color: F.gold }} />
                </motion.div>
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
