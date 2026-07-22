import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, Twitter } from 'lucide-react';

const ACCENT = '#E63946';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Label({ children }) {
  return (
    <span className="text-[10px] md:text-xs font-black tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

export default function Contact({ data }) {
  const { email, phone } = data.personal;
  const { github, linkedin, twitter } = data.socials;

  const secondaryLinks = [
    { label: 'GitHub', href: github, Icon: Github },
    { label: 'LinkedIn', href: linkedin, Icon: Linkedin },
    { label: 'Twitter', href: twitter, Icon: Twitter },
  ].filter(link => link.href);

  return (
    <section className="text-left">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-3 px-5 md:px-12 py-8 md:py-12 border-b md:border-b-0 md:border-r border-black">
          <Label>07 — Contact</Label>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="md:col-span-9 px-5 md:px-12 py-8 md:py-12"
        >
          <h2
            className="font-black uppercase leading-none tracking-tight text-black mb-8"
            style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
          >
            Let's Work
            <br />
            <span style={{ color: ACCENT }}>Together.</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 px-5 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors duration-200"
              >
                <Mail size={12} />
                {email}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 px-5 py-3 border border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-200"
              >
                <Phone size={12} />
                {phone}
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-5">
            {secondaryLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                <Icon size={11} />
                {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
