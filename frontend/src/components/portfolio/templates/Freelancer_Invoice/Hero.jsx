import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Menu, X, ArrowRight, Download, Briefcase,
  MapPin, Mail, TrendingUp, Users, Clock, DollarSign,
  ChevronRight,
} from 'lucide-react';

const HOURLY_RATE = 95;
const SERVICES_PREVIEW = [
  { name: 'Web Development', hours: 40, rate: HOURLY_RATE },
  { name: 'UI/UX Design', hours: 20, rate: 75 },
  { name: 'API Integration', hours: 15, rate: HOURLY_RATE },
];

export default function Hero({ data }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { personal, stats, projects } = data;
  const firstProject = projects?.[0] || {};

  // Compute invoice totals
  const invoiceRows = SERVICES_PREVIEW;
  const subtotal = invoiceRows.reduce((acc, row) => acc + row.hours * row.rate, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Project breakdown card
  const projHours = 80;
  const projRate = HOURLY_RATE;
  const projSubtotal = projHours * projRate;
  const projTax = projSubtotal * 0.1;
  const projTotal = projSubtotal + projTax;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* ───── STICKY NAV ───── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(255,255,255,0.95)' : '#fff',
          borderBottom: scrolled ? '1px solid #E5E7EB' : '1px solid transparent',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'linear-gradient(135deg, #1E40AF, #2563EB)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>Freelancer Invoice</div>
                <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500, letterSpacing: '0.5px' }}>Professional Freelancer</div>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="fi-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="fi-nav-link">{link.label}</a>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a
                href="#contact"
                className="fi-btn-primary fi-desktop-nav"
                style={{ padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
              >
                Hire Me
              </a>
              <button type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}
                className="fi-hamburger"
                aria-label="Toggle menu"
              >
                <span className="fi-hamburger-line" style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
                <span className="fi-hamburger-line" style={{ opacity: menuOpen ? 0 : 1 }} />
                <span className="fi-hamburger-line" style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', background: '#fff', borderTop: '1px solid #E5E7EB' }}
            >
              <div style={{ padding: '12px 24px 20px' }}>
                {navLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'block', padding: '10px 0',
                      color: '#374151', textDecoration: 'none',
                      fontSize: 15, fontWeight: 500,
                      borderBottom: '1px solid #F1F5F9',
                    }}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#contact"
                  className="fi-btn-primary"
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 8, marginTop: 16, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                >
                  Hire Me
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          @media (min-width: 769px) { .fi-hamburger { display: none !important; } }
          @media (max-width: 768px) { .fi-desktop-nav { display: none !important; } }
        `}</style>
      </nav>

      {/* ───── HERO SECTION ───── */}
      <section
        id="home"
        style={{
          paddingTop: 96,
          paddingBottom: 80,
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F8FAFC 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Background Shapes */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,64,175,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div
            className="fi-hero-grid"
            style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 0.9fr', gap: 32, alignItems: 'start' }}
          >
            {/* LEFT: Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="fi-status-available" style={{ marginBottom: 20 }}>
                <span className="fi-dot-green" />
                AVAILABLE FOR WORK
              </div>

              <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, lineHeight: 1.1, color: '#0F172A', marginBottom: 20, letterSpacing: '-1.5px' }}>
                I design, develop &{' '}
                <span className="fi-gradient-text">deliver digital products</span>
              </h1>

              <p style={{ fontSize: 16, color: '#64748B', lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
                Freelance Full Stack Developer helping businesses build fast, scalable &amp; modern web applications.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
                <a href="#projects" className="fi-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  View My Work <ArrowRight size={16} />
                </a>
                <a href="#contact" className="fi-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Get a Quote
                </a>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {[
                  { icon: <Clock size={18} color="#2563EB" />, value: `${stats?.yearsExperience || 5}+`, label: 'Years Experience' },
                  { icon: <Briefcase size={18} color="#2563EB" />, value: `${stats?.projectsCompleted || 48}+`, label: 'Projects Done' },
                  { icon: <Users size={18} color="#2563EB" />, value: `${stats?.happyClients || 32}+`, label: 'Happy Clients' },
                  { icon: <DollarSign size={18} color="#2563EB" />, value: `$${HOURLY_RATE}/hr`, label: 'Hourly Rate' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: '#fff', borderRadius: 12,
                      padding: '12px 16px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(37,99,235,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {stat.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>{stat.value}</div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CENTER: Invoice Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fi-animate-float"
            >
              <div className="fi-invoice-paper" style={{ padding: 0 }}>
                {/* Invoice Header */}
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>INVOICE</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>#INV-2024-001</div>
                    </div>
                    <div className="fi-status-available">
                      <span className="fi-dot-green" />
                      AVAILABLE
                    </div>
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>FROM</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{personal?.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{personal?.title?.split(' ')[0]} Developer</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>LOCATION</div>
                      <div style={{ fontSize: 12, color: '#374151', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={11} color="#64748B" />
                        {personal?.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Table */}
                <table className="fi-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Service</th>
                      <th style={{ textAlign: 'center' }}>Hrs</th>
                      <th style={{ textAlign: 'right' }}>Rate</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceRows.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500, color: '#111827' }}>{row.name}</td>
                        <td style={{ textAlign: 'center' }}>{row.hours}h</td>
                        <td style={{ textAlign: 'right' }}>${row.rate}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: '#1E40AF' }}>${(row.hours * row.rate).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Invoice Footer */}
                <div style={{ padding: '14px 24px 20px', background: '#F8FAFC', borderTop: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Subtotal</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>${subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>Tax (10%)</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>${tax.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #E5E7EB' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Total</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#2563EB' }}>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: Project Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #1E40AF, #2563EB)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>Project Invoice</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginTop: 4 }}>{firstProject?.title || 'NeuralDash'}</div>
                </div>

                <div style={{ padding: '16px 20px' }}>
                  {[
                    { label: 'Timeline', value: '6 weeks' },
                    { label: 'Total Hours', value: `${projHours}h` },
                    { label: 'Hourly Rate', value: `$${projRate}/hr` },
                    { label: 'Subtotal', value: `$${projSubtotal.toLocaleString()}` },
                    { label: 'Tax (10%)', value: `$${projTax.toLocaleString()}` },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: 12, color: '#64748B' }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{item.value}</span>
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 8px', marginTop: 4, borderTop: '2px solid #1E40AF' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Project Total</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#2563EB' }}>${projTotal.toLocaleString()}</span>
                  </div>

                  <button type="button" className="fi-btn-primary" style={{ width: '100%', padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
                    <Download size={14} />
                    Download Invoice
                  </button>
                </div>
              </div>

              {/* Personal Info Card */}
              <div style={{ marginTop: 16, background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={personal?.avatar}
                    alt={personal?.name}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #DBEAFE' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{personal?.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Mail size={10} color="#2563EB" />
                      {data.socials?.email}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
