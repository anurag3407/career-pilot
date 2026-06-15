import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Palette, Server, Smartphone,
  CheckCircle2, ArrowRight,
} from 'lucide-react';

const SERVICES = [
  {
    icon: <Code2 size={28} color="#2563EB" />,
    title: 'Web Development',
    desc: 'Building high-performance, scalable web applications with modern frameworks and best practices.',
    rate: 95,
    features: ['React / Next.js', 'TypeScript', 'REST & GraphQL', 'Performance Optimization'],
  },
  {
    icon: <Palette size={28} color="#7C3AED" />,
    title: 'UI/UX Design',
    desc: 'Crafting pixel-perfect interfaces that delight users and drive conversions.',
    rate: 75,
    features: ['Figma Design', 'Design Systems', 'Responsive Layouts', 'User Research'],
    accent: '#7C3AED',
    accentLight: 'rgba(124,58,237,0.08)',
  },
  {
    icon: <Server size={28} color="#059669" />,
    title: 'Backend Development',
    desc: 'Architecting robust APIs, databases and cloud infrastructure for enterprise scale.',
    rate: 95,
    features: ['Node.js / Express', 'PostgreSQL & MongoDB', 'AWS / Docker', 'Microservices'],
    accent: '#059669',
    accentLight: 'rgba(5,150,105,0.08)',
  },
  {
    icon: <Smartphone size={28} color="#D97706" />,
    title: 'Mobile Development',
    desc: 'Cross-platform mobile apps that feel native on iOS and Android.',
    rate: 90,
    features: ['React Native', 'Expo', 'Push Notifications', 'App Store Deployment'],
    accent: '#D97706',
    accentLight: 'rgba(217,119,6,0.08)',
  },
];

export default function Services({ data }) {
  const { skills } = data;

  return (
    <section id="services" style={{ padding: '96px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div className="fi-section-tag">MY SERVICES</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', marginBottom: 16 }}>
            What I <span className="fi-gradient-text">Offer</span>
          </h2>
          <p style={{ fontSize: 17, color: '#64748B', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            End-to-end digital solutions tailored to your business needs. Quality work, transparent pricing.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {SERVICES.map((service, i) => {
            const accent = service.accent || '#2563EB';
            const accentLight = service.accentLight || 'rgba(37,99,235,0.08)';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="fi-card"
                style={{ padding: '28px 24px', position: 'relative', overflow: 'hidden' }}
              >
                {/* Top Accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, ${accent}80)`, borderRadius: '16px 16px 0 0' }} />

                {/* Icon */}
                <div style={{ width: 56, height: 56, borderRadius: 14, background: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  {service.icon}
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>{service.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 18 }}>{service.desc}</p>

                {/* Price Badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: accentLight, padding: '4px 12px', borderRadius: 20, marginBottom: 20 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: accent }}>${service.rate}</span>
                  <span style={{ fontSize: 12, color: accent, fontWeight: 500 }}>/hour</span>
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {service.features.map((f, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                      <CheckCircle2 size={14} color={accent} style={{ flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 13, fontWeight: 700, color: accent, textDecoration: 'none',
                    transition: 'gap 0.2s ease',
                  }}
                >
                  Get Started <ArrowRight size={14} />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
