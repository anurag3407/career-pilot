import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Send, MessageSquare, Phone, MapPin,
  Github, Linkedin, Twitter, Briefcase, Users, Clock,
  CheckCircle2,
} from 'lucide-react';

export default function Contact({ data }) {
  const { personal, socials, stats } = data;
  const [form, setForm] = useState({ name: '', email: '', budget: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', budget: '', message: '' });
  };

  const budgetOptions = ['< $1,000', '$1,000 – $5,000', '$5,000 – $15,000', '$15,000+', 'Discuss Later'];

  return (
    <>
      {/* ─── CTA BANNER ─── */}
      <section
        id="cta"
        style={{ padding: '80px 0', background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%)', position: 'relative', overflow: 'hidden' }}
      >
        {/* BG Decoration */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
                READY TO BUILD SOMETHING GREAT?
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 900, color: '#fff', marginBottom: 12, lineHeight: 1.2 }}>
                Have a project in mind?
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', maxWidth: 460, lineHeight: 1.6 }}>
                Let's create something amazing together. I'm currently available for freelance projects.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}
            >
              <a
                href="#contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: '#fff', color: '#1E40AF',
                  padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                  textDecoration: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  transition: 'all 0.25s ease',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)'; }}
              >
                <MessageSquare size={18} />
                Get a Free Quote
              </a>

              {/* Mini Stats */}
              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  { icon: <Briefcase size={16} color="rgba(255,255,255,0.8)" />, value: `${stats?.projectsCompleted}+`, label: 'Projects' },
                  { icon: <Users size={16} color="rgba(255,255,255,0.8)" />, value: `${stats?.happyClients}+`, label: 'Clients' },
                  { icon: <Clock size={16} color="rgba(255,255,255,0.8)" />, value: `${stats?.yearsExperience}+`, label: 'Years' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {s.icon}
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section
        id="contact"
        style={{ padding: '96px 0', background: '#F8FAFC' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <div className="fi-section-tag">CONTACT</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', marginBottom: 12 }}>
              Start a <span className="fi-gradient-text">Conversation</span>
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>
              Fill out the form and I'll get back to you within 24 hours with a detailed proposal.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 40, alignItems: 'start' }} className="fi-two-col">
            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 20 }}>
                <img
                  src={personal?.avatar}
                  alt={personal?.name}
                  style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #DBEAFE', marginBottom: 16, display: 'block' }}
                />
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>{personal?.name}</div>
                <div className="fi-status-available" style={{ marginBottom: 20 }}>
                  <span className="fi-dot-green" />
                  Available for Projects
                </div>

                {[
                  { icon: <Mail size={15} color="#2563EB" />, value: socials?.email, label: 'Email' },
                  { icon: <MapPin size={15} color="#2563EB" />, value: personal?.location, label: 'Location' },
                  { icon: <Phone size={15} color="#2563EB" />, value: '$95/hour', label: 'Hourly Rate' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { icon: <Github size={18} />, href: socials?.github, label: 'GitHub' },
                  { icon: <Linkedin size={18} />, href: socials?.linkedin, label: 'LinkedIn' },
                  { icon: <Twitter size={18} />, href: socials?.twitter, label: 'Twitter' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '10px', borderRadius: 10, border: '1px solid #E5E7EB',
                      color: '#64748B', textDecoration: 'none', fontSize: 13, fontWeight: 600,
                      background: '#fff', transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#64748B'; }}
                  >
                    {s.icon}
                    <span style={{ fontSize: 12 }}>{s.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <CheckCircle2 size={48} color="#22C55E" style={{ margin: '0 auto 16px', display: 'block' }} />
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Message Sent!</div>
                    <p style={{ fontSize: 14, color: '#64748B' }}>I'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      {[
                        { id: 'fi-name', label: 'Your Name', key: 'name', type: 'text', placeholder: 'John Doe' },
                        { id: 'fi-email', label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@company.com' },
                      ].map(field => (
                        <div key={field.key}>
                          <label htmlFor={field.id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, letterSpacing: '0.3px' }}>
                            {field.label}
                          </label>
                          <input
                            id={field.id}
                            type={field.type}
                            required
                            placeholder={field.placeholder}
                            value={form[field.key]}
                            onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 14, color: '#0F172A', outline: 'none', transition: 'border-color 0.2s', background: '#F8FAFC' }}
                            onFocus={e => e.target.style.borderColor = '#2563EB'}
                            onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Budget */}
                    <div style={{ marginBottom: 16 }}>
                      <label htmlFor="fi-budget" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Project Budget</label>
                      <select
                        id="fi-budget"
                        value={form.budget}
                        onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 14, color: form.budget ? '#0F172A' : '#94A3B8', outline: 'none', background: '#F8FAFC', cursor: 'pointer' }}
                        onFocus={e => e.target.style.borderColor = '#2563EB'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                      >
                        <option value="">Select budget range...</option>
                        {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    {/* Message */}
                    <div style={{ marginBottom: 24 }}>
                      <label htmlFor="fi-message" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Project Details</label>
                      <textarea
                        id="fi-message"
                        required
                        rows={5}
                        placeholder="Tell me about your project, goals, and timeline..."
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 14, color: '#0F172A', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s', background: '#F8FAFC', fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#2563EB'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                      />
                    </div>

                    <button type="submit" className="fi-btn-primary" style={{ width: '100%', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Send size={16} />
                      Send Message & Get Quote
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#0F172A', padding: '32px 0', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1E40AF, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={14} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Freelancer Invoice</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{personal?.name} · {personal?.location}</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#475569', textAlign: 'center' }}>
            © {new Date().getFullYear()} {personal?.name}. Built with ❤️ using Career Pilot.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { href: socials?.github, icon: <Github size={18} />, label: 'GitHub' },
              { href: socials?.linkedin, icon: <Linkedin size={18} />, label: 'LinkedIn' },
              { href: socials?.twitter, icon: <Twitter size={18} />, label: 'Twitter' },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                style={{ color: '#475569', transition: 'color 0.2s', textDecoration: 'none' }}
                onMouseOver={e => e.currentTarget.style.color = '#2563EB'}
                onMouseOut={e => e.currentTarget.style.color = '#475569'}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
